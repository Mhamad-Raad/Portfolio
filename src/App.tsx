// import NavBar from './Components/Navbar/NavBar';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud, Html } from '@react-three/drei';
// import Background from './Components/Background'

import './App.scss';

function App() {
  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 50],
        }}
        
      >
        <group>
          <Cloud opacity={0.3} depth={1.5} segments={20}></Cloud>
          <Html
            position={[-1, 0, 0]}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              background: 'red'
            }}
          >
            <h1 style={{
              color: 'white',
              fontSize: '5rem',
              fontWeight: 'bold',
              textShadow: '0 0 10px #000',
              width: '500px'
            }}>Mhamad Raad</h1>
            <h2>Front-end Developer</h2>
          </Html>
          <Stars />
        </group>
        <OrbitControls
          enableZoom={false}
        />
      </Canvas>
    </div>
  );
}

export default App;
