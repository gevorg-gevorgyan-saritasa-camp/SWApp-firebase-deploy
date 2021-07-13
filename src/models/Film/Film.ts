class Film {
    public title: string;
    public director: string;
    public episodeId: number;
    public producer: string;
    public openingCrawl: string;
    public releaseDate: string;
    public characters: number[];
    public planets: number[];
    public starships: number[];
    public vehicles: number[];
    public species: number[];

    constructor(title : string = '', episodeId : number = 0, director : string = '', producer : string = '',
                openingCrawl : string = '', releaseDate : string = '', characters : number[] = [], species : number[] = [],
                planets : number[] = [], vehicles : number[] = [], starships : number[] = []) {
        this.title = title;
        this.director = director;
        this.episodeId = episodeId;
        this.producer = producer;
        this.openingCrawl = openingCrawl;
        this.releaseDate = releaseDate;
        this.characters = characters;
        this.planets = planets;
        this.species = species;
        this.starships = starships;
        this.vehicles = vehicles;
    }
}

export default Film;