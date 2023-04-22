import { FC, useState } from 'react';

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
  return (
    <div className='modal row'>
      <p className='modal__text'>{text}</p>
      <button type='button' onClick={cLickHandler} className='modal__btn'>
        <FaRegWindowClose />
      </button>
    </div>
  );
};

export default Modal;
