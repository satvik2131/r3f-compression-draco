import React, { useRef } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { SimplifyModifier } from "three/examples/jsm/modifiers/SimplifyModifier";
import { OrbitControls } from "@react-three/drei";
import { Group } from "three";


export function Model({ url, name }) {
    const modifier = new SimplifyModifier();

    const loaders = {
        glb: GLTFLoader,
        gltf: GLTFLoader,
        fbx: FBXLoader,
        obj: OBJLoader,
    };

    const { scene } = useThree();
    var group = new Group();

    const loader = name.split(".")[1];
    const model = useLoader(loaders[loader], url);
    const nodes = model.nodes;
    for (let node in nodes) {
        var obj = nodes[node];
        if (obj.isMesh !== undefined && obj.isMesh) {
            const simplified = obj.clone();
            simplified.material = simplified.material.clone();
            simplified.material.flatShading = true;
            const count = Math.floor(simplified.geometry.attributes.position.count * 0.875); // number of vertices to remove
            simplified.geometry = modifier.modify(simplified.geometry, count);
            group.add(simplified);
        }
        scene.add(group);
    }

    // const group = useRef();
    return (
        <group>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight intensity={1} position={[0, 10, 0]} />
            {loader === "gltf" || loader === "glb" ? (
                <primitive object={scene} />
            ) : (
                <primitive object={model} />
            )}
        </group>
    );
}


export default Model;
