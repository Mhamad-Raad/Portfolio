import { useRef, FC } from 'react';
import { useInView } from 'framer-motion';

import ProjectItem from './ProjectItem';

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
      <ProjectItem img={demoImg1} />
      <ProjectItem img={demoImg1} />
      <ProjectItem img={demoImg1} />
      <ProjectItem img={demoImg1} />
      <ProjectItem img={demoImg1} />
    </div>
  );
};

export default ProjectList;
