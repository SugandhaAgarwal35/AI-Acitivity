
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const GameControls: React.FC = () => {
  const { gameState, makePlayerOffer, playerAcceptOffer, loading } = useGame();
  const [playerShare, setPlayerShare] = useState(Math.floor(gameState.totalResources / 2));
  
  const isPlayerTurn = gameState.currentTurn === 'player' && gameState.status === 'in_progress';
  const isAiTurn = gameState.currentTurn === 'ai' && gameState.status === 'in_progress';
  const canAccept = isPlayerTurn && gameState.lastOfferedBy === 'ai';
  
  const aiShare = gameState.totalResources - playerShare;
  
  const handleSubmitOffer = () => {
    if (playerShare < 0 || playerShare > gameState.totalResources) {
      toast.error('Invalid offer amount');
      return;
    }
    makePlayerOffer(playerShare);
  };
  
  const handleSliderChange = (value: number[]) => {
    setPlayerShare(value[0]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setPlayerShare(Math.max(0, Math.min(gameState.totalResources, value)));
    } else {
      setPlayerShare(0);
    }
  };

  if (gameState.status === 'not_started') {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">
            Click "Start New Game" to begin negotiating
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (gameState.status === 'accepted' || gameState.status === 'max_rounds_reached') {
    let outcome;
    let explanation;
    
    if (gameState.status === 'accepted') {
      const acceptedBy = gameState.lastOfferedBy === 'player' ? 'AI' : 'You';
      outcome = `Offer Accepted by ${acceptedBy}!`;
      explanation = gameState.lastOfferedBy === 'player' 
        ? "The AI has accepted your offer." 
        : "You've accepted the AI's offer.";
    } else {
      outcome = "Maximum Rounds Reached";
      explanation = "No agreement was reached within the maximum number of rounds.";
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{outcome}</CardTitle>
          <CardDescription className="text-center">{explanation}</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <div className="text-center">
            <p className="mb-2">Final Resource Distribution:</p>
            <p className="text-lg">
              <span className="font-bold text-negotiation-player">
                You: {gameState.acceptedOffer?.[0] || 0}
              </span>
              <span className="mx-2">|</span>
              <span className="font-bold text-negotiation-ai">
                AI: {gameState.acceptedOffer?.[1] || 0}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {isPlayerTurn 
            ? gameState.lastOfferedBy === 'ai'
              ? "AI has made an offer - your turn to respond"
              : "Your turn to make an offer" 
            : "AI is considering your offer..."}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPlayerTurn && (
          <>
            {canAccept && (
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <p className="text-center mb-2">The AI is offering you:</p>
                <p className="text-center text-lg font-bold">
                  <span className="text-negotiation-player">{gameState.lastOffer?.[0] || 0} for you</span>
                  <span className="mx-2">|</span>
                  <span className="text-negotiation-ai">{gameState.lastOffer?.[1] || 0} for AI</span>
                </p>
                <div className="mt-4 flex justify-center">
                  <Button 
                    onClick={playerAcceptOffer}
                    disabled={loading}
                    variant="default"
                  >
                    Accept This Offer
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="offer-slider">Your Offer (Drag to adjust)</Label>
                <div className="pt-4">
                  <Slider 
                    id="offer-slider"
                    min={0} 
                    max={gameState.totalResources} 
                    value={[playerShare]}
                    onValueChange={handleSliderChange}
                    step={1}
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="player-share">Your Share</Label>
                  <Input
                    id="player-share"
                    type="number"
                    value={playerShare}
                    onChange={handleInputChange}
                    min={0}
                    max={gameState.totalResources}
                    disabled={loading}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="ai-share">AI Share</Label>
                  <Input
                    id="ai-share"
                    type="number"
                    value={aiShare}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleSubmitOffer}
                  disabled={loading}
                  variant="default"
                >
                  {gameState.lastOfferedBy === 'ai' ? 'Counter Offer' : 'Make Offer'}
                </Button>
              </div>
            </div>
          </>
        )}
        
        {isAiTurn && (
          <div className="p-4 text-center">
            <p className="mb-2">Your offer to the AI:</p>
            <p className="text-lg font-bold">
              <span className="text-negotiation-player">{gameState.lastOffer?.[0] || 0} for you</span>
              <span className="mx-2">|</span>
              <span className="text-negotiation-ai">{gameState.lastOffer?.[1] || 0} for AI</span>
            </p>
            <div className="mt-6 flex justify-center items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-negotiation-ai animate-pulse"></div>
              <p className="text-muted-foreground">AI is thinking...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameControls;
