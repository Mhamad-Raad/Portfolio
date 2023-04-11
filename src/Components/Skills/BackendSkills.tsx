import { FC, useRef } from 'react';
import { useInView } from 'framer-motion';

import CircleSkill from './Skill/CircleSkill';

import './CategorySkills.scss';

import PosgresqlImg from '../../assets/backend/Postgresql.png';
import MysqlImg from '../../assets/backend/Mysql.png';
import RorImg from '../../assets/backend/Ror.png';
import NodeImg from '../../assets/backend/Node.png';
import RspecImg from '../../assets/backend/Rspec.png';

interface BackendSkillsInterface {}

const BackendSkills: FC<BackendSkillsInterface> = () => {
  const ref = useRef(null);
  const inView = useInView(ref, {once: true});

  return (
    <div className='category-skills column'>
      <h3 className='category-skills__title'>Back-End</h3>
      <div className='category-skills__techs'
        ref={ref}
        style={{
          opacity: inView ? '1' : '0',
          transform: inView ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <CircleSkill img={PosgresqlImg} title='PostgreSQL' />
        <CircleSkill img={MysqlImg} title='MySQL' />
        <CircleSkill img={RorImg} title='Ruby on Rails' />
        <CircleSkill img={NodeImg} title='Node.js' />
        <CircleSkill img={RspecImg} title='Rspec' />
      </div>
    </div>
  );
};

export default BackendSkills;
