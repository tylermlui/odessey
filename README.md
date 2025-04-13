
## 🚀 Inspiration

We wanted to make trip planning feel more like talking to a friend than filling out a form. Too many travel tools feel rigid or overwhelming—we envisioned something that understands your vibe and curates experiences just for you.
## 💡 What it does

Odyssey is an AI-powered trip planner that chats with you to figure out your mood, preferences, and intentions. Through a conversational interface, it suggests 2–4 curated activities or places tailored to your vibe—whether you're planning a full vacation or just looking for something fun to do today.
## 🔧 How we built it

We used a state machine with XState to manage conversation flow and transitions. The frontend is built with React and Tailwind CSS for clean UX. On the backend, we use OpenAI's GPT-4o with a fine-tuned model that outputs structured JSON responses, making it easy to parse and present options in the UI.
## 🧗 Challenges we ran into

    Ensuring GPT responses were always valid JSON.

    Balancing flexibility in conversation while still guiding users toward actionable suggestions.

    Mapping state transitions cleanly without breaking the conversational context.

## 🏆 Accomplishments that we're proud of

    Built an intuitive, chat-first planning experience in a short timeframe.

    Designed a flexible prompt-response protocol that always returns structured JSON.

    Successfully fine-tuned GPT to behave like a friendly, helpful trip guide.

## 📚 What we learned

    How to guide LLM output toward specific formats using prompt engineering.

    How to leverage state machines to manage complex conversational flows.

    The power of combining user intent with curated suggestions to enhance decision-making.

## 🔮 What's next for Odyssey

    Expanding our recommendation engine with real-time data (events, reviews, open hours).

    Adding location services to auto-suggest nearby options.

    Saving and sharing itineraries with friends.

    Supporting group planning through collaborative chats.
