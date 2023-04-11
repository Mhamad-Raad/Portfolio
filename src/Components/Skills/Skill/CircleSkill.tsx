import { FC } from 'react';

import './CircleSkill.scss';

interface Props {
  img: string;
  title: string;
}

const BallSkill: FC<Props> = ({ img, title }) => {
  const animationDelay: number = Math.random();

  return (
    // the below comment is comming in a future update
    /* hint-disable(-next)-line no-inline-styles*/
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
