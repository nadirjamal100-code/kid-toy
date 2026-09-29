import { useMemo, useState } from 'react';
import TopBar from '../components/TopBar/TopBar.jsx';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import promoBanner from '../assets/images/blog-promo.jpg';
import { blogCategories as categories, blogPosts as posts, blogTags as tags, slugify } from '../data/blogPosts.js';
import './Blog.css';

function SearchForm({ value, onChange }) {
  return <form className="blog-search" role="search" onSubmit={(event) => event.preventDefault()}><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search" aria-label="Search blog posts" /><button aria-label="Search blog posts" type="submit"><SearchIcon /></button></form>;
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6"/><path d="m16 16 4.5 4.5"/></svg>;
}

function Blog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => posts.filter((post) =>
    (!category || post.category === category) && (!tag || post.tags.includes(tag)) &&
    (!search || `${post.title} ${post.excerpt} ${post.category} ${post.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase()))
  ), [search, category, tag]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 4));
  const pagePosts = filtered.slice((page - 1) * 4, page * 4);
  const selectCategory = (value) => { setCategory((current) => current === value ? '' : value); setPage(1); };
  const selectTag = (value) => { setTag((current) => current === value ? '' : value); setPage(1); };

  return <>
    <TopBar />
    <Header />
    <main className="blog-page">
      <div className="blog-container">
        <nav className="blog-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>News</span></nav>
        <div className="blog-layout">
          <aside className="blog-sidebar" aria-label="Blog filters and recent posts">
            <h1>Blog standard</h1>
            <SearchForm value={search} onChange={(value) => { setSearch(value); setPage(1); }} />
            <section className="blog-panel">
              <h2>Categories</h2>
              <ul className="blog-categories">{categories.map((item) => <li key={item}><button type="button" className={category === item ? 'is-active' : ''} onClick={() => selectCategory(item)}><span aria-hidden="true">{category === item ? '−' : '+'}</span>{item}</button></li>)}</ul>
            </section>
            <section className="blog-panel">
              <h2>Recent Posts</h2>
              <ul className="blog-recent">{posts.slice(0, 3).map((post) => <li key={post.title}><a href={`/blog/${slugify(post.title)}`}><img src={post.image} alt="" /><span>{post.title}</span></a></li>)}</ul>
            </section>
            <section className="blog-panel">
              <h2>Popular Tag</h2>
              <div className="blog-tags">{tags.map((item) => <button type="button" key={item} className={tag === item ? 'is-active' : ''} aria-pressed={tag === item} onClick={() => selectTag(item)}>{item}</button>)}</div>
            </section>
            <a className="blog-promo" href="/shop" aria-label="Shop toys at delightful prices"><img src={promoBanner} alt="Dream Toys at Delightful Prices! 15% off on kids’ toys and gifts. Shop now." /></a>
          </aside>
          <section className="blog-results" aria-label="Blog posts">
            {pagePosts.length ? pagePosts.map((post) => <article className="blog-card" key={post.title}>
              <a className="blog-card__image" href={`/blog/${slugify(post.title)}`} aria-label={`Read ${post.title}`}><img src={post.image} alt="Children learning and playing with toys" /></a>
              <div className="blog-card__body">
                <time className="blog-date"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 2v3M15 2v3M3 7h14M4 4h12a1 1 0 0 1 1 1v11H3V5a1 1 0 0 1 1-1Z"/></svg>{post.date}</time>
                <h2><a href={`/blog/${slugify(post.title)}`}>{post.title}</a></h2>
                <p>{post.excerpt}</p>
              </div>
            </article>) : <p className="blog-empty" role="status">No posts found. Try a different search or filter.</p>}
            {filtered.length > 4 && <nav className="blog-pagination" aria-label="Blog pages">
              <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((value) => <button type="button" key={value} className={page === value ? 'is-current' : ''} aria-current={page === value ? 'page' : undefined} onClick={() => setPage(value)}>{value}</button>)}
              <button type="button" aria-label="Next page" disabled={page === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>›</button>
            </nav>}
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </>;
}

export default Blog;
