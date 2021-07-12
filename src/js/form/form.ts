import '../../css/form.css'
import '../../css/header.css'
import filmService from '../../firebase/filmService';
import CharacterDto from "../../DTOs/characterDto";
import VehicleDto from "../../DTOs/vehicleDto";
import SpeciesDto from "../../DTOs/speciesDto";
import StarshipDto from "../../DTOs/starshipDto";
import PlanetDto from "../../DTOs/planetDto";
import FilmDto from "../../DTOs/filmDto";
import {Paths} from "../values/values";


const params = new URLSearchParams(window.location.search);
const currentFilmId = Number(params.get('id'));

const charactersSelect = <HTMLSelectElement>document.getElementById('characters');
const planetsSelect = <HTMLSelectElement>document.getElementById('planets');
const vehiclesSelect = <HTMLSelectElement>document.getElementById('vehicles');
const speciesSelect = <HTMLSelectElement>document.getElementById('species');
const starshipsSelect = <HTMLSelectElement>document.getElementById('starships');
const filmForm = <HTMLFormElement>document.getElementById('film-form');

const changedFields = new Map();


window.onload = () => {
    filmService.getAllRelatedEntities()
        .then(entitiesPayload => {
            fillMultipleSelect(charactersSelect, entitiesPayload.characters);
            fillMultipleSelect(planetsSelect, entitiesPayload.planets);
            fillMultipleSelect(vehiclesSelect, entitiesPayload.vehicles);
            fillMultipleSelect(speciesSelect, entitiesPayload.species);
            fillMultipleSelect(starshipsSelect, entitiesPayload.starships);

            if (currentFilmId) {
                for (const element of filmForm.elements) {
                    element.addEventListener('change', handleFieldChange);
                }
                filmForm.addEventListener('submit', editFilm);
                fillForm();
            } else {
                filmForm.addEventListener('submit', addFilm);
            }
        })
}

function addFilm(e: Event) {
    e.preventDefault();
    const formData = new FormData(filmForm);
    const film : Partial<FilmDto> = Object.fromEntries(formData.entries());
    const filmData = {fields: {}} as FilmDto;

    for (const key in film) {
        const currentEl = document.getElementById(key) as HTMLInputElement | HTMLSelectElement;
        if (currentEl.type === 'select-multiple') {
            const selectedOptions = Array.prototype.slice.call((currentEl as HTMLSelectElement).selectedOptions);
            // @ts-ignore
            filmData.fields[key as keyof FilmDto] = selectedOptions.map(option => Number(option.value));
        } else {
            // @ts-ignore
            filmData.fields[key as keyof FilmDto] = currentEl.value;
        }
    }

    filmService.addFilm(filmData)
        .then(() => window.location.href = Paths.MainPagePath);
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
        } else if ('starship_class' in item) {
            option.innerHTML = `${String(item.id)} (${String(item.starship_class)})`;
        }
        selectElem.add(option);
    })
}

function editFilm(e: Event) {
    e.preventDefault();
    const filmData = {fields: {}} as FilmDto;

    for (const key of changedFields.keys()) {
        // @ts-ignore
        filmData.fields[key as keyof FilmDto] = changedFields.get(key);
    }

    filmService.editFilm(filmData, currentFilmId);
}

function fillForm() {
    filmService.getSingleFilm(currentFilmId)
        .then(currentFilmData => {
            let fieldName = '';
            for (const element of filmForm.elements) {
                fieldName = element.getAttribute('name') as string;
                if ((element as HTMLSelectElement | HTMLInputElement).type === 'select-multiple') {
                    //@ts-ignore
                    currentFilmData.fields[fieldName as keyof FilmDto].forEach(el => {
                        (element as HTMLSelectElement).options.item(el)!.selected = true;
                    })
                } else {
                    // @ts-ignore
                    (element as HTMLInputElement | HTMLSelectElement).value = currentFilmData.fields[fieldName as keyof FilmDto];
                }
            }
        })
}

function handleFieldChange(e: Event) {
    const target = e.target as HTMLSelectElement | HTMLInputElement;

    if (target.type === 'select-multiple') {
        const selectedOptions = Array.prototype.slice.call((target as HTMLSelectElement).selectedOptions);
        changedFields.set(target.id, selectedOptions.map(option => Number(option.value)));
    } else {
        changedFields.set(target.id, target.value);
    }
}