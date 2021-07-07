interface FilmDto {
    title: string;
    episode_id: number;
    release_date: string;
    opening_crawl: string;
    created: string;
    edited: string;
    director: string;
    producer: string;
    characters: Array<number>;
    planets: Array<number>;
    species: Array<number>;
    vehicles: Array<number>;
    starships: Array<number>;
}

export default FilmDto;
