import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-red-500">🚗</span>
            <h1 className="text-2xl font-bold text-gray-900">AlquilaVehiculos</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/auth/login" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
              Iniciar sesión
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium">
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Alquila vehículos de confianza
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Conectamos propietarios responsables con personas que necesitan vehículos. Seguro, transparente y al instante.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/auth/register"
                  className="px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-lg"
                >
                  Alquila ahora
                </Link>
                <Link
                  href="/auth/register"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-gray-400 transition font-semibold text-lg"
                >
                  Publica tu vehículo
                </Link>
              </div>
            </div>
            <div className="text-center">
              <div className="text-9xl">🚗</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">¿Por qué elegir AlquilaVehiculos?</h3>
          <div className="grid grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🔒</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Seguro y verificado</h4>
              <p className="text-gray-600 leading-relaxed">
                Todos los usuarios pasan por verificación de documentos. Seguros obligatorios en cada alquiler.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">💰</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Precios transparentes</h4>
              <p className="text-gray-600 leading-relaxed">
                Sin comisiones ocultas. Ve exactamente cuánto pagarás o ganarás antes de confirmar.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Rápido y fácil</h4>
              <p className="text-gray-600 leading-relaxed">
                Reserva en minutos. Retira tu vehículo al instante. Comienza a ahorrar o ganar hoy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">¿Listo para comenzar?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Únete a miles de usuarios que ya confían en nosotros
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-lg"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Sobre nosotros</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Prensa</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Comunidad</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white transition">Seguridad</a></li>
                <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Términos</a></li>
                <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📧 comercial@fermadi.com.py</li>
                <li>📞 +595 (opcional)</li>
                <li>🌐 fermadi.com.py</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">© 2024 AlquilaVehiculos by Fermadi</p>
              <p className="text-gray-400 text-sm">Hecho con ❤️ en Paraguay</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
