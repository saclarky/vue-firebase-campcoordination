<template>
  <div class="main">
    <div class="header2">
      <div class="subNavMenuLeft"></div>
      <div class="subNavMenu">
        <div class="menu-item">
          <router-link to="/list">Lists</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/newTrip">New Trip</router-link>
        </div>
      </div>
    </div>

    <div class="hero">
      <div class="hero-top" id="nav-bar">
        <h1 class="hero-title">Trips</h1>
        <div class="hero-icon"></div>
      </div>
      <div class="hero-bottom">
        <div class="hero-content">
          <!-- TODO: new trip action, hidden form? -->
          <a id="show-modal" @click="toggleAddTrip()" class="hero-cta-button button grow">New Trip</a>
          <!-- use the modal component, pass in the prop -->
          <newTripPopup v-if="showAddTrip" @close="toggleAddTrip()">
            <!--
      you can use custom content here to overwrite
      default content
            -->
            <!-- <template v-slot:header>
              <h3>Start New Trip</h3>
            </template> -->
            <!-- <h3 slot="header">custom header</h3> -->
          </newTripPopup>
        </div>

        
        <div class="tripBlock">
          <div class="title">My Trips</div>
          <div v-for="item in trips" :key="item.id" :id="item.id" class="tripContent">
            <div @click="goToTrip(item.id)">{{item.name}}</div>
            <!-- TODO: how validate other rows below? If date field is empty, breaks -->
            <div
              v-if="item.date"
            >{{new Date(item.date.seconds * 1000).getDate() }} {{ new Date(item.date.seconds * 1000).toLocaleString('default', { month: 'long' }) }} {{new Date(item.date.seconds * 1000).getFullYear() }}</div>
            <div v-if="item.location">{{item.location.Oa}}, {{item.location.Ba}}</div>
            <!-- <a @click="goToTrip">Go</a> -->
            <!-- input value isn't title, it's id for syncing data change with store/firestore -->
            <!-- <input type="checkbox" :id="item.id" :value="item.id" :checked="status" @change="updateStatus"> -->
            <!-- <label class="strikethrough" :for="item.id"> {{item.name}} </label> -->
            <!-- TODO: sort checked items to bottom of list? -->
            <!-- <small style="text-decoration:underline;" @click="deleteTrip(item.id)">Delete</small> -->
            <i class="cell text deleteIcon" @click="deleteTrip(item.id)"></i>
          </div>
        </div>
        <div class="tripBlock">
          <div class="title"> Joined Trips </div>
          <div v-for="item in joinedTrips" :key="item.id" :id="item.id" class="tripContent">
            <div @click="goToTrip(item.id)">{{item.name}}</div>
            <!-- TODO: how validate other rows below? If date field is empty, breaks -->
            <div
              v-if="item.date"
            >{{new Date(item.date.seconds * 1000).getDate() }} {{ new Date(item.date.seconds * 1000).toLocaleString('default', { month: 'long' }) }} {{new Date(item.date.seconds * 1000).getFullYear() }}</div>
            <div v-if="item.location">{{item.location.Oa}}, {{item.location.Ba}}</div>
         
          </div> 
        </div>
      </div>
    </div>

    <!-- ADD TRIP SECTION -->
    <div v-if="showAddTrip">
      <div v-if="errors !== ''" id="errors">{{ errors }}</div>
    </div>
  </div>
</template>


<script>
// import { db } from "@/main"
import { mapState } from "vuex";
import newTripPopup from "../components/newTripPopup.vue";

export default {
  name: "trips",
  created() {
    console.log("TODO: MUST separate owned from joined trips somehow, asterisk? and disable delete...")
    //TODO: If not logged in yet does it work?
    // TODO: listen for promise for loading spinner?
    this.$store.dispatch("bindTrips").then((res) => {
      console.log('what happens if theres no trips data? ', res)
      console.log("stop spinner");
    });
    this.$store.dispatch("bindJoinedTrips")
    //   this.$store.dispatch("setItems");
  },
  components: {
    newTripPopup: newTripPopup
  },
  data: function() {
    return {
      //   test: []
      status: false, //todo: compare dates?
      showAddTrip: false
    };
  },
  computed: mapState(["errors", "trips", "joinedTrips"]),
  methods: {
    //CANNOT use arrow shorthand => for functions if need "this.$store"
    toggleAddTrip() {
      this.showAddTrip = !this.showAddTrip;
    },
    deleteTrip: function(id) {
      console.log("delete trip");
      this.$store.dispatch("deleteTripAction", id).then((res,rej) => {
        if (res) {
          if(res == 'Trip deleted') {
            this.$toasted.show('Trip deleted')
          } else {
            this.$toasted.show(res)
          }
        } else {
          this.$toasted.show(rej)
        }
      })
    },
    goToTrip: function(e) {
      console.log("dispatch ");
      console.log(e);
      // Major issue on clicking div of event returning sub=element info instead of triggering div
      // so make sure pass in id in function...
      //promise??
      this.$store.dispatch("createTripPageData", e);
    }
  }
};
</script>

<style scoped>
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
  color: #f7ffff;
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

.tripContent {
  margin-top: 15px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
</style>