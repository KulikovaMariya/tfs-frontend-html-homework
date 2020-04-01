export const mapMovie = (movie) => ({
  title: movie.Title,
  year: movie.Year,
  rating: movie.imdbRating,
  link: `https://www.imdb.com/title/${movie.imdbID}/`,
  poster: movie.Poster,
  imdbID: movie.imdbID,

});