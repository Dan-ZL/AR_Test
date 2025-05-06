import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from 'mindar-image-three';

document.addEventListener("DOMContentLoaded", async () => {
  // 初始化 MindARThree，禁用内部 resize
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "./assets/target.mind",
    onResize: () => {},
  });

  const { renderer, scene, camera } = mindarThree;
  // 透明背景设置
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

  // 示例：添加测试几何体
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  box.position.set(0, 0.2, 0);
  anchor.group.add(box);

  // 可选：加载 GLTF 模型
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
    },
    undefined,
    (error) => console.error("❌ 模型加载失败：", error)
  );

  // 强制跳过显隐逻辑：直接渲染
  await mindarThree.start();
  // 绕过 onTargetFound，可见性始终为 true
  anchor.group.visible = true;

  renderer.setAnimationLoop(() => {
    renderer.clearDepth();  // 保持视频背景
    renderer.render(scene, camera);
  });
});
