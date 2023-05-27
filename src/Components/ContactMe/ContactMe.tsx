import { FC } from 'react';

import ContactMeForm from './ContactMeForm';
import Blob from '../CanvaObjects/Blob/Blob';

import './ContactMe.scss';

interface ContactMeInterface {}

const ContactMe: FC<ContactMeInterface> = () => {
  return (
    <section className='contact-me column' id='contact'>
      <h2 className='contact-me__title'>Contact Me</h2>
      <p className='contact-me__descriotion'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni impedit
        vel doloremque, adipisci est velit quasi, voluptates, suscipit odio
        consequatur officia eligendi sed consectetur tempora? Voluptatibus
        tempora incidunt nesciunt saepe.
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
