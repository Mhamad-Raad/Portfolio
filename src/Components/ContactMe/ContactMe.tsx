import { FC } from 'react';

import './ContactMe.scss';

interface ContactMeInterface {}

const ContactMe: FC<ContactMeInterface> = () => {
  return (
    <section className='contact-me column'>
      <h2 className='contact-me__title'>Contact Me</h2>
    </section>
  );
};

export default ContactMe;
