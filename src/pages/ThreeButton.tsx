import { Canvas, useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";
import { RoundedBox, Text, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Scene() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      const floatingSpeed = 4;
      const floatingRange = 10;

      meshRef.current.position.y = Math.sin(t * floatingSpeed) * floatingRange;

      meshRef.current.rotation.z = Math.cos(t * 2.1) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={2} />
      <pointLight position={[100, 100, 100]} intensity={1} />
      <ContactShadows
        position={[0, -10, 0]}
        opacity={1} // 더 진하게
        scale={1} // 더 넓게
        blur={1.5} // 더 선명하게
        far={50}
        color="#000000"
      />
      <RoundedBox
        ref={meshRef}
        args={[160, 48, 20]}
        radius={8}
        smoothness={4}
        scale={clicked ? 0.95 : hovered ? 1.05 : 1}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
      >
        <meshStandardMaterial
          color={hovered ? "#4F46E5" : "#6366F1"}
          roughness={0.3}
          metalness={0.8}
        />
        <Text
          position={[0, 0, 11]}
          fontSize={18}
          color="white"
          letterSpacing={0.2}
          font="/font/Pretendard-Bold.woff"
        >
          시작하기
        </Text>
      </RoundedBox>
    </>
  );
}

/**
 * 3D 시작하기 버튼 컴포넌트
 */
export const ThreeButton = () => {
  return (
    <div className="relative mx-auto h-[80px] w-[200px]">
      <Canvas
        orthographic
        camera={{
          left: -100,
          right: 100,
          top: 40,
          bottom: -40,
          near: 0.1,
          far: 1000,
          position: [0, 0, 100],
        }}
        gl={{ alpha: true, antialias: true }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};
