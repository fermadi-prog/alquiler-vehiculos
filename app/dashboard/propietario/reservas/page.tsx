'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function OwnerReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/auth/login');

      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (userData?.role !== 'propietario') return router.push('/');

      const { data } = await supabase.from('reservations').select('*').eq('owner_id', user.id).order('created_at', { ascending: false });

      setReservations(data || []);
      setLoading(false);
    };

    init();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/dashboard/propietario" className="text-red-500 hover:text-red-600 font-medium">Volver</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Mis Reservas</h1>

        {reservations.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border text-center">
            <p className="text-gray-600">No hay reservas</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Arrendatario</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Fechas</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{r.renter_id}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(r.start_date).toLocaleDateString()} a {new Date(r.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">{r.total_cost?.toLocaleString()} Gs</td>
                    <td className="px-6 py-4">
                      <span className={r.status === 'confirmada' ? 'bg-green-100 text-green-800 px-3 py-1 rounded text-xs' : 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs'}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {r.status === 'pendiente' && (
                        <button onClick={() => supabase.from('reservations').update({ status: 'confirmada' }).eq('id', r.id).then(() => setReservations(reservations.map(x => x.id === r.id ? { ...x, status: 'confirmada' } : x)))} className="px-3 py-1 bg-green-500 text-white text-sm rounded">Aprobar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}