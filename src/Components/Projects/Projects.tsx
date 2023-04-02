import { FC } from 'react';

import ProjectList from './Prjs/ProjectList';


import './Projects.scss';

interface ProjectsInterface {}

const Projects: FC<ProjectsInterface> = () => {
  return (
    <section className='projects-section column'>
      <h2 className='projects-section__title'>Projects</h2>
      <ProjectList />
    </section>
  );
};

export default Projects;
