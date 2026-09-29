import productBlocks from '../assets/images/product-blocks.png';
import productUnicorn from '../assets/images/product-unicorn.png';
import productStacker from '../assets/images/product-stacker.png';
import productDeer from '../assets/images/product-deer.png';
import productRcCar from '../assets/images/product-rc-car.png';
import productWoodenDog from '../assets/images/product-wooden-dog.png';
import productScooter from '../assets/images/product-scooter.png';
import productWalker from '../assets/images/product-walker.png';
import productCube from '../assets/images/product-cube.png';
import productStackerFrog from '../assets/images/product-stacker-frog.png';

import catPlaysets from '../assets/icons/cat-playsets.png';
import catControl from '../assets/icons/cat-control.png';
import catEducational from '../assets/icons/cat-educational.png';
import catEco from '../assets/icons/cat-eco.png';
import catStuffed from '../assets/icons/cat-stuffed.png';

import avatar1 from '../assets/images/avatar-1.png';
import avatar2 from '../assets/images/avatar-2.png';
import avatar3 from '../assets/images/avatar-3.png';

import gallery1 from '../assets/images/gallery-1.jpg';
import gallery2 from '../assets/images/gallery-2.jpg';
import gallery3 from '../assets/images/gallery-3.jpg';
import gallery4 from '../assets/images/gallery-4.jpg';

export const topPicks = [
  {
    id: 1,
    title: 'Blocks shape-sorting Toy',
    price: 29,
    oldPrice: 39,
    rating: 0,
    sale: true,
    image: productBlocks,
    slug: 'blocks-shape-sorting-toy',
  },
  {
    id: 2,
    title: 'Magna etiam tempor orci',
    price: 29,
    oldPrice: 39,
    rating: 5,
    sale: true,
    image: productUnicorn,
  },
  {
    id: 3,
    title: 'Magna etiam tempor orci',
    price: 39,
    oldPrice: null,
    rating: 0,
    sale: false,
    image: productStacker,
  },
  {
    id: 4,
    title: 'Magna etiam tempor orci',
    price: 39,
    oldPrice: null,
    rating: 5,
    sale: false,
    image: productDeer,
  },
  {
    id: 5,
    title: 'Magna etiam tempor orci',
    price: 29,
    oldPrice: 39,
    rating: 0,
    sale: true,
    image: productRcCar,
  },
  {
    id: 6,
    title: 'Magna etiam tempor orci',
    price: 39,
    oldPrice: null,
    rating: 5,
    sale: false,
    image: productWoodenDog,
  },
  {
    id: 7,
    title: 'Hope scoot-around',
    price: 29,
    oldPrice: 39,
    rating: 0,
    sale: true,
    image: productScooter,
  },
  {
    id: 8,
    title: 'Magna etiam tempor orci',
    price: 39,
    oldPrice: null,
    rating: 0,
    sale: false,
    image: productWalker,
  },
];

export const customerLoves = [
  {
    id: 1,
    title: 'Magna etiam tempor orci',
    price: 29,
    oldPrice: 39,
    rating: 5,
    sale: true,
    image: productRcCar,
  },
  {
    id: 2,
    title: 'Magna etiam tempor orci',
    price: 29,
    oldPrice: 39,
    rating: 5,
    sale: true,
    image: productUnicorn,
  },
  {
    id: 3,
    title: 'Magna etiam tempor orci',
    price: 29,
    oldPrice: 39,
    rating: 5,
    sale: true,
    image: productCube,
    imageHasBorder: true,
  },
  {
    id: 4,
    title: 'Magna etiam tempor orci',
    price: 29,
    oldPrice: 39,
    rating: 5,
    sale: true,
    image: productStackerFrog,
  },
];

export const categories = [
  { id: 1, name: 'Playsets', slug: 'playsets', icon: catPlaysets },
  { id: 2, name: 'Control Toys', slug: 'control-toys', icon: catControl },
  { id: 3, name: 'Educational Toys', slug: 'educational-toys', icon: catEducational },
  { id: 4, name: 'Eco- Friendly Toys', slug: 'eco-friendly-toys', icon: catEco },
  { id: 5, name: 'Stuffed Toys', slug: 'stuffed-toys', icon: catStuffed },
];

export const testimonials = [
  {
    id: 1,
    name: 'Jessica',
    quote:
      'Sagittis vitae et leo duis ut diam quam nulla porttitor massa id neque aliquam.',
    avatar: avatar1,
  },
  {
    id: 2,
    name: 'John Smith',
    quote:
      'Sagittis vitae et leo duis ut diam quam nulla porttitor massa id neque aliquam vestibulum.',
    avatar: avatar2,
  },
  {
    id: 3,
    name: 'Andrea',
    quote:
      'Sagittis vitae et leo duis ut diam quam nulla porttitor massa id neque aliquam.',
    avatar: avatar3,
  },
];

export const gallery = [gallery1, gallery2, gallery3, gallery4];
