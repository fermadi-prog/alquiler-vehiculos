'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function RatePage() {
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const reservationId = searchParams.get('reservation_id');
  const targetUserId = searchParams.get('user_id');

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/auth/login');
      if (!reservationId || !targetUserId) return router.push('/');
      setLoading(false);
    };

    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('ratings').insert([
        {
          reservation_id: reservationId,
          rater_id: user.id,
          rated_user_id: targetUserId,
          rating: rating,
          comment: comment,
        },
      ]);

      if (error) throw error;

      alert('Calificacion enviada. Gracias!');
      router.push('/dashboard/arrendatario');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Link href="/dashboard/arrendatario" className="text-red-500 hover:text-red-600 font-medium">Volver</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg border p-8">
          <h1 className="text-3xl font-bold mb-2">Dejar Calificacion</h1>
          <p className="text-gray-600 mb-8">¿Como fue tu experiencia con este usuario?</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-4">Calificacion</label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-4xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">{rating} estrellas</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Comentario (opcional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntanos tu experiencia..."
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 font-medium"
            >
              {submitting ? 'Enviando...' : 'Enviar Calificacion'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}