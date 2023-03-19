import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Points,
  PointMaterial,
  Preload,
  OrbitControls,
} from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

import './StarsBackground.scss';

const Stars = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1 })
  );

  useFrame((state, delta) => {
    // ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color='#f272c8'
          size={0.0025}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const MovingMeteor = () => {
  const ref = useRef();
  const [reverse, setReverse] = useState(false)

  useFrame((state, delta) => {
    if (ref.current.position.x < -5 && ref.current.position.y < -5) {
      setReverse(true)
    } else if (ref.current.position.x > 5 && ref.current.position.y > 5) {
      setReverse(false)
    }

    if (!reverse) {
      ref.current.position.x -= delta / 2;
      ref.current.position.y -= delta / 2;
    } else if (reverse) {
      ref.current.position.x += delta / 2;
      ref.current.position.y += delta / 2;
    }
  });

  return (
    <mesh ref={ref} position={[-5, -5, 0]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color='#f272c8' />
    </mesh>
  );
};

const StarsCanvas = () => {
  return (
    <div className='stars-bg'>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <OrbitControls />
        <Suspense fallback={null}>
          <Stars />
          <MovingMeteor />
        </Suspense>

        <Preload all />
      </Canvas>
      <div className='name-position-bg'>
        <h1 className='name-position-bg__name'>Mhamad Raad</h1>
        <h2 className='name-position-bg__position'>Front-end Developer</h2>
      </div>
    </div>
  );
};

export default StarsCanvas;
