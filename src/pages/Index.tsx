
import React from 'react';
import { GameProvider } from '@/contexts/GameContext';
import GameBoard from '@/components/GameBoard';

const Index = () => {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <GameProvider>
        <GameBoard />
      </GameProvider>
    </main>
  );
};

export default Index;
