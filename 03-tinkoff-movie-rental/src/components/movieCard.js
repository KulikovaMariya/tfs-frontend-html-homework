const movieTemplate = document.createElement('template');
movieTemplate.innerHTML = `
  <style>
  :host {
    display: block;
  }
  
  * {
    box-sizing: border-box;
  }
  
  .movie {
    background-color: rgba(255, 255, 255, 0.24);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    height: 100%;
  }
  
  .movie-link {
    display: block;
    height: 100%;
    width: 100%;
  }
  
  .movie-image {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  
  .movie-description {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 26.43%,
      rgba(0, 0, 0, 0.8) 72.41%
    );
  
    position: absolute;
  
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .movie:hover .movie-description {
    opacity: 1;
  }
  
  .movie-rating {
    color: #fff;
  }
  
  .movie-title {
    font-size: 1.5rem;
    color: #fff;
    margin: 4px 0 0;
  }
  
  .movie-footer {
    margin-top: 16px;
    color: rgba(255, 255, 255, 0.4);
    display: flex;
    justify-content: space-between;
  }
  </style>

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
