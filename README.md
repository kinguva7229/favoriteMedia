# FavoriteMedia

FavoriteMedia is a Lit/Web Components app that displays a carousel of favorite movies and TV shows. Media data is loaded from a Vercel-style `/api/movies` endpoint backed by a JSON file, while user likes and dislikes are stored locally with `localStorage`.

## Tech Stack

- JavaScript
- Lit
- Web Components
- Vercel serverless API route
- LocalStorage
- OpenWC-style build and test tooling

## Features

- Fetches media data from `/api/movies`
- Displays a responsive carousel of media cards
- Supports like, dislike, and share actions
- Persists user preferences in the browser
- Includes basic accessibility smoke tests

## Run Locally

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

## Project Status

This is a solid secondary software engineering portfolio project, but it still needs polish before being pinned.

Recommended next improvements:

- Add screenshots and a live demo link.
- Add tests for API loading, carousel navigation, and like/dislike persistence.
- Improve empty/error states when the API fails.
- Consider adding filtering, search, or categories to make the app feel more complete.
