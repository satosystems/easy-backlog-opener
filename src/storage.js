/* global chrome */

'use strict'

export default {
  get: key => {
    return new Promise(resolve => {
      const obj = {}
      obj[key] = ''
      chrome.storage.local.get(obj, result => resolve(result[key]))
    })
  },

  set: (key, value) => {
    return new Promise(resolve => {
      const obj = {}
      obj[key] = value
      chrome.storage.local.set(obj, resolve)
    })
  }
}
