//A Star Wars film
interface FilmDto {
    //Film's title
    title: string;

    //Film's episode id (star wars episode 6 ....)
    episode_id: number;

    //Date when film was released
    release_date: string;

    //Films opening text (Example A long time ago in...)
    opening_crawl: string;

    //Date when record was created
    created: string;

    //Date when record was edited last time
    edited: string;

    //Film's director
    director: string;

    //Film's producer(s)
    producer: string;

    //Array of characters id
    characters: number[];

    //Array of planets id
    planets: number[];

    //Array of species id
    species: number[];

    //Array of vehicles id
    vehicles: number[];

    //Array of starships id
    starships: number[];
}

export default FilmDto;
