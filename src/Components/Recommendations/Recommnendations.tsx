import { FC } from 'react';

import './Recommendations.scss';

interface RecommentationsInterface {}

const Recommentations: FC<RecommentationsInterface> = () => {
  return (
    <section className='recommendation-section column'>
      <h2 className='recommendation-section__title'>Recommentations</h2>
    </section>
  );
};

export default Recommentations;
