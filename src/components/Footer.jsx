import './Footer.css'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <span>© {year} Daniel Mehler</span>
      <a href="#top">
        Back to top <span aria-hidden="true">&uarr;</span>
      </a>
    </footer>
  )
}

export default Footer
