import React, { useState } from 'react';
import axios from 'axios';

const FileDownloadButton = () => {
    const handleDownload = async () => {
        try {
            const response = await axios.get('http://localhost:9091/download/recent', {
                responseType: 'blob',
            });

            // Create a temporary URL for the blob and initiate the download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'downloaded-file.ext');
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <button onClick={handleDownload}>Download Most Recent File</button>
    );
};

export default FileDownloadButton;