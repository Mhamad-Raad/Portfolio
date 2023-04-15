import { FC } from 'react';

import { FaLinkedin, FaGithubSquare } from 'react-icons/fa';

import './Footer.scss';

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  return (
    <div className='footer column'>
      <p className='footer__made-by'>Made with ❤️</p>
      <div className='footer__social-medias row'>
        <a
          href='https://www.linkedin.com/in/mhamad-raad'
          className='footer__social-medias__link row'
        >
          <FaLinkedin />
          <p>Mhamad Radd</p>
        </a>
        <a
          href='https://github.com/Mhamad-Raad'
          className='footer__social-medias__link row'
        >
          <FaGithubSquare />
          <p>Mhamad-Radd</p>
        </a>
      </div>
      <p className='footer__copy-rights'>© 2023 - All rights reserved</p>
      <p className='footer__special-thanks'>
        Special thanks to and everyone else who their tutorials, 3d models and
        code helped through.
      </p>
    </div>
  );
};

export default Footer;
