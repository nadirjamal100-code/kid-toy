import discoverImg from '../../assets/images/banner-discover.png';
import ecoImg from '../../assets/images/banner-eco.png';
import './PromoBanners.css';

function PromoBanners() {
  return (
    <section className="promo">
      <div className="container promo__grid">
        <div className="promo__card promo__card--discover">
          <img src={discoverImg} alt="" className="promo__bg" />
          <div className="promo__text">
            <h3>Discover the<br />Joy of Play</h3>
          </div>
        </div>

        <div className="promo__card promo__card--eco">
          <img src={ecoImg} alt="Baby playing with eco-friendly building blocks" className="promo__bg" />
          <div className="promo__text promo__text--right">
            <h3>Eco - Friendly Toys</h3>
            <p>Flash sale 30%, Extra discount for loyal customers</p>
            <a href="#shop" className="btn btn-primary">Shop now</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBanners;
