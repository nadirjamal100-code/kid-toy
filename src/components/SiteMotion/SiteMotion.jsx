import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import './SiteMotion.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const REVEAL_SELECTORS = [
  '.categories__item',
  '.product-card',
  '.promo__card',
  '.testimonial-card',
  '.gallery__grid img',
  '.feature',
  '.shop-sidebar__panel',
  '.shop-results > h1',
  '.shop-toolbar',
  '.shop-product-grid .product-card',
  '.blog-sidebar > h1',
  '.blog-panel',
  '.blog-promo',
  '.blog-card',
  '.blog-article__header',
  '.blog-article__image',
  '.blog-article__content > *',
  '.blog-related-card',
  '.contact-title',
  '.contact-card',
  '.contact-map',
  '.contact-form-wrap',
  '.faq-title',
  '.faq-accordion',
  '.auth-card',
  '.account-card',
  '.cart-content',
  '.checkout-content',
  '.footer__brand',
  '.footer__col',
].join(',');

function SiteMotion({ children }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const removeHoverListeners = [];
    const textSplits = [];

    const context = gsap.context(() => {
      const headerItems = gsap.utils.toArray('.topbar__message, .topbar__links, .header__logo, .header__nav li, .header__search, .header__actions > *', root);
      gsap.from(headerItems, {
        y: -10,
        autoAlpha: 0,
        duration: 0.48,
        stagger: 0.035,
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
      });

      const hero = root.querySelector('.hero');
      if (hero) {
        const isMobileHero = window.matchMedia('(max-width: 768px)').matches;
        const heroButton = hero.querySelector('.hero__content .btn');
        const heroIntro = gsap.timeline({ defaults:{ ease:'power3.out' } });
        if (isMobileHero) {
          const heroHeading = hero.querySelector('.hero__content h1');
          const heroDescription = hero.querySelector('.hero__content p');
          const mobileImage = hero.querySelector('.hero__image--mobile img');
          heroIntro
            .from(heroHeading, { xPercent:-110, autoAlpha:0, duration:1.05 })
            .from(heroDescription, { xPercent:-80, autoAlpha:0, duration:.9 }, '-=.62')
            .from(heroButton, { y:22, scale:.94, autoAlpha:0, duration:.65, ease:'back.out(1.7)' }, '-=.38')
            .from(mobileImage, { xPercent:32, autoAlpha:0, duration:1.15, ease:'power2.out' }, '-=.8');
        } else {
          const desktopImage = hero.querySelector('.hero__image--desktop img');
          const desktopCta = hero.querySelector('.hero__desktop-cta');
          heroIntro
            .from(desktopImage, { xPercent:-12, autoAlpha:0, duration:1.25, ease:'power2.out' })
            .from(desktopCta, { x:-24, autoAlpha:0, duration:.55, ease:'power2.out' }, '-=.5');
        }
        gsap.to(gsap.utils.toArray('.hero__image img', hero), {
          yPercent:5,
          ease:'none',
          scrollTrigger:{ trigger:hero, start:'top top', end:'bottom top', scrub:.8 },
        });

        gsap.utils.toArray('.section-heading h2, .section-heading p', root).forEach((element) => {
          const split = SplitText.create(element, { type:'words,chars', charsClass:'home-heading-char', aria:'auto' });
          textSplits.push(split);
          gsap.from(split.chars, {
            x:(index) => index % 2 === 0 ? -26 : 26,
            yPercent:() => gsap.utils.random(-16,16),
            rotation:() => gsap.utils.random(-5,5),
            autoAlpha:0,
            duration:1.6,
            stagger:.04,
            ease:'back.out(1.25)',
            clearProps:'transform,opacity,visibility',
            scrollTrigger:{ trigger:element, start:'top 88%', once:true },
          });
        });
      }

      const revealItems = gsap.utils.toArray(REVEAL_SELECTORS, root);
      if (revealItems.length) {
        gsap.set(revealItems, { autoAlpha: 0, y: 22 });
        ScrollTrigger.batch(revealItems, {
          start: 'top 91%',
          once: true,
          onEnter: (batch) => gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            stagger: 0.075,
            ease: 'power2.out',
            overwrite: true,
          }),
        });
        ScrollTrigger.refresh();
      }

      if (window.matchMedia('(hover: hover)').matches) {
        const bindHover = (selector, buildTimeline) => {
          gsap.utils.toArray(selector, root).forEach((element) => {
            const timeline = gsap.timeline({ paused:true });
            buildTimeline(timeline, element);
            const enter = () => timeline.play();
            const leave = () => timeline.reverse();
            element.addEventListener('pointerenter', enter);
            element.addEventListener('pointerleave', leave);
            element.addEventListener('focus', enter);
            element.addEventListener('blur', leave);
            removeHoverListeners.push(() => {
              element.removeEventListener('pointerenter', enter);
              element.removeEventListener('pointerleave', leave);
              element.removeEventListener('focus', enter);
              element.removeEventListener('blur', leave);
            });
          });
        };

        bindHover('.product-card', (timeline, card) => {
          timeline.to(card, { y:-5, scale:1.018, boxShadow:'0 12px 26px rgba(34,49,64,.14)', duration:.28, ease:'power2.out' });
          const image = card.querySelector('.product-card__media img');
          if (image) timeline.to(image, { scale:1.065, duration:.38, ease:'power2.out' }, 0);
        });
        bindHover('.promo__card', (timeline, card) => {
          timeline.to(card, { y:-4, rotation: .35, boxShadow:'0 14px 28px rgba(34,49,64,.13)', duration:.32, ease:'back.out(1.7)' });
          const image = card.querySelector('.promo__bg');
          if (image) timeline.to(image, { scale:1.06, duration:.45, ease:'power2.out' }, 0);
        });
        bindHover('.gallery__grid img', (timeline, image) => {
          timeline.to(image, { scale:1.07, rotation:.7, duration:.42, ease:'power2.out' });
        });
        bindHover('.blog-related-card, .contact-card, .blog-panel', (timeline, card) => {
          timeline.to(card, { y:-4, boxShadow:'0 9px 22px rgba(34,49,64,.12)', borderColor:'#9bd4e5', duration:.26, ease:'power2.out' });
        });
        bindHover('.categories__item', (timeline, item) => {
          timeline.to(item, { y:-5, duration:.28, ease:'back.out(1.8)' });
          const icon = item.querySelector('img');
          if (icon) timeline.to(icon, { scale:1.12, rotation:-5, duration:.3, ease:'back.out(2)' }, 0);
        });
        bindHover('.product-card__icon-btn', (timeline, button) => {
          timeline.to(button, { scale:1.18, rotation:button.classList.contains('product-card__icon-btn--heart') ? -8 : 8, duration:.22, ease:'back.out(2.5)' });
        });
        bindHover('.header__nav a, .header__pages-toggle, .footer__col a, .blog-breadcrumb a, .contact-breadcrumb a, .faq-breadcrumb a', (timeline, link) => {
          timeline.to(link, { y:-2, color:'#0d91b8', duration:.18, ease:'power2.out' });
        });
        bindHover('.btn, .contact-form button, .blog-pagination button, .header__search button, .faq-question', (timeline, control) => {
          timeline.to(control, { y:-2, scale:1.035, duration:.2, ease:'back.out(2.2)' });
        });
      }
    }, root);

    return () => {
      removeHoverListeners.forEach((remove) => remove());
      context.revert();
      textSplits.forEach((split) => split.revert());
    };
  }, []);

  return <div className="site-motion" ref={rootRef}>{children}</div>;
}

export default SiteMotion;
