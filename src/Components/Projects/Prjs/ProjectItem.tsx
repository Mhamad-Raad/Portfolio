import { FC } from 'react';

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
        <p className='projects-section__projects__project__techs__tech'>
          React
        </p>
        <p className='projects-section__projects__project__techs__tech'>
          Ruby on Rails
        </p>
        <p className='projects-section__projects__project__techs__tech'>
          JavaScript
        </p>
        <p className='projects-section__projects__project__techs__tech'>SCSS</p>
        <p className='projects-section__projects__project__techs__tech'>
          something else
        </p>
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
