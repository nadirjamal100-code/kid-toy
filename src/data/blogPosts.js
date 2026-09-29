import postPlay from '../assets/images/blog-post-1.jpg';
import postProblem from '../assets/images/blog-post-2.jpg';
import postSocial from '../assets/images/blog-post-3.jpg';
import postLanguage from '../assets/images/blog-post-4.jpg';

export const blogCategories = ['Education and Development', 'Toy Safety', 'Toy Trends', 'Customer Stories', 'Events and Promotions'];
export const blogTags = ['Learn & Inspire', 'Top Toy', 'Family fun', 'Toy Reviews', 'Toy Trends', 'Tips & Tricks'];

export function slugify(title) {
  return title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const blogPosts = [
  { title:'Enhancing motor skills through play', date:'March 24, 2024', image:postPlay, category:blogCategories[0], tags:['Learn & Inspire','Family fun'], excerpt:'Motor skills are divided into two categories: fine motor skills and gross motor skills. Toys play a vital role in the development of both.' },
  { title:'Fostering problem solving skills', date:'Feb 12, 2024', image:postProblem, category:blogCategories[0], tags:['Learn & Inspire','Top Toy'], excerpt:'Problem-solving is a critical skill that children begin to develop from a very young age through interactive and engaging play. Toys that challenge children to think and strategize encourage this development.' },
  { title:'Emotional and Social Development', date:'Jun 16, 2023', image:postSocial, category:blogCategories[0], tags:['Family fun','Tips & Tricks'], excerpt:'Toys also help children express their emotions and understand those of others, which is foundational for developing empathy and interpersonal skills.' },
  { title:'Language Development and Social Skills', date:'September 16, 2023', image:postLanguage, category:blogCategories[0], tags:['Learn & Inspire','Tips & Tricks'], excerpt:'Language development is significantly influenced by interactive play. Toys that involve multiple participants can help develop this skill, as well as social skills.' },
  { title:'Choosing safe toys for every age', date:'August 08, 2023', image:postPlay, category:blogCategories[1], tags:['Toy Reviews','Tips & Tricks'], excerpt:'A few simple checks can help you choose age-appropriate toys that make playtime both joyful and safe.' },
  { title:'The toys little ones love right now', date:'July 21, 2023', image:postProblem, category:blogCategories[2], tags:['Toy Trends','Top Toy'], excerpt:'From open-ended building to imaginative play, discover the toys inspiring curious minds this season.' },
  { title:'A little more joy in family playtime', date:'May 12, 2023', image:postSocial, category:blogCategories[3], tags:['Family fun','Learn & Inspire'], excerpt:'Small moments spent playing together can become the stories your family remembers for years.' },
  { title:'Join us for a celebration of play', date:'April 03, 2023', image:postLanguage, category:blogCategories[4], tags:['Toy Trends','Family fun'], excerpt:'Meet our community and find playful ideas for your next family activity.' },
  { title:'Playful ways to learn something new', date:'March 18, 2023', image:postPlay, category:blogCategories[0], tags:['Learn & Inspire','Toy Reviews'], excerpt:'Everyday play gives young children a fun way to explore new ideas, build confidence, and follow their curiosity.' },
  { title:'Building big ideas one block at a time', date:'February 24, 2023', image:postProblem, category:blogCategories[2], tags:['Top Toy','Toy Trends'], excerpt:'Open-ended toys invite children to experiment, imagine, and turn a handful of pieces into something all their own.' },
  { title:'Play together, grow together', date:'January 30, 2023', image:postSocial, category:blogCategories[3], tags:['Family fun','Tips & Tricks'], excerpt:'Shared play creates room for little ones to practice listening, taking turns, and connecting with the people around them.' },
  { title:'Make room for more imagination', date:'January 12, 2023', image:postLanguage, category:blogCategories[4], tags:['Learn & Inspire','Toy Reviews'], excerpt:'A few simple creative activities can turn a quiet afternoon into a colorful adventure for the whole family.' },
];
