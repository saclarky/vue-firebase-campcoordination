import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
const fb = require('./firebaseConfig.js')
// register the plugin on vue
import Toasted from 'vue-toasted';
Vue.use(Toasted, {
    position: 'top-center',
    duration: 2000,
    keepOnHover: true,
    theme: "bubble"
})

import VCalendar from 'v-calendar';
Vue.use(VCalendar);
// Use v-calendar & v-date-picker components
// Vue.use(VCalendar, {
//   componentPrefix: 'vc',  // Use <vc-calendar /> instead of <v-calendar />
//   ...,                // ...other defaults
// });

//timepicker

// Vue.use(VueTimepicker)
 
Vue.config.productionTip = false
console.log('new view')
// new Vue({
//   router,
//   store,
//   render: function (h) { return h(App) }
// }).$mount('#app')

// This logic of an empty app until authStateChange means Vue doesn't start until there's a log-in event that triggers it
// And because the log-in triggered the vue creation, there's no log-in re-route from the current auth-required page?
// But I don't understand why this one doesn't trigger on the page refresh but index.js does?? 
// Because so far this one has only run AFTER the index.js onAuthStateChange()
// THEORY: it's actually the loading of the config file above? Placement of store running first? No and No.
// All I can imagine is the fresh and authStateCHnage are 'used up' by the time this file loads? But this file also loads
// the store file which has its own listener that then gets fired?
// No even on log-in and logout, index.js always fires first? 
console.log('let app')
let app 
  fb.auth.onAuthStateChanged(() => {
    //   console.log('vue authstatechange', user)
    // console.log( 'user logged in and recognizeD?')
    if (!app) {
        console.log('!app')
        app = new Vue({
            el: '#app',
            router,
            store,
            render: h => h(App),
            created: function () {
                // `this` points to the vm instance
                console.log('vue created')
              }
        })
    }
})
