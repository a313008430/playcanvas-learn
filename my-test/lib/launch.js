/* realtime/share.uncompressed.js */
(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
var textType = require('ot-text').type;
window.share = require('sharedb/lib/client');
window.share.types.register(textType);

// Copy below to node_modules/ot-text/lib/text.js bottom
/*

// Calculate the cursor position after the given operation
exports.applyToCursor = function (op) {
    var pos = 0;
    for (var i = 0; i < op.length; i++) {
        var c = op[i];
        switch (typeof c) {
            case 'number':
                pos += c;
                break;
            case 'string':
                pos += c.length;
                break;
            case 'object':
                //pos -= c.d;
                break;
        }
    }
    return pos;
};

// Generate an operation that semantically inverts the given operation
// when applied to the provided snapshot.
// It needs a snapshot of the document before the operation
// was applied to invert delete operations.
exports.semanticInvert = function (str, op) {
    if (typeof str !== 'string') {
        throw Error('Snapshot should be a string');
    }
    checkOp(op);

    // Save copy
    var originalOp = op.slice();

    // Shallow copy
    op = op.slice();

    var len = op.length;
    var cursor, prevOps, tmpStr;
    for (var i = 0; i < len; i++) {
        var c = op[i];
        switch (typeof c) {
            case 'number':
                // In case we have cursor movement we do nothing
                break;
            case 'string':
                // In case we have string insertion we generate a string deletion
                op[i] = {d: c.length};
                break;
            case 'object':
                // In case of a deletion we need to reinsert the deleted string
                prevOps = originalOp.slice(0, i);
                cursor = applyToCursor(prevOps);
                tmpStr = apply(str, trim(prevOps));
                op[i] = tmpStr.substring(cursor, cursor + c.d);
                break;
        }
    }

    return normalize(op);
};
* */

// Run "./node_modules/.bin/browserify buildme.js -o public/js/realtime/share.uncompressed.js"


},{"ot-text":9,"sharedb/lib/client":14}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],3:[function(require,module,exports){
// ISC @ Julien Fontanet

'use strict'

// ===================================================================

var construct = typeof Reflect !== 'undefined' ? Reflect.construct : undefined
var defineProperty = Object.defineProperty

// -------------------------------------------------------------------

var captureStackTrace = Error.captureStackTrace
if (captureStackTrace === undefined) {
  captureStackTrace = function captureStackTrace (error) {
    var container = new Error()

    defineProperty(error, 'stack', {
      configurable: true,
      get: function getStack () {
        var stack = container.stack

        // Replace property with value for faster future accesses.
        defineProperty(this, 'stack', {
          configurable: true,
          value: stack,
          writable: true
        })

        return stack
      },
      set: function setStack (stack) {
        defineProperty(error, 'stack', {
          configurable: true,
          value: stack,
          writable: true
        })
      }
    })
  }
}

// -------------------------------------------------------------------

function BaseError (message) {
  if (message !== undefined) {
    defineProperty(this, 'message', {
      configurable: true,
      value: message,
      writable: true
    })
  }

  var cname = this.constructor.name
  if (
    cname !== undefined &&
    cname !== this.name
  ) {
    defineProperty(this, 'name', {
      configurable: true,
      value: cname,
      writable: true
    })
  }

  captureStackTrace(this, this.constructor)
}

BaseError.prototype = Object.create(Error.prototype, {
  // See: https://github.com/JsCommunity/make-error/issues/4
  constructor: {
    configurable: true,
    value: BaseError,
    writable: true
  }
})

// -------------------------------------------------------------------

// Sets the name of a function if possible (depends of the JS engine).
var setFunctionName = (function () {
  function setFunctionName (fn, name) {
    return defineProperty(fn, 'name', {
      configurable: true,
      value: name
    })
  }
  try {
    var f = function () {}
    setFunctionName(f, 'foo')
    if (f.name === 'foo') {
      return setFunctionName
    }
  } catch (_) {}
})()

// -------------------------------------------------------------------

function makeError (constructor, super_) {
  if (super_ == null || super_ === Error) {
    super_ = BaseError
  } else if (typeof super_ !== 'function') {
    throw new TypeError('super_ should be a function')
  }

  var name
  if (typeof constructor === 'string') {
    name = constructor
    constructor = construct !== undefined
      ? function () { return construct(super_, arguments, constructor) }
      : function () { super_.apply(this, arguments) }

    // If the name can be set, do it once and for all.
    if (setFunctionName !== undefined) {
      setFunctionName(constructor, name)
      name = undefined
    }
  } else if (typeof constructor !== 'function') {
    throw new TypeError('constructor should be either a string or a function')
  }

  // Also register the super constructor also as `constructor.super_` just
  // like Node's `util.inherits()`.
  constructor.super_ = constructor['super'] = super_

  var properties = {
    constructor: {
      configurable: true,
      value: constructor,
      writable: true
    }
  }

  // If the name could not be set on the constructor, set it on the
  // prototype.
  if (name !== undefined) {
    properties.name = {
      configurable: true,
      value: name,
      writable: true
    }
  }
  constructor.prototype = Object.create(super_.prototype, properties)

  return constructor
}
exports = module.exports = makeError
exports.BaseError = BaseError

},{}],4:[function(require,module,exports){
// These methods let you build a transform function from a transformComponent
// function for OT types like JSON0 in which operations are lists of components
// and transforming them requires N^2 work. I find it kind of nasty that I need
// this, but I'm not really sure what a better solution is. Maybe I should do
// this automatically to types that don't have a compose function defined.

// Add transform and transformX functions for an OT type which has
// transformComponent defined.  transformComponent(destination array,
// component, other component, side)
module.exports = bootstrapTransform
function bootstrapTransform(type, transformComponent, checkValidOp, append) {
  var transformComponentX = function(left, right, destLeft, destRight) {
    transformComponent(destLeft, left, right, 'left');
    transformComponent(destRight, right, left, 'right');
  };

  var transformX = type.transformX = function(leftOp, rightOp) {
    checkValidOp(leftOp);
    checkValidOp(rightOp);
    var newRightOp = [];

    for (var i = 0; i < rightOp.length; i++) {
      var rightComponent = rightOp[i];

      // Generate newLeftOp by composing leftOp by rightComponent
      var newLeftOp = [];
      var k = 0;
      while (k < leftOp.length) {
        var nextC = [];
        transformComponentX(leftOp[k], rightComponent, newLeftOp, nextC);
        k++;

        if (nextC.length === 1) {
          rightComponent = nextC[0];
        } else if (nextC.length === 0) {
          for (var j = k; j < leftOp.length; j++) {
            append(newLeftOp, leftOp[j]);
          }
          rightComponent = null;
          break;
        } else {
          // Recurse.
          var pair = transformX(leftOp.slice(k), nextC);
          for (var l = 0; l < pair[0].length; l++) {
            append(newLeftOp, pair[0][l]);
          }
          for (var r = 0; r < pair[1].length; r++) {
            append(newRightOp, pair[1][r]);
          }
          rightComponent = null;
          break;
        }
      }

      if (rightComponent != null) {
        append(newRightOp, rightComponent);
      }
      leftOp = newLeftOp;
    }
    return [leftOp, newRightOp];
  };

  // Transforms op with specified type ('left' or 'right') by otherOp.
  type.transform = function(op, otherOp, type) {
    if (!(type === 'left' || type === 'right'))
      throw new Error("type must be 'left' or 'right'");

    if (otherOp.length === 0) return op;

    if (op.length === 1 && otherOp.length === 1)
      return transformComponent([], op[0], otherOp[0], type);

    if (type === 'left')
      return transformX(op, otherOp)[0];
    else
      return transformX(otherOp, op)[1];
  };
};

},{}],5:[function(require,module,exports){
// Only the JSON type is exported, because the text type is deprecated
// otherwise. (If you want to use it somewhere, you're welcome to pull it out
// into a separate module that json0 can depend on).

module.exports = {
  type: require('./json0')
};

},{"./json0":6}],6:[function(require,module,exports){
/*
 This is the implementation of the JSON OT type.

 Spec is here: https://github.com/josephg/ShareJS/wiki/JSON-Operations

 Note: This is being made obsolete. It will soon be replaced by the JSON2 type.
*/

/**
 * UTILITY FUNCTIONS
 */

/**
 * Checks if the passed object is an Array instance. Can't use Array.isArray
 * yet because its not supported on IE8.
 *
 * @param obj
 * @returns {boolean}
 */
var isArray = function(obj) {
  return Object.prototype.toString.call(obj) == '[object Array]';
};

/**
 * Checks if the passed object is an Object instance.
 * No function call (fast) version
 *
 * @param obj
 * @returns {boolean}
 */
var isObject = function(obj) {
  return (!!obj) && (obj.constructor === Object);
};

/**
 * Clones the passed object using JSON serialization (which is slow).
 *
 * hax, copied from test/types/json. Apparently this is still the fastest way
 * to deep clone an object, assuming we have browser support for JSON.  @see
 * http://jsperf.com/cloning-an-object/12
 */
var clone = function(o) {
  return JSON.parse(JSON.stringify(o));
};

/**
 * JSON OT Type
 * @type {*}
 */
var json = {
  name: 'json0',
  uri: 'http://sharejs.org/types/JSONv0'
};

// You can register another OT type as a subtype in a JSON document using
// the following function. This allows another type to handle certain
// operations instead of the builtin JSON type.
var subtypes = {};
json.registerSubtype = function(subtype) {
  subtypes[subtype.name] = subtype;
};

json.create = function(data) {
  // Null instead of undefined if you don't pass an argument.
  return data === undefined ? null : clone(data);
};

json.invertComponent = function(c) {
  var c_ = {p: c.p};

  // handle subtype ops
  if (c.t && subtypes[c.t]) {
    c_.t = c.t;
    c_.o = subtypes[c.t].invert(c.o);
  }

  if (c.si !== void 0) c_.sd = c.si;
  if (c.sd !== void 0) c_.si = c.sd;
  if (c.oi !== void 0) c_.od = c.oi;
  if (c.od !== void 0) c_.oi = c.od;
  if (c.li !== void 0) c_.ld = c.li;
  if (c.ld !== void 0) c_.li = c.ld;
  if (c.na !== void 0) c_.na = -c.na;

  if (c.lm !== void 0) {
    c_.lm = c.p[c.p.length-1];
    c_.p = c.p.slice(0,c.p.length-1).concat([c.lm]);
  }

  return c_;
};

json.invert = function(op) {
  var op_ = op.slice().reverse();
  var iop = [];
  for (var i = 0; i < op_.length; i++) {
    iop.push(json.invertComponent(op_[i]));
  }
  return iop;
};

json.checkValidOp = function(op) {
  for (var i = 0; i < op.length; i++) {
    if (!isArray(op[i].p)) throw new Error('Missing path');
  }
};

json.checkList = function(elem) {
  if (!isArray(elem))
    throw new Error('Referenced element not a list');
};

json.checkObj = function(elem) {
  if (!isObject(elem)) {
    throw new Error("Referenced element not an object (it was " + JSON.stringify(elem) + ")");
  }
};

// helper functions to convert old string ops to and from subtype ops
function convertFromText(c) {
  c.t = 'text0';
  var o = {p: c.p.pop()};
  if (c.si != null) o.i = c.si;
  if (c.sd != null) o.d = c.sd;
  c.o = [o];
}

function convertToText(c) {
  c.p.push(c.o[0].p);
  if (c.o[0].i != null) c.si = c.o[0].i;
  if (c.o[0].d != null) c.sd = c.o[0].d;
  delete c.t;
  delete c.o;
}

json.apply = function(snapshot, op) {
  json.checkValidOp(op);

  op = clone(op);

  var container = {
    data: snapshot
  };

  for (var i = 0; i < op.length; i++) {
    var c = op[i];

    // convert old string ops to use subtype for backwards compatibility
    if (c.si != null || c.sd != null)
      convertFromText(c);

    var parent = null;
    var parentKey = null;
    var elem = container;
    var key = 'data';

    for (var j = 0; j < c.p.length; j++) {
      var p = c.p[j];

      parent = elem;
      parentKey = key;
      elem = elem[key];
      key = p;

      if (parent == null)
        throw new Error('Path invalid');
    }

    // handle subtype ops
    if (c.t && c.o !== void 0 && subtypes[c.t]) {
      elem[key] = subtypes[c.t].apply(elem[key], c.o);

    // Number add
    } else if (c.na !== void 0) {
      if (typeof elem[key] != 'number')
        throw new Error('Referenced element not a number');

      elem[key] += c.na;
    }

    // List replace
    else if (c.li !== void 0 && c.ld !== void 0) {
      json.checkList(elem);
      // Should check the list element matches c.ld
      elem[key] = c.li;
    }

    // List insert
    else if (c.li !== void 0) {
      json.checkList(elem);
      elem.splice(key,0, c.li);
    }

    // List delete
    else if (c.ld !== void 0) {
      json.checkList(elem);
      // Should check the list element matches c.ld here too.
      elem.splice(key,1);
    }

    // List move
    else if (c.lm !== void 0) {
      json.checkList(elem);
      if (c.lm != key) {
        var e = elem[key];
        // Remove it...
        elem.splice(key,1);
        // And insert it back.
        elem.splice(c.lm,0,e);
      }
    }

    // Object insert / replace
    else if (c.oi !== void 0) {
      json.checkObj(elem);

      // Should check that elem[key] == c.od
      elem[key] = c.oi;
    }

    // Object delete
    else if (c.od !== void 0) {
      json.checkObj(elem);

      // Should check that elem[key] == c.od
      delete elem[key];
    }

    else {
      throw new Error('invalid / missing instruction in op');
    }
  }

  return container.data;
};

// Helper to break an operation up into a bunch of small ops.
json.shatter = function(op) {
  var results = [];
  for (var i = 0; i < op.length; i++) {
    results.push([op[i]]);
  }
  return results;
};

// Helper for incrementally applying an operation to a snapshot. Calls yield
// after each op component has been applied.
json.incrementalApply = function(snapshot, op, _yield) {
  for (var i = 0; i < op.length; i++) {
    var smallOp = [op[i]];
    snapshot = json.apply(snapshot, smallOp);
    // I'd just call this yield, but thats a reserved keyword. Bah!
    _yield(smallOp, snapshot);
  }

  return snapshot;
};

// Checks if two paths, p1 and p2 match.
var pathMatches = json.pathMatches = function(p1, p2, ignoreLast) {
  if (p1.length != p2.length)
    return false;

  for (var i = 0; i < p1.length; i++) {
    if (p1[i] !== p2[i] && (!ignoreLast || i !== p1.length - 1))
      return false;
  }

  return true;
};

json.append = function(dest,c) {
  c = clone(c);

  if (dest.length === 0) {
    dest.push(c);
    return;
  }

  var last = dest[dest.length - 1];

  // convert old string ops to use subtype for backwards compatibility
  if ((c.si != null || c.sd != null) && (last.si != null || last.sd != null)) {
    convertFromText(c);
    convertFromText(last);
  }

  if (pathMatches(c.p, last.p)) {
    // handle subtype ops
    if (c.t && last.t && c.t === last.t && subtypes[c.t]) {
      last.o = subtypes[c.t].compose(last.o, c.o);

      // convert back to old string ops
      if (c.si != null || c.sd != null) {
        var p = c.p;
        for (var i = 0; i < last.o.length - 1; i++) {
          c.o = [last.o.pop()];
          c.p = p.slice();
          convertToText(c);
          dest.push(c);
        }

        convertToText(last);
      }
    } else if (last.na != null && c.na != null) {
      dest[dest.length - 1] = {p: last.p, na: last.na + c.na};
    } else if (last.li !== undefined && c.li === undefined && c.ld === last.li) {
      // insert immediately followed by delete becomes a noop.
      if (last.ld !== undefined) {
        // leave the delete part of the replace
        delete last.li;
      } else {
        dest.pop();
      }
    } else if (last.od !== undefined && last.oi === undefined && c.oi !== undefined && c.od === undefined) {
      last.oi = c.oi;
    } else if (last.oi !== undefined && c.od !== undefined) {
      // The last path component inserted something that the new component deletes (or replaces).
      // Just merge them.
      if (c.oi !== undefined) {
        last.oi = c.oi;
      } else if (last.od !== undefined) {
        delete last.oi;
      } else {
        // An insert directly followed by a delete turns into a no-op and can be removed.
        dest.pop();
      }
    } else if (c.lm !== undefined && c.p[c.p.length - 1] === c.lm) {
      // don't do anything
    } else {
      dest.push(c);
    }
  } else {
    // convert string ops back
    if ((c.si != null || c.sd != null) && (last.si != null || last.sd != null)) {
      convertToText(c);
      convertToText(last);
    }

    dest.push(c);
  }
};

json.compose = function(op1,op2) {
  json.checkValidOp(op1);
  json.checkValidOp(op2);

  var newOp = clone(op1);

  for (var i = 0; i < op2.length; i++) {
    json.append(newOp,op2[i]);
  }

  return newOp;
};

json.normalize = function(op) {
  var newOp = [];

  op = isArray(op) ? op : [op];

  for (var i = 0; i < op.length; i++) {
    var c = op[i];
    if (c.p == null) c.p = [];

    json.append(newOp,c);
  }

  return newOp;
};

// Returns the common length of the paths of ops a and b
json.commonLengthForOps = function(a, b) {
  var alen = a.p.length;
  var blen = b.p.length;
  if (a.na != null || a.t)
    alen++;

  if (b.na != null || b.t)
    blen++;

  if (alen === 0) return -1;
  if (blen === 0) return null;

  alen--;
  blen--;

  for (var i = 0; i < alen; i++) {
    var p = a.p[i];
    if (i >= blen || p !== b.p[i])
      return null;
  }

  return alen;
};

// Returns true if an op can affect the given path
json.canOpAffectPath = function(op, path) {
  return json.commonLengthForOps({p:path}, op) != null;
};

// transform c so it applies to a document with otherC applied.
json.transformComponent = function(dest, c, otherC, type) {
  c = clone(c);

  var common = json.commonLengthForOps(otherC, c);
  var common2 = json.commonLengthForOps(c, otherC);
  var cplength = c.p.length;
  var otherCplength = otherC.p.length;

  if (c.na != null || c.t)
    cplength++;

  if (otherC.na != null || otherC.t)
    otherCplength++;

  // if c is deleting something, and that thing is changed by otherC, we need to
  // update c to reflect that change for invertibility.
  if (common2 != null && otherCplength > cplength && c.p[common2] == otherC.p[common2]) {
    if (c.ld !== void 0) {
      var oc = clone(otherC);
      oc.p = oc.p.slice(cplength);
      c.ld = json.apply(clone(c.ld),[oc]);
    } else if (c.od !== void 0) {
      var oc = clone(otherC);
      oc.p = oc.p.slice(cplength);
      c.od = json.apply(clone(c.od),[oc]);
    }
  }

  if (common != null) {
    var commonOperand = cplength == otherCplength;

    // backward compatibility for old string ops
    var oc = otherC;
    if ((c.si != null || c.sd != null) && (otherC.si != null || otherC.sd != null)) {
      convertFromText(c);
      oc = clone(otherC);
      convertFromText(oc);
    }

    // handle subtype ops
    if (oc.t && subtypes[oc.t]) {
      if (c.t && c.t === oc.t) {
        var res = subtypes[c.t].transform(c.o, oc.o, type);

        if (res.length > 0) {
          // convert back to old string ops
          if (c.si != null || c.sd != null) {
            var p = c.p;
            for (var i = 0; i < res.length; i++) {
              c.o = [res[i]];
              c.p = p.slice();
              convertToText(c);
              json.append(dest, c);
            }
          } else {
            c.o = res;
            json.append(dest, c);
          }
        }

        return dest;
      }
    }

    // transform based on otherC
    else if (otherC.na !== void 0) {
      // this case is handled below
    } else if (otherC.li !== void 0 && otherC.ld !== void 0) {
      if (otherC.p[common] === c.p[common]) {
        // noop

        if (!commonOperand) {
          return dest;
        } else if (c.ld !== void 0) {
          // we're trying to delete the same element, -> noop
          if (c.li !== void 0 && type === 'left') {
            // we're both replacing one element with another. only one can survive
            c.ld = clone(otherC.li);
          } else {
            return dest;
          }
        }
      }
    } else if (otherC.li !== void 0) {
      if (c.li !== void 0 && c.ld === undefined && commonOperand && c.p[common] === otherC.p[common]) {
        // in li vs. li, left wins.
        if (type === 'right')
          c.p[common]++;
      } else if (otherC.p[common] <= c.p[common]) {
        c.p[common]++;
      }

      if (c.lm !== void 0) {
        if (commonOperand) {
          // otherC edits the same list we edit
          if (otherC.p[common] <= c.lm)
            c.lm++;
          // changing c.from is handled above.
        }
      }
    } else if (otherC.ld !== void 0) {
      if (c.lm !== void 0) {
        if (commonOperand) {
          if (otherC.p[common] === c.p[common]) {
            // they deleted the thing we're trying to move
            return dest;
          }
          // otherC edits the same list we edit
          var p = otherC.p[common];
          var from = c.p[common];
          var to = c.lm;
          if (p < to || (p === to && from < to))
            c.lm--;

        }
      }

      if (otherC.p[common] < c.p[common]) {
        c.p[common]--;
      } else if (otherC.p[common] === c.p[common]) {
        if (otherCplength < cplength) {
          // we're below the deleted element, so -> noop
          return dest;
        } else if (c.ld !== void 0) {
          if (c.li !== void 0) {
            // we're replacing, they're deleting. we become an insert.
            delete c.ld;
          } else {
            // we're trying to delete the same element, -> noop
            return dest;
          }
        }
      }

    } else if (otherC.lm !== void 0) {
      if (c.lm !== void 0 && cplength === otherCplength) {
        // lm vs lm, here we go!
        var from = c.p[common];
        var to = c.lm;
        var otherFrom = otherC.p[common];
        var otherTo = otherC.lm;
        if (otherFrom !== otherTo) {
          // if otherFrom == otherTo, we don't need to change our op.

          // where did my thing go?
          if (from === otherFrom) {
            // they moved it! tie break.
            if (type === 'left') {
              c.p[common] = otherTo;
              if (from === to) // ugh
                c.lm = otherTo;
            } else {
              return dest;
            }
          } else {
            // they moved around it
            if (from > otherFrom) c.p[common]--;
            if (from > otherTo) c.p[common]++;
            else if (from === otherTo) {
              if (otherFrom > otherTo) {
                c.p[common]++;
                if (from === to) // ugh, again
                  c.lm++;
              }
            }

            // step 2: where am i going to put it?
            if (to > otherFrom) {
              c.lm--;
            } else if (to === otherFrom) {
              if (to > from)
                c.lm--;
            }
            if (to > otherTo) {
              c.lm++;
            } else if (to === otherTo) {
              // if we're both moving in the same direction, tie break
              if ((otherTo > otherFrom && to > from) ||
                  (otherTo < otherFrom && to < from)) {
                if (type === 'right') c.lm++;
              } else {
                if (to > from) c.lm++;
                else if (to === otherFrom) c.lm--;
              }
            }
          }
        }
      } else if (c.li !== void 0 && c.ld === undefined && commonOperand) {
        // li
        var from = otherC.p[common];
        var to = otherC.lm;
        p = c.p[common];
        if (p > from) c.p[common]--;
        if (p > to) c.p[common]++;
      } else {
        // ld, ld+li, si, sd, na, oi, od, oi+od, any li on an element beneath
        // the lm
        //
        // i.e. things care about where their item is after the move.
        var from = otherC.p[common];
        var to = otherC.lm;
        p = c.p[common];
        if (p === from) {
          c.p[common] = to;
        } else {
          if (p > from) c.p[common]--;
          if (p > to) c.p[common]++;
          else if (p === to && from > to) c.p[common]++;
        }
      }
    }
    else if (otherC.oi !== void 0 && otherC.od !== void 0) {
      if (c.p[common] === otherC.p[common]) {
        if (c.oi !== void 0 && commonOperand) {
          // we inserted where someone else replaced
          if (type === 'right') {
            // left wins
            return dest;
          } else {
            // we win, make our op replace what they inserted
            c.od = otherC.oi;
          }
        } else {
          // -> noop if the other component is deleting the same object (or any parent)
          return dest;
        }
      }
    } else if (otherC.oi !== void 0) {
      if (c.oi !== void 0 && c.p[common] === otherC.p[common]) {
        // left wins if we try to insert at the same place
        if (type === 'left') {
          json.append(dest,{p: c.p, od:otherC.oi});
        } else {
          return dest;
        }
      }
    } else if (otherC.od !== void 0) {
      if (c.p[common] == otherC.p[common]) {
        if (!commonOperand)
          return dest;
        if (c.oi !== void 0) {
          delete c.od;
        } else {
          return dest;
        }
      }
    }
  }

  json.append(dest,c);
  return dest;
};

require('./bootstrapTransform')(json, json.transformComponent, json.checkValidOp, json.append);

/**
 * Register a subtype for string operations, using the text0 type.
 */
var text = require('./text0');

json.registerSubtype(text);
module.exports = json;


},{"./bootstrapTransform":4,"./text0":7}],7:[function(require,module,exports){
// DEPRECATED!
//
// This type works, but is not exported. Its included here because the JSON0
// embedded string operations use this library.


// A simple text implementation
//
// Operations are lists of components. Each component either inserts or deletes
// at a specified position in the document.
//
// Components are either:
//  {i:'str', p:100}: Insert 'str' at position 100 in the document
//  {d:'str', p:100}: Delete 'str' at position 100 in the document
//
// Components in an operation are executed sequentially, so the position of components
// assumes previous components have already executed.
//
// Eg: This op:
//   [{i:'abc', p:0}]
// is equivalent to this op:
//   [{i:'a', p:0}, {i:'b', p:1}, {i:'c', p:2}]

var text = module.exports = {
  name: 'text0',
  uri: 'http://sharejs.org/types/textv0',
  create: function(initial) {
    if ((initial != null) && typeof initial !== 'string') {
      throw new Error('Initial data must be a string');
    }
    return initial || '';
  }
};

/** Insert s2 into s1 at pos. */
var strInject = function(s1, pos, s2) {
  return s1.slice(0, pos) + s2 + s1.slice(pos);
};

/** Check that an operation component is valid. Throws if its invalid. */
var checkValidComponent = function(c) {
  if (typeof c.p !== 'number')
    throw new Error('component missing position field');

  if ((typeof c.i === 'string') === (typeof c.d === 'string'))
    throw new Error('component needs an i or d field');

  if (c.p < 0)
    throw new Error('position cannot be negative');
};

/** Check that an operation is valid */
var checkValidOp = function(op) {
  for (var i = 0; i < op.length; i++) {
    checkValidComponent(op[i]);
  }
};

/** Apply op to snapshot */
text.apply = function(snapshot, op) {
  var deleted;

  checkValidOp(op);
  for (var i = 0; i < op.length; i++) {
    var component = op[i];
    if (component.i != null) {
      snapshot = strInject(snapshot, component.p, component.i);
    } else {
      deleted = snapshot.slice(component.p, component.p + component.d.length);
      if (component.d !== deleted)
        throw new Error("Delete component '" + component.d + "' does not match deleted text '" + deleted + "'");

      snapshot = snapshot.slice(0, component.p) + snapshot.slice(component.p + component.d.length);
    }
  }
  return snapshot;
};

/**
 * Append a component to the end of newOp. Exported for use by the random op
 * generator and the JSON0 type.
 */
var append = text._append = function(newOp, c) {
  if (c.i === '' || c.d === '') return;

  if (newOp.length === 0) {
    newOp.push(c);
  } else {
    var last = newOp[newOp.length - 1];

    if (last.i != null && c.i != null && last.p <= c.p && c.p <= last.p + last.i.length) {
      // Compose the insert into the previous insert
      newOp[newOp.length - 1] = {i:strInject(last.i, c.p - last.p, c.i), p:last.p};

    } else if (last.d != null && c.d != null && c.p <= last.p && last.p <= c.p + c.d.length) {
      // Compose the deletes together
      newOp[newOp.length - 1] = {d:strInject(c.d, last.p - c.p, last.d), p:c.p};

    } else {
      newOp.push(c);
    }
  }
};

/** Compose op1 and op2 together */
text.compose = function(op1, op2) {
  checkValidOp(op1);
  checkValidOp(op2);
  var newOp = op1.slice();
  for (var i = 0; i < op2.length; i++) {
    append(newOp, op2[i]);
  }
  return newOp;
};

/** Clean up an op */
text.normalize = function(op) {
  var newOp = [];

  // Normalize should allow ops which are a single (unwrapped) component:
  // {i:'asdf', p:23}.
  // There's no good way to test if something is an array:
  // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
  // so this is probably the least bad solution.
  if (op.i != null || op.p != null) op = [op];

  for (var i = 0; i < op.length; i++) {
    var c = op[i];
    if (c.p == null) c.p = 0;

    append(newOp, c);
  }

  return newOp;
};

// This helper method transforms a position by an op component.
//
// If c is an insert, insertAfter specifies whether the transform
// is pushed after the insert (true) or before it (false).
//
// insertAfter is optional for deletes.
var transformPosition = function(pos, c, insertAfter) {
  // This will get collapsed into a giant ternary by uglify.
  if (c.i != null) {
    if (c.p < pos || (c.p === pos && insertAfter)) {
      return pos + c.i.length;
    } else {
      return pos;
    }
  } else {
    // I think this could also be written as: Math.min(c.p, Math.min(c.p -
    // otherC.p, otherC.d.length)) but I think its harder to read that way, and
    // it compiles using ternary operators anyway so its no slower written like
    // this.
    if (pos <= c.p) {
      return pos;
    } else if (pos <= c.p + c.d.length) {
      return c.p;
    } else {
      return pos - c.d.length;
    }
  }
};

// Helper method to transform a cursor position as a result of an op.
//
// Like transformPosition above, if c is an insert, insertAfter specifies
// whether the cursor position is pushed after an insert (true) or before it
// (false).
text.transformCursor = function(position, op, side) {
  var insertAfter = side === 'right';
  for (var i = 0; i < op.length; i++) {
    position = transformPosition(position, op[i], insertAfter);
  }

  return position;
};

// Transform an op component by another op component. Asymmetric.
// The result will be appended to destination.
//
// exported for use in JSON type
var transformComponent = text._tc = function(dest, c, otherC, side) {
  //var cIntersect, intersectEnd, intersectStart, newC, otherIntersect, s;

  checkValidComponent(c);
  checkValidComponent(otherC);

  if (c.i != null) {
    // Insert.
    append(dest, {i:c.i, p:transformPosition(c.p, otherC, side === 'right')});
  } else {
    // Delete
    if (otherC.i != null) {
      // Delete vs insert
      var s = c.d;
      if (c.p < otherC.p) {
        append(dest, {d:s.slice(0, otherC.p - c.p), p:c.p});
        s = s.slice(otherC.p - c.p);
      }
      if (s !== '')
        append(dest, {d: s, p: c.p + otherC.i.length});

    } else {
      // Delete vs delete
      if (c.p >= otherC.p + otherC.d.length)
        append(dest, {d: c.d, p: c.p - otherC.d.length});
      else if (c.p + c.d.length <= otherC.p)
        append(dest, c);
      else {
        // They overlap somewhere.
        var newC = {d: '', p: c.p};

        if (c.p < otherC.p)
          newC.d = c.d.slice(0, otherC.p - c.p);

        if (c.p + c.d.length > otherC.p + otherC.d.length)
          newC.d += c.d.slice(otherC.p + otherC.d.length - c.p);

        // This is entirely optional - I'm just checking the deleted text in
        // the two ops matches
        var intersectStart = Math.max(c.p, otherC.p);
        var intersectEnd = Math.min(c.p + c.d.length, otherC.p + otherC.d.length);
        var cIntersect = c.d.slice(intersectStart - c.p, intersectEnd - c.p);
        var otherIntersect = otherC.d.slice(intersectStart - otherC.p, intersectEnd - otherC.p);
        if (cIntersect !== otherIntersect)
          throw new Error('Delete ops delete different text in the same region of the document');

        if (newC.d !== '') {
          newC.p = transformPosition(newC.p, otherC);
          append(dest, newC);
        }
      }
    }
  }

  return dest;
};

var invertComponent = function(c) {
  return (c.i != null) ? {d:c.i, p:c.p} : {i:c.d, p:c.p};
};

// No need to use append for invert, because the components won't be able to
// cancel one another.
text.invert = function(op) {
  // Shallow copy & reverse that sucka.
  op = op.slice().reverse();
  for (var i = 0; i < op.length; i++) {
    op[i] = invertComponent(op[i]);
  }
  return op;
};

require('./bootstrapTransform')(text, transformComponent, checkValidOp, append);

},{"./bootstrapTransform":4}],8:[function(require,module,exports){
// Text document API for the 'text' type. This implements some standard API
// methods for any text-like type, so you can easily bind a textarea or
// something without being fussy about the underlying OT implementation.
//
// The API is desigend as a set of functions to be mixed in to some context
// object as part of its lifecycle. It expects that object to have getSnapshot
// and submitOp methods, and call _onOp when an operation is received.
//
// This API defines:
//
// - getLength() returns the length of the document in characters
// - getText() returns a string of the document
// - insert(pos, text, [callback]) inserts text at position pos in the document
// - remove(pos, length, [callback]) removes length characters at position pos
//
// A user can define:
// - onInsert(pos, text): Called when text is inserted.
// - onRemove(pos, length): Called when text is removed.

module.exports = api;
function api(getSnapshot, submitOp) {
  return {
    // Returns the text content of the document
    get: function() { return getSnapshot(); },

    // Returns the number of characters in the string
    getLength: function() { return getSnapshot().length; },

    // Insert the specified text at the given position in the document
    insert: function(pos, text, callback) {
      return submitOp([pos, text], callback);
    },

    remove: function(pos, length, callback) {
      return submitOp([pos, {d:length}], callback);
    },

    // When you use this API, you should implement these two methods
    // in your editing context.
    //onInsert: function(pos, text) {},
    //onRemove: function(pos, removedLength) {},

    _onOp: function(op) {
      var pos = 0;
      var spos = 0;
      for (var i = 0; i < op.length; i++) {
        var component = op[i];
        switch (typeof component) {
          case 'number':
            pos += component;
            spos += component;
            break;
          case 'string':
            if (this.onInsert) this.onInsert(pos, component);
            pos += component.length;
            break;
          case 'object':
            if (this.onRemove) this.onRemove(pos, component.d);
            spos += component.d;
        }
      }
    }
  };
};
api.provides = {text: true};

},{}],9:[function(require,module,exports){
var type = require('./text');
type.api = require('./api');

module.exports = {
  type: type
};

},{"./api":8,"./text":10}],10:[function(require,module,exports){
/* Text OT!
 *
 * This is an OT implementation for text. It is the standard implementation of
 * text used by ShareJS.
 *
 * This type is composable but non-invertable. Its similar to ShareJS's old
 * text-composable type, but its not invertable and its very similar to the
 * text-tp2 implementation but it doesn't support tombstones or purging.
 *
 * Ops are lists of components which iterate over the document.
 * Components are either:
 *   A number N: Skip N characters in the original document
 *   "str"     : Insert "str" at the current position in the document
 *   {d:N}     : Delete N characters at the current position in the document
 *
 * Eg: [3, 'hi', 5, {d:8}]
 *
 * The operation does not have to skip the last characters in the document.
 *
 * Snapshots are strings.
 *
 * Cursors are either a single number (which is the cursor position) or a pair of
 * [anchor, focus] (aka [start, end]). Be aware that end can be before start.
 */

/** @module text */

exports.name = 'text';
exports.uri = 'http://sharejs.org/types/textv1';

/** Create a new text snapshot.
 *
 * @param {string} initial - initial snapshot data. Optional. Defaults to ''.
 */
exports.create = function(initial) {
  if ((initial != null) && typeof initial !== 'string') {
    throw Error('Initial data must be a string');
  }
  return initial || '';
};

var isArray = Array.isArray || function(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
};

/** Check the operation is valid. Throws if not valid. */
var checkOp = function(op) {
  if (!isArray(op)) throw Error('Op must be an array of components');

  var last = null;
  for (var i = 0; i < op.length; i++) {
    var c = op[i];
    switch (typeof c) {
      case 'object':
        // The only valid objects are {d:X} for +ive values of X.
        if (!(typeof c.d === 'number' && c.d > 0)) throw Error('Object components must be deletes of size > 0');
        break;
      case 'string':
        // Strings are inserts.
        if (!(c.length > 0)) throw Error('Inserts cannot be empty');
        break;
      case 'number':
        // Numbers must be skips. They have to be +ive numbers.
        if (!(c > 0)) throw Error('Skip components must be >0');
        if (typeof last === 'number') throw Error('Adjacent skip components should be combined');
        break;
    }
    last = c;
  }

  if (typeof last === 'number') throw Error('Op has a trailing skip');
};

/** Check that the given selection range is valid. */
var checkSelection = function(selection) {
  // This may throw from simply inspecting selection[0] / selection[1]. Thats
  // sort of ok, though it'll generate the wrong message.
  if (typeof selection !== 'number'
      && (typeof selection[0] !== 'number' || typeof selection[1] !== 'number'))
    throw Error('Invalid selection');
};

/** Make a function that appends to the given operation. */
var makeAppend = function(op) {
  return function(component) {
    if (!component || component.d === 0) {
      // The component is a no-op. Ignore!
 
    } else if (op.length === 0) {
      return op.push(component);

    } else if (typeof component === typeof op[op.length - 1]) {
      if (typeof component === 'object') {
        return op[op.length - 1].d += component.d;
      } else {
        return op[op.length - 1] += component;
      }
    } else {
      return op.push(component);
    }
  };
};

/** Makes and returns utility functions take and peek. */
var makeTake = function(op) {
  // The index of the next component to take
  var idx = 0;
  // The offset into the component
  var offset = 0;

  // Take up to length n from the front of op. If n is -1, take the entire next
  // op component. If indivisableField == 'd', delete components won't be separated.
  // If indivisableField == 'i', insert components won't be separated.
  var take = function(n, indivisableField) {
    // We're at the end of the operation. The op has skips, forever. Infinity
    // might make more sense than null here.
    if (idx === op.length)
      return n === -1 ? null : n;

    var part;
    var c = op[idx];
    if (typeof c === 'number') {
      // Skip
      if (n === -1 || c - offset <= n) {
        part = c - offset;
        ++idx;
        offset = 0;
        return part;
      } else {
        offset += n;
        return n;
      }
    } else if (typeof c === 'string') {
      // Insert
      if (n === -1 || indivisableField === 'i' || c.length - offset <= n) {
        part = c.slice(offset);
        ++idx;
        offset = 0;
        return part;
      } else {
        part = c.slice(offset, offset + n);
        offset += n;
        return part;
      }
    } else {
      // Delete
      if (n === -1 || indivisableField === 'd' || c.d - offset <= n) {
        part = {d: c.d - offset};
        ++idx;
        offset = 0;
        return part;
      } else {
        offset += n;
        return {d: n};
      }
    }
  };

  // Peek at the next op that will be returned.
  var peekType = function() { return op[idx]; };

  return [take, peekType];
};

/** Get the length of a component */
var componentLength = function(c) {
  // Uglify will compress this down into a ternary
  if (typeof c === 'number') {
    return c;
  } else {
    return c.length || c.d;
  }
};

/** Trim any excess skips from the end of an operation.
 *
 * There should only be at most one, because the operation was made with append.
 */
var trim = function(op) {
  if (op.length > 0 && typeof op[op.length - 1] === 'number') {
    op.pop();
  }
  return op;
};

exports.normalize = function(op) {
  var newOp = [];
  var append = makeAppend(newOp);
  for (var i = 0; i < op.length; i++) {
    append(op[i]);
  }
  return trim(newOp);
};

/** Apply an operation to a document snapshot */
exports.apply = function(str, op) {
  if (typeof str !== 'string') {
    throw Error('Snapshot should be a string');
  }
  checkOp(op);

  // We'll gather the new document here and join at the end.
  var newDoc = [];

  for (var i = 0; i < op.length; i++) {
    var component = op[i];
    switch (typeof component) {
      case 'number':
        if (component > str.length) throw Error('The op is too long for this document');

        newDoc.push(str.slice(0, component));
        // This might be slow for big strings. Consider storing the offset in
        // str instead of rewriting it each time.
        str = str.slice(component);
        break;
      case 'string':
        newDoc.push(component);
        break;
      case 'object':
        str = str.slice(component.d);
        break;
    }
  }

  return newDoc.join('') + str;
};

/** Transform op by otherOp.
 *
 * @param op - The operation to transform
 * @param otherOp - Operation to transform it by
 * @param side - Either 'left' or 'right'
 */
exports.transform = function(op, otherOp, side) {
  if (side != 'left' && side != 'right') throw Error("side (" + side + ") must be 'left' or 'right'");

  checkOp(op);
  checkOp(otherOp);

  var newOp = [];
  var append = makeAppend(newOp);

  var _fns = makeTake(op);
  var take = _fns[0],
      peek = _fns[1];

  for (var i = 0; i < otherOp.length; i++) {
    var component = otherOp[i];

    var length, chunk;
    switch (typeof component) {
      case 'number': // Skip
        length = component;
        while (length > 0) {
          chunk = take(length, 'i');
          append(chunk);
          if (typeof chunk !== 'string') {
            length -= componentLength(chunk);
          }
        }
        break;

      case 'string': // Insert
        if (side === 'left') {
          // The left insert should go first.
          if (typeof peek() === 'string') {
            append(take(-1));
          }
        }

        // Otherwise skip the inserted text.
        append(component.length);
        break;

      case 'object': // Delete
        length = component.d;
        while (length > 0) {
          chunk = take(length, 'i');
          switch (typeof chunk) {
            case 'number':
              length -= chunk;
              break;
            case 'string':
              append(chunk);
              break;
            case 'object':
              // The delete is unnecessary now - the text has already been deleted.
              length -= chunk.d;
          }
        }
        break;
    }
  }
  
  // Append any extra data in op1.
  while ((component = take(-1)))
    append(component);
  
  return trim(newOp);
};

/** Compose op1 and op2 together and return the result */
exports.compose = function(op1, op2) {
  checkOp(op1);
  checkOp(op2);

  var result = [];
  var append = makeAppend(result);
  var take = makeTake(op1)[0];

  for (var i = 0; i < op2.length; i++) {
    var component = op2[i];
    var length, chunk;
    switch (typeof component) {
      case 'number': // Skip
        length = component;
        while (length > 0) {
          chunk = take(length, 'd');
          append(chunk);
          if (typeof chunk !== 'object') {
            length -= componentLength(chunk);
          }
        }
        break;

      case 'string': // Insert
        append(component);
        break;

      case 'object': // Delete
        length = component.d;

        while (length > 0) {
          chunk = take(length, 'd');

          switch (typeof chunk) {
            case 'number':
              append({d: chunk});
              length -= chunk;
              break;
            case 'string':
              length -= chunk.length;
              break;
            case 'object':
              append(chunk);
          }
        }
        break;
    }
  }

  while ((component = take(-1)))
    append(component);

  return trim(result);
};


var transformPosition = function(cursor, op) {
  var pos = 0;
  for (var i = 0; i < op.length; i++) {
    var c = op[i];
    if (cursor <= pos) break;

    // I could actually use the op_iter stuff above - but I think its simpler
    // like this.
    switch (typeof c) {
      case 'number':
        if (cursor <= pos + c)
          return cursor;
        pos += c;
        break;

      case 'string':
        pos += c.length;
        cursor += c.length;
        break;

      case 'object':
        cursor -= Math.min(c.d, cursor - pos);
        break;
    }
  }
  return cursor;
};

exports.transformSelection = function(selection, op, isOwnOp) {
  var pos = 0;
  if (isOwnOp) {
    // Just track the position. We'll teleport the cursor to the end anyway.
    // This works because text ops don't have any trailing skips at the end - so the last
    // component is the last thing.
    for (var i = 0; i < op.length; i++) {
      var c = op[i];
      switch (typeof c) {
        case 'number':
          pos += c;
          break;
        case 'string':
          pos += c.length;
          break;
        // Just eat deletes.
      }
    }
    return pos;
  } else {
    return typeof selection === 'number' ?
      transformPosition(selection, op) : [transformPosition(selection[0], op), transformPosition(selection[1], op)];
  }
};

exports.selectionEq = function(c1, c2) {
  if (c1[0] != null && c1[0] === c1[1]) c1 = c1[0];
  if (c2[0] != null && c2[0] === c2[1]) c2 = c2[0];
  return c1 === c2 || (c1[0] != null && c2[0] != null && c1[0] === c2[0] && c1[1] == c2[1]);
};


// Calculate the cursor position after the given operation
exports.applyToCursor = function (op) {
    var pos = 0;
    for (var i = 0; i < op.length; i++) {
        var c = op[i];
        switch (typeof c) {
            case 'number':
                pos += c;
                break;
            case 'string':
                pos += c.length;
                break;
            case 'object':
                //pos -= c.d;
                break;
        }
    }
    return pos;
};

// Generate an operation that semantically inverts the given operation
// when applied to the provided snapshot.
// It needs a snapshot of the document before the operation
// was applied to invert delete operations.
exports.semanticInvert = function (str, op) {
    if (typeof str !== 'string') {
        throw Error('Snapshot should be a string');
    }
    checkOp(op);

    // Save copy
    var originalOp = op.slice();

    // Shallow copy
    op = op.slice();

    var len = op.length;
    var cursor, prevOps, tmpStr;
    for (var i = 0; i < len; i++) {
        var c = op[i];
        switch (typeof c) {
            case 'number':
                // In case we have cursor movement we do nothing
                break;
            case 'string':
                // In case we have string insertion we generate a string deletion
                op[i] = {d: c.length};
                break;
            case 'object':
                // In case of a deletion we need to reinsert the deleted string
                prevOps = originalOp.slice(0, i);
                cursor = this.applyToCursor(prevOps);
                tmpStr = this.apply(str, trim(prevOps));
                op[i] = tmpStr.substring(cursor, cursor + c.d);
                break;
        }
    }

    return this.normalize(op);
};

},{}],11:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],12:[function(require,module,exports){
(function (process){
var Doc = require('./doc');
var Query = require('./query');
var emitter = require('../emitter');
var ShareDBError = require('../error');
var types = require('../types');
var util = require('../util');

/**
 * Handles communication with the sharejs server and provides queries and
 * documents.
 *
 * We create a connection with a socket object
 *   connection = new sharejs.Connection(sockset)
 * The socket may be any object handling the websocket protocol. See the
 * documentation of bindToSocket() for details. We then wait for the connection
 * to connect
 *   connection.on('connected', ...)
 * and are finally able to work with shared documents
 *   connection.get('food', 'steak') // Doc
 *
 * @param socket @see bindToSocket
 */
module.exports = Connection;
function Connection(socket) {
  emitter.EventEmitter.call(this);

  // Map of collection -> id -> doc object for created documents.
  // (created documents MUST BE UNIQUE)
  this.collections = {};

  // Each query is created with an id that the server uses when it sends us
  // info about the query (updates, etc)
  this.nextQueryId = 1;

  // Map from query ID -> query object.
  this.queries = {};

  // A unique message number for the given id
  this.seq = 1;

  // Equals agent.clientId on the server
  this.id = null;

  // This direct reference from connection to agent is not used internal to
  // ShareDB, but it is handy for server-side only user code that may cache
  // state on the agent and read it in middleware
  this.agent = null;

  this.debug = false;

  this.bindToSocket(socket);
}
emitter.mixin(Connection);


/**
 * Use socket to communicate with server
 *
 * Socket is an object that can handle the websocket protocol. This method
 * installs the onopen, onclose, onmessage and onerror handlers on the socket to
 * handle communication and sends messages by calling socket.send(message). The
 * sockets `readyState` property is used to determine the initaial state.
 *
 * @param socket Handles the websocket protocol
 * @param socket.readyState
 * @param socket.close
 * @param socket.send
 * @param socket.onopen
 * @param socket.onclose
 * @param socket.onmessage
 * @param socket.onerror
 */
Connection.prototype.bindToSocket = function(socket) {
  if (this.socket) {
    this.socket.close();
    this.socket.onmessage = null;
    this.socket.onopen = null;
    this.socket.onerror = null;
    this.socket.onclose = null;
  }

  this.socket = socket;

  // State of the connection. The correspoding events are emmited when this changes
  //
  // - 'connecting'   The connection is still being established, or we are still
  //                    waiting on the server to send us the initialization message
  // - 'connected'    The connection is open and we have connected to a server
  //                    and recieved the initialization message
  // - 'disconnected' Connection is closed, but it will reconnect automatically
  // - 'closed'       The connection was closed by the client, and will not reconnect
  // - 'stopped'      The connection was closed by the server, and will not reconnect
  this.state = (socket.readyState === 0 || socket.readyState === 1) ? 'connecting' : 'disconnected';

  // This is a helper variable the document uses to see whether we're
  // currently in a 'live' state. It is true if and only if we're connected
  this.canSend = false;

  var connection = this;

  socket.onmessage = function(event) {
    try {
      var data = (typeof event.data === 'string') ?
        JSON.parse(event.data) : event.data;
    } catch (err) {
      console.warn('Failed to parse message', event);
      return;
    }

    if (connection.debug) console.log('RECV', JSON.stringify(data));

    var request = {data: data};
    connection.emit('receive', request);
    if (!request.data) return;

    try {
      connection.handleMessage(request.data);
    } catch (err) {
      process.nextTick(function() {
        connection.emit('error', err);
      });
    }
  };

  socket.onopen = function() {
    connection._setState('connecting');
  };

  socket.onerror = function(err) {
    // This isn't the same as a regular error, because it will happen normally
    // from time to time. Your connection should probably automatically
    // reconnect anyway, but that should be triggered off onclose not onerror.
    // (onclose happens when onerror gets called anyway).
    connection.emit('connection error', err);
  };

  socket.onclose = function(reason) {
    // node-browserchannel reason values:
    //   'Closed' - The socket was manually closed by calling socket.close()
    //   'Stopped by server' - The server sent the stop message to tell the client not to try connecting
    //   'Request failed' - Server didn't respond to request (temporary, usually offline)
    //   'Unknown session ID' - Server session for client is missing (temporary, will immediately reestablish)

    if (reason === 'closed' || reason === 'Closed') {
      connection._setState('closed', reason);

    } else if (reason === 'stopped' || reason === 'Stopped by server') {
      connection._setState('stopped', reason);

    } else {
      connection._setState('disconnected', reason);
    }
  };
};

/**
 * @param {object} message
 * @param {String} message.a action
 */
Connection.prototype.handleMessage = function(message) {
  var err = null;
  if (message.error) {
    // wrap in Error object so can be passed through event emitters
    err = new Error(message.error.message);
    err.code = message.error.code;
    // Add the message data to the error object for more context
    err.data = message;
    delete message.error;
  }
  // Switch on the message action. Most messages are for documents and are
  // handled in the doc class.
  switch (message.a) {
    case 'init':
      // Client initialization packet
      if (message.protocol !== 1) {
        err = new ShareDBError(4019, 'Invalid protocol version');
        return this.emit('error', err);
      }
      if (types.map[message.type] !== types.defaultType) {
        err = new ShareDBError(4020, 'Invalid default type');
        return this.emit('error', err);
      }
      if (typeof message.id !== 'string') {
        err = new ShareDBError(4021, 'Invalid client id');
        return this.emit('error', err);
      }
      this.id = message.id;

      this._setState('connected');
      return;

    case 'qf':
      var query = this.queries[message.id];
      if (query) query._handleFetch(err, message.data, message.extra);
      return;
    case 'qs':
      var query = this.queries[message.id];
      if (query) query._handleSubscribe(err, message.data, message.extra);
      return;
    case 'qu':
      // Queries are removed immediately on calls to destroy, so we ignore
      // replies to query unsubscribes. Perhaps there should be a callback for
      // destroy, but this is currently unimplemented
      return;
    case 'q':
      // Query message. Pass this to the appropriate query object.
      var query = this.queries[message.id];
      if (!query) return;
      if (err) return query._handleError(err);
      if (message.diff) query._handleDiff(message.diff);
      if (message.hasOwnProperty('extra')) query._handleExtra(message.extra);
      return;

    case 'bf':
      return this._handleBulkMessage(message, '_handleFetch');
    case 'bs':
      return this._handleBulkMessage(message, '_handleSubscribe');
    case 'bu':
      return this._handleBulkMessage(message, '_handleUnsubscribe');

    case 'f':
      var doc = this.getExisting(message.c, message.d);
      if (doc) doc._handleFetch(err, message.data);
      return;
    case 's':
      var doc = this.getExisting(message.c, message.d);
      if (doc) doc._handleSubscribe(err, message.data);
      return;
    case 'u':
      var doc = this.getExisting(message.c, message.d);
      if (doc) doc._handleUnsubscribe(err);
      return;
    case 'op':
      var doc = this.getExisting(message.c, message.d);
      if (doc) doc._handleOp(err, message);
      return;

    default:
      console.warn('Ignoring unrecognized message', message);
  }
};

Connection.prototype._handleBulkMessage = function(message, method) {
  if (message.data) {
    for (var id in message.data) {
      var doc = this.getExisting(message.c, id);
      if (doc) doc[method](message.error, message.data[id]);
    }
  } else if (Array.isArray(message.b)) {
    for (var i = 0; i < message.b.length; i++) {
      var id = message.b[i];
      var doc = this.getExisting(message.c, id);
      if (doc) doc[method](message.error);
    }
  } else if (message.b) {
    for (var id in message.b) {
      var doc = this.getExisting(message.c, id);
      if (doc) doc[method](message.error);
    }
  } else {
    console.error('Invalid bulk message', message);
  }
};

Connection.prototype._reset = function() {
  this.seq = 1;
  this.id = null;
  this.agent = null;
};

// Set the connection's state. The connection is basically a state machine.
Connection.prototype._setState = function(newState, reason) {
  if (this.state === newState) return;

  // I made a state diagram. The only invalid transitions are getting to
  // 'connecting' from anywhere other than 'disconnected' and getting to
  // 'connected' from anywhere other than 'connecting'.
  if (
    (newState === 'connecting' && this.state !== 'disconnected' && this.state !== 'stopped' && this.state !== 'closed') ||
    (newState === 'connected' && this.state !== 'connecting')
  ) {
    var err = new ShareDBError(5007, 'Cannot transition directly from ' + this.state + ' to ' + newState);
    return this.emit('error', err);
  }

  this.state = newState;
  this.canSend = (newState === 'connected');

  if (newState === 'disconnected' || newState === 'stopped' || newState === 'closed') this._reset();

  // Group subscribes together to help server make more efficient calls
  this.startBulk();
  // Emit the event to all queries
  for (var id in this.queries) {
    var query = this.queries[id];
    query._onConnectionStateChanged();
  }
  // Emit the event to all documents
  for (var collection in this.collections) {
    var docs = this.collections[collection];
    for (var id in docs) {
      docs[id]._onConnectionStateChanged();
    }
  }
  this.endBulk();

  this.emit(newState, reason);
  this.emit('state', newState, reason);
};

Connection.prototype.startBulk = function() {
  if (!this.bulk) this.bulk = {};
};

Connection.prototype.endBulk = function() {
  if (this.bulk) {
    for (var collection in this.bulk) {
      var actions = this.bulk[collection];
      this._sendBulk('f', collection, actions.f);
      this._sendBulk('s', collection, actions.s);
      this._sendBulk('u', collection, actions.u);
    }
  }
  this.bulk = null;
};

Connection.prototype._sendBulk = function(action, collection, values) {
  if (!values) return;
  var ids = [];
  var versions = {};
  var versionsCount = 0;
  var versionId;
  for (var id in values) {
    var value = values[id];
    if (value == null) {
      ids.push(id);
    } else {
      versions[id] = value;
      versionId = id;
      versionsCount++;
    }
  }
  if (ids.length === 1) {
    var id = ids[0];
    this.send({a: action, c: collection, d: id});
  } else if (ids.length) {
    this.send({a: 'b' + action, c: collection, b: ids});
  }
  if (versionsCount === 1) {
    var version = versions[versionId];
    this.send({a: action, c: collection, d: versionId, v: version});
  } else if (versionsCount) {
    this.send({a: 'b' + action, c: collection, b: versions});
  }
};

Connection.prototype._sendAction = function(action, doc, version) {
  // Ensure the doc is registered so that it receives the reply message
  this._addDoc(doc);
  if (this.bulk) {
    // Bulk subscribe
    var actions = this.bulk[doc.collection] || (this.bulk[doc.collection] = {});
    var versions = actions[action] || (actions[action] = {});
    var isDuplicate = versions.hasOwnProperty(doc.id);
    versions[doc.id] = version;
    return isDuplicate;
  } else {
    // Send single doc subscribe message
    var message = {a: action, c: doc.collection, d: doc.id, v: version};
    this.send(message);
  }
};

Connection.prototype.sendFetch = function(doc) {
  return this._sendAction('f', doc, doc.version);
};

Connection.prototype.sendSubscribe = function(doc) {
  return this._sendAction('s', doc, doc.version);
};

Connection.prototype.sendUnsubscribe = function(doc) {
  return this._sendAction('u', doc);
};

Connection.prototype.sendOp = function(doc, op) {
  // Ensure the doc is registered so that it receives the reply message
  this._addDoc(doc);
  var message = {
    a: 'op',
    c: doc.collection,
    d: doc.id,
    v: doc.version,
    src: op.src,
    seq: op.seq
  };
  if (op.op) message.op = op.op;
  if (op.create) message.create = op.create;
  if (op.del) message.del = op.del;
  this.send(message);
};


/**
 * Sends a message down the socket
 */
Connection.prototype.send = function(message) {
  if (this.debug) console.log('SEND', JSON.stringify(message));

  this.emit('send', message);
  this.socket.send(JSON.stringify(message));
};


/**
 * Closes the socket and emits 'closed'
 */
Connection.prototype.close = function() {
  this.socket.close();
};

Connection.prototype.getExisting = function(collection, id) {
  if (this.collections[collection]) return this.collections[collection][id];
};


/**
 * Get or create a document.
 *
 * @param collection
 * @param id
 * @return {Doc}
 */
Connection.prototype.get = function(collection, id) {
  var docs = this.collections[collection] ||
    (this.collections[collection] = {});

  var doc = docs[id];
  if (!doc) {
    doc = docs[id] = new Doc(this, collection, id);
    this.emit('doc', doc);
  }

  return doc;
};


/**
 * Remove document from this.collections
 *
 * @private
 */
Connection.prototype._destroyDoc = function(doc) {
  var docs = this.collections[doc.collection];
  if (!docs) return;

  delete docs[doc.id];

  // Delete the collection container if its empty. This could be a source of
  // memory leaks if you slowly make a billion collections, which you probably
  // won't do anyway, but whatever.
  if (!util.hasKeys(docs)) {
    delete this.collections[doc.collection];
  }
};

Connection.prototype._addDoc = function(doc) {
  var docs = this.collections[doc.collection];
  if (!docs) {
    docs = this.collections[doc.collection] = {};
  }
  if (docs[doc.id] !== doc) {
    docs[doc.id] = doc;
  }
};

// Helper for createFetchQuery and createSubscribeQuery, below.
Connection.prototype._createQuery = function(action, collection, q, options, callback) {
  var id = this.nextQueryId++;
  var query = new Query(action, this, id, collection, q, options, callback);
  this.queries[id] = query;
  query.send();
  return query;
};

// Internal function. Use query.destroy() to remove queries.
Connection.prototype._destroyQuery = function(query) {
  delete this.queries[query.id];
};

// The query options object can contain the following fields:
//
// db: Name of the db for the query. You can attach extraDbs to ShareDB and
//   pick which one the query should hit using this parameter.

// Create a fetch query. Fetch queries are only issued once, returning the
// results directly into the callback.
//
// The callback should have the signature function(error, results, extra)
// where results is a list of Doc objects.
Connection.prototype.createFetchQuery = function(collection, q, options, callback) {
  return this._createQuery('qf', collection, q, options, callback);
};

// Create a subscribe query. Subscribe queries return with the initial data
// through the callback, then update themselves whenever the query result set
// changes via their own event emitter.
//
// If present, the callback should have the signature function(error, results, extra)
// where results is a list of Doc objects.
Connection.prototype.createSubscribeQuery = function(collection, q, options, callback) {
  return this._createQuery('qs', collection, q, options, callback);
};

Connection.prototype.hasPending = function() {
  return !!(
    this._firstDoc(hasPending) ||
    this._firstQuery(hasPending)
  );
};
function hasPending(object) {
  return object.hasPending();
}

Connection.prototype.hasWritePending = function() {
  return !!this._firstDoc(hasWritePending);
};
function hasWritePending(object) {
  return object.hasWritePending();
}

Connection.prototype.whenNothingPending = function(callback) {
  var doc = this._firstDoc(hasPending);
  if (doc) {
    // If a document is found with a pending operation, wait for it to emit
    // that nothing is pending anymore, and then recheck all documents again.
    // We have to recheck all documents, just in case another mutation has
    // been made in the meantime as a result of an event callback
    doc.once('nothing pending', this._nothingPendingRetry(callback));
    return;
  }
  var query = this._firstQuery(hasPending);
  if (query) {
    query.once('ready', this._nothingPendingRetry(callback));
    return;
  }
  // Call back when no pending operations
  process.nextTick(callback);
};
Connection.prototype._nothingPendingRetry = function(callback) {
  var connection = this;
  return function() {
    process.nextTick(function() {
      connection.whenNothingPending(callback);
    });
  };
};

Connection.prototype._firstDoc = function(fn) {
  for (var collection in this.collections) {
    var docs = this.collections[collection];
    for (var id in docs) {
      var doc = docs[id];
      if (fn(doc)) {
        return doc;
      }
    }
  }
};

Connection.prototype._firstQuery = function(fn) {
  for (var id in this.queries) {
    var query = this.queries[id];
    if (fn(query)) {
      return query;
    }
  }
};

}).call(this,require('_process'))
},{"../emitter":16,"../error":17,"../types":18,"../util":19,"./doc":13,"./query":15,"_process":11}],13:[function(require,module,exports){
(function (process){
var emitter = require('../emitter');
var ShareDBError = require('../error');
var types = require('../types');

/**
 * A Doc is a client's view on a sharejs document.
 *
 * It is is uniquely identified by its `id` and `collection`.  Documents
 * should not be created directly. Create them with connection.get()
 *
 *
 * Subscriptions
 * -------------
 *
 * We can subscribe a document to stay in sync with the server.
 *   doc.subscribe(function(error) {
 *     doc.subscribed // = true
 *   })
 * The server now sends us all changes concerning this document and these are
 * applied to our data. If the subscription was successful the initial
 * data and version sent by the server are loaded into the document.
 *
 * To stop listening to the changes we call `doc.unsubscribe()`.
 *
 * If we just want to load the data but not stay up-to-date, we call
 *   doc.fetch(function(error) {
 *     doc.data // sent by server
 *   })
 *
 *
 * Events
 * ------
 *
 * You can use doc.on(eventName, callback) to subscribe to the following events:
 * - `before op (op, source)` Fired before a partial operation is applied to the data.
 *   It may be used to read the old data just before applying an operation
 * - `op (op, source)` Fired after every partial operation with this operation as the
 *   first argument
 * - `create (source)` The document was created. That means its type was
 *   set and it has some initial data.
 * - `del (data, source)` Fired after the document is deleted, that is
 *   the data is null. It is passed the data before delteion as an
 *   arguments
 * - `load ()` Fired when a new snapshot is ingested from a fetch, subscribe, or query
 */

module.exports = Doc;
function Doc(connection, collection, id) {
  emitter.EventEmitter.call(this);

  this.connection = connection;

  this.collection = collection;
  this.id = id;

  this.version = null;
  this.type = null;
  this.data = undefined;

  // Array of callbacks or nulls as placeholders
  this.inflightFetch = [];
  this.inflightSubscribe = [];
  this.inflightUnsubscribe = [];
  this.pendingFetch = [];

  // Whether we think we are subscribed on the server. Synchronously set to
  // false on calls to unsubscribe and disconnect. Should never be true when
  // this.wantSubscribe is false
  this.subscribed = false;
  // Whether to re-establish the subscription on reconnect
  this.wantSubscribe = false;

  // The op that is currently roundtripping to the server, or null.
  //
  // When the connection reconnects, the inflight op is resubmitted.
  //
  // This has the same format as an entry in pendingOps
  this.inflightOp = null;

  // All ops that are waiting for the server to acknowledge this.inflightOp
  // This used to just be a single operation, but creates & deletes can't be
  // composed with regular operations.
  //
  // This is a list of {[create:{...}], [del:true], [op:...], callbacks:[...]}
  this.pendingOps = [];

  // The OT type of this document. An uncreated document has type `null`
  this.type = null;

  // The applyStack enables us to track any ops submitted while we are
  // applying an op incrementally. This value is an array when we are
  // performing an incremental apply and null otherwise. When it is an array,
  // all submitted ops should be pushed onto it. The `_otApply` method will
  // reset it back to null when all incremental apply loops are complete.
  this.applyStack = null;

  // Disable the default behavior of composing submitted ops. This is read at
  // the time of op submit, so it may be toggled on before submitting a
  // specifc op and toggled off afterward
  this.preventCompose = false;
}
emitter.mixin(Doc);

Doc.prototype.destroy = function(callback) {
  var doc = this;
  doc.whenNothingPending(function() {
    doc.connection._destroyDoc(doc);
    if (doc.wantSubscribe) {
      return doc.unsubscribe(callback);
    }
    if (callback) callback();
  });
};


// ****** Manipulating the document data, version and type.

// Set the document's type, and associated properties. Most of the logic in
// this function exists to update the document based on any added & removed API
// methods.
//
// @param newType OT type provided by the ottypes library or its name or uri
Doc.prototype._setType = function(newType) {
  if (typeof newType === 'string') {
    newType = types.map[newType];
  }

  if (newType) {
    this.type = newType;

  } else if (newType === null) {
    this.type = newType;
    // If we removed the type from the object, also remove its data
    this.data = undefined;

  } else {
    var err = new ShareDBError(4008, 'Missing type ' + newType);
    return this.emit('error', err);
  }
};

// Ingest snapshot data. This data must include a version, snapshot and type.
// This is used both to ingest data that was exported with a webpage and data
// that was received from the server during a fetch.
//
// @param snapshot.v    version
// @param snapshot.data
// @param snapshot.type
// @param callback
Doc.prototype.ingestSnapshot = function(snapshot, callback) {
  if (!snapshot) return callback && callback();

  if (typeof snapshot.v !== 'number') {
    var err = new ShareDBError(5008, 'Missing version in ingested snapshot. ' + this.collection + '.' + this.id);
    if (callback) return callback(err);
    return this.emit('error', err);
  }

  // If the doc is already created or there are ops pending, we cannot use the
  // ingested snapshot and need ops in order to update the document
  if (this.type || this.hasWritePending()) {
    // The version should only be null on a created document when it was
    // created locally without fetching
    if (this.version == null) {
      if (this.hasWritePending()) {
        // If we have pending ops and we get a snapshot for a locally created
        // document, we have to wait for the pending ops to complete, because
        // we don't know what version to fetch ops from. It is possible that
        // the snapshot came from our local op, but it is also possible that
        // the doc was created remotely (which would conflict and be an error)
        return callback && this.once('no write pending', callback);
      }
      // Otherwise, we've encounted an error state
      var err = new ShareDBError(5009, 'Cannot ingest snapshot in doc with null version. ' + this.collection + '.' + this.id);
      if (callback) return callback(err);
      return this.emit('error', err);
    }
    // If we got a snapshot for a version further along than the document is
    // currently, issue a fetch to get the latest ops and catch us up
    if (snapshot.v > this.version) return this.fetch(callback);
    return callback && callback();
  }

  // Ignore the snapshot if we are already at a newer version. Under no
  // circumstance should we ever set the current version backward
  if (this.version > snapshot.v) return callback && callback();

  this.version = snapshot.v;
  var type = (snapshot.type === undefined) ? types.defaultType : snapshot.type;
  this._setType(type);
  this.data = (this.type && this.type.deserialize) ?
    this.type.deserialize(snapshot.data) :
    snapshot.data;
  this.emit('load');
  callback && callback();
};

Doc.prototype.whenNothingPending = function(callback) {
  if (this.hasPending()) {
    this.once('nothing pending', callback);
    return;
  }
  callback();
};

Doc.prototype.hasPending = function() {
  return !!(
    this.inflightOp ||
    this.pendingOps.length ||
    this.inflightFetch.length ||
    this.inflightSubscribe.length ||
    this.inflightUnsubscribe.length ||
    this.pendingFetch.length
  );
};

Doc.prototype.hasWritePending = function() {
  return !!(this.inflightOp || this.pendingOps.length);
};

Doc.prototype._emitNothingPending = function() {
  if (this.hasWritePending()) return;
  this.emit('no write pending');
  if (this.hasPending()) return;
  this.emit('nothing pending');
};

// **** Helpers for network messages

Doc.prototype._emitResponseError = function(err, callback) {
  if (callback) {
    callback(err);
    this._emitNothingPending();
    return;
  }
  this._emitNothingPending();
  this.emit('error', err);
};

Doc.prototype._handleFetch = function(err, snapshot) {
  var callback = this.inflightFetch.shift();
  if (err) return this._emitResponseError(err, callback);
  this.ingestSnapshot(snapshot, callback);
  this._emitNothingPending();
};

Doc.prototype._handleSubscribe = function(err, snapshot) {
  var callback = this.inflightSubscribe.shift();
  if (err) return this._emitResponseError(err, callback);
  // Indicate we are subscribed only if the client still wants to be. In the
  // time since calling subscribe and receiving a response from the server,
  // unsubscribe could have been called and we might already be unsubscribed
  // but not have received the response. Also, because requests from the
  // client are not serialized and may take different async time to process,
  // it is possible that we could hear responses back in a different order
  // from the order originally sent
  if (this.wantSubscribe) this.subscribed = true;
  this.ingestSnapshot(snapshot, callback);
  this._emitNothingPending();
};

Doc.prototype._handleUnsubscribe = function(err) {
  var callback = this.inflightUnsubscribe.shift();
  if (err) return this._emitResponseError(err, callback);
  if (callback) callback();
  this._emitNothingPending();
};

Doc.prototype._handleOp = function(err, message) {
  if (err) {
    if (this.inflightOp) {
      // The server has rejected submission of the current operation. If we get
      // an error code 4002 "Op submit rejected", this was done intentionally
      // and we should roll back but not return an error to the user.
      if (err.code === 4002) err = null;
      return this._rollback(err);
    }
    return this.emit('error', err);
  }

  if (this.inflightOp &&
      message.src === this.inflightOp.src &&
      message.seq === this.inflightOp.seq) {
    // The op has already been applied locally. Just update the version
    // and pending state appropriately
    this._opAcknowledged(message);
    return;
  }

  if (this.version == null || message.v > this.version) {
    // This will happen in normal operation if we become subscribed to a
    // new document via a query. It can also happen if we get an op for
    // a future version beyond the version we are expecting next. This
    // could happen if the server doesn't publish an op for whatever reason
    // or because of a race condition. In any case, we can send a fetch
    // command to catch back up.
    //
    // Fetch only sends a new fetch command if no fetches are inflight, which
    // will act as a natural debouncing so we don't send multiple fetch
    // requests for many ops received at once.
    this.fetch();
    return;
  }

  if (message.v < this.version) {
    // We can safely ignore the old (duplicate) operation.
    return;
  }

  if (this.inflightOp) {
    var transformErr = transformX(this.inflightOp, message);
    if (transformErr) return this._hardRollback(transformErr);
  }

  for (var i = 0; i < this.pendingOps.length; i++) {
    var transformErr = transformX(this.pendingOps[i], message);
    if (transformErr) return this._hardRollback(transformErr);
  }

  this.version++;
  this._otApply(message, false);
  return;
};

// Called whenever (you guessed it!) the connection state changes. This will
// happen when we get disconnected & reconnect.
Doc.prototype._onConnectionStateChanged = function() {
  if (this.connection.canSend) {
    this.flush();
    this._resubscribe();
  } else {
    if (this.inflightOp) {
      this.pendingOps.unshift(this.inflightOp);
      this.inflightOp = null;
    }
    this.subscribed = false;
    if (this.inflightFetch.length || this.inflightSubscribe.length) {
      this.pendingFetch = this.pendingFetch.concat(this.inflightFetch, this.inflightSubscribe);
      this.inflightFetch.length = 0;
      this.inflightSubscribe.length = 0;
    }
    if (this.inflightUnsubscribe.length) {
      var callbacks = this.inflightUnsubscribe;
      this.inflightUnsubscribe = [];
      callEach(callbacks);
    }
  }
};

Doc.prototype._resubscribe = function() {
  var callbacks = this.pendingFetch;
  this.pendingFetch = [];

  if (this.wantSubscribe) {
    if (callbacks.length) {
      this.subscribe(function(err) {
        callEach(callbacks, err);
      });
      return;
    }
    this.subscribe();
    return;
  }

  if (callbacks.length) {
    this.fetch(function(err) {
      callEach(callbacks, err);
    });
  }
};

// Request the current document snapshot or ops that bring us up to date
Doc.prototype.fetch = function(callback) {
  if (this.connection.canSend) {
    var isDuplicate = this.connection.sendFetch(this);
    pushActionCallback(this.inflightFetch, isDuplicate, callback);
    return;
  }
  this.pendingFetch.push(callback);
};

// Fetch the initial document and keep receiving updates
Doc.prototype.subscribe = function(callback) {
  this.wantSubscribe = true;
  if (this.connection.canSend) {
    var isDuplicate = this.connection.sendSubscribe(this);
    pushActionCallback(this.inflightSubscribe, isDuplicate, callback);
    return;
  }
  this.pendingFetch.push(callback);
};

// Unsubscribe. The data will stay around in local memory, but we'll stop
// receiving updates
Doc.prototype.unsubscribe = function(callback) {
  this.wantSubscribe = false;
  // The subscribed state should be conservative in indicating when we are
  // subscribed on the server. We'll actually be unsubscribed some time
  // between sending the message and hearing back, but we cannot know exactly
  // when. Thus, immediately mark us as not subscribed
  this.subscribed = false;
  if (this.connection.canSend) {
    var isDuplicate = this.connection.sendUnsubscribe(this);
    pushActionCallback(this.inflightUnsubscribe, isDuplicate, callback);
    return;
  }
  if (callback) process.nextTick(callback);
};

function pushActionCallback(inflight, isDuplicate, callback) {
  if (isDuplicate) {
    var lastCallback = inflight.pop();
    inflight.push(function(err) {
      lastCallback && lastCallback(err);
      callback && callback(err);
    });
  } else {
    inflight.push(callback);
  }
}


// Operations //

// Send the next pending op to the server, if we can.
//
// Only one operation can be in-flight at a time. If an operation is already on
// its way, or we're not currently connected, this method does nothing.
Doc.prototype.flush = function() {
  // Ignore if we can't send or we are already sending an op
  if (!this.connection.canSend || this.inflightOp) return;

  // Send first pending op unless paused
  if (!this.paused && this.pendingOps.length) {
    this._sendOp();
  }
};

// Helper function to set op to contain a no-op.
function setNoOp(op) {
  delete op.op;
  delete op.create;
  delete op.del;
}

// Transform server op data by a client op, and vice versa. Ops are edited in place.
function transformX(client, server) {
  // Order of statements in this function matters. Be especially careful if
  // refactoring this function

  // A client delete op should dominate if both the server and the client
  // delete the document. Thus, any ops following the client delete (such as a
  // subsequent create) will be maintained, since the server op is transformed
  // to a no-op
  if (client.del) return setNoOp(server);

  if (server.del) {
    return new ShareDBError(4017, 'Document was deleted');
  }
  if (server.create) {
    return new ShareDBError(4018, 'Document alredy created');
  }

  // Ignore no-op coming from server
  if (!server.op) return;

  // I believe that this should not occur, but check just in case
  if (client.create) {
    return new ShareDBError(4018, 'Document already created');
  }

  // They both edited the document. This is the normal case for this function -
  // as in, most of the time we'll end up down here.
  //
  // You should be wondering why I'm using client.type instead of this.type.
  // The reason is, if we get ops at an old version of the document, this.type
  // might be undefined or a totally different type. By pinning the type to the
  // op data, we make sure the right type has its transform function called.
  if (client.type.transformX) {
    var result = client.type.transformX(client.op, server.op);
    client.op = result[0];
    server.op = result[1];
  } else {
    var clientOp = client.type.transform(client.op, server.op, 'left');
    var serverOp = client.type.transform(server.op, client.op, 'right');
    client.op = clientOp;
    server.op = serverOp;
  }
};

/**
 * Applies the operation to the snapshot
 *
 * If the operation is create or delete it emits `create` or `del`. Then the
 * operation is applied to the snapshot and `op` and `after op` are emitted.
 * If the type supports incremental updates and `this.incremental` is true we
 * fire `op` after every small operation.
 *
 * This is the only function to fire the above mentioned events.
 *
 * @private
 */
Doc.prototype._otApply = function(op, source) {
  if (op.op) {
    if (!this.type) {
      var err = new ShareDBError(4015, 'Cannot apply op to uncreated document. ' + this.collection + '.' + this.id);
      return this.emit('error', err);
    }

    // Iteratively apply multi-component remote operations and rollback ops
    // (source === false) for the default JSON0 OT type. It could use
    // type.shatter(), but since this code is so specific to use cases for the
    // JSON0 type and ShareDB explicitly bundles the default type, we might as
    // well write it this way and save needing to iterate through the op
    // components twice.
    //
    // Ideally, we would not need this extra complexity. However, it is
    // helpful for implementing bindings that update DOM nodes and other
    // stateful objects by translating op events directly into corresponding
    // mutations. Such bindings are most easily written as responding to
    // individual op components one at a time in order, and it is important
    // that the snapshot only include updates from the particular op component
    // at the time of emission. Eliminating this would require rethinking how
    // such external bindings are implemented.
    if (!source && this.type === types.defaultType && op.op.length > 1) {
      if (!this.applyStack) this.applyStack = [];
      var stackLength = this.applyStack.length;
      for (var i = 0; i < op.op.length; i++) {
        var component = op.op[i];
        var componentOp = {op: [component]};
        // Transform componentOp against any ops that have been submitted
        // sychronously inside of an op event handler since we began apply of
        // our operation
        for (var j = stackLength; j < this.applyStack.length; j++) {
          var transformErr = transformX(this.applyStack[j], componentOp);
          if (transformErr) return this._hardRollback(transformErr);
        }
        // Apply the individual op component
        this.emit('before op', componentOp.op, source);
        this.data = this.type.apply(this.data, componentOp.op);
        this.emit('op', componentOp.op, source);
      }
      // Pop whatever was submitted since we started applying this op
      this._popApplyStack(stackLength);
      return;
    }

    // The 'before op' event enables clients to pull any necessary data out of
    // the snapshot before it gets changed
    this.emit('before op', op.op, source);
    // Apply the operation to the local data, mutating it in place
    this.data = this.type.apply(this.data, op.op);
    // Emit an 'op' event once the local data includes the changes from the
    // op. For locally submitted ops, this will be synchronously with
    // submission and before the server or other clients have received the op.
    // For ops from other clients, this will be after the op has been
    // committed to the database and published
    this.emit('op', op.op, source);
    return;
  }

  if (op.create) {
    this._setType(op.create.type);
    this.data = (this.type.deserialize) ?
      (this.type.createDeserialized) ?
        this.type.createDeserialized(op.create.data) :
        this.type.deserialize(this.type.create(op.create.data)) :
      this.type.create(op.create.data);
    this.emit('create', source);
    return;
  }

  if (op.del) {
    var oldData = this.data;
    this._setType(null);
    this.emit('del', oldData, source);
    return;
  }
};


// ***** Sending operations

// Actually send op to the server.
Doc.prototype._sendOp = function() {
  // Wait until we have a src id from the server
  var src = this.connection.id;
  if (!src) return;

  // When there is no inflightOp, send the first item in pendingOps. If
  // there is inflightOp, try sending it again
  if (!this.inflightOp) {
    // Send first pending op
    this.inflightOp = this.pendingOps.shift();
  }
  var op = this.inflightOp;
  if (!op) {
    var err = new ShareDBError(5010, 'No op to send on call to _sendOp');
    return this.emit('error', err);
  }

  // Track data for retrying ops
  op.sentAt = Date.now();
  op.retries = (op.retries == null) ? 0 : op.retries + 1;

  // The src + seq number is a unique ID representing this operation. This tuple
  // is used on the server to detect when ops have been sent multiple times and
  // on the client to match acknowledgement of an op back to the inflightOp.
  // Note that the src could be different from this.connection.id after a
  // reconnect, since an op may still be pending after the reconnection and
  // this.connection.id will change. In case an op is sent multiple times, we
  // also need to be careful not to override the original seq value.
  if (op.seq == null) op.seq = this.connection.seq++;

  this.connection.sendOp(this, op);

  // src isn't needed on the first try, since the server session will have the
  // same id, but it must be set on the inflightOp in case it is sent again
  // after a reconnect and the connection's id has changed by then
  if (op.src == null) op.src = src;
};


// Queues the operation for submission to the server and applies it locally.
//
// Internal method called to do the actual work for submit(), create() and del().
// @private
//
// @param op
// @param [op.op]
// @param [op.del]
// @param [op.create]
// @param [callback] called when operation is submitted
Doc.prototype._submit = function(op, source, callback) {
  // Locally submitted ops must always have a truthy source
  if (!source) source = true;

  // The op contains either op, create, delete, or none of the above (a no-op).
  if (op.op) {
    if (!this.type) {
      var err = new ShareDBError(4015, 'Cannot submit op. Document has not been created. ' + this.collection + '.' + this.id);
      if (callback) return callback(err);
      return this.emit('error', err);
    }
    // Try to normalize the op. This removes trailing skip:0's and things like that.
    if (this.type.normalize) op.op = this.type.normalize(op.op);
  }

  this._pushOp(op, callback);
  this._otApply(op, source);

  // The call to flush is delayed so if submit() is called multiple times
  // synchronously, all the ops are combined before being sent to the server.
  var doc = this;
  process.nextTick(function() {
    doc.flush();
  });
};

Doc.prototype._pushOp = function(op, callback) {
  if (this.applyStack) {
    // If we are in the process of incrementally applying an operation, don't
    // compose the op and push it onto the applyStack so it can be transformed
    // against other components from the op or ops being applied
    this.applyStack.push(op);
  } else {
    // If the type supports composes, try to compose the operation onto the
    // end of the last pending operation.
    var composed = this._tryCompose(op);
    if (composed) {
      composed.callbacks.push(callback);
      return;
    }
  }
  // Push on to the pendingOps queue of ops to submit if we didn't compose
  op.type = this.type;
  op.callbacks = [callback];
  this.pendingOps.push(op);
};

Doc.prototype._popApplyStack = function(to) {
  if (to > 0) {
    this.applyStack.length = to;
    return;
  }
  // Once we have completed the outermost apply loop, reset to null and no
  // longer add ops to the applyStack as they are submitted
  var op = this.applyStack[0];
  this.applyStack = null;
  if (!op) return;
  // Compose the ops added since the beginning of the apply stack, since we
  // had to skip compose when they were originally pushed
  var i = this.pendingOps.indexOf(op);
  if (i === -1) return;
  var ops = this.pendingOps.splice(i);
  for (var i = 0; i < ops.length; i++) {
    var op = ops[i];
    var composed = this._tryCompose(op);
    if (composed) {
      composed.callbacks = composed.callbacks.concat(op.callbacks);
    } else {
      this.pendingOps.push(op);
    }
  }
};

// Try to compose a submitted op into the last pending op. Returns the
// composed op if it succeeds, undefined otherwise
Doc.prototype._tryCompose = function(op) {
  if (this.preventCompose) return;

  // We can only compose into the last pending op. Inflight ops have already
  // been sent to the server, so we can't modify them
  var last = this.pendingOps[this.pendingOps.length - 1];
  if (!last) return;

  // Compose an op into a create by applying it. This effectively makes the op
  // invisible, as if the document were created including the op originally
  if (last.create && op.op) {
    last.create.data = this.type.apply(last.create.data, op.op);
    return last;
  }

  // Compose two ops into a single op if supported by the type. Types that
  // support compose must be able to compose any two ops together
  if (last.op && op.op && this.type.compose) {
    last.op = this.type.compose(last.op, op.op);
    return last;
  }
};

// *** Client OT entrypoints.

// Submit an operation to the document.
//
// @param operation handled by the OT type
// @param options  {source: ...}
// @param [callback] called after operation submitted
//
// @fires before op, op, after op
Doc.prototype.submitOp = function(component, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  var op = {op: component};
  var source = options && options.source;
  this._submit(op, source, callback);
};

// Create the document, which in ShareJS semantics means to set its type. Every
// object implicitly exists in the database but has no data and no type. Create
// sets the type of the object and can optionally set some initial data on the
// object, depending on the type.
//
// @param data  initial
// @param type  OT type
// @param options  {source: ...}
// @param callback  called when operation submitted
Doc.prototype.create = function(data, type, options, callback) {
  if (typeof type === 'function') {
    callback = type;
    options = null;
    type = null;
  } else if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  if (!type) {
    type = types.defaultType.uri;
  }
  if (this.type) {
    var err = new ShareDBError(4016, 'Document already exists');
    if (callback) return callback(err);
    return this.emit('error', err);
  }
  var op = {create: {type: type, data: data}};
  var source = options && options.source;
  this._submit(op, source, callback);
};

// Delete the document. This creates and submits a delete operation to the
// server. Deleting resets the object's type to null and deletes its data. The
// document still exists, and still has the version it used to have before you
// deleted it (well, old version +1).
//
// @param options  {source: ...}
// @param callback  called when operation submitted
Doc.prototype.del = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  if (!this.type) {
    var err = new ShareDBError(4015, 'Document does not exist');
    if (callback) return callback(err);
    return this.emit('error', err);
  }
  var op = {del: true};
  var source = options && options.source;
  this._submit(op, source, callback);
};


// Stops the document from sending any operations to the server.
Doc.prototype.pause = function() {
  this.paused = true;
};

// Continue sending operations to the server
Doc.prototype.resume = function() {
  this.paused = false;
  this.flush();
};


// *** Receiving operations

// This is called when the server acknowledges an operation from the client.
Doc.prototype._opAcknowledged = function(message) {
  if (this.inflightOp.create) {
    this.version = message.v;

  } else if (message.v !== this.version) {
    // We should already be at the same version, because the server should
    // have sent all the ops that have happened before acknowledging our op
    console.warn('Invalid version from server. Expected: ' + this.version + ' Received: ' + message.v, message);

    // Fetching should get us back to a working document state
    return this.fetch();
  }

  // The op was committed successfully. Increment the version number
  this.version++;

  this._clearInflightOp();
};

Doc.prototype._rollback = function(err) {
  // The server has rejected submission of the current operation. Invert by
  // just the inflight op if possible. If not possible to invert, cancel all
  // pending ops and fetch the latest from the server to get us back into a
  // working state, then call back
  var op = this.inflightOp;

  if (op.op && op.type.invert) {
    op.op = op.type.invert(op.op);

    // Transform the undo operation by any pending ops.
    for (var i = 0; i < this.pendingOps.length; i++) {
      var transformErr = transformX(this.pendingOps[i], op);
      if (transformErr) return this._hardRollback(transformErr);
    }

    // ... and apply it locally, reverting the changes.
    //
    // This operation is applied to look like it comes from a remote source.
    // I'm still not 100% sure about this functionality, because its really a
    // local op. Basically, the problem is that if the client's op is rejected
    // by the server, the editor window should update to reflect the undo.
    this._otApply(op, false);

    this._clearInflightOp(err);
    return;
  }

  this._hardRollback(err);
};

Doc.prototype._hardRollback = function(err) {
  // Cancel all pending ops and reset if we can't invert
  var op = this.inflightOp;
  var pending = this.pendingOps;
  this._setType(null);
  this.version = null;
  this.inflightOp = null;
  this.pendingOps = [];

  // Fetch the latest from the server to get us back into a working state
  var doc = this;
  this.fetch(function() {
    var called = op && callEach(op.callbacks, err);
    for (var i = 0; i < pending.length; i++) {
      callEach(pending[i].callbacks, err);
    }
    if (err && !called) return doc.emit('error', err);
  });
};

Doc.prototype._clearInflightOp = function(err) {
  var called = callEach(this.inflightOp.callbacks, err);

  this.inflightOp = null;
  this.flush();
  this._emitNothingPending();

  if (err && !called) return this.emit('error', err);
};

function callEach(callbacks, err) {
  var called = false;
  for (var i = 0; i < callbacks.length; i++) {
    var callback = callbacks[i];
    if (callback) {
      callback(err);
      called = true;
    }
  }
  return called;
}

}).call(this,require('_process'))
},{"../emitter":16,"../error":17,"../types":18,"_process":11}],14:[function(require,module,exports){
exports.Connection = require('./connection');
exports.Doc = require('./doc');
exports.Error = require('../error');
exports.Query = require('./query');
exports.types = require('../types');

},{"../error":17,"../types":18,"./connection":12,"./doc":13,"./query":15}],15:[function(require,module,exports){
(function (process){
var emitter = require('../emitter');

// Queries are live requests to the database for particular sets of fields.
//
// The server actively tells the client when there's new data that matches
// a set of conditions.
module.exports = Query;
function Query(action, connection, id, collection, query, options, callback) {
  emitter.EventEmitter.call(this);

  // 'qf' or 'qs'
  this.action = action;

  this.connection = connection;
  this.id = id;
  this.collection = collection;

  // The query itself. For mongo, this should look something like {"data.x":5}
  this.query = query;

  // A list of resulting documents. These are actual documents, complete with
  // data and all the rest. It is possible to pass in an initial results set,
  // so that a query can be serialized and then re-established
  this.results = null;
  if (options && options.results) {
    this.results = options.results;
    delete options.results;
  }
  this.extra = undefined;

  // Options to pass through with the query
  this.options = options;

  this.callback = callback;
  this.ready = false;
  this.sent = false;
}
emitter.mixin(Query);

Query.prototype.hasPending = function() {
  return !this.ready;
};

// Helper for subscribe & fetch, since they share the same message format.
//
// This function actually issues the query.
Query.prototype.send = function() {
  if (!this.connection.canSend) return;

  var message = {
    a: this.action,
    id: this.id,
    c: this.collection,
    q: this.query
  };
  if (this.options) {
    message.o = this.options;
  }
  if (this.results) {
    // Collect the version of all the documents in the current result set so we
    // don't need to be sent their snapshots again.
    var results = [];
    for (var i = 0; i < this.results.length; i++) {
      var doc = this.results[i];
      results.push([doc.id, doc.version]);
    }
    message.r = results;
  }

  this.connection.send(message);
  this.sent = true;
};

// Destroy the query object. Any subsequent messages for the query will be
// ignored by the connection.
Query.prototype.destroy = function(callback) {
  if (this.connection.canSend && this.action === 'qs') {
    this.connection.send({a: 'qu', id: this.id});
  }
  this.connection._destroyQuery(this);
  // There is a callback for consistency, but we don't actually wait for the
  // server's unsubscribe message currently
  if (callback) process.nextTick(callback);
};

Query.prototype._onConnectionStateChanged = function() {
  if (this.connection.canSend && !this.sent) {
    this.send();
  } else {
    this.sent = false;
  }
};

Query.prototype._handleFetch = function(err, data, extra) {
  // Once a fetch query gets its data, it is destroyed.
  this.connection._destroyQuery(this);
  this._handleResponse(err, data, extra);
};

Query.prototype._handleSubscribe = function(err, data, extra) {
  this._handleResponse(err, data, extra);
};

Query.prototype._handleResponse = function(err, data, extra) {
  var callback = this.callback;
  this.callback = null;
  if (err) return this._finishResponse(err, callback);
  if (!data) return this._finishResponse(null, callback);

  var query = this;
  var wait = 1;
  var finish = function(err) {
    if (err) return query._finishResponse(err, callback);
    if (--wait) return;
    query._finishResponse(null, callback);
  };

  if (Array.isArray(data)) {
    wait += data.length;
    this.results = this._ingestSnapshots(data, finish);
    this.extra = extra;

  } else {
    for (var id in data) {
      wait++;
      var snapshot = data[id];
      var doc = this.connection.get(snapshot.c || this.collection, id);
      doc.ingestSnapshot(snapshot, finish);
    }
  }

  finish();
};

Query.prototype._ingestSnapshots = function(snapshots, finish) {
  var results = [];
  for (var i = 0; i < snapshots.length; i++) {
    var snapshot = snapshots[i];
    var doc = this.connection.get(snapshot.c || this.collection, snapshot.d);
    doc.ingestSnapshot(snapshot, finish);
    results.push(doc);
  }
  return results;
};

Query.prototype._finishResponse = function(err, callback) {
  this.emit('ready');
  this.ready = true;
  if (err) {
    this.connection._destroyQuery(this);
    if (callback) return callback(err);
    return this.emit('error', err);
  }
  if (callback) callback(null, this.results, this.extra);
};

Query.prototype._handleError = function(err) {
  this.emit('error', err);
};

Query.prototype._handleDiff = function(diff) {
  // We need to go through the list twice. First, we'll ingest all the new
  // documents. After that we'll emit events and actually update our list.
  // This avoids race conditions around setting documents to be subscribed &
  // unsubscribing documents in event callbacks.
  for (var i = 0; i < diff.length; i++) {
    var d = diff[i];
    if (d.type === 'insert') d.values = this._ingestSnapshots(d.values);
  }

  for (var i = 0; i < diff.length; i++) {
    var d = diff[i];
    switch (d.type) {
      case 'insert':
        var newDocs = d.values;
        Array.prototype.splice.apply(this.results, [d.index, 0].concat(newDocs));
        this.emit('insert', newDocs, d.index);
        break;
      case 'remove':
        var howMany = d.howMany || 1;
        var removed = this.results.splice(d.index, howMany);
        this.emit('remove', removed, d.index);
        break;
      case 'move':
        var howMany = d.howMany || 1;
        var docs = this.results.splice(d.from, howMany);
        Array.prototype.splice.apply(this.results, [d.to, 0].concat(docs));
        this.emit('move', docs, d.from, d.to);
        break;
    }
  }

  this.emit('changed', this.results);
};

Query.prototype._handleExtra = function(extra) {
  this.extra = extra;
  this.emit('extra', extra);
};

}).call(this,require('_process'))
},{"../emitter":16,"_process":11}],16:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter;

exports.EventEmitter = EventEmitter;
exports.mixin = mixin;

function mixin(Constructor) {
  for (var key in EventEmitter.prototype) {
    Constructor.prototype[key] = EventEmitter.prototype[key];
  }
}

},{"events":2}],17:[function(require,module,exports){
var makeError = require('make-error');

function ShareDBError(code, message) {
  ShareDBError.super.call(this, message);
  this.code = code;
}

makeError(ShareDBError);

module.exports = ShareDBError;

},{"make-error":3}],18:[function(require,module,exports){

exports.defaultType = require('ot-json0').type;

exports.map = {};

exports.register = function(type) {
  if (type.name) exports.map[type.name] = type;
  if (type.uri) exports.map[type.uri] = type;
};

exports.register(exports.defaultType);

},{"ot-json0":5}],19:[function(require,module,exports){

exports.doNothing = doNothing;
function doNothing() {}

exports.hasKeys = function(object) {
  for (var key in object) return true;
  return false;
};

},{}]},{},[1]);


/* constants.js */
var DEFAULT_CULLING_MASK = 0xFFFFFFFF;
var GEOMETRY_ONLY_CULLING_MASK = 1 | 2 | 4;
var GIZMO_MASK = 8;

// Layer ids
var LAYERID_WORLD = 0;
var LAYERID_DEPTH = 1;
var LAYERID_SKYBOX = 2;
var LAYERID_IMMEDIATE = 3;
var LAYERID_UI = 4;

// Layout groups
var ORIENTATION_HORIZONTAL = 0;
var ORIENTATION_VERTICAL = 1;
var FITTING_NONE = 0;
var FITTING_STRETCH = 1
var FITTING_SHRINK = 2
var FITTING_BOTH = 3;

// Buttons
var BUTTON_TRANSITION_MODE_TINT = 0;
var BUTTON_TRANSITION_MODE_SPRITE_CHANGE = 1;

// Scroll Views
var SCROLL_MODE_CLAMP = 0;
var SCROLL_MODE_BOUNCE = 1;
var SCROLL_MODE_INFINITE = 2;

var SCROLLBAR_VISIBILITY_SHOW_ALWAYS = 0;
var SCROLLBAR_VISIBILITY_SHOW_WHEN_REQUIRED = 1;


var CURVE_LINEAR = 0;
var CURVE_SMOOTHSTEP = 1;
var CURVE_CATMULL = 2;
var CURVE_CARDINAL = 3;
var CURVE_SPLINE = 4;
var CURVE_STEP = 5;

// Script Loading Type
var LOAD_SCRIPT_AS_ASSET = 0;
var LOAD_SCRIPT_BEFORE_ENGINE = 1;
var LOAD_SCRIPT_AFTER_ENGINE = 2;


/* utils.js */
var utils = { };


// utils.deepCopy
utils.deepCopy = function deepCopy(data) {
    if (data == null || typeof(data) !== 'object')
        return data;

    if (data instanceof Array) {
        var arr = [ ];
        for(var i = 0; i < data.length; i++) {
            arr[i] = deepCopy(data[i]);
        }
        return arr;
    } else {
        var obj = { };
        for(var key in data) {
            if (data.hasOwnProperty(key))
                obj[key] = deepCopy(data[key]);
        }
        return obj;
    }
};

utils.isMobile = function() {
  return /Android/i.test(navigator.userAgent) ||
      /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

/**
 * @name utils.implements
 * @description Adds properties and methods from the sourceClass
 * to the targetClass but only if properties with the same name do not
 * already exist in the targetClass.
 * @param {Object} targetClass The target class.
 * @param {Object} sourceClass The source class.
 * @example utils.implements(pcui.Container, pcui.IContainer);
 */
utils.implements = function (targetClass, sourceClass) {
    var properties = Object.getOwnPropertyDescriptors(sourceClass.prototype);
    for (var key in properties) {
        if (targetClass.prototype.hasOwnProperty(key)) {
            delete properties[key];
        }
    }

    Object.defineProperties(targetClass.prototype, properties);
};

/**
 * @name utils.proxy
 * @description Creates new properties on the target class that get / set
 * the properties of the member.
 * @param {Object} targetClass The target class
 * @param {String} memberName The name of the member of the target class that properties will be proxied to.
 * @param {String[]} properties A list of properties to be proxied.
 * @example utils.proxy(pcui.SliderInput, '_numericInput', ['max', 'min', 'placeholder'])
 */
utils.proxy = function (targetClass, memberName, properties) {
    properties.forEach(property => {
        Object.defineProperty(targetClass.prototype, property, {
            get: function () {
                return this[memberName][property];
            },
            set: function (value) {
                this[memberName][property] = value;
            }
        });
    });
};

// String.startsWith
if (! String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(str) {
            var that = this;
            var ceil = str.length;
            for(var i = 0; i < ceil; i++)
                if(that[i] !== str[i]) return false;
            return true;
        }
    });
}

// String.endsWith polyfill
if (! String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(str) {
            var that = this;
            for(var i = 0, ceil = str.length; i < ceil; i++)
                if (that[i + that.length - ceil] !== str[i])
                    return false;
            return true;
        }
    });
}

// Appends query parameter to string (supposedly the string is a URL)
// automatically figuring out if the separator should be ? or &.
// Example: url.appendQuery('t=123').appendQuery('q=345');
if (! String.prototype.appendQuery) {
    Object.defineProperty(String.prototype, 'appendQuery', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (queryParameter) {
            var separator = this.indexOf('?') !== -1 ? '&' : '?';
            return this + separator + queryParameter;
        }
    });
}

// element.classList.add polyfill
(function () {
    /*global DOMTokenList */
    var dummy  = document.createElement('div'),
        dtp    = DOMTokenList.prototype,
        toggle = dtp.toggle,
        add    = dtp.add,
        rem    = dtp.remove;

    dummy.classList.add('class1', 'class2');

    // Older versions of the HTMLElement.classList spec didn't allow multiple
    // arguments, easy to test for
    if (!dummy.classList.contains('class2')) {
        dtp.add    = function () {
            Array.prototype.forEach.call(arguments, add.bind(this));
        };
        dtp.remove = function () {
            Array.prototype.forEach.call(arguments, rem.bind(this));
        };
    }
})();

var bytesToHuman = function(bytes) {
    if (isNaN(bytes) || bytes === 0) return '0 B';
    var k = 1000;
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
};


// todo move this into proper library

// replace the oldExtension in a path with the newExtension
// return the new path
// oldExtension and newExtension should have leading period
var swapExtension = function (path, oldExtension, newExtension) {
    while(path.indexOf(oldExtension) >= 0) {
        path = path.replace(oldExtension, newExtension);
    }
    return path;
};


/* ajax.js */
function Ajax(args) {
    if (typeof(args) === 'string')
        args = { url: args };

    return new AjaxRequest(args);
};

Ajax.get = function(url) {
    return new AjaxRequest({
        url: url
    });
};

Ajax.post = function(url, data) {
    return new AjaxRequest({
        method: 'POST',
        url: url,
        data: data
    });
};

Ajax.put = function(url, data) {
    return new AjaxRequest({
        method: 'PUT',
        url: url,
        data: data
    });
};

Ajax.delete = function(url) {
    return new AjaxRequest({
        method: 'DELETE',
        url: url
    });
};

Ajax.params = { };

Ajax.param = function(name, value) {
    Ajax.params[name] = value;
};



function AjaxRequest(args) {
    if (! args)
        throw new Error('no arguments provided');

    Events.call(this);

    // progress
    this._progress = 0.0;
    this.emit('progress', this._progress);

    // xhr
    this._xhr = new XMLHttpRequest();

    // send cookies
    if (args.cookies)
        this._xhr.withCredentials = true;

    // events
    this._xhr.addEventListener('load', this._onLoad.bind(this), false);
    // this._xhr.addEventListener('progress', this._onProgress.bind(this), false);
    this._xhr.upload.addEventListener('progress', this._onProgress.bind(this), false);
    this._xhr.addEventListener('error', this._onError.bind(this), false);
    this._xhr.addEventListener('abort', this._onAbort.bind(this), false);

    // url
    var url = args.url;

    // query
    if (args.query && Object.keys(args.query).length) {
        if (url.indexOf('?') === -1) {
            url += '?';
        }

        var query = [ ];
        for(var key in args.query) {
            query.push(key + '=' + args.query[key]);
        }

        url += query.join('&');
    }

    // templating
    var parts = url.split('{{');
    if (parts.length > 1) {
        for(var i = 1; i < parts.length; i++) {
            var ends = parts[i].indexOf('}}');
            var key = parts[i].slice(0, ends);

            if (Ajax.params[key] === undefined)
                continue;

            // replace
            parts[i] = Ajax.params[key] + parts[i].slice(ends + 2);
        }

        url = parts.join('');
    }

    // open request
    this._xhr.open(args.method || 'GET', url, true);

    this.notJson = args.notJson || false;

    // header for PUT/POST
    if (! args.ignoreContentType && (args.method === 'PUT' || args.method === 'POST' || args.method === 'DELETE'))
        this._xhr.setRequestHeader('Content-Type', 'application/json');

    if (args.auth && config.accessToken) {
        this._xhr.setRequestHeader('Authorization', 'Bearer ' + config.accessToken);
    }

    if (args.headers) {
        for (var key in args.headers)
            this._xhr.setRequestHeader(key, args.headers[key]);
    }

    // stringify data if needed
    if (args.data && typeof(args.data) !== 'string' && ! (args.data instanceof FormData)) {
        args.data = JSON.stringify(args.data);
    }

    // make request
    this._xhr.send(args.data || null);
};
AjaxRequest.prototype = Object.create(Events.prototype);


AjaxRequest.prototype._onLoad = function() {
    this._progress = 1.0;
    this.emit('progress', 1.0);

    if (this._xhr.status === 200 || this._xhr.status === 201) {
        if (this.notJson) {
            this.emit('load', this._xhr.status, this._xhr.responseText);
        } else {
            try {
                var json = JSON.parse(this._xhr.responseText);
            } catch(ex) {
                this.emit('error', this._xhr.status || 0, new Error('invalid json'));
                return;
            }
            this.emit('load', this._xhr.status, json);
        }
    } else {
        try {
            var json = JSON.parse(this._xhr.responseText);
            var msg = json.message;
            if (! msg) {
                msg = json.error || (json.response && json.response.error);
            }

            if (! msg) {
                msg = this._xhr.responseText;
            }

            this.emit('error', this._xhr.status, msg);
        } catch (ex) {
            this.emit('error', this._xhr.status);
        }
    }
};


AjaxRequest.prototype._onError = function(evt) {
    this.emit('error', 0, evt);
};


AjaxRequest.prototype._onAbort = function(evt) {
    this.emit('error', 0, evt);
};


AjaxRequest.prototype._onProgress = function(evt) {
    if (! evt.lengthComputable)
        return;

    var progress = evt.loaded / evt.total;

    if (progress !== this._progress) {
        this._progress = progress;
        this.emit('progress', this._progress);
    }
};


AjaxRequest.prototype.abort = function() {
    this._xhr.abort();
};


/* array.js */
Object.defineProperty(Array.prototype, 'equals', {
    enumerable: false,
    value: function(array) {
        if (! array)
            return false;

        if (this.length !== array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (! this[i].equals(array[i]))
                    return false;
            } else if (this[i] !== array[i]) {
                return false;
            }
        }
        return true;
    }
});

Object.defineProperty(Array.prototype, 'match', {
    enumerable: false,
    value: function(pattern) {
        if (this.length !== pattern.length)
            return;

        for(var i = 0, l = this.length; i < l; i++) {
            if (pattern[i] !== '*' && pattern[i] !== this[i])
                return false;
        }

        return true;
    }
});


// Object.defineProperty(Array.prototype, 'binaryIndexOf', {
//     enumerable: false,
//     value: function(b) {
//         var min = 0;
//         var max = this.length - 1;
//         var cur;
//         var a;

//         while (min <= max) {
//             cur = Math.floor((min + max) / 2);
//             a = this[cur];

//             if (a < b) {
//                 min = cur + 1;
//             } else if (a > b) {
//                 max = cur - 1;
//             } else {
//                 return cur;
//             }
//         }

//         return -1;
//     }
// });



/* observer.js */
"use strict";

function Observer(data, options) {
    Events.call(this);
    options = options || { };

    this._destroyed = false;
    this._path = '';
    this._keys = [ ];
    this._data = { };

    // array paths where duplicate entries are allowed - normally
    // we check if an array already has a value before inserting it
    // but if the array path is in here we'll allow it
    this._pathsWithDuplicates = null;
    if (options.pathsWithDuplicates) {
        this._pathsWithDuplicates = {};
        for (var i = 0; i < options.pathsWithDuplicates.length; i++) {
            this._pathsWithDuplicates[options.pathsWithDuplicates[i]] = true;
        }
    }

    this.patch(data);

    this._parent = options.parent || null;
    this._parentPath = options.parentPath || '';
    this._parentField = options.parentField || null;
    this._parentKey = options.parentKey || null;

    this._latestFn = options.latestFn || null;

    this._silent = false;

    var propagate = function(evt) {
        return function(path, arg1, arg2, arg3) {
            if (! this._parent)
                return;

            var key = this._parentKey;
            if (! key && (this._parentField instanceof Array)) {
                key = this._parentField.indexOf(this);

                if (key === -1)
                    return;
            }

            path = this._parentPath + '.' + key + '.' + path;

            var state;
            if (this._silent)
                state = this._parent.silence();

            this._parent.emit(path + ':' + evt, arg1, arg2, arg3);
            this._parent.emit('*:' + evt, path, arg1, arg2, arg3);

            if (this._silent)
                this._parent.silenceRestore(state);
        }
    };

    // propagate set
    this.on('*:set', propagate('set'));
    this.on('*:unset', propagate('unset'));
    this.on('*:insert', propagate('insert'));
    this.on('*:remove', propagate('remove'));
    this.on('*:move', propagate('move'));
}
Observer.prototype = Object.create(Events.prototype);

Observer.prototype.silence = function() {
    this._silent = true;

    // history hook to prevent array values to be recorded
    var historyState = this.history && this.history.enabled;
    if (historyState)
        this.history.enabled = false;

    // sync hook to prevent array values to be recorded as array root already did
    var syncState = this.sync && this.sync.enabled;
    if (syncState)
        this.sync.enabled = false;

    return [ historyState, syncState ];
};


Observer.prototype.silenceRestore = function(state) {
    this._silent = false;

    if (state[0])
        this.history.enabled = true;

    if (state[1])
        this.sync.enabled = true;
};


Observer.prototype._prepare = function(target, key, value, silent, remote) {
    var self = this;
    var state;
    var path = (target._path ? (target._path + '.') : '') + key;
    var type = typeof(value);

    target._keys.push(key);

    if (type === 'object' && (value instanceof Array)) {
        target._data[key] = value.slice(0);

        for(var i = 0; i < target._data[key].length; i++) {
            if (typeof(target._data[key][i]) === 'object' && target._data[key][i] !== null) {
                if (target._data[key][i] instanceof Array) {
                    target._data[key][i].slice(0);
                } else {
                    target._data[key][i] = new Observer(target._data[key][i], {
                        parent: this,
                        parentPath: path,
                        parentField: target._data[key],
                        parentKey: null
                    });
                }
            } else {
                state = this.silence();
                this.emit(path + '.' + i + ':set', target._data[key][i], null, remote);
                this.emit('*:set', path + '.' + i, target._data[key][i], null, remote);
                this.silenceRestore(state);
            }
        }

        if (silent)
            state = this.silence();

        this.emit(path + ':set', target._data[key], null, remote);
        this.emit('*:set', path, target._data[key], null, remote);

        if (silent)
            this.silenceRestore(state);
    } else if (type === 'object' && (value instanceof Object)) {
        if (typeof(target._data[key]) !== 'object') {
            target._data[key] = {
                _path: path,
                _keys: [ ],
                _data: { }
            };
        }

        for(var i in value) {
            if (typeof(value[i]) === 'object') {
                this._prepare(target._data[key], i, value[i], true, remote);
            } else {
                state = this.silence();

                target._data[key]._data[i] = value[i];
                target._data[key]._keys.push(i);

                this.emit(path + '.' + i + ':set', value[i], null, remote);
                this.emit('*:set', path + '.' + i, value[i], null, remote);

                this.silenceRestore(state);
            }
        }

        if (silent)
            state = this.silence();

        // passing undefined as valueOld here
        // but we should get the old value to be consistent
        this.emit(path + ':set', value, undefined, remote);
        this.emit('*:set', path, value, undefined, remote);

        if (silent)
            this.silenceRestore(state);
    } else {
        if (silent)
            state = this.silence();

        target._data[key] = value;

        this.emit(path + ':set', value, undefined, remote);
        this.emit('*:set', path, value, undefined, remote);

        if (silent)
            this.silenceRestore(state);
    }

    return true;
};


Observer.prototype.set = function(path, value, silent, remote, force) {
    var keys = path.split('.');
    var length = keys.length;
    var key = keys[length - 1];
    var node = this;
    var nodePath = '';
    var obj = this;
    var state;

    for(var i = 0; i < length - 1; i++) {
        if (node instanceof Array) {
            node = node[keys[i]];

            if (node instanceof Observer) {
                path = keys.slice(i + 1).join('.');
                obj = node;
            }
        } else {
            if (i < length && typeof(node._data[keys[i]]) !== 'object') {
                if (node._data[keys[i]])
                    obj.unset((node.__path ? node.__path + '.' : '') + keys[i]);

                node._data[keys[i]] = {
                    _path: path,
                    _keys: [ ],
                    _data: { }
                };
                node._keys.push(keys[i]);
            }

            if (i === length - 1 && node.__path)
                nodePath = node.__path + '.' + keys[i];

            node = node._data[keys[i]];
        }
    }

    if (node instanceof Array) {
        var ind = parseInt(key, 10);
        if (node[ind] === value && !force)
            return;

        var valueOld = node[ind];
        if (valueOld instanceof Observer) {
            valueOld = valueOld.json();
        } else {
            valueOld = obj.json(valueOld);
        }

        node[ind] = value;

        if (value instanceof Observer) {
            value._parent = obj;
            value._parentPath = nodePath;
            value._parentField = node;
            value._parentKey = null;
        }

        if (silent)
            state = obj.silence();

        obj.emit(path + ':set', value, valueOld, remote);
        obj.emit('*:set', path, value, valueOld, remote);

        if (silent)
            obj.silenceRestore(state);

        return true;
    } else if (node._data && ! node._data.hasOwnProperty(key)) {
        if (typeof(value) === 'object') {
            return obj._prepare(node, key, value, false, remote);
        } else {
            node._data[key] = value;
            node._keys.push(key);

            if (silent)
                state = obj.silence();

            obj.emit(path + ':set', value, null, remote);
            obj.emit('*:set', path, value, null, remote);

            if (silent)
                obj.silenceRestore(state);

            return true;
        }
    } else {
        if (typeof(value) === 'object' && (value instanceof Array)) {
            if (value.equals(node._data[key]) && !force)
                return false;

            var valueOld = node._data[key];
            if (! (valueOld instanceof Observer))
                valueOld = obj.json(valueOld);

            if (node._data[key] && node._data[key].length === value.length) {
                state = obj.silence();

                for(var i = 0; i < node._data[key].length; i++) {
                    if (node._data[key][i] instanceof Observer) {
                        node._data[key][i].patch(value[i]);
                    } else if (node._data[key][i] !== value[i]) {
                        node._data[key][i] = value[i];
                        obj.emit(path + '.' + i + ':set', node._data[key][i], valueOld && valueOld[i] || null, remote);
                        obj.emit('*:set', path + '.' + i, node._data[key][i], valueOld && valueOld[i] || null, remote);
                    }
                }

                obj.silenceRestore(state);
            } else {
                node._data[key] = value;

                state = obj.silence();
                for(var i = 0; i < node._data[key].length; i++) {
                    obj.emit(path + '.' + i + ':set', node._data[key][i], valueOld && valueOld[i] || null, remote);
                    obj.emit('*:set', path + '.' + i, node._data[key][i], valueOld && valueOld[i] || null, remote);
                }
                obj.silenceRestore(state);
            }

            if (silent)
                state = obj.silence();

            obj.emit(path + ':set', value, valueOld, remote);
            obj.emit('*:set', path, value, valueOld, remote);

            if (silent)
                obj.silenceRestore(state);

            return true;
        } else if (typeof(value) === 'object' && (value instanceof Object)) {
            var changed = false;
            var valueOld = node._data[key];
            if (! (valueOld instanceof Observer))
                valueOld = obj.json(valueOld);

            var keys = Object.keys(value);

            if (! node._data[key] || ! node._data[key]._data) {
                if (node._data[key]) {
                    obj.unset((node.__path ? node.__path + '.' : '') + key);
                } else {
                    changed = true;
                }

                node._data[key] = {
                    _path: path,
                    _keys: [ ],
                    _data: { }
                };
            }

            for(var n in node._data[key]._data) {
                if (! value.hasOwnProperty(n)) {
                    var c = obj.unset(path + '.' + n, true);
                    if (c) changed = true;
                } else if (node._data[key]._data.hasOwnProperty(n)) {
                    if (! obj._equals(node._data[key]._data[n], value[n])) {
                        var c = obj.set(path + '.' + n, value[n], true);
                        if (c) changed = true;
                    }
                } else {
                    var c = obj._prepare(node._data[key], n, value[n], true, remote);
                    if (c) changed = true;
                }
            }

            for(var i = 0; i < keys.length; i++) {
                if (value[keys[i]] === undefined && node._data[key]._data.hasOwnProperty(keys[i])) {
                    var c = obj.unset(path + '.' + keys[i], true);
                    if (c) changed = true;
                } else if (typeof(value[keys[i]]) === 'object') {
                    if (node._data[key]._data.hasOwnProperty(keys[i])) {
                        var c = obj.set(path + '.' + keys[i], value[keys[i]], true);
                        if (c) changed = true;
                    } else {
                        var c = obj._prepare(node._data[key], keys[i], value[keys[i]], true, remote);
                        if (c) changed = true;
                    }
                } else if (! obj._equals(node._data[key]._data[keys[i]], value[keys[i]])) {
                    if (typeof(value[keys[i]]) === 'object') {
                        var c = obj.set(node._data[key]._path + '.' + keys[i], value[keys[i]], true);
                        if (c) changed = true;
                    } else if (node._data[key]._data[keys[i]] !== value[keys[i]]) {
                        changed = true;

                        if (node._data[key]._keys.indexOf(keys[i]) === -1)
                            node._data[key]._keys.push(keys[i]);

                        node._data[key]._data[keys[i]] = value[keys[i]];

                        state = obj.silence();
                        obj.emit(node._data[key]._path + '.' + keys[i] + ':set', node._data[key]._data[keys[i]], null, remote);
                        obj.emit('*:set', node._data[key]._path + '.' + keys[i], node._data[key]._data[keys[i]], null, remote);
                        obj.silenceRestore(state);
                    }
                }
            }

            if (changed) {
                if (silent)
                    state = obj.silence();

                var val = obj.json(node._data[key]);

                obj.emit(node._data[key]._path + ':set', val, valueOld, remote);
                obj.emit('*:set', node._data[key]._path, val, valueOld, remote);

                if (silent)
                    obj.silenceRestore(state);

                return true;
            } else {
                return false;
            }
        } else {
            var data;
            if (! node.hasOwnProperty('_data') && node.hasOwnProperty(key)) {
                data = node;
            } else {
                data = node._data;
            }

            if (data[key] === value && !force)
                return false;

            if (silent)
                state = obj.silence();

            var valueOld = data[key];
            if (! (valueOld instanceof Observer))
                valueOld = obj.json(valueOld);

            data[key] = value;

            obj.emit(path + ':set', value, valueOld, remote);
            obj.emit('*:set', path, value, valueOld, remote);

            if (silent)
                obj.silenceRestore(state);

            return true;
        }
    }

    return false;
};


Observer.prototype.has = function(path) {
    var keys = path.split('.');
    var node = this;
    for (var i = 0, len = keys.length; i < len; i++) {
        if (node == undefined)
            return undefined;

        if (node._data) {
            node = node._data[keys[i]];
        } else {
            node = node[keys[i]];
        }
    }

    return node !== undefined;
};


Observer.prototype.get = function(path, raw) {
    var keys = path.split('.');
    var node = this;
    for (var i = 0; i < keys.length; i++) {
        if (node == undefined)
            return undefined;

        if (node._data) {
            node = node._data[keys[i]];
        } else {
            node = node[keys[i]];
        }
    }

    if (raw)
        return node;

    if (node == null) {
        return null;
    } else {
        return this.json(node);
    }
};


Observer.prototype.getRaw = function(path) {
    return this.get(path, true);
};


Observer.prototype._equals = function(a, b) {
    if (a === b) {
        return true;
    } else if (a instanceof Array && b instanceof Array && a.equals(b)) {
        return true;
    } else {
        return false;
    }
};


Observer.prototype.unset = function(path, silent, remote) {
    var keys = path.split('.');
    var key = keys[keys.length - 1];
    var node = this;
    var obj = this;

    for(var i = 0; i < keys.length - 1; i++) {
        if (node instanceof Array) {
            node = node[keys[i]];
            if (node instanceof Observer) {
                path = keys.slice(i + 1).join('.');
                obj = node;
            }
        } else {
            node = node._data[keys[i]];
        }
    }

    if (! node._data || ! node._data.hasOwnProperty(key))
        return false;

    var valueOld = node._data[key];
    if (! (valueOld instanceof Observer))
        valueOld = obj.json(valueOld);

    // recursive
    if (node._data[key] && node._data[key]._data) {
        // do this in reverse order because node._data[key]._keys gets
        // modified as we loop
        for(var i = node._data[key]._keys.length - 1; i >= 0; i--) {
            obj.unset(path + '.' + node._data[key]._keys[i], true);
        }
    }

    node._keys.splice(node._keys.indexOf(key), 1);
    delete node._data[key];

    var state;
    if (silent)
        state = obj.silence();

    obj.emit(path + ':unset', valueOld, remote);
    obj.emit('*:unset', path, valueOld, remote);

    if (silent)
        obj.silenceRestore(state);

    return true;
};


Observer.prototype.remove = function(path, ind, silent, remote) {
    var keys = path.split('.');
    var key = keys[keys.length - 1];
    var node = this;
    var obj = this;

    for(var i = 0; i < keys.length - 1; i++) {
        if (node instanceof Array) {
            node = node[parseInt(keys[i], 10)];
            if (node instanceof Observer) {
                path = keys.slice(i + 1).join('.');
                obj = node;
            }
        } else if (node._data && node._data.hasOwnProperty(keys[i])) {
            node = node._data[keys[i]];
        } else {
            return;
        }
    }

    if (! node._data || ! node._data.hasOwnProperty(key) || ! (node._data[key] instanceof Array))
        return;

    var arr = node._data[key];
    if (arr.length < ind)
        return;

    var value = arr[ind];
    if (value instanceof Observer) {
        value._parent = null;
    } else {
        value = obj.json(value);
    }

    arr.splice(ind, 1);

    var state;
    if (silent)
        state = obj.silence();

    obj.emit(path + ':remove', value, ind, remote);
    obj.emit('*:remove', path, value, ind, remote);

    if (silent)
        obj.silenceRestore(state);

    return true;
};


Observer.prototype.removeValue = function(path, value, silent, remote) {
    var keys = path.split('.');
    var key = keys[keys.length - 1];
    var node = this;
    var obj = this;

    for(var i = 0; i < keys.length - 1; i++) {
        if (node instanceof Array) {
            node = node[parseInt(keys[i], 10)];
            if (node instanceof Observer) {
                path = keys.slice(i + 1).join('.');
                obj = node;
            }
        } else if (node._data && node._data.hasOwnProperty(keys[i])) {
            node = node._data[keys[i]];
        } else {
            return;
        }
    }

    if (! node._data || ! node._data.hasOwnProperty(key) || ! (node._data[key] instanceof Array))
        return;

    var arr = node._data[key];

    var ind = arr.indexOf(value);
    if (ind === -1) {
        return;
    }

    if (arr.length < ind)
        return;

    var value = arr[ind];
    if (value instanceof Observer) {
        value._parent = null;
    } else {
        value = obj.json(value);
    }

    arr.splice(ind, 1);

    var state;
    if (silent)
        state = obj.silence();

    obj.emit(path + ':remove', value, ind, remote);
    obj.emit('*:remove', path, value, ind, remote);

    if (silent)
        obj.silenceRestore(state);

    return true;
};


Observer.prototype.insert = function(path, value, ind, silent, remote) {
    var keys = path.split('.');
    var key = keys[keys.length - 1];
    var node = this;
    var obj = this;

    for(var i = 0; i < keys.length - 1; i++) {
        if (node instanceof Array) {
            node = node[parseInt(keys[i], 10)];
            if (node instanceof Observer) {
                path = keys.slice(i + 1).join('.');
                obj = node;
            }
        } else if (node._data && node._data.hasOwnProperty(keys[i])) {
            node = node._data[keys[i]];
        } else {
            return;
        }
    }

    if (! node._data || ! node._data.hasOwnProperty(key) || ! (node._data[key] instanceof Array))
        return;

    var arr = node._data[key];

    if (typeof(value) === 'object' && ! (value instanceof Observer)) {
        if (value instanceof Array) {
            value = value.slice(0);
        } else {
            value = new Observer(value);
        }
    }

    if (! this._pathsWithDuplicates || ! this._pathsWithDuplicates[path]) {
        if (arr.indexOf(value) !== -1) {
            return;
        }
    }

    if (ind === undefined) {
        arr.push(value);
        ind = arr.length - 1;
    } else {
        arr.splice(ind, 0, value);
    }

    if (value instanceof Observer) {
        value._parent = obj;
        value._parentPath = (node._path ? node._path + '.' + key : key);
        value._parentField = arr;
        value._parentKey = null;
    } else {
        value = obj.json(value);
    }

    var state;
    if (silent)
        state = obj.silence();

    obj.emit(path + ':insert', value, ind, remote);
    obj.emit('*:insert', path, value, ind, remote);

    if (silent)
        obj.silenceRestore(state);

    return true;
};


Observer.prototype.move = function(path, indOld, indNew, silent, remote) {
    var keys = path.split('.');
    var key = keys[keys.length - 1];
    var node = this;
    var obj = this;

    for(var i = 0; i < keys.length - 1; i++) {
        if (node instanceof Array) {
            node = node[parseInt(keys[i], 10)];
            if (node instanceof Observer) {
                path = keys.slice(i + 1).join('.');
                obj = node;
            }
        } else if (node._data && node._data.hasOwnProperty(keys[i])) {
            node = node._data[keys[i]];
        } else {
            return;
        }
    }

    if (! node._data || ! node._data.hasOwnProperty(key) || ! (node._data[key] instanceof Array))
        return;

    var arr = node._data[key];

    if (arr.length < indOld || arr.length < indNew || indOld === indNew)
        return;

    var value = arr[indOld];

    arr.splice(indOld, 1);

    if (indNew === -1)
        indNew = arr.length;

    arr.splice(indNew, 0, value);

    if (! (value instanceof Observer))
        value = obj.json(value);

    var state;
    if (silent)
        state = obj.silence();

    obj.emit(path + ':move', value, indNew, indOld, remote);
    obj.emit('*:move', path, value, indNew, indOld, remote);

    if (silent)
        obj.silenceRestore(state);

    return true;
};


Observer.prototype.patch = function(data) {
    if (typeof(data) !== 'object')
        return;

    for(var key in data) {
        if (typeof(data[key]) === 'object' && ! this._data.hasOwnProperty(key)) {
            this._prepare(this, key, data[key]);
        } else if (this._data[key] !== data[key]) {
            this.set(key, data[key]);
        }
    }
};


Observer.prototype.json = function(target) {
    var obj = { };
    var node = target === undefined ? this : target;
    var len, nlen;

    if (node instanceof Object && node._keys) {
        len = node._keys.length;
        for (var i = 0; i < len; i++) {
            var key = node._keys[i];
            var value = node._data[key];
            var type = typeof(value);

            if (type === 'object' && (value instanceof Array)) {
                obj[key] = value.slice(0);

                nlen = obj[key].length;
                for(var n = 0; n < nlen; n++) {
                    if (typeof(obj[key][n]) === 'object')
                        obj[key][n] = this.json(obj[key][n]);
                }
            } else if (type === 'object' && (value instanceof Object)) {
                obj[key] = this.json(value);
            } else {
                obj[key] = value;
            }
        }
    } else {
        if (node === null) {
            return null;
        } else if (typeof(node) === 'object' && (node instanceof Array)) {
            obj = node.slice(0);

            len = obj.length;
            for(var n = 0; n < len; n++) {
                obj[n] = this.json(obj[n]);
            }
        } else if (typeof(node) === 'object') {
            for(var key in node) {
                if (node.hasOwnProperty(key))
                    obj[key] = node[key];
            }
        } else {
            obj = node;
        }
    }
    return obj;
};


Observer.prototype.forEach = function(fn, target, path) {
    var node = target || this;
    path = path || '';

    for (var i = 0; i < node._keys.length; i++) {
        var key = node._keys[i];
        var value = node._data[key];
        var type = (this.schema && this.schema.has(path + key) && this.schema.get(path + key).type.name.toLowerCase()) || typeof(value);

        if (type === 'object' && (value instanceof Array)) {
            fn(path + key, 'array', value, key);
        } else if (type === 'object' && (value instanceof Object)) {
            fn(path + key, 'object', value, key);
            this.forEach(fn, value, path + key + '.');
        } else {
            fn(path + key, type, value, key);
        }
    }
};

/**
 * Returns the latest observer instance. This is important when
 * dealing with undo / redo where the observer might have been deleted
 * and/or possibly re-created.
 * @returns {Observer} The latest instance of the observer.
 */
Observer.prototype.latest = function () {
    return this._latestFn ? this._latestFn() : this;
};

Observer.prototype.destroy = function() {
    if (this._destroyed) return;
    this._destroyed = true;
    this.emit('destroy');
    this.unbind();
};

Object.defineProperty(Observer.prototype, 'latestFn', {
    get: function () {
        return this._latestFn;
    },
    set: function (value) {
        this._latestFn = value;
    }
});


/* observer-list.js */
"use strict";

function ObserverList(options) {
    Events.call(this);
    options = options || { };

    this.data = [ ];
    this._indexed = { };
    this.sorted = options.sorted || null;
    this.index = options.index || null;
}

ObserverList.prototype = Object.create(Events.prototype);


Object.defineProperty(ObserverList.prototype, 'length', {
    get: function() {
        return this.data.length;
    }
});


ObserverList.prototype.get = function(index) {
    if (this.index) {
        return this._indexed[index] || null;
    } else {
        return this.data[index] || null;
    }
};


ObserverList.prototype.set = function(index, value) {
    if (this.index) {
        this._indexed[index] = value;
    } else {
        this.data[index] = value;
    }
};


ObserverList.prototype.indexOf = function(item) {
    if (this.index) {
        var index = (item instanceof Observer && item.get(this.index)) || item[this.index]
        return (this._indexed[index] && index) || null;
    } else {
        var ind = this.data.indexOf(item);
        return ind !== -1 ? ind : null;
    }
};


ObserverList.prototype.position = function(b, fn) {
    var l = this.data;
    var min = 0;
    var max = l.length - 1;
    var cur;
    var a, i;
    fn = fn || this.sorted;

    while (min <= max) {
        cur = Math.floor((min + max) / 2);
        a = l[cur];

        i = fn(a, b);

        if (i === 1) {
            max = cur - 1;
        } else if (i === -1) {
            min = cur + 1;
        } else {
            return cur;
        }
    }

    return -1;
};


ObserverList.prototype.positionNextClosest = function(b, fn) {
    var l = this.data;
    var min = 0;
    var max = l.length - 1;
    var cur;
    var a, i;
    fn = fn || this.sorted;

    if (l.length === 0)
        return -1;

    if (fn(l[0], b) === 0)
        return 0;

    while (min <= max) {
        cur = Math.floor((min + max) / 2);
        a = l[cur];

        i = fn(a, b);

        if (i === 1) {
            max = cur - 1;
        } else if (i === -1) {
            min = cur + 1;
        } else {
            return cur;
        }
    }

    if (fn(a, b) === 1)
        return cur;

    if ((cur + 1) === l.length)
        return -1;

    return cur + 1;
};


ObserverList.prototype.has = function(item) {
    if (this.index) {
        var index = (item instanceof Observer && item.get(this.index)) || item[this.index]
        return !! this._indexed[index];
    } else {
        return this.data.indexOf(item) !== -1;
    }
};


ObserverList.prototype.add = function(item) {
    if (this.has(item))
        return null;

    var index = this.data.length;
    if (this.index) {
        index = (item instanceof Observer && item.get(this.index)) || item[this.index];
        this._indexed[index] = item;
    }

    var pos = 0;

    if (this.sorted) {
        pos = this.positionNextClosest(item);
        if (pos !== -1) {
            this.data.splice(pos, 0, item);
        } else {
            this.data.push(item);
        }
    } else {
        this.data.push(item);
        pos = this.data.length - 1;
    }

    this.emit('add', item, index, pos);

    return pos;
};


ObserverList.prototype.move = function(item, pos) {
    var ind = this.data.indexOf(item);
    this.data.splice(ind, 1);
    if (pos === -1) {
        this.data.push(item);
    } else {
        this.data.splice(pos, 0, item);
    }

    this.emit('move', item, pos);
};


ObserverList.prototype.remove = function(item) {
    if (! this.has(item))
        return;

    var ind = this.data.indexOf(item);

    var index = ind;
    if (this.index) {
        index = (item instanceof Observer && item.get(this.index)) || item[this.index];
        delete this._indexed[index];
    }

    this.data.splice(ind, 1);

    this.emit('remove', item, index);
};


ObserverList.prototype.removeByKey = function(index) {
    if (this.index) {
        var item = this._indexed[index];

        if (! item)
            return;

        var ind = this.data.indexOf(item);
        this.data.splice(ind, 1);

        delete this._indexed[index];

        this.emit('remove', item, ind);
    } else {
        if (this.data.length < index)
            return;

        var item = this.data[index];

        this.data.splice(index, 1);

        this.emit('remove', item, index);
    }
};


ObserverList.prototype.removeBy = function(fn) {
    var i = this.data.length;
    while(i--) {
        if (! fn(this.data[i]))
            continue;

        if (this.index) {
            delete this._indexed[this.data[i][this.index]];
        }
        this.data.splice(i, 1);

        this.emit('remove', this.data[i], i);
    }
};


ObserverList.prototype.clear = function() {
    var items = this.data.slice(0);

    this.data = [ ];
    this._indexed = { };

    var i = items.length;
    while(i--) {
        this.emit('remove', items[i], i);
    }
};


ObserverList.prototype.forEach = function(fn) {
    for(var i = 0; i < this.data.length; i++) {
        fn(this.data[i], (this.index && this.data[i][this.index]) || i);
    }
};


ObserverList.prototype.find = function(fn) {
    var items = [ ];
    for(var i = 0; i < this.data.length; i++) {
        if (! fn(this.data[i]))
            continue;

        var index = i;
        if (this.index)
            index = this.data[i][this.index];

        items.push([ index, this.data[i] ]);
    }
    return items;
};


ObserverList.prototype.findOne = function(fn) {
    for(var i = 0; i < this.data.length; i++) {
        if (! fn(this.data[i]))
            continue;

        var index = i;
        if (this.index)
            index = this.data[i][this.index];

        return [ index, this.data[i] ];
    }
    return null;
};


ObserverList.prototype.map = function(fn) {
    return this.data.map(fn);
};


ObserverList.prototype.sort = function(fn) {
    this.data.sort(fn);
};


ObserverList.prototype.array = function() {
    return this.data.slice(0);
};


ObserverList.prototype.json = function() {
    var items = this.array();
    for(var i = 0; i < items.length; i++) {
        if (items[i] instanceof Observer) {
            items[i] = items[i].json();
        }
    }
    return items;
};


/* observer-sync.js */
function ObserverSync(args) {
    Events.call(this);
    args = args || { };

    this.item = args.item;
    this._enabled = args.enabled || true;
    this._prefix = args.prefix || [ ];
    this._paths = args.paths || null;
    this._sync = args.sync || true;

    this._initialize();
}
ObserverSync.prototype = Object.create(Events.prototype);


ObserverSync.prototype._initialize = function() {
    var self = this;
    var item = this.item;

    // object/array set
    item.on('*:set', function(path, value, valueOld) {
        if (! self._enabled) return;

        // if this happens it's a bug
        if (item.sync !== self) {
            console.error('Garbage Observer Sync still pointing to item', item);
        }

        // check if path is allowed
        if (self._paths) {
            var allowedPath = false;
            for(var i = 0; i < self._paths.length; i++) {
                if (path.indexOf(self._paths[i]) !== -1) {
                    allowedPath = true;
                    break;
                }
            }

            // path is not allowed
            if (! allowedPath)
                return;
        }

        // full path
        var p = self._prefix.concat(path.split('.'));

        // need jsonify
        if (value instanceof Observer || value instanceof ObserverList)
            value = value.json();

        // can be array value
        var ind = path.lastIndexOf('.');
        if (ind !== -1 && (this.get(path.slice(0, ind)) instanceof Array)) {
            // array index should be int
            p[p.length - 1] = parseInt(p[p.length - 1], 10);

            // emit operation: list item set
            self.emit('op', {
                p: p,
                li: value,
                ld: valueOld
            });
        } else {
            // emit operation: object item set
            var obj = {
                p: p,
                oi: value
            };

            if (valueOld !== undefined) {
                obj.od = valueOld;
            }

            self.emit('op', obj);
        }
    });

    // unset
    item.on('*:unset', function(path, value) {
        if (! self._enabled) return;

        self.emit('op', {
            p: self._prefix.concat(path.split('.')),
            od: null
        });
    });

    // list move
    item.on('*:move', function(path, value, ind, indOld) {
        if (! self._enabled) return;
        self.emit('op', {
            p: self._prefix.concat(path.split('.')).concat([ indOld ]),
            lm: ind
        });
    });

    // list remove
    item.on('*:remove', function(path, value, ind) {
        if (! self._enabled) return;

        // need jsonify
        if (value instanceof Observer || value instanceof ObserverList)
            value = value.json();

        self.emit('op', {
            p: self._prefix.concat(path.split('.')).concat([ ind ]),
            ld: value
        });
    });

    // list insert
    item.on('*:insert', function(path, value, ind) {
        if (! self._enabled) return;

        // need jsonify
        if (value instanceof Observer || value instanceof ObserverList)
            value = value.json();

        self.emit('op', {
            p: self._prefix.concat(path.split('.')).concat([ ind ]),
            li: value
        });
    });
};


ObserverSync.prototype.write = function(op) {
    // disable history if available
    var historyReEnable = false;
    if (this.item.history && this.item.history.enabled) {
        historyReEnable = true;
        this.item.history.enabled = false;
    }

    if (op.hasOwnProperty('oi')) {
        // set key value
        var path = op.p.slice(this._prefix.length).join('.');

        this._enabled = false;
        this.item.set(path, op.oi, false, true);
        this._enabled = true;


    } else if (op.hasOwnProperty('ld') && op.hasOwnProperty('li')) {
        // set array value
        var path = op.p.slice(this._prefix.length).join('.');

        this._enabled = false;
        this.item.set(path, op.li, false, true);
        this._enabled = true;


    } else if (op.hasOwnProperty('ld')) {
        // delete item
        var path = op.p.slice(this._prefix.length, -1).join('.');

        this._enabled = false;
        this.item.remove(path, op.p[op.p.length - 1], false, true);
        this._enabled = true;


    } else if (op.hasOwnProperty('li')) {
        // add item
        var path = op.p.slice(this._prefix.length, -1).join('.');
        var ind = op.p[op.p.length - 1];

        this._enabled = false;
        this.item.insert(path, op.li, ind, false, true);
        this._enabled = true;


    } else if (op.hasOwnProperty('lm')) {
        // item moved
        var path = op.p.slice(this._prefix.length, -1).join('.');
        var indOld = op.p[op.p.length - 1];
        var ind = op.lm;

        this._enabled = false;
        this.item.move(path, indOld, ind, false, true);
        this._enabled = true;


    } else if (op.hasOwnProperty('od')) {
        // unset key value
        var path = op.p.slice(this._prefix.length).join('.');
        this._enabled = false;
        this.item.unset(path, false, true);
        this._enabled = true;


    } else {
        console.log('unknown operation', op);
    }

    // reenable history
    if (historyReEnable)
        this.item.history.enabled = true;

    this.emit('sync', op);
};

Object.defineProperty(ObserverSync.prototype, 'enabled', {
    get: function() {
        return this._enabled;
    },
    set: function(value) {
        this._enabled = !! value;
    }
});

Object.defineProperty(ObserverSync.prototype, 'prefix', {
    get: function() {
        return this._prefix;
    },
    set: function(value) {
        this._prefix = value || [ ];
    }
});

Object.defineProperty(ObserverSync.prototype, 'paths', {
    get: function() {
        return this._paths;
    },
    set: function(value) {
        this._paths = value || null;
    }
});


/* observer-history.js */
function ObserverHistory(args) {
    Events.call(this);
    args = args || {};

    this.item = args.item;
    this._history = args.history;
    this._enabled = args.enabled || true;
    this._prefix = args.prefix || '';
    this._combine = args.combine || false;

    this._events = [];

    this._initialize();
}
ObserverHistory.prototype = Object.create(Events.prototype);


ObserverHistory.prototype._initialize = function () {
    var self = this;

    this._events.push(this.item.on('*:set', function (path, value, valueOld) {
        if (!self._enabled || !self._history) return;

        // need jsonify
        if (value instanceof Observer)
            value = value.json();

        // action
        var action = {
            name: self._prefix + path,
            combine: self._combine,
            undo: function () {
                var item = self.item.latest();
                if (!item) return;

                item.history.enabled = false;

                if (valueOld === undefined) {
                    item.unset(path);
                } else {
                    item.set(path, valueOld);
                }

                item.history.enabled = true;
            },
            redo: function () {
                var item = self.item.latest();
                if (!item) return;

                item.history.enabled = false;

                if (value === undefined) {
                    item.unset(path);
                } else {
                    item.set(path, value);
                }

                item.history.enabled = true;
            }
        };

        self._history.add(action);
    }));

    this._events.push(this.item.on('*:unset', function (path, valueOld) {
        if (!self._enabled || !self._history) return;

        // action
        var action = {
            name: self._prefix + path,
            combine: self._combine,
            undo: function () {
                var item = self.item.latest();
                if (!item) return;

                item.history.enabled = false;
                item.set(path, valueOld);
                item.history.enabled = true;
            },
            redo: function () {
                var item = self.item.latest();
                if (!item) return;

                item.history.enabled = false;
                item.unset(path);
                item.history.enabled = true;
            }
        };

        self._history.add(action);
    }));

    this._events.push(this.item.on('*:insert', function (path, value, ind) {
        if (!self._enabled || !self._history) return;

        // need jsonify
        // if (value instanceof Observer)
        //     value = value.json();

        // action
        var action = {
            name: self._prefix + path,
            combine: self._combine,
            undo: function () {
                var item = self.item.latest();
                if (!item) return;

                item.history.enabled = false;
                item.removeValue(path, value);
                item.history.enabled = true;
            },
            redo: function () {
                var item = self.item.latest();
                if (!item) return;

                item.history.enabled = false;
                item.insert(path, value, ind);
                item.history.enabled = true;
            }
        };

        self._history.add(action);
    }));

    this._events.push(this.item.on('*:remove', function (path, value, ind) {
        if (!self._enabled || !self._history) return;

        // need jsonify
        // if (value instanceof Observer)
        //     value = value.json();

        // action
        var action = {
            name: self._prefix + path,
            combine: self._combine,
            undo: function () {
                var item = self.item.latest();
                if (!item) return;

                item.history.enabled = false;
                item.insert(path, value, ind);
                item.history.enabled = true;
            },
            redo: function () {
                var item = self.item.latest();
                if (!item) return;

                item.history.enabled = false;
                item.removeValue(path, value);
                item.history.enabled = true;
            }
        };

        self._history.add(action);
    }));

    this._events.push(this.item.on('*:move', function (path, value, ind, indOld) {
        if (!self._enabled || !self._history) return;

        // action
        var action = {
            name: self._prefix + path,
            combine: self._combine,
            undo: function () {
                var item = self.item.latest();
                if (!item) return;

                item.history.enabled = false;
                item.move(path, ind, indOld);
                item.history.enabled = true;
            },
            redo: function () {
                var item = self.item.latest();
                if (!item) return;

                item.history.enabled = false;
                item.move(path, indOld, ind);
                item.history.enabled = true;
            }
        };

        self._history.add(action);
    }));
};

ObserverHistory.prototype.destroy = function () {
    this._events.forEach(function (evt) {
        evt.unbind();
    });

    this._events.length = 0;
    this.item = null;
};

Object.defineProperty(ObserverHistory.prototype, 'enabled', {
    get: function () {
        return this._enabled;
    },
    set: function (value) {
        this._enabled = !!value;
    }
});


Object.defineProperty(ObserverHistory.prototype, 'prefix', {
    get: function () {
        return this._prefix;
    },
    set: function (value) {
        this._prefix = value || '';
    }
});

Object.defineProperty(ObserverHistory.prototype, 'combine', {
    get: function () {
        return this._combine;
    },
    set: function (value) {
        this._combine = !! value;
    }
});


/* editor/editor.js */
(function() {
    'use strict';

    function Editor() {
        Events.call(this);

        this._hooks = { };
    }
    Editor.prototype = Object.create(Events.prototype);


    Editor.prototype.method = function(name, fn) {
        if (this._hooks[name] !== undefined) {
            throw new Error('can\'t override hook: ' + name);
        }
        this._hooks[name] = fn;
    };


    Editor.prototype.methodRemove = function(name) {
        delete this._hooks[name];
    };


    Editor.prototype.call = function(name) {
        if (this._hooks[name]) {
            var args = Array.prototype.slice.call(arguments, 1);

            try {
                return this._hooks[name].apply(null, args);
            } catch(ex) {
                console.info('%c%s %c(editor.method error)', 'color: #06f', name, 'color: #f00');
                console.log(ex.stack);
            }
        } else {
            // console.info('%c%s %c - editor.method does not exist yet', 'color: #06f', name, 'color: #f00');
        }
        return null;
    };


    // editor
    window.editor = new Editor();
})();


// config
(function() {
    'use strict';

    var applyConfig = function(path, value) {
        if (typeof(value) === 'object') {
            for(var key in value) {
                applyConfig((path ? path + '.' : '') + key, value[key]);
            }
        } else {
            Ajax.param(path, value);
        }
    };

    applyConfig('', config);
})();


/* launch/first-load.js */
(function() {
    'use strict';

    var visible = ! document.hidden;

    document.addEventListener('visibilitychange', function() {
        if (visible === ! document.hidden)
            return;

        visible = ! document.hidden;
        if (visible) {
            editor.emit('visible');
        } else {
            editor.emit('hidden');
        }
        editor.emit('visibility', visible);
    }, false);

    editor.method('visibility', function() {
        return visible;
    });

    // first load
    document.addEventListener('DOMContentLoaded', function() {
        editor.emit('load');
    }, false);
})();


/* launch/messenger.js */
editor.on('load', function() {
    'use strict';

    if (typeof(Messenger) === 'undefined')
        return;

    var messenger = new Messenger();

    messenger.connect(config.url.messenger.ws);

    messenger.on('connect', function() {
        this.authenticate(null, 'designer');
    });

    messenger.on('welcome', function() {
        this.projectWatch(config.project.id);
    });

    messenger.on('message', function(evt) {
        editor.emit('messenger:' + evt.name, evt.data);
    });
});


/* launch/modules.js */
editor.once('load', function() {
    'use strict';

    // check for wasm module support
    function wasmSupported() {
        try {
            if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
                const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
                if (module instanceof WebAssembly.Module)
                    return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
            }
        } catch (e) { }
        return false;
    }

    // load a script
    function loadScriptAsync(url, doneCallback) {
        var tag = document.createElement('script');
        tag.onload = function () {
            doneCallback();
        };
        tag.onerror = function () {
            throw new Error('failed to load ' + url);
        };
        tag.async = true;
        tag.src = url;
        document.head.appendChild(tag);
    }

    // load and initialize a wasm module
    function loadWasmModuleAsync(moduleName, jsUrl, binaryUrl, doneCallback) {
        loadScriptAsync(jsUrl, function () {
            var lib = window[moduleName];
            window[moduleName + 'Lib'] = lib;
            lib({ locateFile: function () { return binaryUrl; } } ).then( function (instance) {
                window[moduleName] = instance;
                doneCallback();
            });
        });
    }

    editor.method('editor:loadModules', function (modules, urlPrefix, doneCallback) {
        if (typeof modules === "undefined" || modules.length === 0) {
            // caller may depend on callback behaviour being async
            setTimeout(doneCallback);
        } else {
            var asyncCounter = modules.length;
            var asyncCallback = function () {
                asyncCounter--;
                if (asyncCounter === 0) {
                    doneCallback();
                }
            };

            var wasm = wasmSupported();
            modules.forEach(function (m) {
                if (!m.hasOwnProperty('preload') || m.preload) {
                    if (wasm) {
                        loadWasmModuleAsync(m.moduleName, urlPrefix + m.glueUrl, urlPrefix + m.wasmUrl, asyncCallback);
                    } else {
                        if (!m.fallbackUrl) {
                            throw new Error('wasm not supported and no fallback supplied for module ' + m.moduleName);
                        }
                        loadWasmModuleAsync(m.moduleName, urlPrefix + m.fallbackUrl, "", asyncCallback);
                    }
                } else {
                    asyncCallback();
                }
            });
        }
    });
});


/* editor/settings/settings.js */
editor.once('load', function () {
    'use strict';

    editor.method('settings:create', function (args) {
        // settings observer
        var settings = new Observer(args.data);
        settings.id = args.id;

        // Get settings
        editor.method('settings:' + args.name, function () {
            return settings;
        });

        var doc;

        settings.reload = function () {
            var connection = editor.call('realtime:connection');

            if (doc)
                doc.destroy();

            doc = connection.get('settings', settings.id);

            // handle errors
            doc.on('error', function (err) {
                console.error(err);
                editor.emit('settings:' + args.name + ':error', err);
            });

            // load settings
            doc.on('load', function () {
                var data = doc.data;

                // remove unnecessary fields
                delete data._id;
                delete data.name;
                delete data.user;
                delete data.project;
                delete data.item_id;
                delete data.branch_id;
                delete data.checkpoint_id;

                if (! settings.sync) {
                    settings.sync = new ObserverSync({
                        item: settings,
                        paths: Object.keys(settings._data)
                    });

                    // local -> server
                    settings.sync.on('op', function (op) {
                        if (doc)
                            doc.submitOp([ op ]);
                    });
                }

                var history = settings.history.enabled;
                if (history) {
                    settings.history.enabled = false;
                }

                settings.sync._enabled = false;
                for (var key in data) {
                    if (data[key] instanceof Array) {
                        settings.set(key, data[key].slice(0));
                    } else {
                        settings.set(key, data[key]);
                    }
                }
                settings.sync._enabled = true;
                if (history)
                    settings.history.enabled = true;

                // server -> local
                doc.on('op', function (ops, local) {
                    if (local) return;

                    var history = settings.history.enabled;
                    if (history)
                        settings.history.enabled = false;
                    for (var i = 0; i < ops.length; i++) {
                        settings.sync.write(ops[i]);
                    }
                    if (history)
                        settings.history.enabled = true;
                });

                editor.emit('settings:' + args.name + ':load');
            });

            // subscribe for realtime events
            doc.subscribe();
        };

        if (! args.deferLoad) {
            editor.on('realtime:authenticated', function () {
                settings.reload();
            });
        }

        editor.on('realtime:disconnected', function () {
            if (doc) {
                doc.destroy();
                doc = null;
            }
        });

        settings.disconnect = function () {
            if (doc) {
                doc.destroy();
                doc = null;
            }

            if (settings.sync) {
                settings.sync.unbind();
                delete settings.sync;
            }
        };


        return settings;
    });
});


/* editor/settings/project-settings.js */
editor.once('load', function () {
    'use strict';

    var syncPaths = [
        'antiAlias',
        'batchGroups',
        'fillMode',
        'resolutionMode',
        'height',
        'width',
        'use3dPhysics',
        'preferWebGl2',
        'preserveDrawingBuffer',
        'scripts',
        'transparentCanvas',
        'useDevicePixelRatio',
        'useLegacyScripts',
        'useKeyboard',
        'useMouse',
        'useGamepads',
        'useTouch',
        'vr',
        'loadingScreenScript',
        'externalScripts',
        'plugins',
        'layers',
        'layerOrder',
        'i18nAssets',
        'useLegacyAmmoPhysics',
        'useLegacyAudio'
    ];

    var data = {};
    for (var i = 0; i < syncPaths.length; i++)
        data[syncPaths[i]] = config.project.settings.hasOwnProperty(syncPaths[i]) ? config.project.settings[syncPaths[i]] : null;

    var settings = editor.call('settings:create', {
        name: 'project',
        id: config.project.settings.id,
        data: data
    });

    if (! settings.get('useLegacyScripts')) {
        pc.script.legacy = false;
    } else {
        pc.script.legacy = true;
    }

    // add history
    settings.history = new ObserverHistory({
        item: settings,
        history: editor.call('editor:history')
    });

    settings.on('*:set', function (path, value) {
        var parts = path.split('.');
        var obj = config.project.settings;
        for (var i = 0; i < parts.length - 1; i++) {
            if (! obj.hasOwnProperty(parts[i]))
                obj[parts[i]] = {};

            obj = obj[parts[i]];
        }

        // this is limited to simple structures for now
        // so take care
        if (value instanceof Object) {
            var path = parts[parts.length-1];
            obj[path] = {};
            for (var key in value) {
                obj[path][key] = value[key];
            }
        } else {
            obj[parts[parts.length-1]] = value;
        }
    });

    settings.on('*:unset', function (path) {
        var parts = path.split('.');
        var obj = config.project.settings;
        for (var i = 0; i < parts.length - 1; i++) {
            obj = obj[parts[i]];
        }

        delete obj[parts[parts.length-1]];
    });

    settings.on('*:insert', function (path, value, index) {
        var parts = path.split('.');
        var obj = config.project.settings;
        for (var i = 0; i < parts.length - 1; i++) {
            obj = obj[parts[i]];
        }

        var arr = obj[parts[parts.length - 1]];
        if (Array.isArray(arr)) {
            arr.splice(index, 0, value);
        }
    });

    settings.on('*:remove', function (path, value, index) {
        var parts = path.split('.');
        var obj = config.project.settings;
        for (var i = 0; i < parts.length - 1; i++) {
            obj = obj[parts[i]];
        }

        var arr = obj[parts[parts.length - 1]];
        if (Array.isArray(arr)) {
            arr.splice(index, 1);
        }
    });

    // migrations
    editor.on('settings:project:load', function () {
        var history = settings.history.enabled;
        var sync = settings.sync.enabled;

        settings.history.enabled = false;
        settings.sync.enabled = editor.call('permissions:write');

        if (! settings.get('batchGroups')) {
            settings.set('batchGroups', {});
        }
        if (! settings.get('layers')) {
            settings.set('layers', {
                0: {
                    name: 'World',
                    opaqueSortMode: 2,
                    transparentSortMode: 3
                },
                1: {
                    name: 'Depth',
                    opaqueSortMode: 2,
                    transparentSortMode: 3
                },
                2: {
                    name: 'Skybox',
                    opaqueSortMode: 0,
                    transparentSortMode: 3
                },
                3: {
                    name: 'Immediate',
                    opaqueSortMode: 0,
                    transparentSortMode: 3
                },
                4: {
                    name: 'UI',
                    opaqueSortMode: 1,
                    transparentSortMode: 1
                }
            });

            settings.set('layerOrder', []);
            settings.insert('layerOrder', {
                layer: LAYERID_WORLD,
                transparent: false,
                enabled: true
            });
            settings.insert('layerOrder', {
                layer: LAYERID_DEPTH,
                transparent: false,
                enabled: true
            });
            settings.insert('layerOrder', {
                layer: LAYERID_SKYBOX,
                transparent: false,
                enabled: true
            });
            settings.insert('layerOrder', {
                layer: LAYERID_WORLD,
                transparent: true,
                enabled: true
            });
            settings.insert('layerOrder', {
                layer: LAYERID_IMMEDIATE,
                transparent: false,
                enabled: true
            });
            settings.insert('layerOrder', {
                layer: LAYERID_IMMEDIATE,
                transparent: true,
                enabled: true
            });
            settings.insert('layerOrder', {
                layer: LAYERID_UI,
                transparent: true,
                enabled: true
            });
        }

        if (settings.get('useKeyboard') === null) {
            settings.set('useKeyboard', true);
        }
        if (settings.get('useMouse') === null) {
            settings.set('useMouse', true);
        }
        if (settings.get('useTouch') === null) {
            settings.set('useTouch', true);
        }
        if (settings.get('useGamepads') === null) {
            settings.set('useGamepads', !!settings.get('vr'));
        }

        if (!settings.get('i18nAssets')) {
            settings.set('i18nAssets', []);
        }

        if (!settings.get('externalScripts')) {
            settings.set('externalScripts', []);
        }

        settings.history.enabled = history;
        settings.sync.enabled = sync;
    });
});


/* editor/settings/project-user-settings.js */
editor.once('load', function () {
    'use strict';

    var isConnected = false;

    var settings = editor.call('settings:create', {
        name: 'projectUser',
        id: 'project_' + config.project.id + '_' + config.self.id,
        deferLoad: true,
        data: {
            editor: {
                cameraNearClip: 0.1,
                cameraFarClip: 1000,
                cameraClearColor: [
                    0.118,
                    0.118,
                    0.118,
                    1
                ],
                gridDivisions: 8,
                gridDivisionSize: 1,
                snapIncrement: 1,
                localServer: 'http://localhost:51000',
                launchDebug: true,
                locale: 'en-US',
                pipeline: {
                    texturePot: true,
                    textureDefaultToAtlas: false,
                    searchRelatedAssets: true,
                    preserveMapping: false,
                    overwriteModel: true,
                    overwriteAnimation: true,
                    overwriteMaterial: false,
                    overwriteTexture: true,
                    useGlb: false,
                    defaultAssetPreload: true
                }
            },
            branch: config.self.branch.id,
            favoriteBranches: null
        },
        userId: config.self.id
    });

    // add history
    settings.history = new ObserverHistory({
        item: settings,
        history: editor.call('editor:history')
    });

    // migrations
    editor.on('settings:projectUser:load', function () {
        setTimeout(function () {
            var history = settings.history.enabled;
            settings.history.enabled = false;

            var sync = settings.sync.enabled;
            settings.sync.enabled = editor.call('permissions:read'); // read permissions enough for project user settings

            if (! settings.has('editor.pipeline'))
                settings.set('editor.pipeline', {});

            if (! settings.has('editor.pipeline.texturePot'))
                settings.set('editor.pipeline.texturePot', true);

            if (! settings.has('editor.pipeline.searchRelatedAssets'))
                settings.set('editor.pipeline.searchRelatedAssets', true);

            if (! settings.has('editor.pipeline.preserveMapping'))
                settings.set('editor.pipeline.preserveMapping', false);

            if (! settings.has('editor.pipeline.textureDefaultToAtlas'))
                settings.set('editor.pipeline.textureDefaultToAtlas', false);

            if (! settings.has('editor.pipeline.overwriteModel'))
                settings.set('editor.pipeline.overwriteModel', true);

            if (! settings.has('editor.pipeline.overwriteAnimation'))
                settings.set('editor.pipeline.overwriteAnimation', true);

            if (! settings.has('editor.pipeline.overwriteMaterial'))
                settings.set('editor.pipeline.overwriteMaterial', false);

            if (! settings.has('editor.pipeline.overwriteTexture'))
                settings.set('editor.pipeline.overwriteTexture', true);

            if (! settings.has('editor.locale')) {
                settings.set('editor.locale', 'en-US');
            }

            if (!settings.get('favoriteBranches')) {
                if (config.project.masterBranch) {
                    settings.set('favoriteBranches', [config.project.masterBranch]);
                } else {
                    settings.set('favoriteBranches', []);
                }
            }

            if (!settings.has('editor.pipeline.useGlb')) {
                settings.set('editor.pipeline.useGlb', false);
            }

            if (!settings.has('editor.pipeline.defaultAssetPreload')) {
                settings.set('editor.pipeline.defaultAssetPreload', true);
            }

            settings.history.enabled = history;
            settings.sync.enabled = sync;
        });
    });

    var reload = function () {
        // config.project.hasReadAccess is only for the launch page
        if (isConnected && (editor.call('permissions:read') || config.project.hasReadAccess)) {
            settings.reload(settings.scopeId);
        }
    };

    // handle permission changes
    editor.on('permissions:set:' + config.self.id, function (accesslevel) {
        if (editor.call('permissions:read')) {
            // reload settings
            if (! settings.sync) {
                settings.history.enabled = true;
                reload();
            }
        } else {
            // unset private settings
            if (settings.sync) {
                settings.disconnect();
                settings.history.enabled = false;
            }
        }
    });

    editor.on('realtime:authenticated', function () {
        isConnected = true;
        reload();
    });

    editor.on('realtime:disconnected', function () {
        isConnected = false;
    });
});


/* launch/viewport-loading.js */
editor.once('load', function () {
    'use strict';

    editor.method('viewport:loadingScreen', function () {
        pc.script.createLoadingScreen(function (app) {
            var showSplash = function () {
                // splash wrapper
                var wrapper = document.createElement('div');
                wrapper.id = 'application-splash-wrapper';
                document.body.appendChild(wrapper);

                // splash
                var splash = document.createElement('div');
                splash.id = 'application-splash';
                wrapper.appendChild(splash);
                splash.style.display = 'none';

                var logo = document.createElement('img');
                logo.src = 'https://s3-eu-west-1.amazonaws.com/static.playcanvas.com/images/play_text_252_white.png';
                splash.appendChild(logo);
                logo.onload = function () {
                    splash.style.display = 'block';
                };

                var container = document.createElement('div');
                container.id = 'progress-bar-container';
                splash.appendChild(container);

                var bar = document.createElement('div');
                bar.id = 'progress-bar';
                container.appendChild(bar);

            };

            var hideSplash = function () {
                var splash = document.getElementById('application-splash-wrapper');
                splash.parentElement.removeChild(splash);
            };

            var setProgress = function (value) {
                var bar = document.getElementById('progress-bar');
                if(bar) {
                    value = Math.min(1, Math.max(0, value));
                    bar.style.width = value * 100 + '%';
                }
            };

            var createCss = function () {
                var css = [
                    'body {',
                    '    background-color: #283538;',
                    '}',

                    '#application-splash-wrapper {',
                    '    position: absolute;',
                    '    top: 0;',
                    '    left: 0;',
                    '    height: 100%;',
                    '    width: 100%;',
                    '    background-color: #283538;',
                    '}',

                    '#application-splash {',
                    '    position: absolute;',
                    '    top: calc(50% - 28px);',
                    '    width: 264px;',
                    '    left: calc(50% - 132px);',
                    '}',

                    '#application-splash img {',
                    '    width: 100%;',
                    '}',

                    '#progress-bar-container {',
                    '    margin: 20px auto 0 auto;',
                    '    height: 2px;',
                    '    width: 100%;',
                    '    background-color: #1d292c;',
                    '}',

                    '#progress-bar {',
                    '    width: 0%;',
                    '    height: 100%;',
                    '    background-color: #f60;',
                    '}',
                    '@media (max-width: 480px) {',
                    '    #application-splash {',
                    '        width: 170px;',
                    '        left: calc(50% - 85px);',
                    '    }',
                    '}'

                ].join('\n');

                var style = document.createElement('style');
                style.type = 'text/css';
                if (style.styleSheet) {
                  style.styleSheet.cssText = css;
                } else {
                  style.appendChild(document.createTextNode(css));
                }

                document.head.appendChild(style);
            };


            createCss();

            showSplash();

            app.on('preload:end', function () {
                app.off('preload:progress');
            });
            app.on('preload:progress', setProgress);
            app.on('start', hideSplash);
        });

    });
});


/* launch/viewport.js */
editor.once('load', function () {
    'use strict';

    // Wait for assets, hierarchy and settings to load before initializing application and starting.
    var done = false;
    var hierarchy = false;
    var assets = false;
    var settings = false;
    var sourcefiles = false;
    var libraries = false;
    var sceneData = null;
    var sceneSettings = null;
    var loadingScreen = false;
    var scriptList = [];
    var legacyScripts = editor.call('settings:project').get('useLegacyScripts');
    var canvas;
    var app;

    var layerIndex = {};

    // update progress bar
    var setProgress = function (value) {
        var bar = document.getElementById('progress-bar');
        value = Math.min(1, Math.max(0, value));
        bar.style.width = value * 100 + '%';
    };

    // respond to resize window
    var reflow = function () {
        var size = app.resizeCanvas(canvas.width, canvas.height);
        canvas.style.width = '';
        canvas.style.height = '';

        var fillMode = app._fillMode;

        if (fillMode == pc.fw.FillMode.NONE || fillMode == pc.fw.FillMode.KEEP_ASPECT) {
            if ((fillMode == pc.fw.FillMode.NONE && canvas.clientHeight < window.innerHeight) || (canvas.clientWidth / canvas.clientHeight >= window.innerWidth / window.innerHeight)) {
                canvas.style.marginTop = Math.floor((window.innerHeight - canvas.clientHeight) / 2) + 'px';
            } else {
                canvas.style.marginTop = '';
            }
        }
    };


    // try to start preload and initialization of application after load event
    var init = function () {
        if (!done && assets && hierarchy && settings && (!legacyScripts || sourcefiles) && libraries && loadingScreen) {
            // prevent multiple init calls during scene loading
            done = true;

            // Skip parseScenes if using pre-1.4.0 engine or invalid config
            if (app._parseScenes) {
                app._parseScenes(config.scenes);
            }

            // load assets that are in the preload set
            app.preload(function (err) {
                // load scripts that are in the scene data
                app._preloadScripts(sceneData, function (err) {
                    if (err) console.error(err);

                    // create scene
                    app.scene = app.loader.open("scene", sceneData);
                    app.root.addChild(app.scene.root);

                    // update scene settings now that scene is loaded
                    app.applySceneSettings(sceneSettings);

                    // clear stored loading data
                    sceneData = null;
                    sceneSettings = null;
                    scriptList = null;

                    if (err) console.error(err);

                    app.start();
                });
            });
        }
    };

    var createCanvas = function () {
        canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'application-canvas');
        canvas.setAttribute('tabindex', 0);
        // canvas.style.visibility = 'hidden';

        // Disable I-bar cursor on click+drag
        canvas.onselectstart = function () { return false; };

        document.body.appendChild(canvas);

        return canvas;
    };

    var showSplash = function () {
        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        document.body.appendChild(splash);

        // img
        var img = document.createElement('img');
        img.src = 'https://s3-eu-west-1.amazonaws.com/static.playcanvas.com/images/logo/PLAY_FLAT_ORANGE3.png'
        splash.appendChild(img);

        // progress bar
        var container = document.createElement('div');
        container.id = 'progress-container';
        splash.appendChild(container);

        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);
    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash');
        splash.parentElement.removeChild(splash);
    };

    var createLoadingScreen = function () {

        var defaultLoadingScreen = function () {
            editor.call('viewport:loadingScreen');
            loadingScreen = true;
            init();
        };

        // if the project has a loading screen script then
        // download it and execute it
        if (config.project.settings.loadingScreenScript) {
            var loadingScript = document.createElement('script');
            if (config.project.settings.useLegacyScripts) {
                loadingScript.src = scriptPrefix + '/' + config.project.settings.loadingScreenScript;
            } else {
                loadingScript.src = '/api/assets/' + config.project.settings.loadingScreenScript + '/download?branchId=' + config.self.branch.id;
            }

            loadingScript.onload = function () {
                loadingScreen = true;
                init();
            };

            loadingScript.onerror = function () {
                console.error("Could not load loading screen script: " + config.project.settings.loadingScreenScript);
                defaultLoadingScreen();
            };

            var head = document.getElementsByTagName('head')[0];
            head.insertBefore(loadingScript, head.firstChild);
        } else {
            // no loading screen script so just use default splash screen
            defaultLoadingScreen();
        }
    };

    var createLayer = function (key, data) {
        var id = parseInt(key, 10);
        return new pc.Layer({
            id: id,
            enabled: id !== LAYERID_DEPTH, // disable depth layer - it will be enabled by the engine when needed
            name: data.name,
            opaqueSortMode: data.opaqueSortMode,
            transparentSortMode: data.transparentSortMode
        });
    };

    var canvas = createCanvas();

    // convert library properties into URLs
    var libraryUrls = [];
    if (config.project.settings.use3dPhysics) {
        libraryUrls.push(config.url.physics);
    }

    var queryParams = (new pc.URI(window.location.href)).getQuery();

    var scriptPrefix = config.project.scriptPrefix;

    // queryParams.local can be true or it can be a URL
    if (queryParams.local)
        scriptPrefix = queryParams.local === 'true' ? 'http://localhost:51000' : queryParams.local;

    // WebGL 1.0 enforced?
    var preferWebGl2 = config.project.settings.preferWebGl2;
    if (queryParams.hasOwnProperty('webgl1')) {
        try {
            preferWebGl2 = queryParams.webgl1 === undefined ? false : !JSON.parse(queryParams.webgl1);
        } catch (ex) { }
    }

    // listen for project setting changes
    var projectSettings = editor.call('settings:project');
    var projectUserSettings = editor.call('settings:projectUser');

    // legacy scripts
    pc.script.legacy = projectSettings.get('useLegacyScripts');

    // playcanvas app
    var useMouse = projectSettings.has('useMouse') ? projectSettings.get('useMouse') : true;
    var useKeyboard = projectSettings.has('useKeyboard') ? projectSettings.get('useKeyboard') : true;
    var useTouch = projectSettings.has('useTouch') ? projectSettings.get('useTouch') : true;
    var useGamepads = projectSettings.has('useGamepads') ? projectSettings.get('useGamepads') : !!projectSettings.get('vr');

    app = new pc.Application(canvas, {
        elementInput: new pc.ElementInput(canvas, {
            useMouse: useMouse,
            useTouch: useTouch
        }),
        mouse: useMouse ? new pc.input.Mouse(canvas) : null,
        touch: useTouch && pc.platform.touch ? new pc.input.TouchDevice(canvas) : null,
        keyboard: useKeyboard ? new pc.input.Keyboard(window) : null,
        gamepads: useGamepads ? new pc.input.GamePads() : null,
        scriptPrefix: scriptPrefix,
        scriptsOrder: projectSettings.get('scripts') || [],
        assetPrefix: '/api/',
        graphicsDeviceOptions: {
            preferWebGl2: preferWebGl2,
            antialias: config.project.settings.antiAlias === false ? false : true,
            alpha: config.project.settings.transparentCanvas === false ? false : true,
            preserveDrawingBuffer: !!config.project.settings.preserveDrawingBuffer
        }
    });

    if (queryParams.useBundles === 'false') {
        app.enableBundles = false;
    }

    if (canvas.classList) {
        canvas.classList.add('fill-mode-' + config.project.settings.fillMode);
    }

    if (config.project.settings.useDevicePixelRatio) {
        app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
    }

    app.setCanvasResolution(config.project.settings.resolutionMode, config.project.settings.width, config.project.settings.height);
    app.setCanvasFillMode(config.project.settings.fillMode, config.project.settings.width, config.project.settings.height);

    // batch groups
    var batchGroups = config.project.settings.batchGroups;
    if (batchGroups) {
        for (var id in batchGroups) {
            var grp = batchGroups[id];
            app.batcher.addGroup(grp.name, grp.dynamic, grp.maxAabbSize, grp.id, grp.layers);
        }
    }

    // layers
    if (config.project.settings.layers && config.project.settings.layerOrder) {
        var composition = new pc.LayerComposition();

        for (var key in config.project.settings.layers) {
            layerIndex[key] = createLayer(key, config.project.settings.layers[key]);
        }

        for (var i = 0, len = config.project.settings.layerOrder.length; i < len; i++) {
            var sublayer = config.project.settings.layerOrder[i];
            var layer = layerIndex[sublayer.layer];
            if (!layer) continue;

            if (sublayer.transparent) {
                composition.pushTransparent(layer);
            } else {
                composition.pushOpaque(layer);
            }

            composition.subLayerEnabled[i] = sublayer.enabled;
        }

        app.scene.layers = composition;
    }

    // localization
    if (app.i18n) { // make it backwards compatible ...
        if (config.self.locale) {
            app.i18n.locale = config.self.locale;
        }

        if (config.project.settings.i18nAssets) {
            app.i18n.assets = config.project.settings.i18nAssets;
        }
    }

    editor.call('editor:loadModules', config.wasmModules, "", function() {
        app._loadLibraries(libraryUrls, function (err) {
            libraries = true;
            if (err) console.error(err);
            init();
        });
    });

    var style = document.head.querySelector ? document.head.querySelector('style') : null;

    // append css to style
    var createCss = function () {
        if (!document.head.querySelector)
            return;

        if (!style)
            style = document.head.querySelector('style');

        // css media query for aspect ratio changes
        var css = "@media screen and (min-aspect-ratio: " + config.project.settings.width + "/" + config.project.settings.height + ") {";
        css += "    #application-canvas.fill-mode-KEEP_ASPECT {";
        css += "        width: auto;";
        css += "        height: 100%;";
        css += "        margin: 0 auto;";
        css += "    }";
        css += "}";

        style.innerHTML = css;
    };

    createCss();

    var refreshResolutionProperties = function () {
        app.setCanvasResolution(config.project.settings.resolutionMode, config.project.settings.width, config.project.settings.height);
        app.setCanvasFillMode(config.project.settings.fillMode, config.project.settings.width, config.project.settings.height);
        reflow();
    };

    projectSettings.on('width:set', function (value) {
        config.project.settings.width = value;
        createCss();
        refreshResolutionProperties();
    });
    projectSettings.on('height:set', function (value) {
        config.project.settings.height = value;
        createCss();
        refreshResolutionProperties();
    });

    projectSettings.on('fillMode:set', function (value, oldValue) {
        config.project.settings.fillMode = value;
        if (canvas.classList) {
            if (oldValue)
                canvas.classList.remove('fill-mode-' + oldValue);

            canvas.classList.add('fill-mode-' + value);
        }

        refreshResolutionProperties();
    });

    projectSettings.on('resolutionMode:set', function (value) {
        config.project.settings.resolutionMode = value;
        refreshResolutionProperties();
    });

    projectSettings.on('useDevicePixelRatio:set', function (value) {
        config.project.settings.useDevicePixelRatio = value;
        app.graphicsDevice.maxPixelRatio = value ? window.devicePixelRatio : 1;
    });

    projectSettings.on('preferWebGl2:set', function (value) {
        config.project.settings.preferWebGl2 = value;
    });

    projectSettings.on('i18nAssets:set', function (value) {
        app.i18n.assets = value;
    });

    projectSettings.on('i18nAssets:insert', function (value) {
        app.i18n.assets = projectSettings.get('i18nAssets');
    });

    projectSettings.on('i18nAssets:remove', function (value) {
        app.i18n.assets = projectSettings.get('i18nAssets');
    });

    // locale change
    projectUserSettings.on('editor.locale:set', function (value) {
        if (value) {
            app.i18n.locale = value;
        }
    });

    projectSettings.on('*:set', function (path, value) {
        var parts;

        if (path.startsWith('batchGroups')) {
            parts = path.split('.');
            if (parts.length < 2) return;
            var groupId = parseInt(parts[1], 10);
            var groupSettings = projectSettings.get('batchGroups.' + groupId);
            if (!app.batcher._batchGroups[groupId]) {
                app.batcher.addGroup(
                    groupSettings.name,
                    groupSettings.dynamic,
                    groupSettings.maxAabbSize,
                    groupId,
                    groupSettings.layers
                );

                app.batcher.generate();
            } else {
                app.batcher._batchGroups[groupId].name = groupSettings.name;
                app.batcher._batchGroups[groupId].dynamic = groupSettings.dynamic;
                app.batcher._batchGroups[groupId].maxAabbSize = groupSettings.maxAabbSize;

                app.batcher.generate([groupId]);
            }
        } else if (path.startsWith('layers')) {
            parts = path.split('.');
            // create layer
            if (parts.length === 2) {
                var layer = createLayer(parts[1], value);
                layerIndex[layer.id] = layer;
                var existing = app.scene.layers.getLayerById(layer.id);
                if (existing) {
                    app.scene.layers.remove(existing);
                }
            }
            // change layer property
            else if (parts.length === 3) {
                var layer = layerIndex[parts[1]];
                if (layer) {
                    layer[parts[2]] = value;
                }
            }
        } else if (path.startsWith('layerOrder.')) {
            parts = path.split('.');

            if (parts.length === 3) {
                if (parts[2] === 'enabled') {
                    var subLayerId = parseInt(parts[1]);
                    // Unlike Editor, DON'T add 2 to subLayerId here
                    app.scene.layers.subLayerEnabled[subLayerId] = value;
                    editor.call('viewport:render');
                }
            }
        }
    });

    projectSettings.on('*:unset', function (path, value) {
        if (path.startsWith('batchGroups')) {
            var propNameParts = path.split('.')[1];
            if (propNameParts.length === 2) {
                var id = propNameParts[1];
                app.batcher.removeGroup(id);
            }
        } else if (path.startsWith('layers.')) {
            var parts = path.split('.');

            // remove layer
            var layer = layerIndex[parts[1]];
            if (layer) {
                app.scene.layers.remove(layer);
                delete layerIndex[parts[1]];
            }
        }
    });

    projectSettings.on('layerOrder:insert', function (value, index) {
        var id = value.get('layer');
        var layer = layerIndex[id];
        if (!layer) return;

        var transparent = value.get('transparent');

        if (transparent) {
            app.scene.layers.insertTransparent(layer, index);
        } else {
            app.scene.layers.insertOpaque(layer, index);
        }
    });

    projectSettings.on('layerOrder:remove', function (value) {
        var id = value.get('layer');
        var layer = layerIndex[id];
        if (!layer) return;

        var transparent = value.get('transparent');

        if (transparent) {
            app.scene.layers.removeTransparent(layer);
        } else {
            app.scene.layers.removeOpaque(layer);
        }
    });

    projectSettings.on('layerOrder:move', function (value, indNew, indOld) {
        var id = value.get('layer');
        var layer = layerIndex[id];
        if (!layer) return;

        var transparent = value.get('transparent');
        if (transparent) {
            app.scene.layers.removeTransparent(layer);
            app.scene.layers.insertTransparent(layer, indNew);
        } else {
            app.scene.layers.removeOpaque(layer);
            app.scene.layers.insertOpaque(layer, indNew);
        }
    });

    window.addEventListener('resize', reflow, false);
    window.addEventListener('orientationchange', reflow, false);

    reflow();

    // get application
    editor.method('viewport:app', function () {
        return app;
    });

    editor.on('entities:load', function (data) {
        hierarchy = true;
        sceneData = data;
        init();
    });

    editor.on('assets:load', function () {
        assets = true;
        init();
    });

    editor.on('sceneSettings:load', function (data) {
        settings = true;
        sceneSettings = data.json();
        init();
    });

    if (legacyScripts) {
        editor.on('sourcefiles:load', function (scripts) {
            scriptList = scripts;
            sourcefiles = true;
            init();
        });
    }

    createLoadingScreen();
});


/* launch/viewport-error-console.js */
editor.once('load', function() {
    'use strict';

    // console
    var panel = document.createElement('div');
    panel.id = 'application-console';
    panel.classList.add('hidden');
    document.body.appendChild(panel);

    var errorCount = 0;

    panel.addEventListener('mousedown', function(evt) {
        evt.stopPropagation();
    }, false);
    panel.addEventListener('click', function(evt) {
        evt.stopPropagation();
    }, false);

    // close button img
    var closeBtn = document.createElement('img');
    closeBtn.src = 'https://s3-eu-west-1.amazonaws.com/static.playcanvas.com/images/icons/fa/16x16/remove.png';
    panel.appendChild(closeBtn);

    closeBtn.addEventListener('click', function () {
        var i = panel.childNodes.length;
        while (i-- > 1) {
            panel.childNodes[i].parentElement.removeChild(panel.childNodes[i]);
        }

        panel.classList.add('hidden');
    });

    var logTimestamp = null;
    var stopLogs = false;

    var append = function (msg, cls) {
        if (stopLogs) return;

        // prevent too many log messages
        if (panel.childNodes.length <= 1) {
            logTimestamp = Date.now();
        } else if (panel.childNodes.length > 60) {
            if (Date.now() - logTimestamp < 2000) {
                stopLogs = true;
                msg = "Too many logs. Open the browser console to see more details.";
            }
        }

        // create new DOM element with the specified inner HTML
        var element = document.createElement('p');
        element.innerHTML = msg.replace(/\n/g, '<br/>');
        if (cls)
            element.classList.add(cls);

        // var links = element.querySelectorAll('.code-link');
        // for(var i = 0; i < links.length; i++) {
        //     links[i].addEventListener('click', function(evt) {
        //         evt.preventDefault();
        //         var scope = window;

        //         // TODO
        //         // possible only when launcher and editor are within same domain (HTTPS)
        //         // var scope = window.opener || window;

        //         scope.open(this.getAttribute('href') + this.getAttribute('query'), this.getAttribute('href')).focus();
        //     }, false);
        // }

        panel.appendChild(element);

        panel.classList.remove('hidden');
        return element;
    }

    var onError = function(msg, url, line, col, e) {
        if (url) {
            // check if this is a playcanvas script
            var codeEditorUrl = '';
            var query = '';
            var target = null;
            var assetId = null;

            // if this is a playcanvas script
            // then create a URL that will open the code editor
            // at that line and column
            if (url.indexOf('api/files/code') !== -1) {
                var parts = url.split('//')[1].split('/');

                target = '/editor/code/' + parts[4] + '/';
                if (parts.length > 9) {
                    target += parts.slice(9).join('/');
                } else {
                    target += parts.slice(6).join('/');
                }

                codeEditorUrl = config.url.home + target;
                query = '?line=' + line + '&col=' + col + '&error=true';
            } else if (!editor.call('settings:project').get('useLegacyScripts') && url.indexOf('/api/assets/') !== -1 && url.indexOf('.js') !== -1) {
                assetId = parseInt(url.match(/\/api\/assets\/files\/.+?id=([0-9]+)/)[1], 10);
                target = 'codeeditor:' + config.project.id;
                codeEditorUrl = config.url.home + '/editor/code/' + config.project.id;
                query = '?tabs=' + assetId + '&line=' + line + '&col=' + col + '&error=true';
            } else {
                codeEditorUrl = url;
            }

            var slash = url.lastIndexOf('/');
            var relativeUrl = url.slice(slash + 1);
            errorCount++;

            append(pc.string.format('<a href="{0}{1}" target="{2} class="code-link" id="{6}">[{3}:{4}]</a>: {5}', codeEditorUrl, query, target, relativeUrl, line, msg, 'error-' + errorCount), 'error');

            if (assetId) {
                var link = document.getElementById('error-' + errorCount);
                link.addEventListener('click', function (e) {
                    var existing = window.open('', target);
                    try {
                        if (existing) {
                            e.preventDefault();
                            e.stopPropagation();

                            if (existing.editor && existing.editor.isCodeEditor) {
                                existing.editor.call('integration:selectWhenReady', assetId, {
                                    line: line,
                                    col: col,
                                    error: true
                                });
                            } else {
                                existing.location.href = codeEditorUrl + query;
                            }
                        }
                    } catch (ex) {
                        // if we try to access 'existing' and it's in a different
                        // domain an exception will be raised
                        window.open(codeEditorUrl + query, target);
                    }
                });
            }

            // append stacktrace as well
            if (e && e.stack)
                append(e.stack.replace(/ /g, '&nbsp;'), 'trace');
        } else {
            // Chrome only shows 'Script error.' if the error comes from
            // a different domain.
            if (msg && msg !== 'Script error.') {
                append(msg, 'error');
            } else {
                append('Error loading scripts. Open the browser console for details.', 'error');
            }
        }
    };

    // catch errors and show them to the console
    window.onerror = onError;

    // redirect console.error to the in-game console
    var consoleError = console.error;
    console.error = function(...args) {
        var errorPassed = false;
        consoleError(...args);

        args.forEach(item => {
            if (item instanceof Error && item.stack) {
                var msg = item.message;
                var lines = item.stack.split('\n');
                if (lines.length >= 2) {
                    var line = lines[1];
                    var url = line.slice(line.indexOf('(') + 1);
                    var m = url.match(/:[0-9]+:[0-9]+\)/);
                    if (m) {
                        url = url.slice(0, m.index);
                        var parts = m[0].slice(1, -1).split(':');

                        if (parts.length === 2) {
                            var line = parseInt(parts[0], 10);
                            var col = parseInt(parts[1], 10);

                            onError(msg, url, line, col, item);
                            errorPassed = true;
                        }
                    }
                }
            }

            if (item instanceof Error) {
                if (!errorPassed)
                    append(item.message, 'error');
            } else {
                append(item.toString(), 'error');
            }
        });
    };

});


/* launch/tools.js */
var now = function() {
    return performance.timing.navigationStart + performance.now();
};

if (! performance || ! performance.now || ! performance.timing)
    now = Date.now;

var start = now();

editor.once('load', function() {
    'use strict';

    // times
    var timeBeginning = performance.timing ? performance.timing.responseEnd : start;
    var timeNow = now() - timeBeginning;
    var timeHover = 0;

    var epoc = ! window.performance || ! performance.now || ! performance.timing;
    editor.method('tools:epoc', function() {
        return epoc;
    });

    editor.method('tools:time:now', function() { return now() - timeBeginning; });
    editor.method('tools:time:beginning', function() { return timeBeginning; });
    editor.method('tools:time:hover', function() { return timeHover; });

    editor.method('tools:time:toHuman', function(ms, precision) {
        var s = ms / 1000;
        var m = ('00' + Math.floor(s / 60)).slice(-2);
        if (precision) {
            s = ('00.0' + (s % 60).toFixed(precision)).slice(-4);
        } else {
            s = ('00' + Math.floor(s % 60)).slice(-2);
        }
        return m + ':' + s;
    });

    // root panel
    var root = document.createElement('div');
    root.id = 'dev-tools';
    root.style.display = 'none';
    document.body.appendChild(root);
    editor.method('tools:root', function() {
        return root;
    });

    // variabled
    var updateInterval;
    var enabled = false;

    if (location.search && location.search.indexOf('profile=true') !== -1)
        enabled = true;

    if (enabled)
        root.style.display = 'block';

    // view
    var scale = .2; // how many pixels in a ms
    var capacity = 0; // how many ms can fit
    var scroll = {
        time: 0, // how many ms start from
        auto: true, // auto scroll to the end
        drag: {
            x: 0,
            time: 0,
            bar: false,
            barTime: 0,
            barMove: false
        }
    };

    editor.method('tools:enabled', function() { return enabled; });

    editor.method('tools:enable', function() {
        if (enabled)
            return;

        enabled = true;
        root.style.display = 'block';
        resize();
        editor.emit('tools:clear');
        editor.emit('tools:state', true);

        // updateInterval = setInterval(function() {
        //     update();
        //     editor.emit('tools:render');
        // }, 1000 / 60);
    });

    editor.method('tools:disable', function() {
        if (! enabled)
            return;

        enabled = false;
        root.style.display = 'none';
        editor.emit('tools:clear');
        editor.emit('tools:state', false);
        // clearInterval(updateInterval);
    });

    // methods to access view params
    editor.method('tools:time:capacity', function() { return capacity; });
    editor.method('tools:scroll:time', function() { return scroll.time; });

    // size
    var left = 300;
    var right = 0;
    var width = 0;
    var height = 0;
    // resizing
    var resize = function() {
        var rect = root.getBoundingClientRect();

        if (width === rect.width && height === rect.height)
            return;

        width = rect.width;
        height = rect.height;
        capacity = Math.floor((width - left - right) / scale);
        scroll.time = Math.max(0, Math.min(timeNow - capacity, Math.floor(scroll.time)));

        editor.emit('tools:resize', width, height);
    };
    window.addEventListener('resize', resize, false);
    window.addEventListener('orientationchange', resize, false);
    setInterval(resize, 500);
    resize();
    editor.method('tools:size:width', function() { return width; });
    editor.method('tools:size:height', function() { return height; });

    editor.on('tools:clear', function() {
        timeBeginning = now();
        timeNow = 0;
        timeHover = 0;
        scroll.time = 0;
        scroll.auto = true;
    });

    var mouse = {
        x: 0,
        y: 0,
        click: false,
        down: false,
        up: false,
        hover: false
    };

    var update = function() {
        timeNow = now() - timeBeginning;

        if (scroll.auto)
            scroll.time = Math.max(0, timeNow - capacity);

        if (mouse.click) {
            scroll.drag.x = mouse.x;
            scroll.drag.time = scroll.time;
            scroll.drag.bar = mouse.y < 23;
            if (scroll.drag.bar) {
                scroll.drag.barTime = ((mouse.x / (width - 300)) * timeNow) - scroll.time;
                scroll.drag.barMove = scroll.drag.barTime >= 0 && scroll.drag.barTime <= capacity;
            }
            scroll.auto = false;
            root.classList.add('dragging');
            editor.emit('tools:scroll:start');
        } else if (mouse.down) {
            if (scroll.drag.bar) {
                if (scroll.drag.barMove) {
                    scroll.time = ((mouse.x / (width - 300)) * timeNow) - scroll.drag.barTime;
                } else {
                    scroll.time = ((mouse.x / (width - 300)) * timeNow) - (capacity / 2);
                }
            } else {
                scroll.time = scroll.drag.time + ((scroll.drag.x - mouse.x) / scale);
            }
            scroll.time = Math.max(0, Math.min(timeNow - capacity, Math.floor(scroll.time)));
        } else if (mouse.up) {
            if (Math.abs((scroll.time + capacity) - timeNow) < 32)
                scroll.auto = true;

            root.classList.remove('dragging');
            editor.emit('tools:scroll:end');
        }

        if (mouse.hover && ! mouse.down) {
            if (mouse.y < 23) {
                timeHover = Math.floor((mouse.x / (width - 300)) * timeNow);
            } else if (mouse.y < 174) {
                timeHover = Math.floor(mouse.x / scale + scroll.time);
            } else {
                timeHover = 0;
            }
        } else {
            timeHover = 0;
        }

        flushMouse();
    };

    root.addEventListener('mousemove', function(evt) {
        evt.stopPropagation();

        var rect = root.getBoundingClientRect();
        mouse.x = evt.clientX - (rect.left + 300);
        mouse.y = evt.clientY - rect.top;
        mouse.hover = mouse.x > 0;
        if (mouse.y < 23) {
            timeHover = Math.floor((mouse.x / (width - 300)) * timeNow);
        } else {
            timeHover = Math.floor(mouse.x / scale + scroll.time);
        }
    }, false);

    root.addEventListener('mousedown', function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        if (evt.button !== 0 || mouse.click || mouse.down || ! mouse.hover)
            return;

        mouse.click = true;
    }, false);

    root.addEventListener('mouseup', function(evt) {
        evt.stopPropagation();

        if (evt.button !== 0 || ! mouse.down)
            return;

        mouse.down = false;
        mouse.up = true;
    }, false);

    root.addEventListener('mouseleave', function(evt) {
        mouse.hover = false;
        timeHover = 0;
        if (! mouse.down)
            return;

        mouse.down = false;
        mouse.up = true;
    }, false);

    root.addEventListener('mousewheel', function(evt) {
        evt.stopPropagation();

        if (! mouse.hover)
            return;

        scroll.time = Math.max(0, Math.min(timeNow - capacity, Math.floor(scroll.time + evt.deltaX / scale)));
        if (evt.deltaX < 0) {
            scroll.auto = false;
        } else if (Math.abs((scroll.time + capacity) - timeNow) < 16) {
            scroll.auto = true;
        }
    }, false);

    // alt + t
    window.addEventListener('keydown', function(evt) {
        if (evt.keyCode === 84 && evt.altKey) {
            if (enabled) {
                editor.call('tools:disable');
            } else {
                editor.call('tools:enable');
            }
        }
    }, false);

    var flushMouse = function() {
        if (mouse.up)
            mouse.up = false;

        if (mouse.click) {
            mouse.click = false;
            mouse.down = true;
        }
    };

    var app = editor.call('viewport:app');
    if (! app) return; // webgl not available

    var frame = 0;
    var frameLast = 0;

    var onFrame = function() {
        requestAnimationFrame(onFrame);

        if (enabled) {
            var now = Date.now();

            if ((now - frameLast) >= 40) {
                frameLast = now;

                update();
                editor.emit('tools:render');
            }
        }
    };
    requestAnimationFrame(onFrame);
});


/* launch/tools-overview.js */
editor.once('load', function() {
    'use strict';

    // variables
    var enabled = editor.call('tools:enabled');
    var scale = .2;
    var events = [ ];
    var eventsIndex = { };

    // canvas
    var canvas = document.createElement('canvas');
    canvas.classList.add('overview');
    editor.call('tools:root').appendChild(canvas);

    // context
    var ctx = canvas.getContext('2d');

    // resize
    editor.on('tools:resize', function(width, height) {
        canvas.width = width - 300 - 32;
        canvas.height = 24;
        scale = canvas.width / editor.call('tools:capacity');
        ctx.font = '10px Arial';
        render();
    });
    canvas.width = editor.call('tools:size:width') - 300 - 32;
    canvas.height = 24;
    ctx.font = '10px Arial';
    scale = canvas.width / editor.call('tools:capacity');

    editor.on('tools:clear', function() {
        events = [ ];
        eventsIndex = { };
    });

    editor.on('tools:timeline:add', function(item) {
        var found = false;

        // check if can extend existing event
        for(var i = 0; i < events.length; i++) {
            if (events[i].t2 !== null && events[i].k === item.k && (events[i].t - 1) <= item.t && (events[i].t2 === -1 || (events[i].t2 + 1) >= item.t)) {
                found = true;
                events[i].t2 = item.t2;
                eventsIndex[item.i] = events[i];
                break;
            }
        }

        if (! found) {
            var obj = {
                i: item.i,
                t: item.t,
                t2: item.t2,
                k: item.k
            };
            events.push(obj);
            eventsIndex[obj.i] = obj;
        }
    });

    editor.on('tools:timeline:update', function(item) {
        if (! enabled || ! eventsIndex[item.i])
            return;

        eventsIndex[item.i].t2 = item.t2;
    });

    var render = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var scaleMs = 1000 * scale;
        var now = editor.call('tools:time:now');
        var scrollTime = editor.call('tools:scroll:time');
        var capacity = editor.call('tools:time:capacity');
        var timeHover = editor.call('tools:time:hover');
        ctx.textBaseline = 'alphabetic';

        var startX = scrollTime / now * canvas.width;
        var endX = (Math.min(now, scrollTime + capacity)) / now * canvas.width;

        // view rect
        ctx.beginPath();
        ctx.rect(startX, 0, endX - startX, canvas.height);
        ctx.fillStyle = '#303030';
        ctx.fill();
        // line bottom
        ctx.beginPath();
        ctx.moveTo(startX, canvas.height - .5);
        ctx.lineTo(endX, canvas.height - .5);
        ctx.strokeStyle = '#2c2c2c';
        ctx.stroke();

        // events
        var x, x2, e;
        for(var i = 0; i < events.length; i++) {
            e = events[i];
            x = e.t / now * canvas.width;

            if (events[i].t2 !== null) {
                var t2 = e.t2;
                if (e.t2 === -1)
                    t2 = now;

                x2 = Math.max(t2 / now * canvas.width, x + 1);

                ctx.beginPath();
                ctx.rect(x, Math.floor((canvas.height - 8) / 2), x2 - x, 8);
                ctx.fillStyle = editor.call('tools:timeline:color', e.k);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.moveTo(x, 1);
                ctx.lineTo(x, canvas.height - 1);
                ctx.strokeStyle = editor.call('tools:timeline:color', e.k);
                ctx.stroke();
            }
        }

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000';

        // start/end text
        ctx.fillStyle = '#fff';
        // start time
        ctx.textAlign = 'left';
        ctx.strokeText('00:00.0 FPS', 2.5, canvas.height - 2.5);
        ctx.fillText('00:00.0 FPS', 2.5, canvas.height - 2.5);
        // now time
        ctx.textAlign = 'right';
        ctx.strokeText(editor.call('tools:time:toHuman', now, 1), canvas.width - 2.5, canvas.height - 2.5);
        ctx.fillText(editor.call('tools:time:toHuman', now, 1), canvas.width - 2.5, canvas.height - 2.5);

        var startTextWidth = 0;
        ctx.textBaseline = 'top';

        // view start
        if (scrollTime > 0) {
            var text = editor.call('tools:time:toHuman', scrollTime, 1);
            var measures = ctx.measureText(text);
            var offset = 2.5;
            if (startX + 2.5 + measures.width < endX - 2.5) {
                startTextWidth = measures.width;
                ctx.textAlign = 'left';
            } else {
                offset = -2.5;
                ctx.textAlign = 'right';
            }
            ctx.strokeText(text, startX + offset, 0);
            ctx.fillText(text, startX + offset, 0);
        }

        // view end
        if ((scrollTime + capacity) < now - 100) {
            var text = editor.call('tools:time:toHuman', Math.min(now, scrollTime + capacity), 1);
            var measures = ctx.measureText(text);
            var offset = 2.5;
            if (endX - 2.5 - measures.width - startTextWidth > startX + 2.5) {
                ctx.textAlign = 'right';
                offset = -2.5;
            } else {
                ctx.textAlign = 'left';
            }
            ctx.strokeText(text, endX + offset, 0);
            ctx.fillText(text, endX + offset, 0);
        }

        ctx.lineWidth = 1;
    };

    editor.on('tools:render', render);
});


/* launch/tools-timeline.js */
editor.once('load', function() {
    'use strict';

    // variables
    var enabled = editor.call('tools:enabled');
    var counter = 0;
    var frame = 0;
    var scale = .2;
    var events = [ ];
    var cacheAssetLoading = { };
    var cacheShaderCompile = [ ];
    var cacheShaderCompileEvents = [ ];
    var cacheLightmapper = null;
    var cacheLightmapperEvent = null;
    var app = editor.call('viewport:app');
    if (! app) return; // webgl not available

    // canvas
    var canvas = document.createElement('canvas');
    canvas.classList.add('timeline');
    editor.call('tools:root').appendChild(canvas);

    // context
    var ctx = canvas.getContext('2d');

    // resize
    editor.on('tools:resize', function(width, height) {
        canvas.width = width - 300 - 32;
        canvas.height = 275;
        scale = canvas.width / editor.call('tools:time:capacity');
        ctx.font = '10px Arial';
        render();
    });
    canvas.width = editor.call('tools:size:width') - 300 - 32;
    canvas.height = 275;
    ctx.font = '10px Arial';
    scale = canvas.width / editor.call('tools:time:capacity');

    editor.on('tools:clear', function() {
        events = [ ];
        cacheAssetLoading = { };
        cacheShaderCompile = [ ];
        cacheShaderCompileEvents = [ ];
    });

    editor.on('tools:state', function(state) {
        enabled = state;
    });

    // colors for different kinds of events
    var kindColors = {
        '': '#ff0',
        'asset': '#6f6',
        'shader': '#f60',
        'update': '#06f',
        'render': '#07f',
        'physics': '#0ff',
        'lightmap': '#f6f'
    };
    var kindColorsOverview = {
        '': '#ff0',
        'asset': '#6f6',
        'shader': '#f60',
        'update': '#06f',
        'render': '#07f',
        'physics': '#0ff',
        'lightmap': '#f6f'
    };
    editor.method('tools:timeline:color', function(kind) {
        return kindColorsOverview[kind] || '#fff';
    });

    // add event to history
    var addEvent = function(args) {
        if (! enabled) return;

        var e = {
            i: ++counter,
            t: args.time,
            t2: args.time2 || null,
            n: args.name || '',
            k: args.kind || ''
        };
        events.push(e);
        editor.emit('tools:timeline:add', e);
        return e;
    };
    editor.method('tools:timeline:add', addEvent);

    // subscribe to app reload start
    app.once('preload:start', function() {
        if (! enabled) return;

        addEvent({
            time: editor.call('tools:time:now'),
            name: 'preload'
        });
    });

    // subscribe to app start
    app.once('start', function() {
        if (! enabled) return;

        addEvent({
            time: editor.call('tools:time:now'),
            name: 'start'
        });
    });



    // render frames
    // app.on('frameEnd', function() {
    //     var e = addEvent(app.stats.frame.renderStart - editor.call('tools:time:beginning'), null, 'render');
    //     e.t2 = (app.stats.frame.renderStart - editor.call('tools:time:beginning')) + app.stats.frame.renderTime;
    // });

    // subscribe to asset loading start
    app.assets.on('load:start', function(asset) {
        if (! enabled) return;

        cacheAssetLoading[asset.id] = addEvent({
            time: editor.call('tools:time:now'),
            time2: -1,
            kind: 'asset'
        });
    });

    // subscribe to asset loading end
    app.assets.on('load', function(asset) {
        if (! enabled || ! cacheAssetLoading[asset.id])
            return;

        cacheAssetLoading[asset.id].t2 = editor.call('tools:time:now');
        editor.emit('tools:timeline:update', cacheAssetLoading[asset.id]);
        delete cacheAssetLoading[asset.id];
    });


    var onShaderStart = function(evt) {
        if (! enabled) return;

        var time = evt.timestamp;
        if (editor.call('tools:epoc'))
            time -= editor.call('tools:time:beginning');

        var item = addEvent({
            time: time,
            time2: -1,
            kind: 'shader'
        });

        cacheShaderCompile.push(evt.target);
        cacheShaderCompileEvents[cacheShaderCompile.length - 1] = item;
    };

    var onShaderEnd = function(evt) {
        if (! enabled) return;

        var ind = cacheShaderCompile.indexOf(evt.target);
        if (ind === -1)
            return;

        var time = evt.timestamp;
        if (editor.call('tools:epoc'))
            time -= editor.call('tools:time:beginning');

        cacheShaderCompileEvents[ind].t2 = time;
        editor.emit('tools:timeline:update', cacheShaderCompileEvents[ind]);
        cacheShaderCompile.splice(ind, 1);
        cacheShaderCompileEvents.splice(ind, 1);
    };

    var onLightmapperStart = function(evt) {
        if (! enabled) return;

        var time = evt.timestamp;
        if (editor.call('tools:epoc'))
            time -= editor.call('tools:time:beginning');

        var item = addEvent({
            time: time,
            time2: -1,
            kind: 'lightmap'
        });

        cacheLightmapper = evt.target;
        cacheLightmapperEvent = item;
    };

    var onLightmapperEnd = function(evt) {
        if (! enabled) return;

        if (cacheLightmapper !== evt.target)
            return;

        var time = evt.timestamp;
        if (editor.call('tools:epoc'))
            time -= editor.call('tools:time:beginning');

        cacheLightmapperEvent.t2 = time;
        editor.emit('tools:timeline:update', cacheLightmapperEvent);
        cacheLightmapper = null;
    };

    // subscribe to shader compile and linking
    app.graphicsDevice.on('shader:compile:start', onShaderStart);
    app.graphicsDevice.on('shader:link:start', onShaderStart);
    app.graphicsDevice.on('shader:compile:end', onShaderEnd);
    app.graphicsDevice.on('shader:link:end', onShaderEnd);

    // subscribe to lightmapper baking
    app.graphicsDevice.on('lightmapper:start', onLightmapperStart);
    app.graphicsDevice.on('lightmapper:end', onLightmapperEnd);

    // add performance.timing events if available
    if (performance.timing) {
        // dom interactive
        addEvent({
            time: performance.timing.domInteractive - editor.call('tools:time:beginning'),
            name: 'dom'
        });
        // document load
        addEvent({
            time: performance.timing.loadEventEnd - editor.call('tools:time:beginning'),
            name: 'load'
        });
    }

    var render = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var barMargin = 1;
        var barHeight = 8;
        var stack = [ ];
        var scaleMs = 1000 * scale;
        var now = editor.call('tools:time:now');
        var scrollTime = editor.call('tools:scroll:time');
        var timeHover = editor.call('tools:time:hover');
        ctx.textBaseline = 'alphabetic';

        // grid
        var secondsX = Math.floor(canvas.width * scale);
        ctx.strokeStyle = '#2c2c2c';
        ctx.fillStyle = '#989898';
        var offset = scaleMs - ((scrollTime * scale) % scaleMs) - scaleMs;
        for(var x = 0; x <= secondsX; x++) {
            var barX = Math.floor(x * scaleMs + offset) + .5;
            if (x > 0) {
                ctx.beginPath();
                ctx.moveTo(barX, 0);
                ctx.lineTo(barX, canvas.height);
                ctx.stroke();
            }

            var s = Math.floor(x + (scrollTime / 1000));
            var m = Math.floor(s / 60);
            s = s % 60;
            ctx.fillText((m ? m + 'm ' : '') + s + 's', barX + 2.5, canvas.height - 2.5);
        }

        // events
        var e, x = 0, x2 = 0, y;
        for(var i = 0; i < events.length; i++) {
            e = events[i];
            x = Math.floor((e.t - scrollTime) * scale);

            if (x > canvas.width)
                break;

            // time
            if (e.t2 !== null) {
                if (isNaN(e.t2)) {
                    console.log(e);
                    continue;
                }
                // range
                var t2 = e.t2 - scrollTime;
                if (e.t2 === -1)
                    t2 = now - scrollTime;


                x2 = Math.max(Math.floor(t2 * scale), x + 1);

                if (x2 < 0)
                    continue;

                y = 0;
                var foundY = false;
                for(var n = 0; n < stack.length; n++) {
                    if (stack[n] < e.t) {
                        stack[n] = t2 + scrollTime;
                        y = n * (barHeight + barMargin);
                        foundY = true;
                        break;
                    }
                }
                if (! foundY) {
                    y = stack.length * (barHeight + barMargin);
                    stack.push(t2 + scrollTime);
                }

                ctx.beginPath();
                ctx.rect(x + .5, y + 1, x2 - x + .5, barHeight);
                ctx.fillStyle = kindColors[e.k] || '#fff';
                ctx.fill();
            } else {
                if (x < 0)
                    continue;

                // single event
                ctx.beginPath();
                ctx.moveTo(x + .5, 1);
                ctx.lineTo(x + .5, canvas.height - 1);
                ctx.strokeStyle = kindColors[e.k] || '#fff';
                ctx.stroke();
            }
        }

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000';
        for(var i = 0; i < events.length; i++) {
            e = events[i];
            x = Math.floor((e.t - scrollTime) * scale);

            if (x > canvas.width)
                break;

            if (e.t2 !== null || x < 0)
                continue;

            // name
            if (e.n) {
                ctx.fillStyle = kindColors[e.k] || '#fff';
                ctx.strokeText(e.n, x + 2.5, canvas.height - 12.5);
                ctx.strokeText((e.t / 1000).toFixed(2) + 's', x + 2.5, canvas.height - 2.5);
                ctx.fillText(e.n, x + 2.5, canvas.height - 12.5);
                ctx.fillText((e.t / 1000).toFixed(2) + 's', x + 2.5, canvas.height - 2.5);
            }
        }
        ctx.lineWidth = 1;

        // now
        ctx.beginPath();
        ctx.moveTo(Math.floor((now - scrollTime) * scale) + .5, 0);
        ctx.lineTo(Math.floor((now - scrollTime) * scale) + .5, canvas.height);
        ctx.strokeStyle = '#989898';
        ctx.stroke();

        // hover
        if (timeHover > 0) {
            var x = (timeHover - scrollTime) * scale;
            ctx.beginPath();
            ctx.moveTo(Math.floor(x) + .5, 0);
            ctx.lineTo(Math.floor(x) + .5, canvas.height);
            ctx.strokeStyle = '#989898';
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#fff';
            ctx.strokeText((timeHover / 1000).toFixed(1) + 's', Math.floor(x) + 2.5, canvas.height - 22.5);
            ctx.fillText((timeHover / 1000).toFixed(1) + 's', Math.floor(x) + 2.5, canvas.height - 22.5);
            ctx.lineWidth = 1;
        }
    };

    editor.on('tools:render', render);
});


/* launch/tools-frame.js */
editor.once('load', function() {
    'use strict';

    var enabled = editor.call('tools:enabled');
    var app = editor.call('viewport:app');
    if (! app) return; // webgl not available

    editor.on('tools:state', function(state) {
        enabled = state;
    });

    var panel = document.createElement('div');
    panel.classList.add('frame');
    editor.call('tools:root').appendChild(panel);

    var addPanel = function(args) {
        var element = document.createElement('div');
        element.classList.add('panel');
        panel.appendChild(element);

        element._header = document.createElement('div');
        element._header.classList.add('header');
        element._header.textContent = args.title;
        element.appendChild(element._header);

        element._header.addEventListener('click', function() {
            if (element.classList.contains('folded')) {
                element.classList.remove('folded');
            } else {
                element.classList.add('folded');
            }
        }, false);

        return element;
    };

    var addField = function(args) {
        var row = document.createElement('div');
        row.classList.add('row');

        row._title = document.createElement('div');
        row._title.classList.add('title');
        row._title.textContent = args.title || '';
        row.appendChild(row._title);

        row._field = document.createElement('div');
        row._field.classList.add('field');
        row._field.textContent = args.value || '-';
        row.appendChild(row._field);

        Object.defineProperty(row, 'value', {
            set: function(value) {
                this._field.textContent = value !== undefined ? value : '';
            }
        });

        return row;
    };
    editor.method('tools:frame:field:add', function(name, title, value) {
        var field = addField({
            title: title,
            value: value
        });
        fieldsCustom[name] = field;
        panelApp.appendChild(field);
    });
    editor.method('tools:frame:field:value', function(name, value) {
        if (! fieldsCustom[name])
            return;

        fieldsCustom[name].value = value;
    });


    // convert number of bytes to human form
    var bytesToHuman = function(bytes) {
        if (isNaN(bytes) || bytes === 0) return '0 B';
        var k = 1000;
        var sizes = ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    };


    // frame
    var panelFrame = addPanel({
        title: 'Frame'
    });
    // scene
    var panelScene = addPanel({
        title: 'Scene'
    });
    // drawCalls
    var panelDrawCalls = addPanel({
        title: 'Draw Calls'
    });
    // batching
    var panelBatching = addPanel({
        title: 'Batching'
    });
    // particles
    var panelParticles = addPanel({
        title: 'Particles'
    });
    // shaders
    var panelShaders = addPanel({
        title: 'Shaders'
    });
    // lightmapper
    var panelLightmap = addPanel({
        title: 'Lightmapper'
    });
    // vram
    var panelVram = addPanel({
        title: 'VRAM'
    });
    // app
    var panelApp = addPanel({
        title: 'App'
    });


    var fieldsCustom = { };

    var fields = [{
        key: [ 'frame', 'fps' ],
        panel: panelFrame,
        title: 'FPS',
        update: false
    }, {
        key: [ 'frame', 'ms' ],
        panel: panelFrame,
        title: 'MS',
        format: function(value) {
            return value.toFixed(2);
        }
    }, {
        key: [ 'frame', 'cameras' ],
        title: 'Cameras',
        panel: panelFrame
    }, {
        key: [ 'frame', 'cullTime' ],
        title: 'Cull Time',
        panel: panelFrame,
        format: function(value) {
            return value.toFixed(3);
        }
    }, {
        key: [ 'frame', 'sortTime' ],
        title: 'Sort Time',
        panel: panelFrame,
        format: function(value) {
            return value.toFixed(3);
        }
    }, {
        key: [ 'frame', 'shaders' ],
        title: 'Shaders',
        panel: panelFrame
    }, {
        key: [ 'frame', 'materials' ],
        title: 'Materials',
        panel: panelFrame
    }, {
        key: [ 'frame', 'triangles' ],
        title: 'Triangles',
        panel: panelFrame,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'frame', 'otherPrimitives' ],
        title: 'Other Primitives',
        panel: panelFrame
    }, {
        key: [ 'frame', 'shadowMapUpdates' ],
        title: 'ShadowMaps Updates',
        panel: panelFrame
    }, {
        key: [ 'frame', 'shadowMapTime' ],
        title: 'ShadowMaps Time',
        panel: panelFrame,
        format: function(value) {
            return value.toFixed(2);
        }
    }, {
        key: [ 'frame', 'updateTime' ],
        title: 'Update Time',
        panel: panelFrame,
        format: function(value) {
            return value.toFixed(2);
        }
    }, {
        key: [ 'frame', 'physicsTime' ],
        title: 'Physics Time',
        panel: panelFrame,
        format: function(value) {
            return value.toFixed(2);
        }
    }, {
        key: [ 'frame', 'renderTime' ],
        title: 'Render Time',
        panel: panelFrame,
        format: function(value) {
            return value.toFixed(2);
        }
    }, {
        key: [ 'frame', 'forwardTime' ],
        title: 'Forward Time',
        panel: panelFrame,
        format: function(value) {
            return value.toFixed(2);
        }
    }, {
        key: [ 'scene', 'meshInstances' ],
        title: 'Mesh Instances',
        panel: panelScene
    }, {
        key: [ 'scene', 'drawCalls' ],
        title: 'Draw Calls (potential)',
        panel: panelScene
    }, {
        key: [ 'scene', 'lights' ],
        title: 'Lights',
        panel: panelScene
    }, {
        key: [ 'scene', 'dynamicLights' ],
        title: 'Lights (Dynamic)',
        panel: panelScene
    }, {
        key: [ 'scene', 'bakedLights' ],
        title: 'Lights (Baked)',
        panel: panelScene
    }, {
        key: [ 'drawCalls', 'total' ],
        title: 'Total',
        panel: panelDrawCalls,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'drawCalls', 'forward' ],
        title: 'Forward',
        panel: panelDrawCalls,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'drawCalls', 'skinned' ],
        title: 'Skinned',
        panel: panelDrawCalls,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'drawCalls', 'shadow' ],
        title: 'Shadow',
        panel: panelDrawCalls,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'drawCalls', 'depth' ],
        title: 'Depth',
        panel: panelDrawCalls,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'drawCalls', 'instanced' ],
        title: 'Instanced',
        panel: panelDrawCalls,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'drawCalls', 'removedByInstancing' ],
        title: 'Instancing Benefit',
        panel: panelDrawCalls,
        format: function(value) {
            return '-' + value.toLocaleString();
        }
    }, {
        key: [ 'drawCalls', 'immediate' ],
        title: 'Immediate',
        panel: panelDrawCalls,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'drawCalls', 'misc' ],
        title: 'Misc',
        panel: panelDrawCalls,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'batcher', 'createTime' ],
        title: 'Create Time',
        panel: panelBatching,
        format: function(value) {
            return value.toFixed(2);
        }
    }, {
        key: [ 'batcher', 'updateLastFrameTime' ],
        title: 'Update Last Frame Time',
        panel: panelBatching,
        format: function(value) {
            return value.toFixed(2);
        }
    }, {
        key: [ 'particles', 'updatesPerFrame' ],
        title: 'Updates',
        panel: panelParticles
    }, {
        key: [ 'particles', 'frameTime' ],
        title: 'Update Time',
        panel: panelParticles,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'shaders', 'linked' ],
        title: 'Linked',
        panel: panelShaders,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'shaders', 'vsCompiled' ],
        title: 'Compiled VS',
        panel: panelShaders,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'shaders', 'fsCompiled' ],
        title: 'Compiled FS',
        panel: panelShaders,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'shaders', 'materialShaders' ],
        title: 'Materials',
        panel: panelShaders,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'shaders', 'compileTime' ],
        title: 'Compile Time',
        panel: panelShaders,
        format: function(value) {
            return value.toFixed(3);
        }
    }, {
        key: [ 'lightmapper', 'renderPasses' ],
        title: 'Render Passes',
        panel: panelLightmap,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'lightmapper', 'lightmapCount' ],
        title: 'Textures',
        panel: panelLightmap,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'lightmapper', 'shadersLinked' ],
        title: 'Shaders Linked',
        panel: panelLightmap,
        format: function(value) {
            return value.toLocaleString();
        }
    }, {
        key: [ 'lightmapper', 'totalRenderTime' ],
        title: 'Total Render Time',
        panel: panelLightmap,
        format: function(value) {
            return value.toFixed(3);
        }
    }, {
        key: [ 'lightmapper', 'forwardTime' ],
        title: 'Forward Time',
        panel: panelLightmap,
        format: function(value) {
            return value.toFixed(3);
        }
    }, {
        key: [ 'lightmapper', 'fboTime' ],
        title: 'FBO Time',
        panel: panelLightmap,
        format: function(value) {
            return value.toFixed(3);
        }
    }, {
        key: [ 'lightmapper', 'shadowMapTime' ],
        title: 'ShadowMap Time',
        panel: panelLightmap,
        format: function(value) {
            return value.toFixed(3);
        }
    }, {
        key: [ 'lightmapper', 'compileTime' ],
        title: 'Shader Compile Time',
        panel: panelLightmap,
        format: function(value) {
            return value.toFixed(3);
        }
    }, {
        key: [ 'vram', 'ib' ],
        title: 'Index Buffers',
        panel: panelVram,
        format: bytesToHuman
    }, {
        key: [ 'vram', 'vb' ],
        title: 'Vertex Buffers',
        panel: panelVram,
        format: bytesToHuman
    }, {
        key: [ 'vram', 'texShadow' ],
        title: 'Shadowmaps',
        panel: panelVram,
        format: bytesToHuman
    }, {
        key: [ 'vram', 'texLightmap' ],
        title: 'Lightmaps',
        panel: panelVram,
        format: bytesToHuman
    }, {
        key: [ 'vram', 'texAsset' ],
        title: 'Texture Assets',
        panel: panelVram,
        format: bytesToHuman
    }, {
        key: [ 'vram', 'tex' ],
        title: 'Textures Other',
        panel: panelVram,
        format: function(bytes) {
            return bytesToHuman(bytes - (app.stats.vram.texLightmap + app.stats.vram.texShadow + app.stats.vram.texAsset));
        }
    }, {
        key: [ 'vram', 'tex' ],
        title: 'Textures Total',
        panel: panelVram,
        format: bytesToHuman
    }, {
        key: [ 'vram', 'totalUsed' ],
        title: 'Total',
        panel: panelVram,
        format: bytesToHuman
    }];

    // create fields
    for(var i = 0; i < fields.length; i++) {
        fields[i].field = addField({
            title: fields[i].title || fields[i].key[1]
        });
        fields[i].panel.appendChild(fields[i].field);

        if (fields[i].custom)
            fieldsCustom[fields[i].custom] = fields[i].field;
    }


    // controlls for skip rendering
    var row = document.createElement('div');
    row.classList.add('row');
    panelDrawCalls.appendChild(row);

    var title = document.createElement('div');
    title.classList.add('title');
    title.textContent = 'Camera Drawcalls Limit';
    title.style.fontSize = '11px'
    row.appendChild(title);

    var cameras = document.createElement('select');
    cameras.classList.add('cameras');
    row.appendChild(cameras);
    cameras.addEventListener('mousedown', function(evt) {
        evt.stopPropagation();
    });
    cameras.addEventListener('change', function() {
        if (cameras.value === 'none') {
            rowCameraSkip.style.display = 'none';
            pc.skipRenderCamera = null;
        } else {
            rowCameraSkip.style.display = '';

            var entity = app.root.findByGuid(cameras.value);
            if (entity && entity.camera) {
                pc.skipRenderCamera = entity.camera.camera;
                pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
            }
        }
    });

    var cameraIndex = { };
    var cameraAddQueue = [ ];

    var cameraNone = document.createElement('option');
    cameraNone.value = 'none';
    cameraNone.selected = true;
    cameraNone.textContent = 'Disabled';
    cameras.appendChild(cameraNone);


    // frames control
    var rowCameraSkip = document.createElement('div');
    rowCameraSkip.classList.add('row');
    rowCameraSkip.style.display = 'none';
    panelDrawCalls.appendChild(rowCameraSkip);

    var cameraSkipFramesLeft0 = document.createElement('div');
    cameraSkipFramesLeft0.classList.add('drawcallsLimitButton');
    cameraSkipFramesLeft0.textContent = '|<';
    cameraSkipFramesLeft0.addEventListener('click', function() {
        cameraSkipFrames.value = '0';
        pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
    });
    rowCameraSkip.appendChild(cameraSkipFramesLeft0);

    var cameraSkipFramesLeft10 = document.createElement('div');
    cameraSkipFramesLeft10.classList.add('drawcallsLimitButton');
    cameraSkipFramesLeft10.textContent = '<<';
    cameraSkipFramesLeft10.addEventListener('click', function() {
        cameraSkipFrames.value = Math.max(0, (parseInt(cameraSkipFrames.value, 10) || 0) - 10);
        pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
    });
    rowCameraSkip.appendChild(cameraSkipFramesLeft10);

    var cameraSkipFramesLeft1 = document.createElement('div');
    cameraSkipFramesLeft1.classList.add('drawcallsLimitButton');
    cameraSkipFramesLeft1.textContent = '<';
    cameraSkipFramesLeft1.addEventListener('click', function() {
        cameraSkipFrames.value = Math.max(0, (parseInt(cameraSkipFrames.value, 10) || 0) - 1);
        pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
    });
    rowCameraSkip.appendChild(cameraSkipFramesLeft1);

    var cameraSkipFrames = document.createElement('input');
    cameraSkipFrames.classList.add('framesSkip');
    cameraSkipFrames.type = 'text';
    cameraSkipFrames.value = '0';
    rowCameraSkip.appendChild(cameraSkipFrames);
    cameraSkipFrames.addEventListener('mousedown', function(evt) {
        evt.stopPropagation();
    });
    cameraSkipFrames.addEventListener('change', function() {
        pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
        pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
    }, false);
    cameraSkipFrames.addEventListener('keydown', function(evt) {
        var inc = 0;

        if (evt.keyCode === 38) {
            inc = evt.shiftKey ? 10 : 1;
        } else if (evt.keyCode === 40) {
            inc = evt.shiftKey ? -10 : -1;
        }

        if (inc === 0)
            return;

        evt.preventDefault();
        evt.stopPropagation();

        cameraSkipFrames.value = Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, (parseInt(cameraSkipFrames.value, 10) || 0) + inc));
        pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
    });

    var cameraSkipFramesRight1 = document.createElement('div');
    cameraSkipFramesRight1.classList.add('drawcallsLimitButton');
    cameraSkipFramesRight1.textContent = '>';
    cameraSkipFramesRight1.addEventListener('click', function() {
        cameraSkipFrames.value = Math.min(Number.MAX_SAFE_INTEGER, (parseInt(cameraSkipFrames.value, 10) || 0) + 1);
        pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
    });
    rowCameraSkip.appendChild(cameraSkipFramesRight1);

    var cameraSkipFramesRight10 = document.createElement('div');
    cameraSkipFramesRight10.classList.add('drawcallsLimitButton');
    cameraSkipFramesRight10.textContent = '>>';
    cameraSkipFramesRight10.addEventListener('click', function() {
        cameraSkipFrames.value = Math.min(Number.MAX_SAFE_INTEGER, (parseInt(cameraSkipFrames.value, 10) || 0) + 10);
        pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
    });
    rowCameraSkip.appendChild(cameraSkipFramesRight10);


    var cameraAdd = function(id) {
        if (cameraAddQueue) {
            cameraAddQueue.push(id);
            return;
        }

        if (cameraIndex[id])
            return;

        var entity = app.root.findByGuid(id);
        if (! entity)
            return;

        var option = cameraIndex[id] = document.createElement('option');
        option.value = id;
        option.entity = entity;
        option.textContent = entity.name;
        cameras.appendChild(option);
    };

    var cameraRemove = function(id) {
        if (! cameraIndex[id])
            return;

        if (cameraIndex[id].selected)
            cameras.value = 'none';

        cameras.removeChild(cameraIndex[id]);
        delete cameraIndex[id];
    };

    editor.on('entities:add', function(obj) {
        var id = obj.get('resource_id');

        obj.on('components.camera:set', function() {
            cameraAdd(id);
        });
        obj.on('components.camera:unset', function() {
            cameraRemove(id);
        });
        obj.on('name:set', function(value) {
            if (! cameraIndex[id])
                return;

            cameraIndex.textContent = value;
        });

        if (obj.has('components.camera'))
            cameraAdd(id);
    });

    app.on('start', function() {
        if (cameraAddQueue) {
            var queue = cameraAddQueue;
            cameraAddQueue = null;

            for(var i = 0; i < queue.length; i++)
                cameraAdd(queue[i]);
        }
    });

    // update frame fields
    app.on('frameEnd', function() {
        if (! enabled)
            return;

        for(var i = 0; i < fields.length; i++) {
            if (fields[i].ignore)
                continue;

            if (! app.stats.hasOwnProperty(fields[i].key[0]) || ! app.stats[fields[i].key[0]].hasOwnProperty(fields[i].key[1]))
                continue;

            var value = app.stats[fields[i].key[0]][fields[i].key[1]];

            if (fields[i].format)
                value = fields[i].format(value);

            fields[i].field.value = value;
        }
    });
});


/* launch/tools-toolbar.js */
editor.once('load', function() {
    'use strict';

    // variables
    var toolbar = document.createElement('div');
    toolbar.classList.add('toolbar');
    editor.call('tools:root').appendChild(toolbar);

    // button close
    var btnClose = document.createElement('div');
    btnClose.innerHTML = '&#57650;';
    btnClose.classList.add('button');
    toolbar.appendChild(btnClose);
    btnClose.addEventListener('click', function() {
        editor.call('tools:disable');
    });
});


/* launch/entities.js */
editor.once('load', function() {
    'use strict';

    var entities = new ObserverList({
        index: 'resource_id'
    });

    function createLatestFn(resourceId) {
        return function () {
            return entities.get(resourceId);
        };
    }

    // on adding
    entities.on('add', function(obj) {
        editor.emit('entities:add', obj);
    });

    editor.method('entities:add', function (obj) {
        entities.add(obj);

        // function to get latest version of entity observer
        obj.latestFn = createLatestFn(obj.get('resource_id'));
    });

    // on removing
    entities.on('remove', function(obj) {
        editor.emit('entities:remove', obj);
    });

    editor.method('entities:remove', function (obj) {
        entities.remove(obj);
    });

    // remove all entities
    editor.method('entities:clear', function () {
        entities.clear();
    });

    // Get entity by resource id
    editor.method('entities:get', function (resourceId) {
        return entities.get(resourceId);
    });

    editor.on('scene:raw', function(data) {
        for(var key in data.entities) {
            entities.add(new Observer(data.entities[key]));
        }

        editor.emit('entities:load', data);
    });
});


/* launch/entities-sync.js */
editor.once('load', function() {
    'use strict';

    var syncPaths = [
        'name',
        'parent',
        'children',
        'position',
        'rotation',
        'scale',
        'enabled',
        'template_id',
        'template_ent_ids',
        'components'
    ];


    editor.on('entities:add', function(entity) {
        if (entity.sync)
            return;

        entity.sync = new ObserverSync({
            item: entity,
            prefix: [ 'entities', entity.get('resource_id') ],
            paths: syncPaths
        });
    });


    // server > client
    editor.on('realtime:op:entities', function(op) {
        var entity = null;
        if (op.p[1])
            entity = editor.call('entities:get', op.p[1]);

        if (op.p.length === 2) {
            if (op.hasOwnProperty('od')) {
                // delete entity
                if (entity) {
                    editor.call('entities:remove', entity);
                } else {
                    console.log('delete operation entity not found', op);
                }
            } else if (op.hasOwnProperty('oi')) {
                // new entity
                editor.call('entities:add', new Observer(op.oi));
            } else {
                console.log('unknown operation', op);
            }
        } else if (entity) {
            // write operation
            entity.sync.write(op);
        } else {
            console.log('unknown operation', op);
        }
    });
});


/* editor/schema/schema.js */
editor.once('load', function () {
    'use strict';

    /**
     * Gets the schema object that corresponds to the specified dot separated
     * path from the specified schema object.
     * @param {String} path The path separated by dots
     * @param {Object} schema The schema object
     * @returns {Object} The sub schema
     */
    var pathToSchema = function (path, schema) {
        if (typeof(path) === 'string') {
            path = path.split('.');
        }

        if (typeof(path) === 'number') {
            path = [path];
        }

        var result = schema;
        for (var i = 0, len = path.length; i < len; i++) {
            var p = path[i];
            if (result.$type === 'map' && result.$of) {
                result = result.$of;
            } else if (result[p] || (result.$type && result.$type[p])) {
                result = result[p] || result.$type[p];
            } else if (!isNaN(parseInt(p, 10)) && Array.isArray(result) || Array.isArray(result.$type)) {
                result = Array.isArray(result) ? result[0] : result.$type[0];
            } else {
                return null;
            }
        }

        return result;
    };

    /**
     * Converts the specified schema object to a type recursively.
     * @param {Object} schema The schema object or field of a parent schema object.
     * @param {Boolean} fixedLength Whether the specified schema field has a fixed length if it's an array type.
     * @returns {String} The type
     */
    var schemaToType = function (schema, fixedLength) {
        if (typeof schema === 'string') {
            if (schema === 'map' || schema === 'mixed') {
                schema = 'object';
            }

            return schema.toLowerCase();
        }

        if (schema.$editorType) {
            return schema.$editorType;
        }

        if (Array.isArray(schema)) {
            if (schema[0] === 'number' && fixedLength) {
                if (fixedLength === 2) {
                    return 'vec2';
                } else if (fixedLength === 3) {
                    return 'vec3';
                } else if (fixedLength === 4) {
                    return 'vec4';
                }
            }

            return 'array:' + schemaToType(schema[0]);
        }

        if (schema.$type) {
            return schemaToType(schema.$type, schema.$length);
        }

        return 'object';
    };

    /**
     * Gets the type of the specified schema object,
     * @param {Object} schemaField A field of the schema
     * @param {Boolean} fixedLength Whether this field has a fixed length if it's an array type
     * @returns {String} The type
     */
    editor.method('schema:getType', function (schemaField, fixedLength) {
        return schemaToType(schemaField, fixedLength);
    });

    /**
     * Gets the type of the specified path from the specified schema
     * @param {Object} schema The schema object
     * @param {String} path A path separated by dots
     * @param {String} The type
     */
    editor.method('schema:getTypeForPath', function (schema, path) {
        var subSchema = pathToSchema(path, schema);
        var type = subSchema && schemaToType(subSchema);

        if (! type) {
            console.warn('Unknown type for ' + path);
            type = 'string';
        }

        return type;
    });

    editor.method('schema:getMergeMethodForPath', function (schema, path) {
        var h = pathToSchema(path, schema);

        return h && h.$mergeMethod;
    });
});


/* editor/schema/schema-components.js */
editor.once('load', function() {
    'use strict';

    var projectSettings = editor.call('settings:project');

    var schema = config.schema.scene.entities.$of.components;

    var componentName;

    // make titles for each component
    for (componentName in schema) {
        var title;
        switch (componentName) {
            case 'audiosource':
                title = 'Audio Source';
                break;
            case 'audiolistener':
                title = 'Audio Listener';
                break;
            case 'particlesystem':
                title = 'Particle System';
                break;
            case 'rigidbody':
                title = 'Rigid Body';
                break;
            case 'scrollview':
                title = 'Scroll View';
                break;
            case 'layoutgroup':
                title = 'Layout Group';
                break;
            case 'layoutchild':
                title = 'Layout Child';
                break;
            default:
                title = componentName[0].toUpperCase() + componentName.substring(1);
                break;
        }

        schema[componentName].$title = title;
    }

    // some property defaults should be dynamic so
    // patch them in
    if (schema.screen) {
        // default resolution to project resolution for screen components
        schema.screen.resolution.$default = function () {
            return [
                projectSettings.get('width'),
                projectSettings.get('height')
            ];
        };
        schema.screen.referenceResolution.$default = function () {
            return [
                projectSettings.get('width'),
                projectSettings.get('height')
            ];
        };
    }

    if (schema.element) {
        schema.element.fontAsset.$default = function () {
            // Reuse the last selected font, if it still exists in the library
            var lastSelectedFontId = editor.call('settings:projectUser').get('editor.lastSelectedFontId');
            var lastSelectedFontStillExists = lastSelectedFontId !== -1 && !!editor.call('assets:get', lastSelectedFontId);

            if (lastSelectedFontStillExists) {
                return lastSelectedFontId;
            }

            // Otherwise, select the first available font in the library
            var firstAvailableFont = editor.call('assets:findOne', function (asset) { return ! asset.get('source') && asset.get('type') === 'font'; });

            return firstAvailableFont ? parseInt(firstAvailableFont[1].get('id'), 10) : null;
        };
    }

    // Paths in components that represent assets.
    // Does not include asset script attributes.
    var assetPaths = [];
    var gatherAssetPathsRecursively = function (schemaField, path) {
        if (schemaField.$editorType === 'asset' || schemaField.$editorType === 'array:asset') {
            // this is for cases like components.model.mapping
            assetPaths.push(path);
            return;
        }

        for (var fieldName in schemaField) {
            if (fieldName.startsWith('$')) continue;

            var field = schemaField[fieldName];
            var type = editor.call('schema:getType', field);
            if (type === 'asset' || type === 'array:asset') {
                assetPaths.push(path + '.' + fieldName);
            } else if (type === 'object' && field.$of) {
                gatherAssetPathsRecursively(field.$of, path + '.' + fieldName + '.*');
            }
        }
    };

    for (componentName in schema) {
        gatherAssetPathsRecursively(schema[componentName], 'components.' + componentName);
    }


    editor.method('components:assetPaths', function () {
        return assetPaths;
    });

    if (editor.call('settings:project').get('useLegacyScripts')) {
        schema.script.scripts.$default = [];
        delete schema.script.order;
    }

    var list = Object.keys(schema).sort(function (a, b) {
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        }

        return 0;
    });

    editor.method('components:convertValue', function (component, property, value) {
        var result = value;

        if (value) {
            var data = schema[component];
            if (data && data[property]) {
                var type = editor.call('schema:getType', data[property]);
                switch (type) {
                    case 'rgb':
                        result = new pc.Color(value[0], value[1], value[2]);
                        break;
                    case 'rgba':
                        result = new pc.Color(value[0], value[1], value[2], value[3]);
                        break;
                    case 'vec2':
                        result = new pc.Vec2(value[0], value[1]);
                        break;
                    case 'vec3':
                        result = new pc.Vec3(value[0], value[1], value[2]);
                        break;
                    case 'vec4':
                        result = new pc.Vec4(value[0], value[1], value[2], value[3]);
                        break;
                    case 'curveset':
                        result = new pc.CurveSet(value.keys);
                        result.type = value.type;
                        break;
                    case 'curve':
                        result = new pc.Curve(value.keys);
                        result.type = value.type;
                        break;
                    case 'entity':
                        result = value; // Entity fields should just be a string guid
                        break;
                }
            }
        }

        // for batchGroupId convert null to -1 for runtime
        if (result === null && property === 'batchGroupId')
            result = -1;

        return result;
    });

    editor.method('components:list', function () {
        var result = list.slice(0);
        var idx;

        // filter out zone (which is not really supported)
        if (!editor.call('users:hasFlag', 'hasZoneComponent')) {
            idx = result.indexOf('zone');
            if (idx !== -1) {
                result.splice(idx, 1);
            }
        }

        return result;
    });

    editor.method('components:schema', function () {
        return schema;
    });

    editor.method('components:getDefault', function (component) {
        var result = {};
        for (var fieldName in schema[component]) {
            if (fieldName.startsWith('$')) continue;
            var field = schema[component][fieldName];
            if (field.hasOwnProperty('$default')) {
                result[fieldName] = utils.deepCopy(field.$default);
            }
        }

        resolveLazyDefaults(result);

        return result;
    });

    function resolveLazyDefaults(defaults) {
        // Any functions in the default property set are used to provide
        // lazy resolution, to handle cases where the values are not known
        // at startup time.
        Object.keys(defaults).forEach(function (key) {
            var value = defaults[key];

            if (typeof value === 'function') {
                defaults[key] = value();
            }
        });
    }

    editor.method('components:getFieldsOfType', function (component, type) {
        var matchingFields = [];

        for (var field in schema[component]) {
            if (schema[component][field].$editorType === type) {
                matchingFields.push(field);
            }
        }

        return matchingFields;
    });

});


/* editor/assets/assets-bundles.js */
editor.once('load', function () {
    'use strict';

    var INVALID_TYPES = ['script', 'folder', 'bundle'];

    // stores <asset id, [bundle assets]> index for mapping
    // any asset it to the bundles that it's referenced from
    var bundlesIndex = {};

    // stores all bundle assets
    var bundleAssets = [];

    var addToIndex = function (assetIds, bundleAsset) {
        if (! assetIds) return;

        for (var i = 0; i < assetIds.length; i++) {
            if (! bundlesIndex[assetIds[i]]) {
                bundlesIndex[assetIds[i]] = [bundleAsset];
                editor.emit('assets:bundles:insert', bundleAsset, assetIds[i]);
            } else {
                if (bundlesIndex[assetIds[i]].indexOf(bundleAsset) === -1) {
                    bundlesIndex[assetIds[i]].push(bundleAsset);
                    editor.emit('assets:bundles:insert', bundleAsset, assetIds[i]);
                }
            }
        }
    };

    // fill bundlexIndex when a new bundle asset is added
    editor.on('assets:add', function (asset) {
        if (asset.get('type') !== 'bundle') return;

        bundleAssets.push(asset);
        addToIndex(asset.get('data.assets'), asset);

        asset.on('data.assets:set', function (assetIds) {
            addToIndex(assetIds, asset);
        });

        asset.on('data.assets:insert', function (assetId) {
            addToIndex([assetId], asset);
        });

        asset.on('data.assets:remove', function (assetId) {
            if (! bundlesIndex[assetId]) return;
            var idx = bundlesIndex[assetId].indexOf(asset);
            if (idx !== -1) {
                bundlesIndex[assetId].splice(idx, 1);
                editor.emit('assets:bundles:remove', asset, assetId);
                if (! bundlesIndex[assetId].length) {
                    delete bundlesIndex[assetId];
                }
            }
        });
    });

    // remove bundle asset from bundlesIndex when a bundle asset is
    // removed
    editor.on('assets:remove', function (asset) {
        if (asset.get('type') !== 'bundle') return;

        var idx = bundleAssets.indexOf(asset);
        if (idx !== -1) {
            bundleAssets.splice(idx, 1);
        }

        for (var id in bundlesIndex) {
            idx = bundlesIndex[id].indexOf(asset);
            if (idx !== -1) {
                bundlesIndex[id].splice(idx, 1);
                editor.emit('assets:bundles:remove', asset, id);

                if (! bundlesIndex[id].length) {
                    delete bundlesIndex[id];
                }
            }
        }
    });

    /**
     * Returns all of the bundle assets for the specified asset
     * @param {Observer} asset The asset
     * @returns {Observer[]} The bundles for the asset or an empty array.
     */
    editor.method('assets:bundles:listForAsset', function (asset) {
        return bundlesIndex[asset.get('id')] || [];
    });

    /**
     * Returns a list of all the bundle assets
     * @returns {Observer[]} The bundle assets
     */
    editor.method('assets:bundles:list', function () {
        return bundleAssets.slice();
    });

    /**
     * Returns true if the specified asset id is in a bundle
     * @returns {Boolean} True of false
     */
    editor.method('assets:bundles:containAsset', function (assetId) {
        return !!bundlesIndex[assetId];
    });

    var isAssetValid = function (asset, bundleAsset) {
        var id = asset.get('id');
        if (asset.get('source')) return false;
        if (INVALID_TYPES.indexOf(asset.get('type')) !== -1) return false;

        if (bundleAsset) {
            var existingAssetIds = bundleAsset.getRaw('data.assets');
            if (existingAssetIds.indexOf(id) !== -1) return false;
        }

        return true;
    };

    /**
     * Checks if the specified asset is valid to be added to a bundle
     * with the specified existing asset ids
     */
    editor.method('assets:bundles:canAssetBeAddedToBundle', isAssetValid);

    /**
     * Adds assets to the bundle asset. Does not add already existing
     * assets or assets with invalid types.
     * @param {Observer[]} assets The assets to add to the bundle
     * @param {Observer} bundleAsset The bundle asset
     */
    editor.method('assets:bundles:addAssets', function (assets, bundleAsset) {
        var validAssets = assets.filter(function (asset) {
            return isAssetValid(asset, bundleAsset);
        });

        var len = validAssets.length;
        if (!len) return;

        var undo = function () {
            var asset = editor.call('assets:get', bundleAsset.get('id'));
            if (! asset) return;

            var history = asset.history.enabled;
            asset.history.enabled = false;
            for (var i = 0; i < len; i++) {
                asset.removeValue('data.assets', validAssets[i].get('id'));
            }
            asset.history.enabled = history;
        };

        var redo = function () {
            var asset = editor.call('assets:get', bundleAsset.get('id'));
            if (! asset) return;

            var history = asset.history.enabled;
            asset.history.enabled = false;
            for (var i = 0; i < len; i++) {
                if (isAssetValid(validAssets[i], asset)) {
                    asset.insert('data.assets', validAssets[i].get('id'));
                }
            }
            asset.history.enabled = history;
        };

        redo();

        editor.call('history:add', {
            name: 'asset.' + bundleAsset.get('id') + '.data.assets',
            undo: undo,
            redo: redo
        });

        return len;
    });

    /**
     * Removes the specified assets from the specified bundle asset
     * @param {Observer[]} assets The assets to remove
     * @param {Observer} bundleAsset The bundle asset
     */
    editor.method('assets:bundles:removeAssets', function (assets, bundleAsset) {
        var redo = function () {
            var asset = editor.call('assets:get', bundleAsset.get('id'));
            if (! asset) return;

            var history = asset.history.enabled;
            asset.history.enabled = false;
            for (var i = 0; i < assets.length; i++) {
                asset.removeValue('data.assets', assets[i].get('id'));
            }
            asset.history.enabled = history;
        };

        var undo = function () {
            var asset = editor.call('assets:get', bundleAsset.get('id'));
            if (! asset) return;

            var history = asset.history.enabled;
            asset.history.enabled = false;
            for (var i = 0; i < assets.length; i++) {
                if (isAssetValid(assets[i], asset)) {
                    asset.insert('data.assets', assets[i].get('id'));
                }
            }
            asset.history.enabled = history;
        };

        redo();

        editor.call('history:add', {
            name: 'asset.' + bundleAsset.get('id') + '.data.assets',
            undo: undo,
            redo: redo
        });
    });

    /**
     * Calculates the file size of a bundle Asset by adding up the file
     * sizes of all the assets it references.
     * @param {Observer} The bundle asset
     * @returns {Number} The file size
     */
    editor.method('assets:bundles:calculateSize', function (bundleAsset) {
        var size = 0;
        var assets = bundleAsset.get('data.assets');
        for (var i = 0; i < assets.length; i++) {
            var asset = editor.call('assets:get', assets[i]);
            if (! asset || !asset.has('file.size')) continue;

            size += asset.get('file.size');
        }
        return size;
    });
});


/* launch/viewport-binding-entities.js */
editor.once('load', function() {
    'use strict';

    var app = editor.call('viewport:app');
    if (! app) return; // webgl not available

    var initialEntitiesLoaded = false;

    // entities awaiting parent
    var awaitingParent = { };

    // queue for hierarchy resync
    var awaitingResyncHierarchy = false;

    var resyncHierarchy = function() {
        awaitingResyncHierarchy = false;

        // sync hierarchy
        app.root.syncHierarchy();
    };

    var createEntity = function (obj) {
        var entity = new pc.Entity(obj.get('name'));

        entity.setGuid(obj.get('resource_id'));
        entity.setLocalPosition(obj.get('position.0'), obj.get('position.1'), obj.get('position.2'));
        entity.setLocalEulerAngles(obj.get('rotation.0'), obj.get('rotation.1'), obj.get('rotation.2'));
        entity.setLocalScale(obj.get('scale.0'), obj.get('scale.1'), obj.get('scale.2'));
        entity._enabled = obj.has('enabled') ? obj.get('enabled') : true;

        if (obj.has('labels')) {
            obj.get('labels').forEach(function (label) {
                entity.addLabel(label);
            });
        }

        if (obj.has('tags')) {
            obj.get('tags').forEach(function (tag) {
                entity.tags.add(tag);
            });
        }

        entity.template = obj.get('template');

        return entity;
    };

    var processEntity = function (obj) {
        // create entity
        var entity = createEntity(obj);

        // add components
        var components = obj.json().components;
        for(var key in components)
            app.systems[key].addComponent(entity, components[key]);

        // parenting
        if (! obj.get('parent')) {
            // root
            app.root.addChild(entity);

        } else {
            // get parent
            var parent = editor.call('entities:get', obj.get('parent'));
            if (parent) {
                parent = app.root.findByGuid(parent.get('resource_id'));
            }

            if (! parent) {
                // if parent not available, then await
                if (! awaitingParent[obj.get('parent')])
                    awaitingParent[obj.get('parent')] = [ ];

                // add to awaiting children
                awaitingParent[obj.get('parent')].push(obj);
            } else {
                // if parent available, addChild
                parent.addChild(entity);
            }
        }

        // check if there are awaiting children
        if (awaitingParent[obj.get('resource_id')]) {
            // add all awaiting children
            for(var i = 0; i < awaitingParent[obj.get('resource_id')].length; i++) {
                var awaiting = awaitingParent[obj.get('resource_id')][i];
                entity.addChild(app.root.getByGuid(awaiting.get('resource_id')));
            }

            // delete awaiting queue
            delete awaitingParent[obj.get('resource_id')];
        }

        // queue resync hierarchy
        // done on timeout to allow bulk entity creation
        // without sync after each entity
        if (! awaitingResyncHierarchy) {
            awaitingResyncHierarchy = true;
            setTimeout(resyncHierarchy, 0);
        }

        return entity;
    };

    editor.on('entities:add', function (obj) {
        var sceneLoading = editor.call("isLoadingScene");
        if (! app.root.findByGuid(obj.get('resource_id')) && !sceneLoading) {
            // create entity if it does not exist and all initial entities have loaded
            processEntity(obj);
        }

        // subscribe to changes
        obj.on('*:set', function(path, value) {
            var entity = app.root.findByGuid(obj.get('resource_id'));
            if (! entity)
                return;

            if (path === 'name') {
                entity.name = obj.get('name');

            } else if (path.startsWith('position')) {
                resetPhysics(entity);

            } else if (path.startsWith('rotation')) {
                resetPhysics(entity);

            } else if (path.startsWith('scale')) {
                resetPhysics(entity);

            } else if (path.startsWith('enabled')) {
                entity.enabled = obj.get('enabled');

            } else if (path.startsWith('parent')) {
                var parent = editor.call('entities:get', obj.get('parent'));
                if (parent && parent.entity && entity.parent !== parent.entity)
                    entity.reparent(parent.entity);
            } else if (path === 'components.model.type' && value === 'asset') {
                // WORKAROUND
                // entity deletes asset when switching to primitive, restore it
                // do this in a timeout to allow the model type to change first
                setTimeout(function () {
                    var assetId = obj.get('components.model.asset');
                    if (assetId)
                        entity.model.asset = assetId;
                });
            }
        });

        obj.on('tags:insert', function (value) {
            var entity = app.root.findByGuid(obj.get('resource_id'));
            if (entity) {
                entity.tags.add(value);
            }
        });

        obj.on('tags:remove', function (value) {
            var entity = app.root.findByGuid(obj.get('resource_id'));
            if (entity) {
                entity.tags.remove(value);
            }
        });

        var resetPhysics = function (entity) {
            var pos = obj.get('position');
            var rot = obj.get('rotation');
            var scale = obj.get('scale');

            // if the entity has an element component
            // then only set z and let the rest be handled
            // by the element component (unless autoWidth or autoHeight is true in which case we need to be able to modify position)
            if (! entity.element || entity.element.autoWidth || entity.element.autoHeight) {
                entity.setLocalPosition(pos[0], pos[1], pos[2]);
            } else {
                var localPos = entity.getLocalPosition();
                entity.setLocalPosition(localPos.x, localPos.y, pos[2]);
            }

            entity.setLocalEulerAngles(rot[0], rot[1], rot[2]);
            entity.setLocalScale(scale[0], scale[1], scale[2]);

            if (entity.enabled) {
                if (entity.rigidbody && entity.rigidbody.enabled) {
                    entity.rigidbody.syncEntityToBody();

                    // Reset velocities
                    entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
                    entity.rigidbody.angularVelocity = pc.Vec3.ZERO;
                }
            }
        };

        var reparent = function (child, index) {
            var childEntity = editor.call('entities:get', child);
            if (!childEntity)
                return;

            childEntity = app.root.findByGuid(childEntity.get('resource_id'));
            var parentEntity = app.root.findByGuid(obj.get('resource_id'));

            if (childEntity && parentEntity) {
                if (childEntity.parent)
                    childEntity.parent.removeChild(childEntity);

                // skip any graph nodes
                if (index > 0) {
                    var children = parentEntity.children;
                    for (var i = 0, len = children.length; i < len && index > 0; i++) {
                        if (children[i] instanceof pc.Entity) {
                            index--;
                        }
                    }

                    index = i;
                }

                // re-insert
                parentEntity.insertChild(childEntity, index);
            }
        };

        obj.on('children:insert', reparent);
        obj.on('children:move', reparent);
    });

    editor.on('entities:remove', function (obj) {
        var entity = app.root.findByGuid(obj.get('resource_id'));
        if (entity) {
            entity.destroy();
            editor.call('viewport:render');
        }
    });

    editor.on('entities:load', function () {
        initialEntitiesLoaded = true;
    });
});


/* launch/viewport-binding-components.js */
editor.once('load', function() {
    'use strict';

    var app = editor.call('viewport:app');
    if (! app) return; // webgl not available

    // converts the data to runtime types
    var runtimeComponentData = function (component, data) {
        var result = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                result[key] = editor.call('components:convertValue', component, key, data[key]);
            }
        }

        return result;
    };

    editor.on('entities:add', function (obj) {
        // subscribe to changes
        obj.on('*:set', function(path, value) {
            if (obj._silent || ! path.startsWith('components'))
                return;

            var entity = app.root.findByGuid(obj.get('resource_id'));
            if (! entity)
                return;

            var parts = path.split('.');
            var component = parts[1];
            var property = parts[2];

            if (!entity[component]) {
                if (!property) {
                    // add component
                    var data = runtimeComponentData(component, value);
                    app.systems[component].addComponent(entity, data);

                    // render
                    editor.call('viewport:render');
                }
            } else if (property) {
                // edit component property
                if (component === 'script' && property === 'scripts' && !editor.call('settings:project').get('useLegacyScripts')) {
                    if (parts.length <= 3)
                        return;

                    var script = entity.script[parts[3]];

                    if (parts.length === 4) {
                        // new script
                        var data = obj.get('components.script.scripts.' + parts[3]);
                        entity.script.create(parts[3], data);
                    } else if (script && parts.length === 5 && parts[4] === 'enabled') {
                        // enabled
                        script.enabled = value;
                    } else if (script && parts.length === 6 && parts[4] === 'attributes' && ! pc.createScript.reservedAttributes[parts[5]]) {
                        // set attribute
                        script[parts[5]] = value;
                        // TODO scripts2
                        // check if attribute is new
                    } else if (script && parts.length > 6 && parts[4] === 'attributes' && ! pc.createScript.reservedAttributes[parts[5]]) {
                        // update attribute
                        script[parts[5]] = obj.get('components.script.scripts.' + parts[3] + '.attributes.' + parts[5]);
                    }
                } else {
                    if (component === 'element') {
                        if (property === 'width') {
                            // do not set width for elements with autoWidth or split horizontal anchors
                            if (entity.element.autoWidth || Math.abs(entity.element.anchor.x - entity.element.anchor.z) > 0.001) {
                                return;
                            }
                        } else if (property === 'height') {
                            // do not set height for elements with autoHeight or split vertical anchors
                            if (entity.element.autoHeight || Math.abs(entity.element.anchor.y - entity.element.anchor.w) > 0.001) {
                                return;
                            }
                        }
                    }

                    value = obj.get('components.' + component + '.' + property);
                    var oldValue = entity[component][property];
                    entity[component][property] = editor.call('components:convertValue', component, property, value);
                }
            }
        });


        obj.on('*:unset', function (path) {
            if (obj._silent || ! path.startsWith('components'))
                return;

            var entity = app.root.findByGuid(obj.get('resource_id'));
            if (! entity) return;

            var parts = path.split('.');
            var component = parts[1];
            var property = parts[2];

            if (property) {
                if (component === 'script' && property === 'scripts' && ! editor.call('settings:project').get('useLegacyScripts')) {
                    if (! entity.script || parts.length <= 3)
                        return;

                    var script = entity.script[parts[3]];
                    if (! script)
                        return;

                    if (parts.length === 4) {
                        // remove script
                        entity.script.destroy(parts[3]);
                    } else if (parts.length === 6 && parts[4] === 'attributes' && ! pc.createScript.reservedAttributes[parts[5]]) {
                        // unset attribute
                        delete script[parts[5]];
                        delete script.__attributes[parts[5]];
                    } else if (parts.length > 6 && parts[4] === 'attributes' && ! pc.createScript.reservedAttributes[parts[5]]) {
                        // update attribute
                        script[parts[5]] = obj.get('components.script.scripts.' + parts[3] + '.attributes.' + parts[5]);
                    }
                } else {
                    // edit component property
                    var value = obj.get('components.' + component + '.' + property);
                    entity[component][property] = editor.call('components:convertValue', component, property, value);
                }
            } else if (entity[component]) {
                // remove component
                app.systems[component].removeComponent(entity);
            }
        });

        var setComponentProperty = function (path, value, ind) {
            if (obj._silent || ! path.startsWith('components'))
                return;

            var entity = app.root.findByGuid(obj.get('resource_id'));
            if (! entity) return;

            var parts = path.split('.');
            var component = parts[1];
            var property = parts[2];

            if (property) {
                if (component === 'script') {
                    if (property === 'order') {
                        // update script order
                        entity.script.move(value, ind);
                    } else if (property === 'scripts') {
                        if (! entity.script || parts.length <= 3)
                            return;

                        var script = entity.script[parts[3]];
                        if (! script)
                            return;

                        if (parts.length > 6 && parts[4] === 'attributes' && ! pc.createScript.reservedAttributes[parts[5]]) {
                            // update attribute
                            script[parts[5]] = obj.get('components.script.scripts.' + parts[3] + '.attributes.' + parts[5]);
                        }
                    }
                } else {
                    // edit component property
                    value = obj.get('components.' + component + '.' + property);
                    entity[component][property] = editor.call('components:convertValue', component, property, value);
                }
            }
        };

        obj.on('*:insert', setComponentProperty);
        obj.on('*:remove', setComponentProperty);
        obj.on('*:move', setComponentProperty);
    });
});


/* launch/viewport-binding-assets.js */
editor.once('load', function() {
    'use strict';

    var app = editor.call('viewport:app');
    if (! app) return; // webgl not available

    var regexFrameUpdate = /^data\.frames\.(\d+)/;
    var regexFrameRemove = /^data\.frames\.(\d+)$/;
    var regexI18n = /^i18n\.[^\.]+?$/;

    var attachSetHandler = function (asset) {
        // do only for target assets
        if (asset.get('source'))
            return;

        var timeout;
        var updatedFields = { };

        var onChange = function(path, value) {
            var realtimeAsset = app.assets.get(asset.get('id'));
            var parts = path.split('.');

            updatedFields[parts[0]] = true;
            if (timeout)
                clearTimeout(timeout);

            // do the update in a timeout to avoid rapid
            // updates to the same fields
            timeout = setTimeout(function () {
                for (var key in updatedFields) {
                    var raw = asset.get(key);

                    // do not hot-reload script if it has no `swap` methods already defined
                    if (key === 'file' && asset.get('type') === 'script' && realtimeAsset.data && realtimeAsset.data.scripts) {
                        var swappable = false;

                        for(var script in realtimeAsset.data.scripts) {
                            var scriptType = app.scripts.get(script);
                            if (scriptType && scriptType.prototype.hasOwnProperty('swap')) {
                                swappable = true;
                                break;
                            }
                        }

                        if (! swappable)
                            continue;
                    }

                    // this will trigger the 'update' event on the asset in the engine
                    // handling all resource loading automatically
                    realtimeAsset[key] = raw;
                }

                timeout = null;
            });
        };

        // attach update handler
        asset.on('*:set', function (path, value) {
            // handle i18n changes
            if (regexI18n.test(path)) {
                var parts = path.split('.');
                var realtimeAsset = app.assets.get(asset.get('id'));
                if (realtimeAsset) {
                    realtimeAsset.addLocalizedAssetId(parts[1], value);
                }
            } else if (asset.get('type') === 'textureatlas') {
                // handle texture atlases specifically for better performance
                var realtimeAsset = app.assets.get(asset.get('id'));
                if (! realtimeAsset) return;

                var match = path.match(regexFrameUpdate);
                if (match) {
                    var frameKey = match[1];
                    var frame = asset.get('data.frames.' + frameKey);
                    if (realtimeAsset.resource) {
                        if (frame) {
                            realtimeAsset.resource.setFrame(frameKey, {
                                rect: new pc.Vec4(frame.rect),
                                pivot: new pc.Vec2(frame.pivot),
                                border: new pc.Vec4(frame.border)
                            });
                        }
                    }

                    if (! realtimeAsset.data.frames) {
                        realtimeAsset.data.frames = {};
                    }

                    realtimeAsset.data.frames[frameKey] = frame;
                }
            } else {
                // everything else
                onChange(path, value);
            }
        });
        asset.on('*:unset', function (path, value) {
            // handle deleting i18n
            if (regexI18n.test(path)) {
                var realtimeAsset = app.assets.get(asset.get('id'));
                if (realtimeAsset) {
                    var parts = path.split('.');
                    realtimeAsset.removeLocalizedAssetId(parts[1]);
                }

            } else if (asset.get('type') === 'textureatlas') {
                // handle deleting frames from texture atlas
                var realtimeAsset = app.assets.get(asset.get('id'));
                if (! realtimeAsset) return;

                var match = path.match(regexFrameRemove);
                if (match) {
                    var frameKey = match[1];
                    if (realtimeAsset.resource) {
                        realtimeAsset.resource.removeFrame(frameKey);
                    }

                    if (realtimeAsset.data.frames && realtimeAsset.data.frames[frameKey]) {
                        delete realtimeAsset.data.frames[frameKey];
                    }

                    editor.call('viewport:render');
                }
            } else {
                // everything else
                onChange(path, value);
            }

        });

        // handle changing sprite frame keys
        if (asset.get('type') === 'sprite') {
            var onFrameKeys = function () {
                var realtimeAsset = app.assets.get(asset.get('id'));
                if (realtimeAsset) {
                    if (realtimeAsset.resource) {
                        realtimeAsset.resource.frameKeys = asset.get('data.frameKeys');
                    }

                    realtimeAsset.data.frameKeys = asset.get('data.frameKeys');
                }
            };

            asset.on('data.frameKeys:set', onFrameKeys);
            asset.on('data.frameKeys:insert', onFrameKeys);
            asset.on('data.frameKeys:remove', onFrameKeys);
            asset.on('data.frameKeys:move', onFrameKeys);
        }

        // tags add
        asset.on('tags:insert', function(tag) {
            app.assets.get(asset.get('id')).tags.add(tag);
        });
        // tags remove
        asset.on('tags:remove', function(tag) {
            app.assets.get(asset.get('id')).tags.remove(tag);
        });
    };

    // after all initial assets are loaded...
    editor.on('assets:load', function () {
        var assets = editor.call('assets:list');
        assets.forEach(attachSetHandler);

        // add assets to asset registry
        editor.on('assets:add', function (asset) {
            // do only for target assets
            if (asset.get('source'))
                return;

            // raw json data
            var assetJson = asset.json();

            // engine data
            var data = {
                id: parseInt(assetJson.id, 10),
                name: assetJson.name,
                tags: assetJson.tags,
                file: assetJson.file ? {
                    filename: assetJson.file.filename,
                    url: assetJson.file.url,
                    hash: assetJson.file.hash,
                    size: assetJson.file.size,
                    variants: assetJson.file.variants || null
                } : null,
                data: assetJson.data,
                type: assetJson.type
            };

            // create and add to registry
            var newAsset = new pc.Asset(data.name, data.type, data.file, data.data);
            newAsset.id = parseInt(assetJson.id, 10);
            app.assets.add(newAsset);

            // tags
            newAsset.tags.add(data.tags);

            // i18n
            if (assetJson.i18n) {
                for (var locale in assetJson.i18n) {
                    newAsset.addLocalizedAssetId(locale, assetJson.i18n[locale]);
                }
            }

            attachSetHandler(asset);
        });

        // remove assets from asset registry
        editor.on('assets:remove', function (asset) {
            var realtimeAsset = app.assets.get(asset.get('id'));
            if (realtimeAsset)
                app.assets.remove(realtimeAsset);
        });
    });
});


/* launch/viewport-binding-scene.js */
editor.once('load', function() {
    'use strict';

    editor.on('sceneSettings:load', function (sceneSettings) {
        var app = editor.call('viewport:app');
        if (! app) return; // webgl not available

        var updating;

        // queue settings apply
        var queueApplySettings = function() {
            if (updating)
                return;

            updating = true;

            setTimeout(applySettings, 1000 / 30);
        };

        // apply settings
        var applySettings = function() {
            updating = false;

            app.applySceneSettings(sceneSettings.json());
        };

        // on settings change
        sceneSettings.on('*:set', queueApplySettings);

        // initialize
        queueApplySettings();
    });

});


/* launch/viewport-scene-handler.js */
editor.once('load', function() {
    'use strict';

    var app = editor.call('viewport:app');
    if (! app) return; // webgl not available

    app.loader.removeHandler("scene");
    app.loader.removeHandler("hierarchy");
    app.loader.removeHandler("scenesettings");

    var loadSceneByItemId = function (itemId, callback) {
        // Get a specific scene from the server and pass result to callback
        Ajax({
            url: '{{url.api}}/scenes/' + itemId + '?branchId=' + config.self.branch.id,
            cookies: true
        })
        .on('error', function (status, data) {
            if (callback) {
                callback(data);
            }
        })
        .on('load', function (status, data) {
            if (callback) {
                callback(null, data);
            }
        });
    };

    var SharedSceneHandler = function (app, handler) {
        this._app = app;
        this._handler = handler;
    };

    SharedSceneHandler.prototype = {
        load: function (url, callback, settingsOnly) {
            var id = parseInt(url.replace("/api/", "").replace(".json", ""));

            if (typeof(id) === "number") {
                // load scene from server to get its unique id
                loadSceneByItemId(id, function (err, scene) {
                    if (err) {
                        return callback(err);
                    }

                    editor.call('loadScene', scene.uniqueId, callback, settingsOnly);
                });
            } else {
                this._handler.load(url, callback);
            }
        },

        open: function (url, data) {
            return this._handler.open(url, data);
        },

        patch: function (asset, assets) {
            return this._handler.patch(asset, assets);
        }
    };
    app.loader.addHandler("scene", new SharedSceneHandler(app, new pc.SceneHandler(app)));


    var SharedHierarchyHandler = function (app, handler) {
        this._app = app;
        this._handler = handler;
    };

    SharedHierarchyHandler.prototype = {
        load: function (url, callback, settingsOnly) {
            var id = parseInt(url.replace("/api/", "").replace(".json", ""));
            if (typeof(id) === "number") {
                loadSceneByItemId(id, function (err, scene) {
                    if (err) {
                        return callback(err);
                    }

                    editor.call('loadScene', scene.uniqueId, function (err, scene) {
                        // do this in a timeout so that any errors raised while
                        // initializing scripts are not swallowed by the connection error handler
                        setTimeout(function () {
                            callback(err, scene);
                        });
                    }, settingsOnly);

                });

            } else {
                // callback("Invalid URL: can't extract scene id.")
                this._handler.load(url, callback);
            }
        },

        open: function (url, data) {
            return this._handler.open(url, data);
        },

        patch: function (asset, assets) {
            return this._handler.patch(asset, assets);
        }
    };
    app.loader.addHandler("hierarchy", new SharedHierarchyHandler(app, new pc.HierarchyHandler(app)));

    var SharedSceneSettingsHandler = function (app, handler) {
        this._app = app;
        this._handler = handler;
    };

    SharedSceneSettingsHandler.prototype = {
        load: function (url, callback) {
            if (typeof url === 'string') {
                url = {
                    load: url,
                    original: url
                };
            }

            var id = parseInt(url.original.replace("/api/", "").replace(".json", ""));
            if (typeof(id) === "number") {
                loadSceneByItemId(id, function (err, scene) {
                    if (err) {
                        return callback(err);
                    }

                    editor.call('loadScene', scene.uniqueId, function (err, scene) {
                        callback(err, scene);
                    }, true);
                });

            } else {
                // callback("Invalid URL: can't extract scene id.")
                this._handler.load(url, callback);
            }
        },

        open: function (url, data) {
            return this._handler.open(url, data);
        },

        patch: function (asset, assets) {
            return this._handler.patch(asset, assets);
        }
    };
    app.loader.addHandler("scenesettings", new SharedSceneSettingsHandler(app, new pc.SceneSettingsHandler(app)));
});


/* launch/viewport-connection.js */
editor.once('load', function() {
    'use strict';

    var timeout;

    var icon = document.createElement('img');
    icon.classList.add('connecting');
    icon.src = 'https://s3-eu-west-1.amazonaws.com/static.playcanvas.com/platform/images/loader_transparent.gif';
    icon.width=32;
    icon.height=32;

    var hidden = true;

    editor.on('realtime:connected', function () {
        if (!hidden) {
            document.body.removeChild(icon);
            hidden = true;
        }
    });

    editor.on('realtime:disconnected', function () {
        if (hidden) {
            document.body.appendChild(icon);
            hidden = false;
        }
    });

    editor.on('realtime:error', function (err) {
        console.error(err);
    })
});


/* launch/assets.js */
editor.once('load', function () {
    'use strict';

    var uniqueIdToItemId = {};

    var assets = new ObserverList({
        index: 'id'
    });

    function createLatestFn(id) {
        // function to get latest version of asset observer
        return function () {
            return assets.get(id);
        };
    }

    // list assets
    editor.method('assets:list', function () {
        return assets.array();
    });

    // allow adding assets
    editor.method('assets:add', function (asset) {
        uniqueIdToItemId[asset.get('uniqueId')] = asset.get('id');

        // function to get latest version of asset observer
        asset.latestFn = createLatestFn(asset.get('id'));

        assets.add(asset);
    });

    // allow removing assets
    editor.method('assets:remove', function (asset) {
        assets.remove(asset);
        asset.destroy();
    });

    // remove all assets
    editor.method('assets:clear', function () {
        assets.clear();
        uniqueIdToItemId = {};
    });

    // get asset by item id
    editor.method('assets:get', function (id) {
        return assets.get(id);
    });

    // get asset by unique id
    editor.method('assets:getUnique', function (uniqueId) {
        var id = uniqueIdToItemId[uniqueId];
        return id ? assets.get(id) : null;
    });

    // find assets by function
    editor.method('assets:find', function (fn) {
        return assets.find(fn);
    });

    // find one asset by function
    editor.method('assets:findOne', function (fn) {
        return assets.findOne(fn);
    });

    // publish added asset
    assets.on('add', function (asset) {
        editor.emit('assets:add[' + asset.get('id') + ']', asset);
        editor.emit('assets:add', asset);
    });

    // publish remove asset
    assets.on('remove', function (asset) {
        editor.emit('assets:remove', asset);
        delete uniqueIdToItemId[asset.get('id')];
    });
});


/* launch/assets-sync.js */
editor.once('load', function () {
    'use strict';

    var app = editor.call('viewport:app');
    if (! app) return; // webgl not available

    var settings = editor.call('settings:project');
    var docs = { };

    var assetNames = { };

    var queryParams = (new pc.URI(window.location.href)).getQuery();
    var concatenateScripts = (queryParams.concatenateScripts === 'true');
    var concatenatedScriptsUrl = '/projects/' + config.project.id + '/concatenated-scripts/scripts.js?branchId=' + config.self.branch.id;
    var useBundles = (queryParams.useBundles !== 'false');

    editor.method('loadAsset', function (uniqueId, callback) {
        var connection = editor.call('realtime:connection');

        var doc = connection.get('assets', '' + uniqueId);

        docs[uniqueId] = doc;

        // error
        doc.on('error', function (err) {
            if (connection.state === 'connected') {
                console.log(err);
                return;
            }

            editor.emit('realtime:assets:error', err);
        });

        // ready to sync
        doc.on('load', function () {
            var assetData = doc.data;
            if (! assetData) {
                console.error('Could not load asset: ' + uniqueId);
                doc.unsubscribe();
                doc.destroy();
                return callback && callback();
            }

            // notify of operations
            doc.on('op', function (ops, local) {
                if (local) return;

                for (var i = 0; i < ops.length; i++) {
                    editor.emit('realtime:op:assets', ops[i], uniqueId);
                }
            });

            assetData.id = parseInt(assetData.item_id, 10);
            assetData.uniqueId = parseInt(uniqueId, 10);

            // delete unecessary fields
            delete assetData.item_id;
            delete assetData.branch_id;

            if (assetData.file) {
                if (concatenateScripts && assetData.type === 'script' && assetData.preload && !assetData.data.loadingType) {
                    assetData.file.url = concatenatedScriptsUrl;
                } else {
                    assetData.file.url = getFileUrl(assetData.path, assetData.id, assetData.revision, assetData.file.filename);
                }

                if (assetData.file.variants) {
                    for (var key in assetData.file.variants) {
                        assetData.file.variants[key].url = getFileUrl(assetData.path, assetData.id, assetData.revision, assetData.file.variants[key].filename);
                    }
                }
            }

            var asset = editor.call('assets:get', assetData.id);
            // asset can exist if we are reconnecting to c3
            var assetExists = !!asset;

            if (!assetExists) {
                var options = null;

                // allow duplicate values in data.frameKeys of sprite asset
                if (assetData.type === 'sprite') {
                    options = {
                        pathsWithDuplicates: ['data.frameKeys']
                    };
                }

                asset = new Observer(assetData, options);
                editor.call('assets:add', asset);

                var _asset = asset.asset = new pc.Asset(assetData.name, assetData.type, assetData.file, assetData.data);
                _asset.id = parseInt(assetData.id, 10);
                _asset.preload = assetData.preload ? assetData.preload : false;

                // tags
                _asset.tags.add(assetData.tags);

                // i18n
                if (assetData.i18n) {
                    for (var locale in assetData.i18n) {
                        _asset.addLocalizedAssetId(locale, assetData.i18n[locale]);
                    }
                }

                if (asset.get('type') !== 'script' || ! asset.get('preload')) {
                    // app.assets.add(_asset);
                }
            } else {
                for (var key in assetData)
                    asset.set(key, assetData[key]);
            }

            if (callback)
                callback(asset);
        });

        // subscribe for realtime events
        doc.subscribe();
    });

    var createEngineAsset = function (asset, wasmAssetIds) {
        // if engine asset already exists return
        if (app.assets.get(asset.get('id'))) return;

        // handle bundle assets
        if (useBundles && asset.get('type') === 'bundle') {
            var sync = asset.sync.enabled;
            asset.sync.enabled = false;

            // get the assets in this bundle
            // that have a file
            var assetsInBundle = asset.get('data.assets').map(function (id) {
                return editor.call('assets:get', id);
            }).filter(function (asset) {
                return asset && asset.has('file.filename');
            });

            if (assetsInBundle.length) {
                // set the main filename and url for the bundle asset
                asset.set('file', {});
                asset.set('file.filename', asset.get('name') + '.tar');
                asset.set('file.url', getFileUrl(asset.get('path'), asset.get('id'), asset.get('revision'), asset.get('file.filename')));

                // find assets with variants
                var assetsWithVariants = assetsInBundle.filter(function (asset) {
                    return asset.has('file.variants');
                });

                ['dxt', 'etc1', 'etc2', 'pvr', 'basis'].forEach(function (variant) {
                    // search for assets with the specified variants and if some
                    // exist then generate the variant file
                    for (var i = 0, len = assetsWithVariants.length; i < len; i++) {
                        if (assetsWithVariants[i].has('file.variants.' + variant)) {
                            if (! asset.has('file.variants')) {
                                asset.set('file.variants', {});
                            }

                            var filename = asset.get('name') + '-' + variant + '.tar';
                            asset.set('file.variants.' + variant, {
                                filename: filename,
                                url: getFileUrl(asset.get('path'), asset.get('id'), asset.get('revision'), filename)

                            });
                            return;
                        }
                    }
                });
            }

            asset.sync.enabled = sync;
        }

        if (useBundles && asset.get('type') !== 'bundle') {
            // if the asset is in a bundle then replace its url with the url that it's supposed to have in the bundle
            if (editor.call('assets:bundles:containAsset', asset.get('id'))) {
                var file = asset.get('file');
                if (file) {
                    var sync = asset.sync.enabled;
                    asset.sync.enabled = false;

                    asset.set('file.url', getFileUrl(asset.get('path'), asset.get('id'), asset.get('revision'), file.filename, true));
                    if (file.variants) {
                        for (var key in file.variants) {
                            asset.set('file.variants.' + key + '.url', getFileUrl(asset.get('path'), asset.get('id'), asset.get('revision'), file.variants[key].filename, true));
                        }
                    }

                    asset.sync.enabled = sync;
                }
            }
        }

        // create the engine asset
        var assetData = asset.json();
        var engineAsset = asset.asset = new pc.Asset(assetData.name, assetData.type, assetData.file, assetData.data);
        engineAsset.id = parseInt(assetData.id, 10);
        engineAsset.preload = assetData.preload ? assetData.preload : false;
        if (assetData.type === 'script' &&
            assetData.data &&
            assetData.data.loadingType > 0) {
            // disable load on script before/after engine scripts
            engineAsset.loaded = true;
        } else if (wasmAssetIds.hasOwnProperty(assetData.id)) {
            // disable load on module assets
            engineAsset.loaded = true;
        }

        // tags
        engineAsset.tags.add(assetData.tags);

        // i18n
        if (assetData.i18n) {
            for (var locale in assetData.i18n) {
                engineAsset.addLocalizedAssetId(locale, assetData.i18n[locale]);
            }
        }

        // add to the asset registry
        app.assets.add(engineAsset);
    };

    var onLoad = function (data) {
        editor.call('assets:progress', 0.5);

        var total = data.length;
        if (!total) {
            editor.call('assets:progress', 1);
            editor.emit('assets:load');
        }

        var count = 0;
        var scripts = { };

        var legacyScripts = settings.get('useLegacyScripts');

        // get the set of wasm asset ids i.e. the wasm module ids and linked glue/fallback
        // script ids. the list is used to suppress the asset system from the loading
        // the scripts again.
        var getWasmAssetIds = function() {
            var result = { };
            editor.call('assets:list')
            .forEach(function(a) {
                var asset = a.asset;
                if (asset.type !== 'wasm' || !asset.data) {
                    return;
                }
                result[asset.id] = 1;
                if (asset.data.glueScriptId) {
                    result[asset.data.glueScriptId] = 1;
                }
                if (asset.data.fallbackScriptId) {
                    result[asset.data.fallbackScriptId] = 1;
                }
            });
            return result;
        };

        var loadScripts = function (wasmAssetIds) {
            var order = settings.get('scripts');

            for (var i = 0; i < order.length; i++) {
                if (! scripts[order[i]])
                    continue;

                var asset = editor.call('assets:get', order[i]);
                if (asset) {
                    createEngineAsset(asset, wasmAssetIds);
                }
            }
        };

        var load = function (uniqueId) {
            editor.call('loadAsset', uniqueId, function (asset) {
                count++;
                editor.call('assets:progress', (count / total) * 0.5 + 0.5);

                if (! legacyScripts && asset && asset.get('type') === 'script')
                    scripts[asset.get('id')] = asset;

                if (count === total) {
                    var wasmAssetIds = getWasmAssetIds();

                    if (! legacyScripts)
                        loadScripts(wasmAssetIds);

                    // sort assets by script first and then by bundle
                    var assets = editor.call('assets:list');
                    assets.sort(function (a, b) {
                        var typeA = a.get('type');
                        var typeB = b.get('type');
                        if (typeA === 'script' && typeB !== 'script') {
                            return -1;
                        }
                        if (typeB === 'script' && typeA !== 'script') {
                            return 1;
                        }
                        if (typeA === 'bundle' && typeB !== 'bundle') {
                            return -1;
                        }
                        if (typeB === 'bundle' && typeA !== 'bundle') {
                            return 1;
                        }
                        return 0;
                    });

                    // create runtime asset for every asset observer
                    assets.forEach(function(a) { createEngineAsset(a, wasmAssetIds); });

                    editor.call('assets:progress', 1);
                    editor.emit('assets:load');
                }
            });
        };

        var connection = editor.call('realtime:connection');

        // do bulk subsribe in batches of 'batchSize' assets
        var batchSize = 256;
        var startBatch = 0;

        while (startBatch < total) {
            // start bulk subscribe
            connection.startBulk();
            for (var i = startBatch; i < startBatch + batchSize && i < total; i++) {
                assetNames[data[i].id] = data[i].name;
                load(data[i].uniqueId);
            }
            // end bulk subscribe and send message to server
            connection.endBulk();

            startBatch += batchSize;
        }
    };

    // load all assets
    editor.on('realtime:authenticated', function () {
        Ajax({
            url: '{{url.api}}/projects/{{project.id}}/assets?branchId={{self.branch.id}}&view=launcher',
            auth: true,
            cookies: true
        })
        .on('load', function (status, data) {
            onLoad(data);
        })
        .on('progress', function (progress) {
            editor.call('assets:progress', 0.1 + progress * 0.4);
        })
        .on('error', function (status, evt) {
            console.log(status, evt);
        });
    });

    editor.call('assets:progress', 0.1);

    editor.on('assets:remove', function (asset) {
        var id = asset.get('uniqueId');
        if (docs[id]) {
            docs[id].unsubscribe();
            docs[id].destroy();
            delete docs[id];
        }
    });

    var getFileUrl = function (folders, id, revision, filename, useBundles) {
        if (useBundles) {
            // if we are using bundles then this URL should be the URL
            // in the tar archive
            return ['files/assets', id, revision, filename].join('/');
        }

        var path = '';
        for (var i = 0; i < folders.length; i++) {
            var folder = editor.call('assets:get', folders[i]);
            if (folder) {
                path += encodeURIComponent(folder.get('name')) + '/';
            } else {
                path += (assetNames[folders[i]] || 'unknown') + '/';
            }
        }
        return 'assets/files/' + path + encodeURIComponent(filename) + '?id=' + id + '&branchId=' + config.self.branch.id;
    };

    // hook sync to new assets
    editor.on('assets:add', function (asset) {
        if (asset.sync)
            return;

        asset.sync = new ObserverSync({
            item: asset
        });

        var setting = false;

        asset.on('*:set', function (path, value) {
            if (setting || ! path.startsWith('file') || path.endsWith('.url') || ! asset.get('file'))
                return;

            setting = true;

            var parts = path.split('.');

            // NOTE: if we have concatenated scripts then this will reset the file URL to the original URL and not the
            // concatenated URL which is what we want for hot reloading
            if ((parts.length === 1 || parts.length === 2) && parts[1] !== 'variants') {
                asset.set('file.url', getFileUrl(asset.get('path'), asset.get('id'), asset.get('revision'), asset.get('file.filename')));
            } else if (parts.length >= 3 && parts[1] === 'variants') {
                var format = parts[2];
                asset.set('file.variants.' + format + '.url', getFileUrl(asset.get('path'), asset.get('id'), asset.get('revision'), asset.get('file.variants.' + format + '.filename')));
            }

            setting = false;
        });
    });

    // server > client
    editor.on('realtime:op:assets', function (op, uniqueId) {
        var asset = editor.call('assets:getUnique', uniqueId);
        if (asset) {
            asset.sync.write(op);
        } else {
            console.error('realtime operation on missing asset: ' + op.p[1]);
        }
    });
});


/* launch/assets-messenger.js */
editor.once('load', function() {
    'use strict';

    var validRuntimeAssets = {
        'material': 1, 'model': 1, 'cubemap': 1, 'text': 1, 'json': 1, 'html': 1, 'css': 1, 'script': 1, 'texture': 1, 'textureatlas': 1, 'sprite': 1
    };

    var create = function(data) {
        if (data.asset.source || data.asset.status !== 'complete' && ! validRuntimeAssets.hasOwnProperty(data.asset.type))
            return;

        var uniqueId = parseInt(data.asset.id, 10);
        if (! uniqueId)
            return;

        editor.call('loadAsset', uniqueId);
    };

    // create or update
    editor.on('messenger:asset.new', create);

    // remove
    editor.on('messenger:asset.delete', function(data) {
        var asset = editor.call('assets:getUnique', data.asset.id);
        if (! asset) return;
        editor.call('assets:remove', asset);
    });

    // remove multiple
    editor.on('messenger:assets.delete', function(data) {
        for (var i = 0; i < data.assets.length; i++) {
            var asset = editor.call('assets:getUnique', parseInt(data.assets[i], 10));
            if (! asset) continue;
            editor.call('assets:remove', asset);
        }
    });
});


/* launch/scene-settings.js */
editor.once('load', function() {
    'use strict';

    var sceneSettings = new Observer();

    editor.once('scene:raw', function(data) {
        sceneSettings.patch(data.settings);

        editor.emit("sceneSettings:load", sceneSettings);
    });

    editor.method('sceneSettings', function () {
        return sceneSettings;
    });
});


/* launch/scene-settings-sync.js */
editor.once('load', function() {
    'use strict';

    editor.on('sceneSettings:load', function(settings) {
        if (settings.sync) return;

        settings.sync = new ObserverSync({
            item: settings,
            prefix: [ 'settings' ]
        });

        // client > server
        settings.sync.on('op', function(op) {
            editor.call('realtime:op', op);
        });

        // server > client
        editor.on('realtime:op:settings', function(op) {
            settings.sync.write(op);
        });
    });
});


/* launch/sourcefiles.js */
editor.once('load', function() {
    'use strict';

    if (! editor.call('settings:project').get('useLegacyScripts'))
        return;


    var onLoad = function (data) {
        var i = 0;
        var l = data.result.length;

        var filenames = data.result.map(function (item) {
            return item.filename;
        });

        editor.emit("sourcefiles:load", filenames);
    };

    // load scripts
    Ajax({
        url: '{{url.home}}{{project.repositoryUrl}}',
        cookies: true,
        auth: true
    })
    .on('load', function(status, data) {
        onLoad(data);
    })
    .on('error', function(status, evt) {
        console.log(status, evt);
        editor.emit("sourcefiles:load", []);
    });
});


/* launch/load.js */
editor.once('load', function() {
    'use strict';

    var auth = false;
    var socket, connection;
    var data;
    var reconnectAttempts = 0;
    var reconnectInterval = 1;

    editor.method('realtime:connection', function () {
        return connection;
    });

    var connect = function () {
        if (reconnectAttempts > 8) {
            editor.emit('realtime:cannotConnect');
            return;
        }

        reconnectAttempts++;
        editor.emit('realtime:connecting', reconnectAttempts);

        var shareDbMessage = connection.socket.onmessage;

        connection.socket.onmessage = function(msg) {
            try {
                if (msg.data.startsWith('auth')) {
                    if (!auth) {
                        auth = true;
                        data = JSON.parse(msg.data.slice(4));

                        editor.emit('realtime:authenticated');
                    }
                } else if (! msg.data.startsWith('permissions') && ! msg.data.startsWith('chat') && ! msg.data.startsWith('selection') && ! msg.data.startsWith('whoisonline') && ! msg.data.startsWith('fs:')) {
                    shareDbMessage(msg);
                }
            } catch (e) {
                console.error(e);
            }

        };

        connection.on('connected', function() {
            reconnectAttempts = 0;
            reconnectInterval = 1;

            this.socket.send('auth' + JSON.stringify({
                timeout: false
            }));

            editor.emit('realtime:connected');
        });

        connection.on('error', function(msg) {
            editor.emit('realtime:error', msg);
        });

        var onConnectionClosed = connection.socket.onclose;
        connection.socket.onclose = function (reason) {
            auth = false;

            editor.emit('realtime:disconnected', reason);
            onConnectionClosed(reason);

            // try to reconnect after a while
            editor.emit('realtime:nextAttempt', reconnectInterval);

            if (editor.call('visibility')) {
                setTimeout(reconnect, reconnectInterval * 1000);
            } else {
                editor.once('visible', reconnect);
            }

            reconnectInterval++;
        };
    };

    var reconnect = function () {
        // create new socket...
        socket = new WebSocket(config.url.realtime.http);
        // ... and new sharedb connection
        connection = new window.share.Connection(socket);
        // connect again
        connect();
    };

    if (editor.call('visibility')) {
        reconnect();
    } else {
        editor.once('visible', reconnect);
    }
});


/* launch/scene-loading.js */
editor.once('load', function () {
    'use strict';

    // cache
    var loaded = {};
    var isLoading = false;
    var loadScene = function (id, callback, settingsOnly) {
        if (loaded[id]) {
            if (callback)
                callback(null, loaded[id].data);

            return;
        }

        isLoading = true;

        var connection = editor.call('realtime:connection');
        var scene = connection.get('scenes', '' + id);

        // error
        scene.on('error', function (err) {
            if (callback)
                callback(new Error(err));
        });

        // ready to sync
        scene.on('load', function () {
            // cache loaded scene for any subsequent load requests
            loaded[id] = scene;

            // notify of operations
            scene.on('op', function (ops, local) {
                if (local)
                    return;

                for (var i = 0; i < ops.length; i++) {
                    var op = ops[i];

                    // console.log('in: [ ' + Object.keys(op).filter(function(i) { return i !== 'p' }).join(', ') + ' ]', op.p.join('.'));

                    if (op.p[0]) {
                        editor.emit('realtime:op:' + op.p[0], op);
                    }
                }
            });

            // notify of scene load
            var snapshot = scene.data;
            if (settingsOnly !== true) {
                editor.emit('scene:raw', snapshot);
            }
            if (callback) {
                callback(null, snapshot);
            }

            isLoading = false;
        });

        // subscribe for realtime events
        scene.subscribe();
    };

    editor.method('loadScene', loadScene);
    editor.method('isLoadingScene', function () {
        return isLoading;
    });

    editor.on('realtime:authenticated', function () {
        var startedLoading = false;

        // if we are reconnecting try to reload
        // all scenes that we've already loaded
        for (var id in loaded) {
            startedLoading = true;
            loaded[id].destroy();
            delete loaded[id];

            editor.call('loadScene', id);
        }

        // if no scenes have been loaded at
        // all then we are initializing
        // for the first time so load the main scene
        if (! startedLoading) {
            editor.call('loadScene', config.scene.uniqueId);
        }
    });
});


