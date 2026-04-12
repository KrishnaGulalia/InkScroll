InkScroll is a manhwa discovery web app built JavaScript and the MangaDex API. Users can search, filter by genre, and sort titles — with favorites saved locally.
# 🖋 InkScroll
> Discover manhwa, one scroll at a time.

A manhwa discovery web app built with vanilla JavaScript. Browse, search, filter, and save your favourite Korean comics — powered by the Jikan API.

Live Demo → [krishnagulalia.github.io/InkScroll](https://krishnagulalia.github.io/InkScroll/)


Project Info

| Field | Details |
|---|---|
| Course | Web Development Project |
| Student | Krishna Gulalia |
| API Used | Jikan API (MyAnimeList) |
| Tech Stack | HTML, CSS, Vanilla JavaScript |

About

InkScroll is a manhwa browsing and discovery app. Users can explore popular Korean manhwa titles, search by name, filter by genre, sort by rating or alphabetical order, and save favourites — all without any page reload.

The project was originally planned to use the MangaDex API, but was switched to the Jikan API due to persistent CORS (Cross-Origin Resource Sharing) errors that blocked API requests from both localhost and GitHub Pages. MangaDex does not include the required `Access-Control-Allow-Origin` header for browser-based requests. Jikan resolves this completely and provides equivalent manhwa data including titles, cover images, ratings, and genres.


Features

- Search — real-time title search using `.filter()` on every keystroke
- Genre Filter — filter by Action, Romance, Fantasy, Comedy, Horror, Drama using `.filter()` and `.some()`
- Sort — sort by Top Rated, A→Z, or Latest using `.sort()`
- Dark / Light Mode — full theme toggle using CSS variables and `data-theme` attribute
- Loading Indicator — animated spinner shown while API data is fetching
- Responsive Design — works on mobile, tablet, and desktop with CSS Grid `auto-fill`
- Error Handling — graceful error message if API request fails Bonus Features
No Results State — dedicated empty state message when search/filter returns nothing

API-

Jikan API — Unofficial MyAnimeList REST API

- Base URL: `https://api.jikan.moe/v4`
- No API key required
- No CORS restrictions — works from any domain
- Documentation: [docs.api.jikan.moe](https://docs.api.jikan.moe)

Endpoint used:
GET https://api.jikan.moe/v4/manga?type=manhwa&order_by=popularity&sort=asc&limit=25&page=1


Data extracted per title:
- `mal_id` — unique identifier
- `title` — English title
- `score` — average user rating
- `images.jpg.image_url` — cover image
- `genres` — array of genre objects
- `published.from` — publication start date


 Setup & Run

No build tools or dependencies required.


Project Structure

InkScroll/
├── index.html      — page structure and layout
├── style.css       — all styling, themes, animations
├── app.js          — API fetch, DOM manipulation, filters
└── README.md       — this file

Key Concepts Used
Array HOFs — `.filter()`, `.map()`, `.sort()`, `.some()`, `.includes()` for all data processing
async / await — non-blocking API calls with `fetch()`
DOM Manipulation — `innerHTML`, `classList`, `dataset`, `addEventListener`
CSS Variables — `:root` variables for consistent theming
CSS Grid — responsive card layout with `auto-fill` and `minmax`


Why I Switched from MangaDex to Jikan

The original plan was to use the MangaDex API, which has a larger manhwa library and provides more detailed metadata. However, during development Encountered CORS issue that wasnt allowing me to deploy and use the api effectively so I decided to switch the API altogether for a smooth experince and no failed fetch requests again and again , this was done as the last alternative to mangadex as that api was not fetching at all due to policy error.

```
Access to fetch at 'https://api.mangadex.org/...' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

This error occurred on both `localhost` (development) and `github.io` (production), making it impossible to use MangaDex in a pure frontend application without a backend proxy server. Multiple proxy solutions (`corsproxy.io`, `allorigins.win`) were attempted but all had SSL certificate or availability issues.

Jikan API was chosen as the replacement because:
- Zero CORS restrictions — works from any origin
- No API key or authentication required
- Provides equivalent data: titles, covers, ratings, genres
- Well maintained and documented



- [Jikan API](https://jikan.moe/) — MyAnimeList unofficial API
- [Google Fonts](https://fonts.google.com/) — Bebas Neue & DM Sans
- [GitHub Pages](https://pages.github.com/) — free hosting
