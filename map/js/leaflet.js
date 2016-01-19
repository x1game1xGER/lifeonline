(function(f, g, k) {
    var b, m;
    typeof exports !== k + "" ? b = exports : (m = f.L, b = {
        noConflict: function() {
            f.L = m;
            return this
        }
    }, f.L = b);
    b.version = "0.5.1";
    b.Util = {
        extend: function(a) {
            var c = Array.prototype.slice.call(arguments, 1),
                b, e, h, f;
            e = 0;
            for (h = c.length; e < h; e++)
                for (b in f = c[e] || {}, f) f.hasOwnProperty(b) && (a[b] = f[b]);
            return a
        },
        bind: function(a, c) {
            var b = 2 < arguments.length ? Array.prototype.slice.call(arguments, 2) : null;
            return function() {
                return a.apply(c, b || arguments)
            }
        },
        stamp: function() {
            var a = 0;
            return function(c) {
                c._leaflet_id =
                    c._leaflet_id || ++a;
                return c._leaflet_id
            }
        }(),
        limitExecByInterval: function(a, c, b) {
            var e, h;
            return function n() {
                var f = arguments;
                e ? h = !0 : (e = !0, setTimeout(function() {
                    e = !1;
                    h && (n.apply(b, f), h = !1)
                }, c), a.apply(b, f))
            }
        },
        falseFn: function() {
            return !1
        },
        formatNum: function(a, c) {
            var b = Math.pow(10, c || 5);
            return Math.round(a * b) / b
        },
        splitWords: function(a) {
            return a.replace(/^\s+|\s+$/g, "").split(/\s+/)
        },
        setOptions: function(a, c) {
            a.options = b.extend({}, a.options, c);
            return a.options
        },
        getParamString: function(a, c) {
            var b = [],
                e;
            for (e in a) a.hasOwnProperty(e) &&
                b.push(e + "=" + a[e]);
            return (c && -1 !== c.indexOf("?") ? "&" : "?") + b.join("&")
        },
        template: function(a, c) {
            return a.replace(/\{ *([\w_]+) *\}/g, function(a, b) {
                var h = c[b];
                if (!c.hasOwnProperty(b)) throw Error("No value provided for variable " + a);
                return h
            })
        },
        isArray: function(a) {
            return "[object Array]" === Object.prototype.toString.call(a)
        },
        emptyImageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
    };
    (function() {
        function a(a) {
            var c, b, d = ["webkit", "moz", "o", "ms"];
            for (c = 0; c < d.length && !b; c++) b = f[d[c] + a];
            return b
        }

        function c(a) {
            var c = +new Date,
                b = Math.max(0, 16 - (c - d));
            d = c + b;
            return f.setTimeout(a, b)
        }
        var d = 0,
            e = f.requestAnimationFrame || a("RequestAnimationFrame") || c,
            h = f.cancelAnimationFrame || a("CancelAnimationFrame") || a("CancelRequestAnimationFrame") || function(a) {
                f.clearTimeout(a)
            };
        b.Util.requestAnimFrame = function(a, d, h, g) {
            a = b.bind(a, d);
            if (h && e === c) a();
            else return e.call(f, a, g)
        };
        b.Util.cancelAnimFrame = function(a) {
            a && h.call(f, a)
        }
    })();
    b.extend = b.Util.extend;
    b.bind = b.Util.bind;
    b.stamp = b.Util.stamp;
    b.setOptions = b.Util.setOptions;
    b.Class = function() {};
    b.Class.extend = function(a) {
        var c = function() {
                this.initialize && this.initialize.apply(this, arguments);
                this._initHooks && this.callInitHooks()
            },
            d = function() {};
        d.prototype = this.prototype;
        var e = new d;
        e.constructor = c;
        c.prototype = e;
        for (var h in this) this.hasOwnProperty(h) && "prototype" !== h && (c[h] = this[h]);
        a.statics && (b.extend(c, a.statics), delete a.statics);
        a.includes && (b.Util.extend.apply(null, [e].concat(a.includes)), delete a.includes);
        a.options && e.options && (a.options = b.extend({}, e.options,
            a.options));
        b.extend(e, a);
        e._initHooks = [];
        var f = this;
        e.callInitHooks = function() {
            if (!this._initHooksCalled) {
                f.prototype.callInitHooks && f.prototype.callInitHooks.call(this);
                this._initHooksCalled = !0;
                for (var a = 0, c = e._initHooks.length; a < c; a++) e._initHooks[a].call(this)
            }
        };
        return c
    };
    b.Class.include = function(a) {
        b.extend(this.prototype, a)
    };
    b.Class.mergeOptions = function(a) {
        b.extend(this.prototype.options, a)
    };
    b.Class.addInitHook = function(a) {
        var c = Array.prototype.slice.call(arguments, 1);
        this.prototype._initHooks =
            this.prototype._initHooks || [];
        this.prototype._initHooks.push("function" === typeof a ? a : function() {
            this[a].apply(this, c)
        })
    };
    b.Mixin = {};
    b.Mixin.Events = {
        addEventListener: function(a, c, d) {
            var e = this._leaflet_events = this._leaflet_events || {},
                h, f;
            if ("object" === typeof a) {
                for (h in a) a.hasOwnProperty(h) && this.addEventListener(h, a[h], c);
                return this
            }
            a = b.Util.splitWords(a);
            h = 0;
            for (f = a.length; h < f; h++) e[a[h]] = e[a[h]] || [], e[a[h]].push({
                action: c,
                context: d || this
            });
            return this
        },
        hasEventListeners: function(a) {
            return "_leaflet_events" in
                this && a in this._leaflet_events && 0 < this._leaflet_events[a].length
        },
        removeEventListener: function(a, c, d) {
            var e = this._leaflet_events,
                h, f, g, l;
            if ("object" === typeof a) {
                for (h in a) a.hasOwnProperty(h) && this.removeEventListener(h, a[h], c);
                return this
            }
            a = b.Util.splitWords(a);
            h = 0;
            for (f = a.length; h < f; h++)
                if (this.hasEventListeners(a[h]))
                    for (g = e[a[h]], l = g.length - 1; 0 <= l; l--) c && g[l].action !== c || d && g[l].context !== d || g.splice(l, 1);
            return this
        },
        fireEvent: function(a, c) {
            if (!this.hasEventListeners(a)) return this;
            for (var d =
                    b.extend({
                        type: a,
                        target: this
                    }, c), e = this._leaflet_events[a].slice(), h = 0, f = e.length; h < f; h++) e[h].action.call(e[h].context || this, d);
            return this
        }
    };
    b.Mixin.Events.on = b.Mixin.Events.addEventListener;
    b.Mixin.Events.off = b.Mixin.Events.removeEventListener;
    b.Mixin.Events.fire = b.Mixin.Events.fireEvent;
    (function() {
        var a = !!f.ActiveXObject,
            c = a && !f.XMLHttpRequest,
            d = a && !g.querySelector,
            e = navigator.userAgent.toLowerCase(),
            h = -1 !== e.indexOf("webkit"),
            q = -1 !== e.indexOf("chrome"),
            n = -1 !== e.indexOf("android"),
            e = -1 !== e.search("android [23]"),
            l = typeof orientation !== k + "",
            m = f.navigator && f.navigator.msPointerEnabled && f.navigator.msMaxTouchPoints,
            t = "devicePixelRatio" in f && 1 < f.devicePixelRatio || "matchMedia" in f && f.matchMedia("(min-resolution:144dpi)") && f.matchMedia("(min-resolution:144dpi)").matches,
            p = g.documentElement,
            r = a && "transition" in p.style,
            u = "WebKitCSSMatrix" in f && "m11" in new f.WebKitCSSMatrix,
            v = "MozPerspective" in p.style,
            w = "OTransition" in p.style,
            x = !f.L_DISABLE_3D && (r || u || v || w),
            y = !f.L_NO_TOUCH && function() {
                if (m || "ontouchstart" in p) return !0;
                var a = g.createElement("div"),
                    c = !1;
                if (!a.setAttribute) return !1;
                a.setAttribute("ontouchstart", "return;");
                "function" === typeof a.ontouchstart && (c = !0);
                a.removeAttribute("ontouchstart");
                return c
            }();
        b.Browser = {
            ie: a,
            ie6: c,
            ie7: d,
            webkit: h,
            android: n,
            android23: e,
            chrome: q,
            ie3d: r,
            webkit3d: u,
            gecko3d: v,
            opera3d: w,
            any3d: x,
            mobile: l,
            mobileWebkit: l && h,
            mobileWebkit3d: l && u,
            mobileOpera: l && f.opera,
            touch: y,
            msTouch: m,
            retina: t
        }
    })();
    b.Point = function(a, c, b) {
        this.x = b ? Math.round(a) : a;
        this.y = b ? Math.round(c) : c
    };
    b.Point.prototype = {
        clone: function() {
            return new b.Point(this.x, this.y)
        },
        add: function(a) {
            return this.clone()._add(b.point(a))
        },
        _add: function(a) {
            this.x += a.x;
            this.y += a.y;
            return this
        },
        subtract: function(a) {
            return this.clone()._subtract(b.point(a))
        },
        _subtract: function(a) {
            this.x -= a.x;
            this.y -= a.y;
            return this
        },
        divideBy: function(a) {
            return this.clone()._divideBy(a)
        },
        _divideBy: function(a) {
            this.x /= a;
            this.y /= a;
            return this
        },
        multiplyBy: function(a) {
            return this.clone()._multiplyBy(a)
        },
        _multiplyBy: function(a) {
            this.x *= a;
            this.y *= a;
            return this
        },
        round: function() {
            return this.clone()._round()
        },
        _round: function() {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this
        },
        floor: function() {
            return this.clone()._floor()
        },
        _floor: function() {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            return this
        },
        distanceTo: function(a) {
            a = b.point(a);
            var c = a.x - this.x;
            a = a.y - this.y;
            return Math.sqrt(c * c + a * a)
        },
        equals: function(a) {
            return a.x === this.x && a.y === this.y
        },
        toString: function() {
            return "Point(" + b.Util.formatNum(this.x) + ", " + b.Util.formatNum(this.y) + ")"
        }
    };
    b.point = function(a, c, d) {
        return a instanceof b.Point ? a : b.Util.isArray(a) ? new b.Point(a[0], a[1]) : isNaN(a) ? a : new b.Point(a, c, d)
    };
    b.Bounds = function(a, c) {
        if (a)
            for (var b = c ? [a, c] : a, e = 0, h = b.length; e < h; e++) this.extend(b[e])
    };
    b.Bounds.prototype = {
        extend: function(a) {
            a = b.point(a);
            this.min || this.max ? (this.min.x = Math.min(a.x, this.min.x), this.max.x = Math.max(a.x, this.max.x), this.min.y = Math.min(a.y, this.min.y), this.max.y = Math.max(a.y, this.max.y)) : (this.min = a.clone(), this.max = a.clone());
            return this
        },
        getCenter: function(a) {
            return new b.Point((this.min.x +
                this.max.x) / 2, (this.min.y + this.max.y) / 2, a)
        },
        getBottomLeft: function() {
            return new b.Point(this.min.x, this.max.y)
        },
        getTopRight: function() {
            return new b.Point(this.max.x, this.min.y)
        },
        getSize: function() {
            return this.max.subtract(this.min)
        },
        contains: function(a) {
            var c;
            a = "number" === typeof a[0] || a instanceof b.Point ? b.point(a) : b.bounds(a);
            a instanceof b.Bounds ? (c = a.min, a = a.max) : c = a;
            return c.x >= this.min.x && a.x <= this.max.x && c.y >= this.min.y && a.y <= this.max.y
        },
        intersects: function(a) {
            a = b.bounds(a);
            var c = this.min,
                d = this.max,
                e = a.min;
            a = a.max;
            var h = a.y >= c.y && e.y <= d.y;
            return a.x >= c.x && e.x <= d.x && h
        },
        isValid: function() {
            return !(!this.min || !this.max)
        }
    };
    b.bounds = function(a, c) {
        return !a || a instanceof b.Bounds ? a : new b.Bounds(a, c)
    };
    b.Transformation = function(a, c, b, e) {
        this._a = a;
        this._b = c;
        this._c = b;
        this._d = e
    };
    b.Transformation.prototype = {
        transform: function(a, c) {
            return this._transform(a.clone(), c)
        },
        _transform: function(a, c) {
            c = c || 1;
            a.x = c * (this._a * a.x + this._b);
            a.y = c * (this._c * a.y + this._d);
            return a
        },
        untransform: function(a, c) {
            c = c ||
                1;
            return new b.Point((a.x / c - this._b) / this._a, (a.y / c - this._d) / this._c)
        }
    };
    b.DomUtil = {
        get: function(a) {
            return "string" === typeof a ? g.getElementById(a) : a
        },
        getStyle: function(a, c) {
            var b = a.style[c];
            !b && a.currentStyle && (b = a.currentStyle[c]);
            b && "auto" !== b || !g.defaultView || (b = (b = g.defaultView.getComputedStyle(a, null)) ? b[c] : null);
            return "auto" === b ? null : b
        },
        getViewportOffset: function(a) {
            var c = 0,
                d = 0,
                e = a,
                h = g.body,
                f, n = b.Browser.ie7;
            do {
                c += e.offsetTop || 0;
                d += e.offsetLeft || 0;
                c += parseInt(b.DomUtil.getStyle(e, "borderTopWidth"),
                    10) || 0;
                d += parseInt(b.DomUtil.getStyle(e, "borderLeftWidth"), 10) || 0;
                f = b.DomUtil.getStyle(e, "position");
                if (e.offsetParent === h && "absolute" === f) break;
                if ("fixed" === f) {
                    c += h.scrollTop || 0;
                    d += h.scrollLeft || 0;
                    break
                }
                e = e.offsetParent
            } while (e);
            e = a;
            do {
                if (e === h) break;
                c -= e.scrollTop || 0;
                d -= e.scrollLeft || 0;
                b.DomUtil.documentIsLtr() || !b.Browser.webkit && !n || (d += e.scrollWidth - e.clientWidth, n && "hidden" !== b.DomUtil.getStyle(e, "overflow-y") && "hidden" !== b.DomUtil.getStyle(e, "overflow") && (d += 17));
                e = e.parentNode
            } while (e);
            return new b.Point(d,
                c)
        },
        documentIsLtr: function() {
            b.DomUtil._docIsLtrCached || (b.DomUtil._docIsLtrCached = !0, b.DomUtil._docIsLtr = "ltr" === b.DomUtil.getStyle(g.body, "direction"));
            return b.DomUtil._docIsLtr
        },
        create: function(a, c, b) {
            a = g.createElement(a);
            a.className = c;
            b && b.appendChild(a);
            return a
        },
        disableTextSelection: function() {
            g.selection && g.selection.empty && g.selection.empty();
            this._onselectstart || (this._onselectstart = g.onselectstart || null, g.onselectstart = b.Util.falseFn)
        },
        enableTextSelection: function() {
            g.onselectstart === b.Util.falseFn &&
                (g.onselectstart = this._onselectstart, this._onselectstart = null)
        },
        hasClass: function(a, c) {
            return 0 < a.className.length && (new RegExp("(^|\\s)" + c + "(\\s|$)")).test(a.className)
        },
        addClass: function(a, c) {
            b.DomUtil.hasClass(a, c) || (a.className += (a.className ? " " : "") + c)
        },
        removeClass: function(a, c) {
            a.className = a.className.replace(/(\S+)\s*/g, function(a, b) {
                return b === c ? "" : a
            }).replace(/(^\s+|\s+$)/, "")
        },
        setOpacity: function(a, c) {
            if ("opacity" in a.style) a.style.opacity = c;
            else if ("filter" in a.style) {
                var b = !1;
                try {
                    b = a.filters.item("DXImageTransform.Microsoft.Alpha")
                } catch (e) {}
                c =
                    Math.round(100 * c);
                b ? (b.Enabled = 100 !== c, b.Opacity = c) : a.style.filter += " progid:DXImageTransform.Microsoft.Alpha(opacity=" + c + ")"
            }
        },
        testProp: function(a) {
            for (var c = g.documentElement.style, b = 0; b < a.length; b++)
                if (a[b] in c) return a[b];
            return !1
        },
        getTranslateString: function(a) {
            var c = b.Browser.webkit3d;
            return "translate" + (c ? "3d" : "") + "(" + a.x + "px," + a.y + "px" + ((c ? ",0" : "") + ")")
        },
        getScaleString: function(a, c) {
            return b.DomUtil.getTranslateString(c.add(c.multiplyBy(-1 * a))) + (" scale(" + a + ") ")
        },
        setPosition: function(a, c,
            d) {
            a._leaflet_pos = c;
            !d && b.Browser.any3d ? (a.style[b.DomUtil.TRANSFORM] = b.DomUtil.getTranslateString(c), b.Browser.mobileWebkit3d && (a.style.WebkitBackfaceVisibility = "hidden")) : (a.style.left = c.x + "px", a.style.top = c.y + "px")
        },
        getPosition: function(a) {
            return a._leaflet_pos
        }
    };
    b.DomUtil.TRANSFORM = b.DomUtil.testProp(["transform", "WebkitTransform", "OTransform", "MozTransform", "msTransform"]);
    b.DomUtil.TRANSITION = b.DomUtil.testProp(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]);
    b.DomUtil.TRANSITION_END = "webkitTransition" === b.DomUtil.TRANSITION || "OTransition" === b.DomUtil.TRANSITION ? b.DomUtil.TRANSITION + "End" : "transitionend";
    b.LatLng = function(a, c) {
        var b = parseFloat(a),
            e = parseFloat(c);
        if (isNaN(b) || isNaN(e)) throw Error("Invalid LatLng object: (" + a + ", " + c + ")");
        this.lat = b;
        this.lng = e
    };
    b.extend(b.LatLng, {
        DEG_TO_RAD: Math.PI / 180,
        RAD_TO_DEG: 180 / Math.PI,
        MAX_MARGIN: 1E-9
    });
    b.LatLng.prototype = {
        equals: function(a) {
            if (!a) return !1;
            a = b.latLng(a);
            return Math.max(Math.abs(this.lat - a.lat), Math.abs(this.lng -
                a.lng)) <= b.LatLng.MAX_MARGIN
        },
        toString: function(a) {
            return "LatLng(" + b.Util.formatNum(this.lat, a) + ", " + b.Util.formatNum(this.lng, a) + ")"
        },
        distanceTo: function(a) {
            a = b.latLng(a);
            var c = b.LatLng.DEG_TO_RAD,
                d = (a.lng - this.lng) * c,
                e = this.lat * c,
                h = a.lat * c;
            a = Math.sin((a.lat - this.lat) * c / 2);
            d = Math.sin(d / 2);
            e = a * a + d * d * Math.cos(e) * Math.cos(h);
            return 12756274 * Math.atan2(Math.sqrt(e), Math.sqrt(1 - e))
        },
        wrap: function(a, c) {
            var d = this.lng;
            a = a || -180;
            c = c || 180;
            return new b.LatLng(this.lat, (d + c) % (c - a) + (d < a || d === c ? c : a))
        }
    };
    b.latLng =
        function(a, c) {
            return a instanceof b.LatLng ? a : b.Util.isArray(a) ? new b.LatLng(a[0], a[1]) : isNaN(a) ? a : new b.LatLng(a, c)
        };
    b.LatLngBounds = function(a, c) {
        if (a)
            for (var b = c ? [a, c] : a, e = 0, h = b.length; e < h; e++) this.extend(b[e])
    };
    b.LatLngBounds.prototype = {
        extend: function(a) {
            a = "number" === typeof a[0] || "string" === typeof a[0] || a instanceof b.LatLng ? b.latLng(a) : b.latLngBounds(a);
            a instanceof b.LatLng ? this._southWest || this._northEast ? (this._southWest.lat = Math.min(a.lat, this._southWest.lat), this._southWest.lng = Math.min(a.lng,
                this._southWest.lng), this._northEast.lat = Math.max(a.lat, this._northEast.lat), this._northEast.lng = Math.max(a.lng, this._northEast.lng)) : (this._southWest = new b.LatLng(a.lat, a.lng), this._northEast = new b.LatLng(a.lat, a.lng)) : a instanceof b.LatLngBounds && (this.extend(a._southWest), this.extend(a._northEast));
            return this
        },
        pad: function(a) {
            var c = this._southWest,
                d = this._northEast,
                e = Math.abs(c.lat - d.lat) * a;
            a *= Math.abs(c.lng - d.lng);
            return new b.LatLngBounds(new b.LatLng(c.lat - e, c.lng - a), new b.LatLng(d.lat + e, d.lng +
                a))
        },
        getCenter: function() {
            return new b.LatLng((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2)
        },
        getSouthWest: function() {
            return this._southWest
        },
        getNorthEast: function() {
            return this._northEast
        },
        getNorthWest: function() {
            return new b.LatLng(this._northEast.lat, this._southWest.lng)
        },
        getSouthEast: function() {
            return new b.LatLng(this._southWest.lat, this._northEast.lng)
        },
        contains: function(a) {
            a = "number" === typeof a[0] || a instanceof b.LatLng ? b.latLng(a) : b.latLngBounds(a);
            var c = this._southWest,
                d = this._northEast,
                e;
            a instanceof b.LatLngBounds ? (e = a.getSouthWest(), a = a.getNorthEast()) : e = a;
            return e.lat >= c.lat && a.lat <= d.lat && e.lng >= c.lng && a.lng <= d.lng
        },
        intersects: function(a) {
            a = b.latLngBounds(a);
            var c = this._southWest,
                d = this._northEast,
                e = a.getSouthWest();
            a = a.getNorthEast();
            var h = a.lng >= c.lng && e.lng <= d.lng;
            return a.lat >= c.lat && e.lat <= d.lat && h
        },
        toBBoxString: function() {
            var a = this._southWest,
                c = this._northEast;
            return [a.lng, a.lat, c.lng, c.lat].join()
        },
        equals: function(a) {
            if (!a) return !1;
            a = b.latLngBounds(a);
            return this._southWest.equals(a.getSouthWest()) && this._northEast.equals(a.getNorthEast())
        },
        isValid: function() {
            return !(!this._southWest || !this._northEast)
        }
    };
    b.latLngBounds = function(a, c) {
        return !a || a instanceof b.LatLngBounds ? a : new b.LatLngBounds(a, c)
    };
    b.Projection = {};
    b.Projection.SphericalMercator = {
        MAX_LATITUDE: 85.0511287798,
        project: function(a) {
            var c = b.LatLng.DEG_TO_RAD,
                d = this.MAX_LATITUDE,
                d = Math.max(Math.min(d, a.lat), -d);
            a = a.lng * c;
            c = Math.log(Math.tan(Math.PI / 4 + d * c / 2));
            return new b.Point(a,
                c)
        },
        unproject: function(a) {
            var c = b.LatLng.RAD_TO_DEG,
                d = a.x * c;
            a = (2 * Math.atan(Math.exp(a.y)) - Math.PI / 2) * c;
            return new b.LatLng(a, d)
        }
    };
    b.Projection.LonLat = {
        project: function(a) {
            return new b.Point(a.lng, a.lat)
        },
        unproject: function(a) {
            return new b.LatLng(a.y, a.x)
        }
    };
    b.CRS = {
        latLngToPoint: function(a, c) {
            var b = this.projection.project(a),
                e = this.scale(c);
            return this.transformation._transform(b, e)
        },
        pointToLatLng: function(a, c) {
            var b = this.scale(c),
                b = this.transformation.untransform(a, b);
            return this.projection.unproject(b)
        },
        project: function(a) {
            return this.projection.project(a)
        },
        scale: function(a) {
            return 256 * Math.pow(2, a)
        }
    };
    b.CRS.Simple = b.extend({}, b.CRS, {
        projection: b.Projection.LonLat,
        transformation: new b.Transformation(1, 0, -1, 0),
        scale: function(a) {
            return Math.pow(2, a)
        }
    });
    b.CRS.EPSG3857 = b.extend({}, b.CRS, {
        code: "EPSG:3857",
        projection: b.Projection.SphericalMercator,
        transformation: new b.Transformation(.5 / Math.PI, .5, -.5 / Math.PI, .5),
        project: function(a) {
            return this.projection.project(a).multiplyBy(6378137)
        }
    });
    b.CRS.EPSG900913 =
        b.extend({}, b.CRS.EPSG3857, {
            code: "EPSG:900913"
        });
    b.CRS.EPSG4326 = b.extend({}, b.CRS, {
        code: "EPSG:4326",
        projection: b.Projection.LonLat,
        transformation: new b.Transformation(1 / 360, .5, -1 / 360, .5)
    });
    b.Map = b.Class.extend({
        includes: b.Mixin.Events,
        options: {
            crs: b.CRS.EPSG3857,
            fadeAnimation: b.DomUtil.TRANSITION && !b.Browser.android23,
            trackResize: !0,
            markerZoomAnimation: b.DomUtil.TRANSITION && b.Browser.any3d
        },
        initialize: function(a, c) {
            c = b.setOptions(this, c);
            this._initContainer(a);
            this._initLayout();
            this.callInitHooks();
            this._initEvents();
            c.maxBounds && this.setMaxBounds(c.maxBounds);
            c.center && c.zoom !== k && this.setView(b.latLng(c.center), c.zoom, !0);
            this._initLayers(c.layers)
        },
        setView: function(a, c) {
            this._resetView(b.latLng(a), this._limitZoom(c));
            return this
        },
        setZoom: function(a) {
            return this.setView(this.getCenter(), a)
        },
        zoomIn: function(a) {
            return this.setZoom(this._zoom + (a || 1))
        },
        zoomOut: function(a) {
            return this.setZoom(this._zoom - (a || 1))
        },
        fitBounds: function(a) {
            var c = this.getBoundsZoom(a);
            return this.setView(b.latLngBounds(a).getCenter(),
                c)
        },
        fitWorld: function() {
            var a = new b.LatLng(-60, -170),
                c = new b.LatLng(85, 179);
            return this.fitBounds(new b.LatLngBounds(a, c))
        },
        panTo: function(a) {
            return this.setView(a, this._zoom)
        },
        panBy: function(a) {
            this.fire("movestart");
            this._rawPanBy(b.point(a));
            this.fire("move");
            return this.fire("moveend")
        },
        setMaxBounds: function(a) {
            a = b.latLngBounds(a);
            this.options.maxBounds = a;
            if (!a) return this._boundsMinZoom = null, this;
            var c = this.getBoundsZoom(a, !0);
            this._boundsMinZoom = c;
            this._loaded && (this._zoom < c ? this.setView(a.getCenter(),
                c) : this.panInsideBounds(a));
            return this
        },
        panInsideBounds: function(a) {
            a = b.latLngBounds(a);
            var c = this.getBounds(),
                d = this.project(c.getSouthWest()),
                c = this.project(c.getNorthEast()),
                e = this.project(a.getSouthWest());
            a = this.project(a.getNorthEast());
            var h = 0,
                f = 0;
            c.y < a.y && (f = a.y - c.y);
            c.x > a.x && (h = a.x - c.x);
            d.y > e.y && (f = e.y - d.y);
            d.x < e.x && (h = e.x - d.x);
            return this.panBy(new b.Point(h, f, !0))
        },
        addLayer: function(a) {
            var c = b.stamp(a);
            if (this._layers[c]) return this;
            this._layers[c] = a;
            !a.options || isNaN(a.options.maxZoom) &&
                isNaN(a.options.minZoom) || (this._zoomBoundLayers[c] = a, this._updateZoomLevels());
            this.options.zoomAnimation && b.TileLayer && a instanceof b.TileLayer && (this._tileLayersNum++, this._tileLayersToLoad++, a.on("load", this._onTileLayerLoad, this));
            this.whenReady(function() {
                a.onAdd(this);
                this.fire("layeradd", {
                    layer: a
                })
            }, this);
            return this
        },
        removeLayer: function(a) {
            var c = b.stamp(a);
            if (this._layers[c]) return a.onRemove(this), delete this._layers[c], this._zoomBoundLayers[c] && (delete this._zoomBoundLayers[c], this._updateZoomLevels()),
                this.options.zoomAnimation && b.TileLayer && a instanceof b.TileLayer && (this._tileLayersNum--, this._tileLayersToLoad--, a.off("load", this._onTileLayerLoad, this)), this.fire("layerremove", {
                    layer: a
                })
        },
        hasLayer: function(a) {
            a = b.stamp(a);
            return this._layers.hasOwnProperty(a)
        },
        invalidateSize: function(a) {
            var c = this.getSize();
            this._sizeChanged = !0;
            this.options.maxBounds && this.setMaxBounds(this.options.maxBounds);
            if (!this._loaded) return this;
            c = c._subtract(this.getSize())._divideBy(2)._round();
            !0 === a ? this.panBy(c) :
                (this._rawPanBy(c), this.fire("move"), clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(b.bind(this.fire, this, "moveend"), 200));
            return this
        },
        addHandler: function(a, c) {
            if (c) return this[a] = new c(this), this.options[a] && this[a].enable(), this
        },
        getCenter: function() {
            return this.layerPointToLatLng(this._getCenterLayerPoint())
        },
        getZoom: function() {
            return this._zoom
        },
        getBounds: function() {
            var a = this.getPixelBounds(),
                c = this.unproject(a.getBottomLeft()),
                a = this.unproject(a.getTopRight());
            return new b.LatLngBounds(c,
                a)
        },
        getMinZoom: function() {
            return Math.max(this.options.minZoom || 0, this._layersMinZoom || 0, this._boundsMinZoom || 0)
        },
        getMaxZoom: function() {
            return Math.min(this.options.maxZoom === k ? Infinity : this.options.maxZoom, this._layersMaxZoom === k ? Infinity : this._layersMaxZoom)
        },
        getBoundsZoom: function(a, c) {
            a = b.latLngBounds(a);
            var d = this.getSize(),
                e = this.options.minZoom || 0,
                h = this.getMaxZoom(),
                f = a.getNorthEast(),
                g = a.getSouthWest(),
                l, k;
            l = !0;
            c && e--;
            do e++, l = this.project(f, e), k = this.project(g, e), l = new b.Point(Math.abs(l.x -
                k.x), Math.abs(k.y - l.y)), l = c ? l.x < d.x || l.y < d.y : l.x <= d.x && l.y <= d.y; while (l && e <= h);
            return l && c ? null : c ? e : e - 1
        },
        getSize: function() {
            if (!this._size || this._sizeChanged) this._size = new b.Point(this._container.clientWidth, this._container.clientHeight), this._sizeChanged = !1;
            return this._size.clone()
        },
        getPixelBounds: function() {
            var a = this._getTopLeftPoint();
            return new b.Bounds(a, a.add(this.getSize()))
        },
        getPixelOrigin: function() {
            return this._initialTopLeftPoint
        },
        getPanes: function() {
            return this._panes
        },
        getContainer: function() {
            return this._container
        },
        getZoomScale: function(a) {
            var c = this.options.crs;
            return c.scale(a) / c.scale(this._zoom)
        },
        getScaleZoom: function(a) {
            return this._zoom + Math.log(a) / Math.LN2
        },
        project: function(a, c) {
            c = c === k ? this._zoom : c;
            return this.options.crs.latLngToPoint(b.latLng(a), c)
        },
        unproject: function(a, c) {
            c = c === k ? this._zoom : c;
            return this.options.crs.pointToLatLng(b.point(a), c)
        },
        layerPointToLatLng: function(a) {
            a = b.point(a).add(this._initialTopLeftPoint);
            return this.unproject(a)
        },
        latLngToLayerPoint: function(a) {
            return this.project(b.latLng(a))._round()._subtract(this._initialTopLeftPoint)
        },
        containerPointToLayerPoint: function(a) {
            return b.point(a).subtract(this._getMapPanePos())
        },
        layerPointToContainerPoint: function(a) {
            return b.point(a).add(this._getMapPanePos())
        },
        containerPointToLatLng: function(a) {
            a = this.containerPointToLayerPoint(b.point(a));
            return this.layerPointToLatLng(a)
        },
        latLngToContainerPoint: function(a) {
            return this.layerPointToContainerPoint(this.latLngToLayerPoint(b.latLng(a)))
        },
        mouseEventToContainerPoint: function(a) {
            return b.DomEvent.getMousePosition(a, this._container)
        },
        mouseEventToLayerPoint: function(a) {
            return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(a))
        },
        mouseEventToLatLng: function(a) {
            return this.layerPointToLatLng(this.mouseEventToLayerPoint(a))
        },
        _initContainer: function(a) {
            a = this._container = b.DomUtil.get(a);
            if (a._leaflet) throw Error("Map container is already initialized.");
            a._leaflet = !0
        },
        _initLayout: function() {
            var a = this._container;
            b.DomUtil.addClass(a, "leaflet-container");
            b.Browser.touch && b.DomUtil.addClass(a, "leaflet-touch");
            this.options.fadeAnimation && b.DomUtil.addClass(a, "leaflet-fade-anim");
            var c = b.DomUtil.getStyle(a, "position");
            "absolute" !==
            c && "relative" !== c && "fixed" !== c && (a.style.position = "relative");
            this._initPanes();
            this._initControlPos && this._initControlPos()
        },
        _initPanes: function() {
            var a = this._panes = {};
            this._mapPane = a.mapPane = this._createPane("leaflet-map-pane", this._container);
            this._tilePane = a.tilePane = this._createPane("leaflet-tile-pane", this._mapPane);
            a.objectsPane = this._createPane("leaflet-objects-pane", this._mapPane);
            a.shadowPane = this._createPane("leaflet-shadow-pane");
            a.overlayPane = this._createPane("leaflet-overlay-pane");
            a.markerPane = this._createPane("leaflet-marker-pane");
            a.popupPane = this._createPane("leaflet-popup-pane");
            this.options.markerZoomAnimation || (b.DomUtil.addClass(a.markerPane, " leaflet-zoom-hide"), b.DomUtil.addClass(a.shadowPane, " leaflet-zoom-hide"), b.DomUtil.addClass(a.popupPane, " leaflet-zoom-hide"))
        },
        _createPane: function(a, c) {
            return b.DomUtil.create("div", a, c || this._panes.objectsPane)
        },
        _initLayers: function(a) {
            a = a ? b.Util.isArray(a) ? a : [a] : [];
            this._layers = {};
            this._zoomBoundLayers = {};
            this._tileLayersNum =
                0;
            var c, d;
            c = 0;
            for (d = a.length; c < d; c++) this.addLayer(a[c])
        },
        _resetView: function(a, c, d, e) {
            var h = this._zoom !== c;
            e || (this.fire("movestart"), h && this.fire("zoomstart"));
            this._zoom = c;
            this._initialTopLeftPoint = this._getNewTopLeftPoint(a);
            d ? this._initialTopLeftPoint._add(this._getMapPanePos()) : b.DomUtil.setPosition(this._mapPane, new b.Point(0, 0));
            this._tileLayersToLoad = this._tileLayersNum;
            a = !this._loaded;
            this._loaded = !0;
            this.fire("viewreset", {
                hard: !d
            });
            this.fire("move");
            (h || e) && this.fire("zoomend");
            this.fire("moveend", {
                hard: !d
            });
            a && this.fire("load")
        },
        _rawPanBy: function(a) {
            b.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(a))
        },
        _updateZoomLevels: function() {
            var a, c = Infinity,
                b = -Infinity;
            for (a in this._zoomBoundLayers)
                if (this._zoomBoundLayers.hasOwnProperty(a)) {
                    var e = this._zoomBoundLayers[a];
                    isNaN(e.options.minZoom) || (c = Math.min(c, e.options.minZoom));
                    isNaN(e.options.maxZoom) || (b = Math.max(b, e.options.maxZoom))
                }
            a === k ? this._layersMaxZoom = this._layersMinZoom = k : (this._layersMaxZoom = b, this._layersMinZoom =
                c)
        },
        _initEvents: function() {
            if (b.DomEvent) {
                b.DomEvent.on(this._container, "click", this._onMouseClick, this);
                var a = "dblclick mousedown mouseup mouseenter mouseleave mousemove contextmenu".split(" "),
                    c, d;
                c = 0;
                for (d = a.length; c < d; c++) b.DomEvent.on(this._container, a[c], this._fireMouseEvent, this);
                if (this.options.trackResize) b.DomEvent.on(f, "resize", this._onResize, this)
            }
        },
        _onResize: function() {
            b.Util.cancelAnimFrame(this._resizeRequest);
            this._resizeRequest = b.Util.requestAnimFrame(this.invalidateSize, this, !1,
                this._container)
        },
        _onMouseClick: function(a) {
            !this._loaded || this.dragging && this.dragging.moved() || (this.fire("preclick"), this._fireMouseEvent(a))
        },
        _fireMouseEvent: function(a) {
            if (this._loaded) {
                var c = a.type,
                    c = "mouseenter" === c ? "mouseover" : "mouseleave" === c ? "mouseout" : c;
                if (this.hasEventListeners(c)) {
                    "contextmenu" === c && b.DomEvent.preventDefault(a);
                    var d = this.mouseEventToContainerPoint(a),
                        e = this.containerPointToLayerPoint(d),
                        h = this.layerPointToLatLng(e);
                    this.fire(c, {
                        latlng: h,
                        layerPoint: e,
                        containerPoint: d,
                        originalEvent: a
                    })
                }
            }
        },
        _onTileLayerLoad: function() {
            this._tileLayersToLoad--;
            this._tileLayersNum && !this._tileLayersToLoad && this._tileBg && (clearTimeout(this._clearTileBgTimer), this._clearTileBgTimer = setTimeout(b.bind(this._clearTileBg, this), 500))
        },
        whenReady: function(a, c) {
            if (this._loaded) a.call(c || this, this);
            else this.on("load", a, c);
            return this
        },
        _getMapPanePos: function() {
            return b.DomUtil.getPosition(this._mapPane)
        },
        _getTopLeftPoint: function() {
            if (!this._loaded) throw Error("Set map center and zoom first.");
            return this._initialTopLeftPoint.subtract(this._getMapPanePos())
        },
        _getNewTopLeftPoint: function(a, c) {
            var b = this.getSize()._divideBy(2);
            return this.project(a, c)._subtract(b)._round()
        },
        _latLngToNewLayerPoint: function(a, c, b) {
            b = this._getNewTopLeftPoint(b, c).add(this._getMapPanePos());
            return this.project(a, c)._subtract(b)
        },
        _getCenterLayerPoint: function() {
            return this.containerPointToLayerPoint(this.getSize()._divideBy(2))
        },
        _getCenterOffset: function(a) {
            return this.latLngToLayerPoint(a).subtract(this._getCenterLayerPoint())
        },
        _limitZoom: function(a) {
            var c = this.getMinZoom(),
                b = this.getMaxZoom();
            return Math.max(c, Math.min(b, a))
        }
    });
    b.map = function(a, c) {
        return new b.Map(a, c)
    };
    b.Projection.Mercator = {
        MAX_LATITUDE: 85.0840591556,
        R_MINOR: 6356752.3142,
        R_MAJOR: 6378137,
        project: function(a) {
            var c = b.LatLng.DEG_TO_RAD,
                d = this.MAX_LATITUDE,
                e = Math.max(Math.min(d, a.lat), -d),
                h = this.R_MAJOR,
                d = this.R_MINOR;
            a = a.lng * c * h;
            c *= e;
            h = d / h;
            h = Math.sqrt(1 - h * h);
            e = h * Math.sin(c);
            e = Math.pow((1 - e) / (1 + e), .5 * h);
            c = Math.tan(.5 * (.5 * Math.PI - c)) / e;
            c = -d * Math.log(c);
            return new b.Point(a,
                c)
        },
        unproject: function(a) {
            var c = b.LatLng.RAD_TO_DEG,
                d = this.R_MAJOR,
                e = this.R_MINOR,
                h = a.x * c / d,
                d = e / d,
                d = Math.sqrt(1 - d * d);
            a = Math.exp(-a.y / e);
            for (var e = Math.PI / 2 - 2 * Math.atan(a), f = 15, g = .1; 1E-7 < Math.abs(g) && 0 < --f;) g = d * Math.sin(e), g = Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - g) / (1 + g), .5 * d)) - e, e += g;
            return new b.LatLng(e * c, h)
        }
    };
    b.CRS.EPSG3395 = b.extend({}, b.CRS, {
        code: "EPSG:3395",
        projection: b.Projection.Mercator,
        transformation: function() {
            var a = b.Projection.Mercator;
            return new b.Transformation(.5 / (Math.PI * a.R_MAJOR),
                .5, -.5 / (Math.PI * a.R_MINOR), .5)
        }()
    });
    b.TileLayer = b.Class.extend({
        includes: b.Mixin.Events,
        options: {
            minZoom: 0,
            maxZoom: 18,
            tileSize: 256,
            subdomains: "abc",
            errorTileUrl: "",
            attribution: "",
            zoomOffset: 0,
            opacity: 1,
            unloadInvisibleTiles: b.Browser.mobile,
            updateWhenIdle: b.Browser.mobile
        },
        initialize: function(a, c) {
            c = b.setOptions(this, c);
            c.detectRetina && b.Browser.retina && 0 < c.maxZoom && (c.tileSize = Math.floor(c.tileSize / 2), c.zoomOffset++, 0 < c.minZoom && c.minZoom--, this.options.maxZoom--);
            this._url = a;
            var d = this.options.subdomains;
            "string" === typeof d && (this.options.subdomains = d.split(""))
        },
        onAdd: function(a) {
            this._map = a;
            this._initContainer();
            this._createTileProto();
            a.on({
                viewreset: this._resetCallback,
                moveend: this._update
            }, this);
            this.options.updateWhenIdle || (this._limitedUpdate = b.Util.limitExecByInterval(this._update, 150, this), a.on("move", this._limitedUpdate, this));
            this._reset();
            this._update()
        },
        addTo: function(a) {
            a.addLayer(this);
            return this
        },
        onRemove: function(a) {
            this._container.parentNode.removeChild(this._container);
            a.off({
                viewreset: this._resetCallback,
                moveend: this._update
            }, this);
            this.options.updateWhenIdle || a.off("move", this._limitedUpdate, this);
            this._map = this._container = null
        },
        bringToFront: function() {
            var a = this._map._panes.tilePane;
            this._container && (a.appendChild(this._container), this._setAutoZIndex(a, Math.max));
            return this
        },
        bringToBack: function() {
            var a = this._map._panes.tilePane;
            this._container && (a.insertBefore(this._container, a.firstChild), this._setAutoZIndex(a, Math.min));
            return this
        },
        getAttribution: function() {
            return this.options.attribution
        },
        setOpacity: function(a) {
            this.options.opacity = a;
            this._map && this._updateOpacity();
            return this
        },
        setZIndex: function(a) {
            this.options.zIndex = a;
            this._updateZIndex();
            return this
        },
        setUrl: function(a, c) {
            this._url = a;
            c || this.redraw();
            return this
        },
        redraw: function() {
            this._map && (this._map._panes.tilePane.empty = !1, this._reset(!0), this._update());
            return this
        },
        _updateZIndex: function() {
            this._container && this.options.zIndex !== k && (this._container.style.zIndex = this.options.zIndex)
        },
        _setAutoZIndex: function(a, c) {
            var b = a.children,
                e = -c(Infinity, -Infinity),
                h, f, g;
            f = 0;
            for (g = b.length; f < g; f++) b[f] !== this._container && (h = parseInt(b[f].style.zIndex, 10), isNaN(h) || (e = c(e, h)));
            this.options.zIndex = this._container.style.zIndex = (isFinite(e) ? e : 0) + c(1, -1)
        },
        _updateOpacity: function() {
            b.DomUtil.setOpacity(this._container, this.options.opacity);
            var a, c = this._tiles;
            if (b.Browser.webkit)
                for (a in c) c.hasOwnProperty(a) && (c[a].style.webkitTransform += " translate(0,0)")
        },
        _initContainer: function() {
            var a = this._map._panes.tilePane;
            if (!this._container || a.empty) this._container =
                b.DomUtil.create("div", "leaflet-layer"), this._updateZIndex(), a.appendChild(this._container), 1 > this.options.opacity && this._updateOpacity()
        },
        _resetCallback: function(a) {
            this._reset(a.hard)
        },
        _reset: function(a) {
            var c = this._tiles,
                b;
            for (b in c) c.hasOwnProperty(b) && this.fire("tileunload", {
                tile: c[b]
            });
            this._tiles = {};
            this._tilesToLoad = 0;
            this.options.reuseTiles && (this._unusedTiles = []);
            a && this._container && (this._container.innerHTML = "");
            this._initContainer()
        },
        _update: function() {
            if (this._map) {
                var a = this._map.getPixelBounds(),
                    c = this._map.getZoom(),
                    d = this.options.tileSize;
                c > this.options.maxZoom || c < this.options.minZoom || (c = new b.Point(Math.floor(a.min.x / d), Math.floor(a.min.y / d)), a = new b.Point(Math.floor(a.max.x / d), Math.floor(a.max.y / d)), a = new b.Bounds(c, a), this._addTilesFromCenterOut(a), (this.options.unloadInvisibleTiles || this.options.reuseTiles) && this._removeOtherTiles(a))
            }
        },
        _addTilesFromCenterOut: function(a) {
            var c = [],
                d = a.getCenter(),
                e, h, f;
            for (e = a.min.y; e <= a.max.y; e++)
                for (h = a.min.x; h <= a.max.x; h++) f = new b.Point(h, e), this._tileShouldBeLoaded(f) &&
                    c.push(f);
            a = c.length;
            if (0 !== a) {
                c.sort(function(a, c) {
                    return a.distanceTo(d) - c.distanceTo(d)
                });
                e = g.createDocumentFragment();
                this._tilesToLoad || this.fire("loading");
                this._tilesToLoad += a;
                for (h = 0; h < a; h++) this._addTile(c[h], e);
                this._container.appendChild(e)
            }
        },
        _tileShouldBeLoaded: function(a) {
            if (a.x + ":" + a.y in this._tiles) return !1;
            if (!this.options.continuousWorld) {
                var c = this._getWrapTileNum();
                if (this.options.noWrap && (0 > a.x || a.x >= c) || 0 > a.y || a.y >= c) return !1
            }
            return !0
        },
        _removeOtherTiles: function(a) {
            var c, b, e;
            for (e in this._tiles) this._tiles.hasOwnProperty(e) && (c = e.split(":"), b = parseInt(c[0], 10), c = parseInt(c[1], 10), (b < a.min.x || b > a.max.x || c < a.min.y || c > a.max.y) && this._removeTile(e))
        },
        _removeTile: function(a) {
            var c = this._tiles[a];
            this.fire("tileunload", {
                tile: c,
                url: c.src
            });
            this.options.reuseTiles ? (b.DomUtil.removeClass(c, "leaflet-tile-loaded"), this._unusedTiles.push(c)) : c.parentNode === this._container && this._container.removeChild(c);
            b.Browser.android || (c.src = b.Util.emptyImageUrl);
            delete this._tiles[a]
        },
        _addTile: function(a,
            c) {
            var d = this._getTilePos(a),
                e = this._getTile();
            b.DomUtil.setPosition(e, d, b.Browser.chrome || b.Browser.android23);
            this._tiles[a.x + ":" + a.y] = e;
            this._loadTile(e, a);
            e.parentNode !== this._container && c.appendChild(e)
        },
        _getZoomForUrl: function() {
            var a = this.options,
                c = this._map.getZoom();
            a.zoomReverse && (c = a.maxZoom - c);
            return c + a.zoomOffset
        },
        _getTilePos: function(a) {
            var c = this._map.getPixelOrigin();
            return a.multiplyBy(this.options.tileSize).subtract(c)
        },
        getTileUrl: function(a) {
            this._adjustTilePoint(a);
            return b.Util.template(this._url,
                b.extend({
                    s: this._getSubdomain(a),
                    z: this._getZoomForUrl(),
                    x: a.x,
                    y: a.y
                }, this.options))
        },
        _getWrapTileNum: function() {
            return Math.pow(2, this._getZoomForUrl())
        },
        _adjustTilePoint: function(a) {
            var c = this._getWrapTileNum();
            this.options.continuousWorld || this.options.noWrap || (a.x = (a.x % c + c) % c);
            this.options.tms && (a.y = c - a.y - 1)
        },
        _getSubdomain: function(a) {
            return this.options.subdomains[(a.x + a.y) % this.options.subdomains.length]
        },
        _createTileProto: function() {
            var a = this._tileImg = b.DomUtil.create("img", "leaflet-tile");
            a.style.width = a.style.height = this.options.tileSize + "px";
            a.galleryimg = "no"
        },
        _getTile: function() {
            if (this.options.reuseTiles && 0 < this._unusedTiles.length) {
                var a = this._unusedTiles.pop();
                this._resetTile(a);
                return a
            }
            return this._createTile()
        },
        _resetTile: function() {},
        _createTile: function() {
            var a = this._tileImg.cloneNode(!1);
            a.onselectstart = a.onmousemove = b.Util.falseFn;
            return a
        },
        _loadTile: function(a, c) {
            a._layer = this;
            a.onload = this._tileOnLoad;
            a.onerror = this._tileOnError;
            a.src = this.getTileUrl(c)
        },
        _tileLoaded: function() {
            this._tilesToLoad--;
            this._tilesToLoad || this.fire("load")
        },
        _tileOnLoad: function() {
            var a = this._layer;
            this.src !== b.Util.emptyImageUrl && (b.DomUtil.addClass(this, "leaflet-tile-loaded"), a.fire("tileload", {
                tile: this,
                url: this.src
            }));
            a._tileLoaded()
        },
        _tileOnError: function() {
            var a = this._layer;
            a.fire("tileerror", {
                tile: this,
                url: this.src
            });
            var c = a.options.errorTileUrl;
            c && (this.src = c);
            a._tileLoaded()
        }
    });
    b.tileLayer = function(a, c) {
        return new b.TileLayer(a, c)
    };
    b.TileLayer.WMS = b.TileLayer.extend({
        defaultWmsParams: {
            service: "WMS",
            request: "GetMap",
            version: "1.1.1",
            layers: "",
            styles: "",
            format: "image/jpeg",
            transparent: !1
        },
        initialize: function(a, c) {
            this._url = a;
            var d = b.extend({}, this.defaultWmsParams);
            d.width = c.detectRetina && b.Browser.retina ? d.height = 2 * this.options.tileSize : d.height = this.options.tileSize;
            for (var e in c) this.options.hasOwnProperty(e) || (d[e] = c[e]);
            this.wmsParams = d;
            b.setOptions(this, c)
        },
        onAdd: function(a) {
            var c = 1.3 <= parseFloat(this.wmsParams.version) ? "crs" : "srs";
            this.wmsParams[c] = a.options.crs.code;
            b.TileLayer.prototype.onAdd.call(this,
                a)
        },
        getTileUrl: function(a, c) {
            this._adjustTilePoint(a);
            var d = this._map,
                e = d.options.crs,
                h = this.options.tileSize,
                f = a.multiplyBy(h),
                h = f.add(new b.Point(h, h)),
                f = e.project(d.unproject(f, c)),
                d = e.project(d.unproject(h, c)),
                d = [f.x, d.y, d.x, f.y].join(),
                e = b.Util.template(this._url, {
                    s: this._getSubdomain(a)
                });
            return e + b.Util.getParamString(this.wmsParams, e) + "&bbox=" + d
        },
        setParams: function(a, c) {
            b.extend(this.wmsParams, a);
            c || this.redraw();
            return this
        }
    });
    b.tileLayer.wms = function(a, c) {
        return new b.TileLayer.WMS(a, c)
    };
    b.TileLayer.Canvas = b.TileLayer.extend({
        options: {
            async: !1
        },
        initialize: function(a) {
            b.setOptions(this, a)
        },
        redraw: function() {
            var a = this._tiles,
                c;
            for (c in a) a.hasOwnProperty(c) && this._redrawTile(a[c])
        },
        _redrawTile: function(a) {
            this.drawTile(a, a._tilePoint, this._map._zoom)
        },
        _createTileProto: function() {
            var a = this._canvasProto = b.DomUtil.create("canvas", "leaflet-tile");
            a.width = a.height = this.options.tileSize
        },
        _createTile: function() {
            var a = this._canvasProto.cloneNode(!1);
            a.onselectstart = a.onmousemove = b.Util.falseFn;
            return a
        },
        _loadTile: function(a, c) {
            a._layer = this;
            a._tilePoint = c;
            this._redrawTile(a);
            this.options.async || this.tileDrawn(a)
        },
        drawTile: function() {},
        tileDrawn: function(a) {
            this._tileOnLoad.call(a)
        }
    });
    b.tileLayer.canvas = function(a) {
        return new b.TileLayer.Canvas(a)
    };
    b.ImageOverlay = b.Class.extend({
        includes: b.Mixin.Events,
        options: {
            opacity: 1
        },
        initialize: function(a, c, d) {
            this._url = a;
            this._bounds = b.latLngBounds(c);
            b.setOptions(this, d)
        },
        onAdd: function(a) {
            this._map = a;
            this._image || this._initImage();
            a._panes.overlayPane.appendChild(this._image);
            a.on("viewreset", this._reset, this);
            if (a.options.zoomAnimation && b.Browser.any3d) a.on("zoomanim", this._animateZoom, this);
            this._reset()
        },
        onRemove: function(a) {
            a.getPanes().overlayPane.removeChild(this._image);
            a.off("viewreset", this._reset, this);
            a.options.zoomAnimation && a.off("zoomanim", this._animateZoom, this)
        },
        addTo: function(a) {
            a.addLayer(this);
            return this
        },
        setOpacity: function(a) {
            this.options.opacity = a;
            this._updateOpacity();
            return this
        },
        bringToFront: function() {
            this._image && this._map._panes.overlayPane.appendChild(this._image);
            return this
        },
        bringToBack: function() {
            var a = this._map._panes.overlayPane;
            this._image && a.insertBefore(this._image, a.firstChild);
            return this
        },
        _initImage: function() {
            this._image = b.DomUtil.create("img", "leaflet-image-layer");
            this._map.options.zoomAnimation && b.Browser.any3d ? b.DomUtil.addClass(this._image, "leaflet-zoom-animated") : b.DomUtil.addClass(this._image, "leaflet-zoom-hide");
            this._updateOpacity();
            b.extend(this._image, {
                galleryimg: "no",
                onselectstart: b.Util.falseFn,
                onmousemove: b.Util.falseFn,
                onload: b.bind(this._onImageLoad,
                    this),
                src: this._url
            })
        },
        _animateZoom: function(a) {
            var c = this._map,
                d = this._image,
                e = c.getZoomScale(a.zoom),
                h = this._bounds.getNorthWest(),
                f = this._bounds.getSouthEast(),
                h = c._latLngToNewLayerPoint(h, a.zoom, a.center);
            a = c._latLngToNewLayerPoint(f, a.zoom, a.center)._subtract(h);
            a = h._add(a._multiplyBy(.5 * (1 - 1 / e)));
            d.style[b.DomUtil.TRANSFORM] = b.DomUtil.getTranslateString(a) + " scale(" + e + ") "
        },
        _reset: function() {
            var a = this._image,
                c = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
                d = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(c);
            b.DomUtil.setPosition(a, c);
            a.style.width = d.x + "px";
            a.style.height = d.y + "px"
        },
        _onImageLoad: function() {
            this.fire("load")
        },
        _updateOpacity: function() {
            b.DomUtil.setOpacity(this._image, this.options.opacity)
        }
    });
    b.imageOverlay = function(a, c, d) {
        return new b.ImageOverlay(a, c, d)
    };
    b.Icon = b.Class.extend({
        options: {
            className: ""
        },
        initialize: function(a) {
            b.setOptions(this, a)
        },
        createIcon: function() {
            return this._createIcon("icon")
        },
        createShadow: function() {
            return this._createIcon("shadow")
        },
        _createIcon: function(a) {
            var c =
                this._getIconUrl(a);
            if (!c) {
                if ("icon" === a) throw Error("iconUrl not set in Icon options (see the docs).");
                return null
            }
            c = this._createImg(c);
            this._setIconStyles(c, a);
            return c
        },
        _setIconStyles: function(a, c) {
            var d = this.options,
                e = b.point(d[c + "Size"]),
                h;
            h = "shadow" === c ? b.point(d.shadowAnchor || d.iconAnchor) : b.point(d.iconAnchor);
            !h && e && (h = e.divideBy(2, !0));
            a.className = "leaflet-marker-" + c + " " + d.className;
            h && (a.style.marginLeft = -h.x + "px", a.style.marginTop = -h.y + "px");
            e && (a.style.width = e.x + "px", a.style.height = e.y +
                "px")
        },
        _createImg: function(a) {
            var c;
            b.Browser.ie6 ? (c = g.createElement("div"), c.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + a + '")') : (c = g.createElement("img"), c.src = a);
            return c
        },
        _getIconUrl: function(a) {
            return b.Browser.retina && this.options[a + "RetinaUrl"] ? this.options[a + "RetinaUrl"] : this.options[a + "Url"]
        }
    });
    b.icon = function(a) {
        return new b.Icon(a)
    };
    b.Icon.Default = b.Icon.extend({
        options: {
            iconSize: new b.Point(25, 41),
            iconAnchor: new b.Point(12, 41),
            popupAnchor: new b.Point(1, -34),
            shadowSize: new b.Point(41, 41)
        },
        _getIconUrl: function(a) {
            var c = a + "Url";
            if (this.options[c]) return this.options[c];
            b.Browser.retina && "icon" === a && (a += "@2x");
            c = b.Icon.Default.imagePath;
            if (!c) throw Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");
            return c + "/marker-" + a + ".png"
        }
    });
    b.Icon.Default.imagePath = function() {
        var a = g.getElementsByTagName("script"),
            c = /\/?leaflet[\-\._]?([\w\-\._]*)\.js\??/,
            b, e, h, f;
        b = 0;
        for (e = a.length; b < e; b++)
            if (h = a[b].src, f = h.match(c)) return h.split(c)[0] + "/images"
    }();
    b.Marker = b.Class.extend({
        includes: b.Mixin.Events,
        options: {
            icon: new b.Icon.Default,
            title: "",
            clickable: !0,
            draggable: !1,
            zIndexOffset: 0,
            opacity: 1,
            riseOnHover: !1,
            riseOffset: 250
        },
        initialize: function(a, c) {
            b.setOptions(this, c);
            this._latlng = b.latLng(a)
        },
        onAdd: function(a) {
            this._map = a;
            a.on("viewreset", this.update, this);
            this._initIcon();
            this.update();
            if (a.options.zoomAnimation && a.options.markerZoomAnimation) a.on("zoomanim", this._animateZoom, this)
        },
        addTo: function(a) {
            a.addLayer(this);
            return this
        },
        onRemove: function(a) {
            this._removeIcon();
            this.fire("remove");
            a.off({
                viewreset: this.update,
                zoomanim: this._animateZoom
            }, this);
            this._map = null
        },
        getLatLng: function() {
            return this._latlng
        },
        setLatLng: function(a) {
            this._latlng = b.latLng(a);
            this.update();
            return this.fire("move", {
                latlng: this._latlng
            })
        },
        setZIndexOffset: function(a) {
            this.options.zIndexOffset = a;
            this.update();
            return this
        },
        setIcon: function(a) {
            this._map && this._removeIcon();
            this.options.icon = a;
            this._map && (this._initIcon(), this.update());
            return this
        },
        update: function() {
            if (this._icon) {
                var a = this._map.latLngToLayerPoint(this._latlng).round();
                this._setPos(a)
            }
            return this
        },
        _initIcon: function() {
            var a = this.options,
                c = this._map,
                c = c.options.zoomAnimation && c.options.markerZoomAnimation ? "leaflet-zoom-animated" : "leaflet-zoom-hide",
                d = !1;
            if (!this._icon && (this._icon = a.icon.createIcon(), a.title && (this._icon.title = a.title), this._initInteraction(), d = 1 > this.options.opacity, b.DomUtil.addClass(this._icon, c), a.riseOnHover)) b.DomEvent.on(this._icon, "mouseover", this._bringToFront, this).on(this._icon, "mouseout", this._resetZIndex, this);
            !this._shadow && (this._shadow =
                a.icon.createShadow()) && (b.DomUtil.addClass(this._shadow, c), d = 1 > this.options.opacity);
            d && this._updateOpacity();
            a = this._map._panes;
            a.markerPane.appendChild(this._icon);
            this._shadow && a.shadowPane.appendChild(this._shadow)
        },
        _removeIcon: function() {
            var a = this._map._panes;
            this.options.riseOnHover && b.DomEvent.off(this._icon, "mouseover", this._bringToFront).off(this._icon, "mouseout", this._resetZIndex);
            a.markerPane.removeChild(this._icon);
            this._shadow && a.shadowPane.removeChild(this._shadow);
            this._icon = this._shadow =
                null
        },
        _setPos: function(a) {
            b.DomUtil.setPosition(this._icon, a);
            this._shadow && b.DomUtil.setPosition(this._shadow, a);
            this._zIndex = a.y + this.options.zIndexOffset;
            this._resetZIndex()
        },
        _updateZIndex: function(a) {
            this._icon.style.zIndex = this._zIndex + a
        },
        _animateZoom: function(a) {
            a = this._map._latLngToNewLayerPoint(this._latlng, a.zoom, a.center);
            this._setPos(a)
        },
        _initInteraction: function() {
            if (this.options.clickable) {
                var a = this._icon,
                    c = ["dblclick", "mousedown", "mouseover", "mouseout", "contextmenu"];
                b.DomUtil.addClass(a,
                    "leaflet-clickable");
                b.DomEvent.on(a, "click", this._onMouseClick, this);
                for (var d = 0; d < c.length; d++) b.DomEvent.on(a, c[d], this._fireMouseEvent, this);
                b.Handler.MarkerDrag && (this.dragging = new b.Handler.MarkerDrag(this), this.options.draggable && this.dragging.enable())
            }
        },
        _onMouseClick: function(a) {
            var c = this.dragging && this.dragging.moved();
            (this.hasEventListeners(a.type) || c) && b.DomEvent.stopPropagation(a);
            c || (this.dragging && this.dragging._enabled || !this._map.dragging || !this._map.dragging.moved()) && this.fire(a.type, {
                originalEvent: a
            })
        },
        _fireMouseEvent: function(a) {
            this.fire(a.type, {
                originalEvent: a
            });
            "contextmenu" === a.type && this.hasEventListeners(a.type) && b.DomEvent.preventDefault(a);
            "mousedown" !== a.type && b.DomEvent.stopPropagation(a)
        },
        setOpacity: function(a) {
            this.options.opacity = a;
            this._map && this._updateOpacity()
        },
        _updateOpacity: function() {
            b.DomUtil.setOpacity(this._icon, this.options.opacity);
            this._shadow && b.DomUtil.setOpacity(this._shadow, this.options.opacity)
        },
        _bringToFront: function() {
            this._updateZIndex(this.options.riseOffset)
        },
        _resetZIndex: function() {
            this._updateZIndex(0)
        }
    });
    b.marker = function(a, c) {
        return new b.Marker(a, c)
    };
    b.DivIcon = b.Icon.extend({
        options: {
            iconSize: new b.Point(12, 12),
            className: "leaflet-div-icon"
        },
        createIcon: function() {
            var a = g.createElement("div"),
                c = this.options;
            c.html && (a.innerHTML = c.html);
            c.bgPos && (a.style.backgroundPosition = -c.bgPos.x + "px " + -c.bgPos.y + "px");
            this._setIconStyles(a, "icon");
            return a
        },
        createShadow: function() {
            return null
        }
    });
    b.divIcon = function(a) {
        return new b.DivIcon(a)
    };
    b.Map.mergeOptions({
        closePopupOnClick: !0
    });
    b.Popup = b.Class.extend({
        includes: b.Mixin.Events,
        options: {
            minWidth: 50,
            maxWidth: 300,
            maxHeight: null,
            autoPan: !0,
            closeButton: !0,
            offset: new b.Point(0, 6),
            autoPanPadding: new b.Point(5, 5),
            className: "",
            zoomAnimation: !0
        },
        initialize: function(a, c) {
            b.setOptions(this, a);
            this._source = c;
            this._animated = b.Browser.any3d && this.options.zoomAnimation
        },
        onAdd: function(a) {
            this._map = a;
            this._container || this._initLayout();
            this._updateContent();
            var c = a.options.fadeAnimation;
            c && b.DomUtil.setOpacity(this._container, 0);
            a._panes.popupPane.appendChild(this._container);
            a.on("viewreset", this._updatePosition, this);
            if (this._animated) a.on("zoomanim", this._zoomAnimation, this);
            if (a.options.closePopupOnClick) a.on("preclick", this._close, this);
            this._update();
            c && b.DomUtil.setOpacity(this._container, 1)
        },
        addTo: function(a) {
            a.addLayer(this);
            return this
        },
        openOn: function(a) {
            a.openPopup(this);
            return this
        },
        onRemove: function(a) {
            a._panes.popupPane.removeChild(this._container);
            b.Util.falseFn(this._container.offsetWidth);
            a.off({
                    viewreset: this._updatePosition,
                    preclick: this._close,
                    zoomanim: this._zoomAnimation
                },
                this);
            a.options.fadeAnimation && b.DomUtil.setOpacity(this._container, 0);
            this._map = null
        },
        setLatLng: function(a) {
            this._latlng = b.latLng(a);
            this._update();
            return this
        },
        setContent: function(a) {
            this._content = a;
            this._update();
            return this
        },
        _close: function() {
            var a = this._map;
            a && (a._popup = null, a.removeLayer(this).fire("popupclose", {
                popup: this
            }))
        },
        _initLayout: function() {
            var a = this._container = b.DomUtil.create("div", "leaflet-popup " + this.options.className + " leaflet-zoom-" + (this._animated ? "animated" : "hide")),
                c;
            this.options.closeButton &&
                (c = this._closeButton = b.DomUtil.create("a", "leaflet-popup-close-button", a), c.href = "#close", c.innerHTML = "&#215;", b.DomEvent.on(c, "click", this._onCloseButtonClick, this));
            c = this._wrapper = b.DomUtil.create("div", "leaflet-popup-content-wrapper", a);
            b.DomEvent.disableClickPropagation(c);
            this._contentNode = b.DomUtil.create("div", "leaflet-popup-content", c);
            b.DomEvent.on(this._contentNode, "mousewheel", b.DomEvent.stopPropagation);
            this._tipContainer = b.DomUtil.create("div", "leaflet-popup-tip-container", a);
            this._tip =
                b.DomUtil.create("div", "leaflet-popup-tip", this._tipContainer)
        },
        _update: function() {
            this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan())
        },
        _updateContent: function() {
            if (this._content) {
                if ("string" === typeof this._content) this._contentNode.innerHTML = this._content;
                else {
                    for (; this._contentNode.hasChildNodes();) this._contentNode.removeChild(this._contentNode.firstChild);
                    this._contentNode.appendChild(this._content)
                }
                this.fire("contentupdate")
            }
        },
        _updateLayout: function() {
            var a = this._contentNode,
                c = a.style;
            c.width = "";
            c.whiteSpace = "nowrap";
            var d = a.offsetWidth,
                d = Math.min(d, this.options.maxWidth),
                d = Math.max(d, this.options.minWidth);
            c.width = d + 1 + "px";
            c.whiteSpace = "";
            c.height = "";
            var d = a.offsetHeight,
                e = this.options.maxHeight;
            e && d > e ? (c.height = e + "px", b.DomUtil.addClass(a, "leaflet-popup-scrolled")) : b.DomUtil.removeClass(a, "leaflet-popup-scrolled");
            this._containerWidth = this._container.offsetWidth
        },
        _updatePosition: function() {
            if (this._map) {
                var a = this._map.latLngToLayerPoint(this._latlng),
                    c = this._animated,
                    d = this.options.offset;
                c && b.DomUtil.setPosition(this._container, a);
                this._containerBottom = -d.y - (c ? 0 : a.y);
                this._containerLeft = -Math.round(this._containerWidth / 2) + d.x + (c ? 0 : a.x);
                this._container.style.bottom = this._containerBottom + "px";
                this._container.style.left = this._containerLeft + "px"
            }
        },
        _zoomAnimation: function(a) {
            a = this._map._latLngToNewLayerPoint(this._latlng, a.zoom, a.center);
            b.DomUtil.setPosition(this._container, a)
        },
        _adjustPan: function() {
            if (this.options.autoPan) {
                var a = this._map,
                    c = this._container.offsetHeight,
                    d = this._containerWidth,
                    e = new b.Point(this._containerLeft, -c - this._containerBottom);
                this._animated && e._add(b.DomUtil.getPosition(this._container));
                var e = a.layerPointToContainerPoint(e),
                    h = this.options.autoPanPadding,
                    f = a.getSize(),
                    g = 0,
                    l = 0;
                0 > e.x && (g = e.x - h.x);
                e.x + d > f.x && (g = e.x + d - f.x + h.x);
                0 > e.y && (l = e.y - h.y);
                e.y + c > f.y && (l = e.y + c - f.y + h.y);
                (g || l) && a.panBy(new b.Point(g, l))
            }
        },
        _onCloseButtonClick: function(a) {
            this._close();
            b.DomEvent.stop(a)
        }
    });
    b.popup = function(a, c) {
        return new b.Popup(a, c)
    };
    b.Marker.include({
        openPopup: function() {
            this._popup &&
                this._map && (this._popup.setLatLng(this._latlng), this._map.openPopup(this._popup));
            return this
        },
        closePopup: function() {
            this._popup && this._popup._close();
            return this
        },
        bindPopup: function(a, c) {
            var d = b.point(this.options.icon.options.popupAnchor) || new b.Point(0, 0),
                d = d.add(b.Popup.prototype.options.offset);
            c && c.offset && (d = d.add(c.offset));
            c = b.extend({
                offset: d
            }, c);
            if (!this._popup) this.on("click", this.openPopup, this).on("remove", this.closePopup, this).on("move", this._movePopup, this);
            this._popup = (new b.Popup(c,
                this)).setContent(a);
            return this
        },
        unbindPopup: function() {
            this._popup && (this._popup = null, this.off("click", this.openPopup).off("remove", this.closePopup).off("move", this._movePopup));
            return this
        },
        _movePopup: function(a) {
            this._popup.setLatLng(a.latlng)
        }
    });
    b.Map.include({
        openPopup: function(a) {
            this.closePopup();
            this._popup = a;
            return this.addLayer(a).fire("popupopen", {
                popup: this._popup
            })
        },
        closePopup: function() {
            this._popup && this._popup._close();
            return this
        }
    });
    b.LayerGroup = b.Class.extend({
        initialize: function(a) {
            this._layers = {};
            var c, b;
            if (a)
                for (c = 0, b = a.length; c < b; c++) this.addLayer(a[c])
        },
        addLayer: function(a) {
            var c = b.stamp(a);
            this._layers[c] = a;
            this._map && this._map.addLayer(a);
            return this
        },
        removeLayer: function(a) {
            var c = b.stamp(a);
            delete this._layers[c];
            this._map && this._map.removeLayer(a);
            return this
        },
        clearLayers: function() {
            this.eachLayer(this.removeLayer, this);
            return this
        },
        invoke: function(a) {
            var c = Array.prototype.slice.call(arguments, 1),
                b, e;
            for (b in this._layers) this._layers.hasOwnProperty(b) && (e = this._layers[b], e[a] &&
                e[a].apply(e, c));
            return this
        },
        onAdd: function(a) {
            this._map = a;
            this.eachLayer(a.addLayer, a)
        },
        onRemove: function(a) {
            this.eachLayer(a.removeLayer, a);
            this._map = null
        },
        addTo: function(a) {
            a.addLayer(this);
            return this
        },
        eachLayer: function(a, c) {
            for (var b in this._layers) this._layers.hasOwnProperty(b) && a.call(c, this._layers[b])
        },
        setZIndex: function(a) {
            return this.invoke("setZIndex", a)
        }
    });
    b.layerGroup = function(a) {
        return new b.LayerGroup(a)
    };
    b.FeatureGroup = b.LayerGroup.extend({
        includes: b.Mixin.Events,
        statics: {
            EVENTS: "click dblclick mouseover mouseout mousemove contextmenu"
        },
        addLayer: function(a) {
            if (this._layers[b.stamp(a)]) return this;
            a.on(b.FeatureGroup.EVENTS, this._propagateEvent, this);
            b.LayerGroup.prototype.addLayer.call(this, a);
            this._popupContent && a.bindPopup && a.bindPopup(this._popupContent, this._popupOptions);
            return this.fire("layeradd", {
                layer: a
            })
        },
        removeLayer: function(a) {
            a.off(b.FeatureGroup.EVENTS, this._propagateEvent, this);
            b.LayerGroup.prototype.removeLayer.call(this, a);
            this._popupContent && this.invoke("unbindPopup");
            return this.fire("layerremove", {
                layer: a
            })
        },
        bindPopup: function(a, c) {
            this._popupContent = a;
            this._popupOptions = c;
            return this.invoke("bindPopup", a, c)
        },
        setStyle: function(a) {
            return this.invoke("setStyle", a)
        },
        bringToFront: function() {
            return this.invoke("bringToFront")
        },
        bringToBack: function() {
            return this.invoke("bringToBack")
        },
        getBounds: function() {
            var a = new b.LatLngBounds;
            this.eachLayer(function(c) {
                a.extend(c instanceof b.Marker ? c.getLatLng() : c.getBounds())
            });
            return a
        },
        _propagateEvent: function(a) {
            a.layer = a.target;
            a.target = this;
            this.fire(a.type, a)
        }
    });
    b.featureGroup = function(a) {
        return new b.FeatureGroup(a)
    };
    b.Path = b.Class.extend({
        includes: [b.Mixin.Events],
        statics: {
            CLIP_PADDING: b.Browser.mobile ? Math.max(0, Math.min(.5, (1280 / Math.max(f.innerWidth, f.innerHeight) - 1) / 2)) : .5
        },
        options: {
            stroke: !0,
            color: "#0033ff",
            dashArray: null,
            weight: 5,
            opacity: .5,
            fill: !1,
            fillColor: null,
            fillOpacity: .2,
            clickable: !0
        },
        initialize: function(a) {
            b.setOptions(this, a)
        },
        onAdd: function(a) {
            this._map = a;
            this._container || (this._initElements(), this._initEvents());
            this.projectLatlngs();
            this._updatePath();
            this._container && this._map._pathRoot.appendChild(this._container);
            this.fire("add");
            a.on({
                viewreset: this.projectLatlngs,
                moveend: this._updatePath
            }, this)
        },
        addTo: function(a) {
            a.addLayer(this);
            return this
        },
        onRemove: function(a) {
            a._pathRoot.removeChild(this._container);
            this.fire("remove");
            this._map = null;
            b.Browser.vml && (this._fill = this._stroke = this._container = null);
            a.off({
                viewreset: this.projectLatlngs,
                moveend: this._updatePath
            }, this)
        },
        projectLatlngs: function() {},
        setStyle: function(a) {
            b.setOptions(this, a);
            this._container &&
                this._updateStyle();
            return this
        },
        redraw: function() {
            this._map && (this.projectLatlngs(), this._updatePath());
            return this
        }
    });
    b.Map.include({
        _updatePathViewport: function() {
            var a = b.Path.CLIP_PADDING,
                c = this.getSize(),
                d = b.DomUtil.getPosition(this._mapPane).multiplyBy(-1)._subtract(c.multiplyBy(a)._round()),
                a = d.add(c.multiplyBy(1 + 2 * a)._round());
            this._pathViewport = new b.Bounds(d, a)
        }
    });
    b.Path.SVG_NS = "http://www.w3.org/2000/svg";
    b.Browser.svg = !(!g.createElementNS || !g.createElementNS(b.Path.SVG_NS, "svg").createSVGRect);
    b.Path = b.Path.extend({
        statics: {
            SVG: b.Browser.svg
        },
        bringToFront: function() {
            var a = this._map._pathRoot,
                c = this._container;
            c && a.lastChild !== c && a.appendChild(c);
            return this
        },
        bringToBack: function() {
            var a = this._map._pathRoot,
                c = this._container,
                b = a.firstChild;
            c && b !== c && a.insertBefore(c, b);
            return this
        },
        getPathString: function() {},
        _createElement: function(a) {
            return g.createElementNS(b.Path.SVG_NS, a)
        },
        _initElements: function() {
            this._map._initPathRoot();
            this._initPath();
            this._initStyle()
        },
        _initPath: function() {
            this._container =
                this._createElement("g");
            this._path = this._createElement("path");
            this._container.appendChild(this._path)
        },
        _initStyle: function() {
            this.options.stroke && (this._path.setAttribute("stroke-linejoin", "round"), this._path.setAttribute("stroke-linecap", "round"));
            this.options.fill && this._path.setAttribute("fill-rule", "evenodd");
            this._updateStyle()
        },
        _updateStyle: function() {
            this.options.stroke ? (this._path.setAttribute("stroke", this.options.color), this._path.setAttribute("stroke-opacity", this.options.opacity), this._path.setAttribute("stroke-width",
                this.options.weight), this.options.dashArray ? this._path.setAttribute("stroke-dasharray", this.options.dashArray) : this._path.removeAttribute("stroke-dasharray")) : this._path.setAttribute("stroke", "none");
            this.options.fill ? (this._path.setAttribute("fill", this.options.fillColor || this.options.color), this._path.setAttribute("fill-opacity", this.options.fillOpacity)) : this._path.setAttribute("fill", "none")
        },
        _updatePath: function() {
            var a = this.getPathString();
            a || (a = "M0 0");
            this._path.setAttribute("d", a)
        },
        _initEvents: function() {
            if (this.options.clickable) {
                !b.Browser.svg &&
                    b.Browser.vml || this._path.setAttribute("class", "leaflet-clickable");
                b.DomEvent.on(this._container, "click", this._onMouseClick, this);
                for (var a = "dblclick mousedown mouseover mouseout mousemove contextmenu".split(" "), c = 0; c < a.length; c++) b.DomEvent.on(this._container, a[c], this._fireMouseEvent, this)
            }
        },
        _onMouseClick: function(a) {
            this._map.dragging && this._map.dragging.moved() || this._fireMouseEvent(a)
        },
        _fireMouseEvent: function(a) {
            if (this.hasEventListeners(a.type)) {
                var c = this._map,
                    d = c.mouseEventToContainerPoint(a),
                    e = c.containerPointToLayerPoint(d),
                    c = c.layerPointToLatLng(e);
                this.fire(a.type, {
                    latlng: c,
                    layerPoint: e,
                    containerPoint: d,
                    originalEvent: a
                });
                "contextmenu" === a.type && b.DomEvent.preventDefault(a);
                "mousemove" !== a.type && b.DomEvent.stopPropagation(a)
            }
        }
    });
    b.Map.include({
        _initPathRoot: function() {
            this._pathRoot || (this._pathRoot = b.Path.prototype._createElement("svg"), this._panes.overlayPane.appendChild(this._pathRoot), this.options.zoomAnimation && b.Browser.any3d ? (this._pathRoot.setAttribute("class", " leaflet-zoom-animated"),
                this.on({
                    zoomanim: this._animatePathZoom,
                    zoomend: this._endPathZoom
                })) : this._pathRoot.setAttribute("class", " leaflet-zoom-hide"), this.on("moveend", this._updateSvgViewport), this._updateSvgViewport())
        },
        _animatePathZoom: function(a) {
            var c = this.getZoomScale(a.zoom);
            a = this._getCenterOffset(a.center)._multiplyBy(-c)._add(this._pathViewport.min);
            this._pathRoot.style[b.DomUtil.TRANSFORM] = b.DomUtil.getTranslateString(a) + " scale(" + c + ") ";
            this._pathZooming = !0
        },
        _endPathZoom: function() {
            this._pathZooming = !1
        },
        _updateSvgViewport: function() {
            if (!this._pathZooming) {
                this._updatePathViewport();
                var a = this._pathViewport,
                    c = a.min,
                    d = a.max,
                    a = d.x - c.x,
                    d = d.y - c.y,
                    e = this._pathRoot,
                    h = this._panes.overlayPane;
                b.Browser.mobileWebkit && h.removeChild(e);
                b.DomUtil.setPosition(e, c);
                e.setAttribute("width", a);
                e.setAttribute("height", d);
                e.setAttribute("viewBox", [c.x, c.y, a, d].join(" "));
                b.Browser.mobileWebkit && h.appendChild(e)
            }
        }
    });
    b.Path.include({
        bindPopup: function(a, c) {
            if (!this._popup || c) this._popup = new b.Popup(c, this);
            this._popup.setContent(a);
            this._popupHandlersAdded || (this.on("click", this._openPopup, this).on("remove",
                this.closePopup, this), this._popupHandlersAdded = !0);
            return this
        },
        unbindPopup: function() {
            this._popup && (this._popup = null, this.off("click", this._openPopup).off("remove", this.closePopup), this._popupHandlersAdded = !1);
            return this
        },
        openPopup: function(a) {
            this._popup && (a = a || this._latlng || this._latlngs[Math.floor(this._latlngs.length / 2)], this._openPopup({
                latlng: a
            }));
            return this
        },
        closePopup: function() {
            this._popup && this._popup._close();
            return this
        },
        _openPopup: function(a) {
            this._popup.setLatLng(a.latlng);
            this._map.openPopup(this._popup)
        }
    });
    b.Browser.vml = !b.Browser.svg && function() {
        try {
            var a = g.createElement("div");
            a.innerHTML = '<v:shape adj="1"/>';
            var c = a.firstChild;
            c.style.behavior = "url(#default#VML)";
            return c && "object" === typeof c.adj
        } catch (b) {
            return !1
        }
    }();
    b.Path = b.Browser.svg || !b.Browser.vml ? b.Path : b.Path.extend({
        statics: {
            VML: !0,
            CLIP_PADDING: .02
        },
        _createElement: function() {
            try {
                return g.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"),
                    function(a) {
                        return g.createElement("<lvml:" + a + ' class="lvml">')
                    }
            } catch (a) {
                return function(a) {
                    return g.createElement("<" +
                        a + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')
                }
            }
        }(),
        _initPath: function() {
            var a = this._container = this._createElement("shape");
            b.DomUtil.addClass(a, "leaflet-vml-shape");
            this.options.clickable && b.DomUtil.addClass(a, "leaflet-clickable");
            a.coordsize = "1 1";
            this._path = this._createElement("path");
            a.appendChild(this._path);
            this._map._pathRoot.appendChild(a)
        },
        _initStyle: function() {
            this._updateStyle()
        },
        _updateStyle: function() {
            var a = this._stroke,
                c = this._fill,
                b = this.options,
                e = this._container;
            e.stroked =
                b.stroke;
            e.filled = b.fill;
            b.stroke ? (a || (a = this._stroke = this._createElement("stroke"), a.endcap = "round", e.appendChild(a)), a.weight = b.weight + "px", a.color = b.color, a.opacity = b.opacity, a.dashStyle = b.dashArray ? b.dashArray instanceof Array ? b.dashArray.join(" ") : b.dashArray.replace(/ *, */g, " ") : "") : a && (e.removeChild(a), this._stroke = null);
            b.fill ? (c || (c = this._fill = this._createElement("fill"), e.appendChild(c)), c.color = b.fillColor || b.color, c.opacity = b.fillOpacity) : c && (e.removeChild(c), this._fill = null)
        },
        _updatePath: function() {
            var a =
                this._container.style;
            a.display = "none";
            this._path.v = this.getPathString() + " ";
            a.display = ""
        }
    });
    b.Map.include(b.Browser.svg || !b.Browser.vml ? {} : {
        _initPathRoot: function() {
            if (!this._pathRoot) {
                var a = this._pathRoot = g.createElement("div");
                a.className = "leaflet-vml-container";
                this._panes.overlayPane.appendChild(a);
                this.on("moveend", this._updatePathViewport);
                this._updatePathViewport()
            }
        }
    });
    b.Browser.canvas = !!g.createElement("canvas").getContext;
    b.Path = b.Path.SVG && !f.L_PREFER_CANVAS || !b.Browser.canvas ? b.Path : b.Path.extend({
        statics: {
            CANVAS: !0,
            SVG: !1
        },
        redraw: function() {
            this._map && (this.projectLatlngs(), this._requestUpdate());
            return this
        },
        setStyle: function(a) {
            b.setOptions(this, a);
            this._map && (this._updateStyle(), this._requestUpdate());
            return this
        },
        onRemove: function(a) {
            a.off("viewreset", this.projectLatlngs, this).off("moveend", this._updatePath, this);
            this.options.clickable && this._map.off("click", this._onClick, this);
            this._requestUpdate();
            this._map = null
        },
        _requestUpdate: function() {
            this._map && !b.Path._updateRequest && (b.Path._updateRequest = b.Util.requestAnimFrame(this._fireMapMoveEnd,
                this._map))
        },
        _fireMapMoveEnd: function() {
            b.Path._updateRequest = null;
            this.fire("moveend")
        },
        _initElements: function() {
            this._map._initPathRoot();
            this._ctx = this._map._canvasCtx
        },
        _updateStyle: function() {
            var a = this.options;
            a.stroke && (this._ctx.lineWidth = a.weight, this._ctx.strokeStyle = a.color);
            a.fill && (this._ctx.fillStyle = a.fillColor || a.color)
        },
        _drawPath: function() {
            var a, c, d, e, h, f;
            this._ctx.beginPath();
            a = 0;
            for (d = this._parts.length; a < d; a++) {
                c = 0;
                for (e = this._parts[a].length; c < e; c++) h = this._parts[a][c], f = (0 ===
                    c ? "move" : "line") + "To", this._ctx[f](h.x, h.y);
                this instanceof b.Polygon && this._ctx.closePath()
            }
        },
        _checkIfEmpty: function() {
            return !this._parts.length
        },
        _updatePath: function() {
            if (!this._checkIfEmpty()) {
                var a = this._ctx,
                    c = this.options;
                this._drawPath();
                a.save();
                this._updateStyle();
                c.fill && (a.globalAlpha = c.fillOpacity, a.fill());
                c.stroke && (a.globalAlpha = c.opacity, a.stroke());
                a.restore()
            }
        },
        _initEvents: function() {
            if (this.options.clickable) this._map.on("click", this._onClick, this)
        },
        _onClick: function(a) {
            this._containsPoint(a.layerPoint) &&
                this.fire("click", {
                    latlng: a.latlng,
                    layerPoint: a.layerPoint,
                    containerPoint: a.containerPoint,
                    originalEvent: a
                })
        }
    });
    b.Map.include(b.Path.SVG && !f.L_PREFER_CANVAS || !b.Browser.canvas ? {} : {
        _initPathRoot: function() {
            var a = this._pathRoot,
                c;
            a || (a = this._pathRoot = g.createElement("canvas"), a.style.position = "absolute", c = this._canvasCtx = a.getContext("2d"), c.lineCap = "round", c.lineJoin = "round", this._panes.overlayPane.appendChild(a), this.options.zoomAnimation && (this._pathRoot.className = "leaflet-zoom-animated", this.on("zoomanim",
                this._animatePathZoom), this.on("zoomend", this._endPathZoom)), this.on("moveend", this._updateCanvasViewport), this._updateCanvasViewport())
        },
        _updateCanvasViewport: function() {
            if (!this._pathZooming) {
                this._updatePathViewport();
                var a = this._pathViewport,
                    c = a.min,
                    a = a.max.subtract(c),
                    d = this._pathRoot;
                b.DomUtil.setPosition(d, c);
                d.width = a.x;
                d.height = a.y;
                d.getContext("2d").translate(-c.x, -c.y)
            }
        }
    });
    b.LineUtil = {
        simplify: function(a, c) {
            if (!c || !a.length) return a.slice();
            var b = c * c;
            a = this._reducePoints(a, b);
            return a =
                this._simplifyDP(a, b)
        },
        pointToSegmentDistance: function(a, c, b) {
            return Math.sqrt(this._sqClosestPointOnSegment(a, c, b, !0))
        },
        closestPointOnSegment: function(a, c, b) {
            return this._sqClosestPointOnSegment(a, c, b)
        },
        _simplifyDP: function(a, c) {
            var b = a.length,
                e = new(typeof Uint8Array !== k + "" ? Uint8Array : Array)(b);
            e[0] = e[b - 1] = 1;
            this._simplifyDPStep(a, e, c, 0, b - 1);
            var h, f = [];
            for (h = 0; h < b; h++) e[h] && f.push(a[h]);
            return f
        },
        _simplifyDPStep: function(a, c, b, e, h) {
            var f = 0,
                g, l, k;
            for (l = e + 1; l <= h - 1; l++) k = this._sqClosestPointOnSegment(a[l],
                a[e], a[h], !0), k > f && (g = l, f = k);
            f > b && (c[g] = 1, this._simplifyDPStep(a, c, b, e, g), this._simplifyDPStep(a, c, b, g, h))
        },
        _reducePoints: function(a, c) {
            for (var b = [a[0]], e = 1, h = 0, f = a.length; e < f; e++) this._sqDist(a[e], a[h]) > c && (b.push(a[e]), h = e);
            h < f - 1 && b.push(a[f - 1]);
            return b
        },
        clipSegment: function(a, c, b, e) {
            e = e ? this._lastCode : this._getBitCode(a, b);
            var h = this._getBitCode(c, b),
                f, g, l;
            for (this._lastCode = h;;)
                if (e | h) {
                    if (e & h) return !1;
                    f = e || h;
                    g = this._getEdgeIntersection(a, c, f, b);
                    l = this._getBitCode(g, b);
                    f === e ? (a = g, e = l) : (c = g, h =
                        l)
                } else return [a, c]
        },
        _getEdgeIntersection: function(a, c, d, e) {
            var h = c.x - a.x;
            c = c.y - a.y;
            var f = e.min;
            e = e.max;
            if (d & 8) return new b.Point(a.x + h * (e.y - a.y) / c, e.y);
            if (d & 4) return new b.Point(a.x + h * (f.y - a.y) / c, f.y);
            if (d & 2) return new b.Point(e.x, a.y + c * (e.x - a.x) / h);
            if (d & 1) return new b.Point(f.x, a.y + c * (f.x - a.x) / h)
        },
        _getBitCode: function(a, c) {
            var b = 0;
            a.x < c.min.x ? b |= 1 : a.x > c.max.x && (b |= 2);
            a.y < c.min.y ? b |= 4 : a.y > c.max.y && (b |= 8);
            return b
        },
        _sqDist: function(a, c) {
            var b = c.x - a.x,
                e = c.y - a.y;
            return b * b + e * e
        },
        _sqClosestPointOnSegment: function(a,
            c, d, e) {
            var h = c.x;
            c = c.y;
            var f = d.x - h,
                g = d.y - c,
                l = f * f + g * g;
            0 < l && (l = ((a.x - h) * f + (a.y - c) * g) / l, 1 < l ? (h = d.x, c = d.y) : 0 < l && (h += f * l, c += g * l));
            f = a.x - h;
            g = a.y - c;
            return e ? f * f + g * g : new b.Point(h, c)
        }
    };
    b.Polyline = b.Path.extend({
        initialize: function(a, c) {
            b.Path.prototype.initialize.call(this, c);
            this._latlngs = this._convertLatLngs(a)
        },
        options: {
            smoothFactor: 1,
            noClip: !1
        },
        projectLatlngs: function() {
            this._originalPoints = [];
            for (var a = 0, c = this._latlngs.length; a < c; a++) this._originalPoints[a] = this._map.latLngToLayerPoint(this._latlngs[a])
        },
        getPathString: function() {
            for (var a = 0, c = this._parts.length, b = ""; a < c; a++) b += this._getPathPartStr(this._parts[a]);
            return b
        },
        getLatLngs: function() {
            return this._latlngs
        },
        setLatLngs: function(a) {
            this._latlngs = this._convertLatLngs(a);
            return this.redraw()
        },
        addLatLng: function(a) {
            this._latlngs.push(b.latLng(a));
            return this.redraw()
        },
        spliceLatLngs: function() {
            var a = [].splice.apply(this._latlngs, arguments);
            this._convertLatLngs(this._latlngs);
            this.redraw();
            return a
        },
        closestLayerPoint: function(a) {
            for (var c = Infinity,
                    d = this._parts, e, f, g = null, n = 0, l = d.length; n < l; n++)
                for (var k = d[n], m = 1, p = k.length; m < p; m++) {
                    e = k[m - 1];
                    f = k[m];
                    var r = b.LineUtil._sqClosestPointOnSegment(a, e, f, !0);
                    r < c && (c = r, g = b.LineUtil._sqClosestPointOnSegment(a, e, f))
                }
            g && (g.distance = Math.sqrt(c));
            return g
        },
        getBounds: function() {
            var a = new b.LatLngBounds,
                c = this.getLatLngs(),
                d, e;
            d = 0;
            for (e = c.length; d < e; d++) a.extend(c[d]);
            return a
        },
        _convertLatLngs: function(a) {
            var c, d;
            c = 0;
            for (d = a.length; c < d; c++) {
                if (b.Util.isArray(a[c]) && "number" !== typeof a[c][0]) return;
                a[c] = b.latLng(a[c])
            }
            return a
        },
        _initEvents: function() {
            b.Path.prototype._initEvents.call(this)
        },
        _getPathPartStr: function(a) {
            for (var c = b.Path.VML, d = 0, e = a.length, f = "", g; d < e; d++) g = a[d], c && g._round(), f += (d ? "L" : "M") + g.x + " " + g.y;
            return f
        },
        _clipPoints: function() {
            var a = this._originalPoints,
                c = a.length,
                d, e, f;
            if (this.options.noClip) this._parts = [a];
            else {
                var g = this._parts = [],
                    n = this._map._pathViewport,
                    l = b.LineUtil;
                for (e = d = 0; d < c - 1; d++)
                    if (f = l.clipSegment(a[d], a[d + 1], n, d))
                        if (g[e] = g[e] || [], g[e].push(f[0]), f[1] !== a[d + 1] || d === c - 2) g[e].push(f[1]), e++
            }
        },
        _simplifyPoints: function() {
            for (var a = this._parts, c = b.LineUtil, d = 0, e = a.length; d < e; d++) a[d] = c.simplify(a[d], this.options.smoothFactor)
        },
        _updatePath: function() {
            this._map && (this._clipPoints(), this._simplifyPoints(), b.Path.prototype._updatePath.call(this))
        }
    });
    b.polyline = function(a, c) {
        return new b.Polyline(a, c)
    };
    b.PolyUtil = {};
    b.PolyUtil.clipPolygon = function(a, c) {
        var d, e = [1, 4, 2, 8],
            f, g, n, l, k, m, p = b.LineUtil;
        f = 0;
        for (k = a.length; f < k; f++) a[f]._code = p._getBitCode(a[f], c);
        for (n = 0; 4 > n; n++) {
            m = e[n];
            d = [];
            f = 0;
            k = a.length;
            for (g = k - 1; f < k; g = f++)(l = a[f], g = a[g], l._code & m) ? g._code & m || (g = p._getEdgeIntersection(g, l, m, c), g._code = p._getBitCode(g, c), d.push(g)) : (g._code & m && (g = p._getEdgeIntersection(g, l, m, c), g._code = p._getBitCode(g, c), d.push(g)), d.push(l));
            a = d
        }
        return a
    };
    b.Polygon = b.Polyline.extend({
        options: {
            fill: !0
        },
        initialize: function(a, c) {
            b.Polyline.prototype.initialize.call(this, a, c);
            a && b.Util.isArray(a[0]) && "number" !== typeof a[0][0] && (this._latlngs = this._convertLatLngs(a[0]), this._holes = a.slice(1))
        },
        projectLatlngs: function() {
            b.Polyline.prototype.projectLatlngs.call(this);
            this._holePoints = [];
            if (this._holes) {
                var a, c, d, e;
                a = 0;
                for (d = this._holes.length; a < d; a++)
                    for (this._holePoints[a] = [], c = 0, e = this._holes[a].length; c < e; c++) this._holePoints[a][c] = this._map.latLngToLayerPoint(this._holes[a][c])
            }
        },
        _clipPoints: function() {
            var a = [];
            this._parts = [this._originalPoints].concat(this._holePoints);
            if (!this.options.noClip) {
                for (var c = 0, d = this._parts.length; c < d; c++) {
                    var e = b.PolyUtil.clipPolygon(this._parts[c], this._map._pathViewport);
                    e.length && a.push(e)
                }
                this._parts = a
            }
        },
        _getPathPartStr: function(a) {
            return b.Polyline.prototype._getPathPartStr.call(this,
                a) + (b.Browser.svg ? "z" : "x")
        }
    });
    b.polygon = function(a, c) {
        return new b.Polygon(a, c)
    };
    (function() {
        function a(a) {
            return b.FeatureGroup.extend({
                initialize: function(a, c) {
                    this._layers = {};
                    this._options = c;
                    this.setLatLngs(a)
                },
                setLatLngs: function(b) {
                    var e = 0,
                        f = b.length;
                    for (this.eachLayer(function(a) {
                            e < f ? a.setLatLngs(b[e++]) : this.removeLayer(a)
                        }, this); e < f;) this.addLayer(new a(b[e++], this._options));
                    return this
                }
            })
        }
        b.MultiPolyline = a(b.Polyline);
        b.MultiPolygon = a(b.Polygon);
        b.multiPolyline = function(a, d) {
            return new b.MultiPolyline(a,
                d)
        };
        b.multiPolygon = function(a, d) {
            return new b.MultiPolygon(a, d)
        }
    })();
    b.Rectangle = b.Polygon.extend({
        initialize: function(a, c) {
            b.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(a), c)
        },
        setBounds: function(a) {
            this.setLatLngs(this._boundsToLatLngs(a))
        },
        _boundsToLatLngs: function(a) {
            a = b.latLngBounds(a);
            return [a.getSouthWest(), a.getNorthWest(), a.getNorthEast(), a.getSouthEast()]
        }
    });
    b.rectangle = function(a, c) {
        return new b.Rectangle(a, c)
    };
    b.Circle = b.Path.extend({
        initialize: function(a, c, d) {
            b.Path.prototype.initialize.call(this,
                d);
            this._latlng = b.latLng(a);
            this._mRadius = c
        },
        options: {
            fill: !0
        },
        setLatLng: function(a) {
            this._latlng = b.latLng(a);
            return this.redraw()
        },
        setRadius: function(a) {
            this._mRadius = a;
            return this.redraw()
        },
        projectLatlngs: function() {
            var a = this._getLngRadius(),
                a = new b.LatLng(this._latlng.lat, this._latlng.lng - a),
                a = this._map.latLngToLayerPoint(a);
            this._point = this._map.latLngToLayerPoint(this._latlng);
            this._radius = Math.max(Math.round(this._point.x - a.x), 1)
        },
        getBounds: function() {
            var a = this._getLngRadius(),
                c = this._mRadius /
                40075017 * 360,
                d = this._latlng,
                e = new b.LatLng(d.lat - c, d.lng - a),
                a = new b.LatLng(d.lat + c, d.lng + a);
            return new b.LatLngBounds(e, a)
        },
        getLatLng: function() {
            return this._latlng
        },
        getPathString: function() {
            var a = this._point,
                c = this._radius;
            if (this._checkIfEmpty()) return "";
            if (b.Browser.svg) return "M" + a.x + "," + (a.y - c) + "A" + c + "," + c + ",0,1,1," + (a.x - .1) + "," + (a.y - c) + " z";
            a._round();
            c = Math.round(c);
            return "AL " + a.x + "," + a.y + " " + c + "," + c + " 0,23592600"
        },
        getRadius: function() {
            return this._mRadius
        },
        _getLatRadius: function() {
            return this._mRadius /
                40075017 * 360
        },
        _getLngRadius: function() {
            return this._getLatRadius() / Math.cos(b.LatLng.DEG_TO_RAD * this._latlng.lat)
        },
        _checkIfEmpty: function() {
            if (!this._map) return !1;
            var a = this._map._pathViewport,
                c = this._radius,
                b = this._point;
            return b.x - c > a.max.x || b.y - c > a.max.y || b.x + c < a.min.x || b.y + c < a.min.y
        }
    });
    b.circle = function(a, c, d) {
        return new b.Circle(a, c, d)
    };
    b.CircleMarker = b.Circle.extend({
        options: {
            radius: 10,
            weight: 2
        },
        initialize: function(a, c) {
            b.Circle.prototype.initialize.call(this, a, null, c);
            this._radius = this.options.radius
        },
        projectLatlngs: function() {
            this._point = this._map.latLngToLayerPoint(this._latlng)
        },
        _updateStyle: function() {
            b.Circle.prototype._updateStyle.call(this);
            this.setRadius(this.options.radius)
        },
        setRadius: function(a) {
            this.options.radius = this._radius = a;
            return this.redraw()
        }
    });
    b.circleMarker = function(a, c) {
        return new b.CircleMarker(a, c)
    };
    b.Polyline.include(b.Path.CANVAS ? {
        _containsPoint: function(a, c) {
            var d, e, f, g, n, l, k = this.options.weight / 2;
            b.Browser.touch && (k += 10);
            d = 0;
            for (g = this._parts.length; d < g; d++)
                for (l = this._parts[d],
                    e = 0, n = l.length, f = n - 1; e < n; f = e++)
                    if (c || 0 !== e)
                        if (f = b.LineUtil.pointToSegmentDistance(a, l[f], l[e]), f <= k) return !0;
            return !1
        }
    } : {});
    b.Polygon.include(b.Path.CANVAS ? {
        _containsPoint: function(a) {
            var c = !1,
                d, e, f, g, n, l, k;
            if (b.Polyline.prototype._containsPoint.call(this, a, !0)) return !0;
            g = 0;
            for (l = this._parts.length; g < l; g++)
                for (d = this._parts[g], n = 0, k = d.length, f = k - 1; n < k; f = n++) e = d[n], f = d[f], e.y > a.y !== f.y > a.y && a.x < (f.x - e.x) * (a.y - e.y) / (f.y - e.y) + e.x && (c = !c);
            return c
        }
    } : {});
    b.Circle.include(b.Path.CANVAS ? {
        _drawPath: function() {
            var a =
                this._point;
            this._ctx.beginPath();
            this._ctx.arc(a.x, a.y, this._radius, 0, 2 * Math.PI, !1)
        },
        _containsPoint: function(a) {
            var c = this.options.stroke ? this.options.weight / 2 : 0;
            return a.distanceTo(this._point) <= this._radius + c
        }
    } : {});
    b.GeoJSON = b.FeatureGroup.extend({
        initialize: function(a, c) {
            b.setOptions(this, c);
            this._layers = {};
            a && this.addData(a)
        },
        addData: function(a) {
            var c = b.Util.isArray(a) ? a : a.features,
                d;
            if (c) {
                a = 0;
                for (d = c.length; a < d; a++)(c[a].geometries || c[a].geometry || c[a].features) && this.addData(c[a]);
                return this
            }
            c =
                this.options;
            if (!c.filter || c.filter(a)) {
                d = b.GeoJSON.geometryToLayer(a, c.pointToLayer);
                d.feature = a;
                d.defaultOptions = d.options;
                this.resetStyle(d);
                if (c.onEachFeature) c.onEachFeature(a, d);
                return this.addLayer(d)
            }
        },
        resetStyle: function(a) {
            var c = this.options.style;
            c && (b.Util.extend(a.options, a.defaultOptions), this._setLayerStyle(a, c))
        },
        setStyle: function(a) {
            this.eachLayer(function(c) {
                this._setLayerStyle(c, a)
            }, this)
        },
        _setLayerStyle: function(a, c) {
            "function" === typeof c && (c = c(a.feature));
            a.setStyle && a.setStyle(c)
        }
    });
    b.extend(b.GeoJSON, {
        geometryToLayer: function(a, c) {
            var d = "Feature" === a.type ? a.geometry : a,
                e = d.coordinates,
                f = [],
                g, n, l;
            switch (d.type) {
                case "Point":
                    return d = this.coordsToLatLng(e), c ? c(a, d) : new b.Marker(d);
                case "MultiPoint":
                    g = 0;
                    for (n = e.length; g < n; g++) d = this.coordsToLatLng(e[g]), l = c ? c(a, d) : new b.Marker(d), f.push(l);
                    return new b.FeatureGroup(f);
                case "LineString":
                    return e = this.coordsToLatLngs(e), new b.Polyline(e);
                case "Polygon":
                    return e = this.coordsToLatLngs(e, 1), new b.Polygon(e);
                case "MultiLineString":
                    return e =
                        this.coordsToLatLngs(e, 1), new b.MultiPolyline(e);
                case "MultiPolygon":
                    return e = this.coordsToLatLngs(e, 2), new b.MultiPolygon(e);
                case "GeometryCollection":
                    g = 0;
                    for (n = d.geometries.length; g < n; g++) l = this.geometryToLayer({
                        geometry: d.geometries[g],
                        type: "Feature",
                        properties: a.properties
                    }, c), f.push(l);
                    return new b.FeatureGroup(f);
                default:
                    throw Error("Invalid GeoJSON object.");
            }
        },
        coordsToLatLng: function(a, c) {
            var d = parseFloat(a[c ? 0 : 1]),
                e = parseFloat(a[c ? 1 : 0]);
            return new b.LatLng(d, e)
        },
        coordsToLatLngs: function(a,
            c, b) {
            var e, f = [],
                g, n;
            g = 0;
            for (n = a.length; g < n; g++) e = c ? this.coordsToLatLngs(a[g], c - 1, b) : this.coordsToLatLng(a[g], b), f.push(e);
            return f
        }
    });
    b.geoJson = function(a, c) {
        return new b.GeoJSON(a, c)
    };
    b.DomEvent = {
        addListener: function(a, c, d, e) {
            var f = b.stamp(d),
                g = "_leaflet_" + c + f,
                n, l;
            if (a[g]) return this;
            n = function(c) {
                return d.call(e || a, c || b.DomEvent._getEvent())
            };
            if (b.Browser.msTouch && 0 === c.indexOf("touch")) return this.addMsTouchListener(a, c, n, f);
            b.Browser.touch && "dblclick" === c && this.addDoubleTapListener && this.addDoubleTapListener(a,
                n, f);
            "addEventListener" in a ? "mousewheel" === c ? (a.addEventListener("DOMMouseScroll", n, !1), a.addEventListener(c, n, !1)) : "mouseenter" === c || "mouseleave" === c ? (l = n, n = function(c) {
                if (b.DomEvent._checkMouse(a, c)) return l(c)
            }, a.addEventListener("mouseenter" === c ? "mouseover" : "mouseout", n, !1)) : a.addEventListener(c, n, !1) : "attachEvent" in a && a.attachEvent("on" + c, n);
            a[g] = n;
            return this
        },
        removeListener: function(a, c, d) {
            d = b.stamp(d);
            var e = "_leaflet_" + c + d,
                f = a[e];
            if (f) return b.Browser.msTouch && 0 === c.indexOf("touch") ? this.removeMsTouchListener(a,
                c, d) : b.Browser.touch && "dblclick" === c && this.removeDoubleTapListener ? this.removeDoubleTapListener(a, d) : "removeEventListener" in a ? "mousewheel" === c ? (a.removeEventListener("DOMMouseScroll", f, !1), a.removeEventListener(c, f, !1)) : "mouseenter" === c || "mouseleave" === c ? a.removeEventListener("mouseenter" === c ? "mouseover" : "mouseout", f, !1) : a.removeEventListener(c, f, !1) : "detachEvent" in a && a.detachEvent("on" + c, f), a[e] = null, this
        },
        stopPropagation: function(a) {
            a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0;
            return this
        },
        disableClickPropagation: function(a) {
            for (var c = b.DomEvent.stopPropagation, d = b.Draggable.START.length - 1; 0 <= d; d--) b.DomEvent.addListener(a, b.Draggable.START[d], c);
            return b.DomEvent.addListener(a, "click", c).addListener(a, "dblclick", c)
        },
        preventDefault: function(a) {
            a.preventDefault ? a.preventDefault() : a.returnValue = !1;
            return this
        },
        stop: function(a) {
            return b.DomEvent.preventDefault(a).stopPropagation(a)
        },
        getMousePosition: function(a, c) {
            var d = g.body,
                e = g.documentElement,
                d = new b.Point(a.pageX ? a.pageX : a.clientX +
                    d.scrollLeft + e.scrollLeft, a.pageY ? a.pageY : a.clientY + d.scrollTop + e.scrollTop);
            return c ? d._subtract(b.DomUtil.getViewportOffset(c)) : d
        },
        getWheelDelta: function(a) {
            var c = 0;
            a.wheelDelta && (c = a.wheelDelta / 120);
            a.detail && (c = -a.detail / 3);
            return c
        },
        _checkMouse: function(a, c) {
            var b = c.relatedTarget;
            if (!b) return !0;
            try {
                for (; b && b !== a;) b = b.parentNode
            } catch (e) {
                return !1
            }
            return b !== a
        },
        _getEvent: function() {
            var a = f.event;
            if (!a)
                for (var c = arguments.callee.caller; c && (!(a = c.arguments[0]) || f.Event !== a.constructor);) c = c.caller;
            return a
        }
    };
    b.DomEvent.on = b.DomEvent.addListener;
    b.DomEvent.off = b.DomEvent.removeListener;
    b.Draggable = b.Class.extend({
        includes: b.Mixin.Events,
        statics: {
            START: b.Browser.touch ? ["touchstart", "mousedown"] : ["mousedown"],
            END: {
                mousedown: "mouseup",
                touchstart: "touchend",
                MSPointerDown: "touchend"
            },
            MOVE: {
                mousedown: "mousemove",
                touchstart: "touchmove",
                MSPointerDown: "touchmove"
            },
            TAP_TOLERANCE: 15
        },
        initialize: function(a, c, d) {
            this._element = a;
            this._dragStartTarget = c || a;
            this._longPress = d && !b.Browser.msTouch
        },
        enable: function() {
            if (!this._enabled) {
                for (var a =
                        b.Draggable.START.length - 1; 0 <= a; a--) b.DomEvent.on(this._dragStartTarget, b.Draggable.START[a], this._onDown, this);
                this._enabled = !0
            }
        },
        disable: function() {
            if (this._enabled) {
                for (var a = b.Draggable.START.length - 1; 0 <= a; a--) b.DomEvent.off(this._dragStartTarget, b.Draggable.START[a], this._onDown, this);
                this._moved = this._enabled = !1
            }
        },
        _onDown: function(a) {
            if (!(!b.Browser.touch && a.shiftKey || 1 !== a.which && 1 !== a.button && !a.touches || (b.DomEvent.preventDefault(a), b.DomEvent.stopPropagation(a), b.Draggable._disabled)))
                if (this._simulateClick = !0, a.touches && 1 < a.touches.length) this._simulateClick = !1, clearTimeout(this._longPressTimeout);
                else {
                    var c = a.touches && 1 === a.touches.length ? a.touches[0] : a,
                        d = c.target;
                    b.Browser.touch && "a" === d.tagName.toLowerCase() && b.DomUtil.addClass(d, "leaflet-active");
                    this._moved = !1;
                    this._moving || (this._startPoint = new b.Point(c.clientX, c.clientY), this._startPos = this._newPos = b.DomUtil.getPosition(this._element), a.touches && 1 === a.touches.length && b.Browser.touch && this._longPress && (this._longPressTimeout = setTimeout(b.bind(function() {
                        (this._newPos &&
                            this._newPos.distanceTo(this._startPos) || 0) < b.Draggable.TAP_TOLERANCE && (this._simulateClick = !1, this._onUp(), this._simulateEvent("contextmenu", c))
                    }, this), 1E3)), b.DomEvent.on(g, b.Draggable.MOVE[a.type], this._onMove, this), b.DomEvent.on(g, b.Draggable.END[a.type], this._onUp, this))
                }
        },
        _onMove: function(a) {
            if (!(a.touches && 1 < a.touches.length)) {
                var c = a.touches && 1 === a.touches.length ? a.touches[0] : a,
                    c = (new b.Point(c.clientX, c.clientY)).subtract(this._startPoint);
                if (c.x || c.y) b.DomEvent.preventDefault(a), this._moved ||
                    (this.fire("dragstart"), this._moved = !0, this._startPos = b.DomUtil.getPosition(this._element).subtract(c), b.Browser.touch || (b.DomUtil.disableTextSelection(), this._setMovingCursor())), this._newPos = this._startPos.add(c), this._moving = !0, b.Util.cancelAnimFrame(this._animRequest), this._animRequest = b.Util.requestAnimFrame(this._updatePosition, this, !0, this._dragStartTarget)
            }
        },
        _updatePosition: function() {
            this.fire("predrag");
            b.DomUtil.setPosition(this._element, this._newPos);
            this.fire("drag")
        },
        _onUp: function(a) {
            var c;
            clearTimeout(this._longPressTimeout);
            if (this._simulateClick && a.changedTouches) {
                a = a.changedTouches[0];
                var d = a.target,
                    e = this._newPos && this._newPos.distanceTo(this._startPos) || 0;
                "a" === d.tagName.toLowerCase() && b.DomUtil.removeClass(d, "leaflet-active");
                e < b.Draggable.TAP_TOLERANCE && (c = a)
            }
            b.Browser.touch || (b.DomUtil.enableTextSelection(), this._restoreCursor());
            for (var f in b.Draggable.MOVE) b.Draggable.MOVE.hasOwnProperty(f) && (b.DomEvent.off(g, b.Draggable.MOVE[f], this._onMove), b.DomEvent.off(g, b.Draggable.END[f],
                this._onUp));
            this._moved && (b.Util.cancelAnimFrame(this._animRequest), this.fire("dragend"));
            this._moving = !1;
            c && (this._moved = !1, this._simulateEvent("click", c))
        },
        _setMovingCursor: function() {
            b.DomUtil.addClass(g.body, "leaflet-dragging")
        },
        _restoreCursor: function() {
            b.DomUtil.removeClass(g.body, "leaflet-dragging")
        },
        _simulateEvent: function(a, c) {
            var b = g.createEvent("MouseEvents");
            b.initMouseEvent(a, !0, !0, f, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null);
            c.target.dispatchEvent(b)
        }
    });
    b.Handler =
        b.Class.extend({
            initialize: function(a) {
                this._map = a
            },
            enable: function() {
                this._enabled || (this._enabled = !0, this.addHooks())
            },
            disable: function() {
                this._enabled && (this._enabled = !1, this.removeHooks())
            },
            enabled: function() {
                return !!this._enabled
            }
        });
    b.Map.mergeOptions({
        dragging: !0,
        inertia: !b.Browser.android23,
        inertiaDeceleration: 3400,
        inertiaMaxSpeed: Infinity,
        inertiaThreshold: b.Browser.touch ? 32 : 18,
        easeLinearity: .25,
        longPress: !0,
        worldCopyJump: !1
    });
    b.Map.Drag = b.Handler.extend({
        addHooks: function() {
            if (!this._draggable) {
                var a =
                    this._map;
                this._draggable = new b.Draggable(a._mapPane, a._container, a.options.longPress);
                this._draggable.on({
                    dragstart: this._onDragStart,
                    drag: this._onDrag,
                    dragend: this._onDragEnd
                }, this);
                a.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDrag, this), a.on("viewreset", this._onViewReset, this))
            }
            this._draggable.enable()
        },
        removeHooks: function() {
            this._draggable.disable()
        },
        moved: function() {
            return this._draggable && this._draggable._moved
        },
        _onDragStart: function() {
            var a = this._map;
            a._panAnim && a._panAnim.stop();
            a.fire("movestart").fire("dragstart");
            a.options.inertia && (this._positions = [], this._times = [])
        },
        _onDrag: function() {
            if (this._map.options.inertia) {
                var a = this._lastTime = +new Date,
                    c = this._lastPos = this._draggable._newPos;
                this._positions.push(c);
                this._times.push(a);
                200 < a - this._times[0] && (this._positions.shift(), this._times.shift())
            }
            this._map.fire("move").fire("drag")
        },
        _onViewReset: function() {
            var a = this._map.getSize()._divideBy(2);
            this._initialWorldOffset = this._map.latLngToLayerPoint(new b.LatLng(0, 0)).subtract(a).x;
            this._worldWidth = this._map.project(new b.LatLng(0, 180)).x
        },
        _onPreDrag: function() {
            var a = this._worldWidth,
                c = Math.round(a / 2),
                b = this._initialWorldOffset,
                e = this._draggable._newPos.x,
                f = (e - c + b) % a + c - b,
                a = (e + c + b) % a - c - b,
                b = Math.abs(f + b) < Math.abs(a + b) ? f : a;
            this._draggable._newPos.x = b
        },
        _onDragEnd: function() {
            var a = this._map,
                c = a.options,
                d = +new Date - this._lastTime;
            if (!c.inertia || d > c.inertiaThreshold || !this._positions[0]) a.fire("moveend");
            else {
                var e = this._lastPos.subtract(this._positions[0]),
                    f = c.easeLinearity,
                    e = e.multiplyBy(f /
                        ((this._lastTime + d - this._times[0]) / 1E3)),
                    g = e.distanceTo(new b.Point(0, 0)),
                    d = Math.min(c.inertiaMaxSpeed, g),
                    e = e.multiplyBy(d / g),
                    n = d / (c.inertiaDeceleration * f),
                    l = e.multiplyBy(-n / 2).round();
                b.Util.requestAnimFrame(function() {
                    a.panBy(l, n, f)
                })
            }
            a.fire("dragend");
            c.maxBounds && b.Util.requestAnimFrame(this._panInsideMaxBounds, a, !0, a._container)
        },
        _panInsideMaxBounds: function() {
            this.panInsideBounds(this.options.maxBounds)
        }
    });
    b.Map.addInitHook("addHandler", "dragging", b.Map.Drag);
    b.Map.mergeOptions({
        doubleClickZoom: !0
    });
    b.Map.DoubleClickZoom = b.Handler.extend({
        addHooks: function() {
            this._map.on("dblclick", this._onDoubleClick)
        },
        removeHooks: function() {
            this._map.off("dblclick", this._onDoubleClick)
        },
        _onDoubleClick: function(a) {
            this.setView(a.latlng, this._zoom + 1)
        }
    });
    b.Map.addInitHook("addHandler", "doubleClickZoom", b.Map.DoubleClickZoom);
    b.Map.mergeOptions({
        scrollWheelZoom: !0
    });
    b.Map.ScrollWheelZoom = b.Handler.extend({
        addHooks: function() {
            b.DomEvent.on(this._map._container, "mousewheel", this._onWheelScroll, this);
            this._delta =
                0
        },
        removeHooks: function() {
            b.DomEvent.off(this._map._container, "mousewheel", this._onWheelScroll)
        },
        _onWheelScroll: function(a) {
            var c = b.DomEvent.getWheelDelta(a);
            this._delta += c;
            this._lastMousePos = this._map.mouseEventToContainerPoint(a);
            this._startTime || (this._startTime = +new Date);
            c = Math.max(40 - (+new Date - this._startTime), 0);
            clearTimeout(this._timer);
            this._timer = setTimeout(b.bind(this._performZoom, this), c);
            b.DomEvent.preventDefault(a);
            b.DomEvent.stopPropagation(a)
        },
        _performZoom: function() {
            var a = this._map,
                b = this._delta,
                d = a.getZoom(),
                b = 0 < b ? Math.ceil(b) : Math.round(b),
                b = Math.max(Math.min(b, 4), -4),
                b = a._limitZoom(d + b) - d;
            this._delta = 0;
            this._startTime = null;
            b && (b = d + b, d = this._getCenterForScrollWheelZoom(b), a.setView(d, b))
        },
        _getCenterForScrollWheelZoom: function(a) {
            var b = this._map,
                d = b.getZoomScale(a);
            a = b.getSize()._divideBy(2);
            d = this._lastMousePos._subtract(a)._multiplyBy(1 - 1 / d);
            a = b._getTopLeftPoint()._add(a)._add(d);
            return b.unproject(a)
        }
    });
    b.Map.addInitHook("addHandler", "scrollWheelZoom", b.Map.ScrollWheelZoom);
    b.extend(b.DomEvent, {
        _touchstart: b.Browser.msTouch ? "MSPointerDown" : "touchstart",
        _touchend: b.Browser.msTouch ? "MSPointerUp" : "touchend",
        addDoubleTapListener: function(a, c, d) {
            function e(a) {
                var c;
                b.Browser.msTouch ? (p.push(a.pointerId), c = p.length) : c = a.touches.length;
                if (!(1 < c)) {
                    c = Date.now();
                    var d = c - (k || c);
                    l = a.touches ? a.touches[0] : a;
                    n = 0 < d && 250 >= d;
                    k = c
                }
            }

            function f(a) {
                if (b.Browser.msTouch) {
                    a = p.indexOf(a.pointerId);
                    if (-1 === a) return;
                    p.splice(a, 1)
                }
                if (n) {
                    if (b.Browser.msTouch) {
                        a = {};
                        var d, e;
                        for (e in l) d = l[e], a[e] =
                            "function" === typeof d ? d.bind(l) : d;
                        l = a
                    }
                    l.type = "dblclick";
                    c(l);
                    k = null
                }
            }
            var k, n = !1,
                l, m = this._touchstart,
                t = this._touchend,
                p = [];
            a["_leaflet_" + m + d] = e;
            a["_leaflet_" + t + d] = f;
            d = b.Browser.msTouch ? g.documentElement : a;
            a.addEventListener(m, e, !1);
            d.addEventListener(t, f, !1);
            b.Browser.msTouch && d.addEventListener("MSPointerCancel", f, !1);
            return this
        },
        removeDoubleTapListener: function(a, c) {
            a.removeEventListener(this._touchstart, a["_leaflet_" + this._touchstart + c], !1);
            (b.Browser.msTouch ? g.documentElement : a).removeEventListener(this._touchend,
                a["_leaflet_" + this._touchend + c], !1);
            b.Browser.msTouch && g.documentElement.removeEventListener("MSPointerCancel", a["_leaflet_" + this._touchend + c], !1);
            return this
        }
    });
    b.extend(b.DomEvent, {
        _msTouches: [],
        _msDocumentListener: !1,
        addMsTouchListener: function(a, b, d, e) {
            switch (b) {
                case "touchstart":
                    return this.addMsTouchListenerStart(a, b, d, e);
                case "touchend":
                    return this.addMsTouchListenerEnd(a, b, d, e);
                case "touchmove":
                    return this.addMsTouchListenerMove(a, b, d, e);
                default:
                    throw "Unknown touch event type";
            }
        },
        addMsTouchListenerStart: function(a,
            b, d, e) {
            var f = this._msTouches;
            b = function(a) {
                for (var b = !1, c = 0; c < f.length; c++)
                    if (f[c].pointerId === a.pointerId) {
                        b = !0;
                        break
                    }
                b || f.push(a);
                a.touches = f.slice();
                a.changedTouches = [a];
                d(a)
            };
            a["_leaflet_touchstart" + e] = b;
            a.addEventListener("MSPointerDown", b, !1);
            this._msDocumentListener || (a = function(a) {
                for (var b = 0; b < f.length; b++)
                    if (f[b].pointerId === a.pointerId) {
                        f.splice(b, 1);
                        break
                    }
            }, g.documentElement.addEventListener("MSPointerUp", a, !1), g.documentElement.addEventListener("MSPointerCancel", a, !1), this._msDocumentListener = !0);
            return this
        },
        addMsTouchListenerMove: function(a, b, d, e) {
            function f(a) {
                if (a.pointerType !== a.MSPOINTER_TYPE_MOUSE || 0 !== a.buttons) {
                    for (var b = 0; b < g.length; b++)
                        if (g[b].pointerId === a.pointerId) {
                            g[b] = a;
                            break
                        }
                    a.touches = g.slice();
                    a.changedTouches = [a];
                    d(a)
                }
            }
            var g = this._msTouches;
            a["_leaflet_touchmove" + e] = f;
            a.addEventListener("MSPointerMove", f, !1);
            return this
        },
        addMsTouchListenerEnd: function(a, b, d, e) {
            var f = this._msTouches;
            b = function(a) {
                for (var b = 0; b < f.length; b++)
                    if (f[b].pointerId === a.pointerId) {
                        f.splice(b,
                            1);
                        break
                    }
                a.touches = f.slice();
                a.changedTouches = [a];
                d(a)
            };
            a["_leaflet_touchend" + e] = b;
            a.addEventListener("MSPointerUp", b, !1);
            a.addEventListener("MSPointerCancel", b, !1);
            return this
        },
        removeMsTouchListener: function(a, b, d) {
            d = a["_leaflet_" + b + d];
            switch (b) {
                case "touchstart":
                    a.removeEventListener("MSPointerDown", d, !1);
                    break;
                case "touchmove":
                    a.removeEventListener("MSPointerMove", d, !1);
                    break;
                case "touchend":
                    a.removeEventListener("MSPointerUp", d, !1), a.removeEventListener("MSPointerCancel", d, !1)
            }
            return this
        }
    });
    b.Map.mergeOptions({
        touchZoom: b.Browser.touch && !b.Browser.android23
    });
    b.Map.TouchZoom = b.Handler.extend({
        addHooks: function() {
            b.DomEvent.on(this._map._container, "touchstart", this._onTouchStart, this)
        },
        removeHooks: function() {
            b.DomEvent.off(this._map._container, "touchstart", this._onTouchStart, this)
        },
        _onTouchStart: function(a) {
            var c = this._map;
            if (a.touches && 2 === a.touches.length && !c._animatingZoom && !this._zooming) {
                var d = c.mouseEventToLayerPoint(a.touches[0]),
                    e = c.mouseEventToLayerPoint(a.touches[1]),
                    f = c._getCenterLayerPoint();
                this._startCenter = d.add(e)._divideBy(2);
                this._startDist = d.distanceTo(e);
                this._moved = !1;
                this._zooming = !0;
                this._centerOffset = f.subtract(this._startCenter);
                c._panAnim && c._panAnim.stop();
                b.DomEvent.on(g, "touchmove", this._onTouchMove, this).on(g, "touchend", this._onTouchEnd, this);
                b.DomEvent.preventDefault(a)
            }
        },
        _onTouchMove: function(a) {
            if (a.touches && 2 === a.touches.length) {
                var c = this._map,
                    d = c.mouseEventToLayerPoint(a.touches[0]),
                    e = c.mouseEventToLayerPoint(a.touches[1]);
                this._scale = d.distanceTo(e) / this._startDist;
                this._delta = d._add(e)._divideBy(2)._subtract(this._startCenter);
                1 !== this._scale && (this._moved || (b.DomUtil.addClass(c._mapPane, "leaflet-zoom-anim leaflet-touching"), c.fire("movestart").fire("zoomstart")._prepareTileBg(), this._moved = !0), b.Util.cancelAnimFrame(this._animRequest), this._animRequest = b.Util.requestAnimFrame(this._updateOnMove, this, !0, this._map._container), b.DomEvent.preventDefault(a))
            }
        },
        _updateOnMove: function() {
            var a = this._map,
                c = this._getScaleOrigin(),
                c = a.layerPointToLatLng(c);
            a.fire("zoomanim", {
                center: c,
                zoom: a.getScaleZoom(this._scale)
            });
            a._tileBg.style[b.DomUtil.TRANSFORM] = b.DomUtil.getTranslateString(this._delta) + " " + b.DomUtil.getScaleString(this._scale, this._startCenter)
        },
        _onTouchEnd: function() {
            if (this._moved && this._zooming) {
                var a = this._map;
                this._zooming = !1;
                b.DomUtil.removeClass(a._mapPane, "leaflet-touching");
                b.DomEvent.off(g, "touchmove", this._onTouchMove).off(g, "touchend", this._onTouchEnd);
                var c = this._getScaleOrigin(),
                    d = a.layerPointToLatLng(c),
                    e = a.getZoom(),
                    f = a.getScaleZoom(this._scale) -
                    e,
                    f = 0 < f ? Math.ceil(f) : Math.floor(f),
                    e = a._limitZoom(e + f);
                a.fire("zoomanim", {
                    center: d,
                    zoom: e
                });
                a._runAnimation(d, e, a.getZoomScale(e) / this._scale, c, !0)
            }
        },
        _getScaleOrigin: function() {
            var a = this._centerOffset.subtract(this._delta).divideBy(this._scale);
            return this._startCenter.add(a)
        }
    });
    b.Map.addInitHook("addHandler", "touchZoom", b.Map.TouchZoom);
    b.Map.mergeOptions({
        boxZoom: !0
    });
    b.Map.BoxZoom = b.Handler.extend({
        initialize: function(a) {
            this._map = a;
            this._container = a._container;
            this._pane = a._panes.overlayPane
        },
        addHooks: function() {
            b.DomEvent.on(this._container, "mousedown", this._onMouseDown, this)
        },
        removeHooks: function() {
            b.DomEvent.off(this._container, "mousedown", this._onMouseDown)
        },
        _onMouseDown: function(a) {
            if (!a.shiftKey || 1 !== a.which && 1 !== a.button) return !1;
            b.DomUtil.disableTextSelection();
            this._startLayerPoint = this._map.mouseEventToLayerPoint(a);
            this._box = b.DomUtil.create("div", "leaflet-zoom-box", this._pane);
            b.DomUtil.setPosition(this._box, this._startLayerPoint);
            this._container.style.cursor = "crosshair";
            b.DomEvent.on(g,
                "mousemove", this._onMouseMove, this).on(g, "mouseup", this._onMouseUp, this).preventDefault(a);
            this._map.fire("boxzoomstart")
        },
        _onMouseMove: function(a) {
            var c = this._startLayerPoint,
                d = this._box,
                e = this._map.mouseEventToLayerPoint(a);
            a = e.subtract(c);
            c = new b.Point(Math.min(e.x, c.x), Math.min(e.y, c.y));
            b.DomUtil.setPosition(d, c);
            d.style.width = Math.max(0, Math.abs(a.x) - 4) + "px";
            d.style.height = Math.max(0, Math.abs(a.y) - 4) + "px"
        },
        _onMouseUp: function(a) {
            this._pane.removeChild(this._box);
            this._container.style.cursor =
                "";
            b.DomUtil.enableTextSelection();
            b.DomEvent.off(g, "mousemove", this._onMouseMove).off(g, "mouseup", this._onMouseUp);
            var c = this._map;
            a = c.mouseEventToLayerPoint(a);
            this._startLayerPoint.equals(a) || (a = new b.LatLngBounds(c.layerPointToLatLng(this._startLayerPoint), c.layerPointToLatLng(a)), c.fitBounds(a), c.fire("boxzoomend", {
                boxZoomBounds: a
            }))
        }
    });
    b.Map.addInitHook("addHandler", "boxZoom", b.Map.BoxZoom);
    b.Map.mergeOptions({
        keyboard: !0,
        keyboardPanOffset: 80,
        keyboardZoomOffset: 1
    });
    b.Map.Keyboard = b.Handler.extend({
        keyCodes: {
            left: [37],
            right: [39],
            down: [40],
            up: [38],
            zoomIn: [187, 107, 61],
            zoomOut: [189, 109, 173]
        },
        initialize: function(a) {
            this._map = a;
            this._setPanOffset(a.options.keyboardPanOffset);
            this._setZoomOffset(a.options.keyboardZoomOffset)
        },
        addHooks: function() {
            var a = this._map._container; - 1 === a.tabIndex && (a.tabIndex = "0");
            b.DomEvent.on(a, "focus", this._onFocus, this).on(a, "blur", this._onBlur, this).on(a, "mousedown", this._onMouseDown, this);
            this._map.on("focus", this._addHooks, this).on("blur", this._removeHooks, this)
        },
        removeHooks: function() {
            this._removeHooks();
            var a = this._map._container;
            b.DomEvent.off(a, "focus", this._onFocus, this).off(a, "blur", this._onBlur, this).off(a, "mousedown", this._onMouseDown, this);
            this._map.off("focus", this._addHooks, this).off("blur", this._removeHooks, this)
        },
        _onMouseDown: function() {
            this._focused || this._map._container.focus()
        },
        _onFocus: function() {
            this._focused = !0;
            this._map.fire("focus")
        },
        _onBlur: function() {
            this._focused = !1;
            this._map.fire("blur")
        },
        _setPanOffset: function(a) {
            var b = this._panKeys = {},
                d = this.keyCodes,
                e, f;
            e = 0;
            for (f = d.left.length; e <
                f; e++) b[d.left[e]] = [-1 * a, 0];
            e = 0;
            for (f = d.right.length; e < f; e++) b[d.right[e]] = [a, 0];
            e = 0;
            for (f = d.down.length; e < f; e++) b[d.down[e]] = [0, a];
            e = 0;
            for (f = d.up.length; e < f; e++) b[d.up[e]] = [0, -1 * a]
        },
        _setZoomOffset: function(a) {
            var b = this._zoomKeys = {},
                d = this.keyCodes,
                e, f;
            e = 0;
            for (f = d.zoomIn.length; e < f; e++) b[d.zoomIn[e]] = a;
            e = 0;
            for (f = d.zoomOut.length; e < f; e++) b[d.zoomOut[e]] = -a
        },
        _addHooks: function() {
            b.DomEvent.on(g, "keydown", this._onKeyDown, this)
        },
        _removeHooks: function() {
            b.DomEvent.off(g, "keydown", this._onKeyDown, this)
        },
        _onKeyDown: function(a) {
            var c = a.keyCode,
                d = this._map;
            if (this._panKeys.hasOwnProperty(c)) d.panBy(this._panKeys[c]), d.options.maxBounds && d.panInsideBounds(d.options.maxBounds);
            else if (this._zoomKeys.hasOwnProperty(c)) d.setZoom(d.getZoom() + this._zoomKeys[c]);
            else return;
            b.DomEvent.stop(a)
        }
    });
    b.Map.addInitHook("addHandler", "keyboard", b.Map.Keyboard);
    b.Handler.MarkerDrag = b.Handler.extend({
        initialize: function(a) {
            this._marker = a
        },
        addHooks: function() {
            var a = this._marker._icon;
            this._draggable || (this._draggable =
                (new b.Draggable(a, a)).on("dragstart", this._onDragStart, this).on("drag", this._onDrag, this).on("dragend", this._onDragEnd, this));
            this._draggable.enable()
        },
        removeHooks: function() {
            this._draggable.disable()
        },
        moved: function() {
            return this._draggable && this._draggable._moved
        },
        _onDragStart: function() {
            this._marker.closePopup().fire("movestart").fire("dragstart")
        },
        _onDrag: function() {
            var a = this._marker,
                c = a._shadow,
                d = b.DomUtil.getPosition(a._icon),
                e = a._map.layerPointToLatLng(d);
            c && b.DomUtil.setPosition(c, d);
            a._latlng =
                e;
            a.fire("move", {
                latlng: e
            }).fire("drag")
        },
        _onDragEnd: function() {
            this._marker.fire("moveend").fire("dragend")
        }
    });
    b.Handler.PolyEdit = b.Handler.extend({
        options: {
            icon: new b.DivIcon({
                iconSize: new b.Point(8, 8),
                className: "leaflet-div-icon leaflet-editing-icon"
            })
        },
        initialize: function(a, c) {
            this._poly = a;
            b.setOptions(this, c)
        },
        addHooks: function() {
            this._poly._map && (this._markerGroup || this._initMarkers(), this._poly._map.addLayer(this._markerGroup))
        },
        removeHooks: function() {
            this._poly._map && (this._poly._map.removeLayer(this._markerGroup),
                delete this._markerGroup, delete this._markers)
        },
        updateMarkers: function() {
            this._markerGroup.clearLayers();
            this._initMarkers()
        },
        _initMarkers: function() {
            this._markerGroup || (this._markerGroup = new b.LayerGroup);
            this._markers = [];
            var a = this._poly._latlngs,
                c, d, e;
            c = 0;
            for (d = a.length; c < d; c++) e = this._createMarker(a[c], c), e.on("click", this._onMarkerClick, this), this._markers.push(e);
            c = 0;
            for (a = d - 1; c < d; a = c++)
                if (0 !== c || b.Polygon && this._poly instanceof b.Polygon) a = this._markers[a], e = this._markers[c], this._createMiddleMarker(a,
                    e), this._updatePrevNext(a, e)
        },
        _createMarker: function(a, c) {
            var d = new b.Marker(a, {
                draggable: !0,
                icon: this.options.icon
            });
            d._origLatLng = a;
            d._index = c;
            d.on("drag", this._onMarkerDrag, this);
            d.on("dragend", this._fireEdit, this);
            this._markerGroup.addLayer(d);
            return d
        },
        _fireEdit: function() {
            this._poly.fire("edit")
        },
        _onMarkerDrag: function(a) {
            a = a.target;
            b.extend(a._origLatLng, a._latlng);
            a._middleLeft && a._middleLeft.setLatLng(this._getMiddleLatLng(a._prev, a));
            a._middleRight && a._middleRight.setLatLng(this._getMiddleLatLng(a,
                a._next));
            this._poly.redraw()
        },
        _onMarkerClick: function(a) {
            if (!(3 > this._poly._latlngs.length)) {
                a = a.target;
                var b = a._index;
                this._markerGroup.removeLayer(a);
                this._markers.splice(b, 1);
                this._poly.spliceLatLngs(b, 1);
                this._updateIndexes(b, -1);
                this._updatePrevNext(a._prev, a._next);
                a._middleLeft && this._markerGroup.removeLayer(a._middleLeft);
                a._middleRight && this._markerGroup.removeLayer(a._middleRight);
                a._prev && a._next ? this._createMiddleMarker(a._prev, a._next) : a._prev ? a._next || (a._prev._middleRight = null) : a._next._middleLeft =
                    null;
                this._poly.fire("edit")
            }
        },
        _updateIndexes: function(a, b) {
            this._markerGroup.eachLayer(function(d) {
                d._index > a && (d._index += b)
            })
        },
        _createMiddleMarker: function(a, b) {
            var d = this._getMiddleLatLng(a, b),
                e = this._createMarker(d),
                f, g, k;
            e.setOpacity(.6);
            a._middleRight = b._middleLeft = e;
            g = function() {
                var g = b._index;
                e._index = g;
                e.off("click", f).on("click", this._onMarkerClick, this);
                d.lat = e.getLatLng().lat;
                d.lng = e.getLatLng().lng;
                this._poly.spliceLatLngs(g, 0, d);
                this._markers.splice(g, 0, e);
                e.setOpacity(1);
                this._updateIndexes(g,
                    1);
                b._index++;
                this._updatePrevNext(a, e);
                this._updatePrevNext(e, b)
            };
            k = function() {
                e.off("dragstart", g, this);
                e.off("dragend", k, this);
                this._createMiddleMarker(a, e);
                this._createMiddleMarker(e, b)
            };
            f = function() {
                g.call(this);
                k.call(this);
                this._poly.fire("edit")
            };
            e.on("click", f, this).on("dragstart", g, this).on("dragend", k, this);
            this._markerGroup.addLayer(e)
        },
        _updatePrevNext: function(a, b) {
            a && (a._next = b);
            b && (b._prev = a)
        },
        _getMiddleLatLng: function(a, b) {
            var d = this._poly._map,
                e = d.latLngToLayerPoint(a.getLatLng()),
                f = d.latLngToLayerPoint(b.getLatLng());
            return d.layerPointToLatLng(e._add(f)._divideBy(2))
        }
    });
    b.Polyline.addInitHook(function() {
        b.Handler.PolyEdit && (this.editing = new b.Handler.PolyEdit(this), this.options.editable && this.editing.enable());
        this.on("add", function() {
            this.editing && this.editing.enabled() && this.editing.addHooks()
        });
        this.on("remove", function() {
            this.editing && this.editing.enabled() && this.editing.removeHooks()
        })
    });
    b.Control = b.Class.extend({
        options: {
            position: "topright"
        },
        initialize: function(a) {
            b.setOptions(this,
                a)
        },
        getPosition: function() {
            return this.options.position
        },
        setPosition: function(a) {
            var b = this._map;
            b && b.removeControl(this);
            this.options.position = a;
            b && b.addControl(this);
            return this
        },
        addTo: function(a) {
            this._map = a;
            var c = this._container = this.onAdd(a),
                d = this.getPosition();
            a = a._controlCorners[d];
            b.DomUtil.addClass(c, "leaflet-control"); - 1 !== d.indexOf("bottom") ? a.insertBefore(c, a.firstChild) : a.appendChild(c);
            return this
        },
        removeFrom: function(a) {
            var b = this.getPosition();
            a._controlCorners[b].removeChild(this._container);
            this._map = null;
            if (this.onRemove) this.onRemove(a);
            return this
        }
    });
    b.control = function(a) {
        return new b.Control(a)
    };
    b.Map.include({
        addControl: function(a) {
            a.addTo(this);
            return this
        },
        removeControl: function(a) {
            a.removeFrom(this);
            return this
        },
        _initControlPos: function() {
            function a(a, f) {
                c[a + f] = b.DomUtil.create("div", "leaflet-" + a + " leaflet-" + f, d)
            }
            var c = this._controlCorners = {},
                d = this._controlContainer = b.DomUtil.create("div", "leaflet-control-container", this._container);
            a("top", "left");
            a("top", "right");
            a("bottom",
                "left");
            a("bottom", "right")
        }
    });
    b.Control.Zoom = b.Control.extend({
        options: {
            position: "topleft"
        },
        onAdd: function(a) {
            var c = b.DomUtil.create("div", "leaflet-control-zoom leaflet-bar");
            this._map = a;
            this._zoomInButton = this._createButton("+", "Zoom in", "leaflet-control-zoom-in leaflet-bar-part leaflet-bar-part-top", c, this._zoomIn, this);
            this._zoomOutButton = this._createButton("-", "Zoom out", "leaflet-control-zoom-out leaflet-bar-part leaflet-bar-part-bottom", c, this._zoomOut, this);
            a.on("zoomend", this._updateDisabled,
                this);
            return c
        },
        onRemove: function(a) {
            a.off("zoomend", this._updateDisabled, this)
        },
        _zoomIn: function(a) {
            this._map.zoomIn(a.shiftKey ? 3 : 1)
        },
        _zoomOut: function(a) {
            this._map.zoomOut(a.shiftKey ? 3 : 1)
        },
        _createButton: function(a, c, d, e, f, g) {
            d = b.DomUtil.create("a", d, e);
            d.innerHTML = a;
            d.href = "#";
            d.title = c;
            a = b.DomEvent.stopPropagation;
            b.DomEvent.on(d, "click", a).on(d, "mousedown", a).on(d, "dblclick", a).on(d, "click", b.DomEvent.preventDefault).on(d, "click", f, g);
            return d
        },
        _updateDisabled: function() {
            var a = this._map;
            b.DomUtil.removeClass(this._zoomInButton,
                "leaflet-control-zoom-disabled");
            b.DomUtil.removeClass(this._zoomOutButton, "leaflet-control-zoom-disabled");
            a._zoom === a.getMinZoom() && b.DomUtil.addClass(this._zoomOutButton, "leaflet-control-zoom-disabled");
            a._zoom === a.getMaxZoom() && b.DomUtil.addClass(this._zoomInButton, "leaflet-control-zoom-disabled")
        }
    });
    b.Map.mergeOptions({
        zoomControl: !0
    });
    b.Map.addInitHook(function() {
        this.options.zoomControl && (this.zoomControl = new b.Control.Zoom, this.addControl(this.zoomControl))
    });
    b.control.zoom = function(a) {
        return new b.Control.Zoom(a)
    };
    b.Control.Attribution = b.Control.extend({
        options: {
            position: "bottomright",
            prefix: 'Powered by <a href="http://leafletjs.com">Leaflet</a>'
        },
        initialize: function(a) {
            b.setOptions(this, a);
            this._attributions = {}
        },
        onAdd: function(a) {
            this._container = b.DomUtil.create("div", "leaflet-control-attribution");
            b.DomEvent.disableClickPropagation(this._container);
            a.on("layeradd", this._onLayerAdd, this).on("layerremove", this._onLayerRemove, this);
            this._update();
            return this._container
        },
        onRemove: function(a) {
            a.off("layeradd",
                this._onLayerAdd).off("layerremove", this._onLayerRemove)
        },
        setPrefix: function(a) {
            this.options.prefix = a;
            this._update();
            return this
        },
        addAttribution: function(a) {
            if (a) return this._attributions[a] || (this._attributions[a] = 0), this._attributions[a] ++, this._update(), this
        },
        removeAttribution: function(a) {
            if (a) return this._attributions[a] --, this._update(), this
        },
        _update: function() {
            if (this._map) {
                var a = [],
                    b;
                for (b in this._attributions) this._attributions.hasOwnProperty(b) && this._attributions[b] && a.push(b);
                b = [];
                this.options.prefix &&
                    b.push(this.options.prefix);
                a.length && b.push(a.join(", "));
                this._container.innerHTML = b.join(" &#8212; ")
            }
        },
        _onLayerAdd: function(a) {
            a.layer.getAttribution && this.addAttribution(a.layer.getAttribution())
        },
        _onLayerRemove: function(a) {
            a.layer.getAttribution && this.removeAttribution(a.layer.getAttribution())
        }
    });
    b.Map.mergeOptions({
        attributionControl: !0
    });
    b.Map.addInitHook(function() {
        this.options.attributionControl && (this.attributionControl = (new b.Control.Attribution).addTo(this))
    });
    b.control.attribution =
        function(a) {
            return new b.Control.Attribution(a)
        };
    b.Control.Scale = b.Control.extend({
        options: {
            position: "bottomleft",
            maxWidth: 100,
            metric: !0,
            imperial: !0,
            updateWhenIdle: !1
        },
        onAdd: function(a) {
            this._map = a;
            var c = b.DomUtil.create("div", "leaflet-control-scale"),
                d = this.options;
            this._addScales(d, "leaflet-control-scale", c);
            a.on(d.updateWhenIdle ? "moveend" : "move", this._update, this);
            a.whenReady(this._update, this);
            return c
        },
        onRemove: function(a) {
            a.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this)
        },
        _addScales: function(a, c, d) {
            a.metric && (this._mScale = b.DomUtil.create("div", c + "-line", d));
            a.imperial && (this._iScale = b.DomUtil.create("div", c + "-line", d))
        },
        _update: function() {
            var a = this._map.getBounds(),
                b = a.getCenter().lat,
                a = 6378137 * Math.PI * Math.cos(b * Math.PI / 180) * (a.getNorthEast().lng - a.getSouthWest().lng) / 180,
                b = this._map.getSize(),
                d = this.options,
                e = 0;
            0 < b.x && (e = d.maxWidth / b.x * a);
            this._updateScales(d, e)
        },
        _updateScales: function(a, b) {
            a.metric && b && this._updateMetric(b);
            a.imperial && b && this._updateImperial(b)
        },
        _updateMetric: function(a) {
            var b = this._getRoundNum(a);
            this._mScale.style.width = this._getScaleWidth(b / a) + "px";
            this._mScale.innerHTML = 1E3 > b ? b + " m" : b / 1E3 + " km"
        },
        _updateImperial: function(a) {
            var b = 3.2808399 * a;
            a = this._iScale;
            var d;
            5280 < b ? (b /= 5280, d = this._getRoundNum(b), a.style.width = this._getScaleWidth(d / b) + "px", a.innerHTML = d + " mi") : (d = this._getRoundNum(b), a.style.width = this._getScaleWidth(d / b) + "px", a.innerHTML = d + " ft")
        },
        _getScaleWidth: function(a) {
            return Math.round(this.options.maxWidth * a) - 10
        },
        _getRoundNum: function(a) {
            var b =
                Math.pow(10, (Math.floor(a) + "").length - 1);
            a /= b;
            return b * (10 <= a ? 10 : 5 <= a ? 5 : 3 <= a ? 3 : 2 <= a ? 2 : 1)
        }
    });
    b.control.scale = function(a) {
        return new b.Control.Scale(a)
    };
    b.Control.Layers = b.Control.extend({
        options: {
            collapsed: !0,
            position: "topright",
            autoZIndex: !0
        },
        initialize: function(a, c, d) {
            b.setOptions(this, d);
            this._layers = {};
            this._lastZIndex = 0;
            this._handlingClick = !1;
            for (var e in a) a.hasOwnProperty(e) && this._addLayer(a[e], e);
            for (e in c) c.hasOwnProperty(e) && this._addLayer(c[e], e, !0)
        },
        onAdd: function(a) {
            this._initLayout();
            this._update();
            a.on("layeradd", this._onLayerChange, this).on("layerremove", this._onLayerChange, this);
            return this._container
        },
        onRemove: function(a) {
            a.off("layeradd", this._onLayerChange).off("layerremove", this._onLayerChange)
        },
        addBaseLayer: function(a, b) {
            this._addLayer(a, b);
            this._update();
            return this
        },
        addOverlay: function(a, b) {
            this._addLayer(a, b, !0);
            this._update();
            return this
        },
        removeLayer: function(a) {
            a = b.stamp(a);
            delete this._layers[a];
            this._update();
            return this
        },
        _initLayout: function() {
            var a = this._container =
                b.DomUtil.create("div", "leaflet-control-layers");
            if (b.Browser.touch) b.DomEvent.on(a, "click", b.DomEvent.stopPropagation);
            else b.DomEvent.disableClickPropagation(a), b.DomEvent.on(a, "mousewheel", b.DomEvent.stopPropagation);
            var c = this._form = b.DomUtil.create("form", "leaflet-control-layers-list");
            if (this.options.collapsed) {
                b.DomEvent.on(a, "mouseover", this._expand, this).on(a, "mouseout", this._collapse, this);
                var d = this._layersLink = b.DomUtil.create("a", "leaflet-control-layers-toggle", a);
                d.href = "#";
                d.title =
                    "Layers";
                if (b.Browser.touch) b.DomEvent.on(d, "click", b.DomEvent.stopPropagation).on(d, "click", b.DomEvent.preventDefault).on(d, "click", this._expand, this);
                else b.DomEvent.on(d, "focus", this._expand, this);
                this._map.on("movestart", this._collapse, this)
            } else this._expand();
            this._baseLayersList = b.DomUtil.create("div", "leaflet-control-layers-base", c);
            this._separator = b.DomUtil.create("div", "leaflet-control-layers-separator", c);
            this._overlaysList = b.DomUtil.create("div", "leaflet-control-layers-overlays", c);
            a.appendChild(c)
        },
        _addLayer: function(a, c, d) {
            var e = b.stamp(a);
            this._layers[e] = {
                layer: a,
                name: c,
                overlay: d
            };
            this.options.autoZIndex && a.setZIndex && (this._lastZIndex++, a.setZIndex(this._lastZIndex))
        },
        _update: function() {
            if (this._container) {
                this._baseLayersList.innerHTML = "";
                this._overlaysList.innerHTML = "";
                var a = !1,
                    b = !1,
                    d;
                for (d in this._layers)
                    if (this._layers.hasOwnProperty(d)) {
                        var e = this._layers[d];
                        this._addItem(e);
                        b = b || e.overlay;
                        a = a || !e.overlay
                    }
                this._separator.style.display = b && a ? "" : "none"
            }
        },
        _onLayerChange: function(a) {
            a = b.stamp(a.layer);
            this._layers[a] && !this._handlingClick && this._update()
        },
        _createRadioElement: function(a, b) {
            var d = '<input type="radio" class="leaflet-control-layers-selector" name="' + a + '"';
            b && (d += ' checked="checked"');
            var d = d + "/>",
                e = g.createElement("div");
            e.innerHTML = d;
            return e.firstChild
        },
        _addItem: function(a) {
            var c = g.createElement("label"),
                d, e = this._map.hasLayer(a.layer);
            a.overlay ? (d = g.createElement("input"), d.type = "checkbox", d.className = "leaflet-control-layers-selector", d.defaultChecked = e) : d = this._createRadioElement("leaflet-base-layers",
                e);
            d.layerId = b.stamp(a.layer);
            b.DomEvent.on(d, "click", this._onInputClick, this);
            e = g.createElement("span");
            e.innerHTML = " " + a.name;
            c.appendChild(d);
            c.appendChild(e);
            (a.overlay ? this._overlaysList : this._baseLayersList).appendChild(c);
            return c
        },
        _onInputClick: function() {
            var a, b, d, e = this._form.getElementsByTagName("input"),
                f = e.length,
                g;
            this._handlingClick = !0;
            for (a = 0; a < f; a++) b = e[a], d = this._layers[b.layerId], b.checked && !this._map.hasLayer(d.layer) ? (this._map.addLayer(d.layer), d.overlay || (g = d.layer)) : !b.checked &&
                this._map.hasLayer(d.layer) && this._map.removeLayer(d.layer);
            g && (this._map.setZoom(this._map.getZoom()), this._map.fire("baselayerchange", {
                layer: g
            }));
            this._handlingClick = !1
        },
        _expand: function() {
            b.DomUtil.addClass(this._container, "leaflet-control-layers-expanded")
        },
        _collapse: function() {
            this._container.className = this._container.className.replace(" leaflet-control-layers-expanded", "")
        }
    });
    b.control.layers = function(a, c, d) {
        return new b.Control.Layers(a, c, d)
    };
    b.PosAnimation = b.Class.extend({
        includes: b.Mixin.Events,
        run: function(a, c, d, e) {
            this.stop();
            this._el = a;
            this._inProgress = !0;
            this.fire("start");
            a.style[b.DomUtil.TRANSITION] = "all " + (d || .25) + "s cubic-bezier(0,0," + (e || .5) + ",1)";
            b.DomEvent.on(a, b.DomUtil.TRANSITION_END, this._onTransitionEnd, this);
            b.DomUtil.setPosition(a, c);
            b.Util.falseFn(a.offsetWidth);
            this._stepTimer = setInterval(b.bind(this.fire, this, "step"), 50)
        },
        stop: function() {
            this._inProgress && (b.DomUtil.setPosition(this._el, this._getPos()), this._onTransitionEnd(), b.Util.falseFn(this._el.offsetWidth))
        },
        _transformRe: /(-?[\d\.]+), (-?[\d\.]+)\)/,
        _getPos: function() {
            var a, c;
            c = f.getComputedStyle(this._el);
            b.Browser.any3d ? (c = c[b.DomUtil.TRANSFORM].match(this._transformRe), a = parseFloat(c[1]), c = parseFloat(c[2])) : (a = parseFloat(c.left), c = parseFloat(c.top));
            return new b.Point(a, c, !0)
        },
        _onTransitionEnd: function() {
            b.DomEvent.off(this._el, b.DomUtil.TRANSITION_END, this._onTransitionEnd, this);
            this._inProgress && (this._inProgress = !1, this._el.style[b.DomUtil.TRANSITION] = "", clearInterval(this._stepTimer), this.fire("step").fire("end"))
        }
    });
    b.Map.include({
        setView: function(a,
            b, d) {
            b = this._limitZoom(b);
            var e = this._zoom !== b;
            if (this._loaded && !d && this._layers && (this._panAnim && this._panAnim.stop(), e ? this._zoomToIfClose && this._zoomToIfClose(a, b) : this._panByIfClose(a))) return clearTimeout(this._sizeTimer), this;
            this._resetView(a, b);
            return this
        },
        panBy: function(a, c, d) {
            a = b.point(a);
            if (!a.x && !a.y) return this;
            this._panAnim || (this._panAnim = new b.PosAnimation, this._panAnim.on({
                step: this._onPanTransitionStep,
                end: this._onPanTransitionEnd
            }, this));
            this.fire("movestart");
            b.DomUtil.addClass(this._mapPane,
                "leaflet-pan-anim");
            a = b.DomUtil.getPosition(this._mapPane).subtract(a)._round();
            this._panAnim.run(this._mapPane, a, c || .25, d);
            return this
        },
        _onPanTransitionStep: function() {
            this.fire("move")
        },
        _onPanTransitionEnd: function() {
            b.DomUtil.removeClass(this._mapPane, "leaflet-pan-anim");
            this.fire("moveend")
        },
        _panByIfClose: function(a) {
            a = this._getCenterOffset(a)._floor();
            return this._offsetIsWithinView(a) ? (this.panBy(a), !0) : !1
        },
        _offsetIsWithinView: function(a, b) {
            var d = b || 1,
                e = this.getSize();
            return Math.abs(a.x) <=
                e.x * d && Math.abs(a.y) <= e.y * d
        }
    });
    b.PosAnimation = b.DomUtil.TRANSITION ? b.PosAnimation : b.PosAnimation.extend({
        run: function(a, c, d, e) {
            this.stop();
            this._el = a;
            this._inProgress = !0;
            this._duration = d || .25;
            this._easeOutPower = 1 / Math.max(e || .5, .2);
            this._startPos = b.DomUtil.getPosition(a);
            this._offset = c.subtract(this._startPos);
            this._startTime = +new Date;
            this.fire("start");
            this._animate()
        },
        stop: function() {
            this._inProgress && (this._step(), this._complete())
        },
        _animate: function() {
            this._animId = b.Util.requestAnimFrame(this._animate,
                this);
            this._step()
        },
        _step: function() {
            var a = +new Date - this._startTime,
                b = 1E3 * this._duration;
            a < b ? this._runFrame(this._easeOut(a / b)) : (this._runFrame(1), this._complete())
        },
        _runFrame: function(a) {
            a = this._startPos.add(this._offset.multiplyBy(a));
            b.DomUtil.setPosition(this._el, a);
            this.fire("step")
        },
        _complete: function() {
            b.Util.cancelAnimFrame(this._animId);
            this._inProgress = !1;
            this.fire("end")
        },
        _easeOut: function(a) {
            return 1 - Math.pow(1 - a, this._easeOutPower)
        }
    });
    b.Map.mergeOptions({
        zoomAnimation: b.DomUtil.TRANSITION &&
            !b.Browser.android23 && !b.Browser.mobileOpera
    });
    b.DomUtil.TRANSITION && b.Map.addInitHook(function() {
        b.DomEvent.on(this._mapPane, b.DomUtil.TRANSITION_END, this._catchTransitionEnd, this)
    });
    b.Map.include(b.DomUtil.TRANSITION ? {
        _zoomToIfClose: function(a, c) {
            if (this._animatingZoom) return !0;
            if (!this.options.zoomAnimation) return !1;
            var d = this.getZoomScale(c),
                e = this._getCenterOffset(a)._divideBy(1 - 1 / d);
            if (!this._offsetIsWithinView(e, 1)) return !1;
            b.DomUtil.addClass(this._mapPane, "leaflet-zoom-anim");
            this.fire("movestart").fire("zoomstart");
            this.fire("zoomanim", {
                center: a,
                zoom: c
            });
            e = this._getCenterLayerPoint().add(e);
            this._prepareTileBg();
            this._runAnimation(a, c, d, e);
            return !0
        },
        _catchTransitionEnd: function() {
            this._animatingZoom && this._onZoomTransitionEnd()
        },
        _runAnimation: function(a, c, d, e, f) {
            this._animateToCenter = a;
            this._animateToZoom = c;
            this._animatingZoom = !0;
            b.Draggable && (b.Draggable._disabled = !0);
            a = b.DomUtil.TRANSFORM;
            c = this._tileBg;
            clearTimeout(this._clearTileBgTimer);
            b.Util.falseFn(c.offsetWidth);
            d = b.DomUtil.getScaleString(d, e);
            e = c.style[a];
            c.style[a] = f ? e + " " + d : d + " " + e
        },
        _prepareTileBg: function() {
            var a = this._tilePane,
                c = this._tileBg;
            c && .5 < this._getLoadedTilesPercentage(c) && .5 > this._getLoadedTilesPercentage(a) ? (a.style.visibility = "hidden", a.empty = !0) : (c || (c = this._tileBg = this._createPane("leaflet-tile-pane", this._mapPane), c.style.zIndex = 1), c.style[b.DomUtil.TRANSFORM] = "", c.style.visibility = "hidden", c.empty = !0, a.empty = !1, this._tilePane = this._panes.tilePane = c, a = this._tileBg = a, b.DomUtil.addClass(a, "leaflet-zoom-animated"));
            this._stopLoadingImages(a)
        },
        _getLoadedTilesPercentage: function(a) {
            a = a.getElementsByTagName("img");
            var b, d, e = 0;
            b = 0;
            for (d = a.length; b < d; b++) a[b].complete && e++;
            return e / d
        },
        _stopLoadingImages: function(a) {
            a = Array.prototype.slice.call(a.getElementsByTagName("img"));
            var c, d, e;
            c = 0;
            for (d = a.length; c < d; c++) e = a[c], e.complete || (e.onload = b.Util.falseFn, e.onerror = b.Util.falseFn, e.src = b.Util.emptyImageUrl, e.parentNode.removeChild(e))
        },
        _onZoomTransitionEnd: function() {
            this._restoreTileFront();
            b.DomUtil.removeClass(this._mapPane, "leaflet-zoom-anim");
            b.Util.falseFn(this._tileBg.offsetWidth);
            this._animatingZoom = !1;
            this._resetView(this._animateToCenter, this._animateToZoom, !0, !0);
            b.Draggable && (b.Draggable._disabled = !1)
        },
        _restoreTileFront: function() {
            this._tilePane.innerHTML = "";
            this._tilePane.style.visibility = "";
            this._tilePane.style.zIndex = 2;
            this._tileBg.style.zIndex = 1
        },
        _clearTileBg: function() {
            this._animatingZoom || this.touchZoom._zooming || (this._tileBg.innerHTML = "")
        }
    } : {});
    b.Map.include({
        _defaultLocateOptions: {
            watch: !1,
            setView: !1,
            maxZoom: Infinity,
            timeout: 1E4,
            maximumAge: 0,
            enableHighAccuracy: !1
        },
        locate: function(a) {
            a = this._locationOptions = b.extend(this._defaultLocateOptions, a);
            if (!navigator.geolocation) return this._handleGeolocationError({
                code: 0,
                message: "Geolocation not supported."
            }), this;
            var c = b.bind(this._handleGeolocationResponse, this),
                d = b.bind(this._handleGeolocationError, this);
            a.watch ? this._locationWatchId = navigator.geolocation.watchPosition(c, d, a) : navigator.geolocation.getCurrentPosition(c, d, a);
            return this
        },
        stopLocate: function() {
            navigator.geolocation &&
                navigator.geolocation.clearWatch(this._locationWatchId);
            return this
        },
        _handleGeolocationError: function(a) {
            var b = a.code;
            a = a.message || (1 === b ? "permission denied" : 2 === b ? "position unavailable" : "timeout");
            this._locationOptions.setView && !this._loaded && this.fitWorld();
            this.fire("locationerror", {
                code: b,
                message: "Geolocation error: " + a + "."
            })
        },
        _handleGeolocationResponse: function(a) {
            var c = 180 * a.coords.accuracy / 4E7,
                d = 2 * c,
                e = a.coords.latitude,
                f = a.coords.longitude,
                g = new b.LatLng(e, f),
                k = new b.LatLng(e - c, f - d),
                c = new b.LatLng(e +
                    c, f + d),
                k = new b.LatLngBounds(k, c),
                c = this._locationOptions;
            c.setView && (c = Math.min(this.getBoundsZoom(k), c.maxZoom), this.setView(g, c));
            this.fire("locationfound", {
                latlng: g,
                bounds: k,
                accuracy: a.coords.accuracy
            })
        }
    })
})(this, document);
L.Point.prototype.distanceToSq = function(f) {
    f = L.point(f);
    var g = f.x - this.x;
    f = f.y - this.y;
    return g * g + f * f
};
L.LatLng.prototype.distanceToFlat = function(f) {
    f = L.latLng(f);
    var g = f.lat - this.lat;
    f = f.lng - this.lng;
    return Math.sqrt(g * g + f * f)
};
L.TileLayer.Limited = L.TileLayer.extend({
    _tileShouldBeLoaded: function(f) {
        if (!L.TileLayer.prototype._tileShouldBeLoaded.call(this, f)) return !1;
        if (this.options.tileLimits) {
            var g = this._getZoomForUrl();
            limit = this.options.tileLimits[g];
            void 0 === limit && (limit = Math.pow(2, g));
            return limit && 0 <= f.x && f.x < limit.x && 0 <= f.y && f.y < limit.y ? !0 : !1
        }
        return !0
    }
});
L.tileLayer.limited = function(f, g) {
    return new L.TileLayer.Limited(f, g)
};
L.CanvasLayer = L.Browser.canvas ? L.TileLayer.Canvas.extend({
        statics: {
            Images: {},
            Canvas: null
        },
        options: {
            autoRedraw: !0
        },
        setAutoRedraw: function(f) {
            this.options.autoRedraw = f
        },
        initialize: function(f) {
            L.Util.setOptions(this, f);
            this.layers = {};
            this.layerGrid = {};
            this._loadingImages = 0;
            this._dirtyLayerGrid = !1;
            L.CanvasLayer.Canvas || (f = document.createElement("canvas"), f.width = 32, f.height = 32, L.CanvasLayer.Canvas = f)
        },
        onAdd: function(f) {
            L.TileLayer.Canvas.prototype.onAdd.call(this, f);
            this._currentZoom = f.getZoom();
            f.on("viewreset",
                this.redraw, this);
            f.on("mousemove", this._mouseMove, this);
            f.on("click", this._mouseClick, this)
        },
        _mouseMove: function(f) {
            f = this._map.project(f.latlng);
            f = this._markerAtPoint(f);
            var g = this._map._container;
            !1 === f ? ("default" != g.style.cursor && (g.style.cursor = "default"), g.title && (g.title = ""), this._map && (this._map.clicksBlocked = !1)) : ("pointer" != g.style.cursor && (g.style.cursor = "pointer"), !g.title && f.options.title && (g.title = f.options.title), this._map && (this._map.clicksBlocked = !0))
        },
        _mouseClick: function(f) {
            if (!this._map.dragging ||
                !this._map.dragging.moved()) {
                var g = this._map.project(f.latlng),
                    g = this._markerAtPoint(g);
                !1 !== g && g.fire("click", {
                    originalEvent: f
                })
            }
        },
        _markerAtPoint: function(f) {
            var g = this.options.tileSize,
                g = L.point([Math.floor(f.x / g), Math.floor(f.y / g)]),
                g = this.layerGrid[g.x] ? this.layerGrid[g.x][g.y] ? this.layerGrid[g.x][g.y] : [] : [];
            if (0 == g.length) return !1;
            for (var k = g.length - 1; 0 <= k; --k)
                if (g[k].options.visible && g[k].options.clickable && g[k]._bounds.contains(f)) return g[k];
            return !1
        },
        addLayer: function(f) {
            if (!f instanceof L.Marker && !f instanceof L.Text) console.log("CanvasLayer: unsupported layer type added");
            else if (this._map) {
                var g = L.Util.stamp(f);
                f._canvasLayer = this;
                this.layers[g] = f;
                f.options.draggable || f.options.icon instanceof L.DivIcon ? this._map.addLayer(f) : (f.options.icon instanceof L.Icon && this._preloadImage(f.options.icon.options.iconUrl), this._addLayer(f));
                this.options.autoRedraw && this.redraw()
            } else console.log("CanvasLayer: not added to map before adding layers")
        },
        removeLayer: function(f) {
            var g = L.Util.stamp(f);
            delete this.layers[g];
            f.options.draggable || f.options.icon instanceof L.DivIcon ? this._map.removeLayer(f) : this._dirtyLayerGrid = !0;
            this.options.autoRedraw && this.redraw()
        },
        _setCanvasLayer: function(f, g) {
            f.options.icon instanceof L.DivIcon || (g && f._map ? (f._map.removeLayer(f), this.addLayer(f)) : g || (this._dirtyLayerGrid = !0, this._map.addLayer(f), this.options.autoRedraw && this.redraw()))
        },
        _rebuildLayerGrid: function() {
            this.layerGrid = {};
            for (var f in this.layers) this._addLayer(this.layers[f]);
            this._dirtyLayerGrid = !1
        },
        _addLayer: function(f) {
            if (!(f.options.draggable || f.options.icon instanceof L.DivIcon)) {
                var g = this.options.tileSize,
                    k = this._map.project(f.getLatLng()),
                    b = f.options.icon;
                if (b instanceof L.Icon) {
                    var m = L.point(b.options.iconSize),
                        b = b.options.iconAnchor ? L.point(b.options.iconAnchor) : L.point([m.x / 2, m.y / 2]);
                    f._bounds = L.bounds([
                        [k.x - b.x, k.y - b.y],
                        [k.x + (m.x - b.x), k.y + (m.y - b.y)]
                    ])
                } else if (b instanceof L.Text) {
                    m = L.CanvasLayer.Canvas.getContext("2d");
                    this._setContextFontStyle(m, b);
                    for (var a = b.options.text.split("\n"),
                            c = b._textWidth = 0; 2 > c; ++c) b._textWidth = Math.max(b._textWidth, m.measureText(b.options.text).width + 2 * b.options.outlineWidth);
                    m = Math.max(2, a.length);
                    f._bounds = L.bounds([
                        [k.x - b._textWidth / 2, k.y - (b.options.fontSize / 2 - 4) * m],
                        [k.x + b._textWidth / 2, k.y + (b.options.fontSize / 2 + 4) * m]
                    ])
                }
                if (1E-6 < f._bounds.min.distanceToSq(f._bounds.max))
                    for (k = L.point([Math.floor(f._bounds.min.x / g), Math.floor(f._bounds.min.y / g)]), g = L.point([Math.floor(f._bounds.max.x / g), Math.floor(f._bounds.max.y / g)]), m = k.y; m <= g.y; m++)
                        for (b = k.x; b <=
                            g.x; b++) this._addLayerToBucket(f, L.point([b, m]));
                else this._addLayerToBucket(f, L.point([Math.floor(k.x / g), Math.floor(k.y / g)]))
            }
        },
        _addLayerToBucket: function(f, g) {
            var k = this.layerGrid[g.x];
            k || (this.layerGrid[g.x] = {});
            (k = this.layerGrid[g.x][g.y]) || (k = this.layerGrid[g.x][g.y] = []);
            k.push(f)
        },
        _setContextFontStyle: function(f, g) {
            f.font = g.options.fontWeight + " " + g.options.fontSize + "px " + g.options.fontFamily;
            f.strokeStyle = g.options.outlineColor;
            f.miterLimit = 2;
            f.lineJoin = "round";
            console.log(g.options.text + ": " +
                f.font)
        },
        _drawText: function(f, g, k, b) {
            var m = b.options.icon;
            this._setContextFontStyle(f, m);
            f.textAlign = "center";
            f.textBaseline = "middle";
            var a = m.options.text.split("\n");
            1 < a.length ? (b = b._bounds.getSize().y / 4 + 1, f.lineWidth = m.options.outlineWidth, f.strokeText(a[0], g, k - b), f.lineWidth = 1, f.fillText(a[0], g, k - b), f.lineWidth = m.options.outlineWidth, f.strokeText(a[1], g, k + b), f.lineWidth = 1, f.fillText(a[1], g, k + b)) : (f.lineWidth = m.options.outlineWidth, f.strokeText(a[0], g, k), f.lineWidth = 1, f.fillText(a[0], g, k))
        },
        redraw: function(f) {
            if (0 <
                this._loadingImages) this._queuedDraw = !0;
            else {
                var g = this._map.getZoom();
                if (f || g != this._currentZoom || this._dirtyLayerGrid) this._rebuildLayerGrid(), this._currentZoom = g;
                L.TileLayer.Canvas.prototype.redraw.call(this)
            }
        },
        drawTile: function(f, g, k) {
            var b = this.options.tileSize,
                m = L.point([g.x * b, g.y * b]);
            f = f.getContext("2d");
            f.clearRect(0, 0, b, b);
            if (this._map.options.grid && this._map.options.grid[k]) {
                var a = this._map.options.grid;
                a.strokeStyle && (f.strokeStyle = a.strokeStyle);
                f.lineWidth = 1;
                var c = this._map.project(L.latLng([a[k],
                        0
                    ])).y,
                    d = Math.ceil(m.x / c) * c,
                    e = Math.ceil(m.y / c) * c,
                    h = b;
                if (a.limit) {
                    var q = this._map.project(L.latLng(a.limit)),
                        a = q.y,
                        q = q.x;
                    if (m.x + h <= a || m.y + b <= a || m.x >= q || m.y >= q) return;
                    m.x + h > q && (h = q - m.x);
                    m.y + b > q && (b = q - m.y)
                }
                d -= m.x;
                e -= m.y;
                for (f.beginPath(); d < h; d += c) f.moveTo(d + .5, -.5), f.lineTo(d + .5, b);
                for (; e < b; e += c) f.moveTo(-.5, e + .5), f.lineTo(h, e + .5);
                f.stroke();
                f.closePath()
            }
            if ((g = this.layerGrid[g.x] ? this.layerGrid[g.x][g.y] : []) && 0 != g.length)
                for (g.sort(function(a, b) {
                        var c = a._latlng.lat + a.options.zIndexOffset,
                            d = b._latlng.lat +
                            b.options.zIndexOffset;
                        return c > d ? 1 : c < d ? -1 : 0
                    }), c = g.length, e = 0; e < c; ++e)
                    if (h = g[e], h.getVisible())
                        if (d = h._bounds, b = h.options.icon, b instanceof L.Icon) {
                            if (a = this._getImage(b.options.iconUrl)) h = L.point(b.options.iconSize), b = (b = b.options.spriteOffset) ? L.point(b) : L.point(0, 0), f.drawImage(a, b.x, b.y, h.x, h.y, Math.floor(d.min.x - m.x), Math.floor(d.min.y - m.y), h.x, h.y)
                        } else !(b instanceof L.Text) || "light" == b.options.className && 4 > k || "" == b.options.className && 3 > k || (b = d.getCenter(), this._drawText(f, Math.floor(b.x - m.x),
                            Math.floor(b.y - m.y), h))
        },
        _preloadImage: function(f) {
            if (!L.CanvasLayer.Images[f]) {
                this._loadingImages++;
                var g = this,
                    k = new Image;
                k.onload = function() {
                    this._loaded = !0;
                    g._loadingImages--;
                    0 == g._loadingImages && g._queuedDraw && (g.redraw(), g._queuedDraw = !1)
                };
                k.onerror = function() {
                    g._loadingImages--;
                    0 == g._loadingImages && g._queuedDraw && (g.redraw(), g._queuedDraw = !1)
                };
                k.src = f;
                L.CanvasLayer.Images[f] = k
            }
        },
        _getImage: function(f) {
            var g = L.CanvasLayer.Images[f];
            if (g && g._loaded) return g;
            g || this._preloadImage(f);
            return !1
        }
    }) :
    L.LayerGroup.extend({
        redraw: function() {},
        setAutoRedraw: function() {},
        _setCanvasLayer: function(f, g) {}
    });
L.canvasLayer = function(f) {
    return new L.CanvasLayer(f)
};
L.Marker = L.Marker.extend({
    options: {
        visible: !0
    },
    setVisible: function(f) {
        this.options.visible != f && (f ? (this._icon && (this._icon.style.display = ""), this._shadow && (this._shadow.style.display = "")) : (this._icon && (this._icon.style.display = "none"), this._shadow && (this._shadow.style.display = "none")), this._canvasLayer && this._canvasLayer.options.autoRedraw && this._canvasLayer.redraw());
        this.options.visible = f
    },
    getVisible: function() {
        return this.options.visible
    },
    isVisible: function() {
        return this.getVisible()
    },
    setTitle: function(f) {
        this.options.title =
            f;
        this._icon && (this._icon.title = this.options.title)
    },
    setClickable: function(f) {
        this.options.clickable = f;
        if (this._icon)
            if (f) L.DomUtil.hasClass(this._icon, "leaflet-clickable") || this._initInteraction();
            else {
                L.DomUtil.removeClass(this._icon, "leaflet-clickable");
                L.DomEvent.removeListener(this._icon, "click", this._onMouseClick);
                f = ["dblclick", "mousedown", "mouseover", "mouseout"];
                for (var g = 0; g < f.length; g++) L.DomEvent.removeListener(this._icon, f[g], this._fireMouseEvent)
            }
    },
    setDraggable: function(f) {
        this.options.draggable =
            f;
        this._canvasLayer && this._canvasLayer._setCanvasLayer(this, !f);
        f ? this.dragging.enable() : this.dragging.disable()
    },
    setHtml: function(f) {
        this.options.icon instanceof L.DivIcon && (this._icon.innerHTML = this.options.html = f)
    },
    setClassName: function(f) {
        this.options.icon instanceof L.DivIcon && (this._icon.className = this.options.className = "leaflet-marker-icon leaflet-zoom-hide " + f)
    }
});
L.Text = L.Class.extend({
    options: {
        outlineColor: "#fff",
        outlineWidth: 1,
        fontColor: "#000",
        fontSize: 16,
        fontWeight: "lighter",
        fontFamily: "'Luacris Console', monospace",
        className: "",
        text: "",
        visible: !0
    },
    initialize: function(f) {
        if (f.className) switch (f.className) {
            case "light":
                f.fontSize = f.fontSize || 14;
                f.fontWeight = f.fontWeight || "normal";
                break;
            case "medium":
                f.fontSize = f.fontSize || 18;
                f.fontWeight = f.fontWeight || "bold";
                break;
            case "heavy":
                f.fontSize = f.fontSize || 20, f.fontWeight = f.fontWeight || "bolder"
        }
        L.setOptions(this, f)
    },
    setVisible: function(f) {
        this.options.visible = f
    },
    getVisible: function() {
        return this.options.visible
    }
});
L.text = function(f) {
    if (L.Browser.canvas) return f.text = f.text.replace(/(.+)\/\/(.+)$/, "$1\n$2"), new L.Text(f);
    var g = f.text.replace(/(.+)\/\/(.+)$/, "$1<br><small>$2</small>");
    return L.divIcon({
        iconSize: null,
        className: "map-label " + f.className,
        html: "<span>" + g + "</span>"
    })
};

L.Icon = L.Icon.extend({
    options: {},
    _createImg: function(f) {
        var g;
        if (this.options.spriteOffset) {
            var k = L.point(this.options.spriteOffset);
            g = document.createElement("div");
            g.style.backgroundImage = 'url("' + f + '")';
            g.style.backgroundPosition = "-" + k.x + "px -" + k.y + "px"
        } else L.Browser.ie6 ? (g = document.createElement("div"), g.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + f + '")') : (g = document.createElement("img"), g.src = f);
        return g
    }
});