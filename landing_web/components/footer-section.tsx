"use client";

import { MessageCircle, MapPin, Truck, Phone, Mail } from "lucide-react";

const WHATSAPP_NUMBER = "5492995177079"; // Formato internacional para Neuquén
const EMAIL_CONTACTO = "administración@lopardoservicios.com";
const TEXT_BASE = "Hola Lopardo Servicios, me comunico desde la web para solicitar información sobre ";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(TEXT_BASE)}`;

export function FooterSection() {
  return (
    <footer className="bg-[#111827]">
      {/* ── CTA Band ── */}
      <div className="border-b border-white/10 py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-balance leading-tight">
            Tu tranquilidad no puede esperar a mañana.
          </h2>
          <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl text-pretty">
            Escribinos y coordinemos para asegurarnos de que todo funcione a la perfección.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-3
              bg-whatsapp hover:bg-whatsapp-hover
              text-white font-semibold text-base
              px-8 py-4 rounded-xl
              transition-colors duration-200
              shadow-lg shadow-black/30
              mt-2
            "
          >
            <MessageCircle className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            Contactar vía WhatsApp Corporativo
          </a>
        </div>
      </div>

      {/* ── Footer Body ── */}
      <div className="py-14 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-3">
            <span className="text-white font-bold text-lg tracking-tight leading-snug">
              Lopardo Servicios
              <br />
              <span className="font-normal text-white/60">Climatización</span>
            </span>
            <p className="text-sm text-white/40 leading-relaxed">
              Protegiendo la infraestructura térmica e industrial.
            </p>
          </div>

          {/* Col 2 — Contact details */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-sm text-white/60">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand/70" strokeWidth={1.75} aria-hidden="true" />
                Taller Base: Neuquén Capital
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/60">
                <Truck className="h-4 w-4 mt-0.5 shrink-0 text-brand/70" strokeWidth={1.75} aria-hidden="true" />
                Cobertura en todo el Alto Valle y zona petrolera
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/60">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-brand/70" strokeWidth={1.75} aria-hidden="true" />
                <span>
                  Teléfono:{" "}
                  <a href={`tel:+${WHATSAPP_NUMBER}`} className="text-white hover:text-whatsapp transition-colors duration-200 font-semibold">
                    299 517-7079
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/60">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-brand/70" strokeWidth={1.75} aria-hidden="true" />
                <span>
                  Email:{" "}
                  <a href={`mailto:${EMAIL_CONTACTO}`} className="text-white hover:text-whatsapp transition-colors duration-200">
                    {EMAIL_CONTACTO}
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 max-w-6xl mx-auto px-6 text-xs text-slate-500 mt-12 py-6 border-t border-slate-800">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Lopardo Servicios. Todos los derechos reservados.
          </p>
          <p className="text-center sm:text-right">
            Desarrollo web por{" "}
            <a
              href="https://www.linkedin.com/in/lorang-damian/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors underline decoration-slate-600 underline-offset-4"
            >
              Damián Lorang
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
