import { FC } from 'react';

import Categories from './Categories/Categories';
import FrontEndSkills from './FrontEndSkills';
import BackendSkills from './BackendSkills';
import ToolsMethodes from './ToolsMethodes';

import './Skills.scss';

interface SkillsInterface {}

const Skills: FC<SkillsInterface> = () => {
  return (
    <section className='skills column'>
      <h2 className='skills__title'>Skills</h2>
      <h4 className='skills__subtitle'>Technologies I am Comfortable With</h4>
      <Categories />
      <FrontEndSkills />
      <BackendSkills />
      <ToolsMethodes />
    </section>
  );
};

export default Skills;
