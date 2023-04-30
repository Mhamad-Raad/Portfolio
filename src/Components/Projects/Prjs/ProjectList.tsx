import { FC } from 'react';

import ProjectItem from './ProjectItem';

import Projects from '../../../Constants';

interface ProjectListInterface {}

const ProjectList: FC<ProjectListInterface> = () => {
  return (
    <div className='projects-section__projects row'>
      {Projects.map((project, index) => (
        <ProjectItem
          key={index}
          img={project.img}
          title={project.title}
          description={project.description}
          Llink={project.Llink}
          Glink={project.GLink}
          techs={project.techs}
        />
      ))}
    </div>
  );
};

export default ProjectList;
