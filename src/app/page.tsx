"use client";

import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando o carregamento
    setTimeout(() => {
      setLoading(false);
    }, 500); // Ajuste o tempo de carregamento conforme necessário
  }, []);

  const handleMonsterClick = () => {
    router.push('/monster');
  };

  const handleSpellClick = () => {
    router.push('/spell');
  };

  const handleClassClick = () => {
    router.push('/class');
  };

  const handleEquipmentClick = () => {
    router.push('/equipment');
  };

  if (loading) {
    return <div className="w-screen h-screen bg-dark-green text-gold flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-green text-light-beige flex items-center justify-center">
      <Head>
        <title>Bem-vindo ao D&D Wordle</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-8">Bem-vindo ao D&D Wordle!</h1>
        <p className="text-lg mb-12">Escolha um minigame para começar:</p>
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleMonsterClick}
            className="bg-forest-green hover:bg-moss-green text-light-beige px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Monster
          </button>
          <button
            onClick={handleSpellClick}
            className="bg-emerald-green hover:bg-jade-green text-light-beige px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Spell
          </button>
          <button
            onClick={handleClassClick}
            className="bg-burgundy hover:bg-ruby-red text-light-beige px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Class
          </button>
          <button
            onClick={handleEquipmentClick}
            className="bg-royal-blue hover:bg-sapphire-blue text-light-beige px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Equipment
          </button>
        </div>
      </main>
    </div>
  );
}
