import { useState, useEffect } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { FaRegWindowClose } from 'react-icons/fa';

import './Modal.scss';

const Modal = ({ text, delay }: { text: string; delay: number }) => {
  const [modal, setModal] = useState(true);
  let timer: number | NodeJS.Timeout;

  const cLickHandler = () => {
    setModal(false);
  };

  const setTimer = () => {
    return setTimeout(() => {
      setModal(false);
    }, 7000 + delay * 1000);
  };

  useEffect(() => {
    timer = setTimer();

    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          key='modal'
          className='modal row'
          initial={{
            opacity: 0,
            y: -100,
          }}
          onMouseEnter={() => clearTimeout(timer)}
          animate={{
            opacity: 1,
            y: 0,
          }}
          onMouseLeave={setTimer}
          exit={{
            opacity: 0,
            y: -100,
            transition: {
              duration: 0.5,
              delay: 0,
            },
          }}
          transition={{
            duration: 0.5,
            delay: delay,
          }}
        >
          <p className='modal__text'>{text}</p>
          <button type='button' onClick={cLickHandler} className='modal__btn'>
            <FaRegWindowClose />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
