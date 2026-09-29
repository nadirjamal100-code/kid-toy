import heroImage from '../../assets/images/hero-baby.jpg';
import heroBanner from '../../assets/images/hero-banner@2x.jpg';
import './Hero.css';

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__inner">
        <div className="hero__image hero__image--desktop" aria-hidden="true">
          <img src={heroBanner} alt="" />
        </div>
        <div className="hero__content">
          <h1>Play, learn, &amp; grow!</h1>
          <p>
            Crafting smiles with every toy, made for learning, fun, and
            growth
          </p>
          <a href="#shop" className="btn btn-primary hero__mobile-cta">
            Shop now
          </a>
        </div>
        <a href="#shop" className="hero__desktop-cta" aria-label="Shop now" />
        <div className="hero__image hero__image--mobile">
          <img src={heroImage} alt="Baby playing with a wooden learning toy" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
