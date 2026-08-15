import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import init from './init';
import './style.css';

const { sizes, camera, scene, canvas, controls, renderer } = init();

camera.position.set(-3, 1, -6);
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 15),
    new THREE.MeshStandardMaterial({
        color: "#444444",
        metalness: 0,
        roughness: 0.5,
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
scene.add(dirLight);

const objLoader = new OBJLoader();
let currentObject = null; // Змінна для зберігання поточної моделі

loadObj('/models/TurbineT250Full/turbine5United.obj');

const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};
tick();

/** Event listeners for resizing and fullscreen */
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.render(scene, camera);
});

function loadObj(dir) {
    objLoader.load(
        dir,
        (object) => {
            if (currentObject) {
                scene.remove(currentObject); // Видалити попередню модель
            }

            currentObject = object; // Зберегти нову модель в currentObject
            object.scale.set(0.75, 0.75, 0.75);
            object.rotation.y = Math.PI / 2;
            object.position.set(0, 0, -0.7);
            scene.add(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error('An error happened', error);
        }
    );
}

// Додаємо обробник подій для кнопки
document.getElementById('loadNewModel').addEventListener('click', () => {
    loadObj('/models/TurbineT250/turbine.obj'); // Задайте шлях до нової моделі
});
document.getElementById('reset-btn').addEventListener('click', () => {
    resetScene(); // Задайте шлях до нової моделі
});

function resetScene() {
    scene.clear(); // Очищаємо сцену
    loadObj('/models/TurbineT250Full/turbine5United.obj'); // Завантажуємо початкову модель

    // Перезавантажуємо сторінку
    window.location.reload();
}