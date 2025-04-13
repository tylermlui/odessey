import { createMachine, assign, fromPromise } from 'xstate';

interface Context {
  history: string[];
  lastChoice: string;
  llmSuggestions: any[]; // changed to any[] since you're storing structured messages
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
        BEGIN: {
          target: 'suggesting',
          actions: assign({
            lastChoice: ({ event }) => event.value.lastChoice,
            history: ({ event }) => event.value.history
          })
        }
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
              lastChoice: input.lastChoice
            })
          });
          const data = await res.json();
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
            lastChoice: ({ event }) => event.value.lastChoice,
            history: ({ event }) => event.value.history
          })
        },
        FINISH: 'done'
      }
    },
    done: {
      type: 'final'
    },
    error: {
      type: 'final'
    }
  }
});
