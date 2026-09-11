'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/auth/login');

      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (userData?.role !== 'admin') return router.push('/');

      const { data: u } = await supabase.from('users').select('*');
      const { data: v } = await supabase.from('vehicles').select('*');
      
      setUsers(u || []);
      setVehicles(v || []);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  const handleVerify = async (id) => {
    await supabase.from('vehicles').update({ is_verified: true }).eq('id', id);
    setVehicles(vehicles.map(v => v.id === id ? { ...v, is_verified: true } : v));
  };

  const handleDelete = async (id) => {
    if (confirm('Eliminar?')) {
      await supabase.from('vehicles').delete().eq('id', id);
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Panel Admin</h1>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="px-4 py-2 bg-red-500 text-white rounded">Salir</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-4 mb-8 border-b">
          <button onClick={() => setActiveTab('stats')} className={px-4 py-2  font-medium}>Estadisticas</button>
          <button onClick={() => setActiveTab('vehicles')} className={px-4 py-2  font-medium}>Vehiculos ({vehicles.length})</button>
          <button onClick={() => setActiveTab('users')} className={px-4 py-2  font-medium}>Usuarios ({users.length})</button>
        </div>

        {activeTab === 'stats' && (
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border"><p className="text-gray-600 text-sm mb-2">Usuarios</p><p className="text-4xl font-bold">{users.length}</p></div>
            <div className="bg-white p-6 rounded-lg border"><p className="text-gray-600 text-sm mb-2">Vehiculos</p><p className="text-4xl font-bold">{vehicles.length}</p></div>
            <div className="bg-white p-6 rounded-lg border"><p className="text-gray-600 text-sm mb-2">Verificados</p><p className="text-4xl font-bold text-green-600">{vehicles.filter(v => v.is_verified).length}</p></div>
            <div className="bg-white p-6 rounded-lg border"><p className="text-gray-600 text-sm mb-2">Pendientes</p><p className="text-4xl font-bold text-yellow-600">{vehicles.filter(v => !v.is_verified).length}</p></div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="bg-white rounded-lg border overflow-hidden">
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
                {vehicles.map(v => (
                  <tr key={v.id} className="border-b">
                    <td className="px-6 py-4 font-medium">{v.brand} {v.model}</td>
                    <td className="px-6 py-4">{users.find(u => u.id === v.owner_id)?.full_name || 'N/A'}</td>
                    <td className="px-6 py-4">{v.daily_price} Gs</td>
                    <td className="px-6 py-4"><span className={v.is_verified ? 'bg-green-100 text-green-800 px-3 py-1 rounded text-xs' : 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs'}>{v.is_verified ? 'Verificado' : 'Pendiente'}</span></td>
                    <td className="px-6 py-4 flex gap-2">{!v.is_verified && <button onClick={() => handleVerify(v.id)} className="px-3 py-1 bg-green-500 text-white text-sm rounded">Verificar</button>}<button onClick={() => handleDelete(v.id)} className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded">Eliminar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="px-6 py-4 font-medium">{u.full_name || 'Sin nombre'}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs">{u.role}</span></td>
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
