import { useRef, FC } from 'react';
import { useInView } from 'framer-motion';

import ProjectItem from './ProjectItem';

import demoImg1 from '../../../assets/ToolsMethodes/GitHub.png';

export default function ProjectList() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div className='projects-section__projects row'
      ref={ref}
      style={{
        transform: inView? 'scale(1)' : 'scale(0)',
      }}
    >
      <ProjectItem img={demoImg1} />
      <ProjectItem img={demoImg1} />
      <ProjectItem img={demoImg1} />
      <ProjectItem img={demoImg1} />
      <ProjectItem img={demoImg1} />
    </div>
  );
}
