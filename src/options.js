'use strict'

import storage from './storage'

document.addEventListener('DOMContentLoaded', () => {
  const ids = ['spaceId', 'apiKey']
  ids.forEach(async id => {
    const text = document.getElementById(id)
    text.value = await storage.get(id)
  })
  const button = document.getElementById('save')
  button.addEventListener('click', () => {
    ids.forEach(async id => {
      const text = document.getElementById(id)
      await storage.set(id, text.value)
    })
    window.close()
  })
})
