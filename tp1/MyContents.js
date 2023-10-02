import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess })

        // spot light
        this.spotlightColor = "#ffffff"
        this.spotlightIntensity = 15
        this.spotlightDistance = 8
        this.spotlightAngle = 40
        this.spotlightPenumbra = 0
        this.spotlightDecay = 0
        this.spotlightPosition = new THREE.Vector3(2,5,1)
        this.spotlightTarget = new THREE.Vector3(1,0,1)
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        // const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        // pointLight.position.set( 0, 20, 0 );
        // this.app.scene.add( pointLight );

        // // add a point light helper for the previous point light
        // const sphereSize = 0.5;
        // const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        // this.app.scene.add( pointLightHelper );

        // const light2 = new THREE.DirectionalLight( 0xffffff, 1 );
        // light2.position.set( 5, 10, -2 );
        // this.app.scene.add( light2 );

        // light2.target.position.set(2, 10, 2)
        // this.app.scene.add( light2.target );

        // const planeSize = 10;
        // const light2Helper = new THREE.DirectionalLightHelper( light2, planeSize );
        // this.app.scene.add( light2Helper );

        this.spotLight = new THREE.SpotLight( 0xffffff, 15, 8, 40 * Math.PI / 180, 0, 0 );
        this.spotLight.position.set( 2, 5, 1 );
        this.spotLight.target.position.set( 1, 0, 1 );
        this.app.scene.add( this.spotLight );
        this.app.scene.add( this.spotLight.target );

        this.spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
        this.app.scene.add( this.spotLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555, 1 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        
        // Create a Plane Mesh with basic material
        
        let plane = new THREE.PlaneGeometry( 10, 10 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add( this.planeMesh );
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }

    updateSpotlight() {
        this.spotLight.color.set(this.spotlightColor)
        this.spotLight.intensity = this.spotlightIntensity
        this.spotLight.distance = this.spotlightDistance
        this.spotLight.angle = this.spotlightAngle * Math.PI / 180
        this.spotLight.penumbra = this.spotlightPenumbra
        this.spotLight.decay = this.spotlightDecay
        this.spotLight.position.x = this.spotlightPosition.x
        this.spotLight.position.y = this.spotlightPosition.y
        this.spotLight.position.z = this.spotlightPosition.z
        this.spotLight.target.position.x = this.spotlightTarget.x
        this.spotLight.target.position.y = this.spotlightTarget.y
        this.spotLight.target.position.z = this.spotlightTarget.z
        this.spotLight.target.updateMatrix();
        this.spotLightHelper.update();
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };