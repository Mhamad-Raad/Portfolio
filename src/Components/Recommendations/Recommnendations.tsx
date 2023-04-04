import { FC, useState, useEffect } from 'react';

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
        <div
          className='recommendation-section__slideshow__slide row'
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          <Slide />
          <Slide />
          <Slide />
        </div>
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
