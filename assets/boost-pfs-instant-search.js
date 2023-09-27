// Override Settings
var boostPFSInstantSearchConfig = {
	search: {
		//suggestionMode: 'test',
		//suggestionPosition: 'left',
      suggestionColumn: '2-fullwidth',
      suggestionWidth: 'fullwidth',
	}
};

(function() {
	BoostPFS.inject(this);

	// Customize style of Suggestion box
	SearchInput.prototype.customizeInstantSearch = function() {
		var suggestionElement = this.$uiMenuElement;
		var searchElement = this.$element;
		var searchBoxId = this.id;
	};

  InstantSearchMobile.prototype._onFocusMobileInput = function (params) {
    
  }

  InstantSearchMobile.prototype._onFocusSearchBox = function (params) {
    
  }

  InstantSearchMobile.prototype._onClickSearchBox = function (params) {
    
  }
  
  	InstantSearchResultItemProduct.prototype.getTemplate = function(tempType) {
		switch (tempType) {
			case InstantSearchResultItemProduct.tempType.IMAGE:
				return `
					<div class="{{class.searchSuggestion}}-left">
						<img tabindex="-1" src="{{imageUrl}}" alt="{{escapedTitle}}">
					</div>
				`.trim();
			case InstantSearchResultItemProduct.tempType.SKU:
				return `
					<p class="{{class.searchSuggestion}}-product-sku">SKU: {{sku}}</p>
				`.trim();
			case InstantSearchResultItemProduct.tempType.VENDOR:
				return `
					<p class="{{class.searchSuggestion}}-product-vendor">{{vendor}}</p>
				`.trim();
			case InstantSearchResultItemProduct.tempType.PRICE:
				return `
					<p class="{{class.searchSuggestion}}-product-price">
						<span class="{{class.searchSuggestion}}-product-regular-price">{{regularPrice}}</span>
					</p>
				`.trim();
			case InstantSearchResultItemProduct.tempType.PRICE_SALE:
				return `
					<p class="{{class.searchSuggestion}}-product-price">
						<s>{{compareAtPrice}}</s>&nbsp;
						<span class="{{class.searchSuggestion}}-product-sale-price">{{regularPrice}}</span>
					</p>
				`.trim();
			default:
				return `
					<li class="{{class.searchSuggestionItem}} {{class.searchSuggestionItem}}-product {{class.searchUiAutocompleteItem}}" aria-label="{{escapedBlockType}}: {{escapedTitle}}" data-id="{{id}}" role="option">
						<div class="featured-product">
                          {{itemProductImage}}
                          <div class="{{class.searchSuggestion}}-right">
                              <div class="boost-pfs-filter-product-bottom-inner swatch-active">
                                  <div class="featured-product__wrap">
                                      <h4 class="featured-product__title">
                                          <a href="{{url}}#" class="js-featured-product__link">{{title}}</a>
                                          {{itemSizeSwatchesHeader}}
                                      </h4>
                                      <div class="featured-product__price-box">
                                          {{itemProductPrice}}
                                          {{itemSizeSwatchesHeader}}
                                          {{buildTagPillows}}
                                      </div>
                                  </div>
                                  {{itemProductVendor}}
                                  {{itemSizeSwatches}}
                                  {{itemColorSwatches}}
                              </div>
                          </div>
						</div>
					</li>
				`.trim();
		}
	}
    const decode = function(str) {
		let txt = document.createElement("textarea");
		txt.innerHTML = str;
		return txt.value;
	}

    InstantSearchResultItemProduct.prototype.compileTemplate = function() {
      	if (this.isShow) {
			var searchTerm = Utils.stripHtml(Globals.currentTerm);

			// Product image
			var imageHTML = '';
			if (Settings.getSettingValue('search.showSuggestionProductImage') && this.imageUrl.length) {
				imageHTML = this.getTemplate(InstantSearchResultItemProduct.tempType.IMAGE);
				imageHTML = imageHTML.replace(/{{imageUrl}}/g, this.imageUrl);
			}
			// Product title
			var productTitle = this.customizeProductTitle();
			let variantTitle = decode(productTitle);
			console.log(variantTitle);
			if(variantTitle.includes(window.variant_separator)){
				const titleSplit = variantTitle.split(window.variant_separator);
				variantTitle = titleSplit[0].trim();
			}
			productTitle = this._highlightSuggestionResult(variantTitle, searchTerm);
			// SKU
			var skuHTML = '';
			if (Settings.getSettingValue('search.showSuggestionProductSku') && this.sku.length) {
				skuHTML = this.getTemplate(InstantSearchResultItemProduct.tempType.SKU);
				skuHTML = skuHTML.replace(/{{sku}}/g, this.sku);
			}
			// Vendor
			var vendorHTML = '';
			if (Settings.getSettingValue('search.showSuggestionProductVendor') && this.vendor.length) {
				vendorHTML = this.getTemplate(InstantSearchResultItemProduct.tempType.VENDOR);
				vendorHTML = vendorHTML.replace(/{{vendor}}/g, this.vendor);
			}
			// Price
			var priceHTML = this.compileSuggestionProductPrice();
			// Open the result item in new tab when selected
			var newTabAttr = Settings.getSettingValue('search.openProductNewTab') ? 'target="_blank"' : '';

          	return this.getTemplate()
				.replace(/{{id}}/g, this.id)
				.replace(/{{escapedBlockType}}/g, Utils.stripHtml(this.parent.type))
				.replace(/{{newTabAttribute}}/g, newTabAttr)
				.replace(/{{itemProductImage}}/g, buildImages(this.data))
            	.replace(/{{url}}/g, this.url)
				.replace(/{{title}}/g, variantTitle)
				.replace(/{{itemSizeSwatchesHeader}}/g, buildProductOptionSwatchesHeader(this.data, 'Color', 'color', true, 'swatch_color_display_type_image_color'))
				.replace(/{{itemColorSwatches}}/g, buildProductOptionSwatches(this.data, 'Color', 'color', true, 'swatch_color_display_type_image_color'))
				.replace(/{{itemSizeSwatches}}/g, buildProductOptionSwatches(this.data, 'Size', 'size', false, ''))
            	.replace(/{{buildTagPillows}}/g, buildTagPillows(this.data))
				.replace(/{{escapedTitle}}/g, Utils.stripHtml(productTitle))
				.replace(/{{itemProductSku}}/g, skuHTML)
				.replace(/{{itemProductVendor}}/g, vendorHTML)
				.replace(/{{itemProductPrice}}/, priceHTML)
				.replace(/{{class.searchSuggestion}}/g, Class.searchSuggestion)
				.replace(/{{class.searchSuggestionItem}}/g, Class.searchSuggestionItem)
				.replace(/{{class.searchUiAutocompleteItem}}/g, Class.searchUiAutocompleteItem);
		} else {
			return '';
		}
	}
    
    const BoostPFSInstantSearchCallback = function(result) {
        InstantSearchApi.setDefaultValueForExcludedFields(result);

        if (typeof InstantSearchApi.afterCall == 'function') {
            result = InstantSearchApi.afterCall(result);
        }

        if (typeof InstantSearchApi.afterCallAsync == 'function') {
            result = InstantSearchApi.afterCallAsync(result, InstantSearchApi.callbackInstantSearchApi);
            return;
        }
        InstantSearchApi.callbackInstantSearchApi(result);
    };
    
    InstantSearchApi.afterCall = function(result) {
        /* Change the result after calling api */
        result.products.forEach(function(product) {
          	// Add Options
            var optionsArr = [];
          	var variantOptArr = [];
            for (var i = 0; i < product.options_with_values.length; i++) {
				optionsArr.push(product.options_with_values[i]['name']);
                for (var j = 0; j < product.options_with_values[i]['values'].length; j++) {
					var optionValue = product.options_with_values[i]['values'][j];
                  	variantOptArr.push(optionValue.title);
                }
            }
          	product.options = optionsArr;
          
          	// Customize variants
			product.variants.forEach(variant => {
				var variantOptionArr = [];
				// Add Options
				var variantOptions = variant.merged_options;
				if (Array.isArray(variantOptions)) {
					for (var j = 0; j < variantOptions.length; j++) {
						var temp = variantOptions[j].split(':');
						variant['option' + (parseInt(j) + 1)] = temp[1];
                      	variant['option_' + temp[0]] = temp[1];
						variantOptionArr.push(temp[1]);
					}
					variant.options = variantOptionArr;
				}
			})
          
          	product.title.toUpperCase();
        })
        
        return result;
        /* No need to return anything, you need to change the 'result' object directly */
    }
    
    function buildProductOptionSwatchesHeader(data, swatchName, optionName, swatchDisplay, swatchType) {
		var swatchesProductOptionHtml = '',
			filterSwatchTitle = swatchName,
			optionName = optionName,
			swatchArr = [],
			countSwatch = 0,
			swatchValues = [],
			swatchLimit = 4;

		var dataImgSize = '360',
			bgSize = '50x',
			dataImgSrc = Utils.getFeaturedImage(data.images_info, dataImgSize + 'x'),
			swatchName = '#ffffff',
			bgImageSrc = '',
			viewMoreLabel = 'More ' + filterSwatchTitle;

		if (swatchDisplay) {
			if (data.variants.length > 0 ) {
				var values = {};
				for (let k = 0; k < data.variants.length; k++) {
					let variant = data.variants[k];
					let value = variant.merged_options;
					var option_index;
					var option_size = 0;
                  
					var variantColor = '';
                    for (var m = 0; m < variant.merged_options?.length; m++){
                      if(variant.merged_options[m].indexOf('color:') !== -1){
                        variantColor = variant.merged_options[m].replace('color:','');
                      }
                    }
                  	
                  	//console.log(variantColor);
                    if (data.options_with_values != null) {
                        for (let i = 0; i < data.options_with_values?.length; i++) {
                            //console.log(0,data.options_with_values[i].name);
                          	if (data.options_with_values[i].name === "color" || data.options_with_values[i].name === "Color") {
                                option_index = +i;
                            }
                        }

                        for (let i = 0; i < data.options_with_values.length; i++) {
                            let size =  data.options_with_values[i];

                            if (size.name === "size" || size.name === "Size") {
                                option_size = size.values.length;
                            }
                        }
                      	//console.log(1,option_index);
                        if (option_index != undefined) {
                          //console.log(value[option_index], variant.option_color);
                            if (variant.merged_options.indexOf(value[option_index]) !== -1) {

                                if (!values[variantColor]) {
                                    values[variantColor] = {
                                        'id' : 	variant.id,
                                        'image' : variant.image,
                                        'price' : variant.price,
                                        'sku' : variant.sku,
                                        'compare_at_price' : variant.compare_at_price
                                    };
                                }

                            }
                        }
                    }
				}

				if (Object.entries(values).length === 0 && values.constructor === Object) {
					const productTitle = data.title;
					if(productTitle.includes(window.variant_separator)){
						const variantTitle = productTitle.split(window.variant_separator);
						swatchesProductOptionHtml += '<div Class="swatch-wrapper featured-product__wrapper">';
						swatchesProductOptionHtml += '<div class="header">';
						swatchesProductOptionHtml += '<span>'+variantTitle[1].trim()+'</span>';
						if (option_size > 0) {
							swatchesProductOptionHtml += '<strong>'+option_size+' Sizes</strong>';
						}
	
						swatchesProductOptionHtml += '</div>';
						
						swatchesProductOptionHtml += '</div>';
					}
				} else {
					swatchesProductOptionHtml += '<div Class="swatch-wrapper featured-product__wrapper">';
					swatchesProductOptionHtml += '<div class="header">';
					let i = 0;
					for (const key in values) {
						i++
						if (i == 1) {
							swatchesProductOptionHtml += '<span>'+key+'</span>';
						}

					}
					if (option_size > 0) {
						swatchesProductOptionHtml += '<strong>'+option_size+' Sizes</strong>';
					}

					swatchesProductOptionHtml += '</div>';
					
					swatchesProductOptionHtml += '</div>';
				}


			}
		}
		return swatchesProductOptionHtml;
	}
  
  	// Build Color Swatches
    function buildProductOptionSwatches(data, swatchName, optionName, swatchDisplay, swatchType) {
        var swatchesProductOptionHtml = '',
            filterSwatchTitle = swatchName,
            optionName = optionName,
            swatchArr = [],
            countSwatch = 0,
            swatchValues = [],
            swatchLimit = 4;

        var dataImgSize = '360',
            bgSize = '50x',
            dataImgSrc = Utils.getFeaturedImage(data.images_info, dataImgSize + 'x'),
            swatchName = '#ffffff',
            bgImageSrc = '',
            viewMoreLabel = 'More ' + filterSwatchTitle;

        if (swatchDisplay) {
            if (data.variants.length > 0) {
                var values = {};
                for (let k = 0; k < data.variants.length; k++) {
                    let variant = data.variants[k];
                    let value = variant.merged_options;
                  
                    var option_index;
                    var option_size = 0;
                  
                  	var variantColor = '';
                    for (var m = 0; m < variant.merged_options?.length; m++){
                      if(variant.merged_options[m].indexOf('color:') !== -1){
                        variantColor = variant.merged_options[m].replace('color:','');
                      }
                    }
                  
                  	if (data.options_with_values != null) {
                        for (let i = 0; i < data.options_with_values.length; i++) {
                            if (data.options_with_values[i].name === "color" || data.options_with_values[i].name === "Color") {
                                option_index = +i;
                            }
                        }
                        for (let i = 0; i < data.options_with_values.length; i++) {
                            let size = data.options_with_values[i];

                            if (size.name === "size" || size.name === "Size") {
                                option_size = size.values.length;
                            }
                        }
                      
                      	if (option_index != undefined) {
                          //console.log(value[option_index], variant.option_color);
                            if (variant.merged_options.indexOf(value[option_index]) !== -1) {

                                if (!values[variantColor]) {
                                    values[variantColor] = {
                                        'id' : 	variant.id,
                                        'image' : variant.image,
                                        'price' : variant.price,
                                        'sku' : variant.sku,
                                        'compare_at_price' : variant.compare_at_price,
										'initial_color': variant.initial_color	
                                    };
                                }

                            }
                        }
                    }
                }

                if (Object.entries(values).length === 0 && values.constructor === Object) {

                } else {
                    swatchesProductOptionHtml += '<div Class="swatch-wrapper featured-product__wrapper">';

                    swatchesProductOptionHtml += '<div class="swatch clearfix" data-option-index="' + option_index + '" data-swatch="Color">';
                    //console.log(false)
                    var countObj = 0;
                    var count = 0;
                    for (const key in values) {

                        countObj++
                        if (countObj > 1) {
                            var classHide = "";
                        } else {
                            var classHide = "hover";
                        }
                        if (countObj > 5) {
                            var classMore = "hide";
                        } else {
                            var classMore = "";
                        }
                        if (Object.hasOwnProperty.call(values, key)) {
                            const element = values[key];
                            //console.log(element.image)
                            if (element.image) {
                                bgImageSrc = element.image;
                            } else {
                                bgImageSrc = boostPFSAppConfig.general.file_url.replace(/\?/, Utils.slugify().replace(/\-/g, '_') + '' + key.toLowerCase() + '.png?v=');
                            }
                          	var bgImageSrcLastDot = bgImageSrc.lastIndexOf('.');
                          	if (bgImageSrcLastDot > -1 ) {
                              bgImageSrc = bgImageSrc.substring(0, bgImageSrcLastDot) + '_' + bgSize + bgImageSrc.substring(bgImageSrcLastDot);
                            }

                            swatchesProductOptionHtml += '<div data-value="' + key + '" class="swatch-element color ' + key.toLowerCase() + ' ' + classHide + '' + classMore + ' ">';

                            swatchesProductOptionHtml += '<label for="swatch-' + key + '-' + element.id + '">';
                            swatchesProductOptionHtml += '<span class="bg_color" style="background-color:' + key.toLowerCase() + '; background-image: url(' + bgImageSrc + ');">';
                            swatchesProductOptionHtml += '<span class="visually-hidden"></span>';
                            swatchesProductOptionHtml += '</span>';
                            swatchesProductOptionHtml += '</label>';
                            swatchesProductOptionHtml += '<input id="swatch-' + key + '-' + element.id + '" type="radio" data-variant-image="' + element.id + '" name="option-' + option_index + '-' + data.id + '" value="' + key + '" data-initial-color="' + (element.initial_color ? element.initial_color : '') + '" data-swatch-option="' + option_index + '">';
                            swatchesProductOptionHtml += '</input>';

                            swatchesProductOptionHtml += '</div>';

                        }
                        count++
                    }
                    //console.log(Object.entries(values).length)
                    var ObjectLength = Object.entries(values).length - 5
                    if (Object.entries(values).length > 5) {
                        swatchesProductOptionHtml += '<div class="swatch-rest"><span>+' + ObjectLength + '</span></div>';
                    }
                    swatchesProductOptionHtml += '</div>';
                    swatchesProductOptionHtml += '</div>';
                }
            }
          
			function initSwatchList() {
				const swatchList = document.querySelectorAll('[data-variant-image]');
				if(!swatchList) {
				  return;
				}
				
				swatchList.forEach((swatch) => {
					//console.log(swatch)
				  swatch.addEventListener('click', function(){

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
						
                      // console.log(images);
                      
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
						if (this.getAttribute('data-initial-color')) {
					  		swatch.innerHTML = this.getAttribute('data-initial-color');
					  	} else {
					  		swatch.innerHTML = this.getAttribute('value');
					  	}
					  })
					}
				  });
				})
			  }


			  setTimeout(initSwatchList, 1000);
		}
		return swatchesProductOptionHtml;
	}
  
  	function buildTagPillows(data) {
		if (data.product_type == "Set") {
			var tagLabel = '';
			if (data.tags) {
				for (var i = 0; i < data.tags.length; i++) {
					var tag = data.tags[i];
					if (tag.indexOf("count:") !== -1) {
						var preTagLabel = tag.split('count:')[1];
						tagLabel += '<p class="boost-pfs-filter-product-item-set">'+preTagLabel+' pillows</p>';
					}
				}
			}
			return tagLabel;
		}else {
			return '';
		}
	}
  
  	function buildImages(data) {
		//console.log(data);
      	var images = data.images_info;
		var html = '',
			aspectRatio = '',
			rangeWidths = [300],
			paddingTop = 100;

		var dataSrcSet = '',
			dataWidths = '',
			dataSizes = 'auto',
			imgAlt = data.title,
			flipImageSrcSet = '';

		var activeSwapImage = !Utils.isMobile() && images.length > 1;
      
      	var isSet = data.product_type === "Set";


		for (var i = 0; i < rangeWidths.length; i++) {
			dataSrcSet += Utils.getFeaturedImage(images, rangeWidths[i] + 'x') + ' ' + rangeWidths[i] + 'w';
			dataWidths += rangeWidths[i];

			if (activeSwapImage) {
				flipImageSrcSet += Utils.optimizeImage(images[1]['src'], rangeWidths[i] + 'x') + ' ' + rangeWidths[i] + 'w';
			}

			if (i < rangeWidths.length - 1) {
				dataSrcSet += ', ';
				dataWidths += ', ';

				if (activeSwapImage) {
					flipImageSrcSet += ', ';
				}
			}
		}

		if (images.length > 0) {
			aspectRatio = images[0]['width'] / images[0]['height'];
			paddingTop = 1 / aspectRatio * 100;
		}

		/* html += '<a href="{{itemUrl}}" class="boost-pfs-filter-product-item-image-link" ';
		html += 'style="padding-top:' + paddingTop + '%;">';

		html += '<img class="boost-pfs-filter-product-item-main-image lazyload Image--lazyLoad"' +
			'data-srcset="' + dataSrcSet + '" ' +
			'data-src="' + Utils.getFeaturedImage(images, rangeWidths[2] + 'x') + '" ' +
			'data-widths="[' + dataWidths + ']" ' +
			'data-sizes="' + dataSizes + '" ' +
			'src="' + boostPFSImgDefaultSrc + '" ' +
			'alt="' + imgAlt + '" ';

		if (activeSwapImage) {
			html += 'data-img-flip-src="' + Utils.optimizeImage(images[1]['src'], rangeWidths[2] + 'x') + '" ' +
				'data-img-flip-srcset="' + flipImageSrcSet + '" ';
		}
		html += '/></a>'; */


		
		if (data.variants.length > 0 ) {
          	html += '<div class="featured-product__gallery' + (isSet ? ' featured-product__gallery--set' : '') + '"><div class="featured-product__gallery-wrap">';
			var values = {};
			for (let k = 0; k < data.variants.length; k++) {
				let variant = data.variants[k];
				let value = variant.merged_options;
				let option_index;
				
              	var variantColor = '';
                for (var m = 0; m < variant.merged_options?.length; m++){
                  if(variant.merged_options[m].indexOf('color:') !== -1){
                    variantColor = variant.merged_options[m].replace('color:','');
                  }
                }

				for (let i = 0; i < data.options_with_values?.length; i++) {
					if (data.options_with_values[i].name === "color" || data.options_with_values[i].name === "Color") {
						option_index = +i;
					}
				}
				if (option_index != undefined) {

					if (variant.merged_options.indexOf(value[option_index]) !== -1) {

						if (!values[variantColor]) {
                          values[variantColor] = {
                            'id' : 	variant.id,
                            'image' : variant.image,
                            'price' : variant.price,
                            'sku' : variant.sku,
                            'compare_at_price' : variant.compare_at_price
                          };
                        }

					}
				}
			}

			if (Object.entries(values).length === 0 && values.constructor === Object) {
				//console.log(true)
				//html += '<div class="featured-product__gallery"><div class="featured-product__gallery-wrap">';
				html += '<div data-value="'+data.id+'" data-href="{{url}}" class="featured-product__image '+classHide+'">';
				html += '<a href="{{url}}" class="js-featured-product__link" tabindex="0">';
				html += '<img class="featured-product__img boost-pfs-filter-product-item-main-image"' +
						'data-srcset="' + dataSrcSet + '" ' +
						'data-src="' + Utils.getFeaturedImage(images, '300x') + '" ' +
						'data-widths="[' + dataWidths + ']" ' +
						'data-sizes="' + dataSizes + '" ' +
						'src="' + Utils.getFeaturedImage(images, '300x') + '" ' +
						'alt="' + imgAlt + '" />';
				html += '</a>';
				html += '</div>';
				//html += '</div></div>';
			} else {
				//console.log(false)
				var countObj = 0;
				var count = 0;
				for (const key in values) {
					countObj++
					if (countObj > 1) {
						var classHide = "hide";
					}else {
						var classHide = "";
					}
					if (Object.hasOwnProperty.call(values, key)) {
						const element = values[key];


						html += '<div data-value="'+element.id+'" data-href="{{url}}" class="featured-product__image '+classHide+'">';
						html += '<a href="{{url}}" class="js-featured-product__link" tabindex="0">';
						if (element.image === null) {
							html += '<img class="featured-product__img boost-pfs-filter-product-item-main-image"' +
									'data-srcset="' + dataSrcSet + '" ' +
									'data-src="' + Utils.getFeaturedImage(images, '300x') + '" ' +
									'data-widths="[' + dataWidths + ']" ' +
									'data-sizes="' + dataSizes + '" ' +
									'src="' + Utils.getFeaturedImage(images, '300x') + '" ' +
									'alt="' + imgAlt + '" />';
						}else {
							//console.log(images);
							images[0].src = element.image;
							//console.log(images);
							var dataSrcSetTwo = '';
							for (var i = 0; i < rangeWidths.length; i++) {
								dataSrcSetTwo += Utils.getFeaturedImage(images, '300x');

								if (i < rangeWidths.length - 1) {
									dataSrcSetTwo += ', ';

								}
							}
							html += '<img class="featured-product__img boost-pfs-filter-product-item-main-image"' +
									'data-srcset="' +  dataSrcSetTwo + '" ' +
									'data-src="' + Utils.getFeaturedImage(images, '300x') + '" ' +
									'data-widths="[' + dataWidths + ']" ' +
									'data-sizes="' + dataSizes + '" ' +
									'src="' + Utils.getFeaturedImage(images, '300x') + '" ' +
									'alt="' + imgAlt + '" />';
						}
						html += '</a>';
						html += '</div>';
					}
					count++
				}
			}

		html += '</div></div>';
		}


		return html;
	}
  
  	InstantSearchResult.prototype._applyFilterAutocompleteAppendElement = function() {
      // initSwatchList();
	}
  
})();