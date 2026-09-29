import TopBar from '../components/TopBar/TopBar.jsx';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import { blogPosts, slugify } from '../data/blogPosts.js';
import './BlogDetail.css';

const categoryNotes = {
  'Education and Development': 'Play gives children a hands-on way to explore new skills at their own pace. Offer a few choices, follow their interests, and let them try more than one way to solve a challenge.',
  'Toy Safety': 'Choose toys suited to your child’s age and abilities, check them regularly for worn or loose parts, and keep play spaces clear. Simple habits help make everyday play more comfortable for everyone.',
  'Toy Trends': 'The toys that last are often the ones children can use in many ways. Open-ended pieces leave space for new ideas as children’s interests and confidence grow.',
  'Customer Stories': 'There is no single right way to play. Sharing the moment, listening to a child’s ideas, and celebrating their small discoveries can make ordinary afternoons feel special.',
  'Events and Promotions': 'Make time for a little shared creativity. A simple activity, a few favorite toys, and room for everyone to join in can turn a get-together into a happy memory.',
};

function getArticleParagraphs(post) {
  const tag = post.tags[0].toLowerCase();
  return [
    post.excerpt,
    categoryNotes[post.category],
    `Start with ${tag === 'family fun' ? 'a moment you can enjoy together' : tag === 'toy reviews' ? 'what your child enjoys and is ready to explore' : 'an activity your child already finds interesting'}. Keep the play relaxed and let their curiosity guide what happens next. A little encouragement can help them stay engaged without taking over the fun.`,
    'Every child develops in their own time, so focus on the moments of discovery rather than getting everything right. With a little space to experiment, play can become a rewarding part of the day for the whole family.',
  ];
}

function BlogDetail() {
  const currentSlug = decodeURIComponent(window.location.pathname.split('/').filter(Boolean).at(-1) || '');
  const post = blogPosts.find((item) => slugify(item.title) === currentSlug);
  const relatedPosts = post ? blogPosts.filter((item) => item !== post && item.category === post.category).slice(0, 3) : [];

  return <>
    <TopBar />
    <Header />
    <main className="blog-detail-page">
      <div className="blog-detail-container">
        <nav className="blog-detail-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog">News</a><span aria-hidden="true">/</span><span>{post?.title || 'Article not found'}</span></nav>
        {post ? <>
          <article className="blog-article">
            <header className="blog-article__header">
              <a className="blog-article__category" href="/blog">{post.category}</a>
              <h1>{post.title}</h1>
              <div className="blog-article__meta"><time>{post.date}</time><span aria-hidden="true">·</span><span>{post.tags.join(' · ')}</span></div>
            </header>
            <img className="blog-article__image" src={post.image} alt="Children learning and playing with toys" />
            <div className="blog-article__content">
              <p className="blog-article__lead">{post.excerpt}</p>
              {getArticleParagraphs(post).slice(1).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              <div className="blog-article__tags"><span>Tags:</span>{post.tags.map((tag) => <a key={tag} href="/blog">{tag}</a>)}</div>
            </div>
          </article>
          <section className="blog-related" aria-labelledby="blog-related-title">
            <h2 id="blog-related-title">Related articles</h2>
            <div className="blog-related__grid">{relatedPosts.map((related) => <a className="blog-related-card" href={`/blog/${slugify(related.title)}`} key={related.title}><img src={related.image} alt="" /><span>{related.category}</span><h3>{related.title}</h3><time>{related.date}</time></a>)}</div>
            <a className="blog-back-link" href="/blog">← Back to all articles</a>
          </section>
        </> : <section className="blog-not-found"><h1>We couldn’t find that article</h1><p>It may have moved. Browse the latest stories and find another article to enjoy.</p><a href="/blog">Explore the blog</a></section>}
      </div>
    </main>
    <Footer />
  </>;
}

export default BlogDetail;
