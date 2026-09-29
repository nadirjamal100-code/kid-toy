import { useState } from 'react';
import TopBar from '../components/TopBar/TopBar.jsx';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import { customerLoves, topPicks } from '../data/products.js';
import { addToCart } from '../data/cart.js';
import productBlocksMeasurements from '../assets/images/product-blocks-detail-measurements.png';
import productBlocksInUse from '../assets/images/product-blocks-detail-in-use.png';
import productBlocksFeatures from '../assets/images/product-blocks-detail-features.png';
import './ProductDetail.css';

const featuredProduct = {
  ...topPicks[0],
  title: 'Blocks shape-sorting Toy',
  price: 39,
  oldPrice: null,
  rating: 5,
  sale: false,
};

const featuredGallery = [
  { src: featuredProduct.image, alt: 'Shape sorting toy with blocks' },
  { src: productBlocksMeasurements, alt: 'Shape sorting toy dimensions' },
  { src: productBlocksInUse, alt: 'Baby playing with the shape sorting toy' },
  { src: productBlocksFeatures, alt: 'Shape sorting toy features' },
];

function getCurrentProduct() {
  const params = new URLSearchParams(window.location.search);
  const image = params.get('image');
  if (!image) return { ...featuredProduct, isFeatured: true };

  return {
    ...featuredProduct,
    title: params.get('title') || featuredProduct.title,
    price: Number(params.get('price')) || featuredProduct.price,
    oldPrice: params.has('oldPrice') ? Number(params.get('oldPrice')) : null,
    rating: Number(params.get('rating')) || 0,
    sale: params.get('sale') === 'true',
    image,
    imageHasBorder: params.get('imageHasBorder') === 'true',
    isFeatured: window.location.pathname.endsWith('/blocks-shape-sorting-toy'),
  };
}

function StarRating() {
  return (
    <span className="product-detail__stars" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((star) => <span key={star} aria-hidden="true">★</span>)}
    </span>
  );
}

function SocialIcon({ name }) {
  const paths = {
    Instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>,
    Twitter: <path d="M22 5.9a8 8 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.4 8.4 0 0 1-2.7 1 4.2 4.2 0 0 0-7.2 3.8 12 12 0 0 1-8.7-4.4 4.2 4.2 0 0 0 1.3 5.6 4.1 4.1 0 0 1-1.9-.5v.1a4.2 4.2 0 0 0 3.4 4.1 4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.5 8.5 0 0 1 2 18.8 12 12 0 0 0 20.5 8.7v-.6A8.6 8.6 0 0 0 22 5.9Z" fill="currentColor" stroke="none" />,
    Facebook: <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.5-1.5h1.7V4a22 22 0 0 0-2.5-.1c-2.5 0-4.1 1.5-4.1 4.2V10H7.5v3h2.6v8z" fill="currentColor" stroke="none" />,
    Pinterest: <path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.8.2-2.7l1.3-5.5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.6-.3 1.1.6 2 1.7 2 2.1 0 3.5-2.7 3.5-5.9 0-2.4-1.6-4.2-4.6-4.2-3.3 0-5.3 2.5-5.3 5.2 0 1 .3 1.8.8 2.3.2.2.2.3.1.6l-.3 1.1c-.1.4-.3.5-.7.3-1.5-.6-2.2-2.2-2.2-4 0-3 2.6-6.6 7.8-6.6 4.2 0 7 3 7 6.3 0 4.3-2.4 7.6-6 7.6-1.2 0-2.3-.7-2.7-1.4l-.8 3.1c-.3 1-.8 1.9-1.2 2.6A10 10 0 1 0 12 2Z" fill="currentColor" stroke="none" />,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function CartIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" /><circle cx="10" cy="21" r="1.4" /><circle cx="18" cy="21" r="1.4" /></svg>;
}

function PaymentMarks() {
  return (
    <div className="product-detail__payments" aria-label="Accepted payment methods">
      <span className="payment-mark payment-mark--visa">VISA</span>
      <span className="payment-mark payment-mark--mastercard"><i /><i /></span>
      <span className="payment-mark payment-mark--amex">AMEX</span>
      <span className="payment-mark payment-mark--discover">DISCOVER</span>
      <span className="payment-mark payment-mark--unionpay"><b>UnionPay</b></span>
    </div>
  );
}

function ProductDetail() {
  const product = getCurrentProduct();
  const gallery = product.isFeatured
    ? featuredGallery
    : [{ src: product.image, alt: product.title }];
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlisted, setWishlisted] = useState(false);
  const [compare, setCompare] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  const adjustQuantity = (amount) => setQuantity((current) => Math.max(1, current + amount));

  return (
    <>
      <TopBar />
      <Header />
      <main className="product-detail-page">
        <div className="product-detail-page__container">
          <nav className="product-detail__breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><span aria-hidden="true">/</span><span>{product.title}</span>
          </nav>

          <section className="product-detail__overview" aria-labelledby="product-title">
            <div className="product-detail__gallery">
              <div className={`product-detail__main-image${product.imageHasBorder ? ' product-detail__main-image--image-bordered' : ''}`}>
                <img src={gallery[activeImage].src} alt={gallery[activeImage].alt} />
                <button className="product-detail__zoom" aria-label="View larger image" onClick={() => setZoomOpen(true)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5M3 8l6-6M21 8l-6-6M3 16l6 6M21 16l-6 6" /></svg>
                </button>
              </div>
              <div className="product-detail__thumbnails" aria-label="Product images">
                {gallery.slice(1).map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    className={`product-detail__thumbnail${activeImage === index + 1 ? ' is-active' : ''}`}
                    aria-label={`Show image ${index + 2}: ${image.alt}`}
                    aria-pressed={activeImage === index + 1}
                    onClick={() => setActiveImage(index + 1)}
                  >
                    <img src={image.src} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <div className="product-detail__info">
              <h1 id="product-title">{product.title}</h1>
              <p className={`product-detail__price${product.oldPrice ? ' product-detail__price--sale' : ''}`}><span>${product.price}.00</span>{product.oldPrice && <span className="product-detail__old-price">${product.oldPrice}.00</span>}</p>
              <div className="product-detail__rating"><StarRating /><a href="#product-reviews" onClick={() => setActiveTab('reviews')}>(14 Reviews)</a></div>
              <p className="product-detail__summary">
                Duis ultricies lacus sed turpis tincidunt id aliquet risus feugiat in ante metus dictum at tempor commodo ullamcorper a lacus.<br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="product-detail__share">
                <span>Share this:</span>
                {['Instagram', 'Twitter', 'Facebook', 'Pinterest'].map((name) => (
                  <a key={name} href={`#share-${name.toLowerCase()}`} aria-label={`Share on ${name}`}><SocialIcon name={name} /></a>
                ))}
              </div>
              <div className="product-detail__actions">
                <div className="product-detail__quantity" aria-label="Quantity">
                  <button aria-label="Decrease quantity" onClick={() => adjustQuantity(-1)}>−</button>
                  <output aria-live="polite">{quantity}</output>
                  <button aria-label="Increase quantity" onClick={() => adjustQuantity(1)}>+</button>
                </div>
                <button className="product-detail__add-cart" onClick={() => addToCart(product, quantity)}><CartIcon />Add to cart</button>
                <button className={`product-detail__secondary${wishlisted ? ' is-active' : ''}`} aria-label="Add to wishlist" aria-pressed={wishlisted} onClick={() => setWishlisted((value) => !value)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.25 8.65c0 4.65-8.25 10.1-8.25 10.1S3.75 13.3 3.75 8.65A4.15 4.15 0 0 1 7.9 4.5c1.7 0 3.15 1.05 4.1 2.45.95-1.4 2.4-2.45 4.1-2.45a4.15 4.15 0 0 1 4.15 4.15Z" /></svg>
                </button>
                <button className={`product-detail__secondary${compare ? ' is-active' : ''}`} aria-label="Compare product" aria-pressed={compare} onClick={() => setCompare((value) => !value)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h12l-3-3M17 17H5l3 3M19 7l-3 3M5 17l3-3" /></svg>
                </button>
              </div>

              <div className="product-detail__meta">
                <h2>Short description</h2>
                <dl>
                  <div><dt>SKU :</dt><dd>BG-1068</dd></div>
                  <div><dt>Category:</dt><dd>Educational Toy</dd></div>
                  <div><dt>Tags :</dt><dd>2 - 5 years</dd></div>
                  <div><dt>EXP :</dt><dd>06/08/2026</dd></div>
                </dl>
              </div>
              <div className="product-detail__checkout">
                <h2>Guaranteed Safe Checkout</h2>
                <PaymentMarks />
              </div>
            </div>
          </section>

          <section className="product-detail__tabs" id="product-reviews">
            <div className="product-detail__tab-list" role="tablist" aria-label="Product information">
              <button id="description-tab" role="tab" aria-selected={activeTab === 'description'} aria-controls="description-panel" className={activeTab === 'description' ? 'is-active' : ''} onClick={() => setActiveTab('description')}>Description</button>
              <button id="reviews-tab" role="tab" aria-selected={activeTab === 'reviews'} aria-controls="reviews-panel" className={activeTab === 'reviews' ? 'is-active' : ''} onClick={() => setActiveTab('reviews')}>Reviews (14)</button>
            </div>
            {activeTab === 'description' ? (
              <div id="description-panel" role="tabpanel" aria-labelledby="description-tab" className="product-detail__tab-content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            ) : (
              <div id="reviews-panel" role="tabpanel" aria-labelledby="reviews-tab" className="product-detail__tab-content product-detail__reviews">
                <StarRating /><p>Customer reviews for {product.title}</p><p>14 customers have reviewed this product.</p>
              </div>
            )}
          </section>

          <section className="product-detail__related" aria-labelledby="related-title">
            <h2 id="related-title">Related products</h2>
            <div className="product-detail__related-grid">
              {customerLoves.map((relatedProduct) => <ProductCard key={relatedProduct.id} product={relatedProduct} />)}
            </div>
          </section>
        </div>
      </main>
      <Footer />

      {zoomOpen && (
        <div className="product-detail__lightbox" role="dialog" aria-modal="true" aria-label="Product image" onClick={() => setZoomOpen(false)}>
          <button aria-label="Close image" onClick={() => setZoomOpen(false)}>×</button>
          <img src={gallery[activeImage].src} alt={gallery[activeImage].alt} />
        </div>
      )}
    </>
  );
}

export default ProductDetail;
