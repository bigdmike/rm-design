import { defineStore } from 'pinia'
import actions from './actions.js'
import getters from './getters.js'

export const useUIStore = defineStore('ui', {
  state: () => ({ 
    menuOpen: false, 
    headerStyle: "",
    themeColumns:[]
  }),
  getters,
  actions
})