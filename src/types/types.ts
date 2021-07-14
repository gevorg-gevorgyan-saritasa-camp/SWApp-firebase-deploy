export type SortOptions = {
    field : string;
    rule : string;
}

export type FilmRelatedEntities = {
    characters: EntityObject[];
    planets: EntityObject[];
    vehicles: VehicleObject[];
    species: EntityObject[];
    starships: StarshipObject[];
}

export type EntityObject = {
    id: number;
    name: string;
}

export type StarshipObject = {
    id: number;
    starship_class: number | null;
}

export type VehicleObject = {
    id: number;
    vehicle_class: number | null;
}
