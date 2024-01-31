import { FC, useRef } from 'react';
import { useInView } from 'framer-motion';

import './CircleSkill.scss';

interface Props {
  img: string;
  title: string;
}

const BallSkill: FC<Props> = ({ img, title }) => {
  const animationDelay: number = Math.random();
  const ref = useRef<HTMLImageElement | null>(null);
  const inView: boolean = useInView(ref, { once: true });

  return (
    // the below comment is comming in a future update
    /* hint-disable(-next)-line no-inline-styles*/
    <img
      className='circle-skill'
      ref={ref}
      style={{
        animationDelay: `${animationDelay}s`,
        opacity: inView ? 1 : 0,
      }}
      src={img}
      title={title}
      alt={title}
    />
  );
};

export default BallSkill;
