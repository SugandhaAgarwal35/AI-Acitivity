
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import GameHeader from './GameHeader';
import ResourceDisplay from './ResourceDisplay';
import GameControls from './GameControls';
import HistoryLog from './HistoryLog';
import GameRules from './GameRules';

const GameBoard: React.FC = () => {
  const { gameState } = useGame();
  
  // Determine which offer to display in the resource visualizer
  const displayOffer = gameState.status === 'accepted' || gameState.status === 'max_rounds_reached'
    ? gameState.acceptedOffer
    : gameState.lastOffer;
    
  const displayOfferedBy = gameState.lastOfferedBy;
  const isAccepted = gameState.status === 'accepted' || gameState.status === 'max_rounds_reached';
  
  return (
    <div className="max-w-5xl mx-auto px-4">
      <GameHeader />
      
      <ResourceDisplay 
        offer={displayOffer}
        offeredBy={displayOfferedBy}
        isAccepted={isAccepted}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GameControls />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          <HistoryLog />
          <GameRules />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
