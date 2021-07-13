import '../../css/form.css'
import '../../css/header.css'
import filmService from '../../firebase/filmService';
import {Paths} from "../values/values";

import '../helpers/modal/modal.css'
import {Modal} from '../helpers/modal/modal.js';
import {authUi} from "../authUi";
import {signOut} from "../../firebase/auth";
import {EntityObject} from "../../types/types";
import Film from "../../models/Film/Film";

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
    const film : Partial<Film> = Object.fromEntries(formData.entries());
    console.log(film);
    const filmData = new Film();

    for (const key in film) {
        const currentEl = document.getElementById(key) as HTMLInputElement | HTMLSelectElement;
        if (currentEl.type === 'select-multiple') {
            const selectedOptions = Array.prototype.slice.call((currentEl as HTMLSelectElement).selectedOptions);
            // @ts-ignore
            filmData[key as keyof Film] = selectedOptions.map(option => Number(option.value));
        } else {
            // @ts-ignore
            filmData[key as keyof Film] = currentEl.value;
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
function fillMultipleSelect(selectElem : HTMLSelectElement, optionsArr : EntityObject[]) : void {
    optionsArr.forEach(item => {
        let option = document.createElement('option');
        option.value = String(item.id);
        if (item.name) {
            option.innerHTML = String(item.name);
        } else if (item.vehicle_class) {
            option.innerHTML = `${String(item.id)} (${String(item.vehicle_class)})`;
        } else if (item.starship_class) {
            option.innerHTML = `${String(item.id)} (${String(item.starship_class)})`;
        }
        selectElem.add(option);
    })
}

function sendFilmDataToEdit(e: Event) : void {
    e.preventDefault();
    filmService.getSingleFilm(currentFilmId)
        .then(filmDataPayload => {
            for (const key of changedFields.keys()) {
                // @ts-ignore
                filmDataPayload[key as keyof Film] = changedFields.get(key);
            }

            Modal.confirm({
                title: 'Edit Dialog',
                message: 'Are you sure you want to edit this film?',
                onConfirm: function() {
                    filmService.editFilm(filmDataPayload, currentFilmId)
                        .then(() => window.location.href = Paths.MainPagePath);
                }
            });
        })
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
                    currentFilmData[fieldName as keyof Film].forEach(el => {
                        (element as HTMLSelectElement).options.item(el)!.selected = true;
                    })
                } else {
                    // @ts-ignore
                    (element as HTMLInputElement | HTMLSelectElement).value = currentFilmData[fieldName as keyof Film];
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