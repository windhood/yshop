if ((typeof ShopQi) == 'undefined') {
  var ShopQi = {};
}


// ---------------------------------------------------------------------------
// ShopQi generic helper methods
// ---------------------------------------------------------------------------
ShopQi.each = function(ary, callback) {
  for (var i = 0; i < ary.length; i++) {
    callback(ary[i], i);
  }
};

ShopQi.map = function(ary, callback) {
  var result = [];
  for (var i = 0; i < ary.length; i++) {
    result.push(callback(ary[i], i));
  }
  return result;
};

ShopQi.arrayIncludes = function(ary, obj) {
  for (var i = 0; i < ary.length; i++) {
    if (ary[i] == obj) {
      return true;
    }
  }
  return false;
};

ShopQi.uniq = function(ary) {
  var result = [];
  for (var i = 0; i < ary.length; i++) {
    if (!ShopQi.arrayIncludes(result, ary[i])) { result.push(ary[i]); }
  }
  return result;
};

ShopQi.isDefined = function(obj) {
  return ((typeof obj == 'undefined') ? false : true);
};

ShopQi.getClass = function(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

ShopQi.extend = function(subClass, baseClass) {
  function inheritance() {}
  inheritance.prototype = baseClass.prototype;

  subClass.prototype = new inheritance();
  subClass.prototype.constructor = subClass;
  subClass.baseConstructor = baseClass;
  subClass.superClass = baseClass.prototype;
};



// ---------------------------------------------------------------------------
// ShopQi Product object
// JS representation of Product
// ---------------------------------------------------------------------------
ShopQi.Product = function(json) {
  if (ShopQi.isDefined(json)) { this.update(json); }
};

ShopQi.Product.prototype.update = function(json) {
  for (property in json) {
    this[property] = json[property];
  }
};

// returns array of option names for product
ShopQi.Product.prototype.optionNames = function() {
  if (ShopQi.getClass(this.options) == 'Array') {
    return this.options;
  } else {
    return [];
  }
};

// returns array of all option values (in order) for a given option name index
ShopQi.Product.prototype.optionValues = function(index) {
  if (!ShopQi.isDefined(this.variants)) { return null; }
  var results = ShopQi.map(this.variants, function(e) {
    var option_col = "option" + (index+1);
    return (e[option_col] == undefined) ? null : e[option_col];
  });
  return (results[0] == null ? null : ShopQi.uniq(results));
};

// return the variant object if exists with given values, otherwise return null
ShopQi.Product.prototype.getVariant = function(selectedValues) {
  var found = null;
  if (selectedValues.length != this.options.length) { return found; }
  
  ShopQi.each(this.variants, function(variant) {
    var satisfied = true;
    for (var j = 0; j < selectedValues.length; j++) {
      var option_col = "option"+(j+1);
      if (variant[option_col] != selectedValues[j]) {
        satisfied = false;
      }
    }
    if (satisfied == true) {
      found = variant;
      return;
    }
  });
  return found;
};





// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
ShopQi.money_format = "$ {{amount}}";
ShopQi.formatMoney = function(cents, format) {
  if (typeof cents == 'string') cents = cents.replace('.','');
  var value = '';
  var patt = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);
  switch(formatString.match(patt)[1]) {
  case 'amount':
    value = floatToString(cents, 2);
    break;
  case 'amount_no_decimals':
    value = floatToString(cents, 0);
    break;
	case 'amount_with_comma_separator':
		value = floatToString(cents, 2).replace(/\./, ',');
		break;
  }    
  return formatString.replace(patt, value);
};

function floatToString(numeric, decimals) {  
  var amount = numeric.toFixed(decimals).toString();  
  if(amount.match(/^\.\d+/)) {return "0"+amount; }
  else { return amount; }
};
// ---------------------------------------------------------------------------
// OptionSelectors(domid, options)
// 
// ---------------------------------------------------------------------------
ShopQi.OptionSelectors = function(existingSelectorId, options) {
  this.selectorDivClass       = 'selector-wrapper';
  this.selectorClass          = 'single-option-selector';
  this.variantIdFieldIdSuffix = '-variant-id';

  this.variantIdField    = null;
  this.selectors         = [];
  this.domIdPrefix       = existingSelectorId;
  this.product           = new ShopQi.Product(options.product);
  this.onVariantSelected = ShopQi.isDefined(options.onVariantSelected) ? options.onVariantSelected : function(){};
  
  this.replaceSelector(existingSelectorId); // create the dropdowns
  this.selectors[0].element.onchange();     // init the new dropdown
  return true;
};

// insert new multi-selectors and hide original selector
ShopQi.OptionSelectors.prototype.replaceSelector = function(domId) {
  var oldSelector = document.getElementById(domId);
  var parent = oldSelector.parentNode;
  ShopQi.each(this.buildSelectors(), function(el) {
    parent.insertBefore(el, oldSelector);
  });
  oldSelector.style.display = 'none';
  this.variantIdField = oldSelector;
};


// insertSelectors(domId, msgDomId)
// create multi-selectors in the given domId, and use msgDomId to show messages
ShopQi.OptionSelectors.prototype.insertSelectors = function(domId, messageElementId) {
  if (ShopQi.isDefined(messageElementId)) { this.setMessageElement(messageElementId); }

  this.domIdPrefix = "product-" + this.product.id + "-variant-selector";

  var parent = document.getElementById(domId);
  ShopQi.each(this.buildSelectors(), function(el) {
    parent.appendChild(el);
  });
};

// buildSelectors(index)
// create and return new selector element for given option
ShopQi.OptionSelectors.prototype.buildSelectors = function() {
  // build selectors
  for (var i = 0; i < this.product.optionNames().length; i++) {
    var sel = new ShopQi.SingleOptionSelector(this, i, this.product.optionNames()[i], this.product.optionValues(i));
    sel.element.disabled = false;
    this.selectors.push(sel);
  }

  // replace existing selector with new selectors, new hidden input field, new hidden messageElement
  var divClass = this.selectorDivClass;
  var optionNames = this.product.optionNames();
  var elements = ShopQi.map(this.selectors, function(selector) {
    var div = document.createElement('div');
    div.setAttribute('class', divClass);
    // create label if more than 1 option (ie: more than one drop down)
    if (optionNames.length > 1) {
      // create and appened a label into div
      var label = document.createElement('label');
      label.htmlFor = selector.element.id;
      label.innerHTML = selector.name;
      div.appendChild(label);
    } 
    div.appendChild(selector.element);
    return div;
  });

  return elements;
};

// returns array of currently selected values from all multiselectors
ShopQi.OptionSelectors.prototype.selectedValues = function() {
  var currValues = [];
  for (var i = 0; i < this.selectors.length; i++) {
    var thisValue = this.selectors[i].element.value;
    currValues.push(thisValue);
  }
  return currValues;
};

// callback when a selector is updated.
ShopQi.OptionSelectors.prototype.updateSelectors = function(index) {
  var currValues = this.selectedValues(); // get current values
  var variant    = this.product.getVariant(currValues);
  if (variant) {
    this.variantIdField.disabled = false;
    this.variantIdField.value = variant.id; // update hidden selector with new variant id
  } else {
    this.variantIdField.disabled = true;
  }
  this.onVariantSelected(variant, this);  // callback 
};

// ---------------------------------------------------------------------------
// OptionSelectorsFromDOM(domid, options)
// 
// ---------------------------------------------------------------------------

ShopQi.OptionSelectorsFromDOM = function(existingSelectorId, options){
  // build product json from selectors
  // create new options hash
  var optionNames = options.optionNames || [];
  var priceFieldExists = options.priceFieldExists || true;
  var delimiter = options.delimiter || '/';
  var productObj = this.createProductFromSelector(existingSelectorId, optionNames, priceFieldExists, delimiter);
  options.product = productObj;
  ShopQi.OptionSelectorsFromDOM.baseConstructor.call(this, existingSelectorId, options);
};

ShopQi.extend(ShopQi.OptionSelectorsFromDOM, ShopQi.OptionSelectors);

// updates the product_json from existing select element
ShopQi.OptionSelectorsFromDOM.prototype.createProductFromSelector = function(domId, optionNames, priceFieldExists, delimiter) {
  if (!ShopQi.isDefined(priceFieldExists)) { var priceFieldExists = true; }
  if (!ShopQi.isDefined(delimiter)) { var delimiter = '/'; }

  var oldSelector = document.getElementById(domId);
  var options = oldSelector.childNodes;
  var parent = oldSelector.parentNode;

  //var optionNames = this.product.optionNames();
  var optionCount = optionNames.length;

  // build product json + messages array
  var variants = [];
  var self = this;
  ShopQi.each(options, function(option, variantIndex) {
    if (option.nodeType == 1 && option.tagName.toLowerCase() == 'option') {
      var chunks = option.innerHTML.split(new RegExp('\\s*\\'+ delimiter +'\\s*'));

      if (optionNames.length == 0) {
        optionCount = chunks.length - (priceFieldExists ? 1 : 0);
      }

      var optionOptionValues = chunks.slice(0, optionCount);
      var message = (priceFieldExists ? chunks[optionCount] : '');
      var variantId = option.getAttribute('value');
      
      var attributes = { 
        available: (option.disabled ? false : true),
        id:  parseFloat(option.value),
        price: message,
        option1: optionOptionValues[0],
        option2: optionOptionValues[1],
        option3: optionOptionValues[2]
      };
      variants.push(attributes);
    }
  });
  var updateObj = { variants: variants };
  if (optionNames.length == 0) {
    updateObj.options = [];
    for (var i=0;i<optionCount;i++) { updateObj.options[i] = ('option ' + (i + 1)) }
  } else {
    updateObj.options = optionNames;
  }
  return updateObj;
};


// ---------------------------------------------------------------------------
// SingleOptionSelector
// takes option name and values and creates a option selector from them
// ---------------------------------------------------------------------------
ShopQi.SingleOptionSelector = function(multiSelector, index, name, values) {
  this.multiSelector = multiSelector;
  this.values = values;
  this.index = index;
  this.name = name;
  this.element = document.createElement('select');
  for (var i = 0; i < values.length; i++) {
    var opt = document.createElement('option');
    opt.value = values[i];
    opt.innerHTML = values[i];
    this.element.appendChild(opt);
  }
  this.element.setAttribute('class', this.multiSelector.selectorClass);
  this.element.id = multiSelector.domIdPrefix + '-option-' + index;
  this.element.onchange = function() {
    multiSelector.updateSelectors(index);
  };

  return true;
};
