import { FC, FormEvent, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { FaSmileWink } from 'react-icons/fa';
import { motion } from 'framer-motion';

import Modal from '../Modal/Modal';

interface ContactMeFormProps {
  isInView: boolean;
}

const ContactMeForm: FC<ContactMeFormProps> = ({ isInView }) => {
  const [validEmail, setValidEmail] = useState<boolean>(true);
  const [validName, setValidName] = useState<boolean>(true);
  const [validText, setValidateText] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);

  const [submitError, setSubmitError] = useState<boolean>(false);

  const [submitted, setSubmitted] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);

  const form = useRef<HTMLFormElement | null>(null);

  const validateEmail = () => {
    if (form.current === null) return;

    const email = form.current.user_email.value;
    const regex = /\S+@\S+\.\S+/;

    if (regex.test(email)) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };

  const validateName = () => {
    if (form.current === null) return;

    const name = form.current.user_name.value;
    const regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

    if (regex.test(name)) {
      setValidName(true);
    } else {
      setValidName(false);
    }
  };

  const validateText = () => {
    if (form.current === null) return;

    const text = form.current.user_message.value;

    if (text.length > 0) {
      setValidateText(true);
    } else {
      setValidateText(false);
    }
  };

  const formSubmissionHandler = (e: FormEvent) => {
    e.preventDefault();

    if (form.current === null) return;

    const email = form.current.user_email.value;
    const name = form.current.user_name.value;
    const text = form.current.user_message.value;

    if (text.length === 0 || email.length === 0 || name.length === 0) {
      setShowModal(true);

      validateEmail();
      validateName();
      validateText();

      return;
    }

    setLoading(true);

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
          setSubmitted(true);
          setLoading(false);
        },
        (error) => {
          window.alert(
            `Sorry an error occured, Please try again Later. Error Message: ${error.message}`
          );
          setLoading(false);
          setSubmitError(true);
        }
      );
  };

  const error = !validEmail || !validName || !validText;
  return (
    <>
      {showModal && (
        <Modal text='Please fill out the form correctly' delay={1} />
      )}
      <motion.form
        ref={form}
        className={`contact-me__content__form column ${
          validText ? '' : 'error'
        }`}
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateX(0)' : 'translateX(100%)',
        }}
        onSubmit={formSubmissionHandler}
      >
        <h3 className='contact-me__content__form__title'> Let's Connect</h3>
        {error === true && (
          <div className='contact-me__content__form__error'>
            {!validEmail && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                * Please enter a valid email
              </motion.p>
            )}
            {!validName && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                * Please enter a Name email (no numbers, special characters)
              </motion.p>
            )}
            {!validText && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                * Please enter a Message,( more than 5 characters)
              </motion.p>
            )}
          </div>
        )}
        <input
          type='text'
          placeholder='Full Name'
          name='user_name'
          onBlur={validateName}
          className={validName ? '' : 'error'}
        />
        <input
          type='email'
          placeholder='Email'
          name='user_email'
          onBlur={validateEmail}
          className={validEmail ? '' : 'error'}
        />
        <textarea
          placeholder={`What's up?`}
          name='user_message'
          onBlur={validateText}
          className={validText ? '' : 'error'}
        />
        {loading && (
          <div className='lds-ring'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
        {!submitted && !loading && (
          <button
            type='submit'
            value='Send'
            className={validText ? '' : 'error'}
          >
            Send
          </button>
        )}
        {submitted && (
          <button type='button' value='Send' disabled={true}>
            Thanks
            <FaSmileWink />
          </button>
        )}

        {submitError && (
          <button type='button' value='Send' disabled={true}>
            Oops!!!
          </button>
        )}
      </motion.form>
    </>
  );
};

export default ContactMeForm;
