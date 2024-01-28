import { Link } from 'react-scroll';

import { FC, useState, useEffect } from 'react';
import useWindowSize from '../../CustomHooks/UseScreenSize';
import { useMotionValueEvent, useScroll } from 'framer-motion';

import Logo from '../../assets/Logo.png';

import './Navbar.scss';

interface Props {}

const Header: FC<Props> = () => {
  const { width }: { width: number } = useWindowSize();
  const [opened, setOpened] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  const openHandle = () => {
    setOpened(!opened);
  };

  useEffect(() => {
    if (opened) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'visible';
  }, [opened]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 725 && !scrolled) {
      setScrolled(true);
    } else if (latest < 725 && scrolled) {
      setScrolled(false);
    }
  });

  if (width > 768) {
    return (
      <ul className={`nav ${scrolled && 'scrolled'}`}>
        <li className='nav__logo'>
          <img src={Logo} alt='logo' title='Logo' />
        </li>
        <li className='nav__Links'>
          <Link
            to='about-me'
            className='nav__Links__item'
            ignoreCancelEvents={true}
            smooth={true}
            duration={750}
          >
            About
          </Link>

          <Link
            className='nav__Links__item'
            to='experience'
            ignoreCancelEvents={true}
            smooth={true}
            duration={1000}
          >
            Experience
          </Link>

          <Link
            className='nav__Links__item'
            to='projects'
            ignoreCancelEvents={true}
            smooth={true}
            duration={1200}
          >
            Projects
          </Link>

          <Link
            className='nav__Links__item'
            to='contact'
            ignoreCancelEvents={true}
            smooth={true}
            duration={2000}
          >
            Contact
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <nav className={`mobile-nav row ${scrolled && 'scrolled'}`}>
      <img src={Logo} className='mobile-nav__logo' alt='Logo' title='Logo' />
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
              spy={true}
              activeClass='mobile-active'
              ignoreCancelEvents={true}
              smooth={true}
              offset={-75}
              duration={750}
              onClick={openHandle}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to='experience'
              spy={true}
              activeClass='mobile-active'
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
              spy={true}
              activeClass='mobile-active'
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
              spy={true}
              activeClass='mobile-active'
              ignoreCancelEvents={true}
              smooth={true}
              offset={-75}
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
