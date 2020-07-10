import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import home from '../views/home.vue'
import trips from '../views/trips'
import list from '../views/list'
import logIn from '../views/logIn'
import dashboard from '../views/dashboard'
import trip from '../views/trip.vue'
import newTrip from '../views/newTrip'
import notifications from '../views/userNotifications'
import settings from '../views/settings'

Vue.use(VueRouter)

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
    },{
        path: '/newTrip',
        name: "newTrip",
        component: newTrip,
        meta: {
            requiresAuth: true
        }
        },{
    path: '/list',
    name: 'list',
    component: list,
    meta: {
        requiresAuth: true
    }
},{
    path: '/notifications',
    name: 'notifications',
    component: notifications,
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

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
//   scrollBehavior: function (to, from, savedPosition) {
//     return { x: 0, y: 0 };
//   }
})

router.beforeEach((to, from, next) => {
   console.log('router before each stuff')
        window.scrollTo(0,0);
   
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser

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
