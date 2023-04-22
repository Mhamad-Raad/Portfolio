import { FC } from 'react';

import './Modal.scss';

interface ModalProps {
  text: string;
}

const Modal: FC<ModalProps> = ({ text }) => {
  return (
    <div className='Modal row'>
      <p>{text}</p>
      <button>
        <i className='fas fa-times'></i>
      </button>
    </div>
  );
};

export default Modal;
