import { FC } from 'react';

import ContactMeForm from './ContactMeForm';
import Blob from '../CanvaObjects/Blob/Blob';

import './ContactMe.scss';

interface ContactMeInterface {}

const ContactMe: FC<ContactMeInterface> = () => {
  return (
    <section className='contact-me column' id='contact'>
      <h2 className='contact-me__title'>Contact Me</h2>
      <div className='contact-me__content row'>
        <ContactMeForm />
        <div className='contact-me__content__blob column'>
          <Blob />
        </div>
      </div>
    </section>
  );
};

export default ContactMe;
