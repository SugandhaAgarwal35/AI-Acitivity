
import React from 'react';
import { useGame, Agent } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define an event for our history log
interface NegotiationEvent {
  round: number;
  type: 'offer' | 'accept' | 'max_rounds';
  agent: Agent;
  offer?: [number, number];
}

const HistoryLog: React.FC = () => {
  const { gameState } = useGame();
  
  // Build history log from game state
  const buildHistory = (): NegotiationEvent[] => {
    const history: NegotiationEvent[] = [];
    
    // If game hasn't started, return empty history
    if (gameState.status === 'not_started') {
      return history;
    }
    
    // Start with "game started" message
    
    // Add past offers based on round number and last offer
    // This is a simplified version - in a real app, we'd store the full history
    if (gameState.lastOffer && gameState.lastOfferedBy) {
      history.push({
        round: gameState.currentRound,
        type: 'offer',
        agent: gameState.lastOfferedBy,
        offer: gameState.lastOffer
      });
    }
    
    // Add acceptance event if applicable
    if (gameState.status === 'accepted' && gameState.acceptedOffer) {
      const acceptingAgent = gameState.lastOfferedBy === 'player' ? 'ai' : 'player';
      history.push({
        round: gameState.currentRound,
        type: 'accept',
        agent: acceptingAgent,
        offer: gameState.acceptedOffer
      });
    }
    
    // Add max rounds event if applicable
    if (gameState.status === 'max_rounds_reached') {
      history.push({
        round: gameState.currentRound,
        type: 'max_rounds',
        agent: 'player' // placeholder, not really relevant for this event type
      });
    }
    
    return history;
  };
  
  const history = buildHistory();
  
  // Format message based on event
  const formatMessage = (event: NegotiationEvent): string => {
    switch (event.type) {
      case 'offer':
        return `${event.agent === 'player' ? 'You' : 'AI'} offered: [${event.offer?.[0]} for ${event.agent === 'player' ? 'you' : 'AI'}, ${event.offer?.[1]} for ${event.agent === 'player' ? 'AI' : 'you'}]`;
      case 'accept':
        return `${event.agent === 'player' ? 'You' : 'AI'} accepted the offer`;
      case 'max_rounds':
        return `Maximum rounds reached, negotiation ended`;
      default:
        return '';
    }
  };
  
  // Determine message color
  const getMessageColor = (event: NegotiationEvent): string => {
    if (event.type === 'max_rounds') return 'text-orange-500';
    if (event.type === 'accept') return 'text-green-500';
    return event.agent === 'player' ? 'text-negotiation-player' : 'text-negotiation-ai';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Negotiation Log</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[210px] px-4">
          {gameState.status === 'not_started' ? (
            <p className="text-center text-muted-foreground py-6">
              The negotiation history will appear here
            </p>
          ) : history.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              Game started - waiting for first offer
            </p>
          ) : (
            <div className="space-y-2 pt-2 pb-4">
              <div className="text-center text-muted-foreground text-sm py-1">
                Game started - total resources: {gameState.totalResources}
              </div>
              {history.map((event, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded-md ${event.type === 'accept' ? 'bg-green-50' : event.type === 'max_rounds' ? 'bg-orange-50' : 'bg-gray-50'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Round {event.round}</span>
                    <span className={`text-sm font-medium ${getMessageColor(event)}`}>
                      {event.agent === 'player' ? 'You' : 'AI'}
                    </span>
                  </div>
                  <p>{formatMessage(event)}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HistoryLog;
