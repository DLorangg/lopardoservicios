"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  {
    src: "/images/carrusel/foto1.jpeg",
    alt: "Mantenimiento de unidad rooftop de climatización en techo de empresa en Neuquén - Lopardo Servicios",
  },
  {
    src: "/images/carrusel/foto2.jpeg",
    alt: "Técnico especialista realizando instalación de aire acondicionado central en Neuquén - Lopardo Servicios",
  },
  {
    src: "/images/carrusel/foto3.jpeg",
    alt: "Mantenimiento preventivo y reparación de sistemas de climatización VRF en Alto Valle - Lopardo Servicios",
  },
];

export function WorkGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const getPosition = (index: number) => {
    if (index === activeIndex) return "active";

    const prev = (activeIndex - 1 + images.length) % images.length;
    const next = (activeIndex + 1) % images.length;

    if (index === prev) return "prev";
    if (index === next) return "next";

    return "hidden";
  };

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-brand text-balance leading-tight">
            Nuestros Trabajos en Terreno en el Alto Valle
          </h2>
          <div className="mt-4 mx-auto h-1 w-16 rounded-full bg-brand opacity-30" />
        </div>

        {/* Carousel */}
        <div className="relative w-full max-w-5xl mx-auto h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden py-4">
          {images.map((imgObj, index) => {
            const position = getPosition(index);

            const baseClasses =
              "absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out rounded-2xl object-cover shadow-xl";

            let positionClasses = "";

            switch (position) {
              case "active":
                positionClasses =
                  "left-1/2 -translate-x-1/2 w-[85%] md:w-[60%] h-[300px] md:h-[400px] z-30 opacity-100 scale-100";
                break;
              case "prev":
                positionClasses =
                  "left-[15%] md:left-[20%] -translate-x-1/2 w-[60%] md:w-[40%] h-[250px] md:h-[300px] z-20 opacity-40 blur-[2px] scale-90 hidden md:block";
                break;
              case "next":
                positionClasses =
                  "left-[85%] md:left-[80%] -translate-x-1/2 w-[60%] md:w-[40%] h-[250px] md:h-[300px] z-20 opacity-40 blur-[2px] scale-90 hidden md:block";
                break;
              default:
                positionClasses =
                  "opacity-0 z-0 scale-75 pointer-events-none left-1/2 -translate-x-1/2";
                break;
            }

            return (
              <Image
                key={imgObj.src}
                src={imgObj.src}
                alt={imgObj.alt}
                width={800}
                height={500}
                className={`${baseClasses} ${positionClasses}`}
              />
            );
          })}
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
              className={`
                h-2 rounded-full transition-all duration-300 cursor-pointer
                ${
                  index === activeIndex
                    ? "w-6 bg-brand"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
