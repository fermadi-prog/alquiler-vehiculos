'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Vehicle, User } from '@/lib/types';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
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
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVerifyVehicle = async (vehicleId: string) => {
    await supabase.from('vehicles').update({ is_verified: true }).eq('id', vehicleId);
    setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, is_verified: true } : v));
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (confirm('¿Eliminar este vehículo?')) {
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
          <h1 className="text-3xl font-bold text-gray-900">🔐 Panel de Admin</h1>
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('stats')}
            className={px-4 py-2 font-medium border-b-2 transition }
          >
            Estadísticas
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={px-4 py-2 font-medium border-b-2 transition }
          >
            Vehículos ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={px-4 py-2 font-medium border-b-2 transition }
          >
            Usuarios ({users.length})
          </button>
        </div>

        {/* Estadísticas */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-sm font-medium mb-2">Usuarios Totales</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-sm font-medium mb-2">Vehículos Totales</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalVehicles}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-sm font-medium mb-2">Vehículos Verificados</p>
              <p className="text-4xl font-bold text-green-600">{stats.verifiedVehicles}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-sm font-medium mb-2">Pendientes de Verificar</p>
              <p className="text-4xl font-bold text-yellow-600">{stats.totalVehicles - stats.verifiedVehicles}</p>
            </div>
          </div>
        )}

        {/* Vehículos */}
        {activeTab === 'vehicles' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Gestión de Vehículos</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vehículo</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Propietario</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Precio/día</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(vehicle => {
                    const owner = users.find(u => u.id === vehicle.owner_id);
                    return (
                      <tr key={vehicle.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{vehicle.brand} {vehicle.model}</p>
                            <p className="text-sm text-gray-500">{vehicle.year}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{owner?.full_name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{vehicle.daily_price} Gs</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={inline-block px-3 py-1 rounded-full text-xs font-medium }>
                            {vehicle.is_verified ? '✓ Verificado' : '⏳ Pendiente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          {!vehicle.is_verified && (
                            <button
                              onClick={() => handleVerifyVehicle(vehicle.id)}
                              className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
                            >
                              Verificar
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Usuarios */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Gestión de Usuarios</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rating</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Viajes</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{user.full_name || 'Sin nombre'}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={inline-block px-3 py-1 rounded-full text-xs font-medium }>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{user.average_rating ? user.average_rating.toFixed(1) : 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-900">{user.total_trips || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
