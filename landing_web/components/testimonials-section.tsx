"use client";

import { Quote } from "lucide-react";

const testimonials = [
  {
    sector: "Sector Automotriz",
    quote:
      "La confiabilidad de nuestra concesionaria exige instalaciones impecables. El equipo de Lopardo Servicios nos brinda un mantenimiento preventivo estructurado y respuesta rápida ante cualquier eventualidad térmica.",
    author: "Gerencia Operativa",
    company: "Nippon Car",
  },
  {
    sector: "Sector Energía / Petróleo",
    quote:
      "Destacamos el profesionalismo y la capacidad técnica en terreno. Contar con un soporte multimarca que entiende los protocolos de seguridad industrial es clave para nuestra continuidad operativa.",
    author: "Jefatura de Mantenimiento",
    company: "Camuzzi Gas del Sur",
  },
];

export function TestimonialsSection() {
  return (
    <section id="empresa" className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-brand text-balance leading-tight">
            La Confianza se Construye con Operatividad Comprobada
          </h2>
          <div className="mt-4 mx-auto h-1 w-16 rounded-full bg-brand opacity-30" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map(({ sector, quote, author, company }) => (
            <article
              key={company}
              className="
                relative flex flex-col gap-6
                rounded-xl border border-border bg-white
                p-8 md:p-10
                shadow-sm hover:shadow-md
                transition-shadow duration-300
                overflow-hidden
              "
            >
              {/* Decorative oversized quote mark */}
              <Quote
                className="
                  absolute -top-2 -left-1
                  h-24 w-24 text-muted-foreground/[0.06]
                  rotate-180
                "
                strokeWidth={1}
                aria-hidden="true"
              />

              {/* Sector tag */}
              <span
                className="
                  self-start text-xs font-semibold uppercase tracking-widest
                  text-brand bg-brand/10
                  px-3 py-1 rounded-full
                "
              >
                {sector}
              </span>

              {/* Quote text */}
              <blockquote className="relative z-10 text-base md:text-lg text-slate-700 leading-relaxed italic">
                &ldquo;{quote}&rdquo;
              </blockquote>

              {/* Divider */}
              <div className="h-px w-12 bg-brand/30 rounded-full" />

              {/* Author */}
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-800">{author}</span>
                <span className="text-sm text-slate-500">{company}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
