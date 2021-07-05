/**
 * A Star Wars film
 *
 * @typedef {object} Film
 * @property {string} title Film's title
 * @property {number} episode_id Film's episode id (star wars episode 6 ....)
 * @property {string} release_date Date when film was released
 * @property {string} opening_crawl Films opening text (Example A long time ago in...)
 * @property {string} created Date when record was created
 * @property {string} edited Date when record was edited last time
 * @property {string} director Film's director
 * @property {string} producer Film's producer(s)
 * @property {Array<number>} characters Array of characters id
 * @property {Array<number>} planets Array of planets id
 * @property {Array<number>} species Array of species id
 * @property {Array<number>} vehicles Array of vehicles id
 * @property {Array<number>} starships Array of starship id
 */

/**
 * A Star Wars character
 *
 * @typedef {object} Character
 * @property {string} name Character's name
 * @property {number} homeworld Character's homeworld id
 * @property {string} birth_date Date of birth(BBY format)
 * @property {string} gender Character's gender
 * @property {string} created Date when record was created
 * @property {string} edited Date when record was edited last time
 * @property {string} mass Character's mass
 * @property {string} height Character's mass
 * @property {string} skin_color Character's skin color
 * @property {string} eye_color Character's eye color
 */

/**
 * A Star Wars planet
 *
 * @typedef {object} Planet
 * @property {string} name Planet's name
 * @property {string} climate Type of planet's climate
 * @property {string} diameter Planet's diameter in kilometers
 * @property {string} gravity A number denoting the gravity of this planet, where "1" is normal or 1 standard G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs
 * @property {string} created Date when record was created
 * @property {string} edited Date when record was edited last time
 * @property {string} population Planet's population
 * @property {string} orbital_period The number of standard days it takes for this planet to complete a single orbit of its local star.
 * @property {string} rotation_period Planet's rotation period in hours
 * @property {string} surface_water Amount of water in on the planet in percent
 * @property {string} terrain Planet's terrain
 */

/**
 * A Star Wars species
 *
 * @typedef {object} Species
 * @property {string} name Species's name
 * @property {Character} people Representatives of rhe species
 * @property {string} language Language of the species
 * @property {string} skin_colors Skin colors of the species representatives
 * @property {string} hair_colors Hair colors of the species representatives
 * @property {string} eye_colors Eye colors of the species representatives
 * @property {string} designation Species designation
 * @property {string} classification Species classification
 * @property {string} average_height Average height of the species representatives
 * @property {string} average_lifespan Average lifespan of the species representatives
 */
