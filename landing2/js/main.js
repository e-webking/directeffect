'use strict';

var MAIN = {};
(function(context){
	$(document).ready(function() {

		if (!!navigator.userAgent.match(/Trident\/7\./) || $.browser.msie) {  		
  			var is_ie = true;  
		}
		else {
			var is_ie = false;
		}

		var scroll_frame = ($.browser.mozilla || is_ie ) ? "html" : "body";


		var navigation = responsiveNav(".nav-collapse", {
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
		});

		// Animate Header
		var is_compact = false;
		var $site_header = $(".site-header");
		// debugger

		var is_home = ($(".html-body--home").size() > 0 || $(".html-body--deepzoom").size() > 0);

		if (!is_home) {

			$("body").everyTime(250, function() {
				var scrolltop = $(scroll_frame).scrollTop();
				var should_be_compact = (scrolltop > 1);
				var make_compact = (should_be_compact && !is_compact);
				var remove_compact = (!should_be_compact && !is_compact);

				if (make_compact) {
					$site_header.addClass("site-header--compact");
					foresight.reload;					
				}
				else if (remove_compact) {
					$site_header.removeClass("site-header--compact");
					foresight.reload;					
				}
			});
			
		}

		_spanify_ctcs();

		if ($(".silverlight-container").size() <= 0) {
			$("body").fitVids();	
		}

	});

	function _spanify_ctcs() {
		// FROM: http://stackoverflow.com/questions/1501007/how-can-i-use-jquery-to-style-parts-of-all-instances-of-a-specific-word/1501213#1501213

		// Find text in descendents of an element, in reverse document order
		// pattern must be a regexp with global flag
		//
		function findText(element, pattern, callback) {
		    for (var childi= element.childNodes.length; childi-->0;) {
		        var child= element.childNodes[childi];
		        if (child.nodeType==1) {
		            findText(child, pattern, callback);
		        } else if (child.nodeType==3) {
		            var matches= [];
		            var match;
		            while (match= pattern.exec(child.data))
		                matches.push(match);
		            for (var i= matches.length; i-->0;)
		                callback.call(window, child, matches[i]);
		        }
		    }
		}

		findText(document.body, /ctcs/gi, function(node, match) {
			var end_text_node = node.splitText(match.index + match[0].length);
			var s_text_node = node.splitText(match.index + 3);

			var span = document.createElement('span');
			span.className = 'ctcs_lowercase';
			span.appendChild( s_text_node );
			node.parentNode.insertBefore(span, node.nextSibling);
		});
	}
})(MAIN);

var SILVERLIGHT = {};
(function(context){

	context.init = function() {
		$(document).ready(function() {
			var $silverlight_container = $(".silverlight-container");
			if ($silverlight_container.length > 0) {
				// Start timer
				_on_silverlight_timer();
				$(document).everyTime(500, 'silverlight timer', _on_silverlight_timer);
			}
		});
	}

	function _on_silverlight_timer() {
		var $site_header = $('.site-header');
		var $site_footer = $('.site-footer');
		var $silverlight_container = $(".silverlight-container");

		var header_height = $site_header.outerHeight();
		var footer_height = $site_footer.outerHeight();
		var window_height = $(window).height();

		var new_height = Math.max(0, window_height - header_height - footer_height);

		$silverlight_container.outerHeight( new_height );
	}

})(SILVERLIGHT);
SILVERLIGHT.init();

var WHAT_WE_DO = {};
(function(context){

	if (!!navigator.userAgent.match(/Trident\/7\./) || $.browser.msie) {  		
			var is_ie = true;  
	}
	else {
		var is_ie = false;
	}

	var scroll_frame = ($.browser.mozilla || is_ie ) ? "html" : "body";

	var current_slide = 0;
	var original_bubbles_top;

	context.init = function() {
		$(document).ready(function() {
			var $blur_targets = $(".js-blur-target");
			if ($blur_targets.length > 0) {
				$blur_targets.click(_on_bubble_click);

				var $bubbles = $('.bubbles');
				original_bubbles_top = $bubbles.offset().top;

				// Start timer
				_on_navigation_timer();
				$(document).everyTime(100, 'navigation timer', _on_navigation_timer);
			}
		
			$(".arrow").click(_on_arrow_click);
			$('.arrow-nav--previous').fadeTo( 0, 0.5 );
		});
	}

	function _on_bubble_click(event) {
		event.preventDefault();

		var ID = $(this).attr("href");
		var $el = $(ID);
		var offset = $el.offset();

		var header_height = $(".site-header").outerHeight();

		if ($(document).outerWidth() < 900) {
			header_height = 0;
		}

		$(scroll_frame).animate({
			scrollTop: Math.round(offset.top) - header_height + "px"
		}, 500, "easeOutQuad", function() {
			$(".section:not(" + ID + ")").removeClass("blur-off").addClass("blur-on");
			$el.removeClass("blur-on").addClass("blur-off");
		});
	}

	function _on_navigation_timer() {
		var scrolltop = $(scroll_frame).scrollTop();
		var half_viewport_height = $(window).height() / 2.0;

		$('.section').each(function(index, element) {
			var $element = $(element);
			var relative_position = (scrolltop + half_viewport_height) - $element.offset().top;

			if (relative_position >= 0 && relative_position < $element.outerHeight()) {
				_set_active_nav(element.id);
			}
		});

		var $site_header = $('.site-header');
		var $bubbles = $('.bubbles');

		if ($bubbles.css('position') === 'absolute' && ($bubbles.offset().top - scrolltop) < $site_header.outerHeight() + 20) {
			$bubbles.css({ "position": "fixed" , "top": $site_header.outerHeight() + 20 + "px"});
		}
		else if ($bubbles.css('position') === 'fixed' && (original_bubbles_top - scrolltop) >= $site_header.outerHeight() + 20) {
			$bubbles.css({ "position": "absolute" , "top": original_bubbles_top + "px"});
		}
		else if ($bubbles.css('position') === 'fixed' && ($bubbles.offset().top - scrolltop) != $site_header.outerHeight() + 20) {
			$bubbles.css({ "position": "fixed" , "top": $site_header.outerHeight() + 20 + "px"});
		}
	}

	function _set_active_nav(section) {
		var $active = $('.js-blur-target[href=#'+section+']');
		$(".bubbles__outline").removeClass("bubbles__outline_is_filled");
		$active.find(".bubbles__outline").addClass("bubbles__outline_is_filled");
	}

	function _on_arrow_click(event) {
		event.preventDefault();

		var dir_str = $(this).attr("rel");
		var new_slide = current_slide + (dir_str == "next" ? 1 : -1);

		_go_to_slide(new_slide);
	}

	function _go_to_slide(new_slide) {
		var $container = $(".carousel");
		var num_slides = $container.children().length;
		new_slide = Math.max(0, Math.min(num_slides - 1, new_slide));

		if (current_slide === new_slide) {
			return;
		}

		current_slide = new_slide;

		var duration = 400;

		$container.stop( true ).animate({
			'margin-left': (current_slide * -80) + "%",
		}, duration);

		if (current_slide === 0) {
			$('.arrow-nav--previous').stop( true ).fadeTo( duration, 0.5 );
			$('.arrow-nav--next').stop( true ).fadeTo( duration, 1 );
		}
		else if(current_slide > 0 && current_slide < num_slides - 1) {
			$('.arrow-nav--previous').stop( true ).fadeTo( duration, 1 );
			$('.arrow-nav--next').stop( true ).fadeTo( duration, 1 );
		}
		else if(current_slide === num_slides - 1) {
			$('.arrow-nav--previous').stop( true ).fadeTo( duration, 1 );
			$('.arrow-nav--next').stop( true ).fadeTo( duration, 0.5 );
		}
	}

})(WHAT_WE_DO);
WHAT_WE_DO.init();

 // Improvements & Todos

 /*
	- Paint cells individually on page load
	- Ensure more even distribution
	- Re-paint on window resize
	- Check performance in various browsers
	- Create fallback for non-canvas environments
	- Paint marker separately & later
	- Tweak easing
	- Ensure marked cell is on top
*/

var HOMEPAGE_SLIDESHOW = {};
(function(context){

	// Config
	var image_size = 512;
	var image_path = "img/"
	var image_filename = ["cell-0.png", "cell-1.png", "cell-2.png", "cell-3.png", "cell-4.png", "cell-cancer.png"];
	var image_filename_fallback = ["home-slide-1.png", "home-slide-2.png", "home-slide-3.png"];

	// State
	var current_slide = 0;
	var stage;
	var container;
	var images = [];
	var animation_duration = 1000;

	var zoom_limit;
	var zooming = false;
	var zoom_direction = 1.0;
	var zoom_animation_start_time = -1;
	var zoom_animation_start_value;
	var zoom_animation_delta_value;
	var zoom_animation_duration;
	var zoom_easing_function;

	var filtering = false;
	var filter_start_time = -1;
	var filter_start_value;
	var filter_delta_value;
	var filter_animation_duration;
	var center_cell_alpha = 1;
	var center_cell;
	var cancer_cell

	var testing_canvas_fallback = false;

	context.init = function() {
		$(window).load(function() {
			if (Modernizr.canvas && !testing_canvas_fallback) {
				var $canvas = $("#canvas-id");
				if ($canvas.length > 0) {					
					images = [];
					for (var i=0;i<6;i++) {
						var image = new Image();
						image.src = image_path + image_filename[i];
						images.push(image);
					}

					$(".slides__nav").click(_on_slides_nav_click);
					$('.slides__nav--previous').hide();

					var resize_timer = null;
					$( window ).resize(function() {
						clearTimeout(resize_timer);
						resize_timer = setTimeout(_on_resize, 500);
					});

					_init_canvas();					
				}
			}
			else {
				var $backgrounds = $(".slide__backgrounds");
				if ($backgrounds.length > 0) {
					$(".slides__nav").click(_on_slides_nav_click);

					$backgrounds.fadeIn();
				}
			}
		});
	}

	function _on_resize() {
		_go_to_slide(0);
		_init_canvas();
	}

	function _on_slides_nav_click(event) {
		event.preventDefault();

		var dir_str = $(this).attr("rel");
		var new_slide = current_slide + (dir_str == "next" ? 1 : -1);
		_go_to_slide(new_slide);
	}

	function _go_to_slide(new_slide) {
		var num_slides = $(".slides__list").find('.slide').length;
		new_slide = Math.max(0, Math.min(num_slides - 1, new_slide));

		if (current_slide === new_slide) {
			return;
		}

		current_slide = new_slide;

		function updateSlideContent(current_slide, delay) {

			// Hide old slide
			$(".slide:not(" + current_slide + ")").removeClass("slide--active");

			$(document).oneTime(delay, function() {
				$(".slides__list").css({
					"margin-left" : (-current_slide * 100) + "%"
				});			

				// Show new slide
				$(".slide:eq(" + current_slide + ")").addClass("slide--active");
			});			
		}

		updateSlideContent(current_slide, animation_duration);

		if (current_slide === 0) {
			if (Modernizr.canvas && !testing_canvas_fallback) {
				_set_zoom(false);
				_filter_cell(false);
			}
			else {
				_set_background(current_slide);
			}

			$('.slides__nav--previous').stop(true).hide();
			$('.slides__nav--next').stop(true).show();
		}
		else if(current_slide === 1) {
			if (Modernizr.canvas && !testing_canvas_fallback) {
				_set_zoom(true);
				_filter_cell(true);
			}
			else {
				_set_background(current_slide);
			}

			$('.slides__nav--previous').stop(true).show();
			$('.slides__nav--next').stop(true).show();
		}
		else if(current_slide === 2) {
			if (Modernizr.canvas && !testing_canvas_fallback) {
				_set_zoom(false);
				_filter_cell(true);
			}
			else {
				_set_background(current_slide);
			}

			$('.slides__nav--previous').stop(true).show();
			$('.slides__nav--next').stop(true).hide();
		}
	}

	function _set_background(new_background) {
		var $backgrounds = $(".slide__backgrounds");
		var $new_background = $backgrounds.children().eq(new_background);
		var $other_backgrounds = $backgrounds.children().not( $new_background );
		$other_backgrounds.stop(true).fadeTo(animation_duration, 0);
		$new_background.stop(true).fadeTo(animation_duration, 1);
	}

	function _init_canvas() {
		createjs.Ticker.removeAllEventListeners();
		
		stage = null;
		container = null;
		zooming = false;
		zoom_direction = 1.0;

		var $footer = $('.bottom');

		var window_width = $(window).width();
		var window_height = $(window).height();

		// Config variables
		var devicePixelRatio = window.devicePixelRatio || 1;

		// State variables
		var removed_children = [];

		// Lock canvas to viewport size (this needs to be in onResize() kind of thing)
		var $canvas = $('#canvas-id');
		$canvas.hide();
		var canvas = $canvas.get(0);
		var context2d = canvas.getContext('2d');
		var devicePixelRatio = window.devicePixelRatio || 1;
		var backingStoreRatio = context2d.webkitBackingStorePixelRatio ||
								context2d.mozBackingStorePixelRatio ||
								context2d.msBackingStorePixelRatio ||
								context2d.oBackingStorePixelRatio ||
								context2d.backingStorePixelRatio || 1;
		var ratio = devicePixelRatio / backingStoreRatio;

		canvas.width = window_width;
		canvas.height = window_height;

		if (devicePixelRatio !== backingStoreRatio)
		{
			var oldWidth = canvas.width;
			var oldHeight = canvas.height;

			canvas.width = oldWidth * ratio;
			canvas.height = oldHeight * ratio;

			canvas.style.width = oldWidth + 'px';
			canvas.style.height = oldHeight + 'px';

			// now scale the context to counter
			// the fact that we've manually scaled
			// our canvas element
			context2d.scale(ratio, ratio);
		}

		// Config variables
		var zoom_speed = 500.0; // 100 - 2000, higher is slower
		var fixed_pixel_cell_size = true;
		var devicePixelRatio = window.devicePixelRatio || 1;
		var cell_pixel_width = 10.0 * devicePixelRatio; // 100 - 300, higher means smaller cells
		var cells_per_window_width = 200.0; // 100 - 300, higher means smaller cells
		var cell_scale = fixed_pixel_cell_size ? cell_pixel_width / image_size : canvas.width / cells_per_window_width / image_size;
		var num_cells = (canvas.width / cell_pixel_width) * (canvas.height / cell_pixel_width) / 3.0; // based on canvas size
		zoom_limit = Math.min($footer.offset().top * devicePixelRatio, canvas.width) / cell_pixel_width * 0.8; // 10-100, higher means more zoom

		var stage = new createjs.Stage("canvas-id");
		stage.mouseEnabled = false;

		// Position container by the center point
		container = new createjs.Container();
		stage.addChild( container );
		container.regX = canvas.width / 2.0;
		container.regY = ($footer.offset().top * devicePixelRatio) / 2.0;
		container.x = canvas.width / 2.0;
		container.y = ($footer.offset().top * devicePixelRatio) / 2.0;

		function add_image(x, y, alpha, rotation, image_index) {
			var image = (image_index != undefined) ? images[image_index] : images[_random_integer(0,4)];
			var bitmap = new createjs.Bitmap( image );

			bitmap.regX = image_size / 2.0;
			bitmap.regY = image_size / 2.0;

			bitmap.scaleX = cell_scale;
			bitmap.scaleY = cell_scale;

			bitmap.rotation = (rotation != undefined) ? rotation : Math.floor( Math.random() * 360.0 );

			bitmap.x = x;
			bitmap.y = y;

			bitmap.alpha = (alpha != undefined) ? alpha : _random_integer(60, 75) / 100;

			container.addChild(bitmap);

			return bitmap;
		};

		// Add cells to random locations
		for (var i = 0; i < num_cells; i++) {
			var x = Math.floor( Math.random() * canvas.width );
			var y = Math.floor( Math.random() * canvas.height );

			var is_overlapping = false;

			for(var j = 0; j < container.children.length; j++) {

				if (j > 0) {
					var child = container.children[j];

					var distance_x = Math.abs(child.x - x);
					var distance_y = Math.abs(child.y - y);

					var distance_x_center = Math.abs(container.x - x);
					var distance_y_center = Math.abs(container.y - y);

					var scaled_cell_size = image_size * cell_scale;

					is_overlapping = (
						(
							distance_x < scaled_cell_size
							&& distance_y < scaled_cell_size
						)
						||
						(
							distance_x_center < scaled_cell_size
							&& distance_y_center < scaled_cell_size
						)
					);

					if (is_overlapping) {
						break;
					}
				}
			}

			if (!is_overlapping) {
				add_image(x, y);
			}
		}

		// Add cell to center
		center_cell_alpha = 75 / 100;
		center_cell = add_image(container.x, ($footer.offset().top * devicePixelRatio) / 2.0, center_cell_alpha, 0, 4);
		cancer_cell = add_image(container.x, ($footer.offset().top * devicePixelRatio) / 2.0, 0, 0, 5);

		stage.update();

		createjs.Ticker.setFPS(60);
		createjs.Ticker.setPaused(true);
		createjs.Ticker.addEventListener("tick", handleTick);

		// Mobile chrome isn't rendering without a delay for some reason
		window.setTimeout(function() {
			stage.update();
		}, 100);

		$canvas.fadeIn();

		function handleTick(event) {
			// If we are paused, do nothing
			if (event.paused) return;

			// Animate the zoom
			if (zooming) {
				// t: current time, b: begInnIng value, c: change In value, d: duration
				var value = zoom_easing_function(null, event.time - zoom_animation_start_time, zoom_animation_start_value, zoom_animation_delta_value, zoom_animation_duration);
				container.scaleX = value;
				container.scaleY = value;
			}

			var buffer = container.scaleX * image_size * cell_scale / 2.0;

			// Clip cells that are out of bounds
			if (zoom_direction > 0) {
				for (var i = container.getNumChildren() - 1; i >= 0; i--) {
					var child = container.getChildAt(i);

					var location = container.localToGlobal(child.x, child.y);

					if (location.x > canvas.width + buffer || location.x < -buffer || location.y > canvas.height + buffer || location.y < -buffer) {
						container.removeChildAt(i);
						removed_children.push(child);
					}
				}
			}

			// Unclip cells that are headed in bounds
			if (zoom_direction < 0) {
				for (var i = removed_children.length - 1; i >= 0; i--) {
					var child = removed_children[i];

					var location = container.localToGlobal(child.x, child.y);

					if (location.x < canvas.width + buffer && location.x > -buffer && location.y < canvas.height + buffer && location.y > -buffer) {
						container.addChild(child);
						removed_children.splice(i, 1);
					}
				}
			}

			// Automatic stopping of zoom
			if (zoom_direction < 0 && event.time - zoom_animation_start_time >= zoom_animation_duration) {
				container.scaleX = container.scaleY = 1;
				zooming = false;
			}

			if (zoom_direction > 0 && event.time - zoom_animation_start_time >= zoom_animation_duration) {
				container.scaleX = container.scaleY = zoom_limit;
				zooming = false;
			}

			// Animate the filter
			if (filtering) {
				// t: current time, b: begInnIng value, c: change In value, d: duration
				var value = $.easing.easeInOutQuad(null, event.time - filter_start_time, filter_start_value, filter_delta_value, filter_animation_duration);
				center_cell.alpha = value;
				cancer_cell.alpha = center_cell_alpha - value;
			}

			// Automatic stopping of filtering
			if (event.time - filter_start_time >= filter_animation_duration) {
				center_cell.alpha = Math.max(0, Math.min(center_cell_alpha, center_cell.alpha));
				cancer_cell.alpha = Math.max(0, Math.min(center_cell_alpha, cancer_cell.alpha));
				filtering = false;
			};

			// Paint
			stage.update();

			// When we are done zooming, pause the ticker
			if (!zooming && !filtering) {
				createjs.Ticker.setPaused(true);
			}
		}
	}

	function _set_zoom(should_be_zoomed) {
		var current_time = createjs.Ticker.getTime();
		zoom_direction = should_be_zoomed ? 1.0 : -1.0;
		zoom_animation_duration = animation_duration;
		zoom_animation_start_time = current_time;
		var start_scale = container.scaleX ? container.scaleX : 1;
		zoom_animation_start_value = start_scale;
		zoom_animation_delta_value = should_be_zoomed ? zoom_limit - start_scale : 1.0 - start_scale;
		zoom_easing_function = should_be_zoomed ? $.easing.easeInOutQuad : $.easing.easeInOutQuad;
		zooming = true;
		createjs.Ticker.setPaused( false );
	}

	function _filter_cell(should_be_filtered) {
		var current_time = createjs.Ticker.getTime();
		filter_animation_duration = animation_duration;
		filter_start_time = current_time;
		var start_alpha = center_cell.alpha;
		filter_start_value = start_alpha;
		filter_delta_value = should_be_filtered ? 0 - start_alpha : center_cell_alpha - start_alpha;
		filtering = true;
		createjs.Ticker.setPaused( false );
	}

	function _random_integer(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

})(HOMEPAGE_SLIDESHOW);
HOMEPAGE_SLIDESHOW.init();