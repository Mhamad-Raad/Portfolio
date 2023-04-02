import { FC } from 'react';

import Tech from './Tech';

import { FaShare, FaGithub } from 'react-icons/fa';
interface ProjectItemInterface {
  img: string;
}

const ProjectItem: FC<ProjectItemInterface> = ({ img }) => {
  return (
    <div className='projects-section__projects__project column'>
      <img
        src={img}
        alt='demo'
        className='projects-section__projects__project__img'
      />
      <h3 className='projects-section__projects__project__title'>Project 1</h3>
      <p className='projects-section__projects__project__description'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
        voluptas, quod, quia, voluptates quae voluptatem quibusdam
      </p>

      <div className='projects-section__projects__project__techs row'>
        <Tech tech='React' />
        <Tech tech='Ruby on Rails' />
        <Tech tech='JavaScript' />
        <Tech tech='SCSS' />
        <Tech tech='something else' />
      </div>

      <div className='projects-section__projects__project__links row'>
        <a href='' className='projects-section__projects__project__links__link'>
          <FaGithub /> GitHub
        </a>
        <a href='' className='projects-section__projects__project__links__link'>
          <FaShare /> Live
        </a>
      </div>
    </div>
  );
};

export default ProjectItem;
