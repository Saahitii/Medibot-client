import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => (
    <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 2rem',
        background: '#1E40AF',
        color: '#fff',
        width: '100%',
        height:'70px',
        position: 'fixed',
        top: 0,
        left: 0,

    }}>
        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '1.3rem', cursor: 'pointer' }}>
            <button
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.5rem',
                    marginRight: '0.5rem',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    outline: 'none',
                    boxShadow: 'none',
                }}
            >
                &#9776;
            </button>
            MediAssist AI
        </div>
        <div>
            <Link to="/" style={navLinkStyle}>Home</Link>
            <Link to="/chatbot" style={navLinkStyle}>ChatBot</Link>
            <Link to="/appointment" style={navLinkStyle}>Appointment</Link>
            <Link to="/nearByHospitals" style={navLinkStyle}>NearbyHospitals</Link>
            {localStorage.getItem('token') ? (
  <>
    <button
      onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        window.location.reload(); // Quick reload to update UI, or use navigation/state management
      }}
      style={navLinkStyle}
    >
      Logout
    </button>
  </>
) : (
  <>
    <Link to="/login" style={navLinkStyle}>Login</Link>
    <Link to="/signup" style={navLinkStyle}>Sign Up</Link>
  </>
)}

        </div>
    </nav>
);

const navLinkStyle = {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '1.5rem',
    fontSize: '1rem',
    fontWeight: '500'
};

export default Navbar;
