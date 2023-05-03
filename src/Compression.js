import React, { useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { DRACOExporter } from 'three/examples/jsm/exporters/DRACOExporter';
// import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

import { OrbitControls } from '@react-three/drei';

export function Model({ url, name }) {

    const loaders = {
        glb: GLTFLoader,
        gltf: GLTFLoader,
        fbx: FBXLoader,
        obj: OBJLoader,
    };

    const loader = name.split(".")[1];
    const model = useLoader(loaders[loader], url);
    const group = useRef();


    return (
        <group ref={group}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight intensity={1} position={[0, 10, 0]} />
            {
                loader === "gltf" || loader === "glb"
                    ? <primitive object={model.scene} />
                    : <primitive object={model} />
            }

        </group>
    );
}

export default Model;
