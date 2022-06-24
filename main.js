import './style.css'
import * as THREE from 'three';

'use strict ';

// Scene
let scene = new THREE.Scene();

// Camera
let camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.setZ(1000);

// Renderer
let renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#main-content')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
let canvas = renderer.domElement;
camera.aspect = canvas.clientWidth / canvas.clientHeight;

/*
 * Lights (iluminacao)  
 */
let sceneLight = new THREE.DirectionalLight(0xffffff, 0.5);
sceneLight.position.set(0, 0, 1);
scene.add(sceneLight);


//branch Light
let ambientLight = new THREE.AmbientLight(0x8A0303);
scene.add(ambientLight);

//background flash Light
let flash = new THREE.PointLight(0x8A0303, 30, 500, 1.7);
sceneLight.position.set(200, 300, 100);
scene.add(flash);

let portalLight = new THREE.PointLight(0x8A0303, 30, 600, 1.7);
portalLight.position.set(0, 0, 250);
scene.add(portalLight);

let portalParticles = [];
let backgroundParticles = [];
let branchParticles = [];
let clock;

let loader = new THREE.TextureLoader();
loader.load('images/branch.png', function(texture) {

    let portalGeometry = new THREE.PlaneBufferGeometry(20, 1000);
    let portalMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true
    });

    let backgroundGeometry = new THREE.PlaneBufferGeometry(1000, 1000);
    let backgroundMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true
    });

    for (let p = 1300; p > 200; p--) {
        let particle = new THREE.Mesh(portalGeometry, portalMaterial);
        particle.position.set(
            0.5 * p * Math.cos((4 * p * Math.PI) / 180),
            0.5 * p * Math.sin((4 * p * Math.PI) / 180),
            0.1 * p
        );
        particle.rotation.z = Math.random() * 360;
        portalParticles.push(particle);
        scene.add(particle);
    }

    for (let p = 0; p < 40; p++) {
        let particle = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        particle.position.set(
            Math.random() * 2400 - 1200,
            Math.random() * 2400 - 1200,
            25
        );
        particle.rotation.z = Math.random() * 360;
        particle.material.opacity = 0.3;
        portalParticles.push(particle);
        scene.add(particle);
    }
});
clock = new THREE.Clock();

// Event Listener para resize
window.addEventListener('resize', telaResize);

/*
 * funcao para fazer o Resize da tela  
 */
function telaResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}
/*
 * animar forma geometrica  
 */
function animate() {

    let delta = clock.getDelta();
    portalParticles.forEach(p => {
        p.rotation.z -= delta * 0.3;
    });
    backgroundParticles.forEach(p => {
        p.rotation.z -= delta * 0.00002;
    });
    if (Math.random() > 0.9) {
        portalLight.power = 350 + Math.random() * 500;
    };
    branchParticles.forEach(p => {
        p.rotation.z -= -0.002;
    });
    if (Math.random() > 0.93 || flash.power > 1000) {
        if (flash.power < 1000)
            flash.position.set(
                Math.random() * 400,
                300 + Math.random() * 200,
                100
            );
        flash.power = 50 + Math.random() * 500;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();