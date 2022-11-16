import * as THREE from '/three.js';
import { OrbitControls } from '/OrbitControls.js';
import { Clock } from '/Clock.js';

// Scene, Camera, Renderer
var star 
let clock = new Clock( {autoStart : true} )
var stars=[];
let renderer = new THREE.WebGLRenderer({ alpha: true }, { antialias : true });
let scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1500);
let cameraAutoRotation = true;
canvas.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableZoom = true;
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.03;

controls.minDistance = 1.5;
controls.maxDistance = 3;


// Lights
let spotLight = new THREE.SpotLight(0xFFFFFF, 0.8, 20, 10, 60);
// Texture Loader

// Planet Proto
let planetProto = {
  sphere: function(size) {
    let sphere = new THREE.SphereGeometry(size, 64, 64);
    
    return sphere;
  },
  material: function(options) {
    let material = new THREE.MeshPhongMaterial();
    if (options) {
      for (var property in options) {
        material[property] = options[property];
      } 
    }
    
    return material;
  },
  glowMaterial: function(intensity, fade, color) {
    // Custom glow shader from https://github.com/stemkoski/stemkoski.github.com/tree/master/Three.js
    let glowMaterial = new THREE.ShaderMaterial({
      uniforms: { 
        'c': {
          type: 'f',
          value: intensity
        },
        'p': { 
          type: 'f',
          value: fade
        },
        glowColor: { 
          type: 'c',
          value: new THREE.Color(color)
        },
        viewVector: {
          type: 'v3',
          value: camera.position
        }
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize( normalMatrix * normal );
          vec3 vNormel = normalize( normalMatrix * viewVector );
          intensity = pow( c - dot(vNormal, vNormel), p );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`
      ,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() 
        {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4( glow, 1.0 );
        }`
      ,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    
    return glowMaterial;
  },
  texture: function(material, property, uri) {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = true;
    textureLoader.load(
      uri,
      function(texture) {
        material[property] = texture;
        material.needsUpdate = true;
      }
    );
  }
};

let createPlanet = function(options) {
  // Create the planet's Surface
  let surfaceGeometry = planetProto.sphere(options.surface.size);
  let surfaceMaterial = planetProto.material(options.surface.material);
  let surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  
  // Create the planet's Atmosphere
  let atmosphereGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size);
  let atmosphereMaterialDefaults = {
    side: THREE.DoubleSide,
    transparent: true
  }
  let atmosphereMaterialOptions = Object.assign(atmosphereMaterialDefaults, options.atmosphere.material);
  let atmosphereMaterial = planetProto.material(atmosphereMaterialOptions);
  let atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  
  // Create the planet's Atmospheric glow
  let atmosphericGlowGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size + options.atmosphere.glow.size);
  let atmosphericGlowMaterial = planetProto.glowMaterial(options.atmosphere.glow.intensity, options.atmosphere.glow.fade, options.atmosphere.glow.color);
  let atmosphericGlow = new THREE.Mesh(atmosphericGlowGeometry, atmosphericGlowMaterial);
  
  // Nest the planet's Surface and Atmosphere into a planet object
  let planet = new THREE.Object3D();
  surface.name = 'surface';
  atmosphere.name = 'atmosphere';
  atmosphericGlow.name = 'atmosphericGlow';
  planet.add(surface);
  planet.add(atmosphere);
  planet.add(atmosphericGlow);

  // Load the Surface's textures
  for (let textureProperty in options.surface.textures) {
    planetProto.texture(
      surfaceMaterial,
      textureProperty,
      options.surface.textures[textureProperty]
    ); 
  }
  
  // Load the Atmosphere's texture
  for (let textureProperty in options.atmosphere.textures) {
    planetProto.texture(
      atmosphereMaterial,
      textureProperty,
      options.atmosphere.textures[textureProperty]
    );
  }
  
  return planet;
};


let earth = createPlanet({
  surface: {
    size: 0.43,
    material: {
      bumpScale: 0.035,
      specular: new THREE.Color('grey'),
      shininess: 10
    },
    textures: {
      map: 'textures/earthmap1k.webp',
      bumpMap: 'textures/8081_earthbump2k.webp',
      specularMap: 'textures/earthspec1k.webp'
    }
  },
  atmosphere: {
    size: 0.003,
    material: {
      opacity: 0.8
    },
    textures: {
      map: 'textures/8081_earthbump2k.webp',
      alphaMap: 'textures/cloudmap.webp'
    },
    glow: {
      size: 0.005,
      intensity: 0.5,
      fade: 2,
      color: 0x93cfef
    }
  },
});


// Scene, Camera, Renderer Configuration
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(1,1,1);


scene.add(camera);
scene.add(spotLight);
scene.add(earth);

// Light Configurations
spotLight.position.set(2, 0, 1);

// Mesh Configurations
earth.receiveShadow = true;
earth.castShadow = true;
earth.getObjectByName('surface').geometry.center();

// On window resize, adjust camera aspect ratio and renderer size
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function addSphere(){

  // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position. 
  for ( var z= -1000; z < 1000; z+=20 ) {

    // Make a sphere (exactly the same as before). 
    var geometry   = new THREE.SphereGeometry(0.4, 32, 32)
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var sphere = new THREE.Mesh(geometry, material)

    // This time we give the sphere random x and y positions between -500 and 500
    sphere.position.x = Math.random() * 1000 - 500;
    sphere.position.y = Math.random() * 1000 - 500;

    // Then set the z position to where it is in the loop (distance of camera)
    sphere.position.z = z;

    // scale it up a bit
    sphere.scale.x = sphere.scale.y = 2;

    //add the sphere to the scene
    scene.add( sphere );

    //finally push it to the stars array 
    stars.push(sphere); 
  }
}

function animateStars() { 
  
// loop through each star
for(var i=0; i<stars.length; i++) {

star = stars[i]; 
  
// and move it forward dependent on the mouseY position. 
star.position.z +=  i/10;
  
// if the particle is too close move it to the back
if(star.position.z>1000) star.position.z-=2000; 

}

}


addSphere();

controls.maxPolarAngle = 1.39626;
controls.minPolarAngle = 0;

var maxrotate1 = "false"
controls.autoRotate = true;
// Main render function

function name(params) {
  
}

async function render() {

  if (maxrotate1 == "false") {
    controls.autoRotateSpeed = 5 * clock.getDelta();
  }

  if (maxrotate1 == "true") {
    controls.autoRotateSpeed = 5 * clock.getDelta();
  }

  if (controls.getAzimuthalAngle( )  < 0.4) {
    maxrotate1 = "true"
    
  }
  if (controls.getAzimuthalAngle( )  > 1) {
    maxrotate1 = "false"
    
  } 

  animateStars();
  if (cameraAutoRotation) {


    camera.lookAt(earth.position);
  }
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls.update();

};

function rotateObject(degreeX=-40, degreeY=-195, degreeZ=-40) {
  earth.rotateX(-0.698132);
  earth.rotateY(-3.35103);
  earth.rotateZ(-0.698132);
}

rotateObject()
render();



