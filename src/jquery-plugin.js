/*
 * jquery-plugin
 * https://github.com/amazingSurge/jquery-plugin
 *
 * Copyright (c) 2013 joeylin
 * Licensed under the MIT license.
 */

(function($, document, window, undefined) {
    // Optional, but considered best practice by some
    "use strict";

    var pluginName = 'plugin',
        defaults = {
            namespace: 'yourCustomNamespace',
            skin: null,

            // callback
            onInit: null,
            onReady: null
        };

    var Plugin = $[pluginName] = function(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, defaults, options, this.$element.data());

        this._plugin = pluginName;
        this.namespace = this.options.namespace;

        this.classes = {
            // status
            skin: this.namespace + '_' + this.options.skin,
            disabled: this.namespace + '_disabled',

            // components --for example
            wrapper: this.namespace + '-wrapper'
        };

        this.$element.addClass(this.namespace);

        // flag
        this.disabled = false;
        this.initialized = false;

        this._trigger('init');
        this.init();
    };

    Plugin.prototype = {
        constructor: Plugin,
        init: function() {
            this._createHtml();
            this._bindEvent();

            // skin : excuting after all elements are generated
            if (!this.options.skin) {
                // add skin to wrapper
                this.$element.addClass(this.classes.skin);
            }

            // set initialized value
            // ...

            this.initialized = true;
            // after init end trigger 'ready'
            this._trigger('ready');
        },
        _bindEvent: function() {},
        _createHtml: function() {},

        // some method
        // .....
        // some method

        _trigger: function(eventType) {
            // event
            this.$element.trigger(pluginName + '::' + eventType, this);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },

        /* Public functions */
        update: function(data) {
            // reload comfig
            // render again
            this._trigger('update');
        },

        enable: function() {
            this.disabled = false;

            // which element is up to your requirement
            this.$element.removeClass(this.classes.disabled);

            // here maybe have some events detached
        },
        disable: function() {
            this.disabled = true;
            // which element is up to your requirement
            // .disabled { pointer-events: none; } NO SUPPORT IE11 BELOW
            this.$element.addClass(this.classes.disabled);

            // here maybe have some events attached
        },
        destory: function() {
            // detached events first
            // then remove all js generated html
            this.$element.data(pluginName, null);
            this._trigger('destory');
        }
    };

    Plugin.defaults = defaults;

    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(getTabs)$/.test(method)) || (method === 'val' && method_arguments === undefined)) {
                var api = this.first().data(pluginName);
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, pluginName);
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, options));
                }
            });
        }
    };
})(jQuery, document, window);