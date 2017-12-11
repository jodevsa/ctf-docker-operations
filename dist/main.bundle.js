#!/usr/bin/env node
module.exports =
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(1);\nmodule.exports = __webpack_require__(2);\n\n\n//////////////////\n// WEBPACK FOOTER\n// multi babel-polyfill ./lib/main.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///multi_babel-polyfill_./lib/main.js?");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

eval("module.exports = require(\"babel-polyfill\");\n\n//////////////////\n// WEBPACK FOOTER\n// external \"babel-polyfill\"\n// module id = 1\n// module chunks = 0\n\n//# sourceURL=webpack:///external_%22babel-polyfill%22?");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _cliTable = __webpack_require__(4);\n\nvar _cliTable2 = _interopRequireDefault(_cliTable);\n\nvar _dockerode = __webpack_require__(3);\n\nvar _dockerode2 = _interopRequireDefault(_dockerode);\n\nvar _fuzzy = __webpack_require__(5);\n\nvar _fuzzy2 = _interopRequireDefault(_fuzzy);\n\nvar _inquirer = __webpack_require__(6);\n\nvar _inquirer2 = _interopRequireDefault(_inquirer);\n\nvar _loader = __webpack_require__(7);\n\nvar _loader2 = _interopRequireDefault(_loader);\n\nvar _util = __webpack_require__(9);\n\nvar _util2 = _interopRequireDefault(_util);\n\nvar _chalk = __webpack_require__(10);\n\nvar _chalk2 = _interopRequireDefault(_chalk);\n\nvar _figlet = __webpack_require__(11);\n\nvar _figlet2 = _interopRequireDefault(_figlet);\n\nvar _container = __webpack_require__(12);\n\nvar _container2 = _interopRequireDefault(_container);\n\nvar _singleLineLog = __webpack_require__(13);\n\nvar _singleLineLog2 = _interopRequireDefault(_singleLineLog);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconst docker = new _dockerode2.default({ Promise: Promise, socketPath: '/var/run/docker.sock' });\n\nconst stdin = process.openStdin();\n\nconst drawer = _util2.default.promisify(_figlet2.default.text);\n\nconst images = [];\nconst vorpal = __webpack_require__(14)();\n\nconst log = _singleLineLog2.default.stdout;\nlet containers = [];\n\n////////////////////////////////////////////////////////////////////////\nasync function main() {\n  console.log(_chalk2.default.cyan((await drawer(\"CTF Operations\"))));\n  vorpal.command('list containers', 'Outputs \"bar\".').action(async function (args, next) {\n    const images = await docker.listImages();\n    images.map(element => {\n      this.log(element.RepoTags.join('.'));\n    });\n\n    next();\n  });\n  vorpal.command(\"hang\", 'stop all containers').action(async function (args, next) {\n    docker.listContainers(function (err, containers) {\n      containers.forEach(function (containerInfo) {\n        docker.getContainer(containerInfo.Id).stop(next);\n      });\n    });\n  });\n  ///////// clear ////\n  vorpal.command('clear').action(async (args, cb) => {\n    process.stdout.write(\"\\u001B[2J\\u001B[0;0f\");\n    console.log(_chalk2.default.cyan((await drawer(\"CTF Operations\"))));\n    cb();\n  });\n  //////////////////////////////\n  vorpal.command(\"list\", 'list running container').action(async function (args, next) {\n\n    const table = new _cliTable2.default({\n      head: ['Challenge', 'PORT', 'Running', 'Reset interval', 'Auto Restart', 'last Restart']\n    });\n    for (let container of containers) {\n      const time = new Date();\n      const timeDiff = String(Math.ceil((time - container.lastRestart) / 1000)) + \" seconds\";\n      const lastRestart = String(container.restartInterval / 1000) + \" seconds\";\n      table.push([container.name, container.port, container.running, lastRestart, container.autoRestart, timeDiff]);\n    }\n    console.log(table.toString());\n    next();\n  });\n\n  vorpal.command(\"live\", 'list running container').action(async function (args, next) {\n    process.stdout.write(\"\\u001B[2J\\u001B[0;0f\");\n    console.log(_chalk2.default.cyan((await drawer(\"CTF Operations\"))));\n    let interval = setInterval(async () => {\n      const table = new _cliTable2.default({\n        head: ['Challenge', 'PORT', 'Running', 'Reset interval', 'Auto Restart', 'last Restart']\n      });\n      for (let container of containers) {\n        const time = new Date();\n        const timeDiff = String(Math.ceil((time - container.lastRestart) / 1000)) + \" seconds\";\n        const lastRestart = String(container.restartInterval / 1000) + \" seconds\";\n        table.push([container.name, container.port, container.running, lastRestart, container.autoRestart, timeDiff]);\n      }\n      log(table.toString());\n    }, 2000);\n    stdin.once('keypress', async (chunk, key) => {\n      clearInterval(interval);\n      log.clear();\n      process.stdout.write(\"\\u001B[2J\\u001B[0;0f\");\n      console.log(_chalk2.default.cyan((await drawer(\"CTF Operations\"))));\n      next();\n    });\n  });\n\n  vorpal.command(\"stop [strings...]\", 'adding an image to restarter').action(async (args, next) => {\n    const containerName = String(args.strings[0]);\n    for (let container of containers) {\n      if (container.name === containerName) {\n        await container.stop({ StopTimeout: 2 });\n      }\n    }\n  }).autocompletion(async function (text, iteration, cb) {\n    const results = _fuzzy2.default.filter(text || '', containers.map(function (value, index) {\n      return value.name;\n    }));\n    if (results.length == 1) {\n      cb(void 0, \"stop \" + results.map(function (val) {\n        return val.original;\n      }).join(' '));\n    } else {\n      cb(void 0, results.map(function (val) {\n        return val.original;\n      }));\n    }\n  });\n  ///\n\n  vorpal.command(\"interval [strings...]\", 'adding an image to restarter').action(async (args, next) => {\n    const containerName = String(args.strings[0]);\n    const newInterval = (args.strings[1] || 1) * 1000;\n    for (let container of containers) {\n      if (container.name === containerName) {\n        container.restartInterval = newInterval;\n      }\n    }\n  }).autocompletion(async function (text, iteration, cb) {\n    const results = _fuzzy2.default.filter(text || '', containers.map(function (value, index) {\n      return value.name;\n    }));\n    if (results.length == 1) {\n      cb(void 0, \"interval \" + results.map(function (val) {\n        return val.original;\n      }).join(' '));\n    } else {\n      cb(void 0, results.map(function (val) {\n        return val.original;\n      }));\n    }\n  });\n  vorpal.command(\"start [strings...]\", 'adding an image to restarter').action(async (args, next) => {\n    const containerName = String(args.strings[0]);\n    for (let container of containers) {\n      if (container.name === containerName) {\n        container.start();\n      }\n    }\n  }).autocompletion(async function (text, iteration, cb) {\n    const results = _fuzzy2.default.filter(text || '', containers.map(function (value, index) {\n      return value.name;\n    }));\n    if (results.length == 1) {\n      cb(void 0, \"start \" + results.map(function (val) {\n        return val.original;\n      }).join(' '));\n    } else {\n      cb(void 0, results.map(function (val) {\n        return val.original;\n      }));\n    }\n  });\n  vorpal.command(\"add [strings...]\", 'adding an image to restarter').action(async function (args, next) {\n    const port = String(args.strings[1]);\n    const timeout = (args.strings[2] || 1) * 1000;\n    const image = args.strings[0];\n    let container = new _container2.default(image, port, timeout);\n    container.start();\n    containers.push(container);\n    next();\n  }).autocompletion(async function (text, iteration, cb) {\n    const images = await docker.listImages();\n    const results = _fuzzy2.default.filter(text || '', images.map(function (value, index) {\n      return value['RepoTags'].join('.');\n    }));\n    if (results.length == 1) {\n      cb(void 0, \"add \" + results.map(function (val) {\n        return val.original;\n      }).join(' '));\n    } else {\n      cb(void 0, results.map(function (val) {\n        return val.original;\n      }));\n    }\n  });\n\n  vorpal.delimiter(_chalk2.default.blue('CTF$')).show();\n}\nmain();\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/main.js\n// module id = 2\n// module chunks = 0\n\n//# sourceURL=webpack:///./lib/main.js?");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

eval("module.exports = require(\"dockerode\");\n\n//////////////////\n// WEBPACK FOOTER\n// external \"dockerode\"\n// module id = 3\n// module chunks = 0\n\n//# sourceURL=webpack:///external_%22dockerode%22?");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

eval("module.exports = require(\"cli-table\");\n\n//////////////////\n// WEBPACK FOOTER\n// external \"cli-table\"\n// module id = 4\n// module chunks = 0\n\n//# sourceURL=webpack:///external_%22cli-table%22?");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

eval("module.exports = require(\"fuzzy\");\n\n//////////////////\n// WEBPACK FOOTER\n// external \"fuzzy\"\n// module id = 5\n// module chunks = 0\n\n//# sourceURL=webpack:///external_%22fuzzy%22?");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

eval("module.exports = require(\"inquirer\");\n\n//////////////////\n// WEBPACK FOOTER\n// external \"inquirer\"\n// module id = 6\n// module chunks = 0\n\n//# sourceURL=webpack:///external_%22inquirer%22?");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _bottomBar = __webpack_require__(8);\n\nvar _bottomBar2 = _interopRequireDefault(_bottomBar);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nclass Loader {\n  constructor() {\n    this.ui = '';\n    this.word = '';\n    this.loader = ['/', '|', '\\\\', '-'];\n    this.i = 3;\n    this.running = false;\n  }\n  start(word) {\n    this.running = true;\n    if (word) {\n      this.word = ' ' + word;\n    }\n    this.ui = new _bottomBar2.default({ bottomBar: this.loader[this.i % 4] + this.word });\n    this.timer = setInterval(() => {\n      this.ui.updateBottomBar(this.loader[this.i++ % 4] + this.word);\n    }, 100);\n  }\n  stop(msg) {\n    const output = msg ? msg + '\\n' : '';\n    if (this.running) {\n      this.running = false;\n      clearInterval(this.timer);\n      this.ui.updateBottomBar(this.loader[3] + this.word);\n      this.ui.updateBottomBar(output);\n      this.ui.close();\n    }\n  }\n};\n\nexports.default = Loader;\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/loader.js\n// module id = 7\n// module chunks = 0\n\n//# sourceURL=webpack:///./lib/loader.js?");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

eval("module.exports = require(\"inquirer/lib/ui/bottom-bar\");\n\n//////////////////\n// WEBPACK FOOTER\n// external \"inquirer/lib/ui/bottom-bar\"\n// module id = 8\n// module chunks = 0\n\n//# sourceURL=webpack:///external_%22inquirer/lib/ui/bottom-bar%22?");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");\n\n//////////////////\n// WEBPACK FOOTER\n// external \"util\"\n// module id = 9\n// module chunks = 0\n\n//# sourceURL=webpack:///external_%22util%22?");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

eval("module.exports = require(\"chalk\");\n\n//////////////////\n// WEBPACK FOOTER\n// external \"chalk\"\n// module id = 10\n// module chunks = 0\n\n//# sourceURL=webpack:///external_%22chalk%22?");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

eval("module.exports = require(\"figlet\");\n\n//////////////////\n// WEBPACK FOOTER\n// external \"figlet\"\n// module id = 11\n// module chunks = 0\n\n//# sourceURL=webpack:///external_%22figlet%22?");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _dockerode = __webpack_require__(3);\n\nvar _dockerode2 = _interopRequireDefault(_dockerode);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconst docker = new _dockerode2.default({ Promise: Promise, socketPath: '/var/run/docker.sock' });\n\nfunction sleep(time) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      resolve();\n    }, time);\n  });\n}\nclass ctfContainer {\n  constructor(name, port, restartInterval) {\n    this.running = false;\n    this.autoRestart = true;\n    this.name = name;\n    this.port = String(port);\n    this.lastRestart = new Date();\n    this.restartInterval = restartInterval;\n  }\n  async start() {\n    //  console.log(\"started\")\n    this._container = await docker.createContainer({\n      PortBindings: {\n        [this.port + \"/tcp\"]: [{\n          \"HostPort\": this.port,\n          \"HostIP\": \"0.0.0.0\"\n        }]\n      },\n      Image: this.name\n    });\n    this.running = true;\n    this.autoRestart = true;\n    await this._container.start();\n    await sleep(this.restartInterval);\n    //  console.log(\"timeout\")\n    if (this.autoRestart) {\n      await this.restart();\n    }\n  }\n  stopRestart() {\n    this.autoRestart = false;\n  }\n  async restart() {\n\n    if (this.running === false) {\n      return reject(\"not even running !\");\n    }\n    //  console.log(\"in restart\")\n    await this.stop();\n    this.lastRestart = new Date();\n    //  console.log(\"stopped\");\n    this.start();\n  }\n  forceRestart() {}\n  async changeNextRestartInterval(interval) {\n    await this.stop();\n    this.restartInterval = interval;\n    this.start();\n  }\n  async stop() {\n    if (!this.running) {\n      return;\n    }\n    ///    console.log(\"trying to stop!!!...\")\n    this.running = false;\n    this.autoRestart = false;\n    //  console.log(\"trying to stop!!!...\")\n    await this._container.kill();\n    //console.log(\"stopped 62\")\n    await this._container.remove();\n    ///    console.log(\"removed 64\")\n  }\n\n}\n\nexports.default = ctfContainer;\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/container.js\n// module id = 12\n// module chunks = 0\n\n//# sourceURL=webpack:///./lib/container.js?");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

eval("module.exports = require(\"single-line-log\");\n\n//////////////////\n// WEBPACK FOOTER\n// external \"single-line-log\"\n// module id = 13\n// module chunks = 0\n\n//# sourceURL=webpack:///external_%22single-line-log%22?");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

eval("module.exports = require(\"vorpal\");\n\n//////////////////\n// WEBPACK FOOTER\n// external \"vorpal\"\n// module id = 14\n// module chunks = 0\n\n//# sourceURL=webpack:///external_%22vorpal%22?");

/***/ })
/******/ ]);