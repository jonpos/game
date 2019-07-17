let threeObjects = {
  camera: null,
  renderer: null,
  assetManager: null,
  geometry: null,
  skeletonMesh:null
};

let threeParams = {
  camera: {
    fov: 75,
    aspect: 0,
    near: 1,
    far: 3000,
    position: {
      x: 0,
      y: 100,
      z: 400
    }
  },
  renderer: {
    width: 0,
    height: 0
  },
  assetManager: {
    assetsDirUrl: "assets/",
    skeletonFile: "raptor-pro.json",
    atlasFile: "raptor.atlas"
  },
  asset: {
    asset: null,
    atlasLoader: null
  },
  geometry: {
    chara: {
      geometry: null,
      material: null,
      mesh: null
    }
  },
  scene: null
}

let canvas = null;

class Camera {
  constructor(threeParams) {
    const params = threeParams.camera;
    this.fov = params.fov;
    this.aspect = params.aspect;
    this.near = params.near;
    this.far = params.far;
    this.x = params.position.x;
    this.y = params.position.y;
    this.z = params.position.z;
  }
  setFullScreenAspect() {
    this.aspect = window.innerWidth / window.innerHeight;
  }
  create() {
    const camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    camera.position.x = this.x;
    camera.position.y = this.y;
    camera.position.z = this.z;
    return camera;
  }
}

class Renderer {
  constructor(threeParams) {
    this.params = threeParams.renderer;
    this.width = this.params.width;
    this.height = this.params.height;
  }
  setFullScreenSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
  create() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.width, this.height);
    return renderer;
  }
}

class AssetManager {
  constructor(threeParams) {
    this.params = threeParams.assetManager;
    this.assetsDirUrl = this.params.assetsDirUrl;
    this.skeletonFile = this.params.skeletonFile;
    this.atlasFile = this.params.atlasFile;
    this.assetManager = null;
  }
  create() {
    this.assetManager = new spine.threejs.AssetManager(this.assetsDirUrl);
    this.assetManager.loadText(this.skeletonFile);
    this.assetManager.loadTextureAtlas(this.atlasFile);
    return this.assetManager;
  }
}

class CreateSkeletonMesh {
  constructor(threeObjects,threeParams){
    this.params = threeParams.assetManager;
    this.assetManager = threeObjects.assetManager;
    this.skeletonFile = this.params.skeletonFile;
    this.atlasFile = this.params.atlasFile;
    this.atlas = this.assetManager.get(this.atlasFile);
    this.atlasLoader = new spine.AtlasAttachmentLoader(this.atlas);
    this.skeletonJson = new spine.SkeletonJson(this.atlasLoader);
    this.skeletonJson.scale = 0.4;
    this.skeletonData = this.skeletonJson.readSkeletonData(this.assetManager.get(this.skeletonFile));
    this.skeletonMesh = new spine.threejs.SkeletonMesh(this.skeletonData);
    this.skeletonAnimationNum = 0;
    this.skeletonAnimationType = "walk";
    this.skeletonMesh.state.setAnimation(this.skeletonAnimationNum, this.skeletonAnimationType, true);
    return this.skeletonMesh;
  }
}

class WrapGeometry {
  constructor(threeParams) {
    this.geometry = new THREE.BoxGeometry(200, 200, 200);
    this.material = new THREE.MeshBasicMaterial({ visible: false });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}

class Scene {
  constructor() {

  }
  create() {
    const scene = new THREE.Scene();
    return scene;
  }
}

class Canvas {
  constructor(renderer) {
    this.renderer = renderer;
  }
  create() {
    document.body.appendChild(this.renderer.domElement);
  }
  getElement() {
    return document.querySelector("canvas");
  }
}
//レンダリング
const lastTime = Date.now();
let lastFrameTime = Date.now() / 1000;
function rendering() {
  console.log(threeObjects);

  const now = Date.now() / 1000;
  const delta = now - lastFrameTime;
  lastFrameTime = now;

  threeObjects.skeletonMesh.update(delta);

  threeObjects.renderer.render(threeObjects.scene,threeObjects.camera);
  requestAnimationFrame(rendering);
}

//ロード
function load() {
  //アセットマネージャー読み込み完了後、処理を開始する
  if (threeObjects.assetManager.isLoadingComplete()) {
    let wrapGeometry = new WrapGeometry(threeParams);
    threeObjects.scene.add(wrapGeometry.mesh);
    console.log(threeObjects.assetManager);
    threeObjects.skeletonMesh = new CreateSkeletonMesh(threeObjects, threeParams);
    threeObjects.scene.add(threeObjects.skeletonMesh);
    console.log("assetManager.isLoadingComplete");
    //レンダリング開始
    rendering();
  } else {
    requestAnimationFrame(load);
  };
}

//初期化
function init() {
  //カメラ生成
  threeObjects.camera = new Camera(threeParams);
  threeObjects.camera.setFullScreenAspect();
  threeObjects.camera = threeObjects.camera.create();
  //レンダラー生成
  threeObjects.renderer = new Renderer(threeParams);
  threeObjects.renderer.setFullScreenSize();
  threeObjects.renderer = threeObjects.renderer.create();
  //アセットマネージャー生成
  threeObjects.assetManager = new AssetManager(threeParams).create();
  //シーン作成
  threeObjects.scene = new Scene().create();
  //canvas生成
  canvas = new Canvas(threeObjects.renderer);
  canvas.create();
  canvas = canvas.getElement();

  //ロード開始
  requestAnimationFrame(load);
}
init();
