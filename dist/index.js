function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var d3 = require('d3');
var styled = _interopDefault(require('styled-components'));
var SVGBrush = _interopDefault(require('react-svg-brush'));

var styles = {"test":"_styles-module__test__3ybTi"};

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  strings.raw = raw;
  return strings;
}

function _templateObject3() {
  var data = _taggedTemplateLiteralLoose(["\n  transition: all 0.3s ease-out;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteralLoose(["\n  fill: #95a5a6;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  background: white;\n  overflow: visible;\n  margin-bottom: 2em;\n  margin-right: 2em;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var ChartGeneralStyle = styled.div(_templateObject());
var Text = styled.text(_templateObject2());
var Line = styled.line(_templateObject3());

/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = (function () {
    if (typeof Map !== 'undefined') {
        return Map;
    }
    /**
     * Returns index in provided array that matches the specified key.
     *
     * @param {Array<Array>} arr
     * @param {*} key
     * @returns {number}
     */
    function getIndex(arr, key) {
        var result = -1;
        arr.some(function (entry, index) {
            if (entry[0] === key) {
                result = index;
                return true;
            }
            return false;
        });
        return result;
    }
    return /** @class */ (function () {
        function class_1() {
            this.__entries__ = [];
        }
        Object.defineProperty(class_1.prototype, "size", {
            /**
             * @returns {boolean}
             */
            get: function () {
                return this.__entries__.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {*} key
         * @returns {*}
         */
        class_1.prototype.get = function (key) {
            var index = getIndex(this.__entries__, key);
            var entry = this.__entries__[index];
            return entry && entry[1];
        };
        /**
         * @param {*} key
         * @param {*} value
         * @returns {void}
         */
        class_1.prototype.set = function (key, value) {
            var index = getIndex(this.__entries__, key);
            if (~index) {
                this.__entries__[index][1] = value;
            }
            else {
                this.__entries__.push([key, value]);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.delete = function (key) {
            var entries = this.__entries__;
            var index = getIndex(entries, key);
            if (~index) {
                entries.splice(index, 1);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.has = function (key) {
            return !!~getIndex(this.__entries__, key);
        };
        /**
         * @returns {void}
         */
        class_1.prototype.clear = function () {
            this.__entries__.splice(0);
        };
        /**
         * @param {Function} callback
         * @param {*} [ctx=null]
         * @returns {void}
         */
        class_1.prototype.forEach = function (callback, ctx) {
            if (ctx === void 0) { ctx = null; }
            for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                var entry = _a[_i];
                callback.call(ctx, entry[1], entry[0]);
            }
        };
        return class_1;
    }());
})();

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

// Returns global object of a current environment.
var global$1 = (function () {
    if (typeof global !== 'undefined' && global.Math === Math) {
        return global;
    }
    if (typeof self !== 'undefined' && self.Math === Math) {
        return self;
    }
    if (typeof window !== 'undefined' && window.Math === Math) {
        return window;
    }
    // eslint-disable-next-line no-new-func
    return Function('return this')();
})();

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = (function () {
    if (typeof requestAnimationFrame === 'function') {
        // It's required to use a bounded function because IE sometimes throws
        // an "Invalid calling object" error if rAF is invoked without the global
        // object on the left hand side.
        return requestAnimationFrame.bind(global$1);
    }
    return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
})();

// Defines minimum timeout before adding a trailing call.
var trailingTimeout = 2;
/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */
function throttle (callback, delay) {
    var leadingCall = false, trailingCall = false, lastCallTime = 0;
    /**
     * Invokes the original callback function and schedules new invocation if
     * the "proxy" was called during current request.
     *
     * @returns {void}
     */
    function resolvePending() {
        if (leadingCall) {
            leadingCall = false;
            callback();
        }
        if (trailingCall) {
            proxy();
        }
    }
    /**
     * Callback invoked after the specified delay. It will further postpone
     * invocation of the original function delegating it to the
     * requestAnimationFrame.
     *
     * @returns {void}
     */
    function timeoutCallback() {
        requestAnimationFrame$1(resolvePending);
    }
    /**
     * Schedules invocation of the original function.
     *
     * @returns {void}
     */
    function proxy() {
        var timeStamp = Date.now();
        if (leadingCall) {
            // Reject immediately following calls.
            if (timeStamp - lastCallTime < trailingTimeout) {
                return;
            }
            // Schedule new call to be in invoked when the pending one is resolved.
            // This is important for "transitions" which never actually start
            // immediately so there is a chance that we might miss one if change
            // happens amids the pending invocation.
            trailingCall = true;
        }
        else {
            leadingCall = true;
            trailingCall = false;
            setTimeout(timeoutCallback, delay);
        }
        lastCallTime = timeStamp;
    }
    return proxy;
}

// Minimum delay before invoking the update of observers.
var REFRESH_DELAY = 20;
// A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.
var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
// Check if MutationObserver is available.
var mutationObserverSupported = typeof MutationObserver !== 'undefined';
/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
var ResizeObserverController = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserverController.
     *
     * @private
     */
    function ResizeObserverController() {
        /**
         * Indicates whether DOM listeners have been added.
         *
         * @private {boolean}
         */
        this.connected_ = false;
        /**
         * Tells that controller has subscribed for Mutation Events.
         *
         * @private {boolean}
         */
        this.mutationEventsAdded_ = false;
        /**
         * Keeps reference to the instance of MutationObserver.
         *
         * @private {MutationObserver}
         */
        this.mutationsObserver_ = null;
        /**
         * A list of connected observers.
         *
         * @private {Array<ResizeObserverSPI>}
         */
        this.observers_ = [];
        this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
    }
    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be added.
     * @returns {void}
     */
    ResizeObserverController.prototype.addObserver = function (observer) {
        if (!~this.observers_.indexOf(observer)) {
            this.observers_.push(observer);
        }
        // Add listeners if they haven't been added yet.
        if (!this.connected_) {
            this.connect_();
        }
    };
    /**
     * Removes observer from observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be removed.
     * @returns {void}
     */
    ResizeObserverController.prototype.removeObserver = function (observer) {
        var observers = this.observers_;
        var index = observers.indexOf(observer);
        // Remove observer if it's present in registry.
        if (~index) {
            observers.splice(index, 1);
        }
        // Remove listeners if controller has no connected observers.
        if (!observers.length && this.connected_) {
            this.disconnect_();
        }
    };
    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes.
     *
     * @returns {void}
     */
    ResizeObserverController.prototype.refresh = function () {
        var changesDetected = this.updateObservers_();
        // Continue running updates if changes have been detected as there might
        // be future ones caused by CSS transitions.
        if (changesDetected) {
            this.refresh();
        }
    };
    /**
     * Updates every observer from observers list and notifies them of queued
     * entries.
     *
     * @private
     * @returns {boolean} Returns "true" if any observer has detected changes in
     *      dimensions of it's elements.
     */
    ResizeObserverController.prototype.updateObservers_ = function () {
        // Collect observers that have active observations.
        var activeObservers = this.observers_.filter(function (observer) {
            return observer.gatherActive(), observer.hasActive();
        });
        // Deliver notifications in a separate cycle in order to avoid any
        // collisions between observers, e.g. when multiple instances of
        // ResizeObserver are tracking the same element and the callback of one
        // of them changes content dimensions of the observed target. Sometimes
        // this may result in notifications being blocked for the rest of observers.
        activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
        return activeObservers.length > 0;
    };
    /**
     * Initializes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.connect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already added.
        if (!isBrowser || this.connected_) {
            return;
        }
        // Subscription to the "Transitionend" event is used as a workaround for
        // delayed transitions. This way it's possible to capture at least the
        // final state of an element.
        document.addEventListener('transitionend', this.onTransitionEnd_);
        window.addEventListener('resize', this.refresh);
        if (mutationObserverSupported) {
            this.mutationsObserver_ = new MutationObserver(this.refresh);
            this.mutationsObserver_.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        else {
            document.addEventListener('DOMSubtreeModified', this.refresh);
            this.mutationEventsAdded_ = true;
        }
        this.connected_ = true;
    };
    /**
     * Removes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.disconnect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already removed.
        if (!isBrowser || !this.connected_) {
            return;
        }
        document.removeEventListener('transitionend', this.onTransitionEnd_);
        window.removeEventListener('resize', this.refresh);
        if (this.mutationsObserver_) {
            this.mutationsObserver_.disconnect();
        }
        if (this.mutationEventsAdded_) {
            document.removeEventListener('DOMSubtreeModified', this.refresh);
        }
        this.mutationsObserver_ = null;
        this.mutationEventsAdded_ = false;
        this.connected_ = false;
    };
    /**
     * "Transitionend" event handler.
     *
     * @private
     * @param {TransitionEvent} event
     * @returns {void}
     */
    ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
        var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
        // Detect whether transition may affect dimensions of an element.
        var isReflowProperty = transitionKeys.some(function (key) {
            return !!~propertyName.indexOf(key);
        });
        if (isReflowProperty) {
            this.refresh();
        }
    };
    /**
     * Returns instance of the ResizeObserverController.
     *
     * @returns {ResizeObserverController}
     */
    ResizeObserverController.getInstance = function () {
        if (!this.instance_) {
            this.instance_ = new ResizeObserverController();
        }
        return this.instance_;
    };
    /**
     * Holds reference to the controller's instance.
     *
     * @private {ResizeObserverController}
     */
    ResizeObserverController.instance_ = null;
    return ResizeObserverController;
}());

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = (function (target, props) {
    for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
        var key = _a[_i];
        Object.defineProperty(target, key, {
            value: props[key],
            enumerable: false,
            writable: false,
            configurable: true
        });
    }
    return target;
});

/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */
var getWindowOf = (function (target) {
    // Assume that the element is an instance of Node, which means that it
    // has the "ownerDocument" property from which we can retrieve a
    // corresponding global object.
    var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
    // Return the local global object if it's not possible extract one from
    // provided element.
    return ownerGlobal || global$1;
});

// Placeholder of an empty content rectangle.
var emptyRect = createRectInit(0, 0, 0, 0);
/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */
function toFloat(value) {
    return parseFloat(value) || 0;
}
/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */
function getBordersSize(styles) {
    var positions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        positions[_i - 1] = arguments[_i];
    }
    return positions.reduce(function (size, position) {
        var value = styles['border-' + position + '-width'];
        return size + toFloat(value);
    }, 0);
}
/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
    var positions = ['top', 'right', 'bottom', 'left'];
    var paddings = {};
    for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
        var position = positions_1[_i];
        var value = styles['padding-' + position];
        paddings[position] = toFloat(value);
    }
    return paddings;
}
/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */
function getSVGContentRect(target) {
    var bbox = target.getBBox();
    return createRectInit(0, 0, bbox.width, bbox.height);
}
/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */
function getHTMLElementContentRect(target) {
    // Client width & height properties can't be
    // used exclusively as they provide rounded values.
    var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
    // By this condition we can catch all non-replaced inline, hidden and
    // detached elements. Though elements with width & height properties less
    // than 0.5 will be discarded as well.
    //
    // Without it we would need to implement separate methods for each of
    // those cases and it's not possible to perform a precise and performance
    // effective test for hidden elements. E.g. even jQuery's ':visible' filter
    // gives wrong results for elements with width & height less than 0.5.
    if (!clientWidth && !clientHeight) {
        return emptyRect;
    }
    var styles = getWindowOf(target).getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;
    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize the getBoundingClientRect if only it's data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    var width = toFloat(styles.width), height = toFloat(styles.height);
    // Width & height include paddings and borders when the 'border-box' box
    // model is applied (except for IE).
    if (styles.boxSizing === 'border-box') {
        // Following conditions are required to handle Internet Explorer which
        // doesn't include paddings and borders to computed CSS dimensions.
        //
        // We can say that if CSS dimensions + paddings are equal to the "client"
        // properties then it's either IE, and thus we don't need to subtract
        // anything, or an element merely doesn't have paddings/borders styles.
        if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, 'left', 'right') + horizPad;
        }
        if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
        }
    }
    // Following steps can't be applied to the document's root element as its
    // client[Width/Height] properties represent viewport area of the window.
    // Besides, it's as well not necessary as the <html> itself neither has
    // rendered scroll bars nor it can be clipped.
    if (!isDocumentElement(target)) {
        // In some browsers (only in Firefox, actually) CSS width & height
        // include scroll bars size which can be removed at this step as scroll
        // bars are the only difference between rounded dimensions + paddings
        // and "client" properties, though that is not always true in Chrome.
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight;
        // Chrome has a rather weird rounding of "client" properties.
        // E.g. for an element with content width of 314.2px it sometimes gives
        // the client width of 315px and for the width of 314.7px it may give
        // 314px. And it doesn't happen all the time. So just ignore this delta
        // as a non-relevant.
        if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
        }
        if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
        }
    }
    return createRectInit(paddings.left, paddings.top, width, height);
}
/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
var isSVGGraphicsElement = (function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement !== 'undefined') {
        return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
    }
    // If it's so, then check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method.
    // eslint-disable-next-line no-extra-parens
    return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
        typeof target.getBBox === 'function'); };
})();
/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
    return target === getWindowOf(target).document.documentElement;
}
/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */
function getContentRect(target) {
    if (!isBrowser) {
        return emptyRect;
    }
    if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
    }
    return getHTMLElementContentRect(target);
}
/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */
function createReadOnlyRect(_a) {
    var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    // If DOMRectReadOnly is available use it as a prototype for the rectangle.
    var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);
    // Rectangle's properties are not writable and non-enumerable.
    defineConfigurable(rect, {
        x: x, y: y, width: width, height: height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
    });
    return rect;
}
/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */
function createRectInit(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}

/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */
var ResizeObservation = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObservation.
     *
     * @param {Element} target - Element to be observed.
     */
    function ResizeObservation(target) {
        /**
         * Broadcasted width of content rectangle.
         *
         * @type {number}
         */
        this.broadcastWidth = 0;
        /**
         * Broadcasted height of content rectangle.
         *
         * @type {number}
         */
        this.broadcastHeight = 0;
        /**
         * Reference to the last observed content rectangle.
         *
         * @private {DOMRectInit}
         */
        this.contentRect_ = createRectInit(0, 0, 0, 0);
        this.target = target;
    }
    /**
     * Updates content rectangle and tells whether it's width or height properties
     * have changed since the last broadcast.
     *
     * @returns {boolean}
     */
    ResizeObservation.prototype.isActive = function () {
        var rect = getContentRect(this.target);
        this.contentRect_ = rect;
        return (rect.width !== this.broadcastWidth ||
            rect.height !== this.broadcastHeight);
    };
    /**
     * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
     * from the corresponding properties of the last observed content rectangle.
     *
     * @returns {DOMRectInit} Last observed content rectangle.
     */
    ResizeObservation.prototype.broadcastRect = function () {
        var rect = this.contentRect_;
        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;
        return rect;
    };
    return ResizeObservation;
}());

var ResizeObserverEntry = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObserverEntry.
     *
     * @param {Element} target - Element that is being observed.
     * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
     */
    function ResizeObserverEntry(target, rectInit) {
        var contentRect = createReadOnlyRect(rectInit);
        // According to the specification following properties are not writable
        // and are also not enumerable in the native implementation.
        //
        // Property accessors are not being used as they'd require to define a
        // private WeakMap storage which may cause memory leaks in browsers that
        // don't support this type of collections.
        defineConfigurable(this, { target: target, contentRect: contentRect });
    }
    return ResizeObserverEntry;
}());

var ResizeObserverSPI = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback function that is invoked
     *      when one of the observed elements changes it's content dimensions.
     * @param {ResizeObserverController} controller - Controller instance which
     *      is responsible for the updates of observer.
     * @param {ResizeObserver} callbackCtx - Reference to the public
     *      ResizeObserver instance which will be passed to callback function.
     */
    function ResizeObserverSPI(callback, controller, callbackCtx) {
        /**
         * Collection of resize observations that have detected changes in dimensions
         * of elements.
         *
         * @private {Array<ResizeObservation>}
         */
        this.activeObservations_ = [];
        /**
         * Registry of the ResizeObservation instances.
         *
         * @private {Map<Element, ResizeObservation>}
         */
        this.observations_ = new MapShim();
        if (typeof callback !== 'function') {
            throw new TypeError('The callback provided as parameter 1 is not a function.');
        }
        this.callback_ = callback;
        this.controller_ = controller;
        this.callbackCtx_ = callbackCtx;
    }
    /**
     * Starts observing provided element.
     *
     * @param {Element} target - Element to be observed.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.observe = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is already being observed.
        if (observations.has(target)) {
            return;
        }
        observations.set(target, new ResizeObservation(target));
        this.controller_.addObserver(this);
        // Force the update of observations.
        this.controller_.refresh();
    };
    /**
     * Stops observing provided element.
     *
     * @param {Element} target - Element to stop observing.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.unobserve = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is not being observed.
        if (!observations.has(target)) {
            return;
        }
        observations.delete(target);
        if (!observations.size) {
            this.controller_.removeObserver(this);
        }
    };
    /**
     * Stops observing all elements.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.disconnect = function () {
        this.clearActive();
        this.observations_.clear();
        this.controller_.removeObserver(this);
    };
    /**
     * Collects observation instances the associated element of which has changed
     * it's content rectangle.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.gatherActive = function () {
        var _this = this;
        this.clearActive();
        this.observations_.forEach(function (observation) {
            if (observation.isActive()) {
                _this.activeObservations_.push(observation);
            }
        });
    };
    /**
     * Invokes initial callback function with a list of ResizeObserverEntry
     * instances collected from active resize observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.broadcastActive = function () {
        // Do nothing if observer doesn't have active observations.
        if (!this.hasActive()) {
            return;
        }
        var ctx = this.callbackCtx_;
        // Create ResizeObserverEntry instance for every active observation.
        var entries = this.activeObservations_.map(function (observation) {
            return new ResizeObserverEntry(observation.target, observation.broadcastRect());
        });
        this.callback_.call(ctx, entries, ctx);
        this.clearActive();
    };
    /**
     * Clears the collection of active observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.clearActive = function () {
        this.activeObservations_.splice(0);
    };
    /**
     * Tells whether observer has active observations.
     *
     * @returns {boolean}
     */
    ResizeObserverSPI.prototype.hasActive = function () {
        return this.activeObservations_.length > 0;
    };
    return ResizeObserverSPI;
}());

// Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.
var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */
var ResizeObserver = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback that is invoked when
     *      dimensions of the observed elements change.
     */
    function ResizeObserver(callback) {
        if (!(this instanceof ResizeObserver)) {
            throw new TypeError('Cannot call a class as a function.');
        }
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        var controller = ResizeObserverController.getInstance();
        var observer = new ResizeObserverSPI(callback, controller, this);
        observers.set(this, observer);
    }
    return ResizeObserver;
}());
// Expose public methods of ResizeObserver.
[
    'observe',
    'unobserve',
    'disconnect'
].forEach(function (method) {
    ResizeObserver.prototype[method] = function () {
        var _a;
        return (_a = observers.get(this))[method].apply(_a, arguments);
    };
});

var index = (function () {
    // Export existing implementation if available.
    if (typeof global$1.ResizeObserver !== 'undefined') {
        return global$1.ResizeObserver;
    }
    return ResizeObserver;
})();

var accessorPropsType = PropTypes.oneOfType([PropTypes.func, PropTypes.number]);
var callAccessor = function callAccessor(accessor, d, i) {
  return typeof accessor === "function" ? accessor(d, i) : accessor;
};
var dimensionsPropsType = PropTypes.shape({
  height: PropTypes.number,
  width: PropTypes.number,
  marginTop: PropTypes.number,
  marginRight: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number
});
var combineChartDimensions = function combineChartDimensions(dimensions) {
  var parsedDimensions = _extends({
    marginTop: 40,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 75
  }, dimensions);

  return _extends({}, parsedDimensions, {
    boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
    boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0)
  });
};
var useChartDimensions = function useChartDimensions(passedSettings) {
  var ref = React.useRef();
  var dimensions = combineChartDimensions(passedSettings);

  var _useState = React.useState(0),
      width = _useState[0],
      changeWidth = _useState[1];

  var _useState2 = React.useState(0),
      height = _useState2[0],
      changeHeight = _useState2[1];

  React.useEffect(function () {
    if (dimensions.width && dimensions.height) return [ref, dimensions];
    var element = ref.current;
    var resizeObserver = new index(function (entries) {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;
      var entry = entries[0];
      if (width !== entry.contentRect.width) changeWidth(entry.contentRect.width);
      if (height !== entry.contentRect.height) changeHeight(entry.contentRect.height);
    });
    resizeObserver.observe(element);
    return function () {
      return resizeObserver.unobserve(element);
    };
  }, [passedSettings, height, width, dimensions]);
  var newSettings = combineChartDimensions(_extends({}, dimensions, {
    width: dimensions.width || width,
    height: dimensions.height || height
  }));
  return [ref, newSettings];
};
var lastId = 0;
var useUniqueId = function useUniqueId(prefix) {
  if (prefix === void 0) {
    prefix = "";
  }

  lastId++;
  return [prefix, lastId].join("-");
};

function _templateObject$1() {
  var data = _taggedTemplateLiteralLoose(["\n  overflow: visible;\n"]);

  _templateObject$1 = function _templateObject() {
    return data;
  };

  return data;
}
var ChartContext = React.createContext();
var useChartDimensions$1 = function useChartDimensions() {
  return React.useContext(ChartContext);
};

var Chart = function Chart(_ref) {
  var dimensions = _ref.dimensions,
      children = _ref.children;
  return /*#__PURE__*/React__default.createElement(ChartContainerStyle, {
    width: dimensions.width,
    height: dimensions.height
  }, /*#__PURE__*/React__default.createElement(ChartContext.Provider, {
    value: dimensions
  }, /*#__PURE__*/React__default.createElement("g", {
    transform: "translate(" + dimensions.marginLeft + ", " + dimensions.marginTop + ")"
  }, children)));
};

Chart.propTypes = {
  dimensions: dimensionsPropsType
};
Chart.defaultProps = {
  dimensions: {}
};
var ChartContainerStyle = styled.svg(_templateObject$1());

function _templateObject$2() {
  var data = _taggedTemplateLiteralLoose(["\n  fill: ", ";\n  transition: all 0.3s ease-out;\n\n  &:hover {\n    fill: maroon;\n  }\n"]);

  _templateObject$2 = function _templateObject() {
    return data;
  };

  return data;
}

var Bars = function Bars(_ref) {
  var data = _ref.data,
      keyAccessor = _ref.keyAccessor,
      xAccessor = _ref.xAccessor,
      yAccessor = _ref.yAccessor,
      widthAccessor = _ref.widthAccessor,
      heightAccessor = _ref.heightAccessor,
      scaleBandAxis = _ref.scaleBandAxis,
      setTooltip = _ref.setTooltip,
      padding = _ref.padding,
      fill = _ref.fill,
      props = _objectWithoutPropertiesLoose(_ref, ["data", "keyAccessor", "xAccessor", "yAccessor", "widthAccessor", "heightAccessor", "scaleBandAxis", "setTooltip", "padding", "fill"]);

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, data.map(function (d, i) {
    return /*#__PURE__*/React__default.createElement(Rect, _extends({}, props, {
      fill: fill,
      key: keyAccessor(d, i),
      x: scaleBandAxis === "y" ? 0 : callAccessor(xAccessor, d, i) + padding / 2,
      y: callAccessor(yAccessor, d, i),
      width: d3.max([callAccessor(widthAccessor, d, i) - (scaleBandAxis === "y" ? 0 : padding), 0]),
      height: d3.max([callAccessor(heightAccessor, d, i) - (scaleBandAxis === "y" ? padding : 0), 0]),
      onMouseOver: function onMouseOver() {
        return setTooltip({
          x: (scaleBandAxis === "y" ? 0 : callAccessor(xAccessor, d, i)) + callAccessor(widthAccessor, d, i) / 2,
          y: callAccessor(yAccessor, d, i),
          data: d
        });
      },
      onMouseOut: function onMouseOut() {
        return setTooltip(false);
      }
    }));
  }));
};

Bars.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  widthAccessor: accessorPropsType,
  heightAccessor: accessorPropsType
};
Bars.defaultProps = {
  padding: 10
};
var Rect = styled.rect(_templateObject$2(), function (props) {
  return props.fill;
});

function _templateObject5() {
  var data = _taggedTemplateLiteralLoose(["\n  text-anchor: middle;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteralLoose(["\n  dominant-baseline: middle;\n  text-anchor: end;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3$1() {
  var data = _taggedTemplateLiteralLoose(["\n  font-size: 0.8em;\n  transition: all 0.3s ease-out;\n  text-anchor: middle;\n"]);

  _templateObject3$1 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$1() {
  var data = _taggedTemplateLiteralLoose(["\n  text-anchor: middle;\n  font-size: 0.9em;\n  letter-spacing: 0.01em;\n"]);

  _templateObject2$1 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$3() {
  var data = _taggedTemplateLiteralLoose(["\n  stroke: #bdc3c7;\n"]);

  _templateObject$3 = function _templateObject() {
    return data;
  };

  return data;
}
var axisComponentsByDimension = {
  x: AxisHorizontal,
  y: AxisVertical
};

var Axis = function Axis(_ref) {
  var dimension = _ref.dimension,
      props = _objectWithoutPropertiesLoose(_ref, ["dimension"]);

  var dimensions = useChartDimensions$1();
  var Component = axisComponentsByDimension[dimension];
  if (!Component) return null;
  var tickLabelCenter = props.scale.bandwidth ? true : false;
  return /*#__PURE__*/React__default.createElement(Component, _extends({
    dimensions: dimensions,
    tickLabelCenter: tickLabelCenter
  }, props));
};

Axis.propTypes = {
  dimension: PropTypes.oneOf(["x", "y"]),
  dimensions: dimensionsPropsType,
  scale: PropTypes.func,
  label: PropTypes.string,
  formatTick: PropTypes.func
};
Axis.defaultProps = {
  dimension: "x",
  scale: null,
  formatTick: d3.format(",")
};

function AxisHorizontal(_ref2) {
  var dimensions = _ref2.dimensions,
      label = _ref2.label,
      formatTick = _ref2.formatTick,
      scale = _ref2.scale,
      tickLabelCenter = _ref2.tickLabelCenter,
      props = _objectWithoutPropertiesLoose(_ref2, ["dimensions", "label", "formatTick", "scale", "tickLabelCenter"]);

  var numberOfTicks = dimensions.boundedWidth < 600 ? dimensions.boundedWidth / 100 : dimensions.boundedWidth / 250;
  var ticks = tickLabelCenter ? scale.domain() : scale.ticks(numberOfTicks);
  return /*#__PURE__*/React__default.createElement(AxisHorizontalStyle, _extends({
    transform: "translate(0, " + dimensions.boundedHeight + ")"
  }, props), /*#__PURE__*/React__default.createElement(Axis__line, {
    x2: dimensions.boundedWidth
  }), ticks.map(function (tick, i) {
    return /*#__PURE__*/React__default.createElement(Axis__tick, {
      key: tick,
      transform: "translate(" + (tickLabelCenter ? scale(tick) + scale.step() / 2 : scale(tick)) + ", 25)"
    }, formatTick(tick));
  }), ticks.map(function (tick, i) {
    return /*#__PURE__*/React__default.createElement(Axis__line, {
      key: tick,
      x1: "" + scale(tick),
      x2: "" + scale(tick),
      y2: 5
    });
  }), label && /*#__PURE__*/React__default.createElement(Axis__label, {
    transform: "translate(" + dimensions.boundedWidth / 2 + ", 60)"
  }, label));
}

function AxisVertical(_ref3) {
  var dimensions = _ref3.dimensions,
      label = _ref3.label,
      formatTick = _ref3.formatTick,
      scale = _ref3.scale,
      tickLabelCenter = _ref3.tickLabelCenter,
      props = _objectWithoutPropertiesLoose(_ref3, ["dimensions", "label", "formatTick", "scale", "tickLabelCenter"]);

  var numberOfTicks = dimensions.boundedHeight / 70;
  var ticks = tickLabelCenter ? scale.domain() : scale.ticks(numberOfTicks);
  return /*#__PURE__*/React__default.createElement(AxisVerticalStyle, props, /*#__PURE__*/React__default.createElement(Axis__line, {
    y2: dimensions.boundedHeight
  }), ticks.map(function (tick, i) {
    return /*#__PURE__*/React__default.createElement(Axis__tick, {
      key: tick,
      transform: "translate(-16, " + (tickLabelCenter ? scale(tick) + scale.step() / 2 : scale(tick)) + ")"
    }, formatTick(tick));
  }), label && /*#__PURE__*/React__default.createElement(Axis__label, {
    style: {
      transform: "translate(-56px, " + dimensions.boundedHeight / 2 + "px) rotate(-90deg)"
    }
  }, label));
}

var Axis__line = styled.line(_templateObject$3());
var Axis__label = styled(Text)(_templateObject2$1());
var Axis__tick = styled(Text)(_templateObject3$1());
var AxisHorizontalStyle = styled.g(_templateObject4());
var AxisVerticalStyle = styled.g(_templateObject5());

var Gradient = function Gradient(_ref) {
  var id = _ref.id,
      colors = _ref.colors,
      props = _objectWithoutPropertiesLoose(_ref, ["id", "colors"]);

  return /*#__PURE__*/React__default.createElement("linearGradient", _extends({
    id: id,
    gradientUnits: "userSpaceOnUse",
    spreadMethod: "pad"
  }, props), colors.map(function (color, i) {
    return /*#__PURE__*/React__default.createElement("stop", {
      key: i,
      offset: i * 100 / (colors.length - 1) + "%",
      stopColor: color
    });
  }));
};

Gradient.propTypes = {
  id: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string)
};
Gradient.defaultProps = {
  id: "Gradient",
  colors: []
};

function _templateObject$4() {
  var data = _taggedTemplateLiteralLoose(["\n  position: absolute;\n  top: -15px;\n  left: 0;\n  padding: 0.6em 1em;\n  background: #fff;\n  text-align: center;\n  border: 1px solid #ddd;\n  z-index: 10;\n  transition: all 0.2s ease-out;\n  pointer-events: none;\n  overflow: visible;\n  transform: translate(\n    calc(-50% + ", "px),\n    calc(-100% + ", "px)\n  );\n\n  &:before {\n    content: \"\";\n    position: absolute;\n    bottom: 0;\n    left: 50%;\n    width: 12px;\n    height: 12px;\n    background: white;\n    border: 1px solid #ddd;\n    border-top-color: transparent;\n    border-left-color: transparent;\n    transform: translate(-50%, 50%) rotate(45deg);\n    transform-origin: center center;\n    z-index: 10;\n  }\n"]);

  _templateObject$4 = function _templateObject() {
    return data;
  };

  return data;
}
var TooltipContainer = styled.div(_templateObject$4(), function (props) {
  return props.x;
}, function (props) {
  return props.y;
});

var Tooltip = function Tooltip(props) {
  return /*#__PURE__*/React__default.createElement(TooltipContainer, _extends({
    id: "tooltip",
    className: "tooltip"
  }, props), props.children);
};

function _templateObject$5() {
  var data = _taggedTemplateLiteralLoose(["\n  height: 500px;\n  flex: 1;\n  min-width: 500px;\n\n  position: relative;\n"]);

  _templateObject$5 = function _templateObject() {
    return data;
  };

  return data;
}
var gradientColors = ["#9980FA", "rgb(226, 222, 243)"];

var BarChart = function BarChart(_ref) {
  var data = _ref.data,
      xAccessor = _ref.xAccessor,
      yAccessor = _ref.yAccessor,
      label = _ref.label,
      scaleBandAxis = _ref.scaleBandAxis;
  var gradientId = useUniqueId("Histogram-gradient");

  var _useChartDimensions = useChartDimensions({
    marginBottom: 77
  }),
      ref = _useChartDimensions[0],
      dimensions = _useChartDimensions[1];

  var _useState = React.useState(false),
      tooltip = _useState[0],
      setTooltip = _useState[1];

  var bandScale = d3.scaleBand().domain(data.map(scaleBandAxis === "x" ? xAccessor : yAccessor)).range(scaleBandAxis === "x" ? [0, dimensions.boundedWidth] : [dimensions.boundedHeight, 0]).padding(0.1);
  var linearScale = d3.scaleLinear().domain([0, d3.max(data.map(scaleBandAxis === "x" ? yAccessor : xAccessor))]).range(scaleBandAxis === "x" ? [dimensions.boundedHeight, 0] : [0, dimensions.boundedWidth]).nice();
  var xScale = scaleBandAxis === "x" ? bandScale : linearScale;
  var yScale = scaleBandAxis === "x" ? linearScale : bandScale;

  var xAccessorScaled = function xAccessorScaled(d) {
    return xScale(xAccessor(d));
  };

  var yAccessorScaled = function yAccessorScaled(d) {
    return yScale(yAccessor(d));
  };

  var widthAccessorScaled = function widthAccessorScaled(d) {
    return scaleBandAxis === "x" ? xScale.step() : xScale(xAccessor(d));
  };

  var heightAccessorScaled = function heightAccessorScaled(d) {
    return scaleBandAxis === "x" ? dimensions.boundedHeight - yScale(yAccessor(d)) : yScale.step();
  };

  var keyAccessor = function keyAccessor(d, i) {
    return i;
  };

  return /*#__PURE__*/React__default.createElement(BarChartStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React__default.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React__default.createElement("div", null, "xAccessor: ", xAccessor(tooltip.data)), /*#__PURE__*/React__default.createElement("div", null, "yAccessor: ", yAccessor(tooltip.data))), /*#__PURE__*/React__default.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors,
    x2: "0",
    y2: "100%"
  })), /*#__PURE__*/React__default.createElement(Axis, {
    dimensions: dimensions,
    dimension: "x",
    scale: xScale,
    label: label,
    formatTick: scaleBandAxis === "x" ? function (d) {
      return d;
    } : d3.format(",")
  }), /*#__PURE__*/React__default.createElement(Axis, {
    dimensions: dimensions,
    dimension: "y",
    scale: yScale,
    label: "Count",
    formatTick: scaleBandAxis === "x" ? d3.format(",") : function (d) {
      return d;
    }
  }), /*#__PURE__*/React__default.createElement(Bars, {
    data: data,
    keyAccessor: keyAccessor,
    xAccessor: xAccessorScaled,
    yAccessor: yAccessorScaled,
    widthAccessor: widthAccessorScaled,
    heightAccessor: heightAccessorScaled,
    fill: "url(#" + gradientId + ")",
    scaleBandAxis: scaleBandAxis,
    setTooltip: setTooltip
  })));
};

BarChart.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string
};
BarChart.defaultProps = {
  xAccessor: function xAccessor(d) {
    return d.x;
  },
  yAccessor: function yAccessor(d) {
    return d.y;
  },
  scaleBandAxis: "x"
};
var BarChartStyle = styled(ChartGeneralStyle)(_templateObject$5());

function _templateObject$6() {
  var data = _taggedTemplateLiteralLoose(["\n  fill: ", ";\n  transition: all 0.3s ease-out;\n  &:hover {\n    fill: maroon;\n  }\n"]);

  _templateObject$6 = function _templateObject() {
    return data;
  };

  return data;
}

var Circles = function Circles(_ref) {
  var data = _ref.data,
      keyAccessor = _ref.keyAccessor,
      xAccessor = _ref.xAccessor,
      yAccessor = _ref.yAccessor,
      radius = _ref.radius,
      setTooltip = _ref.setTooltip,
      fill = _ref.fill,
      inSelection = _ref.inSelection,
      xAccessorBeforeScale = _ref.xAccessorBeforeScale,
      yAccessorBeforeScale = _ref.yAccessorBeforeScale,
      brushSelection = _ref.brushSelection,
      xScale = _ref.xScale,
      yScale = _ref.yScale;
  data.map(function (d, i) {
    if (!inSelection || !brushSelection) return;
    var x = xAccessorBeforeScale(d, i);
    var y = yAccessorBeforeScale(d, i);
    var dave = inSelection(x, y);

    var _brushSelection$map = brushSelection.map(function (_ref2) {
      var xd = _ref2[0],
          yd = _ref2[1];
      return [xScale.invert(xd), yScale.invert(yd)];
    });
  });
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, data.map(function (d, i) {
    return /*#__PURE__*/React__default.createElement(Circle, {
      key: keyAccessor(d, i),
      cx: xAccessor(d, i),
      cy: yAccessor(d, i),
      r: typeof radius == "function" ? radius(d) : radius,
      onMouseOver: function onMouseOver() {
        return setTooltip({
          x: xAccessor(d, i),
          y: yAccessor(d, i),
          data: d
        });
      },
      onMouseOut: function onMouseOut() {
        return setTooltip(false);
      },
      fill: inSelection ? inSelection(xAccessorBeforeScale(d, i), yAccessorBeforeScale(d, i)) ? "orange" : fill : fill
    });
  }));
};

Circles.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  radius: accessorPropsType
};
Circles.defaultProps = {
  radius: 5
};
var Circle = styled.circle(_templateObject$6(), function (props) {
  return props.fill;
});

function _templateObject$7() {
  var data = _taggedTemplateLiteralLoose(["\n  height: 500px;\n  flex: 1;\n  min-width: 500px;\n\n  position: relative;\n"]);

  _templateObject$7 = function _templateObject() {
    return data;
  };

  return data;
}
var gradientColors$1 = ["#9980FA", "rgb(226, 222, 243)"];

var BoxPlot = function BoxPlot(_ref) {
  var data = _ref.data,
      xAccessor = _ref.xAccessor,
      yAccessor = _ref.yAccessor,
      label = _ref.label;
  var gradientId = useUniqueId("Histogram-gradient");

  var _useChartDimensions = useChartDimensions({
    marginBottom: 77
  }),
      ref = _useChartDimensions[0],
      dimensions = _useChartDimensions[1];

  var _useState = React.useState(false),
      tooltip = _useState[0],
      setTooltip = _useState[1];

  var numberOfThresholds = dimensions.boundedWidth / 40;
  var xScale = d3.scaleLinear().domain(d3.extent(data, xAccessor)).range([0, dimensions.boundedWidth]).nice(numberOfThresholds);
  var binsGenerator = d3.histogram().value(xAccessor).thresholds(xScale.ticks(numberOfThresholds));
  var bins = binsGenerator(data).map(function (bin) {
    bin.sort(function (a, b) {
      return a.temperature - b.temperature;
    });
    var values = bin.map(yAccessor);
    var min = values[0];
    var max = values[values.length - 1];
    var q1 = d3.quantile(values, 0.25);
    var q2 = d3.quantile(values, 0.5);
    var q3 = d3.quantile(values, 0.75);
    var iqr = q3 - q1;
    var r0 = Math.max(min, q1 - iqr * 1.5);
    var r1 = Math.min(max, q3 + iqr * 1.5);
    bin.quartiles = [q1, q2, q3];
    bin.range = [r0, r1];
    bin.outliers = bin.filter(function (v) {
      return v.temperature < r0 || v.temperature > r1;
    });
    return bin;
  });
  var yScale = d3.scaleLinear().domain([d3.min(bins, function (d) {
    return d.range[0];
  }), d3.max(bins, function (d) {
    return d.range[1];
  })]).range([dimensions.boundedHeight, 0]).nice();

  var xAccessorScaled = function xAccessorScaled(d) {
    return xScale(xAccessor(d)) + dimensions.boundedWidth / numberOfThresholds / 2;
  };

  var yAccessorScaled = function yAccessorScaled(d) {
    return yScale(yAccessor(d));
  };

  var keyAccessor = function keyAccessor(d, i) {
    return i;
  };

  return /*#__PURE__*/React__default.createElement(BoxPlotStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React__default.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React__default.createElement("div", null, "count: ", tooltip.data.length), /*#__PURE__*/React__default.createElement("div", null, "xAccessor: ", tooltip.data.x0), /*#__PURE__*/React__default.createElement("div", null, "yAccessor: ", yAccessor(tooltip.data)), tooltip.data.quartiles && /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", null, "iqr 1: ", tooltip.data.quartiles[0]), /*#__PURE__*/React__default.createElement("div", null, "iqr 2: ", tooltip.data.quartiles[1]), /*#__PURE__*/React__default.createElement("div", null, "iqr 3: ", tooltip.data.quartiles[2]))), /*#__PURE__*/React__default.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors$1,
    x2: "0",
    y2: "100%"
  })), /*#__PURE__*/React__default.createElement(Axis, {
    dimensions: dimensions,
    dimension: "x",
    scale: xScale,
    label: label
  }), /*#__PURE__*/React__default.createElement(Axis, {
    dimensions: dimensions,
    dimension: "y",
    scale: yScale,
    label: "Count"
  }), bins.map(function (d, i) {
    return d.length > 0 && /*#__PURE__*/React__default.createElement("g", {
      key: "" + i
    }, /*#__PURE__*/React__default.createElement("path", {
      key: "range-" + i,
      d: "M" + xScale((d.x0 + d.x1) / 2) + "," + yScale(d.range[1]) + " V" + yScale(d.range[0]),
      stroke: "black"
    }), /*#__PURE__*/React__default.createElement("path", {
      key: "quartile-" + i,
      d: "\n                      M" + (xScale(d.x0) + 1) + "," + yScale(d.quartiles[2]) + "\n                      H" + xScale(d.x1) + "\n                      V" + yScale(d.quartiles[0]) + "\n                      H" + (xScale(d.x0) + 1) + "\n                      Z\n                    ",
      fill: "#ddd",
      onMouseEnter: function onMouseEnter() {
        return setTooltip({
          data: d,
          x: xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2,
          y: yScale(d.quartiles[1])
        });
      },
      onMouseOut: function onMouseOut() {
        return setTooltip(false);
      }
    }), /*#__PURE__*/React__default.createElement("path", {
      key: "avg-" + i,
      d: "\n                      M" + (xScale(d.x0) + 1) + "," + yScale(d.quartiles[1]) + "\n                      H" + xScale(d.x1) + "\n                    ",
      stroke: "blue"
    }), /*#__PURE__*/React__default.createElement(Circles, {
      data: d.outliers,
      keyAccessor: keyAccessor,
      xAccessor: xAccessorScaled,
      yAccessor: yAccessorScaled,
      setTooltip: setTooltip,
      fill: "#9980fa"
    }));
  })));
};

BoxPlot.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string
};
BoxPlot.defaultProps = {
  xAccessor: function xAccessor(d) {
    return d.x;
  },
  yAccessor: function yAccessor(d) {
    return d.y;
  }
};
var BoxPlotStyle = styled(ChartGeneralStyle)(_templateObject$7());

function _templateObject$8() {
  var data = _taggedTemplateLiteralLoose(["\n  height: 500px;\n  flex: 1;\n  min-width: 500px;\n\n  position: relative;\n"]);

  _templateObject$8 = function _templateObject() {
    return data;
  };

  return data;
}
var gradientColors$2 = ["#9980FA", "rgb(226, 222, 243)"];

var Histogram = function Histogram(_ref) {
  var data = _ref.data,
      xAccessor = _ref.xAccessor,
      label = _ref.label;
  var gradientId = useUniqueId("Histogram-gradient");

  var _useChartDimensions = useChartDimensions({
    marginBottom: 77
  }),
      ref = _useChartDimensions[0],
      dimensions = _useChartDimensions[1];

  var _useState = React.useState(false),
      tooltip = _useState[0],
      setTooltip = _useState[1];

  var numberOfThresholds = 9;
  var xScale = d3.scaleLinear().domain(d3.extent(data, xAccessor)).range([0, dimensions.boundedWidth]).nice(numberOfThresholds);
  var binsGenerator = d3.histogram().domain(xScale.domain()).value(xAccessor).thresholds(xScale.ticks(numberOfThresholds));
  var bins = binsGenerator(data);

  var yAccessor = function yAccessor(d) {
    return d.length;
  };

  var yScale = d3.scaleLinear().domain([0, d3.max(bins, yAccessor)]).range([dimensions.boundedHeight, 0]).nice();
  var barPadding = 2;

  var xAccessorScaled = function xAccessorScaled(d) {
    return xScale(d.x0) + barPadding;
  };

  var yAccessorScaled = function yAccessorScaled(d) {
    return yScale(yAccessor(d));
  };

  var widthAccessorScaled = function widthAccessorScaled(d) {
    return xScale(d.x1) - xScale(d.x0) - barPadding;
  };

  var heightAccessorScaled = function heightAccessorScaled(d) {
    return dimensions.boundedHeight - yScale(yAccessor(d));
  };

  var keyAccessor = function keyAccessor(d, i) {
    return i;
  };

  return /*#__PURE__*/React__default.createElement(HistogramStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React__default.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React__default.createElement("div", null, "count: ", tooltip.data.length), /*#__PURE__*/React__default.createElement("div", null, "xAccessor: ", tooltip.data.x0), /*#__PURE__*/React__default.createElement("div", null, "yAccessor: ", yAccessor(tooltip.data))), /*#__PURE__*/React__default.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors$2,
    x2: "0",
    y2: "100%"
  })), /*#__PURE__*/React__default.createElement(Axis, {
    dimensions: dimensions,
    dimension: "x",
    scale: xScale,
    label: label
  }), /*#__PURE__*/React__default.createElement(Axis, {
    dimensions: dimensions,
    dimension: "y",
    scale: yScale,
    label: "Count"
  }), /*#__PURE__*/React__default.createElement(Bars, {
    data: bins,
    keyAccessor: keyAccessor,
    xAccessor: xAccessorScaled,
    yAccessor: yAccessorScaled,
    widthAccessor: widthAccessorScaled,
    heightAccessor: heightAccessorScaled,
    setTooltip: setTooltip,
    padding: 0,
    fill: "url(#" + gradientId + ")"
  })));
};

Histogram.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string
};
Histogram.defaultProps = {
  xAccessor: function xAccessor(d) {
    return d.x;
  },
  yAccessor: function yAccessor(d) {
    return d.y;
  }
};
var HistogramStyle = styled(ChartGeneralStyle)(_templateObject$8());

function _templateObject$9() {
  var data = _taggedTemplateLiteralLoose(["\n  height: 500px;\n  flex: 1;\n  min-width: 300px;\n\n  position: relative;\n"]);

  _templateObject$9 = function _templateObject() {
    return data;
  };

  return data;
}
var gradientColors$3 = ["#9980FA", "rgb(226, 222, 243)"];

var Pie = function Pie(_ref) {
  var data = _ref.data,
      categoryAccessor = _ref.categoryAccessor,
      valueAccessor = _ref.valueAccessor;
  var gradientId = useUniqueId("Histogram-gradient");

  var _useChartDimensions = useChartDimensions({
    marginBottom: 77
  }),
      ref = _useChartDimensions[0],
      dimensions = _useChartDimensions[1];

  var _useState = React.useState(false),
      tooltip = _useState[0],
      setTooltip = _useState[1];

  var outerRadius = d3.min([dimensions.width, dimensions.height]) * 2 / 5 - 10;
  var innerRadius = d3.min([dimensions.width, dimensions.height]) * 2 / 5 - 30;
  var x = (dimensions.boundedWidth - dimensions.marginLeft + dimensions.marginRight) / 2;
  var y = (dimensions.height - dimensions.marginTop - dimensions.marginBottom) / 2;
  var pie = d3.pie().value(valueAccessor).sort(null);
  var arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  return /*#__PURE__*/React__default.createElement(PieStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React__default.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React__default.createElement("div", null, "label: ", tooltip.label), /*#__PURE__*/React__default.createElement("div", null, "value: ", tooltip.value)), /*#__PURE__*/React__default.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors$3,
    x2: "0",
    y2: "100%"
  })), /*#__PURE__*/React__default.createElement("g", {
    transform: "translate(" + x + ", " + y + ")"
  }, pie(data).map(function (arcData, i) {
    return /*#__PURE__*/React__default.createElement("path", {
      d: arc(arcData),
      style: {
        fill: d3.schemePaired[arcData.index]
      },
      key: arcData.index,
      onMouseOver: function onMouseOver() {
        return setTooltip({
          x: arc.centroid(arcData)[0] + x,
          y: arc.centroid(arcData)[1] + y,
          value: valueAccessor(arcData.data),
          label: categoryAccessor(arcData.data)
        });
      },
      onMouseOut: function onMouseOut() {
        return setTooltip(false);
      }
    });
  }))));
};

Pie.propTypes = {
  categoryAccessor: accessorPropsType,
  valueAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string
};
Pie.defaultProps = {
  categoryAccessor: function categoryAccessor(d) {
    return d.x;
  },
  valueAccessor: function valueAccessor(d) {
    return d.y;
  }
};
var PieStyle = styled(ChartGeneralStyle)(_templateObject$9());

function _templateObject$a() {
  var data = _taggedTemplateLiteralLoose(["\n  height: 500px;\n  width: 500px;\n  position: relative;\n"]);

  _templateObject$a = function _templateObject() {
    return data;
  };

  return data;
}

var ScatterPlot = function ScatterPlot(_ref) {
  var data = _ref.data,
      xAccessor = _ref.xAccessor,
      yAccessor = _ref.yAccessor,
      xLabel = _ref.xLabel,
      yLabel = _ref.yLabel;

  var _useChartDimensions = useChartDimensions({
    marginBottom: 77
  }),
      ref = _useChartDimensions[0],
      dimensions = _useChartDimensions[1];

  var _useState = React.useState(false),
      tooltip = _useState[0],
      setTooltip = _useState[1];

  var xScale = d3.scaleLinear().domain(d3.extent(data, xAccessor)).range([0, dimensions.boundedWidth]).nice();
  var yScale = d3.scaleLinear().domain(d3.extent(data, yAccessor)).range([dimensions.boundedHeight, 0]).nice();

  var xAccessorScaled = function xAccessorScaled(d) {
    return xScale(xAccessor(d));
  };

  var yAccessorScaled = function yAccessorScaled(d) {
    return yScale(yAccessor(d));
  };

  var keyAccessor = function keyAccessor(d, i) {
    return i;
  };

  return /*#__PURE__*/React__default.createElement(ScatterPlotStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React__default.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React__default.createElement("div", null, "count: ", tooltip.data.length), /*#__PURE__*/React__default.createElement("div", null, "xAccessor: ", xAccessor(tooltip.data)), /*#__PURE__*/React__default.createElement("div", null, "yAccessor: ", yAccessor(tooltip.data))), /*#__PURE__*/React__default.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React__default.createElement(Axis, {
    dimensions: dimensions,
    dimension: "x",
    scale: xScale,
    label: xLabel
  }), /*#__PURE__*/React__default.createElement(Axis, {
    dimensions: dimensions,
    dimension: "y",
    scale: yScale,
    label: yLabel
  }), /*#__PURE__*/React__default.createElement(Circles, {
    data: data,
    keyAccessor: keyAccessor,
    xAccessor: xAccessorScaled,
    yAccessor: yAccessorScaled,
    setTooltip: setTooltip,
    fill: "#9980fa"
  })));
};

ScatterPlot.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string
};
ScatterPlot.defaultProps = {
  xAccessor: function xAccessor(d) {
    return d.x;
  },
  yAccessor: function yAccessor(d) {
    return d.y;
  }
};
var ScatterPlotStyle = styled(ChartGeneralStyle)(_templateObject$a());

function _templateObject$b() {
  var data = _taggedTemplateLiteralLoose(["\n  transition: all 0.3s ease-out;\n\n  &.Line--type-area {\n    fill: ", ";\n    stroke-width: 0;\n  }\n\n  &.Line--type-line {\n    fill: none;\n    stroke: ", ";\n    stroke-width: 3px;\n    stroke-linecap: round;\n  }\n"]);

  _templateObject$b = function _templateObject() {
    return data;
  };

  return data;
}

var Line$1 = function Line(_ref) {
  var type = _ref.type,
      data = _ref.data,
      xAccessor = _ref.xAccessor,
      yAccessor = _ref.yAccessor,
      y0Accessor = _ref.y0Accessor,
      interpolation = _ref.interpolation,
      props = _objectWithoutPropertiesLoose(_ref, ["type", "data", "xAccessor", "yAccessor", "y0Accessor", "interpolation", "setTooltip"]);

  var lineGenerator = d3[type]().x(xAccessor).y(yAccessor).curve(interpolation);

  if (type === "area") {
    lineGenerator.y0(y0Accessor).y1(yAccessor);
  }

  return /*#__PURE__*/React__default.createElement(LineStyle, _extends({}, props, {
    className: "Line--type-" + type,
    d: lineGenerator(data)
  }));
};

Line$1.propTypes = {
  type: PropTypes.oneOf(["line", "area"]),
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  y0Accessor: accessorPropsType,
  interpolation: PropTypes.func
};
Line$1.defaultProps = {
  type: "line",
  y0Accessor: 0,
  interpolation: d3.curveMonotoneX
};
var LineStyle = styled.path(_templateObject$b(), function (props) {
  return props.fill;
}, function (props) {
  return props.stroke;
});

function _templateObject$c() {
  var data = _taggedTemplateLiteralLoose(["\n  height: 300px;\n  min-width: 500px;\n  width: calc(100% + 1em);\n  position: relative;\n"]);

  _templateObject$c = function _templateObject() {
    return data;
  };

  return data;
}
var formatDate = d3.timeFormat("%-b %-d");
var gradientColors$4 = ["#9980fa", "rgb(226, 222, 243)"];

var Timeline = function Timeline(_ref) {
  var data = _ref.data,
      xAccessor = _ref.xAccessor,
      yAccessor = _ref.yAccessor,
      label = _ref.label;

  var _useState = React.useState(false),
      tooltip = _useState[0],
      setTooltip = _useState[1];

  var _useChartDimensions = useChartDimensions(),
      ref = _useChartDimensions[0],
      dimensions = _useChartDimensions[1];

  var gradientId = useUniqueId("Timeline-gradient");
  var xScale = d3.scaleTime().domain(d3.extent(data.dates, function (d) {
    return d;
  })).range([0, dimensions.boundedWidth]);
  var yScale = d3.scaleLinear().domain([d3.min(data.series.map(function (series) {
    return d3.min(series, yAccessor);
  }, function (d) {
    return d;
  })), d3.max(data.series.map(function (series) {
    return d3.max(series, yAccessor);
  }, function (d) {
    return d;
  }))]).range([dimensions.boundedHeight, 0]).nice();

  var xAccessorScaled = function xAccessorScaled(d) {
    return xScale(xAccessor(d));
  };

  var yAccessorScaled = function yAccessorScaled(d) {
    return yScale(yAccessor(d));
  };

  var y0AccessorScaled = yScale(yScale.domain()[0]);

  var keyAccessor = function keyAccessor(d, i) {
    return i;
  };

  return /*#__PURE__*/React__default.createElement(TimelineStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React__default.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React__default.createElement("div", null, "xAccessor: ", "" + xAccessor(tooltip.data)), /*#__PURE__*/React__default.createElement("div", null, "yAccessor: ", yAccessor(tooltip.data))), /*#__PURE__*/React__default.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors$4,
    x2: "0%",
    y2: "100%"
  })), /*#__PURE__*/React__default.createElement(Axis, {
    dimension: "x",
    scale: xScale,
    formatTick: formatDate
  }), /*#__PURE__*/React__default.createElement(Axis, {
    dimension: "y",
    scale: yScale,
    label: label
  }), data && data.series.map(function (series, i) {
    return /*#__PURE__*/React__default.createElement("g", {
      key: i
    }, /*#__PURE__*/React__default.createElement(Line$1, {
      data: series,
      xAccessor: xAccessorScaled,
      yAccessor: yAccessorScaled,
      stroke: "url(#" + gradientId + ")",
      fill: "rgba(152, 128, 250, 0.185)"
    }), /*#__PURE__*/React__default.createElement(Circles, {
      data: series,
      keyAccessor: keyAccessor,
      xAccessor: xAccessorScaled,
      yAccessor: yAccessorScaled,
      setTooltip: setTooltip,
      fill: "url(#" + gradientId + ")"
    }));
  })));
};

Timeline.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  label: PropTypes.string
};
Timeline.defaultProps = {
  xAccessor: function xAccessor(d) {
    return d.x;
  },
  yAccessor: function yAccessor(d) {
    return d.y;
  }
};
var TimelineStyle = styled(ChartGeneralStyle)(_templateObject$c());

function _templateObject$d() {
  var data = _taggedTemplateLiteralLoose(["\n  min-width: 500px;\n  width: calc(100% + 1em);\n  position: relative;\n  height: 200px;\n"]);

  _templateObject$d = function _templateObject() {
    return data;
  };

  return data;
}
var formatDate$1 = d3.timeFormat("%-b %-d");
var gradientColors$5 = ["#9980fa", "rgb(226, 222, 243)"];

var TimelineBrush = function TimelineBrush(_ref) {
  var _React$createElement;

  var data = _ref.data,
      xAccessor = _ref.xAccessor,
      yAccessor = _ref.yAccessor,
      label = _ref.label,
      setFilteredData = _ref.setFilteredData;

  var _useChartDimensions = useChartDimensions(),
      ref = _useChartDimensions[0],
      dimensions = _useChartDimensions[1];

  var _useState = React.useState(),
      brushSelectionFilter = _useState[0],
      setBrushSelectionFilter = _useState[1];

  var _useState2 = React.useState(),
      brushSelection = _useState2[0],
      setBrushSelection = _useState2[1];

  var gradientId = useUniqueId("TimelineBrush-gradient");
  var xScale = d3.scaleTime().domain(d3.extent(data.dates, function (d) {
    return d;
  })).range([0, dimensions.boundedWidth]);
  var yScale = d3.scaleLinear().domain([d3.min(data.series.map(function (series) {
    return d3.min(series, yAccessor);
  }, function (d) {
    return d;
  })), d3.max(data.series.map(function (series) {
    return d3.max(series, yAccessor);
  }, function (d) {
    return d;
  }))]).range([dimensions.boundedHeight, 0]).nice();

  var xAccessorScaled = function xAccessorScaled(d) {
    return xScale(xAccessor(d));
  };

  var yAccessorScaled = function yAccessorScaled(d) {
    return yScale(yAccessor(d));
  };

  var y0AccessorScaled = yScale(yScale.domain()[0]);

  var keyAccessor = function keyAccessor(d, i) {
    return i;
  };

  var _useState3 = React.useState(),
      boundingClientRect = _useState3[0],
      setBoundingClientRect = _useState3[1];

  React.useEffect(function () {
    if (!ref) return;
    setBoundingClientRect(ref.current.getBoundingClientRect());
  }, []);
  React.useEffect(function () {
    if (!brushSelectionFilter) return setFilteredData(data);
    if (!data) return;
    var updatedFilteredSeries = data.series.map(function (series) {
      return series.filter(function (row) {
        var xScaled = row.date;
        var yScaled = row.temperature;
        var result = makeInSelection()();
        var result2 = makeInSelection();
        var result3 = inSelection(xScaled, yScaled);
        return inSelection(xScaled, yScaled);
      });
    }).filter(function (series) {
      return series.length !== 0;
    });
    if (!updatedFilteredSeries || updatedFilteredSeries.length === 0) return;
    var updatedFilteredDates = updatedFilteredSeries[0].map(xAccessor);
    var updatedFilteredData = {
      dates: updatedFilteredDates,
      series: updatedFilteredSeries
    };
    console.log("updating the filterd date");
    setFilteredData(updatedFilteredData);
  }, [brushSelectionFilter]);

  var makeInSelection = function makeInSelection(x, y) {
    if (brushSelectionFilter) {
      var _brushSelectionFilter = brushSelectionFilter.map(function (_ref2) {
        var xSelection = _ref2[0],
            ySelection = _ref2[1];
        return [xScale.invert(xSelection), yScale.invert(ySelection)];
      }),
          _brushSelectionFilter2 = _brushSelectionFilter[0],
          x0 = _brushSelectionFilter2[0],
          y1 = _brushSelectionFilter2[1],
          _brushSelectionFilter3 = _brushSelectionFilter[1],
          x1 = _brushSelectionFilter3[0],
          y0 = _brushSelectionFilter3[1];

      return function (x, y) {
        return x >= x0 && x <= x1 && y >= y0 && y <= y1;
      };
    }

    return function () {
      return false;
    };
  };

  var inSelection = makeInSelection();
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("p", null, "left click and swipe over a region to drill down the chart above"), /*#__PURE__*/React__default.createElement(TimelineBrushStyle, {
    ref: ref
  }, /*#__PURE__*/React__default.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors$5,
    x2: "0%",
    y2: "100%"
  })), /*#__PURE__*/React__default.createElement(Axis, {
    dimension: "x",
    scale: xScale,
    formatTick: formatDate$1
  }), /*#__PURE__*/React__default.createElement(Axis, {
    dimension: "y",
    scale: yScale,
    label: label
  }), data && data.series.map(function (series, i) {
    return /*#__PURE__*/React__default.createElement("g", {
      key: i
    }, /*#__PURE__*/React__default.createElement(Line$1, {
      data: series,
      xAccessor: xAccessorScaled,
      yAccessor: yAccessorScaled,
      stroke: "url(#" + gradientId + ")",
      fill: "rgba(152, 128, 250, 0.185)"
    }), /*#__PURE__*/React__default.createElement(Circles, {
      data: series,
      keyAccessor: keyAccessor,
      xAccessor: xAccessorScaled,
      yAccessor: yAccessorScaled,
      fill: "url(#" + gradientId + ")",
      inSelection: inSelection,
      xScale: xScale,
      yScale: yScale,
      xAccessorBeforeScale: xAccessor,
      yAccessorBeforeScale: yAccessor
    }));
  }), /*#__PURE__*/React__default.createElement(SVGBrush, (_React$createElement = {
    extent: [[0, 0], [dimensions.boundedWidth, dimensions.boundedHeight]],
    getEventMouse: function getEventMouse(event) {
      var clientX = event.clientX,
          clientY = event.clientY;
      var left = boundingClientRect.left,
          top = boundingClientRect.top;
      return [clientX - left - (dimensions.width - dimensions.boundedWidth) / 2 - 16, clientY - top];
    },
    brushType: "x",
    onBrushEnd: function onBrushEnd(_ref3) {
      var selection = _ref3.selection;
      setBrushSelectionFilter(selection);
      setBrushSelection(selection);
    },
    selection: brushSelectionFilter && brushSelectionFilter
  }, _React$createElement["selection"] = brushSelection, _React$createElement.onBrushStart = function onBrushStart() {
    return setBrushSelection();
  }, _React$createElement)))));
};

TimelineBrush.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  label: PropTypes.string
};
TimelineBrush.defaultProps = {
  xAccessor: function xAccessor(d) {
    return d.x;
  },
  yAccessor: function yAccessor(d) {
    return d.y;
  }
};
var TimelineBrushStyle = styled(ChartGeneralStyle)(_templateObject$d());

function _templateObject$e() {
  var data = _taggedTemplateLiteralLoose(["\n  min-width: 500px;\n  width: calc(100% + 1em);\n  position: relative;\n  height: 350px;\n"]);

  _templateObject$e = function _templateObject() {
    return data;
  };

  return data;
}
var formatDate$2 = d3.timeFormat("%-b %-d");
var gradientColors$6 = ["#9980fa", "rgb(226, 222, 243)"];

var TimelineFilteredByBrush = function TimelineFilteredByBrush(_ref) {
  var data = _ref.data,
      xAccessor = _ref.xAccessor,
      yAccessor = _ref.yAccessor,
      label = _ref.label;

  var _useState = React.useState(false),
      tooltip = _useState[0],
      setTooltip = _useState[1];

  var _useState2 = React.useState(data),
      filteredData = _useState2[0],
      setFilteredData = _useState2[1];

  var _useChartDimensions = useChartDimensions(),
      ref = _useChartDimensions[0],
      dimensions = _useChartDimensions[1];

  var gradientId = useUniqueId("TimelineFilteredByBrush-gradient");
  var xScale = d3.scaleTime().domain(d3.extent(filteredData.dates, function (d) {
    return d;
  })).range([0, dimensions.boundedWidth]);
  var yScale = d3.scaleLinear().domain([d3.min(filteredData.series.map(function (series) {
    return d3.min(series, yAccessor);
  }, function (d) {
    return d;
  })), d3.max(filteredData.series.map(function (series) {
    return d3.max(series, yAccessor);
  }, function (d) {
    return d;
  }))]).range([dimensions.boundedHeight, 0]).nice();

  var xAccessorScaled = function xAccessorScaled(d) {
    return xScale(xAccessor(d));
  };

  var yAccessorScaled = function yAccessorScaled(d) {
    return yScale(yAccessor(d));
  };

  var y0AccessorScaled = yScale(yScale.domain()[0]);

  var keyAccessor = function keyAccessor(d, i) {
    return i;
  };

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(TimelineFilteredByBrushStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React__default.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React__default.createElement("div", null, "xAccessor: ", "" + xAccessor(tooltip.data)), /*#__PURE__*/React__default.createElement("div", null, "yAccessor: ", yAccessor(tooltip.data))), /*#__PURE__*/React__default.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors$6,
    x2: "0%",
    y2: "100%"
  })), /*#__PURE__*/React__default.createElement(Axis, {
    dimension: "x",
    scale: xScale,
    formatTick: formatDate$2
  }), /*#__PURE__*/React__default.createElement(Axis, {
    dimension: "y",
    scale: yScale,
    label: label
  }), filteredData && filteredData.series.map(function (series, i) {
    return /*#__PURE__*/React__default.createElement("g", {
      key: i
    }, /*#__PURE__*/React__default.createElement(Line$1, {
      data: series,
      xAccessor: xAccessorScaled,
      yAccessor: yAccessorScaled,
      stroke: "url(#" + gradientId + ")",
      fill: "rgba(152, 128, 250, 0.185)"
    }), /*#__PURE__*/React__default.createElement(Circles, {
      data: series,
      keyAccessor: keyAccessor,
      xAccessor: xAccessorScaled,
      yAccessor: yAccessorScaled,
      setTooltip: setTooltip,
      fill: "url(#" + gradientId + ")",
      xScale: xScale,
      yScale: yScale,
      xAccessorBeforeScale: xAccessor,
      yAccessorBeforeScale: yAccessor
    }));
  }))), /*#__PURE__*/React__default.createElement(TimelineBrush, {
    data: data,
    xAccessor: xAccessor,
    yAccessor: yAccessor,
    label: label,
    setFilteredData: setFilteredData
  }));
};

TimelineFilteredByBrush.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  label: PropTypes.string
};
TimelineFilteredByBrush.defaultProps = {
  xAccessor: function xAccessor(d) {
    return d.x;
  },
  yAccessor: function yAccessor(d) {
    return d.y;
  }
};
var TimelineFilteredByBrushStyle = styled(ChartGeneralStyle)(_templateObject$e());

var randomAroundMean = function randomAroundMean(mean, deviation) {
  return mean + boxMullerRandom() * deviation;
};

var boxMullerRandom = function boxMullerRandom() {
  return Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random());
};

var today = new Date();
var formatDate$3 = d3.timeFormat("%m/%d/%Y");
var getTimelineData = function getTimelineData(length) {
  if (length === void 0) {
    length = 100;
  }

  var lastTemperature = randomAroundMean(70, 20);
  var firstTemperature = d3.timeDay.offset(today, -length);
  return new Array(length).fill(0).map(function (d, i) {
    lastTemperature += randomAroundMean(0, 2);
    return {
      date: d3.timeDay.offset(firstTemperature, i),
      temperature: lastTemperature
    };
  });
};
var getScatterData = function getScatterData(count) {
  if (count === void 0) {
    count = 100;
  }

  return new Array(count).fill(0).map(function (d, i) {
    return {
      temperature: randomAroundMean(70, 20),
      humidity: randomAroundMean(0.5, 0.1)
    };
  });
};
var catagoeies = ["dave", "emma", "faker", "teddy", "canna", "effort", "cuzz"];
var getCategoricalData = function getCategoricalData(count) {
  if (count === void 0) {
    count = 7;
  }

  return new Array(count).fill(0).map(function (d, i) {
    return {
      score: randomAroundMean(70, 20),
      player: catagoeies[i]
    };
  });
};

var getRandomNumberInRange = function getRandomNumberInRange(min, max) {
  return Math.random() * (max - min) + min;
};
var getRandomValue = function getRandomValue(arr) {
  return arr[Math.floor(getRandomNumberInRange(0, arr.length))];
};
var sentenceCase = function sentenceCase(str) {
  return [str.slice(0, 1).toUpperCase(), str.slice(1)].join("");
};

var useInterval = function useInterval(callback, delay) {
  var savedCallback = React.useRef();
  React.useEffect(function () {
    savedCallback.current = callback;
  });
  React.useEffect(function () {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      var id = setInterval(tick, delay);
      return function () {
        return clearInterval(id);
      };
    }
  }, [delay]);
};

var ExampleComponent = function ExampleComponent(_ref) {
  var text = _ref.text;
  return /*#__PURE__*/React__default.createElement("div", {
    className: styles.test
  }, "Example Component: ", text);
};

exports.BarChart = BarChart;
exports.BoxPlot = BoxPlot;
exports.ExampleComponent = ExampleComponent;
exports.Histogram = Histogram;
exports.Pie = Pie;
exports.ScatterPlot = ScatterPlot;
exports.Timeline = Timeline;
exports.TimelineBrush = TimelineBrush;
exports.TimelineFilteredByBrush = TimelineFilteredByBrush;
exports.getCategoricalData = getCategoricalData;
exports.getRandomNumberInRange = getRandomNumberInRange;
exports.getRandomValue = getRandomValue;
exports.getScatterData = getScatterData;
exports.getTimelineData = getTimelineData;
exports.sentenceCase = sentenceCase;
exports.useInterval = useInterval;
//# sourceMappingURL=index.js.map
