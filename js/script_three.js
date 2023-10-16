const backgroundColor = 0x262343;
const ambientLightColor = 0xffffff;

let mesh;
let outgoingMesh = null;
					
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 800);
var renderer = new THREE.WebGLRenderer({ antialias: true });
var ambientLight = new THREE.AmbientLight(ambientLightColor, 1);

const container = document.querySelector(".col-md-6");
const initialWidth = container.clientWidth;
const initialHeight = container.clientHeight;
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
		objPath: "./obj/test.obj",
		mtlPath: "./obj/test.mtl",
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
            object.position.set(0, 12, 0); // Fait entrer le nouvel objet par le haut
            scene.add(object);
			object.scale.set(scaleValue, scaleValue, scaleValue);

            new TWEEN.Tween(object.position)
                .to({ y: -3 }, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onComplete(() => {
                    mesh = object;
                })
                .start();
        });
    });
}

sectionTitles.forEach(title => {
    title.addEventListener('click', () => {
        const sectionClass = title.classList[1];
        loadObjectBySection(sectionClass);
        controls.enabled = false;
    });
});

loadObjectBySection('section-1');

let rotationDirection = 1;
const rotationSpeed = 0.002;

function animate() {
    requestAnimationFrame(animate);

    if (mesh) {
        mesh.rotation.y += rotationDirection * rotationSpeed;

        if (mesh.rotation.y >= Math.PI / 4) {
            rotationDirection = -1;
        } else if (mesh.rotation.y <= -Math.PI / 4) {
            rotationDirection = 1;
        }
    }

    controls.update();
    renderer.render(scene, camera);
    TWEEN.update();
}

animate();
