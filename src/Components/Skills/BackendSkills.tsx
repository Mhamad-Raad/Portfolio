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
  const ref = useRef<HTMLDivElement | null>(null);
  const inView: boolean = useInView(ref, {once: true});

  return (
    <div className='category-skills column'>
      <h3 className='category-skills__title'>Back-End</h3>
      <div
        className={`category-skills__techs ${
          inView ? '' : 'back-tech__framer'
        }`}
        ref={ref}
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
