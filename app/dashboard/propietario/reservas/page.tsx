'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function OwnerReservations() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/auth/login');

      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (userData?.role !== 'propietario') return router.push('/');

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
        <div className="bg-white p-12 rounded-lg border text-center">
          <p className="text-gray-600">Sistema de reservas en desarrollo</p>
          <p className="text-sm text-gray-500 mt-2">Pronto podras ver todas tus reservas aqui</p>
        </div>
      </main>
    </div>
  );
}