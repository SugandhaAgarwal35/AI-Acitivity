
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Types
export type Agent = 'player' | 'ai';
export type Offer = [number, number]; // [offerer's share, other agent's share]
export type GameStatus = 'not_started' | 'in_progress' | 'accepted' | 'max_rounds_reached';

export interface GameState {
  totalResources: number;
  currentRound: number;
  maxRounds: number;
  currentTurn: Agent;
  lastOffer: Offer | null;
  lastOfferedBy: Agent | null;
  status: GameStatus;
  acceptedOffer: Offer | null;
}

interface GameContextType {
  gameState: GameState;
  startGame: () => void;
  makePlayerOffer: (playerShare: number) => void;
  playerAcceptOffer: () => void;
  resetGame: () => void;
  loading: boolean;
}

// Default game state
const defaultGameState: GameState = {
  totalResources: 100,
  currentRound: 0,
  maxRounds: 10,
  currentTurn: 'player',
  lastOffer: null,
  lastOfferedBy: null,
  status: 'not_started',
  acceptedOffer: null,
};

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Mock API functions (in a real app, these would connect to a backend)
const simulateApiCall = <T,>(data: T, delay: number = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

const apiStartGame = async (): Promise<GameState> => {
  const initialState: GameState = {
    ...defaultGameState,
    status: 'in_progress',
    currentRound: 1,
  };
  return simulateApiCall(initialState);
};

const apiMakeOffer = async (
  currentState: GameState, 
  playerOffer: [number, number]
): Promise<GameState> => {
  // Update state with player's offer
  let newState = {
    ...currentState,
    lastOffer: playerOffer,
    lastOfferedBy: 'player',
    currentTurn: 'ai',
  };
  
  // Simulate AI's decision
  const [playerShare, aiShare] = playerOffer;
  const aiMinAcceptableShare = Math.floor(currentState.totalResources * 0.4); // AI wants at least 40%
  
  if (aiShare >= aiMinAcceptableShare) {
    // AI accepts the offer
    newState = {
      ...newState,
      status: 'accepted',
      acceptedOffer: playerOffer,
    };
  } else {
    // AI makes counter-offer
    // AI increases its share by a small percentage (5-10%)
    const aiDesiredShare = Math.min(
      aiShare + Math.floor(currentState.totalResources * (Math.random() * 0.05 + 0.05)),
      Math.floor(currentState.totalResources * 0.6) // AI won't ask for more than 60%
    );
    const playerShare = currentState.totalResources - aiDesiredShare;
    const aiOffer: Offer = [playerShare, aiDesiredShare];
    
    newState = {
      ...newState,
      lastOffer: aiOffer,
      lastOfferedBy: 'ai',
      currentTurn: 'player',
      currentRound: currentState.currentRound + 1,
    };
    
    // Check if max rounds reached
    if (newState.currentRound > newState.maxRounds) {
      newState.status = 'max_rounds_reached';
      // In case of max rounds, the last offer becomes the final division
      newState.acceptedOffer = aiOffer;
    }
  }
  
  return simulateApiCall(newState, 1000); // Simulate AI thinking time
};

const apiAcceptOffer = async (currentState: GameState): Promise<GameState> => {
  if (!currentState.lastOffer || currentState.lastOfferedBy !== 'ai') {
    throw new Error('No offer to accept');
  }
  
  const acceptedState: GameState = {
    ...currentState,
    status: 'accepted',
    acceptedOffer: currentState.lastOffer,
  };
  
  return simulateApiCall(acceptedState);
};

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [loading, setLoading] = useState(false);

  const startGame = async () => {
    setLoading(true);
    try {
      const newState = await apiStartGame();
      setGameState(newState);
    } catch (error) {
      console.error('Failed to start game:', error);
      toast.error('Failed to start the game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const makePlayerOffer = async (playerShare: number) => {
    if (gameState.status !== 'in_progress' || gameState.currentTurn !== 'player') {
      return;
    }

    const aiShare = gameState.totalResources - playerShare;
    if (playerShare < 0 || aiShare < 0 || playerShare > gameState.totalResources) {
      toast.error('Invalid offer. Please check your values.');
      return;
    }

    setLoading(true);
    try {
      const newState = await apiMakeOffer(gameState, [playerShare, aiShare]);
      setGameState(newState);
    } catch (error) {
      console.error('Failed to make offer:', error);
      toast.error('Failed to submit your offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const playerAcceptOffer = async () => {
    if (gameState.status !== 'in_progress' || gameState.currentTurn !== 'player' || gameState.lastOfferedBy !== 'ai') {
      return;
    }

    setLoading(true);
    try {
      const newState = await apiAcceptOffer(gameState);
      setGameState(newState);
    } catch (error) {
      console.error('Failed to accept offer:', error);
      toast.error('Failed to accept the offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setGameState(defaultGameState);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        startGame,
        makePlayerOffer,
        playerAcceptOffer,
        resetGame,
        loading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
