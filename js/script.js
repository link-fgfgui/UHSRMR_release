"use strict";
(function () {
	// Global variables
	let
		userAgent = navigator.userAgent.toLowerCase(),
		isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false;

	// Unsupported browsers
	if (isIE !== false && isIE < 12) {
		console.warn("[Core] detected IE" + isIE + ", load alert");
		var script = document.createElement("script");
		script.src = "./js/support.js";
		document.querySelector("head").appendChild(script);
	}

	let
		initialDate = new Date(),

		$document = $(document),
		$window = $(window),
		$html = $("html"),
		$body = $("body"),

		isDesktop = $html.hasClass("desktop"),
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		windowReady = false,
		isNoviBuilder = false,
		pageTransitionDuration = 500,

		plugins = {
			bootstrapTooltip:        $("[data-bs-toggle='tooltip']"),
			bootstrapModalDialog:    $('.modal'),
			bootstrapCollapse:       $(".card-custom"),
			bootstrapTabs:           $('.tabs-custom'),
			captcha:                 $('.recaptcha'),
			campaignMonitor:         $('.campaign-mailform'),
			copyrightYear:           $(".copyright-year"),
			checkbox:                $("input[type='checkbox']"),
			isotope:                 $(".isotope"),
			lightGallery:            $("[data-lightgallery='group']"),
			lightGalleryItem:        $("[data-lightgallery='item']"),
			lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
			materialParallax:        $(".parallax-container"),
			mailchimp:               $('.mailchimp-mailform'),
			owl:                     $(".owl-carousel"),
			popover:                 $('[data-bs-toggle="popover"]'),
			preloader:               $(".preloader"),
			rdNavbar:                $(".rd-navbar"),
			maps:                    $(".google-map-container"),
			rdMailForm:              $(".rd-mailform"),
			rdInputLabel:            $(".form-label"),
			regula:                  $("[data-constraints]"),
			radio:                   $("input[type='radio']"),
			search:                  $(".rd-search"),
			searchResults:           $('.rd-search-results'),
			statefulButton:          $('.btn-stateful'),
			viewAnimate:             $('.view-animate'),
			wow:                     $(".wow"),
			selectFilter:            $(".select"),
			buttonWinona:            $('.button-winona'),
			slick:                   $('.slick-slider'),
			buttonLoad:              $('.button-load'),
			parallaxJs:              $(".parallax-scene-js"),
			waypoint:                $('[data-waypoint-to]'),
			typedjs:                 document.querySelectorAll('.typed-text'),
			multitoggles:            document.querySelectorAll('[data-multitoggle]'),
			stuckWrappers:           document.querySelectorAll('.stuck-wrapper'),
			animePresets:            document.querySelectorAll('[data-anime]'),
			navbar:                  document.querySelectorAll('.navbar'),
			counter:                 document.querySelectorAll('.counter'),
			progressLinear:          document.querySelectorAll('.progress-linear'),
			progressCircle:          document.querySelectorAll('.progress-circle'),
			countdown:               document.querySelectorAll('.countdown'),
		};

	// Initialize scripts that require a loaded page
	$window.on('load', function () {
		// Page loader & Page transition
		if (plugins.preloader.length && !isNoviBuilder) {
			pageTransition({
				target: document.querySelector('.page'),
				delay: 0,
				duration: pageTransitionDuration,
				classIn: 'fadeIn',
				classOut: 'fadeOut',
				classActive: 'animated',
				conditions: function (event, link) {
					return !/(\#|callto:|tel:|mailto:|:\/\/)/.test(link)
						&& !event.currentTarget.hasAttribute('data-lightgallery');
				},
				onTransitionStart: function (options) {
					setTimeout(function () {
						plugins.preloader.removeClass('loaded');
					}, options.duration * .75);
				},
				onReady: function () {
					plugins.preloader.addClass('loaded');
					windowReady = true;
				}
			});
		}

		// Counter
		if (plugins.counter) {
			for (let i = 0; i < plugins.counter.length; i++) {
				let
					node = plugins.counter[i],
					counter = aCounter({
						node: node,
						duration: node.getAttribute('data-duration') || 1000
					}),
					scrollHandler = (function () {
						if (Util.inViewport(this) && !this.classList.contains('animated-first')) {
							this.counter.run();
							this.classList.add('animated-first');
						}
					}).bind(node),
					blurHandler = (function () {
						this.counter.params.to = parseInt(this.textContent, 10);
						this.counter.run();
					}).bind(node);

				if (isNoviBuilder) {
					node.counter.run();
					node.addEventListener('blur', blurHandler);
				} else {
					scrollHandler();
					window.addEventListener('scroll', scrollHandler);
				}
			}
		}

		// Progress Bar
		if (plugins.progressLinear) {
			for (let i = 0; i < plugins.progressLinear.length; i++) {
				let
					container = plugins.progressLinear[i],
					bar = container.querySelector('.progress-linear-bar'),
					duration = container.getAttribute('data-duration') || 1000,
					counter = aCounter({
						node: container.querySelector('.progress-linear-counter'),
						duration: duration,
						onStart: function () {
							this.custom.bar.style.width = this.params.to + '%';
						}
					});

				bar.style.transitionDuration = duration / 1000 + 's';
				counter.custom = {
					container: container,
					bar: bar,
					onScroll: (function () {
						if ((Util.inViewport(this.custom.container) && !this.custom.container.classList.contains('animated')) || isNoviBuilder) {
							this.run();
							this.custom.container.classList.add('animated');
						}
					}).bind(counter),
					onBlur: (function () {
						this.params.to = parseInt(this.params.node.textContent, 10);
						this.run();
					}).bind(counter)
				};

				if (isNoviBuilder) {
					counter.run();
					counter.params.node.addEventListener('blur', counter.custom.onBlur);
				} else {
					counter.custom.onScroll();
					document.addEventListener('scroll', counter.custom.onScroll);
				}
			}
		}

		// Progress Circle
		if (plugins.progressCircle) {
			for (let i = 0; i < plugins.progressCircle.length; i++) {
				let
					container = plugins.progressCircle[i],
					counter = aCounter({
						node: container.querySelector('.progress-circle-counter'),
						duration: 500,
						onUpdate: function (value) {
							this.custom.bar.render(value * 3.6);
						}
					});

				counter.params.onComplete = counter.params.onUpdate;

				counter.custom = {
					container: container,
					bar: aProgressCircle({node: container.querySelector('.progress-circle-bar')}),
					onScroll: (function () {
						if (Util.inViewport(this.custom.container) && !this.custom.container.classList.contains('animated')) {
							this.run();
							this.custom.container.classList.add('animated');
						}
					}).bind(counter),
					onBlur: (function () {
						this.params.to = parseInt(this.params.node.textContent, 10);
						this.run();
					}).bind(counter)
				};

				if (isNoviBuilder) {
					counter.run();
					counter.params.node.addEventListener('blur', counter.custom.onBlur);
				} else {
					counter.custom.onScroll();
					window.addEventListener('scroll', counter.custom.onScroll);
				}
			}
		}
	});

	// Initialize scripts that require a finished document
	$(function () {
			isNoviBuilder = window.xMode;

			/**
			 * @desc Initialize owl carousel plugin
			 * @param {object} c - carousel jQuery object
			 */
			function initOwlCarousel(c) {
				var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
					values = [0, 576, 768, 992, 1200, 1600],
					responsive = {};

				for (var j = 0; j < values.length; j++) {
					responsive[values[j]] = {};
					for (var k = j; k >= -1; k--) {
						if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
							responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
						}
						if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
							responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
						}
						if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
							responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
						}
						if (!responsive[values[j]]["autoWidth"] && responsive[values[j]]["autoWidth"] !== 0 && c.attr("data" + aliaces[k] + "auto-width")) {
							responsive[values[j]]["autoWidth"] = k < 0 ? false : c.attr("data" + aliaces[k] + "auto-width");
						}
					}
				}

				// Enable custom pagination
				if (c.attr('data-dots-custom')) {
					c.on("initialized.owl.carousel", function (event) {
						var carousel = $(event.currentTarget),
							customPag = $(carousel.attr("data-dots-custom")),
							active = 0;

						if (carousel.attr('data-active')) {
							active = parseInt(carousel.attr('data-active'), 10);
						}

						carousel.trigger('to.owl.carousel', [active, 300, true]);
						customPag.find("[data-owl-item='" + active + "']").addClass("active");

						customPag.find("[data-owl-item]").on('click', function (e) {
							e.preventDefault();
							carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
						});

						carousel.on("translate.owl.carousel", function (event) {
							customPag.find(".active").removeClass("active");
							customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
						});
					});
				}

				// Create custom Numbering
				if (typeof (c.attr("data-numbering")) !== 'undefined') {
					var numberingObject = $(c.attr("data-numbering"));

					c.on('initialized.owl.carousel changed.owl.carousel', function (numberingObject) {
						return function (e) {
							if (!e.namespace) return;
							numberingObject.find('.numbering-current').text(e.item.index + 1);
							numberingObject.find('.numbering-count').text(e.item.count);
						};
					}(numberingObject));
				}

				if (typeof (c.attr("data-custom-next")) !== 'undefined') {
					var customNext = $(c.attr("data-custom-next"));

					customNext.on('click', function (customNext, c) {
						return function () {
							c.trigger('next.owl.carousel');
						};
					}(customNext, c));
				}

				c.owlCarousel({
					autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
					autoplayTimeout: c.attr("data-autoplay-timeout") ? Number(c.attr("data-autoplay-timeout")) : 3000,
					autoplayHoverPause: true,
					smartSpeed: c.attr("data-speed") ? parseInt(c.attr("data-speed")) : 250,
					loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
					items: 1,
					easing: c.attr('data-easing') ? c.attr('data-easing') : 'swing',
					center: c.attr("data-center") === "true",
					dotsContainer: c.attr("data-pagination-container") || false,
					navContainer: c.attr("data-navigation-container") || false,
					mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
					nav: c.attr("data-nav") === "true",
					dots: c.attr("data-dots") === "true",
					dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
					animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
					animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
					responsive: responsive,
					navText: c.attr("data-nav-text") ? $.parseJSON(c.attr("data-nav-text")) : [],
					navClass: c.attr("data-nav-class") ? $.parseJSON(c.attr("data-nav-class")) : ['owl-prev', 'owl-next']
				});
			}

			/**
			 * @desc Check the element whas been scrolled into the view
			 * @param {object} elem - jQuery object
			 * @return {boolean}
			 */
			function isScrolledIntoView(elem) {
				if (!isNoviBuilder) {
					return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
				} else {
					return true;
				}
			}

			/**
			 * @desc Calls a function when element has been scrolled into the view
			 * @param {object} element - jQuery object
			 * @param {function} func - callback function
			 */
			function lazyInit(element, func) {
				var handler = function () {
					if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
						func.call();
						element.addClass('lazy-loaded');
					}
				};

				handler();
				$window.on('scroll', handler);
			}

			// applyAnimation
			function applyAnimation(target, params) {
				var defaultParams = merge({
					targets: '.anime-element',
					duration: 800,
					easing: 'easeInOutQuad',
					loop: false,
					direction: 'alternate'
				}, params.options);

				var animeObj = anime(defaultParams);

				function start() {
					if (animeObj) animeObj.pause();
					animeObj = anime(merge(
						defaultParams,
						params.animationStart
					));
				}

				function end() {
					if (animeObj) animeObj.pause();
					animeObj = anime(merge(
						defaultParams,
						params.animationEnd
					));
				}

				target.addEventListener('mouseenter', function () {
					start();
				});

				target.addEventListener('mouseleave', function () {
					end();
				});
			}

			function merge(target, sources) {
				if (!target || typeof target !== 'object') {
					throw new TypeError('First argument must be passed and be an object.');
				}

				var result = Object(target);

				for (var i = 1; i < arguments.length; i++) {
					var source = arguments[i];

					//null and undefined
					if (source == null) {
						continue;
					}

					for (var key in source) {
						//null and undefined
						if (source[key] == null) {
							continue;
						}

						//Merge objects in object
						if (source[key] && target[key] && typeof source[key] === 'object' && typeof target[key] === 'object') {
							merge(target[key], source[key]);
							continue;
						}

						target[key] = source[key];
					}
				}

				return result;
			}

			/**
			 * @desc Create live search results
			 * @param {object} options
			 */
			function liveSearch(options) {
				$('#' + options.live).removeClass('cleared').html();
				options.current++;
				options.spin.addClass('loading');
				$.get(handler, {
					s: decodeURI(options.term),
					liveSearch: options.live,
					dataType: "html",
					liveCount: options.liveCount,
					filter: options.filter,
					template: options.template
				}, function (data) {
					options.processed++;
					var live = $('#' + options.live);
					if ((options.processed === options.current) && !live.hasClass('cleared')) {
						live.find('> #search-results').removeClass('active');
						live.html(data);
						setTimeout(function () {
							live.find('> #search-results').addClass('active');
						}, 50);
					}
					options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
				})
			}

			/**
			 * @desc Attach form validation to elements
			 * @param {object} elements - jQuery object
			 */
			function attachFormValidator(elements) {
				// Custom validator - phone number
				regula.custom({
					name: 'PhoneNumber',
					defaultMessage: 'Invalid phone number format',
					validator: function () {
						if (this.value === '') return true;
						else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test(this.value);
					}
				});

				for (var i = 0; i < elements.length; i++) {
					var o = $(elements[i]), v;
					o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
					v = o.parent().find(".form-validation");
					if (v.is(":last-child")) o.addClass("form-control-last-child");
				}

				elements.on('input change propertychange blur', function (e) {
					var $this = $(this), results;

					if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
					if ($this.parents('.rd-mailform').hasClass('success')) return;

					if ((results = $this.regula('validate')).length) {
						for (i = 0; i < results.length; i++) {
							$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
						}
					} else {
						$this.siblings(".form-validation").text("").parent().removeClass("has-error")
					}
				}).regula('bind');

				var regularConstraintsMessages = [
					{
						type: regula.Constraint.Required,
						newMessage: "The text field is required."
					},
					{
						type: regula.Constraint.Email,
						newMessage: "The email is not a valid email."
					},
					{
						type: regula.Constraint.Numeric,
						newMessage: "Only numbers are required"
					},
					{
						type: regula.Constraint.Selected,
						newMessage: "Please choose an option."
					}
				];


				for (var i = 0; i < regularConstraintsMessages.length; i++) {
					var regularConstraint = regularConstraintsMessages[i];

					regula.override({
						constraintType: regularConstraint.type,
						defaultMessage: regularConstraint.newMessage
					});
				}
			}

			/**
			 * @desc Check if all elements pass validation
			 * @param {object} elements - object of items for validation
			 * @param {object} captcha - captcha object for validation
			 * @return {boolean}
			 */
			function isValidated(elements, captcha) {
				var results, errors = 0;

				if (elements.length) {
					for (var j = 0; j < elements.length; j++) {

						var $input = $(elements[j]);
						if ((results = $input.regula('validate')).length) {
							for (let k = 0; k < results.length; k++) {
								errors++;
								$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
							}
						} else {
							$input.siblings(".form-validation").text("").parent().removeClass("has-error")
						}
					}

					if (captcha) {
						if (captcha.length) {
							return validateReCaptcha(captcha) && errors === 0
						}
					}

					return errors === 0;
				}
				return true;
			}

			/**
			 * @desc Validate google reCaptcha
			 * @param {object} captcha - captcha object for validation
			 * @return {boolean}
			 */
			function validateReCaptcha(captcha) {
				var captchaToken = captcha.find('.g-recaptcha-response').val();

				if (captchaToken.length === 0) {
					captcha
						.siblings('.form-validation')
						.html('Please, prove that you are not robot.')
						.addClass('active');
					captcha
						.closest('.form-wrap')
						.addClass('has-error');

					captcha.on('propertychange', function () {
						var $this = $(this),
							captchaToken = $this.find('.g-recaptcha-response').val();

						if (captchaToken.length > 0) {
							$this
								.closest('.form-wrap')
								.removeClass('has-error');
							$this
								.siblings('.form-validation')
								.removeClass('active')
								.html('');
							$this.off('propertychange');
						}
					});

					return false;
				}

				return true;
			}

			/**
			 * @desc Initialize Google reCaptcha
			 */
			window.onloadCaptchaCallback = function () {
				for (var i = 0; i < plugins.captcha.length; i++) {
					var $capthcaItem = $(plugins.captcha[i]);

					grecaptcha.render(
						$capthcaItem.attr('id'),
						{
							sitekey: $capthcaItem.attr('data-sitekey'),
							size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
							theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
							callback: function (e) {
								$('.recaptcha').trigger('propertychange');
							}
						}
					);
					$capthcaItem.after("<span class='form-validation'></span>");
				}
			};

			/**
			 * Google map function for getting latitude and longitude
			 */
			function getLatLngObject(str, marker, map, callback) {
				var coordinates = {};
				try {
					coordinates = JSON.parse(str);
					callback(new google.maps.LatLng(
						coordinates.lat,
						coordinates.lng
					), marker, map)
				} catch (e) {
					map.geocoder.geocode({'address': str}, function (results, status) {
						if (status === google.maps.GeocoderStatus.OK) {
							var latitude = results[0].geometry.location.lat();
							var longitude = results[0].geometry.location.lng();

							callback(new google.maps.LatLng(
								parseFloat(latitude),
								parseFloat(longitude)
							), marker, map)
						}
					})
				}
			}

			/**
			 * @desc Initialize Bootstrap tooltip with required placement
			 * @param {string} tooltipPlacement
			 */
			function initBootstrapTooltip(tooltipPlacement) {
				plugins.bootstrapTooltip.tooltip('dispose');

				for (var i = 0; i < plugins.bootstrapTooltip.length; i++) {
					var $tooltip = $(plugins.bootstrapTooltip[i]);

					if (window.innerWidth < 576) {
						$tooltip.tooltip({
							customClass: $tooltip.attr('data-class') ? $tooltip.attr('data-class') : '',
							placement: 'bottom'
						});
					} else {
						$tooltip.tooltip({
							customClass: $tooltip.attr('data-class') ? $tooltip.attr('data-class') : '',
							placement: tooltipPlacement
						});
					}
				}
			}

			/**
			 * @desc Initialize the gallery with set of images
			 * @param {object} itemsToInit - jQuery object
			 * @param {string} addClass - additional gallery class
			 */
			function initLightGallery(itemsToInit, addClass) {
				if (!isNoviBuilder) {
					$(itemsToInit).lightGallery({
						thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
						selector: "[data-lightgallery='item']",
						autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
						pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
						addClass: addClass,
						mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
						loop: $(itemsToInit).attr("data-lg-loop") !== "false"
					});
				}
			}

			/**
			 * @desc Initialize the gallery with dynamic addition of images
			 * @param {object} itemsToInit - jQuery object
			 * @param {string} addClass - additional gallery class
			 */
			function initDynamicLightGallery(itemsToInit, addClass) {
				if (!isNoviBuilder) {
					$(itemsToInit).on("click", function () {
						$(itemsToInit).lightGallery({
							thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
							selector: "[data-lightgallery='item']",
							autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
							pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
							addClass: addClass,
							mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
							loop: $(itemsToInit).attr("data-lg-loop") !== "false",
							dynamic: true,
							dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
						});
					});
				}
			}

			/**
			 * @desc Initialize the gallery with one image
			 * @param {object} itemToInit - jQuery object
			 * @param {string} addClass - additional gallery class
			 */
			function initLightGalleryItem(itemToInit, addClass) {
				if (!isNoviBuilder) {
					$(itemToInit).lightGallery({
						selector: "this",
						addClass: addClass,
						counter: false,
						youtubePlayerParams: {
							modestbranding: 1,
							showinfo: 0,
							rel: 0,
							controls: 0
						},
						vimeoPlayerParams: {
							byline: 0,
							portrait: 0
						}
					});
				}
			}


			// Google ReCaptcha
			if (plugins.captcha.length) {
				$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
			}

			// Additional class on html if mac os.
			if (navigator.platform.match(/(Mac)/i)) {
				$html.addClass("mac-os");
			}

			// Adds some loosing functionality to IE browsers (IE Polyfills)
			if (isIE) {
				if (isIE === 12) $html.addClass("ie-edge");
				if (isIE === 11) $html.addClass("ie-11");
				if (isIE < 10) $html.addClass("lt-ie-10");
				if (isIE < 11) $html.addClass("ie-10");
			}

			// Bootstrap Tooltips
			if (plugins.bootstrapTooltip.length) {
				var tooltipPlacement = plugins.bootstrapTooltip.attr('data-bs-placement');
				initBootstrapTooltip(tooltipPlacement);

				$window.on('resize orientationchange', function () {
					initBootstrapTooltip(tooltipPlacement);
				})
			}

			// Stop vioeo in bootstrapModalDialog
			if (plugins.bootstrapModalDialog.length) {
				for (var i = 0; i < plugins.bootstrapModalDialog.length; i++) {
					var modalItem = $(plugins.bootstrapModalDialog[i]);

					modalItem.on('hidden.bs.modal', $.proxy(function () {
						var activeModal = $(this),
							rdVideoInside = activeModal.find('video'),
							youTubeVideoInside = activeModal.find('iframe');

						if (rdVideoInside.length) {
							rdVideoInside[0].pause();
						}

						if (youTubeVideoInside.length) {
							var videoUrl = youTubeVideoInside.attr('src');

							youTubeVideoInside
								.attr('src', '')
								.attr('src', videoUrl);
						}
					}, modalItem))
				}
			}

			// Popovers
			if (plugins.popover.length) {
				if (window.innerWidth < 767) {
					plugins.popover.attr('data-bs-placement', 'bottom');
					plugins.popover.popover();
				} else {
					plugins.popover.popover();
				}
			}

			// Bootstrap Buttons
			if (plugins.statefulButton.length) {
				$(plugins.statefulButton).on('click', function () {
					var statefulButtonLoading = $(this).button('loading');

					setTimeout(function () {
						statefulButtonLoading.button('reset')
					}, 2000);
				})
			}

			// Copyright Year (Evaluates correct copyright year)
			if (plugins.copyrightYear.length) {
				plugins.copyrightYear.text(initialDate.getFullYear());
			}

			// Bootstrap Collapse Custom
			if (plugins.bootstrapCollapse.length) {
				for (var i = 0; i < plugins.bootstrapCollapse.length; i++) {
					var $bootstrapCollapseItem = $(plugins.bootstrapCollapse[i]);

					(function ($bootstrapCollapseItem) {
						if (!$bootstrapCollapseItem.find('a.collapsed').length) {
							$bootstrapCollapseItem.addClass('active');
						}

						$bootstrapCollapseItem.on('show.bs.collapse', function () {
							$bootstrapCollapseItem.addClass('active');
						});

						$bootstrapCollapseItem.on('hide.bs.collapse', function () {
							$bootstrapCollapseItem.removeClass('active');
						});

					})($bootstrapCollapseItem);
				}
			}

			// Bootstrap tabs
			if (plugins.bootstrapTabs.length) {
				var MILLISECONDS_MULTIPLIER = 1000;
				for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
					var $bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

					// Nav plugin
					if ($bootstrapTabsItem.attr('data-transition-state') === 'true') {
						$bootstrapTabsItem.on('hide.bs.tab', function (event) {
							document.querySelectorAll(event.target.getAttribute('href'))[0].classList.add('hiding');
						});
						$bootstrapTabsItem.on('hidden.bs.tab', function (event) {
							var target = document.querySelectorAll(event.target.getAttribute('href'))[0],
								timeout = parseFloat(window.getComputedStyle(target).getPropertyValue('animation-duration')) * MILLISECONDS_MULTIPLIER;
							setTimeout(function () {
								target.classList.remove('hiding');
							}, timeout);
						});
						$bootstrapTabsItem.on('show.bs.tab', function (event) {
							document.querySelectorAll(event.target.getAttribute('href'))[0].classList.add('showing');
						});
						$bootstrapTabsItem.on('shown.bs.tab', function (event) {
							var target = document.querySelectorAll(event.target.getAttribute('href'))[0],
								timeout = parseFloat(window.getComputedStyle(target).getPropertyValue('animation-duration')) * MILLISECONDS_MULTIPLIER;
							setTimeout(function () {
								target.classList.remove('showing');
							}, timeout);
						});
					}
				}
			}

			// Add custom styling options for input[type="radio"]
			if (plugins.radio.length) {
				for (var i = 0; i < plugins.radio.length; i++) {
					$(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
				}
			}

			// Add custom styling options for input[type="checkbox"]
			if (plugins.checkbox.length) {
				for (var i = 0; i < plugins.checkbox.length; i++) {
					$(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
				}
			}

			// UI To Top
			if (isDesktop && !isNoviBuilder) {
				$().UItoTop({
					easingType: 'easeOutQuad',
					containerClass: 'ui-to-top mdi mdi-chevron-up'
				});
			}

			// RD Navbar
			if (plugins.rdNavbar.length) {
				var aliaces, i, j, len, value, values;

				aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
				values = [0, 576, 768, 992, 1200, 1600];

				for (var z = 0; z < plugins.rdNavbar.length; z++) {
					var $rdNavbar = $(plugins.rdNavbar[z]),
						responsiveNavbar = {};

					for (i = j = 0, len = values.length; j < len; i = ++j) {
						value = values[i];
						if (!responsiveNavbar[values[i]]) {
							responsiveNavbar[values[i]] = {};
						}
						if ($rdNavbar.attr('data' + aliaces[i] + 'layout')) {
							responsiveNavbar[values[i]].layout = $rdNavbar.attr('data' + aliaces[i] + 'layout');
						}
						if ($rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
							responsiveNavbar[values[i]]['deviceLayout'] = $rdNavbar.attr('data' + aliaces[i] + 'device-layout');
						}
						if ($rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
							responsiveNavbar[values[i]]['focusOnHover'] = $rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
						}
						if ($rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
							responsiveNavbar[values[i]]['autoHeight'] = $rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
						}

						if ($rdNavbar.attr('data' + aliaces[i] + 'anchor-nav-offset')) {
							responsiveNavbar[values[i]]['anchorNavOffset'] = $rdNavbar.attr('data' + aliaces[i] + 'anchor-nav-offset');
						}

						if (isNoviBuilder) {
							responsiveNavbar[values[i]]['stickUp'] = false;
						} else if ($rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
							var isDemoNavbar = $rdNavbar.parents('.layout-navbar-demo').length;
							responsiveNavbar[values[i]]['stickUp'] = $rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true' && !isDemoNavbar;
						}

						if ($rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
							responsiveNavbar[values[i]]['stickUpOffset'] = $rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
						}
					}


					$rdNavbar.RDNavbar({
						anchorNav: !isNoviBuilder,
						stickUpClone: ($rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? $rdNavbar.attr("data-stick-up-clone") === 'true' : false,
						responsive: responsiveNavbar,
						callbacks: {
							onStuck: function () {
								var navbarSearch = this.$element.find('.rd-search input');

								if (navbarSearch) {
									navbarSearch.val('').trigger('propertychange');
								}
							},
							onDropdownOver: function () {
								return !isNoviBuilder;
							},
							onUnstuck: function () {
								if (this.$clone === null)
									return;

								var navbarSearch = this.$clone.find('.rd-search input');

								if (navbarSearch) {
									navbarSearch.val('').trigger('propertychange');
									navbarSearch.trigger('blur');
								}

							}
						}
					});


					if ($rdNavbar.attr("data-body-class")) {
						document.body.className += ' ' + $rdNavbar.attr("data-body-class");
					}

				}
			}

			// RD Search
			if (plugins.search.length || plugins.searchResults) {
				var handler = "bat/rd-search.php";
				var defaultTemplate = '<h5 class="search-title"><a target="_top" href="#{href}" class="search-link">#{title}</a></h5>' +
					'<p>...#{token}...</p>' +
					'<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
				var defaultFilter = '*.html';

				if (plugins.search.length) {
					for (var i = 0; i < plugins.search.length; i++) {
						var searchItem = $(plugins.search[i]),
							options = {
								element: searchItem,
								filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
								template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
								live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
								liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live'), 10) : 4,
								current: 0, processed: 0, timer: {}
							};

						var $toggle = $('.rd-navbar-search-toggle');
						if ($toggle.length) {
							$toggle.on('click', (function (searchItem) {
								return function () {
									if (!($(this).hasClass('active'))) {
										searchItem.find('input').val('').trigger('propertychange');
									}
								}
							})(searchItem));
						}

						if (options.live) {
							var clearHandler = false;

							searchItem.find('input').on("input propertychange", $.proxy(function () {
								this.term = this.element.find('input').val().trim();
								this.spin = this.element.find('.input-group-addon');

								clearTimeout(this.timer);

								if (this.term.length > 2) {
									this.timer = setTimeout(liveSearch(this), 200);

									if (clearHandler === false) {
										clearHandler = true;

										$body.on("click", function (e) {
											if ($(e.toElement).parents('.rd-search').length === 0) {
												$('#rd-search-results-live').addClass('cleared').html('');
											}
										})
									}

								} else if (this.term.length === 0) {
									$('#' + this.live).addClass('cleared').html('');
								}
							}, options, this));
						}

						searchItem.submit($.proxy(function () {
							$('<input />').attr('type', 'hidden')
								.attr('name', "filter")
								.attr('value', this.filter)
								.appendTo(this.element);
							return true;
						}, options, this))
					}
				}

				if (plugins.searchResults.length) {
					var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
					var match = regExp.exec(location.search);

					if (match !== null) {
						$.get(handler, {
							s: decodeURI(match[1]),
							dataType: "html",
							filter: match[2],
							template: defaultTemplate,
							live: ''
						}, function (data) {
							plugins.searchResults.html(data);
						})
					}
				}
			}

			// Add class in viewport
			if (plugins.viewAnimate.length) {
				for (var i = 0; i < plugins.viewAnimate.length; i++) {
					var $view = $(plugins.viewAnimate[i]).not('.active');
					$document.on("scroll", $.proxy(function () {
						if (isScrolledIntoView(this)) {
							this.addClass("active");
						}
					}, $view))
						.trigger("scroll");
				}
			}

			// Owl carousel
			if (plugins.owl.length) {
				for (var i = 0; i < plugins.owl.length; i++) {
					var c = $(plugins.owl[i]);
					plugins.owl[i].owl = c;

					initOwlCarousel(c);
				}
			}

			// Isotope
			if (plugins.isotope.length) {
				var isogroup = [];
				for (var i = 0; i < plugins.isotope.length; i++) {
					var isotopeItem = plugins.isotope[i],
						isotopeInitAttrs = {
							itemSelector: '.isotope-item',
							layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
							filter: '*'
						};

					if (isotopeItem.getAttribute('data-column-width')) {
						isotopeInitAttrs.masonry = {
							columnWidth: parseFloat(isotopeItem.getAttribute('data-column-width'))
						};
					} else if (isotopeItem.getAttribute('data-column-class')) {
						isotopeInitAttrs.masonry = {
							columnWidth: isotopeItem.getAttribute('data-column-class')
						};
					}

					var iso = new Isotope(isotopeItem, isotopeInitAttrs);
					isotopeItem.isotope = iso;
					isogroup.push(iso);
				}


				setTimeout(function () {
					for (var i = 0; i < isogroup.length; i++) {
						isogroup[i].element.className += " isotope--loaded";
						isogroup[i].layout();
					}
				}, 200);

				var resizeTimout;

				$("[data-isotope-filter]").on("click", function (e) {
					e.preventDefault();
					var filter = $(this);
					clearTimeout(resizeTimout);
					filter.parents(".isotope-filters").find('.active').removeClass("active");
					filter.addClass("active");
					var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]'),
						isotopeAttrs = {
							itemSelector: '.isotope-item',
							layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
							filter: this.getAttribute("data-isotope-filter") === '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]'
						};
					if (iso.attr('data-column-width')) {
						isotopeAttrs.masonry = {
							columnWidth: parseFloat(iso.attr('data-column-width'))
						};
					} else if (iso.attr('data-column-class')) {
						isotopeAttrs.masonry = {
							columnWidth: iso.attr('data-column-class')
						};
					}
					iso.isotope(isotopeAttrs);
				}).eq(0).trigger("click")
			}

			// WOW
			if ($html.hasClass('wow-animation') && plugins.wow.length && !isNoviBuilder && isDesktop) {
				setTimeout(function () {
					new WOW().init();
				}, pageTransitionDuration + 100);
			}

			// RD Input Label
			if (plugins.rdInputLabel.length) {
				plugins.rdInputLabel.RDInputLabel();
			}

			// Regula
			if (plugins.regula.length) {
				attachFormValidator(plugins.regula);
			}

			// MailChimp Ajax subscription
			if (plugins.mailchimp.length) {
				for (i = 0; i < plugins.mailchimp.length; i++) {
					var $mailchimpItem = $(plugins.mailchimp[i]),
						$email = $mailchimpItem.find('input[type="email"]');

					// Required by MailChimp
					$mailchimpItem.attr('novalidate', 'true');
					$email.attr('name', 'EMAIL');

					$mailchimpItem.on('submit', $.proxy(function ($email, event) {
						event.preventDefault();

						var $this = this;

						var data = {},
							url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
							dataArray = $this.serializeArray(),
							$output = $("#" + $this.attr("data-form-output"));

						for (i = 0; i < dataArray.length; i++) {
							data[dataArray[i].name] = dataArray[i].value;
						}

						$.ajax({
							data: data,
							url: url,
							dataType: 'jsonp',
							error: function (resp, text) {
								$output.html('Server error: ' + text);

								setTimeout(function () {
									$output.removeClass("active");
								}, 4000);
							},
							success: function (resp) {
								$output.html(resp.msg).addClass('active');
								$email[0].value = '';
								var $label = $('[for="' + $email.attr('id') + '"]');
								if ($label.length) $label.removeClass('focus not-empty');

								setTimeout(function () {
									$output.removeClass("active");
								}, 6000);
							},
							beforeSend: function (data) {
								var isNoviBuilder = window.xMode;

								var isValidated = (function () {
									var results, errors = 0;
									var elements = $this.find('[data-constraints]');
									var captcha = null;
									if (elements.length) {
										for (var j = 0; j < elements.length; j++) {

											var $input = $(elements[j]);
											if ((results = $input.regula('validate')).length) {
												for (var k = 0; k < results.length; k++) {
													errors++;
													$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
												}
											} else {
												$input.siblings(".form-validation").text("").parent().removeClass("has-error")
											}
										}

										if (captcha) {
											if (captcha.length) {
												return validateReCaptcha(captcha) && errors === 0
											}
										}

										return errors === 0;
									}
									return true;
								})();

								// Stop request if builder or inputs are invalide
								if (isNoviBuilder || !isValidated)
									return false;

								$output.html('Submitting...').addClass('active');
							}
						});

						return false;
					}, $mailchimpItem, $email));
				}
			}

			// Campaign Monitor ajax subscription
			if (plugins.campaignMonitor.length) {
				for (i = 0; i < plugins.campaignMonitor.length; i++) {
					var $campaignItem = $(plugins.campaignMonitor[i]);

					$campaignItem.on('submit', $.proxy(function (e) {
						var data = {},
							url = this.attr('action'),
							dataArray = this.serializeArray(),
							$output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
							$this = $(this);

						for (i = 0; i < dataArray.length; i++) {
							data[dataArray[i].name] = dataArray[i].value;
						}

						$.ajax({
							data: data,
							url: url,
							dataType: 'jsonp',
							error: function (resp, text) {
								$output.html('Server error: ' + text);

								setTimeout(function () {
									$output.removeClass("active");
								}, 4000);
							},
							success: function (resp) {
								$output.html(resp.Message).addClass('active');

								setTimeout(function () {
									$output.removeClass("active");
								}, 6000);
							},
							beforeSend: function (data) {
								// Stop request if builder or inputs are invalide
								if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
									return false;

								$output.html('Submitting...').addClass('active');
							}
						});

						// Clear inputs after submit
						var inputs = $this[0].getElementsByTagName('input');
						for (var i = 0; i < inputs.length; i++) {
							inputs[i].value = '';
							var label = document.querySelector('[for="' + inputs[i].getAttribute('id') + '"]');
							if (label) label.classList.remove('focus', 'not-empty');
						}

						return false;
					}, $campaignItem));
				}
			}

			// RD Mailform
			if (plugins.rdMailForm.length) {
				let i, j, k,
					msg = {
						'MF000': 'Successfully sent!',
						'MF001': 'Recipients are not set!',
						'MF002': 'Form will not work locally!',
						'MF003': 'Please, define email field in your form!',
						'MF004': 'Please, define type of your form!',
						'MF254': 'Something went wrong with PHPMailer!',
						'MF255': 'Aw, snap! Something went wrong.'
					};

				for (i = 0; i < plugins.rdMailForm.length; i++) {
					let $form = $(plugins.rdMailForm[i]),
						formHasCaptcha = false;

					$form.attr('novalidate', 'novalidate').ajaxForm({
						data: {
							"form-type": $form.attr("data-form-type") || "contact",
							"counter": i
						},
						beforeSubmit: function (arr, $form, options) {
							if (isNoviBuilder)
								return;

							let form = $(plugins.rdMailForm[this.extraData.counter]),
								inputs = form.find("[data-constraints]"),
								output = $("#" + form.attr("data-form-output")),
								captcha = form.find('.recaptcha'),
								captchaFlag = true;

							output.removeClass("active error success");

							if (isValidated(inputs, captcha)) {

								// veify reCaptcha
								if (captcha.length) {
									let captchaToken = captcha.find('.g-recaptcha-response').val(),
										captchaMsg = {
											'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
											'CPT002': 'Something wrong with google reCaptcha'
										};

									formHasCaptcha = true;

									$.ajax({
										method: "POST",
										url: "bat/reCaptcha.php",
										data: {'g-recaptcha-response': captchaToken},
										async: false
									})
										.done(function (responceCode) {
											if (responceCode !== 'CPT000') {
												if (output.hasClass("snackbars")) {
													output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

													setTimeout(function () {
														output.removeClass("active");
													}, 3500);

													captchaFlag = false;
												} else {
													output.html(captchaMsg[responceCode]);
												}

												output.addClass("active");
											}
										});
								}

								if (!captchaFlag) {
									return false;
								}

								form.addClass('form-in-process');

								if (output.hasClass("snackbars")) {
									output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
									output.addClass("active");
								}
							} else {
								return false;
							}
						},
						error: function (result) {
							if (isNoviBuilder)
								return;

							let output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
								form = $(plugins.rdMailForm[this.extraData.counter]);

							output.text(msg[result]);
							form.removeClass('form-in-process');

							if (formHasCaptcha) {
								grecaptcha.reset();
								window.dispatchEvent(new Event('resize'));
							}
						},
						success: function (result) {
							if (isNoviBuilder)
								return;

							let form = $(plugins.rdMailForm[this.extraData.counter]),
								output = $("#" + form.attr("data-form-output")),
								select = form.find('select');

							form
								.addClass('success')
								.removeClass('form-in-process');

							if (formHasCaptcha) {
								grecaptcha.reset();
								window.dispatchEvent(new Event('resize'));
							}

							result = result.length === 5 ? result : 'MF255';
							output.text(msg[result]);

							if (result === "MF000") {
								if (output.hasClass("snackbars")) {
									output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
								} else {
									output.addClass("active success");
								}
							} else {
								if (output.hasClass("snackbars")) {
									output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
								} else {
									output.addClass("active error");
								}
							}

							form.clearForm();

							if (select.length) {
								select.val(null).trigger('change');
							}

							form.find('input, textarea').trigger('blur');

							setTimeout(function () {
								output.removeClass("active error success");
								form.removeClass('success');
							}, 3500);
						}
					});
				}
			}


			// lightGallery
			if (plugins.lightGallery.length) {
				for (let i = 0; i < plugins.lightGallery.length; i++) {
					initLightGallery(plugins.lightGallery[i]);
				}
			}

			// lightGallery item
			if (plugins.lightGalleryItem.length) {
				// Filter carousel items
				let notCarouselItems = [];

				for (let z = 0; z < plugins.lightGalleryItem.length; z++) {
					if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
						!$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
						!$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
						notCarouselItems.push(plugins.lightGalleryItem[z]);
					}
				}

				plugins.lightGalleryItem = notCarouselItems;

				for (let i = 0; i < plugins.lightGalleryItem.length; i++) {
					initLightGalleryItem(plugins.lightGalleryItem[i]);
				}
			}

			// Dynamic lightGallery
			if (plugins.lightDynamicGalleryItem.length) {
				for (let i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
					initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
				}
			}


			// Material Parallax
			if (plugins.materialParallax.length) {
				if (!isNoviBuilder && !isIE && !isMobile) {
					plugins.materialParallax.parallax();

					// heavy pages fix
					$window.on('load', function () {
						setTimeout(function () {
							$window.scroll();
						}, 500);
					});
				} else {
					for (var i = 0; i < plugins.materialParallax.length; i++) {
						var parallax = $(plugins.materialParallax[i]),
							imgPath = parallax.data("parallax-img");

						var parallaxBg = document.createElement('div');
						parallaxBg.classList.add('material-parallax');
						parallax.prepend(parallaxBg);

						parallaxBg.style.backgroundImage = 'url(' + imgPath + ')';
						parallaxBg.style.backgroundSize = 'cover';
					}
				}
			}

			// Select2
			if (plugins.selectFilter.length) {
				for (var i = 0; i < plugins.selectFilter.length; i++) {
					var select = $(plugins.selectFilter[i]);

					select.select2({
						dropdownParent:          $( '.page' ),
						placeholder:             select.attr( 'data-placeholder' ) || null,
						minimumResultsForSearch: select.attr( 'data-minimum-results-search' ) || Infinity,
						containerCssClass:       select.attr( 'data-container-class' ) || null,
						dropdownCssClass:        select.attr( 'data-dropdown-class' ) || null,
						maximumSelectionSize: 3
					});
				}
			}

			// Winona buttons
			if (plugins.buttonWinona.length && !isNoviBuilder && !isIE) {
				initWinonaButtons(plugins.buttonWinona);
			}

			function initWinonaButtons(buttons) {
				for (var i = 0; i < buttons.length; i++) {
					var $button = $(buttons[i]),
						innerContent = $button.html();

					$button.html('');
					$button.append(
						'<div class="content-original">' + innerContent + '</div>'
						+ '<div class="content-dubbed">' + innerContent + '</div>');
				}
			}

			// Slick carousel
			if (plugins.slick.length) {
				for (var i = 0; i < plugins.slick.length; i++) {
					var $slickItem = $(plugins.slick[i]);

					$slickItem.slick({
						slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll'), 10) || 1,
						asNavFor: $slickItem.attr('data-for') || false,
						dots: $slickItem.attr("data-dots") === "true",
						infinite: isNoviBuilder ? false : $slickItem.attr("data-loop") === "true",
						focusOnSelect: true,
						initialSlide: parseInt($slickItem.attr('data-initial-slide'), 10) || 0,
						speed: parseInt($slickItem.attr('data-speed'), 10) || 500,
						arrows: $slickItem.attr("data-arrows") === "true",
						swipe: $slickItem.attr("data-swipe") === "true",
						autoplay: $slickItem.attr("data-autoplay") === "true",
						autoplaySpeed: $slickItem.attr("data-autoplay-speed") ? parseInt($slickItem.attr("data-autoplay-speed")) : 3500,
						vertical: $slickItem.attr("data-vertical") === "true",
						centerMode: $slickItem.attr("data-center-mode") === "true",
						centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
						mobileFirst: true,
						responsive: [
							{
								breakpoint: 0,
								settings: {
									slidesToShow: parseInt($slickItem.attr('data-items'), 10) || 1
								}
							},
							{
								breakpoint: 575,
								settings: {
									slidesToShow: parseInt($slickItem.attr('data-sm-items'), 10) || 1
								}
							},
							{
								breakpoint: 767,
								settings: {
									slidesToShow: parseInt($slickItem.attr('data-md-items'), 10) || 1
								}
							},
							{
								breakpoint: 991,
								settings: {
									slidesToShow: parseInt($slickItem.attr('data-lg-items'), 10) || 1
								}
							},
							{
								breakpoint: 1199,
								settings: {
									slidesToShow: parseInt($slickItem.attr('data-xl-items'), 10) || 1
								}
							}
						]
					})
						.on('afterChange', function (event, slick, currentSlide) {
							var $this = $(this),
								childCarousel = $this.attr('data-child');

							if (childCarousel) {
								$(childCarousel + ' .slick-slide').removeClass('slick-current');
								$(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
							}
						});

					if (parseInt($slickItem.attr('data-initial-slide'), 10)) {
						var currentSlideIndex = parseInt($slickItem.attr('data-initial-slide'), 10),
							activeSlides = $slickItem.find('.slick-active');

						if (currentSlideIndex < activeSlides.length) {
							activeSlides[0].classList.remove('slick-current');
							activeSlides[currentSlideIndex].classList.add('slick-current');
						}
					}

					if ($slickItem.attr('data-fraction')) {
						(function () {
							var fractionElement = document.querySelectorAll($slickItem.attr('data-fraction'))[0],
								fractionCurrent = fractionElement.querySelectorAll('.slick-fraction-current')[0],
								fractionAll = fractionElement.querySelectorAll('.slick-fraction-all')[0];

							$slickItem.on('afterChange', function (slick) {
								fractionCurrent.innerText = leadingZero(this.slick.currentSlide + 1);
								fractionAll.innerText = leadingZero(this.slick.slideCount);
							});

							$slickItem.trigger('afterChange');
						})();
					}
				}
			}

			function leadingZero(decimal) {
				return decimal < 10 && decimal > 0 ? '0' + decimal : decimal;
			}

			// Button Load
			if (plugins.buttonLoad.length) {
				for (var i = 0; i < plugins.buttonLoad.length; i++) {
					var $button = $(plugins.buttonLoad[i]);
					(function ($button) {
						$button.on('click', function () {
							var affectedElements = $('[data-load-trigger = "#' + this.id + '"]');
							$button.addClass('button-load-in-process');

							setTimeout(function () {
								for (var j = 0; j < affectedElements.length; j++) {
									var $currentAffected = $(affectedElements[j]);
									$currentAffected.css({'display': 'block'});
									$currentAffected.slideDown('300', 'linear');

									var isotopeParent = $currentAffected.parents('.isotope');
									if (isotopeParent.length) {
										isotopeParent[0].isotope.layout();
									}
								}

								$button.removeClass('button-load-in-process');
								$button.addClass('button-load-loaded');
							}, 800);
						});
					})($button);
				}
			}

			// Parallax JS
			if (plugins.parallaxJs.length && !isNoviBuilder) {
				for (var i = 0; i < plugins.parallaxJs.length; i++) {
					var scene = plugins.parallaxJs[i];
					new Parallax(scene);
				}
			}

			// Waypoint
			if (plugins.waypoint.length && !isNoviBuilder) {
				for (var i = 0; i < plugins.waypoint.length; i++) {
					var $waypoint = $(plugins.waypoint[i]);
					$waypoint.on('click', (function ($waypoint) {
						return function (e) {
							e.preventDefault();
							e.stopPropagation();
							var offset = $($waypoint.attr('data-waypoint-to')).offset().top + 2;
							if ($waypoint.attr('data-waypoint-relative-to')) {
								var relatives = document.querySelectorAll($waypoint.attr('data-waypoint-relative-to'));
								for (var j = 0; j < relatives.length; j++) {
									offset -= relatives[j].offsetHeight;
								}
							}
							if ($waypoint.attr('data-waypoint-offset')) {
								offset -= $waypoint.attr('data-waypoint-offset');
							}

							$('html, body').stop().animate({
								scrollTop: offset
							}, 800);
						}
					})($waypoint));
				}
			}

			// Typedjs
			if (plugins.typedjs.length && !isNoviBuilder) {
				for (var i = 0; i < plugins.typedjs.length; i++) {
					var node,
						$node = $(plugins.typedjs[i]);
					node = new Typed(plugins.typedjs[i], {
						strings: $node.attr('data-strings').length ? JSON.parse($node.attr('data-strings')) : [''],
						typeSpeed: $node.attr('data-type-speed') ? parseInt($node.attr('data-type-speed'), 10) : 150,
						loop: $node.attr('data-loop') !== 'false',
						backDelay: $node.attr('data-back-delay') ? parseInt($node.attr('data-back-delay'), 10) : 1100
					});
					node.stop();
					document.addEventListener('scroll', function (node, $node) {
						return function () {
							if (isScrolledIntoView($node)) {
								if (node.pause.status) {
									node.start();
								}

							} else if (!node.pause.status) {
								node.stop();
							}
						}
					}(node, $node));
				}
			}

			// Multitoggles
			function toggleElementsVisibility(targets) {
				for (var z = 0; z < targets.length; z++) {
					var hiddenElements = targets[z].querySelectorAll('[aria-hidden="true"]'),
						visibleElements = targets[z].querySelectorAll('[aria-hidden="false"]');

					for (var k = 0; k < hiddenElements.length; k++) {
						hiddenElements[k].setAttribute('aria-hidden', 'false');
					}

					for (var k = 0; k < visibleElements.length; k++) {
						visibleElements[k].setAttribute('aria-hidden', 'true');
					}
				}
			}

			if (plugins.multitoggles.length) {
				for (var i = 0; i < plugins.multitoggles.length; i++) {
					var
						node = plugins.multitoggles[i],
						toggle = new Toggle({
							node: node,
							targets: document.querySelectorAll(node.getAttribute('data-multitoggle')),
							scope: document.querySelectorAll(node.getAttribute('data-scope')),
							isolate: document.querySelectorAll(node.getAttribute('data-isolate'))
						});

					if (plugins.multitoggles[i].classList.contains('content-toggle')) {
						node.addEventListener('click', function () {
							toggleElementsVisibility(this.mt.targets);
						});
					}
				}
			}

			// Anime Js Objects
			function presets(target) {
				return {
					'circles-1': {
						options: {
							duration: 1000,
							easing: 'easeInOutQuad',
							targets: target.querySelectorAll('.box-modern-circle')
						},
						animationStart: {
							loop: true,
							translateX: function (node, item) {
								return item % 2 ? -10 : 10;
							},
							translateY: function (node, item) {
								return item % 2 ? -10 : 10;
							},
							scale: 1.1
						},
						animationEnd: {
							loop: false,
							translateX: 0,
							translateY: 0,
							scale: 1
						}
					},
					'circles-2': {
						options: {
							duration: 1000,
							easing: 'easeInOutQuad',
							targets: target.querySelectorAll('.box-modern-circle')
						},
						animationStart: {
							loop: true,
							translateX: function (node, item) {
								return item % 2 ? -10 : 10;
							},
							translateY: function (node, item) {
								return item % 2 ? -10 : 10;
							},
							scale: function (node, item) {
								return item % 2 ? .8 : .9;
							}
						},
						animationEnd: {
							loop: false,
							translateX: 0,
							translateY: 0,
							scale: 1
						}
					}
				}
			}

			if (plugins.animePresets.length && isDesktop) {
				for (var i = 0; i < plugins.animePresets.length; i++) {
					var preset = plugins.animePresets[i].getAttribute('data-anime');
					applyAnimation(plugins.animePresets[i], presets(plugins.animePresets[i])[preset]);
				}
			}

			// Navbar-related functions
			function updAnchOffset() {
				var
					relatives = document.querySelectorAll(this.dParams.anchor.offsetRef),
					dY = 0;

				for (var j = 0; j < relatives.length; j++) {
					dY -= relatives[j].offsetHeight;
				}

				this.dParams.anchor.offset = dY * 1.05;
			}

			function updStuckOffset() {
				this.dParams.stuck.offset = document.querySelector(this.dParams.stuck.offsetRef).getBoundingClientRect().height;
			}

			function isInView(node) {
				var rect = node.getBoundingClientRect();
				return (
					rect.top >= 0 &&
					rect.left >= 0 &&
					rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
					rect.right <= (window.innerWidth || document.documentElement.clientWidth)
				);
			}


			// Navbar
			if (plugins.navbar.length && !isNoviBuilder) {
				for (var i = 0; i < plugins.navbar.length; i++) {
					var
						navbar,
						node = plugins.navbar[i],
						options = JSON.parse(node.getAttribute('data-navbar'));


					// Плавная прокрутка окна с использованием jQuery
					if (options.anchor !== false) {
						if (!options.anchor) options.anchor = {};

						options.anchor.clickCb = function () {
							var
								target = $(this.anchor),
								top = target.offset().top,
								offset = this.ref.dParams.anchor.offset;

							$('html, body').stop().animate({
								scrollTop: top + offset + 1
							}, 500, 'swing');
						};
					}

					navbar = new Navbar(node, options);


					// Инициализация и обработка кастомных параметров
					if (options.stuck !== false && options.stuck && options.stuck.offsetRef) {
						updStuckOffset.call(navbar);
						window.addEventListener('scroll', updStuckOffset.bind(navbar));
						window.addEventListener('resize', updStuckOffset.bind(navbar));
					}

					if (options.anchor !== false && options.anchor && options.anchor.offsetRef) {
						updAnchOffset.call(navbar);
						window.addEventListener('scroll', updAnchOffset.bind(navbar));
						window.addEventListener('resize', updAnchOffset.bind(navbar));
					}

					// Плавная гризонтальная прокрутка навигации
					node.addEventListener('anchorchange', function () {
						if (this.currentAnchor && !isInView(this.currentAnchor)) {
							var
								nav = $(this.node).find('.navigation'),
								offset = $(this.currentAnchor).parent().offset().left + nav.scrollLeft();

							nav.stop().animate({
								scrollLeft: offset
							}, 400, 'swing');
						}
					}.bind(navbar));
				}
			}


			// Countdown
			if (plugins.countdown.length) {
				for (let i = 0; i < plugins.countdown.length; i++) {
					let
						node = plugins.countdown[i],
						countdown = aCountdown({
							node: node,
							from: node.getAttribute('data-from'),
							to: node.getAttribute('data-to'),
							count: node.getAttribute('data-count'),
							tick: 100,
						});
				}
			}
		}
	);
}());
