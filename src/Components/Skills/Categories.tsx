import { FC } from 'react';
import './Categories.scss';

interface CategoriesInterface {}

const Categories: FC<CategoriesInterface> = () => {
  return (
    <div className='skills-categories row'>
      <div className='skills-categories__card column'>
        <h3 className='skills-categories__card__title'>Front-end</h3>
        <p className='skills-categories__card__description'>
          Developing responsive pixel perfect web-applications, following best
          practices during development, optimize performance, different
          development approches, such as mobile first development
        </p>
      </div>
      <div className='skills-categories__card column'>
        <h3 className='skills-categories__card__title'>Student</h3>
        <p className='skills-categories__card__description'>
          Continues Learner, Constantly trying new technologies out, keeping up
          to date and the new trends
        </p>
      </div>
      <div className='skills-categories__card column'>
        <h3 className='skills-categories__card__title'>Back-end</h3>
        <p className='skills-categories__card__description'>
          Developing API, authentication, authorization, using different
          approches such as Test Driven Development
        </p>
      </div>
      <div className='skills-categories__card column'>
        <h3 className='skills-categories__card__title'>Flutter</h3>
        <p className='skills-categories__card__description'>
          Developing responsive, interactive and adaptive Flutter applications
        </p>
      </div>
    </div>
  );
};

export default Categories;
