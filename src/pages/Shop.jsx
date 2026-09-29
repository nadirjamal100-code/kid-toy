import { useMemo, useState } from 'react';
import TopBar from '../components/TopBar/TopBar.jsx';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import { categories, topPicks, customerLoves } from '../data/products.js';
import productFarm from '../assets/images/product-wooden-farm-set.png';
import productDinosaur from '../assets/images/product-dinosaur-puzzle.png';
import productAlphabet from '../assets/images/product-alphabet-puzzle.png';
import productWoodSorting from '../assets/images/product-wooden-sorting.png';
import productPegboard from '../assets/images/product-pegboard.png';
import productBus from '../assets/images/product-bus.png';
import './Shop.css';

const shopItems = [
  { ...topPicks[0], title: 'Blocks shape-sorting Toy', price:39, oldPrice:null, rating:5, sale:false, image:topPicks[0].image, heartAccent:true, cartAccent:true, categories:['playsets','educational-toys','type-1'] },
  { ...topPicks[7], title: 'Set wooden farm fruit Toys', price:29, oldPrice:39, rating:5, sale:true, image:productFarm, imageHasBorder:true, cartAccent:true, categories:['playsets','educational-toys','eco-friendly-toys'] },
  { ...topPicks[5], title: 'Montessori Dinosaur Puzzle', price:39, oldPrice:null, rating:0, sale:false, image:productDinosaur, categories:['playsets','educational-toys'] },
  { ...topPicks[1], title: 'Magna etiam tempor orci', price:29, oldPrice:39, rating:0, sale:true, image:productAlphabet, imageHasBorder:true, categories:['educational-toys','type-2'] },
  { ...topPicks[2], title: 'Wooden sorting Toys', price:39, oldPrice:null, rating:5, sale:false, image:productWoodSorting, imageHasBorder:true, categories:['educational-toys','eco-friendly-toys','type-2'] },
  { ...topPicks[2], title: 'Magna etiam tempor orci', price:29, oldPrice:39, rating:5, sale:true, image:topPicks[2].image, imageHasBorder:true, categories:['educational-toys','playsets'] },
  { ...topPicks[0], title: 'Magna etiam tempor orci', price:29, oldPrice:39, rating:0, sale:true, image:productPegboard, imageHasBorder:true, categories:['educational-toys','type-1'] },
  { ...customerLoves[2], title: 'Magna etiam tempor orci', price:39, oldPrice:null, rating:0, sale:false, image:productBus, imageHasBorder:true, categories:['educational-toys','control-toys'] },
  { ...topPicks[5], title: 'Magna etiam tempor orci', price:29, oldPrice:39, rating:5, sale:true, image:topPicks[5].image, categories:['educational-toys','eco-friendly-toys','playsets'] },
];

const categoryExtras = {
  'control-toys': [topPicks[4]],
  'stuffed-toys': [topPicks[3], topPicks[1]],
};
const extraCategoryNames = { 'type-1':'Type 1', 'type-2':'Type 2' };

const popularItems = [
  { ...topPicks[3], sidebarTitle:'Magna etiam tempor orci' },
  { ...customerLoves[3], sidebarTitle:'Tortor at auctor' },
  { ...topPicks[6], sidebarTitle:'Hape scoot-around' },
];

function GridIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="12" y="2" width="6" height="6" rx="1"/><rect x="2" y="12" width="6" height="6" rx="1"/><rect x="12" y="12" width="6" height="6" rx="1"/></svg>;
}

function ListIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 4h10M8 10h10M8 16h10"/><rect x="2" y="2" width="3" height="4" rx=".5"/><rect x="2" y="8" width="3" height="4" rx=".5"/><rect x="2" y="14" width="3" height="4" rx=".5"/></svg>;
}

function Sidebar({ activeCategory, onCategoryChange, priceRange, onPriceChange, onApplyPrice }) {
  return (
    <aside className="shop-sidebar" aria-label="Product filters">
      <section className="shop-sidebar__panel shop-sidebar__categories">
        <h2>Product categories</h2>
        <ul role="tablist" aria-label="Product categories" aria-orientation="vertical">
          {categories.map((category) => (
            <li key={category.id}>
              <button type="button" role="tab" aria-selected={activeCategory === category.slug} className={activeCategory === category.slug ? 'is-active' : ''} onClick={() => onCategoryChange(category.slug)}>
                <span aria-hidden="true">＋</span>{category.name.replace('Eco- Friendly', 'Eco-Friendly')}
              </button>
            </li>
          ))}
          <li><button type="button" role="tab" aria-selected={activeCategory === 'type-1'} className={activeCategory === 'type-1' ? 'is-active' : ''} onClick={() => onCategoryChange('type-1')}><span aria-hidden="true">＋</span>Type 1</button></li>
          <li><button type="button" role="tab" aria-selected={activeCategory === 'type-2'} className={activeCategory === 'type-2' ? 'is-active' : ''} onClick={() => onCategoryChange('type-2')}><span aria-hidden="true">＋</span>Type 2</button></li>
        </ul>
      </section>

      <section className="shop-sidebar__panel shop-sidebar__filter">
        <h2>Filter by price</h2>
        <div className="shop-price-range">
          <div className="shop-price-range__track" />
          <div className="shop-price-range__selected" style={{ left:`${((priceRange[0] - 20) / 180) * 100}%`, right:`${100 - ((priceRange[1] - 20) / 180) * 100}%` }} />
          <input type="range" min="20" max="200" step="1" value={priceRange[0]} aria-label="Minimum price" onChange={(event) => onPriceChange(0, Math.min(Number(event.target.value), priceRange[1] - 1))} />
          <input type="range" min="20" max="200" step="1" value={priceRange[1]} aria-label="Maximum price" onChange={(event) => onPriceChange(1, Math.max(Number(event.target.value), priceRange[0] + 1))} />
        </div>
        <div className="shop-price-values"><span>${priceRange[0]}.00</span><span>${priceRange[1]}.00</span></div>
        <button className="shop-apply" onClick={onApplyPrice}>Apply</button>
      </section>

      <section className="shop-sidebar__panel shop-sidebar__popular">
        <h2>Popular products</h2>
        <ul>
          {popularItems.map((item) => (
            <li key={item.id}>
              <img src={item.image} alt="" />
              <div><p>{item.sidebarTitle}</p><strong>$39.00</strong><span className="shop-popular-stars" aria-label="5 out of 5 stars">★★★★★</span></div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function Shop({ activeCategory = null }) {
  const searchQuery = new URLSearchParams(window.location.search).get('q')?.trim() || '';
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const [priceRange, setPriceRange] = useState([20, 200]);
  const [appliedPriceRange, setAppliedPriceRange] = useState(null);
  const [priceFilterActive, setPriceFilterActive] = useState(false);
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const selected = categories.find((category) => category.slug === selectedCategory);
  const title = selected?.name.replace('Eco- Friendly', 'Eco-Friendly') || extraCategoryNames[selectedCategory] || 'Products';
  const categoryProducts = selectedCategory
    ? [...shopItems.filter((product) => product.categories?.includes(selectedCategory)), ...(categoryExtras[selectedCategory] || [])]
    : shopItems;
  const catalogProducts = (!selectedCategory || selectedCategory === 'educational-toys') && categoryProducts.length
    ? Array.from({ length:24 }, (_, index) => ({ ...categoryProducts[index % categoryProducts.length], catalogKey:index }))
    : categoryProducts.map((product, index) => ({ ...product, catalogKey:index }));
  const filteredProducts = useMemo(() => {
    let items = priceFilterActive
      ? catalogProducts.filter((product) => product.price >= appliedPriceRange[0] && product.price <= appliedPriceRange[1])
      : [...catalogProducts];
    if (searchQuery) {
      const query = searchQuery.toLocaleLowerCase();
      items = items.filter((product) => product.title.toLocaleLowerCase().includes(query));
    }
    if (sort === 'price-low') items.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') items.sort((a, b) => b.price - a.price);
    if (sort === 'title') items.sort((a, b) => a.title.localeCompare(b.title));
    return items;
  }, [sort, catalogProducts, priceFilterActive, appliedPriceRange, searchQuery]);
  const resultCount = filteredProducts.length;
  const pageCount = Math.max(1, Math.ceil(resultCount / 9));

  const pageProducts = filteredProducts.slice((page - 1) * 9, page * 9);

  const changePage = (nextPage) => setPage(Math.max(1, Math.min(pageCount, nextPage)));
  const updatePriceRange = (index, value) => setPriceRange((current) => current.map((price, i) => i === index ? value : price));

  return (
    <>
      <TopBar />
      <Header />
      <main className="shop-page">
        <div className="shop-container">
          <nav className="shop-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>{selected ? title : 'Products'}</span></nav>
          <div className="shop-layout">
            <Sidebar
              activeCategory={selectedCategory}
              onCategoryChange={(category) => { setSelectedCategory(category); setPage(1); }}
              priceRange={priceRange}
              onPriceChange={updatePriceRange}
              onApplyPrice={() => { setAppliedPriceRange(priceRange); setPriceFilterActive(true); setPage(1); }}
            />
            <section className="shop-results" aria-label={`${title} products`}>
              <h1>{searchQuery ? `Search results for “${searchQuery}”` : title === 'Products' ? 'Shop' : title}</h1>
              <div className="shop-toolbar">
                <div className="shop-toolbar__left">
                  <button className={view === 'grid' ? 'is-active' : ''} onClick={() => setView('grid')} aria-label="Grid view"><GridIcon /></button>
                  <button className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-label="List view"><ListIcon /></button>
                  <label className="shop-sort"><span className="sr-only">Sort products</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="default">Default sorting</option><option value="price-low">Sort by price: low to high</option><option value="price-high">Sort by price: high to low</option><option value="title">Sort by name</option></select></label>
                </div>
                <p>Showing {(page - 1) * 9 + 1}-{Math.min(page * 9, resultCount)} of {resultCount} results</p>
              </div>
              <div className={`shop-product-grid ${view === 'list' ? 'is-list' : ''}`}>
                {pageProducts.map((product, index) => <ProductCard key={`${page}-${product.id}-${index}`} product={product} />)}
              </div>
              {resultCount === 0 && <p className="shop-empty-state" role="status">No products found for “{searchQuery}”. Try another search.</p>}
              {pageCount > 1 && <nav className="shop-pagination" aria-label="Product pages">
                <button onClick={() => changePage(page - 1)} aria-label="Previous page" disabled={page === 1}>‹</button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} className={page === number ? 'is-current' : ''} onClick={() => changePage(number)} aria-current={page === number ? 'page' : undefined}>{number}</button>)}
                <button onClick={() => changePage(page + 1)} aria-label="Next page" disabled={page === pageCount}>›</button>
              </nav>}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Shop;
