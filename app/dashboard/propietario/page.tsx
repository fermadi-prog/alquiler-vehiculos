'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Vehicle, User } from '@/lib/types';

export default function OwnerDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push('/auth/login');
          return;
        }

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        setUser(userData);

        if (userData?.role !== 'propietario') {
          router.push('/');
          return;
        }

        const { data: vehiclesData } = await supabase
          .from('vehicles')
          .select('*')
          .eq('owner_id', authUser.id)
          .order('created_at', { ascending: false });

        setVehicles(vehiclesData || []);
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (vehicleId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      await supabase.from('vehicles').delete().eq('id', vehicleId);
      setVehicles(vehicles.filter(v => v.id !== vehicleId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mi Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hola, {user?.full_name || 'Usuario'}</span>
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">Vehículos Activos</p>
            <p className="text-4xl font-bold text-gray-900">{vehicles.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">Ganancias Este Mes</p>
            <p className="text-4xl font-bold text-green-600">0 Gs</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">Rating</p>
            <p className="text-4xl font-bold text-yellow-600">{user?.average_rating || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Mis Vehículos</h2>
            <Link
              href="/dashboard/propietario/nuevo"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
            >
              + Publicar
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No tienes vehículos publicados</p>
              <Link
                href="/dashboard/propietario/nuevo"
                className="inline-block px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                Publica tu primer vehículo
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="p-6 hover:bg-gray-50 transition flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <div className="mt-2 flex gap-4 text-sm text-gray-600">
                      <span>Año: {vehicle.year}</span>
                      <span>Ciudad: {vehicle.city}</span>
                      <span>Precio: {vehicle.daily_price} Gs/día</span>
                    </div>
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Disponible
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
