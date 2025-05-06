import { MindARThree } from "https://cdn.jsdelivr.net/npm/mind-ar@1.1.4/dist/mindar-image-three.module.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", async () => {
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "./assets/placeholder-target.mind",
  });

  const { renderer, scene, camera } = mindarThree;
  const anchor = mindarThree.addAnchor(0);

  const loader = new THREE.GLTFLoader();
  loader.load('./assets/placeholder-model.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.position.y = 0;
    anchor.group.add(model);
  });

  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
});
