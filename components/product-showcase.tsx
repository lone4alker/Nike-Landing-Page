"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Component to Load GLB Models Dynamically
function Model({ modelPath }: { modelPath: string }) {
  const gltf = useGLTF(modelPath);
  return <primitive object={gltf.scene} scale={1.5} />;
}

export default function ProductShowcase() {
  const [activeColor, setActiveColor] = useState(0);
  const [rotationDegree, setRotationDegree] = useState(0);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<any>(null);

  // Define color options and corresponding GLB models
  const colors = [
    { name: "Blue", hex: "#4287f5", model: "/blue_shoe.glb" },
    { name: "Black and White", hex: "#FFFFFF", model: "/bw_shoe.glb" },
    { name: "Green", hex: "#3dcc21", model: "/green_shoe.glb" },
    { name: "White and Pink", hex: "#f291d7", model: "/pink_shoe.glb" },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Draggable);

    gsap.fromTo(
      ".product-container",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: "top 80%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleRotate = (direction: "left" | "right") => {
    setRotationDegree((prev) => (direction === "left" ? prev - 90 : prev + 90));
  };

  return (
    <section ref={showcaseRef} className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Interactive Product View</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our flagship Nike Air Max in 360° detail. Click colors to change models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* 3D Model Viewer */}
          <div className="product-container relative bg-gray-900 p-6 rounded-xl shadow-lg flex justify-center items-center">
            <div className="w-[100%] h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }} className="w-full h-full">
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} />
                <Suspense fallback={null}>
                  <group ref={productRef} rotation={[0, rotationDegree * (Math.PI / 180), 0]}>
                    <Model modelPath={colors[activeColor].model} />
                  </group>
                </Suspense>
                <OrbitControls enableZoom={false} enableRotate enablePan={false} />
              </Canvas>
            </div>

            {/* Rotation Buttons */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                onClick={() => handleRotate("left")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                onClick={() => handleRotate("right")}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Nike Air Max 270</h3>
              <p className="text-xl text-red-500 mb-4">$150.00</p>
              <p className="text-gray-400">
                The Nike Air Max 270 delivers visible cushioning under the foot and sophisticated design lines that nod to the iconic Air Max shoes of the past.
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <h4 className="text-white font-medium mb-3">Select Color: {colors[activeColor].name}</h4>
              <div className="flex justify-center md:justify-start space-x-3">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      activeColor === index ? "ring-2 ring-red-500 scale-110" : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setActiveColor(index)}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h4 className="text-white font-medium mb-3">Select Size</h4>
              <div className="grid grid-cols-5 gap-2">
                {["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"].map((size) => (
                  <button key={size} className="h-10 border border-gray-700 rounded-md text-white hover:border-red-500 hover:bg-red-500/10 transition-colors">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
