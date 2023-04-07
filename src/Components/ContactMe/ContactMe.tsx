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
          <input type='text' placeholder='Full Name' required />
          <input type='email' placeholder='Email' required />
          <textarea placeholder={`What's up?`} required />
          <button type='submit'>Send</button>
        </form>

        <div className='contact-me__content__blob column'>
          <Blob />
        </div>
      </div>
    </section>
  );
};

export default ContactMe;
