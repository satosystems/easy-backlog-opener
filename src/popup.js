/* global chrome */

'use strict'

import axios from 'axios'
import storage from './storage'

document.addEventListener('DOMContentLoaded', async () => {
  const ids = ['spaceId', 'apiKey']
  for (let i = 0; i < ids.length; i++) {
    const value = await storage.get(ids[i])
    if (value === '') {
      chrome.tabs.create({ url: 'options.html' })
      return
    }
  }

  Promise.all([storage.get('spaceId'), storage.get('apiKey')]).then(async values => {
    const spaceId = values[0]
    const apiKey = values[1]
    const api = {
      get: async (path, params = []) => {
        const query = params.reduce((acc, cur) => `${acc}&${encodeURIComponent(cur.key)}=${encodeURIComponent(cur.value)}`, `?apiKey=${apiKey}`)
        const url = `https://${spaceId}.backlog.com${path}${query}`
        return axios.get(url)
      }
    }
    const res1 = await api.get('/api/v2/projects', [{ key: 'archived', value: 'false' }])
    const res2 = await api.get('/api/v2/users/myself/recentlyViewedProjects', [{ key: 'count', value: '1' }])
    const recentlyViewedProjectKey = res2.data[0] ? res2.data[0].project.projectKey : ''
    const selectOfProjectKeys = document.getElementById('projectKeys')
    res1.data.forEach(item => {
      const option = document.createElement('option')
      option.value = item.projectKey
      option.textContent = item.projectKey
      selectOfProjectKeys.appendChild(option)
    })
    selectOfProjectKeys.value = recentlyViewedProjectKey

    const textOfNumber = document.getElementById('number')
    textOfNumber.addEventListener('keypress', e => {
      if (e.keyCode !== 13) { // 13 is key code of Enter
        return false
      }
      const selectOfProjectKeys = document.getElementById('projectKeys')
      const projectKey = selectOfProjectKeys.value
      const number = textOfNumber.value
      window.open(`https://${spaceId}.backlog.com/view/${projectKey}-${number}`, '_blank')
    })
    textOfNumber.focus()
  })
})
