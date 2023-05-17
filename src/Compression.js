import React, { useRef, useEffect } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFExporter, GLTFLoader } from "three-stdlib";
//gltf-transform
import { WebIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import { draco, resample, prune, dedup } from "@gltf-transform/functions";
import { saveAs } from "file-saver";
import { ObjectLoader } from "three";


export function Model({ filepath }) {
    const group = useRef();
    const { scene } = useThree();

    handleCompression(filepath, scene);

    return (
        <group ref={group}>
            <OrbitControls />
            <GetInfo />
            <ambientLight intensity={0.5} />
            <directionalLight intensity={1} position={[0, 10, 0]} />
            {/* <primitive object={scene} /> */}
        </group>
    );
}


const handleCompression = async (path, scene) => {
    try {
        const encoderModule = new window.DracoEncoderModule();
        const decoderModule = new window.DracoDecoderModule();
        // console.log(window.DecoderModule);
        // Configure I/O.
        const io = new WebIO()
            .registerExtensions(KHRONOS_EXTENSIONS)
            .registerDependencies({
                'draco3d.decoder': await decoderModule, // Optional.
                'draco3d.encoder': await encoderModule, // Optional.
            });

        // Read from URL.
        const document = await io.read(encodeURI(path));

        await document.transform(
            // Losslessly resample animation frames.
            resample(),
            // Remove unused nodes, textures, or other data.
            prune(),
            // Remove duplicate vertex or texture data, if any.
            dedup(),
            // Compress mesh geometry with Draco.
            draco(),
        );

        //Write JSON
        // const glbJson = await io.writeJSON(document);
        // const jsonloader = new ObjectLoader();
        // jsonloader.load(JSON.stringify(glbJson.json), function (obj) {
        //     scene.add(obj);
        // });

        // const loader = new ObjectLoader();
        // console.log(glbJson);
        // const gltf = loader.parse(glbJson.json, (res) => { console.log(res); });

        // Write to byte array (Uint8Array).
        const byteArrayGlb = await io.writeBinary(document);
        const blob = new Blob([byteArrayGlb], { type: 'model/gltf+json' });
        saveAs(blob, 'done.gltf');

        // const url = URL.createObjectURL(blob);

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
