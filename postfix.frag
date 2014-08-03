/* BEGIN node2umd POSTFIX */
}); })(typeof define === 'function' && define.amd ? define : function(factory) {
  var isNode,
      exportsObj = (isNode = typeof exports === 'object') ? exports : {},
      moduleObj = isNode ? module : { exports: exportsObj };

  var requireFn = isNode ? require : function(dependency) {
    return this[dependency];
  };

  var def = factory(requireFn, exportsObj, moduleObj) || moduleObj.exports;

  if (!isNode) {
    this[def.globalName] = def;
  }
});
/* END node2umd POSTFIX */
