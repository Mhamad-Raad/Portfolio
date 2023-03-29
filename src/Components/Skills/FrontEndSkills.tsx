import { FC } from 'react';

import BallSkill from '../CanvaObjects/BallSkill';

import './FrontEndSkills.scss';

interface FrontEndSkillsInterface {}

const FrontEndSkills: FC<FrontEndSkillsInterface> = () => {
  return (
    <div className='front-end-skills column'>
      <h3 className='front-end-skills__title'>Front-End</h3>
      <div className='front-end-skills__techs row'>
        <BallSkill />
        <BallSkill />
        <BallSkill />
      </div>
    </div>
  );
};

export default FrontEndSkills;
