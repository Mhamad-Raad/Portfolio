import { FC } from 'react';

interface SeperatorProps {
  text: string;
}

const Seperator: FC<SeperatorProps> = ({ text }) => {
  return (
    <div className='seperator'>
      <p className='Seperator__text'>{text}</p>
    </div>
  );
};

export default Seperator;
