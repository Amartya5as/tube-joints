# Tube Joints — Rectangular/Square Tube Joint Visualizer

## Overview
Desktop app to create, position and join rectangular/square tubes at various angles. Built with React, Three.js (react-three-fiber), and Electron.

## Features
- Create rectangular/square hollow tubes (width, height, thickness, length)
- Drag & rotate tubes via Transform controls
- Snap to common angles (45°, 90°, 135°)
- Joint preview (CSG-based intersection highlight while dragging)
- Wireframe / solid toggle
- Undo/Redo
- Packaged as Electron standalone executable

## Quickstart (development)
1. Clone:
   `git clone https://github.com/<youruser>/tube-joints.git`
2. Install:
   `npm ci`
3. Run in dev:
   `npm run start:electron`

## Build & Package (production)
1. Install:
   `npm ci`
2. Build React:
   `npm run build`
3. Package:
   `npm run build:electron`
4. Final executables will be in `dist/`.

## Repo layout
- `src/` — app source (scene, utils, store)
- `src/electron/` — electron main process
- `docs/` — packaging steps

## Notes & Known limitations
- CSG operations are relatively expensive; preview uses simplified geometry for interactivity and final CSG is recommended on finalize to compute exact intersection.
- If you see tiny artifacts, consider adding a volume threshold to ignore tiny intersections.

## Contact
Amartya Sinha
