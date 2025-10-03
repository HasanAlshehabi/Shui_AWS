import './header.css'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
         <div className="title-wrap">
            <span className="ribbon" aria-hidden="true"><span className="ribbon-letter">S</span></span>
            <h1 className="title">Shui</h1>
          </div>
          <div className="nav-spacer" />
        </div>
     
    </header>
  );
}
