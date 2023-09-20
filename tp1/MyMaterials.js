import * as THREE from 'three';

export const wall = {
    white: new THREE.MeshPhongMaterial({
        color: "#ffff77",
        specular: "#000000",
        emissive: "#000000",
        shininess: 90,
        side: THREE.DoubleSide,
    }),
};

export const pillar = {

};

export const table = {
    top: new THREE.MeshPhongMaterial({
        color: "#ffff77",
        specular: "#000000",
        emissive: "#000000",
        shininess: 90,
    }),
    leg: new THREE.MeshPhongMaterial({
        color: "#ffff77",
        specular: "#000000",
        emissive: "#000000",
        shininess: 90,
    }),
};
