'use client';

import { useMachine } from '@xstate/react';
import { itineraryMachine } from '@/machines/itineraryMachine';
import { useState } from 'react'
export default function Planner() {
  const [state, send] = useMachine(itineraryMachine);
  console.log(state.context.llmSuggestions)  
  console.log("jsonparse",JSON.parse(JSON.stringify(state.context.llmSuggestions)))
  const suggestions = JSON.parse(JSON.stringify(state.context.llmSuggestions));
  return (
    <div className="text-white p-8">
      <h2 className="text-2xl font-bold mb-4">Your Itinerary</h2>

      {state.matches('start') && (
        <button
          className="bg-blue-600 px-4 py-2 rounded"
          onClick={() => send({ type: 'BEGIN' })}
        >
          Start Planning
        </button>
      )}

      {state.matches('awaiting_choice') && (
        <div className="space-y-4">
          <p className="text-gray-400">Choose your next step:</p>
          <p> {suggestions} </p>
          {/* {suggestions.map((s: string, i: number) => (
            <button
              key={i}
              className="bg-purple-600 px-4 py-2 rounded w-full text-left"
              onClick={() => send({ type: 'SELECT_OPTION', value: s })}
            >
              {s}
            </button>
          ))} */}
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-lg font-semibold">History:</h4>
        <ul className="list-disc ml-6 text-gray-300">
          {state.context.history.map((h: string, i: number) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
