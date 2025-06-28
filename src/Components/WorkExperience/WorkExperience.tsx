import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';

import 'react-vertical-timeline-component/style.min.css';
import './WorkExperience.scss';

import BrandBazzar from '../../assets/BrandBazzar.png';
import AoneImg from '../../assets/Aone.png';
import TelleNetProImg from '../../assets/TelleNetpro.png';
import DhorniImg from '../../assets/Dhorni.png';
import GatewayImg from '../../assets/Gateway.png';
import LezanImg from '../../assets/Lezan.jpg';
import MicroverseImg from '../../assets/Microverse.jpg';
import IndexImg from '../../assets/Index.jpg';
import UtmImg from '../../assets/UTM.png';

const WorkExperience = () => {
  return (
    <section className='work-experience column' id='experience'>
      <h2 className='work-experience__title'>Work Experience</h2>
      <h4 className='work-experience__subtitle'>WHAT I HAVE DONE SO FAR</h4>
      <VerticalTimeline lineColor='#8ab6f9'>
        <VerticalTimelineElement
          contentStyle={{ background: '#4073c5', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  #4073c5' }}
          date='FEB-2025 - JUL-2024'
          dateClassName='work-experience__date'
          iconClassName='work-experience__icon'
          icon={
            <img
              src={BrandBazzar}
              alt='BrandBazzar Logo'
              className='work-experience__logo'
              title='BrandBazzar'
            />
          }
        >
          <h3 className='vertical-timeline-element-title work-experience__job-title'>
            Full-Stack Developer
          </h3>
          <h4 className='vertical-timeline-element-subtitle work-experience__job-subtitle'>
            BrandBazzar
          </h4>
          <p>
            Laravel, Commuication, Time Management, Team Lead, Automated Emails,
            Payment Integration
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          contentStyle={{ background: '#4073c5', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  #4073c5' }}
          date='FEB-2025 - JUL-2024'
          dateClassName='work-experience__date'
          iconClassName='work-experience__icon'
          icon={
            <img
              src={AoneImg}
              alt='AOne Logo'
              className='work-experience__logo'
              title='A-One'
            />
          }
        >
          <h3 className='vertical-timeline-element-title work-experience__job-title'>
            Front-end Developer
          </h3>
          <h4 className='vertical-timeline-element-subtitle work-experience__job-subtitle'>
            A-One
          </h4>
          <p>Electron.js, Agile-Scrum, , Windows</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          contentStyle={{ background: '#4073c5', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  #4073c5' }}
          date='JAN-2024 - JUN-2024'
          dateClassName='work-experience__date'
          iconClassName='work-experience__icon'
          icon={
            <img
              src={TelleNetProImg}
              alt='TelleNetpro Logo'
              className='work-experience__logo'
              title='Telle-Netpro'
            />
          }
        >
          <h3 className='vertical-timeline-element-title work-experience__job-title'>
            Front-end Developer
          </h3>
          <h4 className='vertical-timeline-element-subtitle work-experience__job-subtitle'>
            Telle-Netpro
          </h4>
          <p>
            Next, Responsive Design Integration, 3D Modules, SSR, Communication
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          contentStyle={{ background: '#4073c5', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  #4073c5' }}
          date='JUN-2023 - DEC-2023'
          dateClassName='work-experience__date'
          iconClassName='work-experience__icon'
          icon={
            <img
              src={DhorniImg}
              alt='Dhorni Logo'
              className='work-experience__logo'
              title='Dhorni'
            />
          }
        >
          <h3 className='vertical-timeline-element-title work-experience__job-title'>
            Front-end Developer
          </h3>
          <h4 className='vertical-timeline-element-subtitle work-experience__job-subtitle'>
            Dhorni
          </h4>
          <p>
            React Developer, Responsive Design Integration, Agile(Scrum), Mobile
            First Development
          </p>
        </VerticalTimelineElement>
        {/*  */}
        <VerticalTimelineElement
          contentStyle={{ background: '#4073c5', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  #4073c5' }}
          date='OCT-2022 - APR-2023'
          dateClassName='work-experience__date'
          iconClassName='work-experience__icon'
          icon={
            <img
              src={GatewayImg}
              alt='Gateway for ICT Solutions Logo'
              className='work-experience__logo'
              title='Gateway for ICT Solutions'
            />
          }
        >
          <h3 className='vertical-timeline-element-title work-experience__job-title'>
            Front-end Developer
          </h3>
          <h4 className='vertical-timeline-element-subtitle work-experience__job-subtitle'>
            Gateway for ICT Solutions
          </h4>
          <p>
            React Developer, Payment Intigration, Agile(Scrum), SASS, Team
            Player, Time Management
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          date='SEP-2022 - MAR-2023'
          dateClassName='work-experience__date'
          iconClassName='work-experience__icon'
          contentStyle={{ background: '#586f93', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #586f93' }}
          icon={
            <img
              src={MicroverseImg}
              alt='Mircroverse Logo'
              className='work-experience__logo'
              title='Microverse'
            />
          }
        >
          <h3 className='vertical-timeline-element-title work-experience__job-title'>
            Web Development (Mentor)
          </h3>
          <h4 className='vertical-timeline-element-subtitle'>
            Volunteer, Microverse
          </h4>
          <p>HTML, CSS, Management, Communication, Teamwork</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          date='AUG-2022 - APR-2023'
          dateClassName='work-experience__date'
          iconClassName='work-experience__icon'
          contentStyle={{ background: '#586f93', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #586f93' }}
          icon={
            <img
              src={MicroverseImg}
              alt='Mircroverse Logo'
              className='work-experience__logo'
              title='Microverse'
            />
          }
        >
          <h3 className='vertical-timeline-element-title work-experience__job-title'>
            Web Development
          </h3>
          <h4 className='vertical-timeline-element-subtitle'>
            Student, Microverse
          </h4>
          <p>
            HTML, CSS, Sass, JavaScript, React, Ruby, Ruby on Rails, Jest, Rest
            API, Es6, Responsive Web Design Management, Communication, Teamwork
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          date='MAR-2022 - JUL-2022'
          dateClassName='work-experience__date'
          iconClassName='work-experience__icon'
          contentStyle={{ background: '#586f93', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #586f93' }}
          icon={
            <img
              src={LezanImg}
              alt='Lezan'
              className='work-experience__logo'
              title='Lezan'
            />
          }
        >
          <h3 className='vertical-timeline-element-title work-experience__job-title'>
            Flutter Developer
          </h3>
          <h4 className='vertical-timeline-element-subtitle'>
            ApprenticeShip, Lezan
          </h4>
          <p>Flutter, Firebase, Team lead, Communication, Teamwork</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          date='JAN-2022 - MAR-2022'
          dateClassName='work-experience__date'
          iconClassName='work-experience__icon'
          contentStyle={{ background: '#586f93', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #586f93' }}
          icon={
            <img
              src={IndexImg}
              alt='Index'
              className='work-experience__logo'
              title='Index Academy'
            />
          }
        >
          <h3 className='vertical-timeline-element-title work-experience__job-title'>
            Flutter Developer
          </h3>
          <h4 className='vertical-timeline-element-subtitle'>
            Student, Index Academy
          </h4>
          <p>Flutter, Firebase, Team lead, Communication, Teamwork</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          date='SEP-2019 - MAR-2023'
          dateClassName='work-experience__date'
          iconClassName='work-experience__icon'
          contentStyle={{ background: '#586f93', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #586f93' }}
          icon={
            <img
              src={UtmImg}
              alt='Universit of Technology Malaysia'
              className='work-experience__logo'
              title='Universit of Technology Malaysia'
            />
          }
        >
          <h3 className='vertical-timeline-element-title work-experience__job-title'>
            Software Engineer
          </h3>
          <h4 className='vertical-timeline-element-subtitle'>
            Student, University of Technology Malaysia, Bachelor's degree
          </h4>
          <p>
            C++, C#, Java, JavaScript, Dart, HTML5, CSS, Bootstrap5, jQuery,
            Flutter, Servlet, JSP, ASP .Net, AI, Network, Digital Logic,
            Embedded System, Microcontrollers, Development Methodologies
          </p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </section>
  );
};

export default WorkExperience;
