import { categories } from '../../data/products.js';
import './Categories.css';

function Categories() {
  return (
    <section className="section categories">
      <div className="container">
        <div className="section-heading">
          <h2>Find the Perfect Toy</h2>
          <p>Our Collections</p>
        </div>

        <ul className="categories__list">
          {categories.map((cat) => (
            <li key={cat.id} className="categories__item">
              <a href={`/category/${cat.slug}`}>
                <img src={cat.icon} alt="" aria-hidden="true" />
                <span>{cat.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Categories;
