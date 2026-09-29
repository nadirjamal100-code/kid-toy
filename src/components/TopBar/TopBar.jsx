import './TopBar.css';
import { getSignedInUser } from '../../data/auth.js';

function TopBar() {
  const user = getSignedInUser();
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <p className="topbar__message">
          <span className="topbar__icon" aria-hidden="true">{"\u{1F69A}"}</span>
          Free free shipping with over $150
        </p>
        <div className="topbar__links">
          {user ? <a href="/account">My account</a> : <><a href="/login">Login</a><span className="topbar__divider" /><a href="/register">Register</a></>}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
