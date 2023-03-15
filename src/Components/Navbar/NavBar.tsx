// import { Link } from 'react-router-dom';
import './Navbar.scss';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <ul className='nav'>
      <li className='nav__logo'>Logo</li>
      <li className='nav__Links'>
        <div className='nav__Links__item'>Home</div>
        <div className='nav__Links__item'>About</div>
        <div className='nav__Links__item'>Contact</div>
      </li>
    </ul>
  );
};

export default Header;
