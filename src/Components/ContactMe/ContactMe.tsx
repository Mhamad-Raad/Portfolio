import { FC, FormEvent, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

import Blob from '../CanvaObjects/Blob/Blob';

import './ContactMe.scss';

interface ContactMeInterface {}

const ContactMe: FC<ContactMeInterface> = () => {
  const form = useRef<HTMLFormElement | null>(null);

  const formSubmissionHandler = (e: FormEvent) => {
    e.preventDefault();

    if (form.current === null) return;

    emailjs
      .sendForm(
        'service_qz4ugws',
        'template_mi83gfy',
        form.current,
        'user_HuKpwTBqfsVm40phvlXmn'
      )
      .then(
        (_) => {
          form.current?.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <section className='contact-me column' id='contact'>
      <h2 className='contact-me__title'>Contact Me</h2>
      <div className='contact-me__content row'>
        <motion.form
          ref={form}
          className='contact-me__content__form column'
          onSubmit={formSubmissionHandler}
        >
          <h3 className='contact-me__content__form__title'> Let's Connect</h3>
          <input
            type='text'
            placeholder='Full Name'
            name='user_name'
            required
          />
          <input type='email' placeholder='Email' name='user_email' required />
          <textarea placeholder={`What's up?`} name='user_message' required />
          <button type='submit' value='Send'>
            Send
          </button>
        </motion.form>

        <div className='contact-me__content__blob column'>
          <Blob />
        </div>
      </div>
    </section>
  );
};

export default ContactMe;
