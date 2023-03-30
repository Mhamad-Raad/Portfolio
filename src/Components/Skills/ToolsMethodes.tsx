import { FC } from 'react';

import './CategorySkills.scss';

interface ToolsMethodesInterface {}

const ToolsMethodes: FC<ToolsMethodesInterface> = () => {
  return (
    <div className='category-skills column'>
      <h3 className='category-skills__title'>Tools & Methodes</h3>
      <div className='category-skills__techs'>
      </div>
    </div>
  );
};

export default ToolsMethodes;
