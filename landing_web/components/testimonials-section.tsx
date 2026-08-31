"use client";

import { useState, useEffect, useRef } from "react";
import { Quote, Send, CheckCircle2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: number;
  nombre_cliente: string;
  empresa?: string;
  comentario: string;
  fecha: string;
}

export function TestimonialsSection() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 768 ? 1 : 3);
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const prevSlide = () => {
    if (approvedReviews.length === 0) return;
    setCurrentIndex((current) => (current - 1 + approvedReviews.length) % approvedReviews.length);
  };

  const nextSlide = () => {
    if (approvedReviews.length === 0) return;
    setCurrentIndex((current) => (current + 1) % approvedReviews.length);
  };

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${baseUrl}/getResenasAprobadas.php`);
        if (response.ok) {
          const data = await response.json();
          setApprovedReviews(data);
        }
      } catch (error) {
        console.error("Error al cargar reseñas aprobadas:", error);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchApprovedReviews();
  }, []);

  // Auto-rotación dinámica del slider según el largo del texto
  useEffect(() => {
    if (approvedReviews.length <= 1 || isModalOpen || isPaused) return;

    const activeReviewIndex = (currentIndex + (itemsPerPage === 3 ? 1 : 0)) % approvedReviews.length;
    const currentReview = approvedReviews[activeReviewIndex];
    const baseTime = 4000;
    const textLength = currentReview?.comentario?.length || (currentReview as any)?.texto?.length || 0;
    const dynamicDuration = Math.min(9500, Math.max(4500, baseTime + textLength * 25));

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % approvedReviews.length);
    }, dynamicDuration);

    return () => clearTimeout(timer);
  }, [currentIndex, approvedReviews, isModalOpen, isPaused, itemsPerPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);

    try {
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

  const displayReviews = approvedReviews.length >= 3 
    ? [...approvedReviews, ...approvedReviews, ...approvedReviews] 
    : approvedReviews;

  return (
    <section id="empresa" className="bg-white py-20 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-brand text-balance leading-tight">
            La confianza se construye estando cuando nos necesitás
          </h2>
          <div className="mt-4 mx-auto h-1 w-16 rounded-full bg-brand opacity-30" />
        </div>

        {/* Carousel Container */}
        {loadingReviews ? (
          <div className="text-center text-slate-500 py-8">
            Cargando testimonios...
          </div>
        ) : approvedReviews.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            Aún no hay testimonios disponibles.
          </div>
        ) : (
          <div
            className="relative group w-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Botón Izquierdo */}
            <button
              onClick={prevSlide}
              className="hidden md:flex absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-md text-slate-600 hover:text-brand hover:border-brand transition-all cursor-pointer"
              aria-label="Anterior testimonio"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Viewport y Riel Desplazable */}
            <div className="overflow-hidden w-full max-w-6xl mx-auto py-8 relative">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
              >
                {displayReviews.map((review, index) => {
                  const isCenter = itemsPerPage === 1
                    ? index === currentIndex
                    : index === currentIndex + 1;

                  return (
                    <div key={`${review.id}-${index}`} className="w-full md:w-1/3 flex-shrink-0 px-3">
                      <article
                        onClick={() => {
                          const targetIndex = itemsPerPage === 3
                            ? (index - 1 + approvedReviews.length) % approvedReviews.length
                            : index % approvedReviews.length;
                          setCurrentIndex(targetIndex);
                        }}
                        className={`
                          relative flex flex-col justify-between
                          h-full min-h-[280px] md:min-h-[320px]
                          p-6 sm:p-7 rounded-2xl
                          transition-all duration-700 ease-out transform cursor-pointer
                          overflow-hidden whitespace-normal
                          ${isCenter
                            ? "scale-100 opacity-100 shadow-xl border border-blue-500/30 ring-1 ring-blue-500/20 z-10 bg-white"
                            : "scale-95 opacity-50 shadow-sm border border-slate-200 z-0 bg-white/90"
                          }
                        `}
                      >
                        {/* Contenido superior */}
                        <div className="relative flex flex-col gap-4">
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
                            className={`
                              self-start text-xs font-semibold uppercase tracking-widest
                              px-3 py-1 rounded-full transition-colors duration-700 ease-in-out
                              ${isCenter ? "text-brand bg-brand/10" : "text-slate-500 bg-slate-100"}
                            `}
                          >
                            Cliente Verificado
                          </span>

                          {/* Quote text */}
                          <p className="relative z-10 text-slate-600 text-sm md:text-base leading-relaxed italic my-4 whitespace-normal break-words">
                            &ldquo;{review.comentario}&rdquo;
                          </p>
                        </div>

                        {/* Contenido inferior (Autor) */}
                        <div className="flex flex-col gap-3">
                          {/* Divider */}
                          <div className={`h-px w-12 rounded-full transition-colors duration-700 ease-in-out ${isCenter ? "bg-brand/40" : "bg-slate-300"}`} />

                          {/* Author */}
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-slate-800">{review.nombre_cliente}</span>
                            {review.empresa && (
                              <span className="text-sm text-slate-500">{review.empresa}</span>
                            )}
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botón Derecho */}
            <button
              onClick={nextSlide}
              className="hidden md:flex absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-md text-slate-600 hover:text-brand hover:border-brand transition-all cursor-pointer"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots Indicadores */}
            {approvedReviews.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-2">
                {approvedReviews.map((_, idx) => {
                  const activeDot = (currentIndex + (itemsPerPage === 3 ? 1 : 0)) % approvedReviews.length;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const target = itemsPerPage === 3
                          ? (idx - 1 + approvedReviews.length) % approvedReviews.length
                          : idx;
                        setCurrentIndex(target);
                      }}
                      aria-label={`Ver testimonio ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeDot
                          ? "w-6 bg-brand"
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

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
                  Comparta su experiencia
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 text-pretty">
                  Tu opinión nos ayuda a seguir brindándote la mejor atención y calidad en cada trabajo.
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
                      maxLength={300}
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
                    <div className="flex justify-end">
                      <span className="text-xs text-slate-400">{comment.length}/300 caracteres</span>
                    </div>
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


