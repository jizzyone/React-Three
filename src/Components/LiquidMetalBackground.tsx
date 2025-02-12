import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LiquidMetalBackgroundProps {
  colorA?: THREE.Color;
  colorB?: THREE.Color;
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  // Функция шума
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Улучшенная функция шума
  float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // Функция создания волн
  float waves(vec2 st, float time) {
    float scale = 4.0;
    st *= scale;
    
    float amplitude1 = 0.5;
    float frequency1 = 1.0;
    float phase1 = time * 0.5;
    
    float amplitude2 = 0.25;
    float frequency2 = 2.0;
    float phase2 = time * 0.3;
    
    float wave1 = sin(st.x * frequency1 + phase1) * 
                 sin(st.y * frequency1 + phase1) * amplitude1;
                 
    float wave2 = sin(st.x * frequency2 + phase2) * 
                 sin(st.y * frequency2 + phase2) * amplitude2;
    
    return wave1 + wave2;
  }

  void main() {
    // Базовые координаты с искажением
    vec2 st = vUv;
    float time = uTime * 0.5;
    
    // Создаем несколько слоев волн
    float wave1 = waves(st, time);
    float wave2 = waves(st * 1.4 + 10.0, time * 1.2);
    float wave3 = waves(st * 0.6 + 5.0, time * 0.8);
    
    float combinedWaves = (wave1 + wave2 + wave3) * 0.3;
    
    // Добавляем шум для создания неоднородности
    float noisePattern = noise(st * 3.0 + time);
    
    // Вычисляем металлический блик
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDirection), 0.0), 3.0);
    
    // Создаем базовый градиент
    vec3 baseColor = mix(uColorA, uColorB, st.x + combinedWaves);
    
    // Добавляем блики и отражения
    float highlight = smoothstep(0.4, 0.6, combinedWaves + noisePattern);
    vec3 highlightColor = vec3(1.0, 1.0, 1.0);
    
    // Комбинируем все эффекты
    vec3 finalColor = mix(baseColor, highlightColor, highlight * fresnel);
    finalColor += vec3(1.0) * pow(fresnel, 2.0) * 0.5;
    
    // Усиливаем контраст
    finalColor = pow(finalColor, vec3(1.2));
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const LiquidMetalBackground: React.FC<LiquidMetalBackgroundProps> = ({ 
  colorA = new THREE.Color(0x1a1a2e),  // Темно-синий по умолчанию
  colorB = new THREE.Color(0x67b2ff)    // Голубой по умолчанию
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uColorA: { value: colorA },
    uColorB: { value: colorB }
  });

  useFrame((state) => {
    uniformsRef.current.uTime.value = state.clock.getElapsedTime();
  });

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      side: THREE.DoubleSide
    });
  }, [colorA, colorB]);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
};

export default LiquidMetalBackground;