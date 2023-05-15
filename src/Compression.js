import React, { useRef, useEffect } from "react";
import { useLoader, useThree } from "@react-three/fiber";
// const gltfPipeline = require("gltf-pipeline");
import { OrbitControls } from "@react-three/drei";
//gltf-transform
import { WebIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import { draco, resample, prune, dedup } from "@gltf-transform/functions";


export function Model({ filepath }) {
    const group = useRef();
    // JSONParser(filepath);
    handleCompression(filepath);


    return (
        <group ref={group}>
            <OrbitControls />
            <GetInfo />
            <ambientLight intensity={0.5} />
            <directionalLight intensity={1} position={[0, 10, 0]} />
            {/* <primitive object={gltf.scene} /> */}
        </group>
    );
}


const handleCompression = async (path) => {
    try {


        // Configure I/O.
        const io = new WebIO()
            .registerExtensions(KHRONOS_EXTENSIONS)
        // .registerDependencies({
        //     'draco3d.decoder': await new DracoEncoderModule(), // Optional.
        //     'draco3d.encoder': await new DracoDecoderModule(), // Optional.
        // });

        // Read from URL.
        const document = await io.read(encodeURI(path));
        console.log(document);

        await document.transform(
            // Losslessly resample animation frames.
            resample(),
            // Remove unused nodes, textures, or other data.
            prune(),
            // Remove duplicate vertex or texture data, if any.
            dedup(),
            // Compress mesh geometry with Draco.
            draco(),
            // Convert textures to WebP (Requires glTF Transform v3 and Node.js).
            // textureCompress({
            //     encoder: sharp,
            //     targetFormat: 'gltf',
            //     resize: [1024, 2024],
            // }),
        );

        // Write to byte array (Uint8Array).
        const glb = await io.writeBinary(document);
        console.log(glb);
    } catch (e) {
        console.log(e);
    }
}

//Get Render info
const GetInfo = () => {
    const { gl } = useThree();
    useEffect(() => {
        // gl === WebGLRenderer
        // gl.info.calls
        console.log(gl.info);
    });
    return null;
};


const JSONParser = async (path) => {
    //GLTF loader way of doing it 
    // const loader = new GLTFLoader();
    // loader.load(
    //     path,
    //     function (gltf) {
    //         // The JSON data is stored in the "gltf" object
    //         console.log(gltf);
    //     },
    //     function (xhr) {
    //         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    //     },
    //     function (error) {
    //         console.log(error);
    //     }
    // );

    //gltf-transform way of compression



}

export default Model;
