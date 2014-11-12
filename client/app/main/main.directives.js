/* globals angular, THREE, Stats, TweetBeacon */
(function (angular, THREE, Stats, TweetBeacon) {
  'use strict';

  var POS_X     = 1800;                   // Initial camera pos x
  var POS_Y     = 500;                    // Cam pos y
  var POS_Z     = 1800;                   // Cam pos z
  var DISTANCE  = 5000;                // Camera distance from globe
  var PI_HALF   = Math.PI / 2;          // Minor perf calculation
  var IDLE      = true;                    // If user is using mouse to control
  var IDLE_TIME = 1000 * 3;           // Time before idle becomes true again

  var FOV       = 45;                       // Camera field of view
  var NEAR      = 1;                       // Camera near
  var FAR       = 150000;                   // Draw distance

  var target = {
    x: 0,
    y: 0,
    zoom: 2500
  };

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
  }


  var module = angular.module('pulseApp');
  module.directive('pulseGlobe', function($window, Shaders) {
    var renderer, camera, scene;
    var earthMesh, beaconHolder;
    var rotation = { x: 0, y: 0 };
    var stats;

    function addSkybox(scene) {
      // Create the background cube map
      var urls = [
        'assets/images/pos-x.png',
        'assets/images/neg-x.png',
        'assets/images/pos-y.png',
        'assets/images/neg-y.png',
        'assets/images/pos-z.png',
        'assets/images/neg-z.png'
      ];

      var cubemap = THREE.ImageUtils.loadTextureCube(urls);
      cubemap.format = THREE.RGBFormat;

      var shader = THREE.ShaderLib["cube"];
      shader.uniforms["tCube"].value = cubemap;

      var material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
      });
      var skybox = new THREE.Mesh(new THREE.CubeGeometry(100000, 100000, 100000), material);
      scene.add(skybox);
    }
    /**
     *  Creates the Earth sphere
     */
    function addEarth (scene) {

      var sphereGeometry = new THREE.SphereGeometry(600, 50, 50);

      var shader = Shaders.earth;
      var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

      uniforms['texture'].value = THREE.ImageUtils.loadTexture('/assets/images/world.jpg');

      var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
      });

      var earthMesh = new THREE.Mesh(sphereGeometry, material);
      scene.add(earthMesh);

      // add an empty container for the beacons to be added to
      beaconHolder = new THREE.Object3D();
      earthMesh.add(beaconHolder);
      return earthMesh;
    }

    /**
     * Adds FPS stats view for debugging
     */
    function addStats () {
      stats = new Stats();
      stats.setMode(0); // 0: fps, 1: ms

      stats.domElement.style.position = 'absolute';
      stats.domElement.style.right = '20px';
      stats.domElement.style.bottom = '100px';

      $window.document.body.appendChild( stats.domElement );
    }

    function onWindowResize (event) {
      var innerWidth = $window.innerWidth;
      var innerHeight = $window.innerHeight;

      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    }

    // Move the globe automatically if idle
    function checkIdle() {
      if (IDLE === true) {
        target.x -= 0.001;

        if (target.y > 0) target.y -= 0.001;
        if (target.y < 0) target.y += 0.001;

        if (Math.abs(target.y) < 0.01) target.y = 0;
      }
    }

    function attachMouse($el) {
      var el = $el,
          isDown = false,
          onDownMouse = { x: 0, y: 0 },
          targetDownMouse = { x: 0, y: 0 },
          interval = null;

      el.addEventListener('mousedown', function (event) {
        isDown = true;

        IDLE = false;
        clearTimeout(interval);

        onDownMouse = {
          x: event.clientX,
          y: -event.clientY
        };
        targetDownMouse = {
          x: target.x,
          y: target.y
        };
      });

      el.addEventListener('mouseup', function (event) {
        isDown = false;

        clearTimeout(interval);
        interval = setTimeout(function () {
          IDLE = true;
        }, IDLE_TIME);
      });

      el.addEventListener('mousemove', function (event) {
        if (isDown) {
          var mouseX = event.clientX,
              mouseY = -event.clientY;

          target.x = targetDownMouse.x + (onDownMouse.x - mouseX) * 0.005;
          target.y = targetDownMouse.y + (onDownMouse.y - mouseY) * 0.005;

          target.y = target.y > PI_HALF ? PI_HALF : target.y;
          target.y = target.y < -PI_HALF ? -PI_HALF : target.y;
        }
      });

      renderer.domElement.addEventListener('mousewheel', function (event) {
        target.zoom -= event.wheelDeltaY ;
        if (target.zoom > 10000) target.zoom = 10000;
        if (target.zoom < 1000) target.zoom = 1000;
        event.preventDefault();
        return false;
      });
    }

    return {
      restrict: 'A',
      scope: {
        'width': '=',
        'height': '=',
        'fillcontainer': '=',
        'scale': '=',
        'materialType': '='
      },
      link: function postLink($scope, $element) {
        var innerWidth = $window.innerWidth;
        var innerHeight = $window.innerHeight;

        renderer = new THREE.WebGLRenderer({ antialiasing: true });
        renderer.setSize(innerWidth, innerHeight);
        renderer.setClearColor(0x00000000, 0.0);

        $element[0].appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, NEAR, FAR);
        camera.position.set(POS_X, POS_Y, POS_Z);
        camera.lookAt( new THREE.Vector3(0,0,0) );

        scene = new THREE.Scene();
        scene.add(camera);
        addSkybox(scene);
        earthMesh = addEarth(scene);
        addStats(scene);
        attachMouse(renderer.domElement);

        $scope.animate = function() {
          requestAnimationFrame($scope.animate);
          if (stats) stats.begin();
          $scope.render();
          if (stats) stats.end();
        };

        $scope.render  = function() {
          rotation.x += (target.x - rotation.x) * 0.1;
          rotation.y += (target.y - rotation.y) * 0.1;

          checkIdle();

          // Convert our 2d camera target into 3d world coords
          camera.position.x = DISTANCE * Math.sin(rotation.x) * Math.cos(rotation.y);
          camera.position.y = DISTANCE * Math.sin(rotation.y);
          camera.position.z = DISTANCE * Math.cos(rotation.x) * Math.cos(rotation.y);
          DISTANCE += (target.zoom - DISTANCE) * 0.3;
          camera.lookAt( scene.position );

          renderer.autoClear = false;
          renderer.clear();
          renderer.render( scene, camera );
        };

        $scope.$on('addBeacon', function(event, beam) {
          var lon = beam.geoip.location[0]
          var lat = beam.geoip.location[1]

          var beacon = new TweetBeacon({ sentiment: { score: 1000 * beam.time }});
          var position = latLonToVector3(lat, lon);
          beacon.position.x = position.x;
          beacon.position.y = position.y;
          beacon.position.z = position.z;
          beacon.lookAt(earthMesh.position);
          beaconHolder.add(beacon);
          // remove beacon from scene when it expires itself
          beacon.onHide(function () {
            beaconHolder.remove(beacon);
          });
        });

        $scope.animate();
        $window.addEventListener ('resize', onWindowResize);
      }
    };
  });

  module.service('mouseService', function() {
    return {};
  });
})(angular, THREE, Stats, TweetBeacon);