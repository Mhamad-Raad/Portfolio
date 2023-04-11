import { FC } from 'react';

import './CircleSkill.scss';

interface Props {
  img: string;
  title: string;
}

const BallSkill: FC<Props> = ({ img, title }) => {
  const animationDelay: number = Math.random();

  return (
    <img
      className='circle-skill'
      style={{
        animationDelay: `${animationDelay}s`,
      }}
      src={img}
      title={title}
    />
  );
};

export default BallSkill;
