import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('#ar-container');
  const mindarThree = new MindARThree({
    container,
    imageTargetSrc: './assets/target.mind',
  });

  const { renderer, scene, camera } = mindarThree;

  // **关键：** 根据容器尺寸设置渲染器
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;

  // 添加全局坐标轴
  scene.add(new THREE.AxesHelper(0.5));

  // 光源
  scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1));
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0, 1, 1);
  scene.add(dirLight);

  // 创建锚点并启动
  const anchor = mindarThree.addAnchor(0);
  await mindarThree.start();

  // 强制可见
  anchor.group.visible = true;

  // 调试：添加测试立方体
  anchor.group.add(new THREE.AxesHelper(0.3));
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.3, 0.3),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
  );
  box.position.set(0, 0.15, 0);
  anchor.group.add(box);

  // 渲染循环
  renderer.setAnimationLoop(() => {
    renderer.clearDepth();
    renderer.render(scene, camera);
  });
});
