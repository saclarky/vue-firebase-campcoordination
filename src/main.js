import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
const fb = require('./firebaseConfig.js')

Vue.config.productionTip = false

// new Vue({
//   router,
//   store,
//   render: function (h) { return h(App) }
// }).$mount('#app')

// handle page reloads
let app
// auth.onAuthStateChanged(user => { 
  fb.auth.onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            el: '#app',
            router,
            store,
            render: h => h(App)
        })
    }
})