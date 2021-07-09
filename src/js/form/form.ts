import '../../css/form.css'
import '../../css/header.css'
import filmService from '../../firebase/filmService';
import CharacterDto from "../../DTOs/characterDto";
import VehicleDto from "../../DTOs/vehicleDto";
import SpeciesDto from "../../DTOs/speciesDto";
import StarshipDto from "../../DTOs/starshipDto";
import PlanetDto from "../../DTOs/planetDto";
import FilmDto from "../../DTOs/filmDto";
import {FilmFields} from "../values/values";

const charactersSelect = <HTMLSelectElement>document.getElementById('characters');
const planetsSelect = <HTMLSelectElement>document.getElementById('planets');
const vehiclesSelect = <HTMLSelectElement>document.getElementById('vehicles');
const speciesSelect = <HTMLSelectElement>document.getElementById('species');
const starshipsSelect = <HTMLSelectElement>document.getElementById('starships');
const filmForm = <HTMLFormElement>document.getElementById('film-form');


window.onload = () => {
    filmService.getAllRelatedEntities()
        .then(entitiesPayload => {
            fillMultipleSelect(charactersSelect, entitiesPayload.characters);
            fillMultipleSelect(planetsSelect, entitiesPayload.planets);
            fillMultipleSelect(vehiclesSelect, entitiesPayload.vehicles);
            fillMultipleSelect(speciesSelect, entitiesPayload.species);
            fillMultipleSelect(starshipsSelect, entitiesPayload.starships);
        })
}

filmForm.addEventListener('submit', sendFormData);

function sendFormData(e: Event) {
    e.preventDefault();
    const formData = new FormData(filmForm);
    const filmData : FilmDto = {} as FilmDto;
    // const film : Partial<FilmDto> = Object.fromEntries(formData.entries());
    // console.log(film);
    filmData.title = String(formData.getAll(FilmFields.title));
    filmData.director = String(formData.getAll(FilmFields.director));
    filmData.producer = String(formData.getAll(FilmFields.producer));
    filmData.release_date = String(formData.getAll(FilmFields.releaseDate));
    filmData.episode_id = Number(formData.getAll(FilmFields.episodeId));
    filmData.opening_crawl = String(formData.getAll(FilmFields.openingCrawl));
    filmData.characters = formData.getAll(FilmFields.characters).map(el => Number(el));
    filmData.species = formData.getAll(FilmFields.species).map(el => Number(el));
    filmData.vehicles = formData.getAll(FilmFields.vehicles).map(el => Number(el));
    filmData.starships = formData.getAll(FilmFields.starships).map(el => Number(el));
    filmData.planets = formData.getAll(FilmFields.planets).map(el => Number(el));
}

function fillMultipleSelect(selectElem : HTMLSelectElement, optionsArr : CharacterDto[] | VehicleDto[] | SpeciesDto[]
                            | StarshipDto[] | PlanetDto[]) {
    optionsArr.forEach(item => {
        let option = document.createElement('option');
        option.value = String(item.id);
        if ("name" in item) {
            option.innerHTML = String(item.name);
        } else if ('vehicle_class' in item) {
            option.innerHTML = `${String(item.id)} (${String(item.vehicle_class)})`;
        } else if ('starship_class in item') {
            option.innerHTML = `${String(item.id)} (${String(item.starship_class)})`;
        }
        selectElem.add(option);
    })
}