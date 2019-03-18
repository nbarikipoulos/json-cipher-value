/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */
'use strict'

let tr = (value, cb = v => v) => {
    
  let type = typeof value;
  if ( 'object' === type) {
    type = Array.isArray(value)
      ? 'array'
      : type
    ;
  }

  let fn;

  switch(type) {
    case 'object':
      fn = (object) => Object.keys(object).reduce(
        (acc, prop) => { acc[prop] = tr(object[prop], cb); return acc;},
        {}
      );
      break;
    case 'array':
      fn = (array) => array.map(elt => tr(elt, cb));
      break;
    default: 
      fn = cb;
  }

  return fn.call(this, value);
}


/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = tr;