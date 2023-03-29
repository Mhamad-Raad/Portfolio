import { FC } from 'react';

import Categories from './Categories';

import './Skills.scss';

interface SkillsInterface {

}

const Skills: FC<SkillsInterface> = () => {
  return (
    <section className='skills column'>
      <h2 className='skills__title'>Skills</h2>
      <h4 className="skills__subtitle">Techs I am Comfortable With</h4>
      <Categories />
    </section>
  );
}

export default Skills;
