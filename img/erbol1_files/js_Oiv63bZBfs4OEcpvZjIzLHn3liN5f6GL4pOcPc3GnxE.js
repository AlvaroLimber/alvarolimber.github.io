//** jQuery Scroll to Top Control script- (c) Dynamic Drive DHTML code library: http://www.dynamicdrive.com.
//** Available/ usage terms at http://www.dynamicdrive.com (March 30th, 09')
//** v1.1 (April 7th, 09'):
//** 1) Adds ability to scroll to an absolute position (from top of page) or specific element on the page instead.
//** 2) Fixes scroll animation not working in Opera. 


var scrolltotop={
	//startline: Integer. Number of pixels from top of doc scrollbar is scrolled before showing control
	//scrollto: Keyword (Integer, or "Scroll_to_Element_ID"). How far to scroll document up when control is clicked on (0=top).
	setting: {startline:100, scrollto: 0, scrollduration:1000, fadeduration:[500, 100]},
	controlHTML: '<div class="backtotop"></div>', //HTML for control, which is auto wrapped in DIV w/ ID="topcontrol"
	controlattrs: {offsetx:5, offsety:5}, //offset of control relative to right/ bottom of window corner
	anchorkeyword: '#top', //Enter href value of HTML anchors on the page that should also act as "Scroll Up" links

	state: {isvisible:false, shouldvisible:false},

	scrollup:function(){
		if (!this.cssfixedsupport) //if control is positioned using JavaScript
			this.$control.css({opacity:0}) //hide control immediately after clicking it
		var dest=isNaN(this.setting.scrollto)? this.setting.scrollto : parseInt(this.setting.scrollto)
		if (typeof dest=="string" && jQuery('#'+dest).length==1) //check element set by string exists
			dest=jQuery('#'+dest).offset().top
		else
			dest=0
		this.$body.animate({scrollTop: dest}, this.setting.scrollduration);
	},

	keepfixed:function(){
		var $window=jQuery(window)
		var controlx=$window.scrollLeft() + $window.width() - this.$control.width() - this.controlattrs.offsetx
		var controly=$window.scrollTop() + $window.height() - this.$control.height() - this.controlattrs.offsety
		this.$control.css({left:controlx+'px', top:controly+'px'})
	},

	togglecontrol:function(){
		var scrolltop=jQuery(window).scrollTop()
		if (!this.cssfixedsupport)
			this.keepfixed()
		this.state.shouldvisible=(scrolltop>=this.setting.startline)? true : false
		if (this.state.shouldvisible && !this.state.isvisible){
			this.$control.stop().animate({opacity:1}, this.setting.fadeduration[0])
			this.state.isvisible=true
		}
		else if (this.state.shouldvisible==false && this.state.isvisible){
			this.$control.stop().animate({opacity:0}, this.setting.fadeduration[1])
			this.state.isvisible=false
		}
	},
	
	init:function(){
		jQuery(document).ready(function($){
			var mainobj=scrolltotop
			var iebrws=document.all
			mainobj.cssfixedsupport=!iebrws || iebrws && document.compatMode=="CSS1Compat" && window.XMLHttpRequest //not IE or IE7+ browsers in standards mode
			mainobj.$body=(window.opera)? (document.compatMode=="CSS1Compat"? $('html') : $('body')) : $('html,body')
			mainobj.$control=$('<div id="topcontrol">'+mainobj.controlHTML+'</div>')
				.css({position:mainobj.cssfixedsupport? 'fixed' : 'absolute', bottom:mainobj.controlattrs.offsety, right:mainobj.controlattrs.offsetx, opacity:0, cursor:'pointer'})
				.attr({title:'Scroll Back to Top'})
				.click(function(){mainobj.scrollup(); return false})
				.appendTo('body')
			if (document.all && !window.XMLHttpRequest && mainobj.$control.text()!='') //loose check for IE6 and below, plus whether control contains any text
				mainobj.$control.css({width:mainobj.$control.width()}) //IE6- seems to require an explicit width on a DIV containing text
			mainobj.togglecontrol()
			$('a[href="' + mainobj.anchorkeyword +'"]').click(function(){
				mainobj.scrollup()
				return false
			})
			$(window).bind('scroll resize', function(e){
				mainobj.togglecontrol()
			})
		})
	}
}

scrolltotop.init();
/*!
 * Bootstrap v3.3.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.1'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.1
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.1'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.1'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var delta = direction == 'prev' ? -1 : 1
    var activeIndex = this.getItemIndex(active)
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.1'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true,
    trigger: '[data-toggle="collapse"]'
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.find('> .panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.1'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.1
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.1'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (that.options.backdrop) that.adjustBackdrop()
      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .prependTo(this.$element)
        .on('click.dismiss.bs.modal', $.proxy(function (e) {
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus.call(this.$element[0])
            : this.hide.call(this)
        }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    if (this.options.backdrop) this.adjustBackdrop()
    this.adjustDialog()
  }

  Modal.prototype.adjustBackdrop = function () {
    this.$backdrop
      .css('height', 0)
      .css('height', this.$element[0].scrollHeight)
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.1'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
    this.arrow()
      .css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isHorizontal ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      var data     = $this.data('bs.tooltip')
      var options  = typeof option == 'object' && option
      var selector = options && options.selector

      if (!data && option == 'destroy') return
      if (selector) {
        if (!data) $this.data('bs.tooltip', (data = {}))
        if (!data[selector]) data[selector] = new Tooltip(this, options)
      } else {
        if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.1
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.1'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      var data     = $this.data('bs.popover')
      var options  = typeof option == 'object' && option
      var selector = options && options.selector

      if (!data && option == 'destroy') return
      if (selector) {
        if (!data) $this.data('bs.popover', (data = {}))
        if (!data[selector]) data[selector] = new Popover(this, options)
      } else {
        if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.1'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.1'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.1
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.1'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && colliderTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $('body').height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
;
﻿/*  This jQuery plugin replaces SVG images in HTML 'img' elements (and optionally CSS in background-images) with
    PNG replacement images.  This is accomplished by the use of a remote image replacement service.
    
    Copyright © 2013-2014 - Authors:
    
    * Dirk Groenen [Bitlabs Development - dirk@bitlabs.nl]            Original author
    
    * Craig Fowler [CSF Software Limited - craig@csf-dev.com]         Redesign and enhancements

    Version 3.0.1
    
    ---

    Copyright 2013-2014 Dirk Groenen

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

/**
 * Replaces matched SVG images in HTML 'img' elements (and optionally CSS background-image properties) with PNG
 * replacement images, generated by a remote server/service API.
 * 
 * -------
 * Options
 * -------
 * * temporaryHoldingImage    [string] This is a URI to an image which will be used as a "holding" image for the SVG
 *                            replacements until the URI of the appropriate PNG replacement has been retrieved from the
 *                            remote server. If set to null (the default behaviour) then no holding image will be used.
 * 
 * * forceReplacements        [boolean] If set to true then SVGMagic will replace SVG images even when the web browser
 *                            reports that it has native SVG support. If set to false (the default behaviour) then
 *                            replacement will only be performed when the web browser does not natively support SVG
 *                            images.
 * 
 * * handleBackgroundImages   [boolean] If set to true then SVGMagic will inspect the CSS background-image property of
 *                            matched elements.  If the background image is an SVG then replacement will additionally
 *                            be performed upon the background image.  If set to false (the default behaviour) then no
 *                            attempt will be made to detect and replace CSS background images.
 * 
 *                            Note that even when this option is enabled, background images are only detected on matched
 *                            elements.  No DOM search is performed to discover background images on (for example) child
 *                            nodes.
 * 
 * * additionalRequestData    [object] This is an object representing key/value pairs of information to send to the
 *                            remote server as part of the request.  The default is an empty object (resulting in no
 *                            additional data being sent).
 * 
 *                            This option is affected by the deprecated options 'secure' and 'dumpcache'.  Presently,
 *                            in order to preserve backwards-compatibility, the keys 'secure' and 'dumpcache' will
 *                            be added to the request data if they are not already present.  The values of these keys
 *                            will contain the respective values of those deprecated options.
 * 
 *                            Additionally, the key 'svgsources' is reserved and will always be overwritten with an
 *                            array of the URIs to the SVG images to be replaced. For this reason, the key 'svgsources'
 *                            must not be used within the additional request data.
 * 
 * * postReplacementCallback  [function(replacedImages)] This is a callback function which is executed after all of the
 *                            image replacement URIs have been retrieved from the remote server and the replacements
 *                            have been performed.
 * 
 *                            The parameter passed to this callback is a JavaScript array of objects which have the
 *                            following structure:
 *                            {
 *                              element             [object] A reference to the jQuery element node upon which the image
 *                                                  replacement has been performed.
 * 
 *                              isBackground        [boolean] True if the the replacement was made upon a CSS
 *                                                  background-image.  Otherwise this is an HTML 'img' element.
 * 
 *                              originalUri         [string] The original URI of the SVG image which has been replaced.
 * 
 *                              replacementUri      [string] The URI of the PNG replacement image.
 *                            }
 * 
 * * remoteServerUri          [string] This is the URI to the remote server API endpoint which converts SVG images into
 *                            PNGs and returns the list of URIs to those PNG replacements.  It is set by default to:
 *                            http://svgmagic.bitlabs.nl/converter.php
 * 
 *                            If you wish to host your own image-conversion server script/service then replace this with
 *                            the URI of your own API endpoint.
 * 
 * * remoteRequestType        [string] This is the type of HTTP request which will be used to communicate with the
 *                            remote server/service endpoint. By default this is set to 'POST'. Be careful if hosting
 *                            a service which accepts HTTP GET requests, as it could be vulnerable to CSRF attacks.
 * 
 * * remoteDataType           [string] This is the data-type sent to and received from the remote server.  By default
 *                            this is set to 'json'.
 * 
 * * replacementUriCreator    [function(jQueryElement, originalUri, isBackground)] If provided, this option alters the
 *                            behaviour of SVGMagic, short-cutting out the initial call to the remote server, to
 *                            retrieve the URIs to the replacement PNG images.  This is suitable for use in specialised
 *                            scenarios when the creation of the URI for the PNG replacements may be accomplished
 *                            entirely in JavaScript.  The server hosting those replacement PNG images must also be
 *                            capable of serving the correct image with only a single GET URI (as the server will not
 *                            have been pre-notified of the path to the SVG source file).  As such, it is most likely to
 *                            be used in hosted applications on a single domain, in which server-side logic has been
 *                            created to serve pre-ordained PNG replacement images.
 * 
 *                            The parameters which this function receives are:
 *                            * [object] A reference to the jQuery object representing the HTML node on which the
 *                              replacement is to be made.
 *                            * [string] The URI of the original SVG image to be replaced.
 *                            * [boolean] True if the replacement is a CSS background-image, false if it is an HTML
 *                              image element.
 * 
 *                            The function (if present) must return a string.  This string indicates the URI to the
 *                            PNG replacement image.  If null is returned then the replacement is skipped and the
 *                            original SVG image is left in-place.
 * 
 *                            The default behaviour (in which this function is null/not-provided) uses a call to a
 *                            remote server/API endpoint containing a list of the URIs of the SVG images to be replaced,
 *                            The response is parsed for the URIs of the replacement PNG images. 
 * 
 * * debug          [boolean] When enabled the script will provide usefull debug information. By default this option is
 *                            set to 'false'. Please remember to disable this option when in a production environment.
 * ------------------
 * Deprecated options
 * ------------------
 * * preloader                [string or boolean] This is the URI to an image file which is used as a "holding" image
 *                            for your SVG images while the PNG replacements load from the remote server.  If set to
 *                            boolean false (the default behaviour) then no such holding image is used.
 * 
 *                            DEPRECATED: Use 'temporaryHoldingImage' instead.  If 'temporaryHoldingImage' is set then
 *                            this option is ignored.
 * 
 * * testmode                 [boolean] If set to true then the SVG replacement will be forced on all browsers,
 *                            including those which report that they support SVG natively.  If set to false (the default
 *                            behaviour) then the SVG replacement will only be performed upon browsers which do not
 *                            support it natively.
 * 
 *                            DEPRECATED: Use 'forceReplacements' instead.
 * 
 * * secure                   [boolean] The value (true or false) of this option is passed to the remote SVG replacement
 *                            server as part of the HTTP POST parameters.  Whilst the server may honour it or not, it is
 *                            intended that if the value is true, then the remote server will return a series of HTTPS
 *                            URIs (for the PNG replacement images). If set to false (the default behaviour) then the
 *                            remote server should return HTTP (non-secured) URIs.
 * 
 *                            Regardless of the setting of this option - the initial call to the remote server will be
 *                            performed via unsecured HTTP.
 * 
 *                            DEPRECATED: Use 'additionalRequestData' instead, adding data which the server will
 *                            interpret in order to serve HTTPS image URIs.  The value of this option will be appended
 *                            to the additional request data before it is sent to the server.
 * 
 * * callback                 [function()] An optional callback function which executes once all of the PNG replacement
 *                            image URIs have been retrieved from the remote server and all of the SVG images have had
 *                            their URIs replaced.  This is not quite a callback which executes after the replacement
 *                            images have loaded.  If the value is set to false (the default behaviour) then no
 *                            additional callback is executed.  No parameters are passed to this callback.
 * 
 *                            DEPRECATED: Use 'postReplacementCallback' instead.  If 'postReplacementCallback' is set
 *                            then this option is ignored.
 * 
 * * backgroundimage          [boolean] If set to true then additional inspection will be performed upon all matched
 *                            elements in order to find a CSS background-image property.  If such a property is found
 *                            then it will be included in the replacement process.  If set to false (the default
 *                            behaviour) then no additional work will be performed to find background-images which are
 *                            SVG.
 * 
 *                            DEPRECATED: Use 'handleBackgroundImages' instead.
 * 
 * * dumpcache                [boolean] The value (true or false) of this option is passed to the remote SVG replacement
 *                            server as part of the HTTP POST parameters.  If set to true, then the server is requested
 *                            to clear any cached PNG copy of the replaced SVG image.  This will result in the remote
 *                            server re-generating the PNG replacement.  If set to false (the default behaviour) then
 *                            the remote server is expected to serve cached PNG replacement images where possible. 
 * 
 *                            DEPRECATED: Use 'additionalRequestData' instead, adding data which the server will
 *                            interpret as a request to drop its cache.  The value of this option will be appended
 *                            to the additional request data before it is sent to the server.
 */

(function($) {
    $.fn.svgmagic = function(givenOptions)
    {
        var
        defaultOptions = {
            // Deprecated options
            preloader:              false,
            testmode:               false,
            secure:                 false,
            callback:               false,
            backgroundimage:        false,
            dumpcache:              false,

            // Replacements for deprecated options
            temporaryHoldingImage:  null,
            forceReplacements:      false,
            handleBackgroundImages: false,
            additionalRequestData:  {},
            postReplacementCallback:null,

            // New options
            remoteServerUri:        'http://bitlabs.nl/svgmagic/converter/3/',
            remoteRequestType:      'POST',
            remoteDataType:         'jsonp',
            debug:                  false,
            
            // TODO: Implement this option
            replacementUriCreator:  null
        },
        untidyOptions = $.extend(defaultOptions, givenOptions),
        options = tidyOptions(untidyOptions),
        holdingImageTimeouts = {},
        matchedNodes = this,
        images = [],
        imgElementName = 'img',
        srcAttributeName = 'src',
        backgroundImagePropertyName = 'background-image',
        urlMatcher = /^url\(["']?([^"'()]+)["']?\)$/,
        svgExtension = /\.svg$/,
        svgDataUri = /^data:image\/svg\+xml/,
        holdingImageTimeoutDuration = 500,
        VERSION = 3.0;
    
        /**
         * Check if the remoteServerUri has to be replaced with https
         */
        if(window.location.protocol == "https:" || options.additionalRequestData.secure)
        {
            options.remoteServerUri = options.remoteServerUri.replace("http://", "https://");

        }

        log(false, "Using " + options.remoteServerUri + " as remote server");
    
        /**
         * The place where all magic starts
         */
        if(shouldPerformReplacement(options))
        {
            getReplacementUris(options, matchedNodes);
        }
    
        /**
         * Include JSON if it's not available in the browser
         */
        if (typeof JSON == 'undefined') {
            if(typeof JSON!=="object"){JSON={}}(function(){"use strict";function f(e){return e<10?"0"+e:e}function quote(e){escapable.lastIndex=0;return escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t==="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];if(a&&typeof a==="object"&&typeof a.toJSON==="function"){a=a.toJSON(e)}if(typeof rep==="function"){a=rep.call(t,e,a)}switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a){return"null"}gap+=indent;u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1){u[n]=str(n,a)||"null"}i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]";gap=o;return i}if(rep&&typeof rep==="object"){s=rep.length;for(n=0;n<s;n+=1){if(typeof rep[n]==="string"){r=rep[n];i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}else{for(r in a){if(Object.prototype.hasOwnProperty.call(a,r)){i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}";gap=o;return i}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b"," ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;if(typeof JSON.stringify!=="function"){JSON.stringify=function(e,t,n){var r;gap="";indent="";if(typeof n==="number"){for(r=0;r<n;r+=1){indent+=" "}}else if(typeof n==="string"){indent=n}rep=t;if(t&&typeof t!=="function"&&(typeof t!=="object"||typeof t.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":e})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i==="object"){for(n in i){if(Object.prototype.hasOwnProperty.call(i,n)){r=walk(i,n);if(r!==undefined){i[n]=r}else{delete i[n]}}}}return reviver.call(e,t,i)}var j;text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})()
        }
    
        /**
         * Determines whether or not image replacements should be performed.
         * 
         * @return [boolean] True if SVG replacements should be made, false if not.
         */
        function shouldPerformReplacement(opts)
        {
            return opts.forceReplacements || !document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
        }
    
        /**
         * Builds and returns an array of all of the matched image elements and 'elements which require background-image
         * replacements'.  These objects contain a reference to the element, as well as the image URI.
         * 
         * @return [array] - an array of objects containing information about the images to be replaced.  See
         *         'buildImageReference' for a specification of the contained objects.
         */
        function buildImageList(opts, nodes)
        {
            var output = [];
      
            nodes.each(function() {
                var timeout, $this = $(this);

                if($this.attr(srcAttributeName))
                {
                    var result = buildImageReference($this.attr(srcAttributeName), $this, false);
                    if(result)
                    {
                        output.push(result);

                        if(opts.temporaryHoldingImage)
                        {
                            timeout = setTimeout(function() {
                                $this.attr(srcAttributeName, opts.temporaryHoldingImage);
                            }, holdingImageTimeoutDuration);

                            holdingImageTimeouts[output.length - 1] = timeout;
                        }
                    }
                }

                if(opts.handleBackgroundImages && $this.css(backgroundImagePropertyName) && $this.css(backgroundImagePropertyName) != 'none')
                {
                    var result = buildImageReference(urlMatcher.exec($this.css(backgroundImagePropertyName))[1], $this, true);
                    if(result)
                    {
                        output.push(result);
                    }
                }
            });

            log(false, ["Builded image list", output]);
      
            return output;
        }
    
        /**
         * Builds a single image reference object, as would be returned as part of the array created by 'buildImageList'.
         * 
         * @return [object] An object containing information about a single SVG image to replace.
         */
        function buildImageReference(imageUri, element, isBackground)
        {
            var output = null;

            if(svgExtension.test(imageUri) || svgDataUri.test(imageUri))
            {
                var tempImage = new Image();
                tempImage.src = imageUri;

                output = {
                    element: element,
                    isBackground: isBackground,
                    originalUri: tempImage.src,
                    replacementUri: null
                };
            }

            return output;
        }
    
        /**
         * The core functionality of this plugin, which makes the call to the remote service endpoint with a collection of
         * SVG image URIs for which PNG replacements are required, and then proceeds to handle the result.
         */
        function getReplacementUris(opts, nodes)
        {
            var replacementFunction = opts.replacementUriCreator;
            images = buildImageList(opts, nodes);

            if(images.length > 0)
            {
                if(replacementFunction && typeof replacementFunction == 'function')
                {
                    for(var i = 0; i < images.length; i++)
                    {
                        var image = images[i];
                        image.replacementUri = replacementFunction(image.element, image.originalUri, image.isBackground);
                    }

                    performReplacements(opts);
                }
                else
                {
                    getReplacementUrisFromRemoteService(opts);
                }
            }
        }
    
        /**
         * Gets all of the replacement image URIs from a remote server using an API call.
         */
        function getReplacementUrisFromRemoteService(opts)
        {
            var
            sources = [],
            data = {};

            for(var i = 0; i < images.length; i++)
            {
                sources.push(images[i].originalUri);
            }

            // Get baseurl
            var baseUrl = window.location.href.split('/');
            $.extend(data, opts.additionalRequestData, { svgsources: sources, version: VERSION, origin: baseUrl[2] });

            $.ajax({
                dataType: opts.remoteDataType,
                method: opts.remoteRequestType,
                url: opts.remoteServerUri,
                data: data,
                timeout: 3000,
                success: function(response, textStatus, jqXHR) {
                    for(var i = 0; i < images.length; i++)
                    {
                        var image = images[i],
                            responseUri = response.images[i].image;

                        image.replacementUri = responseUri;
                        image.error = response.images[i].error;
                        image.responseMsg = response.images[i].msg;
                        image.filename = response.images[i].filename;
                    }

                    performReplacements(opts);
                },
                error: function(){
                    log(true, "The request took longer than 3 seconds to complete. No image were replaced. Use the developer tools to check wheter the server responded with an error.")
                }
            });
        }
    
        /**
         * Performs image replacements using the result from the remote replacement service.
         */
        function performReplacements(opts)
        {
            for(var i = 0; i < images.length; i++)
            {
                var image = images[i], newUri = image.replacementUri;

                if(!newUri)
                {
                    log(true, image.filename + ": No new url received");
                    continue;
                }
                else if(image.error)
                {
                    log(true, image.filename + ": " + image.responseMsg);
                    continue;
                }
                else if(!image.isBackground)
                {
                    log(false, image.filename + ": Image replaced. Server responded with: " + image.responseMsg);

                    if(opts.temporaryHoldingImage)
                    {
                        clearTimeout(holdingImageTimeouts[i]);
                    }
                    image.element.attr(srcAttributeName, newUri);
                }
                else
                {
                    log(false, image.filename + ": Background image replaced. Server responded with: " + image.responseMsg);
                    image.element.css(backgroundImagePropertyName, 'url("' + newUri + '")');
                }
            }

            if(opts.postReplacementCallback && typeof opts.postReplacementCallback == 'function')
            {
                opts.postReplacementCallback(images);
            }
        }
        
        /**
         * Tidies up an object containing options for this plugin.  Takes any deprecated options (where set) and writes
         * them into the equivalent replacement option.
         */
        function tidyOptions(originalOptions)
        {
            if(!originalOptions.temporaryHoldingImage && originalOptions.preloader && typeof originalOptions.preloader == 'string')
            {
                originalOptions.temporaryHoldingImage = originalOptions.preloader;
            }

            if(originalOptions.testmode && typeof originalOptions.testmode == 'boolean')
            {
                originalOptions.forceReplacements = true;
            }

            if(!originalOptions.postReplacementCallback && originalOptions.callback && typeof originalOptions.callback == 'function')
            {
                originalOptions.postReplacementCallback = function(replacedImages)
                {
                    originalOptions.callback();
                };
            }

            if(!originalOptions.additionalRequestData['secure'])
            {
                originalOptions.additionalRequestData.secure = originalOptions.secure;
            }
            if(!originalOptions.additionalRequestData['dumpcache'])
            {
                originalOptions.additionalRequestData.dumpcache = originalOptions.dumpcache;
            }

            return originalOptions;
        }

        /*
         * Create console log message of option has been enabled
         */
        function log(error, msg){
            if(options.debug){
                if(error)
                    console.error(msg)
                else
                    console.log(msg);
            }
        }

        // Return the original jQuery object, standard jQuery behaviour.
        return this;
    };
}(jQuery));
;
(function ($) {
  $(document).ready(function(){
    $('#logo-erbol-img').svgmagic();
    
    if($(document).width() < 768) {
      $("#edit-search-block-form--2").css("width", 0);
      $(".search-box").find(".form-submit").hide();
      //#edit-search-block-form--2 is the input field that I wish to expand/retract
      EnlargeInputWidth("#edit-search-block-form--2", "#edit-search-block-form--2");
    }

    $('#modal-image').modal();


    $('#accordion-map').click(function (e) {
      var iframe_height = parseInt($('#iframe-flexible').css('height'));
      
      if(iframe_height > 600) {
        $(this).removeClass('glyphicon-arrow-up');
        $(this).addClass('glyphicon-arrow-down');
        $('#iframe-flexible').stop().animate({height:174});
        $('#iframe-flexible').load();
      }
      else {
        $(this).removeClass('glyphicon-arrow-down');
        $(this).addClass('glyphicon-arrow-up');
        $('#iframe-flexible').stop().animate({height:624});
        $('#iframe-flexible').load();
      }
    });
    
    function EnlargeInputWidth(input_selector, width_selector){
      $(input_selector).focus(function(){
        var tmp_search_orig_width = $(width_selector).width();
        $(width_selector).data("original_width", tmp_search_orig_width)
                                 .css("width", "90%")
                                 .css("transition", "width 1s ease-out");
      });
      $(input_selector).blur(function(){ 
        $(width_selector).css("width", $(width_selector).data("original_width")+"px"); 
      });
    }

    $("#iframe-flexible").load(function() {
      $(this).height( $(this).contents().find("html").height() );
    });
  });
})(jQuery);
;
(function ($) {
  $(document).ready(function(){
    $(window).on('resize', function(event){
      
      if ($('.erbol-bootstrap-home-sections').length > 0) {
        var screen_width = $(this).width();
        
        if(screen_width < 977) {
          resize_tablets_smarts();
        }
        else {
          resize_desktop();
        }
        reorganizer_notes();
      }
    });

    $(window).resize();

    function reorganizer_notes() { 
      if($(window).width() >= 768) {
        if(!$('.erbol-note').hasClass('col-xs-12')) {
          $('.erbol-note').addClass('col-xs-12 col-sm-6 col-md-6 col-lg-6');
        }

        var height_der = 0;
        $('.erbol-right').each(function () {
          $('.erbol-right').addClass('erbol-note-right');
          $(this).css('top', height_der);
          height_der = height_der + $(this).height();
        });

        $('#erbol-home-section-middle-space').height(height_der);
      }
      else {
        $('.erbol-note').removeClass('col-xs-12 col-sm-6 col-md-6 col-lg-6');
        $('.erbol-right').each(function () {
          $('.erbol-right').removeClass('erbol-note-right');
          $(this).css('top', 'initial');
          $(this).css('height', 'initial');
        });
      }
    }

    function resize_tablets_smarts() {
      $('.erbol-bootstrap-home-sections').addClass('swiper-container');

      var swiper_wrapper = $('.erbol-bootstrap-home-sections').children().first();
      swiper_wrapper.addClass('swiper-wrapper');

      var col_2 = $('#erbol-column-2');
      col_2.addClass('swiper-slide');

      if($('#erbol-column-1').length == 0) {
        col_2.before('<div id="erbol-column-1" class="erbol-column swiper-slide row col-xs-12 col-sm-12 col-md-12 col-lg-12"></div>');
      }
      if($('#erbol-column-3').length == 0) {
        col_2.after('<div id="erbol-column-3" class="erbol-column swiper-slide row col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="row"></div></div>');
      }

      if($('#erbol-home-section-more').length == 1) {
        $("#erbol-home-section-more").appendTo("#erbol-column-3>.row");
      }
      if($('#erbol-home-section-right-3').length == 1) {
        $("#erbol-home-section-right-3").appendTo("#erbol-column-3>.row");
        $("#erbol-home-section-right-3").addClass('col-xs-12 col-sm-6 col-md-12 col-lg-12');
      }
      if($('#erbol-home-section-right-1').length == 1) {
        $("#erbol-home-section-right-1").appendTo("#erbol-column-3>.row");
        $("#erbol-home-section-right-1").addClass('col-xs-12 col-sm-6 col-md-12 col-lg-12');
      }
      if($('#erbol-home-section-more-2').length == 1) {
        $("#erbol-home-section-more-2").appendTo("#erbol-column-3>.row");
      }
      if($('#erbol-home-section-right-2').length == 1) {
        $("#erbol-home-section-right-2").appendTo("#erbol-column-1");
      }

      $('.swiper-erbol-button').css('display', 'block');

      var swiper = new Swiper('.swiper-container', {
        initialSlide: 1,slidesPerView: 'auto',
        paginationClickable: true,
        nextButton: '.swiper-erbol-button-next',
        prevButton: '.swiper-erbol-button-prev',
        spaceBetween: 2});
    }

    function resize_desktop() {
      if($('.erbol-bootstrap-home-sections').hasClass('swiper-container')) {
        $('.erbol-bootstrap-home-sections').removeClass('swiper-container swiper-container-horizontal');

        var swiper_wrapper = $('.erbol-bootstrap-home-sections').children().first();
        swiper_wrapper.removeClass('swiper-wrapper').removeAttr('style');

        var col_2 = $('#erbol-column-2');
        col_2.removeClass('swiper-slide').removeAttr('style');

        $('.swiper-erbol-button').css('display', 'none');

        $("#erbol-home-section-right-1").appendTo("#erbol-column-3-desktop");
        $("#erbol-home-section-right-2").appendTo("#erbol-column-3-desktop");
        $("#erbol-home-section-right-3").appendTo("#erbol-column-3-desktop");
        $("#erbol-home-section-more").insertAfter("#erbol-home-section-left-middle");
        $("#erbol-home-section-more-2").insertAfter("#erbol-home-section-left-middle-2");

        $("#erbol-home-section-right-3").removeClass('col-xs-12 col-sm-6 col-md-12 col-lg-12');
        $("#erbol-home-section-right-1").removeClass('col-xs-12 col-sm-6 col-md-12 col-lg-12');

        $('#erbol-column-1').remove();
        $('#erbol-column-3').remove();
      }
    }
  });
})(jQuery);;
/**
 * Swiper 3.1.2
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * 
 * http://www.idangero.us/swiper/
 * 
 * Copyright 2015, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 * 
 * Licensed under MIT
 * 
 * Released on: August 22, 2015
 */
!function(){"use strict";function e(e){e.fn.swiper=function(a){var r;return e(this).each(function(){var e=new t(this,a);r||(r=e)}),r}}var a,t=function(e,s){function i(){return"horizontal"===w.params.direction}function n(e){return Math.floor(e)}function o(){w.autoplayTimeoutId=setTimeout(function(){w.params.loop?(w.fixLoop(),w._slideNext()):w.isEnd?s.autoplayStopOnLast?w.stopAutoplay():w._slideTo(0):w._slideNext()},w.params.autoplay)}function l(e,t){var r=a(e.target);if(!r.is(t))if("string"==typeof t)r=r.parents(t);else if(t.nodeType){var s;return r.parents().each(function(e,a){a===t&&(s=t)}),s?t:void 0}return 0===r.length?void 0:r[0]}function d(e,a){a=a||{};var t=window.MutationObserver||window.WebkitMutationObserver,r=new t(function(e){e.forEach(function(e){w.onResize(!0),w.emit("onObserverUpdate",w,e)})});r.observe(e,{attributes:"undefined"==typeof a.attributes?!0:a.attributes,childList:"undefined"==typeof a.childList?!0:a.childList,characterData:"undefined"==typeof a.characterData?!0:a.characterData}),w.observers.push(r)}function p(e){e.originalEvent&&(e=e.originalEvent);var a=e.keyCode||e.charCode;if(!w.params.allowSwipeToNext&&(i()&&39===a||!i()&&40===a))return!1;if(!w.params.allowSwipeToPrev&&(i()&&37===a||!i()&&38===a))return!1;if(!(e.shiftKey||e.altKey||e.ctrlKey||e.metaKey||document.activeElement&&document.activeElement.nodeName&&("input"===document.activeElement.nodeName.toLowerCase()||"textarea"===document.activeElement.nodeName.toLowerCase()))){if(37===a||39===a||38===a||40===a){var t=!1;if(w.container.parents(".swiper-slide").length>0&&0===w.container.parents(".swiper-slide-active").length)return;var r={left:window.pageXOffset,top:window.pageYOffset},s=window.innerWidth,n=window.innerHeight,o=w.container.offset();w.rtl&&(o.left=o.left-w.container[0].scrollLeft);for(var l=[[o.left,o.top],[o.left+w.width,o.top],[o.left,o.top+w.height],[o.left+w.width,o.top+w.height]],d=0;d<l.length;d++){var p=l[d];p[0]>=r.left&&p[0]<=r.left+s&&p[1]>=r.top&&p[1]<=r.top+n&&(t=!0)}if(!t)return}i()?((37===a||39===a)&&(e.preventDefault?e.preventDefault():e.returnValue=!1),(39===a&&!w.rtl||37===a&&w.rtl)&&w.slideNext(),(37===a&&!w.rtl||39===a&&w.rtl)&&w.slidePrev()):((38===a||40===a)&&(e.preventDefault?e.preventDefault():e.returnValue=!1),40===a&&w.slideNext(),38===a&&w.slidePrev())}}function u(e){e.originalEvent&&(e=e.originalEvent);var a=w.mousewheel.event,t=0;if(e.detail)t=-e.detail;else if("mousewheel"===a)if(w.params.mousewheelForceToAxis)if(i()){if(!(Math.abs(e.wheelDeltaX)>Math.abs(e.wheelDeltaY)))return;t=e.wheelDeltaX}else{if(!(Math.abs(e.wheelDeltaY)>Math.abs(e.wheelDeltaX)))return;t=e.wheelDeltaY}else t=e.wheelDelta;else if("DOMMouseScroll"===a)t=-e.detail;else if("wheel"===a)if(w.params.mousewheelForceToAxis)if(i()){if(!(Math.abs(e.deltaX)>Math.abs(e.deltaY)))return;t=-e.deltaX}else{if(!(Math.abs(e.deltaY)>Math.abs(e.deltaX)))return;t=-e.deltaY}else t=Math.abs(e.deltaX)>Math.abs(e.deltaY)?-e.deltaX:-e.deltaY;if(w.params.mousewheelInvert&&(t=-t),w.params.freeMode){var r=w.getWrapperTranslate()+t*w.params.mousewheelSensitivity;if(r>0&&(r=0),r<w.maxTranslate()&&(r=w.maxTranslate()),w.setWrapperTransition(0),w.setWrapperTranslate(r),w.updateProgress(),w.updateActiveIndex(),w.params.freeModeSticky&&(clearTimeout(w.mousewheel.timeout),w.mousewheel.timeout=setTimeout(function(){w.slideReset()},300)),0===r||r===w.maxTranslate())return}else{if((new window.Date).getTime()-w.mousewheel.lastScrollTime>60)if(0>t)if(w.isEnd&&!w.params.loop||w.animating){if(w.params.mousewheelReleaseOnEdges)return!0}else w.slideNext();else if(w.isBeginning&&!w.params.loop||w.animating){if(w.params.mousewheelReleaseOnEdges)return!0}else w.slidePrev();w.mousewheel.lastScrollTime=(new window.Date).getTime()}return w.params.autoplay&&w.stopAutoplay(),e.preventDefault?e.preventDefault():e.returnValue=!1,!1}function c(e,t){e=a(e);var r,s,n;r=e.attr("data-swiper-parallax")||"0",s=e.attr("data-swiper-parallax-x"),n=e.attr("data-swiper-parallax-y"),s||n?(s=s||"0",n=n||"0"):i()?(s=r,n="0"):(n=r,s="0"),s=s.indexOf("%")>=0?parseInt(s,10)*t+"%":s*t+"px",n=n.indexOf("%")>=0?parseInt(n,10)*t+"%":n*t+"px",e.transform("translate3d("+s+", "+n+",0px)")}function m(e){return 0!==e.indexOf("on")&&(e=e[0]!==e[0].toUpperCase()?"on"+e[0].toUpperCase()+e.substring(1):"on"+e),e}if(!(this instanceof t))return new t(e,s);var f={direction:"horizontal",touchEventsTarget:"container",initialSlide:0,speed:300,autoplay:!1,autoplayDisableOnInteraction:!0,iOSEdgeSwipeDetection:!1,iOSEdgeSwipeThreshold:20,freeMode:!1,freeModeMomentum:!0,freeModeMomentumRatio:1,freeModeMomentumBounce:!0,freeModeMomentumBounceRatio:1,freeModeSticky:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",coverflow:{rotate:50,stretch:0,depth:100,modifier:1,slideShadows:!0},cube:{slideShadows:!0,shadow:!0,shadowOffset:20,shadowScale:.94},fade:{crossFade:!1},parallax:!1,scrollbar:null,scrollbarHide:!0,keyboardControl:!1,mousewheelControl:!1,mousewheelReleaseOnEdges:!1,mousewheelInvert:!1,mousewheelForceToAxis:!1,mousewheelSensitivity:1,hashnav:!1,spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:"column",slidesPerGroup:1,centeredSlides:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,onlyExternal:!1,threshold:0,touchMoveStopPropagation:!0,pagination:null,paginationElement:"span",paginationClickable:!1,paginationHide:!1,paginationBulletRender:null,resistance:!0,resistanceRatio:.85,nextButton:null,prevButton:null,watchSlidesProgress:!1,watchSlidesVisibility:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,lazyLoading:!1,lazyLoadingInPrevNext:!1,lazyLoadingOnTransitionStart:!1,preloadImages:!0,updateOnImagesReady:!0,loop:!1,loopAdditionalSlides:0,loopedSlides:null,control:void 0,controlInverse:!1,controlBy:"slide",allowSwipeToPrev:!0,allowSwipeToNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",slideClass:"swiper-slide",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",slideNextClass:"swiper-slide-next",slidePrevClass:"swiper-slide-prev",wrapperClass:"swiper-wrapper",bulletClass:"swiper-pagination-bullet",bulletActiveClass:"swiper-pagination-bullet-active",buttonDisabledClass:"swiper-button-disabled",paginationHiddenClass:"swiper-pagination-hidden",observer:!1,observeParents:!1,a11y:!1,prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}",runCallbacksOnInit:!0},h=s&&s.virtualTranslate;s=s||{};for(var g in f)if("undefined"==typeof s[g])s[g]=f[g];else if("object"==typeof s[g])for(var v in f[g])"undefined"==typeof s[g][v]&&(s[g][v]=f[g][v]);var w=this;if(w.version="3.1.0",w.params=s,w.classNames=[],"undefined"!=typeof a&&"undefined"!=typeof r&&(a=r),("undefined"!=typeof a||(a="undefined"==typeof r?window.Dom7||window.Zepto||window.jQuery:r))&&(w.$=a,w.container=a(e),0!==w.container.length)){if(w.container.length>1)return void w.container.each(function(){new t(this,s)});w.container[0].swiper=w,w.container.data("swiper",w),w.classNames.push("swiper-container-"+w.params.direction),w.params.freeMode&&w.classNames.push("swiper-container-free-mode"),w.support.flexbox||(w.classNames.push("swiper-container-no-flexbox"),w.params.slidesPerColumn=1),(w.params.parallax||w.params.watchSlidesVisibility)&&(w.params.watchSlidesProgress=!0),["cube","coverflow"].indexOf(w.params.effect)>=0&&(w.support.transforms3d?(w.params.watchSlidesProgress=!0,w.classNames.push("swiper-container-3d")):w.params.effect="slide"),"slide"!==w.params.effect&&w.classNames.push("swiper-container-"+w.params.effect),"cube"===w.params.effect&&(w.params.resistanceRatio=0,w.params.slidesPerView=1,w.params.slidesPerColumn=1,w.params.slidesPerGroup=1,w.params.centeredSlides=!1,w.params.spaceBetween=0,w.params.virtualTranslate=!0,w.params.setWrapperSize=!1),"fade"===w.params.effect&&(w.params.slidesPerView=1,w.params.slidesPerColumn=1,w.params.slidesPerGroup=1,w.params.watchSlidesProgress=!0,w.params.spaceBetween=0,"undefined"==typeof h&&(w.params.virtualTranslate=!0)),w.params.grabCursor&&w.support.touch&&(w.params.grabCursor=!1),w.wrapper=w.container.children("."+w.params.wrapperClass),w.params.pagination&&(w.paginationContainer=a(w.params.pagination),w.params.paginationClickable&&w.paginationContainer.addClass("swiper-pagination-clickable")),w.rtl=i()&&("rtl"===w.container[0].dir.toLowerCase()||"rtl"===w.container.css("direction")),w.rtl&&w.classNames.push("swiper-container-rtl"),w.rtl&&(w.wrongRTL="-webkit-box"===w.wrapper.css("display")),w.params.slidesPerColumn>1&&w.classNames.push("swiper-container-multirow"),w.device.android&&w.classNames.push("swiper-container-android"),w.container.addClass(w.classNames.join(" ")),w.translate=0,w.progress=0,w.velocity=0,w.lockSwipeToNext=function(){w.params.allowSwipeToNext=!1},w.lockSwipeToPrev=function(){w.params.allowSwipeToPrev=!1},w.lockSwipes=function(){w.params.allowSwipeToNext=w.params.allowSwipeToPrev=!1},w.unlockSwipeToNext=function(){w.params.allowSwipeToNext=!0},w.unlockSwipeToPrev=function(){w.params.allowSwipeToPrev=!0},w.unlockSwipes=function(){w.params.allowSwipeToNext=w.params.allowSwipeToPrev=!0},w.params.grabCursor&&(w.container[0].style.cursor="move",w.container[0].style.cursor="-webkit-grab",w.container[0].style.cursor="-moz-grab",w.container[0].style.cursor="grab"),w.imagesToLoad=[],w.imagesLoaded=0,w.loadImage=function(e,a,t,r){function s(){r&&r()}var i;e.complete&&t?s():a?(i=new window.Image,i.onload=s,i.onerror=s,i.src=a):s()},w.preloadImages=function(){function e(){"undefined"!=typeof w&&null!==w&&(void 0!==w.imagesLoaded&&w.imagesLoaded++,w.imagesLoaded===w.imagesToLoad.length&&(w.params.updateOnImagesReady&&w.update(),w.emit("onImagesReady",w)))}w.imagesToLoad=w.container.find("img");for(var a=0;a<w.imagesToLoad.length;a++)w.loadImage(w.imagesToLoad[a],w.imagesToLoad[a].currentSrc||w.imagesToLoad[a].getAttribute("src"),!0,e)},w.autoplayTimeoutId=void 0,w.autoplaying=!1,w.autoplayPaused=!1,w.startAutoplay=function(){return"undefined"!=typeof w.autoplayTimeoutId?!1:w.params.autoplay?w.autoplaying?!1:(w.autoplaying=!0,w.emit("onAutoplayStart",w),void o()):!1},w.stopAutoplay=function(e){w.autoplayTimeoutId&&(w.autoplayTimeoutId&&clearTimeout(w.autoplayTimeoutId),w.autoplaying=!1,w.autoplayTimeoutId=void 0,w.emit("onAutoplayStop",w))},w.pauseAutoplay=function(e){w.autoplayPaused||(w.autoplayTimeoutId&&clearTimeout(w.autoplayTimeoutId),w.autoplayPaused=!0,0===e?(w.autoplayPaused=!1,o()):w.wrapper.transitionEnd(function(){w&&(w.autoplayPaused=!1,w.autoplaying?o():w.stopAutoplay())}))},w.minTranslate=function(){return-w.snapGrid[0]},w.maxTranslate=function(){return-w.snapGrid[w.snapGrid.length-1]},w.updateContainerSize=function(){var e,a;e="undefined"!=typeof w.params.width?w.params.width:w.container[0].clientWidth,a="undefined"!=typeof w.params.height?w.params.height:w.container[0].clientHeight,0===e&&i()||0===a&&!i()||(e=e-parseInt(w.container.css("padding-left"),10)-parseInt(w.container.css("padding-right"),10),a=a-parseInt(w.container.css("padding-top"),10)-parseInt(w.container.css("padding-bottom"),10),w.width=e,w.height=a,w.size=i()?w.width:w.height)},w.updateSlidesSize=function(){w.slides=w.wrapper.children("."+w.params.slideClass),w.snapGrid=[],w.slidesGrid=[],w.slidesSizesGrid=[];var e,a=w.params.spaceBetween,t=-w.params.slidesOffsetBefore,r=0,s=0;"string"==typeof a&&a.indexOf("%")>=0&&(a=parseFloat(a.replace("%",""))/100*w.size),w.virtualSize=-a,w.slides.css(w.rtl?{marginLeft:"",marginTop:""}:{marginRight:"",marginBottom:""});var o;w.params.slidesPerColumn>1&&(o=Math.floor(w.slides.length/w.params.slidesPerColumn)===w.slides.length/w.params.slidesPerColumn?w.slides.length:Math.ceil(w.slides.length/w.params.slidesPerColumn)*w.params.slidesPerColumn);var l,d=w.params.slidesPerColumn,p=o/d,u=p-(w.params.slidesPerColumn*p-w.slides.length);for(e=0;e<w.slides.length;e++){l=0;var c=w.slides.eq(e);if(w.params.slidesPerColumn>1){var m,f,h;"column"===w.params.slidesPerColumnFill?(f=Math.floor(e/d),h=e-f*d,(f>u||f===u&&h===d-1)&&++h>=d&&(h=0,f++),m=f+h*o/d,c.css({"-webkit-box-ordinal-group":m,"-moz-box-ordinal-group":m,"-ms-flex-order":m,"-webkit-order":m,order:m})):(h=Math.floor(e/p),f=e-h*p),c.css({"margin-top":0!==h&&w.params.spaceBetween&&w.params.spaceBetween+"px"}).attr("data-swiper-column",f).attr("data-swiper-row",h)}"none"!==c.css("display")&&("auto"===w.params.slidesPerView?(l=i()?c.outerWidth(!0):c.outerHeight(!0),w.params.roundLengths&&(l=n(l))):(l=(w.size-(w.params.slidesPerView-1)*a)/w.params.slidesPerView,w.params.roundLengths&&(l=n(l)),i()?w.slides[e].style.width=l+"px":w.slides[e].style.height=l+"px"),w.slides[e].swiperSlideSize=l,w.slidesSizesGrid.push(l),w.params.centeredSlides?(t=t+l/2+r/2+a,0===e&&(t=t-w.size/2-a),Math.abs(t)<.001&&(t=0),s%w.params.slidesPerGroup===0&&w.snapGrid.push(t),w.slidesGrid.push(t)):(s%w.params.slidesPerGroup===0&&w.snapGrid.push(t),w.slidesGrid.push(t),t=t+l+a),w.virtualSize+=l+a,r=l,s++)}w.virtualSize=Math.max(w.virtualSize,w.size)+w.params.slidesOffsetAfter;var g;if(w.rtl&&w.wrongRTL&&("slide"===w.params.effect||"coverflow"===w.params.effect)&&w.wrapper.css({width:w.virtualSize+w.params.spaceBetween+"px"}),(!w.support.flexbox||w.params.setWrapperSize)&&w.wrapper.css(i()?{width:w.virtualSize+w.params.spaceBetween+"px"}:{height:w.virtualSize+w.params.spaceBetween+"px"}),w.params.slidesPerColumn>1&&(w.virtualSize=(l+w.params.spaceBetween)*o,w.virtualSize=Math.ceil(w.virtualSize/w.params.slidesPerColumn)-w.params.spaceBetween,w.wrapper.css({width:w.virtualSize+w.params.spaceBetween+"px"}),w.params.centeredSlides)){for(g=[],e=0;e<w.snapGrid.length;e++)w.snapGrid[e]<w.virtualSize+w.snapGrid[0]&&g.push(w.snapGrid[e]);w.snapGrid=g}if(!w.params.centeredSlides){for(g=[],e=0;e<w.snapGrid.length;e++)w.snapGrid[e]<=w.virtualSize-w.size&&g.push(w.snapGrid[e]);w.snapGrid=g,Math.floor(w.virtualSize-w.size)>Math.floor(w.snapGrid[w.snapGrid.length-1])&&w.snapGrid.push(w.virtualSize-w.size)}0===w.snapGrid.length&&(w.snapGrid=[0]),0!==w.params.spaceBetween&&w.slides.css(i()?w.rtl?{marginLeft:a+"px"}:{marginRight:a+"px"}:{marginBottom:a+"px"}),w.params.watchSlidesProgress&&w.updateSlidesOffset()},w.updateSlidesOffset=function(){for(var e=0;e<w.slides.length;e++)w.slides[e].swiperSlideOffset=i()?w.slides[e].offsetLeft:w.slides[e].offsetTop},w.updateSlidesProgress=function(e){if("undefined"==typeof e&&(e=w.translate||0),0!==w.slides.length){"undefined"==typeof w.slides[0].swiperSlideOffset&&w.updateSlidesOffset();var a=-e;w.rtl&&(a=e);{w.container[0].getBoundingClientRect(),i()?"left":"top",i()?"right":"bottom"}w.slides.removeClass(w.params.slideVisibleClass);for(var t=0;t<w.slides.length;t++){var r=w.slides[t],s=(a-r.swiperSlideOffset)/(r.swiperSlideSize+w.params.spaceBetween);if(w.params.watchSlidesVisibility){var n=-(a-r.swiperSlideOffset),o=n+w.slidesSizesGrid[t],l=n>=0&&n<w.size||o>0&&o<=w.size||0>=n&&o>=w.size;l&&w.slides.eq(t).addClass(w.params.slideVisibleClass)}r.progress=w.rtl?-s:s}}},w.updateProgress=function(e){"undefined"==typeof e&&(e=w.translate||0);var a=w.maxTranslate()-w.minTranslate();0===a?(w.progress=0,w.isBeginning=w.isEnd=!0):(w.progress=(e-w.minTranslate())/a,w.isBeginning=w.progress<=0,w.isEnd=w.progress>=1),w.isBeginning&&w.emit("onReachBeginning",w),w.isEnd&&w.emit("onReachEnd",w),w.params.watchSlidesProgress&&w.updateSlidesProgress(e),w.emit("onProgress",w,w.progress)},w.updateActiveIndex=function(){var e,a,t,r=w.rtl?w.translate:-w.translate;for(a=0;a<w.slidesGrid.length;a++)"undefined"!=typeof w.slidesGrid[a+1]?r>=w.slidesGrid[a]&&r<w.slidesGrid[a+1]-(w.slidesGrid[a+1]-w.slidesGrid[a])/2?e=a:r>=w.slidesGrid[a]&&r<w.slidesGrid[a+1]&&(e=a+1):r>=w.slidesGrid[a]&&(e=a);(0>e||"undefined"==typeof e)&&(e=0),t=Math.floor(e/w.params.slidesPerGroup),t>=w.snapGrid.length&&(t=w.snapGrid.length-1),e!==w.activeIndex&&(w.snapIndex=t,w.previousIndex=w.activeIndex,w.activeIndex=e,w.updateClasses())},w.updateClasses=function(){w.slides.removeClass(w.params.slideActiveClass+" "+w.params.slideNextClass+" "+w.params.slidePrevClass);var e=w.slides.eq(w.activeIndex);if(e.addClass(w.params.slideActiveClass),e.next("."+w.params.slideClass).addClass(w.params.slideNextClass),e.prev("."+w.params.slideClass).addClass(w.params.slidePrevClass),w.bullets&&w.bullets.length>0){w.bullets.removeClass(w.params.bulletActiveClass);var t;w.params.loop?(t=Math.ceil(w.activeIndex-w.loopedSlides)/w.params.slidesPerGroup,t>w.slides.length-1-2*w.loopedSlides&&(t-=w.slides.length-2*w.loopedSlides),t>w.bullets.length-1&&(t-=w.bullets.length)):t="undefined"!=typeof w.snapIndex?w.snapIndex:w.activeIndex||0,w.paginationContainer.length>1?w.bullets.each(function(){a(this).index()===t&&a(this).addClass(w.params.bulletActiveClass)}):w.bullets.eq(t).addClass(w.params.bulletActiveClass)}w.params.loop||(w.params.prevButton&&(w.isBeginning?(a(w.params.prevButton).addClass(w.params.buttonDisabledClass),w.params.a11y&&w.a11y&&w.a11y.disable(a(w.params.prevButton))):(a(w.params.prevButton).removeClass(w.params.buttonDisabledClass),w.params.a11y&&w.a11y&&w.a11y.enable(a(w.params.prevButton)))),w.params.nextButton&&(w.isEnd?(a(w.params.nextButton).addClass(w.params.buttonDisabledClass),w.params.a11y&&w.a11y&&w.a11y.disable(a(w.params.nextButton))):(a(w.params.nextButton).removeClass(w.params.buttonDisabledClass),w.params.a11y&&w.a11y&&w.a11y.enable(a(w.params.nextButton)))))},w.updatePagination=function(){if(w.params.pagination&&w.paginationContainer&&w.paginationContainer.length>0){for(var e="",a=w.params.loop?Math.ceil((w.slides.length-2*w.loopedSlides)/w.params.slidesPerGroup):w.snapGrid.length,t=0;a>t;t++)e+=w.params.paginationBulletRender?w.params.paginationBulletRender(t,w.params.bulletClass):"<"+w.params.paginationElement+' class="'+w.params.bulletClass+'"></'+w.params.paginationElement+">";w.paginationContainer.html(e),w.bullets=w.paginationContainer.find("."+w.params.bulletClass),w.params.paginationClickable&&w.params.a11y&&w.a11y&&w.a11y.initPagination()}},w.update=function(e){function a(){r=Math.min(Math.max(w.translate,w.maxTranslate()),w.minTranslate()),w.setWrapperTranslate(r),w.updateActiveIndex(),w.updateClasses()}if(w.updateContainerSize(),w.updateSlidesSize(),w.updateProgress(),w.updatePagination(),w.updateClasses(),w.params.scrollbar&&w.scrollbar&&w.scrollbar.set(),e){var t,r;w.controller&&w.controller.spline&&(w.controller.spline=void 0),w.params.freeMode?a():(t=("auto"===w.params.slidesPerView||w.params.slidesPerView>1)&&w.isEnd&&!w.params.centeredSlides?w.slideTo(w.slides.length-1,0,!1,!0):w.slideTo(w.activeIndex,0,!1,!0),t||a())}},w.onResize=function(e){var a=w.params.allowSwipeToPrev,t=w.params.allowSwipeToNext;if(w.params.allowSwipeToPrev=w.params.allowSwipeToNext=!0,w.updateContainerSize(),w.updateSlidesSize(),("auto"===w.params.slidesPerView||w.params.freeMode||e)&&w.updatePagination(),w.params.scrollbar&&w.scrollbar&&w.scrollbar.set(),w.controller&&w.controller.spline&&(w.controller.spline=void 0),w.params.freeMode){var r=Math.min(Math.max(w.translate,w.maxTranslate()),w.minTranslate());w.setWrapperTranslate(r),w.updateActiveIndex(),w.updateClasses()}else w.updateClasses(),("auto"===w.params.slidesPerView||w.params.slidesPerView>1)&&w.isEnd&&!w.params.centeredSlides?w.slideTo(w.slides.length-1,0,!1,!0):w.slideTo(w.activeIndex,0,!1,!0);w.params.allowSwipeToPrev=a,w.params.allowSwipeToNext=t};var y=["mousedown","mousemove","mouseup"];window.navigator.pointerEnabled?y=["pointerdown","pointermove","pointerup"]:window.navigator.msPointerEnabled&&(y=["MSPointerDown","MSPointerMove","MSPointerUp"]),w.touchEvents={start:w.support.touch||!w.params.simulateTouch?"touchstart":y[0],move:w.support.touch||!w.params.simulateTouch?"touchmove":y[1],end:w.support.touch||!w.params.simulateTouch?"touchend":y[2]},(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&("container"===w.params.touchEventsTarget?w.container:w.wrapper).addClass("swiper-wp8-"+w.params.direction),w.initEvents=function(e){var t=e?"off":"on",r=e?"removeEventListener":"addEventListener",i="container"===w.params.touchEventsTarget?w.container[0]:w.wrapper[0],n=w.support.touch?i:document,o=w.params.nested?!0:!1;w.browser.ie?(i[r](w.touchEvents.start,w.onTouchStart,!1),n[r](w.touchEvents.move,w.onTouchMove,o),n[r](w.touchEvents.end,w.onTouchEnd,!1)):(w.support.touch&&(i[r](w.touchEvents.start,w.onTouchStart,!1),i[r](w.touchEvents.move,w.onTouchMove,o),i[r](w.touchEvents.end,w.onTouchEnd,!1)),!s.simulateTouch||w.device.ios||w.device.android||(i[r]("mousedown",w.onTouchStart,!1),document[r]("mousemove",w.onTouchMove,o),document[r]("mouseup",w.onTouchEnd,!1))),window[r]("resize",w.onResize),w.params.nextButton&&(a(w.params.nextButton)[t]("click",w.onClickNext),w.params.a11y&&w.a11y&&a(w.params.nextButton)[t]("keydown",w.a11y.onEnterKey)),w.params.prevButton&&(a(w.params.prevButton)[t]("click",w.onClickPrev),w.params.a11y&&w.a11y&&a(w.params.prevButton)[t]("keydown",w.a11y.onEnterKey)),w.params.pagination&&w.params.paginationClickable&&(a(w.paginationContainer)[t]("click","."+w.params.bulletClass,w.onClickIndex),w.params.a11y&&w.a11y&&a(w.paginationContainer)[t]("keydown","."+w.params.bulletClass,w.a11y.onEnterKey)),(w.params.preventClicks||w.params.preventClicksPropagation)&&i[r]("click",w.preventClicks,!0)},w.attachEvents=function(e){w.initEvents()},w.detachEvents=function(){w.initEvents(!0)},w.allowClick=!0,w.preventClicks=function(e){w.allowClick||(w.params.preventClicks&&e.preventDefault(),w.params.preventClicksPropagation&&w.animating&&(e.stopPropagation(),e.stopImmediatePropagation()))},w.onClickNext=function(e){e.preventDefault(),(!w.isEnd||w.params.loop)&&w.slideNext()},w.onClickPrev=function(e){e.preventDefault(),(!w.isBeginning||w.params.loop)&&w.slidePrev()},w.onClickIndex=function(e){e.preventDefault();var t=a(this).index()*w.params.slidesPerGroup;w.params.loop&&(t+=w.loopedSlides),w.slideTo(t)},w.updateClickedSlide=function(e){var t=l(e,"."+w.params.slideClass),r=!1;if(t)for(var s=0;s<w.slides.length;s++)w.slides[s]===t&&(r=!0);if(!t||!r)return w.clickedSlide=void 0,void(w.clickedIndex=void 0);if(w.clickedSlide=t,w.clickedIndex=a(t).index(),w.params.slideToClickedSlide&&void 0!==w.clickedIndex&&w.clickedIndex!==w.activeIndex){var i,n=w.clickedIndex;if(w.params.loop)if(i=a(w.clickedSlide).attr("data-swiper-slide-index"),n>w.slides.length-w.params.slidesPerView)w.fixLoop(),n=w.wrapper.children("."+w.params.slideClass+'[data-swiper-slide-index="'+i+'"]').eq(0).index(),setTimeout(function(){w.slideTo(n)},0);else if(n<w.params.slidesPerView-1){w.fixLoop();var o=w.wrapper.children("."+w.params.slideClass+'[data-swiper-slide-index="'+i+'"]');n=o.eq(o.length-1).index(),setTimeout(function(){w.slideTo(n)},0)}else w.slideTo(n);else w.slideTo(n)}};var b,x,T,S,C,M,E,P,z,I="input, select, textarea, button",k=Date.now(),L=[];w.animating=!1,w.touches={startX:0,startY:0,currentX:0,currentY:0,diff:0};var D,B;if(w.onTouchStart=function(e){if(e.originalEvent&&(e=e.originalEvent),D="touchstart"===e.type,D||!("which"in e)||3!==e.which){if(w.params.noSwiping&&l(e,"."+w.params.noSwipingClass))return void(w.allowClick=!0);if(!w.params.swipeHandler||l(e,w.params.swipeHandler)){var t=w.touches.currentX="touchstart"===e.type?e.targetTouches[0].pageX:e.pageX,r=w.touches.currentY="touchstart"===e.type?e.targetTouches[0].pageY:e.pageY;if(!(w.device.ios&&w.params.iOSEdgeSwipeDetection&&t<=w.params.iOSEdgeSwipeThreshold)){if(b=!0,x=!1,S=void 0,B=void 0,w.touches.startX=t,w.touches.startY=r,T=Date.now(),w.allowClick=!0,w.updateContainerSize(),w.swipeDirection=void 0,w.params.threshold>0&&(E=!1),"touchstart"!==e.type){var s=!0;a(e.target).is(I)&&(s=!1),document.activeElement&&a(document.activeElement).is(I)&&document.activeElement.blur(),s&&e.preventDefault()}w.emit("onTouchStart",w,e)}}}},w.onTouchMove=function(e){if(e.originalEvent&&(e=e.originalEvent),!(D&&"mousemove"===e.type||e.preventedByNestedSwiper)){if(w.params.onlyExternal)return w.allowClick=!1,void(b&&(w.touches.startX=w.touches.currentX="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,w.touches.startY=w.touches.currentY="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,T=Date.now()));if(D&&document.activeElement&&e.target===document.activeElement&&a(e.target).is(I))return x=!0,void(w.allowClick=!1);if(w.emit("onTouchMove",w,e),!(e.targetTouches&&e.targetTouches.length>1)){if(w.touches.currentX="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,w.touches.currentY="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,"undefined"==typeof S){var t=180*Math.atan2(Math.abs(w.touches.currentY-w.touches.startY),Math.abs(w.touches.currentX-w.touches.startX))/Math.PI;S=i()?t>w.params.touchAngle:90-t>w.params.touchAngle}if(S&&w.emit("onTouchMoveOpposite",w,e),"undefined"==typeof B&&w.browser.ieTouch&&(w.touches.currentX!==w.touches.startX||w.touches.currentY!==w.touches.startY)&&(B=!0),b){if(S)return void(b=!1);if(B||!w.browser.ieTouch){w.allowClick=!1,w.emit("onSliderMove",w,e),e.preventDefault(),w.params.touchMoveStopPropagation&&!w.params.nested&&e.stopPropagation(),x||(s.loop&&w.fixLoop(),M=w.getWrapperTranslate(),w.setWrapperTransition(0),w.animating&&w.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"),w.params.autoplay&&w.autoplaying&&(w.params.autoplayDisableOnInteraction?w.stopAutoplay():w.pauseAutoplay()),z=!1,w.params.grabCursor&&(w.container[0].style.cursor="move",w.container[0].style.cursor="-webkit-grabbing",w.container[0].style.cursor="-moz-grabbin",w.container[0].style.cursor="grabbing")),x=!0;var r=w.touches.diff=i()?w.touches.currentX-w.touches.startX:w.touches.currentY-w.touches.startY;r*=w.params.touchRatio,w.rtl&&(r=-r),w.swipeDirection=r>0?"prev":"next",C=r+M;var n=!0;if(r>0&&C>w.minTranslate()?(n=!1,w.params.resistance&&(C=w.minTranslate()-1+Math.pow(-w.minTranslate()+M+r,w.params.resistanceRatio))):0>r&&C<w.maxTranslate()&&(n=!1,w.params.resistance&&(C=w.maxTranslate()+1-Math.pow(w.maxTranslate()-M-r,w.params.resistanceRatio))),n&&(e.preventedByNestedSwiper=!0),!w.params.allowSwipeToNext&&"next"===w.swipeDirection&&M>C&&(C=M),!w.params.allowSwipeToPrev&&"prev"===w.swipeDirection&&C>M&&(C=M),w.params.followFinger){if(w.params.threshold>0){if(!(Math.abs(r)>w.params.threshold||E))return void(C=M);if(!E)return E=!0,w.touches.startX=w.touches.currentX,w.touches.startY=w.touches.currentY,C=M,void(w.touches.diff=i()?w.touches.currentX-w.touches.startX:w.touches.currentY-w.touches.startY)}(w.params.freeMode||w.params.watchSlidesProgress)&&w.updateActiveIndex(),w.params.freeMode&&(0===L.length&&L.push({position:w.touches[i()?"startX":"startY"],time:T}),L.push({position:w.touches[i()?"currentX":"currentY"],time:(new window.Date).getTime()})),w.updateProgress(C),w.setWrapperTranslate(C)}}}}}},w.onTouchEnd=function(e){if(e.originalEvent&&(e=e.originalEvent),w.emit("onTouchEnd",w,e),b){w.params.grabCursor&&x&&b&&(w.container[0].style.cursor="move",w.container[0].style.cursor="-webkit-grab",w.container[0].style.cursor="-moz-grab",w.container[0].style.cursor="grab");var t=Date.now(),r=t-T;if(w.allowClick&&(w.updateClickedSlide(e),w.emit("onTap",w,e),300>r&&t-k>300&&(P&&clearTimeout(P),P=setTimeout(function(){w&&(w.params.paginationHide&&w.paginationContainer.length>0&&!a(e.target).hasClass(w.params.bulletClass)&&w.paginationContainer.toggleClass(w.params.paginationHiddenClass),w.emit("onClick",w,e))},300)),300>r&&300>t-k&&(P&&clearTimeout(P),w.emit("onDoubleTap",w,e))),k=Date.now(),setTimeout(function(){w&&(w.allowClick=!0)},0),!b||!x||!w.swipeDirection||0===w.touches.diff||C===M)return void(b=x=!1);b=x=!1;var s;if(s=w.params.followFinger?w.rtl?w.translate:-w.translate:-C,w.params.freeMode){if(s<-w.minTranslate())return void w.slideTo(w.activeIndex);if(s>-w.maxTranslate())return void w.slideTo(w.slides.length<w.snapGrid.length?w.snapGrid.length-1:w.slides.length-1);if(w.params.freeModeMomentum){if(L.length>1){var i=L.pop(),n=L.pop(),o=i.position-n.position,l=i.time-n.time;w.velocity=o/l,w.velocity=w.velocity/2,Math.abs(w.velocity)<.02&&(w.velocity=0),(l>150||(new window.Date).getTime()-i.time>300)&&(w.velocity=0)}else w.velocity=0;L.length=0;var d=1e3*w.params.freeModeMomentumRatio,p=w.velocity*d,u=w.translate+p;w.rtl&&(u=-u);var c,m=!1,f=20*Math.abs(w.velocity)*w.params.freeModeMomentumBounceRatio;if(u<w.maxTranslate())w.params.freeModeMomentumBounce?(u+w.maxTranslate()<-f&&(u=w.maxTranslate()-f),c=w.maxTranslate(),m=!0,z=!0):u=w.maxTranslate();else if(u>w.minTranslate())w.params.freeModeMomentumBounce?(u-w.minTranslate()>f&&(u=w.minTranslate()+f),c=w.minTranslate(),m=!0,z=!0):u=w.minTranslate();else if(w.params.freeModeSticky){var h,g=0;for(g=0;g<w.snapGrid.length;g+=1)if(w.snapGrid[g]>-u){h=g;break}u=Math.abs(w.snapGrid[h]-u)<Math.abs(w.snapGrid[h-1]-u)||"next"===w.swipeDirection?w.snapGrid[h]:w.snapGrid[h-1],w.rtl||(u=-u)}if(0!==w.velocity)d=Math.abs(w.rtl?(-u-w.translate)/w.velocity:(u-w.translate)/w.velocity);else if(w.params.freeModeSticky)return void w.slideReset();w.params.freeModeMomentumBounce&&m?(w.updateProgress(c),w.setWrapperTransition(d),w.setWrapperTranslate(u),w.onTransitionStart(),w.animating=!0,w.wrapper.transitionEnd(function(){w&&z&&(w.emit("onMomentumBounce",w),w.setWrapperTransition(w.params.speed),w.setWrapperTranslate(c),w.wrapper.transitionEnd(function(){w&&w.onTransitionEnd()}))})):w.velocity?(w.updateProgress(u),w.setWrapperTransition(d),w.setWrapperTranslate(u),w.onTransitionStart(),w.animating||(w.animating=!0,w.wrapper.transitionEnd(function(){w&&w.onTransitionEnd()}))):w.updateProgress(u),w.updateActiveIndex()}return void((!w.params.freeModeMomentum||r>=w.params.longSwipesMs)&&(w.updateProgress(),w.updateActiveIndex()))}var v,y=0,S=w.slidesSizesGrid[0];for(v=0;v<w.slidesGrid.length;v+=w.params.slidesPerGroup)"undefined"!=typeof w.slidesGrid[v+w.params.slidesPerGroup]?s>=w.slidesGrid[v]&&s<w.slidesGrid[v+w.params.slidesPerGroup]&&(y=v,S=w.slidesGrid[v+w.params.slidesPerGroup]-w.slidesGrid[v]):s>=w.slidesGrid[v]&&(y=v,S=w.slidesGrid[w.slidesGrid.length-1]-w.slidesGrid[w.slidesGrid.length-2]);var E=(s-w.slidesGrid[y])/S;if(r>w.params.longSwipesMs){if(!w.params.longSwipes)return void w.slideTo(w.activeIndex);"next"===w.swipeDirection&&w.slideTo(E>=w.params.longSwipesRatio?y+w.params.slidesPerGroup:y),"prev"===w.swipeDirection&&w.slideTo(E>1-w.params.longSwipesRatio?y+w.params.slidesPerGroup:y)}else{if(!w.params.shortSwipes)return void w.slideTo(w.activeIndex);"next"===w.swipeDirection&&w.slideTo(y+w.params.slidesPerGroup),"prev"===w.swipeDirection&&w.slideTo(y)}}},w._slideTo=function(e,a){return w.slideTo(e,a,!0,!0)},w.slideTo=function(e,a,t,r){"undefined"==typeof t&&(t=!0),"undefined"==typeof e&&(e=0),0>e&&(e=0),w.snapIndex=Math.floor(e/w.params.slidesPerGroup),w.snapIndex>=w.snapGrid.length&&(w.snapIndex=w.snapGrid.length-1);var s=-w.snapGrid[w.snapIndex];w.params.autoplay&&w.autoplaying&&(r||!w.params.autoplayDisableOnInteraction?w.pauseAutoplay(a):w.stopAutoplay()),w.updateProgress(s);for(var n=0;n<w.slidesGrid.length;n++)-Math.floor(100*s)>=Math.floor(100*w.slidesGrid[n])&&(e=n);if(!w.params.allowSwipeToNext&&s<w.translate&&s<w.minTranslate())return!1;if(!w.params.allowSwipeToPrev&&s>w.translate&&s>w.maxTranslate()&&(w.activeIndex||0)!==e)return!1;if("undefined"==typeof a&&(a=w.params.speed),w.previousIndex=w.activeIndex||0,w.activeIndex=e,s===w.translate)return w.updateClasses(),!1;w.updateClasses(),w.onTransitionStart(t);i()?s:0,i()?0:s;return 0===a?(w.setWrapperTransition(0),w.setWrapperTranslate(s),w.onTransitionEnd(t)):(w.setWrapperTransition(a),w.setWrapperTranslate(s),w.animating||(w.animating=!0,w.wrapper.transitionEnd(function(){w&&w.onTransitionEnd(t)}))),!0},w.onTransitionStart=function(e){"undefined"==typeof e&&(e=!0),
w.lazy&&w.lazy.onTransitionStart(),e&&(w.emit("onTransitionStart",w),w.activeIndex!==w.previousIndex&&w.emit("onSlideChangeStart",w))},w.onTransitionEnd=function(e){w.animating=!1,w.setWrapperTransition(0),"undefined"==typeof e&&(e=!0),w.lazy&&w.lazy.onTransitionEnd(),e&&(w.emit("onTransitionEnd",w),w.activeIndex!==w.previousIndex&&w.emit("onSlideChangeEnd",w)),w.params.hashnav&&w.hashnav&&w.hashnav.setHash()},w.slideNext=function(e,a,t){if(w.params.loop){if(w.animating)return!1;w.fixLoop();{w.container[0].clientLeft}return w.slideTo(w.activeIndex+w.params.slidesPerGroup,a,e,t)}return w.slideTo(w.activeIndex+w.params.slidesPerGroup,a,e,t)},w._slideNext=function(e){return w.slideNext(!0,e,!0)},w.slidePrev=function(e,a,t){if(w.params.loop){if(w.animating)return!1;w.fixLoop();{w.container[0].clientLeft}return w.slideTo(w.activeIndex-1,a,e,t)}return w.slideTo(w.activeIndex-1,a,e,t)},w._slidePrev=function(e){return w.slidePrev(!0,e,!0)},w.slideReset=function(e,a,t){return w.slideTo(w.activeIndex,a,e)},w.setWrapperTransition=function(e,a){w.wrapper.transition(e),"slide"!==w.params.effect&&w.effects[w.params.effect]&&w.effects[w.params.effect].setTransition(e),w.params.parallax&&w.parallax&&w.parallax.setTransition(e),w.params.scrollbar&&w.scrollbar&&w.scrollbar.setTransition(e),w.params.control&&w.controller&&w.controller.setTransition(e,a),w.emit("onSetTransition",w,e)},w.setWrapperTranslate=function(e,a,t){var r=0,s=0,n=0;i()?r=w.rtl?-e:e:s=e,w.params.virtualTranslate||w.wrapper.transform(w.support.transforms3d?"translate3d("+r+"px, "+s+"px, "+n+"px)":"translate("+r+"px, "+s+"px)"),w.translate=i()?r:s,a&&w.updateActiveIndex(),"slide"!==w.params.effect&&w.effects[w.params.effect]&&w.effects[w.params.effect].setTranslate(w.translate),w.params.parallax&&w.parallax&&w.parallax.setTranslate(w.translate),w.params.scrollbar&&w.scrollbar&&w.scrollbar.setTranslate(w.translate),w.params.control&&w.controller&&w.controller.setTranslate(w.translate,t),w.emit("onSetTranslate",w,w.translate)},w.getTranslate=function(e,a){var t,r,s,i;return"undefined"==typeof a&&(a="x"),w.params.virtualTranslate?w.rtl?-w.translate:w.translate:(s=window.getComputedStyle(e,null),window.WebKitCSSMatrix?i=new window.WebKitCSSMatrix("none"===s.webkitTransform?"":s.webkitTransform):(i=s.MozTransform||s.OTransform||s.MsTransform||s.msTransform||s.transform||s.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),t=i.toString().split(",")),"x"===a&&(r=window.WebKitCSSMatrix?i.m41:parseFloat(16===t.length?t[12]:t[4])),"y"===a&&(r=window.WebKitCSSMatrix?i.m42:parseFloat(16===t.length?t[13]:t[5])),w.rtl&&r&&(r=-r),r||0)},w.getWrapperTranslate=function(e){return"undefined"==typeof e&&(e=i()?"x":"y"),w.getTranslate(w.wrapper[0],e)},w.observers=[],w.initObservers=function(){if(w.params.observeParents)for(var e=w.container.parents(),a=0;a<e.length;a++)d(e[a]);d(w.container[0],{childList:!1}),d(w.wrapper[0],{attributes:!1})},w.disconnectObservers=function(){for(var e=0;e<w.observers.length;e++)w.observers[e].disconnect();w.observers=[]},w.createLoop=function(){w.wrapper.children("."+w.params.slideClass+"."+w.params.slideDuplicateClass).remove();var e=w.wrapper.children("."+w.params.slideClass);"auto"!==w.params.slidesPerView||w.params.loopedSlides||(w.params.loopedSlides=e.length),w.loopedSlides=parseInt(w.params.loopedSlides||w.params.slidesPerView,10),w.loopedSlides=w.loopedSlides+w.params.loopAdditionalSlides,w.loopedSlides>e.length&&(w.loopedSlides=e.length);var t,r=[],s=[];for(e.each(function(t,i){var n=a(this);t<w.loopedSlides&&s.push(i),t<e.length&&t>=e.length-w.loopedSlides&&r.push(i),n.attr("data-swiper-slide-index",t)}),t=0;t<s.length;t++)w.wrapper.append(a(s[t].cloneNode(!0)).addClass(w.params.slideDuplicateClass));for(t=r.length-1;t>=0;t--)w.wrapper.prepend(a(r[t].cloneNode(!0)).addClass(w.params.slideDuplicateClass))},w.destroyLoop=function(){w.wrapper.children("."+w.params.slideClass+"."+w.params.slideDuplicateClass).remove(),w.slides.removeAttr("data-swiper-slide-index")},w.fixLoop=function(){var e;w.activeIndex<w.loopedSlides?(e=w.slides.length-3*w.loopedSlides+w.activeIndex,e+=w.loopedSlides,w.slideTo(e,0,!1,!0)):("auto"===w.params.slidesPerView&&w.activeIndex>=2*w.loopedSlides||w.activeIndex>w.slides.length-2*w.params.slidesPerView)&&(e=-w.slides.length+w.activeIndex+w.loopedSlides,e+=w.loopedSlides,w.slideTo(e,0,!1,!0))},w.appendSlide=function(e){if(w.params.loop&&w.destroyLoop(),"object"==typeof e&&e.length)for(var a=0;a<e.length;a++)e[a]&&w.wrapper.append(e[a]);else w.wrapper.append(e);w.params.loop&&w.createLoop(),w.params.observer&&w.support.observer||w.update(!0)},w.prependSlide=function(e){w.params.loop&&w.destroyLoop();var a=w.activeIndex+1;if("object"==typeof e&&e.length){for(var t=0;t<e.length;t++)e[t]&&w.wrapper.prepend(e[t]);a=w.activeIndex+e.length}else w.wrapper.prepend(e);w.params.loop&&w.createLoop(),w.params.observer&&w.support.observer||w.update(!0),w.slideTo(a,0,!1)},w.removeSlide=function(e){w.params.loop&&(w.destroyLoop(),w.slides=w.wrapper.children("."+w.params.slideClass));var a,t=w.activeIndex;if("object"==typeof e&&e.length){for(var r=0;r<e.length;r++)a=e[r],w.slides[a]&&w.slides.eq(a).remove(),t>a&&t--;t=Math.max(t,0)}else a=e,w.slides[a]&&w.slides.eq(a).remove(),t>a&&t--,t=Math.max(t,0);w.params.loop&&w.createLoop(),w.params.observer&&w.support.observer||w.update(!0),w.params.loop?w.slideTo(t+w.loopedSlides,0,!1):w.slideTo(t,0,!1)},w.removeAllSlides=function(){for(var e=[],a=0;a<w.slides.length;a++)e.push(a);w.removeSlide(e)},w.effects={fade:{setTranslate:function(){for(var e=0;e<w.slides.length;e++){var a=w.slides.eq(e),t=a[0].swiperSlideOffset,r=-t;w.params.virtualTranslate||(r-=w.translate);var s=0;i()||(s=r,r=0);var n=w.params.fade.crossFade?Math.max(1-Math.abs(a[0].progress),0):1+Math.min(Math.max(a[0].progress,-1),0);a.css({opacity:n}).transform("translate3d("+r+"px, "+s+"px, 0px)")}},setTransition:function(e){if(w.slides.transition(e),w.params.virtualTranslate&&0!==e){var a=!1;w.slides.transitionEnd(function(){if(!a&&w){a=!0,w.animating=!1;for(var e=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],t=0;t<e.length;t++)w.wrapper.trigger(e[t])}})}}},cube:{setTranslate:function(){var e,t=0;w.params.cube.shadow&&(i()?(e=w.wrapper.find(".swiper-cube-shadow"),0===e.length&&(e=a('<div class="swiper-cube-shadow"></div>'),w.wrapper.append(e)),e.css({height:w.width+"px"})):(e=w.container.find(".swiper-cube-shadow"),0===e.length&&(e=a('<div class="swiper-cube-shadow"></div>'),w.container.append(e))));for(var r=0;r<w.slides.length;r++){var s=w.slides.eq(r),n=90*r,o=Math.floor(n/360);w.rtl&&(n=-n,o=Math.floor(-n/360));var l=Math.max(Math.min(s[0].progress,1),-1),d=0,p=0,u=0;r%4===0?(d=4*-o*w.size,u=0):(r-1)%4===0?(d=0,u=4*-o*w.size):(r-2)%4===0?(d=w.size+4*o*w.size,u=w.size):(r-3)%4===0&&(d=-w.size,u=3*w.size+4*w.size*o),w.rtl&&(d=-d),i()||(p=d,d=0);var c="rotateX("+(i()?0:-n)+"deg) rotateY("+(i()?n:0)+"deg) translate3d("+d+"px, "+p+"px, "+u+"px)";if(1>=l&&l>-1&&(t=90*r+90*l,w.rtl&&(t=90*-r-90*l)),s.transform(c),w.params.cube.slideShadows){var m=s.find(i()?".swiper-slide-shadow-left":".swiper-slide-shadow-top"),f=s.find(i()?".swiper-slide-shadow-right":".swiper-slide-shadow-bottom");0===m.length&&(m=a('<div class="swiper-slide-shadow-'+(i()?"left":"top")+'"></div>'),s.append(m)),0===f.length&&(f=a('<div class="swiper-slide-shadow-'+(i()?"right":"bottom")+'"></div>'),s.append(f));{s[0].progress}m.length&&(m[0].style.opacity=-s[0].progress),f.length&&(f[0].style.opacity=s[0].progress)}}if(w.wrapper.css({"-webkit-transform-origin":"50% 50% -"+w.size/2+"px","-moz-transform-origin":"50% 50% -"+w.size/2+"px","-ms-transform-origin":"50% 50% -"+w.size/2+"px","transform-origin":"50% 50% -"+w.size/2+"px"}),w.params.cube.shadow)if(i())e.transform("translate3d(0px, "+(w.width/2+w.params.cube.shadowOffset)+"px, "+-w.width/2+"px) rotateX(90deg) rotateZ(0deg) scale("+w.params.cube.shadowScale+")");else{var h=Math.abs(t)-90*Math.floor(Math.abs(t)/90),g=1.5-(Math.sin(2*h*Math.PI/360)/2+Math.cos(2*h*Math.PI/360)/2),v=w.params.cube.shadowScale,y=w.params.cube.shadowScale/g,b=w.params.cube.shadowOffset;e.transform("scale3d("+v+", 1, "+y+") translate3d(0px, "+(w.height/2+b)+"px, "+-w.height/2/y+"px) rotateX(-90deg)")}var x=w.isSafari||w.isUiWebView?-w.size/2:0;w.wrapper.transform("translate3d(0px,0,"+x+"px) rotateX("+(i()?0:t)+"deg) rotateY("+(i()?-t:0)+"deg)")},setTransition:function(e){w.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),w.params.cube.shadow&&!i()&&w.container.find(".swiper-cube-shadow").transition(e)}},coverflow:{setTranslate:function(){for(var e=w.translate,t=i()?-e+w.width/2:-e+w.height/2,r=i()?w.params.coverflow.rotate:-w.params.coverflow.rotate,s=w.params.coverflow.depth,n=0,o=w.slides.length;o>n;n++){var l=w.slides.eq(n),d=w.slidesSizesGrid[n],p=l[0].swiperSlideOffset,u=(t-p-d/2)/d*w.params.coverflow.modifier,c=i()?r*u:0,m=i()?0:r*u,f=-s*Math.abs(u),h=i()?0:w.params.coverflow.stretch*u,g=i()?w.params.coverflow.stretch*u:0;Math.abs(g)<.001&&(g=0),Math.abs(h)<.001&&(h=0),Math.abs(f)<.001&&(f=0),Math.abs(c)<.001&&(c=0),Math.abs(m)<.001&&(m=0);var v="translate3d("+g+"px,"+h+"px,"+f+"px)  rotateX("+m+"deg) rotateY("+c+"deg)";if(l.transform(v),l[0].style.zIndex=-Math.abs(Math.round(u))+1,w.params.coverflow.slideShadows){var y=l.find(i()?".swiper-slide-shadow-left":".swiper-slide-shadow-top"),b=l.find(i()?".swiper-slide-shadow-right":".swiper-slide-shadow-bottom");0===y.length&&(y=a('<div class="swiper-slide-shadow-'+(i()?"left":"top")+'"></div>'),l.append(y)),0===b.length&&(b=a('<div class="swiper-slide-shadow-'+(i()?"right":"bottom")+'"></div>'),l.append(b)),y.length&&(y[0].style.opacity=u>0?u:0),b.length&&(b[0].style.opacity=-u>0?-u:0)}}if(w.browser.ie){var x=w.wrapper[0].style;x.perspectiveOrigin=t+"px 50%"}},setTransition:function(e){w.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)}}},w.lazy={initialImageLoaded:!1,loadImageInSlide:function(e,t){if("undefined"!=typeof e&&("undefined"==typeof t&&(t=!0),0!==w.slides.length)){var r=w.slides.eq(e),s=r.find(".swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)");!r.hasClass("swiper-lazy")||r.hasClass("swiper-lazy-loaded")||r.hasClass("swiper-lazy-loading")||s.add(r[0]),0!==s.length&&s.each(function(){var e=a(this);e.addClass("swiper-lazy-loading");var s=e.attr("data-background"),i=e.attr("data-src");w.loadImage(e[0],i||s,!1,function(){if(s?(e.css("background-image","url("+s+")"),e.removeAttr("data-background")):(e.attr("src",i),e.removeAttr("data-src")),e.addClass("swiper-lazy-loaded").removeClass("swiper-lazy-loading"),r.find(".swiper-lazy-preloader, .preloader").remove(),w.params.loop&&t){var a=r.attr("data-swiper-slide-index");if(r.hasClass(w.params.slideDuplicateClass)){var n=w.wrapper.children('[data-swiper-slide-index="'+a+'"]:not(.'+w.params.slideDuplicateClass+")");w.lazy.loadImageInSlide(n.index(),!1)}else{var o=w.wrapper.children("."+w.params.slideDuplicateClass+'[data-swiper-slide-index="'+a+'"]');w.lazy.loadImageInSlide(o.index(),!1)}}w.emit("onLazyImageReady",w,r[0],e[0])}),w.emit("onLazyImageLoad",w,r[0],e[0])})}},load:function(){var e;if(w.params.watchSlidesVisibility)w.wrapper.children("."+w.params.slideVisibleClass).each(function(){w.lazy.loadImageInSlide(a(this).index())});else if(w.params.slidesPerView>1)for(e=w.activeIndex;e<w.activeIndex+w.params.slidesPerView;e++)w.slides[e]&&w.lazy.loadImageInSlide(e);else w.lazy.loadImageInSlide(w.activeIndex);if(w.params.lazyLoadingInPrevNext)if(w.params.slidesPerView>1){for(e=w.activeIndex+w.params.slidesPerView;e<w.activeIndex+w.params.slidesPerView+w.params.slidesPerView;e++)w.slides[e]&&w.lazy.loadImageInSlide(e);for(e=w.activeIndex-w.params.slidesPerView;e<w.activeIndex;e++)w.slides[e]&&w.lazy.loadImageInSlide(e)}else{var t=w.wrapper.children("."+w.params.slideNextClass);t.length>0&&w.lazy.loadImageInSlide(t.index());var r=w.wrapper.children("."+w.params.slidePrevClass);r.length>0&&w.lazy.loadImageInSlide(r.index())}},onTransitionStart:function(){w.params.lazyLoading&&(w.params.lazyLoadingOnTransitionStart||!w.params.lazyLoadingOnTransitionStart&&!w.lazy.initialImageLoaded)&&w.lazy.load()},onTransitionEnd:function(){w.params.lazyLoading&&!w.params.lazyLoadingOnTransitionStart&&w.lazy.load()}},w.scrollbar={set:function(){if(w.params.scrollbar){var e=w.scrollbar;e.track=a(w.params.scrollbar),e.drag=e.track.find(".swiper-scrollbar-drag"),0===e.drag.length&&(e.drag=a('<div class="swiper-scrollbar-drag"></div>'),e.track.append(e.drag)),e.drag[0].style.width="",e.drag[0].style.height="",e.trackSize=i()?e.track[0].offsetWidth:e.track[0].offsetHeight,e.divider=w.size/w.virtualSize,e.moveDivider=e.divider*(e.trackSize/w.size),e.dragSize=e.trackSize*e.divider,i()?e.drag[0].style.width=e.dragSize+"px":e.drag[0].style.height=e.dragSize+"px",e.track[0].style.display=e.divider>=1?"none":"",w.params.scrollbarHide&&(e.track[0].style.opacity=0)}},setTranslate:function(){if(w.params.scrollbar){var e,a=w.scrollbar,t=(w.translate||0,a.dragSize);e=(a.trackSize-a.dragSize)*w.progress,w.rtl&&i()?(e=-e,e>0?(t=a.dragSize-e,e=0):-e+a.dragSize>a.trackSize&&(t=a.trackSize+e)):0>e?(t=a.dragSize+e,e=0):e+a.dragSize>a.trackSize&&(t=a.trackSize-e),i()?(a.drag.transform(w.support.transforms3d?"translate3d("+e+"px, 0, 0)":"translateX("+e+"px)"),a.drag[0].style.width=t+"px"):(a.drag.transform(w.support.transforms3d?"translate3d(0px, "+e+"px, 0)":"translateY("+e+"px)"),a.drag[0].style.height=t+"px"),w.params.scrollbarHide&&(clearTimeout(a.timeout),a.track[0].style.opacity=1,a.timeout=setTimeout(function(){a.track[0].style.opacity=0,a.track.transition(400)},1e3))}},setTransition:function(e){w.params.scrollbar&&w.scrollbar.drag.transition(e)}},w.controller={LinearSpline:function(e,a){this.x=e,this.y=a,this.lastIndex=e.length-1;{var t,r;this.x.length}this.interpolate=function(e){return e?(r=s(this.x,e),t=r-1,(e-this.x[t])*(this.y[r]-this.y[t])/(this.x[r]-this.x[t])+this.y[t]):0};var s=function(){var e,a,t;return function(r,s){for(a=-1,e=r.length;e-a>1;)r[t=e+a>>1]<=s?a=t:e=t;return e}}()},getInterpolateFunction:function(e){w.controller.spline||(w.controller.spline=w.params.loop?new w.controller.LinearSpline(w.slidesGrid,e.slidesGrid):new w.controller.LinearSpline(w.snapGrid,e.snapGrid))},setTranslate:function(e,a){function r(a){e=a.rtl&&"horizontal"===a.params.direction?-w.translate:w.translate,"slide"===w.params.controlBy&&(w.controller.getInterpolateFunction(a),i=-w.controller.spline.interpolate(-e)),i&&"container"!==w.params.controlBy||(s=(a.maxTranslate()-a.minTranslate())/(w.maxTranslate()-w.minTranslate()),i=(e-w.minTranslate())*s+a.minTranslate()),w.params.controlInverse&&(i=a.maxTranslate()-i),a.updateProgress(i),a.setWrapperTranslate(i,!1,w),a.updateActiveIndex()}var s,i,n=w.params.control;if(w.isArray(n))for(var o=0;o<n.length;o++)n[o]!==a&&n[o]instanceof t&&r(n[o]);else n instanceof t&&a!==n&&r(n)},setTransition:function(e,a){function r(a){a.setWrapperTransition(e,w),0!==e&&(a.onTransitionStart(),a.wrapper.transitionEnd(function(){i&&(a.params.loop&&"slide"===w.params.controlBy&&a.fixLoop(),a.onTransitionEnd())}))}var s,i=w.params.control;if(w.isArray(i))for(s=0;s<i.length;s++)i[s]!==a&&i[s]instanceof t&&r(i[s]);else i instanceof t&&a!==i&&r(i)}},w.hashnav={init:function(){if(w.params.hashnav){w.hashnav.initialized=!0;var e=document.location.hash.replace("#","");if(e)for(var a=0,t=0,r=w.slides.length;r>t;t++){var s=w.slides.eq(t),i=s.attr("data-hash");if(i===e&&!s.hasClass(w.params.slideDuplicateClass)){var n=s.index();w.slideTo(n,a,w.params.runCallbacksOnInit,!0)}}}},setHash:function(){w.hashnav.initialized&&w.params.hashnav&&(document.location.hash=w.slides.eq(w.activeIndex).attr("data-hash")||"")}},w.disableKeyboardControl=function(){a(document).off("keydown",p)},w.enableKeyboardControl=function(){a(document).on("keydown",p)},w.mousewheel={event:!1,lastScrollTime:(new window.Date).getTime()},w.params.mousewheelControl){try{new window.WheelEvent("wheel"),w.mousewheel.event="wheel"}catch(G){}w.mousewheel.event||void 0===document.onmousewheel||(w.mousewheel.event="mousewheel"),w.mousewheel.event||(w.mousewheel.event="DOMMouseScroll")}w.disableMousewheelControl=function(){return w.mousewheel.event?(w.container.off(w.mousewheel.event,u),!0):!1},w.enableMousewheelControl=function(){return w.mousewheel.event?(w.container.on(w.mousewheel.event,u),!0):!1},w.parallax={setTranslate:function(){w.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){c(this,w.progress)}),w.slides.each(function(){var e=a(this);e.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){var a=Math.min(Math.max(e[0].progress,-1),1);c(this,a)})})},setTransition:function(e){"undefined"==typeof e&&(e=w.params.speed),w.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){var t=a(this),r=parseInt(t.attr("data-swiper-parallax-duration"),10)||e;0===e&&(r=0),t.transition(r)})}},w._plugins=[];for(var O in w.plugins){var A=w.plugins[O](w,w.params[O]);A&&w._plugins.push(A)}return w.callPlugins=function(e){for(var a=0;a<w._plugins.length;a++)e in w._plugins[a]&&w._plugins[a][e](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},w.emitterEventListeners={},w.emit=function(e){w.params[e]&&w.params[e](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);var a;if(w.emitterEventListeners[e])for(a=0;a<w.emitterEventListeners[e].length;a++)w.emitterEventListeners[e][a](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);w.callPlugins&&w.callPlugins(e,arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},w.on=function(e,a){return e=m(e),w.emitterEventListeners[e]||(w.emitterEventListeners[e]=[]),w.emitterEventListeners[e].push(a),w},w.off=function(e,a){var t;if(e=m(e),"undefined"==typeof a)return w.emitterEventListeners[e]=[],w;if(w.emitterEventListeners[e]&&0!==w.emitterEventListeners[e].length){for(t=0;t<w.emitterEventListeners[e].length;t++)w.emitterEventListeners[e][t]===a&&w.emitterEventListeners[e].splice(t,1);return w}},w.once=function(e,a){e=m(e);var t=function(){a(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]),w.off(e,t)};return w.on(e,t),w},w.a11y={makeFocusable:function(e){return e.attr("tabIndex","0"),e},addRole:function(e,a){return e.attr("role",a),e},addLabel:function(e,a){return e.attr("aria-label",a),e},disable:function(e){return e.attr("aria-disabled",!0),e},enable:function(e){return e.attr("aria-disabled",!1),e},onEnterKey:function(e){13===e.keyCode&&(a(e.target).is(w.params.nextButton)?(w.onClickNext(e),w.a11y.notify(w.isEnd?w.params.lastSlideMessage:w.params.nextSlideMessage)):a(e.target).is(w.params.prevButton)&&(w.onClickPrev(e),w.a11y.notify(w.isBeginning?w.params.firstSlideMessage:w.params.prevSlideMessage)),a(e.target).is("."+w.params.bulletClass)&&a(e.target)[0].click())},liveRegion:a('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),notify:function(e){var a=w.a11y.liveRegion;0!==a.length&&(a.html(""),a.html(e))},init:function(){if(w.params.nextButton){var e=a(w.params.nextButton);w.a11y.makeFocusable(e),w.a11y.addRole(e,"button"),w.a11y.addLabel(e,w.params.nextSlideMessage)}if(w.params.prevButton){var t=a(w.params.prevButton);w.a11y.makeFocusable(t),w.a11y.addRole(t,"button"),w.a11y.addLabel(t,w.params.prevSlideMessage)}a(w.container).append(w.a11y.liveRegion)},initPagination:function(){w.params.pagination&&w.params.paginationClickable&&w.bullets&&w.bullets.length&&w.bullets.each(function(){var e=a(this);w.a11y.makeFocusable(e),w.a11y.addRole(e,"button"),w.a11y.addLabel(e,w.params.paginationBulletMessage.replace(/{{index}}/,e.index()+1))})},destroy:function(){w.a11y.liveRegion&&w.a11y.liveRegion.length>0&&w.a11y.liveRegion.remove()}},w.init=function(){w.params.loop&&w.createLoop(),w.updateContainerSize(),w.updateSlidesSize(),w.updatePagination(),w.params.scrollbar&&w.scrollbar&&w.scrollbar.set(),"slide"!==w.params.effect&&w.effects[w.params.effect]&&(w.params.loop||w.updateProgress(),w.effects[w.params.effect].setTranslate()),w.params.loop?w.slideTo(w.params.initialSlide+w.loopedSlides,0,w.params.runCallbacksOnInit):(w.slideTo(w.params.initialSlide,0,w.params.runCallbacksOnInit),0===w.params.initialSlide&&(w.parallax&&w.params.parallax&&w.parallax.setTranslate(),w.lazy&&w.params.lazyLoading&&(w.lazy.load(),w.lazy.initialImageLoaded=!0))),w.attachEvents(),w.params.observer&&w.support.observer&&w.initObservers(),w.params.preloadImages&&!w.params.lazyLoading&&w.preloadImages(),w.params.autoplay&&w.startAutoplay(),w.params.keyboardControl&&w.enableKeyboardControl&&w.enableKeyboardControl(),w.params.mousewheelControl&&w.enableMousewheelControl&&w.enableMousewheelControl(),w.params.hashnav&&w.hashnav&&w.hashnav.init(),w.params.a11y&&w.a11y&&w.a11y.init(),w.emit("onInit",w)},w.cleanupStyles=function(){w.container.removeClass(w.classNames.join(" ")).removeAttr("style"),w.wrapper.removeAttr("style"),w.slides&&w.slides.length&&w.slides.removeClass([w.params.slideVisibleClass,w.params.slideActiveClass,w.params.slideNextClass,w.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"),w.paginationContainer&&w.paginationContainer.length&&w.paginationContainer.removeClass(w.params.paginationHiddenClass),w.bullets&&w.bullets.length&&w.bullets.removeClass(w.params.bulletActiveClass),w.params.prevButton&&a(w.params.prevButton).removeClass(w.params.buttonDisabledClass),w.params.nextButton&&a(w.params.nextButton).removeClass(w.params.buttonDisabledClass),w.params.scrollbar&&w.scrollbar&&(w.scrollbar.track&&w.scrollbar.track.length&&w.scrollbar.track.removeAttr("style"),w.scrollbar.drag&&w.scrollbar.drag.length&&w.scrollbar.drag.removeAttr("style"))},w.destroy=function(e,a){w.detachEvents(),w.stopAutoplay(),w.params.loop&&w.destroyLoop(),a&&w.cleanupStyles(),w.disconnectObservers(),w.params.keyboardControl&&w.disableKeyboardControl&&w.disableKeyboardControl(),w.params.mousewheelControl&&w.disableMousewheelControl&&w.disableMousewheelControl(),w.params.a11y&&w.a11y&&w.a11y.destroy(),w.emit("onDestroy"),e!==!1&&(w=null)},w.init(),w}};t.prototype={isSafari:function(){var e=navigator.userAgent.toLowerCase();return e.indexOf("safari")>=0&&e.indexOf("chrome")<0&&e.indexOf("android")<0}(),isUiWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),isArray:function(e){return"[object Array]"===Object.prototype.toString.apply(e)},browser:{ie:window.navigator.pointerEnabled||window.navigator.msPointerEnabled,ieTouch:window.navigator.msPointerEnabled&&window.navigator.msMaxTouchPoints>1||window.navigator.pointerEnabled&&window.navigator.maxTouchPoints>1},device:function(){var e=navigator.userAgent,a=e.match(/(Android);?[\s\/]+([\d.]+)?/),t=e.match(/(iPad).*OS\s([\d_]+)/),r=e.match(/(iPod)(.*OS\s([\d_]+))?/),s=!t&&e.match(/(iPhone\sOS)\s([\d_]+)/);return{ios:t||s||r,android:a}}(),support:{touch:window.Modernizr&&Modernizr.touch===!0||function(){return!!("ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch)}(),transforms3d:window.Modernizr&&Modernizr.csstransforms3d===!0||function(){var e=document.createElement("div").style;return"webkitPerspective"in e||"MozPerspective"in e||"OPerspective"in e||"MsPerspective"in e||"perspective"in e}(),flexbox:function(){for(var e=document.createElement("div").style,a="alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "),t=0;t<a.length;t++)if(a[t]in e)return!0}(),observer:function(){return"MutationObserver"in window||"WebkitMutationObserver"in window}()},plugins:{}};for(var r=(function(){var e=function(e){var a=this,t=0;for(t=0;t<e.length;t++)a[t]=e[t];return a.length=e.length,this},a=function(a,t){var r=[],s=0;if(a&&!t&&a instanceof e)return a;if(a)if("string"==typeof a){var i,n,o=a.trim();if(o.indexOf("<")>=0&&o.indexOf(">")>=0){var l="div";for(0===o.indexOf("<li")&&(l="ul"),0===o.indexOf("<tr")&&(l="tbody"),(0===o.indexOf("<td")||0===o.indexOf("<th"))&&(l="tr"),0===o.indexOf("<tbody")&&(l="table"),0===o.indexOf("<option")&&(l="select"),n=document.createElement(l),n.innerHTML=a,s=0;s<n.childNodes.length;s++)r.push(n.childNodes[s])}else for(i=t||"#"!==a[0]||a.match(/[ .<>:~]/)?(t||document).querySelectorAll(a):[document.getElementById(a.split("#")[1])],s=0;s<i.length;s++)i[s]&&r.push(i[s])}else if(a.nodeType||a===window||a===document)r.push(a);else if(a.length>0&&a[0].nodeType)for(s=0;s<a.length;s++)r.push(a[s]);return new e(r)};return e.prototype={addClass:function(e){if("undefined"==typeof e)return this;for(var a=e.split(" "),t=0;t<a.length;t++)for(var r=0;r<this.length;r++)this[r].classList.add(a[t]);return this},removeClass:function(e){for(var a=e.split(" "),t=0;t<a.length;t++)for(var r=0;r<this.length;r++)this[r].classList.remove(a[t]);return this},hasClass:function(e){return this[0]?this[0].classList.contains(e):!1},toggleClass:function(e){for(var a=e.split(" "),t=0;t<a.length;t++)for(var r=0;r<this.length;r++)this[r].classList.toggle(a[t]);return this},attr:function(e,a){if(1===arguments.length&&"string"==typeof e)return this[0]?this[0].getAttribute(e):void 0;for(var t=0;t<this.length;t++)if(2===arguments.length)this[t].setAttribute(e,a);else for(var r in e)this[t][r]=e[r],this[t].setAttribute(r,e[r]);return this},removeAttr:function(e){for(var a=0;a<this.length;a++)this[a].removeAttribute(e);return this},data:function(e,a){if("undefined"==typeof a){if(this[0]){var t=this[0].getAttribute("data-"+e);return t?t:this[0].dom7ElementDataStorage&&e in this[0].dom7ElementDataStorage?this[0].dom7ElementDataStorage[e]:void 0}return void 0}for(var r=0;r<this.length;r++){var s=this[r];s.dom7ElementDataStorage||(s.dom7ElementDataStorage={}),s.dom7ElementDataStorage[e]=a}return this},transform:function(e){for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransform=t.MsTransform=t.msTransform=t.MozTransform=t.OTransform=t.transform=e}return this},transition:function(e){"string"!=typeof e&&(e+="ms");for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransitionDuration=t.MsTransitionDuration=t.msTransitionDuration=t.MozTransitionDuration=t.OTransitionDuration=t.transitionDuration=e}return this},on:function(e,t,r,s){function i(e){var s=e.target;if(a(s).is(t))r.call(s,e);else for(var i=a(s).parents(),n=0;n<i.length;n++)a(i[n]).is(t)&&r.call(i[n],e)}var n,o,l=e.split(" ");for(n=0;n<this.length;n++)if("function"==typeof t||t===!1)for("function"==typeof t&&(r=arguments[1],s=arguments[2]||!1),o=0;o<l.length;o++)this[n].addEventListener(l[o],r,s);else for(o=0;o<l.length;o++)this[n].dom7LiveListeners||(this[n].dom7LiveListeners=[]),this[n].dom7LiveListeners.push({listener:r,liveListener:i}),this[n].addEventListener(l[o],i,s);return this},off:function(e,a,t,r){for(var s=e.split(" "),i=0;i<s.length;i++)for(var n=0;n<this.length;n++)if("function"==typeof a||a===!1)"function"==typeof a&&(t=arguments[1],r=arguments[2]||!1),this[n].removeEventListener(s[i],t,r);else if(this[n].dom7LiveListeners)for(var o=0;o<this[n].dom7LiveListeners.length;o++)this[n].dom7LiveListeners[o].listener===t&&this[n].removeEventListener(s[i],this[n].dom7LiveListeners[o].liveListener,r);return this},once:function(e,a,t,r){function s(n){t(n),i.off(e,a,s,r)}var i=this;"function"==typeof a&&(a=!1,t=arguments[1],r=arguments[2]),i.on(e,a,s,r)},trigger:function(e,a){for(var t=0;t<this.length;t++){var r;try{r=new window.CustomEvent(e,{detail:a,bubbles:!0,cancelable:!0})}catch(s){r=document.createEvent("Event"),r.initEvent(e,!0,!0),r.detail=a}this[t].dispatchEvent(r)}return this},transitionEnd:function(e){function a(i){if(i.target===this)for(e.call(this,i),t=0;t<r.length;t++)s.off(r[t],a)}var t,r=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],s=this;if(e)for(t=0;t<r.length;t++)s.on(r[t],a);return this},width:function(){return this[0]===window?window.innerWidth:this.length>0?parseFloat(this.css("width")):null},outerWidth:function(e){return this.length>0?e?this[0].offsetWidth+parseFloat(this.css("margin-right"))+parseFloat(this.css("margin-left")):this[0].offsetWidth:null},height:function(){return this[0]===window?window.innerHeight:this.length>0?parseFloat(this.css("height")):null},outerHeight:function(e){return this.length>0?e?this[0].offsetHeight+parseFloat(this.css("margin-top"))+parseFloat(this.css("margin-bottom")):this[0].offsetHeight:null},offset:function(){if(this.length>0){var e=this[0],a=e.getBoundingClientRect(),t=document.body,r=e.clientTop||t.clientTop||0,s=e.clientLeft||t.clientLeft||0,i=window.pageYOffset||e.scrollTop,n=window.pageXOffset||e.scrollLeft;return{top:a.top+i-r,left:a.left+n-s}}return null},css:function(e,a){var t;if(1===arguments.length){if("string"!=typeof e){for(t=0;t<this.length;t++)for(var r in e)this[t].style[r]=e[r];return this}if(this[0])return window.getComputedStyle(this[0],null).getPropertyValue(e)}if(2===arguments.length&&"string"==typeof e){for(t=0;t<this.length;t++)this[t].style[e]=a;return this}return this},each:function(e){for(var a=0;a<this.length;a++)e.call(this[a],a,this[a]);return this},html:function(e){if("undefined"==typeof e)return this[0]?this[0].innerHTML:void 0;for(var a=0;a<this.length;a++)this[a].innerHTML=e;return this},is:function(t){if(!this[0])return!1;var r,s;if("string"==typeof t){var i=this[0];if(i===document)return t===document;if(i===window)return t===window;if(i.matches)return i.matches(t);if(i.webkitMatchesSelector)return i.webkitMatchesSelector(t);if(i.mozMatchesSelector)return i.mozMatchesSelector(t);if(i.msMatchesSelector)return i.msMatchesSelector(t);for(r=a(t),s=0;s<r.length;s++)if(r[s]===this[0])return!0;return!1}if(t===document)return this[0]===document;if(t===window)return this[0]===window;if(t.nodeType||t instanceof e){for(r=t.nodeType?[t]:t,s=0;s<r.length;s++)if(r[s]===this[0])return!0;return!1}return!1},index:function(){if(this[0]){for(var e=this[0],a=0;null!==(e=e.previousSibling);)1===e.nodeType&&a++;return a}return void 0},eq:function(a){if("undefined"==typeof a)return this;var t,r=this.length;return a>r-1?new e([]):0>a?(t=r+a,new e(0>t?[]:[this[t]])):new e([this[a]])},append:function(a){var t,r;for(t=0;t<this.length;t++)if("string"==typeof a){var s=document.createElement("div");for(s.innerHTML=a;s.firstChild;)this[t].appendChild(s.firstChild)}else if(a instanceof e)for(r=0;r<a.length;r++)this[t].appendChild(a[r]);else this[t].appendChild(a);return this},prepend:function(a){var t,r;for(t=0;t<this.length;t++)if("string"==typeof a){var s=document.createElement("div");for(s.innerHTML=a,r=s.childNodes.length-1;r>=0;r--)this[t].insertBefore(s.childNodes[r],this[t].childNodes[0])}else if(a instanceof e)for(r=0;r<a.length;r++)this[t].insertBefore(a[r],this[t].childNodes[0]);else this[t].insertBefore(a,this[t].childNodes[0]);return this},insertBefore:function(e){for(var t=a(e),r=0;r<this.length;r++)if(1===t.length)t[0].parentNode.insertBefore(this[r],t[0]);else if(t.length>1)for(var s=0;s<t.length;s++)t[s].parentNode.insertBefore(this[r].cloneNode(!0),t[s])},insertAfter:function(e){for(var t=a(e),r=0;r<this.length;r++)if(1===t.length)t[0].parentNode.insertBefore(this[r],t[0].nextSibling);else if(t.length>1)for(var s=0;s<t.length;s++)t[s].parentNode.insertBefore(this[r].cloneNode(!0),t[s].nextSibling)},next:function(t){return new e(this.length>0?t?this[0].nextElementSibling&&a(this[0].nextElementSibling).is(t)?[this[0].nextElementSibling]:[]:this[0].nextElementSibling?[this[0].nextElementSibling]:[]:[])},nextAll:function(t){var r=[],s=this[0];if(!s)return new e([]);for(;s.nextElementSibling;){
var i=s.nextElementSibling;t?a(i).is(t)&&r.push(i):r.push(i),s=i}return new e(r)},prev:function(t){return new e(this.length>0?t?this[0].previousElementSibling&&a(this[0].previousElementSibling).is(t)?[this[0].previousElementSibling]:[]:this[0].previousElementSibling?[this[0].previousElementSibling]:[]:[])},prevAll:function(t){var r=[],s=this[0];if(!s)return new e([]);for(;s.previousElementSibling;){var i=s.previousElementSibling;t?a(i).is(t)&&r.push(i):r.push(i),s=i}return new e(r)},parent:function(e){for(var t=[],r=0;r<this.length;r++)e?a(this[r].parentNode).is(e)&&t.push(this[r].parentNode):t.push(this[r].parentNode);return a(a.unique(t))},parents:function(e){for(var t=[],r=0;r<this.length;r++)for(var s=this[r].parentNode;s;)e?a(s).is(e)&&t.push(s):t.push(s),s=s.parentNode;return a(a.unique(t))},find:function(a){for(var t=[],r=0;r<this.length;r++)for(var s=this[r].querySelectorAll(a),i=0;i<s.length;i++)t.push(s[i]);return new e(t)},children:function(t){for(var r=[],s=0;s<this.length;s++)for(var i=this[s].childNodes,n=0;n<i.length;n++)t?1===i[n].nodeType&&a(i[n]).is(t)&&r.push(i[n]):1===i[n].nodeType&&r.push(i[n]);return new e(a.unique(r))},remove:function(){for(var e=0;e<this.length;e++)this[e].parentNode&&this[e].parentNode.removeChild(this[e]);return this},add:function(){var e,t,r=this;for(e=0;e<arguments.length;e++){var s=a(arguments[e]);for(t=0;t<s.length;t++)r[r.length]=s[t],r.length++}return r}},a.fn=e.prototype,a.unique=function(e){for(var a=[],t=0;t<e.length;t++)-1===a.indexOf(e[t])&&a.push(e[t]);return a},a}()),s=["jQuery","Zepto","Dom7"],i=0;i<s.length;i++)window[s[i]]&&e(window[s[i]]);var n;n="undefined"==typeof r?window.Dom7||window.Zepto||window.jQuery:r,n&&("transitionEnd"in n.fn||(n.fn.transitionEnd=function(e){function a(i){if(i.target===this)for(e.call(this,i),t=0;t<r.length;t++)s.off(r[t],a)}var t,r=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],s=this;if(e)for(t=0;t<r.length;t++)s.on(r[t],a);return this}),"transform"in n.fn||(n.fn.transform=function(e){for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransform=t.MsTransform=t.msTransform=t.MozTransform=t.OTransform=t.transform=e}return this}),"transition"in n.fn||(n.fn.transition=function(e){"string"!=typeof e&&(e+="ms");for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransitionDuration=t.MsTransitionDuration=t.msTransitionDuration=t.MozTransitionDuration=t.OTransitionDuration=t.transitionDuration=e}return this})),window.Swiper=t}(),"undefined"!=typeof module?module.exports=window.Swiper:"function"==typeof define&&define.amd&&define([],function(){"use strict";return window.Swiper});
//# sourceMappingURL=maps/swiper.min.js.map;
