<template>
  <div class="main">
    <div class="hero">
      <div class="hero-top">
        <!-- <h1 class="hero-title">Trips</h1>
        <div class="hero-icon"></div>-->
        <div class="hero-content">
          <!-- TODO: new trip action, hidden form? -->
          <a id="show-modal" @click="toggleAddTrip()" class="hero-cta-button button grow">New Trip</a>
          <!-- use the modal component, pass in the prop -->
          <newTripPopup v-if="showAddTrip" @close="toggleAddTrip()"></newTripPopup>
        </div>
      </div>
      <div class="hero-bottom">
        <div class="row tripsSection">
          <div class="tripBlock">
            <div class="title">Upcoming Trips</div>
            <div v-for="item in tripsOrdered" :key="item.id" :id="item.id" class="tripContent">
             <span @click="goToTrip(item.id)" class='row entryStyle'>
               <div class="datesStyle cell">{{item.dateStart}}</div>
              <div class='mainText cell'>{{item.name}}</div> </span>
              <!-- <div v-if="item.location">{{item.location.Oa}}, {{item.location.Ba}}</div> -->
              <i :class="{cell:true, text: true, deleteIcon:true, hide:item.joined, show:!item.joined}" @click="toggleDeleteTrip(item.id)"></i>
              <span :class="{hide:!item.joined, show:item.joined}">
              <button @click="joinTrip(item.id, item.alertID, item.isDeclined)" :class="{cell:true, joined: item.isJoined}" :disabled="item.isJoined">Join</button>
          <button @click="declineTrip(item.id, item.alertID, item.isJoined)" :class="{cell: true, declined: item.isDeclined}" :disabled="item.isDeclined">Decline</button>
              </span>
            </div>
          </div>  
        </div>
      </div>
    </div>    
    <deleteTripPopup v-if="showDeleteTrip" :tid='delTID' @close="toggleDeleteTrip('')"></deleteTripPopup>
  </div>
</template>


<script>
// import { db } from "@/main"
import { mapState, mapGetters } from "vuex";
import newTripPopup from "../components/trips/newTripPopup.vue";
// import tripInvites from '../components/trips/tripInvites'
import deleteTripPopup from '../components/trips/deleteTripPopup'
export default {
  name: "trips",
  created() {
    console.log(
      "TODO: MUST separate owned from joined trips somehow, asterisk? and disable delete..."
    );
    //TODO: If not logged in yet does it work?
    // TODO: listen for promise for loading spinner?
    // TODO: do this only once? like on app load?
    this.$store.dispatch("bindUserNotifications")
    this.$store.dispatch("bindTrips").then((res) => {
      console.log("what happens if theres no trips data? ", res);
      console.log("stop spinner");
    });
    this.$store.dispatch("bindJoinedTrips");
    //   this.$store.dispatch("setItems");
  },
  components: {
    newTripPopup,
    // tripInvites,
    deleteTripPopup
  },
  data: function () {
    return {
      //   test: []
      delTID: '',
      status: false, //todo: compare dates?
      showAddTrip: false,
      showDeleteTrip: false
    };
  },
  computed: {
    
    ...mapState(["errors"]),
    ...mapGetters(["tripsOrdered"]),
  },
  methods: {
    //CANNOT use arrow shorthand => for functions if need "this.$store"
    toggleAddTrip() {
      this.showAddTrip = !this.showAddTrip;
    },
    toggleDeleteTrip(id) {
      this.delTID = id
      this.showDeleteTrip = !this.showDeleteTrip
    },
    
    goToTrip: function (e) {
      console.log("dispatch ");
      console.log(e);
      // Major issue on clicking div of event returning sub=element info instead of triggering div
      // so make sure pass in id in function...
      //promise??
      this.$store.dispatch("createTripPageData", e);
    },
     joinTrip: function(tripID, notiID, isD) {
      console.log("tid: ", tripID, 'nid ', notiID);
      // change response to true?
      // disable buttons and add actual RSVP value in gray italics? Or...
      // is better UX to highlight the join button as the RSVP but leave everything active
      // because then could decline in the future if plans change, or re-join if declined.
      // TODO: in that case need a way for trip campers to remove/block user in the future if no longer invited...
      // retract invitation --> disable user notification join/decline w /disabled attribute, give a note like 'trip is full',
      // remove from pending
      this.$store
        .dispatch("joinTripAction", { tid: tripID, nid: notiID, isDeclined: isD })
        .then((res, rej) => {
          if (res) {
            this.$toasted.show("Done! Joined trip.");
            // TODO how indicate to vue that response is joined, getter action? and then assign highlight class to join button
            // and disable the join button...
          } else {
            this.$toasted.show(rej);
          }
        });
    },
    declineTrip: function(tripID, notiID, isJ) {
      this.$store
        .dispatch("declineTripAction", { tid: tripID, nid: notiID, isJoined: isJ })
        .then((res, rej) => {
          if (res) {
            this.$toasted.show("Done! Declined trip.");
            // TODO how indicate to vue that response is declined, getter action? and then assign highlight class to button
            // and disable the button...
          } else {
            this.$toasted.show(rej);
          }
        });
    }
  },
};
</script>

<style scoped>
.main {
  position: relative;
  top: 86px;
}
/* HERO CSS */
.hero {
  display: flex;
  flex-flow: column nowrap;
  background: linear-gradient(
      rgba(45, 45, 45, 0.6),
      rgba(0, 0, 0, 0.37),
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5)
    ),
    url(../assets/jack-church-q07NWZGteCk-unsplash.jpg) no-repeat 0 -135px;
  background-size: cover;
  height: 490px;
  width: 100%;
  /*margin-bottom: 15px;*/
}
.hero-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-between; */
  /* padding: 15px 0; */
  /* color: #f7ffff; */
  padding: 10px 5px 30px 5px;
}
.hero-cta-button {
  padding: 10px;
}
.hero-content {
  margin-bottom: 30px;
}

.hero-bottom {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  flex: 1;
  padding: 0 15px;
}
.hero-icon {
  background: url("../assets/CampingW.png") no-repeat center center;
  background-size: contain;
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
}
.tripsSection {
  padding: 0 20px;
}

.tripContent {
  margin-top: 15px;
  padding: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: #d6dee6d9;
}
.tripContent:hover {
  background-color: #91b5dad9;
  cursor: pointer;
}
div.tripContent > div {
  padding: 5px 15px;
}

.title {
  text-align: left;
}

.deleteIcon {
  background: url("../assets/delete.svg") no-repeat center center;
  background-size: contain;
  width: 24px;
  height: 24px;
  cursor: pointer;
  vertical-align: middle;
}
.addedPersonIcon {
  background: url("../assets/person_add.svg") no-repeat center center;
  background-size: contain;
  width: 24px;
  height: 24px;
  cursor: pointer;
  vertical-align: middle;
}
.text {
  text-decoration: underline;
}
.datesStyle {
  font-size: 0.9rem;
  color: rgb(82, 82, 82);
  font-style: italic;
  /* padding-right: 15px; */
}
.tripBlock {
  padding: 0 20px;
  /* width: 50%; */
}
.mainText {
  font-size: 1rem;
}
.entryStyle {
  align-items: center;
  flex: 1;
  padding: 0 5px;
}
.hide {
  display: none;
}
.show {
  display: inline-block;
}
.joined {
  border: 2px green solid
}
.declined {
  border: 2px red solid
}
.cell {
  padding: 0 5px;
}
button {
  margin: 0 5px;
}
</style>