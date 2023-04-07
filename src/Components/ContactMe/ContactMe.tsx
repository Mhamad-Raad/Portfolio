import { FC } from 'react';

import Blob from '../CanvaObjects/Blob/Blob';

import './ContactMe.scss';

interface ContactMeInterface {}

const ContactMe: FC<ContactMeInterface> = () => {
  return (
    <section className='contact-me column'>
      <h2 className='contact-me__title'>Contact Me</h2>
      <div className='contact-me__content row'>
        <form className='contact-me__content__form column'>
          <h3 className='contact-me__content__form__title'> Let's Connect</h3>
          <input type='text' placeholder='Name' />
          <input type='email' placeholder='Email' />
          <textarea placeholder='Message' />
          <button type='submit'>Send</button>
        </form>
        <Blob />
      </div>
    </section>
  );
};

export default ContactMe;
