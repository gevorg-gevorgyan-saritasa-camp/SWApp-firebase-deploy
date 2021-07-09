//A Star Wars planet
interface PlanetDto {
    id: number;
    //Planet's name
    name: string;

    //Type of planet's climate
    climate: string;

    //Planet's diameter in kilometers
    diameter: string;

    //A number denoting the gravity of this planet, where "1" is normal or 1 standard G. "2" is twice or 2 standard Gs.
    // "0.5" is half or 0.5 standard Gs
    gravity: string;

    //Date when record was created
    created: string;

    //Date when record was edited last time
    edited: string;

    //Planet's population
    population: string

    //The number of standard days it takes for this planet to complete a single orbit of its local star.
    orbital_period: string;

    //Planet's rotation period in hours
    rotation_period: string;

    //Amount of water in on the planet in percent
    surface_water: string;

    //Planet's terrain
    terrain: string
}

export default PlanetDto;