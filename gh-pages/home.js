/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/home.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/home.js":
/*!*********************!*\
  !*** ./src/home.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar BridePie = function BridePie() {\n    _classCallCheck(this, BridePie);\n\n    var width = 540;\n    var height = 540;\n    var radius = Math.min(width, height) / 2;\n\n    var svg = d3.select(\"#graph\").append(\"svg\").attr(\"width\", width).attr(\"height\", height).append(\"g\").attr(\"transform\", \"translate(\" + width / 2 + \", \" + height / 2 + \")\");\n\n    var color = d3.scaleOrdinal([\"#66c2a5\", \"#fc8d62\", \"#8da0cb\", \"#e78ac3\", \"#a6d854\", \"#ffd92f\"]);\n\n    var pie = d3.pie().value(function (d) {\n        return d.count;\n    }).sort(null);\n\n    var arc = d3.arc().innerRadius(0).outerRadius(radius);\n\n    function type(d) {\n        d.apples = Number(d.apples);\n        d.oranges = Number(d.oranges);\n        return d;\n    }\n\n    function arcTween(a) {\n        var i = d3.interpolate(this._current, a);\n        this._current = i(1);\n        return function (t) {\n            return arc(i(t));\n        };\n    }\n    d3.json(\"./assets/data/data.json\").then(function (info) {\n\n        // Join new data\n        var path = svg.selectAll(\"path\").data(pie(info.data));\n\n        // Update existing arcs\n        path.transition().duration(200).attrTween(\"d\", arcTween);\n\n        // Enter new arcs\n        path.enter().append(\"path\").attr(\"fill\", function (d, i) {\n            return color(i);\n        }).attr(\"d\", arc).attr(\"stroke\", \"white\").attr(\"stroke-width\", \"6px\").each(function (d) {\n            this._current = d;\n        });\n    });\n};\n\nvar pie = new BridePie();\n\n//# sourceURL=webpack:///./src/home.js?");

/***/ })

/******/ });