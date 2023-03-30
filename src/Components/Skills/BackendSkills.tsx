import CircleSkill from './Skill/CircleSkill';

import './CategorySkills.scss';

import PosgresqlImg from '../../assets/Postgresql.png';
import MysqlImg from '../../assets/Mysql.png';
import RorImg from '../../assets/Ror.png';
import RspecImg from '../../assets/Rspec.png';

export default function BackendSkills() {
  return (
    <div className='category-skills column'>
      <h3 className='category-skills__title'>Back-End</h3>
      <div className='category-skills__techs'>
        <CircleSkill img={PosgresqlImg} title='PostgreSQL' />
        <CircleSkill img={MysqlImg} title='MySQL' />
        <CircleSkill img={RorImg} title='Ruby on Rails' />
        <CircleSkill img={RspecImg} title='Rspec' />
      </div>
    </div>
  );
}
