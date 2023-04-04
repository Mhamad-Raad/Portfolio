import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';


import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import Slide from './Slide';

import './Recommendations.scss';

interface RecommentationsInterface {}

const Recommentations: FC<RecommentationsInterface> = () => {
  const [index, setIndex] = useState(0);

  const clickRightHandle = () => {
    setIndex(index + 1);
  };

    const clickLeftHandle = () => {
      setIndex(index - 1);
    };

  return (
    <section className='recommendation-section column'>
      <h2 className='recommendation-section__title'>Recommentations</h2>

      <div className='recommendation-section__slideshow row'>
        <button
          type='button'
          className='recommendation-section__slideshow__left-scroll-button'
          onClick={clickLeftHandle}
        >
          <FaAngleLeft />
        </button>
        <motion.div
          className='recommendation-section__slideshow__slide row'
          initial={{ x: 0 }}
          animate={{ x: -index * 100 + '%' }}
          transition={{ duration: 0.5 }}
        >
          <Slide />
          <Slide />
          <Slide />
        </motion.div>
        <button
          type='button'
          className='recommendation-section__slideshow__right-scroll-button'
          onClick={clickRightHandle}
        >
          <FaAngleRight />
        </button>
      </div>
    </section>
  );
};

export default Recommentations;
