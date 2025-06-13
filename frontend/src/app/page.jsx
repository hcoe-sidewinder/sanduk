
"use client"
import CameraCapture from "@/components/CameraCapture";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [showCamera, setShowCamera] = useState(false);
  return (
    <>
      <Button onClick={() => setShowCamera(true)}>Scan Documents</Button>
      {showCamera && <CameraCapture />}
    </>
  );
}
