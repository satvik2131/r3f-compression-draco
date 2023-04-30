import React, { useState } from 'react';
import Model from './Compression';
import { Canvas } from '@react-three/fiber';

function FileUploader() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const fileUrl = event.target.result;
            setFile(fileUrl);
        };

        reader.readAsDataURL(selectedFile);
    };

    if (file != null) {
        return (
            <Canvas>
                <Model url={file} />
            </Canvas>
        );
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
        </div>
    );
}

export default FileUploader;
