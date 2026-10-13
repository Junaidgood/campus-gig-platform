import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 28;

    // 2. High-Precision WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 3. Volumetric Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const centralEmeraldLight = new THREE.PointLight(0x10b981, 3.5, 60);
    centralEmeraldLight.position.set(0, 0, 4);
    scene.add(centralEmeraldLight);

    const leftIndigoLight = new THREE.PointLight(0x6366f1, 3.0, 70);
    leftIndigoLight.position.set(-22, 10, 8);
    scene.add(leftIndigoLight);

    const rightCyanLight = new THREE.PointLight(0x06b6d4, 2.5, 70);
    rightCyanLight.position.set(22, -10, 8);
    scene.add(rightCyanLight);

    // 4. Centered Executive 3D Core Group
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, -6); // Centered directly behind the hero content
    scene.add(coreGroup);

    // Outer Orbital Gyroscope Ring (Indigo Accent)
    const outerRingGeo = new THREE.TorusGeometry(11.5, 0.14, 24, 120);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x312e81,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.38,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    coreGroup.add(outerRing);

    // Middle Orbital Ring (Emerald Escrow Ring - Inclined 45 deg)
    const middleRingGeo = new THREE.TorusGeometry(9.2, 0.12, 24, 100);
    const middleRingMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x064e3b,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.42,
    });
    const middleRing = new THREE.Mesh(middleRingGeo, middleRingMat);
    middleRing.rotation.x = Math.PI / 4;
    middleRing.rotation.y = Math.PI / 6;
    coreGroup.add(middleRing);

    // Inner Fast Gyro Ring (Cyan Accent - Inclined opposite)
    const innerRingGeo = new THREE.TorusGeometry(7.0, 0.09, 20, 90);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.35,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 3;
    coreGroup.add(innerRing);

    // Central Precision Geodesic Sphere (Subtle lattice)
    const sphereGeo = new THREE.IcosahedronGeometry(4.2, 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    coreGroup.add(sphereMesh);

    // Inner Luminous Quantum Core (Pulsing Glow)
    const coreSphereGeo = new THREE.SphereGeometry(2.0, 32, 32);
    const coreSphereMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.22,
    });
    const coreSphere = new THREE.Mesh(coreSphereGeo, coreSphereMat);
    coreGroup.add(coreSphere);

    // Satellite Escrow Node Spheres (Orbiting along the rings)
    const nodeCount = 5;
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      roughness: 0.1,
      metalness: 1.0,
    });

    for (let i = 0; i < nodeCount; i++) {
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      coreGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
    }

    // 5. Deep Space Particle Constellation
    const particlesCount = 950;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const colorA = new THREE.Color(0x34d399); // Emerald
    const colorB = new THREE.Color(0x818cf8); // Indigo
    const colorC = new THREE.Color(0x38bdf8); // Sky blue

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 110;
      posArray[i + 1] = (Math.random() - 0.5) * 85;
      posArray[i + 2] = (Math.random() - 0.5) * 55 - 10;

      const rand = Math.random();
      const chosen = rand < 0.4 ? colorA : rand < 0.75 ? colorB : colorC;
      colorsArray[i] = chosen.r;
      colorsArray[i + 1] = chosen.g;
      colorsArray[i + 2] = chosen.b;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // 6. Smooth Mouse & Inertial Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // 7. Render Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation
      targetX += (mouseX - targetX) * 0.035;
      targetY += (mouseY - targetY) * 0.035;

      // Centered Core Group Rotations
      coreGroup.rotation.y = elapsed * 0.12 + targetX * 0.25;
      coreGroup.rotation.x = targetY * 0.2;

      outerRing.rotation.x = elapsed * 0.14;
      outerRing.rotation.z = elapsed * 0.08;

      middleRing.rotation.y = -elapsed * 0.18;
      middleRing.rotation.x = Math.PI / 4 + Math.sin(elapsed * 0.5) * 0.1;

      innerRing.rotation.z = elapsed * 0.22;
      innerRing.rotation.y = elapsed * 0.15;

      sphereMesh.rotation.x = -elapsed * 0.08;
      sphereMesh.rotation.y = elapsed * 0.1;

      // Breathing Quantum Core Scale
      const pulseScale = 1.0 + Math.sin(elapsed * 2.2) * 0.06;
      coreSphere.scale.set(pulseScale, pulseScale, pulseScale);

      // Orbiting satellite nodes
      nodeMeshes.forEach((mesh, index) => {
        const angle = elapsed * 0.6 + (index * Math.PI * 2) / nodeCount;
        const radius = 9.2;
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.y = Math.sin(angle) * radius * Math.cos(Math.PI / 4);
        mesh.position.z = Math.sin(angle) * radius * Math.sin(Math.PI / 4);
      });

      // Background particle drift
      particlesMesh.rotation.y = elapsed * 0.015 + targetX * 0.1;
      particlesMesh.rotation.x = -elapsed * 0.01 + targetY * 0.1;

      // Parallax scroll reaction
      const scrollFactor = scrollY * 0.0025;
      coreGroup.position.y = -scrollFactor * 2.2;
      coreGroup.position.z = -6 - scrollFactor * 3.0;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      outerRingGeo.dispose();
      outerRingMat.dispose();
      middleRingGeo.dispose();
      middleRingMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      coreSphereGeo.dispose();
      coreSphereMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();

      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="three-canvas-container" aria-hidden="true" />;
};
