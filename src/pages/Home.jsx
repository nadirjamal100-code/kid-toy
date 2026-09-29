import TopBar from '../components/TopBar/TopBar.jsx';
import Header from '../components/Header/Header.jsx';
import Hero from '../components/Hero/Hero.jsx';
import Categories from '../components/Categories/Categories.jsx';
import ProductGrid from '../components/ProductGrid/ProductGrid.jsx';
import PromoBanners from '../components/PromoBanners/PromoBanners.jsx';
import Testimonials from '../components/Testimonials/Testimonials.jsx';
import Gallery from '../components/Gallery/Gallery.jsx';
import Features from '../components/Features/Features.jsx';
import Newsletter from '../components/Newsletter/Newsletter.jsx';
import Footer from '../components/Footer/Footer.jsx';
import { topPicks, customerLoves } from '../data/products.js';

function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <Hero />
      <Categories />
      <ProductGrid
        title="Top picks for your little ones"
        products={topPicks}
        withTabs
      />
      <PromoBanners />
      <ProductGrid
        title="Customer Loves"
        subtitle="Popular product"
        products={customerLoves}
      />
      <Testimonials />
      <Gallery />
      <Features />
      <Newsletter />
      <Footer />
    </>
  );
}

export default Home;
