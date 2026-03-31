export default function Home() {
  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-navy tracking-tight">Persys</span>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#servicios" className="hover:text-accent transition-colors">Servicios</a>
            <a href="#nosotros" className="hover:text-accent transition-colors">Nosotros</a>
            <a href="#contacto" className="hover:text-accent transition-colors">Contacto</a>
          </nav>
          <a
            href="#contacto"
            className="text-sm font-medium bg-accent text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Consultanos
          </a>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section id="inicio" className="hero-pattern py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-navy leading-tight tracking-tight">
                Distribución mayorista para supermercados
              </h1>
              <p className="mt-6 text-lg text-gray-500 font-light leading-relaxed">
                Proveemos productos de almacén, frescos, limpieza y bebidas a supermercados de todo el país.
                Más de 10 años conectando productores con puntos de venta.
              </p>
              <div className="mt-8">
                <a
                  href="#contacto"
                  className="inline-block bg-accent text-white font-medium px-7 py-3 rounded-md hover:opacity-90 transition-opacity"
                >
                  Consultanos
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section id="servicios" className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-navy mb-4">Nuestros productos</h2>
            <p className="text-lg text-gray-500 mb-12 max-w-xl">
              Contamos con un catálogo amplio para cubrir todas las góndolas de tu negocio.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Almacén */}
              <div className="card bg-white rounded-lg p-6">
                <div className="mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-navy mb-2">Almacén</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Aceites, conservas, pastas, harinas, legumbres y todos los productos secos esenciales.
                </p>
              </div>

              {/* Frescos y Lácteos */}
              <div className="card bg-white rounded-lg p-6">
                <div className="mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-navy mb-2">Frescos y Lácteos</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Leches, yogures, quesos, fiambres y productos refrigerados con cadena de frío garantizada.
                </p>
              </div>

              {/* Limpieza e Higiene */}
              <div className="card bg-white rounded-lg p-6">
                <div className="mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-navy mb-2">Limpieza e Higiene</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Detergentes, lavandinas, papel, artículos de higiene personal y cuidado del hogar.
                </p>
              </div>

              {/* Bebidas y Snacks */}
              <div className="card bg-white rounded-lg p-6">
                <div className="mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-navy mb-2">Bebidas y Snacks</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Gaseosas, jugos, aguas, cervezas, golosinas y snacks de las principales marcas.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Stats / Nosotros */}
        <section id="nosotros" className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-navy mb-4">Por qué elegirnos</h2>
            <p className="text-lg text-gray-500 mb-16 max-w-xl">
              Años de experiencia, un catálogo completo y cobertura nacional nos distinguen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <p className="text-5xl font-bold text-accent">+10</p>
                <p className="mt-2 text-base font-medium text-navy">Años de experiencia</p>
                <p className="mt-1 text-sm text-gray-500">Trabajando con supermercados de todo el país desde nuestros inicios.</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-accent">+2.000</p>
                <p className="mt-2 text-base font-medium text-navy">Productos disponibles</p>
                <p className="mt-1 text-sm text-gray-500">Un catálogo amplio para que tu supermercado tenga todo lo que necesita.</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-accent">Nacional</p>
                <p className="mt-2 text-base font-medium text-navy">Cobertura en todo el país</p>
                <p className="mt-1 text-sm text-gray-500">Llegamos a clientes en todas las provincias de Argentina.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-navy mb-4">Contacto</h2>
            <p className="text-lg text-gray-500 mb-12 max-w-xl">
              ¿Sos dueño de un supermercado o responsable de compras? Escribinos y te asesoramos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">

              {/* Dirección */}
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy mb-1">Dirección</p>
                  {/* PLACEHOLDER_ADDRESS */}
                  <p className="text-sm text-gray-500">Calle Ejemplo 1234, Ciudad Autónoma de Buenos Aires, Argentina</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy mb-1">Email</p>
                  {/* PLACEHOLDER_EMAIL */}
                  <a
                    href="mailto:contacto@persys.com.ar"
                    className="text-sm text-accent hover:underline"
                  >
                    contacto@persys.com.ar
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold tracking-tight">Persys</span>
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Persys. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
