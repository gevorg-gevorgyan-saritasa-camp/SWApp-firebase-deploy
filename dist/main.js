/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/firebase/auth.ts":
/*!******************************!*\
  !*** ./src/firebase/auth.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "singInWithGoogle": () => (/* binding */ singInWithGoogle),
/* harmony export */   "signOut": () => (/* binding */ signOut)
/* harmony export */ });
/* harmony import */ var _js_values_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../js/values/values */ "./src/js/values/values.ts");
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./firebase */ "./src/firebase/firebase.ts");
/* harmony import */ var firebase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase */ "./node_modules/firebase/dist/index.esm.js");



/**
 * Log in to google account via firebase.
 */
function singInWithGoogle() {
    const provider = new firebase__WEBPACK_IMPORTED_MODULE_2__.default.auth.GoogleAuthProvider();
    _firebase__WEBPACK_IMPORTED_MODULE_1__.default.auth()
        .signInWithPopup(provider)
        .then(res => {
        localStorage.setItem('username', String(res.user?.displayName));
        localStorage.setItem('token', String(res.credential.idToken));
        window.location.href = _js_values_values__WEBPACK_IMPORTED_MODULE_0__.Paths.MainPagePath;
    })
        .catch(err => {
        throw new Error(err);
    });
}
/**
 * Log out.
 */
function signOut() {
    _firebase__WEBPACK_IMPORTED_MODULE_1__.default.auth()
        .signOut()
        .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = _js_values_values__WEBPACK_IMPORTED_MODULE_0__.Paths.MainPagePath;
    })
        .catch(err => {
        throw new Error(err);
    });
}


/***/ }),

/***/ "./src/firebase/config.ts":
/*!********************************!*\
  !*** ./src/firebase/config.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "firebaseConfig": () => (/* binding */ firebaseConfig)
/* harmony export */ });
const firebaseConfig = {
    apiKey: 'AIzaSyAdmnfws0fAtonx9JhFU9-dhfQaZQWY748',
    authDomain: 'swfilms-eac07.firebaseapp.com',
    projectId: 'swfilms-eac07',
    storageBucket: 'swfilms-eac07.appspot.com',
    messagingSenderId: '584668937233',
    appId: '1:584668937233:web:70f8c95bd46a1fb24205b0',
    measurementId: 'G-TK6SH2FDWB',
};


/***/ }),

/***/ "./src/firebase/filmService.ts":
/*!*************************************!*\
  !*** ./src/firebase/filmService.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _js_values_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../js/values/values */ "./src/js/values/values.ts");
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./firebase */ "./src/firebase/firebase.ts");


class FilmService {
    /**
     * Function that gets a list of films of one page, depending on the options.
     *
     * @param {object} sortOptions, Options for sorting the receiving movies.
     * @param {string} direction, Transition direction (previous or next page).
     * @param {string} searchOption, Option to search film by name.
     *
     * @return {Promise<*>} Returns promise with received films array.
     */
    async getPage(sortOptions, direction, searchOption = '') {
        //getting the next character after searchOption alphabetically. Improves the accuracy of the search
        const end = searchOption.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));
        let pageFilms = _firebase__WEBPACK_IMPORTED_MODULE_1__.default.firestore().collection(_js_values_values__WEBPACK_IMPORTED_MODULE_0__.FILMS_COLLECTION);
        if (searchOption) {
            pageFilms = await pageFilms
                .where(_js_values_values__WEBPACK_IMPORTED_MODULE_0__.SearchOptions.DefaultSearchField, '>=', searchOption)
                .where(_js_values_values__WEBPACK_IMPORTED_MODULE_0__.SearchOptions.DefaultSearchField, '<=', end);
        }
        switch (direction) {
            case _js_values_values__WEBPACK_IMPORTED_MODULE_0__.Navigation.PrevPage:
                const prevPageFilms = await pageFilms
                    .orderBy(sortOptions.field, sortOptions.rule)
                    .endBefore(this.currentPageFilms?.docs[0])
                    .limitToLast(_js_values_values__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_PAGE_SIZE)
                    .get();
                if (prevPageFilms.size !== 0) {
                    this.currentPageFilms = prevPageFilms;
                }
                break;
            case _js_values_values__WEBPACK_IMPORTED_MODULE_0__.Navigation.NextPage:
                const nextPageFilms = await pageFilms
                    .orderBy(sortOptions.field, sortOptions.rule)
                    .startAfter(this.currentPageFilms?.docs[this.currentPageFilms.size - 1])
                    .limit(_js_values_values__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_PAGE_SIZE)
                    .get();
                if (nextPageFilms.size !== 0) {
                    this.currentPageFilms = nextPageFilms;
                }
                break;
            default:
                this.currentPageFilms = await pageFilms
                    .orderBy(sortOptions.field, sortOptions.rule)
                    .limit(_js_values_values__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_PAGE_SIZE)
                    .get();
                break;
        }
        return this.extractFilmsData(this.currentPageFilms);
    }
    /**
     * Extracts films data from docs array.
     *
     * @param {object} films, Films object received from db.
     *
     * @return {Array<Film>} Films data array.
     */
    extractFilmsData(films) {
        return films.docs.map(doc => doc.data().fields);
    }
    /**
     * Gets one film by id.
     *
     * @param {number} currentFilmId, Film id.
     * @return {Promise<*>} Promise with film data.
     */
    async getSingleFilm(currentFilmId) {
        let film = await _firebase__WEBPACK_IMPORTED_MODULE_1__.default.firestore().collection(_js_values_values__WEBPACK_IMPORTED_MODULE_0__.FILMS_COLLECTION)
            .where(_js_values_values__WEBPACK_IMPORTED_MODULE_0__.SearchOptions.FilmEpisodeField, '==', currentFilmId)
            .get();
        return film.docs[0].data().fields;
    }
    /**
     * Gets array of names of related entity items.
     *
     * @param {string} entityCollectionName, Name of related entity (collection in db).
     * @param {Array<number>} relatedEntityIds, Array of related entity items ids.
     * @return {Promise<*[]>} Promise with related entity items array.
     */
    async getRelatedEntityItems(entityCollectionName, relatedEntityIds) {
        const idsArray = [];
        let relatedEntityArr = [];
        //Splitting the array, since firebase does not allow arrays longer than 10 in where 'in'
        for (let i = 0; i < relatedEntityIds.length; i += _js_values_values__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_JOIN_ARRAY_SIZE) {
            idsArray.push(relatedEntityIds.slice(i, i + _js_values_values__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_JOIN_ARRAY_SIZE));
        }
        for (const array of idsArray) {
            let tmpArr = await _firebase__WEBPACK_IMPORTED_MODULE_1__.default.firestore().collection(entityCollectionName)
                .where('pk', 'in', array)
                .get();
            relatedEntityArr = relatedEntityArr.concat(tmpArr.docs);
        }
        return relatedEntityArr.map(item => {
            return item.data()?.fields.name;
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new FilmService());


/***/ }),

/***/ "./src/firebase/firebase.ts":
/*!**********************************!*\
  !*** ./src/firebase/firebase.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var firebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase */ "./node_modules/firebase/dist/index.esm.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./src/firebase/config.ts");


const firebaseApp = firebase__WEBPACK_IMPORTED_MODULE_0__.default.initializeApp(_config__WEBPACK_IMPORTED_MODULE_1__.firebaseConfig);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (firebaseApp);


/***/ }),

/***/ "./src/js/authUi.ts":
/*!**************************!*\
  !*** ./src/js/authUi.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "authUiMainPage": () => (/* binding */ authUiMainPage),
/* harmony export */   "authUiFilmPage": () => (/* binding */ authUiFilmPage)
/* harmony export */ });
/* harmony import */ var _values_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./values/values */ "./src/js/values/values.ts");

/**
 * Function determines which block will be shown on a main page, depending on whether the user is authenticated or not.
 *
 * @param {HTMLDivElement} authBlock, Block that will be shown if user is authenticated.
 * @param {HTMLDivElement} noAuthBlock, Block that will be shown if user is not authenticated.
 * @param {HTMLSpanElement} username, Span for username
 */
function authUiMainPage(authBlock, noAuthBlock, username) {
    const isAuth = Boolean(localStorage.getItem('token'));
    noAuthBlock.classList.toggle('hidden', isAuth);
    authBlock.classList.toggle('hidden', !isAuth);
    username.innerHTML = String(localStorage.getItem('username'));
}
/**
 * Function checks access to the film page. If user is not authenticated, it will redirect to login page.
 *
 * @param {HTMLSpanElement} username, Span for username.
 */
function authUiFilmPage(username) {
    if (!localStorage.getItem('token')) {
        window.location.href = _values_values__WEBPACK_IMPORTED_MODULE_0__.Paths.LoginPagePath;
    }
    else {
        username.innerHTML = String(localStorage.getItem('username'));
    }
}


/***/ }),

/***/ "./src/js/debounce.ts":
/*!****************************!*\
  !*** ./src/js/debounce.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "debounce": () => (/* binding */ debounce)
/* harmony export */ });
/**
 * Debounce function
 *
 * @param {Function} func Function to debounce
 * @param {number} delayTime Time to delay execution of function
 * @returns {Function} Debounced function
 */
function debounce(fn, delay) {
    let timeoutID = null;
    return (...args) => {
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        timeoutID = window.setTimeout(() => {
            fn(...args);
        }, delay);
    };
}
;


/***/ }),

/***/ "./src/js/main/main.ts":
/*!*****************************!*\
  !*** ./src/js/main/main.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _firebase_filmService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../firebase/filmService */ "./src/firebase/filmService.ts");
/* harmony import */ var _values_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../values/values */ "./src/js/values/values.ts");
/* harmony import */ var _firebase_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../firebase/auth */ "./src/firebase/auth.ts");
/* harmony import */ var _authUi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../authUi */ "./src/js/authUi.ts");
/* harmony import */ var _debounce__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../debounce */ "./src/js/debounce.ts");





let sortOptions = { field: _values_values__WEBPACK_IMPORTED_MODULE_1__.SortOptions.DefaultOrder, rule: _values_values__WEBPACK_IMPORTED_MODULE_1__.SortOptions.Asc };
let searchOption = '';
const tableBody = document.getElementById('films-table-body');
const signOutButton = document.getElementById('sign-out-button');
const authBlock = document.getElementById('auth-block');
const noAuthBlock = document.getElementById('no-auth-block');
const searchInput = document.getElementById('search-field');
const ascSortButtons = document.getElementsByName('asc-table-sort-button');
const descSortButtons = document.getElementsByName('desc-table-sort-button');
const nextPageButton = document.getElementById('next-page-button');
const prevPageButton = document.getElementById('prev-page-button');
window.onload = () => {
    (0,_authUi__WEBPACK_IMPORTED_MODULE_3__.authUiMainPage)(authBlock, noAuthBlock, document.getElementById('username'));
    loadStartPage();
};
signOutButton?.addEventListener('click', _firebase_auth__WEBPACK_IMPORTED_MODULE_2__.signOut);
nextPageButton?.addEventListener('click', () => {
    if (prevPageButton?.disabled) {
        prevPageButton.disabled = false;
    }
    loadPage(_values_values__WEBPACK_IMPORTED_MODULE_1__.Navigation.NextPage);
});
prevPageButton?.addEventListener('click', () => {
    if (nextPageButton?.disabled) {
        nextPageButton.disabled = false;
    }
    loadPage(_values_values__WEBPACK_IMPORTED_MODULE_1__.Navigation.PrevPage);
});
searchInput?.addEventListener('input', (0,_debounce__WEBPACK_IMPORTED_MODULE_4__.debounce)(searchByTitle, _values_values__WEBPACK_IMPORTED_MODULE_1__.DEBOUNCE_DELAY_TIME));
ascSortButtons.forEach(ascSortButton => {
    ascSortButton.addEventListener('click', (e) => {
        const target = e.target;
        const column = target.parentElement?.parentElement?.id;
        sortOptions.field = _values_values__WEBPACK_IMPORTED_MODULE_1__.SortOptions.SortingFields + column;
        sortOptions.rule = _values_values__WEBPACK_IMPORTED_MODULE_1__.SortOptions.Asc;
        loadStartPage();
    });
});
descSortButtons.forEach(descSortButton => {
    descSortButton.addEventListener('click', (e) => {
        const target = e.target;
        const column = target.parentElement?.parentElement?.id;
        sortOptions.field = _values_values__WEBPACK_IMPORTED_MODULE_1__.SortOptions.SortingFields + column;
        sortOptions.rule = _values_values__WEBPACK_IMPORTED_MODULE_1__.SortOptions.Desc;
        loadStartPage();
    });
});
/**
 * A function that finds film by the entered title.
 *
 */
function searchByTitle() {
    searchOption = searchInput?.value;
    if (searchOption) {
        sortOptions.field = _values_values__WEBPACK_IMPORTED_MODULE_1__.SearchOptions.DefaultSearchField;
        sortOptions.rule = _values_values__WEBPACK_IMPORTED_MODULE_1__.SortOptions.Asc;
    }
    else {
        sortOptions.field = _values_values__WEBPACK_IMPORTED_MODULE_1__.SortOptions.DefaultOrder;
        sortOptions.rule = _values_values__WEBPACK_IMPORTED_MODULE_1__.SortOptions.Asc;
    }
    _firebase_filmService__WEBPACK_IMPORTED_MODULE_0__.default.getPage(sortOptions, null, searchOption)
        .then(foundFilms => {
        fillTable(foundFilms);
    });
}
/**
 * Loading page when navigating using the pagination menu arrows.
 *
 * @param {string} direction, Transition direction.
 */
function loadPage(direction) {
    _firebase_filmService__WEBPACK_IMPORTED_MODULE_0__.default.getPage(sortOptions, direction, searchOption)
        .then(pageData => {
        if (pageData.length !== 0) {
            fillTable(pageData);
        }
    });
}
/**
 * Removing all existing rows and filling table rows with received films data.
 *
 * @param {Array<FilmDto>} rowsData, Received films data.
 */
function fillTable(rowsData) {
    while (tableBody?.firstChild) {
        tableBody.removeChild(tableBody.firstChild); //Removing all existing rows
    }
    rowsData.forEach(film => {
        const episode = document.createElement('td');
        const title = document.createElement('td');
        const director = document.createElement('td');
        const releaseDate = document.createElement('td');
        const info = document.createElement('td');
        info.className = 'info-cell';
        info.innerHTML = 'More info...';
        info.addEventListener('click', moreInfo);
        episode.innerHTML = String(film.episode_id);
        title.innerHTML = film.title;
        director.innerHTML = film.director;
        releaseDate.innerHTML = film.release_date;
        const row = document.createElement('tr');
        row.id = String(film.episode_id);
        row.appendChild(episode);
        row.appendChild(title);
        row.appendChild(director);
        row.appendChild(releaseDate);
        row.appendChild(info);
        tableBody?.appendChild(row);
    });
}
/**
 * Redirect to film page or login page, depending on user's authentication status.
 *
 * @param {Event} e, Event object (row as a target).
 */
function moreInfo(e) {
    const target = e.target;
    if (localStorage.getItem('token')) {
        const params = new URLSearchParams();
        params.append('id', target?.parentElement?.id);
        window.location.href = `${_values_values__WEBPACK_IMPORTED_MODULE_1__.Paths.FilmPagePath}?${params.toString()}`;
    }
    else {
        window.location.href = _values_values__WEBPACK_IMPORTED_MODULE_1__.Paths.LoginPagePath;
    }
}
/**
 * Loading start page on the first page visit or after sorting.
 *
 */
function loadStartPage() {
    _firebase_filmService__WEBPACK_IMPORTED_MODULE_0__.default.getPage(sortOptions)
        .then(pageData => {
        fillTable(pageData);
    });
    prevPageButton.disabled = true;
    nextPageButton.disabled = false;
}


/***/ }),

/***/ "./src/js/values/values.ts":
/*!*********************************!*\
  !*** ./src/js/values/values.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_PAGE_SIZE": () => (/* binding */ DEFAULT_PAGE_SIZE),
/* harmony export */   "FILMS_COLLECTION": () => (/* binding */ FILMS_COLLECTION),
/* harmony export */   "DEFAULT_JOIN_ARRAY_SIZE": () => (/* binding */ DEFAULT_JOIN_ARRAY_SIZE),
/* harmony export */   "DEBOUNCE_DELAY_TIME": () => (/* binding */ DEBOUNCE_DELAY_TIME),
/* harmony export */   "Navigation": () => (/* binding */ Navigation),
/* harmony export */   "Paths": () => (/* binding */ Paths),
/* harmony export */   "SortOptions": () => (/* binding */ SortOptions),
/* harmony export */   "SearchOptions": () => (/* binding */ SearchOptions)
/* harmony export */ });
const DEFAULT_PAGE_SIZE = 2;
const FILMS_COLLECTION = 'films';
const DEFAULT_JOIN_ARRAY_SIZE = 10;
const DEBOUNCE_DELAY_TIME = 500;
const Navigation = {
    NextPage: 'next',
    PrevPage: 'prev',
};
const Paths = {
    MainPagePath: 'main.html',
    FilmPagePath: 'film.html',
    LoginPagePath: 'login.html',
};
const SortOptions = {
    DefaultOrder: 'pk',
    Asc: 'asc',
    Desc: 'desc',
    SortingFields: 'fields.',
};
const SearchOptions = {
    DefaultSearchField: 'fields.title',
    FilmEpisodeField: 'fields.episode_id',
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					result = fn();
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkswfilms"] = self["webpackChunkswfilms"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_firebase_dist_index_esm_js"], () => (__webpack_require__("./src/js/main/main.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zd2ZpbG1zLy4vc3JjL2ZpcmViYXNlL2F1dGgudHMiLCJ3ZWJwYWNrOi8vc3dmaWxtcy8uL3NyYy9maXJlYmFzZS9jb25maWcudHMiLCJ3ZWJwYWNrOi8vc3dmaWxtcy8uL3NyYy9maXJlYmFzZS9maWxtU2VydmljZS50cyIsIndlYnBhY2s6Ly9zd2ZpbG1zLy4vc3JjL2ZpcmViYXNlL2ZpcmViYXNlLnRzIiwid2VicGFjazovL3N3ZmlsbXMvLi9zcmMvanMvYXV0aFVpLnRzIiwid2VicGFjazovL3N3ZmlsbXMvLi9zcmMvanMvZGVib3VuY2UudHMiLCJ3ZWJwYWNrOi8vc3dmaWxtcy8uL3NyYy9qcy9tYWluL21haW4udHMiLCJ3ZWJwYWNrOi8vc3dmaWxtcy8uL3NyYy9qcy92YWx1ZXMvdmFsdWVzLnRzIiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc3dmaWxtcy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc3dmaWxtcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc3dmaWxtcy93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9ydW50aW1lL2hhcm1vbnkgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9zd2ZpbG1zL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc3dmaWxtcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vc3dmaWxtcy93ZWJwYWNrL3N0YXJ0dXAi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O1dBQ0E7V0FDQTtXQUNBLEU7Ozs7O1dDMUJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQSxDQUFDLEk7Ozs7O1dDUEQ7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBLEU7Ozs7O1dDVkEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxvQkFBb0I7V0FDMUI7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0EsNEc7Ozs7O1VDOUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UGF0aHN9IGZyb20gJy4uL2pzL3ZhbHVlcy92YWx1ZXMnO1xuaW1wb3J0IGZpcmViYXNlQXBwIGZyb20gJy4vZmlyZWJhc2UnO1xuaW1wb3J0IGZpcmViYXNlIGZyb20gXCJmaXJlYmFzZVwiO1xuXG4vKipcbiAqIExvZyBpbiB0byBnb29nbGUgYWNjb3VudCB2aWEgZmlyZWJhc2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaW5nSW5XaXRoR29vZ2xlKCkgOiB2b2lkIHtcbiAgY29uc3QgcHJvdmlkZXIgPSBuZXcgZmlyZWJhc2UuYXV0aC5Hb29nbGVBdXRoUHJvdmlkZXIoKTtcblxuICBmaXJlYmFzZUFwcC5hdXRoKClcbiAgICAuc2lnbkluV2l0aFBvcHVwKHByb3ZpZGVyKVxuICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcm5hbWUnLCBTdHJpbmcocmVzLnVzZXI/LmRpc3BsYXlOYW1lKSk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCBTdHJpbmcoKHJlcy5jcmVkZW50aWFsIGFzIGZpcmViYXNlLmF1dGguT0F1dGhDcmVkZW50aWFsKS5pZFRva2VuKSk7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFBhdGhzLk1haW5QYWdlUGF0aDtcbiAgICB9KVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgfSk7XG59XG5cbi8qKlxuICogTG9nIG91dC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNpZ25PdXQoKSA6IHZvaWR7XG4gIGZpcmViYXNlQXBwLmF1dGgoKVxuICAgIC5zaWduT3V0KClcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndG9rZW4nKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VybmFtZScpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBQYXRocy5NYWluUGFnZVBhdGg7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgIH0pO1xufSIsImV4cG9ydCBjb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcbiAgYXBpS2V5OiAnQUl6YVN5QWRtbmZ3czBmQXRvbng5SmhGVTktZGhmUWFaUVdZNzQ4JyxcbiAgYXV0aERvbWFpbjogJ3N3ZmlsbXMtZWFjMDcuZmlyZWJhc2VhcHAuY29tJyxcbiAgcHJvamVjdElkOiAnc3dmaWxtcy1lYWMwNycsXG4gIHN0b3JhZ2VCdWNrZXQ6ICdzd2ZpbG1zLWVhYzA3LmFwcHNwb3QuY29tJyxcbiAgbWVzc2FnaW5nU2VuZGVySWQ6ICc1ODQ2Njg5MzcyMzMnLFxuICBhcHBJZDogJzE6NTg0NjY4OTM3MjMzOndlYjo3MGY4Yzk1YmQ0NmExZmIyNDIwNWIwJyxcbiAgbWVhc3VyZW1lbnRJZDogJ0ctVEs2U0gyRkRXQicsXG59OyIsImltcG9ydCB7XG4gIEZJTE1TX0NPTExFQ1RJT04sXG4gIERFRkFVTFRfUEFHRV9TSVpFLFxuICBOYXZpZ2F0aW9uLFxuICBTZWFyY2hPcHRpb25zLFxuICBERUZBVUxUX0pPSU5fQVJSQVlfU0laRVxufSBmcm9tICcuLi9qcy92YWx1ZXMvdmFsdWVzJztcbmltcG9ydCBmaXJlYmFzZUFwcCBmcm9tICcuL2ZpcmViYXNlJztcbmltcG9ydCBGaWxtRHRvIGZyb20gXCIuLi9EVE9zL2ZpbG1EdG9cIjtcbmltcG9ydCBmaXJlYmFzZSBmcm9tIFwiZmlyZWJhc2VcIjtcbmltcG9ydCBDaGFyYWN0ZXJEdG8gZnJvbSBcIi4uL0RUT3MvY2hhcmFjdGVyRHRvXCI7XG5pbXBvcnQgUGxhbmV0RHRvIGZyb20gXCIuLi9EVE9zL3BsYW5ldER0b1wiO1xuaW1wb3J0IFNwZWNpZXNEdG8gZnJvbSBcIi4uL0RUT3Mvc3BlY2llc0R0b1wiO1xuXG5jbGFzcyBGaWxtU2VydmljZSB7XG4gIGN1cnJlbnRQYWdlRmlsbXM6IGZpcmViYXNlLmZpcmVzdG9yZS5RdWVyeVNuYXBzaG90IHwgdW5kZWZpbmVkO1xuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCBnZXRzIGEgbGlzdCBvZiBmaWxtcyBvZiBvbmUgcGFnZSwgZGVwZW5kaW5nIG9uIHRoZSBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gc29ydE9wdGlvbnMsIE9wdGlvbnMgZm9yIHNvcnRpbmcgdGhlIHJlY2VpdmluZyBtb3ZpZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXJlY3Rpb24sIFRyYW5zaXRpb24gZGlyZWN0aW9uIChwcmV2aW91cyBvciBuZXh0IHBhZ2UpLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoT3B0aW9uLCBPcHRpb24gdG8gc2VhcmNoIGZpbG0gYnkgbmFtZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTwqPn0gUmV0dXJucyBwcm9taXNlIHdpdGggcmVjZWl2ZWQgZmlsbXMgYXJyYXkuXG4gICAqL1xuICBhc3luYyBnZXRQYWdlKHNvcnRPcHRpb25zIDoge2ZpZWxkOiBzdHJpbmcsIHJ1bGU6IHN0cmluZ30sXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uPzogc3RyaW5nIHwgbnVsbCwgc2VhcmNoT3B0aW9uIDogc3RyaW5nID0gJycpIDogUHJvbWlzZTxBcnJheTxGaWxtRHRvPj4ge1xuICAgIC8vZ2V0dGluZyB0aGUgbmV4dCBjaGFyYWN0ZXIgYWZ0ZXIgc2VhcmNoT3B0aW9uIGFscGhhYmV0aWNhbGx5LiBJbXByb3ZlcyB0aGUgYWNjdXJhY3kgb2YgdGhlIHNlYXJjaFxuICAgIGNvbnN0IGVuZCA6IHN0cmluZyA9IHNlYXJjaE9wdGlvbi5yZXBsYWNlKC8uJC8sIGMgPT4gU3RyaW5nLmZyb21DaGFyQ29kZShjLmNoYXJDb2RlQXQoMCkgKyAxKSk7XG4gICAgbGV0IHBhZ2VGaWxtcyA9IDxmaXJlYmFzZS5maXJlc3RvcmUuUXVlcnk+ZmlyZWJhc2VBcHAuZmlyZXN0b3JlKCkuY29sbGVjdGlvbihGSUxNU19DT0xMRUNUSU9OKTtcblxuICAgIGlmKHNlYXJjaE9wdGlvbikge1xuICAgICAgcGFnZUZpbG1zID0gYXdhaXQgcGFnZUZpbG1zXG4gICAgICAgIC53aGVyZShTZWFyY2hPcHRpb25zLkRlZmF1bHRTZWFyY2hGaWVsZCwgJz49Jywgc2VhcmNoT3B0aW9uKVxuICAgICAgICAud2hlcmUoU2VhcmNoT3B0aW9ucy5EZWZhdWx0U2VhcmNoRmllbGQsICc8PScsIGVuZClcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgY2FzZSBOYXZpZ2F0aW9uLlByZXZQYWdlOlxuICAgICAgICBjb25zdCBwcmV2UGFnZUZpbG1zIDogZmlyZWJhc2UuZmlyZXN0b3JlLlF1ZXJ5U25hcHNob3QgPSBhd2FpdCBwYWdlRmlsbXNcbiAgICAgICAgICAub3JkZXJCeShzb3J0T3B0aW9ucy5maWVsZCwgc29ydE9wdGlvbnMucnVsZSBhcyBmaXJlYmFzZS5maXJlc3RvcmUuT3JkZXJCeURpcmVjdGlvbilcbiAgICAgICAgICAuZW5kQmVmb3JlKHRoaXMuY3VycmVudFBhZ2VGaWxtcz8uZG9jc1swXSlcbiAgICAgICAgICAubGltaXRUb0xhc3QoREVGQVVMVF9QQUdFX1NJWkUpXG4gICAgICAgICAgLmdldCgpXG4gICAgICAgIGlmIChwcmV2UGFnZUZpbG1zLnNpemUgIT09IDApIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRmlsbXMgPSBwcmV2UGFnZUZpbG1zO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBOYXZpZ2F0aW9uLk5leHRQYWdlOlxuICAgICAgICBjb25zdCBuZXh0UGFnZUZpbG1zIDogZmlyZWJhc2UuZmlyZXN0b3JlLlF1ZXJ5U25hcHNob3QgPSBhd2FpdCBwYWdlRmlsbXNcbiAgICAgICAgICAub3JkZXJCeShzb3J0T3B0aW9ucy5maWVsZCwgc29ydE9wdGlvbnMucnVsZSBhcyBmaXJlYmFzZS5maXJlc3RvcmUuT3JkZXJCeURpcmVjdGlvbilcbiAgICAgICAgICAuc3RhcnRBZnRlcih0aGlzLmN1cnJlbnRQYWdlRmlsbXM/LmRvY3NbdGhpcy5jdXJyZW50UGFnZUZpbG1zLnNpemUgLSAxXSlcbiAgICAgICAgICAubGltaXQoREVGQVVMVF9QQUdFX1NJWkUpXG4gICAgICAgICAgLmdldCgpXG4gICAgICAgIGlmIChuZXh0UGFnZUZpbG1zLnNpemUgIT09IDApIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRmlsbXMgPSBuZXh0UGFnZUZpbG1zO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZUZpbG1zID0gYXdhaXQgcGFnZUZpbG1zXG4gICAgICAgICAgLm9yZGVyQnkoc29ydE9wdGlvbnMuZmllbGQsIHNvcnRPcHRpb25zLnJ1bGUgYXMgZmlyZWJhc2UuZmlyZXN0b3JlLk9yZGVyQnlEaXJlY3Rpb24pXG4gICAgICAgICAgLmxpbWl0KERFRkFVTFRfUEFHRV9TSVpFKVxuICAgICAgICAgIC5nZXQoKTtcblxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5leHRyYWN0RmlsbXNEYXRhKDxmaXJlYmFzZS5maXJlc3RvcmUuUXVlcnlTbmFwc2hvdD50aGlzLmN1cnJlbnRQYWdlRmlsbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3RzIGZpbG1zIGRhdGEgZnJvbSBkb2NzIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZmlsbXMsIEZpbG1zIG9iamVjdCByZWNlaXZlZCBmcm9tIGRiLlxuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheTxGaWxtPn0gRmlsbXMgZGF0YSBhcnJheS5cbiAgICovXG4gIGV4dHJhY3RGaWxtc0RhdGEoZmlsbXMgOiBmaXJlYmFzZS5maXJlc3RvcmUuUXVlcnlTbmFwc2hvdCkgOiBBcnJheTxGaWxtRHRvPiB7XG4gICAgcmV0dXJuIGZpbG1zLmRvY3MubWFwKGRvYyA9PiBkb2MuZGF0YSgpLmZpZWxkcyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvbmUgZmlsbSBieSBpZC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRGaWxtSWQsIEZpbG0gaWQuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8Kj59IFByb21pc2Ugd2l0aCBmaWxtIGRhdGEuXG4gICAqL1xuICBhc3luYyBnZXRTaW5nbGVGaWxtKGN1cnJlbnRGaWxtSWQgOiBudW1iZXIpIDogUHJvbWlzZTxGaWxtRHRvPiB7XG4gICAgbGV0IGZpbG0gPSBhd2FpdCBmaXJlYmFzZUFwcC5maXJlc3RvcmUoKS5jb2xsZWN0aW9uKEZJTE1TX0NPTExFQ1RJT04pXG4gICAgICAud2hlcmUoU2VhcmNoT3B0aW9ucy5GaWxtRXBpc29kZUZpZWxkLCAnPT0nLCBjdXJyZW50RmlsbUlkKVxuICAgICAgLmdldCgpO1xuXG4gICAgcmV0dXJuIGZpbG0uZG9jc1swXS5kYXRhKCkuZmllbGRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYXJyYXkgb2YgbmFtZXMgb2YgcmVsYXRlZCBlbnRpdHkgaXRlbXMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRpdHlDb2xsZWN0aW9uTmFtZSwgTmFtZSBvZiByZWxhdGVkIGVudGl0eSAoY29sbGVjdGlvbiBpbiBkYikuXG4gICAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0gcmVsYXRlZEVudGl0eUlkcywgQXJyYXkgb2YgcmVsYXRlZCBlbnRpdHkgaXRlbXMgaWRzLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPCpbXT59IFByb21pc2Ugd2l0aCByZWxhdGVkIGVudGl0eSBpdGVtcyBhcnJheS5cbiAgICovXG4gIGFzeW5jIGdldFJlbGF0ZWRFbnRpdHlJdGVtcyhlbnRpdHlDb2xsZWN0aW9uTmFtZSA6IHN0cmluZywgcmVsYXRlZEVudGl0eUlkcyA6IEFycmF5PG51bWJlcj4pIDogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gICAgY29uc3QgaWRzQXJyYXkgOiBBcnJheTxBcnJheTxudW1iZXI+PiA9IFtdO1xuICAgIGxldCByZWxhdGVkRW50aXR5QXJyIDogQXJyYXk8ZmlyZWJhc2UuZmlyZXN0b3JlLkRvY3VtZW50U25hcHNob3Q+ID0gW107XG5cbiAgICAvL1NwbGl0dGluZyB0aGUgYXJyYXksIHNpbmNlIGZpcmViYXNlIGRvZXMgbm90IGFsbG93IGFycmF5cyBsb25nZXIgdGhhbiAxMCBpbiB3aGVyZSAnaW4nXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWxhdGVkRW50aXR5SWRzLmxlbmd0aDsgaSArPSBERUZBVUxUX0pPSU5fQVJSQVlfU0laRSkge1xuICAgICAgaWRzQXJyYXkucHVzaChyZWxhdGVkRW50aXR5SWRzLnNsaWNlKGksIGkrIERFRkFVTFRfSk9JTl9BUlJBWV9TSVpFKSk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBhcnJheSBvZiBpZHNBcnJheSkge1xuICAgICAgbGV0IHRtcEFyciA9IGF3YWl0IGZpcmViYXNlQXBwLmZpcmVzdG9yZSgpLmNvbGxlY3Rpb24oZW50aXR5Q29sbGVjdGlvbk5hbWUpXG4gICAgICAgIC53aGVyZSgncGsnLCAnaW4nLCBhcnJheSlcbiAgICAgICAgLmdldCgpO1xuICAgICAgcmVsYXRlZEVudGl0eUFyciA9IHJlbGF0ZWRFbnRpdHlBcnIuY29uY2F0KHRtcEFyci5kb2NzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVsYXRlZEVudGl0eUFyci5tYXAoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5kYXRhKCk/LmZpZWxkcy5uYW1lO1xuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEZpbG1TZXJ2aWNlKCk7IiwiaW1wb3J0IGZpcmViYXNlIGZyb20gJ2ZpcmViYXNlJztcbmltcG9ydCB7ZmlyZWJhc2VDb25maWd9IGZyb20gJy4vY29uZmlnJztcblxuY29uc3QgZmlyZWJhc2VBcHAgPSBmaXJlYmFzZS5pbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcbmV4cG9ydCBkZWZhdWx0IGZpcmViYXNlQXBwOyIsImltcG9ydCB7UGF0aHN9IGZyb20gJy4vdmFsdWVzL3ZhbHVlcyc7XG5cbi8qKlxuICogRnVuY3Rpb24gZGV0ZXJtaW5lcyB3aGljaCBibG9jayB3aWxsIGJlIHNob3duIG9uIGEgbWFpbiBwYWdlLCBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgdXNlciBpcyBhdXRoZW50aWNhdGVkIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxEaXZFbGVtZW50fSBhdXRoQmxvY2ssIEJsb2NrIHRoYXQgd2lsbCBiZSBzaG93biBpZiB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQuXG4gKiBAcGFyYW0ge0hUTUxEaXZFbGVtZW50fSBub0F1dGhCbG9jaywgQmxvY2sgdGhhdCB3aWxsIGJlIHNob3duIGlmIHVzZXIgaXMgbm90IGF1dGhlbnRpY2F0ZWQuXG4gKiBAcGFyYW0ge0hUTUxTcGFuRWxlbWVudH0gdXNlcm5hbWUsIFNwYW4gZm9yIHVzZXJuYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhdXRoVWlNYWluUGFnZShhdXRoQmxvY2sgOiBIVE1MRGl2RWxlbWVudCwgbm9BdXRoQmxvY2sgOiBIVE1MRGl2RWxlbWVudCwgdXNlcm5hbWUgOiBIVE1MU3BhbkVsZW1lbnQpIDogdm9pZCB7XG4gIGNvbnN0IGlzQXV0aCAgPSBCb29sZWFuKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpKTtcbiAgbm9BdXRoQmxvY2suY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJywgaXNBdXRoKTtcbiAgYXV0aEJsb2NrLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicsICFpc0F1dGgpO1xuXG4gIHVzZXJuYW1lLmlubmVySFRNTCA9IFN0cmluZyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcm5hbWUnKSk7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gY2hlY2tzIGFjY2VzcyB0byB0aGUgZmlsbSBwYWdlLiBJZiB1c2VyIGlzIG5vdCBhdXRoZW50aWNhdGVkLCBpdCB3aWxsIHJlZGlyZWN0IHRvIGxvZ2luIHBhZ2UuXG4gKlxuICogQHBhcmFtIHtIVE1MU3BhbkVsZW1lbnR9IHVzZXJuYW1lLCBTcGFuIGZvciB1c2VybmFtZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGF1dGhVaUZpbG1QYWdlKHVzZXJuYW1lIDogSFRNTFNwYW5FbGVtZW50KSA6IHZvaWQge1xuICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBQYXRocy5Mb2dpblBhZ2VQYXRoO1xuICB9IGVsc2Uge1xuICAgIHVzZXJuYW1lLmlubmVySFRNTCA9IFN0cmluZyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcm5hbWUnKSk7XG4gIH1cbn0iLCIvKipcbiAqIERlYm91bmNlIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBGdW5jdGlvbiB0byBkZWJvdW5jZVxuICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5VGltZSBUaW1lIHRvIGRlbGF5IGV4ZWN1dGlvbiBvZiBmdW5jdGlvblxuICogQHJldHVybnMge0Z1bmN0aW9ufSBEZWJvdW5jZWQgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlPFRBcmdzIGV4dGVuZHMgYW55W10+KGZuOiAodGhpczogdm9pZCwgLi4uYXJnczogVEFyZ3MpID0+IHVua25vd24sIGRlbGF5OiBudW1iZXIpOiAoLi4uYXJnczogVEFyZ3MpID0+IHZvaWQge1xuICBsZXQgdGltZW91dElEOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcmV0dXJuICguLi5hcmdzOiBUQXJncykgPT4ge1xuICAgIGlmICh0aW1lb3V0SUQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SUQpO1xuICAgIH1cbiAgICB0aW1lb3V0SUQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBmbiguLi5hcmdzKTtcbiAgICB9LCBkZWxheSk7XG4gIH07XG59OyIsImltcG9ydCBmaWxtU2VydmljZSBmcm9tICcuLi8uLi9maXJlYmFzZS9maWxtU2VydmljZSc7XG5pbXBvcnQge1xuICBOYXZpZ2F0aW9uLFxuICBTZWFyY2hPcHRpb25zLFxuICBTb3J0T3B0aW9ucyxcbiAgUGF0aHMsXG4gIERFQk9VTkNFX0RFTEFZX1RJTUUsXG59IGZyb20gJy4uL3ZhbHVlcy92YWx1ZXMnO1xuaW1wb3J0IHtzaWduT3V0fSBmcm9tICcuLi8uLi9maXJlYmFzZS9hdXRoJztcbmltcG9ydCB7YXV0aFVpTWFpblBhZ2V9IGZyb20gJy4uL2F1dGhVaSc7XG5pbXBvcnQge2RlYm91bmNlfSBmcm9tICcuLi9kZWJvdW5jZSc7XG5pbXBvcnQgRmlsbUR0byBmcm9tIFwiLi4vLi4vRFRPcy9maWxtRHRvXCI7XG5cbmxldCBzb3J0T3B0aW9ucyA9IHtmaWVsZDogU29ydE9wdGlvbnMuRGVmYXVsdE9yZGVyLCBydWxlOiBTb3J0T3B0aW9ucy5Bc2N9O1xubGV0IHNlYXJjaE9wdGlvbiA9ICcnO1xuXG5jb25zdCB0YWJsZUJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsbXMtdGFibGUtYm9keScpO1xuXG5jb25zdCBzaWduT3V0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZ24tb3V0LWJ1dHRvbicpO1xuY29uc3QgYXV0aEJsb2NrID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLWJsb2NrJyk7XG5jb25zdCBub0F1dGhCbG9jayA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm8tYXV0aC1ibG9jaycpO1xuXG5jb25zdCBzZWFyY2hJbnB1dCA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtZmllbGQnKTtcblxuY29uc3QgYXNjU29ydEJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnYXNjLXRhYmxlLXNvcnQtYnV0dG9uJyk7XG5jb25zdCBkZXNjU29ydEJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnZGVzYy10YWJsZS1zb3J0LWJ1dHRvbicpO1xuXG5jb25zdCBuZXh0UGFnZUJ1dHRvbiA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV4dC1wYWdlLWJ1dHRvbicpO1xuY29uc3QgcHJldlBhZ2VCdXR0b24gPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZXYtcGFnZS1idXR0b24nKTtcblxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgYXV0aFVpTWFpblBhZ2UoYXV0aEJsb2NrLCBub0F1dGhCbG9jaywgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJuYW1lJykgYXMgSFRNTFNwYW5FbGVtZW50KTtcbiAgbG9hZFN0YXJ0UGFnZSgpO1xufTtcblxuc2lnbk91dEJ1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzaWduT3V0KTtcblxubmV4dFBhZ2VCdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBpZiAocHJldlBhZ2VCdXR0b24/LmRpc2FibGVkKSB7XG4gICAgcHJldlBhZ2VCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgfVxuICBsb2FkUGFnZShOYXZpZ2F0aW9uLk5leHRQYWdlKTtcbn0pO1xuXG5wcmV2UGFnZUJ1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGlmIChuZXh0UGFnZUJ1dHRvbj8uZGlzYWJsZWQpIHtcbiAgICBuZXh0UGFnZUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICB9XG4gIGxvYWRQYWdlKE5hdmlnYXRpb24uUHJldlBhZ2UpO1xufSk7XG5cbnNlYXJjaElucHV0Py5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlYm91bmNlKHNlYXJjaEJ5VGl0bGUsIERFQk9VTkNFX0RFTEFZX1RJTUUpKTtcblxuYXNjU29ydEJ1dHRvbnMuZm9yRWFjaChhc2NTb3J0QnV0dG9uID0+IHtcbiAgYXNjU29ydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlIDogRXZlbnQpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSA8RWxlbWVudD5lLnRhcmdldDtcbiAgICBjb25zdCBjb2x1bW4gPSB0YXJnZXQucGFyZW50RWxlbWVudD8ucGFyZW50RWxlbWVudD8uaWQ7XG5cbiAgICBzb3J0T3B0aW9ucy5maWVsZCA9IFNvcnRPcHRpb25zLlNvcnRpbmdGaWVsZHMgKyBjb2x1bW47XG4gICAgc29ydE9wdGlvbnMucnVsZSA9IFNvcnRPcHRpb25zLkFzYztcblxuICAgIGxvYWRTdGFydFBhZ2UoKTtcbiAgfSk7XG59KTtcblxuZGVzY1NvcnRCdXR0b25zLmZvckVhY2goZGVzY1NvcnRCdXR0b24gPT4ge1xuICBkZXNjU29ydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlOiBFdmVudCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IDxFbGVtZW50PmUudGFyZ2V0O1xuICAgIGNvbnN0IGNvbHVtbiA9IHRhcmdldC5wYXJlbnRFbGVtZW50Py5wYXJlbnRFbGVtZW50Py5pZDtcblxuICAgIHNvcnRPcHRpb25zLmZpZWxkID0gU29ydE9wdGlvbnMuU29ydGluZ0ZpZWxkcyArIGNvbHVtbjtcbiAgICBzb3J0T3B0aW9ucy5ydWxlID0gU29ydE9wdGlvbnMuRGVzYztcblxuICAgIGxvYWRTdGFydFBhZ2UoKTtcbiAgfSk7XG59KTtcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgZmluZHMgZmlsbSBieSB0aGUgZW50ZXJlZCB0aXRsZS5cbiAqXG4gKi9cbmZ1bmN0aW9uIHNlYXJjaEJ5VGl0bGUoKSA6IHZvaWQge1xuICBzZWFyY2hPcHRpb24gPSBzZWFyY2hJbnB1dD8udmFsdWU7XG4gIGlmIChzZWFyY2hPcHRpb24pIHtcbiAgICBzb3J0T3B0aW9ucy5maWVsZCA9IFNlYXJjaE9wdGlvbnMuRGVmYXVsdFNlYXJjaEZpZWxkO1xuICAgIHNvcnRPcHRpb25zLnJ1bGUgPSBTb3J0T3B0aW9ucy5Bc2M7XG4gIH0gZWxzZSB7XG4gICAgc29ydE9wdGlvbnMuZmllbGQgPSBTb3J0T3B0aW9ucy5EZWZhdWx0T3JkZXI7XG4gICAgc29ydE9wdGlvbnMucnVsZSA9IFNvcnRPcHRpb25zLkFzYztcbiAgfVxuXG4gIGZpbG1TZXJ2aWNlLmdldFBhZ2Uoc29ydE9wdGlvbnMsIG51bGwsIHNlYXJjaE9wdGlvbilcbiAgICAudGhlbihmb3VuZEZpbG1zID0+IHtcbiAgICAgIGZpbGxUYWJsZShmb3VuZEZpbG1zKTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBMb2FkaW5nIHBhZ2Ugd2hlbiBuYXZpZ2F0aW5nIHVzaW5nIHRoZSBwYWdpbmF0aW9uIG1lbnUgYXJyb3dzLlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gZGlyZWN0aW9uLCBUcmFuc2l0aW9uIGRpcmVjdGlvbi5cbiAqL1xuZnVuY3Rpb24gbG9hZFBhZ2UoZGlyZWN0aW9uIDogc3RyaW5nKSA6IHZvaWQge1xuICBmaWxtU2VydmljZS5nZXRQYWdlKHNvcnRPcHRpb25zLCBkaXJlY3Rpb24sIHNlYXJjaE9wdGlvbilcbiAgICAudGhlbihwYWdlRGF0YSA9PiB7XG4gICAgICBpZiAocGFnZURhdGEubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIGZpbGxUYWJsZShwYWdlRGF0YSk7XG4gICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogUmVtb3ZpbmcgYWxsIGV4aXN0aW5nIHJvd3MgYW5kIGZpbGxpbmcgdGFibGUgcm93cyB3aXRoIHJlY2VpdmVkIGZpbG1zIGRhdGEuXG4gKlxuICogQHBhcmFtIHtBcnJheTxGaWxtRHRvPn0gcm93c0RhdGEsIFJlY2VpdmVkIGZpbG1zIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGZpbGxUYWJsZShyb3dzRGF0YSA6IEFycmF5PEZpbG1EdG8+KSA6IHZvaWQge1xuICB3aGlsZSAodGFibGVCb2R5Py5maXJzdENoaWxkKSB7XG4gICAgdGFibGVCb2R5LnJlbW92ZUNoaWxkKHRhYmxlQm9keS5maXJzdENoaWxkKTsgLy9SZW1vdmluZyBhbGwgZXhpc3Rpbmcgcm93c1xuICB9XG5cbiAgcm93c0RhdGEuZm9yRWFjaChmaWxtID0+IHtcbiAgICBjb25zdCBlcGlzb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgY29uc3QgZGlyZWN0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNvbnN0IHJlbGVhc2VEYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBjb25zdCBpbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcblxuICAgIGluZm8uY2xhc3NOYW1lID0gJ2luZm8tY2VsbCc7XG4gICAgaW5mby5pbm5lckhUTUwgPSAnTW9yZSBpbmZvLi4uJztcbiAgICBpbmZvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbW9yZUluZm8pO1xuXG4gICAgZXBpc29kZS5pbm5lckhUTUwgPSBTdHJpbmcoZmlsbS5lcGlzb2RlX2lkKTtcbiAgICB0aXRsZS5pbm5lckhUTUwgPSBmaWxtLnRpdGxlO1xuICAgIGRpcmVjdG9yLmlubmVySFRNTCA9IGZpbG0uZGlyZWN0b3I7XG4gICAgcmVsZWFzZURhdGUuaW5uZXJIVE1MID0gZmlsbS5yZWxlYXNlX2RhdGU7XG5cbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuXG4gICAgcm93LmlkID0gU3RyaW5nKGZpbG0uZXBpc29kZV9pZCk7XG5cbiAgICByb3cuYXBwZW5kQ2hpbGQoZXBpc29kZSk7XG4gICAgcm93LmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICByb3cuYXBwZW5kQ2hpbGQoZGlyZWN0b3IpO1xuICAgIHJvdy5hcHBlbmRDaGlsZChyZWxlYXNlRGF0ZSk7XG4gICAgcm93LmFwcGVuZENoaWxkKGluZm8pO1xuXG4gICAgdGFibGVCb2R5Py5hcHBlbmRDaGlsZChyb3cpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZWRpcmVjdCB0byBmaWxtIHBhZ2Ugb3IgbG9naW4gcGFnZSwgZGVwZW5kaW5nIG9uIHVzZXIncyBhdXRoZW50aWNhdGlvbiBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtFdmVudH0gZSwgRXZlbnQgb2JqZWN0IChyb3cgYXMgYSB0YXJnZXQpLlxuICovXG5mdW5jdGlvbiBtb3JlSW5mbyhlOiBFdmVudCkge1xuICBjb25zdCB0YXJnZXQgPSA8RWxlbWVudD5lLnRhcmdldDtcbiAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpKSB7XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIHBhcmFtcy5hcHBlbmQoJ2lkJywgPHN0cmluZz50YXJnZXQ/LnBhcmVudEVsZW1lbnQ/LmlkKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAke1BhdGhzLkZpbG1QYWdlUGF0aH0/JHtwYXJhbXMudG9TdHJpbmcoKX1gO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gUGF0aHMuTG9naW5QYWdlUGF0aDtcbiAgfVxuXG59XG5cbi8qKlxuICogTG9hZGluZyBzdGFydCBwYWdlIG9uIHRoZSBmaXJzdCBwYWdlIHZpc2l0IG9yIGFmdGVyIHNvcnRpbmcuXG4gKlxuICovXG5mdW5jdGlvbiBsb2FkU3RhcnRQYWdlKCkgOiB2b2lkIHtcbiAgZmlsbVNlcnZpY2UuZ2V0UGFnZShzb3J0T3B0aW9ucylcbiAgICAudGhlbihwYWdlRGF0YSA9PiB7XG4gICAgICBmaWxsVGFibGUocGFnZURhdGEpO1xuICAgIH0pO1xuICBwcmV2UGFnZUJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gIG5leHRQYWdlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG59IiwiZXhwb3J0IGNvbnN0IERFRkFVTFRfUEFHRV9TSVpFID0gMjtcbmV4cG9ydCBjb25zdCBGSUxNU19DT0xMRUNUSU9OID0gJ2ZpbG1zJztcbmV4cG9ydCBjb25zdCBERUZBVUxUX0pPSU5fQVJSQVlfU0laRSA9IDEwO1xuZXhwb3J0IGNvbnN0IERFQk9VTkNFX0RFTEFZX1RJTUUgPSA1MDA7XG5cbmV4cG9ydCBjb25zdCBOYXZpZ2F0aW9uID0ge1xuICBOZXh0UGFnZTogJ25leHQnLFxuICBQcmV2UGFnZTogJ3ByZXYnLFxufTtcblxuZXhwb3J0IGNvbnN0IFBhdGhzID0ge1xuICBNYWluUGFnZVBhdGg6ICdtYWluLmh0bWwnLFxuICBGaWxtUGFnZVBhdGg6ICdmaWxtLmh0bWwnLFxuICBMb2dpblBhZ2VQYXRoOiAnbG9naW4uaHRtbCcsXG59O1xuXG5leHBvcnQgY29uc3QgU29ydE9wdGlvbnMgPSB7XG4gIERlZmF1bHRPcmRlcjogJ3BrJyxcbiAgQXNjOiAnYXNjJyxcbiAgRGVzYzogJ2Rlc2MnLFxuICBTb3J0aW5nRmllbGRzOiAnZmllbGRzLicsXG59O1xuXG5leHBvcnQgY29uc3QgU2VhcmNoT3B0aW9ucyA9IHtcbiAgRGVmYXVsdFNlYXJjaEZpZWxkOiAnZmllbGRzLnRpdGxlJyxcbiAgRmlsbUVwaXNvZGVGaWVsZDogJ2ZpZWxkcy5lcGlzb2RlX2lkJyxcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0cmVzdWx0ID0gZm4oKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18uaG1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUgPSBPYmplY3QuY3JlYXRlKG1vZHVsZSk7XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgJ2V4cG9ydHMnLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRzZXQ6ICgpID0+IHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRVMgTW9kdWxlcyBtYXkgbm90IGFzc2lnbiBtb2R1bGUuZXhwb3J0cyBvciBleHBvcnRzLiosIFVzZSBFU00gZXhwb3J0IHN5bnRheCwgaW5zdGVhZDogJyArIG1vZHVsZS5pZCk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0fVxuXHR9XG5cdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzd2ZpbG1zXCJdID0gc2VsZltcIndlYnBhY2tDaHVua3N3ZmlsbXNcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX2ZpcmViYXNlX2Rpc3RfaW5kZXhfZXNtX2pzXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2pzL21haW4vbWFpbi50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==