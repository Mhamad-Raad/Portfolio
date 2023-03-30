import { FC } from 'react';
import './Categories.scss';

import StudentImg from '../../assets/Student.jpg';
import FrontendImg from '../../assets/Frontend.jpg';
import BackendImg from '../../assets/Backend.jpg';
import FlutterImg from '../../assets/frontend/Flutter.jpg';

interface CategoriesInterface { }

const Categories: FC<CategoriesInterface> = () => {
  return (
    <div className='skills-categories row'>
      <div className='skills-categories__card column'>
        <h3 className='skills-categories__card__title'>Front-end</h3>
        <img
          src={FrontendImg}
          alt='web'
          className='skills-categories__card__img'
        />
        <p className='skills-categories__card__description'>
          Developing responsive pixel perfect web-applications, following best
          practices during development, optimize performance, different
          development approches, such as mobile first development
        </p>
      </div>
      <div className='skills-categories__card column'>
        <h3 className='skills-categories__card__title'>Student</h3>
        <img
          src={StudentImg}
          alt='web'
          className='skills-categories__card__img'
        />
        <p className='skills-categories__card__description'>
          Continues Learner, Constantly trying new technologies out, keeping up
          to date and the new trends
        </p>
      </div>
      <div className='skills-categories__card column'>
        <h3 className='skills-categories__card__title'>Back-end</h3>
        <img
          src={BackendImg}
          alt='web'
          className='skills-categories__card__img'
        />
        <p className='skills-categories__card__description'>
          Developing API, authentication, authorization, using different
          approches such as Test Driven Development
        </p>
      </div>
      <div className='skills-categories__card column'>
        <h3 className='skills-categories__card__title'>Flutter</h3>
        <img
          src={FlutterImg}
          alt='web'
          className='skills-categories__card__img'
        />
        <p className='skills-categories__card__description'>
          Developing responsive, interactive and adaptive Flutter applications
        </p>
      </div>
    </div>
  );
};

export default Categories;
