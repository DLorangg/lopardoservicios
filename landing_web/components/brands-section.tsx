"use client";

const brands = [
  { name: "CARRIER", sub: "Climatización" },
  { name: "DAIKIN", sub: "VRV / Inverter" },
  { name: "BGH", sub: "Confort" },
  { name: "SURREY", sub: "Industrial" },
  { name: "YORK", sub: "Chillers" },
  { name: "MIDEA", sub: "Eficiencia A" },
];

export function BrandsSection() {
  return (
    <section className="bg-surface py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">
        {/* Label */}
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground text-center">
          Especialistas capacitados en las tecnologías líderes del mercado
        </p>

        {/* Brands row */}
        <div className="w-full grid grid-cols-3 sm:grid-cols-6 gap-6">
          {brands.map(({ name, sub }) => (
            <div
              key={name}
              className="
                group flex flex-col items-center justify-center
                gap-1 py-5 px-3
                rounded-xl border border-border bg-white
                opacity-75 grayscale
                transition-all duration-300
                hover:opacity-100 hover:grayscale-0 hover:shadow-sm hover:border-brand/20
                cursor-default select-none
              "
            >
              {/* Brand logotype — bold wordmark style */}
              <span
                className="
                  text-base font-black tracking-tight
                  text-slate-600
                  leading-none
                "
              >
                {name}
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                {sub}
              </span>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <p className="text-xs text-muted-foreground/60 text-center">
          Todos los equipos reciben servicio con repuestos originales y mano de obra certificada por fabricante.
        </p>
      </div>
    </section>
  );
}
