import { FC, useRef } from 'react';
import { useInView } from 'framer-motion';

import CircleSkill from './Skill/CircleSkill';

import './CategorySkills.scss';

import PosgresqlImg from '../../assets/backend/Postgresql.png';
import MysqlImg from '../../assets/backend/Mysql.png';
import NodeImg from '../../assets/backend/Node.png';
import SQLite from '../../assets/backend/SQLite.png';
import MongoImg from '../../assets/backend/Mongo.png';
import FirebaseImg from '../../assets/backend/Firebase.png';
import Express from '../../assets/backend/Express.png';

interface BackendSkillsInterface {}

const BackendSkills: FC<BackendSkillsInterface> = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView: boolean = useInView(ref, { once: true });

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
        <CircleSkill img={NodeImg} title='Node.js' />
        <CircleSkill img={Express} title='ExpressJs' />
        <CircleSkill img={SQLite} title='SQLite' />
        <CircleSkill img={FirebaseImg} title='Firebase' />
        <CircleSkill img={MongoImg} title='MongoDB' />
      </div>
    </div>
  );
};

export default BackendSkills;
