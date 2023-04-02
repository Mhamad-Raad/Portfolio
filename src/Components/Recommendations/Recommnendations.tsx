import { FC } from 'react';

import './Recommentations.scss';

interface RecommentationsInterface {}

const Recommentations: FC<RecommentationsInterface> = () => {
  return (
    <section className='recomendation-section column'>
      <h2 className='recomendation-section__title'>Recommentations</h2>
    </section>
  );
};

export default Recommentations;
