# Chord Sandbox

Chord Sandbox is a web app that allows you to interactively view chords and scales on the piano via an online keyboard.

## Technologies Used

- React
- Typescript
- SASS
- Tone.js

## Features

- Visual playback of **chords, scales and arpeggios**
- Two options for displaying the piano keyboard - one using CSS and one using HTML canvas
- Connectivity to a **Midi controller** for playing notes on the online keyboard (on Chrome browser)
- **Automatic chord detection** when selecting multiple notes at once
- Save selected chords using **chord pads**. Can be played using assignable keyboard shortcuts (in settings menu)
- Chord pads can be dragged and dropped to move them around
- Highlight all notes which belong to a specific scale

## Scripts

#### Run development server

```sh
yarn run dev
```

#### Run production build

```sh
yarn run build
```

#### Preview production build locally

```sh
yarn run preview
```

#### View all CLI options in vite

```sh
yarn run options
```