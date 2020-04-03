import {mapMovie} from './helpers/mapMovie.js';
import {makeRequests} from "./helpers/makeRequests.js";
import SearchHistoryStorage from './helpers/searchHistoryStorage.js';
import './components/currentYear.js';
import './components/movieCard.js';
import {debounce} from './helpers/debounce.js';

const resultsContainer = document.querySelector('.results__grid');
const form = document.querySelector('.search__form');
const input = document.querySelector('.search__input');
const searchTags = document.querySelector('.search__tags');
const preloader = document.querySelector('.preloader');
const searchHistory = new SearchHistoryStorage();

const getSearchTagElementsArray = () => {
    return Array.from(searchTags.getElementsByClassName('search__tag'));
}

const renderSearchTag = searchTerm => {

    const tag = document.createElement('a');
    tag.classList.add('search__tag');
    tag.textContent = searchTerm.toLowerCase();

    return tag;
}

const renderMovieCard = movieData => {
    const movie = document.createElement('movie-card');

    movie.poster = movieData.poster;
    movie.title = movieData.title;
    movie.year = movieData.year;
    movie.link = movieData.link;
    movie.rating = movieData.rating;
    movie.genre = movieData.genre;
    movie.rating_img = movieData.rating_img;

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

const renderResultContainer = (r) => {
    const movies = r.detailedResults.map((result) => renderMovieCard(mapMovie(result)));
    const fragment = document.createDocumentFragment();

    movies.forEach((movie) => fragment.appendChild(movie));
    resultsContainer.appendChild(fragment);
    document.querySelector('.results__heading').textContent = `Найдено фильмов: ${r.totalResults}`;
}

const hideLoader = () => {
    setTimeout(() => {
        preloader.classList.add('done');
    }, 200);
}

const updateTagsList = searchTerm => {
    let tag = getSearchTagElementsArray().find(t => t.textContent === searchTerm.toLowerCase());

    if (tag) {
        searchTags.removeChild(tag);
    } else {
        tag = renderSearchTag(searchTerm);
    }
    searchTags.insertAdjacentElement('afterbegin', tag);
}

const renderPage = (promise, searchTerm) => {
    promise.then(r => {
        renderResultContainer(r);
    }).then(r => {
        updateTagsList(searchTerm);
        updateLocalStorage();
    }, error => {
        document.querySelector('.results__heading').textContent = `Ошибка: ${error.message}`;
    }).finally(() => {
        hideLoader();
    });
}

const loadFromCache = async (searchTerm) => {
   const {Search, totalResults} = searchHistory.storage.get(searchTerm);
   const detailedResults = Search.map(result => searchHistory.storageByImdbId.get(result.imdbID));
   return {detailedResults, totalResults};
}

const executeSearch = (searchTerm) => {
    input.value = '';
    return  fetch(
        `http://www.omdbapi.com/?apikey=7ea4aa35&type=movie&s=${searchTerm}`
    ).then(r => {
        if (r.status !== 200) {
            throw new Error(r.status);
        }
        return r.json();
    }).then(resp => {
        const {Search, totalResults} = resp;
        if (!Search) {
            throw new Error(`по запросу ${searchTerm} ничего не найдено`);
        }
        searchHistory.storage.set(searchTerm, resp);
        const urlsById = Search.map(movie => `http://www.omdbapi.com/?apikey=7ea4aa35&type=movie&i=${movie.imdbID}`);
        return makeRequests(urlsById, 4).then(detailedResults => {
            return {detailedResults, totalResults}
        });
    }).then(resObj => {
        resObj.detailedResults.forEach(r => searchHistory.storageByImdbId.set(r.imdbID, r));
        return resObj;
    });
}

const search = searchTerm => {
    preloader.classList.remove('done');
    clearResultContainer();

    const promise = searchHistory.storage.get(searchTerm) ? loadFromCache(searchTerm) : executeSearch(searchTerm);

    renderPage(promise, searchTerm);
};

const searchDebounced = debounce(search, 500);

const onTagClick = e => {
    if (e.target.classList.contains('search__tag')) {
        search(e.target.textContent.toLowerCase());
    }
}

const onTagDblClick = e => {
    if (e.target.classList.contains('search__tag')) {
        searchTags.removeChild(e.target);
        updateLocalStorage();
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
        onTagDblClick(evt);
    })
}

const subscribeInputListener = () => {
    input.addEventListener('input', evt => {
        if (input.value.length > 1) {
            searchDebounced(input.value);

        }

    });
}

renderSearchTags();
subscribeMouseListener();
subscribeInputListener();