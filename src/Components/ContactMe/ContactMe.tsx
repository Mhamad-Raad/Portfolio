import { FC } from 'react';

import ContactMeForm from './ContactMeForm';

import { IoCallOutline } from 'react-icons/io5';
import { MdMailOutline } from 'react-icons/md';
import { IoLocationOutline } from 'react-icons/io5';

import './ContactMe.scss';

interface ContactMeInterface {}

const ContactMe: FC<ContactMeInterface> = () => {
  return (
    <section className='contact-me column' id='contact'>
      <h2 className='contact-me__title'>Contact Me</h2>
      <p className='contact-me__description'>
        Ready to elevate your user experience? or just want to learn more about
        me?, Let's collaborate and build a captivating online presence that
        leaves a lasting impression. Contact me personally today and let's
        create a front-end masterpiece together!
      </p>
      <div className='contact-me__content row'>
        <div className='contact-me__content__info column'>
          <h3 className='contact-me__content__info__title'>
            Get in Touch with Us
          </h3>
          <p className='contact-me__content__info__description'>
            We Value your feedback, questions, and suggestions. Please Reach out
            to us if you have any inquiries or concerns we are here to help.
          </p>
          <div className='contact-me__content__info__seperator' />
          <div className='contact-me__content__info'>
            <div className='flex gap-3 items-center'>
              <IoCallOutline className='text-[22px]' />
              <p className='font-semibold text-[17px]'>+964 (770) 123 4567</p>
            </div>
            <div className='flex gap-3 items-center'>
              <MdMailOutline className='text-[22px]' />
              <p className='font-semibold text-[17px]'>info@company.com</p>
            </div>
            <div className='flex gap-3 items-center'>
              <IoLocationOutline className='text-[22px]' />
              <p className='font-semibold text-[17px]'>
                Bakrajo, Sulaimaniyah, Kurdistan Region, Iraq
              </p>
            </div>
          </div>
        </div>
        <ContactMeForm />
      </div>
    </section>
  );
};

export default ContactMe;
