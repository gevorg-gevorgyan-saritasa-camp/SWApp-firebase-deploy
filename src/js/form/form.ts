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

import '../helpers/modal/modal.css'
import {Modal} from '../helpers/modal/modal.js';
import {authUi} from "../authUi";
import {signOut} from "../../firebase/auth";

const params = new URLSearchParams(window.location.search);
const currentFilmId = Number(params.get('id'));

const charactersSelect = <HTMLSelectElement>document.getElementById('characters');
const planetsSelect = <HTMLSelectElement>document.getElementById('planets');
const vehiclesSelect = <HTMLSelectElement>document.getElementById('vehicles');
const speciesSelect = <HTMLSelectElement>document.getElementById('species');
const starshipsSelect = <HTMLSelectElement>document.getElementById('starships');
const filmForm = <HTMLFormElement>document.getElementById('film-form');
const signOutButton = document.getElementById('sign-out-button');

const changedFields = new Map();


window.onload = () => {
    authUi(<HTMLSpanElement>document.getElementById('username'));
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
                filmForm.addEventListener('submit', sendFilmDataToEdit);
                fillForm();
            } else {
                filmForm.addEventListener('submit', sendFilmDataToAdd);
            }
        })
}

signOutButton?.addEventListener('click',  () => {
    signOut()
        .then(() => window.location.href = Paths.MainPagePath);
});

/**
 * The function collects the form data into an object and calls the method to add it to the db.
 *
 * @param {Event} e Form submit event.
 */
function sendFilmDataToAdd(e: Event) : void {
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

/**
 * Function fills multiple selects on the page.
 * @param {HTMLSelectElement} selectElem Select to fill.
 * @param optionsArr Array of select options.
 */
function fillMultipleSelect(selectElem : HTMLSelectElement, optionsArr : CharacterDto[] | VehicleDto[] | SpeciesDto[]
                            | StarshipDto[] | PlanetDto[]) : void {
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

function sendFilmDataToEdit(e: Event) : void {
    e.preventDefault();
    const filmData = {fields: {}} as FilmDto;

    for (const key of changedFields.keys()) {
        // @ts-ignore
        filmData.fields[key as keyof FilmDto] = changedFields.get(key);
    }

    Modal.confirm({
        title: 'Edit Dialog',
        message: 'Are you sure you want to edit this film?',
        onConfirm: function() {
            filmService.editFilm(filmData, currentFilmId)
                .then(() => window.location.href = Paths.MainPagePath);
        }
    });
}

/**
 * Function that fills form (only when editing a film).
 */
function fillForm() : void {
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

/**
 * The function tracks all changes to the film fields and adds changed to the Map.
 * @param {Event} e Change event.
 */
function handleFieldChange(e: Event) : void {
    const target = e.target as HTMLSelectElement | HTMLInputElement;

    if (target.type === 'select-multiple') {
        const selectedOptions = Array.prototype.slice.call((target as HTMLSelectElement).selectedOptions);
        changedFields.set(target.id, selectedOptions.map(option => Number(option.value)));
    } else {
        changedFields.set(target.id, target.value);
    }
}