"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { getLimitedPointerRotation } from "./rotation";
import ZeroLoader from "../effects/ZeroLoader";
import {
  CHARACTER_MODEL_URL,
  DRACO_DECODER_PATH,
} from "../../lib/characterAssets";

type PersonagemProps = {
  className?: string;
  /** Chamado assim que o modelo termina de carregar e aparece na tela. */
  onReady?: () => void;
};

const SETTLE_EPSILON = 0.0002;

export default function Personagem({
  className = "",
  onReady,
}: PersonagemProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvasElement: HTMLCanvasElement = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvasElement,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

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
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let frameId = 0;
    let running = false;
    let visible = true;
    let loadedModel: THREE.Object3D | null = null;
    let disposed = false;

    function resizeRenderer() {
      const { clientWidth, clientHeight } = canvasElement;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight || 1;
      camera.updateProjectionMatrix();
      wake();
    }

    /** (Re)inicia o loop caso ele tenha parado por já estar assentado. */
    function wake() {
      if (disposed || running || !visible) return;
      running = true;
      frameId = requestAnimationFrame(render);
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
      wake();
    }

    function handleVisibility() {
      visible = !document.hidden;
      if (visible) wake();
    }

    loader.load(CHARACTER_MODEL_URL, (gltf) => {
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
      setIsReady(true);
      onReady?.();
      wake();
    });

    function render() {
      const dx = targetRotation.x - character.rotation.x;
      const dy = targetRotation.y - character.rotation.y;
      character.rotation.x += dx * 0.08;
      character.rotation.y += dy * 0.08;

      renderer.render(scene, camera);

      // Personagem alinhado ao alvo: encerra o loop até o próximo evento.
      if (Math.abs(dx) < SETTLE_EPSILON && Math.abs(dy) < SETTLE_EPSILON) {
        running = false;
        return;
      }
      frameId = requestAnimationFrame(render);
    }

    resizeRenderer();

    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(canvasElement);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = !document.hidden && (entry?.isIntersecting ?? true);
        if (visible) wake();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvasElement);

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      dracoLoader.dispose();

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
    <div className={`personagem-float relative h-75 w-75 ${className}`}>
      <canvas
        ref={canvasRef}
        aria-label="Personagem 3D"
        data-ready={isReady}
        className="personagem-canvas -m-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)] drop-shadow-[7px_10px_0_rgb(15_42_95_/_0.22)]"
      />
      <ZeroLoader
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          isReady ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
