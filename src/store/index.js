import Vue from 'vue'
import Vuex from 'vuex'
// import { db } from '@/main'
const fb = require('../firebaseConfig.js')
import { vuexfireMutations, firestoreAction } from 'vuexfire'
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
    userProfile: {}
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
      if (!state.thisTripActivityLog || state.thisTripActivityLog == 0) {
        console.log('nope')
        return []; // if doc is null give an empty array to iterate
      } else {
        Object.keys(state.thisTripActivityLog).forEach(key => {
          if (state.thisTripActivityLog[key].category == 'invite') {
            let modInvite = state.thisTripActivityLog[key];
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
        return context.bindFirestoreRef('trips', fb.db.collection('trips').where("uid", "==", context.state.currentUser.uid))
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
      //TODO: TDB into blank fields?
      fb.db.collection("trips").add({ 'name': name, 'uid': state.currentUser.uid })
        .then(doc => {
          // context.commit('updateThisTripID', (doc.id))
          //TODO redirect to new trip page?
          fb.db.collection('campers').doc(doc.id).set({
            [state.currentUser.uid]: state.userProfile.name
          }).then(() => {
            console.log('saved current user to trip campers')
          }).catch(e => {
            console.log("error saving new trip's owner as a camper")
            console.log(e.message)
          })
        })
        .catch(error => {
          // this.errors = error;
          console.log("Save new trip error:")
          console.log(error);
        });
    },
    deleteTripAction: (context, id) => {
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
          })
          .catch(function (error) {
            console.log(error)
            context.commit('updateErrors', { msg: error.message });
          });
      } else {
        context.commit('updateErrors', { msg: "Invaid trip ID." });
      }
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
                  console.log(res)
                  // Add to pending campers
                  fb.db.collection('campersPending').doc(tid).set({ [userID.id]: uidToName })
                    .then(() => {
                      // TODO:Notify user 
                      console.log("TODO INVITE USER")
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
