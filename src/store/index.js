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
    console.log('there is a user')
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

    // CAMPERS
    allCampersUIDs: [], // should be a getter
    thisTripCampersUIDs: [],
    thisTripCampersNoUIDs: [],
    thisTripCampersPendingUIDs: [],
    thisTripCampers: [],
    thisTripCampersNo: [],
    thisTripCampersPending: [],
    thisTripOwner: '',
    thisTripInvites: [],
    currentUser: null,
    userProfile: {},
    userTripInvites: {}
  },
  getters: {
    // getItems: state => {
    //   return state.items
    // }
  },
  mutations: { // CANNOT BE ASYNCHRONOUSM USE ACTIONS
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
    setCamperUIDs: function (state, data) {
      let cps = data.cps
      let type = data.type
      console.log('mutation to set ', type, ' campers');
      let cl
      switch (type) {
        case 'yes':
          cl = 'thisTripCampersUIDs'
          break
        case 'no':
          cl = 'thisTripCampersNoUIDs'
          break
        default:
          cl = 'thisTripCampersPendingUIDs'
      }
      state[cl] = cps;
    },
    setTripCampers: function (state, data) {
      let cps = data.cps
      let type = data.type
      console.log('mutation to set ', type, ' campers');
      let cl
      switch (type) {
        case 'yes':
          cl = 'thisTripCampers'
          break
        case 'no':
          cl = 'thisTripCampersNo'
          break
        default:
          cl = 'thisTripCampersPending'
      }
      state[cl] = cps;
    },
    setTripInvites: function (state, invites) {
      console.log('mutation to set invitations log');
      console.log(invites)
      state.thisTripInvites = invites; // array of invite objects
      console.log('update')
    },
    // setItems: state => {
    //   let items = []
    //   db.collection('items').orderBy('created_at').onSnapshot((snapshot) => {
    //     items = []
    //     snapshot.forEach((doc) => {
    //       items.push({ id: doc.id, title: doc.data().title, status: doc.data().status })
    //     })
    //     state.items = items
    //   })
    // },
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
        return context.bindFirestoreRef('trips', fb.db.collection('trips').where("uid", "==", context.state.currentUser.uid)
          .orderBy("date")) // date of trip, not when created
      }),
      bindATrip:
      firestoreAction(context => {
        // i don't know if it respects where clauses?
        return context.bindFirestoreRef('thisTrip', fb.db.collection('trips').doc(context.state.thisTripID)
          .orderBy("date")) // date of trip, not when created
      }),
    bindTripCampers: firestoreAction(context => {
      // will it notice on its own a change in trip id?
      //todo: promises, wait on the bnd Trip action
      return context.bindFirestoreRef('thisTripCampers', fb.db.collection('campers').doc(context.state.thisTripID))
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
      dispatch('getThisTrip', tid)
        .then((uid) => {
          console.log("the current trip is set", 'owner:', uid, 'trip', id)
          // TODO: data binds.... :/
          console.log('get yes campers')
          dispatch('getThisTripCampersUIDs', { 'id': id, 'type': 'yes' }).then(uidArray => {
            if (uidArray.length > 0) {
              commit('setCamperUIDs', { 'cps': uidArray, 'type': 'yes' })
              dispatch('getThisTripCampersNames', { 'uidArray': uidArray, 'type': 'yes' }).then(names => {
                console.log('have confirmed campers')
                commit('setTripCampers', { 'cps': names, 'type': 'yes' }) //yes
              })
            }
          })

          console.log('get declined campers')
          dispatch('getThisTripCampersUIDs', { 'id': id, 'type': 'no' }).then(uidArray => {
            if (uidArray.length > 0) {
              commit('setCamperUIDs', { 'cps': uidArray, 'type': 'no' })
              dispatch('getThisTripCampersNames', { 'uidArray': uidArray, 'type': 'no' }).then(names => {
                console.log('have declined campers')
                commit('setTripCampers', { 'cps': names, 'type': 'no' }) //no
              })
            }
          })

          console.log('get pending campers')
          dispatch('getThisTripCampersUIDs', { 'id': id, 'type': 'pending' }).then(uidArray => {
            if (uidArray.length > 0) {
              commit('setCamperUIDs', { 'cps': uidArray, 'type': 'pending' })
              dispatch('getThisTripCampersNames', { 'uidArray': uidArray, 'type': 'pending' }).then(names => {
                console.log('have confirmed campers')
                commit('setTripCampers', { 'cps': names, 'type': 'pending' }) //pending
              })
            }
          })

          console.log('get the trip owner name')
          dispatch('queryUsernameAction', uid).then((name) => { commit('setTripOwner', name) })
          console.log("routing to the trip")
          router.push({ path: '/trip' })
        })
    },
    getThisTrip: (context, payload) => {
      console.log('run action first to get the trip')
      if (payload !== "") {
        return new Promise((resolve, reject) => {
          fb.db.collection("trips").doc(payload).get()
            .then(doc => {
              if (doc.exists) {
                console.log("trip data:", doc.data());
                context.commit('updateCurrentTrip', doc.data());
                console.log(doc.id)
                context.commit('updateThisTripID', doc.id)
                console.log('committed now resolve promise with started-by uid')
                resolve(doc.data().uid)
              } else {
                // doc.data() will be undefined in this case
                console.log("No such trip document!");
                reject(new Error("couldn't get the trip"));
              }
            })
        })
      } else {
        context.commit('updateErrors', { msg: "Invalid trip id." });
      }
    },
    saveNewTripAction: (context, name) => {
      fb.db.collection("trips").add({ 'name': name, 'uid': context.state.currentUser.uid })
        .then(doc => {
          context.dispatch('getThisTrip', (doc.id));
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
              // Reroute to trips page if deleted from a trip view or elsewhere

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
    // CAMPERS
    // return a promise with array of camper UIDS
    getThisTripCampersUIDs: (context, data) => {
      let id = data.id
      let type = data.type
      console.log('running getThisTripCampersUIDs for trip ', id, ' and type ', type)
      return new Promise((resolve, reject) => {
        if (id !== '') {
          let cl
          switch (type) {
            case 'yes':
              cl = 'campers'
              break
            case 'no':
              cl = 'campersNo'
              break
            default:
              cl = 'campersPending'
          }
          fb.db.collection(cl).doc(id).get()
            .then(doc => {
              if (doc.exists) {
                console.log('camper list exists for ', type)
                // convert keys of object to names list              
                let camperArray = Object.keys(doc.data());
                console.log("camper uid data:", camperArray);
                resolve(camperArray)
              } else {
                // doc.data() will be undefined in this case
                console.log("no campers for this trip yet, reutnring empty uid array!");
                resolve([])
              }
            })
            .catch(error => {
              // this.errors = error;
              console.log("Trip doc error:")
              console.log(error.message);
              reject(error.message)
            });
        } else {
          context.commit('updateErrors', { msg: "Invalid trip id." });
          reject('invalid trip id')
        }
      })
    },
    // returns a promise with array of names from any object with boolean ids
    getThisTripCampersNames: (context, data) => {
      let camperArray = data.uidArray
      let type = data.type
      console.log('running getThisTripCampersNames for type ', type)
      return new Promise((resolve) => {
        let camperArrayNames = [];
        for (let i = 0; i < camperArray.length; i++) {
          // returns a promise, store that in array to await resolution
          camperArrayNames.push(context.dispatch('queryUsernameAction', camperArray[i]));
        }
        Promise.all(camperArrayNames).then(names => {
          console.log('promise returned with all camper names: ', names)
          resolve(names);
        })
      })
    },
    getThisTripCamperActivityLog: (context, tid) => {
      console.log('run camper actviity log action using trip id', tid)
      if (tid !== '') {
        console.log('call db function for activity table')

        fb.db.collection("tripActivityLog").doc(tid).collection('logs').where("category", "==", "invite")
          //GO through every doc (invite) and append to the store item here? thisTripInvites
          .get()
          .then(docs => {
            console.log('full docs', docs)
            if (!docs.empty) {
              let detailsDocArray = []
              for (let i = 0; i < docs.docs.length; i++) {
                console.log(docs.docs)
                let detailsDocs = docs.docs[i].data();
                detailsDocs.id = docs.docs[i].id
                console.log("invite data " + i + ": ", detailsDocs);
                detailsDocArray.push(detailsDocs);
              }
              console.log('end of loop code')
              context.commit('setTripInvites', detailsDocArray);
            } else {
              console.log('no trip invite docs in collection')
            }
          })
          .catch(error => {
            console.log("Trip doc error:")
            console.log(error);
          });
      } else {
        console.log('empty trip id')
        context.commit('updateErrors', { msg: "empty trip id." });
      }
    },
    inviteCamper: ({ state, dispatch, commit }, data) => {
      console.log('invite camper')
      return new Promise((resolve, reject) => {
        let tid = data.tid;
        // get the uid from email
        let uidTo = dispatch('searchUsersByEmail', { 'email': data.email })
        console.log('p ', uidTo)
        uidTo.then(userID => {
          console.log('id from email: ', userID)
          // Make sure not already invited
          // Assumes on 'thisTrip' page and state is updated with camper values
          let allCampers = state.thisTripCampersNoUIDs.concat(state.thisTripCampersPendingUIDs, state.thisTripCampersUIDs);
          if (allCampers.includes(userID)) {
            resolve('Duplicate')
          } else {
            console.log('not invited yet')
            // Get name
            let uidToName;
            let uidToPromise = dispatch('queryUsernameAction', userID)
            console.log('huh')
            uidToPromise.then((name) => {
              console.log('name from query promised back: ', name)
              uidToName = name;
              // Add a trip activity log entry
              console.log(tid)
              fb.db.collection('tripActivityLog').doc(tid).collection('logs')
                .add({
                  'time': new Date().getTime(), 'from': state.currentUser.uid,
                  'text': state.userProfile.name + " invited " + uidToName + " to join the trip",
                  'category': "invite"
                })
                .then((res) => {
                  console.log(res)
                  // Add to pending campers
                  fb.db.collection('campersPending').doc(tid).set({ [userID]: true })
                    .then(() => {
                      // if no data binds, update the state here....
                      commit('setCamperUIDs', { 'cps': [userID], 'type': 'pending' })
                      commit('setTripCampers', { 'cps': [uidToName], 'type': 'pending' })
                      // TODO:Notify user 
                      console.log("TODO INVITE USER")
                      resolve('invited')
                    })
                    .catch(error => {
                      console.log('error in invite')
                      reject(error.message)
                    })
                })
            })
          }
        })
          .catch(e => {
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
              resolve(user.docs[0].id)
            } else {
              reject("no such user or multiple results")
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
