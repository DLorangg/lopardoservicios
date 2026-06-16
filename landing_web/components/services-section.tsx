"use client";

import { Wind, ShieldCheck, Zap } from "lucide-react";

const services = [
  {
    icon: Wind,
    title: "Climatización Comercial e Industrial",
    description:
      "Instalación y montaje de unidades Roof-Top, VRV/VRF, Chillers y sistemas centrales para colegios, empresas y depósitos.",
  },
  {
    icon: ShieldCheck,
    title: "Mantenimiento Preventivo (SLA)",
    description:
      "Contratos a medida para asegurar la trazabilidad técnica, cumplimiento normativo y prevención de fallas catastróficas.",
  },
  {
    icon: Zap,
    title: "Servicio Técnico y Reparación",
    description:
      "Diagnóstico avanzado y recambio con repuestos originales para optimizar el rendimiento de sus equipos.",
  },
];

export function ServicesSection() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-brand text-balance leading-tight">
            Soluciones Integrales para Activos de Alta Exigencia
          </h2>
          <div className="mt-4 mx-auto h-1 w-16 rounded-full bg-brand opacity-30" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="
                group relative flex flex-col gap-5
                rounded-xl border border-border bg-white
                p-8
                transition-all duration-300
                hover:shadow-md hover:border-brand/20
                hover:bg-brand/[0.02]
              "
            >
              {/* Icon container */}
              <div
                className="
                  inline-flex items-center justify-center
                  h-12 w-12 rounded-xl
                  bg-brand/10
                  transition-colors duration-300
                  group-hover:bg-brand/20
                "
              >
                <Icon
                  className="h-6 w-6 text-brand"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Bottom accent line — appears on hover */}
              <div
                className="
                  absolute bottom-0 left-8 right-8 h-0.5
                  rounded-full bg-brand
                  scale-x-0 group-hover:scale-x-100
                  transition-transform duration-300 origin-left
                "
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
