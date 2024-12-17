import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Header = () => {
  const navigate = useNavigate();

  // Check if the user is logged in by looking for a token or email in cookies
  const isLoggedIn = !!Cookies.get('email'); // Replace 'email' with your cookie key for login

  const handleLogout = () => {
    // Clear cookies and other local storage related to the user
    Cookies.remove('email');
    Cookies.remove('isAdmin');
    navigate('/getstarted'); // Redirect to login or home page
  };

  return (
    <header className="header">
      <nav className="navbar">
        <ul className="nav-links">
          <li onClick={() => navigate('/course')}>Courses</li>
          <li>Careers</li>
          <li onClick={() => navigate('/about')}>About us</li>
        </ul>
        <div className="main-logo">
          <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            FLUENTPATH
          </h1>
        </div>
        <div className="nav-right">
          <ul className="nav-links">
            {isLoggedIn ? (
              <>
                <li onClick={handleLogout}>Logout</li>
                <li onClick={() => navigate('/enrolledcourse')}>Your courses</li>
              </>
            ) : (
              <>
                <button
                  className="fancy-button"
                  onClick={() => navigate('/getstarted')}
                >
                  Join now
                </button>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
