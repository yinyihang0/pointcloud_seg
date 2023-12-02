import * as THREE from "https://deno.land/x/threejs_4_deno@v121/src/Three.js";
import {PLYLoader} from "https://deno.land/x/threejs_4_deno@v121/examples/jsm/loaders/PLYLoader.js";
import { OrbitControls } from "https://deno.land/x/threejs_4_deno@v121/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://deno.land/x/threejs_4_deno@v121/examples/jsm/loaders/GLTFLoader.js";

export class SceneRenderer {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    control: OrbitControls;
    renderer: THREE.WebGLRenderer;

    constructor(public readonly container: HTMLDivElement) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
        // 添加光源
         // 创建灯光
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.scene.add(directionalLight);
        // 相机位置
        this.camera.position.z = 5;
        // 控制器
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        // 设置control的灵敏度
        this.control.rotateSpeed = 0.5;
        this.control.zoomSpeed = 0.5;
        this.control.panSpeed = 0.5;
        // 设置control中惯性
        this.control.enableDamping = true;
        this.control.dampingFactor = 0.25;
        // 设置control鼠标平移为按住中键
        this.control.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.PAN,
            RIGHT: THREE.MOUSE.DOLLY
        }
        // 取消极点锁定
        this.control.enablePan = true;
        this.control.minAzimuthAngle = -Infinity;
        this.control.maxAzimuthAngle = Infinity;
        
        this.control.minPolarAngle = 0;
        this.control.maxPolarAngle = Math.PI;
        this.scene.add(this.camera);
        // 初始设置坐标轴
        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );
        // 设置background为白色
        this.renderer.setClearColor(0xffffff, 1);
    }
    loadPointCloud(objUrl: string) {
        const loader = new PLYLoader();
        loader.load(objUrl, (geometry) => {
            const material = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: THREE.VertexColors // 使用顶点颜色
            });
            const points = new THREE.Points(geometry, material);
            this.scene.add(points);
        });
    }
    async loadCameras(objUrls: string[]) {
        const loader = new GLTFLoader();
        const promises = objUrls.map((url, index) => {
            return new Promise<THREE.Group>((resolve, reject) => {
                loader.load(url, 
                    (gltf: any) => {
                        const group: THREE.Group = gltf.scene;
                        group.name = "cam_" + index
                        resolve(group);
                    },
                    undefined, 
                    (error: undefined) => {
                        reject(error);
                    }
                );
            });
        });
        const cams_ = await Promise.all(promises);
        const cams = new THREE.Group();
        cams.add(...cams_);
        cams.name = 'cameras';
        this.scene.add(cams);
    }

    clickCams() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const onClick = (event: MouseEvent) => {
            // console.log(event);
            mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            if(!this.scene.getObjectByName("cameras")) {
                console.error("no cameras");
            }
            const intersects = raycaster.intersectObjects(this.scene.getObjectByName("cameras").children, true);
            if (intersects.length > 0) {
                console.log(intersects[0].object);
            }
        }
        this.renderer.domElement.addEventListener('click', onClick);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
        this.control.update();
    }

}