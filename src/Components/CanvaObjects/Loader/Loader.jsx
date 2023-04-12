import { useProgress } from '@react-three/drei';
import './Loader.scss';

const Loader = () => {
  const { progress } = useProgress();
  console.log(progress);
  return (
    <div className='loader-body'>
      <div className='sky'>
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
        <div className='star' />
      </div>
      <div className='rocket'>
        <div className='rocket-body'>
          <div className='nose' />
          <div className='fin-left' />
          <div className='fin-right' />
          <div className='nozzle' />
          <div className='flames' />
        </div>
      </div>
    </div>
  );
};

export default Loader;
