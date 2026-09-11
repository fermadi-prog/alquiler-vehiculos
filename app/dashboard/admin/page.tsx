'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Vehicle, User } from '@/lib/types';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalVehicles: 0, verifiedVehicles: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
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

        if (userData?.role !== 'admin') {
          router.push('/');
          return;
        }

        const { data: usersData } = await supabase.from('users').select('*');
        const { data: vehiclesData } = await supabase.from('vehicles').select('*');

        setUsers(usersData || []);
        setVehicles(vehiclesData || []);
        setStats({
          totalUsers: usersData?.length || 0,
          totalVehicles: vehiclesData?.length || 0,
          verifiedVehicles: vehiclesData?.filter(v => v.is_verified).length || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVerifyVehicle = async (vehicleId) => {
    await supabase.from('vehicles').update({ is_verified: true }).eq('id', vehicleId);
    setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, is_verified: true } : v));
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (confirm('Estás seguro?')) {
      await supabase.from('vehicles').delete().eq('id', vehicleId);
      setVehicles(vehicles.filter(v => v.id !== vehicleId));
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Panel Admin</h1>
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('stats')}
            className={activeTab === 'stats' ? 'px-4 py-2 border-b-2 border-red-500 text-red-600 font-medium' : 'px-4 py-2 text-gray-600 font-medium'}
          >
            Estadisticas
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={activeTab === 'vehicles' ? 'px-4 py-2 border-b-2 border-red-500 text-red-600 font-medium' : 'px-4 py-2 text-gray-600 font-medium'}
          >
            Vehiculos ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'px-4 py-2 border-b-2 border-red-500 text-red-600 font-medium' : 'px-4 py-2 text-gray-600 font-medium'}
          >
            Usuarios ({users.length})
          </button>
        </div>

        {activeTab === 'stats' && (
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Usuarios Totales</p>
              <p className="text-4xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Vehiculos Totales</p>
              <p className="text-4xl font-bold">{stats.totalVehicles}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Verificados</p>
              <p className="text-4xl font-bold text-green-600">{stats.verifiedVehicles}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Pendientes</p>
              <p className="text-4xl font-bold text-yellow-600">{stats.totalVehicles - stats.verifiedVehicles}</p>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Gestion de Vehiculos</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Vehiculo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Propietario</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Precio</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => {
                  const owner = users.find(u => u.id === vehicle.owner_id);
                  return (
                    <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4"><p className="font-medium">{vehicle.brand} {vehicle.model}</p></td>
                      <td className="px-6 py-4"><p>{owner?.full_name || 'N/A'}</p></td>
                      <td className="px-6 py-4"><p className="font-medium">{vehicle.daily_price} Gs</p></td>
                      <td className="px-6 py-4">
                        <span className={vehicle.is_verified ? 'bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-medium' : 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-medium'}>
                          {vehicle.is_verified ? 'Verificado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        {!vehicle.is_verified && (
                          <button onClick={() => handleVerifyVehicle(vehicle.id)} className="px-3 py-1 bg-green-500 text-white text-sm rounded">Verificar</button>
                        )}
                        <button onClick={() => handleDeleteVehicle(vehicle.id)} className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded">Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Gestion de Usuarios</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Rating</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{user.full_name || 'Sin nombre'}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">{user.role}</span></td>
                    <td className="px-6 py-4">{user.average_rating ? user.average_rating.toFixed(1) : 'N/A'}</td>
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
