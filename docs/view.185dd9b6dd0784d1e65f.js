(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["view"],{
,

/***/ "./src/views/index.js":
/*!****************************!*\
  !*** ./src/views/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! ../styles/pageStyles.scss */ \"./src/styles/pageStyles.scss\");\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar hi = 'world';\nconsole.log(hi);\n\nvar BridePie = function BridePie() {\n    _classCallCheck(this, BridePie);\n\n    var width = 540;\n    var height = 540;\n    var radius = Math.min(width, height) / 2;\n\n    var svg = d3.select(\"#graph\").append(\"svg\").attr(\"width\", width).attr(\"height\", height).append(\"g\").attr(\"transform\", \"translate(\" + width / 2 + \", \" + height / 2 + \")\");\n\n    var color = d3.scaleOrdinal([\"#66c2a5\", \"#fc8d62\", \"#8da0cb\", \"#e78ac3\", \"#a6d854\", \"#ffd92f\"]);\n\n    var pie = d3.pie().value(function (d) {\n        return d.count;\n    }).sort(null);\n\n    var arc = d3.arc().innerRadius(0).outerRadius(radius);\n\n    var newarc = d3.arc().innerRadius(2 * radius / 3).outerRadius(radius);\n\n    function arcTween(a) {\n        var i = d3.interpolate(this._current, a);\n        this._current = i(1);\n        return function (t) {\n            return arc(i(t));\n        };\n    }\n\n    d3.json(\"./assets/data/data.json\").then(function (info) {\n        // Join new data\n        var groups = svg.selectAll('g').data(pie(info.data));\n\n        var path = svg.selectAll(\"path\").data(pie(info.data));\n\n        // Update existing arcs\n        groups.transition().duration(200).attrTween(\"d\", arcTween);\n\n        // Enter new arcs\n        groups.enter().append(\"g\").append(\"path\").attr(\"fill\", function (d, i) {\n            return color(i);\n        }).attr(\"d\", arc).attr(\"stroke\", \"white\").attr(\"stroke-width\", \"6px\")\n        //                    .append(\"text\")\n        //                    .attr(\"transform\", function (d) {\n        //                        return \"translate(\" + newarc.centroid(d) + \")\";\n        //                    })\n        //                    .attr(\"text-anchor\", \"middle\")\n        //                    .attr(\"fill\", \"white\")\n        //                    .text(function (d) {\n        //                        return d.data.label;\n        //                    })\n        .each(function (d) {\n            this._current = d;\n        });\n    });\n};\n\nvar pie = new BridePie();\n\n//# sourceURL=webpack:///./src/views/index.js?");

/***/ }),

/***/ 1:
/*!*************************************************************************************!*\
  !*** multi (webpack)-dev-server/client?https://localhost:8080 ./src/views/index.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! C:\\Users\\Brais\\Documents\\GitHub\\invisible\\node_modules\\webpack-dev-server\\client\\index.js?https://localhost:8080 */\"./node_modules/webpack-dev-server/client/index.js?https://localhost:8080\");\nmodule.exports = __webpack_require__(/*! ./src/views/index.js */\"./src/views/index.js\");\n\n\n//# sourceURL=webpack:///multi_(webpack)-dev-server/client?");

/***/ })

},[[1,"runtime","vendor~BaseStyles~view","BaseStyles~view"]]]);