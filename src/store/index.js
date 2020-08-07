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

    // CAMPERS DOCS DATA BINDS
    thisTripCampers: {},
    thisTripCampersNo: {},
    thisTripCampersPending: {},
    // thisTripInvites: [],

    //TRIP LOGS
    thisTripActivityLog: [],

    // USER DATA BINDS
    currentUser: null,
    userProfile: {},
    thisUserNotifications: []
  },
  getters: {
    // TRIP 
    thisTripInviteLogs: state => {
      let tripInviteLogs = [];
      if (!state.thisTripActivityLog || state.thisTripActivityLog.length == 0) {
        console.log('nope')
        return []; // if doc is null give an empty array to iterate
      } else {

        state.thisTripActivityLog.forEach(key => {
          if (['invite', 'inviteRSVP'].includes(key.category)) {
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
          }
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
        if(date.startDate instanceof Object) {
          date.startDate = formatTime(new Date(date.startDate.seconds*1000))
        date.endDate = formatTime(new Date(date.endDate.seconds*1000))  
        }             
      })
      return state.thisTripDates
    },
    //USER
    thisUserNotificationsGetter: state => {
      let responsesObj = []
      let inviteObj = []

      if (state.thisUserNotifications.length > 0) {
        state.thisUserNotifications.forEach(doc => {
          // console.log('is this a data situation?', doc)
          // No it's basically already doc.data() but it has ID too
          let modInvite = doc;
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
            modInvite.time = "";
          }

          // Trip Invitations Category
          switch (doc.category) {
            case "tripInvite":
              inviteObj.push(modInvite);
              break
            default:
              responsesObj.push(modInvite)
          }
        })
      }
      //return batch of objects by category
      return {
        'tripInvites': inviteObj,
        'tripResponses': responsesObj
      }
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
      bindTripDates:   firestoreAction(context => {
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
    bindUserNotifications: firestoreAction(context => {
      return context.bindFirestoreRef('thisUserNotifications', fb.db.collection('userNotifications')
        .doc(context.state.currentUser.uid).collection('notifications').orderBy("time", "desc").limit(20))
    }),
    // queryUsernameAction: (context, uid) => {
    //   console.log('easier to query auth.users? maybe harder')
    //   console.log('query a username from uid', uid)
    //   return new Promise((resolve, reject) => {
    //     fb.db.collection("users").doc(uid).get()
    //       .then(doc => {
    //         console.log('have the username doc for ', uid)
    //         if (doc.exists) {
    //           console.log(uid, ' name is ', doc.data().name)
    //           resolve(doc.data().name);
    //         } else {
    //           console.log('error, username does not exist docs not updated with changes')
    //           reject(new Error("Username doesn't exist! Uh oh. Check tables are updated."));
    //         }
    //       })
    //   })
    // },
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
          Promise.all(pagePromises).then(() => {
            console.log("routing to the trip")
          router.push({ path: '/trip' })
          })
        })
    },

    saveNewTripAction: ({ state }, obj) => {
      console.log('Save new trip action.')
      var subPromises = []
      return new Promise((resolve) => {
        console.log('New promise')
        // trip document
        fb.db.collection("trips").add({ 'name': obj.name, 'uid': state.currentUser.uid, 'owner': state.currentUser.displayName,
      'group': obj.group })
          .then(tripDoc => {
            console.log('Saved trip document')
            subPromises.push(fb.db.collection('campersNo').doc(tripDoc.id).set({}))
            subPromises.push(fb.db.collection('campersPending').doc(tripDoc.id).set({}))
            //TODO redirect to new trip page?
            // Since it's a new trip use SET because need to also create the document
            // If use update throws an error, no document to update
            subPromises.push(fb.db.collection('campers').doc(tripDoc.id).set({
              [state.currentUser.uid]: state.currentUser.displayName
            }))
            console.log('end campers sub-promises')
            subPromises.push( fb.db.collection('tripActivityLog').doc(tripDoc.id).set({ 'null': null }))
            console.log('end activiity log sub-promise')

            // Dates
            fb.db.collection('tripDates').doc(tripDoc.id).set({}).then(() => {
              console.log('created empty dates doc')
              console.log(obj.dateStart)
              console.log(typeof obj.dateStart)
              subPromises.push(fb.db.collection('tripDates').doc(tripDoc.id).collection('dates').add({
                startDate: obj.dateStart,
                endDate: obj.dateEnd,
                flexible: obj.flexible,
                user: state.currentUser.displayName,
                votes: {[state.currentUser.displayName]: true}
              }))
              console.log('pushed date subpromise')
            })
        
              console.log('run individual gear for group or ind trip now')
              // Individual trip
              if (obj.indTemplate === "My List") {
                console.log('copy over users default ind list')
                fb.db.collection('individualGear').doc(state.currentUser.uid).collection('default').get().then((results) => {
                  if (!results.empty) {
                    console.log('ind not empty')
                    results.docs.forEach(doc => {
                      subPromises.push(fb.db.collection('individualGear').doc(state.currentUser.uid).collection(tripDoc.id).add(doc.data()))
                      
                    })
                  } else {
                    console.log('no ind docs')
                   
                  }
                })
              } else if (obj.indTemplate === "Generic List") {
                console.log('copy generic ind list')
                fb.db.collection('defaultList').get().then((results) => {
                  if (!results.empty) {
                    console.log('generic ind nto empty')
                    //TODO if results.docs.exists
                   subPromises.push(results.docs.forEach(doc => {
                    fb.db.collection('individualGear').doc(state.currentUser.uid).collection(tripDoc.id).add(doc.data())
                    }))
                   
                  } else {
                    console.log('no generic ind docs')
                    
                  }
                })
              } else {
                console.log('no ind template selected')                
              }
            // group
            if (obj.group) {
              console.log('Group data')
              // set empty group gear so collection isn't a ghost
              fb.db.collection('groupGear').doc(tripDoc.id).set({}).then(() => {
                console.log('set empty group gear doc')
                // fill with a template
                if (obj.template === "My Group List") {
                  console.log('copy over users default group list')
                  fb.db.collection('individualGear').doc(state.currentUser.uid).collection('myDefaultGroup').get().then((results) => {
                    if (!results.empty) {
                      console.log('results not empty')
                      results.docs.forEach(doc => {
                        console.log('push doc promise')
                        subPromises.push(fb.db.collection('groupGear').doc(tripDoc.id).collection('gear').add(doc.data()))
                      })
                      Promise.all(subPromises).then(() => {
                        console.log('promises resolved')
                        resolve('Saved trip!')
                      })
                    } else {
                      console.log('no user list')
                      Promise.all(subPromises).then(() => {
                        console.log('promises resolved')
                        resolve('Saved trip!')
                      })
                    }
                  })
                } else if (obj.template === "Generic List") {
                  console.log('copy over generic group gear list')
                  fb.db.collection('defaultGroupGear').get().then((results) => {
                    if (!results.empty) {
                      console.log('not empty')
                      //TODO if results.docs.exists
                     subPromises.push(results.docs.forEach(doc => {
                        fb.db.collection('groupGear').doc(tripDoc.id).collection('gear').add(doc.data())
                      }))
                      Promise.all(subPromises).then(() => {
                        console.log('promises resolved')
                        resolve('Saved trip!')
                      })
                    } else {
                      console.log('no generic group docs')
                      Promise.all(subPromises).then(() => {
                        console.log('promises resolved')
                        resolve('Saved trip!')
                      })
                    }
                  })
                } else {
                  console.log('no group gear template selected')
                  Promise.all(subPromises).then(() => {
                    console.log('promises resolved')
                    resolve('Saved trip!')
                  })
                }
              })
            } 
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
                if(!docs.empty) {
                  let waitingDates = []
                  docs.forEach(doc => {
                    waitingDates.push(fb.db.collection("tripDates")
                      .doc(id).collection("dates").doc(doc.id)
                      .delete())
                  })
                  Promise.all(waitingDates).then(() => {
                    // fb.db.collection('tripActivityLog').doc(id).collection('logs').delete() NOT A FUNCTION/not necessary
                    console.log('still concerned, TODO check logs collection is not orphaned')
                    fb.db.collection('tripDates').doc(id).delete()
                  })
                } else {
                  fb.db.collection('tripDates').doc(id).delete()
                }               
              })
              // Delete group gear
              fb.db.collection('groupGear').doc(id).collection('gear').get().then((docs) => {
                if(!docs.empty) {
                  let waitingGear = []
                  docs.forEach(doc => {
                    waitingGear.push(fb.db.collection("groupGear")
                      .doc(id).collection("gear").doc(doc.id)
                      .delete())
                  })
                  Promise.all(waitingGear).then(() => {
                    // fb.db.collection('tripActivityLog').doc(id).collection('logs').delete() NOT A FUNCTION/not necessary
                    console.log('still concerned, TODO check logs collection is not orphaned')
                    fb.db.collection('groupGear').doc(id).delete()
                  })
                } else {
                  fb.db.collection('groupGear').doc(id).delete()
                }                
              })
              // Delete Ind Gear
              fb.db.collection('individualGear').doc(context.state.currentUser.uid).collection(id).get().then((docs) => {
                if(!docs.empty) {
                  let waitingIGear = []
                  docs.forEach(doc => {
                    waitingIGear.push(fb.db.collection('individualGear').doc(context.state.currentUser.uid).collection(id).doc(doc.id)
                      .delete())
                  })
                  Promise.all(waitingIGear).then(() => {
                    // fb.db.collection('tripActivityLog').doc(id).collection('logs').delete() NOT A FUNCTION/not necessary
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
                  // fb.db.collection('tripActivityLog').doc(id).collection('logs').delete() NOT A FUNCTION/not necessary
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
              console.log('not invited yet')
              // Get name
              let uidToName = userID.data().name;
              // Add an activity log message about the invite
              fb.db.collection('tripActivityLog').doc(tid).collection('logs')
                .add({
                  'time': new Date().getTime(), 'from': state.currentUser.uid,
                  'text': state.currentUser.displayName + " invited " + uidToName + " to join the trip",
                  'category': "invite"
                })
                .then((res) => {
                  console.log(res) //invite id is here res.id
                  // Add to pending campers
                  fb.db.collection('campersPending').doc(tid).update({ [userID.id]: uidToName })
                    .then(() => {
                      // Add notification to user dashboard
                      fb.db.collection('userNotifications').doc(userID.id).collection('notifications').add({
                        'category': 'tripInvite',
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
    removeCamperAction: ({ state }, data) => {
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
        prom.push(fb.db.collection('tripActivityLog').doc(state.thisTripID).collection('logs')
          .add({
            'time': new Date().getTime(), 'from': state.currentUser.uid,
            'text': state.currentUser.displayName + " removed " + data.name + " from the trip",
            'category': "invite"
          }))

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
    joinTripAction: ({ state }, data) => {
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
        let d = fb.db.collection('tripActivityLog').doc(data.tid).collection('logs')
          .add({
            'time': new Date().getTime(), 'from': state.currentUser.uid,
            'text': state.currentUser.displayName + " accepted trip invite.",
            'category': "inviteRSVP"
          })
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
    declineTripAction: ({ state }, data) => {
      return new Promise((resolve, reject) => {

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
        let a = fb.db.collection('tripActivityLog').doc(data.tid).collection('logs')
          .add({
            'time': new Date().getTime(), 'from': state.currentUser.uid,
            'text': state.currentUser.displayName + " declined trip invite.",
            'category': "inviteRSVP"
          })
        Promise.all([a, b, c, d, e]).then(() => {
          resolve('declined')
        }).catch(e => {
          reject(e.message)
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
    newTripDate: ({state}, obj) => {
      return fb.db.collection('tripDates').doc(obj.tid).collection('dates').add({
        startDate: obj.dateStart,
                endDate: obj.dateEnd,
                flexible: obj.flexible,
                user: state.currentUser.displayName,
                votes: {[state.currentUser.displayName]: true}
      })
    },
    tripDatesVote: ({state}, data) => {
      var tmp='votes.'+state.currentUser.displayName
      return fb.db.collection('tripDates').doc(data.tid).collection('dates').doc(data.dateID).update({
        [tmp]: data.vote
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
      console.log("Action add: " + data.title)
      if (!data.category) {
        data.category = 'Miscellaneous'
      }
      if (data.page === ' group') {
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
          .doc(state.thisTripID).collection('gear').doc(data.id)
          .delete()
      } else {
        return fb.db.collection("individualGear").doc(state.currentUser.uid)
          .collection(state.thisTripID).doc(data.id)
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
    // INDIVIDUAL GEAR

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
      if(data.category === undefined) {
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
    // LOGGING IN // AUTH STUFF
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