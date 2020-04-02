export const mapMovie = (movie) => ({
  title: movie.Title,
  year: movie.Year,
  rating: movie.imdbRating,
  link: `https://www.imdb.com/title/${movie.imdbID}/`,
  poster: movie.Poster,
  imdbID: movie.imdbID,
  genre: movie.Genre,
  rating_img: getRatingImage(movie.imdbRating),
});

const getRatingImage = (r) => {
  const rNum = parseFloat(r);

  if (rNum <= 2) {
    return 'src/images/r01.png';
  }

  if (rNum <= 4) {
    return 'src/images/r02.png';
  }

  if (rNum <= 6) {
    return 'src/images/r03.png';
  }

  if (rNum <= 8) {
    return 'src/images/r04.png';
  }

  if (rNum <= 10) {
    return 'src/images/r05.png';
  }
};