import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Account from './pages/Account.jsx';
import Blog from './pages/Blog.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';
import Admin from './pages/Admin.jsx';
import SiteMotion from './components/SiteMotion/SiteMotion.jsx';

function RouteContent() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/admin') return <Admin />;
  if (path === '/shop' || path === '/products') return <Shop />;
  if (path === '/blog' || path === '/news') return <Blog />;
  if (path.startsWith('/blog/')) return <BlogDetail />;
  if (path === '/contact') return <Contact />;
  if (path === '/faq' || path === '/faqs') return <FAQ />;
  if (path === '/cart') return <Cart />;
  if (path === '/checkout') return <Checkout />;
  if (path === '/login') return <AuthPage mode="login" />;
  if (path === '/register') return <AuthPage mode="register" />;
  if (path === '/account' || path === '/my-account') return <Account />;
  if (path === '/product' || path.startsWith('/product/')) return <ProductDetail />;
  if (path.startsWith('/category/')) return <Shop activeCategory={path.slice('/category/'.length)} />;
  return <Home />;
}

function App() {
  return <SiteMotion><RouteContent /></SiteMotion>;
}

export default App;
