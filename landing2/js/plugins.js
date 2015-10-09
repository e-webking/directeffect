// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
/**
 * jQuery.timers - Timer abstractions for jQuery
 * Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 2009/10/16
 *
 * @author Blair Mitchelmore
 * @version 1.2
 *
 **/

jQuery.fn.extend({
    everyTime: function(interval, label, fn, times) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, times);
        });
    },
    oneTime: function(interval, label, fn) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, 1);
        });
    },
    stopTime: function(label, fn) {
        return this.each(function() {
            jQuery.timer.remove(this, label, fn);
        });
    }
});

jQuery.extend({
    timer: {
        global: [],
        guid: 1,
        dataKey: "jQuery.timer",
        regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
        powers: {
            // Yeah this is major overkill...
            'ms': 1,
            'cs': 10,
            'ds': 100,
            's': 1000,
            'das': 10000,
            'hs': 100000,
            'ks': 1000000
        },
        timeParse: function(value) {
            if (value == undefined || value == null)
                return null;
            var result = this.regex.exec(jQuery.trim(value.toString()));
            if (result[2]) {
                var num = parseFloat(result[1]);
                var mult = this.powers[result[2]] || 1;
                return num * mult;
            } else {
                return value;
            }
        },
        add: function(element, interval, label, fn, times) {
            var counter = 0;
            
            if (jQuery.isFunction(label)) {
                if (!times) 
                    times = fn;
                fn = label;
                label = interval;
            }
            
            interval = jQuery.timer.timeParse(interval);

            if (typeof interval != 'number' || isNaN(interval) || interval < 0)
                return;

            if (typeof times != 'number' || isNaN(times) || times < 0) 
                times = 0;
            
            times = times || 0;
            
            var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});
            
            if (!timers[label])
                timers[label] = {};
            
            fn.timerID = fn.timerID || this.guid++;
            
            var handler = function() {
                if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
                    jQuery.timer.remove(element, label, fn);
            };
            
            handler.timerID = fn.timerID;
            
            if (!timers[label][fn.timerID])
                timers[label][fn.timerID] = window.setInterval(handler,interval);
            
            this.global.push( element );
            
        },
        remove: function(element, label, fn) {
            var timers = jQuery.data(element, this.dataKey), ret;
            
            if ( timers ) {
                
                if (!label) {
                    for ( label in timers )
                        this.remove(element, label, fn);
                } else if ( timers[label] ) {
                    if ( fn ) {
                        if ( fn.timerID ) {
                            window.clearInterval(timers[label][fn.timerID]);
                            delete timers[label][fn.timerID];
                        }
                    } else {
                        for ( var fn in timers[label] ) {
                            window.clearInterval(timers[label][fn]);
                            delete timers[label][fn];
                        }
                    }
                    
                    for ( ret in timers[label] ) break;
                    if ( !ret ) {
                        ret = null;
                        delete timers[label];
                    }
                }
                
                for ( ret in timers ) break;
                if ( !ret ) 
                    jQuery.removeData(element, this.dataKey);
            }
        }
    }
});

jQuery(window).bind("unload", function() {
    jQuery.each(jQuery.timer.global, function(index, item) {
        jQuery.timer.remove(item);
    });
});

// Browser
/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.browser.min.js
 *
 *  Copyright (c) 2001-2013. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site:   http://pupunzi.com
 *  blog:   http://pupunzi.open-lab.com
 *  http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 17/01/13 0.12
 *  *****************************************************************************
 */
(function(){if(!jQuery.browser){jQuery.browser={};jQuery.browser.mozilla=!1;jQuery.browser.webkit=!1;jQuery.browser.opera=!1;jQuery.browser.msie=!1;var a=navigator.userAgent;jQuery.browser.name=navigator.appName;jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion);jQuery.browser.majorVersion=parseInt(navigator.appVersion,10);var c,b;if(-1!=(b=a.indexOf("Opera"))){if(jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=a.substring(b+6),-1!=(b=a.indexOf("Version")))jQuery.browser.fullVersion=
a.substring(b+8)}else if(-1!=(b=a.indexOf("MSIE")))jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer",jQuery.browser.fullVersion=a.substring(b+5);else if(-1!=(b=a.indexOf("Chrome")))jQuery.browser.webkit=!0,jQuery.browser.name="Chrome",jQuery.browser.fullVersion=a.substring(b+7);else if(-1!=(b=a.indexOf("Safari"))){if(jQuery.browser.webkit=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=a.substring(b+7),-1!=(b=a.indexOf("Version")))jQuery.browser.fullVersion=a.substring(b+
8)}else if(-1!=(b=a.indexOf("Firefox")))jQuery.browser.mozilla=!0,jQuery.browser.name="Firefox",jQuery.browser.fullVersion=a.substring(b+8);else if((c=a.lastIndexOf(" ")+1)<(b=a.lastIndexOf("/")))jQuery.browser.name=a.substring(c,b),jQuery.browser.fullVersion=a.substring(b+1),jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()&&(jQuery.browser.name=navigator.appName);if(-1!=(a=jQuery.browser.fullVersion.indexOf(";")))jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,
a);if(-1!=(a=jQuery.browser.fullVersion.indexOf(" ")))jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,a);jQuery.browser.majorVersion=parseInt(""+jQuery.browser.fullVersion,10);isNaN(jQuery.browser.majorVersion)&&(jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10));jQuery.browser.version=jQuery.browser.majorVersion}})(jQuery);

/*! responsive-nav.js 1.0.23
 * https://github.com/viljamis/responsive-nav.js
 * http://responsive-nav.com
 *
 * Copyright (c) 2013 @viljamis
 * Available under the MIT license
 */

(function () {

  "use strict";

  /* exported responsiveNav */
  var responsiveNav = function (el, options) {
  
    var computed = !!window.getComputedStyle;
    
    // getComputedStyle polyfill
    if (!computed) {
      window.getComputedStyle = function(el) {
        this.el = el;
        this.getPropertyValue = function(prop) {
          var re = /(\-([a-z]){1})/g;
          if (prop === "float") {
            prop = "styleFloat";
          }
          if (re.test(prop)) {
            prop = prop.replace(re, function () {
              return arguments[2].toUpperCase();
            });
          }
          return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        };
        return this;
      };
    }
    /* exported addEvent, removeEvent, getChildren, setAttributes, addClass, removeClass */
    // fn arg can be an object or a function, thanks to handleEvent
    // read more at: http://www.thecssninja.com/javascript/handleevent
    var addEvent = function (el, evt, fn, bubble) {
        if ("addEventListener" in el) {
          // BBOS6 doesn't support handleEvent, catch and polyfill
          try {
            el.addEventListener(evt, fn, bubble);
          } catch (e) {
            if (typeof fn === "object" && fn.handleEvent) {
              el.addEventListener(evt, function (e) {
                // Bind fn as this and set first arg as event object
                fn.handleEvent.call(fn, e);
              }, bubble);
            } else {
              throw e;
            }
          }
        } else if ("attachEvent" in el) {
          // check if the callback is an object and contains handleEvent
          if (typeof fn === "object" && fn.handleEvent) {
            el.attachEvent("on" + evt, function () {
              // Bind fn as this
              fn.handleEvent.call(fn);
            });
          } else {
            el.attachEvent("on" + evt, fn);
          }
        }
      },
    
      removeEvent = function (el, evt, fn, bubble) {
        if ("removeEventListener" in el) {
          try {
            el.removeEventListener(evt, fn, bubble);
          } catch (e) {
            if (typeof fn === "object" && fn.handleEvent) {
              el.removeEventListener(evt, function (e) {
                fn.handleEvent.call(fn, e);
              }, bubble);
            } else {
              throw e;
            }
          }
        } else if ("detachEvent" in el) {
          if (typeof fn === "object" && fn.handleEvent) {
            el.detachEvent("on" + evt, function () {
              fn.handleEvent.call(fn);
            });
          } else {
            el.detachEvent("on" + evt, fn);
          }
        }
      },
    
      getChildren = function (e) {
        if (e.children.length < 1) {
          throw new Error("The Nav container has no containing elements");
        }
        // Store all children in array
        var children = [];
        // Loop through children and store in array if child != TextNode
        for (var i = 0; i < e.children.length; i++) {
          if (e.children[i].nodeType === 1) {
            children.push(e.children[i]);
          }
        }
        return children;
      },
    
      setAttributes = function (el, attrs) {
        for (var key in attrs) {
          el.setAttribute(key, attrs[key]);
        }
      },
    
      addClass = function (el, cls) {
        if (el.className.indexOf(cls) !== 0) {
          el.className += " " + cls;
          el.className = el.className.replace(/(^\s*)|(\s*$)/g,"");
        }
      },
    
      removeClass = function (el, cls) {
        var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
        el.className = el.className.replace(reg, " ").replace(/(^\s*)|(\s*$)/g,"");
      };
  
    var nav,
      opts,
      navToggle,
      styleElement = document.createElement("style"),
      hasAnimFinished,
      navOpen;
  
    var ResponsiveNav = function (el, options) {
        var i;
  
        // Default options
        this.options = {
          animate: true,        // Boolean: Use CSS3 transitions, true or false
          transition: 250,      // Integer: Speed of the transition, in milliseconds
          label: "Menu",        // String: Label for the navigation toggle
          insert: "after",      // String: Insert the toggle before or after the navigation
          customToggle: "",     // Selector: Specify the ID of a custom toggle
          openPos: "relative",  // String: Position of the opened nav, relative or static
          jsClass: "js",        // String: 'JS enabled' class which is added to <html> el
          init: function(){},   // Function: Init callback
          open: function(){},   // Function: Open callback
          close: function(){}   // Function: Close callback
        };
  
        // User defined options
        for (i in options) {
          this.options[i] = options[i];
        }
  
        // Adds "js" class for <html>
        addClass(document.documentElement, this.options.jsClass);
  
        // Wrapper
        this.wrapperEl = el.replace("#", "");
        if (document.getElementById(this.wrapperEl)) {
          this.wrapper = document.getElementById(this.wrapperEl);
        } else if (document.querySelector(this.wrapperEl)) {
          this.wrapper = document.querySelector(this.wrapperEl);
        } else {
          // If el doesn't exists, stop here.
          throw new Error("The nav element you are trying to select doesn't exist");
        }
  
        // Inner wrapper
        this.wrapper.inner = getChildren(this.wrapper);
  
        // For minification
        opts = this.options;
        nav = this.wrapper;
  
        // Init
        this._init(this);
      };
  
    ResponsiveNav.prototype = {
  
      // Public methods
      destroy: function () {
        this._removeStyles();
        removeClass(nav, "closed");
        removeClass(nav, "opened");
        removeClass(nav, "nav-collapse");
        nav.removeAttribute("style");
        nav.removeAttribute("aria-hidden");
        nav = null;
  
        removeEvent(window, "resize", this, false);
        removeEvent(document.body, "touchmove", this, false);
        removeEvent(navToggle, "touchstart", this, false);
        removeEvent(navToggle, "touchend", this, false);
        removeEvent(navToggle, "mouseup", this, false);
        removeEvent(navToggle, "keyup", this, false);
        removeEvent(navToggle, "click", this, false);
  
        if (!opts.customToggle) {
          navToggle.parentNode.removeChild(navToggle);
        } else {
          navToggle.removeAttribute("aria-hidden");
        }
      },
  
      toggle: function () {
        if (hasAnimFinished === true) {
          if (!navOpen) {
            removeClass(nav, "closed");
            addClass(nav, "opened");
            nav.style.position = opts.openPos;
            setAttributes(nav, {"aria-hidden": "false"});
  
            navOpen = true;
            opts.open();
          } else {
            removeClass(nav, "opened");
            addClass(nav, "closed");
            setAttributes(nav, {"aria-hidden": "true"});
  
            if (opts.animate) {
              hasAnimFinished = false;
              setTimeout(function () {
                nav.style.position = "absolute";
                hasAnimFinished = true;
              }, opts.transition + 10);
            } else {
              nav.style.position = "absolute";
            }
  
            navOpen = false;
            opts.close();
          }
        }
      },
  
      resize: function () {
        if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {
          setAttributes(navToggle, {"aria-hidden": "false"});
  
          // If the navigation is hidden
          if (nav.className.match(/(^|\s)closed(\s|$)/)) {
            setAttributes(nav, {"aria-hidden": "true"});
            nav.style.position = "absolute";
          }
  
          this._createStyles();
          this._calcHeight();
        } else {
          setAttributes(navToggle, {"aria-hidden": "true"});
          setAttributes(nav, {"aria-hidden": "false"});
          nav.style.position = opts.openPos;
          this._removeStyles();
        }
      },
  
      handleEvent: function (e) {
        var evt = e || window.event;
  
        switch (evt.type) {
        case "touchstart":
          this._onTouchStart(evt);
          break;
        case "touchmove":
          this._onTouchMove(evt);
          break;
        case "touchend":
        case "mouseup":
          this._onTouchEnd(evt);
          break;
        case "click":
          this._preventDefault(evt);
          break;
        case "keyup":
          this._onKeyUp(evt);
          break;
        case "resize":
          this.resize(evt);
          break;
        }
      },
  
      // Private methods
      _init: function () {
        addClass(nav, "nav-collapse");
        addClass(nav, "closed");
        hasAnimFinished = true;
        navOpen = false;
  
        this._createToggle();
        this._transitions();
        this.resize();
  
        // IE8 hack
        var self = this;
        setTimeout(function () {
          self.resize();
        }, 20);
  
        addEvent(window, "resize", this, false);
        addEvent(document.body, "touchmove", this, false);
        addEvent(navToggle, "touchstart", this, false);
        addEvent(navToggle, "touchend", this, false);
        addEvent(navToggle, "mouseup", this, false);
        addEvent(navToggle, "keyup", this, false);
        addEvent(navToggle, "click", this, false);
  
        // Init callback
        opts.init();
      },
  
      _createStyles: function () {
        if (!styleElement.parentNode) {
          styleElement.type = "text/css";
          document.getElementsByTagName("head")[0].appendChild(styleElement);
        }
      },
  
      _removeStyles: function () {
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      },
  
      _createToggle: function () {
        if (!opts.customToggle) {
          var toggle = document.createElement("a");
          toggle.innerHTML = opts.label;
          setAttributes(toggle, {
            "href": "#",
            "class": "nav-toggle"
          });
  
          if (opts.insert === "after") {
            nav.parentNode.insertBefore(toggle, nav.nextSibling);
          } else {
            nav.parentNode.insertBefore(toggle, nav);
          }
  
          navToggle = toggle;
        } else {
          var toggleEl = opts.customToggle.replace("#", "");
  
          if (document.getElementById(toggleEl)) {
            navToggle = document.getElementById(toggleEl);
          } else if (document.querySelector(toggleEl)) {
            navToggle = document.querySelector(toggleEl);
          } else {
            throw new Error("The custom nav toggle you are trying to select doesn't exist");
          }
        }
      },
  
      _preventDefault: function(e) {
        if (e.preventDefault) {
          e.preventDefault();
          e.stopPropagation();
        } else {
          e.returnValue = false;
        }
      },
  
      _onTouchStart: function (e) {
        e.stopPropagation();
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.touchHasMoved = false;
        removeEvent(navToggle, "mouseup", this, false);
      },
  
      _onTouchMove: function (e) {
        if (Math.abs(e.touches[0].clientX - this.startX) > 10 ||
        Math.abs(e.touches[0].clientY - this.startY) > 10) {
          this.touchHasMoved = true;
        }
      },
  
      _onTouchEnd: function (e) {
        this._preventDefault(e);
        if (!this.touchHasMoved) {
          if (e.type === "touchend") {
            this.toggle(e);
            // Prevent click on the underlying menu on Android 2.3
            var that = this;
            nav.addEventListener("click", that._preventDefault, true);
            setTimeout(function () {
              nav.removeEventListener("click", that._preventDefault, true);
            }, opts.transition + 100);
            return;
          } else {
            var evt = e || window.event;
            // If it isn't a right click
            if (!(evt.which === 3 || evt.button === 2)) {
              this.toggle(e);
            }
          }
        }
      },
  
      _onKeyUp: function (e) {
        var evt = e || window.event;
        if (evt.keyCode === 13) {
          this.toggle(e);
        }
      },
  
      _transitions: function () {
        if (opts.animate) {
          var objStyle = nav.style,
            transition = "max-height " + opts.transition + "ms";
  
          objStyle.WebkitTransition = transition;
          objStyle.MozTransition = transition;
          objStyle.OTransition = transition;
          objStyle.transition = transition;
        }
      },
  
      _calcHeight: function () {
        var savedHeight = 0;
        for (var i = 0; i < nav.inner.length; i++) {
          savedHeight += nav.inner[i].offsetHeight;
        }
        var innerStyles = ".nav-collapse.opened{max-height:" + savedHeight + "px}";
  
        if (styleElement.styleSheet) {
          styleElement.styleSheet.cssText = innerStyles;
        } else {
          styleElement.innerHTML = innerStyles;
        }
  
        innerStyles = "";
      }
  
    };
  
    return new ResponsiveNav(el, options);
  
  };

  window.responsiveNav = responsiveNav;

}());


/**
 * Return a timestamp with the format "m/d/yy h:MM:ss TT"
 * @type {Date}
 */
 
function timeStamp() {
// Create a date object with the current time
  var now = new Date();
 
// Create an array with the current month, day and time
  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
 
// Create an array with the current hour, minute and second
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
 
// Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";
 
// Convert hour from military time
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
 
// If hour is 0, set it to 12
  time[0] = time[0] || 12;
 
// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }
 
// Return the formatted string
  return date.join("/") + " " + time.join(":") + " " + suffix;
}