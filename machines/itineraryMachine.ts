import { createMachine, assign, fromPromise } from 'xstate';

interface Context {
  history: string[];
  lastChoice: string;
  llmSuggestions: string[];
}


export const itineraryMachine = createMachine({
  id: 'itinerary',
  context: {
    history: [],
    lastChoice: '',
    llmSuggestions: []
  } as Context,
  initial: 'start',
  states: {
    start: {
      on: {
        BEGIN: 'suggesting'
      }
    },
    suggesting: {
      invoke: {
        src: fromPromise(async ({ input }) => {
          const res = await fetch('/api/get-suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              history: input.history,
              lastChoice: "Give me two suggestions"
            })
          });
          const data = await res.json();
          console.log(JSON.stringify(data, null, 2));
          return data;
        }),
        input: ({ context }) => ({
          history: context.history,
          lastChoice: context.lastChoice
        }),
        onDone: {
          target: 'awaiting_choice',
          actions: assign({
            llmSuggestions: ({ event }) => event.output
          })
        },
        onError: 'error'
      }
    },
    awaiting_choice: {
      on: {
        SELECT_OPTION: {
          target: 'suggesting',
          actions: assign({
            lastChoice: ({ event }) => event.value,
            history: ({ context, event }) => [...context.history, event.value]
          })
        }
      }
    },
    error: {
      type: 'final'
    }
  }
});
