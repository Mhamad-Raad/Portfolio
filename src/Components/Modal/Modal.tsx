import { FC, useState } from 'react';

import { delay, motion } from 'framer-motion';
import { FaRegWindowClose } from 'react-icons/fa';

import './Modal.scss';

interface ModalProps {
  text: string;
}

const Modal: FC<ModalProps> = ({ text }) => {
  const [modal, setModal] = useState(true);

  const cLickHandler = () => {
    setModal(false);
  };

  return modal ? (
    <motion.div
      className='modal row'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 10, duration: 1 }}
    >
      <p className='modal__text'>{text}</p>
      <button type='button' onClick={cLickHandler} className='modal__btn'>
        <FaRegWindowClose />
      </button>
    </motion.div>
  ) : (
    <></>
  );
};

export default Modal;
