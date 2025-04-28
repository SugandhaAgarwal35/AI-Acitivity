
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const GameRules: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Game Rules</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="objective">
            <AccordionTrigger>Objective</AccordionTrigger>
            <AccordionContent>
              Negotiate with the AI to divide 100 resources between you and the AI. The game ends when one party accepts an offer or after 10 rounds.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="turns">
            <AccordionTrigger>Taking Turns</AccordionTrigger>
            <AccordionContent>
              You and the AI take turns making offers. When it's your turn, you can either accept the AI's previous offer or make a counter-offer.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="ai-strategy">
            <AccordionTrigger>AI Strategy</AccordionTrigger>
            <AccordionContent>
              The AI has a minimum threshold for offers it will accept (around 40% of resources). It will counter with better terms for itself if your offer is below this threshold.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="ending">
            <AccordionTrigger>Ending the Game</AccordionTrigger>
            <AccordionContent>
              The game ends when either party accepts an offer, or after 10 rounds of negotiation. If no agreement is reached after 10 rounds, the final offer becomes the outcome.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default GameRules;
