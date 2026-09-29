import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import ProductCard from '../ProductCard/ProductCard.jsx';
import './ProductGrid.css';

gsap.registerPlugin(Flip);

const TABS = ['Featured', 'Best seller', 'New arrivals', 'Sale'];

function ProductGrid({ title, subtitle, products, withTabs }) {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const gridRef = useRef(null);
  const flipStateRef = useRef(null);
  const displayedProducts = activeTab === 'Sale'
    ? products.filter((product) => product.sale)
    : activeTab === 'Best seller'
      ? [...products].sort((a, b) => b.rating - a.rating || Number(b.sale) - Number(a.sale))
      : activeTab === 'New arrivals'
        ? [...products].reverse()
        : products;
  const visibleProductIds = new Set(displayedProducts.map((product) => product.id));
  const displayOrder = new Map(displayedProducts.map((product, index) => [product.id, index]));

  useLayoutEffect(() => {
    const previousState = flipStateRef.current;
    if (!previousState || !gridRef.current) return;

    flipStateRef.current = null;
    Flip.from(previousState, {
      duration:.68,
      ease:'power2.inOut',
      absoluteOnLeave:true,
      stagger:.035,
      onEnter:(elements) => gsap.fromTo(elements,
        { autoAlpha:0, scale:.88, y:16 },
        { autoAlpha:1, scale:1, y:0, duration:.46, stagger:.045, ease:'back.out(1.35)', clearProps:'opacity,visibility,transform' },
      ),
      onLeave:(elements) => gsap.to(elements, {
        autoAlpha:0,
        scale:.88,
        y:-12,
        duration:.24,
        stagger:.025,
        ease:'power2.in',
      }),
    });
  }, [activeTab]);

  const changeTab = (tab) => {
    if (tab === activeTab) return;
    const cards = gridRef.current?.querySelectorAll('.product-card');
    if (cards?.length) flipStateRef.current = Flip.getState(cards);
    setActiveTab(tab);
  };

  return (
    <section className={`section product-grid-section${withTabs ? ' product-grid-section--tabs' : ''}`} id="shop">
      <div className="container">
        <div className="section-heading">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {withTabs && (
          <div className="product-grid__tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`product-grid__tab ${activeTab === tab ? 'is-active' : ''}`}
                aria-pressed={activeTab === tab}
                onClick={() => changeTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        <div className={`product-grid${withTabs ? ' product-grid--filtering' : ''}`} ref={gridRef}>
          {(withTabs ? products : displayedProducts).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              className={withTabs && !visibleProductIds.has(product.id) ? 'is-filtered-out' : ''}
              style={withTabs ? { order:displayOrder.get(product.id) ?? products.length + index } : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductGrid;
