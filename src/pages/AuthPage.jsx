import { useState } from 'react';
import TopBar from '../components/TopBar/TopBar.jsx';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import productBlocks from '../assets/images/product-blocks.png';
import { getSignedInUser, loginAccount, registerAccount, signOut } from '../data/auth.js';
import './AuthPage.css';

function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const [user, setUser] = useState(getSignedInUser);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '');
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');
    const confirmPassword = String(data.get('confirmPassword') || '');
    if (isRegister && password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const signedIn = isRegister
        ? await registerAccount({ name, email, password })
        : await loginAccount({ email, password });
      setUser(signedIn);
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function handleSignOut() {
    signOut();
    setUser(null);
  }

  return <>
    <TopBar />
    <Header />
    <main className="auth-page">
      <div className="auth-page__container">
        <nav className="auth-page__breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>{user ? 'My account' : isRegister ? 'Register' : 'Login'}</span></nav>
        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-card__art" aria-hidden="true">
            <span className="auth-card__spark auth-card__spark--one">✦</span>
            <span className="auth-card__spark auth-card__spark--two">✦</span>
            <span className="auth-card__orb" />
            <img className="auth-card__toy" src={productBlocks} alt="" />
            <div className="auth-card__art-copy"><span>Made for little moments</span><h2>Play, learn<br />and grow.</h2><p>Find something wonderful for every little explorer.</p><a href="/shop">Explore the toys <span aria-hidden="true">→</span></a></div>
          </div>
          <div className="auth-card__content">
            {user ? <div className="auth-card__signed-in">
              <span className="auth-card__check" aria-hidden="true">✓</span>
              <p className="auth-card__eyebrow">Welcome back</p>
              <h1 id="auth-title">Hello, {user.name.split(' ')[0]}!</h1>
              <p className="auth-card__intro">You’re signed in as <strong>{user.email}</strong>.</p>
              <a className="auth-card__submit" href="/account">Go to my account</a>
              <button className="auth-card__signout" onClick={handleSignOut}>Sign out</button>
            </div> : <>
              <p className="auth-card__eyebrow">{isRegister ? 'Join our little community' : 'Welcome back'}</p>
              <h1 id="auth-title">{isRegister ? 'Create account' : 'Log in'}</h1>
              <p className="auth-card__intro">{isRegister ? 'Create an account to make shopping easier.' : 'Log in to continue to your account.'}</p>
              <form className="auth-form" onSubmit={submit}>
                {isRegister && <label className="auth-form__field"><span>Full name</span><input name="name" type="text" autoComplete="name" placeholder="Your name" required minLength="2" /></label>}
                <label className="auth-form__field"><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
                <label className="auth-form__field"><span>Password</span><span className="auth-form__password"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'} required minLength="8" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></span></label>
                {isRegister && <label className="auth-form__field"><span>Confirm password</span><input name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Enter your password again" required minLength="8" /></label>}
                {error && <p className="auth-form__error" role="alert">{error}</p>}
                <button className="auth-card__submit" type="submit" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}</button>
              </form>
              <p className="auth-card__switch">{isRegister ? 'Already have an account?' : 'New to Rainbow Rattles?'} <a href={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</a></p>
              <p className="auth-card__local-note">Your account is securely saved to our store database.</p>
            </>}
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </>;
}

export default AuthPage;
