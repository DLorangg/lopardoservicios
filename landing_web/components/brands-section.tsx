"use client";

import Image from "next/image";

const clients = [
  { name: "Nippon Car", sub: "Concesionario Toyota", logo: "/images/logos/nippon-car.svg" },
  { name: "Camuzzi", sub: "Distribuidora de Gas del Sur", logo: "/images/logos/camuzzi.svg" },
  { name: "Sahiora", sub: "Concesionario Chevrolet", logo: "/images/logos/sahiora.png" },
  { name: "Farmacias Global", sub: "Red de Farmacias", logo: "/images/logos/farmacias-global.png" },
  { name: "Global Oil", sub: "Servicios Petroleros", logo: "/images/logos/global-oil.png" },
  { name: "GTC", sub: "Logística y Servicios", logo: "/images/logos/gtc.svg" },
  { name: "Radio Cumbre", sub: "Radio y Medios", logo: "/images/logos/radio-cumbre.webp" },
];

export function BrandsSection() {
  return (
    <section id="clientes" className="bg-surface py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center leading-tight">
          Empresas e Instituciones que confían en nosotros
        </h2>

        {/* Clients row */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {clients.map(({ name, sub, logo }) => (
            <div
              key={name}
              className="
                group flex flex-col items-center justify-center
                gap-4 py-6 px-4
                rounded-xl border border-border bg-white
                transition-all duration-300
                hover:shadow-md hover:border-brand/20
                cursor-default select-none h-32
              "
            >
              {/* Client logo */}
              <div className="relative w-full h-12 flex items-center justify-center">
                <Image
                  src={logo}
                  alt={name}
                  width={160}
                  height={48}
                  className="
                    max-h-full max-w-full object-contain
                    filter grayscale opacity-60 contrast-75
                    group-hover:grayscale-0 group-hover:opacity-100 group-hover:contrast-100
                    transition-all duration-300
                  "
                />
              </div>
              <span className="text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors duration-300">
                {sub}
              </span>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <p className="text-xs text-muted-foreground/60 text-center">
          Servicios homologados bajo los estándares operativos más exigentes de la región.
        </p>
      </div>
    </section>
  );
}

