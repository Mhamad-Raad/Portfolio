
const Header: React.FC<{}> = () => {
  return (
    <ul className='nav'>
      <li className="nav__logo">
        <a href="/">Logo</a>
      </li>
      <li className="nav__item">
        <a href="/">Home</a>
      </li>
      <li className="nav__item">
        <a href="/about">About</a>
      </li>
      <li className="nav__item">
        <a href="/contact">Contact</a>
      </li>
    </ul>
  )
}

export default Header;
