/* constants.js */
var DEFAULT_CULLING_MASK = 0xffffffff;
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
var FITTING_STRETCH = 1;
var FITTING_SHRINK = 2;
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
var utils = {};

// utils.deepCopy
utils.deepCopy = function deepCopy(data) {
  if (data == null || typeof data !== "object") return data;

  if (data instanceof Array) {
    var arr = [];
    for (var i = 0; i < data.length; i++) {
      arr[i] = deepCopy(data[i]);
    }
    return arr;
  } else {
    var obj = {};
    for (var key in data) {
      if (data.hasOwnProperty(key)) obj[key] = deepCopy(data[key]);
    }
    return obj;
  }
};

utils.isMobile = function () {
  return /Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent);
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
  properties.forEach((property) => {
    Object.defineProperty(targetClass.prototype, property, {
      get: function () {
        return this[memberName][property];
      },
      set: function (value) {
        this[memberName][property] = value;
      },
    });
  });
};

// String.startsWith
if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, "startsWith", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (str) {
      var that = this;
      var ceil = str.length;
      for (var i = 0; i < ceil; i++) if (that[i] !== str[i]) return false;
      return true;
    },
  });
}

// String.endsWith polyfill
if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, "endsWith", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (str) {
      var that = this;
      for (var i = 0, ceil = str.length; i < ceil; i++)
        if (that[i + that.length - ceil] !== str[i]) return false;
      return true;
    },
  });
}

// Appends query parameter to string (supposedly the string is a URL)
// automatically figuring out if the separator should be ? or &.
// Example: url.appendQuery('t=123').appendQuery('q=345');
if (!String.prototype.appendQuery) {
  Object.defineProperty(String.prototype, "appendQuery", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (queryParameter) {
      var separator = this.indexOf("?") !== -1 ? "&" : "?";
      return this + separator + queryParameter;
    },
  });
}

// element.classList.add polyfill
(function () {
  /*global DOMTokenList */
  var dummy = document.createElement("div"),
    dtp = DOMTokenList.prototype,
    toggle = dtp.toggle,
    add = dtp.add,
    rem = dtp.remove;

  dummy.classList.add("class1", "class2");

  // Older versions of the HTMLElement.classList spec didn't allow multiple
  // arguments, easy to test for
  if (!dummy.classList.contains("class2")) {
    dtp.add = function () {
      Array.prototype.forEach.call(arguments, add.bind(this));
    };
    dtp.remove = function () {
      Array.prototype.forEach.call(arguments, rem.bind(this));
    };
  }
})();

var bytesToHuman = function (bytes) {
  if (isNaN(bytes) || bytes === 0) return "0 B";
  var k = 1000;
  var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
};

// todo move this into proper library

// replace the oldExtension in a path with the newExtension
// return the new path
// oldExtension and newExtension should have leading period
var swapExtension = function (path, oldExtension, newExtension) {
  while (path.indexOf(oldExtension) >= 0) {
    path = path.replace(oldExtension, newExtension);
  }
  return path;
};

/* array.js */
Object.defineProperty(Array.prototype, "equals", {
  enumerable: false,
  value: function (array) {
    if (!array) return false;

    if (this.length !== array.length) return false;

    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] instanceof Array && array[i] instanceof Array) {
        if (!this[i].equals(array[i])) return false;
      } else if (this[i] !== array[i]) {
        return false;
      }
    }
    return true;
  },
});

Object.defineProperty(Array.prototype, "match", {
  enumerable: false,
  value: function (pattern) {
    if (this.length !== pattern.length) return;

    for (var i = 0, l = this.length; i < l; i++) {
      if (pattern[i] !== "*" && pattern[i] !== this[i]) return false;
    }

    return true;
  },
});

Object.defineProperty(Array.prototype, "binaryIndexOf", {
  enumerable: false,
  value: function (b) {
    var min = 0;
    var max = this.length - 1;
    var cur;
    var a;

    while (min <= max) {
      cur = Math.floor((min + max) / 2);
      a = this[cur];

      if (a < b) {
        min = cur + 1;
      } else if (a > b) {
        max = cur - 1;
      } else {
        return cur;
      }
    }

    return -1;
  },
});

/* observer.js */
("use strict");

function Observer(data, options) {
  Events.call(this);
  options = options || {};

  this._destroyed = false;
  this._path = "";
  this._keys = [];
  this._data = {};

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
  this._parentPath = options.parentPath || "";
  this._parentField = options.parentField || null;
  this._parentKey = options.parentKey || null;

  this._latestFn = options.latestFn || null;

  this._silent = false;

  var propagate = function (evt) {
    return function (path, arg1, arg2, arg3) {
      if (!this._parent) return;

      var key = this._parentKey;
      if (!key && this._parentField instanceof Array) {
        key = this._parentField.indexOf(this);

        if (key === -1) return;
      }

      path = this._parentPath + "." + key + "." + path;

      var state;
      if (this._silent) state = this._parent.silence();

      this._parent.emit(path + ":" + evt, arg1, arg2, arg3);
      this._parent.emit("*:" + evt, path, arg1, arg2, arg3);

      if (this._silent) this._parent.silenceRestore(state);
    };
  };

  // propagate set
  this.on("*:set", propagate("set"));
  this.on("*:unset", propagate("unset"));
  this.on("*:insert", propagate("insert"));
  this.on("*:remove", propagate("remove"));
  this.on("*:move", propagate("move"));
}
Observer.prototype = Object.create(Events.prototype);

Observer.prototype.silence = function () {
  this._silent = true;

  // history hook to prevent array values to be recorded
  var historyState = this.history && this.history.enabled;
  if (historyState) this.history.enabled = false;

  // sync hook to prevent array values to be recorded as array root already did
  var syncState = this.sync && this.sync.enabled;
  if (syncState) this.sync.enabled = false;

  return [historyState, syncState];
};

Observer.prototype.silenceRestore = function (state) {
  this._silent = false;

  if (state[0]) this.history.enabled = true;

  if (state[1]) this.sync.enabled = true;
};

Observer.prototype._prepare = function (target, key, value, silent, remote) {
  var self = this;
  var state;
  var path = (target._path ? target._path + "." : "") + key;
  var type = typeof value;

  target._keys.push(key);

  if (type === "object" && value instanceof Array) {
    target._data[key] = value.slice(0);

    for (var i = 0; i < target._data[key].length; i++) {
      if (typeof target._data[key][i] === "object" && target._data[key][i] !== null) {
        if (target._data[key][i] instanceof Array) {
          target._data[key][i].slice(0);
        } else {
          target._data[key][i] = new Observer(target._data[key][i], {
            parent: this,
            parentPath: path,
            parentField: target._data[key],
            parentKey: null,
          });
        }
      } else {
        state = this.silence();
        this.emit(path + "." + i + ":set", target._data[key][i], null, remote);
        this.emit("*:set", path + "." + i, target._data[key][i], null, remote);
        this.silenceRestore(state);
      }
    }

    if (silent) state = this.silence();

    this.emit(path + ":set", target._data[key], null, remote);
    this.emit("*:set", path, target._data[key], null, remote);

    if (silent) this.silenceRestore(state);
  } else if (type === "object" && value instanceof Object) {
    if (typeof target._data[key] !== "object") {
      target._data[key] = {
        _path: path,
        _keys: [],
        _data: {},
      };
    }

    for (var i in value) {
      if (typeof value[i] === "object") {
        this._prepare(target._data[key], i, value[i], true, remote);
      } else {
        state = this.silence();

        target._data[key]._data[i] = value[i];
        target._data[key]._keys.push(i);

        this.emit(path + "." + i + ":set", value[i], null, remote);
        this.emit("*:set", path + "." + i, value[i], null, remote);

        this.silenceRestore(state);
      }
    }

    if (silent) state = this.silence();

    // passing undefined as valueOld here
    // but we should get the old value to be consistent
    this.emit(path + ":set", value, undefined, remote);
    this.emit("*:set", path, value, undefined, remote);

    if (silent) this.silenceRestore(state);
  } else {
    if (silent) state = this.silence();

    target._data[key] = value;

    this.emit(path + ":set", value, undefined, remote);
    this.emit("*:set", path, value, undefined, remote);

    if (silent) this.silenceRestore(state);
  }

  return true;
};

Observer.prototype.set = function (path, value, silent, remote, force) {
  var keys = path.split(".");
  var length = keys.length;
  var key = keys[length - 1];
  var node = this;
  var nodePath = "";
  var obj = this;
  var state;

  for (var i = 0; i < length - 1; i++) {
    if (node instanceof Array) {
      node = node[keys[i]];

      if (node instanceof Observer) {
        path = keys.slice(i + 1).join(".");
        obj = node;
      }
    } else {
      if (i < length && typeof node._data[keys[i]] !== "object") {
        if (node._data[keys[i]]) obj.unset((node.__path ? node.__path + "." : "") + keys[i]);

        node._data[keys[i]] = {
          _path: path,
          _keys: [],
          _data: {},
        };
        node._keys.push(keys[i]);
      }

      if (i === length - 1 && node.__path) nodePath = node.__path + "." + keys[i];

      node = node._data[keys[i]];
    }
  }

  if (node instanceof Array) {
    var ind = parseInt(key, 10);
    if (node[ind] === value && !force) return;

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

    if (silent) state = obj.silence();

    obj.emit(path + ":set", value, valueOld, remote);
    obj.emit("*:set", path, value, valueOld, remote);

    if (silent) obj.silenceRestore(state);

    return true;
  } else if (node._data && !node._data.hasOwnProperty(key)) {
    if (typeof value === "object") {
      return obj._prepare(node, key, value, false, remote);
    } else {
      node._data[key] = value;
      node._keys.push(key);

      if (silent) state = obj.silence();

      obj.emit(path + ":set", value, null, remote);
      obj.emit("*:set", path, value, null, remote);

      if (silent) obj.silenceRestore(state);

      return true;
    }
  } else {
    if (typeof value === "object" && value instanceof Array) {
      if (value.equals(node._data[key]) && !force) return false;

      var valueOld = node._data[key];
      if (!(valueOld instanceof Observer)) valueOld = obj.json(valueOld);

      if (node._data[key] && node._data[key].length === value.length) {
        state = obj.silence();

        for (var i = 0; i < node._data[key].length; i++) {
          if (node._data[key][i] instanceof Observer) {
            node._data[key][i].patch(value[i]);
          } else if (node._data[key][i] !== value[i]) {
            node._data[key][i] = value[i];
            obj.emit(
              path + "." + i + ":set",
              node._data[key][i],
              (valueOld && valueOld[i]) || null,
              remote
            );
            obj.emit(
              "*:set",
              path + "." + i,
              node._data[key][i],
              (valueOld && valueOld[i]) || null,
              remote
            );
          }
        }

        obj.silenceRestore(state);
      } else {
        node._data[key] = value;

        state = obj.silence();
        for (var i = 0; i < node._data[key].length; i++) {
          obj.emit(
            path + "." + i + ":set",
            node._data[key][i],
            (valueOld && valueOld[i]) || null,
            remote
          );
          obj.emit(
            "*:set",
            path + "." + i,
            node._data[key][i],
            (valueOld && valueOld[i]) || null,
            remote
          );
        }
        obj.silenceRestore(state);
      }

      if (silent) state = obj.silence();

      obj.emit(path + ":set", value, valueOld, remote);
      obj.emit("*:set", path, value, valueOld, remote);

      if (silent) obj.silenceRestore(state);

      return true;
    } else if (typeof value === "object" && value instanceof Object) {
      var changed = false;
      var valueOld = node._data[key];
      if (!(valueOld instanceof Observer)) valueOld = obj.json(valueOld);

      var keys = Object.keys(value);

      if (!node._data[key] || !node._data[key]._data) {
        if (node._data[key]) {
          obj.unset((node.__path ? node.__path + "." : "") + key);
        } else {
          changed = true;
        }

        node._data[key] = {
          _path: path,
          _keys: [],
          _data: {},
        };
      }

      for (var n in node._data[key]._data) {
        if (!value.hasOwnProperty(n)) {
          var c = obj.unset(path + "." + n, true);
          if (c) changed = true;
        } else if (node._data[key]._data.hasOwnProperty(n)) {
          if (!obj._equals(node._data[key]._data[n], value[n])) {
            var c = obj.set(path + "." + n, value[n], true);
            if (c) changed = true;
          }
        } else {
          var c = obj._prepare(node._data[key], n, value[n], true, remote);
          if (c) changed = true;
        }
      }

      for (var i = 0; i < keys.length; i++) {
        if (value[keys[i]] === undefined && node._data[key]._data.hasOwnProperty(keys[i])) {
          var c = obj.unset(path + "." + keys[i], true);
          if (c) changed = true;
        } else if (typeof value[keys[i]] === "object") {
          if (node._data[key]._data.hasOwnProperty(keys[i])) {
            var c = obj.set(path + "." + keys[i], value[keys[i]], true);
            if (c) changed = true;
          } else {
            var c = obj._prepare(node._data[key], keys[i], value[keys[i]], true, remote);
            if (c) changed = true;
          }
        } else if (!obj._equals(node._data[key]._data[keys[i]], value[keys[i]])) {
          if (typeof value[keys[i]] === "object") {
            var c = obj.set(node._data[key]._path + "." + keys[i], value[keys[i]], true);
            if (c) changed = true;
          } else if (node._data[key]._data[keys[i]] !== value[keys[i]]) {
            changed = true;

            if (node._data[key]._keys.indexOf(keys[i]) === -1) node._data[key]._keys.push(keys[i]);

            node._data[key]._data[keys[i]] = value[keys[i]];

            state = obj.silence();
            obj.emit(
              node._data[key]._path + "." + keys[i] + ":set",
              node._data[key]._data[keys[i]],
              null,
              remote
            );
            obj.emit(
              "*:set",
              node._data[key]._path + "." + keys[i],
              node._data[key]._data[keys[i]],
              null,
              remote
            );
            obj.silenceRestore(state);
          }
        }
      }

      if (changed) {
        if (silent) state = obj.silence();

        var val = obj.json(node._data[key]);

        obj.emit(node._data[key]._path + ":set", val, valueOld, remote);
        obj.emit("*:set", node._data[key]._path, val, valueOld, remote);

        if (silent) obj.silenceRestore(state);

        return true;
      } else {
        return false;
      }
    } else {
      var data;
      if (!node.hasOwnProperty("_data") && node.hasOwnProperty(key)) {
        data = node;
      } else {
        data = node._data;
      }

      if (data[key] === value && !force) return false;

      if (silent) state = obj.silence();

      var valueOld = data[key];
      if (!(valueOld instanceof Observer)) valueOld = obj.json(valueOld);

      data[key] = value;

      obj.emit(path + ":set", value, valueOld, remote);
      obj.emit("*:set", path, value, valueOld, remote);

      if (silent) obj.silenceRestore(state);

      return true;
    }
  }

  return false;
};

Observer.prototype.has = function (path) {
  var keys = path.split(".");
  var node = this;
  for (var i = 0, len = keys.length; i < len; i++) {
    if (node == undefined) return undefined;

    if (node._data) {
      node = node._data[keys[i]];
    } else {
      node = node[keys[i]];
    }
  }

  return node !== undefined;
};

Observer.prototype.get = function (path, raw) {
  var keys = path.split(".");
  var node = this;
  for (var i = 0; i < keys.length; i++) {
    if (node == undefined) return undefined;

    if (node._data) {
      node = node._data[keys[i]];
    } else {
      node = node[keys[i]];
    }
  }

  if (raw) return node;

  if (node == null) {
    return null;
  } else {
    return this.json(node);
  }
};

Observer.prototype.getRaw = function (path) {
  return this.get(path, true);
};

Observer.prototype._equals = function (a, b) {
  if (a === b) {
    return true;
  } else if (a instanceof Array && b instanceof Array && a.equals(b)) {
    return true;
  } else {
    return false;
  }
};

Observer.prototype.unset = function (path, silent, remote) {
  var keys = path.split(".");
  var key = keys[keys.length - 1];
  var node = this;
  var obj = this;

  for (var i = 0; i < keys.length - 1; i++) {
    if (node instanceof Array) {
      node = node[keys[i]];
      if (node instanceof Observer) {
        path = keys.slice(i + 1).join(".");
        obj = node;
      }
    } else {
      node = node._data[keys[i]];
    }
  }

  if (!node._data || !node._data.hasOwnProperty(key)) return false;

  var valueOld = node._data[key];
  if (!(valueOld instanceof Observer)) valueOld = obj.json(valueOld);

  // recursive
  if (node._data[key] && node._data[key]._data) {
    // do this in reverse order because node._data[key]._keys gets
    // modified as we loop
    for (var i = node._data[key]._keys.length - 1; i >= 0; i--) {
      obj.unset(path + "." + node._data[key]._keys[i], true);
    }
  }

  node._keys.splice(node._keys.indexOf(key), 1);
  delete node._data[key];

  var state;
  if (silent) state = obj.silence();

  obj.emit(path + ":unset", valueOld, remote);
  obj.emit("*:unset", path, valueOld, remote);

  if (silent) obj.silenceRestore(state);

  return true;
};

Observer.prototype.remove = function (path, ind, silent, remote) {
  var keys = path.split(".");
  var key = keys[keys.length - 1];
  var node = this;
  var obj = this;

  for (var i = 0; i < keys.length - 1; i++) {
    if (node instanceof Array) {
      node = node[parseInt(keys[i], 10)];
      if (node instanceof Observer) {
        path = keys.slice(i + 1).join(".");
        obj = node;
      }
    } else if (node._data && node._data.hasOwnProperty(keys[i])) {
      node = node._data[keys[i]];
    } else {
      return;
    }
  }

  if (!node._data || !node._data.hasOwnProperty(key) || !(node._data[key] instanceof Array)) return;

  var arr = node._data[key];
  if (arr.length < ind) return;

  var value = arr[ind];
  if (value instanceof Observer) {
    value._parent = null;
  } else {
    value = obj.json(value);
  }

  arr.splice(ind, 1);

  var state;
  if (silent) state = obj.silence();

  obj.emit(path + ":remove", value, ind, remote);
  obj.emit("*:remove", path, value, ind, remote);

  if (silent) obj.silenceRestore(state);

  return true;
};

Observer.prototype.removeValue = function (path, value, silent, remote) {
  var keys = path.split(".");
  var key = keys[keys.length - 1];
  var node = this;
  var obj = this;

  for (var i = 0; i < keys.length - 1; i++) {
    if (node instanceof Array) {
      node = node[parseInt(keys[i], 10)];
      if (node instanceof Observer) {
        path = keys.slice(i + 1).join(".");
        obj = node;
      }
    } else if (node._data && node._data.hasOwnProperty(keys[i])) {
      node = node._data[keys[i]];
    } else {
      return;
    }
  }

  if (!node._data || !node._data.hasOwnProperty(key) || !(node._data[key] instanceof Array)) return;

  var arr = node._data[key];

  var ind = arr.indexOf(value);
  if (ind === -1) {
    return;
  }

  if (arr.length < ind) return;

  var value = arr[ind];
  if (value instanceof Observer) {
    value._parent = null;
  } else {
    value = obj.json(value);
  }

  arr.splice(ind, 1);

  var state;
  if (silent) state = obj.silence();

  obj.emit(path + ":remove", value, ind, remote);
  obj.emit("*:remove", path, value, ind, remote);

  if (silent) obj.silenceRestore(state);

  return true;
};

Observer.prototype.insert = function (path, value, ind, silent, remote) {
  var keys = path.split(".");
  var key = keys[keys.length - 1];
  var node = this;
  var obj = this;

  for (var i = 0; i < keys.length - 1; i++) {
    if (node instanceof Array) {
      node = node[parseInt(keys[i], 10)];
      if (node instanceof Observer) {
        path = keys.slice(i + 1).join(".");
        obj = node;
      }
    } else if (node._data && node._data.hasOwnProperty(keys[i])) {
      node = node._data[keys[i]];
    } else {
      return;
    }
  }

  if (!node._data || !node._data.hasOwnProperty(key) || !(node._data[key] instanceof Array)) return;

  var arr = node._data[key];

  if (typeof value === "object" && !(value instanceof Observer)) {
    if (value instanceof Array) {
      value = value.slice(0);
    } else {
      value = new Observer(value);
    }
  }

  if (!this._pathsWithDuplicates || !this._pathsWithDuplicates[path]) {
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
    value._parentPath = node._path ? node._path + "." + key : key;
    value._parentField = arr;
    value._parentKey = null;
  } else {
    value = obj.json(value);
  }

  var state;
  if (silent) state = obj.silence();

  obj.emit(path + ":insert", value, ind, remote);
  obj.emit("*:insert", path, value, ind, remote);

  if (silent) obj.silenceRestore(state);

  return true;
};

Observer.prototype.move = function (path, indOld, indNew, silent, remote) {
  var keys = path.split(".");
  var key = keys[keys.length - 1];
  var node = this;
  var obj = this;

  for (var i = 0; i < keys.length - 1; i++) {
    if (node instanceof Array) {
      node = node[parseInt(keys[i], 10)];
      if (node instanceof Observer) {
        path = keys.slice(i + 1).join(".");
        obj = node;
      }
    } else if (node._data && node._data.hasOwnProperty(keys[i])) {
      node = node._data[keys[i]];
    } else {
      return;
    }
  }

  if (!node._data || !node._data.hasOwnProperty(key) || !(node._data[key] instanceof Array)) return;

  var arr = node._data[key];

  if (arr.length < indOld || arr.length < indNew || indOld === indNew) return;

  var value = arr[indOld];

  arr.splice(indOld, 1);

  if (indNew === -1) indNew = arr.length;

  arr.splice(indNew, 0, value);

  if (!(value instanceof Observer)) value = obj.json(value);

  var state;
  if (silent) state = obj.silence();

  obj.emit(path + ":move", value, indNew, indOld, remote);
  obj.emit("*:move", path, value, indNew, indOld, remote);

  if (silent) obj.silenceRestore(state);

  return true;
};

Observer.prototype.patch = function (data) {
  if (typeof data !== "object") return;

  for (var key in data) {
    if (typeof data[key] === "object" && !this._data.hasOwnProperty(key)) {
      this._prepare(this, key, data[key]);
    } else if (this._data[key] !== data[key]) {
      this.set(key, data[key]);
    }
  }
};

Observer.prototype.json = function (target) {
  var obj = {};
  var node = target === undefined ? this : target;
  var len, nlen;

  if (node instanceof Object && node._keys) {
    len = node._keys.length;
    for (var i = 0; i < len; i++) {
      var key = node._keys[i];
      var value = node._data[key];
      var type = typeof value;

      if (type === "object" && value instanceof Array) {
        obj[key] = value.slice(0);

        nlen = obj[key].length;
        for (var n = 0; n < nlen; n++) {
          if (typeof obj[key][n] === "object") obj[key][n] = this.json(obj[key][n]);
        }
      } else if (type === "object" && value instanceof Object) {
        obj[key] = this.json(value);
      } else {
        obj[key] = value;
      }
    }
  } else {
    if (node === null) {
      return null;
    } else if (typeof node === "object" && node instanceof Array) {
      obj = node.slice(0);

      len = obj.length;
      for (var n = 0; n < len; n++) {
        obj[n] = this.json(obj[n]);
      }
    } else if (typeof node === "object") {
      for (var key in node) {
        if (node.hasOwnProperty(key)) obj[key] = node[key];
      }
    } else {
      obj = node;
    }
  }
  return obj;
};

Observer.prototype.forEach = function (fn, target, path) {
  var node = target || this;
  path = path || "";

  for (var i = 0; i < node._keys.length; i++) {
    var key = node._keys[i];
    var value = node._data[key];
    var type =
      (this.schema &&
        this.schema.has(path + key) &&
        this.schema.get(path + key).type.name.toLowerCase()) ||
      typeof value;

    if (type === "object" && value instanceof Array) {
      fn(path + key, "array", value, key);
    } else if (type === "object" && value instanceof Object) {
      fn(path + key, "object", value, key);
      this.forEach(fn, value, path + key + ".");
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

Observer.prototype.destroy = function () {
  if (this._destroyed) return;
  this._destroyed = true;
  this.emit("destroy");
  this.unbind();
};

Object.defineProperty(Observer.prototype, "latestFn", {
  get: function () {
    return this._latestFn;
  },
  set: function (value) {
    this._latestFn = value;
  },
});

/* observer-list.js */
("use strict");

function ObserverList(options) {
  Events.call(this);
  options = options || {};

  this.data = [];
  this._indexed = {};
  this.sorted = options.sorted || null;
  this.index = options.index || null;
}

ObserverList.prototype = Object.create(Events.prototype);

Object.defineProperty(ObserverList.prototype, "length", {
  get: function () {
    return this.data.length;
  },
});

ObserverList.prototype.get = function (index) {
  if (this.index) {
    return this._indexed[index] || null;
  } else {
    return this.data[index] || null;
  }
};

ObserverList.prototype.set = function (index, value) {
  if (this.index) {
    this._indexed[index] = value;
  } else {
    this.data[index] = value;
  }
};

ObserverList.prototype.indexOf = function (item) {
  if (this.index) {
    var index = (item instanceof Observer && item.get(this.index)) || item[this.index];
    return (this._indexed[index] && index) || null;
  } else {
    var ind = this.data.indexOf(item);
    return ind !== -1 ? ind : null;
  }
};

ObserverList.prototype.position = function (b, fn) {
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

ObserverList.prototype.positionNextClosest = function (b, fn) {
  var l = this.data;
  var min = 0;
  var max = l.length - 1;
  var cur;
  var a, i;
  fn = fn || this.sorted;

  if (l.length === 0) return -1;

  if (fn(l[0], b) === 0) return 0;

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

  if (fn(a, b) === 1) return cur;

  if (cur + 1 === l.length) return -1;

  return cur + 1;
};

ObserverList.prototype.has = function (item) {
  if (this.index) {
    var index = (item instanceof Observer && item.get(this.index)) || item[this.index];
    return !!this._indexed[index];
  } else {
    return this.data.indexOf(item) !== -1;
  }
};

ObserverList.prototype.add = function (item) {
  if (this.has(item)) return null;

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

  this.emit("add", item, index, pos);

  return pos;
};

ObserverList.prototype.move = function (item, pos) {
  var ind = this.data.indexOf(item);
  this.data.splice(ind, 1);
  if (pos === -1) {
    this.data.push(item);
  } else {
    this.data.splice(pos, 0, item);
  }

  this.emit("move", item, pos);
};

ObserverList.prototype.remove = function (item) {
  if (!this.has(item)) return;

  var ind = this.data.indexOf(item);

  var index = ind;
  if (this.index) {
    index = (item instanceof Observer && item.get(this.index)) || item[this.index];
    delete this._indexed[index];
  }

  this.data.splice(ind, 1);

  this.emit("remove", item, index);
};

ObserverList.prototype.removeByKey = function (index) {
  if (this.index) {
    var item = this._indexed[index];

    if (!item) return;

    var ind = this.data.indexOf(item);
    this.data.splice(ind, 1);

    delete this._indexed[index];

    this.emit("remove", item, ind);
  } else {
    if (this.data.length < index) return;

    var item = this.data[index];

    this.data.splice(index, 1);

    this.emit("remove", item, index);
  }
};

ObserverList.prototype.removeBy = function (fn) {
  var i = this.data.length;
  while (i--) {
    if (!fn(this.data[i])) continue;

    if (this.index) {
      delete this._indexed[this.data[i][this.index]];
    }
    this.data.splice(i, 1);

    this.emit("remove", this.data[i], i);
  }
};

ObserverList.prototype.clear = function () {
  var items = this.data.slice(0);

  this.data = [];
  this._indexed = {};

  var i = items.length;
  while (i--) {
    this.emit("remove", items[i], i);
  }
};

ObserverList.prototype.forEach = function (fn) {
  for (var i = 0; i < this.data.length; i++) {
    fn(this.data[i], (this.index && this.data[i][this.index]) || i);
  }
};

ObserverList.prototype.find = function (fn) {
  var items = [];
  for (var i = 0; i < this.data.length; i++) {
    if (!fn(this.data[i])) continue;

    var index = i;
    if (this.index) index = this.data[i][this.index];

    items.push([index, this.data[i]]);
  }
  return items;
};

ObserverList.prototype.findOne = function (fn) {
  for (var i = 0; i < this.data.length; i++) {
    if (!fn(this.data[i])) continue;

    var index = i;
    if (this.index) index = this.data[i][this.index];

    return [index, this.data[i]];
  }
  return null;
};

ObserverList.prototype.map = function (fn) {
  return this.data.map(fn);
};

ObserverList.prototype.sort = function (fn) {
  this.data.sort(fn);
};

ObserverList.prototype.array = function () {
  return this.data.slice(0);
};

ObserverList.prototype.json = function () {
  var items = this.array();
  for (var i = 0; i < items.length; i++) {
    if (items[i] instanceof Observer) {
      items[i] = items[i].json();
    }
  }
  return items;
};

/* observer-sync.js */
function ObserverSync(args) {
  Events.call(this);
  args = args || {};

  this.item = args.item;
  this._enabled = args.enabled || true;
  this._prefix = args.prefix || [];
  this._paths = args.paths || null;
  this._sync = args.sync || true;

  this._initialize();
}
ObserverSync.prototype = Object.create(Events.prototype);

ObserverSync.prototype._initialize = function () {
  var self = this;
  var item = this.item;

  // object/array set
  item.on("*:set", function (path, value, valueOld) {
    if (!self._enabled) return;

    // if this happens it's a bug
    if (item.sync !== self) {
      console.error("Garbage Observer Sync still pointing to item", item);
    }

    // check if path is allowed
    if (self._paths) {
      var allowedPath = false;
      for (var i = 0; i < self._paths.length; i++) {
        if (path.indexOf(self._paths[i]) !== -1) {
          allowedPath = true;
          break;
        }
      }

      // path is not allowed
      if (!allowedPath) return;
    }

    // full path
    var p = self._prefix.concat(path.split("."));

    // need jsonify
    if (value instanceof Observer || value instanceof ObserverList) value = value.json();

    // can be array value
    var ind = path.lastIndexOf(".");
    if (ind !== -1 && this.get(path.slice(0, ind)) instanceof Array) {
      // array index should be int
      p[p.length - 1] = parseInt(p[p.length - 1], 10);

      // emit operation: list item set
      self.emit("op", {
        p: p,
        li: value,
        ld: valueOld,
      });
    } else {
      // emit operation: object item set
      var obj = {
        p: p,
        oi: value,
      };

      if (valueOld !== undefined) {
        obj.od = valueOld;
      }

      self.emit("op", obj);
    }
  });

  // unset
  item.on("*:unset", function (path, value) {
    if (!self._enabled) return;

    self.emit("op", {
      p: self._prefix.concat(path.split(".")),
      od: null,
    });
  });

  // list move
  item.on("*:move", function (path, value, ind, indOld) {
    if (!self._enabled) return;
    self.emit("op", {
      p: self._prefix.concat(path.split(".")).concat([indOld]),
      lm: ind,
    });
  });

  // list remove
  item.on("*:remove", function (path, value, ind) {
    if (!self._enabled) return;

    // need jsonify
    if (value instanceof Observer || value instanceof ObserverList) value = value.json();

    self.emit("op", {
      p: self._prefix.concat(path.split(".")).concat([ind]),
      ld: value,
    });
  });

  // list insert
  item.on("*:insert", function (path, value, ind) {
    if (!self._enabled) return;

    // need jsonify
    if (value instanceof Observer || value instanceof ObserverList) value = value.json();

    self.emit("op", {
      p: self._prefix.concat(path.split(".")).concat([ind]),
      li: value,
    });
  });
};

ObserverSync.prototype.write = function (op) {
  // disable history if available
  var historyReEnable = false;
  if (this.item.history && this.item.history.enabled) {
    historyReEnable = true;
    this.item.history.enabled = false;
  }

  if (op.hasOwnProperty("oi")) {
    // set key value
    var path = op.p.slice(this._prefix.length).join(".");

    this._enabled = false;
    this.item.set(path, op.oi, false, true);
    this._enabled = true;
  } else if (op.hasOwnProperty("ld") && op.hasOwnProperty("li")) {
    // set array value
    var path = op.p.slice(this._prefix.length).join(".");

    this._enabled = false;
    this.item.set(path, op.li, false, true);
    this._enabled = true;
  } else if (op.hasOwnProperty("ld")) {
    // delete item
    var path = op.p.slice(this._prefix.length, -1).join(".");

    this._enabled = false;
    this.item.remove(path, op.p[op.p.length - 1], false, true);
    this._enabled = true;
  } else if (op.hasOwnProperty("li")) {
    // add item
    var path = op.p.slice(this._prefix.length, -1).join(".");
    var ind = op.p[op.p.length - 1];

    this._enabled = false;
    this.item.insert(path, op.li, ind, false, true);
    this._enabled = true;
  } else if (op.hasOwnProperty("lm")) {
    // item moved
    var path = op.p.slice(this._prefix.length, -1).join(".");
    var indOld = op.p[op.p.length - 1];
    var ind = op.lm;

    this._enabled = false;
    this.item.move(path, indOld, ind, false, true);
    this._enabled = true;
  } else if (op.hasOwnProperty("od")) {
    // unset key value
    var path = op.p.slice(this._prefix.length).join(".");
    this._enabled = false;
    this.item.unset(path, false, true);
    this._enabled = true;
  } else {
    console.log("unknown operation", op);
  }

  // reenable history
  if (historyReEnable) this.item.history.enabled = true;

  this.emit("sync", op);
};

Object.defineProperty(ObserverSync.prototype, "enabled", {
  get: function () {
    return this._enabled;
  },
  set: function (value) {
    this._enabled = !!value;
  },
});

Object.defineProperty(ObserverSync.prototype, "prefix", {
  get: function () {
    return this._prefix;
  },
  set: function (value) {
    this._prefix = value || [];
  },
});

Object.defineProperty(ObserverSync.prototype, "paths", {
  get: function () {
    return this._paths;
  },
  set: function (value) {
    this._paths = value || null;
  },
});

/* observer-history.js */
function ObserverHistory(args) {
  Events.call(this);
  args = args || {};

  this.item = args.item;
  this._history = args.history;
  this._enabled = args.enabled || true;
  this._prefix = args.prefix || "";
  this._combine = args.combine || false;

  this._events = [];

  this._initialize();
}
ObserverHistory.prototype = Object.create(Events.prototype);

ObserverHistory.prototype._initialize = function () {
  var self = this;

  this._events.push(
    this.item.on("*:set", function (path, value, valueOld) {
      if (!self._enabled || !self._history) return;

      // need jsonify
      if (value instanceof Observer) value = value.json();

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
        },
      };

      self._history.add(action);
    })
  );

  this._events.push(
    this.item.on("*:unset", function (path, valueOld) {
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
        },
      };

      self._history.add(action);
    })
  );

  this._events.push(
    this.item.on("*:insert", function (path, value, ind) {
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
        },
      };

      self._history.add(action);
    })
  );

  this._events.push(
    this.item.on("*:remove", function (path, value, ind) {
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
        },
      };

      self._history.add(action);
    })
  );

  this._events.push(
    this.item.on("*:move", function (path, value, ind, indOld) {
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
        },
      };

      self._history.add(action);
    })
  );
};

ObserverHistory.prototype.destroy = function () {
  this._events.forEach(function (evt) {
    evt.unbind();
  });

  this._events.length = 0;
  this.item = null;
};

Object.defineProperty(ObserverHistory.prototype, "enabled", {
  get: function () {
    return this._enabled;
  },
  set: function (value) {
    this._enabled = !!value;
  },
});

Object.defineProperty(ObserverHistory.prototype, "prefix", {
  get: function () {
    return this._prefix;
  },
  set: function (value) {
    this._prefix = value || "";
  },
});

Object.defineProperty(ObserverHistory.prototype, "combine", {
  get: function () {
    return this._combine;
  },
  set: function (value) {
    this._combine = !!value;
  },
});

/* editor/editor.js 下面的所有代码都别删 */
(function () {
  "use strict";

  function Editor() {
    Events.call(this);

    this._hooks = {};
  }
  Editor.prototype = Object.create(Events.prototype);

  Editor.prototype.method = function (name, fn) {
    if (this._hooks[name] !== undefined) {
      throw new Error("can't override hook: " + name);
    }
    this._hooks[name] = fn;
  };

  Editor.prototype.methodRemove = function (name) {
    delete this._hooks[name];
  };

  Editor.prototype.call = function (name) {
    if (this._hooks[name]) {
      var args = Array.prototype.slice.call(arguments, 1);

      try {
        return this._hooks[name].apply(null, args);
      } catch (ex) {
        console.info("%c%s %c(editor.method error)", "color: #06f", name, "color: #f00");
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

/* launch/first-load.js 不能删 */
(function () {
  "use strict";

  var visible = !document.hidden;

  document.addEventListener(
    "visibilitychange",
    function () {
      if (visible === !document.hidden) return;

      visible = !document.hidden;
      if (visible) {
        editor.emit("visible");
      } else {
        editor.emit("hidden");
      }
      editor.emit("visibility", visible);
    },
    false
  );

  editor.method("visibility", function () {
    return visible;
  });

  // first load
  document.addEventListener(
    "DOMContentLoaded",
    function () {
      editor.emit("load");
    },
    false
  );
})();

/* launch/messenger.js */
editor.on("load", function () {
  "use strict";

  if (typeof Messenger === "undefined") return;

  var messenger = new Messenger();

  messenger.connect(config.url.messenger.ws);

  messenger.on("connect", function () {
    this.authenticate(null, "designer");
  });

  messenger.on("welcome", function () {
    this.projectWatch(config.project.id);
  });

  messenger.on("message", function (evt) {
    editor.emit("messenger:" + evt.name, evt.data);
  });
});

/* launch/modules.js */
editor.once("load", function () {
  "use strict";

  // check for wasm module support
  function wasmSupported() {
    try {
      if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
        const module = new WebAssembly.Module(
          Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
        );
        if (module instanceof WebAssembly.Module)
          return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
      }
    } catch (e) {}
    return false;
  }

  // load a script
  function loadScriptAsync(url, doneCallback) {
    var tag = document.createElement("script");
    tag.onload = function () {
      doneCallback();
    };
    tag.onerror = function () {
      throw new Error("failed to load " + url);
    };
    tag.async = true;
    tag.src = url;
    document.head.appendChild(tag);
  }

  // load and initialize a wasm module
  function loadWasmModuleAsync(moduleName, jsUrl, binaryUrl, doneCallback) {
    loadScriptAsync(jsUrl, function () {
      var lib = window[moduleName];
      window[moduleName + "Lib"] = lib;
      lib({
        locateFile: function () {
          return binaryUrl;
        },
      }).then(function (instance) {
        window[moduleName] = instance;
        doneCallback();
      });
    });
  }

  editor.method("editor:loadModules", function (modules, urlPrefix, doneCallback) {
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
        if (!m.hasOwnProperty("preload") || m.preload) {
          asyncCallback();
          //   if (wasm) {
          //     loadWasmModuleAsync(
          //       m.moduleName,
          //       urlPrefix + m.glueUrl,
          //       urlPrefix + m.wasmUrl,
          //       asyncCallback
          //     );
          //   } else {
          //     if (!m.fallbackUrl) {
          //       throw new Error(
          //         "wasm not supported and no fallback supplied for module " + m.moduleName
          //       );
          //     }
          //     loadWasmModuleAsync(m.moduleName, urlPrefix + m.fallbackUrl, "", asyncCallback);
          //   }
          // } else {
          //   asyncCallback();
        }
      });
    }
  });
});

/* editor/settings/settings.js */
editor.once("load", function () {
  "use strict";

  editor.method("settings:create", function (args) {
    // settings observer
    var settings = new Observer(args.data);
    settings.id = args.id;

    // Get settings
    editor.method("settings:" + args.name, function () {
      return settings;
    });

    var doc;

    settings.reload = function () {
      var connection = editor.call("realtime:connection");

      if (doc) doc.destroy();

      doc = connection.get("settings", settings.id);

      // handle errors
      doc.on("error", function (err) {
        console.error(err);
        editor.emit("settings:" + args.name + ":error", err);
      });

      // load settings
      doc.on("load", function () {
        var data = doc.data;

        // remove unnecessary fields
        delete data._id;
        delete data.name;
        delete data.user;
        delete data.project;
        delete data.item_id;
        delete data.branch_id;
        delete data.checkpoint_id;

        if (!settings.sync) {
          settings.sync = new ObserverSync({
            item: settings,
            paths: Object.keys(settings._data),
          });

          // local -> server
          settings.sync.on("op", function (op) {
            if (doc) doc.submitOp([op]);
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
        if (history) settings.history.enabled = true;

        // server -> local
        doc.on("op", function (ops, local) {
          if (local) return;

          var history = settings.history.enabled;
          if (history) settings.history.enabled = false;
          for (var i = 0; i < ops.length; i++) {
            settings.sync.write(ops[i]);
          }
          if (history) settings.history.enabled = true;
        });

        editor.emit("settings:" + args.name + ":load");
      });

      // subscribe for realtime events
      doc.subscribe();
    };

    if (!args.deferLoad) {
      editor.on("realtime:authenticated", function () {
        settings.reload();
      });
    }

    editor.on("realtime:disconnected", function () {
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
editor.once("load", function () {
  "use strict";

  var syncPaths = [
    "antiAlias",
    "batchGroups",
    "fillMode",
    "resolutionMode",
    "height",
    "width",
    "use3dPhysics",
    "preferWebGl2",
    "preserveDrawingBuffer",
    "scripts",
    "transparentCanvas",
    "useDevicePixelRatio",
    "useLegacyScripts",
    "useKeyboard",
    "useMouse",
    "useGamepads",
    "useTouch",
    "vr",
    "loadingScreenScript",
    "externalScripts",
    "plugins",
    "layers",
    "layerOrder",
    "i18nAssets",
    "useLegacyAmmoPhysics",
    "useLegacyAudio",
  ];

  var data = {};
  for (var i = 0; i < syncPaths.length; i++)
    data[syncPaths[i]] = config.project.settings.hasOwnProperty(syncPaths[i])
      ? config.project.settings[syncPaths[i]]
      : null;

  var settings = editor.call("settings:create", {
    name: "project",
    id: config.project.settings.id,
    data: data,
  });

  if (!settings.get("useLegacyScripts")) {
    pc.script.legacy = false;
  } else {
    pc.script.legacy = true;
  }

  // add history
  settings.history = new ObserverHistory({
    item: settings,
    history: editor.call("editor:history"),
  });

  settings.on("*:set", function (path, value) {
    var parts = path.split(".");
    var obj = config.project.settings;
    for (var i = 0; i < parts.length - 1; i++) {
      if (!obj.hasOwnProperty(parts[i])) obj[parts[i]] = {};

      obj = obj[parts[i]];
    }

    // this is limited to simple structures for now
    // so take care
    if (value instanceof Object) {
      var path = parts[parts.length - 1];
      obj[path] = {};
      for (var key in value) {
        obj[path][key] = value[key];
      }
    } else {
      obj[parts[parts.length - 1]] = value;
    }
  });

  settings.on("*:unset", function (path) {
    var parts = path.split(".");
    var obj = config.project.settings;
    for (var i = 0; i < parts.length - 1; i++) {
      obj = obj[parts[i]];
    }

    delete obj[parts[parts.length - 1]];
  });

  settings.on("*:insert", function (path, value, index) {
    var parts = path.split(".");
    var obj = config.project.settings;
    for (var i = 0; i < parts.length - 1; i++) {
      obj = obj[parts[i]];
    }

    var arr = obj[parts[parts.length - 1]];
    if (Array.isArray(arr)) {
      arr.splice(index, 0, value);
    }
  });

  settings.on("*:remove", function (path, value, index) {
    var parts = path.split(".");
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
  editor.on("settings:project:load", function () {
    var history = settings.history.enabled;
    var sync = settings.sync.enabled;

    settings.history.enabled = false;
    settings.sync.enabled = editor.call("permissions:write");

    if (!settings.get("batchGroups")) {
      settings.set("batchGroups", {});
    }
    if (!settings.get("layers")) {
      settings.set("layers", {
        0: {
          name: "World",
          opaqueSortMode: 2,
          transparentSortMode: 3,
        },
        1: {
          name: "Depth",
          opaqueSortMode: 2,
          transparentSortMode: 3,
        },
        2: {
          name: "Skybox",
          opaqueSortMode: 0,
          transparentSortMode: 3,
        },
        3: {
          name: "Immediate",
          opaqueSortMode: 0,
          transparentSortMode: 3,
        },
        4: {
          name: "UI",
          opaqueSortMode: 1,
          transparentSortMode: 1,
        },
      });

      settings.set("layerOrder", []);
      settings.insert("layerOrder", {
        layer: LAYERID_WORLD,
        transparent: false,
        enabled: true,
      });
      settings.insert("layerOrder", {
        layer: LAYERID_DEPTH,
        transparent: false,
        enabled: true,
      });
      settings.insert("layerOrder", {
        layer: LAYERID_SKYBOX,
        transparent: false,
        enabled: true,
      });
      settings.insert("layerOrder", {
        layer: LAYERID_WORLD,
        transparent: true,
        enabled: true,
      });
      settings.insert("layerOrder", {
        layer: LAYERID_IMMEDIATE,
        transparent: false,
        enabled: true,
      });
      settings.insert("layerOrder", {
        layer: LAYERID_IMMEDIATE,
        transparent: true,
        enabled: true,
      });
      settings.insert("layerOrder", {
        layer: LAYERID_UI,
        transparent: true,
        enabled: true,
      });
    }

    if (settings.get("useKeyboard") === null) {
      settings.set("useKeyboard", true);
    }
    if (settings.get("useMouse") === null) {
      settings.set("useMouse", true);
    }
    if (settings.get("useTouch") === null) {
      settings.set("useTouch", true);
    }
    if (settings.get("useGamepads") === null) {
      settings.set("useGamepads", !!settings.get("vr"));
    }

    if (!settings.get("i18nAssets")) {
      settings.set("i18nAssets", []);
    }

    if (!settings.get("externalScripts")) {
      settings.set("externalScripts", []);
    }

    settings.history.enabled = history;
    settings.sync.enabled = sync;
  });
});

/* editor/settings/project-user-settings.js */
editor.once("load", function () {
  "use strict";

  var isConnected = false;

  var settings = editor.call("settings:create", {
    name: "projectUser",
    id: "project_" + config.project.id + "_" + config.self.id,
    deferLoad: true,
    data: {
      editor: {
        cameraNearClip: 0.1,
        cameraFarClip: 1000,
        cameraClearColor: [0.118, 0.118, 0.118, 1],
        gridDivisions: 8,
        gridDivisionSize: 1,
        snapIncrement: 1,
        localServer: "http://localhost:51000",
        launchDebug: true,
        locale: "en-US",
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
          defaultAssetPreload: true,
        },
      },
      branch: config.self.branch.id,
      favoriteBranches: null,
    },
    userId: config.self.id,
  });

  // add history
  settings.history = new ObserverHistory({
    item: settings,
    history: editor.call("editor:history"),
  });

  // migrations
  editor.on("settings:projectUser:load", function () {
    setTimeout(function () {
      var history = settings.history.enabled;
      settings.history.enabled = false;

      var sync = settings.sync.enabled;
      settings.sync.enabled = editor.call("permissions:read"); // read permissions enough for project user settings

      if (!settings.has("editor.pipeline")) settings.set("editor.pipeline", {});

      if (!settings.has("editor.pipeline.texturePot"))
        settings.set("editor.pipeline.texturePot", true);

      if (!settings.has("editor.pipeline.searchRelatedAssets"))
        settings.set("editor.pipeline.searchRelatedAssets", true);

      if (!settings.has("editor.pipeline.preserveMapping"))
        settings.set("editor.pipeline.preserveMapping", false);

      if (!settings.has("editor.pipeline.textureDefaultToAtlas"))
        settings.set("editor.pipeline.textureDefaultToAtlas", false);

      if (!settings.has("editor.pipeline.overwriteModel"))
        settings.set("editor.pipeline.overwriteModel", true);

      if (!settings.has("editor.pipeline.overwriteAnimation"))
        settings.set("editor.pipeline.overwriteAnimation", true);

      if (!settings.has("editor.pipeline.overwriteMaterial"))
        settings.set("editor.pipeline.overwriteMaterial", false);

      if (!settings.has("editor.pipeline.overwriteTexture"))
        settings.set("editor.pipeline.overwriteTexture", true);

      if (!settings.has("editor.locale")) {
        settings.set("editor.locale", "en-US");
      }

      if (!settings.get("favoriteBranches")) {
        if (config.project.masterBranch) {
          settings.set("favoriteBranches", [config.project.masterBranch]);
        } else {
          settings.set("favoriteBranches", []);
        }
      }

      if (!settings.has("editor.pipeline.useGlb")) {
        settings.set("editor.pipeline.useGlb", false);
      }

      if (!settings.has("editor.pipeline.defaultAssetPreload")) {
        settings.set("editor.pipeline.defaultAssetPreload", true);
      }

      settings.history.enabled = history;
      settings.sync.enabled = sync;
    });
  });

  var reload = function () {
    // config.project.hasReadAccess is only for the launch page
    if (isConnected && (editor.call("permissions:read") || config.project.hasReadAccess)) {
      settings.reload(settings.scopeId);
    }
  };

  // handle permission changes
  editor.on("permissions:set:" + config.self.id, function (accesslevel) {
    if (editor.call("permissions:read")) {
      // reload settings
      if (!settings.sync) {
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

  editor.on("realtime:authenticated", function () {
    isConnected = true;
    reload();
  });

  editor.on("realtime:disconnected", function () {
    isConnected = false;
  });
});

/* launch/viewport.js */
editor.once("load", function () {
  "use strict";

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
  var legacyScripts = editor.call("settings:project").get("useLegacyScripts");
  var canvas;
  var app;

  var layerIndex = {};

  // update progress bar
  var setProgress = function (value) {
    var bar = document.getElementById("progress-bar");
    value = Math.min(1, Math.max(0, value));
    bar.style.width = value * 100 + "%";
  };

  // respond to resize window
  var reflow = function () {
    var size = app.resizeCanvas(canvas.width, canvas.height);
    canvas.style.width = "";
    canvas.style.height = "";

    var fillMode = app._fillMode;

    if (fillMode == pc.fw.FillMode.NONE || fillMode == pc.fw.FillMode.KEEP_ASPECT) {
      if (
        (fillMode == pc.fw.FillMode.NONE && canvas.clientHeight < window.innerHeight) ||
        canvas.clientWidth / canvas.clientHeight >= window.innerWidth / window.innerHeight
      ) {
        canvas.style.marginTop = Math.floor((window.innerHeight - canvas.clientHeight) / 2) + "px";
      } else {
        canvas.style.marginTop = "";
      }
    }
  };

  // try to start preload and initialization of application after load event
  var init = function () {
    if (
      !done &&
      assets &&
      hierarchy &&
      settings &&
      (!legacyScripts || sourcefiles) &&
      libraries &&
      loadingScreen
    ) {
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
          //   app.scene = app.loader.open("scene", sceneData);
          //   app.root.addChild(app.scene.root);

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
    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "application-canvas");
    canvas.setAttribute("tabindex", 0);
    // canvas.style.visibility = 'hidden';

    // Disable I-bar cursor on click+drag
    canvas.onselectstart = function () {
      return false;
    };

    document.body.appendChild(canvas);

    return canvas;
  };

  var showSplash = function () {
    // splash
    var splash = document.createElement("div");
    splash.id = "application-splash";
    document.body.appendChild(splash);

    // img
    var img = document.createElement("img");
    img.src =
      "https://s3-eu-west-1.amazonaws.com/static.playcanvas.com/images/logo/PLAY_FLAT_ORANGE3.png";
    splash.appendChild(img);

    // progress bar
    var container = document.createElement("div");
    container.id = "progress-container";
    splash.appendChild(container);

    var bar = document.createElement("div");
    bar.id = "progress-bar";
    container.appendChild(bar);
  };

  var hideSplash = function () {
    var splash = document.getElementById("application-splash");
    splash.parentElement.removeChild(splash);
  };

  var createLoadingScreen = function () {
    var defaultLoadingScreen = function () {
      // editor.call("viewport:loadingScreen");
      init();
    };

    // if the project has a loading screen script then
    // download it and execute it
    if (config.project.settings.loadingScreenScript) {
      var loadingScript = document.createElement("script");
      //   if (config.project.settings.useLegacyScripts) {
      //     loadingScript.src = scriptPrefix + "/" + config.project.settings.loadingScreenScript;
      //   } else {
      //     loadingScript.src =
      //       "/api/assets/" +
      //       config.project.settings.loadingScreenScript +
      //       "/download?branchId=" +
      //       config.self.branch.id;
      //   }

      loadingScript.onload = function () {
        // loadingScreen = true;
        init();
      };

      loadingScript.onerror = function () {
        console.error(
          "Could not load loading screen script: " + config.project.settings.loadingScreenScript
        );
        defaultLoadingScreen();
      };

      var head = document.getElementsByTagName("head")[0];
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
      transparentSortMode: data.transparentSortMode,
    });
  };

  var canvas = createCanvas();

  // convert library properties into URLs
  var libraryUrls = [];
  if (config.project.settings.use3dPhysics) {
    libraryUrls.push(config.url.physics);
  }

  var queryParams = new pc.URI(window.location.href).getQuery();

  var scriptPrefix = config.project.scriptPrefix;

  // queryParams.local can be true or it can be a URL
  if (queryParams.local)
    scriptPrefix = queryParams.local === "true" ? "http://localhost:51000" : queryParams.local;

  // WebGL 1.0 enforced?
  var preferWebGl2 = config.project.settings.preferWebGl2;
  if (queryParams.hasOwnProperty("webgl1")) {
    try {
      preferWebGl2 = queryParams.webgl1 === undefined ? false : !JSON.parse(queryParams.webgl1);
    } catch (ex) {}
  }

  // listen for project setting changes
  var projectSettings = editor.call("settings:project");
  var projectUserSettings = editor.call("settings:projectUser");

  // legacy scripts
  pc.script.legacy = projectSettings.get("useLegacyScripts");

  // playcanvas app
  var useMouse = projectSettings.has("useMouse") ? projectSettings.get("useMouse") : true;
  var useKeyboard = projectSettings.has("useKeyboard") ? projectSettings.get("useKeyboard") : true;
  var useTouch = projectSettings.has("useTouch") ? projectSettings.get("useTouch") : true;
  var useGamepads = projectSettings.has("useGamepads")
    ? projectSettings.get("useGamepads")
    : !!projectSettings.get("vr");

  //   app = new pc.Application(canvas, {
  //     elementInput: new pc.ElementInput(canvas, {
  //       useMouse: useMouse,
  //       useTouch: useTouch,
  //     }),
  //     mouse: useMouse ? new pc.input.Mouse(canvas) : null,
  //     touch: useTouch && pc.platform.touch ? new pc.input.TouchDevice(canvas) : null,
  //     keyboard: useKeyboard ? new pc.input.Keyboard(window) : null,
  //     gamepads: useGamepads ? new pc.input.GamePads() : null,
  //     scriptPrefix: scriptPrefix,
  //     scriptsOrder: projectSettings.get("scripts") || [],
  //     assetPrefix: "/api/",
  //     graphicsDeviceOptions: {
  //       preferWebGl2: preferWebGl2,
  //       antialias: config.project.settings.antiAlias === false ? false : true,
  //       alpha: config.project.settings.transparentCanvas === false ? false : true,
  //       preserveDrawingBuffer: !!config.project.settings.preserveDrawingBuffer,
  //     },
  //   });

  app = Game.app;

  if (queryParams.useBundles === "false") {
    app.enableBundles = false;
  }

  if (canvas.classList) {
    // canvas.classList.add("fill-mode-" + config.project.settings.fillMode);
  }

  if (config.project.settings.useDevicePixelRatio) {
    app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
  }

  app.setCanvasResolution(
    config.project.settings.resolutionMode,
    config.project.settings.width,
    config.project.settings.height
  );
  app.setCanvasFillMode(
    config.project.settings.fillMode,
    config.project.settings.width,
    config.project.settings.height
  );

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
  if (app.i18n) {
    // make it backwards compatible ...
    if (config.self.locale) {
      app.i18n.locale = config.self.locale;
    }

    if (config.project.settings.i18nAssets) {
      app.i18n.assets = config.project.settings.i18nAssets;
    }
  }

  editor.call("editor:loadModules", config.wasmModules, "", function () {
    app._loadLibraries(libraryUrls, function (err) {
      libraries = true;
      if (err) console.error(err);
      init();
    });
  });

  var style = document.head.querySelector ? document.head.querySelector("style") : null;

  // append css to style
  var createCss = function () {
    if (!document.head.querySelector) return;

    if (!style) style = document.head.querySelector("style");

    // css media query for aspect ratio changes
    var css =
      "@media screen and (min-aspect-ratio: " +
      config.project.settings.width +
      "/" +
      config.project.settings.height +
      ") {";
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
    app.setCanvasResolution(
      config.project.settings.resolutionMode,
      config.project.settings.width,
      config.project.settings.height
    );
    app.setCanvasFillMode(
      config.project.settings.fillMode,
      config.project.settings.width,
      config.project.settings.height
    );
    reflow();
  };

  projectSettings.on("width:set", function (value) {
    config.project.settings.width = value;
    createCss();
    refreshResolutionProperties();
  });
  projectSettings.on("height:set", function (value) {
    config.project.settings.height = value;
    createCss();
    refreshResolutionProperties();
  });

  projectSettings.on("fillMode:set", function (value, oldValue) {
    config.project.settings.fillMode = value;
    if (canvas.classList) {
      if (oldValue) canvas.classList.remove("fill-mode-" + oldValue);

      canvas.classList.add("fill-mode-" + value);
    }

    refreshResolutionProperties();
  });

  projectSettings.on("resolutionMode:set", function (value) {
    config.project.settings.resolutionMode = value;
    refreshResolutionProperties();
  });

  projectSettings.on("useDevicePixelRatio:set", function (value) {
    config.project.settings.useDevicePixelRatio = value;
    app.graphicsDevice.maxPixelRatio = value ? window.devicePixelRatio : 1;
  });

  projectSettings.on("preferWebGl2:set", function (value) {
    config.project.settings.preferWebGl2 = value;
  });

  projectSettings.on("i18nAssets:set", function (value) {
    app.i18n.assets = value;
  });

  projectSettings.on("i18nAssets:insert", function (value) {
    app.i18n.assets = projectSettings.get("i18nAssets");
  });

  projectSettings.on("i18nAssets:remove", function (value) {
    app.i18n.assets = projectSettings.get("i18nAssets");
  });

  // locale change
  projectUserSettings.on("editor.locale:set", function (value) {
    if (value) {
      app.i18n.locale = value;
    }
  });

  projectSettings.on("*:set", function (path, value) {
    var parts;

    if (path.startsWith("batchGroups")) {
      parts = path.split(".");
      if (parts.length < 2) return;
      var groupId = parseInt(parts[1], 10);
      var groupSettings = projectSettings.get("batchGroups." + groupId);
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
    } else if (path.startsWith("layers")) {
      parts = path.split(".");
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
    } else if (path.startsWith("layerOrder.")) {
      parts = path.split(".");

      if (parts.length === 3) {
        if (parts[2] === "enabled") {
          var subLayerId = parseInt(parts[1]);
          // Unlike Editor, DON'T add 2 to subLayerId here
          app.scene.layers.subLayerEnabled[subLayerId] = value;
          editor.call("viewport:render");
        }
      }
    }
  });

  projectSettings.on("*:unset", function (path, value) {
    if (path.startsWith("batchGroups")) {
      var propNameParts = path.split(".")[1];
      if (propNameParts.length === 2) {
        var id = propNameParts[1];
        app.batcher.removeGroup(id);
      }
    } else if (path.startsWith("layers.")) {
      var parts = path.split(".");

      // remove layer
      var layer = layerIndex[parts[1]];
      if (layer) {
        app.scene.layers.remove(layer);
        delete layerIndex[parts[1]];
      }
    }
  });

  projectSettings.on("layerOrder:insert", function (value, index) {
    var id = value.get("layer");
    var layer = layerIndex[id];
    if (!layer) return;

    var transparent = value.get("transparent");

    if (transparent) {
      app.scene.layers.insertTransparent(layer, index);
    } else {
      app.scene.layers.insertOpaque(layer, index);
    }
  });

  projectSettings.on("layerOrder:remove", function (value) {
    var id = value.get("layer");
    var layer = layerIndex[id];
    if (!layer) return;

    var transparent = value.get("transparent");

    if (transparent) {
      app.scene.layers.removeTransparent(layer);
    } else {
      app.scene.layers.removeOpaque(layer);
    }
  });

  projectSettings.on("layerOrder:move", function (value, indNew, indOld) {
    var id = value.get("layer");
    var layer = layerIndex[id];
    if (!layer) return;

    var transparent = value.get("transparent");
    if (transparent) {
      app.scene.layers.removeTransparent(layer);
      app.scene.layers.insertTransparent(layer, indNew);
    } else {
      app.scene.layers.removeOpaque(layer);
      app.scene.layers.insertOpaque(layer, indNew);
    }
  });

  window.addEventListener("resize", reflow, false);
  window.addEventListener("orientationchange", reflow, false);

  reflow();

  // get application
  editor.method("viewport:app", function () {
    return app;
  });

  editor.on("entities:load", function (data) {
    hierarchy = true;
    sceneData = data;
    init();
  });

  editor.on("assets:load", function () {
    assets = true;
    init();
  });

  editor.on("sceneSettings:load", function (data) {
    settings = true;
    sceneSettings = data.json();
    init();
  });

  if (legacyScripts) {
    editor.on("sourcefiles:load", function (scripts) {
      scriptList = [];
      sourcefiles = true;
      init();
    });
  }

  createLoadingScreen();
});

/* launch/viewport-error-console.js */
editor.once("load", function () {
  "use strict";

  // console
  var panel = document.createElement("div");
  panel.id = "application-console";
  panel.classList.add("hidden");
  document.body.appendChild(panel);

  var errorCount = 0;

  panel.addEventListener(
    "mousedown",
    function (evt) {
      evt.stopPropagation();
    },
    false
  );
  panel.addEventListener(
    "click",
    function (evt) {
      evt.stopPropagation();
    },
    false
  );

  // close button img
  var closeBtn = document.createElement("div");
  closeBtn.innerHTML = "X";
  panel.appendChild(closeBtn);
  closeBtn.style.display = "none";
  closeBtn.addEventListener("click", function () {
    var i = panel.childNodes.length;
    while (i-- > 1) {
      panel.childNodes[i].parentElement.removeChild(panel.childNodes[i]);
    }

    panel.classList.add("hidden");
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
    var element = document.createElement("p");
    element.innerHTML = msg.replace(/\n/g, "<br/>");
    if (cls) element.classList.add(cls);

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

    panel.classList.remove("hidden");
    return element;
  };

  var onError = function (msg, url, line, col, e) {
    if (url) {
      // check if this is a playcanvas script
      var codeEditorUrl = "";
      var query = "";
      var target = null;
      var assetId = null;

      // if this is a playcanvas script
      // then create a URL that will open the code editor
      // at that line and column
      if (url.indexOf("api/files/code") !== -1) {
        var parts = url.split("//")[1].split("/");

        target = "/editor/code/" + parts[4] + "/";
        if (parts.length > 9) {
          target += parts.slice(9).join("/");
        } else {
          target += parts.slice(6).join("/");
        }

        codeEditorUrl = config.url.home + target;
        query = "?line=" + line + "&col=" + col + "&error=true";
      } else if (
        !editor.call("settings:project").get("useLegacyScripts") &&
        url.indexOf("/api/assets/") !== -1 &&
        url.indexOf(".js") !== -1
      ) {
        assetId = parseInt(url.match(/\/api\/assets\/files\/.+?id=([0-9]+)/)[1], 10);
        target = "codeeditor:" + config.project.id;
        codeEditorUrl = config.url.home + "/editor/code/" + config.project.id;
        query = "?tabs=" + assetId + "&line=" + line + "&col=" + col + "&error=true";
      } else {
        codeEditorUrl = url;
      }

      var slash = url.lastIndexOf("/");
      var relativeUrl = url.slice(slash + 1);
      errorCount++;

      append(
        pc.string.format(
          '<a href="{0}{1}" target="{2} class="code-link" id="{6}">[{3}:{4}]</a>: {5}',
          codeEditorUrl,
          query,
          target,
          relativeUrl,
          line,
          msg,
          "error-" + errorCount
        ),
        "error"
      );

      if (assetId) {
        var link = document.getElementById("error-" + errorCount);
        link.addEventListener("click", function (e) {
          var existing = window.open("", target);
          try {
            if (existing) {
              e.preventDefault();
              e.stopPropagation();

              if (existing.editor && existing.editor.isCodeEditor) {
                existing.editor.call("integration:selectWhenReady", assetId, {
                  line: line,
                  col: col,
                  error: true,
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
      if (e && e.stack) append(e.stack.replace(/ /g, "&nbsp;"), "trace");
    } else {
      // Chrome only shows 'Script error.' if the error comes from
      // a different domain.
      if (msg && msg !== "Script error.") {
        append(msg, "error");
      } else {
        append("Error loading scripts. Open the browser console for details.", "error");
      }
    }
  };

  // catch errors and show them to the console
  window.onerror = onError;

  // redirect console.error to the in-game console
  var consoleError = console.error;
  console.error = function (...args) {
    var errorPassed = false;
    consoleError(...args);

    args.forEach((item) => {
      if (item instanceof Error && item.stack) {
        var msg = item.message;
        var lines = item.stack.split("\n");
        if (lines.length >= 2) {
          var line = lines[1];
          var url = line.slice(line.indexOf("(") + 1);
          var m = url.match(/:[0-9]+:[0-9]+\)/);
          if (m) {
            url = url.slice(0, m.index);
            var parts = m[0].slice(1, -1).split(":");

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
        if (!errorPassed) append(item.message, "error");
      } else {
        append(item.toString(), "error");
      }
    });
  };
});

/* launch/tools.js */
var now = function () {
  return performance.timing.navigationStart + performance.now();
};

if (!performance || !performance.now || !performance.timing) now = Date.now;

var start = now();

editor.once("load", function () {
  "use strict";

  // times
  var timeBeginning = performance.timing ? performance.timing.responseEnd : start;
  var timeNow = now() - timeBeginning;
  var timeHover = 0;

  var epoc = !window.performance || !performance.now || !performance.timing;
  editor.method("tools:epoc", function () {
    return epoc;
  });

  editor.method("tools:time:now", function () {
    return now() - timeBeginning;
  });
  editor.method("tools:time:beginning", function () {
    return timeBeginning;
  });
  editor.method("tools:time:hover", function () {
    return timeHover;
  });

  editor.method("tools:time:toHuman", function (ms, precision) {
    var s = ms / 1000;
    var m = ("00" + Math.floor(s / 60)).slice(-2);
    if (precision) {
      s = ("00.0" + (s % 60).toFixed(precision)).slice(-4);
    } else {
      s = ("00" + Math.floor(s % 60)).slice(-2);
    }
    return m + ":" + s;
  });

  // root panel
  var root = document.createElement("div");
  root.id = "dev-tools";
  root.style.display = "none";
  document.body.appendChild(root);
  editor.method("tools:root", function () {
    return root;
  });

  // variabled
  var updateInterval;
  var enabled = false;

  if (location.search && location.search.indexOf("profile=true") !== -1) enabled = true;

  if (enabled) root.style.display = "block";

  // view
  var scale = 0.2; // how many pixels in a ms
  var capacity = 0; // how many ms can fit
  var scroll = {
    time: 0, // how many ms start from
    auto: true, // auto scroll to the end
    drag: {
      x: 0,
      time: 0,
      bar: false,
      barTime: 0,
      barMove: false,
    },
  };

  editor.method("tools:enabled", function () {
    return enabled;
  });

  editor.method("tools:enable", function () {
    if (enabled) return;

    enabled = true;
    root.style.display = "block";
    resize();
    editor.emit("tools:clear");
    editor.emit("tools:state", true);

    // updateInterval = setInterval(function() {
    //     update();
    //     editor.emit('tools:render');
    // }, 1000 / 60);
  });

  editor.method("tools:disable", function () {
    if (!enabled) return;

    enabled = false;
    root.style.display = "none";
    editor.emit("tools:clear");
    editor.emit("tools:state", false);
    // clearInterval(updateInterval);
  });

  // methods to access view params
  editor.method("tools:time:capacity", function () {
    return capacity;
  });
  editor.method("tools:scroll:time", function () {
    return scroll.time;
  });

  // size
  var left = 300;
  var right = 0;
  var width = 0;
  var height = 0;
  // resizing
  var resize = function () {
    var rect = root.getBoundingClientRect();

    if (width === rect.width && height === rect.height) return;

    width = rect.width;
    height = rect.height;
    capacity = Math.floor((width - left - right) / scale);
    scroll.time = Math.max(0, Math.min(timeNow - capacity, Math.floor(scroll.time)));

    editor.emit("tools:resize", width, height);
  };
  window.addEventListener("resize", resize, false);
  window.addEventListener("orientationchange", resize, false);
  setInterval(resize, 500);
  resize();
  editor.method("tools:size:width", function () {
    return width;
  });
  editor.method("tools:size:height", function () {
    return height;
  });

  editor.on("tools:clear", function () {
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
    hover: false,
  };

  var update = function () {
    timeNow = now() - timeBeginning;

    if (scroll.auto) scroll.time = Math.max(0, timeNow - capacity);

    if (mouse.click) {
      scroll.drag.x = mouse.x;
      scroll.drag.time = scroll.time;
      scroll.drag.bar = mouse.y < 23;
      if (scroll.drag.bar) {
        scroll.drag.barTime = (mouse.x / (width - 300)) * timeNow - scroll.time;
        scroll.drag.barMove = scroll.drag.barTime >= 0 && scroll.drag.barTime <= capacity;
      }
      scroll.auto = false;
      root.classList.add("dragging");
      editor.emit("tools:scroll:start");
    } else if (mouse.down) {
      if (scroll.drag.bar) {
        if (scroll.drag.barMove) {
          scroll.time = (mouse.x / (width - 300)) * timeNow - scroll.drag.barTime;
        } else {
          scroll.time = (mouse.x / (width - 300)) * timeNow - capacity / 2;
        }
      } else {
        scroll.time = scroll.drag.time + (scroll.drag.x - mouse.x) / scale;
      }
      scroll.time = Math.max(0, Math.min(timeNow - capacity, Math.floor(scroll.time)));
    } else if (mouse.up) {
      if (Math.abs(scroll.time + capacity - timeNow) < 32) scroll.auto = true;

      root.classList.remove("dragging");
      editor.emit("tools:scroll:end");
    }

    if (mouse.hover && !mouse.down) {
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

  root.addEventListener(
    "mousemove",
    function (evt) {
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
    },
    false
  );

  root.addEventListener(
    "mousedown",
    function (evt) {
      evt.stopPropagation();
      evt.preventDefault();

      if (evt.button !== 0 || mouse.click || mouse.down || !mouse.hover) return;

      mouse.click = true;
    },
    false
  );

  root.addEventListener(
    "mouseup",
    function (evt) {
      evt.stopPropagation();

      if (evt.button !== 0 || !mouse.down) return;

      mouse.down = false;
      mouse.up = true;
    },
    false
  );

  root.addEventListener(
    "mouseleave",
    function (evt) {
      mouse.hover = false;
      timeHover = 0;
      if (!mouse.down) return;

      mouse.down = false;
      mouse.up = true;
    },
    false
  );

  root.addEventListener(
    "mousewheel",
    function (evt) {
      evt.stopPropagation();

      if (!mouse.hover) return;

      scroll.time = Math.max(
        0,
        Math.min(timeNow - capacity, Math.floor(scroll.time + evt.deltaX / scale))
      );
      if (evt.deltaX < 0) {
        scroll.auto = false;
      } else if (Math.abs(scroll.time + capacity - timeNow) < 16) {
        scroll.auto = true;
      }
    },
    false
  );

  // alt + t
  window.addEventListener(
    "keydown",
    function (evt) {
      if (evt.keyCode === 84 && evt.altKey) {
        if (enabled) {
          editor.call("tools:disable");
        } else {
          editor.call("tools:enable");
        }
      }
    },
    false
  );

  var flushMouse = function () {
    if (mouse.up) mouse.up = false;

    if (mouse.click) {
      mouse.click = false;
      mouse.down = true;
    }
  };

  var app = editor.call("viewport:app");
  if (!app) return; // webgl not available

  var frame = 0;
  var frameLast = 0;

  var onFrame = function () {
    requestAnimationFrame(onFrame);

    if (enabled) {
      var now = Date.now();

      if (now - frameLast >= 40) {
        frameLast = now;

        update();
        editor.emit("tools:render");
      }
    }
  };
  requestAnimationFrame(onFrame);
});

/* launch/tools-overview.js */
editor.once("load", function () {
  "use strict";

  // variables
  var enabled = editor.call("tools:enabled");
  var scale = 0.2;
  var events = [];
  var eventsIndex = {};

  // canvas
  var canvas = document.createElement("canvas");
  canvas.classList.add("overview");
  editor.call("tools:root").appendChild(canvas);

  // context
  var ctx = canvas.getContext("2d");

  // resize
  editor.on("tools:resize", function (width, height) {
    canvas.width = width - 300 - 32;
    canvas.height = 24;
    scale = canvas.width / editor.call("tools:capacity");
    ctx.font = "10px Arial";
    render();
  });
  canvas.width = editor.call("tools:size:width") - 300 - 32;
  canvas.height = 24;
  ctx.font = "10px Arial";
  scale = canvas.width / editor.call("tools:capacity");

  editor.on("tools:clear", function () {
    events = [];
    eventsIndex = {};
  });

  editor.on("tools:timeline:add", function (item) {
    var found = false;

    // check if can extend existing event
    for (var i = 0; i < events.length; i++) {
      if (
        events[i].t2 !== null &&
        events[i].k === item.k &&
        events[i].t - 1 <= item.t &&
        (events[i].t2 === -1 || events[i].t2 + 1 >= item.t)
      ) {
        found = true;
        events[i].t2 = item.t2;
        eventsIndex[item.i] = events[i];
        break;
      }
    }

    if (!found) {
      var obj = {
        i: item.i,
        t: item.t,
        t2: item.t2,
        k: item.k,
      };
      events.push(obj);
      eventsIndex[obj.i] = obj;
    }
  });

  editor.on("tools:timeline:update", function (item) {
    if (!enabled || !eventsIndex[item.i]) return;

    eventsIndex[item.i].t2 = item.t2;
  });

  var render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var scaleMs = 1000 * scale;
    var now = editor.call("tools:time:now");
    var scrollTime = editor.call("tools:scroll:time");
    var capacity = editor.call("tools:time:capacity");
    var timeHover = editor.call("tools:time:hover");
    ctx.textBaseline = "alphabetic";

    var startX = (scrollTime / now) * canvas.width;
    var endX = (Math.min(now, scrollTime + capacity) / now) * canvas.width;

    // view rect
    ctx.beginPath();
    ctx.rect(startX, 0, endX - startX, canvas.height);
    ctx.fillStyle = "#303030";
    ctx.fill();
    // line bottom
    ctx.beginPath();
    ctx.moveTo(startX, canvas.height - 0.5);
    ctx.lineTo(endX, canvas.height - 0.5);
    ctx.strokeStyle = "#2c2c2c";
    ctx.stroke();

    // events
    var x, x2, e;
    for (var i = 0; i < events.length; i++) {
      e = events[i];
      x = (e.t / now) * canvas.width;

      if (events[i].t2 !== null) {
        var t2 = e.t2;
        if (e.t2 === -1) t2 = now;

        x2 = Math.max((t2 / now) * canvas.width, x + 1);

        ctx.beginPath();
        ctx.rect(x, Math.floor((canvas.height - 8) / 2), x2 - x, 8);
        ctx.fillStyle = editor.call("tools:timeline:color", e.k);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(x, 1);
        ctx.lineTo(x, canvas.height - 1);
        ctx.strokeStyle = editor.call("tools:timeline:color", e.k);
        ctx.stroke();
      }
    }

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";

    // start/end text
    ctx.fillStyle = "#fff";
    // start time
    ctx.textAlign = "left";
    ctx.strokeText("00:00.0 FPS", 2.5, canvas.height - 2.5);
    ctx.fillText("00:00.0 FPS", 2.5, canvas.height - 2.5);
    // now time
    ctx.textAlign = "right";
    ctx.strokeText(
      editor.call("tools:time:toHuman", now, 1),
      canvas.width - 2.5,
      canvas.height - 2.5
    );
    ctx.fillText(
      editor.call("tools:time:toHuman", now, 1),
      canvas.width - 2.5,
      canvas.height - 2.5
    );

    var startTextWidth = 0;
    ctx.textBaseline = "top";

    // view start
    if (scrollTime > 0) {
      var text = editor.call("tools:time:toHuman", scrollTime, 1);
      var measures = ctx.measureText(text);
      var offset = 2.5;
      if (startX + 2.5 + measures.width < endX - 2.5) {
        startTextWidth = measures.width;
        ctx.textAlign = "left";
      } else {
        offset = -2.5;
        ctx.textAlign = "right";
      }
      ctx.strokeText(text, startX + offset, 0);
      ctx.fillText(text, startX + offset, 0);
    }

    // view end
    if (scrollTime + capacity < now - 100) {
      var text = editor.call("tools:time:toHuman", Math.min(now, scrollTime + capacity), 1);
      var measures = ctx.measureText(text);
      var offset = 2.5;
      if (endX - 2.5 - measures.width - startTextWidth > startX + 2.5) {
        ctx.textAlign = "right";
        offset = -2.5;
      } else {
        ctx.textAlign = "left";
      }
      ctx.strokeText(text, endX + offset, 0);
      ctx.fillText(text, endX + offset, 0);
    }

    ctx.lineWidth = 1;
  };

  editor.on("tools:render", render);
});

/* launch/tools-timeline.js */
editor.once("load", function () {
  "use strict";

  // variables
  var enabled = editor.call("tools:enabled");
  var counter = 0;
  var frame = 0;
  var scale = 0.2;
  var events = [];
  var cacheAssetLoading = {};
  var cacheShaderCompile = [];
  var cacheShaderCompileEvents = [];
  var cacheLightmapper = null;
  var cacheLightmapperEvent = null;
  var app = editor.call("viewport:app");
  if (!app) return; // webgl not available

  // canvas
  var canvas = document.createElement("canvas");
  canvas.classList.add("timeline");
  editor.call("tools:root").appendChild(canvas);

  // context
  var ctx = canvas.getContext("2d");

  // resize
  editor.on("tools:resize", function (width, height) {
    canvas.width = width - 300 - 32;
    canvas.height = 275;
    scale = canvas.width / editor.call("tools:time:capacity");
    ctx.font = "10px Arial";
    render();
  });
  canvas.width = editor.call("tools:size:width") - 300 - 32;
  canvas.height = 275;
  ctx.font = "10px Arial";
  scale = canvas.width / editor.call("tools:time:capacity");

  editor.on("tools:clear", function () {
    events = [];
    cacheAssetLoading = {};
    cacheShaderCompile = [];
    cacheShaderCompileEvents = [];
  });

  editor.on("tools:state", function (state) {
    enabled = state;
  });

  // colors for different kinds of events
  var kindColors = {
    "": "#ff0",
    asset: "#6f6",
    shader: "#f60",
    update: "#06f",
    render: "#07f",
    physics: "#0ff",
    lightmap: "#f6f",
  };
  var kindColorsOverview = {
    "": "#ff0",
    asset: "#6f6",
    shader: "#f60",
    update: "#06f",
    render: "#07f",
    physics: "#0ff",
    lightmap: "#f6f",
  };
  editor.method("tools:timeline:color", function (kind) {
    return kindColorsOverview[kind] || "#fff";
  });

  // add event to history
  var addEvent = function (args) {
    if (!enabled) return;

    var e = {
      i: ++counter,
      t: args.time,
      t2: args.time2 || null,
      n: args.name || "",
      k: args.kind || "",
    };
    events.push(e);
    editor.emit("tools:timeline:add", e);
    return e;
  };
  editor.method("tools:timeline:add", addEvent);

  // subscribe to app reload start
  app.once("preload:start", function () {
    if (!enabled) return;

    addEvent({
      time: editor.call("tools:time:now"),
      name: "preload",
    });
  });

  // subscribe to app start
  app.once("start", function () {
    if (!enabled) return;

    addEvent({
      time: editor.call("tools:time:now"),
      name: "start",
    });
  });

  // render frames
  // app.on('frameEnd', function() {
  //     var e = addEvent(app.stats.frame.renderStart - editor.call('tools:time:beginning'), null, 'render');
  //     e.t2 = (app.stats.frame.renderStart - editor.call('tools:time:beginning')) + app.stats.frame.renderTime;
  // });

  // subscribe to asset loading start
  app.assets.on("load:start", function (asset) {
    if (!enabled) return;

    cacheAssetLoading[asset.id] = addEvent({
      time: editor.call("tools:time:now"),
      time2: -1,
      kind: "asset",
    });
  });

  // subscribe to asset loading end
  app.assets.on("load", function (asset) {
    if (!enabled || !cacheAssetLoading[asset.id]) return;

    cacheAssetLoading[asset.id].t2 = editor.call("tools:time:now");
    editor.emit("tools:timeline:update", cacheAssetLoading[asset.id]);
    delete cacheAssetLoading[asset.id];
  });

  var onShaderStart = function (evt) {
    if (!enabled) return;

    var time = evt.timestamp;
    if (editor.call("tools:epoc")) time -= editor.call("tools:time:beginning");

    var item = addEvent({
      time: time,
      time2: -1,
      kind: "shader",
    });

    cacheShaderCompile.push(evt.target);
    cacheShaderCompileEvents[cacheShaderCompile.length - 1] = item;
  };

  var onShaderEnd = function (evt) {
    if (!enabled) return;

    var ind = cacheShaderCompile.indexOf(evt.target);
    if (ind === -1) return;

    var time = evt.timestamp;
    if (editor.call("tools:epoc")) time -= editor.call("tools:time:beginning");

    cacheShaderCompileEvents[ind].t2 = time;
    editor.emit("tools:timeline:update", cacheShaderCompileEvents[ind]);
    cacheShaderCompile.splice(ind, 1);
    cacheShaderCompileEvents.splice(ind, 1);
  };

  var onLightmapperStart = function (evt) {
    if (!enabled) return;

    var time = evt.timestamp;
    if (editor.call("tools:epoc")) time -= editor.call("tools:time:beginning");

    var item = addEvent({
      time: time,
      time2: -1,
      kind: "lightmap",
    });

    cacheLightmapper = evt.target;
    cacheLightmapperEvent = item;
  };

  var onLightmapperEnd = function (evt) {
    if (!enabled) return;

    if (cacheLightmapper !== evt.target) return;

    var time = evt.timestamp;
    if (editor.call("tools:epoc")) time -= editor.call("tools:time:beginning");

    cacheLightmapperEvent.t2 = time;
    editor.emit("tools:timeline:update", cacheLightmapperEvent);
    cacheLightmapper = null;
  };

  // subscribe to shader compile and linking
  app.graphicsDevice.on("shader:compile:start", onShaderStart);
  app.graphicsDevice.on("shader:link:start", onShaderStart);
  app.graphicsDevice.on("shader:compile:end", onShaderEnd);
  app.graphicsDevice.on("shader:link:end", onShaderEnd);

  // subscribe to lightmapper baking
  app.graphicsDevice.on("lightmapper:start", onLightmapperStart);
  app.graphicsDevice.on("lightmapper:end", onLightmapperEnd);

  // add performance.timing events if available
  if (performance.timing) {
    // dom interactive
    addEvent({
      time: performance.timing.domInteractive - editor.call("tools:time:beginning"),
      name: "dom",
    });
    // document load
    addEvent({
      time: performance.timing.loadEventEnd - editor.call("tools:time:beginning"),
      name: "load",
    });
  }

  var render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var barMargin = 1;
    var barHeight = 8;
    var stack = [];
    var scaleMs = 1000 * scale;
    var now = editor.call("tools:time:now");
    var scrollTime = editor.call("tools:scroll:time");
    var timeHover = editor.call("tools:time:hover");
    ctx.textBaseline = "alphabetic";

    // grid
    var secondsX = Math.floor(canvas.width * scale);
    ctx.strokeStyle = "#2c2c2c";
    ctx.fillStyle = "#989898";
    var offset = scaleMs - ((scrollTime * scale) % scaleMs) - scaleMs;
    for (var x = 0; x <= secondsX; x++) {
      var barX = Math.floor(x * scaleMs + offset) + 0.5;
      if (x > 0) {
        ctx.beginPath();
        ctx.moveTo(barX, 0);
        ctx.lineTo(barX, canvas.height);
        ctx.stroke();
      }

      var s = Math.floor(x + scrollTime / 1000);
      var m = Math.floor(s / 60);
      s = s % 60;
      ctx.fillText((m ? m + "m " : "") + s + "s", barX + 2.5, canvas.height - 2.5);
    }

    // events
    var e,
      x = 0,
      x2 = 0,
      y;
    for (var i = 0; i < events.length; i++) {
      e = events[i];
      x = Math.floor((e.t - scrollTime) * scale);

      if (x > canvas.width) break;

      // time
      if (e.t2 !== null) {
        if (isNaN(e.t2)) {
          console.log(e);
          continue;
        }
        // range
        var t2 = e.t2 - scrollTime;
        if (e.t2 === -1) t2 = now - scrollTime;

        x2 = Math.max(Math.floor(t2 * scale), x + 1);

        if (x2 < 0) continue;

        y = 0;
        var foundY = false;
        for (var n = 0; n < stack.length; n++) {
          if (stack[n] < e.t) {
            stack[n] = t2 + scrollTime;
            y = n * (barHeight + barMargin);
            foundY = true;
            break;
          }
        }
        if (!foundY) {
          y = stack.length * (barHeight + barMargin);
          stack.push(t2 + scrollTime);
        }

        ctx.beginPath();
        ctx.rect(x + 0.5, y + 1, x2 - x + 0.5, barHeight);
        ctx.fillStyle = kindColors[e.k] || "#fff";
        ctx.fill();
      } else {
        if (x < 0) continue;

        // single event
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 1);
        ctx.lineTo(x + 0.5, canvas.height - 1);
        ctx.strokeStyle = kindColors[e.k] || "#fff";
        ctx.stroke();
      }
    }

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    for (var i = 0; i < events.length; i++) {
      e = events[i];
      x = Math.floor((e.t - scrollTime) * scale);

      if (x > canvas.width) break;

      if (e.t2 !== null || x < 0) continue;

      // name
      if (e.n) {
        ctx.fillStyle = kindColors[e.k] || "#fff";
        ctx.strokeText(e.n, x + 2.5, canvas.height - 12.5);
        ctx.strokeText((e.t / 1000).toFixed(2) + "s", x + 2.5, canvas.height - 2.5);
        ctx.fillText(e.n, x + 2.5, canvas.height - 12.5);
        ctx.fillText((e.t / 1000).toFixed(2) + "s", x + 2.5, canvas.height - 2.5);
      }
    }
    ctx.lineWidth = 1;

    // now
    ctx.beginPath();
    ctx.moveTo(Math.floor((now - scrollTime) * scale) + 0.5, 0);
    ctx.lineTo(Math.floor((now - scrollTime) * scale) + 0.5, canvas.height);
    ctx.strokeStyle = "#989898";
    ctx.stroke();

    // hover
    if (timeHover > 0) {
      var x = (timeHover - scrollTime) * scale;
      ctx.beginPath();
      ctx.moveTo(Math.floor(x) + 0.5, 0);
      ctx.lineTo(Math.floor(x) + 0.5, canvas.height);
      ctx.strokeStyle = "#989898";
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#000";
      ctx.fillStyle = "#fff";
      ctx.strokeText(
        (timeHover / 1000).toFixed(1) + "s",
        Math.floor(x) + 2.5,
        canvas.height - 22.5
      );
      ctx.fillText((timeHover / 1000).toFixed(1) + "s", Math.floor(x) + 2.5, canvas.height - 22.5);
      ctx.lineWidth = 1;
    }
  };

  editor.on("tools:render", render);
});

/* launch/tools-frame.js */
editor.once("load", function () {
  "use strict";

  var enabled = editor.call("tools:enabled");
  var app = editor.call("viewport:app");
  if (!app) return; // webgl not available

  editor.on("tools:state", function (state) {
    enabled = state;
  });

  var panel = document.createElement("div");
  panel.classList.add("frame");
  editor.call("tools:root").appendChild(panel);

  var addPanel = function (args) {
    var element = document.createElement("div");
    element.classList.add("panel");
    panel.appendChild(element);

    element._header = document.createElement("div");
    element._header.classList.add("header");
    element._header.textContent = args.title;
    element.appendChild(element._header);

    element._header.addEventListener(
      "click",
      function () {
        if (element.classList.contains("folded")) {
          element.classList.remove("folded");
        } else {
          element.classList.add("folded");
        }
      },
      false
    );

    return element;
  };

  var addField = function (args) {
    var row = document.createElement("div");
    row.classList.add("row");

    row._title = document.createElement("div");
    row._title.classList.add("title");
    row._title.textContent = args.title || "";
    row.appendChild(row._title);

    row._field = document.createElement("div");
    row._field.classList.add("field");
    row._field.textContent = args.value || "-";
    row.appendChild(row._field);

    Object.defineProperty(row, "value", {
      set: function (value) {
        this._field.textContent = value !== undefined ? value : "";
      },
    });

    return row;
  };
  editor.method("tools:frame:field:add", function (name, title, value) {
    var field = addField({
      title: title,
      value: value,
    });
    fieldsCustom[name] = field;
    panelApp.appendChild(field);
  });
  editor.method("tools:frame:field:value", function (name, value) {
    if (!fieldsCustom[name]) return;

    fieldsCustom[name].value = value;
  });

  // convert number of bytes to human form
  var bytesToHuman = function (bytes) {
    if (isNaN(bytes) || bytes === 0) return "0 B";
    var k = 1000;
    var sizes = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
  };

  // frame
  var panelFrame = addPanel({
    title: "Frame",
  });
  // scene
  var panelScene = addPanel({
    title: "Scene",
  });
  // drawCalls
  var panelDrawCalls = addPanel({
    title: "Draw Calls",
  });
  // batching
  var panelBatching = addPanel({
    title: "Batching",
  });
  // particles
  var panelParticles = addPanel({
    title: "Particles",
  });
  // shaders
  var panelShaders = addPanel({
    title: "Shaders",
  });
  // lightmapper
  var panelLightmap = addPanel({
    title: "Lightmapper",
  });
  // vram
  var panelVram = addPanel({
    title: "VRAM",
  });
  // app
  var panelApp = addPanel({
    title: "App",
  });

  var fieldsCustom = {};

  var fields = [
    {
      key: ["frame", "fps"],
      panel: panelFrame,
      title: "FPS",
      update: false,
    },
    {
      key: ["frame", "ms"],
      panel: panelFrame,
      title: "MS",
      format: function (value) {
        return value.toFixed(2);
      },
    },
    {
      key: ["frame", "cameras"],
      title: "Cameras",
      panel: panelFrame,
    },
    {
      key: ["frame", "cullTime"],
      title: "Cull Time",
      panel: panelFrame,
      format: function (value) {
        return value.toFixed(3);
      },
    },
    {
      key: ["frame", "sortTime"],
      title: "Sort Time",
      panel: panelFrame,
      format: function (value) {
        return value.toFixed(3);
      },
    },
    {
      key: ["frame", "shaders"],
      title: "Shaders",
      panel: panelFrame,
    },
    {
      key: ["frame", "materials"],
      title: "Materials",
      panel: panelFrame,
    },
    {
      key: ["frame", "triangles"],
      title: "Triangles",
      panel: panelFrame,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["frame", "otherPrimitives"],
      title: "Other Primitives",
      panel: panelFrame,
    },
    {
      key: ["frame", "shadowMapUpdates"],
      title: "ShadowMaps Updates",
      panel: panelFrame,
    },
    {
      key: ["frame", "shadowMapTime"],
      title: "ShadowMaps Time",
      panel: panelFrame,
      format: function (value) {
        return value.toFixed(2);
      },
    },
    {
      key: ["frame", "updateTime"],
      title: "Update Time",
      panel: panelFrame,
      format: function (value) {
        return value.toFixed(2);
      },
    },
    {
      key: ["frame", "physicsTime"],
      title: "Physics Time",
      panel: panelFrame,
      format: function (value) {
        return value.toFixed(2);
      },
    },
    {
      key: ["frame", "renderTime"],
      title: "Render Time",
      panel: panelFrame,
      format: function (value) {
        return value.toFixed(2);
      },
    },
    {
      key: ["frame", "forwardTime"],
      title: "Forward Time",
      panel: panelFrame,
      format: function (value) {
        return value.toFixed(2);
      },
    },
    {
      key: ["scene", "meshInstances"],
      title: "Mesh Instances",
      panel: panelScene,
    },
    {
      key: ["scene", "drawCalls"],
      title: "Draw Calls (potential)",
      panel: panelScene,
    },
    {
      key: ["scene", "lights"],
      title: "Lights",
      panel: panelScene,
    },
    {
      key: ["scene", "dynamicLights"],
      title: "Lights (Dynamic)",
      panel: panelScene,
    },
    {
      key: ["scene", "bakedLights"],
      title: "Lights (Baked)",
      panel: panelScene,
    },
    {
      key: ["drawCalls", "total"],
      title: "Total",
      panel: panelDrawCalls,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["drawCalls", "forward"],
      title: "Forward",
      panel: panelDrawCalls,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["drawCalls", "skinned"],
      title: "Skinned",
      panel: panelDrawCalls,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["drawCalls", "shadow"],
      title: "Shadow",
      panel: panelDrawCalls,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["drawCalls", "depth"],
      title: "Depth",
      panel: panelDrawCalls,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["drawCalls", "instanced"],
      title: "Instanced",
      panel: panelDrawCalls,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["drawCalls", "removedByInstancing"],
      title: "Instancing Benefit",
      panel: panelDrawCalls,
      format: function (value) {
        return "-" + value.toLocaleString();
      },
    },
    {
      key: ["drawCalls", "immediate"],
      title: "Immediate",
      panel: panelDrawCalls,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["drawCalls", "misc"],
      title: "Misc",
      panel: panelDrawCalls,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["batcher", "createTime"],
      title: "Create Time",
      panel: panelBatching,
      format: function (value) {
        return value.toFixed(2);
      },
    },
    {
      key: ["batcher", "updateLastFrameTime"],
      title: "Update Last Frame Time",
      panel: panelBatching,
      format: function (value) {
        return value.toFixed(2);
      },
    },
    {
      key: ["particles", "updatesPerFrame"],
      title: "Updates",
      panel: panelParticles,
    },
    {
      key: ["particles", "frameTime"],
      title: "Update Time",
      panel: panelParticles,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["shaders", "linked"],
      title: "Linked",
      panel: panelShaders,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["shaders", "vsCompiled"],
      title: "Compiled VS",
      panel: panelShaders,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["shaders", "fsCompiled"],
      title: "Compiled FS",
      panel: panelShaders,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["shaders", "materialShaders"],
      title: "Materials",
      panel: panelShaders,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["shaders", "compileTime"],
      title: "Compile Time",
      panel: panelShaders,
      format: function (value) {
        return value.toFixed(3);
      },
    },
    {
      key: ["lightmapper", "renderPasses"],
      title: "Render Passes",
      panel: panelLightmap,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["lightmapper", "lightmapCount"],
      title: "Textures",
      panel: panelLightmap,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["lightmapper", "shadersLinked"],
      title: "Shaders Linked",
      panel: panelLightmap,
      format: function (value) {
        return value.toLocaleString();
      },
    },
    {
      key: ["lightmapper", "totalRenderTime"],
      title: "Total Render Time",
      panel: panelLightmap,
      format: function (value) {
        return value.toFixed(3);
      },
    },
    {
      key: ["lightmapper", "forwardTime"],
      title: "Forward Time",
      panel: panelLightmap,
      format: function (value) {
        return value.toFixed(3);
      },
    },
    {
      key: ["lightmapper", "fboTime"],
      title: "FBO Time",
      panel: panelLightmap,
      format: function (value) {
        return value.toFixed(3);
      },
    },
    {
      key: ["lightmapper", "shadowMapTime"],
      title: "ShadowMap Time",
      panel: panelLightmap,
      format: function (value) {
        return value.toFixed(3);
      },
    },
    {
      key: ["lightmapper", "compileTime"],
      title: "Shader Compile Time",
      panel: panelLightmap,
      format: function (value) {
        return value.toFixed(3);
      },
    },
    {
      key: ["vram", "ib"],
      title: "Index Buffers",
      panel: panelVram,
      format: bytesToHuman,
    },
    {
      key: ["vram", "vb"],
      title: "Vertex Buffers",
      panel: panelVram,
      format: bytesToHuman,
    },
    {
      key: ["vram", "texShadow"],
      title: "Shadowmaps",
      panel: panelVram,
      format: bytesToHuman,
    },
    {
      key: ["vram", "texLightmap"],
      title: "Lightmaps",
      panel: panelVram,
      format: bytesToHuman,
    },
    {
      key: ["vram", "texAsset"],
      title: "Texture Assets",
      panel: panelVram,
      format: bytesToHuman,
    },
    {
      key: ["vram", "tex"],
      title: "Textures Other",
      panel: panelVram,
      format: function (bytes) {
        return bytesToHuman(
          bytes - (app.stats.vram.texLightmap + app.stats.vram.texShadow + app.stats.vram.texAsset)
        );
      },
    },
    {
      key: ["vram", "tex"],
      title: "Textures Total",
      panel: panelVram,
      format: bytesToHuman,
    },
    {
      key: ["vram", "totalUsed"],
      title: "Total",
      panel: panelVram,
      format: bytesToHuman,
    },
  ];

  // create fields
  for (var i = 0; i < fields.length; i++) {
    fields[i].field = addField({
      title: fields[i].title || fields[i].key[1],
    });
    fields[i].panel.appendChild(fields[i].field);

    if (fields[i].custom) fieldsCustom[fields[i].custom] = fields[i].field;
  }

  // controlls for skip rendering
  var row = document.createElement("div");
  row.classList.add("row");
  panelDrawCalls.appendChild(row);

  var title = document.createElement("div");
  title.classList.add("title");
  title.textContent = "Camera Drawcalls Limit";
  title.style.fontSize = "11px";
  row.appendChild(title);

  var cameras = document.createElement("select");
  cameras.classList.add("cameras");
  row.appendChild(cameras);
  cameras.addEventListener("mousedown", function (evt) {
    evt.stopPropagation();
  });
  cameras.addEventListener("change", function () {
    if (cameras.value === "none") {
      rowCameraSkip.style.display = "none";
      pc.skipRenderCamera = null;
    } else {
      rowCameraSkip.style.display = "";

      var entity = app.root.findByGuid(cameras.value);
      if (entity && entity.camera) {
        pc.skipRenderCamera = entity.camera.camera;
        pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
      }
    }
  });

  var cameraIndex = {};
  var cameraAddQueue = [];

  var cameraNone = document.createElement("option");
  cameraNone.value = "none";
  cameraNone.selected = true;
  cameraNone.textContent = "Disabled";
  cameras.appendChild(cameraNone);

  // frames control
  var rowCameraSkip = document.createElement("div");
  rowCameraSkip.classList.add("row");
  rowCameraSkip.style.display = "none";
  panelDrawCalls.appendChild(rowCameraSkip);

  var cameraSkipFramesLeft0 = document.createElement("div");
  cameraSkipFramesLeft0.classList.add("drawcallsLimitButton");
  cameraSkipFramesLeft0.textContent = "|<";
  cameraSkipFramesLeft0.addEventListener("click", function () {
    cameraSkipFrames.value = "0";
    pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
  });
  rowCameraSkip.appendChild(cameraSkipFramesLeft0);

  var cameraSkipFramesLeft10 = document.createElement("div");
  cameraSkipFramesLeft10.classList.add("drawcallsLimitButton");
  cameraSkipFramesLeft10.textContent = "<<";
  cameraSkipFramesLeft10.addEventListener("click", function () {
    cameraSkipFrames.value = Math.max(0, (parseInt(cameraSkipFrames.value, 10) || 0) - 10);
    pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
  });
  rowCameraSkip.appendChild(cameraSkipFramesLeft10);

  var cameraSkipFramesLeft1 = document.createElement("div");
  cameraSkipFramesLeft1.classList.add("drawcallsLimitButton");
  cameraSkipFramesLeft1.textContent = "<";
  cameraSkipFramesLeft1.addEventListener("click", function () {
    cameraSkipFrames.value = Math.max(0, (parseInt(cameraSkipFrames.value, 10) || 0) - 1);
    pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
  });
  rowCameraSkip.appendChild(cameraSkipFramesLeft1);

  var cameraSkipFrames = document.createElement("input");
  cameraSkipFrames.classList.add("framesSkip");
  cameraSkipFrames.type = "text";
  cameraSkipFrames.value = "0";
  rowCameraSkip.appendChild(cameraSkipFrames);
  cameraSkipFrames.addEventListener("mousedown", function (evt) {
    evt.stopPropagation();
  });
  cameraSkipFrames.addEventListener(
    "change",
    function () {
      pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
      pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
    },
    false
  );
  cameraSkipFrames.addEventListener("keydown", function (evt) {
    var inc = 0;

    if (evt.keyCode === 38) {
      inc = evt.shiftKey ? 10 : 1;
    } else if (evt.keyCode === 40) {
      inc = evt.shiftKey ? -10 : -1;
    }

    if (inc === 0) return;

    evt.preventDefault();
    evt.stopPropagation();

    cameraSkipFrames.value = Math.max(
      0,
      Math.min(Number.MAX_SAFE_INTEGER, (parseInt(cameraSkipFrames.value, 10) || 0) + inc)
    );
    pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
  });

  var cameraSkipFramesRight1 = document.createElement("div");
  cameraSkipFramesRight1.classList.add("drawcallsLimitButton");
  cameraSkipFramesRight1.textContent = ">";
  cameraSkipFramesRight1.addEventListener("click", function () {
    cameraSkipFrames.value = Math.min(
      Number.MAX_SAFE_INTEGER,
      (parseInt(cameraSkipFrames.value, 10) || 0) + 1
    );
    pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
  });
  rowCameraSkip.appendChild(cameraSkipFramesRight1);

  var cameraSkipFramesRight10 = document.createElement("div");
  cameraSkipFramesRight10.classList.add("drawcallsLimitButton");
  cameraSkipFramesRight10.textContent = ">>";
  cameraSkipFramesRight10.addEventListener("click", function () {
    cameraSkipFrames.value = Math.min(
      Number.MAX_SAFE_INTEGER,
      (parseInt(cameraSkipFrames.value, 10) || 0) + 10
    );
    pc.skipRenderAfter = parseInt(cameraSkipFrames.value, 10) || 0;
  });
  rowCameraSkip.appendChild(cameraSkipFramesRight10);

  var cameraAdd = function (id) {
    if (cameraAddQueue) {
      cameraAddQueue.push(id);
      return;
    }

    if (cameraIndex[id]) return;

    var entity = app.root.findByGuid(id);
    if (!entity) return;

    var option = (cameraIndex[id] = document.createElement("option"));
    option.value = id;
    option.entity = entity;
    option.textContent = entity.name;
    cameras.appendChild(option);
  };

  var cameraRemove = function (id) {
    if (!cameraIndex[id]) return;

    if (cameraIndex[id].selected) cameras.value = "none";

    cameras.removeChild(cameraIndex[id]);
    delete cameraIndex[id];
  };

  editor.on("entities:add", function (obj) {
    var id = obj.get("resource_id");

    obj.on("components.camera:set", function () {
      cameraAdd(id);
    });
    obj.on("components.camera:unset", function () {
      cameraRemove(id);
    });
    obj.on("name:set", function (value) {
      if (!cameraIndex[id]) return;

      cameraIndex.textContent = value;
    });

    if (obj.has("components.camera")) cameraAdd(id);
  });

  app.on("start", function () {
    if (cameraAddQueue) {
      var queue = cameraAddQueue;
      cameraAddQueue = null;

      for (var i = 0; i < queue.length; i++) cameraAdd(queue[i]);
    }
  });

  // update frame fields
  app.on("frameEnd", function () {
    if (!enabled) return;

    for (var i = 0; i < fields.length; i++) {
      if (fields[i].ignore) continue;

      if (
        !app.stats.hasOwnProperty(fields[i].key[0]) ||
        !app.stats[fields[i].key[0]].hasOwnProperty(fields[i].key[1])
      )
        continue;

      var value = app.stats[fields[i].key[0]][fields[i].key[1]];

      if (fields[i].format) value = fields[i].format(value);

      fields[i].field.value = value;
    }
  });
});

/* launch/tools-toolbar.js */
editor.once("load", function () {
  "use strict";

  // variables
  var toolbar = document.createElement("div");
  toolbar.classList.add("toolbar");
  editor.call("tools:root").appendChild(toolbar);

  // button close
  var btnClose = document.createElement("div");
  btnClose.innerHTML = "X";
  btnClose.classList.add("button");
  btnClose.style.backgroundColor = "teal";
  toolbar.appendChild(btnClose);
  btnClose.addEventListener("click", function () {
    editor.call("tools:disable");
  });
});

/* launch/entities.js */
editor.once("load", function () {
  "use strict";

  var entities = new ObserverList({
    index: "resource_id",
  });

  function createLatestFn(resourceId) {
    return function () {
      return entities.get(resourceId);
    };
  }

  // on adding
  entities.on("add", function (obj) {
    editor.emit("entities:add", obj);
  });

  editor.method("entities:add", function (obj) {
    entities.add(obj);

    // function to get latest version of entity observer
    obj.latestFn = createLatestFn(obj.get("resource_id"));
  });

  // on removing
  entities.on("remove", function (obj) {
    editor.emit("entities:remove", obj);
  });

  editor.method("entities:remove", function (obj) {
    entities.remove(obj);
  });

  // remove all entities
  editor.method("entities:clear", function () {
    entities.clear();
  });

  // Get entity by resource id
  editor.method("entities:get", function (resourceId) {
    return entities.get(resourceId);
  });

  editor.on("scene:raw", function (data) {
    for (var key in data.entities) {
      entities.add(new Observer(data.entities[key]));
    }

    editor.emit("entities:load", data);
  });
});

/* launch/entities-sync.js */
editor.once("load", function () {
  "use strict";

  var syncPaths = [
    "name",
    "parent",
    "children",
    "position",
    "rotation",
    "scale",
    "enabled",
    "template_id",
    "template_ent_ids",
    "components",
  ];

  editor.on("entities:add", function (entity) {
    if (entity.sync) return;

    entity.sync = new ObserverSync({
      item: entity,
      prefix: ["entities", entity.get("resource_id")],
      paths: syncPaths,
    });
  });

  // server > client
  editor.on("realtime:op:entities", function (op) {
    var entity = null;
    if (op.p[1]) entity = editor.call("entities:get", op.p[1]);

    if (op.p.length === 2) {
      if (op.hasOwnProperty("od")) {
        // delete entity
        if (entity) {
          editor.call("entities:remove", entity);
        } else {
          console.log("delete operation entity not found", op);
        }
      } else if (op.hasOwnProperty("oi")) {
        // new entity
        editor.call("entities:add", new Observer(op.oi));
      } else {
        console.log("unknown operation", op);
      }
    } else if (entity) {
      // write operation
      entity.sync.write(op);
    } else {
      console.log("unknown operation", op);
    }
  });
});

/* editor/schema/schema.js */
editor.once("load", function () {
  "use strict";

  /**
   * Gets the schema object that corresponds to the specified dot separated
   * path from the specified schema object.
   * @param {String} path The path separated by dots
   * @param {Object} schema The schema object
   * @returns {Object} The sub schema
   */
  var pathToSchema = function (path, schema) {
    if (typeof path === "string") {
      path = path.split(".");
    }

    if (typeof path === "number") {
      path = [path];
    }

    var result = schema;
    for (var i = 0, len = path.length; i < len; i++) {
      var p = path[i];
      if (result.$type === "map" && result.$of) {
        result = result.$of;
      } else if (result[p] || (result.$type && result.$type[p])) {
        result = result[p] || result.$type[p];
      } else if (
        (!isNaN(parseInt(p, 10)) && Array.isArray(result)) ||
        Array.isArray(result.$type)
      ) {
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
    if (typeof schema === "string") {
      if (schema === "map" || schema === "mixed") {
        schema = "object";
      }

      return schema.toLowerCase();
    }

    if (schema.$editorType) {
      return schema.$editorType;
    }

    if (Array.isArray(schema)) {
      if (schema[0] === "number" && fixedLength) {
        if (fixedLength === 2) {
          return "vec2";
        } else if (fixedLength === 3) {
          return "vec3";
        } else if (fixedLength === 4) {
          return "vec4";
        }
      }

      return "array:" + schemaToType(schema[0]);
    }

    if (schema.$type) {
      return schemaToType(schema.$type, schema.$length);
    }

    return "object";
  };

  /**
   * Gets the type of the specified schema object,
   * @param {Object} schemaField A field of the schema
   * @param {Boolean} fixedLength Whether this field has a fixed length if it's an array type
   * @returns {String} The type
   */
  editor.method("schema:getType", function (schemaField, fixedLength) {
    return schemaToType(schemaField, fixedLength);
  });

  /**
   * Gets the type of the specified path from the specified schema
   * @param {Object} schema The schema object
   * @param {String} path A path separated by dots
   * @param {String} The type
   */
  editor.method("schema:getTypeForPath", function (schema, path) {
    var subSchema = pathToSchema(path, schema);
    var type = subSchema && schemaToType(subSchema);

    if (!type) {
      console.warn("Unknown type for " + path);
      type = "string";
    }

    return type;
  });

  editor.method("schema:getMergeMethodForPath", function (schema, path) {
    var h = pathToSchema(path, schema);

    return h && h.$mergeMethod;
  });
});

/* editor/schema/schema-components.js */
editor.once("load", function () {
  "use strict";

  var projectSettings = editor.call("settings:project");

  var schema = config.schema.scene.entities.$of.components;

  var componentName;

  // make titles for each component
  for (componentName in schema) {
    var title;
    switch (componentName) {
      case "audiosource":
        title = "Audio Source";
        break;
      case "audiolistener":
        title = "Audio Listener";
        break;
      case "particlesystem":
        title = "Particle System";
        break;
      case "rigidbody":
        title = "Rigid Body";
        break;
      case "scrollview":
        title = "Scroll View";
        break;
      case "layoutgroup":
        title = "Layout Group";
        break;
      case "layoutchild":
        title = "Layout Child";
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
      return [projectSettings.get("width"), projectSettings.get("height")];
    };
    schema.screen.referenceResolution.$default = function () {
      return [projectSettings.get("width"), projectSettings.get("height")];
    };
  }

  if (schema.element) {
    schema.element.fontAsset.$default = function () {
      // Reuse the last selected font, if it still exists in the library
      var lastSelectedFontId = editor.call("settings:projectUser").get("editor.lastSelectedFontId");
      var lastSelectedFontStillExists =
        lastSelectedFontId !== -1 && !!editor.call("assets:get", lastSelectedFontId);

      if (lastSelectedFontStillExists) {
        return lastSelectedFontId;
      }

      // Otherwise, select the first available font in the library
      var firstAvailableFont = editor.call("assets:findOne", function (asset) {
        return !asset.get("source") && asset.get("type") === "font";
      });

      return firstAvailableFont ? parseInt(firstAvailableFont[1].get("id"), 10) : null;
    };
  }

  // Paths in components that represent assets.
  // Does not include asset script attributes.
  var assetPaths = [];
  var gatherAssetPathsRecursively = function (schemaField, path) {
    if (schemaField.$editorType === "asset" || schemaField.$editorType === "array:asset") {
      // this is for cases like components.model.mapping
      assetPaths.push(path);
      return;
    }

    for (var fieldName in schemaField) {
      if (fieldName.startsWith("$")) continue;

      var field = schemaField[fieldName];
      var type = editor.call("schema:getType", field);
      if (type === "asset" || type === "array:asset") {
        assetPaths.push(path + "." + fieldName);
      } else if (type === "object" && field.$of) {
        gatherAssetPathsRecursively(field.$of, path + "." + fieldName + ".*");
      }
    }
  };

  for (componentName in schema) {
    gatherAssetPathsRecursively(schema[componentName], "components." + componentName);
  }

  editor.method("components:assetPaths", function () {
    return assetPaths;
  });

  if (editor.call("settings:project").get("useLegacyScripts")) {
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

  editor.method("components:convertValue", function (component, property, value) {
    var result = value;

    if (value) {
      var data = schema[component];
      if (data && data[property]) {
        var type = editor.call("schema:getType", data[property]);
        switch (type) {
          case "rgb":
            result = new pc.Color(value[0], value[1], value[2]);
            break;
          case "rgba":
            result = new pc.Color(value[0], value[1], value[2], value[3]);
            break;
          case "vec2":
            result = new pc.Vec2(value[0], value[1]);
            break;
          case "vec3":
            result = new pc.Vec3(value[0], value[1], value[2]);
            break;
          case "vec4":
            result = new pc.Vec4(value[0], value[1], value[2], value[3]);
            break;
          case "curveset":
            result = new pc.CurveSet(value.keys);
            result.type = value.type;
            break;
          case "curve":
            result = new pc.Curve(value.keys);
            result.type = value.type;
            break;
          case "entity":
            result = value; // Entity fields should just be a string guid
            break;
        }
      }
    }

    // for batchGroupId convert null to -1 for runtime
    if (result === null && property === "batchGroupId") result = -1;

    return result;
  });

  editor.method("components:list", function () {
    var result = list.slice(0);
    var idx;

    // filter out zone (which is not really supported)
    if (!editor.call("users:hasFlag", "hasZoneComponent")) {
      idx = result.indexOf("zone");
      if (idx !== -1) {
        result.splice(idx, 1);
      }
    }

    return result;
  });

  editor.method("components:schema", function () {
    return schema;
  });

  editor.method("components:getDefault", function (component) {
    var result = {};
    for (var fieldName in schema[component]) {
      if (fieldName.startsWith("$")) continue;
      var field = schema[component][fieldName];
      if (field.hasOwnProperty("$default")) {
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

      if (typeof value === "function") {
        defaults[key] = value();
      }
    });
  }

  editor.method("components:getFieldsOfType", function (component, type) {
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
editor.once("load", function () {
  "use strict";

  var INVALID_TYPES = ["script", "folder", "bundle"];

  // stores <asset id, [bundle assets]> index for mapping
  // any asset it to the bundles that it's referenced from
  var bundlesIndex = {};

  // stores all bundle assets
  var bundleAssets = [];

  var addToIndex = function (assetIds, bundleAsset) {
    if (!assetIds) return;

    for (var i = 0; i < assetIds.length; i++) {
      if (!bundlesIndex[assetIds[i]]) {
        bundlesIndex[assetIds[i]] = [bundleAsset];
        editor.emit("assets:bundles:insert", bundleAsset, assetIds[i]);
      } else {
        if (bundlesIndex[assetIds[i]].indexOf(bundleAsset) === -1) {
          bundlesIndex[assetIds[i]].push(bundleAsset);
          editor.emit("assets:bundles:insert", bundleAsset, assetIds[i]);
        }
      }
    }
  };

  // fill bundlexIndex when a new bundle asset is added
  editor.on("assets:add", function (asset) {
    if (asset.get("type") !== "bundle") return;

    bundleAssets.push(asset);
    addToIndex(asset.get("data.assets"), asset);

    asset.on("data.assets:set", function (assetIds) {
      addToIndex(assetIds, asset);
    });

    asset.on("data.assets:insert", function (assetId) {
      addToIndex([assetId], asset);
    });

    asset.on("data.assets:remove", function (assetId) {
      if (!bundlesIndex[assetId]) return;
      var idx = bundlesIndex[assetId].indexOf(asset);
      if (idx !== -1) {
        bundlesIndex[assetId].splice(idx, 1);
        editor.emit("assets:bundles:remove", asset, assetId);
        if (!bundlesIndex[assetId].length) {
          delete bundlesIndex[assetId];
        }
      }
    });
  });

  // remove bundle asset from bundlesIndex when a bundle asset is
  // removed
  editor.on("assets:remove", function (asset) {
    if (asset.get("type") !== "bundle") return;

    var idx = bundleAssets.indexOf(asset);
    if (idx !== -1) {
      bundleAssets.splice(idx, 1);
    }

    for (var id in bundlesIndex) {
      idx = bundlesIndex[id].indexOf(asset);
      if (idx !== -1) {
        bundlesIndex[id].splice(idx, 1);
        editor.emit("assets:bundles:remove", asset, id);

        if (!bundlesIndex[id].length) {
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
  editor.method("assets:bundles:listForAsset", function (asset) {
    return bundlesIndex[asset.get("id")] || [];
  });

  /**
   * Returns a list of all the bundle assets
   * @returns {Observer[]} The bundle assets
   */
  editor.method("assets:bundles:list", function () {
    return bundleAssets.slice();
  });

  /**
   * Returns true if the specified asset id is in a bundle
   * @returns {Boolean} True of false
   */
  editor.method("assets:bundles:containAsset", function (assetId) {
    return !!bundlesIndex[assetId];
  });

  var isAssetValid = function (asset, bundleAsset) {
    var id = asset.get("id");
    if (asset.get("source")) return false;
    if (INVALID_TYPES.indexOf(asset.get("type")) !== -1) return false;

    if (bundleAsset) {
      var existingAssetIds = bundleAsset.getRaw("data.assets");
      if (existingAssetIds.indexOf(id) !== -1) return false;
    }

    return true;
  };

  /**
   * Checks if the specified asset is valid to be added to a bundle
   * with the specified existing asset ids
   */
  editor.method("assets:bundles:canAssetBeAddedToBundle", isAssetValid);

  /**
   * Adds assets to the bundle asset. Does not add already existing
   * assets or assets with invalid types.
   * @param {Observer[]} assets The assets to add to the bundle
   * @param {Observer} bundleAsset The bundle asset
   */
  editor.method("assets:bundles:addAssets", function (assets, bundleAsset) {
    var validAssets = assets.filter(function (asset) {
      return isAssetValid(asset, bundleAsset);
    });

    var len = validAssets.length;
    if (!len) return;

    var undo = function () {
      var asset = editor.call("assets:get", bundleAsset.get("id"));
      if (!asset) return;

      var history = asset.history.enabled;
      asset.history.enabled = false;
      for (var i = 0; i < len; i++) {
        asset.removeValue("data.assets", validAssets[i].get("id"));
      }
      asset.history.enabled = history;
    };

    var redo = function () {
      var asset = editor.call("assets:get", bundleAsset.get("id"));
      if (!asset) return;

      var history = asset.history.enabled;
      asset.history.enabled = false;
      for (var i = 0; i < len; i++) {
        if (isAssetValid(validAssets[i], asset)) {
          asset.insert("data.assets", validAssets[i].get("id"));
        }
      }
      asset.history.enabled = history;
    };

    redo();

    editor.call("history:add", {
      name: "asset." + bundleAsset.get("id") + ".data.assets",
      undo: undo,
      redo: redo,
    });

    return len;
  });

  /**
   * Removes the specified assets from the specified bundle asset
   * @param {Observer[]} assets The assets to remove
   * @param {Observer} bundleAsset The bundle asset
   */
  editor.method("assets:bundles:removeAssets", function (assets, bundleAsset) {
    var redo = function () {
      var asset = editor.call("assets:get", bundleAsset.get("id"));
      if (!asset) return;

      var history = asset.history.enabled;
      asset.history.enabled = false;
      for (var i = 0; i < assets.length; i++) {
        asset.removeValue("data.assets", assets[i].get("id"));
      }
      asset.history.enabled = history;
    };

    var undo = function () {
      var asset = editor.call("assets:get", bundleAsset.get("id"));
      if (!asset) return;

      var history = asset.history.enabled;
      asset.history.enabled = false;
      for (var i = 0; i < assets.length; i++) {
        if (isAssetValid(assets[i], asset)) {
          asset.insert("data.assets", assets[i].get("id"));
        }
      }
      asset.history.enabled = history;
    };

    redo();

    editor.call("history:add", {
      name: "asset." + bundleAsset.get("id") + ".data.assets",
      undo: undo,
      redo: redo,
    });
  });

  /**
   * Calculates the file size of a bundle Asset by adding up the file
   * sizes of all the assets it references.
   * @param {Observer} The bundle asset
   * @returns {Number} The file size
   */
  editor.method("assets:bundles:calculateSize", function (bundleAsset) {
    var size = 0;
    var assets = bundleAsset.get("data.assets");
    for (var i = 0; i < assets.length; i++) {
      var asset = editor.call("assets:get", assets[i]);
      if (!asset || !asset.has("file.size")) continue;

      size += asset.get("file.size");
    }
    return size;
  });
});

/* launch/viewport-binding-entities.js */
editor.once("load", function () {
  "use strict";

  var app = editor.call("viewport:app");
  if (!app) return; // webgl not available

  var initialEntitiesLoaded = false;

  // entities awaiting parent
  var awaitingParent = {};

  // queue for hierarchy resync
  var awaitingResyncHierarchy = false;

  var resyncHierarchy = function () {
    awaitingResyncHierarchy = false;

    // sync hierarchy
    app.root.syncHierarchy();
  };

  var createEntity = function (obj) {
    var entity = new pc.Entity(obj.get("name"));

    entity.setGuid(obj.get("resource_id"));
    entity.setLocalPosition(obj.get("position.0"), obj.get("position.1"), obj.get("position.2"));
    entity.setLocalEulerAngles(obj.get("rotation.0"), obj.get("rotation.1"), obj.get("rotation.2"));
    entity.setLocalScale(obj.get("scale.0"), obj.get("scale.1"), obj.get("scale.2"));
    entity._enabled = obj.has("enabled") ? obj.get("enabled") : true;

    if (obj.has("labels")) {
      obj.get("labels").forEach(function (label) {
        entity.addLabel(label);
      });
    }

    if (obj.has("tags")) {
      obj.get("tags").forEach(function (tag) {
        entity.tags.add(tag);
      });
    }

    entity.template = obj.get("template");

    return entity;
  };

  var processEntity = function (obj) {
    // create entity
    var entity = createEntity(obj);

    // add components
    var components = obj.json().components;
    for (var key in components) app.systems[key].addComponent(entity, components[key]);

    // parenting
    if (!obj.get("parent")) {
      // root
      app.root.addChild(entity);
    } else {
      // get parent
      var parent = editor.call("entities:get", obj.get("parent"));
      if (parent) {
        parent = app.root.findByGuid(parent.get("resource_id"));
      }

      if (!parent) {
        // if parent not available, then await
        if (!awaitingParent[obj.get("parent")]) awaitingParent[obj.get("parent")] = [];

        // add to awaiting children
        awaitingParent[obj.get("parent")].push(obj);
      } else {
        // if parent available, addChild
        parent.addChild(entity);
      }
    }

    // check if there are awaiting children
    if (awaitingParent[obj.get("resource_id")]) {
      // add all awaiting children
      for (var i = 0; i < awaitingParent[obj.get("resource_id")].length; i++) {
        var awaiting = awaitingParent[obj.get("resource_id")][i];
        entity.addChild(app.root.getByGuid(awaiting.get("resource_id")));
      }

      // delete awaiting queue
      delete awaitingParent[obj.get("resource_id")];
    }

    // queue resync hierarchy
    // done on timeout to allow bulk entity creation
    // without sync after each entity
    if (!awaitingResyncHierarchy) {
      awaitingResyncHierarchy = true;
      setTimeout(resyncHierarchy, 0);
    }

    return entity;
  };

  editor.on("entities:add", function (obj) {
    var sceneLoading = editor.call("isLoadingScene");
    if (!app.root.findByGuid(obj.get("resource_id")) && !sceneLoading) {
      // create entity if it does not exist and all initial entities have loaded
      processEntity(obj);
    }

    // subscribe to changes
    obj.on("*:set", function (path, value) {
      var entity = app.root.findByGuid(obj.get("resource_id"));
      if (!entity) return;

      if (path === "name") {
        entity.name = obj.get("name");
      } else if (path.startsWith("position")) {
        resetPhysics(entity);
      } else if (path.startsWith("rotation")) {
        resetPhysics(entity);
      } else if (path.startsWith("scale")) {
        resetPhysics(entity);
      } else if (path.startsWith("enabled")) {
        entity.enabled = obj.get("enabled");
      } else if (path.startsWith("parent")) {
        var parent = editor.call("entities:get", obj.get("parent"));
        if (parent && parent.entity && entity.parent !== parent.entity)
          entity.reparent(parent.entity);
      } else if (path === "components.model.type" && value === "asset") {
        // WORKAROUND
        // entity deletes asset when switching to primitive, restore it
        // do this in a timeout to allow the model type to change first
        setTimeout(function () {
          var assetId = obj.get("components.model.asset");
          if (assetId) entity.model.asset = assetId;
        });
      }
    });

    obj.on("tags:insert", function (value) {
      var entity = app.root.findByGuid(obj.get("resource_id"));
      if (entity) {
        entity.tags.add(value);
      }
    });

    obj.on("tags:remove", function (value) {
      var entity = app.root.findByGuid(obj.get("resource_id"));
      if (entity) {
        entity.tags.remove(value);
      }
    });

    var resetPhysics = function (entity) {
      var pos = obj.get("position");
      var rot = obj.get("rotation");
      var scale = obj.get("scale");

      // if the entity has an element component
      // then only set z and let the rest be handled
      // by the element component (unless autoWidth or autoHeight is true in which case we need to be able to modify position)
      if (!entity.element || entity.element.autoWidth || entity.element.autoHeight) {
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
      var childEntity = editor.call("entities:get", child);
      if (!childEntity) return;

      childEntity = app.root.findByGuid(childEntity.get("resource_id"));
      var parentEntity = app.root.findByGuid(obj.get("resource_id"));

      if (childEntity && parentEntity) {
        if (childEntity.parent) childEntity.parent.removeChild(childEntity);

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

    obj.on("children:insert", reparent);
    obj.on("children:move", reparent);
  });

  editor.on("entities:remove", function (obj) {
    var entity = app.root.findByGuid(obj.get("resource_id"));
    if (entity) {
      entity.destroy();
      editor.call("viewport:render");
    }
  });

  editor.on("entities:load", function () {
    initialEntitiesLoaded = true;
  });
});

/* launch/viewport-binding-components.js */
editor.once("load", function () {
  "use strict";

  var app = editor.call("viewport:app");
  if (!app) return; // webgl not available

  // converts the data to runtime types
  var runtimeComponentData = function (component, data) {
    var result = {};
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        result[key] = editor.call("components:convertValue", component, key, data[key]);
      }
    }

    return result;
  };

  editor.on("entities:add", function (obj) {
    // subscribe to changes
    obj.on("*:set", function (path, value) {
      if (obj._silent || !path.startsWith("components")) return;

      var entity = app.root.findByGuid(obj.get("resource_id"));
      if (!entity) return;

      var parts = path.split(".");
      var component = parts[1];
      var property = parts[2];

      if (!entity[component]) {
        if (!property) {
          // add component
          var data = runtimeComponentData(component, value);
          app.systems[component].addComponent(entity, data);

          // render
          editor.call("viewport:render");
        }
      } else if (property) {
        // edit component property
        if (
          component === "script" &&
          property === "scripts" &&
          !editor.call("settings:project").get("useLegacyScripts")
        ) {
          if (parts.length <= 3) return;

          var script = entity.script[parts[3]];

          if (parts.length === 4) {
            // new script
            var data = obj.get("components.script.scripts." + parts[3]);
            entity.script.create(parts[3], data);
          } else if (script && parts.length === 5 && parts[4] === "enabled") {
            // enabled
            script.enabled = value;
          } else if (
            script &&
            parts.length === 6 &&
            parts[4] === "attributes" &&
            !pc.createScript.reservedAttributes[parts[5]]
          ) {
            // set attribute
            script[parts[5]] = value;
            // TODO scripts2
            // check if attribute is new
          } else if (
            script &&
            parts.length > 6 &&
            parts[4] === "attributes" &&
            !pc.createScript.reservedAttributes[parts[5]]
          ) {
            // update attribute
            script[parts[5]] = obj.get(
              "components.script.scripts." + parts[3] + ".attributes." + parts[5]
            );
          }
        } else {
          if (component === "element") {
            if (property === "width") {
              // do not set width for elements with autoWidth or split horizontal anchors
              if (
                entity.element.autoWidth ||
                Math.abs(entity.element.anchor.x - entity.element.anchor.z) > 0.001
              ) {
                return;
              }
            } else if (property === "height") {
              // do not set height for elements with autoHeight or split vertical anchors
              if (
                entity.element.autoHeight ||
                Math.abs(entity.element.anchor.y - entity.element.anchor.w) > 0.001
              ) {
                return;
              }
            }
          }

          value = obj.get("components." + component + "." + property);
          var oldValue = entity[component][property];
          entity[component][property] = editor.call(
            "components:convertValue",
            component,
            property,
            value
          );
        }
      }
    });

    obj.on("*:unset", function (path) {
      if (obj._silent || !path.startsWith("components")) return;

      var entity = app.root.findByGuid(obj.get("resource_id"));
      if (!entity) return;

      var parts = path.split(".");
      var component = parts[1];
      var property = parts[2];

      if (property) {
        if (
          component === "script" &&
          property === "scripts" &&
          !editor.call("settings:project").get("useLegacyScripts")
        ) {
          if (!entity.script || parts.length <= 3) return;

          var script = entity.script[parts[3]];
          if (!script) return;

          if (parts.length === 4) {
            // remove script
            entity.script.destroy(parts[3]);
          } else if (
            parts.length === 6 &&
            parts[4] === "attributes" &&
            !pc.createScript.reservedAttributes[parts[5]]
          ) {
            // unset attribute
            delete script[parts[5]];
            delete script.__attributes[parts[5]];
          } else if (
            parts.length > 6 &&
            parts[4] === "attributes" &&
            !pc.createScript.reservedAttributes[parts[5]]
          ) {
            // update attribute
            script[parts[5]] = obj.get(
              "components.script.scripts." + parts[3] + ".attributes." + parts[5]
            );
          }
        } else {
          // edit component property
          var value = obj.get("components." + component + "." + property);
          entity[component][property] = editor.call(
            "components:convertValue",
            component,
            property,
            value
          );
        }
      } else if (entity[component]) {
        // remove component
        app.systems[component].removeComponent(entity);
      }
    });

    var setComponentProperty = function (path, value, ind) {
      if (obj._silent || !path.startsWith("components")) return;

      var entity = app.root.findByGuid(obj.get("resource_id"));
      if (!entity) return;

      var parts = path.split(".");
      var component = parts[1];
      var property = parts[2];

      if (property) {
        if (component === "script") {
          if (property === "order") {
            // update script order
            entity.script.move(value, ind);
          } else if (property === "scripts") {
            if (!entity.script || parts.length <= 3) return;

            var script = entity.script[parts[3]];
            if (!script) return;

            if (
              parts.length > 6 &&
              parts[4] === "attributes" &&
              !pc.createScript.reservedAttributes[parts[5]]
            ) {
              // update attribute
              script[parts[5]] = obj.get(
                "components.script.scripts." + parts[3] + ".attributes." + parts[5]
              );
            }
          }
        } else {
          // edit component property
          value = obj.get("components." + component + "." + property);
          entity[component][property] = editor.call(
            "components:convertValue",
            component,
            property,
            value
          );
        }
      }
    };

    obj.on("*:insert", setComponentProperty);
    obj.on("*:remove", setComponentProperty);
    obj.on("*:move", setComponentProperty);
  });
});

/* launch/viewport-binding-assets.js */
editor.once("load", function () {
  "use strict";

  var app = editor.call("viewport:app");
  if (!app) return; // webgl not available

  var regexFrameUpdate = /^data\.frames\.(\d+)/;
  var regexFrameRemove = /^data\.frames\.(\d+)$/;
  var regexI18n = /^i18n\.[^\.]+?$/;

  var attachSetHandler = function (asset) {
    // do only for target assets
    if (asset.get("source")) return;

    var timeout;
    var updatedFields = {};

    var onChange = function (path, value) {
      var realtimeAsset = app.assets.get(asset.get("id"));
      var parts = path.split(".");

      updatedFields[parts[0]] = true;
      if (timeout) clearTimeout(timeout);

      // do the update in a timeout to avoid rapid
      // updates to the same fields
      timeout = setTimeout(function () {
        for (var key in updatedFields) {
          var raw = asset.get(key);

          // do not hot-reload script if it has no `swap` methods already defined
          if (
            key === "file" &&
            asset.get("type") === "script" &&
            realtimeAsset.data &&
            realtimeAsset.data.scripts
          ) {
            var swappable = false;

            for (var script in realtimeAsset.data.scripts) {
              var scriptType = app.scripts.get(script);
              if (scriptType && scriptType.prototype.hasOwnProperty("swap")) {
                swappable = true;
                break;
              }
            }

            if (!swappable) continue;
          }

          // this will trigger the 'update' event on the asset in the engine
          // handling all resource loading automatically
          realtimeAsset[key] = raw;
        }

        timeout = null;
      });
    };

    // attach update handler
    asset.on("*:set", function (path, value) {
      // handle i18n changes
      if (regexI18n.test(path)) {
        var parts = path.split(".");
        var realtimeAsset = app.assets.get(asset.get("id"));
        if (realtimeAsset) {
          realtimeAsset.addLocalizedAssetId(parts[1], value);
        }
      } else if (asset.get("type") === "textureatlas") {
        // handle texture atlases specifically for better performance
        var realtimeAsset = app.assets.get(asset.get("id"));
        if (!realtimeAsset) return;

        var match = path.match(regexFrameUpdate);
        if (match) {
          var frameKey = match[1];
          var frame = asset.get("data.frames." + frameKey);
          if (realtimeAsset.resource) {
            if (frame) {
              realtimeAsset.resource.setFrame(frameKey, {
                rect: new pc.Vec4(frame.rect),
                pivot: new pc.Vec2(frame.pivot),
                border: new pc.Vec4(frame.border),
              });
            }
          }

          if (!realtimeAsset.data.frames) {
            realtimeAsset.data.frames = {};
          }

          realtimeAsset.data.frames[frameKey] = frame;
        }
      } else {
        // everything else
        onChange(path, value);
      }
    });
    asset.on("*:unset", function (path, value) {
      // handle deleting i18n
      if (regexI18n.test(path)) {
        var realtimeAsset = app.assets.get(asset.get("id"));
        if (realtimeAsset) {
          var parts = path.split(".");
          realtimeAsset.removeLocalizedAssetId(parts[1]);
        }
      } else if (asset.get("type") === "textureatlas") {
        // handle deleting frames from texture atlas
        var realtimeAsset = app.assets.get(asset.get("id"));
        if (!realtimeAsset) return;

        var match = path.match(regexFrameRemove);
        if (match) {
          var frameKey = match[1];
          if (realtimeAsset.resource) {
            realtimeAsset.resource.removeFrame(frameKey);
          }

          if (realtimeAsset.data.frames && realtimeAsset.data.frames[frameKey]) {
            delete realtimeAsset.data.frames[frameKey];
          }

          editor.call("viewport:render");
        }
      } else {
        // everything else
        onChange(path, value);
      }
    });

    // handle changing sprite frame keys
    if (asset.get("type") === "sprite") {
      var onFrameKeys = function () {
        var realtimeAsset = app.assets.get(asset.get("id"));
        if (realtimeAsset) {
          if (realtimeAsset.resource) {
            realtimeAsset.resource.frameKeys = asset.get("data.frameKeys");
          }

          realtimeAsset.data.frameKeys = asset.get("data.frameKeys");
        }
      };

      asset.on("data.frameKeys:set", onFrameKeys);
      asset.on("data.frameKeys:insert", onFrameKeys);
      asset.on("data.frameKeys:remove", onFrameKeys);
      asset.on("data.frameKeys:move", onFrameKeys);
    }

    // tags add
    asset.on("tags:insert", function (tag) {
      app.assets.get(asset.get("id")).tags.add(tag);
    });
    // tags remove
    asset.on("tags:remove", function (tag) {
      app.assets.get(asset.get("id")).tags.remove(tag);
    });
  };

  // after all initial assets are loaded...
  editor.on("assets:load", function () {
    var assets = editor.call("assets:list");
    assets.forEach(attachSetHandler);

    // add assets to asset registry
    editor.on("assets:add", function (asset) {
      // do only for target assets
      if (asset.get("source")) return;

      // raw json data
      var assetJson = asset.json();

      // engine data
      var data = {
        id: parseInt(assetJson.id, 10),
        name: assetJson.name,
        tags: assetJson.tags,
        file: assetJson.file
          ? {
              filename: assetJson.file.filename,
              url: assetJson.file.url,
              hash: assetJson.file.hash,
              size: assetJson.file.size,
              variants: assetJson.file.variants || null,
            }
          : null,
        data: assetJson.data,
        type: assetJson.type,
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
    editor.on("assets:remove", function (asset) {
      var realtimeAsset = app.assets.get(asset.get("id"));
      if (realtimeAsset) app.assets.remove(realtimeAsset);
    });
  });
});

/* launch/viewport-binding-scene.js */
editor.once("load", function () {
  "use strict";

  editor.on("sceneSettings:load", function (sceneSettings) {
    var app = editor.call("viewport:app");
    if (!app) return; // webgl not available

    var updating;

    // queue settings apply
    var queueApplySettings = function () {
      if (updating) return;

      updating = true;

      setTimeout(applySettings, 1000 / 30);
    };

    // apply settings
    var applySettings = function () {
      updating = false;

      app.applySceneSettings(sceneSettings.json());
    };

    // on settings change
    sceneSettings.on("*:set", queueApplySettings);

    // initialize
    queueApplySettings();
  });
});

/* launch/viewport-scene-handler.js */
editor.once("load", function () {
  "use strict";

  var app = editor.call("viewport:app");
  if (!app) return; // webgl not available

  app.loader.removeHandler("scene");
  app.loader.removeHandler("hierarchy");
  app.loader.removeHandler("scenesettings");

  var loadSceneByItemId = function (itemId, callback) {
    // Get a specific scene from the server and pass result to callback
    callback();
    // Ajax({
    //   url: "{{url.api}}/scenes/" + itemId + "?branchId=" + config.self.branch.id,
    //   cookies: true,
    // })
    //   .on("error", function (status, data) {
    //     if (callback) {
    //       callback(data);
    //     }
    //   })
    //   .on("load", function (status, data) {
    //     if (callback) {
    //       callback(null, data);
    //     }
    //   });
  };

  var SharedSceneHandler = function (app, handler) {
    this._app = app;
    this._handler = handler;
  };

  SharedSceneHandler.prototype = {
    load: function (url, callback, settingsOnly) {
      var id = parseInt(url.replace("/api/", "").replace(".json", ""));

      if (typeof id === "number") {
        // load scene from server to get its unique id
        loadSceneByItemId(id, function (err, scene) {
          if (err) {
            return callback(err);
          }

          editor.call("loadScene", scene.uniqueId, callback, settingsOnly);
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
    },
  };
  app.loader.addHandler("scene", new SharedSceneHandler(app, new pc.SceneHandler(app)));

  var SharedHierarchyHandler = function (app, handler) {
    this._app = app;
    this._handler = handler;
  };

  SharedHierarchyHandler.prototype = {
    load: function (url, callback, settingsOnly) {
      var id = parseInt(url.replace("/api/", "").replace(".json", ""));
      if (typeof id === "number") {
        loadSceneByItemId(id, function (err, scene) {
          if (err) {
            return callback(err);
          }

          editor.call(
            "loadScene",
            scene.uniqueId,
            function (err, scene) {
              // do this in a timeout so that any errors raised while
              // initializing scripts are not swallowed by the connection error handler
              setTimeout(function () {
                callback(err, scene);
              });
            },
            settingsOnly
          );
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
    },
  };
  app.loader.addHandler("hierarchy", new SharedHierarchyHandler(app, new pc.HierarchyHandler(app)));

  var SharedSceneSettingsHandler = function (app, handler) {
    this._app = app;
    this._handler = handler;
  };

  SharedSceneSettingsHandler.prototype = {
    load: function (url, callback) {
      if (typeof url === "string") {
        url = {
          load: url,
          original: url,
        };
      }

      var id = parseInt(url.original.replace("/api/", "").replace(".json", ""));
      if (typeof id === "number") {
        loadSceneByItemId(id, function (err, scene) {
          if (err) {
            return callback(err);
          }

          editor.call(
            "loadScene",
            scene.uniqueId,
            function (err, scene) {
              callback(err, scene);
            },
            true
          );
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
    },
  };
  app.loader.addHandler(
    "scenesettings",
    new SharedSceneSettingsHandler(app, new pc.SceneSettingsHandler(app))
  );
});

/* launch/viewport-connection.js */
editor.once("load", function () {
  "use strict";

  var timeout;

  var icon = document.createElement("img");
  icon.classList.add("connecting");
  //   icon.src =
  // "https://s3-eu-west-1.amazonaws.com/static.playcanvas.com/platform/images/loader_transparent.gif";
  icon.width = 32;
  icon.height = 32;

  var hidden = true;

  editor.on("realtime:connected", function () {
    if (!hidden) {
      document.body.removeChild(icon);
      hidden = true;
    }
  });

  editor.on("realtime:disconnected", function () {
    if (hidden) {
      document.body.appendChild(icon);
      hidden = false;
    }
  });

  editor.on("realtime:error", function (err) {
    console.error(err);
  });
});

/* launch/assets.js */
editor.once("load", function () {
  "use strict";

  var uniqueIdToItemId = {};

  var assets = new ObserverList({
    index: "id",
  });

  function createLatestFn(id) {
    // function to get latest version of asset observer
    return function () {
      return assets.get(id);
    };
  }

  // list assets
  editor.method("assets:list", function () {
    return assets.array();
  });

  // allow adding assets
  editor.method("assets:add", function (asset) {
    uniqueIdToItemId[asset.get("uniqueId")] = asset.get("id");

    // function to get latest version of asset observer
    asset.latestFn = createLatestFn(asset.get("id"));

    assets.add(asset);
  });

  // allow removing assets
  editor.method("assets:remove", function (asset) {
    assets.remove(asset);
    asset.destroy();
  });

  // remove all assets
  editor.method("assets:clear", function () {
    assets.clear();
    uniqueIdToItemId = {};
  });

  // get asset by item id
  editor.method("assets:get", function (id) {
    return assets.get(id);
  });

  // get asset by unique id
  editor.method("assets:getUnique", function (uniqueId) {
    var id = uniqueIdToItemId[uniqueId];
    return id ? assets.get(id) : null;
  });

  // find assets by function
  editor.method("assets:find", function (fn) {
    return assets.find(fn);
  });

  // find one asset by function
  editor.method("assets:findOne", function (fn) {
    return assets.findOne(fn);
  });

  // publish added asset
  assets.on("add", function (asset) {
    editor.emit("assets:add[" + asset.get("id") + "]", asset);
    editor.emit("assets:add", asset);
  });

  // publish remove asset
  assets.on("remove", function (asset) {
    editor.emit("assets:remove", asset);
    delete uniqueIdToItemId[asset.get("id")];
  });
});

/* launch/assets-sync.js */
editor.once("load", function () {
  "use strict";

  var app = editor.call("viewport:app");
  if (!app) return; // webgl not available

  var settings = editor.call("settings:project");
  var docs = {};

  var assetNames = {};

  var queryParams = new pc.URI(window.location.href).getQuery();
  var concatenateScripts = queryParams.concatenateScripts === "true";
  var concatenatedScriptsUrl =
    "/projects/" +
    config.project.id +
    "/concatenated-scripts/scripts.js?branchId=" +
    config.self.branch.id;
  var useBundles = queryParams.useBundles !== "false";

  editor.method("loadAsset", function (uniqueId, callback) {
    var connection = editor.call("realtime:connection");

    var doc = connection.get("assets", "" + uniqueId);

    docs[uniqueId] = doc;

    // error
    doc.on("error", function (err) {
      if (connection.state === "connected") {
        console.log(err);
        return;
      }

      editor.emit("realtime:assets:error", err);
    });

    // ready to sync
    doc.on("load", function () {
      var assetData = doc.data;
      if (!assetData) {
        console.error("Could not load asset: " + uniqueId);
        doc.unsubscribe();
        doc.destroy();
        return callback && callback();
      }

      // notify of operations
      doc.on("op", function (ops, local) {
        if (local) return;

        for (var i = 0; i < ops.length; i++) {
          editor.emit("realtime:op:assets", ops[i], uniqueId);
        }
      });

      assetData.id = parseInt(assetData.item_id, 10);
      assetData.uniqueId = parseInt(uniqueId, 10);

      // delete unecessary fields
      delete assetData.item_id;
      delete assetData.branch_id;

      if (assetData.file) {
        if (
          concatenateScripts &&
          assetData.type === "script" &&
          assetData.preload &&
          !assetData.data.loadingType
        ) {
          assetData.file.url = concatenatedScriptsUrl;
        } else {
          assetData.file.url = getFileUrl(
            assetData.path,
            assetData.id,
            assetData.revision,
            assetData.file.filename
          );
        }

        if (assetData.file.variants) {
          for (var key in assetData.file.variants) {
            assetData.file.variants[key].url = getFileUrl(
              assetData.path,
              assetData.id,
              assetData.revision,
              assetData.file.variants[key].filename
            );
          }
        }
      }

      var asset = editor.call("assets:get", assetData.id);
      // asset can exist if we are reconnecting to c3
      var assetExists = !!asset;

      if (!assetExists) {
        var options = null;

        // allow duplicate values in data.frameKeys of sprite asset
        if (assetData.type === "sprite") {
          options = {
            pathsWithDuplicates: ["data.frameKeys"],
          };
        }

        asset = new Observer(assetData, options);
        editor.call("assets:add", asset);

        var _asset = (asset.asset = new pc.Asset(
          assetData.name,
          assetData.type,
          assetData.file,
          assetData.data
        ));
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

        if (asset.get("type") !== "script" || !asset.get("preload")) {
          // app.assets.add(_asset);
        }
      } else {
        for (var key in assetData) asset.set(key, assetData[key]);
      }

      if (callback) callback(asset);
    });

    // subscribe for realtime events
    doc.subscribe();
  });

  var createEngineAsset = function (asset, wasmAssetIds) {
    // if engine asset already exists return
    if (app.assets.get(asset.get("id"))) return;

    // handle bundle assets
    if (useBundles && asset.get("type") === "bundle") {
      var sync = asset.sync.enabled;
      asset.sync.enabled = false;

      // get the assets in this bundle
      // that have a file
      var assetsInBundle = asset
        .get("data.assets")
        .map(function (id) {
          return editor.call("assets:get", id);
        })
        .filter(function (asset) {
          return asset && asset.has("file.filename");
        });

      if (assetsInBundle.length) {
        // set the main filename and url for the bundle asset
        asset.set("file", {});
        asset.set("file.filename", asset.get("name") + ".tar");
        asset.set(
          "file.url",
          getFileUrl(
            asset.get("path"),
            asset.get("id"),
            asset.get("revision"),
            asset.get("file.filename")
          )
        );

        // find assets with variants
        var assetsWithVariants = assetsInBundle.filter(function (asset) {
          return asset.has("file.variants");
        });

        ["dxt", "etc1", "etc2", "pvr", "basis"].forEach(function (variant) {
          // search for assets with the specified variants and if some
          // exist then generate the variant file
          for (var i = 0, len = assetsWithVariants.length; i < len; i++) {
            if (assetsWithVariants[i].has("file.variants." + variant)) {
              if (!asset.has("file.variants")) {
                asset.set("file.variants", {});
              }

              var filename = asset.get("name") + "-" + variant + ".tar";
              asset.set("file.variants." + variant, {
                filename: filename,
                url: getFileUrl(
                  asset.get("path"),
                  asset.get("id"),
                  asset.get("revision"),
                  filename
                ),
              });
              return;
            }
          }
        });
      }

      asset.sync.enabled = sync;
    }

    if (useBundles && asset.get("type") !== "bundle") {
      // if the asset is in a bundle then replace its url with the url that it's supposed to have in the bundle
      if (editor.call("assets:bundles:containAsset", asset.get("id"))) {
        var file = asset.get("file");
        if (file) {
          var sync = asset.sync.enabled;
          asset.sync.enabled = false;

          asset.set(
            "file.url",
            getFileUrl(
              asset.get("path"),
              asset.get("id"),
              asset.get("revision"),
              file.filename,
              true
            )
          );
          if (file.variants) {
            for (var key in file.variants) {
              asset.set(
                "file.variants." + key + ".url",
                getFileUrl(
                  asset.get("path"),
                  asset.get("id"),
                  asset.get("revision"),
                  file.variants[key].filename,
                  true
                )
              );
            }
          }

          asset.sync.enabled = sync;
        }
      }
    }

    // create the engine asset
    var assetData = asset.json();
    var engineAsset = (asset.asset = new pc.Asset(
      assetData.name,
      assetData.type,
      assetData.file,
      assetData.data
    ));
    engineAsset.id = parseInt(assetData.id, 10);
    engineAsset.preload = assetData.preload ? assetData.preload : false;
    if (assetData.type === "script" && assetData.data && assetData.data.loadingType > 0) {
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
    editor.call("assets:progress", 0.5);

    var total = 0;
    if (!total) {
      editor.call("assets:progress", 1);
      editor.emit("assets:load");
    }

    var count = 0;
    var scripts = {};

    var legacyScripts = settings.get("useLegacyScripts");

    // get the set of wasm asset ids i.e. the wasm module ids and linked glue/fallback
    // script ids. the list is used to suppress the asset system from the loading
    // the scripts again.
    var getWasmAssetIds = function () {
      var result = {};
      editor.call("assets:list").forEach(function (a) {
        var asset = a.asset;
        if (asset.type !== "wasm" || !asset.data) {
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
      var order = settings.get("scripts");

      for (var i = 0; i < order.length; i++) {
        if (!scripts[order[i]]) continue;

        var asset = editor.call("assets:get", order[i]);
        if (asset) {
          createEngineAsset(asset, wasmAssetIds);
        }
      }
    };

    var load = function (uniqueId) {
      editor.call("loadAsset", uniqueId, function (asset) {
        count++;
        editor.call("assets:progress", (count / total) * 0.5 + 0.5);

        if (!legacyScripts && asset && asset.get("type") === "script")
          scripts[asset.get("id")] = asset;

        if (count === total) {
          var wasmAssetIds = getWasmAssetIds();

          if (!legacyScripts) loadScripts(wasmAssetIds);

          // sort assets by script first and then by bundle
          var assets = editor.call("assets:list");
          assets.sort(function (a, b) {
            var typeA = a.get("type");
            var typeB = b.get("type");
            if (typeA === "script" && typeB !== "script") {
              return -1;
            }
            if (typeB === "script" && typeA !== "script") {
              return 1;
            }
            if (typeA === "bundle" && typeB !== "bundle") {
              return -1;
            }
            if (typeB === "bundle" && typeA !== "bundle") {
              return 1;
            }
            return 0;
          });

          // create runtime asset for every asset observer
          assets.forEach(function (a) {
            createEngineAsset(a, wasmAssetIds);
          });

          editor.call("assets:progress", 1);
          editor.emit("assets:load");
        }
      });
    };

    var connection = editor.call("realtime:connection");

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
  editor.on("realtime:authenticated", function () {
    //     Ajax({
    //       url: "{{url.api}}/projects/{{project.id}}/assets?branchId={{self.branch.id}}&view=launcher",
    //       auth: true,
    //       cookies: true,
    //     })
    //       .on("load", function (status, data) {
    //         onLoad(data);
    //       })
    //       .on("progress", function (progress) {
    //         editor.call("assets:progress", 0.1 + progress * 0.4);
    //       })
    //       .on("error", function (status, evt) {
    //         console.log(status, evt);
    //       });
    onLoad();
  });

  editor.call("assets:progress", 0.1);

  editor.on("assets:remove", function (asset) {
    var id = asset.get("uniqueId");
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
      return ["files/assets", id, revision, filename].join("/");
    }

    var path = "";
    for (var i = 0; i < folders.length; i++) {
      var folder = editor.call("assets:get", folders[i]);
      if (folder) {
        path += encodeURIComponent(folder.get("name")) + "/";
      } else {
        path += (assetNames[folders[i]] || "unknown") + "/";
      }
    }
    return (
      "assets/files/" +
      path +
      encodeURIComponent(filename) +
      "?id=" +
      id +
      "&branchId=" +
      config.self.branch.id
    );
  };

  // hook sync to new assets
  editor.on("assets:add", function (asset) {
    if (asset.sync) return;

    asset.sync = new ObserverSync({
      item: asset,
    });

    var setting = false;

    asset.on("*:set", function (path, value) {
      if (setting || !path.startsWith("file") || path.endsWith(".url") || !asset.get("file"))
        return;

      setting = true;

      var parts = path.split(".");

      // NOTE: if we have concatenated scripts then this will reset the file URL to the original URL and not the
      // concatenated URL which is what we want for hot reloading
      if ((parts.length === 1 || parts.length === 2) && parts[1] !== "variants") {
        asset.set(
          "file.url",
          getFileUrl(
            asset.get("path"),
            asset.get("id"),
            asset.get("revision"),
            asset.get("file.filename")
          )
        );
      } else if (parts.length >= 3 && parts[1] === "variants") {
        var format = parts[2];
        asset.set(
          "file.variants." + format + ".url",
          getFileUrl(
            asset.get("path"),
            asset.get("id"),
            asset.get("revision"),
            asset.get("file.variants." + format + ".filename")
          )
        );
      }

      setting = false;
    });
  });

  // server > client
  editor.on("realtime:op:assets", function (op, uniqueId) {
    var asset = editor.call("assets:getUnique", uniqueId);
    if (asset) {
      asset.sync.write(op);
    } else {
      console.error("realtime operation on missing asset: " + op.p[1]);
    }
  });
});

/* launch/assets-messenger.js */
editor.once("load", function () {
  "use strict";

  var validRuntimeAssets = {
    material: 1,
    model: 1,
    cubemap: 1,
    text: 1,
    json: 1,
    html: 1,
    css: 1,
    script: 1,
    texture: 1,
    textureatlas: 1,
    sprite: 1,
  };

  var create = function (data) {
    if (
      data.asset.source ||
      (data.asset.status !== "complete" && !validRuntimeAssets.hasOwnProperty(data.asset.type))
    )
      return;

    var uniqueId = parseInt(data.asset.id, 10);
    if (!uniqueId) return;

    editor.call("loadAsset", uniqueId);
  };

  // create or update
  editor.on("messenger:asset.new", create);

  // remove
  editor.on("messenger:asset.delete", function (data) {
    var asset = editor.call("assets:getUnique", data.asset.id);
    if (!asset) return;
    editor.call("assets:remove", asset);
  });

  // remove multiple
  editor.on("messenger:assets.delete", function (data) {
    for (var i = 0; i < data.assets.length; i++) {
      var asset = editor.call("assets:getUnique", parseInt(data.assets[i], 10));
      if (!asset) continue;
      editor.call("assets:remove", asset);
    }
  });
});

/* launch/scene-settings.js */
editor.once("load", function () {
  "use strict";

  var sceneSettings = new Observer();

  editor.once("scene:raw", function (data) {
    sceneSettings.patch(data.settings);

    editor.emit("sceneSettings:load", sceneSettings);
  });

  editor.method("sceneSettings", function () {
    return sceneSettings;
  });
});

/* launch/scene-settings-sync.js */
editor.once("load", function () {
  "use strict";

  editor.on("sceneSettings:load", function (settings) {
    if (settings.sync) return;

    settings.sync = new ObserverSync({
      item: settings,
      prefix: ["settings"],
    });

    // client > server
    settings.sync.on("op", function (op) {
      editor.call("realtime:op", op);
    });

    // server > client
    editor.on("realtime:op:settings", function (op) {
      settings.sync.write(op);
    });
  });
});

/* launch/sourcefiles.js */
editor.once("load", function () {
  "use strict";

  if (!editor.call("settings:project").get("useLegacyScripts")) return;

  var onLoad = function (data) {
    var i = 0;
    var l = data.result.length;

    var filenames = data.result.map(function (item) {
      return item.filename;
    });

    filenames = [];

    editor.emit("sourcefiles:load", filenames);
  };

  // load scripts
  //   Ajax({
  //     url: "{{url.home}}{{project.repositoryUrl}}",
  //     cookies: true,
  //     auth: true,
  //   })
  //     .on("load", function (status, data) {
  //       onLoad(data);
  //     })
  //     .on("error", function (status, evt) {
  //       console.log(status, evt);
  //       editor.emit("sourcefiles:load", []);
  //     });
});

/* launch/scene-loading.js */
editor.once("load", function () {
  "use strict";

  // cache
  var loaded = {};
  var isLoading = false;
  var loadScene = function (id, callback, settingsOnly) {
    if (loaded[id]) {
      if (callback) callback(null, loaded[id].data);

      return;
    }

    isLoading = true;

    var connection = editor.call("realtime:connection");
    var scene = connection.get("scenes", "" + id);

    // error
    scene.on("error", function (err) {
      if (callback) callback(new Error(err));
    });

    // ready to sync
    scene.on("load", function () {
      // cache loaded scene for any subsequent load requests
      loaded[id] = scene;

      // notify of operations
      scene.on("op", function (ops, local) {
        if (local) return;

        for (var i = 0; i < ops.length; i++) {
          var op = ops[i];

          // console.log('in: [ ' + Object.keys(op).filter(function(i) { return i !== 'p' }).join(', ') + ' ]', op.p.join('.'));

          if (op.p[0]) {
            editor.emit("realtime:op:" + op.p[0], op);
          }
        }
      });

      // notify of scene load
      var snapshot = scene.data;
      if (settingsOnly !== true) {
        editor.emit("scene:raw", snapshot);
      }
      if (callback) {
        callback(null, snapshot);
      }

      isLoading = false;
    });

    // subscribe for realtime events
    scene.subscribe();
  };

  editor.method("loadScene", loadScene);
  editor.method("isLoadingScene", function () {
    return isLoading;
  });

  editor.on("realtime:authenticated", function () {
    var startedLoading = false;

    // if we are reconnecting try to reload
    // all scenes that we've already loaded
    for (var id in loaded) {
      startedLoading = true;
      loaded[id].destroy();
      delete loaded[id];

      editor.call("loadScene", id);
    }

    // if no scenes have been loaded at
    // all then we are initializing
    // for the first time so load the main scene
    if (!startedLoading) {
      editor.call("loadScene", config.scene.uniqueId);
    }
  });
});
