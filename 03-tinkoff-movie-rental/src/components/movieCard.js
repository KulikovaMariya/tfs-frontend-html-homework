const movieTemplate = document.createElement('template');
movieTemplate.innerHTML = `
  <link rel="stylesheet" href="src/styles/movie.css" />
  
  <article class="movie">
    <a href="" class="movie-link">
      <img class="movie-image" src="" alt="poster" />
      <div class="movie-description">
        <div class="movie-rating"></div>
        <h3 class="movie-title"></h3>
        <footer class="movie-footer">
          <div class="movie-genre"></div>
          <div class="movie-year"></div>
        </footer>
      </div>
    </a>
  </article>
`;

const params = ['title', 'poster', 'link', 'year', 'genre', 'rating'];
const mirror = (params, element) => {
  params.forEach((param) => {
    Object.defineProperty(element, param, {
      get() {
        return this.getAttribute(param);
      },
      set(value) {
        this.setAttribute(param, value);
      },
    });
  });
};

class MovieCard extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const template = movieTemplate.content.cloneNode(true);

    shadow.appendChild(template);
    mirror(params, this);
  }

  static get observedAttributes() {
    return params;
  }

  attributeChangedCallback(param, oldValue, newValue) {
    switch (param) {
      case 'title':
        return (this.shadowRoot.querySelector(
            '.movie-title'
        ).textContent = newValue);

      case 'poster':
        return (this.shadowRoot.querySelector('.movie-image').src = newValue);

      case 'link':
        return (this.shadowRoot.querySelector('.movie-link').href = newValue);

      case 'year':
        return (this.shadowRoot.querySelector(
            '.movie-year'
        ).textContent = newValue);

      case 'rating':
        return (this.shadowRoot.querySelector(
            '.movie-rating'
        ).textContent = newValue);

      case 'genre':
        return (this.shadowRoot.querySelector(
            '.movie-genre'
        ).textContent = newValue);
    }
  }
}

customElements.define('movie-card', MovieCard);
