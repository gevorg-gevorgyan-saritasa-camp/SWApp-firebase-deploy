export type SortOptions = {
    field : string;
    rule : string;
}

export type FilmRelatedEntities = {
    characters: EntityObject[];
    planets: EntityObject[];
    vehicles: EntityObject[];
    species: EntityObject[];
    starships: EntityObject[];
}

export type EntityObject = {
    id: number;
    name: string;
    vehicle_class: number | null;
    starship_class: number | null;
}
