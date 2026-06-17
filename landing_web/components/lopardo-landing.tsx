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
  { icon: Zap, label: "Respuesta Inmediata" },
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
    <div className="min-h-screen bg-surface text-foreground">
      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/85 backdrop-blur-md">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a href="#inicio" className="flex shrink-0 items-center gap-3">
            <Image
              src="/images/lopardo-logo.png"
              alt="Lopardo Servicios Climatización"
              width={56}
              height={56}
              className="h-12 w-12 object-contain sm:h-14 sm:w-14"
              priority
            />
            <span className="hidden flex-col leading-tight sm:flex">
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border text-brand lg:hidden"
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
          <div className="border-t border-border/60 bg-surface lg:hidden">
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
      <section id="inicio" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 py-12 md:py-20 lg:grid-cols-2 lg:gap-16">
          {/* Columna texto */}
          <div className="flex flex-col">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand ring-1 ring-brand/15">
              🛡️ MÁS DE 10 AÑOS DE EXPERIENCIA EN EL RUBRO
            </span>

            <h1 className="mt-5 text-pretty text-4xl font-extrabold leading-[1.1] tracking-tight text-brand sm:text-5xl lg:text-6xl">
              Climatización Corporativa y Mantenimiento de Aires Acondicionados
              en Neuquén.
            </h1>

            <h2 className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Aseguramos la eficiencia térmica de tu empresa o institución. Con un equipo técnico de más de 10 años de trayectoria y supervisión especializada con más de 30 años de experiencia en el rubro, garantizamos la continuidad de tus activos.
            </h2>

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
            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
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

          {/* Columna imagen */}
          <div className="relative">
            <div className="overflow-hidden rounded-xl shadow-2xl shadow-brand/15 ring-1 ring-border/60">
              <Image
                src="/images/hero-hvac.png"
                alt="Técnico profesional de Lopardo Servicios realizando mantenimiento en una unidad condensadora de aire acondicionado industrial en una azotea"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            {/* Tarjeta flotante */}
            <div className="absolute -bottom-5 left-5 hidden rounded-xl border border-border/60 bg-surface/95 px-5 py-3 shadow-lg backdrop-blur sm:flex sm:items-center sm:gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                <Zap className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-brand">
                  Atención Corporativa
                </span>
                <span className="text-xs text-muted-foreground">
                  Cobertura en toda la región
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
