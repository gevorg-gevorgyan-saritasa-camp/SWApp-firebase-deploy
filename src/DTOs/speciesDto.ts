import CharacterDto from "./characterDto";

interface SpeciesDto {
    name: string;
    people: CharacterDto,
    language: string;
    skin_colors: string;
    hair_colors: string;
    eye_colors: string;
    designation: string;
    classification: string;
    average_height: string;
    average_lifespan: string;
}

export default SpeciesDto;