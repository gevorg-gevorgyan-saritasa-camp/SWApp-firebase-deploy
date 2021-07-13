import Film from './Film';
import FilmDto from '../../DTOs/filmDto';

export function filmDtoToModelMapper(filmDtoObject: FilmDto) {
    return new Film(
        filmDtoObject.fields.title,
        filmDtoObject.fields.episode_id,
        filmDtoObject.fields.director,
        filmDtoObject.fields.producer,
        filmDtoObject.fields.opening_crawl,
        filmDtoObject.fields.release_date,
        filmDtoObject.fields.characters,
        filmDtoObject.fields.species,
        filmDtoObject.fields.planets,
        filmDtoObject.fields.vehicles,
        filmDtoObject.fields.starships
    )
}