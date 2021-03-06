import Vue from 'vue'
import Vuex from 'vuex'
// import { db } from '@/main'
const fb = require('../firebaseConfig.js')
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import firebase from 'firebase'
import router from '../router'
console.log('use vuex in index.js')
Vue.use(Vuex)

// handle page reload... this is also in main.js to slow down vue reloads until signed-in?? Why does this fire first?
fb.auth.onAuthStateChanged(user => {
  // TODO- logout clear data??
  console.log('auth state change triggered index.js')
  if (user) {
    console.log('creation ', user.metadata.creationTime)
    console.log('signin ', user.metadata.lastSignInTime)
    if (user.metadata.creationTime == user.metadata.lastSignInTime) {
      console.log('new user! but do this without ms seems sketchy. Other option have a state object changed when registering?')
      // Don't fetch or commit the currentuser/profile it likely hasn't been saved yet, code in login.vue will do it
      return
    } else {
      console.log('existing user, saving to state')
      store.commit('setCurrentUser', user)
      store.dispatch('fetchUserProfile')
    }
  }
  else {
    console.log('set null? like if I delete someone and this reacts')
    store.commit('setCurrentUser', null);
    store.commit('setUserProfile', {});
  }
})
console.log("is main.js loading everything first?")

// export default new Vuex.Store({
export const store = new Vuex.Store({
  state: {
    registeringUser: false,
    items: [],
    errors: "",
    itemInput: "",

    //TRIPS
    trips: [],
    joinedTrips: [],
    thisTrip: {},
    thisTripID: '',
    thisTripOwner: '',
    thisTripDates: [],

    //GEAR
    thisTripGroupGear: [],
    thisTripIndGear: [],

    // MEALS
    thisTripGroupMeals: [],
    thisTripIndMeals: [],

    // CAMPERS DOCS DATA BINDS
    thisTripCampers: {},
    thisTripCampersNo: {},
    thisTripCampersPending: {},
    // thisTripInvites: [],

    //TRIP LOGS
    thisTripActivityLog: [],

    // ITINERARY
    thisTripItinerary: [],

    // USER DATA BINDS
    currentUser: null,
    userProfile: {},
    thisUserNotifications: []
  },
  getters: {
    // TRIPS
    tripsOrdered: state => {
      console.log("Sort trips by date or name, and combine joined/owned")
      function formatDate(dff) {
        let dd = new Date(dff.seconds * 1000)
        let newFormat =
          dd.getDate() +
          " " +
          dd.toLocaleString("default", {
            month: "long"
          }) +
          " " +
          dd.getFullYear()
        return newFormat
      }
      let hasDates = []
      let noDates = []
      let allTrips = state.trips.concat(state.joinedTrips)
      console.log('j', state.joinedTrips)
      console.log('o', state.trips)
      allTrips.forEach(trip => {
        if (trip.uid === state.currentUser.uid) {
          trip.joined = false
        } else {
          trip.joined = true
          state.thisUserNotifications.forEach(invite => {
            if (invite.tid === trip.id) {
              trip.isDeclined = invite.isDeclined
              trip.isJoined = invite.isJoined
              trip.alertID = invite.id
            }
          })
        }
        if (trip.finalDates) {
          hasDates.push(trip)
        } else {
          noDates.push(trip)
        }
      })
      // formats dates first or else sort is dealing with two formats
      hasDates.forEach(trip => {
        if (trip.dateStart instanceof Object) {
          trip.dateStart = formatDate(trip.dateStart)
          trip.dateEnd = formatDate(trip.dateEnd)
        }
      })
      let sorted = hasDates.sort((a, b) => (new Date(Date.parse(a.dateStart)) > new Date(Date.parse(b.dateStart)) ? 1 : -1))
      let sortedND = noDates.sort((a, b) => (a.name > b.name) ? 1 : -1)
      return sorted.concat(sortedND)
    },
    // TRIP 
    thisTripInviteLogs: state => {
      let tripInviteLogs = [];
      if (!state.thisTripActivityLog || state.thisTripActivityLog.length == 0) {
        console.log('nope')
        return []; // if doc is null give an empty array to iterate
      } else {

        state.thisTripActivityLog.forEach(key => {
          // if (['invite', 'inviteRSVP'].includes(key.category)) {
          let modInvite = key;
          if ("time" in modInvite) {
            let dd = new Date(modInvite.time);
            //am/pm
            let hours = dd.getHours();
            let flipper = " AM";
            if (hours >= 12) {
              hours = hours - 12;
              flipper = " PM";
            }
            if (hours == 0) {
              hours = 12;
            }
            let m = dd.getMinutes();
            m = m < 10 ? "0" + m : m;

            modInvite.time =
              dd.getDate() +
              " " +
              dd.toLocaleString("default", {
                month: "long"
              }) +
              " " +
              dd.getFullYear() +
              " " +
              hours +
              ":" +
              m +
              flipper;
          } else {
            modInvite.time = "TBD";
          }
          tripInviteLogs.push(modInvite);
          // }
        });
        return tripInviteLogs;
      }
    },
    thisTripDatesGetter: state => {
      function formatTime(dd) {
        let newFormat =
          dd.getDate() +
          " " +
          dd.toLocaleString("default", {
            month: "long"
          }) +
          " " +
          dd.getFullYear()
        return newFormat
      }
      state.thisTripDates.forEach(date => {
        if (date.startDate instanceof Object) {
          date.startDate = formatTime(new Date(date.startDate.seconds * 1000))
          date.endDate = formatTime(new Date(date.endDate.seconds * 1000))
        }
      })
      return state.thisTripDates
    },
    //USER
    thisUserInvitesGetter: state => {
      console.log('invites getter')
      let inviteObj = []
      function formatTime(dd) {
        //am/pm
        let hours = dd.getHours();
        let flipper = " AM";
        if (hours >= 12) {
          if (hours > 12) {
            hours = hours - 12;
          }
          flipper = " PM";
        }
        if (hours == 0) {
          hours = 12;
        }
        let m = dd.getMinutes();
        m = m < 10 ? "0" + m : m;

        let newFormat =
          dd.getDate() +
          " " +
          dd.toLocaleString("default", {
            month: "long"
          }) +
          " " +
          dd.getFullYear() +
          " " +
          hours +
          ":" +
          m +
          flipper;
        return newFormat
      }
      if (state.thisUserNotifications.length > 0) {
        state.thisUserNotifications.forEach(doc => {
          if (doc.category === 'Trip Invite') {
            console.log(doc.time)
            // if (doc.time instanceof Object) {
            let dd = formatTime(new Date(doc.time))
            doc.time = dd
            //  }
            inviteObj.push(doc);
          }

        })
      }
      //return batch of objects by category
      return inviteObj
    },

    //GEAR
    thisTripGroupGearCategorized: state => {
      console.log("gear getter")
      let categorizedGear = {}
      state.thisTripGroupGear.forEach(gearObj => {
        // if (!gearObj.category) {
        //   gearObj.category = 'Miscellaneous'
        // }
        if (!gearObj.campers || gearObj.campers.length === 0) {
          gearObj.campers = "TBD"
        }
        if (categorizedGear[gearObj.category] === undefined) {
          categorizedGear[gearObj.category] = [gearObj]
        } else {
          categorizedGear[gearObj.category].push(gearObj)
        }
      })
      console.log(categorizedGear)
      return categorizedGear
    },
    thisTripIndGearCategorized: state => {
      console.log("ind gear getter")
      let categorizedGear = {}
      state.thisTripIndGear.forEach(gearObj => {
        // if (!gearObj.category) {
        //   gearObj.category = 'Miscellaneous'
        // }
        if (categorizedGear[gearObj.category] === undefined) {
          categorizedGear[gearObj.category] = [gearObj]
        } else {
          categorizedGear[gearObj.category].push(gearObj)
        }
      })
      return categorizedGear
    },

    // MEALS
    thisTripGroupMealsOrdered: state => {
      console.log(state.thisTripGroupMeals)
      function formatTime(dd) {
        let newFormat =
          dd.getDate() +
          " " +
          dd.toLocaleString("default", {
            month: "long"
          }) +
          " " +
          dd.getFullYear()
        return newFormat
      }
      let orderedMeals = {}
      state.thisTripGroupMeals.forEach(meal => {

        if (meal.date instanceof Object) {
          meal.date = formatTime(new Date(meal.date.seconds * 1000))
        }
        if (orderedMeals[meal.date] === undefined) {
          orderedMeals[meal.date] = [meal]
        } else {
          orderedMeals[meal.date].push(meal)
        }
      })
      console.log(orderedMeals)
      const keys = Object.keys(orderedMeals)
      for (const i of keys) {
        console.log(i)
        orderedMeals[i] = orderedMeals[i].sort((a, b) => (a.order > b.order) ? 1 : -1)
      }

      return orderedMeals
    },
    thisTripIndMealsOrdered: state => {
      console.log(state.thisTripIndMeals)
      function formatTime(dd) {
        let newFormat =
          dd.getDate() +
          " " +
          dd.toLocaleString("default", {
            month: "long"
          }) +
          " " +
          dd.getFullYear()
        return newFormat
      }
      let orderedMeals = {}
      state.thisTripIndMeals.forEach(meal => {

        if (meal.date instanceof Object) {
          meal.date = formatTime(new Date(meal.date.seconds * 1000))
        }
        if (orderedMeals[meal.date] === undefined) {
          orderedMeals[meal.date] = [meal]
        } else {
          orderedMeals[meal.date].push(meal)
        }
      })
      console.log(orderedMeals)
      const keys = Object.keys(orderedMeals)
      for (const i of keys) {
        console.log(i)
        orderedMeals[i] = orderedMeals[i].sort((a, b) => (a.order > b.order) ? 1 : -1)
      }
      return orderedMeals
    },

    // ITINERARY
    thisTripItineraryGrouped: state => {
      console.log(state.thisTripItinerary)
      function formatTime(dd) {
        let hours = dd.getHours();
        let flipper = " AM";
        if (hours >= 12) {
          hours = hours - 12;
          flipper = " PM";
        }
        if (hours == 0) {
          hours = 12;
        }
        let m = dd.getMinutes();
        m = m < 10 ? "0" + m : m;

        let newFormat =
          hours +
          ":" +
          m +
          flipper
        return newFormat
      }
      function formatDate(dd) {
        let newFormat =
          dd.getDate() +
          " " +
          dd.toLocaleString("default", {
            month: "long"
          }) +
          " " +
          dd.getFullYear()
        return newFormat
      }
      let groupedItinerary = {}
      state.thisTripItinerary.forEach(entry => {
        if (entry.date instanceof Object) {
          entry.dateJS = new Date(entry.date.seconds * 1000)
          entry.time = formatTime(new Date(entry.date.seconds * 1000))
          entry.date = formatDate(new Date(entry.date.seconds * 1000))
        }
        if (groupedItinerary[entry.date] === undefined) {
          groupedItinerary[entry.date] = [entry]
        } else {
          groupedItinerary[entry.date].push(entry)
        }
      })
      console.log(groupedItinerary)
      return groupedItinerary
    }
  },

  mutations: { // CANNOT BE ASYNCHRONOUS USE ACTIONS
    updateErrors: (state, obj) => {
      state.errors = obj.msg;
    },
    blankErrors: state => {
      state.errors = "";
    },
    blankItemInput: state => {
      state.itemInput = "";
    },
    updateItemInputMutation: (state, data) => {
      state.itemInput = data;
    },
    // LOGIN // AUTH STUFF
    setCurrentUser(state, val) {
      console.log("commit current user")
      console.log(val)
      state.currentUser = val
    },
    setUserProfile(state, val) {
      console.log('commit user profile')
      console.log(val)
      state.userProfile = val
    },
    // TRIP DATA
    updateCurrentTrip: function (state, data) {
      console.log('mutation to update the current trip');
      state.thisTrip = data;
      // named route
      //issue if error not caught
    },
    updateThisTripID: function (state, id) {
      console.log('mutation to update the current trip id');
      console.log(id)
      state.thisTripID = id;
    },
    // setTripOwner: function (state, name) {
    //   console.log('mutation to set the trip owner');
    //   state.thisTripOwner = name;
    // },
    ...vuexfireMutations
  },

  actions: {
    logout: function (context) {
      fb.auth
        .signOut()
        .then(() => {
          console.log('then')
          context.dispatch("clearData"); // authStateChange actually can do this?
          router.push("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //Should automatically update prfile changes from action below? or is that a mutation?
    // Issue when registering new user this causes error, no profile yet so... binding at dashboard page now
    // bindProfileRef:
    //   firestoreAction(context => {
    //     console.log('binding the profile object, matters if a profile edit didn"t explcitily update state///')
    //     return context.bindFirestoreRef('userProfile', fb.db.collection('users').doc(context.state.currentUser.uid))
    //   }),
    // update trips BASED ON USER
    bindTrips:
      firestoreAction(context => {
        // i don't know if it respects where clauses?
        return context.bindFirestoreRef('trips', fb.db.collection('trips').where("uid", "==", context.state.currentUser.uid))
        // .orderBy("date")) // date of trip, not when created
        // TODO ERROR: if there's no date orderBy doesn't retrieve it
      }),

    bindJoinedTrips:
      firestoreAction(context => {
        // i don't know if it respects where clauses?
        return context.bindFirestoreRef('joinedTrips', fb.db.collection('trips').where("campers", "array-contains", context.state.currentUser.uid))
        // .orderBy("date")) // date of trip, not when created
        // TODO ERROR: if there's no date orderBy doesn't retrieve it
      }),
    bindATrip:
      firestoreAction(context => {
        // i don't know if it respects where clauses?
        return context.bindFirestoreRef('thisTrip', fb.db.collection('trips').doc(context.state.thisTripID))
      }),
    bindTripDates: firestoreAction(context => {
      // i don't know if it respects where clauses?
      return context.bindFirestoreRef('thisTripDates', fb.db.collection('tripDates').doc(context.state.thisTripID).collection('dates')
        .orderBy('startDate'))
    }),
    bindTripCampers: firestoreAction(context => {
      // will it notice on its own a change in trip id?
      // DOC returns an object, returns null if no data
      return context.bindFirestoreRef('thisTripCampers', fb.db.collection('campers').doc(context.state.thisTripID))
    }),
    bindTripCampersNo: firestoreAction(context => {
      // will it notice on its own a change in trip id?
      return context.bindFirestoreRef('thisTripCampersNo', fb.db.collection('campersNo').doc(context.state.thisTripID))
    }),
    bindTripCampersPending: firestoreAction(context => {
      // will it notice on its own a change in trip id?
      return context.bindFirestoreRef('thisTripCampersPending', fb.db.collection('campersPending').doc(context.state.thisTripID))
    }),
    bindTripActivityLog: firestoreAction(context => {
      // will it notice on its own a change in trip id?
      // COLLECTION returns an array; not null, lenght 0 if no results
      return context.bindFirestoreRef('thisTripActivityLog', fb.db.collection('tripActivityLog').doc(context.state.thisTripID)
        .collection('logs').orderBy("time", "desc").limit(20))
    }),
    bindTripGroupGear: firestoreAction(context => {
      return context.bindFirestoreRef('thisTripGroupGear', fb.db.collection('groupGear').doc(context.state.thisTripID)
        .collection('gear'))
    }),
    bindTripIndGear: firestoreAction(context => {
      return context.bindFirestoreRef('thisTripIndGear', fb.db.collection('individualGear').doc(context.state.currentUser.uid)
        .collection(context.state.thisTripID))
    }),
    bindTripGroupMeals: firestoreAction(context => {
      return context.bindFirestoreRef('thisTripGroupMeals', fb.db.collection('groupMeals').doc(context.state.thisTripID)
        .collection('meal').orderBy('date'))
    }),
    bindTripIndMeals: firestoreAction(context => {
      return context.bindFirestoreRef('thisTripIndMeals', fb.db.collection('individualMeals').doc(context.state.currentUser.uid)
        .collection(context.state.thisTripID).orderBy('date'))
    }),
    bindTripItinerary: firestoreAction(context => {
      return context.bindFirestoreRef('thisTripItinerary', fb.db.collection('itinerary').doc(context.state.thisTrip.id)
        .collection('items').orderBy('date'))
    }),

    bindUserNotifications: firestoreAction(context => {
      return context.bindFirestoreRef('thisUserNotifications', fb.db.collection('userNotifications')
        .doc(context.state.currentUser.uid).collection('notifications').orderBy("time", "desc").limit(20))
    }),

    // TRIPS 
    createTripPageData: ({ dispatch, commit }, tid) => {
      let id = tid
      console.log('Wrapper function to run actions for setting up data for a trip page')
      console.log(tid)
      commit('updateThisTripID', tid)
      dispatch('bindATrip')
        .then((trip) => {
          console.log("the current trip is set", 'owner:', trip.owner, 'trip', id)
          console.log('get the trip owner name, TODO just save the name with the trip')
          // dispatch('queryUsernameAction', trip.uid).then((name) => {
          //   console.log('have owner name promise return')
          //   commit('setTripOwner', trip.owner)
          // })
          let pagePromises = []
          pagePromises.push(dispatch('bindTripActivityLog'))
          pagePromises.push(dispatch('bindTripCampersPending'))
          pagePromises.push(dispatch('bindTripCampersNo'))
          pagePromises.push(dispatch('bindTripCampers'))
          pagePromises.push(dispatch('bindTripDates'))
          pagePromises.push(dispatch('bindTripGroupGear'))
          pagePromises.push(dispatch('bindTripIndGear'))
          pagePromises.push(dispatch('bindTripGroupMeals'))
          pagePromises.push(dispatch('bindTripIndMeals'))
          pagePromises.push(dispatch('bindTripItinerary'))
          Promise.all(pagePromises).then(() => {
            console.log("routing to the trip")
            router.push({ path: '/trip' })
          })
        })
    },

    saveNewTripAction: ({ state }, obj) => {
      console.log('Save new trip action.')

      return new Promise((resolve) => {
        console.log('Save trip doc')
        // trip document
        let thisNewTripPromise;
        if (obj.finalDates === true) {
          thisNewTripPromise = new Promise((resolve) => {
            fb.db.collection("trips").add({
              'name': obj.name, 'uid': state.currentUser.uid, 'owner': state.currentUser.displayName,
              'group': obj.group, 'finalDates': obj.finalDates, 'dateStart': obj.dateStart, 'dateEnd': obj.dateEnd
            }).then((tripSaved) => { resolve(tripSaved) })
          })
        } else {
          thisNewTripPromise = new Promise((resolve) => {
            fb.db.collection("trips").add({
              'name': obj.name, 'uid': state.currentUser.uid, 'owner': state.currentUser.displayName,
              'group': obj.group, 'finalDates': obj.finalDates
            }).then((tripSaved) => { resolve(tripSaved) })
          })
        }

        thisNewTripPromise.then(tripDoc => {
          console.log('Subpromises set({})')
          let subPromises = []
          subPromises.push(fb.db.collection('campersNo').doc(tripDoc.id).set({}))
          subPromises.push(fb.db.collection('campersPending').doc(tripDoc.id).set({}))
          //TODO redirect to new trip page?
          // Since it's a new trip use SET because need to also create the document
          // If use update throws an error, no document to update
          subPromises.push(fb.db.collection('campers').doc(tripDoc.id).set({
            [state.currentUser.uid]: state.currentUser.displayName
          }))
          console.log('end campers sub-promises')
          subPromises.push(fb.db.collection('tripActivityLog').doc(tripDoc.id).set({ 'null': null }))
          console.log('end activiity log sub-promise')
          // MEALS
          // don't load for individual trips
          if (obj.group === true) {
            console.log('adding group tables')
            subPromises.push(fb.db.collection('groupMeals').doc(tripDoc.id).set({}))
            subPromises.push(fb.db.collection('groupGear').doc(tripDoc.id).set({}))
          }
          subPromises.push(fb.db.collection('tripDates').doc(tripDoc.id).set({}))

          // Collect the null promises
          Promise.all(subPromises).then(() => {
            console.log("Next promise 1")
            // Dates         
            fb.db.collection('tripDates').doc(tripDoc.id).collection('dates').add({
              startDate: obj.dateStart,
              endDate: obj.dateEnd,
              user: state.currentUser.displayName,
              votes: { [state.currentUser.displayName]: true }
            }).then(() => {
              console.log("Next promise 2")
              var indPromise
              var indGearPushPromise = []
              // Individual trip
              if (obj.indTemplate === "My List") {
                indPromise = new Promise(resolve => {
                  fb.db.collection('individualGear').doc(state.currentUser.uid).collection('default').get().then((results) => {
                    if (!results.empty) {
                      results.docs.forEach(doc => {
                        indGearPushPromise.push(fb.db.collection('individualGear').doc(state.currentUser.uid).collection(tripDoc.id).add(doc.data()))
                      })
                      Promise.all(indGearPushPromise).then(() => {
                        resolve()
                      })
                    } else {
                      resolve()
                    }
                  })
                })
              } else if (obj.indTemplate === "Generic List") {
                indPromise = new Promise(resolve => {
                  fb.db.collection('defaultList').get().then((results) => {
                    if (!results.empty) {
                      //TODO if results.docs.exists
                      results.docs.forEach(doc => {
                        indGearPushPromise.push(fb.db.collection('individualGear').doc(state.currentUser.uid).collection(tripDoc.id).add(doc.data()))
                      })
                      Promise.all(indGearPushPromise).then(() => {
                        resolve()
                      })
                    } else {
                      resolve()
                    }
                  })
                })
              } else {
                indPromise = new Promise(resolve => { resolve() })
              }
              indPromise.then(() => {
                console.log("Next promise 3")
                var grpPromisePush = []
                // group
                if (obj.group === true) {
                  // fill with a template
                  if (obj.template === "My Group List") {
                    fb.db.collection('individualGear').doc(state.currentUser.uid).collection('myDefaultGroup').get().then((results) => {
                      if (!results.empty) {
                        console.log('results not empty')
                        results.docs.forEach(doc => {
                          grpPromisePush.push(fb.db.collection('groupGear').doc(tripDoc.id).collection('gear').add(doc.data()))
                        })
                        Promise.all(grpPromisePush).then(() => {
                          resolve()
                        })
                      } else {
                        console.log('no user list')
                        resolve()
                      }
                    })
                  } else if (obj.template === "Generic List") {
                    console.log('copy over generic group gear list')
                    fb.db.collection('defaultGroupGear').get().then((results) => {
                      if (!results.empty) {
                        console.log('not empty')
                        //TODO if results.docs.exists
                        results.docs.forEach(doc => {
                          grpPromisePush.push(fb.db.collection('groupGear').doc(tripDoc.id).collection('gear').add(doc.data()))
                        })
                        Promise.all(grpPromisePush).then(() => {
                          resolve()
                        })
                      } else {
                        console.log('no generic group docs')
                        resolve()
                      }
                    })
                  } else {
                    console.log('no group gear template selected')
                    resolve()
                  }

                } else {
                  console.log("Next promise 4")
                  //otherwise no group stuff, resolve
                  resolve()
                }
              })

            })

          })

        })
      })
    },
    deleteTripAction: (context, id) => {
      console.log('TODO delete campers and sub docs etc')
      return new Promise((resolve, reject) => {
        if (id) {
          let mutateTrip = false
          if (id === context.state.thisTrip.id) {
            // mutation update thisTrip
            mutateTrip = true;
          }
          fb.db.collection("trips")
            .doc(id)
            .delete()
            .then(function () {
              console.log("Document successfully deleted");
              //TODO: iff current trip, update and route
              if (mutateTrip === true) {
                // mutation update thisTrip
                context.commit('updateCurrentTrip', {});
                // TODO Reroute to trips page if deleted from a trip view or elsewhere                
              }

              // Delete campers
              let delC = fb.db.collection('campers').doc(id).delete()
              let delCP = fb.db.collection('campersPending').doc(id).delete()
              let delN = fb.db.collection('campersNo').doc(id).delete()

              // Delete dates
              fb.db.collection('tripDates').doc(id).collection('dates').get().then((docs) => {
                if (!docs.empty) {
                  let waitingDates = []
                  docs.forEach(doc => {
                    waitingDates.push(fb.db.collection("tripDates")
                      .doc(id).collection("dates").doc(doc.id)
                      .delete())
                  })
                  Promise.all(waitingDates).then(() => {

                    console.log('still concerned, TODO check logs collection is not orphaned')
                    fb.db.collection('tripDates').doc(id).delete()
                  })
                } else {
                  fb.db.collection('tripDates').doc(id).delete()
                }
              })
              // Delete group gear
              fb.db.collection('groupGear').doc(id).collection('gear').get().then((docs) => {
                if (!docs.empty) {
                  let waitingGear = []
                  docs.forEach(doc => {
                    waitingGear.push(fb.db.collection("groupGear")
                      .doc(id).collection("gear").doc(doc.id)
                      .delete())
                  })
                  Promise.all(waitingGear).then(() => {

                    console.log('still concerned, TODO check logs collection is not orphaned')
                    fb.db.collection('groupGear').doc(id).delete()
                  })
                } else {
                  fb.db.collection('groupGear').doc(id).delete()
                }
              })
              // Delete Ind Gear
              fb.db.collection('individualGear').doc(context.state.currentUser.uid).collection(id).get().then((docs) => {
                if (!docs.empty) {
                  let waitingIGear = []
                  docs.forEach(doc => {
                    waitingIGear.push(fb.db.collection('individualGear').doc(context.state.currentUser.uid).collection(id).doc(doc.id)
                      .delete())
                  })
                  Promise.all(waitingIGear).then(() => {

                    console.log('individual gear all goob?')
                    // fb.db.collection('individualGear').doc(state.currentUser.uid)
                    // fb.db.collection('groupGear').doc(id).delete()
                  })
                } else {
                  console.log('need?')
                  // fb.db.collection('groupGear').doc(id).delete()
                }
              })
              // delete logs
              console.log('TODO redo trip activity log collection deletion, recursive bad? cloud function?')
              fb.db.collection('tripActivityLog').doc(id).collection('logs').get().then((docs) => {
                //todo, what if no logs, empty array? does for eahc throw something?
                let waiting = []
                docs.forEach(doc => {
                  waiting.push(fb.db.collection("tripActivityLog")
                    .doc(id).collection("logs").doc(doc.id)
                    .delete())
                })
                Promise.all(waiting).then(() => {

                  console.log('still concerned, TODO check logs collection is not orphaned')
                  fb.db.collection('tripActivityLog').doc(id).delete()
                })
              })
              // store userid inside notifications so easier to delete...
              console.log("Not great, TODO something better for user notification")
              fb.db.collectionGroup('notifications').where('tid', '==', id).get().then(docs => {
                docs.docs.forEach(doc => {
                  console.log(doc)
                  fb.db.collection('userNotifications').doc(doc.data().to).collection('notifications').doc(doc.id).update({
                    'tripDeleted': true
                  })
                })
              })

              // Delete group meals
              fb.db.collection('groupMeals').doc(id).collection('meal').get().then((docs) => {
                if (!docs.empty) {
                  let waitingGMeals = []
                  docs.forEach(doc => {
                    waitingGMeals.push(fb.db.collection("groupMeals")
                      .doc(id).collection("meal").doc(doc.id)
                      .delete())
                  })
                  Promise.all(waitingGMeals).then(() => {

                    console.log('still concerned, TODO check logs collection is not orphaned')
                    fb.db.collection('groupMeals').doc(id).delete()
                  })
                } else {
                  fb.db.collection('groupMeals').doc(id).delete()
                }
              })
              // Delete ind meals
              fb.db.collection('individualMeals').doc(context.state.currentUser.uid).collection(id).get().then((docs) => {
                if (!docs.empty) {
                  let waitingIMeals = []
                  docs.forEach(doc => {
                    waitingIMeals.push(fb.db.collection('individualMeals').doc(context.state.currentUser.uid).collection(id).doc(doc.id)
                      .delete())
                  })
                  Promise.all(waitingIMeals).then(() => {

                    console.log('individual gear all goob?')
                    // fb.db.collection('individualGear').doc(state.currentUser.uid)
                    // fb.db.collection('groupGear').doc(id).delete()
                  })
                } else {
                  console.log('need?')
                  // fb.db.collection('groupGear').doc(id).delete()
                }
              })

              Promise.all([delC, delCP, delN]).then(() => {
                resolve('Trip deleted')
              }).catch(function (error) {
                console.log(error)
                reject(error.message)
              });
            })
            .catch(function (error) {
              console.log(error)
              reject(error.message)
            });
        } else {
          context.commit('updateErrors', { msg: "Invaid trip ID." });
          resolve("Invalid trip ID.")
        }
      })

    },
    changeTripTypeAction: (context, data) => {
      // TODO: save group pack list in case change back? Or delete stuff?
      return fb.db.collection('trips').doc(data.trip).update({
        group: data.type
      })
    },
    addTripNotification: (context, data) => {
      console.log('add trip n', data)
      // Add an activity log message about the invite
      return fb.db.collection('tripActivityLog').doc(data.tid).collection('logs')
        // ALERT always set-up correct keys for this dispatch
        .add({
          'time': new Date().getTime(),
          'from': data.from,
          'text': data.text,
          'category': data.category
        })
    },

    // CAMPERS
    inviteCamper: ({ state, dispatch }, data) => {
      console.log('invite camper')
      return new Promise((resolve, reject) => {
        let tid = data.tid;
        // get the user from email
        let uidTo = dispatch('searchUsersByEmail', { 'email': data.email })
        uidTo.then(userID => {
          if (!userID) {
            resolve(null)
          } else {
            console.log('id from email: ', userID.id)
            // Make sure not already invited
            // In case of null (e.g. no data) assign empty array or else get the UIDs from keys
            let yesUID, noUID, pUID
            if (!state.thisTripCampers) {
              yesUID = []
            } else {
              yesUID = Object.keys(state.thisTripCampers)
            }
            if (!state.thisTripCampersNo) {
              noUID = []
            } else {
              noUID = Object.keys(state.thisTripCampersNo)
            }
            if (!state.thisTripCampersPending) {
              pUID = []
            } else {
              pUID = Object.keys(state.thisTripCampersPending)
            }
            let allCampers = yesUID.concat(noUID, pUID);
            if (allCampers.includes(userID.id)) {
              resolve('duplicate')
            } else {
              console.log('not invited yet', userID.data())
              // Get name
              let uidToName = userID.data().name;
              // Add an activity log message about the invite
              let addData = {
                'tid': tid,
                'from': state.currentUser.uid,
                'text': state.currentUser.displayName + " invited " + uidToName + " to join the trip",
                'category': "Trip Invite"
              }
              dispatch('addTripNotification', addData)
                .then((res) => {
                  console.log(res) //invite id is here res.id
                  // Add to pending campers
                  fb.db.collection('campersPending').doc(tid).update({ [userID.id]: uidToName })
                    .then(() => {
                      // Add notification to user dashboard
                      fb.db.collection('userNotifications').doc(userID.id).collection('notifications').add({
                        'category': 'Trip Invite',
                        'tid': tid,
                        'time': new Date().getTime(),
                        'text': state.currentUser.displayName + " invited you to join " + state.thisTrip.name,
                        'isJoined': false,
                        'isDeclined': false,
                        'from': state.currentUser.uid,
                        'to': userID.id
                      })
                      resolve('invited')
                    })
                    .catch(error => {
                      console.log('error in adding pending camper')
                      reject(error.message)
                    })
                })
                .catch(error => {
                  console.log('error in writing activity log')
                  reject(error.message)
                })
            }
          }
        })
          .catch(e => {
            console.log('error in email search')
            reject(e.message)
          })
      })
    },
    removeCamperAction: ({ state, dispatch }, data) => {
      // Check which table to delete from
      // Add trip activity log
      console.log('remove camper action')
      let prom = []
      return new Promise((resolve, reject) => {
        // remove at camper table
        prom.push(fb.db.collection(data.camperTable).doc(state.thisTripID).update({
          [data.cid]: firebase.firestore.FieldValue.delete()
        }))
        if (data.camperTable === 'campers') {
          // delete fromt trip array
          prom.push(fb.db.collection('trips').doc(state.thisTripID).update({
            campers: firebase.firestore.FieldValue.arrayRemove(data.cid)
          }))
        }
        // Add an activity log message about the removal
        let rmData = {
          'tid': state.thisTrip.id,
          'from': state.currentUser.uid,
          'text': state.currentUser.displayName + " removed " + data.name + " from the trip",
          'category': "Trip Invite"
        }
        prom.push(dispatch('addTripNotification', rmData))

        // Remove their dashboard notification so can't rejoin etc?
        // Add notification to user dashboard
        fb.db.collection('userNotifications').doc(data.cid).collection('notifications').where("tid", "==", state.thisTripID).get()
          .then((docs) => {
            if (docs.empty) { console.log("not possible?") } else {
              // DOCS>DOCS funny reminder... get the data to loop
              docs.docs.forEach(doc => {
                console.log('delete', doc)
                prom.push(fb.db.collection('userNotifications').doc(data.cid).collection('notifications').doc(doc.id).delete())
              })
              Promise.all(prom).then((huh) => {
                console.log('huh', huh)
                resolve('removed')
              }).catch(error => {
                console.log(error.message)
                reject(error)
              })
            }
          })

      })

    },
    joinTripAction: ({ state, dispatch }, data) => {
      console.log(data)
      //  deal with scenario of alreayd declined, now joining
      // TODO deal with if the camper has since been removed from the trip, aka deadline
      return new Promise((resolve, reject) => {
        //IFF trip previously declined, remove from 'no'; IFF first response, remove from 'pending'
        let a
        if (data.isDeclined == true) {
          // Remove from Declined campers
          a = fb.db.collection('campersNo').doc(data.tid).update({
            [state.currentUser.uid]: firebase.firestore.FieldValue.delete()
          })
        } else {
          // Remove from Pending campers
          a = fb.db.collection('campersPending').doc(data.tid).update({
            [state.currentUser.uid]: firebase.firestore.FieldValue.delete()
          })
        }

        // set versus add --> set requires ID to be specified, add() auto-generates
        // BUT both are for entire documents not just fields in documents ==  update()
        // Add to campers
        let b = fb.db.collection('campers').doc(data.tid).update({
          [state.currentUser.uid]: state.currentUser.displayName
          // TODO have two tabs open and test auto-update on trip page
        })

        // add to trip campers array
        let c = fb.db.collection('trips').doc(data.tid).update({
          campers: firebase.firestore.FieldValue.arrayUnion(state.currentUser.uid)
        })

        // Add an activity log message about the invite
        let jData = {
          'tid': data.tid,
          'from': state.currentUser.uid,
          'text': state.currentUser.displayName + " accepted trip invite.",
          'category': "Trip Invite"
        }
        let d = dispatch('addTripNotification', jData)
        // update user notification response
        let e = fb.db.collection('userNotifications').doc(state.currentUser.uid).collection('notifications')
          .doc(data.nid).update({
            'isJoined': true,
            'isDeclined': false
          })

        Promise.all([a, b, c, d, e]).then(() => {
          resolve('joined')
        }).catch(error => {
          reject(error.message)
        })

      })
    },
    declineTripAction: ({ state, dispatch }, data) => {
      return new Promise((resolve, reject) => {
console.log(data)
        // update user notification response
        let d = fb.db.collection('userNotifications').doc(state.currentUser.uid).collection('notifications')
          .doc(data.nid).update({
            'isDeclined': true,
            'isJoined': false
          })
        //IFF trip previously joined, remove from 'yes'; IFF first response, remove from 'pending'
        let c, e
        if (data.isJoined == true) {
          // Remove from Yes campers
          c = fb.db.collection('campers').doc(data.tid).update({
            [state.currentUser.uid]: firebase.firestore.FieldValue.delete()
          })
          //TODO remove from trips campers array
          e = fb.db.collection('trips').doc(data.tid).update({
            campers: firebase.firestore.FieldValue.arrayRemove(state.currentUser.uid)
          })
        } else {
          // Remove from Pending campers
          c = fb.db.collection('campersPending').doc(data.tid).update({
            [state.currentUser.uid]: firebase.firestore.FieldValue.delete()
          })
          e = () => {
            resolve()
          }
        }

        // set versus add --> set requires ID to be specified, add() auto-generates
        let b = fb.db.collection('campersNo').doc(data.tid).update({
          [state.currentUser.uid]: state.currentUser.displayName
          // TODO have two tabs open and test auto-update on trip page
        })
        // Add an activity log message about the invite
        let dData = {
          'tid': data.tid,
          'from': state.currentUser.uid,
          'text': state.currentUser.displayName + " declined trip invite.",
          'category': "Trip Invite"
        }
        let a = dispatch('addTripNotification', dData)
        Promise.all([a, b, c, d, e]).then(() => {
          resolve('declined')
        }).catch(e => {
          reject(e.message)
        })

      })
    },
    sendCampersNotification: (context, data) => {
      console.log('campers notification sending')
      return new Promise(resolve => {
        // Get all the Yes campers and give them notification
        fb.db.collection('campers').doc(data.tid).get().then(cc => {
          console.log('3', cc.data())
          let users = Object.keys(cc.data())
          // Remove creator from notifications list
          users.splice(users.indexOf(data.cuid), 1)
          console.log(users)
          let subprom = []
          users.forEach(c => {
            // Save notification for dashboard
            subprom.push(fb.db.collection('userNotifications').doc(c).collection('notifications').add({
              'category': data.category,
              'tid': data.tid,
              'time': new Date().getTime(),
              'text': data.text,
              'from': data.creator,
              'to': c
            }))
          })
          Promise.all(subprom).then(() => {
            resolve()
          })
        })
      })
    },
    searchUsersByEmail: (context, data) => {
      let email = data.email;
      console.log('searching users', email)
      // in order to: add as friend, invite to trip
      return new Promise((resolve, reject) => {
        console.log('promise search')
        fb.db.collection('users').where("email", "==", email).get()
          .then((user) => {
            // todo is this an array from where query?
            console.log('user search results', user)
            if (!user.empty & user.docs.length === 1) {
              resolve(user.docs[0])
            } else {
              resolve(null)
            }
          })
          .catch(error => {
            console.log(error.message)
            reject(error.message)
          })
      })

    },

    // DATES
    newTripDate: ({ state, dispatch }, obj) => {
      console.log('dates')
      return new Promise(resolve => {
        console.log('1')
        fb.db.collection('tripDates').doc(obj.tid).collection('dates').add({
          startDate: obj.dateStart,
          endDate: obj.dateEnd,
          user: state.currentUser.displayName,
          votes: { [state.currentUser.displayName]: true }
        }).then(() => {
          console.log('2')
          let nextData = {
            'tid': obj.tid,
            'from': obj.uid,
            'category': 'Trip Dates',
            'text': obj.creator + " added new dates: " + obj.dateStart.getDate() + ' ' + obj.dateStart.toLocaleString("default", {
              month: "long"
            }) + ' ' + obj.dateStart.getFullYear()
              + ' - ' + obj.dateEnd.getDate() + ' ' + obj.dateEnd.toLocaleString("default", {
                month: "long"
              }) + ' ' + obj.dateEnd.getFullYear()
          }
          console.log(nextData)
          dispatch('addTripNotification', nextData).then(() => {
            console.log('4')
            resolve()
          })
        })
      })
    },
    tripDatesVote: ({ state }, data) => {
      var tmp = 'votes.' + state.currentUser.displayName
      return fb.db.collection('tripDates').doc(data.tid).collection('dates').doc(data.dateID).update({
        [tmp]: data.vote
      })
    },
    tripDatesDeleteAction: ({ dispatch }, data) => {
      return new Promise(resolve => {
        fb.db.collection('tripDates').doc(data.tid).collection('dates').doc(data.id).delete()
          .then(() => {
            console.log('2')
            let nextData = {
              'tid': data.tid,
              'from': data.uid,
              'text': data.creator + " deleted dates: " + data.start + " - " + data.end, // TODO: ... the actual dates haha
              'category': 'Trip Dates'
            }
            console.log(nextData)
            dispatch('addTripNotification', nextData).then(() => {
              console.log('4')
              resolve()
            })
          })
      })
    },
    finalizeTripDatesAction: ({ dispatch }, data) => {
      return new Promise(resolve => {
        fb.db.collection("trips").doc(data.tid).update({
          finalDates: data.final,
          dateStart: data.start,
          dateEnd: data.end
        }).then(() => {
          console.log('2')
          let nextData = {
            'tid': data.tid,
            'from': data.uid,
            'text': data.creator + " finalized dates for " + data.name,
            'category': 'tripDates'
          }
          console.log(nextData)
          dispatch('addTripNotification', nextData).then(() => {
            console.log('4')
            resolve()
          })
        })
      })
      // record notification
    },
    unfinalizeTripDatesAction: (context, data) => {
      return fb.db.collection("trips").doc(data.tid).update({
        finalDates: false,
        dateStart: firebase.firestore.FieldValue.delete(),
        dateEnd: firebase.firestore.FieldValue.delete()
      })
    },

    // PACKING LIST MANIPULATION // GEAR
    updateGearAction: ({ state }, data) => {
      console.log("action to update a group gear item")
      if (!data.category) {
        data.category = 'Miscellaneous'
      }
      if (data.page === 'group') {
        return fb.db.collection('groupGear').doc(state.thisTripID).collection('gear').doc(data.gid).update({
          title: data.title,
          category: data.category
        })
      } else {
        return fb.db.collection('individualGear').doc(state.currentUser.uid).collection(state.thisTripID).doc(data.gid).update({
          title: data.title,
          category: data.category
        })
      }
    },
    updateGroupGearCampersAction: ({ state }, data) => {
      // TODO: don't add a anme twice
      console.log("action to change a group gear item contributor")
      let pr = []
      if (data.camperAdd) {
        console.log('Adding a camper', data)
        pr.push(fb.db.collection('groupGear').doc(state.thisTripID).collection('gear').doc(data.gid).update({
          campers: firebase.firestore.FieldValue.arrayUnion(data.camperAdd)
        }))
      }
      if (data.camperRemove) {
        console.log('Removing a camper')
        pr.push(fb.db.collection('groupGear').doc(state.thisTripID).collection('gear').doc(data.gid).update({
          campers: firebase.firestore.FieldValue.arrayRemove(data.camperRemove)
        }))
      }
      Promise.all(pr).then(() => {
        return "Updated contributors"
      }).catch(e => {
        return e
      })
    },
    addGearItemAction: ({ state }, data) => {
      console.log("Action add: ", data)
      console.log(!data.category)
      if (!data.category) {
        console.log('No category')
        data.category = 'Miscellaneous'
      }
      if (data.page === 'group') {
        return fb.db.collection("groupGear").doc(state.thisTripID).collection('gear')
          .add({
            title: data.title,
            // created_at: Date.now(),
            checked: false,
            category: data.category,
            campers: []
          })
      } else {
        return fb.db.collection("individualGear").doc(state.currentUser.uid).collection(state.thisTripID)
          .add({
            title: data.title,
            // created_at: Date.now(),
            checked: false,
            category: data.category
          })
      }

    },
    deleteGearItemAction: ({ state }, data) => {
      if (data.page === 'group') {
        return fb.db.collection("groupGear")
          .doc(data.tid).collection('gear').doc(data.id)
          .delete()
      } else {
        return fb.db.collection("individualGear").doc(state.currentUser.uid)
          .collection(data.tid).doc(data.id)
          .delete()
      }

    },
    updateStatusAction: ({ state }, data) => {
      if (data.page === 'group') {
        return fb.db.collection("groupGear").doc(state.thisTripID).collection('gear').doc(data.id)
          .update({
            checked: data.status
          })
      } else {
        return fb.db.collection("individualGear").doc(state.currentUser.uid).collection(state.thisTripID).doc(data.id)
          .update({
            checked: data.status
          })
      }
    },
    // Edit Default Gear Lists
    editListGearItemAction: (context, data) => {
      // for not using to input data to the main defualt list
      console.log("Action add: " + data.title)
      if (!data.category) {
        data.category = "Miscellaneous"
      }
      return fb.db.collection("defaultList").add({
        title: data.title,
        checked: false,
        category: data.category
      })
    },
    updateGearCategory: ({ state }, data) => {
      console.log(data)
      if (data.category === undefined) {
        console.log("ERROR: can't have an undefined category, no way to edit it because firestore cannot search for nonexistent fields.")
      }
      return new Promise((resolve) => {
        // if group
        if (data.page === 'group') {
          // TODO - timiing issue, too many updates in a row? How pause the getter?? 
          let promises = []
          fb.db.collection('groupGear').doc(state.thisTripID).collection('gear').where('category', '==', data.category)
            .get().then(docs => {
              if (!docs.empty) {
                docs.forEach(doc => {
                  promises.push(fb.db.collection('groupGear').doc(state.thisTripID).collection('gear').doc(doc.id).update({
                    category: data.newCategory
                  }))
                })
                Promise.all(promises).then(() => {
                  resolve('Updated category!')
                })
              } else {
                resolve('No category items returned.')
              }
            })
        } else {
          // if individual

          fb.db.collection('individualGear').doc(state.currentUser.uid).collection(state.thisTripID).where('category', '==', data.category)
            .get().then(docs => {
              if (!docs.empty) {
                let promises = []
                docs.forEach(doc => {
                  promises.push(fb.db.collection('individualGear').doc(state.currentUser.uid).collection(state.thisTripID).doc(doc.id).update({
                    category: data.newCategory
                  }))
                })
                Promise.all(promises).then(() => {
                  resolve('Updated category!')
                })
              } else {
                console.log('No category items returned.')
                resolve('No category items returned.')
              }
            })
        }
      })
    },
    deleteGearCategory: ({ state }, data) => {
      console.log(data)
      return new Promise((resolve) => {
        // if group
        if (data.page === 'group') {
          // TODO - timiing issue, too many updates in a row? How pause the getter?? 
          let promises = []
          fb.db.collection('groupGear').doc(state.thisTripID).collection('gear').where('category', '==', data.category)
            .get().then(docs => {
              if (!docs.empty) {
                docs.forEach(doc => {
                  promises.push(fb.db.collection('groupGear').doc(state.thisTripID).collection('gear').doc(doc.id).delete())
                })
                Promise.all(promises).then(() => {
                  resolve('Deleted category!')
                })
              } else {
                resolve('No items in this category.')
              }
            })
        } else {
          // if individual
          fb.db.collection('individualGear').doc(state.currentUser.uid).collection(state.thisTripID).where('category', '==', data.category)
            .get().then(docs => {
              if (!docs.empty) {
                let promises = []
                docs.forEach(doc => {
                  promises.push(fb.db.collection('individualGear').doc(state.currentUser.uid).collection(state.thisTripID)
                    .doc(doc.id).delete())
                })
                Promise.all(promises).then(() => {
                  resolve('Deleted category!')
                })
              } else {
                console.log('No category items returned.')
                resolve('No items in this category.')
              }
            })

        }
      })
    },

    // MEALS //
    newTripMealDate: ({ state }, data) => {
      console.log("Action add: " + data.type)
      var o;
      switch (data.type) {
        case ('Breakfast'):
          o = 1;
          break
        case ("Lunch"):
          o = 2;
          break
        case ("Dinner"):
          o = 3;
          break
        case ("Snacks"):
          o = 4;
          break
      }
      if (data.page === 'group') {
        return fb.db.collection("groupMeals").doc(data.tid).collection('meal')
          .add({
            items: data.items,
            date: data.date,
            order: o,
            mealType: data.type
          })
      } else {
        return fb.db.collection("individualMeals").doc(state.currentUser.uid).collection(data.tid)
          .add({
            items: data.items,
            date: data.date,
            order: o,
            mealType: data.type
          })
      }

    },
    deleteMealDateAction: ({ state }, data) => {
      console.log(data)
      if (data.page === 'group') {
        let gProm = []
        return new Promise((resolve, reject) => {
          if (data.ids.length > 0) {
            data.ids.forEach(doc => {
              gProm.push(fb.db.collection("groupMeals").doc(data.tid).collection('meal').doc(doc).delete())
            })
            Promise.all(gProm).then(() => {
              resolve()
            })
          } else {
            console.log('impossible, dates come from meals')
            reject({ message: "No date to delete." })
          }
        })
      } else {
        let iProm = []
        return new Promise((resolve, reject) => {
          if (data.ids.length > 0) {
            data.ids.forEach(doc => {
              iProm.push(fb.db.collection("individualMeals").doc(state.currentUser.uid).collection(data.tid).doc(doc).delete())
            })
            Promise.all(iProm).then(() => {
              resolve()
            })
          } else {
            console.log('impossible, dates come from meals')
            reject({ message: "No date to delete." })
          }
        })
      }
    },
    editMealDateAction: ({ state }, data) => {
      console.log(data)
      if (data.page === 'group') {
        let gProm = []
        return new Promise((resolve, reject) => {
          if (data.ids.length > 0) {
            data.ids.forEach(doc => {
              gProm.push(fb.db.collection("groupMeals").doc(data.tid).collection('meal').doc(doc).update({
                date: data.newDate
              }))
            })
            Promise.all(gProm).then(() => {
              resolve()
            })
          } else {
            console.log('impossible, dates come from meals')
            reject({ message: "No date to edit." })
          }
        })
      } else {
        let iProm = []
        return new Promise((resolve, reject) => {
          if (data.ids.length > 0) {
            data.ids.forEach(doc => {
              iProm.push(fb.db.collection("individualMeals").doc(state.currentUser.uid).collection(data.tid).doc(doc).update({
                date: data.newDate
              }))
            })
            Promise.all(iProm).then(() => {
              resolve()
            })
          } else {
            console.log('impossible, dates come from meals')
            reject({ message: "No date to edit." })
          }
        })
      }
    },
    updateTripMeal: ({ state }, data) => {
      console.log(data)
      var o;
      switch (data.type) {
        case ('Breakfast'):
          o = 1;
          break
        case ("Lunch"):
          o = 2;
          break
        case ("Dinner"):
          o = 3;
          break
        case ("Snacks"):
          o = 4;
          break
      }
      if (data.page === 'group') {
        return fb.db.collection("groupMeals").doc(data.tid).collection('meal').doc(data.id).update({
          items: data.items,
          date: data.newDate,
          mealType: data.type,
          order: o
        })
      } else {
        return fb.db.collection("individualMeals").doc(state.currentUser.uid).collection(data.tid).doc(data.id).update({
          items: data.items,
          date: data.newDate,
          mealType: data.type,
          order: o
        })
      }
    },
    deleteMealAction: ({ state }, data) => {
      console.log(data)
      if (data.page === 'group') {
        return fb.db.collection("groupMeals").doc(data.tid).collection('meal').doc(data.id).delete()
      } else {
        return fb.db.collection("individualMeals").doc(state.currentUser.uid).collection(data.tid).doc(data.id).delete()
      }
    },

    // ITINERARY //
    editItinDateAction: (context, data) => {
      console.log(data)
      let gProm = []
      let ids = Object.keys(data.ids) // mapped doc ids 
      let nd = data.newDate
      return new Promise((resolve, reject) => {
        if (ids.length > 0) {
          ids.forEach(doc => {
            // parse the old time from string to re-save with new date
            let hour = parseInt(data.ids[doc].split(':')[0])
            let min = parseInt(data.ids[doc].split(':')[1].split(' ')[0])
            let tock = data.ids[doc].split(':')[1].split(' ')[1]
            if (hour != 12 && tock === 'PM') {
              hour = hour + 12
            }
            if (hour == 12 && tock == "AM") {
              hour = 0
            }
            let newTime = new Date(nd.getFullYear(), nd.getMonth(), nd.getDate(), hour, min)
            console.log('new t', newTime)
            gProm.push(fb.db.collection("itinerary").doc(data.tid).collection('items').doc(doc).update({
              date: newTime
            }))
          })
          Promise.all(gProm).then(() => {
            resolve()
          })
        } else {
          console.log('impossible, dates come from meals')
          reject({ message: "No date to edit." })
        }
      })
    },
    deleteItinDayAction: (context, data) => {
      console.log(data)
      let gProm = []
      return new Promise((resolve, reject) => {
        if (data.ids.length > 0) {
          data.ids.forEach(doc => {
            gProm.push(fb.db.collection("itinerary").doc(data.tid).collection('items').doc(doc).delete())
          })
          Promise.all(gProm).then(() => {
            resolve()
          })
        } else {
          console.log('impossible, dates come from meals')
          reject({ message: "No date to delete." })
        }
      })
    },
    addItinEntry: (context, data) => {
      console.log("Action add: ", data)
      return fb.db.collection("itinerary").doc(data.tid).collection('items')
        .add({
          entry: data.items,
          date: data.date,
        })
    },
    deleteItinEntryAction: (context, data) => {
      console.log(data)
      return fb.db.collection("itinerary").doc(data.tid).collection('items').doc(data.id).delete()
    },
    updateItinEntryAction: (context, data) => {
      return fb.db.collection("itinerary").doc(data.tid).collection('items').doc(data.id).update({
        entry: data.items,
        date: data.newDate
      })
    },

    // LOGGING IN // AUTH STUFF //
    fetchUserProfile({ commit, state }) {
      console.log('handle empty profiles more elegantly...')
      console.log('dispatch user profile get, TODO ONLY RUN when need it, not on auth state change...? maybe null it on auth change');
      console.log(state.currentUser.uid)
      fb.db.collection('users').doc(state.currentUser.uid).get().then(res => {
        console.log('user profile exists? ', res.exists)
        if (res.exists) {
          console.log('got the profile')
          commit('setUserProfile', res.data())
        } else {
          console.log('no usch profile, just registered? need to reoslve promises...')
          commit('setUserProfile', { 'name': '' })
        }

      }).catch(err => {
        console.log(err)
      })
    },
    clearData({ commit }) {
      commit('setCurrentUser', null);
      commit('setUserProfile', {});
    },
    updateProfile(context, data) {
      let name = data.name

      fb.db.collection('users').doc(context.state.currentUser.uid).update({ name })
        // .then(user => {
        // // update all posts by user to reflect new name
        // fb.postsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
        //     docs.forEach(doc => {
        //         fb.postsCollection.doc(doc.id).update({
        //             userName: name
        //         })
        //     })
        // })
        // // update all comments by user to reflect new name
        // fb.commentsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
        //     docs.forEach(doc => {
        //         fb.commentsCollection.doc(doc.id).update({
        //             userName: name
        //         })
        //     })
        // })
        // })
        .catch(err => {
          console.log(err)
        })
    }
    // setItems: context => {
    //   context.commit('setItems')
    // }
  }
})
console.log('index.js end')