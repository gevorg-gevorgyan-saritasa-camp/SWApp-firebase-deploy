import CharacterDto from "../DTOs/characterDto";
import PlanetDto from "../DTOs/planetDto";
import VehicleDto from "../DTOs/vehicleDto";
import SpeciesDto from "../DTOs/speciesDto";
import StarshipDto from "../DTOs/starshipDto";

export type SortOptions = {
    field : string;
    rule : string;
}

export type FilmRelatedEntities = {
    characters: CharacterDto[];
    planets: PlanetDto[];
    vehicles: VehicleDto[];
    species: SpeciesDto[];
    starships: StarshipDto[];
}
