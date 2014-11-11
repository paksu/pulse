window.renderer, window.target;
// couple of constants
var POS_X = 1800;                   // Initial camera pos x
var POS_Y = 500;                    // Cam pos y
var POS_Z = 1800;                   // Cam pos z
var DISTANCE = 5000;               // Camera distance from globe
var WIDTH = window.innerWidth;      // Canvas width
var HEIGHT = window.innerHeight;    // Canvas height
var PI_HALF = Math.PI / 2;          // Minor perf calculation
var IDLE = true;                    // If user is using mouse to control
var IDLE_TIME = 1000 * 3;           // Time before idle becomes true again

var FOV = 45;                       // Camera field of view
var NEAR = 1;                       // Camera near
var FAR = 150000;                   // Draw distance

// Use the visibility API to avoid creating a ton of data when the user is not looking
var VISIBLE = true;

var DEBUG = false; // Show stats or not

var target = {
  x: 0,
  y: 0,
  zoom: 2500
};


(function () {

  var TwtrGlobe = this.TwtrGlobe = { };


  var renderer, camera, scene, pubnub, innerWidth, innerHeight;
  /**
   *  Initiates WebGL view with Three.js
   */
  TwtrGlobe.init = function () {

    if (!this.supportsWebGL()) {
      window.location = '/upgrade';
      return;
    }

    var innerWidth = window.innerWidth;
    var innerHeight = window.innerHeight;

    renderer = new THREE.WebGLRenderer({ antialiasing: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x00000000, 0.0);
    window.renderer = renderer;
    document.getElementById('globe-holder').appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, NEAR, FAR);
    camera.position.set(POS_X, POS_Y, POS_Z);
    camera.lookAt( new THREE.Vector3(0,0,0) );

    scene = new THREE.Scene();
    scene.add(camera);

    addEarth();
    addStats();
    animate();

    window.addEventListener ('resize', onWindowResize);
  }

  var earthMesh, beaconHolder;

  /**
   *  Creates the Earth sphere
   */
  function addEarth () {

    var sphereGeometry = new THREE.SphereGeometry(600, 50, 50);

    var shader = Shaders.earth;
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms['texture'].value = THREE.ImageUtils.loadTexture('/assets/images/world.jpg');

    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader
    });

    earthMesh = new THREE.Mesh(sphereGeometry, material);
    scene.add(earthMesh);

    // add an empty container for the beacons to be added to
    beaconHolder = new THREE.Object3D();
    earthMesh.add(beaconHolder);
  }

  var stats;

  /**
   * Adds FPS stats view for debugging
   */
  function addStats () {
    stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '20px';
    stats.domElement.style.bottom = '100px';

    document.body.appendChild( stats.domElement );
  }

  /**
   * Converts a latlong to Vector3 for use in Three.js
   */
  function latLonToVector3 (lat, lon, height) {

    height = height ? height : 0;

    var vector3 = new THREE.Vector3(0, 0, 0);

    lon = lon + 10;
    lat = lat - 2;

    var phi = PI_HALF - lat * Math.PI / 180 - Math.PI * 0.01;
    var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;
    var rad = 600 + height;

    vector3.x = Math.sin(phi) * Math.cos(theta) * rad;
    vector3.y = Math.cos(phi) * rad;
    vector3.z = Math.sin(phi) * Math.sin(theta) * rad;

    return vector3;
  };

  /**
   *  Adds a Tweet to the Earth, called from TweetHud.js
   */
  TwtrGlobe.onTweet = function (tweet) {

    // extract a latlong from the Tweet object
    var latlong = {
      lat: tweet.coordinates.coordinates[1],
      lon: tweet.coordinates.coordinates[0]
    };
    var position = latLonToVector3(latlong.lat, latlong.lon);
    addBeacon(position, tweet);
  }

  /**
   *  Adds a beacon (line) to the surface of the Earth
   */
  function addBeacon (position, tweet) {

    var beacon = new TweetBeacon(tweet);

    beacon.position.x = position.x;
    beacon.position.y = position.y;
    beacon.position.z = position.z;
    beacon.lookAt(earthMesh.position);
    beaconHolder.add(beacon);
    // remove beacon from scene when it expires itself
    beacon.onHide(function () {
      beaconHolder.remove(beacon);
    });
  }

  // Move the globe automatically if idle
  function checkIdle() {
    if (IDLE === true) {
      target.y -= 0.001;

      if (target.x > 0) target.x -= 0.001;
      if (target.x < 0) target.x += 0.001;

      if (Math.abs(target.x) < 0.01) target.x = 0;
    }
  };

  /**
   * Render loop
   */
  function animate () {
    requestAnimationFrame(animate);
    if (stats) stats.begin();
    render();
    if (stats) stats.end();
  }

  /**
   * Runs on each animation frame
   */
  function render () {


    earthMesh.rotation.x += (target.x - earthMesh.rotation.x) * 0.1;
    earthMesh.rotation.y += (target.y - earthMesh.rotation.y) * 0.1;
    DISTANCE += (target.zoom - DISTANCE) * 0.3;
    camera.position.z = DISTANCE;
    camera.lookAt( scene.position );

    checkIdle();

    renderer.render( scene, camera );
  }

  /**
   * Updates camera and rendered when browser resized
   */
  function onWindowResize (event) {
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;

    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }

  /**
   * Detects WebGL support
   */
  TwtrGlobe.supportsWebGL = function () {
    return ( function () { try { var canvas = document.createElement( 'canvas' ); return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ); } catch( e ) { return false; } } )();
  }

  return TwtrGlobe;

})().init();
