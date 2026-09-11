'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function OwnerReservations() {
  const [reservations, setReservations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [renters, setRenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return router.push('/auth/login');

        const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();
        if (userData?.role !== 'propietario') return router.push('/');

        const { data: reservationsData } = await supabase
          .from('reservations')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        const { data: vehiclesData } = await supabase.from('vehicles').select('*');
        const { data: rentersData } = await supabase.from('users').select('*');

        setReservations(reservationsData || []);
        setVehicles(vehiclesData || []);
        setRenters(rentersData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (reservationId) => {
    await supabase.from('reservations').update({ status: 'confirmada' }).eq('id', reservationId);
    setReservations(reservations.map(r => r.id === reservationId ? { ...r, status: 'confirmada' } : r));
  };

  const handleCancel = async (reservationId) => {
    await supabase.from('reservations').update({ status: 'cancelada' }).eq('id', reservationId);
    setReservations(reservations.map(r => r.id === reservationId ? { ...r, status: 'cancelada' } : r));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/dashboard/propietario" className="text-red-500 hover:text-red-600 font-medium">← Volver al Dashboard</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Mis Reservas</h1>

        {reservations.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border text-center">
            <p className="text-gray-600">No hay reservas aún</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Vehiculo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Arrendatario</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Fechas</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(reservation => {
                  const vehicle = vehicles.find(v => v.id === reservation.vehicle_id);
                  const renter = renters.find(u => u.id === reservation.renter_id);
                  return (
                    <tr key={reservation.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{vehicle?.brand} {vehicle?.model}</td>
                      <td className="px-6 py-4">{renter?.full_name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">
                        <p>{new Date(reservation.start_date).toLocaleDateString()}</p>
                        <p className="text-gray-600">a {new Date(reservation.end_date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 font-medium">{reservation.total_cost.toLocaleString()} Gs</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          reservation.status === 'confirmada' ? 'bg-green-100 text-green-800' :
                          reservation.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          reservation.status === 'en_curso' ? 'bg-blue-100 text-blue-800' :
                          reservation.status === 'completada' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        {reservation.status === 'pendiente' && (
                          <>
                            <button onClick={() => handleApprove(reservation.id)} className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">Aprobar</button>
                            <button onClick={() => handleCancel(reservation.id)} className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">Rechazar</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}