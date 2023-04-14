import { FC } from 'react';

import './Footer.scss';

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  return (
    <div className='footer column'>
      <p className='footer__made-by'>
        Made with ❤️ by <a href='\kjgsrn'>Mhamad Raad</a>
      </p>
      <p className='footer__copy-rights'>© 2023 - All rights reserved</p>
      <p className='foor__social-medias row'>
        <a href=''>
          <i className='fab fa-facebook-f'></i>
        </a>
        <a href=''>
          <i className='fab fa-instagram'></i>
        </a>
      </p>
      <p className='footer__special-thanks'>
        Special thanks to <a href=''>Dev Ed</a> and everyone else who their
        tutorials, 3d models and code helped through.
      </p>
    </div>
  );
};

export default Footer;
