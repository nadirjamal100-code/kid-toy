import careIcon from '../../assets/icons/footer-frame-88-2.svg';
import shippingIcon from '../../assets/icons/footer-frame-88-1.svg';
import returnIcon from '../../assets/icons/footer-frame-88.svg';
import './Features.css';

const FEATURES = [
  {
    id: 1,
    icon: careIcon,
    title: 'Customer care',
    text: '24h hour follow up',
    tint: 'blue',
  },
  {
    id: 2,
    icon: shippingIcon,
    title: 'Free ship',
    text: 'Free shipping for 150$ and up',
    tint: 'orange',
  },
  {
    id: 3,
    icon: returnIcon,
    title: 'Return',
    text: 'Within 7 days',
    tint: 'green',
  },
];

function Features() {
  return (
    <section className="features">
      <div className="container features__grid">
        {FEATURES.map((f) => (
          <div className={`feature feature--${f.tint}`} key={f.id}>
            <div className="feature__icon-window" aria-hidden="true">
              <img src={f.icon} alt="" />
            </div>
            <div className="feature__copy">
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
