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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Panel Admin</h1>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="px-4 py-2 bg-red-500 text-white rounded">Salir</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Estadisticas</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border"><p className="text-gray-600 text-sm mb-2">Usuarios</p><p className="text-4xl font-bold">{users.length}</p></div>
          <div className="bg-white p-6 rounded-lg border"><p className="text-gray-600 text-sm mb-2">Vehiculos</p><p className="text-4xl font-bold">{vehicles.length}</p></div>
          <div className="bg-white p-6 rounded-lg border"><p className="text-gray-600 text-sm mb-2">Verificados</p><p className="text-4xl font-bold text-green-600">{vehicles.filter(v => v.is_verified).length}</p></div>
          <div className="bg-white p-6 rounded-lg border"><p className="text-gray-600 text-sm mb-2">Pendientes</p><p className="text-4xl font-bold text-yellow-600">{vehicles.filter(v => !v.is_verified).length}</p></div>
        </div>
      </main>
    </div>
  );
}