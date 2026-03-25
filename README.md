# Seating

An event seating optimizer. Given a guest list with social relationships (likes and dislikes), it uses **simulated annealing** to find the best table arrangement — keeping friends together and feuds apart.

## Demo

[immense-lake-53069.herokuapp.com](https://immense-lake-53069.herokuapp.com)

> Note: the demo is not yet mobile-friendly.

## Features

- **Configure your venue** — set guest count (20–5,000), seats per table, and how dramatic your guests are
- **Simulated annealing optimizer** — three modes: minimize feuds (`hate`), maximize friendships (`like`), or balance both (`best`)
- **Drag-and-drop seating** — manually rearrange guests on the visual seating map
- **Live scoring** — per-guest and per-table happiness scores update in real time
- **Guest focus panel** — click any guest to see how their neighbors feel about them
- **Adjustable temperature** — control how aggressively the optimizer explores swaps

## Getting Started

**Prerequisites:** Node.js ^19.7.0

```bash
git clone https://github.com/joaker/seating.git
cd seating
npm install
npm start        # dev server at http://localhost:5173
npm run build    # production build
npm test         # run tests
```

## How It Works

1. Go to **Generate** — configure guest count, seats per table, and drama level
2. The app generates a guest list with randomized like/dislike relationships
3. Hit **Optimize** — the simulated annealing algorithm shuffles guests across iterations, keeping arrangements that improve the score and occasionally accepting worse ones to escape local optima
4. Watch the score converge; drag guests manually to fine-tune

## Tech Stack

| Layer | Libraries |
|---|---|
| UI | React 18, React Bootstrap, Tailwind CSS |
| State | Redux Toolkit, React Redux |
| Routing | React Router 6 |
| Drag & Drop | react-dnd (HTML5 backend) |
| Optimization | [@joaker/simulated-annealing](https://www.npmjs.com/package/@joaker/simulated-annealing) |
| Build | Vite 8, TypeScript 5 |

## License

ISC
