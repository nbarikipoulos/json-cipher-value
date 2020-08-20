/*! Copyright (c) 2019-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */
'use strict'

const tr = (value, f = v => v) => {
  let type = typeof value
  if (type === 'object') {
    type = Array.isArray(value)
      ? 'array'
      : type
  }

  let fn

  switch (type) {
    case 'object':
      fn = (object) => Object.keys(object).reduce(
        (acc, prop) => {
          acc[prop] = tr(object[prop], f)
          return acc
        },
        {}
      )
      break
    case 'array':
      fn = (array) => array.map(elt => tr(elt, f))
      break
    default:
      fn = f
  }

  return fn.call(this, value)
}

// //////////////////////
// //////////////////////
// Public API
// //////////////////////
// //////////////////////

module.exports = tr
