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
               <div class="datesStyle">{{item.dateStart}}</div>
              <div class='mainText'>{{item.name}}</div> </span>
              <!-- <div v-if="item.location">{{item.location.Oa}}, {{item.location.Ba}}</div> -->
              <i :class="{cell:true, text: true, deleteIcon:true, hide:item.joined, show:!item.joined}" @click="deleteTrip(item.id)"></i>
              <span :class="{show:item.joined, hide:!item.joined}">invited</span>
            </div>
          </div>
        
          <div class="tripBlock">
            <div class="title">Trip Invites</div>
           <tripInvites></tripInvites>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD TRIP SECTION -->
    
  </div>
</template>


<script>
// import { db } from "@/main"
import { mapState, mapGetters } from "vuex";
import newTripPopup from "../components/trips/newTripPopup.vue";
import tripInvites from '../components/trips/tripInvites'
export default {
  name: "trips",
  created() {
    console.log(
      "TODO: MUST separate owned from joined trips somehow, asterisk? and disable delete..."
    );
    //TODO: If not logged in yet does it work?
    // TODO: listen for promise for loading spinner?
    // TODO: do this only once? like on app load?
    this.$store.dispatch("bindTrips").then((res) => {
      console.log("what happens if theres no trips data? ", res);
      console.log("stop spinner");
    });
    this.$store.dispatch("bindJoinedTrips");
    //   this.$store.dispatch("setItems");
  },
  components: {
    newTripPopup,
    tripInvites
  },
  data: function () {
    return {
      //   test: []
      status: false, //todo: compare dates?
      showAddTrip: false,
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
    deleteTrip: function (id) {
      console.log("delete trip");
      this.$store.dispatch("deleteTripAction", id).then((res, rej) => {
        if (res) {
          if (res == "Trip deleted") {
            this.$toasted.show("Trip deleted");
          } else {
            this.$toasted.show(res);
          }
        } else {
          this.$toasted.show(rej);
        }
      });
    },
    goToTrip: function (e) {
      console.log("dispatch ");
      console.log(e);
      // Major issue on clicking div of event returning sub=element info instead of triggering div
      // so make sure pass in id in function...
      //promise??
      this.$store.dispatch("createTripPageData", e);
    },
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
.text {
  text-decoration: underline;
}
.datesStyle {
  font-size: 0.9rem;
  color: rgb(82, 82, 82);
  font-style: italic;
  padding-right: 15px;
}
.tripBlock {
  padding: 0 20px;
  width: 50%;
}
.mainText {
  font-size: 1rem;
}
.entryStyle {
  align-items: center;
  flex: 1;
}
.hide {
  display: none;
}
.show {
  display: inline-block;
}
</style>