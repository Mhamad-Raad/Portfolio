// import NavBar from './Components/Navbar/NavBar';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud, Html, Text3D, Sky } from '@react-three/drei';
// import Background from './Components/Background'

import './App.scss';

function App() {
  return (
    <div
      style={{
        height: '500px',
        width: '100%',
      }}
    >
      <Canvas
        camera={{
          position: [0, 10, 20],
        }}
        style={
          {
            width: '100%'
          }
        }
      >
        <group>
          <Html
          
            position={[0, 0, 0]}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <h1
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: 'white',
                width: '100%',
              }}
            >
              Mhamad Raad
            </h1>
            <h2>Front-end Developer</h2>
          </Html>
        </group>
        <OrbitControls enableZoom={false} />
        <Stars 
          radius={100}
          depth={100}
          count={5000} 
          factor={4} 
          saturation={1} 
          fade 
          speed={1.25}
         />
      </Canvas>

      <Canvas  camera={{
          position: [0, 10, 20],
        }}>
      </Canvas>
    </div>
  );
}

export default App;
