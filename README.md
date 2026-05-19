# Seatable

An event seating optimizer. Given a guest list with social relationships (likes and dislikes), it uses **simulated annealing** to find the best table arrangement — keeping friends together and feuds apart.

## Demo

**→ [seating-2ae.pages.dev/generate-guests](https://seating-2ae.pages.dev/generate-guests)**

Fully responsive: works on phone, tablet, and desktop.

## The story

I built the original version of this over a decade ago as a novel demonstration that simulated annealing — an algorithm borrowed from metallurgy — could chew through an NP-hard combinatorial problem (seating arrangements) inside a browser. It was a desktop-only web app, frozen in the tech of its era: class components, Create React App, Bootstrap 3, Immutable.js, JavaScript, no mobile support.

In an afternoon of pairing with Claude, it was rebuilt on a modern stack:

- Create React App → **Vite 8**
- JavaScript → **TypeScript 5**
- Class components → **functional components + hooks**
- Immutable.js Redux state → **plain TS objects with Redux Toolkit**
- Bootstrap 3 → **SCSS Modules + CSS custom properties** (and a real design system)
- Glyphicons → **Font Awesome via npm**
- Inline annealing loop → **extracted to [`@joaker/simulated-annealing`](https://www.npmjs.com/package/@joaker/simulated-annealing) on npm**
- Desktop-only layout → **fully responsive**

The algorithm is the same. The app is new.

## How it works

1. **Configure** your venue — guest count (20–5,000), seats per table, and how dramatic your guests are. The drama slider controls how many strong likes/dislikes each guest holds.
2. **Generate** a guest list with randomized relationships.
3. **Optimize** — the annealer proposes random pairwise seat swaps. It always accepts improvements; it sometimes accepts worse arrangements with probability `exp(-ΔE / scaledTemperature)`, which lets it escape local optima. As the temperature cools, it settles into a near-optimal arrangement.
4. **Watch** the score converge live, or **drag** guests around to fine-tune.

Three modes: minimize feuds (`hate`), maximize friendships (`like`), or balance both (`best`).

## Tech stack

| Layer | Libraries |
|---|---|
| UI | React 18, react-dnd |
| State | Redux Toolkit, React Redux |
| Routing | React Router 6 |
| Optimization | [@joaker/simulated-annealing](https://www.npmjs.com/package/@joaker/simulated-annealing) |
| Styling | SCSS Modules, CSS custom-property design tokens |
| Build | Vite 8, TypeScript 5 |

## Run it locally

**Prerequisites:** Node.js ^19.7.0

```bash
git clone https://github.com/joaker/seating.git
cd seating
npm install
npm start        # dev server at http://localhost:3000
npm run build    # production build
```

## License

ISC
