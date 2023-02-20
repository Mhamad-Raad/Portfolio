// import { Link } from 'react-router-dom';
// import './variables.scss'
import './Navbar.scss';

const Header: React.FC<{}> = () => {
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
