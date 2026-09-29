import { useState } from 'react';
import TopBar from '../components/TopBar/TopBar.jsx';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import './FAQ.css';

const questions = [
  {
    question:'How will my order be delivered to me?',
    answer:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    question:'What do I need to know?',
    answer:'You’ll receive an order confirmation by email after checkout. Keep it handy so you can refer to your order details and contact our team if you need help.',
  },
  {
    question:'How will I know if order is placed successfully?',
    answer:'Once your order is placed, the confirmation page will show your order number and a confirmation email will be sent to the email address provided at checkout.',
  },
  {
    question:'How do I check the status of my order?',
    answer:'Sign in to your account and open My orders to see the latest status. You can also contact our customer service team for assistance with your order.',
  },
  {
    question:'Can I cancel my order?',
    answer:'Please contact our customer service team as soon as possible with your order number. We’ll let you know whether the order can still be cancelled.',
  },
];

function FAQ() {
  const [openQuestion, setOpenQuestion] = useState(0);

  return <>
    <TopBar />
    <Header />
    <main className="faq-page">
      <div className="faq-container">
        <nav className="faq-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>FAQ’s</span></nav>
        <h1 className="faq-title">FAQ’S</h1>
        <section className="faq-accordion" aria-label="Frequently asked questions">
          {questions.map(({ question, answer }, index) => {
            const isOpen = openQuestion === index;
            const answerId = `faq-answer-${index}`;
            return <article className={`faq-item${isOpen ? ' is-open' : ''}`} key={question}>
              <h2>
                <button type="button" className="faq-question" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenQuestion(isOpen ? -1 : index)}>
                  <span className="faq-question__symbol" aria-hidden="true" />
                  <span>{question}</span>
                </button>
              </h2>
              <div className={`faq-answer-wrap${isOpen ? ' is-open' : ''}`} id={answerId} aria-hidden={!isOpen}>
                <div className="faq-answer"><p>{answer}</p></div>
              </div>
            </article>;
          })}
        </section>
      </div>
    </main>
    <Footer />
  </>;
}

export default FAQ;
