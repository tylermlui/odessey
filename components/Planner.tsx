'use client';

import { useMachine } from '@xstate/react';
import { itineraryMachine } from '@/machines/itineraryMachine';
import { useState } from 'react';

export default function Planner() {
  const [state, send] = useMachine(itineraryMachine);
  const messageChain = JSON.parse(JSON.stringify(state.context.llmSuggestions));
  const [input, setInput] = useState('');

  return (
<div className="text-white p-8 max-w-3xl mx-auto overflow-y-auto max-h-screen">
{/* Initial state: Collecting destination */}
      {state.matches('start') && (
        <div className="space-y-4">
          <input
            type="text"
            id="helper-text"
            className="w-full bg-gray-800 text-white text-sm rounded-lg p-4 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Where do you want to go?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="w-full bg-teal-500 px-4 py-2 rounded mt-4 hover:bg-teal-600 transition duration-200"
            onClick={() => {
              send({ type: 'BEGIN', value: { lastChoice: input, history: messageChain } });
              setInput('');
            }}
          >
            Submit
          </button>
        </div>
      )}

      {/* Awaiting user choice */}
      {state.matches('awaiting_choice') && messageChain && (
        <div className="space-y-6">
          <p className="text-gray-400">Choose your next step:</p>
          <p className="text-lg">{messageChain[messageChain.length - 1].content.question}</p>

          {/* If no recommendations, show options */}
          {messageChain[messageChain.length - 1].content.recommendations.length === 0 ? (
            messageChain[messageChain.length - 1].content.prompt_type === 'yes_no' ? (
              <div className="flex gap-4">
                <button
                  className="w-1/2 bg-teal-500 px-4 py-2 rounded hover:bg-teal-600 transition duration-200"
                  onClick={() =>
                    send({
                      type: 'SELECT_OPTION',
                      value: {
                        lastChoice: messageChain[messageChain.length - 1].content.options[0],
                        history: messageChain,
                      },
                    })
                  }
                >
                  {messageChain[messageChain.length - 1].content.options[0]}
                </button>
                <button
                  className="w-1/2 bg-white text-black px-4 py-2 rounded hover:bg-neutral-200 transition duration-200"
                  onClick={() =>
                    send({
                      type: 'SELECT_OPTION',
                      value: {
                        lastChoice: messageChain[messageChain.length - 1].content.options[1],
                        history: messageChain,
                      },
                    })
                  }
                >
                  {messageChain[messageChain.length - 1].content.options[1]}
                </button>
              </div>
            ) : (
              messageChain[messageChain.length - 1].content.options?.map((option: string, i: number) => (
                <button
                  key={i}
                  className="w-full bg-blue-500 px-4 py-2 rounded text-left mt-2 hover:bg-purple-600 transition duration-200"
                  onClick={() =>
                    send({
                      type: 'SELECT_OPTION',
                      value: {
                        lastChoice: messageChain[messageChain.length - 1].content.options[i],
                        history: messageChain,
                      },
                    })
                  }
                >
                  {option}
                </button>
              ))
            )
          ) : (

            <div className="space-y-4">
                
              {messageChain[messageChain.length - 1].content.recommendations.map((recommendation: any, i: number) => (
                
                <div key={i} className="bg-gray-700 p-4 rounded-lg shadow-md">
                  <h3 className="font-bold text-lg">{recommendation.title}</h3>
                  <p>{recommendation.description}</p>
                  <p className="text-sm text-gray-400">{recommendation.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
