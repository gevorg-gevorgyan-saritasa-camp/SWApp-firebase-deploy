//A Star Wars character
interface CharacterDto {
    //Character's name
    name: string;

    //Character's homeworld id
    homeworld: number;

    //Date of birth(BBY format)
    birth_date: string;

    //Character's gender
    gender: string;

    //Date when record was created
    created:string;

    //Date when record was edited last time
    edited: string;

    //Character's mass
    mass: string;

    //Character's height
    height: string;

    //Character's skin color
    skin_color: string;

    //Character's eye color
    eye_color: string;
}

export default CharacterDto;