import Icon from '../components/Icon';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p className="mono">© {new Date().getFullYear()} Daniel Mehler</p>
      <a className="footer__top" href="#top">
        Back to top
        <Icon name="arrowUp" size={14} />
      </a>
    </footer>
  );
}
