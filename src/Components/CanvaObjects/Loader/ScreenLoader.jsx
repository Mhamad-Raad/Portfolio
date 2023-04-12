// import { useProgress } from '@react-three/drei';
import { motion } from 'framer-motion';
import './ScreenLoader.scss';

const Loader = () => {
  // const { progress } = useProgress();
  // console.log(progress);
  return (
    <motion.div className='loader-body'
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 5, duration: 1 }}
    >
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
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        transition={{ delay: 2.5, duration: 1 }}
        className='welcome-header'
      >
        Welcome to my portfolio
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.5 }}
        className='made-by'
      >
        Made by Mhamad
      </motion.h2>
    </motion.div>
  );
};

export default Loader;
