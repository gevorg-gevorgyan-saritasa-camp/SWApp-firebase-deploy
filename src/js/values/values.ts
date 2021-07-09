export const DEFAULT_PAGE_SIZE = 2;
export const FILMS_COLLECTION = 'films';
export const DEFAULT_JOIN_ARRAY_SIZE = 10;
export const DEBOUNCE_DELAY_TIME = 500;

export const HTMLFilmCellsTemplates = {
  FilmEditCell: '<button title="Edit Film" class="films-management-button">' +
      '<img alt="Edit" src="https://img.icons8.com/ios-glyphs/30/000000/edit--v1.png"/>' +
      '</button>',
  FilmDeleteCell: '<button title="Delete Film" class="films-management-button">' +
      '<img alt="Delete" src="https://img.icons8.com/ios-glyphs/30/000000/delete-forever.png"/>' +
      '</button>',
  MoreInfoCell: '<button class="more-info-button">More info...</button>'
};

export const Navigation = {
  NextPage: 'next',
  PrevPage: 'prev',
};

export const FilmFields = {
  title: 'title',
  director: 'director',
  episodeId: 'episode_id',
  producer: 'producer',
  releaseDate: 'release_date',
  openingCrawl: 'opening_crawl',
  characters: 'people',
  planets: 'planets',
  species: 'species',
  vehicles: 'vehicles',
  starships: 'starships'
};

export const Paths = {
  MainPagePath: 'main.html',
  FilmPagePath: 'film.html',
  LoginPagePath: 'login.html',
  FormPagePath: 'form.html',
};

export const SortOptions = {
  DefaultOrder: 'pk',
  Asc: 'asc',
  Desc: 'desc',
  SortingFields: 'fields.',
};

export const SearchOptions = {
  DefaultSearchField: 'fields.title',
  FilmEpisodeField: 'fields.episode_id',
}