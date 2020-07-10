<template>
  <div class="main">
    <div class="header2">
      <div class='subNavMenuLeft'></div>
      <div class="subNavMenu">
       <div class="menu-item"><router-link to="/list">Lists</router-link></div>
            
    </div>
    </div>
    
  <div class="hero">
      <div class="hero-top" id="nav-bar">
        <h1 class="hero-title">{{thisTrip.name}}</h1>
        <h2>Started by {{thisTripOwner}}</h2>
        <div class="hero-icon"></div>
      </div>
      <div class="hero-bottom">
        <div class="hero-content">
          <!-- TODO: new trip action, hidden form? -->
          <!-- <a @click="toggleAddTrip" class="hero-cta-button button grow">New Trip</a> -->
        </div>
      </div>
    </div>   


    <div class='content'>
      <div v-if="showDashboard" class='dashboard'>
      <div class='gridWrapper'>
        <div class='gridItem'>
          <h4>Campers</h4>        
         
          <div class='itemBody'>
            <ul>
              <li v-for="camper in thisTripCampers" :key="camper">{{camper}}</li>
            </ul>
          </div>
          <i @click="toggleAddUser" class='plusIcon'></i>
          <div @click="toggleCamperDetails" class='actionRow'><p>Details</p> <div class='rightArrowIcon'></div></div>
        </div>
         <div class='gridItem'>
          <h4>Gear</h4>
          <div class='itemBody'></div>
          <i class='plusIcon'></i>
        </div>
         <div class='gridItem'>
          <h4>Meals</h4>
          <div class='itemBody'></div>
          <i class='plusIcon'></i>
        </div>
      </div>
      <div class='gridWrapper'>
        <div class='gridItem'>
          <h4>Itinerary</h4>
          <div class='itemBody'></div>
          <i class='plusIcon'></i>
        </div>
         <div class='gridItem'>
          <h4>Logistics</h4>
          <div class='itemBody'></div>
          <i class='plusIcon'></i>
        </div>
         <div class='gridItem'>
          <h4>Expenses</h4>
          <div class='itemBody'></div>
          <i class='plusIcon'></i>
        </div>
      </div>
      </div>
    
   
        <div class='detailComponents'>
      <!-- Store v-if or v-show divs here for expanding card details -->
      <camperDetails v-if="showCamperDetails" @closeCamperDetails='toggleCamperDetails()'></camperDetails>
    </div>
     <div v-if="showMessages" id="messages">
       <hr>
      Messages Section and notifications?
      <i class='plusIcon'></i>
    </div>
   
    </div>
   <!-- use the modal component, pass in the prop -->
          <inviteCamperPopup @closeInvite="toggleAddUser" v-if="showInviteUser" :tripid="thisTripID">
            <!--
      you can use custom content here to overwrite
      default content
            -->
            
             <template v-slot:body>
              <h3>{{thisTrip.name}}</h3>
            </template>
            <!-- <h3 slot="header">custom header</h3> -->
          </inviteCamperPopup> 
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import camperDetails from '../components/camperDetails'
import inviteCamperPopup from '../components/inviteCamperPopup'

export default {
  name: "trip",
  created() {
    // TODO: if trip object empty route to trips
    if(this.thisTrip == {}) {
      console.log('no trip, pushing to trips')
      this.$router.push({path: '/trips'})
    }
    console.log('VUE created')
    //TODO: If not logged in yet does it work?
    // TODO: getter for sorting??
   
  },
  components: {
    camperDetails,
    inviteCamperPopup
  },
    computed: {
//       camperYes: function() {
// return this.thisTripCampers
//       },
...mapGetters(['thisTripCampersNames']),
        ...mapState(['thisTrip', 'thisTripID', 'thisTripOwner'])
    },
    data: function() {
      return {
        tripOwner: '',
        showDashboard: true,
        showMessages: true,
        showCamperDetails: false,
        showInviteUser: false
      }
  },
  methods: {
     toggleAddUser() {
      this.showInviteUser = !this.showInviteUser;
    },
    toggleCamperDetails() {
      console.log('method to dispatch camper details data', this.thisTripID)
      this.$store.dispatch('getThisTripCamperActivityLog',this.thisTripID)
      this.showCamperDetails = !this.showCamperDetails
      this.toggleDashboard()
    },
    toggleDashboard() {
      this.showDashboard = !this.showDashboard
      this.showMessages = !this.showMessages
    }
    }
  
}
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
    url(../assets/ryan-bahm-fMMpsyHCeK0-unsplash.jpg) no-repeat 0 -135px;
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

/* Main Content */
.gridWrapper {
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;  
    
}
.gridItem {
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 1px 1px 3px 1px rgba(57, 57, 57, 0.2);
  padding: 15px;
}
.actionRow {
  display: flex;
  flex-direction: row;
  align-items: center;
      justify-content: center;
    width: 100%;
    cursor: pointer;
}
.actionRow > p {
  margin-right: 10px;
  font-size: 1rem;
}

.plusIcon {
  background: url("../assets/add-plus.svg") no-repeat center center;
  background-size: contain;
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
  cursor: pointer;
}

.rightArrowIcon {
  background: url("../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: black;
}

/* messages section */
#messages {
  margin-top: 15px;
}
</style>