<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="@/assets/logo.png" id="vue-logo" /> -->
    <div class="hero">
      <div class="hero-top" id="nav-bar">
        <h1 class="hero-title">Camp Pack List</h1>
        <div class="hero-icon"></div>
      </div>
      <div class="hero-bottom">
        <div class="hero-content">
          <!-- <div class="hero-subtitle">
            Camping with all your friends, but no email chains. 
            Welcome!
          </div> -->
          <div>Email example: Hey guys want to do yosemite backpack? everyone: ya, sept 5! someone: I can't 5th, 21st?
            everyone: k, someone: what about sierras 5th? someone: ok NOW 2 TRIPS ARE IN ONE EMAIL CHAIN with one sad 
            exlcuded person
          </div>
          <a href="#" class="hero-cta-button button grow">New Trip</a>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
// import { db } from "@/main"
import { mapState } from "vuex";
// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)
export default {
  name: "home",
  // store: store,
  // beforeCreate: function() {
  //   this.$store.dispatch("setItems");
  // },
  data: function() {
    return {};
  },
  computed: mapState(["items", "itemInput", "errors", "trip"]),
  methods: {
    //CANNOT use arrow shorthand => for functions of need "this.$store"
  }
};
</script>

<style scoped>
.home {
  /* width: 750px; */
  margin: auto;
}

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
    url(../assets/nathan-anderson-roZgc7SXXmI-unsplash.jpg) no-repeat 0 -135px;
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
  justify-content: center;
  /* align-items: center; */
  flex: 1;
  padding: 0 15px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 36%; */
}

.hero-title {
  text-align: center;
  /* margin: 0 auto; */
}

.hero-subtitle {
  margin: 5px 0 15px 15px;
  text-shadow: 1px 0px 3px #000, 2px 1px 3px #000, 3px 2px #000;
  text-align: center;
  color: white;
  font-size: 1.1rem;
}

.hero-icon {
  background: url("../assets/CampingW.png") no-repeat center center;
  background-size: contain;
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
}

.hero-cta-button {
  background-color: rgba(245, 245, 245, 0.9);
  font-size: 1.2rem;
}

.title {
  font-size: 14px;
  font-weight: 700;
  padding: 0 0 10px 0;
  margin: 0 0 10px 0;
  border-bottom: 1px solid #666;
}

#errors {
  background: #a52222;
  color: #fff;
  padding: 5px;
}
</style>