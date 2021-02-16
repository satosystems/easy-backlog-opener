/* global chrome, fetch */

'use strict'

import storage from './storage'

document.addEventListener('DOMContentLoaded', () => {
  Promise.all([storage.get('spaceId'), storage.get('apiKey')]).then(values => {
    const spaceId = values[0]
    const apiKey = values[1]
    // Check if options are saved.
    if (spaceId === '' || apiKey === '') {
      chrome.tabs.create({ url: 'options.html' })
      return
    }

    const api = {
      get: async (path, params = []) => {
        const query = params.reduce((acc, cur) => `${acc}&${encodeURIComponent(cur.key)}=${encodeURIComponent(cur.value)}`, `?apiKey=${apiKey}`)
        const url = `https://${spaceId}.backlog.com${path}${query}`
        const res = await fetch(url)
        return res.json()
      }
    }

    // Call Backlog API in parallel.
    Promise.all([
      api.get('/api/v2/projects', [{ key: 'archived', value: 'false' }]),
      api.get('/api/v2/users/myself/recentlyViewedProjects', [{ key: 'count', value: '1' }])
    ]).then(results => {
      const selectOfProjectKeys = results[0].reduce((acc, cur) => {
        const option = document.createElement('option')
        option.value = cur.projectKey
        option.textContent = cur.projectKey
        acc.appendChild(option)
        return acc
      }, document.getElementById('projectKeys'))
      const recentlyViewedProjectKey = results[1][0] ? results[1][0].project.projectKey : ''
      selectOfProjectKeys.value = recentlyViewedProjectKey

      const textOfNumber = document.getElementById('number')
      textOfNumber.addEventListener('keypress', e => {
        if (e.key !== 'Enter') {
          return
        }

        const selectOfProjectKeys = document.getElementById('projectKeys')
        const projectKey = selectOfProjectKeys.value
        const number = textOfNumber.value
        window.open(`https://${spaceId}.backlog.com/view/${projectKey}-${number}`, '_blank')
      })
      textOfNumber.focus()
    })
  })
})
