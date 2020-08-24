import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import home from '../views/home.vue'
import trips from '../views/trips'
import logIn from '../views/logIn'
import dashboard from '../views/dashboard'
import trip from '../views/trip.vue'
import settings from '../views/settings'
console.log('vue use vue router')
Vue.use(VueRouter)
console.log('routes obj list')
  const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },{
    path: '*',
    redirect: '/'
},
{
    path: '/logIn',
    name: 'LogIn',
    component: logIn
},
{
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard,
    meta: {
        requiresAuth: true
    }
},{
path: '/trips',
name: "trips",
component: trips,
meta: {
    requiresAuth: true
}
},
{
    path: '/trip',
    name: "trip",
    component: trip,
    meta: {
        requiresAuth: true
    }
    },
{
    path: '/settings',
    name: 'settings',
    component: settings,
    meta: {
        requiresAuth: true
    }
}
]
console.log('vue router constant created')
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
//   scrollBehavior: function (to, from, savedPosition) {
//     return { x: 0, y: 0 };
//   }
})

router.beforeEach((to, from, next) => {
    console.log('to ', to)
    console.log('from ', from)
   console.log('router before each stuff')
        window.scrollTo(0,0);
   
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser
console.log('router is checking firebase auth for user here!')
  if (requiresAuth && !currentUser) {
      next('/login')
  } else if (requiresAuth && currentUser) {
    //   TODO: check for profile??
      next()
  } else {
      next()
  }
})

export default router
