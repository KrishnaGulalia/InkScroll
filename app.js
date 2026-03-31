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
        const baseUrl = 'https://api.mangadex.org/manga?limit=40&contentRating[]=safe&includes[]=cover_art&order[followedCount]=desc&originalLanguage[]=ko';
        const url = 'https://corsproxy.io/?' + encodeURIComponent(baseUrl);
        const response = await fetch(url);
        const data = await response.json();

        allManhwa = data.data;
        filteredManhwa = allManhwa;

        displayCards(filteredManhwa);

    } catch (error) {
        cardsGrid.innerHTML = `
            <p style="color: var(--text-secondary); padding: 2rem;">
                Failed to load manhwa. Check your internet connection.
            </p>
        `;
    } finally {
        loader.classList.add('hidden');
    }
}


function getCoverUrl(manga) {
    const coverRel = manga.relationships.find(r => r.type === 'cover_art');

    if (!coverRel || !coverRel.attributes) {
        return 'https://placehold.co/180x270?text=No+Cover';
    }

    const fileName = coverRel.attributes.fileName;
    return `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`;
}


function displayCards(manhwaList) {
    if (manhwaList.length === 0) {
        noResults.classList.remove('hidden');
        cardsGrid.innerHTML = '';
        return;
    }

    noResults.classList.add('hidden');

    cardsGrid.innerHTML = manhwaList.map(manga => {
        const title = manga.attributes.title.en
            || Object.values(manga.attributes.title)[0]
            || 'Unknown Title';

        const coverUrl = getCoverUrl(manga);

        const genres = manga.attributes.tags
            .filter(tag => tag.attributes.group === 'genre')
            .slice(0, 3)
            .map(tag => tag.attributes.name.en);

        const isFav = favorites.includes(manga.id);

        return `
            <div class="card" data-id="${manga.id}">
                <button class="fav-btn" data-id="${manga.id}">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <img
                    src="${coverUrl}"
                    alt="${title}"
                    onerror="this.src='https://placehold.co/180x270?text=No+Cover'"
                />
                <div class="card-body">
                    <div class="card-title">${title}</div>
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
            manga.attributes.tags.some(tag =>
                tag.attributes.name.en === activeGenre
            )
        );
    }

    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        result = result.filter(manga => {
            const title = manga.attributes.title.en
                || Object.values(manga.attributes.title)[0]
                || '';
            return title.toLowerCase().includes(query);
        });
    }


    const sortValue = sortSelect.value;
    if (sortValue === 'title') {
        result = result.sort((a, b) => {
            const titleA = a.attributes.title.en || '';
            const titleB = b.attributes.title.en || '';
            return titleA.localeCompare(titleB);
        });
    } else if (sortValue === 'rating') {
        result = result.sort((a, b) =>
            (b.attributes.rating?.bayesian || 0) - (a.attributes.rating?.bayesian || 0)
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