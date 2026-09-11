'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const [data, setData] = useState({ users: [], vehicles: [], loading: true });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/auth/login');

      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (userData?.role !== 'admin') return router.push('/');

      const { data: users } = await supabase.from('users').select('*');
      const { data: vehicles } = await supabase.from('vehicles').select('*');
      
      setData({ users: users || [], vehicles: vehicles || [], loading: false });
    };
    init();
  }, []);

  if (data.loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Panel Admin Fermadi</h1>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="px-4 py-2 bg-red-500 text-white rounded">Salir</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Bienvenido Fernando</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Total Usuarios</p>
            <p className="text-4xl font-bold">{data.users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Total Vehiculos</p>
            <p className="text-4xl font-bold">{data.vehicles.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Verificados</p>
            <p className="text-4xl font-bold text-green-600">{data.vehicles.filter(v => v.is_verified).length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Pendientes</p>
            <p className="text-4xl font-bold text-yellow-600">{data.vehicles.filter(v => !v.is_verified).length}</p>
          </div>
        </div>
      </main>
    </div>
  );
}