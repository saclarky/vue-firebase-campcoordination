import Vue from 'vue'
import Vuex from 'vuex'
// import { db } from '@/main'
const fb = require('../firebaseConfig.js')
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import firebase from 'firebase'
import router from '../router'

Vue.use(Vuex)

// handle page reload... this is also in main.js?
fb.auth.onAuthStateChanged(user => {
  // TODO- logout clear data??
  console.log('auth state change triggered')
  if (user) {
    console.log('there is a user: ', user) // TODO: why save profile if all info is here? Oh searching!
    // this line fires when it's a new user and the registration logic in login.vue already did it...
    store.commit('setCurrentUser', user)
    // next line shouldn't fire for new registered users, doesn't exist
    // AND there's a data ref to changing currentuser to get profile so no need!
    // ignore last line, a change in uid doesn't seem to trigger it
    store.dispatch('fetchUserProfile')
    // Get user-related stuff
    // Here? Or in views on load to minimize DB queries? Yah...
  }
})

// export default new Vuex.Store({
export const store = new Vuex.Store({
  state: {
    items: [],
    errors: "",
    itemInput: "",

    //TRIPS
    trips: [],
    joinedTrips: [],
    thisTrip: {},
    thisTripID: '',
    thisTripOwner: '',

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
    thisTripCampersNames: state => {
      if (!state.thisTripCampers) {
        return []
      } else {
        return Object.values(state.thisTripCampers)
      }
    },
    thisTripCampersNoNames: state => {
      if (!state.thisTripCampersNo) {
        return []
      } else {
        return Object.values(state.thisTripCampersNo)
      }
    },
    thisTripCampersPendingNames: state => {
      if (!state.thisTripCampersPending) {
        return []
      } else {
        return Object.values(state.thisTripCampersPending)
      }
    },
    // TRIP LOGS
    thisTripInviteLogs: state => {
      let tripInviteLogs = [];
      console.log(state.thisTripActivityLog)
      console.log("TODO logs are array? ", Array.isArray(state.thisTripActivityLog))
      if (!state.thisTripActivityLog || state.thisTripActivityLog.length == 0) {
        console.log('nope')
        return []; // if doc is null give an empty array to iterate
      } else {
        
        state.thisTripActivityLog.forEach(key => {
          console.log(key)
          if ( ['invite', 'inviteRSVP'].includes(key.category ) ) {
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

    //USER
    thisUserNotificationsGetter: state => {
      let responsesObj = []
      let inviteObj = []

      if (state.thisUserNotifications.length > 0) {
        state.thisUserNotifications.forEach(doc => {
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
      console.log('return batch of objects by category')
      return {
        'tripInvites': inviteObj,
        'tripResponses': responsesObj
      }
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
    setTripOwner: function (state, name) {
      console.log('mutation to set the trip owner');
      state.thisTripOwner = name;
    },
    ...vuexfireMutations
  },

  actions: {
    // TODO bind other tables?
    bindItemsRef: firestoreAction(context => {
      // context contains all original properties like commit, state, etc
      // and adds `bindFirestoreRef` and `unbindFirestoreRef`
      // we return the promise returned by `bindFirestoreRef` that will
      // resolve once data is ready
      return context.bindFirestoreRef('items', fb.db.collection('items'))
    }),
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
        console.log("TODO this doesn't display trips wehre invited")
        return context.bindFirestoreRef('trips', fb.db.collection('trips').where("uid", "==", context.state.currentUser.uid))
        // .orderBy("date")) // date of trip, not when created
        // TODO ERROR: if there's no date orderBy doesn't retrieve it
      }),
    bindJoinedTrips:
      firestoreAction(context => {
        // i don't know if it respects where clauses?
        console.log("TODO this doesn't display trips wehre invited")
        return context.bindFirestoreRef('joinedTrips', fb.db.collection('trips').where("campers", "array-contains", context.state.currentUser.uid))
        // .orderBy("date")) // date of trip, not when created
        // TODO ERROR: if there's no date orderBy doesn't retrieve it
      }),
    bindATrip:
      firestoreAction(context => {
        // i don't know if it respects where clauses?
        return context.bindFirestoreRef('thisTrip', fb.db.collection('trips').doc(context.state.thisTripID))
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
        .collection('logs'))
    }),
    bindUserNotifications: firestoreAction(context => {
      return context.bindFirestoreRef('thisUserNotifications', fb.db.collection('userNotifications')
        .doc(context.state.currentUser.uid).collection('notifications'))
    }),
    queryUsernameAction: (context, uid) => {
      console.log('query a username from uid', uid)
      return new Promise((resolve, reject) => {
        fb.db.collection("users").doc(uid).get()
          .then(doc => {
            console.log('have the username doc for ', uid)
            if (doc.exists) {
              console.log(uid, ' name is ', doc.data().name)
              resolve(doc.data().name);
            } else {
              console.log('error, username does not exist docs not updated with changes')
              reject(new Error("Username doesn't exist! Uh oh. Check tables are updated."));
            }
          })
      })
    },
    createTripPageData: ({ dispatch, commit }, tid) => {
      let id = tid
      console.log('Wrapper function to run actions for setting up data for a trip page')
      console.log(tid)
      commit('updateThisTripID', tid)
      dispatch('bindATrip')
        .then((trip) => {
          console.log("the current trip is set", 'owner:', trip.uid, 'trip', id)
          console.log('get the trip owner name')
          dispatch('queryUsernameAction', trip.uid).then((name) => {
            console.log('have owner name promise return')
            commit('setTripOwner', name)
          })
          dispatch('bindTripActivityLog')
          dispatch('bindTripCampersPending').then(res => {
            console.log("Pending trip campers retrieved", res)
          })
          dispatch('bindTripCampersNo').then(res => {
            console.log("Declined trip campers retrieved", res)
          })
          dispatch('bindTripCampers').then(res => {
            console.log('Campers retrieved', res)
          })
          // TODO - make this instead at end of promises?
          console.log("routing to the trip")
          router.push({ path: '/trip' })
        })
    },

    saveNewTripAction: ({ state }, name) => {
      return new Promise((resolve, reject) => {
        //TODO: TDB into blank fields?
        fb.db.collection("trips").add({ 'name': name, 'uid': state.currentUser.uid })
          .then(doc => {
            // context.commit('updateThisTripID', (doc.id))
            //TODO redirect to new trip page?
            fb.db.collection('campers').doc(doc.id).set({
              [state.currentUser.uid]: state.userProfile.name
            })
            .then(() => {
              // Strange issue trying to debug, 'empty' existing collections.
// Might be because of not created ancestor first explicity so here...
fb.db.collection('tripActivityLog').doc(doc.id).set({'null':null})
              resolve("saved")
              console.log('saved current user to trip campers')
            }).catch(e => {
              console.log("error saving new trip's owner as a camper")
              console.log(e.message)
              reject(e.message)
            })
          })
          .catch(error => {
            // this.errors = error;
            console.log("Save new trip error:")
            console.log(error);
            reject(error.message)
          });
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
              // delete logs
              console.log('TODO redo trip activity log collection deletion, recursive bad? cloud function?')              
              fb.db.collection('tripActivityLog').doc(id).collection('logs').get().then((docs) => {
                //todo, what if no logs, empty array? does for eahc throw something?
                let waiting = []
                docs.forEach(doc => {
                  waiting.push( fb.db.collection("tripActivityLog")
                  .doc(id).collection("logs").doc(doc.id)
                  .delete())
                })
                Promise.all(waiting).then(() => {
                  // fb.db.collection('tripActivityLog').doc(id).collection('logs').delete() NOT A FUNCTION/not necessary
                  console.log('still concerned, TODO check logs collection is not orphaned')
                    fb.db.collection('tripActivityLog').doc(id).delete()                 
                })
              })
              console.log('TODO figure out updating user notifcations about the trip... alert disabled? deleted?')
              // could wait until they try and if tripID doesn't exist, let them know and delete it?
              // collectionGroup grabs subcollections with the same name! (so don't reuse...)
              // BUT can't delete from there so not very helpful...
              // fb.db.collectionGroup('notifications').where('tid','==',id).get().then((data) => {
              //   console.log('All the notifications that match deleted trip id: ', data)
              //   //todo, what if no logs, empty array? does for eahc throw something?
              //   //docs.empty == true
              //   data.docs.forEach(matchedNotification => {
              //     console.log('CG Doc, delete here?: ', matchedNotification.id, matchedNotification.data().text)
              //     // fb.db.collectionGroup("notifications").doc(doc.id).delete() NOT ALLOWED
              //   })
              // })
                 console.log("TERRIBLE SOLUTION FOR TESTING: loop every user and every doc for deleting")
                 console.log("DO YOU HEAR ME FIX THIS")
                  fb.db.collection('userNotifications').get().then(users => {
                    users.docs.forEach(user => {
                      fb.db.collection('userNotifications').doc(user.id).collection('notifications').get().then(notifications => {
                        notifications.docs.forEach(n => {
                          if (n.data().tid == id) {
                            fb.db.collection('userNotifications').doc(user.id).collection('notifications').doc(n.id).delete()
                          }
                        })
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
                  'text': state.userProfile.name + " invited " + uidToName + " to join the trip",
                  'category': "invite"
                })
                .then((res) => {
                  console.log(res) //invite id is here res.id
                  // Add to pending campers
                  fb.db.collection('campersPending').doc(tid).set({ [userID.id]: uidToName })
                    .then(() => {
                      // Add notification to user dashboard
                      fb.db.collection('userNotifications').doc(userID.id).collection('notifications').add({
                        'category': 'tripInvite',
                        'tid': tid,
                        'time': new Date().getTime(),
                        'text': state.userProfile.name + " invited you to join " + state.thisTrip.name,
                        'isJoined': false,
                        'isDeclined': false,
                        'from': state.currentUser.uid
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
        // Add to campers
        let b = fb.db.collection('campers').doc(data.tid).set({
          [state.currentUser.uid]: state.userProfile.name
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
            'text': state.userProfile.name + " accepted trip invite.",
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
          let c,e
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
           let b = fb.db.collection('campersNo').doc(data.tid).set({
              [state.currentUser.uid]: state.userProfile.name
              // TODO have two tabs open and test auto-update on trip page
            })
              // Add an activity log message about the invite
             let a = fb.db.collection('tripActivityLog').doc(data.tid).collection('logs')
                .add({
                  'time': new Date().getTime(), 'from': state.currentUser.uid,
                  'text': state.userProfile.name + " declined trip invite.",
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
    // PACKING LIST MANIPULATION
    addToDoAction: (context) => {
      console.log("Action add: " + context.state.itemInput)
      context.commit('blankErrors');
      if (context.state.itemInput !== "") {
        fb.db.collection("items")
          .add({
            title: context.state.itemInput,
            created_at: Date.now(),
            status: false
          })
          .then(docRef => {
            console.log("Document written with ID: ", docRef.id);
            context.commit('blankItemInput');
          })
          .catch(error => {
            // this.errors = error;
            console.log("Add action error:")
            console.log(error);
          });
      } else {
        context.commit('updateErrors', { msg: "Enter text." });
      }

    },
    deleteItemAction: (context, id) => {
      if (id) {
        fb.db.collection("items")
          .doc(id)
          .delete()
          .then(function () {
            console.log("Document successfully deleted");
          })
          .catch(function (error) {
            this.error = error;
          });
      } else {
        context.commit('updateErrors', { msg: "Invaid ID." });
      }
    },
    updateStatusAction: (context, obj) => {
      fb.db.collection("items").doc(obj.id)
        .update({
          status: obj.status
        })
        .then(() => {
          console.log("Document updated successfully.");
        })
        .catch(error => {
          // this.errors = error;
          console.log("Set action error:")
          console.log(error);
        });
    },
    // LOGGING IN // AUTH STUFF
    fetchUserProfile({ commit, state }) {
      console.log('dispatch user profile get');
      console.log(state.currentUser.uid)
      fb.db.collection('users').doc(state.currentUser.uid).get().then(res => {
        console.log(res)
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
