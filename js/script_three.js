const backgroundColor = 0x1E1B36;
const ambientLightColor = 0xffffff;

let mesh;
let outgoingMesh = null;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(80, 1, 0.1, 800);
var renderer = new THREE.WebGLRenderer({ antialias: true });
var ambientLight = new THREE.AmbientLight(ambientLightColor, 1);

const container = document.querySelector(".col-md-5");
const initialWidth = container.clientWidth;
const initialHeight = container.offsetHeight;
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
const sectionTitles = document.querySelectorAll('.accordion-title');
const scaleValue = 1.5;
const objects = [
	{
		sectionName: "section-1",
		objPath: "./obj/computer.obj",
		mtlPath: "./obj/computer.mtl",
	},
	{
		sectionName: "section-2",
		objPath: "./obj/function.obj",
		mtlPath: "./obj/function.mtl",
	},
  {
      sectionName: "section-3",
      objPath: "./obj/joystick.obj",
      mtlPath: "./obj/joystick.mtl",
  },
  {
      sectionName: "section-4",
      objPath: "./obj/audio.obj",
      mtlPath: "./obj/audio.mtl",
  }
];

camera.position.set(0, 0, 10);
camera.aspect = initialWidth / initialHeight;
camera.updateProjectionMatrix();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(initialWidth, initialHeight);
renderer.setClearColor(backgroundColor);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.autoRotate = false;
controls.enablePan = false;
controls.enableZoom = false;

controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = (3 * Math.PI) / 4;
controls.minAzimuthAngle = -Math.PI / 4;
controls.maxAzimuthAngle = Math.PI / 4;

document.getElementById("canvas-container").appendChild(renderer.domElement);

scene.add(ambientLight);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

function loadObjectBySection(sectionName) {
    const selectedObject = objects.find(obj => obj.sectionName === sectionName);

    if (outgoingMesh) {
        scene.remove(outgoingMesh);
    }

    if (mesh) {
        outgoingMesh = mesh;
        scene.add(outgoingMesh);

        new TWEEN.Tween(outgoingMesh.position)
            .to({ y: -15 }, 500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                scene.remove(outgoingMesh);
                loadNewObject(selectedObject);
            })
            .start();
    } else {
        loadNewObject(selectedObject);
    }
}

function loadNewObject(selectedObject) {
    // Supprimer tous les objets de la scène
    scene.children.forEach(child => {
        if (child !== camera && child !== ambientLight && child !== directionalLight) {
            scene.remove(child);
        }
    });

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load(selectedObject.mtlPath, function(materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(selectedObject.objPath, function(object) {
            object.position.set(0, -10, 0); // Déplace l'objet sous la scène (pour la montée)
            scene.add(object);
            object.scale.set(scaleValue, scaleValue, scaleValue);
            object.rotation.z = Math.PI / 32;
            object.rotation.y = Math.PI / -32;
            object.rotation.x = Math.PI / 32;
						mesh = object;
            new TWEEN.Tween(object.position)
                .to({ y: -2 }, 500) // Descendre l'objet de -10 à 0 en 1000 ms (1 seconde)
                .easing(TWEEN.Easing.Quadratic.Out) // Utiliser une courbe de lissage pour une descente plus douce
                .onComplete(() => {
										if (outgoingMesh != mesh) {
	                    // Ajouter une animation de flottement
	                    animateFloating(object);
	                    controls.enabled = true; // Réactiver les contrôles après avoir chargé l'objet
										}
                })
                .start();
        });
    });
}

function animateFloating(object) {
    // Animation de flottement
    new TWEEN.Tween(object.position)
        .to({ y: -2.25 }, 1500) // Fait flotter l'objet de 0 à 1 en 1500 ms (1,5 secondes)
        .easing(TWEEN.Easing.Sinusoidal.InOut) // Utiliser une courbe de lissage sinusoidale pour le flottement
        .yoyo(true) // Fait monter et descendre l'objet
        .repeat(Infinity) // Répéter l'animation indéfiniment
        .start();
}

sectionTitles.forEach(title => {
    title.addEventListener('click', () => {
        const sectionClass = title.classList[1];
        loadObjectBySection(sectionClass);
        controls.enabled = false;
    });
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    TWEEN.update();
}

animate();
