<template>
  <div class="main">
    <div class="header2">
      <div class="subNavMenuLeft"></div>
      <div class="subNavMenu">
        <div class="menu-item">
          <router-link to="/list">Lists</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/trips">Trips</router-link>
        </div>
      </div>
    </div>

    <div class="hero">
      <div class="hero-top" id="nav-bar">
        <h1 class="hero-title">New Trip</h1>
        <!-- <div class="hero-icon"></div> -->
      </div>
      <div class="hero-bottom">
        <div class="newTripForm">
          <div class='formItem'>
            <input :value="newTripObj.name" id="name"/>
            <label for="name">Trip Name</label>
          </div>
          <div class='formItem'>
            <input type="checkbox" id="group" />
            <label for="group">Invite friends</label>
          </div>
          <button @click="saveTrip">Save Trip</button>

          <!-- TODO: Add w enter key -->
          <div v-if="errors !== ''" id="errors">{{ errors }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["trips", "thisTrip", "errors"])
  },
  data: function() {
    return {
      newTripObj: {
        name: "",
        group: false
      }
    };
  },
  methods: {
    updateNewTripObj: function() {
      // this.$store.commit('updateItemInputMutation', e.target.value);
    },
    saveTrip: function() {
      this.$store.dispatch("saveTripAction");
    }
  }
};
</script>

<style>
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
    url(../assets/ganapathy-kumar-Gl9r22w_Oxk-unsplash.jpg) no-repeat 0 -135px;
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
.newTripForm {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
</style>