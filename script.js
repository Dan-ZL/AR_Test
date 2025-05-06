import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from 'mindar-image-three';

document.addEventListener("DOMContentLoaded", async () => {
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "./assets/target.mind",
  });

  const { renderer, scene, camera } = mindarThree;

  //  更新为新版本正确属性
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  //  添加基础光照
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  const anchor = mindarThree.addAnchor(0);

  const loader = new GLTFLoader();
  loader.load(
    './assets/model.glb',
    (gltf) => {
      const model = gltf.scene;

      //  确保模型在正中
      model.position.set(0, 0, 0);
      model.scale.set(0.5, 0.5, 0.5);

      anchor.group.add(model);
      
      // —— 在这里打印调试信息 ——
      console.log("模型添加到 anchor.group", model);
      console.log("anchor.group children", anchor.group.children);     
    },
    undefined,
    (error) => {
      console.error("❌ 模型加载失败：", error);
    }
  );

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
});
