jQuery(function () {
  initMobileNav();
  initTabs();
  initInViewport(); //animate
  initOwlCarousel();
});

function initOwlCarousel() {
  $(document).ready(function () {
    var owl = $('.owl-carousel');
    owl.on('changed.owl.carousel', function (event) {
      var current = event.item.index;
      var prev = $(event.target)
        .find('.owl-item')
        .eq(current - 1);

      $('.owl-item').removeClass('previous-active');
      prev.addClass('previous-active');
    });

    owl.on('changed.owl.carousel', function (event) {
      var current = event.item.index;
      var prev = $(event.target)
        .find('.owl-item')
        .eq(current - 2);

      $('.owl-item').removeClass('previous-previous');
      prev.addClass('previous-previous');
    });
    owl.owlCarousel({
      loop: true,
      margin: 10,
      dots: false,
      // autoplay: true,
      // autoplaySpeed: 10,
      // smartSpeed: 700,
      // autoplayTimeout: 4000,
      responsive: {
        0: { items: 3 },
        370: { items: 3 },
        600: { items: 3 },
        960: { items: 3 },
        1200: { items: 5 }
      },
      center: true
    });

    owl.on('mousewheel', '.owl-stage', function (e) {
      if (e.originalEvent.deltaY > 0) {
        owl.trigger('next.owl');
      } else {
        owl.trigger('prev.owl');
      }
      e.preventDefault();
    });
  });
}

// in view port init
function initInViewport() {
  jQuery('.viewport-section').itemInViewport({});
}

// loaded state script
(function (w) {
  w.addEventListener('load', function () {
    var loader = document.querySelector('html.loader');
    if (loader) {
      loader.classList.add('loaded');
    }
  });
})(window);

// content tabs init
function initTabs() {
  jQuery('.tabset-dotted').tabset({
    tabLinks: 'a',
    addToParent: true
  });
}

// mobile menu init
function initMobileNav() {
  jQuery('body').mobileNav({
    menuActiveClass: 'nav-active',
    menuOpener: '.nav-opener' // burger
  });
}

/*
 * Simple Mobile Navigation
 */
(function ($) {
  function MobileNav(options) {
    this.options = $.extend(
      {
        container: null,
        hideOnClickOutside: false,
        menuActiveClass: 'nav-active',
        menuOpener: '.nav-opener',
        menuDrop: '.nav-drop',
        toggleEvent: 'click',
        outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
      },
      options
    );
    this.initStructure();
    this.attachEvents();
  }
  MobileNav.prototype = {
    initStructure: function () {
      this.page = $('html');
      this.container = $(this.options.container);
      this.opener = this.container.find(this.options.menuOpener);
      this.drop = this.container.find(this.options.menuDrop);
    },
    attachEvents: function () {
      var self = this;

      if (activateResizeHandler) {
        activateResizeHandler();
        activateResizeHandler = null;
      }

      this.outsideClickHandler = function (e) {
        if (self.isOpened()) {
          var target = $(e.target);
          if (
            !target.closest(self.opener).length &&
            !target.closest(self.drop).length
          ) {
            self.hide();
          }
        }
      };

      this.openerClickHandler = function (e) {
        e.preventDefault();
        self.toggle();
      };

      this.opener.on(this.options.toggleEvent, this.openerClickHandler);
    },
    isOpened: function () {
      return this.container.hasClass(this.options.menuActiveClass);
    },
    show: function () {
      this.container.addClass(this.options.menuActiveClass);
      if (this.options.hideOnClickOutside) {
        this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    hide: function () {
      this.container.removeClass(this.options.menuActiveClass);
      if (this.options.hideOnClickOutside) {
        this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    toggle: function () {
      if (this.isOpened()) {
        this.hide();
      } else {
        this.show();
      }
    },
    destroy: function () {
      this.container.removeClass(this.options.menuActiveClass);
      this.opener.off(this.options.toggleEvent, this.clickHandler);
      this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
    }
  };

  var activateResizeHandler = function () {
    var win = $(window),
      doc = $('html'),
      resizeClass = 'resize-active',
      flag,
      timer;
    var removeClassHandler = function () {
      flag = false;
      doc.removeClass(resizeClass);
    };
    var resizeHandler = function () {
      if (!flag) {
        flag = true;
        doc.addClass(resizeClass);
      }
      clearTimeout(timer);
      timer = setTimeout(removeClassHandler, 500);
    };
    win.on('resize orientationchange', resizeHandler);
  };

  $.fn.mobileNav = function (opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    return this.each(function () {
      var $container = jQuery(this);
      var instance = $container.data('MobileNav');

      if (typeof opt === 'object' || typeof opt === 'undefined') {
        $container.data(
          'MobileNav',
          new MobileNav(
            $.extend(
              {
                container: this
              },
              opt
            )
          )
        );
      } else if (typeof method === 'string' && instance) {
        if (typeof instance[method] === 'function') {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };
})(jQuery);

/*
 * jQuery Tabs plugin
 */

(function ($, $win) {
  'use strict';

  function Tabset($holder, options) {
    this.$holder = $holder;
    this.options = options;

    this.init();
  }

  Tabset.prototype = {
    init: function () {
      this.$tabLinks = this.$holder.find(this.options.tabLinks);

      this.setStartActiveIndex();
      this.setActiveTab();

      if (this.options.autoHeight) {
        this.$tabHolder = $(
          this.$tabLinks.eq(0).attr(this.options.attrib)
        ).parent();
      }

      this.makeCallback('onInit', this);
    },

    setStartActiveIndex: function () {
      var $classTargets = this.getClassTarget(this.$tabLinks);
      var $activeLink = $classTargets.filter('.' + this.options.activeClass);
      var $hashLink = this.$tabLinks.filter(
        '[' + this.options.attrib + '="' + location.hash + '"]'
      );
      var activeIndex;

      if (this.options.checkHash && $hashLink.length) {
        $activeLink = $hashLink;
      }

      activeIndex = $classTargets.index($activeLink);

      this.activeTabIndex = this.prevTabIndex =
        activeIndex === -1 ? (this.options.defaultTab ? 0 : null) : activeIndex;
    },

    setActiveTab: function () {
      var self = this;

      this.$tabLinks.each(function (i, link) {
        var $link = $(link);
        var $classTarget = self.getClassTarget($link);
        var $tab = $($link.attr(self.options.attrib));

        if (i !== self.activeTabIndex) {
          $classTarget.removeClass(self.options.activeClass);
          $tab
            .addClass(self.options.tabHiddenClass)
            .removeClass(self.options.activeClass);
        } else {
          $classTarget.addClass(self.options.activeClass);
          $tab
            .removeClass(self.options.tabHiddenClass)
            .addClass(self.options.activeClass);
        }

        self.attachTabLink($link, i);
      });
    },

    attachTabLink: function ($link, i) {
      var self = this;

      $link.on(this.options.event + '.tabset', function (e) {
        e.preventDefault();

        if (
          self.activeTabIndex === self.prevTabIndex &&
          self.activeTabIndex !== i
        ) {
          self.activeTabIndex = i;
          self.switchTabs();
        }
        if (self.options.checkHash) {
          location.hash = jQuery(this).attr('href').split('#')[1];
        }
      });
    },

    resizeHolder: function (height) {
      var self = this;

      if (height) {
        this.$tabHolder.height(height);
        setTimeout(function () {
          self.$tabHolder.addClass('transition');
        }, 10);
      } else {
        self.$tabHolder.removeClass('transition').height('');
      }
    },

    switchTabs: function () {
      var self = this;

      var $prevLink = this.$tabLinks.eq(this.prevTabIndex);
      var $nextLink = this.$tabLinks.eq(this.activeTabIndex);

      var $prevTab = this.getTab($prevLink);
      var $nextTab = this.getTab($nextLink);

      $prevTab.removeClass(this.options.activeClass);

      if (self.haveTabHolder()) {
        this.resizeHolder($prevTab.outerHeight());
      }

      setTimeout(
        function () {
          self.getClassTarget($prevLink).removeClass(self.options.activeClass);

          $prevTab.addClass(self.options.tabHiddenClass);
          $nextTab
            .removeClass(self.options.tabHiddenClass)
            .addClass(self.options.activeClass);

          self.getClassTarget($nextLink).addClass(self.options.activeClass);

          if (self.haveTabHolder()) {
            self.resizeHolder($nextTab.outerHeight());

            setTimeout(function () {
              self.resizeHolder();
              self.prevTabIndex = self.activeTabIndex;
              self.makeCallback('onChange', self);
            }, self.options.animSpeed);
          } else {
            self.prevTabIndex = self.activeTabIndex;
          }
        },
        this.options.autoHeight ? this.options.animSpeed : 1
      );
    },

    getClassTarget: function ($link) {
      return this.options.addToParent ? $link.parent() : $link;
    },

    getActiveTab: function () {
      return this.getTab(this.$tabLinks.eq(this.activeTabIndex));
    },

    getTab: function ($link) {
      return $($link.attr(this.options.attrib));
    },

    haveTabHolder: function () {
      return this.$tabHolder && this.$tabHolder.length;
    },

    destroy: function () {
      var self = this;

      this.$tabLinks.off('.tabset').each(function () {
        var $link = $(this);

        self.getClassTarget($link).removeClass(self.options.activeClass);
        $($link.attr(self.options.attrib)).removeClass(
          self.options.activeClass + ' ' + self.options.tabHiddenClass
        );
      });

      this.$holder.removeData('Tabset');
    },

    makeCallback: function (name) {
      if (typeof this.options[name] === 'function') {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        this.options[name].apply(this, args);
      }
    }
  };

  $.fn.tabset = function (opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    var options = $.extend(
      {
        activeClass: 'active',
        addToParent: false,
        autoHeight: false,
        checkHash: false,
        defaultTab: true,
        animSpeed: 500,
        tabLinks: 'a',
        attrib: 'href',
        event: 'click',
        tabHiddenClass: 'js-tab-hidden'
      },
      opt
    );
    options.autoHeight = options.autoHeight;

    return this.each(function () {
      var $holder = jQuery(this);
      var instance = $holder.data('Tabset');

      if (typeof opt === 'object' || typeof opt === 'undefined') {
        $holder.data('Tabset', new Tabset($holder, options));
      } else if (typeof method === 'string' && instance) {
        if (typeof instance[method] === 'function') {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };
})(jQuery, jQuery(window));

/*
 * jQuery In Viewport plugin
 */
(function ($, $win) {
  'use strict';

  var ScrollDetector = (function () {
    var data = {};

    return {
      init: function () {
        var self = this;

        this.addHolder('win', $win);

        $win.on(
          'load.blockInViewport resize.blockInViewport orientationchange.blockInViewport',
          function () {
            $.each(data, function (holderKey, holderData) {
              self.calcHolderSize(holderData);

              $.each(holderData.items, function (itemKey, itemData) {
                self.calcItemSize(itemKey, itemData);
              });
            });
          }
        );
      },

      addHolder: function (holderKey, $holder) {
        var self = this;
        var holderData = {
          holder: $holder,
          items: {},
          props: {
            height: 0,
            scroll: 0
          }
        };

        data[holderKey] = holderData;

        $holder.on('scroll.blockInViewport', function () {
          self.calcHolderScroll(holderData);

          $.each(holderData.items, function (itemKey, itemData) {
            self.calcItemScroll(itemKey, itemData);
          });
        });

        this.calcHolderSize(data[holderKey]);
      },

      calcHolderSize: function (holderData) {
        var holderOffset =
          window.self !== holderData.holder[0] ? holderData.holder.offset() : 0;

        holderData.props.height =
          holderData.holder.get(0) === window
            ? window.innerHeight || document.documentElement.clientHeight
            : holderData.holder.outerHeight();
        holderData.props.offset = holderOffset ? holderOffset.top : 0;

        this.calcHolderScroll(holderData);
      },

      calcItemSize: function (itemKey, itemData) {
        itemData.offset =
          itemData.$el.offset().top - itemData.holderProps.props.offset;
        itemData.height = itemData.$el.outerHeight();

        this.calcItemScroll(itemKey, itemData);
      },

      calcHolderScroll: function (holderData) {
        holderData.props.scroll = holderData.holder.scrollTop();
      },

      calcItemScroll: function (itemKey, itemData) {
        var itemInViewPortFromUp;
        var itemInViewPortFromDown;
        var itemOutViewPort;
        var holderProps = itemData.holderProps.props;

        switch (itemData.options.visibleMode) {
          case 1:
            itemInViewPortFromDown =
              itemData.offset < holderProps.scroll + holderProps.height / 2 ||
              itemData.offset + itemData.height <
                holderProps.scroll + holderProps.height;
            itemInViewPortFromUp =
              itemData.offset > holderProps.scroll ||
              itemData.offset + itemData.height >
                holderProps.scroll + holderProps.height / 2;
            break;

          case 2:
            itemInViewPortFromDown =
              itemInViewPortFromDown ||
              itemData.offset < holderProps.scroll + holderProps.height / 2 ||
              itemData.offset + itemData.height / 2 <
                holderProps.scroll + holderProps.height;
            itemInViewPortFromUp =
              itemInViewPortFromUp ||
              itemData.offset + itemData.height / 2 > holderProps.scroll ||
              itemData.offset + itemData.height >
                holderProps.scroll + holderProps.height / 2;
            break;

          case 3:
            itemInViewPortFromDown =
              itemInViewPortFromDown ||
              itemData.offset < holderProps.scroll + holderProps.height / 2 ||
              itemData.offset < holderProps.scroll + holderProps.height;
            itemInViewPortFromUp =
              itemInViewPortFromUp ||
              itemData.offset + itemData.height > holderProps.scroll ||
              itemData.offset + itemData.height >
                holderProps.scroll + holderProps.height / 2;
            break;

          default:
            itemInViewPortFromDown =
              itemInViewPortFromDown ||
              itemData.offset < holderProps.scroll + holderProps.height / 2 ||
              itemData.offset +
                Math.min(itemData.options.visibleMode, itemData.height) <
                holderProps.scroll + holderProps.height;
            itemInViewPortFromUp =
              itemInViewPortFromUp ||
              itemData.offset +
                itemData.height -
                Math.min(itemData.options.visibleMode, itemData.height) >
                holderProps.scroll ||
              itemData.offset + itemData.height >
                holderProps.scroll + holderProps.height / 2;
            break;
        }

        if (itemInViewPortFromUp && itemInViewPortFromDown) {
          if (!itemData.state) {
            itemData.state = true;
            itemData.$el
              .addClass(itemData.options.activeClass)
              .trigger('in-viewport', true);

            if (
              itemData.options.once ||
              ($.isFunction(itemData.options.onShow) &&
                itemData.options.onShow(itemData))
            ) {
              delete itemData.holderProps.items[itemKey];
            }
          }
        } else {
          itemOutViewPort =
            itemData.offset < holderProps.scroll + holderProps.height &&
            itemData.offset + itemData.height > holderProps.scroll;

          if ((itemData.state || isNaN(itemData.state)) && !itemOutViewPort) {
            itemData.state = false;
            itemData.$el
              .removeClass(itemData.options.activeClass)
              .trigger('in-viewport', false);
          }
        }
      },

      addItem: function (el, options) {
        var itemKey = 'item' + this.getRandomValue();
        var newItem = {
          $el: $(el),
          options: options
        };
        var holderKeyDataName = 'in-viewport-holder';

        var $holder = newItem.$el.closest(options.holder);
        var holderKey = $holder.data(holderKeyDataName);

        if (!$holder.length) {
          holderKey = 'win';
        } else if (!holderKey) {
          holderKey = 'holder' + this.getRandomValue();
          $holder.data(holderKeyDataName, holderKey);

          this.addHolder(holderKey, $holder);
        }

        newItem.holderProps = data[holderKey];

        data[holderKey].items[itemKey] = newItem;

        this.calcItemSize(itemKey, newItem);
      },

      getRandomValue: function () {
        return (Math.random() * 100000).toFixed(0);
      },

      destroy: function () {
        $win.off('.blockInViewport');

        $.each(data, function (key, value) {
          value.holder.off('.blockInViewport');

          $.each(value.items, function (key, value) {
            value.$el.removeClass(value.options.activeClass);
            value.$el.get(0).itemInViewportAdded = null;
          });
        });

        data = {};
      }
    };
  })();

  ScrollDetector.init();

  $.fn.itemInViewport = function (options) {
    options = $.extend(
      {
        activeClass: 'in-viewport',
        once: true,
        holder: '',
        visibleMode: 1 // 1 - full block, 2 - half block, 3 - immediate, 4... - custom
      },
      options
    );

    return this.each(function () {
      if (this.itemInViewportAdded) {
        return;
      }

      this.itemInViewportAdded = true;

      ScrollDetector.addItem(this, options);
    });
  };
})(jQuery, jQuery(window));

/*
 * jQuery In Viewport plugin
 */
(function ($, $win) {
  'use strict';

  var ScrollDetector = (function () {
    var data = {};

    return {
      init: function () {
        var self = this;

        this.addHolder('win', $win);

        $win.on(
          'load.blockInViewport resize.blockInViewport orientationchange.blockInViewport',
          function () {
            $.each(data, function (holderKey, holderData) {
              self.calcHolderSize(holderData);

              $.each(holderData.items, function (itemKey, itemData) {
                self.calcItemSize(itemKey, itemData);
              });
            });
          }
        );
      },

      addHolder: function (holderKey, $holder) {
        var self = this;
        var holderData = {
          holder: $holder,
          items: {},
          props: {
            height: 0,
            scroll: 0
          }
        };

        data[holderKey] = holderData;

        $holder.on('scroll.blockInViewport', function () {
          self.calcHolderScroll(holderData);

          $.each(holderData.items, function (itemKey, itemData) {
            self.calcItemScroll(itemKey, itemData);
          });
        });

        this.calcHolderSize(data[holderKey]);
      },

      calcHolderSize: function (holderData) {
        var holderOffset =
          window.self !== holderData.holder[0] ? holderData.holder.offset() : 0;

        holderData.props.height =
          holderData.holder.get(0) === window
            ? window.innerHeight || document.documentElement.clientHeight
            : holderData.holder.outerHeight();
        holderData.props.offset = holderOffset ? holderOffset.top : 0;

        this.calcHolderScroll(holderData);
      },

      calcItemSize: function (itemKey, itemData) {
        itemData.offset =
          itemData.$el.offset().top - itemData.holderProps.props.offset;
        itemData.height = itemData.$el.outerHeight();

        this.calcItemScroll(itemKey, itemData);
      },

      calcHolderScroll: function (holderData) {
        holderData.props.scroll = holderData.holder.scrollTop();
      },

      calcItemScroll: function (itemKey, itemData) {
        var itemInViewPortFromUp;
        var itemInViewPortFromDown;
        var itemOutViewPort;
        var holderProps = itemData.holderProps.props;

        switch (itemData.options.visibleMode) {
          case 1:
            itemInViewPortFromDown =
              itemData.offset < holderProps.scroll + holderProps.height / 2 ||
              itemData.offset + itemData.height <
                holderProps.scroll + holderProps.height;
            itemInViewPortFromUp =
              itemData.offset > holderProps.scroll ||
              itemData.offset + itemData.height >
                holderProps.scroll + holderProps.height / 2;
            break;

          case 2:
            itemInViewPortFromDown =
              itemInViewPortFromDown ||
              itemData.offset < holderProps.scroll + holderProps.height / 2 ||
              itemData.offset + itemData.height / 2 <
                holderProps.scroll + holderProps.height;
            itemInViewPortFromUp =
              itemInViewPortFromUp ||
              itemData.offset + itemData.height / 2 > holderProps.scroll ||
              itemData.offset + itemData.height >
                holderProps.scroll + holderProps.height / 2;
            break;

          case 3:
            itemInViewPortFromDown =
              itemInViewPortFromDown ||
              itemData.offset < holderProps.scroll + holderProps.height / 2 ||
              itemData.offset < holderProps.scroll + holderProps.height;
            itemInViewPortFromUp =
              itemInViewPortFromUp ||
              itemData.offset + itemData.height > holderProps.scroll ||
              itemData.offset + itemData.height >
                holderProps.scroll + holderProps.height / 2;
            break;

          default:
            itemInViewPortFromDown =
              itemInViewPortFromDown ||
              itemData.offset < holderProps.scroll + holderProps.height / 2 ||
              itemData.offset +
                Math.min(itemData.options.visibleMode, itemData.height) <
                holderProps.scroll + holderProps.height;
            itemInViewPortFromUp =
              itemInViewPortFromUp ||
              itemData.offset +
                itemData.height -
                Math.min(itemData.options.visibleMode, itemData.height) >
                holderProps.scroll ||
              itemData.offset + itemData.height >
                holderProps.scroll + holderProps.height / 2;
            break;
        }

        if (itemInViewPortFromUp && itemInViewPortFromDown) {
          if (!itemData.state) {
            itemData.state = true;
            itemData.$el
              .addClass(itemData.options.activeClass)
              .trigger('in-viewport', true);

            if (
              itemData.options.once ||
              ($.isFunction(itemData.options.onShow) &&
                itemData.options.onShow(itemData))
            ) {
              delete itemData.holderProps.items[itemKey];
            }
          }
        } else {
          itemOutViewPort =
            itemData.offset < holderProps.scroll + holderProps.height &&
            itemData.offset + itemData.height > holderProps.scroll;

          if ((itemData.state || isNaN(itemData.state)) && !itemOutViewPort) {
            itemData.state = false;
            itemData.$el
              .removeClass(itemData.options.activeClass)
              .trigger('in-viewport', false);
          }
        }
      },

      addItem: function (el, options) {
        var itemKey = 'item' + this.getRandomValue();
        var newItem = {
          $el: $(el),
          options: options
        };
        var holderKeyDataName = 'in-viewport-holder';

        var $holder = newItem.$el.closest(options.holder);
        var holderKey = $holder.data(holderKeyDataName);

        if (!$holder.length) {
          holderKey = 'win';
        } else if (!holderKey) {
          holderKey = 'holder' + this.getRandomValue();
          $holder.data(holderKeyDataName, holderKey);

          this.addHolder(holderKey, $holder);
        }

        newItem.holderProps = data[holderKey];

        data[holderKey].items[itemKey] = newItem;

        this.calcItemSize(itemKey, newItem);
      },

      getRandomValue: function () {
        return (Math.random() * 100000).toFixed(0);
      },

      destroy: function () {
        $win.off('.blockInViewport');

        $.each(data, function (key, value) {
          value.holder.off('.blockInViewport');

          $.each(value.items, function (key, value) {
            value.$el.removeClass(value.options.activeClass);
            value.$el.get(0).itemInViewportAdded = null;
          });
        });

        data = {};
      }
    };
  })();

  ScrollDetector.init();

  $.fn.itemInViewport = function (options) {
    options = $.extend(
      {
        activeClass: 'in-viewport',
        once: true,
        holder: '',
        visibleMode: 1 // 1 - full block, 2 - half block, 3 - immediate, 4... - custom
      },
      options
    );

    return this.each(function () {
      if (this.itemInViewportAdded) {
        return;
      }

      this.itemInViewportAdded = true;

      ScrollDetector.addItem(this, options);
    });
  };
})(jQuery, jQuery(window));
