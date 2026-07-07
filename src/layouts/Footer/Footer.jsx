import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-about">
            <h3 className="footer-logo">GDMSPL</h3>
            <p className="footer-desc">
              Pioneering innovative architectural solutions and crafting sustainable 
              spaces that inspire and elevate human experiences.
            </p>
            <div className="footer-contact-info">
              <p>Email: info@gdmspl.com</p>
              <p>Phone: +91 98765 43210</p>
              <p>Presence: Delhi, Mumbai, Nepal, Muscat</p>
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/#about">About Us</Link></li>
              <li><Link to="/categories">Projects</Link></li>
              <li><Link to="/#services">Services</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Legal</h4>
            <ul>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Terms of Service</Link></li>
              <li><Link to="#">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="LinkedIn">IN</a>
              <a href="#" aria-label="Twitter">X</a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GDMSPL. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
