import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDirectory = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path:resolve(serverDirectory, '.env') });

const app = express();
const port = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET;
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const shippingFee = 20;
const uploadsDirectory = resolve(serverDirectory, 'uploads');
const apiPublicUrl = (process.env.API_PUBLIC_URL || `http://localhost:${port}`).replace(/\/$/, '');
mkdirSync(uploadsDirectory, { recursive:true });

const imageExtensions = { 'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp' };
const imageUpload = multer({
  storage:multer.diskStorage({
    destination:(_req, _file, callback) => callback(null, uploadsDirectory),
    filename:(_req, file, callback) => callback(null, `${randomUUID()}.${imageExtensions[file.mimetype] || 'bin'}`),
  }),
  limits:{ fileSize:5 * 1024 * 1024, files:1 },
  fileFilter:(_req, file, callback) => imageExtensions[file.mimetype]
    ? callback(null, true)
    : callback(Object.assign(new Error('Upload a JPG, PNG, or WebP image.'), { status:400 })),
});

app.use(cors({ origin: frontendOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(uploadsDirectory, { maxAge:'1d', fallthrough:false }));

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, index: true, trim: true },
  sku: { type:String, trim:true, uppercase:true, sparse:true, unique:true, maxlength:64 },
  barcode: { type:String, trim:true, maxlength:64 },
  brand: { type:String, trim:true, maxlength:120 },
  productType: { type:String, trim:true, maxlength:120 },
  description: { type: String, default: '', maxlength: 5000 },
  features: { type:[String], default:[] },
  images: { type:[String], default:[] },
  attributes: [{ name:{ type:String, trim:true, maxlength:80 }, value:{ type:String, trim:true, maxlength:300 } }],
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, default: null, min: 0 },
  image: { type: String, default: '' },
  imageHasBorder: { type: Boolean, default: false },
  categories: { type: [String], default: [] },
  tags: { type:[String], default:[] },
  ageRange: { type:String, trim:true, maxlength:80 },
  material: { type:String, trim:true, maxlength:160 },
  dimensions: { type:String, trim:true, maxlength:120 },
  weight: { type:String, trim:true, maxlength:80 },
  includedItems: { type:[String], default:[] },
  safetyInformation: { type:String, default:'', maxlength:1000 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type:Number, default:0, min:0 },
  stock: { type: Number, default: 0, min: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  phone: { type: String, default: '' },
  address: { type: mongoose.Schema.Types.Mixed, default: {} },
  billingAddress: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerDetails: {
    firstName: { type:String, required:true, trim:true },
    lastName: { type:String, required:true, trim:true },
    email: { type:String, required:true, trim:true, lowercase:true },
    phone: { type:String, required:true, trim:true },
  },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, title: { type:String, required:true }, image: { type:String, default:'' }, price: { type:Number, required:true, min:0 }, quantity: { type:Number, required:true, min:1 } }],
  shippingAddress: { type: mongoose.Schema.Types.Mixed, default: {} },
  orderNotes: { type:String, default:'', maxlength:1000 },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card', 'paypal', 'cod'], default: 'card' },
  paymentStatus: { type:String, enum:['Pending', 'Paid', 'Failed', 'Refunded'], default:'Pending' },
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Order = mongoose.model('Order', orderSchema);

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
function makeToken(payload) { return jwt.sign(payload, jwtSecret, { expiresIn: payload.role === 'admin' ? '8h' : '7d' }); }
function authenticate(req, res, next) {
  const bearer = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : '';
  try {
    if (!bearer) return res.status(401).json({ error: 'Please log in to continue.' });
    req.auth = jwt.verify(bearer, jwtSecret);
    return next();
  } catch { return res.status(401).json({ error: 'Your session expired. Please log in again.' }); }
}
function requireAdmin(req, res, next) {
  if (req.auth?.role !== 'admin') return res.status(403).json({ error: 'Admin access required.' });
  return next();
}
function slugify(value) { return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function productInput(body, partial = false) {
  const allowed = ['title', 'sku', 'barcode', 'brand', 'productType', 'description', 'features', 'images', 'attributes', 'price', 'oldPrice', 'image', 'imageHasBorder', 'categories', 'tags', 'ageRange', 'material', 'dimensions', 'weight', 'includedItems', 'safetyInformation', 'rating', 'reviewCount', 'stock', 'active'];
  const data = Object.fromEntries(allowed.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));
  if (!partial && (!data.title || data.price === undefined)) throw Object.assign(new Error('Title and price are required.'), { status: 400 });
  for (const key of ['features', 'images', 'categories', 'tags', 'includedItems']) {
    if (data[key] !== undefined) data[key] = (Array.isArray(data[key]) ? data[key] : [data[key]]).map((value) => String(value).trim()).filter(Boolean);
  }
  if (data.attributes !== undefined) {
    if (!Array.isArray(data.attributes)) throw Object.assign(new Error('Product specifications must be a list.'), { status:400 });
    data.attributes = data.attributes.filter((entry) => entry && String(entry.name || '').trim() && String(entry.value || '').trim()).map((entry) => ({ name:String(entry.name).trim(), value:String(entry.value).trim() }));
  }
  if (data.sku !== undefined && !String(data.sku).trim()) data.sku = undefined;
  for (const key of ['price', 'oldPrice', 'rating', 'reviewCount', 'stock']) {
    if (data[key] !== undefined && data[key] !== null && !Number.isFinite(Number(data[key]))) throw Object.assign(new Error(`${key} must be a number.`), { status: 400 });
    if (data[key] !== undefined && data[key] !== null) data[key] = Number(data[key]);
  }
  if (data.title) data.slug = slugify(data.title);
  return data;
}

app.get('/', (_req, res) => res.json({ name: 'Rainbow Rattles API', health: '/api/health', products: '/api/products' }));
app.get('/api/health', (_req, res) => res.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

app.get('/api/products', asyncRoute(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 100));
  const filter = { active:true };
  const search = String(req.query.search || '').trim().slice(0, 100);
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [{ title:{ $regex:escaped, $options:'i' } }, { brand:{ $regex:escaped, $options:'i' } }, { description:{ $regex:escaped, $options:'i' } }, { tags:{ $regex:escaped, $options:'i' } }, { sku:{ $regex:escaped, $options:'i' } }];
  }
  if (req.query.category) filter.categories = String(req.query.category).trim().slice(0, 80);
  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);
  if (req.query.minPrice !== undefined && Number.isFinite(minPrice)) filter.price = { ...filter.price, $gte:minPrice };
  if (req.query.maxPrice !== undefined && Number.isFinite(maxPrice)) filter.price = { ...filter.price, $lte:maxPrice };
  const sortOptions = { newest:{ createdAt:-1 }, price_asc:{ price:1 }, price_desc:{ price:-1 }, rating:{ rating:-1, reviewCount:-1 } };
  const sort = sortOptions[req.query.sort] || sortOptions.newest;
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  res.json({ products, pagination:{ page, limit, total, pages:Math.ceil(total / limit) } });
}));
app.get('/api/products/:id', asyncRoute(async (req, res) => {
  const query = mongoose.isValidObjectId(req.params.id) ? { _id: req.params.id } : { slug: req.params.id };
  const product = await Product.findOne({ ...query, active: true }).lean();
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json({ product });
}));
app.post('/api/admin/login', asyncRoute(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || email !== process.env.ADMIN_EMAIL.toLowerCase() || password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Admin email or password is incorrect.' });
  res.json({ token: makeToken({ role: 'admin', email }), admin: { email } });
}));
app.get('/api/admin/customers', authenticate, requireAdmin, asyncRoute(async (_req, res) => {
  const [customerRows, orderMetrics] = await Promise.all([
    Customer.find({}).select('name email phone address billingAddress createdAt').sort({ createdAt:-1 }).lean(),
    Order.aggregate([{ $group:{ _id:'$customer', orderCount:{ $sum:1 }, lifetimeValue:{ $sum:'$total' }, lastOrderAt:{ $max:'$createdAt' } } }]),
  ]);
  const metricsByCustomer = new Map(orderMetrics.map((entry) => [String(entry._id), entry]));
  const customers = customerRows.map((customer) => ({ ...customer, ...(metricsByCustomer.get(String(customer._id)) || { orderCount:0, lifetimeValue:0, lastOrderAt:null }) }));
  res.json({ customers });
}));
app.get('/api/admin/orders', authenticate, requireAdmin, asyncRoute(async (_req, res) => {
  const orders = await Order.find({}).populate('customer', 'name email').sort({ createdAt:-1 }).lean();
  res.json({ orders });
}));
app.patch('/api/admin/orders/:id', authenticate, requireAdmin, asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error:'Order not found.' });
  const updates = {};
  if (req.body.status !== undefined) {
    if (!['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(req.body.status)) return res.status(400).json({ error:'Choose a valid order status.' });
    updates.status = req.body.status;
  }
  if (req.body.paymentStatus !== undefined) {
    if (!['Pending', 'Paid', 'Failed', 'Refunded'].includes(req.body.paymentStatus)) return res.status(400).json({ error:'Choose a valid payment status.' });
    updates.paymentStatus = req.body.paymentStatus;
  }
  if (!Object.keys(updates).length) return res.status(400).json({ error:'No order updates were provided.' });
  const order = await Order.findByIdAndUpdate(req.params.id, updates, { new:true, runValidators:true });
  if (!order) return res.status(404).json({ error:'Order not found.' });
  res.json({ order });
}));
app.post('/api/admin/uploads', authenticate, requireAdmin, imageUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error:'Choose an image to upload.' });
  res.status(201).json({ url:`${apiPublicUrl}/uploads/${req.file.filename}` });
});
app.post('/api/products', authenticate, requireAdmin, asyncRoute(async (req, res) => {
  const data = productInput(req.body);
  const product = await Product.create(data);
  res.status(201).json({ product });
}));
app.put('/api/products/:id', authenticate, requireAdmin, asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Product not found.' });
  const data = productInput(req.body, true);
  const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json({ product });
}));
app.delete('/api/products/:id', authenticate, requireAdmin, asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Product not found.' });
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json({ message: 'Product deleted.' });
}));

app.post('/api/auth/register', asyncRoute(async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (name.length < 2 || !email.includes('@') || password.length < 8) return res.status(400).json({ error: 'Enter a name, valid email, and password with at least 8 characters.' });
  if (await Customer.exists({ email })) return res.status(409).json({ error: 'An account with this email already exists.' });
  const customer = await Customer.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
  res.status(201).json({ token: makeToken({ customerId: customer.id, role: 'customer' }), customer: { id: customer.id, name, email, phone: '', address: {}, billingAddress: {} } });
}));
app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const customer = await Customer.findOne({ email }).select('+passwordHash');
  if (!customer || !await bcrypt.compare(String(req.body.password || ''), customer.passwordHash)) return res.status(401).json({ error: 'Email or password is incorrect.' });
  res.json({ token: makeToken({ customerId: customer.id, role: 'customer' }), customer: { id: customer.id, name: customer.name, email, phone: customer.phone, address: customer.address, billingAddress: customer.billingAddress } });
}));
app.get('/api/account', authenticate, asyncRoute(async (req, res) => {
  if (req.auth.role !== 'customer') return res.status(403).json({ error: 'Customer account required.' });
  const customer = await Customer.findById(req.auth.customerId).lean();
  if (!customer) return res.status(404).json({ error: 'Account not found.' });
  res.json({ customer: { id: customer._id, name: customer.name, email: customer.email, phone: customer.phone, address: customer.address, billingAddress: customer.billingAddress } });
}));
app.patch('/api/account', authenticate, asyncRoute(async (req, res) => {
  if (req.auth.role !== 'customer') return res.status(403).json({ error: 'Customer account required.' });
  const allowed = ['name', 'email', 'phone', 'address', 'billingAddress'];
  const data = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
  if (data.email) data.email = String(data.email).trim().toLowerCase();
  const customer = await Customer.findByIdAndUpdate(req.auth.customerId, data, { new: true, runValidators: true }).lean();
  if (!customer) return res.status(404).json({ error: 'Account not found.' });
  res.json({ customer: { id: customer._id, name: customer.name, email: customer.email, phone: customer.phone, address: customer.address, billingAddress: customer.billingAddress } });
}));
app.post('/api/orders', authenticate, asyncRoute(async (req, res) => {
  if (req.auth.role !== 'customer') return res.status(403).json({ error: 'Customer account required.' });
  if (!Array.isArray(req.body.items) || req.body.items.length === 0) return res.status(400).json({ error: 'Order must contain at least one item.' });
  const paymentMethod = req.body.paymentMethod || 'card';
  if (!['card', 'paypal', 'cod'].includes(paymentMethod)) return res.status(400).json({ error: 'Choose a valid payment method.' });
  const address = req.body.shippingAddress || {};
  const customerDetails = {
    firstName:String(address.firstName || '').trim(),
    lastName:String(address.lastName || '').trim(),
    email:String(address.email || '').trim().toLowerCase(),
    phone:String(address.phone || '').trim(),
  };
  if (!customerDetails.firstName || !customerDetails.lastName || !customerDetails.email.includes('@') || !customerDetails.phone || !address.street || !address.city || !address.state || !address.postalCode) {
    return res.status(400).json({ error:'Complete your name, email, phone, and delivery address before placing the order.' });
  }
  const orderItems = [];
  for (const item of req.body.items) {
    if (!Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) return res.status(400).json({ error: 'Invalid product quantity.' });
    if (item.productId && mongoose.isValidObjectId(item.productId)) {
      const product = await Product.findOne({ _id: item.productId, active: true });
      if (!product) return res.status(400).json({ error: 'A product in your cart is no longer available.' });
      orderItems.push({ product: product._id, title: product.title, image: product.image, price: product.price, quantity: Number(item.quantity) });
      continue;
    }
    if (paymentMethod !== 'cod' || typeof item.title !== 'string' || !item.title.trim() || !Number.isFinite(Number(item.price)) || Number(item.price) < 0) {
      return res.status(400).json({ error: 'This item is not available for online checkout. Choose cash on delivery or refresh your cart.' });
    }
    orderItems.push({ title:item.title.trim().slice(0, 160), image:typeof item.image === 'string' ? item.image.slice(0, 2000) : '', price:Number(item.price), quantity:Number(item.quantity) });
  }
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({
    customer:req.auth.customerId,
    customerDetails,
    items:orderItems,
    shippingAddress:{ street:String(address.street).trim(), city:String(address.city).trim(), state:String(address.state).trim(), postalCode:String(address.postalCode).trim() },
    orderNotes:String(address.notes || '').trim().slice(0, 1000),
    subtotal,
    shipping:shippingFee,
    total:subtotal + shippingFee,
    paymentMethod,
    paymentStatus:'Pending',
  });
  res.status(201).json({ order });
}));
app.get('/api/orders', authenticate, asyncRoute(async (req, res) => {
  if (req.auth.role !== 'customer') return res.status(403).json({ error: 'Customer account required.' });
  const orders = await Order.find({ customer: req.auth.customerId }).sort({ createdAt: -1 }).lean();
  res.json({ orders });
}));

app.use((req, res) => res.status(404).json({ error: 'API route not found.' }));
app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) return res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ error:error.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5 MB or smaller.' : 'Image upload was rejected.' });
  if (error.code === 11000) return res.status(409).json({ error: 'That email, product SKU, or product slug is already in use.' });
  if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ error: error.message });
  console.error(error);
  return res.status(error.status || 500).json({ error: error.message || 'Server error.' });
});

if (!jwtSecret || jwtSecret.length < 32) {
  console.error('Set JWT_SECRET (at least 32 characters) in server/.env.');
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error('Set MONGODB_URI in server/.env. Create a MongoDB Atlas database or provide a local MongoDB URI.');
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`Rainbow Rattles API listening at http://localhost:${port}; MongoDB connected.`));
} catch (error) {
  console.error(`MongoDB connection failed: ${error.message}`);
  process.exit(1);
}
