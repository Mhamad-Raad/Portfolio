import { useState, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Points,
  PointMaterial,
  Preload,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

import './StarsBackground.scss';

const Stars = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
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
  const [reverse, setReverse] = useState(false);

  useFrame((state, delta) => {
    if (ref.current.position.x < -5 && ref.current.position.y < -5) {
      setReverse(true);
    } else if (ref.current.position.x > 5 && ref.current.position.y > 5) {
      setReverse(false);
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

const FloatingTesla = () => {
  const ref = useRef();
  const { scene } = useGLTF('./models/tesla.glb');

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = (1 + Math.sin(t / 10)) / 10;
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 5;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group
      position={[1.5, -0.1, 0]}
      scale={0.071}
      rotation={[1, -1, 0]}
      ref={ref}
    >
      <primitive object={scene} />;
      <pointLight
        position={[10, 10, 10]}
        intensity={1}
        color='white'
        castShadow
      />
    </group>
  );
};

const Astronount = () => {
  const ref = useRef();
  const { scene } = useGLTF('./models/satalite.glb');

  useFrame((state, delta) => {
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group
      position={[-1.4, -.5, 0]}
      scale={0.01}
      ref={ref}
    >
      <primitive object={scene} />;
      <ambientLight />
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className='stars-bg'>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight />
        <OrbitControls />
        <Suspense fallback={null}>
          <Stars />
          <MovingMeteor />
          <FloatingTesla />
          <Astronount />
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
