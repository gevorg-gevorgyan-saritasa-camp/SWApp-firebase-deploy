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

/***/ "./src/js/login/login.ts":
/*!*******************************!*\
  !*** ./src/js/login/login.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _firebase_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../firebase/auth */ "./src/firebase/auth.ts");

const signInButton = document.getElementById('sign-in-google-button');
signInButton?.addEventListener('click', _firebase_auth__WEBPACK_IMPORTED_MODULE_0__.singInWithGoogle);


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
/******/ 			"login": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_firebase_dist_index_esm_js"], () => (__webpack_require__("./src/js/login/login.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zd2ZpbG1zLy4vc3JjL2ZpcmViYXNlL2F1dGgudHMiLCJ3ZWJwYWNrOi8vc3dmaWxtcy8uL3NyYy9maXJlYmFzZS9jb25maWcudHMiLCJ3ZWJwYWNrOi8vc3dmaWxtcy8uL3NyYy9maXJlYmFzZS9maXJlYmFzZS50cyIsIndlYnBhY2s6Ly9zd2ZpbG1zLy4vc3JjL2pzL2xvZ2luL2xvZ2luLnRzIiwid2VicGFjazovL3N3ZmlsbXMvLi9zcmMvanMvdmFsdWVzL3ZhbHVlcy50cyIsIndlYnBhY2s6Ly9zd2ZpbG1zL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9zd2ZpbG1zL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9zd2ZpbG1zL3dlYnBhY2svcnVudGltZS9oYXJtb255IG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vc3dmaWxtcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zd2ZpbG1zL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3N3ZmlsbXMvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUEwQztBQUNMO0FBQ0w7QUFFaEM7O0dBRUc7QUFDSSxTQUFTLGdCQUFnQjtJQUM5QixNQUFNLFFBQVEsR0FBRyxJQUFJLHFFQUFnQyxFQUFFLENB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VUFDQTs7VUFFQTtVQUNBOzs7OztXQzVCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLDhCQUE4Qix3Q0FBd0M7V0FDdEU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQkFBZ0IscUJBQXFCO1dBQ3JDO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFOzs7OztXQzFCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsZ0NBQWdDLFlBQVk7V0FDNUM7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBO1dBQ0EsQ0FBQyxJOzs7OztXQ1BEO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7V0FDQSxFOzs7OztXQ1ZBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0sb0JBQW9CO1dBQzFCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBLDRHOzs7OztVQzlDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImxvZ2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQYXRoc30gZnJvbSAnLi4vanMvdmFsdWVzL3ZhbHVlcyc7XG5pbXBvcnQgZmlyZWJhc2VBcHAgZnJvbSAnLi9maXJlYmFzZSc7XG5pbXBvcnQgZmlyZWJhc2UgZnJvbSBcImZpcmViYXNlXCI7XG5cbi8qKlxuICogTG9nIGluIHRvIGdvb2dsZSBhY2NvdW50IHZpYSBmaXJlYmFzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNpbmdJbldpdGhHb29nbGUoKSA6IHZvaWQge1xuICBjb25zdCBwcm92aWRlciA9IG5ldyBmaXJlYmFzZS5hdXRoLkdvb2dsZUF1dGhQcm92aWRlcigpO1xuXG4gIGZpcmViYXNlQXBwLmF1dGgoKVxuICAgIC5zaWduSW5XaXRoUG9wdXAocHJvdmlkZXIpXG4gICAgLnRoZW4ocmVzID0+IHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VybmFtZScsIFN0cmluZyhyZXMudXNlcj8uZGlzcGxheU5hbWUpKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIFN0cmluZygocmVzLmNyZWRlbnRpYWwgYXMgZmlyZWJhc2UuYXV0aC5PQXV0aENyZWRlbnRpYWwpLmlkVG9rZW4pKTtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gUGF0aHMuTWFpblBhZ2VQYXRoO1xuICAgIH0pXG4gICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBMb2cgb3V0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2lnbk91dCgpIDogdm9pZHtcbiAgZmlyZWJhc2VBcHAuYXV0aCgpXG4gICAgLnNpZ25PdXQoKVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0b2tlbicpO1xuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXJuYW1lJyk7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFBhdGhzLk1haW5QYWdlUGF0aDtcbiAgICB9KVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgfSk7XG59IiwiZXhwb3J0IGNvbnN0IGZpcmViYXNlQ29uZmlnID0ge1xuICBhcGlLZXk6ICdBSXphU3lBZG1uZndzMGZBdG9ueDlKaEZVOS1kaGZRYVpRV1k3NDgnLFxuICBhdXRoRG9tYWluOiAnc3dmaWxtcy1lYWMwNy5maXJlYmFzZWFwcC5jb20nLFxuICBwcm9qZWN0SWQ6ICdzd2ZpbG1zLWVhYzA3JyxcbiAgc3RvcmFnZUJ1Y2tldDogJ3N3ZmlsbXMtZWFjMDcuYXBwc3BvdC5jb20nLFxuICBtZXNzYWdpbmdTZW5kZXJJZDogJzU4NDY2ODkzNzIzMycsXG4gIGFwcElkOiAnMTo1ODQ2Njg5MzcyMzM6d2ViOjcwZjhjOTViZDQ2YTFmYjI0MjA1YjAnLFxuICBtZWFzdXJlbWVudElkOiAnRy1USzZTSDJGRFdCJyxcbn07IiwiaW1wb3J0IGZpcmViYXNlIGZyb20gJ2ZpcmViYXNlJztcbmltcG9ydCB7ZmlyZWJhc2VDb25maWd9IGZyb20gJy4vY29uZmlnJztcblxuY29uc3QgZmlyZWJhc2VBcHAgPSBmaXJlYmFzZS5pbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcbmV4cG9ydCBkZWZhdWx0IGZpcmViYXNlQXBwOyIsImltcG9ydCB7c2luZ0luV2l0aEdvb2dsZX0gZnJvbSAnLi4vLi4vZmlyZWJhc2UvYXV0aCc7XG5cbmNvbnN0IHNpZ25JbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWduLWluLWdvb2dsZS1idXR0b24nKTtcblxuc2lnbkluQnV0dG9uPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNpbmdJbldpdGhHb29nbGUpOyIsImV4cG9ydCBjb25zdCBERUZBVUxUX1BBR0VfU0laRSA9IDI7XG5leHBvcnQgY29uc3QgRklMTVNfQ09MTEVDVElPTiA9ICdmaWxtcyc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9KT0lOX0FSUkFZX1NJWkUgPSAxMDtcbmV4cG9ydCBjb25zdCBERUJPVU5DRV9ERUxBWV9USU1FID0gNTAwO1xuXG5leHBvcnQgY29uc3QgTmF2aWdhdGlvbiA9IHtcbiAgTmV4dFBhZ2U6ICduZXh0JyxcbiAgUHJldlBhZ2U6ICdwcmV2Jyxcbn07XG5cbmV4cG9ydCBjb25zdCBQYXRocyA9IHtcbiAgTWFpblBhZ2VQYXRoOiAnbWFpbi5odG1sJyxcbiAgRmlsbVBhZ2VQYXRoOiAnZmlsbS5odG1sJyxcbiAgTG9naW5QYWdlUGF0aDogJ2xvZ2luLmh0bWwnLFxufTtcblxuZXhwb3J0IGNvbnN0IFNvcnRPcHRpb25zID0ge1xuICBEZWZhdWx0T3JkZXI6ICdwaycsXG4gIEFzYzogJ2FzYycsXG4gIERlc2M6ICdkZXNjJyxcbiAgU29ydGluZ0ZpZWxkczogJ2ZpZWxkcy4nLFxufTtcblxuZXhwb3J0IGNvbnN0IFNlYXJjaE9wdGlvbnMgPSB7XG4gIERlZmF1bHRTZWFyY2hGaWVsZDogJ2ZpZWxkcy50aXRsZScsXG4gIEZpbG1FcGlzb2RlRmllbGQ6ICdmaWVsZHMuZXBpc29kZV9pZCcsXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHJlc3VsdCA9IGZuKCk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmhtZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlID0gT2JqZWN0LmNyZWF0ZShtb2R1bGUpO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsICdleHBvcnRzJywge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0c2V0OiAoKSA9PiB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VTIE1vZHVsZXMgbWF5IG5vdCBhc3NpZ24gbW9kdWxlLmV4cG9ydHMgb3IgZXhwb3J0cy4qLCBVc2UgRVNNIGV4cG9ydCBzeW50YXgsIGluc3RlYWQ6ICcgKyBtb2R1bGUuaWQpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJsb2dpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua3N3ZmlsbXNcIl0gPSBzZWxmW1wid2VicGFja0NodW5rc3dmaWxtc1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfZmlyZWJhc2VfZGlzdF9pbmRleF9lc21fanNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvanMvbG9naW4vbG9naW4udHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=