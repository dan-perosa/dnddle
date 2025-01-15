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
    return <div className="w-screen h-screen bg-dark-green text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-green text-light-beige flex items-center justify-center">
      <Head>
        <title>Welcome to D&D Wordle</title>
        <link rel="icon" href="/favicon3.ico" />
      </Head>
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to D&D Wordle!</h1>
        <p className="text-lg mb-12">Choose a minigame to start:</p>
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleMonsterClick}
            className="bg-main-button hover:bg-main-button-hover text-light-beige px-6 py-3 rounded-lg transition-colors duration-300 w-[130px]"
          >
            Monster
          </button>
          <button
            onClick={handleSpellClick}
            className="bg-main-button hover:bg-main-button-hover text-light-beige px-6 py-3 rounded-lg transition-colors duration-300 w-[130px]"
          >
            Spell
          </button>
          <button
            onClick={handleClassClick}
            className="bg-main-button hover:bg-main-button-hover text-light-beige px-6 py-3 rounded-lg transition-colors duration-300 w-[130px]"
          >
            Class
          </button>
          <button
            onClick={handleEquipmentClick}
            className="bg-main-button hover:bg-main-button-hover text-light-beige px-6 py-3 rounded-lg transition-colors duration-300 w-[130px]"
          >
            Equipment
          </button>
        </div>
      </main>
    </div>
  );
}
