/** A Star Wars starship */
interface StarshipDto {
    id: number;

    /** Starship's MGLT */
    MGLT: string;

    /** Starship's hyperdrive rating */
    hyperdrive_rating: string;

    /** Starship's class */
    starship_class: string;
}

export default StarshipDto;