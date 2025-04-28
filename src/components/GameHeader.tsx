
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const GameHeader: React.FC = () => {
  const { gameState, startGame, resetGame, loading } = useGame();
  
  const handleAction = () => {
    if (gameState.status === 'not_started') {
      startGame();
    } else {
      resetGame();
    }
  };

  return (
    <Card className="shadow-md w-full mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-center">
          Negotiation Arena
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Negotiate with the AI to split {gameState.totalResources} resources
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col justify-center items-center sm:items-start">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-negotiation-player"></div>
              <span>You (Player)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-negotiation-ai"></div>
              <span>AI Agent</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {gameState.status === 'in_progress' ? (
              <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-md">
                <span className="font-medium">Round:</span>
                <span>{gameState.currentRound} / {gameState.maxRounds}</span>
              </div>
            ) : (
              <Button 
                onClick={handleAction} 
                disabled={loading}
                variant={gameState.status === 'not_started' ? 'default' : 'outline'}
              >
                {gameState.status === 'not_started' ? 'Start New Game' : 'Reset Game'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameHeader;
