import { FC, useRef } from 'react';
import { useInView } from 'framer-motion';

import ContactMeForm from './ContactMeForm';

import { IoCallOutline } from 'react-icons/io5';
import { MdMailOutline } from 'react-icons/md';
import { IoLocationOutline } from 'react-icons/io5';

import './ContactMe.scss';

interface ContactMeInterface {}

const ContactMe: FC<ContactMeInterface> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  return (
    <section className='contact-me column' id='contact' ref={ref}>
      <h2
        className='contact-me__title'
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        Contact Me
      </h2>
      <p
        className='contact-me__description'
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        Ready to elevate your user experience? or just want to learn more about
        me?, Let's collaborate and build a captivating online presence that
        leaves a lasting impression. Contact me personally today and let's
        create a front-end masterpiece together!
      </p>
      <div className='contact-me__content row'>
        <div
          className='contact-me__content__info column'
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateX(0)' : 'translateX(-100%)',
          }}
        >
          <h3 className='contact-me__content__info__title'>
            Get in Touch with Me
          </h3>
          <p className='contact-me__content__info__description'>
            I Value your feedback, questions, and suggestions. Please Reach out
            to me if you have any inquiries or concerns I am here to help.
          </p>
          <div className='contact-me__content__info__seperator' />
          <div className='contact-me__content__info__social column'>
            <div className='contact-me__content__info__social__row row'>
              <IoCallOutline className='contact-me__content__info__social__row__icon' />
              <p className='contact-me__content__info__social__row__text'>
                (+964) 770 184 4913 || (+44) 7537 167153
              </p>
            </div>
            <div className='contact-me__content__info__social__row row'>
              <MdMailOutline className='contact-me__content__info__social__row__icon' />
              <p className='contact-me__content__info__social__row__text'>
                hamaraad883@gmail.com
              </p>
            </div>
          </div>
        </div>
        <ContactMeForm isInView={isInView} />
      </div>
    </section>
  );
};

export default ContactMe;
