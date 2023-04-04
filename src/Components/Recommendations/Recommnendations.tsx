import { FC } from 'react';

import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import Slide from './Slide';

import './Recommendations.scss';

interface RecommentationsInterface {}

const Recommentations: FC<RecommentationsInterface> = () => {
  return (
    <section className='recommendation-section column'>
      <h2 className='recommendation-section__title'>Recommentations</h2>

      <div className='recommendation-section__slideshow row'>
        <button
          type='button'
          className='recommendation-section__slideshow__left-scroll-button'
        >
          <FaAngleLeft />
        </button>
        <Slide />
        <Slide />
        <Slide />
        <button
          type='button'
          className='recommendation-section__slideshow__right-scroll-button'
        >
          <FaAngleRight />
        </button>
      </div>
    </section>
  );
};

export default Recommentations;
