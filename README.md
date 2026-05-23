# DÄSHO React

Visual node editor for AV performance — rebuilt with React + TypeScript + React Flow.

## Stack

- [Vite](https://vitejs.dev/) — build tool
- [React 19](https://react.dev/) — UI
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [React Flow (@xyflow/react)](https://reactflow.dev/) — node editor canvas

## Getting Started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Project Structure

```
src/
  nodes/          — individual node components (one file per node type)
  types/          — TypeScript types for sockets, nodes, patch state
  store/          — patch state (nodes + connections)
  components/     — UI components (toolbar, palette, etc.)
  App.tsx         — root component with React Flow canvas
  main.tsx        — entry point
```

## Socket Types

| Color | Type | Description |
|---|---|---|
| 🟢 Green | `video` | Video stream |
| 🔵 Blue | `audio` | Audio stream |
| 🟡 Yellow | `number` | Numeric value |
| 🔴 Red | `trigger` | Event trigger |

## Migration from v1

See the original repo: [hlfsk/dasho](https://github.com/hlfsk/dasho)
