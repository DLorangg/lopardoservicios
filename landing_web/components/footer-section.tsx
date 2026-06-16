"use client";

import { MessageCircle, MapPin, Truck, PhoneCall, Shield, FileText } from "lucide-react";

// NOTA: Dejamos el número placeholder hasta que Dali te pase el real
const WHATSAPP_NUMBER = "5492990000000";
const TEXT_BASE = "Hola Lopardo Servicios, me comunico desde la web para solicitar información sobre ";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(TEXT_BASE)}`;

export function FooterSection() {
  return (
    <footer className="bg-[#111827]">
      {/* ── CTA Band ── */}
      <div className="border-b border-white/10 py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-balance leading-tight">
            Su infraestructura no puede esperar a mañana.
          </h2>
          <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl text-pretty">
            Conecte directamente con nuestra ingeniería y evalúe el estado de sus equipos.
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
              Protegiendo activos térmicos e industriales.
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
                Atención a toda la región petrolera
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/10">
          <p className="text-xs text-white/30 text-center">
            &copy; {new Date().getFullYear()} Lopardo Servicios. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
