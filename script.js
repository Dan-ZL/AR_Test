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
  const loader = new GLTFLoader();
  loader.load(
    './assets/model.glb',
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0.15, 0);
      model.scale.set(0.5, 0.5, 0.5);
      model.traverse(c => {
        if (c.isMesh) {
          c.material.side = THREE.DoubleSide;
          c.receiveShadow = false;
        }
      });
      anchor.group.add(model);
    },
    undefined,
    (err) => console.error('模型加载失败：', err)
  );


  // 渲染循环
  renderer.setAnimationLoop(() => {
    renderer.clearDepth();
    renderer.render(scene, camera);
  });
});
