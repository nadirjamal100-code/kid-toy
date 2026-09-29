import { useState } from 'react';
import { testimonials } from '../../data/products.js';
import './Testimonials.css';

function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const count = testimonials.length;
  const visibleTestimonials = testimonials.map((_, index) => testimonials[(startIndex + index) % count]);

  function moveSlider(step) {
    setDirection(step > 0 ? 'next' : 'previous');
    setStartIndex((index) => (index + step + count) % count);
  }

  return (
    <section className="section testimonials">
      <div className="container">
        <div className="section-heading">
          <h2>Hear from Other Happy Parents</h2>
          <p>Customer testimonials</p>
        </div>
        <div className="testimonials__row">
          <button className="testimonials__arrow" aria-label="Previous testimonials" onClick={() => moveSlider(-1)}>{"\u2039"}</button>
          <div className={`testimonials__list testimonials__list--${direction}`} key={startIndex} aria-live="polite">
            {visibleTestimonials.map((t) => (
              <div className="testimonial-card" key={t.id}>
                <div className="testimonial-card__stars">{"\u2605\u2605\u2605\u2605\u2605"}</div>
                <p>{t.quote}</p>
                <div className="testimonial-card__person">
                  <img src={t.avatar} alt={t.name} width="40" height="40" />
                  <span>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="testimonials__arrow" aria-label="Next testimonials" onClick={() => moveSlider(1)}>{"\u203A"}</button>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
