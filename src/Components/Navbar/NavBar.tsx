import { Link } from 'react-scroll';

import { FC, useState, useEffect } from 'react';
import useWindowSize from '../../CustomHooks/UseScreenSize';

import './Navbar.scss';

interface Props {}

const Header: FC<Props> = () => {
  const { width }: { width: number } = useWindowSize();
  const [opened, setOpened] = useState(false);
  const openHandle = () => {
    setOpened(!opened);
  };

  useEffect(() => {
    if (opened) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'visible';
  }, [opened]);

  if (width > 768) {
    return (
      <ul className='nav'>
        <li className='nav__logo'>Logo</li>
        <li className='nav__Links'>
          <div className='nav__Links__item'>
            <Link
              to='about-me'
              ignoreCancelEvents={true}
              smooth={true}
              duration={750}
              onClick={openHandle}
            >
              About
            </Link>
          </div>
          <div className='nav__Links__item'>
            <Link
              to='experience'
              ignoreCancelEvents={true}
              smooth={true}
              duration={1000}
              onClick={openHandle}
            >
              Experience
            </Link>
          </div>
          <div className='nav__Links__item'>
            <Link
              to='projects'
              ignoreCancelEvents={true}
              smooth={true}
              duration={1200}
              onClick={openHandle}
            >
              Projects
            </Link>
          </div>
          <div className='nav__Links__item'>
            <Link
              to='experience'
              ignoreCancelEvents={true}
              smooth={true}
              duration={1000}
              onClick={openHandle}
            >
              Contact
            </Link>
          </div>
        </li>
      </ul>
    );
  }

  return (
    <nav className='mobile-nav row'>
      <div className='mobile-nav__logo'>Logo</div>
      <label htmlFor='mobile-nav__check' className='mobile-nav__btn'>
        <input
          type='checkbox'
          id='mobile-nav__check'
          title='menu'
          checked={opened}
          onChange={openHandle}
        />
        <div className='mobile-nav__hamburger' />
        <div className='bg' />
        <ul className='mobile-nav__items column'>
          <li>
            <Link
              to='about-me'
              ignoreCancelEvents={true}
              smooth={true}
              duration={750}
              onClick={openHandle}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to='experience'
              ignoreCancelEvents={true}
              smooth={true}
              duration={1000}
              onClick={openHandle}
            >
              Experience
            </Link>
          </li>
          <li>
            <Link
              to='projects'
              ignoreCancelEvents={true}
              smooth={true}
              duration={1200}
              onClick={openHandle}
            >
              Projects
            </Link>
          </li>

          <li>
            <Link
              to='contact'
              ignoreCancelEvents={true}
              smooth={true}
              duration={1500}
              onClick={openHandle}
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
