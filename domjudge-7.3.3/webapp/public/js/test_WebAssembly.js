$(function() {
    var $body = $('body');
    $body.on("click","#botonOkTest",function(){
      $("#ventanaSalida").css("display", "none");
      $("#solucion").css("display", "none");
      $("#ventanaSalida").css("background-color", "whitesmoke");
      $("#testFile").prop("disabled",false);
      $("#cancelBtn").prop("disabled",false);
      $("#submitBtn").prop("disabled",false);
      $("#compilando").css("display", "none");
    });
    $body.on("click","#testFile",function(){
        $("#testFile").prop("disabled",true);
        $("#cancelBtn").prop("disabled",true);
        $("#submitBtn").prop("disabled",true);
        var nCodigo = document.getElementById("submit_problem_code").files[0];
        var problema = document.getElementById("submit_problem_problem");
        var idProblema = problema.options[problema.selectedIndex].value;
        var lenguaje = document.getElementById("submit_problem_language").value;
        var textoCodigo;
        if(nCodigo){
          var extension = nCodigo.name.split('.');
          if(idProblema != ""){
            if(lenguaje == "cpp" && extension.length == 2 && extension[extension.length - 1] == "cpp"){ //evitar subir archios dañinos
                var reader = new FileReader();
                reader.readAsText(nCodigo);
                var cuerpoProblema;
                reader.onload = function(e){
                    $("#ventanaSalida").css("display", "block");
                    $("#botonOkTest").css("display", "block");
                    $("#botonOkTest").prop("disabled",true);
                    $("#botonOkTest").css("background-color", "#f9fffe");
                    $("#compilando").text("Compilando...");
                    $("#compilando").css("display", "flex");
                    textoCodigo = e.target.result;
                    cuerpoProblema = {"id":idProblema,"codigo":textoCodigo};
                    var json = JSON.stringify(cuerpoProblema);
                    var xhrOverride = new XMLHttpRequest();
                    xhrOverride.responseType = 'buffer';
                    $.ajax({
                        url : 'http://localhost/node/comp',
                        data : json, 
                        method : 'post',
                        contentType: "application/json; charset=utf-8",
                        //dataType: "json",
                        xhr: function() {
                          return xhrOverride;
                        },
                        complete: function() {
                            //called when complete
                        },
                        success: function(data) {
                            var contWasm = data.data2.data;
                            
                            function getNumSamples(){
                              var responseHead = true;
                              var nSamples = 0;
                              var nActual = 1;
                              while(responseHead){
                                $.ajax({
                                  type: "HEAD",
                                  async: false,
                                  url: "http://localhost/domjudge/team/"+idProblema+"/sample/"+nActual+"/input",
                                  success : function(){
                                    nSamples++;
                                    nActual++;  
                                  },
                                  error : function(){
                                    responseHead = false;
                                  }
                                });
                              }
                              return new Promise(resolve => {
                                  resolve(nSamples);
                              });
                            }

                            async function getInput(sampleActual){
                              var urlIn = "http://localhost/domjudge/team/"+idProblema+"/sample/"+sampleActual+"/input";
                              var input = '';
                              return new Promise(resolve => {
                                $.ajax({ type: "GET",   
                                  url: urlIn,   
                                  success : function(text)
                                  {
                                      input = text;
                                      resolve(input);
                                  },
                                  error: function() {
                                      console.log('process error');
                                      $("#testFile").prop("disabled",false);
                                      resolve(-1);
                                  }
                                });
                              });
                            }

                            async function getOutput(sampleActual){
                              var urlOut = "http://localhost/domjudge/team/"+idProblema+"/sample/"+sampleActual+"/output";
                              var output = '';
                              return new Promise(resolve => {
                                $.ajax({ type: "GET",   
                                        url: urlOut,  
                                        success : function(text)
                                        {
                                            output = text;
                                            resolve(output);
                                        },
                                        error: function() {
                                            console.log('process error');
                                            $("#testFile").prop("disabled",false);
                                            resolve(-1);
                                        }
                                });
                              });
                            }

                            async function getSalida(input){
                              return new Promise(resolve => {
                              var view = new Uint8Array(contWasm);
                              var narch = data.nArchivo.toString();
      
                              // The Module object: Our interface to the outside world. We import
                              // and export values on it. There are various ways Module can be used:
                              // 1. Not defined. We create it here
                              // 2. A function parameter, function(Module) { ..generated code.. }
                              // 3. pre-run appended it, var Module = {}; ..generated code..
                              // 4. External script tag defines var Module.
                              // We need to check if Module already exists (e.g. case 3 above).
                              // Substitution will be replaced with actual code on later stage of the build,
                              // this way Closure Compiler will not mangle it (e.g. case 4. above).
                              // Note that if you want to run closure, and also to use Module
                              // after the generated code, you will need to define   var Module = {};
                              // before the code. Then that object will be used in the code, and you
                              // can continue to use Module afterwards as well.
                             
                              var salida = [];
                              var Module = typeof Module !== 'undefined' ? Module : {
                                print: (function() {
                                    return function(text) {
                                        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
                                        salida.push(text);
                                    };
                                })()};
                              
                              // --pre-jses are emitted after the Module integration code, so that they can
                              // refer to Module (if they choose; they can also define Module)
      
                                if (!Module.expectedDataFileDownloads) {
                                  Module.expectedDataFileDownloads = 0;
                                }
                                Module.expectedDataFileDownloads++;
                                (function() {
                                var loadPackage = function(metadata) {
                                
                                  function runWithFS() {
                                    Module['FS_createPath']("/", "tmp", true, true);
                                    Module['FS_createPath']("/tmp", narch, true, true);
                                    Module['FS_createDataFile']('/', 'casos.txt',input, true, true, false);
                                  }
                                  if (Module['calledRun']) {
                                    runWithFS();
                                  } else {
                                    if (!Module['preRun']) Module['preRun'] = [];
                                    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
                                  }
                                
                                }
                                loadPackage({"files": []});
                                
                                })();
                                
                              // Sometimes an existing Module object exists with properties
                              // meant to overwrite the default module functionality. Here
                              // we collect those properties and reapply _after_ we configure
                              // the current environment's defaults to avoid having to be so
                              // defensive during initialization.
                              var moduleOverrides = {};
                              var key;
                              for (key in Module) {
                                if (Module.hasOwnProperty(key)) {
                                  moduleOverrides[key] = Module[key];
                                }
                              }
      
                              var arguments_ = [];
                              var thisProgram = './this.program';
                              var quit_ = function(status, toThrow) {
                                throw toThrow;
                              };
      
                              // Determine the runtime environment we are in. You can customize this by
                              // setting the ENVIRONMENT setting at compile time (see settings.js).
      
                              var ENVIRONMENT_IS_WEB = false;
                              ENVIRONMENT_IS_WEB = typeof window === 'object';
                              // N.b. Electron.js environment is simultaneously a NODE-environment, but
                              // also a web environment.
      
                              // `/` should be present at the end if `scriptDirectory` is not empty
                              var scriptDirectory = '';
      
                              // Note that this includes Node.js workers when relevant (pthreads is enabled).
                              // Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
                              // ENVIRONMENT_IS_NODE.
                              if (ENVIRONMENT_IS_WEB) {
                                if (typeof document !== 'undefined' && document.currentScript) { // web
                                  scriptDirectory = document.currentScript.src;
                                }
                                // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
                                // otherwise, slice off the final part of the url to find the script directory.
                                // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
                                // and scriptDirectory will correctly be replaced with an empty string.
                                if (scriptDirectory.indexOf('blob:') !== 0) {
                                  scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf('/')+1);
                                } else {
                                  scriptDirectory = '';
                                }
                              }
      
                              // Set up the out() and err() hooks, which are how we can print to stdout or
                              // stderr, respectively.
                              var out = Module['print'] || console.log.bind(console);
                              var err = Module['printErr'] || console.warn.bind(console);
      
                              // Merge back in the overrides
                              for (key in moduleOverrides) {
                                if (moduleOverrides.hasOwnProperty(key)) {
                                  Module[key] = moduleOverrides[key];
                                }
                              }
                              // Free the object hierarchy contained in the overrides, this lets the GC
                              // reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
                              moduleOverrides = null;
      
                              // Emit code to handle expected values on the Module object. This applies Module.x
                              // to the proper local x. This has two benefits: first, we only emit it if it is
                              // expected to arrive, and second, by using a local everywhere else that can be
                              // minified.
      
                              if (Module['arguments']) arguments_ = Module['arguments'];
      
                              if (Module['thisProgram']) thisProgram = Module['thisProgram'];
      
                              if (Module['quit']) quit_ = Module['quit'];
      
                              // perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
                              var STACK_ALIGN = 16;
      
                              function alignMemory(size, factor) {
                                if (!factor) factor = STACK_ALIGN; // stack alignment (16-byte) by default
                                return Math.ceil(size / factor) * factor;
                              }
      
                              // === Preamble library stuff ===
      
                              // Documentation for the public APIs defined in this file must be updated in:
                              //    site/source/docs/api_reference/preamble.js.rst
                              // A prebuilt local version of the documentation is available at:
                              //    site/build/text/docs/api_reference/preamble.js.txt
                              // You can also build docs locally as HTML or other formats in site/
                              // An online HTML version (which may be of a different version of Emscripten)
                              //    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
      
                              var wasmBinary;
                              if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
                              var noExitRuntime = Module['noExitRuntime'] || true;
      
                              if (typeof WebAssembly !== 'object') {
                                abort('no native wasm support detected');
                              }
      
                              // end include: runtime_safe_heap.js
                              // Wasm globals
      
                              var wasmMemory;
      
                              //========================================
                              // Runtime essentials
                              //========================================
      
                              // whether we are quitting the application. no code should run after this.
                              // set in exit() and abort()
                              var ABORT = false;
      
                              // Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
                              // a copy of that string as a Javascript String object.
      
                              var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;
      
                              /**
                              * @param {number} idx
                              * @param {number=} maxBytesToRead
                              * @return {string}
                              */
                              function UTF8ArrayToString(heap, idx, maxBytesToRead) {
                                var endIdx = idx + maxBytesToRead;
                                var endPtr = idx;
                                // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
                                // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
                                // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
                                while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      
                                if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
                                  return UTF8Decoder.decode(heap.subarray(idx, endPtr));
                                } else {
                                  var str = '';
                                  // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
                                  while (idx < endPtr) {
                                    // For UTF8 byte structure, see:
                                    // http://en.wikipedia.org/wiki/UTF-8#Description
                                    // https://www.ietf.org/rfc/rfc2279.txt
                                    // https://tools.ietf.org/html/rfc3629
                                    var u0 = heap[idx++];
                                    if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
                                    var u1 = heap[idx++] & 63;
                                    if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
                                    var u2 = heap[idx++] & 63;
                                    if ((u0 & 0xF0) == 0xE0) {
                                      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
                                    } else {
                                      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
                                    }
      
                                    if (u0 < 0x10000) {
                                      str += String.fromCharCode(u0);
                                    } else {
                                      var ch = u0 - 0x10000;
                                      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
                                    }
                                  }
                                }
                                return str;
                              }
      
                              // Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
                              // copy of that string as a Javascript String object.
                              // maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
                              //                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
                              //                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
                              //                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
                              //                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
                              //                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
                              //                 throw JS JIT optimizations off, so it is worth to consider consistently using one
                              //                 style or the other.
                              /**
                              * @param {number} ptr
                              * @param {number=} maxBytesToRead
                              * @return {string}
                              */
                              function UTF8ToString(ptr, maxBytesToRead) {
                                return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
                              }
      
                              // Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
                              // encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
                              // Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
                              // Parameters:
                              //   str: the Javascript string to copy.
                              //   heap: the array to copy to. Each index in this array is assumed to be one 8-byte element.
                              //   outIdx: The starting offset in the array to begin the copying.
                              //   maxBytesToWrite: The maximum number of bytes this function can write to the array.
                              //                    This count should include the null terminator,
                              //                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
                              //                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
                              // Returns the number of bytes written, EXCLUDING the null terminator.
      
                              function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
                                if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
                                  return 0;
      
                                var startIdx = outIdx;
                                var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
                                for (var i = 0; i < str.length; ++i) {
                                  // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
                                  // See http://unicode.org/faq/utf_bom.html#utf16-3
                                  // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
                                  var u = str.charCodeAt(i); // possibly a lead surrogate
                                  if (u >= 0xD800 && u <= 0xDFFF) {
                                    var u1 = str.charCodeAt(++i);
                                    u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
                                  }
                                  if (u <= 0x7F) {
                                    if (outIdx >= endIdx) break;
                                    heap[outIdx++] = u;
                                  } else if (u <= 0x7FF) {
                                    if (outIdx + 1 >= endIdx) break;
                                    heap[outIdx++] = 0xC0 | (u >> 6);
                                    heap[outIdx++] = 0x80 | (u & 63);
                                  } else if (u <= 0xFFFF) {
                                    if (outIdx + 2 >= endIdx) break;
                                    heap[outIdx++] = 0xE0 | (u >> 12);
                                    heap[outIdx++] = 0x80 | ((u >> 6) & 63);
                                    heap[outIdx++] = 0x80 | (u & 63);
                                  } else {
                                    if (outIdx + 3 >= endIdx) break;
                                    heap[outIdx++] = 0xF0 | (u >> 18);
                                    heap[outIdx++] = 0x80 | ((u >> 12) & 63);
                                    heap[outIdx++] = 0x80 | ((u >> 6) & 63);
                                    heap[outIdx++] = 0x80 | (u & 63);
                                  }
                                }
                                // Null-terminate the pointer to the buffer.
                                heap[outIdx] = 0;
                                return outIdx - startIdx;
                              }
      
                              // Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
                              function lengthBytesUTF8(str) {
                                var len = 0;
                                for (var i = 0; i < str.length; ++i) {
                                  // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
                                  // See http://unicode.org/faq/utf_bom.html#utf16-3
                                  var u = str.charCodeAt(i); // possibly a lead surrogate
                                  if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
                                  if (u <= 0x7F) ++len;
                                  else if (u <= 0x7FF) len += 2;
                                  else if (u <= 0xFFFF) len += 3;
                                  else len += 4;
                                }
                                return len;
                              }
      
      
                              // end include: runtime_strings_extra.js
                              // Memory management
      
                              var buffer,
                              /** @type {Int8Array} */
                                HEAP8,
                              /** @type {Uint8Array} */
                                HEAPU8,
                              /** @type {Uint16Array} */
                                HEAP32
      
                              function updateGlobalBufferAndViews(buf) {
                                buffer = buf;
                                Module['HEAP8'] = HEAP8 = new Int8Array(buf);
                                Module['HEAP32'] = HEAP32 = new Int32Array(buf);
                                Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
                              }
      
                              // include: runtime_init_table.js
                              // In regular non-RELOCATABLE mode the table is exported
                              // from the wasm module and this will be assigned once
                              // the exports are available.
                              var wasmTable;
      
                              // end include: runtime_assertions.js
                              var __ATPRERUN__  = []; // functions called before the runtime is initialized
                              var __ATINIT__    = []; // functions called during startup
                              var __ATMAIN__    = []; // functions called when main() is to be run
                              var __ATPOSTRUN__ = []; // functions called after the main() is called

      
                              function preRun() {
      
                                if (Module['preRun']) {
                                  if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
                                  while (Module['preRun'].length) {
                                    addOnPreRun(Module['preRun'].shift());
                                  }
                                }
      
                                callRuntimeCallbacks(__ATPRERUN__);
                              }
      
                              function initRuntime() {
                                runtimeInitialized = true;
      
                                if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
                              TTY.init();
                              callRuntimeCallbacks(__ATINIT__);
                              }
      
                              function preMain() {
                                FS.ignorePermissions = false;
                                callRuntimeCallbacks(__ATMAIN__);
                              }
      
                              function exitRuntime() {
                                runtimeExited = true;
                              }
      
                              function postRun() {
      
                                if (Module['postRun']) {
                                  if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
                                  while (Module['postRun'].length) {
                                    addOnPostRun(Module['postRun'].shift());
                                  }
                                }
      
                                callRuntimeCallbacks(__ATPOSTRUN__);
                              }
      
                              function addOnPreRun(cb) {
                                __ATPRERUN__.unshift(cb);
                              }
      
                              function addOnInit(cb) {
                                __ATINIT__.unshift(cb);
                              }
      
                              function addOnPostRun(cb) {
                                __ATPOSTRUN__.unshift(cb);
                              }
                              // end include: runtime_math.js
                              // A counter of dependencies for calling run(). If we need to
                              // do asynchronous work before running, increment this and
                              // decrement it. Incrementing must happen in a place like
                              // Module.preRun (used by emcc to add file preloading).
                              // Note that you can add dependencies in preRun, even though
                              // it happens right before run - run will be postponed until
                              // the dependencies are met.
                              var runDependencies = 0;
                              var runDependencyWatcher = null;
                              var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
      
                              function addRunDependency(id) {
                                runDependencies++;
      
                                if (Module['monitorRunDependencies']) {
                                  Module['monitorRunDependencies'](runDependencies);
                                }
      
                              }
      
                              function removeRunDependency(id) {
                                runDependencies--;
      
                                if (Module['monitorRunDependencies']) {
                                  Module['monitorRunDependencies'](runDependencies);
                                }
      
                                if (runDependencies == 0) {
                                  if (runDependencyWatcher !== null) {
                                    clearInterval(runDependencyWatcher);
                                    runDependencyWatcher = null;
                                  }
                                  if (dependenciesFulfilled) {
                                    var callback = dependenciesFulfilled;
                                    dependenciesFulfilled = null;
                                    callback(); // can add another dependenciesFulfilled
                                  }
                                }
                              }
      
                              /** @param {string|number=} what */
                              function abort(what) {
                                if (Module['onAbort']) {
                                  Module['onAbort'](what);
                                }
      
                                what += '';
                                err(what);
      
                                ABORT = true;
                                EXITSTATUS = 1;
      
                                what = 'abort(' + what + '). Build with -s ASSERTIONS=1 for more info.';
      
                                // Use a wasm runtime error, because a JS error might be seen as a foreign
                                // exception, which means we'd run destructors on it. We need the error to
                                // simply make the program stop.
                                var e = new WebAssembly.RuntimeError(what);
      
                                // Throw the error whether or not MODULARIZE is set because abort is used
                                // in code paths apart from instantiation where an exception is expected
                                // to be thrown when abort is called.
                                throw e;
                              }
                              
                              // Create the wasm instance.
                              // Receives the wasm imports, returns the exports.
                              function createWasm() {
                                var exp = {};
                                // prepare imports
                                var info = {
                                  'env': asmLibraryArg,
                                  'wasi_snapshot_preview1': asmLibraryArg,
                                  proc_exit: () => { },
                                  emscripten_notify_memory_growth: () => {}
                                };
                                // Load the wasm module and create an instance of using native support in the JS engine.
                                // handle a generated wasm instance, receiving its exports and
                                // performing other necessary setup
                                /** @param {WebAssembly.Module=} module*/
                                function receiveInstance(instance, module) {
                                  var exports = instance.exports;
      
                                  Module['asm'] = exports;
      
                                  wasmMemory = Module['asm']['memory'];
                                  updateGlobalBufferAndViews(wasmMemory.buffer);
      
                                  wasmTable = Module['asm']['__indirect_function_table'];
      
                                  addOnInit(Module['asm']['__wasm_call_ctors']);
      
                                  removeRunDependency('wasm-instantiate');
                                }
                                // we can't run yet (except in a pthread, where we have a custom sync instantiator)
                                addRunDependency('wasm-instantiate');
      
                                function instantiateAsync() {
                                    WebAssembly.instantiate(view,info).then(res => {
                                      receiveInstance(res.instance);
                                      exp = res.instance.exports;
                                      return exp;
                                    }).catch(e => {
                                      console.log(e);
                                    });
                                }
                                instantiateAsync();
                                return exp; // no exports yet; we'll fill them in later
                              }
      
                              // Globals used by JS i64 conversions (see makeSetValue)
                              var tempDouble;
                              var tempI64;
                              
                                function callRuntimeCallbacks(callbacks) {
                                    while (callbacks.length > 0) {
                                      var callback = callbacks.shift();
                                      if (typeof callback == 'function') {
                                        callback(Module); // Pass the module as the first argument.
                                        continue;
                                      }
                                      var func = callback.func;
                                      if (typeof func === 'number') {
                                        if (callback.arg === undefined) {
                                          wasmTable.get(func)();
                                        } else {
                                          wasmTable.get(func)(callback.arg);
                                        }
                                      } else {
                                        func(callback.arg === undefined ? null : callback.arg);
                                      }
                                    }
                                  }
      
                                var runtimeKeepaliveCounter=0;
                                function keepRuntimeAlive() {
                                    return noExitRuntime || runtimeKeepaliveCounter > 0;
                                }
      
                                function setErrNo(value) {
                                    HEAP32[((___errno_location())>>2)] = value;
                                    return value;
                                  }
                                
                                var PATH={splitPath:function(filename) {
                                      var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                                      return splitPathRe.exec(filename).slice(1);
                                    },normalizeArray:function(parts, allowAboveRoot) {
                                      // if the path tries to go above the root, `up` ends up > 0
                                      var up = 0;
                                      for (var i = parts.length - 1; i >= 0; i--) {
                                        var last = parts[i];
                                        if (last === '.') {
                                          parts.splice(i, 1);
                                        } else if (last === '..') {
                                          parts.splice(i, 1);
                                          up++;
                                        } else if (up) {
                                          parts.splice(i, 1);
                                          up--;
                                        }
                                      }
                                      // if the path is allowed to go above the root, restore leading ..s
                                      if (allowAboveRoot) {
                                        for (; up; up--) {
                                          parts.unshift('..');
                                        }
                                      }
                                      return parts;
                                    },normalize:function(path) {
                                      var isAbsolute = path.charAt(0) === '/',
                                          trailingSlash = path.substr(-1) === '/';
                                      // Normalize the path
                                      path = PATH.normalizeArray(path.split('/').filter(function(p) {
                                        return !!p;
                                      }), !isAbsolute).join('/');
                                      if (!path && !isAbsolute) {
                                        path = '.';
                                      }
                                      if (path && trailingSlash) {
                                        path += '/';
                                      }
                                      return (isAbsolute ? '/' : '') + path;
                                    },dirname:function(path) {
                                      var result = PATH.splitPath(path),
                                          root = result[0],
                                          dir = result[1];
                                      if (!root && !dir) {
                                        // No dirname whatsoever
                                        return '.';
                                      }
                                      if (dir) {
                                        // It has a dirname, strip trailing slash
                                        dir = dir.substr(0, dir.length - 1);
                                      }
                                      return root + dir;
                                    },basename:function(path) {
                                      // EMSCRIPTEN return '/'' for '/', not an empty string
                                      if (path === '/') return '/';
                                      path = PATH.normalize(path);
                                      path = path.replace(/\/$/, "");
                                      var lastSlash = path.lastIndexOf('/');
                                      if (lastSlash === -1) return path;
                                      return path.substr(lastSlash+1);
                                    },join:function() {
                                      var paths = Array.prototype.slice.call(arguments, 0);
                                      return PATH.normalize(paths.join('/'));
                                    },join2:function(l, r) {
                                      return PATH.normalize(l + '/' + r);
                                    }};
                                
                                function getRandomDevice() {
                                    if (typeof crypto === 'object' && typeof crypto['getRandomValues'] === 'function') {
                                      // for modern web browsers
                                      var randomBuffer = new Uint8Array(1);
                                      return function() { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
                                    } 
                                    // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
                                    return function() { abort("randomDevice"); };
                                  }
                                
                                var PATH_FS={resolve:function() {
                                      var resolvedPath = '',
                                        resolvedAbsolute = false;
                                      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                                        var path = (i >= 0) ? arguments[i] : FS.cwd();
                                        // Skip empty and invalid entries
                                        if (typeof path !== 'string') {
                                          throw new TypeError('Arguments to path.resolve must be strings');
                                        } else if (!path) {
                                          return ''; // an invalid portion invalidates the whole thing
                                        }
                                        resolvedPath = path + '/' + resolvedPath;
                                        resolvedAbsolute = path.charAt(0) === '/';
                                      }
                                      // At this point the path should be resolved to a full absolute path, but
                                      // handle relative paths to be safe (might happen when process.cwd() fails)
                                      resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
                                        return !!p;
                                      }), !resolvedAbsolute).join('/');
                                      return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
                                    },relative:function(from, to) {
                                      from = PATH_FS.resolve(from).substr(1);
                                      to = PATH_FS.resolve(to).substr(1);
                                      function trim(arr) {
                                        var start = 0;
                                        for (; start < arr.length; start++) {
                                          if (arr[start] !== '') break;
                                        }
                                        var end = arr.length - 1;
                                        for (; end >= 0; end--) {
                                          if (arr[end] !== '') break;
                                        }
                                        if (start > end) return [];
                                        return arr.slice(start, end - start + 1);
                                      }
                                      var fromParts = trim(from.split('/'));
                                      var toParts = trim(to.split('/'));
                                      var length = Math.min(fromParts.length, toParts.length);
                                      var samePartsLength = length;
                                      for (var i = 0; i < length; i++) {
                                        if (fromParts[i] !== toParts[i]) {
                                          samePartsLength = i;
                                          break;
                                        }
                                      }
                                      var outputParts = [];
                                      for (var i = samePartsLength; i < fromParts.length; i++) {
                                        outputParts.push('..');
                                      }
                                      outputParts = outputParts.concat(toParts.slice(samePartsLength));
                                      return outputParts.join('/');
                                    }};
                                
                                var TTY={ttys:[],init:function () {
                                      // https://github.com/emscripten-core/emscripten/pull/1555
                                      // if (ENVIRONMENT_IS_NODE) {
                                      //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
                                      //   // device, it always assumes it's a TTY device. because of this, we're forcing
                                      //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
                                      //   // with text files until FS.init can be refactored.
                                      //   process['stdin']['setEncoding']('utf8');
                                      // }
                                    },shutdown:function() {
                                      // https://github.com/emscripten-core/emscripten/pull/1555
                                      // if (ENVIRONMENT_IS_NODE) {
                                      //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
                                      //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
                                      //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
                                      //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
                                      //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
                                      //   process['stdin']['pause']();
                                      // }
                                    },register:function(dev, ops) {
                                      TTY.ttys[dev] = { input: [], output: [], ops: ops };
                                      FS.registerDevice(dev, TTY.stream_ops);
                                    },stream_ops:{open:function(stream) {
                                        var tty = TTY.ttys[stream.node.rdev];
                                        if (!tty) {
                                          throw new FS.ErrnoError(43);
                                        }
                                        stream.tty = tty;
                                        stream.seekable = false;
                                      },close:function(stream) {
                                        // flush any pending line data
                                        stream.tty.ops.flush(stream.tty);
                                      },flush:function(stream) {
                                        stream.tty.ops.flush(stream.tty);
                                      },read:function(stream, buffer, offset, length, pos /* ignored */) {
                                        if (!stream.tty || !stream.tty.ops.get_char) {
                                          throw new FS.ErrnoError(60);
                                        }
                                        var bytesRead = 0;
                                        for (var i = 0; i < length; i++) {
                                          var result;
                                          try {
                                            result = stream.tty.ops.get_char(stream.tty);
                                          } catch (e) {
                                            throw new FS.ErrnoError(29);
                                          }
                                          if (result === undefined && bytesRead === 0) {
                                            throw new FS.ErrnoError(6);
                                          }
                                          if (result === null || result === undefined) break;
                                          bytesRead++;
                                          buffer[offset+i] = result;
                                        }
                                        if (bytesRead) {
                                          stream.node.timestamp = Date.now();
                                        }
                                        return bytesRead;
                                      },write:function(stream, buffer, offset, length, pos) {
                                        if (!stream.tty || !stream.tty.ops.put_char) {
                                          throw new FS.ErrnoError(60);
                                        }
                                        try {
                                          for (var i = 0; i < length; i++) {
                                            stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
                                          }
                                        } catch (e) {
                                          throw new FS.ErrnoError(29);
                                        }
                                        if (length) {
                                          stream.node.timestamp = Date.now();
                                        }
                                        return i;
                                      }},default_tty_ops:{get_char:function(tty) {
                                        if (!tty.input.length) {
                                          var result = null;
                                          
                                          if (typeof window != 'undefined' &&
                                            typeof window.prompt == 'function') {
                                            // Browser.
                                            result = window.prompt('Input: ');  // returns null on cancel
                                            if (result !== null) {
                                              result += '\n';
                                            }
                                          } else if (typeof readline == 'function') {
                                            // Command line.
                                            result = readline();
                                            if (result !== null) {
                                              result += '\n';
                                            }
                                          }
                                          if (!result) {
                                            return null;
                                          }
                                          tty.input = intArrayFromString(result, true);
                                        }
                                        return tty.input.shift();
                                      },put_char:function(tty, val) {
                                        if (val === null || val === 10) {
                                          out(UTF8ArrayToString(tty.output, 0));
                                          tty.output = [];
                                        } else {
                                          if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
                                        }
                                      },flush:function(tty) {
                                        if (tty.output && tty.output.length > 0) {
                                          out(UTF8ArrayToString(tty.output, 0));
                                          tty.output = [];
                                        }
                                      }},default_tty1_ops:{put_char:function(tty, val) {
                                        if (val === null || val === 10) {
                                          err(UTF8ArrayToString(tty.output, 0));
                                          tty.output = [];
                                        } else {
                                          if (val != 0) tty.output.push(val);
                                        }
                                      },flush:function(tty) {
                                        if (tty.output && tty.output.length > 0) {
                                          err(UTF8ArrayToString(tty.output, 0));
                                          tty.output = [];
                                        }
                                      }}};
                                
                                function mmapAlloc(size) {
                                    var alignedSize = alignMemory(size, 65536);
                                    var ptr = _malloc(alignedSize);
                                    while (size < alignedSize) HEAP8[ptr + size++] = 0;
                                    return ptr;
                                  }
                                var MEMFS={ops_table:null,mount:function(mount) {
                                      return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
                                    },createNode:function(parent, name, mode, dev) {
                                      if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                                        // no supported
                                        throw new FS.ErrnoError(63);
                                      }
                                      if (!MEMFS.ops_table) {
                                        MEMFS.ops_table = {
                                          dir: {
                                            node: {
                                              getattr: MEMFS.node_ops.getattr,
                                              setattr: MEMFS.node_ops.setattr,
                                              lookup: MEMFS.node_ops.lookup,
                                              mknod: MEMFS.node_ops.mknod,
                                              rename: MEMFS.node_ops.rename,
                                              unlink: MEMFS.node_ops.unlink,
                                              rmdir: MEMFS.node_ops.rmdir,
                                              readdir: MEMFS.node_ops.readdir,
                                              symlink: MEMFS.node_ops.symlink
                                            },
                                            stream: {
                                              llseek: MEMFS.stream_ops.llseek
                                            }
                                          },
                                          file: {
                                            node: {
                                              getattr: MEMFS.node_ops.getattr,
                                              setattr: MEMFS.node_ops.setattr
                                            },
                                            stream: {
                                              llseek: MEMFS.stream_ops.llseek,
                                              read: MEMFS.stream_ops.read,
                                              write: MEMFS.stream_ops.write,
                                              allocate: MEMFS.stream_ops.allocate,
                                              mmap: MEMFS.stream_ops.mmap
                                            }
                                          },
                                          link: {
                                            node: {
                                              getattr: MEMFS.node_ops.getattr,
                                              setattr: MEMFS.node_ops.setattr,
                                              readlink: MEMFS.node_ops.readlink
                                            },
                                            stream: {}
                                          },
                                          chrdev: {
                                            node: {
                                              getattr: MEMFS.node_ops.getattr,
                                              setattr: MEMFS.node_ops.setattr
                                            },
                                            stream: FS.chrdev_stream_ops
                                          }
                                        };
                                      }
                                      var node = FS.createNode(parent, name, mode, dev);
                                      if (FS.isDir(node.mode)) {
                                        node.node_ops = MEMFS.ops_table.dir.node;
                                        node.stream_ops = MEMFS.ops_table.dir.stream;
                                        node.contents = {};
                                      } else if (FS.isFile(node.mode)) {
                                        node.node_ops = MEMFS.ops_table.file.node;
                                        node.stream_ops = MEMFS.ops_table.file.stream;
                                        node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
                                        // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
                                        // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
                                        // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
                                        node.contents = null; 
                                      } else if (FS.isLink(node.mode)) {
                                        node.node_ops = MEMFS.ops_table.link.node;
                                        node.stream_ops = MEMFS.ops_table.link.stream;
                                      } else if (FS.isChrdev(node.mode)) {
                                        node.node_ops = MEMFS.ops_table.chrdev.node;
                                        node.stream_ops = MEMFS.ops_table.chrdev.stream;
                                      }
                                      node.timestamp = Date.now();
                                      // add the new node to the parent
                                      if (parent) {
                                        parent.contents[name] = node;
                                        parent.timestamp = node.timestamp;
                                      }
                                      return node;
                                    },expandFileStorage:function(node, newCapacity) {
                                      var prevCapacity = node.contents ? node.contents.length : 0;
                                      if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
                                      // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
                                      // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
                                      // avoid overshooting the allocation cap by a very large margin.
                                      var CAPACITY_DOUBLING_MAX = 1024 * 1024;
                                      newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
                                      if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
                                      var oldContents = node.contents;
                                      node.contents = new Uint8Array(newCapacity); // Allocate new storage.
                                      if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
                                    },resizeFileStorage:function(node, newSize) {
                                      if (node.usedBytes == newSize) return;
                                      if (newSize == 0) {
                                        node.contents = null; // Fully decommit when requesting a resize to zero.
                                        node.usedBytes = 0;
                                      } else {
                                        var oldContents = node.contents;
                                        node.contents = new Uint8Array(newSize); // Allocate new storage.
                                        if (oldContents) {
                                          node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
                                        }
                                        node.usedBytes = newSize;
                                      }
                                    },node_ops:{getattr:function(node) {
                                        var attr = {};
                                        // device numbers reuse inode numbers.
                                        attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
                                        attr.ino = node.id;
                                        attr.mode = node.mode;
                                        attr.nlink = 1;
                                        attr.uid = 0;
                                        attr.gid = 0;
                                        attr.rdev = node.rdev;
                                        if (FS.isDir(node.mode)) {
                                          attr.size = 4096;
                                        } else if (FS.isFile(node.mode)) {
                                          attr.size = node.usedBytes;
                                        } else if (FS.isLink(node.mode)) {
                                          attr.size = node.link.length;
                                        } else {
                                          attr.size = 0;
                                        }
                                        attr.atime = new Date(node.timestamp);
                                        attr.mtime = new Date(node.timestamp);
                                        attr.ctime = new Date(node.timestamp);
                                        // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
                                        //       but this is not required by the standard.
                                        attr.blksize = 4096;
                                        attr.blocks = Math.ceil(attr.size / attr.blksize);
                                        return attr;
                                      },setattr:function(node, attr) {
                                        if (attr.mode !== undefined) {
                                          node.mode = attr.mode;
                                        }
                                        if (attr.timestamp !== undefined) {
                                          node.timestamp = attr.timestamp;
                                        }
                                        if (attr.size !== undefined) {
                                          MEMFS.resizeFileStorage(node, attr.size);
                                        }
                                      },lookup:function(parent, name) {
                                        throw FS.genericErrors[44];
                                      },mknod:function(parent, name, mode, dev) {
                                        return MEMFS.createNode(parent, name, mode, dev);
                                      },rename:function(old_node, new_dir, new_name) {
                                        // if we're overwriting a directory at new_name, make sure it's empty.
                                        if (FS.isDir(old_node.mode)) {
                                          var new_node;
                                          try {
                                            new_node = FS.lookupNode(new_dir, new_name);
                                          } catch (e) {
                                          }
                                          if (new_node) {
                                            for (var i in new_node.contents) {
                                              throw new FS.ErrnoError(55);
                                            }
                                          }
                                        }
                                        // do the internal rewiring
                                        delete old_node.parent.contents[old_node.name];
                                        old_node.parent.timestamp = Date.now()
                                        old_node.name = new_name;
                                        new_dir.contents[new_name] = old_node;
                                        new_dir.timestamp = old_node.parent.timestamp;
                                        old_node.parent = new_dir;
                                      },unlink:function(parent, name) {
                                        delete parent.contents[name];
                                        parent.timestamp = Date.now();
                                      },rmdir:function(parent, name) {
                                        var node = FS.lookupNode(parent, name);
                                        for (var i in node.contents) {
                                          throw new FS.ErrnoError(55);
                                        }
                                        delete parent.contents[name];
                                        parent.timestamp = Date.now();
                                      },readdir:function(node) {
                                        var entries = ['.', '..'];
                                        for (var key in node.contents) {
                                          if (!node.contents.hasOwnProperty(key)) {
                                            continue;
                                          }
                                          entries.push(key);
                                        }
                                        return entries;
                                      },symlink:function(parent, newname, oldpath) {
                                        var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
                                        node.link = oldpath;
                                        return node;
                                      },readlink:function(node) {
                                        if (!FS.isLink(node.mode)) {
                                          throw new FS.ErrnoError(28);
                                        }
                                        return node.link;
                                      }},stream_ops:{read:function(stream, buffer, offset, length, position) {
                                        var contents = stream.node.contents;
                                        if (position >= stream.node.usedBytes) return 0;
                                        var size = Math.min(stream.node.usedBytes - position, length);
                                        if (size > 8 && contents.subarray) { // non-trivial, and typed array
                                          buffer.set(contents.subarray(position, position + size), offset);
                                        } else {
                                          for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
                                        }
                                        return size;
                                      },write:function(stream, buffer, offset, length, position, canOwn) {
                                
                                        if (!length) return 0;
                                        var node = stream.node;
                                        node.timestamp = Date.now();
                                
                                        if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
                                          if (canOwn) {
                                            node.contents = buffer.subarray(offset, offset + length);
                                            node.usedBytes = length;
                                            return length;
                                          } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
                                            node.contents = buffer.slice(offset, offset + length);
                                            node.usedBytes = length;
                                            return length;
                                          } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
                                            node.contents.set(buffer.subarray(offset, offset + length), position);
                                            return length;
                                          }
                                        }
                                
                                        // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
                                        MEMFS.expandFileStorage(node, position+length);
                                        if (node.contents.subarray && buffer.subarray) {
                                          // Use typed array write which is available.
                                          node.contents.set(buffer.subarray(offset, offset + length), position);
                                        } else {
                                          for (var i = 0; i < length; i++) {
                                          node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
                                          }
                                        }
                                        node.usedBytes = Math.max(node.usedBytes, position + length);
                                        return length;
                                      },llseek:function(stream, offset, whence) {
                                        var position = offset;
                                        if (whence === 1) {
                                          position += stream.position;
                                        } else if (whence === 2) {
                                          if (FS.isFile(stream.node.mode)) {
                                            position += stream.node.usedBytes;
                                          }
                                        }
                                        if (position < 0) {
                                          throw new FS.ErrnoError(28);
                                        }
                                        return position;
                                      },allocate:function(stream, offset, length) {
                                        MEMFS.expandFileStorage(stream.node, offset + length);
                                        stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
                                      },mmap:function(stream, address, length, position, prot, flags) {
                                        if (address !== 0) {
                                          // We don't currently support location hints for the address of the mapping
                                          throw new FS.ErrnoError(28);
                                        }
                                        if (!FS.isFile(stream.node.mode)) {
                                          throw new FS.ErrnoError(43);
                                        }
                                        var ptr;
                                        var allocated;
                                        var contents = stream.node.contents;
                                        // Only make a new copy when MAP_PRIVATE is specified.
                                        if (!(flags & 2) && contents.buffer === buffer) {
                                          // We can't emulate MAP_SHARED when the file is not backed by the buffer
                                          // we're mapping to (e.g. the HEAP buffer).
                                          allocated = false;
                                          ptr = contents.byteOffset;
                                        } else {
                                          // Try to avoid unnecessary slices.
                                          if (position > 0 || position + length < contents.length) {
                                            if (contents.subarray) {
                                              contents = contents.subarray(position, position + length);
                                            } else {
                                              contents = Array.prototype.slice.call(contents, position, position + length);
                                            }
                                          }
                                          allocated = true;
                                          ptr = mmapAlloc(length);
                                          if (!ptr) {
                                            throw new FS.ErrnoError(48);
                                          }
                                          HEAP8.set(contents, ptr);
                                        }
                                        return { ptr: ptr, allocated: allocated };
                                      }}};
                                var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,lookupPath:function(path, opts) {
                                      path = PATH_FS.resolve(FS.cwd(), path);
                                      opts = opts || {};
                                
                                      if (!path) return { path: '', node: null };
                                
                                      var defaults = {
                                        follow_mount: true,
                                        recurse_count: 0
                                      };
                                      for (var key in defaults) {
                                        if (opts[key] === undefined) {
                                          opts[key] = defaults[key];
                                        }
                                      }
                                
                                      if (opts.recurse_count > 8) {  // max recursive lookup of 8
                                        throw new FS.ErrnoError(32);
                                      }
                                
                                      // split the path
                                      var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
                                        return !!p;
                                      }), false);
                                
                                      // start at the root
                                      var current = FS.root;
                                      var current_path = '/';
                                
                                      for (var i = 0; i < parts.length; i++) {
                                        var islast = (i === parts.length-1);
                                        if (islast && opts.parent) {
                                          // stop resolving
                                          break;
                                        }
                                
                                        current = FS.lookupNode(current, parts[i]);
                                        current_path = PATH.join2(current_path, parts[i]);
                                
                                        // jump to the mount's root node if this is a mountpoint
                                        if (FS.isMountpoint(current)) {
                                          if (!islast || (islast && opts.follow_mount)) {
                                            current = current.mounted.root;
                                          }
                                        }
                                
                                        // by default, lookupPath will not follow a symlink if it is the final path component.
                                        // setting opts.follow = true will override this behavior.
                                        if (!islast || opts.follow) {
                                          var count = 0;
                                          while (FS.isLink(current.mode)) {
                                            var link = FS.readlink(current_path);
                                            current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                                
                                            var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
                                            current = lookup.node;
                                
                                            if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                                              throw new FS.ErrnoError(32);
                                            }
                                          }
                                        }
                                      }
                                
                                      return { path: current_path, node: current };
                                    },getPath:function(node) {
                                      var path;
                                      while (true) {
                                        if (FS.isRoot(node)) {
                                          var mount = node.mount.mountpoint;
                                          if (!path) return mount;
                                          return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
                                        }
                                        path = path ? node.name + '/' + path : node.name;
                                        node = node.parent;
                                      }
                                    },hashName:function(parentid, name) {
                                      var hash = 0;
                                
                                      for (var i = 0; i < name.length; i++) {
                                        hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
                                      }
                                      return ((parentid + hash) >>> 0) % FS.nameTable.length;
                                    },hashAddNode:function(node) {
                                      var hash = FS.hashName(node.parent.id, node.name);
                                      node.name_next = FS.nameTable[hash];
                                      FS.nameTable[hash] = node;
                                    },hashRemoveNode:function(node) {
                                      var hash = FS.hashName(node.parent.id, node.name);
                                      if (FS.nameTable[hash] === node) {
                                        FS.nameTable[hash] = node.name_next;
                                      } else {
                                        var current = FS.nameTable[hash];
                                        while (current) {
                                          if (current.name_next === node) {
                                            current.name_next = node.name_next;
                                            break;
                                          }
                                          current = current.name_next;
                                        }
                                      }
                                    },lookupNode:function(parent, name) {
                                      var errCode = FS.mayLookup(parent);
                                      if (errCode) {
                                        throw new FS.ErrnoError(errCode, parent);
                                      }
                                      var hash = FS.hashName(parent.id, name);
                                      for (var node = FS.nameTable[hash]; node; node = node.name_next) {
                                        var nodeName = node.name;
                                        if (node.parent.id === parent.id && nodeName === name) {
                                          return node;
                                        }
                                      }
                                      // if we failed to find it in the cache, call into the VFS
                                      return FS.lookup(parent, name);
                                    },createNode:function(parent, name, mode, rdev) {
                                      var node = new FS.FSNode(parent, name, mode, rdev);
                                
                                      FS.hashAddNode(node);
                                
                                      return node;
                                    },destroyNode:function(node) {
                                      FS.hashRemoveNode(node);
                                    },isRoot:function(node) {
                                      return node === node.parent;
                                    },isMountpoint:function(node) {
                                      return !!node.mounted;
                                    },isFile:function(mode) {
                                      return (mode & 61440) === 32768;
                                    },isDir:function(mode) {
                                      return (mode & 61440) === 16384;
                                    },isLink:function(mode) {
                                      return (mode & 61440) === 40960;
                                    },isChrdev:function(mode) {
                                      return (mode & 61440) === 8192;
                                    },isBlkdev:function(mode) {
                                      return (mode & 61440) === 24576;
                                    },isFIFO:function(mode) {
                                      return (mode & 61440) === 4096;
                                    },flagsToPermissionString:function(flag) {
                                      var perms = ['r', 'w', 'rw'][flag & 3];
                                      if ((flag & 512)) {
                                        perms += 'w';
                                      }
                                      return perms;
                                    },nodePermissions:function(node, perms) {
                                      if (FS.ignorePermissions) {
                                        return 0;
                                      }
                                      // return 0 if any user, group or owner bits are set.
                                      if (perms.includes('r') && !(node.mode & 292)) {
                                        return 2;
                                      } else if (perms.includes('w') && !(node.mode & 146)) {
                                        return 2;
                                      } else if (perms.includes('x') && !(node.mode & 73)) {
                                        return 2;
                                      }
                                      return 0;
                                    },mayLookup:function(dir) {
                                      var errCode = FS.nodePermissions(dir, 'x');
                                      if (errCode) return errCode;
                                      if (!dir.node_ops.lookup) return 2;
                                      return 0;
                                    },mayCreate:function(dir, name) {
                                      try {
                                        var node = FS.lookupNode(dir, name);
                                        return 20;
                                      } catch (e) {
                                      }
                                      return FS.nodePermissions(dir, 'wx');
                                    },mayDelete:function(dir, name, isdir) {
                                      var node;
                                      try {
                                        node = FS.lookupNode(dir, name);
                                      } catch (e) {
                                        return e.errno;
                                      }
                                      var errCode = FS.nodePermissions(dir, 'wx');
                                      if (errCode) {
                                        return errCode;
                                      }
                                      if (isdir) {
                                        if (!FS.isDir(node.mode)) {
                                          return 54;
                                        }
                                        if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                                          return 10;
                                        }
                                      } else {
                                        if (FS.isDir(node.mode)) {
                                          return 31;
                                        }
                                      }
                                      return 0;
                                    },mayOpen:function(node, flags) {
                                      if (!node) {
                                        return 44;
                                      }
                                      if (FS.isLink(node.mode)) {
                                        return 32;
                                      } else if (FS.isDir(node.mode)) {
                                        if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
                                            (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
                                          return 31;
                                        }
                                      }
                                      return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
                                    },MAX_OPEN_FDS:4096,nextfd:function(fd_start, fd_end) {
                                      fd_start = fd_start || 0;
                                      fd_end = fd_end || FS.MAX_OPEN_FDS;
                                      for (var fd = fd_start; fd <= fd_end; fd++) {
                                        if (!FS.streams[fd]) {
                                          return fd;
                                        }
                                      }
                                      throw new FS.ErrnoError(33);
                                    },getStream:function(fd) {
                                      return FS.streams[fd];
                                    },createStream:function(stream, fd_start, fd_end) {
                                      if (!FS.FSStream) {
                                        FS.FSStream = /** @constructor */ function(){};
                                        FS.FSStream.prototype = {
                                          object: {
                                            get: function() { return this.node; },
                                            set: function(val) { this.node = val; }
                                          },
                                          isRead: {
                                            get: function() { return (this.flags & 2097155) !== 1; }
                                          },
                                          isWrite: {
                                            get: function() { return (this.flags & 2097155) !== 0; }
                                          },
                                          isAppend: {
                                            get: function() { return (this.flags & 1024); }
                                          }
                                        };
                                      }
                                      // clone it, so we can return an instance of FSStream
                                      var newStream = new FS.FSStream();
                                      for (var p in stream) {
                                        newStream[p] = stream[p];
                                      }
                                      stream = newStream;
                                      var fd = FS.nextfd(fd_start, fd_end);
                                      stream.fd = fd;
                                      FS.streams[fd] = stream;
                                      return stream;
                                    },closeStream:function(fd) {
                                      FS.streams[fd] = null;
                                    },chrdev_stream_ops:{open:function(stream) {
                                        var device = FS.getDevice(stream.node.rdev);
                                        // override node's stream ops with the device's
                                        stream.stream_ops = device.stream_ops;
                                        // forward the open call
                                        if (stream.stream_ops.open) {
                                          stream.stream_ops.open(stream);
                                        }
                                      },llseek:function() {
                                        throw new FS.ErrnoError(70);
                                      }},major:function(dev) {
                                      return ((dev) >> 8);
                                    },makedev:function(ma, mi) {
                                      return ((ma) << 8 | (mi));
                                    },registerDevice:function(dev, ops) {
                                      FS.devices[dev] = { stream_ops: ops };
                                    },getDevice:function(dev) {
                                      return FS.devices[dev];
                                    },mount:function(type, opts, mountpoint) {
                                      var root = mountpoint === '/';
                                      var pseudo = !mountpoint;
                                      var node;
                                
                                      if (root && FS.root) {
                                        throw new FS.ErrnoError(10);
                                      } else if (!root && !pseudo) {
                                        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
                                
                                        mountpoint = lookup.path;  // use the absolute path
                                        node = lookup.node;
                                
                                        if (FS.isMountpoint(node)) {
                                          throw new FS.ErrnoError(10);
                                        }
                                
                                        if (!FS.isDir(node.mode)) {
                                          throw new FS.ErrnoError(54);
                                        }
                                      }
                                
                                      var mount = {
                                        type: type,
                                        opts: opts,
                                        mountpoint: mountpoint,
                                        mounts: []
                                      };
                                
                                      // create a root node for the fs
                                      var mountRoot = type.mount(mount);
                                      mountRoot.mount = mount;
                                      mount.root = mountRoot;
                                
                                      if (root) {
                                        FS.root = mountRoot;
                                      } else if (node) {
                                        // set as a mountpoint
                                        node.mounted = mount;
                                
                                        // add the new mount to the current mount's children
                                        if (node.mount) {
                                          node.mount.mounts.push(mount);
                                        }
                                      }
                                
                                      return mountRoot;
                                    },mknod:function(path, mode, dev) {
                                      var lookup = FS.lookupPath(path, { parent: true });
                                      var parent = lookup.node;
                                      var name = PATH.basename(path);
                                      if (!name || name === '.' || name === '..') {
                                        throw new FS.ErrnoError(28);
                                      }
                                      var errCode = FS.mayCreate(parent, name);
                                      if (errCode) {
                                        throw new FS.ErrnoError(errCode);
                                      }
                                      if (!parent.node_ops.mknod) {
                                        throw new FS.ErrnoError(63);
                                      }
                                      return parent.node_ops.mknod(parent, name, mode, dev);
                                    },create:function(path, mode) {
                                      mode = mode !== undefined ? mode : 438 /* 0666 */;
                                      mode &= 4095;
                                      mode |= 32768;
                                      return FS.mknod(path, mode, 0);
                                    },mkdir:function(path, mode) {
                                      mode = mode !== undefined ? mode : 511 /* 0777 */;
                                      mode &= 511 | 512;
                                      mode |= 16384;
                                      return FS.mknod(path, mode, 0);
                                    },mkdev:function(path, mode, dev) {
                                      if (typeof(dev) === 'undefined') {
                                        dev = mode;
                                        mode = 438 /* 0666 */;
                                      }
                                      mode |= 8192;
                                      return FS.mknod(path, mode, dev);
                                    },symlink:function(oldpath, newpath) {
                                      if (!PATH_FS.resolve(oldpath)) {
                                        throw new FS.ErrnoError(44);
                                      }
                                      var lookup = FS.lookupPath(newpath, { parent: true });
                                      var parent = lookup.node;
                                      if (!parent) {
                                        throw new FS.ErrnoError(44);
                                      }
                                      var newname = PATH.basename(newpath);
                                      var errCode = FS.mayCreate(parent, newname);
                                      if (errCode) {
                                        throw new FS.ErrnoError(errCode);
                                      }
                                      if (!parent.node_ops.symlink) {
                                        throw new FS.ErrnoError(63);
                                      }
                                      return parent.node_ops.symlink(parent, newname, oldpath);
                                    },unlink:function(path) {
                                      var lookup = FS.lookupPath(path, { parent: true });
                                      var parent = lookup.node;
                                      var name = PATH.basename(path);
                                      var node = FS.lookupNode(parent, name);
                                      var errCode = FS.mayDelete(parent, name, false);
                                      if (errCode) {
                                        // According to POSIX, we should map EISDIR to EPERM, but
                                        // we instead do what Linux does (and we must, as we use
                                        // the musl linux libc).
                                        throw new FS.ErrnoError(errCode);
                                      }
                                      if (!parent.node_ops.unlink) {
                                        throw new FS.ErrnoError(63);
                                      }
                                      if (FS.isMountpoint(node)) {
                                        throw new FS.ErrnoError(10);
                                      }
                                      try {
                                        if (FS.trackingDelegate['willDeletePath']) {
                                          FS.trackingDelegate['willDeletePath'](path);
                                        }
                                      } catch(e) {
                                        err("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
                                      }
                                      parent.node_ops.unlink(parent, name);
                                      FS.destroyNode(node);
                                      try {
                                        if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
                                      } catch(e) {
                                        err("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
                                      }
                                    },readlink:function(path) {
                                      var lookup = FS.lookupPath(path);
                                      var link = lookup.node;
                                      if (!link) {
                                        throw new FS.ErrnoError(44);
                                      }
                                      if (!link.node_ops.readlink) {
                                        throw new FS.ErrnoError(28);
                                      }
                                      return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
                                    },stat:function(path, dontFollow) {
                                      var lookup = FS.lookupPath(path, { follow: !dontFollow });
                                      var node = lookup.node;
                                      if (!node) {
                                        throw new FS.ErrnoError(44);
                                      }
                                      if (!node.node_ops.getattr) {
                                        throw new FS.ErrnoError(63);
                                      }
                                      return node.node_ops.getattr(node);
                                    },chmod:function(path, mode, dontFollow) {
                                      var node;
                                      if (typeof path === 'string') {
                                        var lookup = FS.lookupPath(path, { follow: !dontFollow });
                                        node = lookup.node;
                                      } else {
                                        node = path;
                                      }
                                      if (!node.node_ops.setattr) {
                                        throw new FS.ErrnoError(63);
                                      }
                                      node.node_ops.setattr(node, {
                                        mode: (mode & 4095) | (node.mode & ~4095),
                                        timestamp: Date.now()
                                      });
                                    },open:function(path, flags, mode, fd_start, fd_end) {
                                      if (path === "") {
                                        throw new FS.ErrnoError(44);
                                      }
                                      flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
                                      mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
                                      if ((flags & 64)) {
                                        mode = (mode & 4095) | 32768;
                                      } else {
                                        mode = 0;
                                      }
                                      var node;
                                      if (typeof path === 'object') {
                                        node = path;
                                      } else {
                                        path = PATH.normalize(path);
                                        try {
                                          var lookup = FS.lookupPath(path, {
                                            follow: !(flags & 131072)
                                          });
                                          node = lookup.node;
                                        } catch (e) {
                                          // ignore
                                        }
                                      }
                                      // perhaps we need to create the node
                                      var created = false;
                                      if ((flags & 64)) {
                                        if (node) {
                                          // if O_CREAT and O_EXCL are set, error out if the node already exists
                                          if ((flags & 128)) {
                                            throw new FS.ErrnoError(20);
                                          }
                                        } else {
                                          // node doesn't exist, try to create it
                                          node = FS.mknod(path, mode, 0);
                                          created = true;
                                        }
                                      }
                                      if (!node) {
                                        throw new FS.ErrnoError(44);
                                      }
                                      // can't truncate a device
                                      if (FS.isChrdev(node.mode)) {
                                        flags &= ~512;
                                      }
                                      // if asked only for a directory, then this must be one
                                      if ((flags & 65536) && !FS.isDir(node.mode)) {
                                        throw new FS.ErrnoError(54);
                                      }
                                      // check permissions, if this is not a file we just created now (it is ok to
                                      // create and write to a file with read-only permissions; it is read-only
                                      // for later use)
                                      if (!created) {
                                        var errCode = FS.mayOpen(node, flags);
                                        if (errCode) {
                                          throw new FS.ErrnoError(errCode);
                                        }
                                      }
                                      
                                      // we've already handled these, don't pass down to the underlying vfs
                                      flags &= ~(128 | 512 | 131072);
                                
                                      // register the stream with the filesystem
                                      var stream = FS.createStream({
                                        node: node,
                                        path: FS.getPath(node),  // we want the absolute path to the node
                                        flags: flags,
                                        seekable: true,
                                        position: 0,
                                        stream_ops: node.stream_ops,
                                        // used by the file family libc calls (fopen, fwrite, ferror, etc.)
                                        ungotten: [],
                                        error: false
                                      }, fd_start, fd_end);
                                      // call the new stream's open function
                                      if (stream.stream_ops.open) {
                                        stream.stream_ops.open(stream);
                                      }
                                      if (Module['logReadFiles'] && !(flags & 1)) {
                                        if (!FS.readFiles) FS.readFiles = {};
                                        if (!(path in FS.readFiles)) {
                                          FS.readFiles[path] = 1;
                                          err("FS.trackingDelegate error on read file: " + path);
                                        }
                                      }
                                      try {
                                        if (FS.trackingDelegate['onOpenFile']) {
                                          var trackingFlags = 0;
                                          if ((flags & 2097155) !== 1) {
                                            trackingFlags |= FS.tracking.openFlags.READ;
                                          }
                                          if ((flags & 2097155) !== 0) {
                                            trackingFlags |= FS.tracking.openFlags.WRITE;
                                          }
                                          FS.trackingDelegate['onOpenFile'](path, trackingFlags);
                                        }
                                      } catch(e) {
                                        err("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: " + e.message);
                                      }
                                      return stream;
                                    },close:function(stream) {
                                      if (FS.isClosed(stream)) {
                                        throw new FS.ErrnoError(8);
                                      }
                                      if (stream.getdents) stream.getdents = null; // free readdir state
                                      try {
                                        if (stream.stream_ops.close) {
                                          stream.stream_ops.close(stream);
                                        }
                                      } catch (e) {
                                        throw e;
                                      } finally {
                                        FS.closeStream(stream.fd);
                                      }
                                      stream.fd = null;
                                    },isClosed:function(stream) {
                                      return stream.fd === null;
                                    },llseek:function(stream, offset, whence) {
                                      if (FS.isClosed(stream)) {
                                        throw new FS.ErrnoError(8);
                                      }
                                      if (!stream.seekable || !stream.stream_ops.llseek) {
                                        throw new FS.ErrnoError(70);
                                      }
                                      if (whence != 0 && whence != 1 && whence != 2) {
                                        throw new FS.ErrnoError(28);
                                      }
                                      stream.position = stream.stream_ops.llseek(stream, offset, whence);
                                      stream.ungotten = [];
                                      return stream.position;
                                    },read:function(stream, buffer, offset, length, position) {
                                      if (length < 0 || position < 0) {
                                        throw new FS.ErrnoError(28);
                                      }
                                      if (FS.isClosed(stream)) {
                                        throw new FS.ErrnoError(8);
                                      }
                                      if ((stream.flags & 2097155) === 1) {
                                        throw new FS.ErrnoError(8);
                                      }
                                      if (FS.isDir(stream.node.mode)) {
                                        throw new FS.ErrnoError(31);
                                      }
                                      if (!stream.stream_ops.read) {
                                        throw new FS.ErrnoError(28);
                                      }
                                      var seeking = typeof position !== 'undefined';
                                      if (!seeking) {
                                        position = stream.position;
                                      } else if (!stream.seekable) {
                                        throw new FS.ErrnoError(70);
                                      }
                                      var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
                                      if (!seeking) stream.position += bytesRead;
                                      return bytesRead;
                                    },write:function(stream, buffer, offset, length, position, canOwn) {
                                      if (length < 0 || position < 0) {
                                        throw new FS.ErrnoError(28);
                                      }
                                      if (FS.isClosed(stream)) {
                                        throw new FS.ErrnoError(8);
                                      }
                                      if ((stream.flags & 2097155) === 0) {
                                        throw new FS.ErrnoError(8);
                                      }
                                      if (FS.isDir(stream.node.mode)) {
                                        throw new FS.ErrnoError(31);
                                      }
                                      if (!stream.stream_ops.write) {
                                        throw new FS.ErrnoError(28);
                                      }
                                      if (stream.seekable && stream.flags & 1024) {
                                        // seek to the end before writing in append mode
                                        FS.llseek(stream, 0, 2);
                                      }
                                      var seeking = typeof position !== 'undefined';
                                      if (!seeking) {
                                        position = stream.position;
                                      } else if (!stream.seekable) {
                                        throw new FS.ErrnoError(70);
                                      }
                                      var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
                                      if (!seeking) stream.position += bytesWritten;
                                      try {
                                        if (stream.path && FS.trackingDelegate['onWriteToFile']) FS.trackingDelegate['onWriteToFile'](stream.path);
                                      } catch(e) {
                                        err("FS.trackingDelegate['onWriteToFile']('"+stream.path+"') threw an exception: " + e.message);
                                      }
                                      return bytesWritten;
                                    },readFile:function(path, opts) {
                                      opts = opts || {};
                                      opts.flags = opts.flags || 0;
                                      opts.encoding = opts.encoding || 'binary';
                                      if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
                                        throw new Error('Invalid encoding type "' + opts.encoding + '"');
                                      }
                                      var ret;
                                      var stream = FS.open(path, opts.flags);
                                      var stat = FS.stat(path);
                                      var length = stat.size;
                                      var buf = new Uint8Array(length);
                                      FS.read(stream, buf, 0, length, 0);
                                      if (opts.encoding === 'utf8') {
                                        ret = UTF8ArrayToString(buf, 0);
                                      } else if (opts.encoding === 'binary') {
                                        ret = buf;
                                      }
                                      FS.close(stream);
                                      return ret;
                                    },cwd:function() {
                                      return FS.currentPath;
                                    },createDefaultDirectories:function() {
                                      FS.mkdir('/tmp');
                                      FS.mkdir('/home');
                                      FS.mkdir('/home/web_user');
                                    },createDefaultDevices:function() {
                                      // create /dev
                                      FS.mkdir('/dev');
                                      // setup /dev/null
                                      FS.registerDevice(FS.makedev(1, 3), {
                                        read: function() { return 0; },
                                        write: function(stream, buffer, offset, length, pos) { return length; }
                                      });
                                      FS.mkdev('/dev/null', FS.makedev(1, 3));
                                      // setup /dev/tty and /dev/tty1
                                      // stderr needs to print output using err() rather than out()
                                      // so we register a second tty just for it.
                                      TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
                                      TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
                                      FS.mkdev('/dev/tty', FS.makedev(5, 0));
                                      FS.mkdev('/dev/tty1', FS.makedev(6, 0));
                                      // setup /dev/[u]random
                                      var random_device = getRandomDevice();
                                      FS.createDevice('/dev', 'random', random_device);
                                      FS.createDevice('/dev', 'urandom', random_device);
                                      // we're not going to emulate the actual shm device,
                                      // just create the tmp dirs that reside in it commonly
                                      FS.mkdir('/dev/shm');
                                      FS.mkdir('/dev/shm/tmp');
                                    },createStandardStreams:function() {
                                      // TODO deprecate the old functionality of a single
                                      // input / output callback and that utilizes FS.createDevice
                                      // and instead require a unique set of stream ops
                                
                                      // by default, we symlink the standard streams to the
                                      // default tty devices. however, if the standard streams
                                      // have been overwritten we create a unique device for
                                      // them instead.
                                      if (Module['stdin']) {
                                        FS.createDevice('/dev', 'stdin', Module['stdin']);
                                      } else {
                                        FS.symlink('/dev/tty', '/dev/stdin');
                                      }
                                      if (Module['stdout']) {
                                        FS.createDevice('/dev', 'stdout', null, Module['stdout']);
                                      } else {
                                        FS.symlink('/dev/tty', '/dev/stdout');
                                      }
                                      if (Module['stderr']) {
                                        FS.createDevice('/dev', 'stderr', null, Module['stderr']);
                                      } else {
                                        FS.symlink('/dev/tty1', '/dev/stderr');
                                      }
                                
                                      // open default streams for the stdin, stdout and stderr devices
                                      var stdin = FS.open('/dev/stdin', 0);
                                      var stdout = FS.open('/dev/stdout', 1);
                                      var stderr = FS.open('/dev/stderr', 1);
                                    },ensureErrnoError:function() {
                                      if (FS.ErrnoError) return;
                                      FS.ErrnoError = /** @this{Object} */ function ErrnoError(errno, node) {
                                        this.node = node;
                                        this.setErrno = /** @this{Object} */ function(errno) {
                                          this.errno = errno;
                                        };
                                        this.setErrno(errno);
                                        this.message = 'FS error';
                                
                                      };
                                      FS.ErrnoError.prototype = new Error();
                                      FS.ErrnoError.prototype.constructor = FS.ErrnoError;
                                      // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
                                      [44].forEach(function(code) {
                                        FS.genericErrors[code] = new FS.ErrnoError(code);
                                        FS.genericErrors[code].stack = '<generic error, no stack>';
                                      });
                                    },staticInit:function() {
                                      FS.ensureErrnoError();
                                
                                      FS.nameTable = new Array(4096);
                                
                                      FS.mount(MEMFS, {}, '/');
                                
                                      FS.createDefaultDirectories();
                                      FS.createDefaultDevices();
                                
                                      FS.filesystems = {
                                        'MEMFS': MEMFS,
                                      };
                                    },init:function(input, output, error) {
                                      FS.init.initialized = true;
                                
                                      FS.ensureErrnoError();
                                
                                      // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
                                      Module['stdin'] = input || Module['stdin'];
                                      Module['stdout'] = output || Module['stdout'];
                                      Module['stderr'] = error || Module['stderr'];
                                
                                      FS.createStandardStreams();
                                    },getMode:function(canRead, canWrite) {
                                      var mode = 0;
                                      if (canRead) mode |= 292 | 73;
                                      if (canWrite) mode |= 146;
                                      return mode;
                                    },createPath:function(parent, path, canRead, canWrite) {
                                      parent = typeof parent === 'string' ? parent : FS.getPath(parent);
                                      var parts = path.split('/').reverse();
                                      while (parts.length) {
                                        var part = parts.pop();
                                        if (!part) continue;
                                        var current = PATH.join2(parent, part);
                                        try {
                                          FS.mkdir(current);
                                        } catch (e) {
                                          // ignore EEXIST
                                        }
                                        parent = current;
                                      }
                                      return current;
                                    },createDataFile:function(parent, name, data, canRead, canWrite, canOwn) {
                                      var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
                                      var mode = FS.getMode(canRead, canWrite);
                                      var node = FS.create(path, mode);
                                      if (data) {
                                        if (typeof data === 'string') {
                                          var arr = new Array(data.length);
                                          for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
                                          data = arr;
                                        }
                                        // make sure we can write to the file
                                        FS.chmod(node, mode | 146);
                                        var stream = FS.open(node, 577);
                                        FS.write(stream, data, 0, data.length, 0, canOwn);
                                        FS.close(stream);
                                        FS.chmod(node, mode);
                                      }
                                      return node;
                                    },createDevice:function(parent, name, input, output) {
                                      var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
                                      var mode = FS.getMode(!!input, !!output);
                                      if (!FS.createDevice.major) FS.createDevice.major = 64;
                                      var dev = FS.makedev(FS.createDevice.major++, 0);
                                      // Create a fake device that a set of stream ops to emulate
                                      // the old behavior.
                                      FS.registerDevice(dev, {
                                        open: function(stream) {
                                          stream.seekable = false;
                                        },
                                        close: function(stream) {
                                          // flush any pending line data
                                          if (output && output.buffer && output.buffer.length) {
                                            output(10);
                                          }
                                        },
                                        read: function(stream, buffer, offset, length, pos /* ignored */) {
                                          var bytesRead = 0;
                                          for (var i = 0; i < length; i++) {
                                            var result;
                                            try {
                                              result = input();
                                            } catch (e) {
                                              throw new FS.ErrnoError(29);
                                            }
                                            if (result === undefined && bytesRead === 0) {
                                              throw new FS.ErrnoError(6);
                                            }
                                            if (result === null || result === undefined) break;
                                            bytesRead++;
                                            buffer[offset+i] = result;
                                          }
                                          if (bytesRead) {
                                            stream.node.timestamp = Date.now();
                                          }
                                          return bytesRead;
                                        },
                                        write: function(stream, buffer, offset, length, pos) {
                                          for (var i = 0; i < length; i++) {
                                            try {
                                              output(buffer[offset+i]);
                                            } catch (e) {
                                              throw new FS.ErrnoError(29);
                                            }
                                          }
                                          if (length) {
                                            stream.node.timestamp = Date.now();
                                          }
                                          return i;
                                        }
                                      });
                                      return FS.mkdev(path, mode, dev);
                                    }};
                                    
                                var SYSCALLS={
                                  doReadv:function(stream, iov, iovcnt, offset) {
                                      var ret = 0;
                                      for (var i = 0; i < iovcnt; i++) {
                                        var ptr = HEAP32[(((iov)+(i*8))>>2)];
                                        var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
                                        var curr = FS.read(stream, HEAP8,ptr, len, offset);
                                        if (curr < 0) return -1;
                                        ret += curr;
                                        if (curr < len) break; // nothing more to read
                                      }
                                      return ret;
                                  },doWritev:function(stream, iov, iovcnt, offset) {
                                    var ret = 0;
                                    for (var i = 0; i < iovcnt; i++) {
                                      var ptr = HEAP32[(((iov)+(i*8))>>2)];
                                      var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
                                      var curr = FS.write(stream, HEAP8,ptr, len, offset);
                                      if (curr < 0) return -1;
                                      ret += curr;
                                    }
                                    return ret;
                                  },varargs:undefined,get:function() {
                                    SYSCALLS.varargs += 4;
                                    var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
                                    return ret;
                                  },getStr:function(ptr) {
                                    var ret = UTF8ToString(ptr);
                                    return ret;
                                  },getStreamFromFD:function(fd) {
                                    var stream = FS.getStream(fd);
                                    if (!stream) throw new FS.ErrnoError(8);
                                    return stream;
                                }};
      
                                function ___sys_open(path, flags, varargs) {SYSCALLS.varargs = varargs;
                                try {
                                
                                    var pathname = SYSCALLS.getStr(path);
                                    var mode = varargs ? SYSCALLS.get() : 0;
                                    var stream = FS.open(pathname, flags, mode);
                                    return stream.fd;
                                  } catch (e) {
                                  if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
                                  return -e.errno;
                                }
                                }
      
                                function _abort() {
                                  abort();
                                }
      
                                function _emscripten_memcpy_big(dest, src, num) {
                                    HEAPU8.copyWithin(dest, src, src + num);
                                }
                              
                                function _fd_close(fd) {try {
                                
                                    var stream = SYSCALLS.getStreamFromFD(fd);
                                    FS.close(stream);
                                    return 0;
                                  } catch (e) {
                                  if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
                                  return e.errno;
                                }
                                }
      
                                function _fd_read(fd, iov, iovcnt, pnum) {try {
                                
                                    var stream = SYSCALLS.getStreamFromFD(fd);
                                    var num = SYSCALLS.doReadv(stream, iov, iovcnt);
                                    HEAP32[((pnum)>>2)] = num
                                    return 0;
                                  } catch (e) {
                                  if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
                                  return e.errno;
                                }
                                }
      
                                function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {try {
                                
                                    
                                    var stream = SYSCALLS.getStreamFromFD(fd);
                                    var HIGH_OFFSET = 0x100000000; // 2^32
                                    // use an unsigned operator on low and shift high by 32-bits
                                    var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
                                
                                    var DOUBLE_LIMIT = 0x20000000000000; // 2^53
                                    // we also check for equality since DOUBLE_LIMIT + 1 == DOUBLE_LIMIT
                                    if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
                                      return -61;
                                    }
                                
                                    FS.llseek(stream, offset, whence);
                                    (tempI64 = [stream.position>>>0,(tempDouble=stream.position,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((newOffset)>>2)] = tempI64[0],HEAP32[(((newOffset)+(4))>>2)] = tempI64[1]);
                                    if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
                                    return 0;
                                  } catch (e) {
                                  if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
                                  return e.errno;
                                }
                                }
      
                                function _fd_write(fd, iov, iovcnt, pnum) {try {
                                
                                    var stream = SYSCALLS.getStreamFromFD(fd);
                                    var num = SYSCALLS.doWritev(stream, iov, iovcnt);
                                    HEAP32[((pnum)>>2)] = num
                                    return 0;
                                  } catch (e) {
                                  if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
                                  return e.errno;
                                }
                                }

                                function _system(command) {
                                    // int system(const char *command);
                                    // http://pubs.opengroup.org/onlinepubs/000095399/functions/system.html
                                    // Can't call external programs.
                                    if (!command) return 0; // no shell available
                                    setErrNo(52);
                                    return -1;
                                  }
                                Module["_system"] = _system;
      
                              var FSNode = /** @constructor */ function(parent, name, mode, rdev) {
                                  if (!parent) {
                                    parent = this;  // root node sets parent to itself
                                  }
                                  this.parent = parent;
                                  this.mount = parent.mount;
                                  this.mounted = null;
                                  this.id = FS.nextInode++;
                                  this.name = name;
                                  this.mode = mode;
                                  this.node_ops = {};
                                  this.stream_ops = {};
                                  this.rdev = rdev;
                                };
                                FS.FSNode = FSNode;
                                FS.staticInit();Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createDevice"] = FS.createDevice;Module["FS_unlink"] = FS.unlink;;
                              
      
                              /** @type {function(string, boolean=, number=)} */
                              function intArrayFromString(stringy, dontAddNull, length) {
                                var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
                                var u8array = new Array(len);
                                var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
                                if (dontAddNull) u8array.length = numBytesWritten;
                                return u8array;
                              }
      
                              var asmLibraryArg = {
                                "__cxa_atexit": () => {},
                                "__sys_fcntl64":() => {},
                                "__sys_ioctl":() => {},
                                "__sys_open": ___sys_open,
                                "abort": _abort,
                                "emscripten_memcpy_big": _emscripten_memcpy_big,
                                "emscripten_resize_heap": () => {},
                                "environ_get": () => {},
                                "environ_sizes_get": () => {},
                                "fd_close": _fd_close,
                                "fd_read": _fd_read,
                                "fd_seek": _fd_seek,
                                "fd_write": _fd_write,
                                "setTempRet0": () => {},
                                "strftime_l": () => {},
                                "system": _system,
                                proc_exit: () => { },
                                emscripten_notify_memory_growth: () => {}
                              };

                              var asm = createWasm();
                              /** @type {function(...*):?} */
                              var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
                                return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["__wasm_call_ctors"]).apply(null, arguments);
                              };
      
                              /** @type {function(...*):?} */
                              var _main = Module["_main"] = function() {
                                return (_main = Module["_main"] = Module["asm"]["main"]).apply(null, arguments);
                              };
      
                              /** @type {function(...*):?} */
                              var ___errno_location = Module["___errno_location"] = function() {
                                return (___errno_location = Module["___errno_location"] = Module["asm"]["__errno_location"]).apply(null, arguments);
                              };
      
                              /** @type {function(...*):?} */
                              var _malloc = Module["_malloc"] = function() {
                                return (_malloc = Module["_malloc"] = Module["asm"]["malloc"]).apply(null, arguments);
                              };
                              // === Auto-generated postamble setup entry stuff ===
      
                              Module["addRunDependency"] = addRunDependency;
                              Module["removeRunDependency"] = removeRunDependency;
                              Module["FS_createPath"] = FS.createPath;
                              Module["FS_createDataFile"] = FS.createDataFile;
                              Module["FS_createDevice"] = FS.createDevice;
                              Module["FS_unlink"] = FS.unlink;
      
                              var calledRun;
      
                              /**
                              * @constructor
                              * @this {ExitStatus}
                              */
                              function ExitStatus(status) {
                                this.name = "ExitStatus";
                                this.message = "Program terminated with exit(" + status + ")";
                                this.status = status;
                              }
      
      
                              dependenciesFulfilled = function runCaller() {
                                // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
                                if (!calledRun) run();
                                if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
                              };
      
                              function callMain(args) {
      
                                var entryFunction = Module['_main'];
      
                                var argc = 0;
                                var argv = 0;
      
                                try {
      
                                  var ret = entryFunction(argc, argv);
      
                                  // In PROXY_TO_PTHREAD builds, we should never exit the runtime below, as
                                  // execution is asynchronously handed off to a pthread.
                                    // if we're not running an evented main loop, it's time to exit
                                    exit(ret, /* implicit = */ true);
                                }
                                catch(e) {
                                  if (e instanceof ExitStatus) {
                                    // exit() throws this once it's done to make sure execution
                                    // has been stopped completely
                                    return;
                                  } else if (e == 'unwind') {
                                    // running an evented main loop, don't immediately exit
                                    return;
                                  } else {
                                    var toLog = e;
                                    if (e && typeof e === 'object' && e.stack) {
                                      toLog = [e, e.stack];
                                    }
                                    err('exception thrown: ' + toLog);
                                    quit_(1, e);
                                  }
                                }
                              }
      
                              /** @type {function(Array=)} */
                              function run(args) {
                                args = args || arguments_;
      
                                if (runDependencies > 0) {
                                  return;
                                }
      
                                preRun();
      
                                // a preRun added a dependency, run will be called later
                                if (runDependencies > 0) {
                                  return;
                                }
      
                                function doRun() {
                                  // run may have just been called through dependencies being fulfilled just in this very frame,
                                  // or while the async setStatus time below was happening
                                  if (calledRun) return;
                                  calledRun = true;
                                  Module['calledRun'] = true;
      
                                  if (ABORT) return;
      
                                  initRuntime();
      
                                  preMain();
      
                                  if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();
      
                                  if (shouldRunNow) callMain(args);
      
                                  postRun();
                                }
      
                                if (Module['setStatus']) {
                                  Module['setStatus']('Running...');
                                  setTimeout(function() {
                                    setTimeout(function() {
                                      Module['setStatus']('');
                                    }, 1);
                                    doRun();
                                  }, 1);
                                } else
                                {
                                  doRun();
                                }
                                
                                  resolve(salida);
                                
                              }
                              Module['run'] = run;
      
                              /** @param {boolean|number=} implicit */
                              function exit(status, implicit) {
                                EXITSTATUS = status;
      
                                // if this is just main exit-ing implicitly, and the status is 0, then we
                                // don't need to do anything here and can just leave. if the status is
                                // non-zero, though, then we need to report it.
                                // (we may have warned about this earlier, if a situation justifies doing so)
                                if (implicit && keepRuntimeAlive() && status === 0) {
                                  return;
                                }
      
                                if (keepRuntimeAlive()) {
                                } else {
      
                                  exitRuntime();
      
                                  if (Module['onExit']) Module['onExit'](status);
      
                                  ABORT = true;
                                }
      
                                quit_(status, new ExitStatus(status));
                              }
      
                              if (Module['preInit']) {
                                if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
                                while (Module['preInit'].length > 0) {
                                  Module['preInit'].pop()();
                                }
                              }
      
                              // shouldRunNow refers to calling main(), not run().
                              var shouldRunNow = true;
      
                              if (Module['noInitialRun']) shouldRunNow = false;
      
                              run();
                              });
                            }

                            function comparar(salida,output){
                              var iguales = true;

                              if(salida.length != output.length){
                                return false;
                              }
                              else{
                                for(let i = 0; i < output.length && iguales; i++){
                                  if(output[i] != salida[i]){
                                    iguales = false;
                                  }
                                }
                              }

                              return iguales;
                            }

                            async function execution(){
                              var nSamples;
                              nSamples = await getNumSamples();
                              
                              $("#comprobando").text("Comprobados 0 de " + nSamples + " casos");
                              //Poner numero de correctos
                              $("#compilando").css("display", "none");
                              $("#comprobando").css("display", "flex");
                              let correctos = 0;
                              let comprobados = 0;
                              
                              //todo el bucle y demas

                              for(var sampleActual = 1; sampleActual <= nSamples; sampleActual++){
                                var output = getOutput(sampleActual);
                                //await input
                                var input = await getInput(sampleActual);
                                
                                //ejecucion del cpp
                                var salida = await getSalida(input);
                                
                                //await del output
                                var output2 = await output;
                                output2 = output2.split('\n');
                                output2.pop();

                                var respuesta = comparar(salida,output2);
                                if(respuesta){ 
                                  correctos++;
                                }
                                comprobados++;
                                $("#comprobando").text("Comprobados "+comprobados+" de " + nSamples + " casos");
                              }
                            $("#comprobando").css("display", "none");
                            $("#solucion").text("Correctos "+correctos+" de " + nSamples + " casos");
                            $("#solucion").css("display", "flex");
                            if(correctos == nSamples){
                              $("#ventanaSalida").css("background-color", "rgb(91, 247, 143)");
                            }
                            else{
                              $("#ventanaSalida").css("background-color", "rgb(250, 81, 81)");
                            }
                            $("#botonOkTest").prop("disabled",false);
                            $("#botonOkTest").css("background-color", "lightblue");
                            }
                            execution();
                        },
                        error: function(error) {
                            ventanaError();
                            $("#solucion").css("display", "none");
                            $("#botonOkTest").prop("disabled",false);
                            $("#compilando").text("ERROR DE COMPILACION");
                        },
                    });
                };
            }
            else{
              ventanaError();
              $("#solucion").text("Para hacer test SOLO ARCHIVOS C++ (EXTENSION .cpp)");
            }
          }
          else{
            ventanaError();
            $("#solucion").text("No has seleccionado ningun PROBLEMA");
          }
        }
        else{
          ventanaError();
          $("#solucion").text("No has seleccionado ningun ARCHIVO");
        }
    });

    function ventanaError(){
      $("#ventanaSalida").css("display", "block");
      $("#botonOkTest").css("display", "block");
      $("#botonOkTest").css("background-color", "lightblue");
      $("#ventanaSalida").css("background-color", "rgb(250, 81, 81)");
      $("#solucion").css("display", "flex");
    }
});
