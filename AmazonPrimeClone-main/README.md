# Movies App — Amazon Prime Video Clone

A responsive movies app styled after **Amazon Prime Video**, built with React functional
components and hooks. It fetches data from the CCBP movies APIs, protects routes with a
JWT stored in cookies, and supports trending / originals / top rated rows, popular movies,
search, movie details and an account page.

## Tech stack

- React 19 (functional components + `useState`, `useEffect`, `useCallback`)
- React Router 7 (`BrowserRouter`, `Routes`, `useNavigate`, `useParams`, `useLocation`)
- Vite 7 (dev server + build)
- `js-cookie` for the `jwt_token` cookie
- `react-slick` + `slick-carousel` for the poster carousels
- `react-spinners` (`BeatLoader`, `ClipLoader`) for loading indicators
- `react-icons` for the search, social and play icons
- `date-fns` for the release date format
- Plain CSS with media queries (no CSS-in-JS)

## Getting started

```bash
npm install
npm run dev      # starts the app on http://localhost:3000
npm run build    # production build into ./build
npm run lint     # eslint
npm run test     # vitest
```

## Login credentials

Any of the CCBP demo users work, for example:

```text
username: rahul
password: rahul@2021
```

The JWT returned by `https://apis.ccbp.in/login` is stored in the `jwt_token` cookie, and
the username/password are stored in `localStorage` so the Account route can display them.

## Routes

| Path           | Component          | Access        |
| -------------- | ------------------ | ------------- |
| `/login`       | `Login`            | Public        |
| `/`            | `Home`             | Authenticated |
| `/popular`     | `Popular`          | Authenticated |
| `/search`      | `Search`           | Authenticated |
| `/account`     | `Account`          | Authenticated |
| `/movies/:id`  | `MovieItemDetails` | Authenticated |
| anything else  | `NotFound`         | Public        |

Unauthenticated visitors to a protected route are redirected to `/login`; authenticated
users who open `/login` are redirected to `/`.

## Project structure

```text
src/
├── App.jsx                  # routes
├── App.css                  # shared layout, loader, failure view, grid, buttons
├── index.css                # theme tokens (Prime Video palette) + resets
├── main.jsx
└── components/
    ├── endpoints.js         # API urls, api status constants, response formatters
    ├── Account/             # membership + plan details, logout
    ├── Footer/              # Google / Twitter / Instagram / Youtube icons
    ├── Header/              # logo, nav links, search, profile (sticky)
    ├── Home/                # random Originals hero + three carousels
    ├── Login/               # sign in form
    ├── MovieDetails/        # details hero + genres/audio/rating/budget grid
    ├── MovieItem/           # poster card used by carousels and grids
    ├── MovieItemDetails/    # /movies/:id route, fetches movie details
    ├── MoviesSearch/        # search field + search button inside the header
    ├── NotFound/
    ├── Popular/
    ├── ProtectedRoute/      # jwt_token cookie guard
    ├── ReactSlick/          # self-fetching carousel row (Trending, Originals, Top Rated)
    ├── Search/              # reads the ?search= query param and fetches results
    └── SimilarMovies/       # "More like this" grid
        └── SimilarMovieDetails/
```

## Behaviour notes

- Each carousel row on Home fetches its own API, so a failing row shows its own
  **Try Again** button without affecting the rest of the page.
- The Home hero picks a random movie from the Originals response.
- Search state lives in the URL (`/search?search=venom`), so results survive a refresh and
  the back/forward buttons work.
- `runtime` is rendered as `2h 43m` and the censor rating as `A` (adult) or `U/A`.
- Breakpoints: 1400px, 1100px, 991px, 768px and 575px.

## Theme

The Prime Video palette lives in `src/index.css` as custom properties:
background `#0f171e`, surface `#1a242f`, accent `#00a8e1`, muted text `#8197a4`.

The spinner colour is the `loaderColor` export in `src/components/endpoints.js`. It is set
to `#D81F26`, the value the project brief requires for the `BeatLoader` and `ClipLoader`
components.
