"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";

const clients: { name: string; sub: string; logo: string | null }[] = [
  { name: "Nippon Car", sub: "Concesionario Toyota", logo: "/images/logos/nippon-car.svg" },
  { name: "Camuzzi", sub: "Distribuidora de Gas del Sur", logo: "/images/logos/camuzzi.svg" },
  { name: "Sahiora", sub: "Concesionario Chevrolet", logo: "/images/logos/sahiora.png" },
  { name: "Farmacias Global", sub: "Red de Farmacias", logo: "/images/logos/farmacias-global.png" },
  { name: "Global Oil", sub: "Servicios Petroleros", logo: "/images/logos/global-oil.png" },
  { name: "Salesianos Don Bosco", sub: "San José Obrero & Brentana", logo: "/images/logos/san-jose-obrero.svg?v=4" },
  { name: "Radio Cumbre", sub: "Radio y Medios", logo: "/images/logos/radio-cumbre.webp" },
  { name: "Biblioteca Popular Alberdi", sub: "Institución Cultural / Histórica", logo: null },
];

export function BrandsSection() {
  return (
    <section id="clientes" className="bg-slate-100/90 border-y border-slate-200/60 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center leading-tight">
          Empresas e Instituciones que Confían en Nosotros
        </h2>

        {/* Clients row */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {clients.map(({ name, sub, logo }) => (
            <div
              key={name}
              className="
                group flex flex-col items-center justify-between
                py-6 px-4
                rounded-xl border border-border bg-white
                transition-all duration-300
                hover:shadow-md hover:border-brand/20
                cursor-default select-none h-36
              "
            >
              {/* Client logo */}
              <div className="relative w-full h-12 flex items-center justify-center">
                {logo ? (
                  <Image
                    src={logo}
                    alt={`Logo de ${name} - Cliente de Lopardo Servicios Climatización Neuquén`}
                    width={160}
                    height={48}
                    className="
                      max-h-full max-w-full object-contain
                      filter grayscale opacity-60 contrast-75
                      group-hover:grayscale-0 group-hover:opacity-100 group-hover:contrast-100
                      transition-all duration-300
                    "
                  />
                ) : (
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-brand/10 text-brand/50 group-hover:bg-brand/20 group-hover:text-brand transition-all duration-300">
                    <Building2 className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                )}
              </div>
              <span className="text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors duration-300 mt-auto">
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

