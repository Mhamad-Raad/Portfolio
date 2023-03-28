import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';

import 'react-vertical-timeline-component/style.min.css';
import './WorkExperience.scss';

import LezanImg from '../../assets/Lezan.jpg';

export default function WorkExperience() {
  return (
    <section className='work-experience column'>
      <h2 className='work-experience__title'>Work Experience</h2>
      <h4 className='work-experience__subtitle'>WHAT I HAVE DONE SO FAR</h4>
      <VerticalTimeline lineColor='#8ab6f9'>
        <VerticalTimelineElement
          contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
          date='Oct-2022 - Apr-2023'
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          icon={<img src={LezanImg} alt='Lezan Logo' className='work-experience-logo' />}
        >
          <h3 className='vertical-timeline-element-title'>
            Front-end Developer
          </h3>
          <h4 className='vertical-timeline-element-subtitle'>
            Internship, Gateway for ICT Solutions
          </h4>
          <p>React Developer, Payment Intigration, Agile(Scrum), Team Player</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          date='2010 - 2011'
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          // icon={<WorkIcon />}
        >
          <h3 className='vertical-timeline-element-title'>Art Director</h3>
          <h4 className='vertical-timeline-element-subtitle'>
            San Francisco, CA
          </h4>
          <p>
            Creative Direction, User Experience, Visual Design, SEO, Online
            Marketing
          </p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </section>
  );
}
