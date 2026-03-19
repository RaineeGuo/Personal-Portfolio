import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

import ParticleField from './components/ParticleField';
import DeconstructedBrain from './components/DeconstructedBrain';
import ArchiveColumns from './components/ArchiveColumns';
import OverlayUI from './components/OverlayUI';

// 相机控制器：点击后推进
const CameraController = ({ sceneState }) => {
  useFrame((state) => {
    const targetZ = sceneState === 'expanded' ? 5 : 8;
    const targetY = sceneState === 'expanded' ? 0.5 : 0;
    state.camera.position.lerp(new THREE.Vector3(0, targetY, targetZ), 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

export default function App() {
  const [sceneState, setSceneState] = useState('initial');

  const handleDeconstruction = () => {
    setSceneState('expanded');
    // 可以在这里触发更复杂的音频或震动反馈
  };

  return (
    <div className="h-screen w-full bg-[#050505] overflow-hidden">
      {/* UI 层 */}
      <OverlayUI 
        sceneState={sceneState} 
        onNavigate={(target) => setSceneState('expanded')}
      />
      
      {/* 3D 渲染层 */}
      <Canvas dpr={[1, 2]}>
        <CameraController sceneState={sceneState} />
        <color attach="background" args={['#050505']} />
        
        {/* 背景粒子流 */}
        <ParticleField />
        
        {/* 核心大脑 */}
        <DeconstructedBrain 
          active={sceneState === 'initial'} 
          onExpand={handleDeconstruction} 
        />

        {/* 存储柱模块 */}
        {sceneState === 'expanded' && <ArchiveColumns />}

        {/* 工业风后期特效 */}
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.2} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>

        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} color="#FF6B00" intensity={2} />
      </Canvas>

      {/* 装饰性扫描线特效 */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}