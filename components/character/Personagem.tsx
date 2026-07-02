"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { getLimitedPointerRotation } from "./rotation";

type PersonagemProps = {
  className?: string;
};

export default function Personagem({ className = "" }: PersonagemProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvasElement: HTMLCanvasElement = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvasElement,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.15, 4.3);

    const character = new THREE.Group();
    scene.add(character);

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(2.5, 3, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfff0d8, 1.1);
    fillLight.position.set(-3, 1.5, 2);
    scene.add(fillLight);

    const targetRotation = { x: 0, y: 0 };
    const loader = new GLTFLoader();
    let frameId = 0;
    let loadedModel: THREE.Object3D | null = null;
    let disposed = false;

    function resizeRenderer() {
      const { clientWidth, clientHeight } = canvasElement;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight || 1;
      camera.updateProjectionMatrix();
    }

    function handlePointerMove(event: PointerEvent) {
      const pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      const pointerY = (event.clientY / window.innerHeight) * 2 - 1;
      const rotation = getLimitedPointerRotation(
        pointerX,
        pointerY,
        0.35,
        0.18,
      );

      targetRotation.x = rotation.x;
      targetRotation.y = rotation.y;
    }

    loader.load("/assets/Meshy_AI_Newt_Grin_0701172534_texture.glb", (gltf) => {
      if (disposed) return;

      loadedModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(loadedModel);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());

      loadedModel.position.sub(center);
      loadedModel.position.y += 0.18;
      loadedModel.scale.setScalar(3.05 / size);
      loadedModel.rotation.y = -0.1;

      character.add(loadedModel);
    });

    function render() {
      character.rotation.x += (targetRotation.x - character.rotation.x) * 0.08;
      character.rotation.y += (targetRotation.y - character.rotation.y) * 0.08;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    }

    resizeRenderer();
    render();

    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(canvasElement);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);

      if (loadedModel) {
        loadedModel.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
      }

      renderer.dispose();
    };
  }, []);

  return (
    <motion.div
      className={`h-75 w-75 ${className}`}
      animate={{ y: [0, -15, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-label="Personagem 3D"
        className="-m-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)] drop-shadow-[7px_10px_0_rgba(17,17,17,0.2)]"
      />
    </motion.div>
  );
}
