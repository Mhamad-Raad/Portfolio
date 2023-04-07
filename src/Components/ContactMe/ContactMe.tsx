import { FC } from 'react';

import Blob from '../CanvaObjects/Blob/Blob';

import './ContactMe.scss';

interface ContactMeInterface {}

const ContactMe: FC<ContactMeInterface> = () => {
  return (
    <section className='contact-me column'>
      <h2 className='contact-me__title'>Contact Me</h2>
      <Blob />
    </section>
  );
};

export default ContactMe;
