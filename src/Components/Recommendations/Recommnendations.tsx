import { FC } from 'react';

import Slide from './Slide';

import './Recommendations.scss';

interface RecommentationsInterface {}

const Recommentations: FC<RecommentationsInterface> = () => {
  return (
    <section className='recommendation-section column'>
      <h2 className='recommendation-section__title'>Recommentations</h2>
      <div className='recommendation-section__slideshow row'>
          <Slide />
          <Slide />
          <Slide />
      </div>
    </section>
  );
};

export default Recommentations;
