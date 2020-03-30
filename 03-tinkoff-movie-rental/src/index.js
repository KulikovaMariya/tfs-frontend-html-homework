import {mapMovie} from './helpers/mapMovie.js';

// Components
import './components/currentYear.js';
import './components/movieCard.js';

const resultsContainer = document.querySelector('.results__grid');
const form = document.querySelector('.search__form');
const input = document.querySelector('.search__input');
const searchTags = document.querySelector('.search__tags');

const getSearchTagElementsArray = () => {
    return Array.from(searchTags.getElementsByClassName('search__tag'));
}

const renderSearchTag = searchTerm => {

    const tag = document.createElement('a');
    tag.classList.add('search__tag');
    tag.textContent = searchTerm;

    return tag;
}

const render = (movieData) => {
    const movie = document.createElement('movie-card');

    movie.poster = movieData.poster;
    movie.title = movieData.title;
    movie.year = movieData.year;
    movie.link = movieData.link;
    movie.rating = movieData.rating;

    return movie;
};

//рендерит историю поиска при запуске app
const renderSearchTags = () => {
    const tagTextContentArr = localStorage.getItem('search__tags');
    if (!tagTextContentArr) {
        return;
    }
    tagTextContentArr.split(',').forEach(tag => {
        searchTags.insertAdjacentElement('beforeend', renderSearchTag(tag));
    });
}

const updateLocalStorage = () => {
    const tagTextContentArr = [];
    getSearchTagElementsArray().forEach(tag => tagTextContentArr.push(tag.textContent));
    localStorage.setItem('search__tags', tagTextContentArr.toString());
}

const clearResultContainer = () => {
    while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild);
    }
}

const search = searchTerm => {
    const preloader = document.querySelector('.preloader');

    preloader.classList.remove('done');
    clearResultContainer();

    fetch(
        `http://www.omdbapi.com/?apikey=7ea4aa35&type=movie&s=${searchTerm}`
    ).then(r => r.json()
    ).then((r) => {
        const {Search} = r;
        const movies = Search.map((result) => render(mapMovie(result)));
        const fragment = document.createDocumentFragment();

        movies.forEach((movie) => fragment.appendChild(movie));
        resultsContainer.appendChild(fragment);
    }).then(() => {
        const tag = getSearchTagElementsArray().find(t => t.textContent === searchTerm);

        if (tag) {
            searchTags.removeChild(tag);
            searchTags.insertAdjacentElement('afterbegin', tag);
            updateLocalStorage();
        } else {
            searchTags.insertAdjacentElement('afterbegin', renderSearchTag(searchTerm));
            updateLocalStorage();
        }
    }).then(() => {
        setTimeout(() => {
            preloader.classList.add('done');
        }, 200);
    })
};


const subscribeToSubmit = () => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        search(input.value);
        input.value = '';
    });
};

const onTagClick = e => {
    if (e.target.classList.contains('search__tag')) {
        search(e.target.textContent);
    }
}

const onTagDbClick = e => {
    if (e.target.classList.contains('search__tag')) {
        searchTags.removeChild(e.target);
    }
}

const subscribeMouseListener = () => {
    let timer;
    searchTags.addEventListener('click', evt => {
        if (evt.detail === 1) {
            timer = setTimeout(() => onTagClick(evt), 300);
        }
    });
    searchTags.addEventListener('dblclick', evt => {
        clearTimeout(timer);
        onTagDbClick(evt);
    })
}

renderSearchTags();
subscribeToSubmit();
subscribeMouseListener();