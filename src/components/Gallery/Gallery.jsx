import { gallery } from '../../data/products.js';
import './Gallery.css';

function Gallery() {
  return (
    <section className="section gallery">
      <div className="container">
        <div className="section-heading">
          <h2>Recent photoshoots</h2>
          <p>Check gallery</p>
        </div>

        <div className="gallery__grid">
          {gallery.map((src, i) => (
            <img src={src} alt={`Customer photoshoot ${i + 1}`} key={src} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
