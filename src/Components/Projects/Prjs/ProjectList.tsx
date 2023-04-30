import { FC } from 'react';

import ProjectItem from './ProjectItem';


interface ProjectListInterface {
  Projects: {
    img: string;
    title: string;
    description: string;
    Llink: string;
    GLink: string;
    techs: string[];
  }[];
}

const ProjectList: FC<ProjectListInterface> = ({Projects}) => {
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
