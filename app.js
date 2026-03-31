const cardsGrid = document.getElementById('cardsGrid');
const searchInput = document.getElementById('searchInput');
const genreButtons = document.querySelectorAll('.genre-btn');
const sortSelect = document.getElementById('sortSelect');
const loader = document.getElementById('loader');
const noResults = document.getElementById('noResults');
const themeToggle = document.getElementById('themeToggle');

let allManhwa = [];
let filteredManhwa = [];
let activeGenre = 'all';
let favorites = JSON.parse(localStorage.getItem('inkscroll-favs')) || [];

async function fetchManhwa() {
    loader.classList.remove('hidden');
    cardsGrid.innerHTML = '';

    try {
        const url = 'https://api.jikan.moe/v4/manga?type=manhwa&order_by=popularity&sort=asc&limit=24';

        const response = await fetch(url);
        const data = await response.json();

        allManhwa = data.data;
        filteredManhwa = allManhwa;

        displayCards(filteredManhwa);

    } catch (error) {
        console.log('Error:', error);
        cardsGrid.innerHTML = `
            <p style="color: var(--text-secondary); padding: 2rem;">
                Failed to load manhwa. Check your internet connection.
            </p>
        `;
    } finally {
        loader.classList.add('hidden');
    }
}

function displayCards(manhwaList) {
    if (manhwaList.length === 0) {
        noResults.classList.remove('hidden');
        cardsGrid.innerHTML = '';
        return;
    }

    noResults.classList.add('hidden');

    cardsGrid.innerHTML = manhwaList.map(manga => {
        const title = manga.title || 'Unknown Title';
        const coverUrl = manga.images.jpg.image_url;
        const genres = manga.genres.slice(0, 3).map(g => g.name);
        const score = manga.score ? manga.score.toFixed(1) : 'N/A';
        const isFav = favorites.includes(String(manga.mal_id));

        return `
            <div class="card" data-id="${manga.mal_id}">
                <button class="fav-btn" data-id="${manga.mal_id}">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <img
                    src="${coverUrl}"
                    alt="${title}"
                    onerror="this.src='https://placehold.co/180x270?text=No+Cover'"
                />
                <div class="card-body">
                    <div class="card-title">${title}</div>
                    <div class="card-score">⭐ ${score}</div>
                    <div class="card-genres">
                        ${genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(btn.dataset.id, btn);
        });
    });
}

function applyFilters() {
    let result = allManhwa;

    if (activeGenre !== 'all') {
        result = result.filter(manga =>
            manga.genres.some(g => g.name === activeGenre)
        );
    }

    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        result = result.filter(manga =>
            manga.title.toLowerCase().includes(query)
        );
    }


    const sortValue = sortSelect.value;
    if (sortValue === 'title') {
        result = [...result].sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    } else if (sortValue === 'rating') {
        result = [...result].sort((a, b) =>
            (b.score || 0) - (a.score || 0)
        );
    } else if (sortValue === 'latest') {
        result = [...result].sort((a, b) =>
            (b.published?.from || '').localeCompare(a.published?.from || '')
        );
    }

    filteredManhwa = result;
    displayCards(filteredManhwa);
}


function toggleFavorite(id, btn) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        btn.textContent = '🤍';
    } else {
        favorites.push(id);
        btn.textContent = '❤️';
    }
    localStorage.setItem('inkscroll-favs', JSON.stringify(favorites));
}


searchInput.addEventListener('input', applyFilters);


genreButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        genreButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeGenre = btn.dataset.genre;
        applyFilters();
    });
});


sortSelect.addEventListener('change', applyFilters);

themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
});

fetchManhwa();