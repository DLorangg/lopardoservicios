"use client";

const clients = [
  { name: "NIPPON CAR", sub: "Concesionario Toyota" },
  { name: "CAMUZZI", sub: "Distribuidora de Gas del Sur" },
  { name: "SAHIORA", sub: "Concesionario Chevrolet" },
  { name: "FARMACIAS GLOBAL", sub: "Red de Farmacias" },
  { name: "GLOBAL OIL", sub: "Servicios Petroleros" },
  { name: "GTC", sub: "Logística y Servicios" },
];

export function BrandsSection() {
  return (
    <section id="clientes" className="bg-surface py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center leading-tight">
          Empresas e Instituciones que confían en nosotros
        </h2>

        {/* Clients row */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {clients.map(({ name, sub }) => (
            <div
              key={name}
              className="
                group flex flex-col items-center justify-center
                gap-2 py-5 px-3
                rounded-xl border border-border bg-white
                opacity-85
                transition-all duration-300
                hover:opacity-100 hover:shadow-sm hover:border-brand/20
                cursor-default select-none
              "
            >
              {/* Client name */}
              <span
                className="
                  text-center text-sm md:text-base font-extrabold tracking-tight
                  text-slate-800
                  leading-snug
                "
              >
                {name}
              </span>
              <span className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
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
