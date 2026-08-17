"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Menu,
  X,
  Phone,
  Zap,
  Truck,
  BadgeCheck,
  MessageCircle,
} from "lucide-react"

const NAV_LINKS = [
  { label: "Instalación de Equipos", href: "#servicios" },
  { label: "Mantenimiento Preventivo", href: "#servicios" },
  { label: "Clientes", href: "#clientes" },
]

const TRIGGERS = [
  { icon: Zap, label: "Respuesta en 24/48 hs" },
  { icon: Truck, label: "Flota Propia" },
  { icon: BadgeCheck, label: "Técnicos Certificados" },
]

const WHATSAPP_NUMBER = "5492995177079"; // Formato internacional para Neuquén
const EMAIL_CONTACTO = "administración@lopardoservicios.com";
const TEXT_BASE = "Hola Lopardo Servicios, me comunico desde la web para solicitar información sobre ";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(TEXT_BASE)}`;

export default function LopardoLanding() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-50 border-b border-blue-100/80 bg-blue-50/90 backdrop-blur-md transition-all">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a href="#inicio" className="flex shrink-0 items-center gap-3">
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-brand">
                LOPARDO SERVICIOS
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Climatización
              </span>
            </span>
          </a>

          {/* Enlaces centrales (desktop) */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-slate-800 transition-colors hover:text-brand"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA derecha + toggle mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border text-brand"
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Menú mobile desplegable */}
        {menuOpen && (
          <div className="border-t border-blue-100/60 bg-blue-50 lg:hidden">
            <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-brand/5 hover:text-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}

            </ul>
          </div>
        )}
      </header>

      {/* ===================== HERO ===================== */}
      <section id="inicio" className="bg-white mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-5rem)] flex items-center pt-8 md:pt-14 pb-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 w-full items-center">
          {/* Columna Texto (Agrupada) */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:max-w-xl w-full">
            {/* Badge */}
            <span className="mt-4 mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand ring-1 ring-brand/15">
              🛡️ ATENCIÓN PERSONALIZADA DIRECTA POR SUS DUEÑOS
            </span>

            {/* Contenedor relativo de H1 + Logo en Desktop */}
            <div className="relative w-full mt-5">
              <h1 className="text-pretty text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl pr-0 lg:pr-4">
                Mantenimiento, Reparación e Instalación de Climatización y Aire Acondicionado en Neuquén
              </h1>

              {/* Logo grande para desktop centrado verticalmente con el H1 */}
              <div className="hidden lg:flex absolute left-[calc(100%+4rem)] top-1/2 -translate-y-1/2 w-56 h-56 md:w-72 md:h-72 xl:w-80 xl:h-80 items-center justify-center">
                <Image
                  src="/images/lopardo-logo.png"
                  alt="Lopardo Servicios - Climatización y Aire Acondicionado en Neuquén"
                  width={384}
                  height={384}
                  className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </div>

            {/* Logo para mobile (solo visible en pantallas pequeñas) */}
            <div className="relative flex items-center justify-center lg:hidden w-full my-6">
              <Image
                src="/images/lopardo-logo.png"
                alt="Lopardo Servicios - Empresa de Climatización en Neuquén"
                width={256}
                height={256}
                className="w-56 h-56 object-contain mx-auto drop-shadow-2xl"
                priority
              />
            </div>

            {/* Subtítulo */}
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg max-w-xl">
              Soluciones de climatización domiciliaria e industrial con atención corporativa prioritaria en todo el Alto Valle y alrededores.
            </p>

            {/* CTA principal WhatsApp */}
            <div className="mt-8">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-whatsapp px-7 py-4 text-base font-bold text-white shadow-lg shadow-whatsapp/30 transition-all hover:-translate-y-0.5 hover:bg-whatsapp-hover hover:shadow-xl hover:shadow-whatsapp/40 sm:text-lg"
              >
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
                Cotizar Mantenimiento por WhatsApp
              </a>
            </div>

            {/* Click-triggers */}
            <ul className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-7 gap-y-4">
              {TRIGGERS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/5 text-brand ring-1 ring-brand/10">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna Derecha de Desktop (Vacía para dejar espacio al posicionamiento absoluto) */}
          <div className="hidden lg:block" />
        </div>
      </section>

      {/* ===================== TRAYECTORIA ===================== */}
      <section className="bg-slate-100/90 border-y border-slate-200/60">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto py-16 px-6">
          {/* Columna Izquierda en Desktop (Imagen) */}
          <div className="order-2 md:order-1">
            <Image
              src="/images/trabajo-terreno.jpg"
              alt="Técnico especialista de Lopardo Servicios realizando mantenimiento de aire acondicionado y climatización en Neuquén"
              width={800}
              height={600}
              className="w-full h-[360px] md:h-[450px] object-cover object-top rounded-2xl shadow-xl border border-slate-200/80"
            />
          </div>
          {/* Columna Derecha en Desktop (Texto) */}
          <div className="flex flex-col gap-4 order-1 md:order-2">
            <h2 className="text-3xl font-bold tracking-tight text-brand md:text-4xl">
              Respaldo y experiencia en terreno
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
              Aseguramos la eficiencia térmica de tu empresa o institución. Con un equipo técnico de más de 10 años de trayectoria y supervisión especializada con más de 30 años de experiencia en el rubro, extendiendo la vida útil de sus equipos.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
