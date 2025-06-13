'use client'
import React, { useRef, useState } from 'react'
import Tesseract from 'tesseract.js';

const CameraCapture = () => {
    const videoRef =useRef(null);
    const canvasRef = useRef(null);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
    }

    const captureAndRead = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        const imageDataUrl = canvas.toDataURL('image/png');
        setLoading(true);
        const result = await Tesseract.recognize(imageDataUrl, 'eng')
        setText(result.data.text)
        setLoading(false)
    }

        // sending to bckend


  return (
    <div>
      <video ref={videoRef} autoPlay playsInline className="w-full rounded" />
      <canvas ref={canvasRef} hidden />
      <div className="mt-4 space-x-2">
        <button
          onClick={startCamera}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start Camera
        </button>
        <button
          onClick={captureAndRead}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Capture & Read
        </button>
      </div>

      {loading && <p className="mt-4">Reading text...</p>}
      {text && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <h3 className="font-bold">Extracted Text:</h3>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default CameraCapture