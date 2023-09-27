function handleize(input) {
  let value = input.trim().toLowerCase().replaceAll("[^a-z0-9]+", "-");

}

window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');
      
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;
    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function () {
  var moneyFormat = '$';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if(typeof images === 'string') {
      images = [images];
    }

    for(var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {

    if(src) {

      var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
      if(match) {
        return match[1];
      } else {
        return null;
      }
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    var params = {
      $container: this.$container,
      product: options.product,
      singleOptionSelector: options.singleOptionSelector,
      originalSelectorId: options.originalSelectorId,
      currentVariant: this.currentVariant,
    };


    this.swatches = new slate.Swatches(params);


    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      const quantityError = jQuery('.quantity-error-message',this.$container);

      if (!variant && quantityError) {
        quantityError.addClass('hide');
        return;
      }

      this._updateQty(variant);
      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
      this._setDiscount(variant);
      this._updatePillowsSets(variant);
      this._updateSetButton();

    },

    _updateSetButton: function() {
      let container = jQuery('.set-product-list',this.$container).not('.hide');
      let flag = jQuery('.set-product-list__flag',this.$container);
      let button = jQuery('[data-add-to-cart]',this.$container);
      let hasTagFlag = jQuery('.has-tag-notify',this.$container).length;
      let klavioButton = jQuery('.klaviyo-bis-trigger',this.$container);

      if(flag.length > 0) {
        let flagValue = jQuery(flag,this.$container).attr('data-set-available');
        if(flagValue == 'false' ) {
          jQuery(button).attr('disabled', 'disabled');
          jQuery(button).find('[data-add-to-cart-text]').text('Sold Out');
          if(hasTagFlag>0) {
            button.addClass('hide');
            klavioButton.removeClass('hide')
          }
        } else {
          button.removeClass('hide');
          klavioButton.addClass('hide')
        }
      }
    },

    _updateQty: function(variant) {
      jQuery.getJSON('/cart.js', function(cart) {
        const quantityError = jQuery('.quantity-error-message',this.$container);
        const currentVariant = jQuery('select[data-product-select] option:selected',this.$container);
        const currentVariantID = variant.id;
        const currentVariantInventory = jQuery(currentVariant).attr('data-variant-inventory-quantity');
        if(quantityError) {
          quantityError.addClass('hide');
        }

        jQuery(cart.items).each(function() {
          const item = jQuery(this);
          const itemId = jQuery(item).attr('id');
          const itemQty = jQuery(item).attr('quantity');


          if(itemId == currentVariantID && quantityError ) {
            quantityError.removeClass('hide');
            quantityError.text(`Max ${currentVariantInventory} in cart ${itemQty}`);
          }
        });
      } );
    },

    _updatePillowsSets: function(variant) {
      let setProductList = jQuery('.set-product-list',this.$container);
      let setProductListChecked = jQuery(`.set-product-list[data-variant-id=${variant.id}]`,this.$container);
      setProductList.addClass('hide');
      setProductListChecked.removeClass('hide')

      let propertySetProductList = jQuery('.property-set-product-list',this.$container);
      let propertySetProductListInputs = propertySetProductList.find('input');
      let propertySetProductListChecked = jQuery(`.property-set-product-list[data-variant-id=${variant.id}]`,this.$container);
      let propertySetProductListCheckedInputs = propertySetProductListChecked.find('input');
      propertySetProductListInputs.attr('disabled', true);
      propertySetProductList.hide();
      propertySetProductListChecked.show();
      propertySetProductListCheckedInputs.attr('disabled', false);
    },

    _setDiscount: function(variant) {
      let discountContent = jQuery('.product__price-discount',this.$container);
      let discountValue = Math.round((1 - variant.price / variant.compare_at_price) * 100);

      if(discountContent.length > 0 && variant.compare_at_price != null && discountValue > 0 ) {
        discountContent.removeClass('hide')
        discountContent.text(`-${discountValue}%`);
      } else if (variant.compare_at_price == null) {
        discountContent.addClass('hide')
      } else if (discountValue < 1) {
        discountContent.addClass('hide')
      }
    },

    _filterThumbnails: function(variant) {
      if(variant.featured_image != null && variant.featured_image.alt != null ) {
        $('[data-thumbnail-color]',this.$container).hide();
        $('[data-slide-color]',this.$container).hide();

        let selected_color = variant.featured_image.alt;
        let thumbnail_selector = `[data-thumbnail-color=${selected_color}]`;
        let slide_selector = `[data-slide-color=${selected_color}]`;

        $(thumbnail_selector,this.$container).show();
        $(slide_selector,this.$container).show();

      } else {
        $('[data-thumbnail-color]',this.$container).show();
        $('[data-slide-color]',this.$container).show();
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};
      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param {object} variant - Currently selected variant
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param {object} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();


/*================ Sections ================*/
/**
 * Swatches Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the swatches inputs in any `cart/add` forms that may
 * exist.
 *
 * @namespace swatches
 */

slate.Swatches = (function() {

  var selectors = {
    swatches: '[data-swatch]',
    swatchOptions: '[data-swatch-option]',
  };

  /**
   * Swatches constructor
   *
   * @param {object} options - Settings from `variants.js`
   */
  function Swatches(params) {
    this.$container = params.$container;
    this.product = params.product;
    this.currentVariant = params.currentVariant;
    this.singleOptionSelector = params.singleOptionSelector;
    this.originalSelectorId = params.originalSelectorId;
    this.variants = this.product.variants;
    this.options = this.product.options;
    this.swatches = $(selectors.swatches,this.$container);
    this.swatchOptions = this.swatches.find(selectors.swatchOptions);
    this.colorOptionIndex = this.getOptionIndex('color');
    this.hideSwatchesSelects();
    this.defineAvailableColors();
    this.updateVariantMax(this.currentVariant);

    let self = this;
    this.showAvailableOptions(this, this.swatches);


    $(this.swatchOptions, this.$container).on('change', function(){

      let evt = $(this);
      self.switchSwatches.bind(self)(evt);
    });

    $(`[data-swatch="Color"]`,this.$container).find('.header > span em').text(this.currentVariant.options[self.colorOptionIndex]);
    $(this.swatchOptions, this.$container).parent().change(function() {
      let $option = $(this).find(selectors.swatchOptions);

      if ($option.data('swatch-option') == self.colorOptionIndex) {
        let $swatchHolder = $option.closest(selectors.swatches);
        $swatchHolder.find('.header > span em').text($option.val());
      }
    }, function() {
      let $option = $(this).find(selectors.swatchOptions);

      if ($option.data('swatch-option') == self.colorOptionIndex) {
        let $swatchHolder = $option.closest(selectors.swatches);
        $swatchHolder.find('.header > span em').text($option.val());
      }
    });
  }

  Swatches.prototype = $.extend({}, Swatches.prototype, {

    hideSwatchesSelects: function() {

      let self = this;

      this.swatches.each(function() {
        let $swatch = $(this);
        $(self.singleOptionSelector,self.$container).eq(self.getOptionIndex($swatch.data('swatch'))).parent().hide();
      });
    },

    /**
     * Show only av
     *
     * @param {object} variant - Currently selected variant
     */
    defineAvailableColors: function() {

      let self = this;

      if (this.colorOptionIndex >= 0) {
        $.each(this.variants, function(i, variant) {
          if (variant.available) {
            let $option = self.swatchOptions.filter('#swatch-'+self.colorOptionIndex+'-'+handleize(variant.options[self.colorOptionIndex]));
            self.makeSwatchOptionAvailable($option);
          }
        });
      }
    },

    makeSwatchOptionAvailable: function($option) {

      $option.parent().addClass('available').removeClass('soldout');

      return $option;
    },

    makeSwatchOptionUnavailable: function($option) {
      $option.prop('checked', true).parent().addClass('soldout').removeClass('available');

      return $option;
    },

    getOptionIndex: function(optionName) {
      return this.options.map(v => v.toLowerCase()).indexOf(optionName.toLowerCase());
    },

    getVariantLabels: function(variant) {

      const badgesLists = document.querySelectorAll('.product-badges');
      if(!badgesLists) {
        return;
      }

      badgesLists.forEach((badgesList) => {
        const variantId = badgesList.getAttribute('data-variant-id');

        badgesList.classList.add('hide');
        if(variantId == variant.id) {
          badgesList.classList.remove('hide');
        }
      })
    },

    updateVariantMax: function(variant) {
      const variantQtyMax = jQuery('[data-product-select]',self.$container).find('[data-variant-qty]:selected').attr('data-variant-qty');
      const variantPolicy = jQuery('[data-product-select]',self.$container).find('[data-variant-policy]:selected').attr('data-variant-policy');
      const productQty = $('.product-qty-input',self.$container);
      const productQtyVal = productQty[0].value;

      if ( variantPolicy == 'continue' ) {
        jQuery(productQty).removeAttr('max');
      } else {
        jQuery(productQty).attr('max', variantQtyMax);
        if (productQtyVal > variantQtyMax) {
          jQuery(productQty).attr('value', variantQtyMax);
          jQuery(productQty).val(variantQtyMax);
        }

      }

    },

    switchSwatches: function($option) {
      let self = this;
      let swatchIndex = $option.data('swatch-option');
      let $optionSelector = $(this.singleOptionSelector,self.$container).eq(swatchIndex);
      let optionVal = $option.val();
      if ($optionSelector.val() !== optionVal) {
        let $otherSwatches = this.swatches.filter(function(index) {
          return $(self.swatches[index]).data('option-index') != swatchIndex;
        });
        if (swatchIndex != this.colorOptionIndex) {
          let $swatchesWithoutColor = this.swatches.filter(function(index) {
            return $(self.swatches[index]).data('option-index') != self.colorOptionIndex;
          });
          $otherSwatches = $otherSwatches.filter(value => !$swatchesWithoutColor.has(value));
        }
       /* if ($otherSwatches.length > 0) {
          this.showAvailableOptions(self, $otherSwatches, optionVal, 'switch');
        }*/
        $optionSelector.val(optionVal);
      }

      $(this.singleOptionSelector,self.$container).first().trigger('change');
      this.currentVariant = self.variants.filter(function(v) {
        return v.id == $(self.originalSelectorId,self.$container).val();
      })[0];
    },

    showAvailableOptions: function(self, $swatches, optionVal = '', type = 'load') {

      self.makeSwatchOptionUnavailable($swatches.find(selectors.swatchOptions));

      let hasChecked = false;
      let allSoldOut = true;
      let form = $swatches.closest('form');

      $.each(self.variants, function(i, variant) {
        if(variant.available) {
          allSoldOut = false;
          return;
        }
      })

      if (type == 'load') {
        let currentVariantInfo = jQuery(`.js-current-variant-id`,self.$container);
        let currentVariantOption1 = currentVariantInfo[0].getAttribute('data-current-variant-option1');
        let currentVariantOption2 = currentVariantInfo[0].getAttribute('data-current-variant-option2');
        let currentVariantOption3 = currentVariantInfo[0].getAttribute('data-current-variant-option3');
        if(currentVariantOption1) {
          let currentVariantOption1Input = jQuery(`.swatch-element[data-value='${currentVariantOption1}']`,self.$container);
          currentVariantOption1Input.prop('checked', true);
        }

        if(currentVariantOption2) {
          let currentVariantOption2Input = jQuery(`.swatch-element[data-value='${currentVariantOption2}']`,self.$container);
          currentVariantOption2Input.prop('checked', true);
        }
        if(currentVariantOption2) {
          let currentVariantOption3Input = jQuery(`.swatch-element[data-value='${currentVariantOption3}']`,self.$container);
          currentVariantOption3Input.prop('checked', true);
        }
      }

      if(!allSoldOut || type != 'load') {
        $.each(self.variants, function(i, variant) {
              
          if (self.colorOptionIndex >= 0) {
            if (((variant.options[self.colorOptionIndex] == optionVal) || (optionVal.length === 0 && variant.options[0] == self.currentVariant.options[0])) && variant.available) {
              $.each($swatches, function(i, swatch) {
                let $swatch = $(swatch);
                let currentSwatchIndex = $swatch.data('option-index');
                let $optionSelector = $(self.singleOptionSelector).eq(currentSwatchIndex);
                //let $option = $('[data-value="'+variant.options[currentSwatchIndex]+'"]').find(selectors.swatchOptions).first();
                let $option = $(`[data-value='${variant.options[currentSwatchIndex]}']`).find(selectors.swatchOptions).first();

                self.makeSwatchOptionAvailable($option);
                if (type == 'load') {
                  if (self.currentVariant.options[currentSwatchIndex] == variant.options[currentSwatchIndex]) {
                    $option.prop('checked', true);
                    $optionSelector.val(variant.options[currentSwatchIndex]);
                  }
                } else {
                  if (self.currentVariant){
                    if (self.currentVariant.options[currentSwatchIndex] == variant.options[currentSwatchIndex]) {
                      $option.prop('checked', true);
                      $optionSelector.val(variant.options[currentSwatchIndex]);
                    }else if (!hasChecked) {
                      $option.prop('checked', true);
                      $optionSelector.val(variant.options[currentSwatchIndex]);
                    }
                  }else if (!hasChecked) {
                    $option.prop('checked', true);
                    $optionSelector.val(variant.options[currentSwatchIndex]);
                  }
                  hasChecked = true;
                }
              });
            } else if (((variant.options[self.colorOptionIndex] == optionVal) || (optionVal.length === 0 && variant.options[0] == self.currentVariant.options[0]))){
              $.each($swatches, function(i, swatch) {
                let $swatch = $(swatch);
                let currentSwatchIndex = $swatch.data('option-index');
                let $optionSelector = $(self.singleOptionSelector).eq(currentSwatchIndex);
                //let $option = $('[data-value="'+variant.options[currentSwatchIndex]+'"]').find(selectors.swatchOptions).first();
                let $option = $(`[data-value='${variant.options[currentSwatchIndex]}']`).find(selectors.swatchOptions).first();

                if (type == 'load') {
                  if (self.currentVariant.options[currentSwatchIndex] == variant.options[currentSwatchIndex]) {
                    $option.prop('checked', true);
                    $optionSelector.val(variant.options[currentSwatchIndex]);
                  }
                } else {
                  if (self.currentVariant){
                    if (self.currentVariant.options[currentSwatchIndex] == variant.options[currentSwatchIndex]) {
                      $option.prop('checked', true);
                      $optionSelector.val(variant.options[currentSwatchIndex]);
                    }else if (!hasChecked) {
                      $option.prop('checked', true);
                      $optionSelector.val(variant.options[currentSwatchIndex]);
                    }
                  }else if (!hasChecked) {
                    $option.prop('checked', true);
                    $optionSelector.val(variant.options[currentSwatchIndex]);
                  }
                  hasChecked = true;
                }
              });
            }
          } else {
            $.each($swatches, function(i, swatch) {
              let $swatch = $(swatch);
              let currentSwatchIndex = $swatch.data('option-index');
              let $optionSelector = $(self.singleOptionSelector).eq(currentSwatchIndex);
              //let $option = $('[data-value="' + variant.options[currentSwatchIndex] + '"]').find(selectors.swatchOptions).first();
              let $option = $(`[data-value='${variant.options[currentSwatchIndex]}']`,self.$container).find(selectors.swatchOptions).first();

              self.makeSwatchOptionAvailable($option);

              if (type == 'load') {
                if (self.currentVariant.options[currentSwatchIndex] == variant.options[currentSwatchIndex]) {
                  $option.prop('checked', true);
                  $optionSelector.val(variant.options[currentSwatchIndex]);
                }
              } else {
                if (self.currentVariant){
                  if (self.currentVariant.options[currentSwatchIndex] == variant.options[currentSwatchIndex]) {
                    $option.prop('checked', true);
                    $optionSelector.val(variant.options[currentSwatchIndex]);
                  }else if (!hasChecked) {
                    $option.prop('checked', true);
                    $optionSelector.val(variant.options[currentSwatchIndex]);
                  }
                }else if (!hasChecked) {
                  $option.prop('checked', true);
                  $optionSelector.val(variant.options[currentSwatchIndex]);
                }
                hasChecked = true;
              }
            });
          }
        });

      } else {
        for(let i =0; i<3; i++) {
          if(self.currentVariant.options[i]) {
            let param = self.currentVariant.options[i];
            form.find(`[data-value='${param}']`).find('input').prop('checked', true);
          }
        }
      }
    },
  });

  return Swatches;
})();

/*================ Sections ================*/
/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productSlider: '[data-product-slider]',
    productThumbnails: '[data-product-thumbnails]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]',
    productBtnWrap: '[data-product-btn-wrap]',
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    var self = this;
    this.$container = $(container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }
    var sectionId = this.$container.attr('data-section-id');
    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());
    var options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject
    };

    this.settings = {};
    this.namespace = '.product';

    this.variants = new slate.Variants(options);

    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.currentVariant = this.variants.currentVariant;
    //const currentOptions  = this.getCurrentVariantOptions(this.currentVariant);

    this.$slider = this.$container.find(selectors.productSlider);

    if(this.$slider.length){
      this.$slider.slick({
        slidesToScroll: 1,
        rows: 0,
        prevArrow: `<button class="btn-prev"><svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62402 10.7471L2.00002 6.12307L6.62402 1.50007" stroke="black" stroke-width="1.2" stroke-linecap="round"/><path d="M2.00049 6.12353L30.0005 6.12354" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg></button>`,
        nextArrow: `<button class="btn-next"><svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.3765 1.5L29.0005 6.124L24.3765 10.747" stroke="black" stroke-width="1.2" stroke-linecap="round"/><path d="M29 6.12354H1" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg></button>`,
        dots: true,
        dotsClass: 'slick-dots',
        fade: true,
        pauseOnHover: false
      });
    }

    this.$slider.slick("slickSetOption", "swipe", window.innerWidth < 1025);
    $(window).on('resize orientationchange', () => {
      self.$slider.slick("slickSetOption", "swipe", window.innerWidth < 1025);
      self.$slider.slick('resize');
    });

    self.updateProductSlider.bind(self)();


    this.$container.on('variantChange' + this.namespace, this.updateProductSlider.bind(this));
    this.$container.on('variantChange' + this.namespace, this.updateQuantityMax.bind(this));
    this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
    this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));
    if (this.$featuredImage.length > 0) {
      this.settings.imageSize = slate.Image.imageSize(this.$featuredImage.attr('src'));
      slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);
      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
    }
  }

  Product.prototype = $.extend({}, Product.prototype, {

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(selectors.priceWrapper, this.$container).removeClass('hide');
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.productBtnWrap, this.$container).addClass('quantity-wrap-disabled');
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }

      if (variant.available) {
        $(selectors.addToCart, this.$container).prop('disabled', false);
        $(selectors.productBtnWrap, this.$container).removeClass('quantity-wrap-disabled');
        $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.productBtnWrap, this.$container).addClass('quantity-wrap-disabled');
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {

      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);

      $(selectors.productPrice, this.$container)
      .html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.removeClass('hide');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }
    },

    /**
     * Updates the DOM
     */
    updateQuantityMax: function(evt) {
      const productUrl = `/products/${this.productSingleObject.handle}`;
      const variant = evt.variant;

      jQuery.getJSON(productUrl + '.js', function(product) {
        jQuery(product.variants).each(function() {

          if (!variant) {
            return;
          }

          if(this.id == variant.id) {
            const variantId = this.id;

            fetch(`${productUrl}?view=json`, {
              redirect: 'follow',
              credentials: 'include'
            }).then((response) => {
              response.json().then(function(parsedJson) {
                jQuery(parsedJson.option).each(function() {
                  if(variantId == this.variant_id ) {
                    const quantityWrap =  jQuery('.quantity-wrap', this.$container);
                    const quantityBtnInc =  jQuery(quantityWrap).find('.jcf-btn-inc');
                    const quantityBtnDec =  jQuery(quantityWrap).find('.jcf-btn-dec');
                    const quantityInput =  jQuery('#Quantity', this.$container);
                    const quantityInputValue = quantityInput.val();
                    const quantityInputMax = quantityInput.attr('max');

                    if(this.variant_inventory_quantity == 1 ) {
                      $(quantityInput).attr({"max" : this.variant_inventory_quantity });
                      quantityInput.val('1');
                      quantityBtnInc.addClass('jcf-disabled');
                      quantityBtnDec.addClass('jcf-disabled');

                      jcf.destroyAll();
                      jcf.setOptions('Select', {
                        wrapNative: false,
                      });
                      jcf.replaceAll();
                    } else if (this.variant_inventory_quantity > 1) {
                      $(quantityInput).attr({"max" : this.variant_inventory_quantity });
                      quantityBtnInc.removeClass('jcf-disabled');
                      quantityInput.val('1');

                      jcf.destroyAll();
                      jcf.setOptions('Select', {
                        wrapNative: false,
                      });
                      jcf.replaceAll();
                    } else if ( this.variant_inventory_policy == 'continue') {
                      quantityInput.removeAttr( "max" );
                      quantityBtnInc.removeClass('jcf-disabled');
                      jcf.destroyAll();
                      jcf.setOptions('Select', {
                        wrapNative: false,
                      });
                      jcf.replaceAll();
                    }
                  }
                });
              })
            });
          }

        });
      });
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;
      var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);

      this.$featuredImage.attr('src', sizedImgUrl);
    },

    /**
     * Updates the DOM with the specified slides
     */
    updateProductSlider: function(evt) {
      let color ='';
      let size = '';
      let variant = evt !== undefined ? evt.variant : this.currentVariant;

      if( evt !== undefined && variant === null) {
        color = jQuery(evt.target, this.$container).find('.swatch-element.color input:checked').val();
        size = jQuery(evt.target, this.$container).find('.swatch-element.size input:checked').val();
      } else {
        let colorOptionIndex = this.productSingleObject.options.map(v => v.toLowerCase()).indexOf('color');
        let sizeOptionIndex = this.productSingleObject.options.map(v => v.toLowerCase()).indexOf('size');
        color = variant.options[colorOptionIndex];
        size = variant.options[sizeOptionIndex];
      }
      if(!color){
        color = $('[data-swatch="Color"]', this.$container).find('.header em').text().trim();
      }
      this.$slider.slick('slickUnfilter');
      let slider_has_color = $('.product__gallery-item[data-color="' + color + '"]', self.$slider);
      var sizesBoolean = []; 
        const currentSliders = Array.from(slider_has_color);
        currentSliders.filter((elem)=>{
            if(elem.dataset.alt.includes(size)){
                sizesBoolean.push(true)
            }
            else{
                sizesBoolean.push(false)
            }
        })
      
      let sliders = jQuery(`.js-product__gallery`, this.$container);          
      this.$slider.slick('slickFilter', function () {
        if (slider_has_color === undefined || slider_has_color.length === 0){
          return true;
        }
        return $('[data-color="' + color + '"], [data-color="all colors"]', this).length === 1;
      });
    
      if(sizesBoolean.filter(Boolean).length !== 0){
        if(sliders.length){
          const indexOfActiveSize = sizesBoolean.indexOf(true);
          sliders[0].slick.slickGoTo(indexOfActiveSize);
        }
      }
      if(sizesBoolean.filter(Boolean).length === 0){
        if(sliders.length){
          sliders[0].slick.slickGoTo(0);
        }
      }
      this.$slider.slick('resize');
    },
    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
  });

  return Product;
})();


/*================ Blocks ================*/
;(function() {

  const miniCartTrigger = jQuery('[data-mini-cart-trigger]');
  const miniCartActive = 'mini-cart--shown';
  const miniCartParent = jQuery('[data-mini-cart]');
  const cartCount = jQuery('[data-cart-count]');
  const cartTotal = jQuery('[data-cart-total]');
  const cartFull = jQuery('[data-full-cart-content]');
  const cartEmpty = jQuery('[data-empty-cart-content]');

  function addMiniCartTrigger(e) {
    e.preventDefault();
    $('#shopify-section-header').addClass('sticky');
    miniCartParent.toggleClass(miniCartActive);
    if(miniCartParent.hasClass(miniCartActive)){
      if($('#perzonalization-custom-cart-drawer').length){
        const waitEl = setInterval(function(){
          if($('#perzonalization-custom-cart-drawer .perz-swiper-slide').length){
            clearInterval(waitEl);
            $('#perzonalization-custom-cart-drawer .perz-swiper-slide').each(function(){
              const title = $(this).find('.perz-item-name-product').text();
              if(title.includes(window.variant_separator)){
                const titleSplit = title.split('/');
                const newTitle = titleSplit[0].trim();
                $(this).find('.perz-item-name-product').text(newTitle);
                const variantName = titleSplit[1].trim();
                const descVariant = $(this).find('.perz-item-desc-variant');
                descVariant.text(`${variantName} / ${descVariant.text()}`);
              }
            })
          }
        },200)
      }
    }
  }

  //Add product.json.liquid
  function checkVariantLimit() {
    const cartItemParent = jQuery('[data-minicart-item]');

    if(cartItemParent.length < 1){return};

    cartItemParent.each(function() {
      const item = jQuery(this);
      const cartItem = item.find('[data-compare-price]');
      const cartItemPriceHolder = item.find('[data-price-item]')
      const cartItemPrice = item.find('[data-price]').attr('data-minicart-price');
      const cartItemFullUrl = cartItem.attr('data');

      if(cartItemFullUrl) {
        const cartItemUrl = cartItemFullUrl.split('?')[0];
        const cartItemVariant = cartItemFullUrl.split('?')[1].split('=')[1];
        const cartItemQty = item.find('[data-item-qty]').val();
        const cartItemBtnPlus = item.find('[data-qty-number-plus]');
        const cartItemMessage = item.find('[data-limit-message]');

        jQuery.getJSON(cartItemUrl + '.js', function(product) {
          if(product.url !== cartItemUrl) {
            return
          };
          cartItem.addClass('hide');
          cartItemPriceHolder.addClass('hide');

          jQuery(product.variants).each(function() {
            if(this.id == cartItemVariant && cartItemPrice < this.compare_at_price) {
              cartItem.html(Shopify.formatMoney(this.compare_at_price * cartItemQty));
              cartItem.removeClass('hide');

              cartItemPriceHolder.html(Shopify.formatMoney(this.compare_at_price));
              cartItemPriceHolder.removeClass('hide');
            }

            if(this.id == cartItemVariant) {
              fetch(`${cartItemUrl}?view=json`, {
                redirect: 'follow',
                credentials: 'include'
              }).then((response) => {
                response.json().then(function(parsedJson) {
                  jQuery(parsedJson.option).each(function() {
                    let variant = Number.parseInt(cartItemVariant);
                    if(this.variant_id == variant) {
                      if(this.variant_inventory_quantity == cartItemQty) {
                        cartItemMessage.removeClass('hide');
                        cartItemBtnPlus.addClass('btn-disabled');
                      } else {
                        cartItemMessage.addClass('hide');
                        cartItemBtnPlus.removeClass('btn-disabled');
                      }
                    }
                  });
                })
              });
            }
          });
        });
      }
    });
  }

  function updateQty(cart) {
    const quantityError = jQuery('.quantity-error-message');
    const currentVariant = jQuery('select[data-product-select] option:selected');
    const currentVariantID = parseInt(jQuery(currentVariant).val());
    const currentVariantInventory = jQuery(currentVariant).attr('data-variant-inventory-quantity');
    if(quantityError) {
      quantityError.addClass('hide');
    }

    jQuery(cart.items).each(function() {
      const item = jQuery(this);
      const itemId = jQuery(item).attr('id');
      const itemQty = jQuery(item).attr('quantity');

      if(itemId == currentVariantID && quantityError ) {
        quantityError.removeClass('hide');
        quantityError.text(`Max ${currentVariantInventory} in cart ${itemQty}`);
      }
    });
  }

  function disableSwatchItems(cart) {
    let disabledSwatchItems = [];
    jQuery(cart.items).each(function() {
      const item = jQuery(this);
      disabledSwatchItems.push(String(item[0].variant_id));
    });
    let swatchItems = jQuery('.swatches-list__item input');

    let disabledCount = 0;
    jQuery(swatchItems).each(function() {
      const item = jQuery(this);
      const itemValue = item.val();
      if(jQuery.inArray(itemValue, disabledSwatchItems)>-1) {
        item.prop('checked', false);
        item.prop('disabled', true);
        item.parent().addClass('swatches-list__item--in-cart');
        disabledCount++;
      } else {
        item.prop('checked', false);
        item.prop('disabled', false);
        item.parent().removeClass('swatches-list__item--in-cart');
      }
    });
    if(disabledCount >= swatchItems.length){
      jQuery('.swatches-popup__btn').prop('disabled', true);
    }else{
      jQuery('.swatches-popup__btn').prop('disabled', false);
    }
  }

  function changeSwatchCount() {
    let count = jQuery('.swatches-list__item input:checked').length;
    let disablecount = jQuery('.swatches-list__item--in-cart input').length;
    let countContainer = jQuery('.swatches-popup__count');
    let priceContainer = jQuery('.swatches-popup__total-price');

    count = count + disablecount;

    if(count == 0) {
      countContainer.text(`${count}`)
    } else if (count == 1) {
      countContainer.text(`${count} SWATCH`)
    } else if (count > 1) {
      countContainer.text(`${count} SWATCHES`)
    }

    if(count > 3) {
      priceContainer.text(`$${(count - 3) * 2}.00`)
    } else if (count < 4) {
      priceContainer.text(`$0`)
    }
  }

  function updateShoppingText(cart) {
    let shippingInfo = jQuery('.count-shipping__title');
    let shippingInfoFullText = shippingInfo.attr('data-full-text');
    let shippingInfoNotFullText = shippingInfo.attr('data-not-full-text');

    let shippingRequirements,cartCurrent,shippingDifference;
    if(shippingInfo.attr('data-price')){
      shippingRequirements = shippingInfo.attr('data-price');
      cartCurrent = cart.total_price/100;
      shippingDifference = Shopify.formatMoney((shippingRequirements - cartCurrent)*100);
    }else{
      shippingRequirements = shippingInfo.attr('data-total-items');
      cartCurrent = cart.item_count;
      cart.items.forEach(function(item){
        if(item.product_type == 'Swatch' || item.product_type == 'Swatches'){
          cartCurrent = cartCurrent - item.quantity;
        }
        for (var key in item.properties) {
          if(key.includes('Count')){
            const set_total = item.properties[key].split(" ");
            cartCurrent = cartCurrent + (parseInt(set_total[0]) * item.quantity) - item.quantity;
          }
        }
      })
      shippingDifference = `${shippingRequirements - cartCurrent} item${(shippingRequirements - cartCurrent > 1 ? 's' : '' )}`;
    }
    let shippingLine = jQuery('.count-shipping__line em');
    let shippingWidth;

    if(cartCurrent >= shippingRequirements) {
      jQuery('.discount_code[name=discount]').val('TWOTHENFREE');
      jQuery(shippingInfo).find('strong').text(shippingInfoFullText);
      jQuery(shippingInfo).find('em').addClass('hide');
      shippingWidth = 100;
    } else {
      jQuery('.discount_code[name=discount]').val('');
      document.cookie = "discount_code=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      jQuery(shippingInfo).find('strong').text(shippingInfoNotFullText);
      jQuery(shippingInfo).find('em').removeClass('hide').text(`${shippingDifference}`);
      shippingWidth = (cartCurrent/shippingRequirements)*100;
    }

    shippingLine.css({'width': `${shippingWidth}%`});
  }

  function checkSwatchInput() {
    let inputs = jQuery('.swatches-list__item input');


    jQuery(inputs).each(function() {
      let input = jQuery(this);

      jQuery(input).on('click', function(evt) {
        let inputEvt = evt.target;

        if(inputEvt.checked) {
          jQuery(inputEvt).closest('.swatches-list__item').addClass('swatches-list__item--active');
        } else {
          jQuery(inputEvt).closest('.swatches-list__item').removeClass('swatches-list__item--active');
        }
      });

    });
  }

  jQuery(document).on('cart.requestComplete', function(event, cart) {
    cartCount.html(cart.item_count);
    cartTotal.html(Shopify.formatMoney(cart.items_subtotal_price));
    checkVariantLimit();
    disableSwatchItems(cart);
    changeSwatchCount();
    updateShoppingText(cart);
    updateQty(cart);

    miniCartParent.removeClass('swatches-active');

    if (!miniCartParent.hasClass(miniCartActive)) {
      miniCartParent.addClass(miniCartActive);
    }

    if (cart.item_count === 0) {
      cartCount.addClass('hide');
      cartFull.addClass('hide');
      cartEmpty.removeClass('hide');
    } else {
      cartCount.removeClass('hide');
      cartFull.removeClass('hide');
      cartEmpty.addClass('hide');
    }
  });

  jQuery(document).on('input', '[data-variant]', function() {
    var $this = jQuery(this);
    CartJS.updateItem(Number.parseInt($this.attr('data-variant')), Number.parseInt($this.val()));
  });

  miniCartTrigger.click(addMiniCartTrigger);
  setTimeout(checkVariantLimit, 100);

  jQuery(document).on('cart.ready', function(event, cart) {
    checkVariantLimit();
    disableSwatchItems(cart);
    changeSwatchCount();
    updateShoppingText(cart);
    updateQty(cart);

    checkSwatchInput();
  });

  jQuery(document).on('change','.swatches-list',function(){
    changeSwatchCount();
  })

  jQuery(document).on('submit','.swatches-form',function(event){
    event.preventDefault();
    let data = [];

    let productList = jQuery('.swatches-list__item input:checked');

    productList.each(function() {
      let productId = jQuery(this).val();

      data.push({
          id: `${productId}`,
          quantity: '1'
        })
    });

    CartJS.addItems(data, {
      "success": function() {
        console.log('CartJS.addItems success')
      },
      "error": function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + errorThrown + '!');
      }
    });
  });

  jQuery('.js-search__opener').click(function() {
    if(jQuery("body").hasClass('mega-drop-active')) {
      jQuery("body").removeClass('mega-drop-active');
    }
  });

}());

;(function() {

  jcf.setOptions('Select', {
    wrapNative: false,
  });
  jcf.replaceAll();

  jQuery('.js-newsletter__form').addFocusClass({
    focusClass: 'child-input-focused',
    element: 'input[type="email"]',
    stayFocusOnFilled: true
  });

  jQuery('.js-newsletter__form').submit(function( event ) {
    jQuery('.js-newsletter__form').addClass('newsletter__form--submit')
  });





  if (document.querySelector(".login-page")) {

    if (document.querySelector("#CustomerLoginForm .btn")) {
      /* Customer Form handler */

      var checkCustomer = document.querySelector("#CustomerLoginForm");
      var checkClassCustomer = document.querySelectorAll("#CustomerLoginForm .general-form__row");

      var btnkCustomer = document.querySelector("#CustomerLoginForm .btn");
      var inputCustomer = document.querySelectorAll("#CustomerLoginForm .general-form__input");

      btnkCustomer.addEventListener("click", function(evn){

        jQuery('.js-validation').formValidation({
          errorClass: 'general-form__error',
          addClassToParent: '.general-form__row'
        });

        var checkCustomerflag = [];
        for (let index = 0; index < checkClassCustomer.length; index++) {
          const element = checkClassCustomer[index];
          if (inputCustomer[index].value == '' && !element.classList.contains('general-form__error') ) {
            element.classList.add('general-form__error');
            checkCustomerflag.push('true');
          }
          else if (inputCustomer[index].value == '' && element.classList.contains('general-form__error') ) {
            checkCustomerflag.push('true');
          }else if (inputCustomer[index].value !== '' && element.classList.contains('general-form__error') ) {
            checkCustomerflag.push('true');
          }
          else{
            checkCustomerflag.push('false');
          }
        }
        if (!checkCustomerflag.includes('true')) {
          checkCustomer.submit();
        }
        evn.preventDefault();

      });

      /* End Customer Form handler */

      /* Recover Password Form handler */

      var checkRecover = document.querySelector(".recover-form");
      var checkClassRecover = document.querySelector("#RecoverPasswordForm .general-form__row");
      var checkRecoverflag = 'true';
      var btnkRecover = document.querySelector("#RecoverPasswordForm .btn");
      var inputRecover = document.querySelector("#RecoverPasswordForm .general-form__input");


      btnkRecover.addEventListener("click", function(evn){

        jQuery('.js-validation').formValidation({
          errorClass: 'general-form__error',
          addClassToParent: '.general-form__row'
        });

        if (inputRecover.value == '' && !checkClassRecover.classList.contains('general-form__error') ) {
          checkClassRecover.classList.add('general-form__error');
          checkRecoverflag = 'true';
        }
        else if (inputRecover.value == '' && checkClassRecover.classList.contains('general-form__error') ) {
          checkRecoverflag = 'true';
        }else if (inputRecover.value !== '' && checkClassRecover.classList.contains('general-form__error') ) {
          checkRecoverflag = 'true';
        }
        else{
          checkRecoverflag = 'false';
          checkRecover.submit();
        }
        evn.preventDefault();

      });

      /* End Recover Password Form handler */
    }
    if (document.querySelector("#create_customer .btn")) {
      /* Customer Сreate Form handler */

      var checkСreate = document.querySelector("#create_customer");
      var checkClassСreate = document.querySelectorAll("#create_customer .general-form__row");

      var btnkСreate = document.querySelector("#create_customer .btn");
      var inputСreate = document.querySelectorAll("#create_customer .general-form__label");

      btnkСreate.addEventListener("click", function(evn){

        jQuery('.js-validation').formValidation({
          errorClass: 'general-form__error',
          addClassToParent: '.general-form__row'
        });

        var checkСreateflag = [];
        for (let index = 0; index < checkClassСreate.length; index++) {
          const element = checkClassСreate[index];
          if (inputСreate[index].value == '' && !element.classList.contains('general-form__error') ) {
            element.classList.add('general-form__error');
            checkСreateflag.push('true');
          }
          else if (inputСreate[index].value == '' && element.classList.contains('general-form__error') ) {
            checkСreateflag.push('true');
          }else if (inputСreate[index].value !== '' && element.classList.contains('general-form__error') ) {
            checkСreateflag.push('true');
          }
          else{
            checkСreateflag.push('false');
          }
        }
        if (!checkСreateflag.includes('true')) {
          checkСreate.submit();
        }
        evn.preventDefault();

      });
      /* End Customer Сreate Form handler */
    }

    if (document.querySelector(".reset-form .btn")) {

      /* Reset Form handler */

      var checkReset = document.querySelector(".reset-form");
      var checkClassReset = document.querySelectorAll(".reset-form .general-form__row");

      var btnkReset = document.querySelector(".reset-form .btn");
      var inputReset = document.querySelectorAll(".reset-form .general-form__label");

      btnkReset.addEventListener("click", function(evn){

        jQuery('.js-validation').formValidation({
          errorClass: 'general-form__error',
          addClassToParent: '.general-form__row'
        });

        var checkResetflag = [];
        for (let index = 0; index < checkClassReset.length; index++) {
          const element = checkClassReset[index];
          if (inputReset[index].value == '' && !element.classList.contains('general-form__error') ) {
            element.classList.add('general-form__error');
            checkResetflag.push('true');
          }
          else if (inputReset[index].value == '' && element.classList.contains('general-form__error') ) {
            checkСreateflag.push('true');
          }else if (inputReset[index].value !== '' && element.classList.contains('general-form__error') ) {
            checkResetflag.push('true');
          }
          else{
            checkResetflag.push('false');
          }
        }
        if (!checkResetflag.includes('true')) {
          checkReset.submit();
        }
        evn.preventDefault();

      });

      /* End Reset Form handler */

    }


  }


}());


;(function() {

  if(jQuery('.announcement-bar').length > 0) {
    jQuery('body').addClass('has_announcement-bar')
  } else {
    jQuery('body').removeClass('has_announcement-bar')
  }

  jQuery('.js-search__opener').click(function() {
    $('body,html').animate({
      scrollTop:0
    }, 50);
    if($('.announcement-bar').length){
      const topPadding = $('.announcement-bar').outerHeight();
      $('.search__holder').css('top', topPadding);
    }
  });

  jQuery('body').mobileNav({
    menuActiveClass: 'search-active',
    menuOpener: '.js-search__opener',
    hideOnClickOutside: false,
    menuDrop: '.search__holder'
  });


  jQuery(document).on('click', function(event) {
    const suggestionOpen = jQuery('.boost-pfs-search-suggestion-open');
    const searchHolder = jQuery('.search__holder');
    let close = false;

    if (!suggestionOpen.is(event.target) && suggestionOpen.has(event.target).length === 0 && suggestionOpen.length) {
      close =  true;
      if (searchHolder.is(event.target) || searchHolder.has(event.target).length === 1 || jQuery(event.target).parents('.search__holder').length) {
        close =  false;
      }
    }
    if(close){
      jQuery('body').removeClass('boost-pfs-search-suggestion-mobile-open');
    }
  });


  jQuery('body').mobileNav({
    menuActiveClass: 'mega-drop-active',
    menuOpener: '.js-has-drop',
    hideOnClickOutside: false,
    menuDrop: '.drop-navigation-wrap'
  });

  jQuery('.sm_menu_ham--button').click(function() {
    jQuery('body').removeClass('mmactive');
    jQuery('#sm_menu_ham').removeClass('open');
    jQuery('.sm_menu_outer').removeClass('active');
  });

  jQuery('.drop-navigation__item').openClose({
    activeClass: 'inner-drop-active',
    opener: '.js-drop-navigation__link',
    slider: '.navigation__inner-frame',
    animSpeed: 0,
    hideOnClickOutside: true,
    effect: 'none'
  });


  jQuery(document).ready(function() {
    jQuery(".mobile_menu").simpleMobileMenu({
      onMenuLoad: function(menu) {},
      onMenuToggle: function(menu, opened) {},
      "menuStyle": "slide"
    });
  });

}());

(function () {
  jQuery('[data-video]').bgVideo();

  var rellax = new Rellax('.rellax', {
    speed: 2,
    center: false,
    wrapper: null,
    round: true,
    vertical: true,
    horizontal: false,
    breakpoints:[320, 768, 1201]
  });

  const input = document.getElementsByClassName('search__input');
  const body = document.getElementsByTagName('body')[0];
  if(input.length> 0) {
    input[0].onfocus = function() {
      body.classList.add('open-keyboard');
    };
    input[0].onblur = function() {
      body.classList.remove('open-keyboard');
    };
  }

  jQuery('.article-item__image-wrap img').hoverTooltip({
    positionTypeX: 'center',
    positionTypeY: 'top',
    tooltipStructure: '<div class="hover-tooltip"><div class="tooltip-text"></div></div>'
  });


  jQuery('.collections-tabs__dropdown').clickClass({
    classAdd: 'collections-tabs-active'
  });


  jQuery('.js-toggle-item').openClose({
    activeClass: 'active',
    opener: '.js-toggle-link',
    slider: '.js-toggle-content',
    animSpeed: 400,
    effect: 'slide'
  });


  jQuery('.js-careers-role').openClose({
    activeClass: 'active',
    opener: '.js-careers-role__head',
    slider: '.js-careers-role__slide',
    animSpeed: 400,
    effect: 'slide'
  });


  new SmoothScroll({
    anchorLinks: 'a.js-smooth-link[href^="#"]:not([href="#"])',
    extraOffset: 0,
    wheelBehavior: 'none'
  });

  jQuery('.js-blog-category').slick({
    slidesToScroll: 1,
    rows: 0,
    arrows: false,
    infinite: false,
    variableWidth: true,
    pauseOnHover: false
  });

})();

;(function () {

  jQuery('.tabset').tabset({
    tabLinks: 'a',
    addToParent: true,
    defaultTab: true
  });

  function initSwatchList() {
    const swatchList = document.querySelectorAll('[data-variant-image]');
    if(!swatchList) {
      return;
    }
    swatchList.forEach((swatch) => {
      swatch.addEventListener('click', function(){
        // console.log(swatch);

        const parent = this.closest('.featured-product');
        if(parent) {

          const variantId = this.getAttribute('data-variant-image');

          const images = parent.querySelectorAll('.featured-product__image');

          const swatchElements = parent.querySelectorAll('.swatch-element');

          const variantPrices = parent.querySelectorAll('.js-featured-product__price');

          const link = parent.querySelectorAll('.js-featured-product__link');

          const swatchHeader = parent.querySelectorAll('.header span');

          if(images.length < 2) {
            return;
          }

          images.forEach((image) => {
            image.classList.add('hide');
            const imageVariant = image.getAttribute('data-value');
            const productUrl = image.getAttribute('data-href');

            if(variantId == imageVariant) {
              image.classList.remove('hide');
            }

            link.forEach((element) => {
              if(variantId == imageVariant) {
                element.href = productUrl+'?variant='+imageVariant;
              }
            })
          })

          swatchElements.forEach((element) => {

            element.classList.remove('hover');
            this.closest('.swatch-element').classList.add('hover');

          })

          variantPrices.forEach((price) => {
            
            price.classList.add('hide');
            const priceVariant = price.getAttribute('data-variant-quantity');

            if(variantId == priceVariant) {
              price.classList.remove('hide');
              let regularPrice = price.querySelector('.boost-pfs-filter-product-item-regular-price');
              if (regularPrice) {
								let labelSale = price.parentElement.parentElement.parentElement.parentElement.parentElement;
								//console.log(labelSale)
								if (labelSale.querySelector('.sale.boost-pfs-filter-label')) {
									let hideLabelSale = labelSale.querySelector('.sale.boost-pfs-filter-label')
									hideLabelSale.classList.add('hide');
								}
							}else {
								let labelSale = price.parentElement.parentElement.parentElement.parentElement.parentElement
								if (labelSale.querySelector('.sale.boost-pfs-filter-label')) {
									let hideLabelSale = labelSale.querySelector('.sale.boost-pfs-filter-label')
									hideLabelSale.classList.remove('hide');
								}
							}
             
            }
          })

          swatchHeader.forEach((swatch) => {
            // console.log(swatch);
            swatch.innerHTML = this.getAttribute('value')
          })
        }
      });
    })
  }

  initSwatchList();

  if (document.querySelectorAll('.swatch-wrapper')) {
    let optionSwatch = document.querySelectorAll('.swatch-wrapper');
    for (let i = 0; i < optionSwatch.length; i++) { 
      let oprtionSwatchParent =  optionSwatch[i].parentElement;
      oprtionSwatchParent.classList.add('swatch-active')
    }
  }

  jQuery('.js-collections-tabs').on('init', function(event, slick, direction){
    let swatchElements = jQuery('.js-collections-tabs .swatch-element');

    for(let i=0; i< swatchElements.length; i++) {
      let swatchElement = swatchElements[i];
      let label  = jQuery(swatchElement).find('label');
      let input  = jQuery(swatchElement).find('input');
      let forAttr =  jQuery(label).attr('for');
      jQuery(label).attr("for", `${forAttr}${i}`);
      jQuery(input).attr("id", `${forAttr}${i}`);
    }
    initSwatchList();
  });

}());
if (document.querySelector('#shopify-section-collection-template-boost-pfs-filter')) {
  if(navigator.userAgent.match(/(iPod|iPhone|iPad)/i) || navigator.userAgent.match(/webOS/i)){
    let result = document.querySelector('#shopify-section-collection-template-boost-pfs-filter');
    result.classList.add('ios')
  }else {
    let result = document.querySelector('#shopify-section-collection-template-boost-pfs-filter');
    result.classList.add('no-ios')
  }
}
if (document.querySelector('#shopify-section-search-template-boost-pfs-filter')) {
  if(navigator.userAgent.match(/(iPod|iPhone|iPad)/i) || navigator.userAgent.match(/webOS/i)){
    let result = document.querySelector('#shopify-section-search-template-boost-pfs-filter');
    result.classList.add('ios')
  }else {
    let result = document.querySelector('#shopify-section-search-template-boost-pfs-filter');
    result.classList.add('no-ios')
  }
}

;(function($) {
  if (document.querySelector('.js-header-collections')) {
    var $slickElement = $('.js-header-collections');
    $slickElement.slick({
      infinite: true,
      slidesToShow: 2,
      dots: true,
      fade:false,
      prevArrow: '<button class="btn-collections btn-prev"><svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62402 10.7471L2.00002 6.12307L6.62402 1.50007" stroke="black" stroke-width="1.2" stroke-linecap="round"/><path d="M2.00049 6.12353L30.0005 6.12354" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg></button>',
      nextArrow: '<button class="btn-collections btn-next"><svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.3765 1.5L29.0005 6.124L24.3765 10.747" stroke="black" stroke-width="1.2" stroke-linecap="round"/><path d="M29 6.12354H1" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg></button>',
    responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            rows: 1
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
      centerMode: true,
      variableWidth: true,
            rows: 1
          }
        }
        ]
    });
  }  
}(jQuery));

;(function(){

  inView('.viewport-section, .page__container--legal > *, .viewport-section-rte > *').on('enter', el => {
    $(el).addClass('in-viewport');
  });

  inView('.product-instagram__link').on('enter', el => {
    $(el).addClass('product-instagram__link--in-viewport');
  });

  inView('.product-instagram__link').on('exit', el => {
    $(el).removeClass('product-instagram__link--in-viewport');
  });

  $(window).on('beforeunload', function(event){
    let $activeElement = $(event.target.activeElement);
    let href = $activeElement.attr('href');
    if(href) {
      if (href.includes('tel:') || href.includes('mailto:')) {
        return null;
      }

      $('body').addClass('close');
    }
  });


  jQuery(document).ready(function() {
    let buttonToTop = jQuery('.boost-pfs-filter-scroll-to-top');
    if(buttonToTop.length > 0) {
      jQuery(buttonToTop).fadeOut();
      jQuery(document).scroll(function() {
        let y = $(this).scrollTop();
        if (y > 200) {
          jQuery(buttonToTop).fadeIn();
        } else {
          jQuery(buttonToTop).fadeOut();
        }
      });
    }
  });


})();

(function () {

  ResponsiveHelper.addRange({
    '750..': {
      on: function() {
        jQuery('a.lightbox, [data-fancybox]').fancybox({
          parentEl: 'body',
          margin: [50, 0],
          btnTpl: {
            close:
              '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="">' +
              '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 17.9707L17.9706 1.00014" stroke="black" stroke-width="1.5" stroke-linecap="round"/><path d="M1 1L17.9706 17.9706" stroke="black" stroke-width="1.5" stroke-linecap="round"/></svg>\n' +
              "</button>",
            arrowLeft:
              '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="">' +
              '<svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.62354 1.2749L0.999535 6.1301L5.62354 10.9843" stroke="black" stroke-width="1.2" stroke-linecap="round"/><path d="M1 6.12949H29" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg>' +
              "</button>",
            arrowRight:
              '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="">' +
              '<svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.3765 1.2749L29.0005 6.1301L24.3765 10.9843" stroke="black" stroke-width="1.2" stroke-linecap="round"/><path d="M29 6.12949H1" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg>' +
              "</button>"
          },
          thumbs: {
            autoStart: true,
            hideOnClose: false,
            parentEl: ".fancybox-container",
            axis: "y"
          },
          afterShow : function( instance, current ) {
            $('.fancybox-container .fancybox-inner').append(`
              <div class="zoom-instructions animating">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M32.979 19C35.4196 17.1788 37 14.2687 37 10.9892C37 5.47236 32.5276 1 27.0106 1C23.7313 1 20.8212 2.58027 19 5.02086C17.1788 2.58027 14.2687 1 10.9892 1C5.47236 1 1 5.47236 1 10.9892C1 14.2687 2.58045 17.1788 5.02104 19C2.58045 20.8212 1 23.7312 1 27.0108C1 32.5275 5.47236 36.9998 10.9892 36.9998C14.2687 36.9998 17.1788 35.4196 19 32.979C20.8212 35.4196 23.7313 36.9998 27.0106 36.9998C32.5276 36.9998 37 32.5275 37 27.0108C37 23.7312 35.4196 20.8212 32.979 19Z" fill="black" fill-opacity="0.8"/>
                </svg>              
              </div>
            `);
            setTimeout(function(){
              $('.fancybox-container .fancybox-inner .zoom-instructions').removeClass('animating');
            }, 4500)
          },
          beforeClose : function( instance, current ) {
            $('.fancybox-container .fancybox-inner .zoom-instructions').removeClass('animating');
          },
          clickContent: function(current, event) {
            if($('.fancybox-container').hasClass('fancybox-can-zoomIn')){
              $('.fancybox-container .fancybox-inner .zoom-instructions').removeClass('animating');
              $('.cursor').addClass('zoom-out').removeClass('zoom-in');
            }else{
              $('.cursor').addClass('zoom-in').removeClass('zoom-out');
            }
            return current.type === "image" ? "zoom" : false;
          },
        });
      },
      off: function() {
      }
    }
  });
  ResponsiveHelper.addRange({
    '..749': {
      on: function() {
        jQuery('a.lightbox, [data-fancybox]').fancybox({
          btnTpl: {
            close:
              '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="">' +
              '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 17.9707L17.9706 1.00014" stroke="black" stroke-width="1.5" stroke-linecap="round"/><path d="M1 1L17.9706 17.9706" stroke="black" stroke-width="1.5" stroke-linecap="round"/></svg>\n' +
              "</button>",
            arrowLeft:
              '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="">' +
              '<svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.62354 1.2749L0.999535 6.1301L5.62354 10.9843" stroke="black" stroke-width="1.2" stroke-linecap="round"/><path d="M1 6.12949H29" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg>' +
              "</button>",
            arrowRight:
              '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="">' +
              '<svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.3765 1.2749L29.0005 6.1301L24.3765 10.9843" stroke="black" stroke-width="1.2" stroke-linecap="round"/><path d="M29 6.12949H1" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg>' +
              "</button>"
          },
          afterShow : function( instance, current ) {
            $('.fancybox-container .fancybox-inner').append(`
              <div class="zoom-instructions animating">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M32.979 19C35.4196 17.1788 37 14.2687 37 10.9892C37 5.47236 32.5276 1 27.0106 1C23.7313 1 20.8212 2.58027 19 5.02086C17.1788 2.58027 14.2687 1 10.9892 1C5.47236 1 1 5.47236 1 10.9892C1 14.2687 2.58045 17.1788 5.02104 19C2.58045 20.8212 1 23.7312 1 27.0108C1 32.5275 5.47236 36.9998 10.9892 36.9998C14.2687 36.9998 17.1788 35.4196 19 32.979C20.8212 35.4196 23.7313 36.9998 27.0106 36.9998C32.5276 36.9998 37 32.5275 37 27.0108C37 23.7312 35.4196 20.8212 32.979 19Z" fill="black" fill-opacity="0.8"/>
                </svg>              
              </div>
            `);
            setTimeout(function(){
              $('.fancybox-container .fancybox-inner .zoom-instructions').removeClass('animating');
            }, 4500)
          },
          beforeClose : function( instance, current ) {
            $('.fancybox-container .fancybox-inner .zoom-instructions').removeClass('animating');
          },
          clickContent: function(current, event) {
            if($('.fancybox-container').hasClass('fancybox-can-zoomIn')){
              $('.fancybox-container .fancybox-inner .zoom-instructions').removeClass('animating');
            }
            return current.type === "image" ? "zoom" : false;
          },
        });
      },
      off: function() {
      }
    }
  })

  const players = Plyr.setup('.media-video');

  jQuery('.js-product__gallery').on('beforeChange', function(event, slick, currentSlide, nextSlide){
    let sliders = jQuery(`.product__gallery .slick-slide`);
    let slide = jQuery(sliders[currentSlide]);
    let button = jQuery(slide).find('.plyr__control--overlaid');
    if(button.length > 0) {
      if(jQuery(button[0]).hasClass('plyr__control--pressed')) {
        jQuery(button[0]).trigger('click');
      }
    }
  });

  // On before slide change
  jQuery('.js-product__gallery').on('afterChange', function(event, slick, currentSlide){
    let sliders = jQuery(`.product__gallery .slick-slide`);
    let slide = jQuery(sliders[currentSlide]);
    let videoHolder = jQuery(slide).find('.product-single__media--video');

    if(videoHolder.length > 0) {
      jQuery(this).addClass('video-slide');
    } else {
      jQuery(this).removeClass('video-slide');
    }
  });


  jQuery('#Quantity').on('input', function() {
    const input = jQuery(this);
    const inputWrap = input.parent();
    const inputMax = Number.parseInt(input.attr('max'));
    const inputvalue = Number.parseInt(input.val());
    const inputBtnInc =  jQuery(inputWrap).find('.jcf-btn-inc');
    const inputBtnDec =  jQuery(inputWrap).find('.jcf-btn-dec');

    if(inputvalue > inputMax) {
      input.val(inputMax);
      inputBtnInc.addClass('jcf-disabled');
      inputBtnDec.removeClass('jcf-disabled');
    } else {
      inputBtnInc.removeClass('jcf-disabled');
    }

  });

  function hideSetButton() {
    let container = jQuery('.set-product-list').not('.hide');
    let flag = jQuery(container).find('.set-product-list__flag');
    let button = jQuery('[data-add-to-cart]');
    let hasTagFlag = jQuery('.has-tag-notify').length;
    let klavioButton = jQuery('.klaviyo-bis-trigger');

    if(flag.length > 0) {
      let flagValue = jQuery(flag).attr('data-set-available');

      if(flagValue == 'false' ) {
        jQuery(button).attr('disabled', 'disabled');
        jQuery(button).find('[data-add-to-cart-text]').text('Sold Out');

        if(hasTagFlag>0) {
          button.addClass('hide');
          klavioButton.removeClass('hide')
        }
      } else {
        button.removeClass('hide');
        klavioButton.addClass('hide')
      }
    }
  }

  function updateRecommenedTitle() {
    let title = jQuery('.recommended-set__title');
    let titleText = jQuery(title).attr('data-product-title');

    if(title.length > 0) {
      jQuery(title).find('span').text(titleText);
    }
  }

  function countDiscount() {
    let discountContent = jQuery('.product__price-discount');
    let discountFullPrice = jQuery(discountContent).attr("data-full-price");
    let discountSalePrice = jQuery(discountContent).attr("data-sale-price");
    let discountValue = Math.round((1 - discountSalePrice / discountFullPrice) * 100);


    if(discountContent.length > 0 && discountValue > 0) {
      discountContent.removeClass('hide')
      discountContent.text(`-${discountValue}%`);
    }
  }

  jQuery(document).ready(function() {
    updateRecommenedTitle();
    countDiscount();
    hideSetButton();
  });




  jQuery('.js-set-carousel').slick({
    slidesToScroll: 1,
    rows: 0,
    dots: true,
    prevArrow: '<button class="btn-set-carousel btn-prev"><svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62402 10.7471L2.00002 6.12307L6.62402 1.50007" stroke="black" stroke-width="1.2" stroke-linecap="round"/><path d="M2.00049 6.12353L30.0005 6.12354" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg></button>',
    nextArrow: '<button class="btn-set-carousel btn-next"><svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.3765 1.5L29.0005 6.124L24.3765 10.747" stroke="black" stroke-width="1.2" stroke-linecap="round"/><path d="M29 6.12354H1" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg></button>',
    variableWidth: true,
    centerMode: true,
    centerPadding: '340px'
  });


})();

;(function() {

  const body = jQuery('body');
  if (jQuery.cookie('cookies_first_visited') === '1') {
    body.removeClass('first-visit');
  } else {
    body.addClass('first-visit');
  }
  jQuery.cookie('cookies_first_visited', '1', { expires: 1, path: '/' });

  window.unload = function() {
    jQuery.removeCookie('cookies_first_visited');
  };

}());



/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('hide');
  });

  $('.address-edit-toggle').on('click', function() {
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('hide');
  });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();

function initRemoveProducts() {
  if (/type=article/gm.test(document.body.baseURI)) {
    document.body.classList.add("article-search");
  }
  setTimeout(() => {
    const element = document.querySelectorAll(
      ".boost-pfs-search-result-panel-item"
    );
    const showElement = document.querySelectorAll(
      ".boost-pfs-search-result-wrap"
    );
    const filterDefaultToolbar = document.querySelector(
      ".boost-pfs-filter-default-toolbar"
    );
    const filterResultToolbar = document.querySelector(
      ".boost-pfs-search-result-toolbar"
    );

    const resaltPage = document.querySelector(".boost-pfs-search-result-pages");

    if (showElement && element) {
      getPageTab(showElement, element);
    }

    function getPageTab(showElement, element) {
      let pages = false;
      showElement.forEach((el) => {
        if (
          el.firstElementChild.classList.contains(
            "boost-pfs-search-result-pages"
          ) &&
          /type=article/gm.test(el.baseURI)
        ) {
          el.classList.remove("boost-hidden");
          filterDefaultToolbar.style.display = "none";
          resaltPage.style.paddingTop = "64px";
          pages = true;
        }
      });
      if (pages && element) {
        element.forEach((el) => {
          if (/Pages/gm.test(el.innerText)) {
            el.classList.add("boost-active");
            el.click();
            const reg = /"(.*?)"/gm;
            const regNum = /\d+/g;
            const text = document.querySelector('.boost-pfs-search-result-header').innerText.match(reg);
            const count = el.innerText.match(regNum);
            document.title = `Search results: ${count} results for ${text} `;
          }
        });
      }

      if (filterResultToolbar) {
        filterResultToolbar.style.display = "none";
      }
    }
  }, 800);
}

function addClassToBodySearchArticle() {
  if (
    el.firstElementChild.classList.contains("boost-pfs-search-result-pages") &&
    /type=article/gm.test(el.baseURI)
  ) {
    el.classList.remove("boost-hidden");
    filterDefaultToolbar.style.display = "none";
    document.body.classList.add("article-search");
    resaltPage.style.paddingTop = "64px";
    pages = true;
  }
}

function updatePlaceholder() {
  const searchInput = document.querySelector(".blog-searchinput-js");
  setTimeout(() => {
    if(searchInput) {
      searchInput.placeholder='Search Articles';
    }
  }, 600);
}

function initFancybox() {
  jQuery('a[title="data-fancybox"]').fancybox({
    parentEl: 'body',
    margin: [50, 0]
  });
}


document.addEventListener("DOMContentLoaded", () => {
  initRemoveProducts();
  initFancybox();
  updatePlaceholder();
});



;(function() {

  jQuery('.protected-password__link a').on('click', function() {
    jQuery('.protected-password__login').removeClass('hide');
    jQuery('.password-protected__main').addClass('hide');
  });

}());


// Set line-breaks for .product__info .swatch-element buttons to avoid empty space on the right
$(document).ready(function(){
  let windowWidth = undefined //remember the last windowWidth so that don't apply the function if the screen width is not changed
  
  function run() {
    if (windowWidth === window.innerWidth ) return;
    windowWidth = window.innerWidth;
    const buttons = document.querySelectorAll('.product__info .swatch-element label');
    if(buttons) {
      buttons.forEach(button => {
        if(button.innerHTML.indexOf('<span') === -1) {
          button.innerHTML = button.innerHTML.split(' ').reduce((acc, cur, index, array) => { 
            if(cur.trim() !== '') {
              acc.push(`<span>${ cur.trim() }${ array.length === index + 1 ? '': ' '}</span>`);
            }
            return acc;
          }, []).join('');
        } else {
          const brs = button.querySelectorAll('br');
          if(brs) brs.forEach(br => br.remove());
        }
        const height = button.clientHeight;
        if(height > 40) { // means more than 1 line of text
          const styles = getComputedStyle(button);
          const width = parseFloat(styles.width) - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
          let newHtml = '';
          let widthCounter = 0;
          button.querySelectorAll('span').forEach(word => {
            widthCounter += word.offsetWidth;
            if(widthCounter > width - 5) {
              widthCounter = 0;
              newHtml += '<br/>'
            }
            newHtml += `<span>${ word.innerHTML }</span> `;
          });
          button.innerHTML = newHtml;
        }
      })
    }
  }
  /*window.addEventListener('resize', run);
  run();*/
});


// Set a css variable that keeps the announcement bar height
$(document).ready(function(){
  const bar = document.querySelector('[data-section-type="header-section"] .announcement-bar');
  if (!bar)
    return;

  function run() {
    document.documentElement.style.setProperty('--announcement-bar-height', bar.offsetHeight + 'px');
  }
  $(window).resize(run);
  run();


});


$(document).ready(function () {
  var sections = new slate.Sections();
  sections.register("product", theme.Product);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $(".in-page-link").on("click", function (evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = ".rte table";

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: "rte__table-wrapper",
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: "rte__video-wrapper",
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className =
      document.documentElement.className.replace(
        "supports-no-cookies",
        "supports-cookies"
      );
  }
  // Set alignment for product page product description blocks
  /*function productPageAlignment() {
    const products = document.querySelectorAll('.product__holder');
    if(products) {
      products.forEach(product => {
        const firstImageBlock = product.querySelector('.product__images');
        const productInfo = product.querySelector('.product__info-wrapper');
        if(firstImageBlock && productInfo) {
          productInfo.style.minHeight = firstImageBlock.offsetHeight + 'px';
        }

        const secondImageBlock = product.querySelector('.product__add-images.medium-hide .product__add-image');
        const productDescription = product.querySelector('.product__description-rte-wrapper');
        if(secondImageBlock && productDescription) {
          productDescription.style.minHeight = secondImageBlock.offsetHeight + 'px';
        }

        const thirdImageBlock = product.querySelector('.product__add-images.medium-hide .product__add-image:nth-child(3)');
        const productAddInfo = product.querySelector('.product__add-info-wrapper');
        if(thirdImageBlock && productAddInfo) {
          productAddInfo.style.minHeight = thirdImageBlock.offsetHeight + 'px';
        }
      })
    }
  }
  window.addEventListener('resize', () => {
    setTimeout(productPageAlignment, 500);
  });
  productPageAlignment();*/

  window.okeReviewsWidgetOnInit = function (okeInitApi) {  
    window.refreshOkendo = function () {         
      okeInitApi.initCoreWidgets();  
    }; 
  };
  // Custom
  $(document).on('click','.custom-swatch-element:not(.active) .custom-swatch-image:not(.quickview-swatch)', function(){
    const baseUrl = $(this).attr('data-url');
    const url = `${baseUrl}?view=data`;
    const wrapper = $(this).parents('#shopify-section-product');
    const form = $(this).parents('form');
    const review_stars = $(this).parents('.product__info').find('[data-yotpo-product-id]');
    const review_element = review_stars.wrap('<div/>').parent().html();
    review_stars.unwrap();
    
    form.addClass('loading');
    const settings = {
      "url": url,
      "method": "GET"
    };
    $.ajax(settings).done(function (response) {
      window.history.pushState("", "", baseUrl);
      const result = `<div id="shopify-section-product" class="shopify-section">${$(response).find('[data-section-id="product"]').parent().html()}</div>`;
      const reviewsSection = $(response).find('.oke-reviews__section').parent().html();
      const coordinatingStylesSection = $(response).find('.coordinating-styles').parent().html();
      $(result).find('form[action="/cart/add"]').addClass('loading');
      $(result).insertAfter(wrapper);
      wrapper.remove();
      /* Re run */
      $('#shopify-section-product').find('.product__holder').removeClass('viewport-section');
      $('#shopify-section-static-oke-reviews-product').html(reviewsSection);
      $('#shopify-section-coordinating-styles').empty().html(coordinatingStylesSection);
      if($('#shopify-section-coordinating-styles .coordinating-styles').length){
        SlickCorousel();
      }

      $('.product__info .yotpo-widget-instance').replaceWith(review_element);

      sections.register("product", theme.Product);
      jcf.setOptions('Select', {
        wrapNative: false,
      });
      jcf.replaceAll();
      inView('.viewport-section, .page__container--legal > *, .viewport-section-rte > *').on('enter', el => {
        $(el).addClass('in-viewport');
      });
      $('[data-video]').bgVideo();
      $(result).find('form[action="/cart/add"]').removeClass('loading');
    });
  });
  if($('.perzonalization:not(#perzonalization-custom-cart-drawer)').length){
    const waitEl = setInterval(function(){
      if($('.perzonalization:not(#perzonalization-custom-cart-drawer) .perz-swiper-slide').length){
        clearInterval(waitEl);
        $('.perzonalization:not(#perzonalization-custom-cart-drawer) .perz-swiper-slide').each(function(){
          const title = $(this).find('.perz-item-name-product').text();
          if(title.includes(window.variant_separator)){
            const titleSplit = title.split('/');
            const newTitle = titleSplit[0].trim();
            $(this).find('.perz-item-name-product').text(newTitle);
            const variantName = titleSplit[1].trim();
            $(this).find('.perz-item-value-names').append(`<span class="perz-item-name perz-item-name-variant">${variantName}</span>`);
          }
        })
      }
    },200)
  }

  if(window.location.hash == '#cart') {
    $('[data-mini-cart-trigger]').trigger('click');
    window.location.hash = '';
  }


  $(window).scroll(function(){
    const headerOffset = $('.announcement-bar').length ? $('.announcement-bar').outerHeight() : 30;
    if($(this).scrollTop() >= headerOffset){
      $('#shopify-section-header').addClass('sticky');
      $('#sm_menu_ham').addClass('sticky');
    }else{
      $('#shopify-section-header').removeClass('sticky');
      $('#sm_menu_ham').removeClass('sticky');
    }
  })

  /* Cursor */
  let cursor = $(".cursor"), cWidth = 8, delay = 10, mouseX = 0, mouseY = 0, posX = 0, posY = 0; 
  TweenMax.to({}, .001, {
      repeat: -1,
      onRepeat: function() {
          posX += (mouseX - posX) / delay;
          posY += (mouseY - posY) / delay;
          TweenMax.set(cursor, {
              css: {    
                  left: mouseX - (cWidth / 2),
                  top: mouseY - (cWidth / 2)
              }
          });
      }
  });
  $("[data-cursor]").on("mousemove", function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
  });
  $("[data-cursor]").on({"mouseenter": function() {
      const cursor_settings = JSON.parse($(this).attr('data-cursor'));
      const bg_color = cursor_settings.fill;
      const text_color = cursor_settings.color;
      const cursor_text = cursor_settings.text;
      const cursor_size = cursor_settings.size;
      if(!text_color && !cursor_text){
          cursor.css({
              'background-color':bg_color
          });
      }else{
          cursor.css({
              'background-color':bg_color,
              'color':text_color
          });
          if(cursor_text){
              cursor.find('span').text(cursor_text);
          }
          cursor.addClass("is-active");
      }
      if(cursor_size){
        cursor.css({
          'width': `${parseInt(cursor_size)}px`,
          'height': `${parseInt(cursor_size)}px`
        });
      }

    },
    "mouseleave": function() {
      cursor.removeClass("is-active");
      cursor.css({
          'background-color':'rgba(19,19,19,100)',
          'color':'white',
          'width': `10px`,
          'height': `10px`
      });
      cursor.find('span').text('');
    }
  });

  jQuery(document).on('mousemove', '.fancybox-is-open .fancybox-content', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  jQuery(document).on({
    'mouseenter': function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      jQuery('.cursor').addClass('is-active');
    },
    "mouseleave": function() {
      jQuery('.cursor').removeClass('is-active').css({
        'height': '50px',
        'width': '50px'
      })
    }
  },'.fancybox-is-open .fancybox-content');

  $(window).scroll(function() {
    const gfActions = $('.gf-actions');
    const headerHeight = $('#shopify-section-header').outerHeight();
    let paddingTop;
    if (window.innerWidth > 767) {
     paddingTop = 40;
    }else{
     paddingTop = 0;
    }
    if($('#gf-controls-container').length){
      const scrollPosition = $(window).scrollTop() + headerHeight;
      let gfActionsOffset = $('#gf-controls-container').offset().top + $('#gf-controls-container .gf-controls-search-form').outerHeight() + paddingTop;
      //if window width > 768, add 13 to gfActionsOffset, else add 15
      if (window.innerWidth > 767) {
        gfActionsOffset -= 15;
      }else{
        gfActionsOffset += 15;
      }
      if (scrollPosition >= gfActionsOffset) {
        $('#gf-controls-container').css('padding-bottom', (gfActions.outerHeight()) + 'px');
        gfActions.addClass('on-scroll');
        gfActions.css('top', headerHeight);
      } else {
        $('#gf-controls-container').css('padding-bottom', 0);
        gfActions.removeClass('on-scroll');
        gfActions.css('top', 0);
      }
    }
  });

  if($('.announcement-slider').length){
    // define autoplaySpeed from $('.announcement-slider').attr('data-autoplay-speed') if it exists, else set it to 2000
    const autoplaySpeed = $('.announcement-slider').attr('data-autoplay-speed') ? $('.announcement-slider').attr('data-autoplay-speed') : 2000;
    $('.announcement-slider').on('init', function(event, slick, direction){
      const bar = document.querySelector('[data-section-type="header-section"] .announcement-bar');
      if (!bar)
        return;
      document.documentElement.style.setProperty('--announcement-bar-height', bar.offsetHeight + 'px');
    });
    $('.announcement-slider').on('setPosition', function(event, slick, direction){
      const bar = document.querySelector('[data-section-type="header-section"] .announcement-bar');
      if (!bar)
        return;
      document.documentElement.style.setProperty('--announcement-bar-height', bar.offsetHeight + 'px');
    });
    
    $('.announcement-slider').slick({
      slidesToScroll: 1,
      rows: 0,
      arrows: true,
      infinite: true,
      pauseOnHover: true,
      autoplay: true,
      autoplaySpeed: autoplaySpeed,
      prevArrow: `<button class="btn-prev"><svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62402 10.7471L2.00002 6.12307L6.62402 1.50007" stroke="black" stroke-width="1.2" stroke-linecap="round"></path><path d="M2.00049 6.12353L30.0005 6.12354" stroke="black" stroke-width="1.2" stroke-linecap="round"></path></svg></button>`,
      nextArrow: `<button class="btn-next"><svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.3765 1.5L29.0005 6.124L24.3765 10.747" stroke="white" stroke-width="1.2" stroke-linecap="round"></path><path d="M29 6.12354H1" stroke="white" stroke-width="1.2" stroke-linecap="round"></path></svg></button>`
    });
  };

  $(document).on('click', '.clear-search-input', function(){
    const form = $(this).prev().find('input[type="search"]');
    form.val('').focus();
  })
  
  $('#qrcode-wrapper').each(function(){
    const url = $(this).attr('data-url');
    $(this).find('.qrcode').qrcode(url);
  });

  $(document).on('click','.hide-msrp',function(e){
    e.preventDefault();
    $(this).toggleClass('msrp-hidden');
    if($(this).hasClass('msrp-hidden')){
      $('[data-product-price]').css('opacity',0);
      $(this).text('Show MSRP');
    }else{
      $('[data-product-price]').css('opacity',1);
      $(this).text('Hide MSRP');
    }
  });



  $(document).on('click','.download-tearsheet',function(e){
    e.preventDefault();
    window.print();
  });
  
  $(document).on('click','.precheckout-btn', function(){
    $(this).parents('.mini-cart').find('.cart-popup').addClass('show');
  })
  $(document).on('click','.popup-overlay', function(){
    $(this).parent().removeClass('show');
  });

  $('.cart__checkout').on('click', function(e){
    if(localStorage.getItem('__ui')){
      localStorage.removeItem('__ui')
    }
  });

  $(document).on('click','.js-swatch-opener',function(){
    const product_id = $(this).attr('data-product');
    $('.swatches-popup[data-product='+product_id+']').addClass('swatches-popup-open');
  })


  $(document).on('click','.swatches-popup__close',function(){
    const popup = $(this).parents('.swatches-popup');
    popup.removeClass('swatches-popup-open');
  });
  $(document).on('click','.swatches-popup__overlay',function(){
    const popup = $(this).prev();
    popup.removeClass('swatches-popup-open');
  })


  function disableSwatchItems(cart) {
    let disabledSwatchItems = [];
    jQuery(cart.items).each(function() {
      const item = jQuery(this);
      disabledSwatchItems.push(String(item[0].variant_id));
    });
    let swatchItems = jQuery('.swatches-list__item input');

    let disabledCount = 0;
    jQuery(swatchItems).each(function() {
      const item = jQuery(this);
      const itemValue = item.val();
      if(jQuery.inArray(itemValue, disabledSwatchItems)>-1) {
        item.prop('checked', false);
        item.prop('disabled', true);
        item.parent().addClass('swatches-list__item--in-cart');
        disabledCount++;
      } else {
        item.prop('checked', false);
        item.prop('disabled', false);
        item.parent().removeClass('swatches-list__item--in-cart');
      }
    });
    if(disabledCount >= swatchItems.length){
      jQuery('.swatches-popup__btn').prop('disabled', true);
    }else{
      jQuery('.swatches-popup__btn').prop('disabled', false);
    }
  }

  function changeSwatchCountCoord() {
    let count = jQuery('#coordinating-swatches-popup .swatches-list__item input:checked').length;
    let disablecount = jQuery('#coordinating-swatches-popup .swatches-list__item--in-cart input').length;
    let countContainer = jQuery('#coordinating-swatches-popup .swatches-popup__count');
    let priceContainer = jQuery('#coordinating-swatches-popup .swatches-popup__total-price');

    count = count + disablecount;

    if(count == 0) {
      countContainer.text(`${count}`)
    } else if (count == 1) {
      countContainer.text(`${count} SWATCH`)
    } else if (count > 1) {
      countContainer.text(`${count} SWATCHES`)
    }

    if(count > 3) {
      priceContainer.text(`$${(count - 3) * 2}.00`)
    } else if (count < 4) {
      priceContainer.text(`$0`)
    }
  }

  function checkSwatchInputCoord() {
    let inputs = jQuery('#coordinating-swatches-popup .swatches-list__item input');


    jQuery(inputs).each(function() {
      let input = jQuery(this);

      jQuery(input).on('click', function(evt) {
        let inputEvt = evt.target;

        if(inputEvt.checked) {
          jQuery(inputEvt).closest('.swatches-list__item').addClass('swatches-list__item--active');
        } else {
          jQuery(inputEvt).closest('.swatches-list__item').removeClass('swatches-list__item--active');
        }
      });

    });
  }
  
  function disableSwatchItemsCoord(cart) {
    let disabledSwatchItems = [];
    jQuery(cart.items).each(function() {
      const item = jQuery(this);
      disabledSwatchItems.push(String(item[0].variant_id));
    });
    let swatchItems = jQuery('#coordinating-swatches-popup .swatches-list__item input');

    let disabledCount = 0;
    jQuery(swatchItems).each(function() {
      const item = jQuery(this);
      const itemValue = item.val();
      if(jQuery.inArray(itemValue, disabledSwatchItems)>-1) {
        item.prop('checked', false);
        item.prop('disabled', true);
        item.parent().addClass('swatches-list__item--in-cart');
        disabledCount++;
      } else {
        item.prop('checked', false);
        item.prop('disabled', false);
        item.parent().removeClass('swatches-list__item--in-cart');
      }
    });
    if(disabledCount >= swatchItems.length){
      jQuery('#coordinating-swatches-popup .swatches-popup__btn').prop('disabled', true);
    }else{
      jQuery('#coordinating-swatches-popup .swatches-popup__btn').prop('disabled', false);
    }
  }


  function quickView(url){
    const wrapper = $('.quickview-popup .popup-content');
    wrapper.empty();
    wrapper.append(`<div class="poodle-animated"><span></span></div>`);
    $('.quickview-nav').addClass('hidden');
    const settings = {
      "url": url,
      "method": "GET"
    };
    $.ajax(settings).done(function (response) {
      const result = $($(response)[0]).html();
      const swatchesPopup = $($(response)[2]).html();
      wrapper.empty();
      wrapper.append(result);
      $('#coordinating-swatches-popup').empty();
      $('#coordinating-swatches-popup').append(swatchesPopup);
      jQuery.getJSON('/cart.js', function(cart) {
        disableSwatchItemsCoord(cart);
        changeSwatchCountCoord();
        checkSwatchInputCoord();
      });
    
      sections.register("quickview-product", theme.Product);
      $('.quickview-nav').removeClass('hidden');
      jcf.setOptions('Select', {
        wrapNative: false,
      });
      jcf.replaceAll();
      wrapper.find('.product__holder').removeClass('viewport-section');
    });
  }

  jQuery(document).on('click', '.quickview', function (e) {
    let currentIndex = parseInt(jQuery(this).parents('.slick-slide').attr('data-slick-index'));
    if(currentIndex < 0){
      currentIndex = 7 + currentIndex;
    }

    jQuery('.quickview-popup').addClass('opened').attr('data-index',currentIndex);
    var scrollPosition = $(window).scrollTop();
    jQuery('body').css({
      'position': 'fixed',
      'top': -scrollPosition + 'px',
      'width': '100%'
    }).attr('data-scroll',scrollPosition);
    const baseUrl = $(this).attr('data-url');
    const url = `${baseUrl}?view=quickview`;
    quickView(url);
  });

  jQuery(document).on('click', '.quickview-nav', function (e) {
    let currentIndex = parseInt(jQuery('.quickview-popup').attr('data-index'));
    const totalSlide = parseInt(jQuery('.coordinating-styles').find('.collections-tabs').attr('data-total')) - 1;
    if(jQuery(this).hasClass('quickview-next')){
      currentIndex++;
    }else{
      currentIndex--;
    }
    if(currentIndex < 0){
      currentIndex = totalSlide;
    }else if(currentIndex > totalSlide){
      currentIndex = 0;
    }
    jQuery('.coordinating-styles').find(`[data-slick-index="${currentIndex}"] .quickview`).trigger('click');
  });

  $(document).on('click','.quickview-popup .custom-swatch-image', function(e){
    e.preventDefault();
    const baseUrl = $(this).attr('data-url');
    const url = `${baseUrl}?view=quickview`;
    quickView(url);
  });

  jQuery(document).on('click', '.quickview-popup .popup-overlay, .quickview-popup .popup-close', function (e) {
    const scrollPosition = jQuery('body').attr('data-scroll');
    jQuery('body').css({
      'position': 'static'
    });
    window.scrollTo(0, scrollPosition);
    jQuery('.quickview-popup').removeClass('opened');
  });

  // document.addEventListener('touchmove', function (event) {
  //   if (event.scale !== 1) { event.preventDefault(); }
  // }, { passive: false });

  jQuery(document).on('click', '.quickview-popup [data-quickview-gallery]', function (e) {
    e.preventDefault();
    const indexData = $(this).parents('.slick-slide').index();
    $.fancybox.open($('[data-quickview-gallery]'),{
      parentEl: 'body',
      margin: [50, 0],
      btnTpl: {
        close:
          '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="">' +
          '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 17.9707L17.9706 1.00014" stroke="black" stroke-width="1.5" stroke-linecap="round"/><path d="M1 1L17.9706 17.9706" stroke="black" stroke-width="1.5" stroke-linecap="round"/></svg>\n' +
          "</button>",
        arrowLeft:
          '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="">' +
          '<svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.62354 1.2749L0.999535 6.1301L5.62354 10.9843" stroke="black" stroke-width="1.2" stroke-linecap="round"/><path d="M1 6.12949H29" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg>' +
          "</button>",
        arrowRight:
          '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="">' +
          '<svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.3765 1.2749L29.0005 6.1301L24.3765 10.9843" stroke="black" stroke-width="1.2" stroke-linecap="round"/><path d="M29 6.12949H1" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg>' +
          "</button>"
      },
      thumbs: {
        autoStart: true,
        hideOnClose: false,
        parentEl: ".fancybox-container",
        axis: "y"
      },
      afterShow : function( instance, current ) {
        $('.fancybox-container .fancybox-inner').append(`
          <div class="zoom-instructions animating">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M32.979 19C35.4196 17.1788 37 14.2687 37 10.9892C37 5.47236 32.5276 1 27.0106 1C23.7313 1 20.8212 2.58027 19 5.02086C17.1788 2.58027 14.2687 1 10.9892 1C5.47236 1 1 5.47236 1 10.9892C1 14.2687 2.58045 17.1788 5.02104 19C2.58045 20.8212 1 23.7312 1 27.0108C1 32.5275 5.47236 36.9998 10.9892 36.9998C14.2687 36.9998 17.1788 35.4196 19 32.979C20.8212 35.4196 23.7313 36.9998 27.0106 36.9998C32.5276 36.9998 37 32.5275 37 27.0108C37 23.7312 35.4196 20.8212 32.979 19Z" fill="black" fill-opacity="0.8"/>
            </svg>              
          </div>
        `);
        setTimeout(function(){
          $('.fancybox-container .fancybox-inner .zoom-instructions').removeClass('animating');
        }, 4500)
      },
      beforeClose : function( instance, current ) {
        $('.fancybox-container .fancybox-inner .zoom-instructions').removeClass('animating');
      },
      clickContent: function(current, event) {
        if($('.fancybox-container').hasClass('fancybox-can-zoomIn')){
          $('.fancybox-container .fancybox-inner .zoom-instructions').removeClass('animating');
          $('.cursor').addClass('zoom-out').removeClass('zoom-in');
        }else{
          $('.cursor').addClass('zoom-in').removeClass('zoom-out');
        }
        return current.type === "image" ? "zoom" : false;
      }
    },indexData);
  });
  
  jQuery(document).on('click', '.klaviyo-bis-trigger.in-quickview', function (e) {
    e.preventDefault();
    window.location.href = $(this).attr('href');
  });

  $(document).on('click', '[data-add-to-cart]', function (e) {
    $(this).addClass('disabled');
  });

  
  $(document).on('cart.requestComplete', function(event, cart) {
    $('[data-add-to-cart]').removeClass('disabled');
  });
 
});

