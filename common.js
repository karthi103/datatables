(function($) {
    var messages = {};

    $.getMessages = function() {
        $('span.springMessage').each(function() {
            var id = $(this).attr('id');
            if (id) {
                messages[id] = $(this).text();
            }
        });
        return messages;
    };
    $.getMessage = function(key, args) {
        if (!messages[key]) {
            $.getMessages();
        }
        var message = messages[key];
        if (message && args && args.length > 0) {
            $(args).each(function(index, element) {
                message = message.replace('{' + index + '}', element);
            });
        }
        return message;
    };

    $.Clazz = {
        create: function(methods) {
            function klass() {
                this.initialize.apply(this, arguments);
            }

            $.each($.extend({initialize: $.noop}, methods), function(i, v) {
                klass.prototype[i] = v
            });

            return klass;
        }
    };

}(jQuery));

/* Content Slider Plugin
 * Plugin for sliding content
 * Author: Zachary Forrest & Timo Kissing
 * Last Updated: 6/16/2011
 * Verified: Unit Tests: null, jsLint: null
 */

(function( $ ) {

    $.fn.contentSlider = function( method ) {

        $.fn.contentSlider.defaults = {
            sliderCls: ".slider",
            slideCls: ".content-slide",
            prevLink: "prev-link",
            nextLink: "next-link"
        };

        var opts = {},
            methods = {};

        methods = {

            init : function( options ) {

                opts = $.extend( {}, $.fn.contentSlider.defaults, options );

                return this.each( function() {

                    $( this )
                        .find( opts.slideCls )
                        .hide()
                        .first()
                        .show();

                    $( this )
                        .find( "." + opts.prevLink)
                        .add( $(this).find("." + opts.nextLink ) )
                        .click( function() {
                            helpers.slide( $( this ) );
                        } );

                } );

            }

        };

        var helpers = {

            slide: function( obj ) {

                var cls = opts.slideCls,
                    back = obj.hasClass( opts.prevLink ),
                    current = $( opts.sliderCls ).find( cls ).filter( ":visible" ),
                    next;

                if ( back ) {
                    next = current.prevAll( cls ).first();
                    if ( next.length == 0 ) {
                        next = current.nextAll( cls ).last();
                    }
                } else {
                    next = current.nextAll( cls ).first();
                    if ( next.length == 0 ) {
                        next = current.prevAll( cls ).last();
                    }
                }
                if ( next.length ) {
                    if ( $.support.opacity ) {
                        next.css( { "opacity" : 0 } ).fadeTo( 500, 1 );
                    } else {
                        next.show();
                    }
                    current.hide();
                }

            }

        };

        if ( methods[ method ] ) {

            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );

        } else if ( typeof method === "object" || !method ) {

            return methods.init.apply( this, arguments );

        } else {

            $.error( "Method '" +  method + "' does not exist in pluginName plugin!" );

        }

    };

}( jQuery ) );

/* previewEmail Plugin
 * Plugin for preview email templates
 * Author: Zachary Forrest
 */

/*jslint browser: true, eqeq: true, es5: false, regexp: true, sloppy: true, unparam: true, white: true, indent: 4, maxerr: 100 */
/*global jQuery: true, Modernizr: true */

(function($) {

    $.previewEmail = function(method) {
        var plugin = {name: "previewEmail", version: "1.0.0"},
            isIE7 = $.browser.msie && $.browser.version.match( /^7\./ ) && typeof document.documentMode == 'undefined',
            methods, helpers;

        helpers = {

            getPreview: function(opts) {

                var previewUrl = $("#emailPreview").data("preview-url"),
                    previewLoading = $("#emailPreview").data("preview-loading"),
                    previewError = $("#emailPreview").data("preview-error"),
                    scrollDiv = $("<div class='table-scroll'></div>"),
                    fields = ($("#emailPreview").data("preview-fields") || "customText").split(','),
                    i, field;
                
                //append all fields to the and their encoded values
                for(i = 0; i < fields.length; ++i) {
                    field = fields[i];
                    previewUrl += "&" + encodeURIComponent(field) + "=" + encodeURIComponent($("#" + field).val());
                }

                $("#previewBody").html("<p><img src='/images/spinner.gif' alt='" + previewLoading + "'></p>");

                $.get(previewUrl, function(data) {
                    $("#previewBody").html(data);
                    $("#previewBody .spacer:first").html("");
                    $("#previewBody a")
                        .attr("href", "#nolink")
                        .click(function() {
                            return false;
                        });

                    if (isIE7) {
                        var logoImage = $("#emailPreview").data("logo-image"),
                            themeImage = $("#emailPreview").data("theme-image");

                        $("#emailPreview img:first").attr("src", logoImage);
                        $("#emailPreview img:last").attr("src", themeImage);
                    }
                })
                .error(function(data) {
                    if (!data.status) {
                        //usually this would contain the http status code (e.g. 200)
                        //when the user is logged out in CAS, this variable is empty
                        //this is probably because it does not follow 302 to the CAS
                        //thus we simply the reload web page itself to be sent there
                        window.location.reload();
                    } else {
                        $("#previewBody").html(previewError);
                    }
                });

                $("#previewBody").wrap(scrollDiv);
            }

        };

        methods = {

            init: function(options) {

                var opts = $.extend({}, $.previewEmail.defaults, options);

                $( "a.modal-trigger[href^='#']" )
                    .modalWindow()
                    .click(function() {
                        helpers.getPreview(opts);
                    });

                $( "#emailPreview" )
                    .dialog("option", "width", 683)
                    .dialog("option", "height", 800);

            }

        };

        /* No need to change anything below here */

        if (typeof methods[method] == 'function') {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error($.tmpl(
                    "Method {{= method}} does not exist in plugin {{= name}} {{= version}}",
                    $.extend({method: method}, plugin)
                ).text()
            );
        }
    };
}(jQuery) );



(function (factory) {
    
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('tablist', ['jquery', 'web-library'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    $('textarea').each(function() {
        if (!$(this).attr("maxlength")) $(this).attr("maxlength", 2048);
    });


    $( ".tab-list" ).tabList();

    $( ".more-info" ).stationaryTip();
   
    jQuery( '#storage-widget .more-info' ).click( function( e ) {
        e.preventDefault();
    } )

    jQuery( ".error-banner" ).animateMessage();

    jQuery( ".confirmation-banner" ).not( ".deferShow" ).animateMessage("sheet");
}));

(function($) {
    window.toggleCheckBoxes = function(on, cls) {
        var $boxes = $("input[type='checkbox']").not(':disabled');
        if (cls) $boxes = $boxes.filter('.' + cls);
        return $boxes.each(function(){
           this.checked = on;
        });
    };

    $.fn.values = function() {
        var v = [];
        $(this).filter('input:checked').each(function() {
           v.push($(this).val());
        });
        return v;
    };
});

