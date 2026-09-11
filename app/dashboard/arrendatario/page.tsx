'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Vehicle, User } from '@/lib/types';

export default function RenterDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

        const { data: vehiclesData } = await supabase
          .from('vehicles')
          .select('*')
          .eq('is_verified', true)
          .order('created_at', { ascending: false });

        setVehicles(vehiclesData || []);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Cargando vehículos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Buscar Vehículos</h1>
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
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Vehículos Disponibles</h2>

        {vehicles.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 text-lg">No hay vehículos disponibles en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-5xl">🚗</span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h3>
                  <p className="text-sm text-gray-600">{vehicle.year} - {vehicle.color}</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm"><span className="text-gray-600">📍 Ubicación:</span> {vehicle.city}</p>
                    <p className="text-sm"><span className="text-gray-600">💺 Asientos:</span> {vehicle.seats || 5}</p>
                    <p className="text-2xl font-bold text-red-500 mt-4">{vehicle.daily_price} Gs/día</p>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium">
                    Alquilar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
