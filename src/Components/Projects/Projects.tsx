import { FC } from 'react';

import demoImg1 from '../../assets/ToolsMethodes/GitHub.png';

import './Projects.scss';

interface ProjectsInterface {}

const Projects: FC<ProjectsInterface> = () => {
  return (
    <section className='projects-section column'>
      <h2 className='projects-section__title'>Projects</h2>
      <div className='projects-section__projects row'>
        <div className='projects-section__projects__project'>
          <img
            src={demoImg1}
            alt='demo'
            className='projects-section__projects__project__img'
          />
          <h3 className='projects-section__projects__project__title'>
            Project 1
          </h3>
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
            <p className='projects-section__projects__project__techs__tech'>
              SCSS
            </p>
            <p className='projects-section__projects__project__techs__tech'>
              something else
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
