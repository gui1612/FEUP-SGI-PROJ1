import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyParser } from './MyParser.js';
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

        // axis related attributes
        this.axis = null
        this.displayAxis = true;

        this.displayHelpers = true;

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		//this.reader.open("scenes/debug.xml");		
		this.reader.open("scenes/demo/demo.xml");		
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
    }

    updateHelpers() {
        this.app.scene?.dispatchEvent({
            // @ts-ignore
            type: "custom:updateHelpers",
            displayHelpers: this.displayHelpers,
        });
    }

    /**
     * Called when the scene xml file load is complete
     * @param {import('./parser/MySceneData.js').MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    /**
     * @param {import('./parser/MySceneData.js').MySceneData} data
     */
    onAfterSceneLoadedAndBeforeRender(data) {
       
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item

        this.output(data.options)
        console.log("textures:")
        for (var key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }

        console.log("materials:")
        for (var key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }

        console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }

        console.log("nodes:")
        const parser = new MyParser(data);

        const sceneNodes = parser.parse();
        for (const object of sceneNodes) {
            this.app.scene.add(object);
        }

        // const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
        // this.app.scene.add(ambientLight);
    }
    
    /**
     * updates the axis if required
     * this method is called from the render method of the app
     * updates are trigered by displayAxis property changes
     */
    updateAxisIfRequired() {
        if (!this.displayAxis && this.axis != null)
            this.app.scene?.remove(this.axis);
        else if (this.displayAxis) this.app.scene?.add(this.axis);
    }


    update() {
        this.updateAxisIfRequired();
    }
}

export { MyContents };