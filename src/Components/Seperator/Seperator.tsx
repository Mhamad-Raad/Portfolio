import { FC } from 'react';

import './Seperator.scss';

interface SeperatorProps {
  text: string;
  link: string;
  type: string;
}

const Seperator: FC<SeperatorProps> = ({ text, link, type }) => {
  return (
    <div className='seperator row'>
      <p className='seperator__text'>
        {text} <a href={link}>{type}</a>
      </p>
    </div>
  );
};

export default Seperator;
