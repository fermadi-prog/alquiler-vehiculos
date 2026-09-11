'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function VehicleDetail() {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: vehicleData } = await supabase.from('vehicles').select('*').eq('id', params.id).single();
      setVehicle(vehicleData);
      setLoading(false);
    };
    init();
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!vehicle) return <div className="min-h-screen flex items-center justify-center">Vehiculo no encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/dashboard/arrendatario" className="text-red-500">Volver</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg border p-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <img src="https://source.unsplash.com/800x450/?car" alt="auto" className="w-full rounded-lg mb-6" />
              <h1 className="text-3xl font-bold mb-2">{vehicle.brand} {vehicle.model}</h1>
              <p className="text-2xl font-bold text-red-500">{vehicle.daily_price} Gs/dia</p>
            </div>
            <div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Reservar</h2>
                <p className="text-gray-600">Sistema de reservas en desarrollo</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
