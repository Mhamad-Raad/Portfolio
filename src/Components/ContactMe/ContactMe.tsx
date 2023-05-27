import { FC } from 'react';

import ContactMeForm from './ContactMeForm';
import Blob from '../CanvaObjects/Blob/Blob';

import './ContactMe.scss';

interface ContactMeInterface {}

const ContactMe: FC<ContactMeInterface> = () => {
  return (
    <section className='contact-me column' id='contact'>
      <h2 className='contact-me__title'>Contact Me</h2>
      <p className='contact-me__description'>
        Ready to elevate your user experience? or just want to learn more about
        me?, Let's collaborate and build a captivating online presence that
        leaves a lasting impression. Contact me personally today and let's create a
        front-end masterpiece together!
      </p>
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
