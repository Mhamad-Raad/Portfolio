import ProjectItem from './ProjectItem';

import demoImg1 from '../../../assets/ToolsMethodes/GitHub.png';

export default function ProjectList() {
  return (
    <div className='projects-section__projects row'>
      <ProjectItem img={demoImg1} />
      <ProjectItem img={demoImg1} />
      <ProjectItem img={demoImg1} />
      <ProjectItem img={demoImg1} />
      <ProjectItem img={demoImg1} />
    </div>
  );
}
