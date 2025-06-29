import { FC } from 'react';

import { useRef } from 'react';
import { useInView } from 'framer-motion';

import CategoriesItem from './CategoriesItem';

import './Categories.scss';

import StudentImg from '../../../assets/Student.jpg';
import FrontendImg from '../../../assets/Frontend.jpg';
import BackendImg from '../../../assets/Backend.jpg';
import FlutterImg from '../../../assets/frontend/FRN.png';

interface CategoriesInterface {}

const Categories: FC<CategoriesInterface> = () => {
  const catRef = useRef<HTMLDivElement | null>(null);
  const isInView: boolean = useInView(catRef, { once: true });
  return (
    <div className='skills-categories row' ref={catRef}>
      <CategoriesItem
        inView={isInView}
        title='Front-end'
        img={FrontendImg}
        description='Building responsive, pixel-perfect web apps with a focus on performance, best practices, and modern approaches like mobile-first and TDD.'
      />
      <CategoriesItem
        inView={isInView}
        title='Tech Explorer'
        img={StudentImg}
        description='Continuous learner, always exploring new technologies and staying updated with the latest trends in the tech industry.'
      />
      <CategoriesItem
        inView={isInView}
        title='Back-end'
        img={BackendImg}
        description='Developing APIs with secure authentication and authorization. Experienced with Test-Driven Development (TDD) and RESTful principles.'
      />
      <CategoriesItem
        inView={isInView}
        title='Flutter / R Native'
        img={FlutterImg}
        description='Creating responsive and interactive mobile apps using Flutter and React Native, with a focus on adaptability across platforms and devices.'
      />
    </div>
  );
};

export default Categories;
