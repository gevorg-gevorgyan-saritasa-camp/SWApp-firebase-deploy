import Film from './Film';
import FilmDto from "../../DTOs/filmDto";

export function filmModelToDtoMapper(film: Film) {
    return {
        fields: {
            title: film.title,
            director: film.director,
            episode_id: film.episodeId,
            producer: film.producer,
            opening_crawl: film.openingCrawl,
            release_date: film.releaseDate,
            characters: film.characters,
            planets: film.planets,
            starships: film.starships,
            vehicles: film.vehicles,
            species: film.species
        }

    } as FilmDto;
}