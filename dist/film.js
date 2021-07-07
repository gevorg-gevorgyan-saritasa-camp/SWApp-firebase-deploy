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

/***/ "./src/js/film/film.ts":
/*!*****************************!*\
  !*** ./src/js/film/film.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _firebase_filmService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../firebase/filmService */ "./src/firebase/filmService.ts");
/* harmony import */ var _firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../firebase/auth */ "./src/firebase/auth.ts");
/* harmony import */ var _authUi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../authUi */ "./src/js/authUi.ts");



const params = new URLSearchParams(window.location.search);
const currentFilmId = Number(params.get('id'));
const currentFilm = _firebase_filmService__WEBPACK_IMPORTED_MODULE_0__.default.getSingleFilm(currentFilmId);
const entitiesSelector = document.getElementById('film-related-entities-selector');
const relatedEntityList = document.getElementById('film-related-entity-list');
const signOutButton = document.getElementById('sign-out-button');
window.onload = () => {
    (0,_authUi__WEBPACK_IMPORTED_MODULE_2__.authUiFilmPage)(document.getElementById('username'));
    showFilmInfo();
};
signOutButton?.addEventListener('click', _firebase_auth__WEBPACK_IMPORTED_MODULE_1__.signOut);
/**
 * Showing information about the current film.
 */
function showFilmInfo() {
    currentFilm
        .then(currentFilmData => {
        document.getElementById('film-title').innerHTML = `${currentFilmData.title} (Episode ${currentFilmId})`;
        document.getElementById('film-director').innerHTML = `Director: ${currentFilmData.director}`;
        document.getElementById('film-producer').innerHTML = `Producer: ${currentFilmData.producer}`;
        document.getElementById('film-release-date').innerHTML = `Release Date: ${currentFilmData.release_date}`;
        document.getElementById('film-opening-crawl').innerHTML = `Opening crawl: ${currentFilmData.opening_crawl}`;
        const selectedCollectionName = entitiesSelector[entitiesSelector.selectedIndex].value;
        showRelatedEntityList(selectedCollectionName);
    });
}
entitiesSelector?.addEventListener('change', () => {
    const selectedCollectionName = entitiesSelector[entitiesSelector.selectedIndex].value;
    showRelatedEntityList(selectedCollectionName);
});
/**
 * Showing the list of a selected related entity items.
 *
 * @param {string} selectedCollectionName, Name of the selected related entity (collection in db).
 */
function showRelatedEntityList(selectedCollectionName) {
    while (relatedEntityList?.firstChild) {
        // This will remove all children within tbody which are <tr> elements
        relatedEntityList.removeChild(relatedEntityList.firstChild);
    }
    currentFilm
        .then(currentFilmData => {
        _firebase_filmService__WEBPACK_IMPORTED_MODULE_0__.default.getRelatedEntityItems(selectedCollectionName === 'characters'
            ? 'people'
            : selectedCollectionName, 
        // @ts-ignore
        currentFilmData[selectedCollectionName])
            .then(relatedEntityPayload => {
            relatedEntityPayload.forEach(item => {
                const listEl = document.createElement('li');
                listEl.innerHTML = item;
                relatedEntityList?.appendChild(listEl);
            });
        });
    });
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
/******/ 			"film": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_firebase_dist_index_esm_js"], () => (__webpack_require__("./src/js/film/film.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zd2ZpbG1zLy4vc3JjL2ZpcmViYXNlL2F1dGgudHMiLCJ3ZWJwYWNrOi8vc3dmaWxtcy8uL3NyYy9maXJlYmFzZS9jb25maWcudHMiLCJ3ZWJwYWNrOi8vc3dmaWxtcy8uL3NyYy9maXJlYmFzZS9maWxtU2VydmljZS50cyIsIndlYnBhY2s6Ly9zd2ZpbG1zLy4vc3JjL2ZpcmViYXNlL2ZpcmViYXNlLnRzIiwid2VicGFjazovL3N3ZmlsbXMvLi9zcmMvanMvYXV0aFVpLnRzIiwid2VicGFjazovL3N3ZmlsbXMvLi9zcmMvanMvZmlsbS9maWxtLnRzIiwid2VicGFjazovL3N3ZmlsbXMvLi9zcmMvanMvdmFsdWVzL3ZhbHVlcy50cyIsIndlYnBhY2s6Ly9zd2ZpbG1zL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9zd2ZpbG1zL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9zd2ZpbG1zL3dlYnBhY2svcnVudGltZS9oYXJtb255IG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vc3dmaWxtcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zd2ZpbG1zL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7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V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQSxDQUFDLEk7Ozs7O1dDUEQ7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBLEU7Ozs7O1dDVkEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxvQkFBb0I7V0FDMUI7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0EsNEc7Ozs7O1VDOUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiZmlsbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UGF0aHN9IGZyb20gJy4uL2pzL3ZhbHVlcy92YWx1ZXMnO1xuaW1wb3J0IGZpcmViYXNlQXBwIGZyb20gJy4vZmlyZWJhc2UnO1xuaW1wb3J0IGZpcmViYXNlIGZyb20gXCJmaXJlYmFzZVwiO1xuXG4vKipcbiAqIExvZyBpbiB0byBnb29nbGUgYWNjb3VudCB2aWEgZmlyZWJhc2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaW5nSW5XaXRoR29vZ2xlKCkgOiB2b2lkIHtcbiAgY29uc3QgcHJvdmlkZXIgPSBuZXcgZmlyZWJhc2UuYXV0aC5Hb29nbGVBdXRoUHJvdmlkZXIoKTtcblxuICBmaXJlYmFzZUFwcC5hdXRoKClcbiAgICAuc2lnbkluV2l0aFBvcHVwKHByb3ZpZGVyKVxuICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcm5hbWUnLCBTdHJpbmcocmVzLnVzZXI/LmRpc3BsYXlOYW1lKSk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCBTdHJpbmcoKHJlcy5jcmVkZW50aWFsIGFzIGZpcmViYXNlLmF1dGguT0F1dGhDcmVkZW50aWFsKS5pZFRva2VuKSk7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFBhdGhzLk1haW5QYWdlUGF0aDtcbiAgICB9KVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgfSk7XG59XG5cbi8qKlxuICogTG9nIG91dC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNpZ25PdXQoKSA6IHZvaWR7XG4gIGZpcmViYXNlQXBwLmF1dGgoKVxuICAgIC5zaWduT3V0KClcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndG9rZW4nKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VybmFtZScpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBQYXRocy5NYWluUGFnZVBhdGg7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgIH0pO1xufSIsImV4cG9ydCBjb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcbiAgYXBpS2V5OiAnQUl6YVN5QWRtbmZ3czBmQXRvbng5SmhGVTktZGhmUWFaUVdZNzQ4JyxcbiAgYXV0aERvbWFpbjogJ3N3ZmlsbXMtZWFjMDcuZmlyZWJhc2VhcHAuY29tJyxcbiAgcHJvamVjdElkOiAnc3dmaWxtcy1lYWMwNycsXG4gIHN0b3JhZ2VCdWNrZXQ6ICdzd2ZpbG1zLWVhYzA3LmFwcHNwb3QuY29tJyxcbiAgbWVzc2FnaW5nU2VuZGVySWQ6ICc1ODQ2Njg5MzcyMzMnLFxuICBhcHBJZDogJzE6NTg0NjY4OTM3MjMzOndlYjo3MGY4Yzk1YmQ0NmExZmIyNDIwNWIwJyxcbiAgbWVhc3VyZW1lbnRJZDogJ0ctVEs2U0gyRkRXQicsXG59OyIsImltcG9ydCB7XG4gIEZJTE1TX0NPTExFQ1RJT04sXG4gIERFRkFVTFRfUEFHRV9TSVpFLFxuICBOYXZpZ2F0aW9uLFxuICBTZWFyY2hPcHRpb25zLFxuICBERUZBVUxUX0pPSU5fQVJSQVlfU0laRVxufSBmcm9tICcuLi9qcy92YWx1ZXMvdmFsdWVzJztcbmltcG9ydCBmaXJlYmFzZUFwcCBmcm9tICcuL2ZpcmViYXNlJztcbmltcG9ydCBGaWxtRHRvIGZyb20gXCIuLi9EVE9zL2ZpbG1EdG9cIjtcbmltcG9ydCBmaXJlYmFzZSBmcm9tIFwiZmlyZWJhc2VcIjtcbmltcG9ydCBDaGFyYWN0ZXJEdG8gZnJvbSBcIi4uL0RUT3MvY2hhcmFjdGVyRHRvXCI7XG5pbXBvcnQgUGxhbmV0RHRvIGZyb20gXCIuLi9EVE9zL3BsYW5ldER0b1wiO1xuaW1wb3J0IFNwZWNpZXNEdG8gZnJvbSBcIi4uL0RUT3Mvc3BlY2llc0R0b1wiO1xuXG5jbGFzcyBGaWxtU2VydmljZSB7XG4gIGN1cnJlbnRQYWdlRmlsbXM6IGZpcmViYXNlLmZpcmVzdG9yZS5RdWVyeVNuYXBzaG90IHwgdW5kZWZpbmVkO1xuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCBnZXRzIGEgbGlzdCBvZiBmaWxtcyBvZiBvbmUgcGFnZSwgZGVwZW5kaW5nIG9uIHRoZSBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gc29ydE9wdGlvbnMsIE9wdGlvbnMgZm9yIHNvcnRpbmcgdGhlIHJlY2VpdmluZyBtb3ZpZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaXJlY3Rpb24sIFRyYW5zaXRpb24gZGlyZWN0aW9uIChwcmV2aW91cyBvciBuZXh0IHBhZ2UpLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoT3B0aW9uLCBPcHRpb24gdG8gc2VhcmNoIGZpbG0gYnkgbmFtZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTwqPn0gUmV0dXJucyBwcm9taXNlIHdpdGggcmVjZWl2ZWQgZmlsbXMgYXJyYXkuXG4gICAqL1xuICBhc3luYyBnZXRQYWdlKHNvcnRPcHRpb25zIDoge2ZpZWxkOiBzdHJpbmcsIHJ1bGU6IHN0cmluZ30sXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uPzogc3RyaW5nIHwgbnVsbCwgc2VhcmNoT3B0aW9uIDogc3RyaW5nID0gJycpIDogUHJvbWlzZTxBcnJheTxGaWxtRHRvPj4ge1xuICAgIC8vZ2V0dGluZyB0aGUgbmV4dCBjaGFyYWN0ZXIgYWZ0ZXIgc2VhcmNoT3B0aW9uIGFscGhhYmV0aWNhbGx5LiBJbXByb3ZlcyB0aGUgYWNjdXJhY3kgb2YgdGhlIHNlYXJjaFxuICAgIGNvbnN0IGVuZCA6IHN0cmluZyA9IHNlYXJjaE9wdGlvbi5yZXBsYWNlKC8uJC8sIGMgPT4gU3RyaW5nLmZyb21DaGFyQ29kZShjLmNoYXJDb2RlQXQoMCkgKyAxKSk7XG4gICAgbGV0IHBhZ2VGaWxtcyA9IDxmaXJlYmFzZS5maXJlc3RvcmUuUXVlcnk+ZmlyZWJhc2VBcHAuZmlyZXN0b3JlKCkuY29sbGVjdGlvbihGSUxNU19DT0xMRUNUSU9OKTtcblxuICAgIGlmKHNlYXJjaE9wdGlvbikge1xuICAgICAgcGFnZUZpbG1zID0gYXdhaXQgcGFnZUZpbG1zXG4gICAgICAgIC53aGVyZShTZWFyY2hPcHRpb25zLkRlZmF1bHRTZWFyY2hGaWVsZCwgJz49Jywgc2VhcmNoT3B0aW9uKVxuICAgICAgICAud2hlcmUoU2VhcmNoT3B0aW9ucy5EZWZhdWx0U2VhcmNoRmllbGQsICc8PScsIGVuZClcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgY2FzZSBOYXZpZ2F0aW9uLlByZXZQYWdlOlxuICAgICAgICBjb25zdCBwcmV2UGFnZUZpbG1zIDogZmlyZWJhc2UuZmlyZXN0b3JlLlF1ZXJ5U25hcHNob3QgPSBhd2FpdCBwYWdlRmlsbXNcbiAgICAgICAgICAub3JkZXJCeShzb3J0T3B0aW9ucy5maWVsZCwgc29ydE9wdGlvbnMucnVsZSBhcyBmaXJlYmFzZS5maXJlc3RvcmUuT3JkZXJCeURpcmVjdGlvbilcbiAgICAgICAgICAuZW5kQmVmb3JlKHRoaXMuY3VycmVudFBhZ2VGaWxtcz8uZG9jc1swXSlcbiAgICAgICAgICAubGltaXRUb0xhc3QoREVGQVVMVF9QQUdFX1NJWkUpXG4gICAgICAgICAgLmdldCgpXG4gICAgICAgIGlmIChwcmV2UGFnZUZpbG1zLnNpemUgIT09IDApIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRmlsbXMgPSBwcmV2UGFnZUZpbG1zO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBOYXZpZ2F0aW9uLk5leHRQYWdlOlxuICAgICAgICBjb25zdCBuZXh0UGFnZUZpbG1zIDogZmlyZWJhc2UuZmlyZXN0b3JlLlF1ZXJ5U25hcHNob3QgPSBhd2FpdCBwYWdlRmlsbXNcbiAgICAgICAgICAub3JkZXJCeShzb3J0T3B0aW9ucy5maWVsZCwgc29ydE9wdGlvbnMucnVsZSBhcyBmaXJlYmFzZS5maXJlc3RvcmUuT3JkZXJCeURpcmVjdGlvbilcbiAgICAgICAgICAuc3RhcnRBZnRlcih0aGlzLmN1cnJlbnRQYWdlRmlsbXM/LmRvY3NbdGhpcy5jdXJyZW50UGFnZUZpbG1zLnNpemUgLSAxXSlcbiAgICAgICAgICAubGltaXQoREVGQVVMVF9QQUdFX1NJWkUpXG4gICAgICAgICAgLmdldCgpXG4gICAgICAgIGlmIChuZXh0UGFnZUZpbG1zLnNpemUgIT09IDApIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlRmlsbXMgPSBuZXh0UGFnZUZpbG1zO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZUZpbG1zID0gYXdhaXQgcGFnZUZpbG1zXG4gICAgICAgICAgLm9yZGVyQnkoc29ydE9wdGlvbnMuZmllbGQsIHNvcnRPcHRpb25zLnJ1bGUgYXMgZmlyZWJhc2UuZmlyZXN0b3JlLk9yZGVyQnlEaXJlY3Rpb24pXG4gICAgICAgICAgLmxpbWl0KERFRkFVTFRfUEFHRV9TSVpFKVxuICAgICAgICAgIC5nZXQoKTtcblxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5leHRyYWN0RmlsbXNEYXRhKDxmaXJlYmFzZS5maXJlc3RvcmUuUXVlcnlTbmFwc2hvdD50aGlzLmN1cnJlbnRQYWdlRmlsbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3RzIGZpbG1zIGRhdGEgZnJvbSBkb2NzIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZmlsbXMsIEZpbG1zIG9iamVjdCByZWNlaXZlZCBmcm9tIGRiLlxuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheTxGaWxtPn0gRmlsbXMgZGF0YSBhcnJheS5cbiAgICovXG4gIGV4dHJhY3RGaWxtc0RhdGEoZmlsbXMgOiBmaXJlYmFzZS5maXJlc3RvcmUuUXVlcnlTbmFwc2hvdCkgOiBBcnJheTxGaWxtRHRvPiB7XG4gICAgcmV0dXJuIGZpbG1zLmRvY3MubWFwKGRvYyA9PiBkb2MuZGF0YSgpLmZpZWxkcyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvbmUgZmlsbSBieSBpZC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRGaWxtSWQsIEZpbG0gaWQuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8Kj59IFByb21pc2Ugd2l0aCBmaWxtIGRhdGEuXG4gICAqL1xuICBhc3luYyBnZXRTaW5nbGVGaWxtKGN1cnJlbnRGaWxtSWQgOiBudW1iZXIpIDogUHJvbWlzZTxGaWxtRHRvPiB7XG4gICAgbGV0IGZpbG0gPSBhd2FpdCBmaXJlYmFzZUFwcC5maXJlc3RvcmUoKS5jb2xsZWN0aW9uKEZJTE1TX0NPTExFQ1RJT04pXG4gICAgICAud2hlcmUoU2VhcmNoT3B0aW9ucy5GaWxtRXBpc29kZUZpZWxkLCAnPT0nLCBjdXJyZW50RmlsbUlkKVxuICAgICAgLmdldCgpO1xuXG4gICAgcmV0dXJuIGZpbG0uZG9jc1swXS5kYXRhKCkuZmllbGRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYXJyYXkgb2YgbmFtZXMgb2YgcmVsYXRlZCBlbnRpdHkgaXRlbXMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRpdHlDb2xsZWN0aW9uTmFtZSwgTmFtZSBvZiByZWxhdGVkIGVudGl0eSAoY29sbGVjdGlvbiBpbiBkYikuXG4gICAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0gcmVsYXRlZEVudGl0eUlkcywgQXJyYXkgb2YgcmVsYXRlZCBlbnRpdHkgaXRlbXMgaWRzLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPCpbXT59IFByb21pc2Ugd2l0aCByZWxhdGVkIGVudGl0eSBpdGVtcyBhcnJheS5cbiAgICovXG4gIGFzeW5jIGdldFJlbGF0ZWRFbnRpdHlJdGVtcyhlbnRpdHlDb2xsZWN0aW9uTmFtZSA6IHN0cmluZywgcmVsYXRlZEVudGl0eUlkcyA6IEFycmF5PG51bWJlcj4pIDogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gICAgY29uc3QgaWRzQXJyYXkgOiBBcnJheTxBcnJheTxudW1iZXI+PiA9IFtdO1xuICAgIGxldCByZWxhdGVkRW50aXR5QXJyIDogQXJyYXk8ZmlyZWJhc2UuZmlyZXN0b3JlLkRvY3VtZW50U25hcHNob3Q+ID0gW107XG5cbiAgICAvL1NwbGl0dGluZyB0aGUgYXJyYXksIHNpbmNlIGZpcmViYXNlIGRvZXMgbm90IGFsbG93IGFycmF5cyBsb25nZXIgdGhhbiAxMCBpbiB3aGVyZSAnaW4nXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWxhdGVkRW50aXR5SWRzLmxlbmd0aDsgaSArPSBERUZBVUxUX0pPSU5fQVJSQVlfU0laRSkge1xuICAgICAgaWRzQXJyYXkucHVzaChyZWxhdGVkRW50aXR5SWRzLnNsaWNlKGksIGkrIERFRkFVTFRfSk9JTl9BUlJBWV9TSVpFKSk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBhcnJheSBvZiBpZHNBcnJheSkge1xuICAgICAgbGV0IHRtcEFyciA9IGF3YWl0IGZpcmViYXNlQXBwLmZpcmVzdG9yZSgpLmNvbGxlY3Rpb24oZW50aXR5Q29sbGVjdGlvbk5hbWUpXG4gICAgICAgIC53aGVyZSgncGsnLCAnaW4nLCBhcnJheSlcbiAgICAgICAgLmdldCgpO1xuICAgICAgcmVsYXRlZEVudGl0eUFyciA9IHJlbGF0ZWRFbnRpdHlBcnIuY29uY2F0KHRtcEFyci5kb2NzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVsYXRlZEVudGl0eUFyci5tYXAoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS5kYXRhKCk/LmZpZWxkcy5uYW1lO1xuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEZpbG1TZXJ2aWNlKCk7IiwiaW1wb3J0IGZpcmViYXNlIGZyb20gJ2ZpcmViYXNlJztcbmltcG9ydCB7ZmlyZWJhc2VDb25maWd9IGZyb20gJy4vY29uZmlnJztcblxuY29uc3QgZmlyZWJhc2VBcHAgPSBmaXJlYmFzZS5pbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcbmV4cG9ydCBkZWZhdWx0IGZpcmViYXNlQXBwOyIsImltcG9ydCB7UGF0aHN9IGZyb20gJy4vdmFsdWVzL3ZhbHVlcyc7XG5cbi8qKlxuICogRnVuY3Rpb24gZGV0ZXJtaW5lcyB3aGljaCBibG9jayB3aWxsIGJlIHNob3duIG9uIGEgbWFpbiBwYWdlLCBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgdXNlciBpcyBhdXRoZW50aWNhdGVkIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxEaXZFbGVtZW50fSBhdXRoQmxvY2ssIEJsb2NrIHRoYXQgd2lsbCBiZSBzaG93biBpZiB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQuXG4gKiBAcGFyYW0ge0hUTUxEaXZFbGVtZW50fSBub0F1dGhCbG9jaywgQmxvY2sgdGhhdCB3aWxsIGJlIHNob3duIGlmIHVzZXIgaXMgbm90IGF1dGhlbnRpY2F0ZWQuXG4gKiBAcGFyYW0ge0hUTUxTcGFuRWxlbWVudH0gdXNlcm5hbWUsIFNwYW4gZm9yIHVzZXJuYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhdXRoVWlNYWluUGFnZShhdXRoQmxvY2sgOiBIVE1MRGl2RWxlbWVudCwgbm9BdXRoQmxvY2sgOiBIVE1MRGl2RWxlbWVudCwgdXNlcm5hbWUgOiBIVE1MU3BhbkVsZW1lbnQpIDogdm9pZCB7XG4gIGNvbnN0IGlzQXV0aCAgPSBCb29sZWFuKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpKTtcbiAgbm9BdXRoQmxvY2suY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJywgaXNBdXRoKTtcbiAgYXV0aEJsb2NrLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicsICFpc0F1dGgpO1xuXG4gIHVzZXJuYW1lLmlubmVySFRNTCA9IFN0cmluZyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcm5hbWUnKSk7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gY2hlY2tzIGFjY2VzcyB0byB0aGUgZmlsbSBwYWdlLiBJZiB1c2VyIGlzIG5vdCBhdXRoZW50aWNhdGVkLCBpdCB3aWxsIHJlZGlyZWN0IHRvIGxvZ2luIHBhZ2UuXG4gKlxuICogQHBhcmFtIHtIVE1MU3BhbkVsZW1lbnR9IHVzZXJuYW1lLCBTcGFuIGZvciB1c2VybmFtZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGF1dGhVaUZpbG1QYWdlKHVzZXJuYW1lIDogSFRNTFNwYW5FbGVtZW50KSA6IHZvaWQge1xuICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBQYXRocy5Mb2dpblBhZ2VQYXRoO1xuICB9IGVsc2Uge1xuICAgIHVzZXJuYW1lLmlubmVySFRNTCA9IFN0cmluZyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcm5hbWUnKSk7XG4gIH1cbn0iLCJpbXBvcnQgZmlsbVNlcnZpY2UgZnJvbSAnLi4vLi4vZmlyZWJhc2UvZmlsbVNlcnZpY2UnO1xuaW1wb3J0IHtzaWduT3V0fSBmcm9tICcuLi8uLi9maXJlYmFzZS9hdXRoJztcbmltcG9ydCB7YXV0aFVpRmlsbVBhZ2V9IGZyb20gJy4uL2F1dGhVaSc7XG5pbXBvcnQgRmlsbUR0byBmcm9tIFwiLi4vLi4vRFRPcy9maWxtRHRvXCI7XG5cbmNvbnN0IHBhcmFtcyA6IFVSTFNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG5jb25zdCBjdXJyZW50RmlsbUlkIDogbnVtYmVyID0gTnVtYmVyKHBhcmFtcy5nZXQoJ2lkJykpO1xuXG5jb25zdCBjdXJyZW50RmlsbSA9IGZpbG1TZXJ2aWNlLmdldFNpbmdsZUZpbG0oY3VycmVudEZpbG1JZCk7XG5jb25zdCBlbnRpdGllc1NlbGVjdG9yPSA8SFRNTFNlbGVjdEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbG0tcmVsYXRlZC1lbnRpdGllcy1zZWxlY3RvcicpO1xuY29uc3QgcmVsYXRlZEVudGl0eUxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsbS1yZWxhdGVkLWVudGl0eS1saXN0Jyk7XG5jb25zdCBzaWduT3V0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZ24tb3V0LWJ1dHRvbicpO1xuXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xuICBhdXRoVWlGaWxtUGFnZSg8SFRNTFNwYW5FbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VybmFtZScpKTtcbiAgc2hvd0ZpbG1JbmZvKCk7XG59O1xuXG5zaWduT3V0QnV0dG9uPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICBzaWduT3V0KTtcblxuLyoqXG4gKiBTaG93aW5nIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IGZpbG0uXG4gKi9cbmZ1bmN0aW9uIHNob3dGaWxtSW5mbygpIDogdm9pZCB7XG4gIGN1cnJlbnRGaWxtXG4gICAgLnRoZW4oY3VycmVudEZpbG1EYXRhPT4ge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbG0tdGl0bGUnKSEuaW5uZXJIVE1MID0gYCR7Y3VycmVudEZpbG1EYXRhLnRpdGxlfSAoRXBpc29kZSAke2N1cnJlbnRGaWxtSWR9KWA7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsbS1kaXJlY3RvcicpIS5pbm5lckhUTUwgPSBgRGlyZWN0b3I6ICR7Y3VycmVudEZpbG1EYXRhLmRpcmVjdG9yfWA7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsbS1wcm9kdWNlcicpIS5pbm5lckhUTUwgPSBgUHJvZHVjZXI6ICR7Y3VycmVudEZpbG1EYXRhLnByb2R1Y2VyfWA7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsbS1yZWxlYXNlLWRhdGUnKSEuaW5uZXJIVE1MID0gYFJlbGVhc2UgRGF0ZTogJHtjdXJyZW50RmlsbURhdGEucmVsZWFzZV9kYXRlfWA7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsbS1vcGVuaW5nLWNyYXdsJykhLmlubmVySFRNTCA9IGBPcGVuaW5nIGNyYXdsOiAke2N1cnJlbnRGaWxtRGF0YS5vcGVuaW5nX2NyYXdsfWA7XG5cbiAgICAgIGNvbnN0IHNlbGVjdGVkQ29sbGVjdGlvbk5hbWUgOiBzdHJpbmcgPSAoZW50aXRpZXNTZWxlY3RvcltlbnRpdGllc1NlbGVjdG9yLnNlbGVjdGVkSW5kZXhdIGFzIEhUTUxPcHRpb25FbGVtZW50KS52YWx1ZTtcblxuICAgICAgc2hvd1JlbGF0ZWRFbnRpdHlMaXN0KHNlbGVjdGVkQ29sbGVjdGlvbk5hbWUpO1xuICAgIH0pO1xufVxuXG5lbnRpdGllc1NlbGVjdG9yPy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gIGNvbnN0IHNlbGVjdGVkQ29sbGVjdGlvbk5hbWUgPSAoZW50aXRpZXNTZWxlY3RvcltlbnRpdGllc1NlbGVjdG9yLnNlbGVjdGVkSW5kZXhdIGFzIEhUTUxPcHRpb25FbGVtZW50KS52YWx1ZTtcbiAgc2hvd1JlbGF0ZWRFbnRpdHlMaXN0KHNlbGVjdGVkQ29sbGVjdGlvbk5hbWUpO1xufSk7XG5cbi8qKlxuICogU2hvd2luZyB0aGUgbGlzdCBvZiBhIHNlbGVjdGVkIHJlbGF0ZWQgZW50aXR5IGl0ZW1zLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RlZENvbGxlY3Rpb25OYW1lLCBOYW1lIG9mIHRoZSBzZWxlY3RlZCByZWxhdGVkIGVudGl0eSAoY29sbGVjdGlvbiBpbiBkYikuXG4gKi9cbmZ1bmN0aW9uIHNob3dSZWxhdGVkRW50aXR5TGlzdChzZWxlY3RlZENvbGxlY3Rpb25OYW1lIDogc3RyaW5nKSA6IHZvaWQge1xuICB3aGlsZSAocmVsYXRlZEVudGl0eUxpc3Q/LmZpcnN0Q2hpbGQpIHtcbiAgICAvLyBUaGlzIHdpbGwgcmVtb3ZlIGFsbCBjaGlsZHJlbiB3aXRoaW4gdGJvZHkgd2hpY2ggYXJlIDx0cj4gZWxlbWVudHNcbiAgICByZWxhdGVkRW50aXR5TGlzdC5yZW1vdmVDaGlsZChyZWxhdGVkRW50aXR5TGlzdC5maXJzdENoaWxkKTtcbiAgfVxuXG4gIGN1cnJlbnRGaWxtXG4gICAgLnRoZW4oY3VycmVudEZpbG1EYXRhID0+IHtcbiAgICAgICAgZmlsbVNlcnZpY2UuZ2V0UmVsYXRlZEVudGl0eUl0ZW1zKHNlbGVjdGVkQ29sbGVjdGlvbk5hbWUgPT09ICdjaGFyYWN0ZXJzJ1xuICAgICAgICA/ICdwZW9wbGUnXG4gICAgICAgIDogc2VsZWN0ZWRDb2xsZWN0aW9uTmFtZSxcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGN1cnJlbnRGaWxtRGF0YVtzZWxlY3RlZENvbGxlY3Rpb25OYW1lXSlcbiAgICAgICAgLnRoZW4ocmVsYXRlZEVudGl0eVBheWxvYWQgPT4ge1xuICAgICAgICAgIHJlbGF0ZWRFbnRpdHlQYXlsb2FkLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaXN0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgICAgbGlzdEVsLmlubmVySFRNTCA9IGl0ZW07XG4gICAgICAgICAgICByZWxhdGVkRW50aXR5TGlzdD8uYXBwZW5kQ2hpbGQobGlzdEVsKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxufVxuIiwiZXhwb3J0IGNvbnN0IERFRkFVTFRfUEFHRV9TSVpFID0gMjtcbmV4cG9ydCBjb25zdCBGSUxNU19DT0xMRUNUSU9OID0gJ2ZpbG1zJztcbmV4cG9ydCBjb25zdCBERUZBVUxUX0pPSU5fQVJSQVlfU0laRSA9IDEwO1xuZXhwb3J0IGNvbnN0IERFQk9VTkNFX0RFTEFZX1RJTUUgPSA1MDA7XG5cbmV4cG9ydCBjb25zdCBOYXZpZ2F0aW9uID0ge1xuICBOZXh0UGFnZTogJ25leHQnLFxuICBQcmV2UGFnZTogJ3ByZXYnLFxufTtcblxuZXhwb3J0IGNvbnN0IFBhdGhzID0ge1xuICBNYWluUGFnZVBhdGg6ICdtYWluLmh0bWwnLFxuICBGaWxtUGFnZVBhdGg6ICdmaWxtLmh0bWwnLFxuICBMb2dpblBhZ2VQYXRoOiAnbG9naW4uaHRtbCcsXG59O1xuXG5leHBvcnQgY29uc3QgU29ydE9wdGlvbnMgPSB7XG4gIERlZmF1bHRPcmRlcjogJ3BrJyxcbiAgQXNjOiAnYXNjJyxcbiAgRGVzYzogJ2Rlc2MnLFxuICBTb3J0aW5nRmllbGRzOiAnZmllbGRzLicsXG59O1xuXG5leHBvcnQgY29uc3QgU2VhcmNoT3B0aW9ucyA9IHtcbiAgRGVmYXVsdFNlYXJjaEZpZWxkOiAnZmllbGRzLnRpdGxlJyxcbiAgRmlsbUVwaXNvZGVGaWVsZDogJ2ZpZWxkcy5lcGlzb2RlX2lkJyxcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0cmVzdWx0ID0gZm4oKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18uaG1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUgPSBPYmplY3QuY3JlYXRlKG1vZHVsZSk7XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgJ2V4cG9ydHMnLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRzZXQ6ICgpID0+IHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRVMgTW9kdWxlcyBtYXkgbm90IGFzc2lnbiBtb2R1bGUuZXhwb3J0cyBvciBleHBvcnRzLiosIFVzZSBFU00gZXhwb3J0IHN5bnRheCwgaW5zdGVhZDogJyArIG1vZHVsZS5pZCk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcImZpbG1cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0fVxuXHR9XG5cdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzd2ZpbG1zXCJdID0gc2VsZltcIndlYnBhY2tDaHVua3N3ZmlsbXNcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX2ZpcmViYXNlX2Rpc3RfaW5kZXhfZXNtX2pzXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2pzL2ZpbG0vZmlsbS50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==