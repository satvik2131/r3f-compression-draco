import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { DRACOExporter } from 'three/examples/jsm/exporters/DRACOExporter';
import { OrbitControls, SpotLight } from '@react-three/drei';

export function Model({ url }) {
    const gltf = useLoader(GLTFLoader, url, (loader) => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/path/to/draco/decoder/');
        loader.setDRACOLoader(dracoLoader);
    });
    const group = useRef();

    const handleExport = () => {
        const exporter = new DRACOExporter();
        const options = {
            decodeSpeed: 5,
            encodeSpeed: 5,
            compressionLevel: 7,
            quantization: {
                position: 14,
                normal: 10,
                color: 8,
                texCoord: 12,
            },
        };
        exporter.parse(gltf.scene, (compressed) => {
            const blob = new Blob([compressed], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        }, options);
    };

    return (
        <group ref={group}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight intensity={1} position={[0, 10, 0]} />
            <primitive object={gltf.scene} />
        </group>
    );
}

export default Model;
