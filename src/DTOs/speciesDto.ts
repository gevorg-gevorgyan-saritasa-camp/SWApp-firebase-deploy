//A Star Wars species
interface SpeciesDto {
    id:number;
    //Species's name
    name: string;

    //Representatives of the species
    people: number[];

    //Language of the species
    language: string;

    //Skin colors of the species representatives
    skin_colors: string;

    //Hair colors of the species representatives
    hair_colors: string;

    //Eye colors of the species representatives
    eye_colors: string;

    //Species designation
    designation: string;

    //Species classification
    classification: string;

    //Average height of the species representatives
    average_height: string;

    //Average lifespan of the species representatives
    average_lifespan: string;
}

export default SpeciesDto;