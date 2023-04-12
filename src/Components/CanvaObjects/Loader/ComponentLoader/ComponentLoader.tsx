import { useProgress, Html } from '@react-three/drei';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './ComponentLoader.scss';

export default function ComponentLoader() {
  const { progress } = useProgress();
  let percentage = progress.toFixed(2);

  return (
    <Html center as='div'>
      <div className='component-loader'>
        <CircularProgressbar
          value={+percentage}
          text={`${percentage}%`}
          minValue={0}
          maxValue={100}
          styles={{
            path: {
              stroke: '#8ab6f9',
            },
            text: {
              fill: '#8ab6f9',
              fontSize: '1.5rem',
            },
            trail: {
              stroke: '#fff',
            },
          }}
        />
      </div>
    </Html>
  );
}
