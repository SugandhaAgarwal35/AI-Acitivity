
import React from 'react';
import { useGame, Agent, Offer } from '@/contexts/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ResourceDisplayProps {
  offer?: Offer | null;
  offeredBy?: Agent | null;
  isAccepted?: boolean;
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ 
  offer, 
  offeredBy, 
  isAccepted = false 
}) => {
  const { gameState } = useGame();
  const { totalResources } = gameState;
  
  // Set defaults if no offer
  const [playerShare, aiShare] = offer || [totalResources / 2, totalResources / 2];
  
  const playerPercent = (playerShare / totalResources) * 100;
  const aiPercent = (aiShare / totalResources) * 100;
  
  // Determine which side is animated
  const isPlayerAnimated = offeredBy === 'player' && !isAccepted;
  const isAiAnimated = offeredBy === 'ai' && !isAccepted;

  return (
    <Card className="shadow-md mb-6">
      <CardContent className="py-6">
        <div className="text-center mb-2">
          <h3 className="font-medium">
            Resource Distribution
            {isAccepted && <span className="text-green-500 ml-2">(Accepted)</span>}
          </h3>
        </div>
        
        <div className="flex items-center mb-2">
          <div className="w-16 text-right pr-2">
            <span className={`
              font-bold
              ${isPlayerAnimated ? 'animate-pulse-gentle text-negotiation-player' : ''}
              ${isAccepted ? 'text-negotiation-player' : ''}
            `}>
              You: {playerShare}
            </span>
          </div>
          
          <div className="flex-1">
            <Progress 
              value={playerPercent} 
              className={`h-6 ${isPlayerAnimated || isAccepted ? 'bg-gray-200' : ''}`}
              indicatorClassName={`${isPlayerAnimated || isAccepted ? 'bg-negotiation-player' : 'bg-negotiation-player/70'}`}
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-16 text-right pr-2">
            <span className={`
              font-bold
              ${isAiAnimated ? 'animate-pulse-gentle text-negotiation-ai' : ''}
              ${isAccepted ? 'text-negotiation-ai' : ''}
            `}>
              AI: {aiShare}
            </span>
          </div>
          
          <div className="flex-1">
            <Progress 
              value={aiPercent} 
              className={`h-6 ${isAiAnimated || isAccepted ? 'bg-gray-200' : ''}`}
              indicatorClassName={`${isAiAnimated || isAccepted ? 'bg-negotiation-ai' : 'bg-negotiation-ai/70'}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceDisplay;
