import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { max, format, scaleBand, scaleLinear, extent, histogram, quantile, min, pie, arc, schemePaired, curveMonotoneX, timeFormat, scaleTime, timeDay } from 'd3';
import styled from 'styled-components';
import SVGBrush from 'react-svg-brush';

var styles = {"test":"_styles-module__test__3ybTi"};

let _ = t => t,
    _t,
    _t2,
    _t3;
const ChartGeneralStyle = styled.div(_t || (_t = _`
  background: white;
  overflow: visible;
  margin-bottom: 2em;
  margin-right: 2em;
`));
const Text = styled.text(_t2 || (_t2 = _`
  fill: #95a5a6;
`));
const Line = styled.line(_t3 || (_t3 = _`
  transition: all 0.3s ease-out;
`));

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

const accessorPropsType = PropTypes.oneOfType([PropTypes.func, PropTypes.number]);
const callAccessor = (accessor, d, i) => typeof accessor === "function" ? accessor(d, i) : accessor;
const dimensionsPropsType = PropTypes.shape({
  height: PropTypes.number,
  width: PropTypes.number,
  marginTop: PropTypes.number,
  marginRight: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number
});
const combineChartDimensions = dimensions => {
  let parsedDimensions = {
    marginTop: 40,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 75,
    ...dimensions
  };
  return { ...parsedDimensions,
    boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
    boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0)
  };
};
const useChartDimensions = passedSettings => {
  const ref = useRef();
  const dimensions = combineChartDimensions(passedSettings);
  const [width, changeWidth] = useState(0);
  const [height, changeHeight] = useState(0);
  useEffect(() => {
    if (dimensions.width && dimensions.height) return [ref, dimensions];
    const element = ref.current;
    const resizeObserver = new index(entries => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;
      const entry = entries[0];
      if (width !== entry.contentRect.width) changeWidth(entry.contentRect.width);
      if (height !== entry.contentRect.height) changeHeight(entry.contentRect.height);
    });
    resizeObserver.observe(element);
    return () => resizeObserver.unobserve(element);
  }, [passedSettings, height, width, dimensions]);
  const newSettings = combineChartDimensions({ ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height
  });
  return [ref, newSettings];
};
let lastId = 0;
const useUniqueId = (prefix = "") => {
  lastId++;
  return [prefix, lastId].join("-");
};

let _$1 = t => t,
    _t$1;
const ChartContext = createContext();
const useChartDimensions$1 = () => useContext(ChartContext);

const Chart = ({
  dimensions,
  children
}) => {
  return /*#__PURE__*/React.createElement(ChartContainerStyle, {
    width: dimensions.width,
    height: dimensions.height
  }, /*#__PURE__*/React.createElement(ChartContext.Provider, {
    value: dimensions
  }, /*#__PURE__*/React.createElement("g", {
    transform: `translate(${dimensions.marginLeft}, ${dimensions.marginTop})`
  }, children)));
};

Chart.propTypes = {
  dimensions: dimensionsPropsType
};
Chart.defaultProps = {
  dimensions: {}
};
const ChartContainerStyle = styled.svg(_t$1 || (_t$1 = _$1`
  overflow: visible;
`));

let _$2 = t => t,
    _t$2;

const Bars = ({
  data,
  keyAccessor,
  xAccessor,
  yAccessor,
  widthAccessor,
  heightAccessor,
  scaleBandAxis,
  setTooltip,
  padding,
  fill,
  ...props
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, data.map((d, i) => /*#__PURE__*/React.createElement(Rect, Object.assign({}, props, {
    fill: fill,
    key: keyAccessor(d, i),
    x: scaleBandAxis === "y" ? 0 : callAccessor(xAccessor, d, i) + padding / 2,
    y: callAccessor(yAccessor, d, i),
    width: max([callAccessor(widthAccessor, d, i) - (scaleBandAxis === "y" ? 0 : padding), 0]),
    height: max([callAccessor(heightAccessor, d, i) - (scaleBandAxis === "y" ? padding : 0), 0]),
    onMouseOver: () => setTooltip({
      x: (scaleBandAxis === "y" ? 0 : callAccessor(xAccessor, d, i)) + callAccessor(widthAccessor, d, i) / 2,
      y: callAccessor(yAccessor, d, i),
      data: d
    }),
    onMouseOut: () => setTooltip(false)
  }))));
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
const Rect = styled.rect(_t$2 || (_t$2 = _$2`
  fill: ${0};
  transition: all 0.3s ease-out;

  &:hover {
    fill: maroon;
  }
`), props => props.fill);

let _$3 = t => t,
    _t$3,
    _t2$1,
    _t3$1,
    _t4,
    _t5;
const axisComponentsByDimension = {
  x: AxisHorizontal,
  y: AxisVertical
};

const Axis = ({
  dimension,
  ...props
}) => {
  const dimensions = useChartDimensions$1();
  const Component = axisComponentsByDimension[dimension];
  if (!Component) return null;
  const tickLabelCenter = props.scale.bandwidth ? true : false;
  return /*#__PURE__*/React.createElement(Component, Object.assign({
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
  formatTick: format(",")
};

function AxisHorizontal({
  dimensions,
  label,
  formatTick,
  scale,
  tickLabelCenter,
  ...props
}) {
  const numberOfTicks = dimensions.boundedWidth < 600 ? dimensions.boundedWidth / 100 : dimensions.boundedWidth / 250;
  const ticks = tickLabelCenter ? scale.domain() : scale.ticks(numberOfTicks);
  return /*#__PURE__*/React.createElement(AxisHorizontalStyle, Object.assign({
    transform: `translate(0, ${dimensions.boundedHeight})`
  }, props), /*#__PURE__*/React.createElement(Axis__line, {
    x2: dimensions.boundedWidth
  }), ticks.map((tick, i) => /*#__PURE__*/React.createElement(Axis__tick, {
    key: tick,
    transform: `translate(${tickLabelCenter ? scale(tick) + scale.step() / 2 : scale(tick)}, 25)`
  }, formatTick(tick))), ticks.map((tick, i) => /*#__PURE__*/React.createElement(Axis__line, {
    key: tick,
    x1: `${scale(tick)}`,
    x2: `${scale(tick)}`,
    y2: 5
  })), label && /*#__PURE__*/React.createElement(Axis__label, {
    transform: `translate(${dimensions.boundedWidth / 2}, 60)`
  }, label));
}

function AxisVertical({
  dimensions,
  label,
  formatTick,
  scale,
  tickLabelCenter,
  ...props
}) {
  const numberOfTicks = dimensions.boundedHeight / 70;
  const ticks = tickLabelCenter ? scale.domain() : scale.ticks(numberOfTicks);
  return /*#__PURE__*/React.createElement(AxisVerticalStyle, props, /*#__PURE__*/React.createElement(Axis__line, {
    y2: dimensions.boundedHeight
  }), ticks.map((tick, i) => /*#__PURE__*/React.createElement(Axis__tick, {
    key: tick,
    transform: `translate(-16, ${tickLabelCenter ? scale(tick) + scale.step() / 2 : scale(tick)})`
  }, formatTick(tick))), label && /*#__PURE__*/React.createElement(Axis__label, {
    style: {
      transform: `translate(-56px, ${dimensions.boundedHeight / 2}px) rotate(-90deg)`
    }
  }, label));
}

const Axis__line = styled.line(_t$3 || (_t$3 = _$3`
  stroke: #bdc3c7;
`));
const Axis__label = styled(Text)(_t2$1 || (_t2$1 = _$3`
  text-anchor: middle;
  font-size: 0.9em;
  letter-spacing: 0.01em;
`));
const Axis__tick = styled(Text)(_t3$1 || (_t3$1 = _$3`
  font-size: 0.8em;
  transition: all 0.3s ease-out;
  text-anchor: middle;
`));
const AxisHorizontalStyle = styled.g(_t4 || (_t4 = _$3`
  dominant-baseline: middle;
  text-anchor: end;
`));
const AxisVerticalStyle = styled.g(_t5 || (_t5 = _$3`
  text-anchor: middle;
`));

const Gradient = ({
  id,
  colors,
  ...props
}) => /*#__PURE__*/React.createElement("linearGradient", Object.assign({
  id: id,
  gradientUnits: "userSpaceOnUse",
  spreadMethod: "pad"
}, props), colors.map((color, i) => /*#__PURE__*/React.createElement("stop", {
  key: i,
  offset: `${i * 100 / (colors.length - 1)}%`,
  stopColor: color
})));

Gradient.propTypes = {
  id: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string)
};
Gradient.defaultProps = {
  id: "Gradient",
  colors: []
};

let _$4 = t => t,
    _t$4;
const TooltipContainer = styled.div(_t$4 || (_t$4 = _$4`
  position: absolute;
  top: -15px;
  left: 0;
  padding: 0.6em 1em;
  background: #fff;
  text-align: center;
  border: 1px solid #ddd;
  z-index: 10;
  transition: all 0.2s ease-out;
  pointer-events: none;
  overflow: visible;
  transform: translate(
    calc(-50% + ${0}px),
    calc(-100% + ${0}px)
  );

  &:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 12px;
    height: 12px;
    background: white;
    border: 1px solid #ddd;
    border-top-color: transparent;
    border-left-color: transparent;
    transform: translate(-50%, 50%) rotate(45deg);
    transform-origin: center center;
    z-index: 10;
  }
`), props => props.x, props => props.y);

const Tooltip = props => {
  return /*#__PURE__*/React.createElement(TooltipContainer, Object.assign({
    id: "tooltip",
    className: "tooltip"
  }, props), props.children);
};

let _$5 = t => t,
    _t$5;
const gradientColors = ["#9980FA", "rgb(226, 222, 243)"];

const BarChart = ({
  data,
  xAccessor,
  yAccessor,
  label,
  scaleBandAxis
}) => {
  const gradientId = useUniqueId("Histogram-gradient");
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  });
  const [tooltip, setTooltip] = useState(false);
  const bandScale = scaleBand().domain(data.map(scaleBandAxis === "x" ? xAccessor : yAccessor)).range(scaleBandAxis === "x" ? [0, dimensions.boundedWidth] : [dimensions.boundedHeight, 0]).padding(0.1);
  const linearScale = scaleLinear().domain([0, max(data.map(scaleBandAxis === "x" ? yAccessor : xAccessor))]).range(scaleBandAxis === "x" ? [dimensions.boundedHeight, 0] : [0, dimensions.boundedWidth]).nice();
  const xScale = scaleBandAxis === "x" ? bandScale : linearScale;
  const yScale = scaleBandAxis === "x" ? linearScale : bandScale;

  const xAccessorScaled = d => xScale(xAccessor(d));

  const yAccessorScaled = d => yScale(yAccessor(d));

  const widthAccessorScaled = d => scaleBandAxis === "x" ? xScale.step() : xScale(xAccessor(d));

  const heightAccessorScaled = d => scaleBandAxis === "x" ? dimensions.boundedHeight - yScale(yAccessor(d)) : yScale.step();

  const keyAccessor = (d, i) => i;

  return /*#__PURE__*/React.createElement(BarChartStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React.createElement("div", null, "xAccessor: ", xAccessor(tooltip.data)), /*#__PURE__*/React.createElement("div", null, "yAccessor: ", yAccessor(tooltip.data))), /*#__PURE__*/React.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors,
    x2: "0",
    y2: "100%"
  })), /*#__PURE__*/React.createElement(Axis, {
    dimensions: dimensions,
    dimension: "x",
    scale: xScale,
    label: label,
    formatTick: scaleBandAxis === "x" ? d => d : format(",")
  }), /*#__PURE__*/React.createElement(Axis, {
    dimensions: dimensions,
    dimension: "y",
    scale: yScale,
    label: "Count",
    formatTick: scaleBandAxis === "x" ? format(",") : d => d
  }), /*#__PURE__*/React.createElement(Bars, {
    data: data,
    keyAccessor: keyAccessor,
    xAccessor: xAccessorScaled,
    yAccessor: yAccessorScaled,
    widthAccessor: widthAccessorScaled,
    heightAccessor: heightAccessorScaled,
    fill: `url(#${gradientId})`,
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
  xAccessor: d => d.x,
  yAccessor: d => d.y,
  scaleBandAxis: "x"
};
const BarChartStyle = styled(ChartGeneralStyle)(_t$5 || (_t$5 = _$5`
  height: 500px;
  flex: 1;
  min-width: 500px;

  position: relative;
`));

let _$6 = t => t,
    _t$6;

const Circles = ({
  data,
  keyAccessor,
  xAccessor,
  yAccessor,
  radius,
  setTooltip,
  fill,
  inSelection,
  xAccessorBeforeScale,
  yAccessorBeforeScale,
  brushSelection,
  xScale,
  yScale
}) => {
  data.map((d, i) => {
    if (!inSelection || !brushSelection) return;
    const x = xAccessorBeforeScale(d, i);
    const y = yAccessorBeforeScale(d, i);
    const dave = inSelection(x, y);
    const [[x0, y1], [x1, y0]] = brushSelection.map(([xd, yd]) => [xScale.invert(xd), yScale.invert(yd)]);
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, data.map((d, i) => /*#__PURE__*/React.createElement(Circle, {
    key: keyAccessor(d, i),
    cx: xAccessor(d, i),
    cy: yAccessor(d, i),
    r: typeof radius == "function" ? radius(d) : radius,
    onMouseOver: () => setTooltip({
      x: xAccessor(d, i),
      y: yAccessor(d, i),
      data: d
    }),
    onMouseOut: () => setTooltip(false),
    fill: inSelection ? inSelection(xAccessorBeforeScale(d, i), yAccessorBeforeScale(d, i)) ? "orange" : fill : fill
  })));
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
const Circle = styled.circle(_t$6 || (_t$6 = _$6`
  fill: ${0};
  transition: all 0.3s ease-out;
  &:hover {
    fill: maroon;
  }
`), props => props.fill);

let _$7 = t => t,
    _t$7;
const gradientColors$1 = ["#9980FA", "rgb(226, 222, 243)"];

const BoxPlot = ({
  data,
  xAccessor,
  yAccessor,
  label
}) => {
  const gradientId = useUniqueId("Histogram-gradient");
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  });
  const [tooltip, setTooltip] = useState(false);
  const numberOfThresholds = dimensions.boundedWidth / 40;
  const xScale = scaleLinear().domain(extent(data, xAccessor)).range([0, dimensions.boundedWidth]).nice(numberOfThresholds);
  const binsGenerator = histogram().value(xAccessor).thresholds(xScale.ticks(numberOfThresholds));
  const bins = binsGenerator(data).map(bin => {
    bin.sort((a, b) => a.temperature - b.temperature);
    const values = bin.map(yAccessor);
    const min = values[0];
    const max = values[values.length - 1];
    const q1 = quantile(values, 0.25);
    const q2 = quantile(values, 0.5);
    const q3 = quantile(values, 0.75);
    const iqr = q3 - q1;
    const r0 = Math.max(min, q1 - iqr * 1.5);
    const r1 = Math.min(max, q3 + iqr * 1.5);
    bin.quartiles = [q1, q2, q3];
    bin.range = [r0, r1];
    bin.outliers = bin.filter(v => v.temperature < r0 || v.temperature > r1);
    return bin;
  });
  const yScale = scaleLinear().domain([min(bins, d => d.range[0]), max(bins, d => d.range[1])]).range([dimensions.boundedHeight, 0]).nice();

  const xAccessorScaled = d => xScale(xAccessor(d)) + dimensions.boundedWidth / numberOfThresholds / 2;

  const yAccessorScaled = d => yScale(yAccessor(d));

  const keyAccessor = (d, i) => i;

  return /*#__PURE__*/React.createElement(BoxPlotStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React.createElement("div", null, "count: ", tooltip.data.length), /*#__PURE__*/React.createElement("div", null, "xAccessor: ", tooltip.data.x0), /*#__PURE__*/React.createElement("div", null, "yAccessor: ", yAccessor(tooltip.data)), tooltip.data.quartiles && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "iqr 1: ", tooltip.data.quartiles[0]), /*#__PURE__*/React.createElement("div", null, "iqr 2: ", tooltip.data.quartiles[1]), /*#__PURE__*/React.createElement("div", null, "iqr 3: ", tooltip.data.quartiles[2]))), /*#__PURE__*/React.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors$1,
    x2: "0",
    y2: "100%"
  })), /*#__PURE__*/React.createElement(Axis, {
    dimensions: dimensions,
    dimension: "x",
    scale: xScale,
    label: label
  }), /*#__PURE__*/React.createElement(Axis, {
    dimensions: dimensions,
    dimension: "y",
    scale: yScale,
    label: "Count"
  }), bins.map((d, i) => d.length > 0 && /*#__PURE__*/React.createElement("g", {
    key: `${i}`
  }, /*#__PURE__*/React.createElement("path", {
    key: `range-${i}`,
    d: `M${xScale((d.x0 + d.x1) / 2)},${yScale(d.range[1])} V${yScale(d.range[0])}`,
    stroke: "black"
  }), /*#__PURE__*/React.createElement("path", {
    key: `quartile-${i}`,
    d: `
                      M${xScale(d.x0) + 1},${yScale(d.quartiles[2])}
                      H${xScale(d.x1)}
                      V${yScale(d.quartiles[0])}
                      H${xScale(d.x0) + 1}
                      Z
                    `,
    fill: "#ddd",
    onMouseEnter: () => setTooltip({
      data: d,
      x: xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2,
      y: yScale(d.quartiles[1])
    }),
    onMouseOut: () => setTooltip(false)
  }), /*#__PURE__*/React.createElement("path", {
    key: `avg-${i}`,
    d: `
                      M${xScale(d.x0) + 1},${yScale(d.quartiles[1])}
                      H${xScale(d.x1)}
                    `,
    stroke: "blue"
  }), /*#__PURE__*/React.createElement(Circles, {
    data: d.outliers,
    keyAccessor: keyAccessor,
    xAccessor: xAccessorScaled,
    yAccessor: yAccessorScaled,
    setTooltip: setTooltip,
    fill: "#9980fa"
  })))));
};

BoxPlot.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string
};
BoxPlot.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y
};
const BoxPlotStyle = styled(ChartGeneralStyle)(_t$7 || (_t$7 = _$7`
  height: 500px;
  flex: 1;
  min-width: 500px;

  position: relative;
`));

let _$8 = t => t,
    _t$8;
const gradientColors$2 = ["#9980FA", "rgb(226, 222, 243)"];

const Histogram = ({
  data,
  xAccessor,
  label
}) => {
  const gradientId = useUniqueId("Histogram-gradient");
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  });
  const [tooltip, setTooltip] = useState(false);
  const numberOfThresholds = 9;
  const xScale = scaleLinear().domain(extent(data, xAccessor)).range([0, dimensions.boundedWidth]).nice(numberOfThresholds);
  const binsGenerator = histogram().domain(xScale.domain()).value(xAccessor).thresholds(xScale.ticks(numberOfThresholds));
  const bins = binsGenerator(data);

  const yAccessor = d => d.length;

  const yScale = scaleLinear().domain([0, max(bins, yAccessor)]).range([dimensions.boundedHeight, 0]).nice();
  const barPadding = 2;

  const xAccessorScaled = d => xScale(d.x0) + barPadding;

  const yAccessorScaled = d => yScale(yAccessor(d));

  const widthAccessorScaled = d => xScale(d.x1) - xScale(d.x0) - barPadding;

  const heightAccessorScaled = d => dimensions.boundedHeight - yScale(yAccessor(d));

  const keyAccessor = (d, i) => i;

  return /*#__PURE__*/React.createElement(HistogramStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React.createElement("div", null, "count: ", tooltip.data.length), /*#__PURE__*/React.createElement("div", null, "xAccessor: ", tooltip.data.x0), /*#__PURE__*/React.createElement("div", null, "yAccessor: ", yAccessor(tooltip.data))), /*#__PURE__*/React.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors$2,
    x2: "0",
    y2: "100%"
  })), /*#__PURE__*/React.createElement(Axis, {
    dimensions: dimensions,
    dimension: "x",
    scale: xScale,
    label: label
  }), /*#__PURE__*/React.createElement(Axis, {
    dimensions: dimensions,
    dimension: "y",
    scale: yScale,
    label: "Count"
  }), /*#__PURE__*/React.createElement(Bars, {
    data: bins,
    keyAccessor: keyAccessor,
    xAccessor: xAccessorScaled,
    yAccessor: yAccessorScaled,
    widthAccessor: widthAccessorScaled,
    heightAccessor: heightAccessorScaled,
    setTooltip: setTooltip,
    padding: 0,
    fill: `url(#${gradientId})`
  })));
};

Histogram.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string
};
Histogram.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y
};
const HistogramStyle = styled(ChartGeneralStyle)(_t$8 || (_t$8 = _$8`
  height: 500px;
  flex: 1;
  min-width: 500px;

  position: relative;
`));

let _$9 = t => t,
    _t$9;
const gradientColors$3 = ["#9980FA", "rgb(226, 222, 243)"];

const Pie = ({
  data,
  categoryAccessor,
  valueAccessor,
  label,
  margin
}) => {
  const gradientId = useUniqueId("Histogram-gradient");
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  });
  const [tooltip, setTooltip] = useState(false);
  var outerRadius = min([dimensions.width, dimensions.height]) * 2 / 5 - 10;
  var innerRadius = min([dimensions.width, dimensions.height]) * 2 / 5 - 30;
  var x = (dimensions.boundedWidth - dimensions.marginLeft + dimensions.marginRight) / 2;
  var y = (dimensions.height - dimensions.marginTop - dimensions.marginBottom) / 2;
  var pie$1 = pie().value(valueAccessor).sort(null);
  var arc$1 = arc().innerRadius(innerRadius).outerRadius(outerRadius);
  return /*#__PURE__*/React.createElement(PieStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React.createElement("div", null, "label: ", tooltip.label), /*#__PURE__*/React.createElement("div", null, "value: ", tooltip.value)), /*#__PURE__*/React.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors$3,
    x2: "0",
    y2: "100%"
  })), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${x}, ${y})`
  }, pie$1(data).map((arcData, i) => /*#__PURE__*/React.createElement("path", {
    d: arc$1(arcData),
    style: {
      fill: schemePaired[arcData.index]
    },
    key: arcData.index,
    onMouseOver: () => setTooltip({
      x: arc$1.centroid(arcData)[0] + x,
      y: arc$1.centroid(arcData)[1] + y,
      value: valueAccessor(arcData.data),
      label: categoryAccessor(arcData.data)
    }),
    onMouseOut: () => setTooltip(false)
  })))));
};

Pie.propTypes = {
  categoryAccessor: accessorPropsType,
  valueAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string
};
Pie.defaultProps = {
  categoryAccessor: d => d.x,
  valueAccessor: d => d.y
};
const PieStyle = styled(ChartGeneralStyle)(_t$9 || (_t$9 = _$9`
  height: 500px;
  flex: 1;
  min-width: 300px;

  position: relative;
`));

let _$a = t => t,
    _t$a;

const ScatterPlot = ({
  data,
  xAccessor,
  yAccessor,
  xLabel,
  yLabel
}) => {
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  });
  const [tooltip, setTooltip] = useState(false);
  const xScale = scaleLinear().domain(extent(data, xAccessor)).range([0, dimensions.boundedWidth]).nice();
  const yScale = scaleLinear().domain(extent(data, yAccessor)).range([dimensions.boundedHeight, 0]).nice();

  const xAccessorScaled = d => xScale(xAccessor(d));

  const yAccessorScaled = d => yScale(yAccessor(d));

  const keyAccessor = (d, i) => i;

  return /*#__PURE__*/React.createElement(ScatterPlotStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React.createElement("div", null, "count: ", tooltip.data.length), /*#__PURE__*/React.createElement("div", null, "xAccessor: ", xAccessor(tooltip.data)), /*#__PURE__*/React.createElement("div", null, "yAccessor: ", yAccessor(tooltip.data))), /*#__PURE__*/React.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React.createElement(Axis, {
    dimensions: dimensions,
    dimension: "x",
    scale: xScale,
    label: xLabel
  }), /*#__PURE__*/React.createElement(Axis, {
    dimensions: dimensions,
    dimension: "y",
    scale: yScale,
    label: yLabel
  }), /*#__PURE__*/React.createElement(Circles, {
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
  xAccessor: d => d.x,
  yAccessor: d => d.y
};
const ScatterPlotStyle = styled(ChartGeneralStyle)(_t$a || (_t$a = _$a`
  height: 500px;
  width: 500px;
  position: relative;
`));

let _$b = t => t,
    _t$b;

const Line$1 = ({
  type,
  data,
  xAccessor,
  yAccessor,
  y0Accessor,
  interpolation,
  setTooltip,
  ...props
}) => {
  const lineGenerator = d3[type]().x(xAccessor).y(yAccessor).curve(interpolation);

  if (type === "area") {
    lineGenerator.y0(y0Accessor).y1(yAccessor);
  }

  return /*#__PURE__*/React.createElement(LineStyle, Object.assign({}, props, {
    className: `Line--type-${type}`,
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
  interpolation: curveMonotoneX
};
const LineStyle = styled.path(_t$b || (_t$b = _$b`
  transition: all 0.3s ease-out;

  &.Line--type-area {
    fill: ${0};
    stroke-width: 0;
  }

  &.Line--type-line {
    fill: none;
    stroke: ${0};
    stroke-width: 3px;
    stroke-linecap: round;
  }
`), props => props.fill, props => props.stroke);

let _$c = t => t,
    _t$c;
const formatDate = timeFormat("%-b %-d");
const gradientColors$4 = ["#9980fa", "rgb(226, 222, 243)"];

const Timeline = ({
  data,
  xAccessor,
  yAccessor,
  label
}) => {
  const [tooltip, setTooltip] = useState(false);
  const [ref, dimensions] = useChartDimensions();
  const gradientId = useUniqueId("Timeline-gradient");
  const xScale = scaleTime().domain(extent(data.dates, d => d)).range([0, dimensions.boundedWidth]);
  const yScale = scaleLinear().domain([min(data.series.map(series => min(series, yAccessor), d => d)), max(data.series.map(series => max(series, yAccessor), d => d))]).range([dimensions.boundedHeight, 0]).nice();

  const xAccessorScaled = d => xScale(xAccessor(d));

  const yAccessorScaled = d => yScale(yAccessor(d));

  const y0AccessorScaled = yScale(yScale.domain()[0]);

  const keyAccessor = (d, i) => i;

  return /*#__PURE__*/React.createElement(TimelineStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React.createElement("div", null, "xAccessor: ", `${xAccessor(tooltip.data)}`), /*#__PURE__*/React.createElement("div", null, "yAccessor: ", yAccessor(tooltip.data))), /*#__PURE__*/React.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors$4,
    x2: "0%",
    y2: "100%"
  })), /*#__PURE__*/React.createElement(Axis, {
    dimension: "x",
    scale: xScale,
    formatTick: formatDate
  }), /*#__PURE__*/React.createElement(Axis, {
    dimension: "y",
    scale: yScale,
    label: label
  }), data && data.series.map((series, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement(Line$1, {
    data: series,
    xAccessor: xAccessorScaled,
    yAccessor: yAccessorScaled,
    stroke: `url(#${gradientId})`,
    fill: "rgba(152, 128, 250, 0.185)"
  }), /*#__PURE__*/React.createElement(Circles, {
    data: series,
    keyAccessor: keyAccessor,
    xAccessor: xAccessorScaled,
    yAccessor: yAccessorScaled,
    setTooltip: setTooltip,
    fill: `url(#${gradientId})`
  })))));
};

Timeline.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  label: PropTypes.string
};
Timeline.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y
};
const TimelineStyle = styled(ChartGeneralStyle)(_t$c || (_t$c = _$c`
  height: 300px;
  min-width: 500px;
  width: calc(100% + 1em);
  position: relative;
`));

let _$d = t => t,
    _t$d;
const formatDate$1 = timeFormat("%-b %-d");
const gradientColors$5 = ["#9980fa", "rgb(226, 222, 243)"];

const TimelineBrush = ({
  data,
  xAccessor,
  yAccessor,
  label,
  setFilteredData
}) => {
  const [ref, dimensions] = useChartDimensions();
  const [brushSelectionFilter, setBrushSelectionFilter] = useState();
  const [brushSelection, setBrushSelection] = useState();
  const gradientId = useUniqueId("TimelineBrush-gradient");
  const xScale = scaleTime().domain(extent(data.dates, d => d)).range([0, dimensions.boundedWidth]);
  const yScale = scaleLinear().domain([min(data.series.map(series => min(series, yAccessor), d => d)), max(data.series.map(series => max(series, yAccessor), d => d))]).range([dimensions.boundedHeight, 0]).nice();

  const xAccessorScaled = d => xScale(xAccessor(d));

  const yAccessorScaled = d => yScale(yAccessor(d));

  const y0AccessorScaled = yScale(yScale.domain()[0]);

  const keyAccessor = (d, i) => i;

  const [boundingClientRect, setBoundingClientRect] = useState();
  useEffect(() => {
    if (!ref) return;
    setBoundingClientRect(ref.current.getBoundingClientRect());
  }, []);
  useEffect(() => {
    if (!brushSelectionFilter) return setFilteredData(data);
    if (!data) return;
    const updatedFilteredSeries = data.series.map(series => series.filter(row => {
      const xScaled = row.date;
      const yScaled = row.temperature;
      const result = makeInSelection()();
      const result2 = makeInSelection();
      const result3 = inSelection(xScaled, yScaled);
      return inSelection(xScaled, yScaled);
    })).filter(series => series.length !== 0);
    if (!updatedFilteredSeries || updatedFilteredSeries.length === 0) return;
    const updatedFilteredDates = updatedFilteredSeries[0].map(xAccessor);
    const updatedFilteredData = {
      dates: updatedFilteredDates,
      series: updatedFilteredSeries
    };
    console.log("updating the filterd date");
    setFilteredData(updatedFilteredData);
  }, [brushSelectionFilter]);

  const makeInSelection = (x, y) => {
    if (brushSelectionFilter) {
      const [[x0, y1], [x1, y0]] = brushSelectionFilter.map(([xSelection, ySelection]) => [xScale.invert(xSelection), yScale.invert(ySelection)]);
      return (x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
    }

    return () => false;
  };

  const inSelection = makeInSelection();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "left click and swipe over a region to drill down the chart above"), /*#__PURE__*/React.createElement(TimelineBrushStyle, {
    ref: ref
  }, /*#__PURE__*/React.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors$5,
    x2: "0%",
    y2: "100%"
  })), /*#__PURE__*/React.createElement(Axis, {
    dimension: "x",
    scale: xScale,
    formatTick: formatDate$1
  }), /*#__PURE__*/React.createElement(Axis, {
    dimension: "y",
    scale: yScale,
    label: label
  }), data && data.series.map((series, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement(Line$1, {
    data: series,
    xAccessor: xAccessorScaled,
    yAccessor: yAccessorScaled,
    stroke: `url(#${gradientId})`,
    fill: "rgba(152, 128, 250, 0.185)"
  }), /*#__PURE__*/React.createElement(Circles, {
    data: series,
    keyAccessor: keyAccessor,
    xAccessor: xAccessorScaled,
    yAccessor: yAccessorScaled,
    fill: `url(#${gradientId})`,
    inSelection: inSelection,
    xScale: xScale,
    yScale: yScale,
    xAccessorBeforeScale: xAccessor,
    yAccessorBeforeScale: yAccessor
  }))), /*#__PURE__*/React.createElement(SVGBrush, {
    extent: [[0, 0], [dimensions.boundedWidth, dimensions.boundedHeight]],
    getEventMouse: event => {
      const {
        clientX,
        clientY
      } = event;
      const {
        left,
        top
      } = boundingClientRect;
      return [clientX - left - (dimensions.width - dimensions.boundedWidth) / 2 - 16, clientY - top];
    },
    brushType: "x",
    onBrushEnd: ({
      target,
      type,
      selection,
      sourceEvent
    }) => {
      setBrushSelectionFilter(selection);
      setBrushSelection(selection);
    },
    selection: brushSelectionFilter && brushSelectionFilter,
    selection: brushSelection,
    onBrushStart: () => setBrushSelection()
  }))));
};

TimelineBrush.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  label: PropTypes.string
};
TimelineBrush.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y
};
const TimelineBrushStyle = styled(ChartGeneralStyle)(_t$d || (_t$d = _$d`
  min-width: 500px;
  width: calc(100% + 1em);
  position: relative;
  height: 200px;
`));

let _$e = t => t,
    _t$e;
const formatDate$2 = timeFormat("%-b %-d");
const gradientColors$6 = ["#9980fa", "rgb(226, 222, 243)"];

const TimelineFilteredByBrush = ({
  data,
  xAccessor,
  yAccessor,
  label
}) => {
  const [tooltip, setTooltip] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [ref, dimensions] = useChartDimensions();
  const gradientId = useUniqueId("TimelineFilteredByBrush-gradient");
  const xScale = scaleTime().domain(extent(filteredData.dates, d => d)).range([0, dimensions.boundedWidth]);
  const yScale = scaleLinear().domain([min(filteredData.series.map(series => min(series, yAccessor), d => d)), max(filteredData.series.map(series => max(series, yAccessor), d => d))]).range([dimensions.boundedHeight, 0]).nice();

  const xAccessorScaled = d => xScale(xAccessor(d));

  const yAccessorScaled = d => yScale(yAccessor(d));

  const y0AccessorScaled = yScale(yScale.domain()[0]);

  const keyAccessor = (d, i) => i;

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TimelineFilteredByBrushStyle, {
    ref: ref
  }, tooltip && /*#__PURE__*/React.createElement(Tooltip, {
    tooltipEvent: tooltip,
    x: tooltip.x + dimensions.marginLeft,
    y: tooltip.y + dimensions.marginTop
  }, /*#__PURE__*/React.createElement("div", null, "xAccessor: ", `${xAccessor(tooltip.data)}`), /*#__PURE__*/React.createElement("div", null, "yAccessor: ", yAccessor(tooltip.data))), /*#__PURE__*/React.createElement(Chart, {
    dimensions: dimensions
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(Gradient, {
    id: gradientId,
    colors: gradientColors$6,
    x2: "0%",
    y2: "100%"
  })), /*#__PURE__*/React.createElement(Axis, {
    dimension: "x",
    scale: xScale,
    formatTick: formatDate$2
  }), /*#__PURE__*/React.createElement(Axis, {
    dimension: "y",
    scale: yScale,
    label: label
  }), filteredData && filteredData.series.map((series, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement(Line$1, {
    data: series,
    xAccessor: xAccessorScaled,
    yAccessor: yAccessorScaled,
    stroke: `url(#${gradientId})`,
    fill: "rgba(152, 128, 250, 0.185)"
  }), /*#__PURE__*/React.createElement(Circles, {
    data: series,
    keyAccessor: keyAccessor,
    xAccessor: xAccessorScaled,
    yAccessor: yAccessorScaled,
    setTooltip: setTooltip,
    fill: `url(#${gradientId})`,
    xScale: xScale,
    yScale: yScale,
    xAccessorBeforeScale: xAccessor,
    yAccessorBeforeScale: yAccessor
  }))))), /*#__PURE__*/React.createElement(TimelineBrush, {
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
  xAccessor: d => d.x,
  yAccessor: d => d.y
};
const TimelineFilteredByBrushStyle = styled(ChartGeneralStyle)(_t$e || (_t$e = _$e`
  min-width: 500px;
  width: calc(100% + 1em);
  position: relative;
  height: 350px;
`));

const randomAroundMean = (mean, deviation) => mean + boxMullerRandom() * deviation;

const boxMullerRandom = () => Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random());

const today = new Date();
const formatDate$3 = timeFormat("%m/%d/%Y");
const getTimelineData = (length = 100) => {
  let lastTemperature = randomAroundMean(70, 20);
  const firstTemperature = timeDay.offset(today, -length);
  return new Array(length).fill(0).map((d, i) => {
    lastTemperature += randomAroundMean(0, 2);
    return {
      date: timeDay.offset(firstTemperature, i),
      temperature: lastTemperature
    };
  });
};
const getScatterData = (count = 100) => new Array(count).fill(0).map((d, i) => ({
  temperature: randomAroundMean(70, 20),
  humidity: randomAroundMean(0.5, 0.1)
}));
const catagoeies = ["dave", "emma", "faker", "teddy", "canna", "effort", "cuzz"];
const getCategoricalData = (count = 7) => new Array(count).fill(0).map((d, i) => ({
  score: randomAroundMean(70, 20),
  player: catagoeies[i]
}));

const getRandomNumberInRange = (min, max) => Math.random() * (max - min) + min;
const getRandomValue = arr => arr[Math.floor(getRandomNumberInRange(0, arr.length))];
const sentenceCase = str => [str.slice(0, 1).toUpperCase(), str.slice(1)].join("");

const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  });
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const ExampleComponent = ({
  text
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: styles.test
  }, "Example Component: ", text);
};

export { BarChart, BoxPlot, ExampleComponent, Histogram, Pie, ScatterPlot, Timeline, TimelineBrush, TimelineFilteredByBrush, getCategoricalData, getRandomNumberInRange, getRandomValue, getScatterData, getTimelineData, sentenceCase, useInterval };
//# sourceMappingURL=index.modern.js.map
