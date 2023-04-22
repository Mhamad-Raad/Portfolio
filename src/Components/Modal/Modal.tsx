import { FC, useState, useEffect } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { FaRegWindowClose } from 'react-icons/fa';

import './Modal.scss';

interface ModalProps {
  text: string;
}

const Modal = ({ text, delay }: { text: string; delay: number }) => {
  const [modal, setModal] = useState(true);

  const cLickHandler = () => {
    setModal(false);
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      setModal(false);
    }, 7000 + (delay * 1000));

    return () => {
      clearTimeout(timer);
    };
  }, []);

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
          animate={{
            opacity: 1,
            y: 0,
          }}
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
