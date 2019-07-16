let threeObjects = {
    camera:null,
    renderer:null,
    assetManager:null
};

let threeParams = {
    camera:{
        fov:75,
        aspect:0,
        near:1,
        far:3000,
        position:{
            x:0,
            y:100,
            z:400
        }
    },
    renderer:{
        width:0,
        height:0
    },
    assetManager:{
        assetsDirUrl:"assets/",
        skeletonFile:"raptor-pro.json",
        atlasFile:"raptor.atlas"
    },
    asset:{
        asset:null,
        atlasLoader:null
    },
    geometry:{
        chara:{
            geometry:null,
            material:null,
            mesh:null
        }
    },
    scene:null
}

let canvas = null;

class Camera{
    constructor(threeParams){
        const params = threeParams.camera;
        this.fov = params.fov;
        this.aspect = params.aspect;
        this.near = params.near;
        this.far = params.far;
        this.x = params.position.x;
        this.y = params.position.y;
        this.z = params.position.z;
    }
    setFullScreenAspect(){
        this.aspect = window.innerWidth / window.innerHeight;
    }
    create(){
        const camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        camera.position.x = this.x;
        camera.position.y = this.y;
        camera.position.z = this.z;
        return camera;
    }
}

class Renderer {
    constructor(threeParams){
        this.params = threeParams.renderer;
        this.width = this.params.width;
        this.height = this.params.height;
    }
    setFullScreenSize(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    create(){
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(this.width, this.height);
        return renderer;
    }
}

class AssetManager{
    constructor(threeParams){
        this.params = threeParams.assetManager;
        this.assetsDirUrl = this.params.assetsDirUrl;
        this.skeletonFile = this.params.skeletonFile;
        this.atlasFile = this.params.atlasFile;
        this.assetManager = null;
    }
    create(){
        this.assetManager = new spine.threejs.AssetManager(this.assetsDirUrl);
        this.assetManager.loadText(this.skeletonFile);
        this.assetManager.loadTextureAtlas(this.atlasFile);
        return this.assetManager;
    }
}

class WrapGeometry{
    constructor(threeParams){
        this.geometry = threeParams.chara.geometry;
        this.material = threeParams.chara.material;
        this.mesh = threeParams.chara.mesh;
    }
}

class Scene{
    constructor(){

    }
    create(){
        const scene = new THREE.Scene();
        return scene;
    }
}

class Canvas{
    constructor(renderer){
        this.renderer = renderer;
    }
    create(){
        document.body.appendChild(this.renderer.domElement);
    }
    getElement(){
        return document.querySelector("canvas");
    }
}

function load(){
    //アセットマネージャー読み込み完了後、処理を開始する
    if(threeObjects.assetManager.isLoadingComplete()){
        console.log("assetManager.isLoadingComplete");
    }else{
        requestAnimationFrame(load)
    };
}

function init(){
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

    console.log(canvas);
    console.log(threeObjects);

    //ロード開始
    requestAnimationFrame(load);
}
init();
