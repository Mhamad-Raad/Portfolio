import { Link } from 'react-scroll';

import { FC } from 'react';
import useWindowSize from '../../CustomHooks/UseScreenSize';

import './Navbar.scss';

interface Props {}

const Header: FC<Props> = () => {
  const { width }: { width: number } = useWindowSize();

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
        <input type='checkbox' id='mobile-nav__check' title='menu' />
        <div className='mobile-nav__hamburger' />
        <div className='bg' />
        <ul className='mobile-nav__items column'>
          <li>
            <Link
              to='about-me'
              ignoreCancelEvents={true}
              smooth={true}
              duration={500}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to='projects'
              ignoreCancelEvents={true}
              smooth={true}
              duration={500}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              to='experience'
              ignoreCancelEvents={true}
              smooth={true}
              duration={500}
            >
              Experience
            </Link>
          </li>
          <li>
            <Link
              to='contact'
              ignoreCancelEvents={true}
              smooth={true}
              duration={500}
            >
              Contact
            </Link>
          </li>
        </ul>
      </label>
    </nav>
  );
};

export default Header;
