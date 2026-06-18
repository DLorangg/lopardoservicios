"use client";

import { useState } from "react";
import { Quote, Send, CheckCircle2, X } from "lucide-react";

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
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);

    try {
      // Usamos la variable de entorno de Next.js. 
      // Si por alguna razón falla, tiene un fallback de seguridad.
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

      const response = await fetch(`${baseUrl}/postResena.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_cliente: name,
          empresa: company,
          comentario: comment,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Limpiar campos
        setName("");
        setCompany("");
        setComment("");
      } else {
        console.error("Error del servidor al guardar la reseña. Código:", response.status);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {/* Carousel Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar">
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
                min-w-[85%] md:min-w-[45%] lg:min-w-[40%] flex-shrink-0 snap-center
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

        {/* Action Button to Open Review Modal */}
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="
              inline-flex items-center justify-center gap-2
              rounded-lg border border-slate-300 bg-white
              px-6 py-3 text-sm font-semibold text-slate-700
              shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400
              transition-all duration-200 cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-slate-200
              active:translate-y-[1px]
            "
          >
            Dejar una reseña
          </button>
        </div>

        {/* Review Submission Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            {/* Click outside backdrop to close */}
            <div
              className="fixed inset-0"
              onClick={() => setIsModalOpen(false)}
              aria-hidden="true"
            />

            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="
                  absolute top-4 right-4 text-slate-400 hover:text-slate-600
                  transition-colors cursor-pointer p-1 rounded-full hover:bg-slate-50
                  focus:outline-none focus:ring-2 focus:ring-slate-200
                "
                aria-label="Cerrar formulario"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-brand tracking-tight">
                  Comparta su Experiencia
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 text-pretty">
                  Su valoración nos ayuda a seguir garantizando la máxima operatividad y calidad de servicio.
                </p>
              </div>

              {isSubmitted ? (
                <div className="bg-brand/[0.02] border border-brand/10 rounded-xl p-6 text-center flex flex-col items-center gap-4 animate-in fade-in-50 zoom-in-95 duration-300">
                  <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                    <CheckCircle2 className="h-5 w-5 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-brand">¡Reseña enviada con éxito!</h4>
                    <p className="text-xs text-slate-600">
                      Agradecemos su valioso comentario. Será revisado por nuestro equipo antes de ser publicado.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setIsModalOpen(false);
                    }}
                    className="mt-2 text-xs font-semibold text-brand hover:underline cursor-pointer focus:outline-none"
                  >
                    Cerrar ventana
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nombre */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="client-name"
                        className="text-xs font-bold uppercase tracking-wider text-slate-700"
                      >
                        Nombre y Apellido
                      </label>
                      <input
                        type="text"
                        id="client-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="
                          w-full rounded-lg border border-slate-200 bg-white
                          px-3 py-2 text-sm text-slate-800 placeholder-slate-400
                          focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10
                          transition-all duration-200
                        "
                      />
                    </div>

                    {/* Empresa */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="client-company"
                        className="text-xs font-bold uppercase tracking-wider text-slate-700"
                      >
                        Empresa / Institución <span className="text-slate-400 font-normal">(Opcional)</span>
                      </label>
                      <input
                        type="text"
                        id="client-company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Ej. Nippon Car"
                        className="
                          w-full rounded-lg border border-slate-200 bg-white
                          px-3 py-2 text-sm text-slate-800 placeholder-slate-400
                          focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10
                          transition-all duration-200
                        "
                      />
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="client-comment"
                      className="text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      Deje su reseña o comentario
                    </label>
                    <textarea
                      id="client-comment"
                      required
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Describa brevemente su experiencia con nuestro soporte técnico, mantenimiento preventivo o instalación..."
                      className="
                        w-full rounded-lg border border-slate-200 bg-white
                        px-3 py-2 text-sm text-slate-800 placeholder-slate-400
                        focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10
                        transition-all duration-200 resize-none
                      "
                    />
                  </div>

                  {/* Botón enviar */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      w-full inline-flex items-center justify-center gap-2
                      rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white
                      shadow-md shadow-brand/10 hover:shadow-lg hover:shadow-brand/15
                      transition-all duration-200 hover:bg-brand/95
                      focus:outline-none focus:ring-2 focus:ring-brand/20
                      disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                      active:translate-y-[1px]
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Enviar Reseña</span>
                      </>
                    )}
                  </button>

                  {/* Nota opcional */}
                  <p className="text-center text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Los comentarios serán revisados por nuestro equipo antes de ser publicados para garantizar la calidad del servicio.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


