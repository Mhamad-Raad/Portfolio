import { FC } from 'react';

import CategoriesItem from './CategoriesItem';

import './Categories.scss';

import StudentImg from '../../../assets/Student.jpg';
import FrontendImg from '../../../assets/Frontend.jpg';
import BackendImg from '../../../assets/Backend.jpg';
import FlutterImg from '../../../assets/frontend/Flutter.jpg';

interface CategoriesInterface {}

const Categories: FC<CategoriesInterface> = () => {
  return (
    <div className='skills-categories row'>
      <CategoriesItem
        title='Front-end'
        img={FrontendImg}
        description='Developing responsive pixel perfect web-applications, following best
          practices during development, optimize performance, different
          development approches, such as mobile first development'
      />
      <CategoriesItem
        title='Student'
        img={StudentImg}
        description='Continues Learner, Constantly trying new technologies out, keeping up
          to date and the new trends'
      />
      <CategoriesItem
        title='Back-end'
        img={BackendImg}
        description='Developing API, authentication, authorization, using different
          approches such as Test Driven Development'
      />
      <CategoriesItem
        title='Flutter'
        img={FlutterImg}
        description='Developing responsive, interactive and adaptive Flutter applications'
      />
    </div>
  );
};

export default Categories;
