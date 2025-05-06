import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from 'mindar-image-three';

document.addEventListener("DOMContentLoaded", async () => {
  // 初始化 MindAR
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "./assets/target.mind",
    onResize: () => {},        // 禁用内部自动 resize
  });

  // 获取渲染器、场景、摄像机
  const { renderer, scene, camera } = mindarThree;
  // 确保透明背景
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;

  // 添加光源
  scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1));
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0, 1, 1);
  scene.add(dirLight);

  // 创建锚点
  const anchor = mindarThree.addAnchor(0);

  // 测试：在识别到目标时添加一个绿色立方体
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  box.position.set(0, 0.2, 0);
  anchor.group.add(box);

  // 可选：加载实际 GLTF 模型
  const loader = new GLTFLoader();
  loader.load(
    './assets/model.glb',
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0.2, 0);
      model.scale.set(0.5, 0.5, 0.5);
      model.traverse((c) => {
        if (c.isMesh) {
          c.material.side = THREE.DoubleSide;
          c.receiveShadow = false;
        }
      });
      anchor.group.add(model);
      console.log("模型添加到 anchor.group", model);
      console.log("anchor.group children", anchor.group.children);
    },
    undefined,
    (error) => console.error("❌ 模型加载失败：", error)
  );

  // 启动 AR 并渲染循环
  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.clearDepth();            // 保持视频背景
    renderer.render(scene, camera);
  });
});
