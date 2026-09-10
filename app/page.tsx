import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🚗 Alquiler Vehículos</h1>
          <div className="space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
              Iniciar sesión
            </Link>
            <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Alquila vehículos de forma segura y transparente
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Conectamos propietarios con personas que necesitan vehículos. Todo legal y asegurado.
          </p>

          <div className="space-x-4">
            <Link
              href="/auth/register"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Quiero alquilar un vehículo
            </Link>
            <Link
              href="/auth/register"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              Quiero publicar mi vehículo
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Seguro</h3>
            <p className="text-gray-600">Validación de documentos y seguros obligatorios</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">Transparente</h3>
            <p className="text-gray-600">Comisiones claras y sin sorpresas</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Rápido</h3>
            <p className="text-gray-600">Reserva en minutos y comienza a generar ingresos</p>
          </div>
        </div>
      </main>
    </div>
  );
}