import { FC } from 'react';
import ConnectionItem from './ConnectionItem';

import LinkedInImg from '../../assets/LinkedIn.jpg';
import GitHubImg from '../../assets/ToolsMethodes/GitHub.png';

interface ConnectThroughInterface {}

const ConnectThrough: FC<ConnectThroughInterface> = () => {

    const goToGithub = () => {
      window.open('https://github.com/Mhamad-Raad');
    };

    const goToLinkedIn = () => {
      window.open('https://www.linkedin.com/in/mhamad-raad');
    };

  return (
    <div className='about-me__description__connection__connect__social'>
      <ConnectionItem img={LinkedInImg} clickHandler={goToLinkedIn} />
      <ConnectionItem img={GitHubImg} clickHandler={goToGithub} />
    </div>
  );
};

export default ConnectThrough;
