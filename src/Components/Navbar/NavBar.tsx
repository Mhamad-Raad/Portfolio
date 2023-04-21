// import { Link } from 'react-router-dom';
import { forwardRef , FC, ForwardedRef, Ref} from 'react';

import useWindowSize from '../../CustomHooks/UseScreenSize';

import './Navbar.scss';

const Header = forwardRef<HTMLInputElement>((props, ref) => {
  const { width }: { width: number } = useWindowSize();

  
  console.log(ref);

  if (width > 768) {
    return (
      <ul className='nav'>
        <li className='nav__logo'>Logo</li>
        <li className='nav__Links'>
          <div className='nav__Links__item'>About</div>
          <div className='nav__Links__item'>Projects</div>
          <div className='nav__Links__item'>Experience</div>
          <div className='nav__Links__item'>Contact</div>
        </li>
      </ul>
    );
  }

  return (
    <nav className='mobile-nav row'>
      <div className='mobile-nav__logo'>Logo</div>
      <label htmlFor='mobile-nav__check' className='mobile-nav__btn'>
        <input type='checkbox' id='mobile-nav__check' title='menu' ref={ref} />
        <div className='mobile-nav__hamburger' />
        <ul className='mobile-nav__items column'>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </label>
    </nav>
  );
});

export default Header;
