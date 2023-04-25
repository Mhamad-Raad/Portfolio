import { useRef, FC } from 'react';
import { useInView } from 'framer-motion';

import ProjectItem from './ProjectItem';

import { Projects } from '../../../Constants';
import demoImg1 from '../../../assets/ToolsMethodes/GitHub.png';

interface ProjectListInterface {}

const ProjectList: FC<ProjectListInterface> = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView: boolean = useInView(ref, { once: true });

  return (
    <div
      className={`projects-section__projects row ${
        inView ? '' : 'projects__framer'
      }`}
      ref={ref}
    >
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
