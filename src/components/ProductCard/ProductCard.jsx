import './ProductCard.css';
import { addToCart } from '../../data/cart.js';

function Star({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#FFB800' : 'none'}>
      <path
        d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 6.9L12 17.3 5.7 20.8l1.7-6.9L2 9.2l7.1-.6L12 2z"
        stroke="#FFB800"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getProductHref(product) {
  const slug = product.slug || `${product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${product.id ?? 'item'}`;
  const params = new URLSearchParams({
    title: product.title,
    price: String(product.price),
    rating: String(product.rating ?? 0),
    sale: String(Boolean(product.sale)),
    image: product.image,
  });
  if (product.oldPrice) params.set('oldPrice', String(product.oldPrice));
  if (product.imageHasBorder) params.set('imageHasBorder', 'true');
  return `/product/${slug}?${params.toString()}`;
}

function ProductCard({ product, className = '', style }) {
  const { title, price, oldPrice, rating, sale, image, imageHasBorder, heartAccent, cartAccent } = product;
  const href = getProductHref(product);

  return (
    <article className={`product-card${className ? ` ${className}` : ''}`} style={style}>
      <div className={`product-card__media${imageHasBorder ? ' product-card__media--image-bordered' : ''}`}>
        {sale && <span className="product-card__badge">SALE</span>}
        <button className={`product-card__icon-btn product-card__icon-btn--heart ${heartAccent ? 'is-accent' : ''}`} aria-label="Add to wishlist">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20.25 8.65c0 4.65-8.25 10.1-8.25 10.1S3.75 13.3 3.75 8.65A4.15 4.15 0 0 1 7.9 4.5c1.7 0 3.15 1.05 4.1 2.45.95-1.4 2.4-2.45 4.1-2.45a4.15 4.15 0 0 1 4.15 4.15Z"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button type="button" className={`product-card__icon-btn product-card__icon-btn--cart ${cartAccent ? 'is-accent' : ''}`} aria-label={`Add ${title} to cart`} onClick={() => addToCart(product)}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3.5 4.5h2l2.1 10.15a1.9 1.9 0 0 0 1.85 1.5h7.95a1.9 1.9 0 0 0 1.85-1.5l1.65-7.25H6.15"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9.6" cy="19.1" r="1" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="17.4" cy="19.1" r="1" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
        {href ? <a className="product-card__media-link" href={href}><img src={image} alt={title} /></a> : <img src={image} alt={title} />}
      </div>

      <div className="product-card__body">
        <h3>{href ? <a href={href}>{title}</a> : title}</h3>
        <p className="product-card__price">
          ${price}.00
          {oldPrice && <span className="product-card__old-price">${oldPrice}.00</span>}
        </p>
        <div className="product-card__stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} filled={i < rating} />
          ))}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
