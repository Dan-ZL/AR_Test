import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from 'mindar-image-three';

document.addEventListener("DOMContentLoaded", async () => {
  // 1. 初始化 MindARThree（这次不禁用 resize，使用默认）
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "./assets/target.mind",
  });

  const { renderer, scene, camera } = mindarThree;
  
  // 2. 透明背景
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;

  // 3. 添加全局坐标轴，长度 0.5m
  scene.add(new THREE.AxesHelper(0.5));

  // 4. 添加光源
  scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1));
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0, 1, 1);
  scene.add(dirLight);

  // 5. 创建锚点并强制可见
  const anchor = mindarThree.addAnchor(0);
  await mindarThree.start();
  anchor.group.visible = true;  // 不管识别与否都显示

  // 6. 在 anchor.group 中添加辅助坐标轴
  anchor.group.add(new THREE.AxesHelper(0.3));

  // 7. 添加测试立方体（红色线框，0.5m 边长）
  const testBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
  );
  testBox.position.set(0, 0.25, 0);
  anchor.group.add(testBox);

  // 8. 可选：加载真实 GLTF 模型
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
    (err) => console.error("❌ 模型加载失败：", err)
  );

  // 9. 渲染循环
  renderer.setAnimationLoop(() => {
    renderer.clearDepth();        // 保持视频背景
    renderer.render(scene, camera);
  });
});
