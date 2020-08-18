<template>
  <div class="main">
    <subnav>{{thisTrip.name}} ({{thisTrip.owner}})</subnav>
    <div class="hero">
      <div class="hero-top" id="nav-bar">
        <h1 class="hero-title">{{thisTrip.name}}</h1>
        <div class='hero-icon'></div>
        <h2 class='heroSubTitle'> Started by {{thisTrip.owner}}</h2>
      </div>
      <div class="hero-bottom">
    <div class="hero-content">
    <!-- TODO: new trip action, hidden form? -->
    <div>Trip type: <span v-if="thisTrip.group===true">Group</span>  <span v-if="thisTrip.group===false">Individual</span></div>
    <!-- <a v-if="!thisTrip.group" @click="toggleTripType" class="hero-cta-button button grow">Make Group Trip</a> -->
    </div>
    </div>
</div> 

    <div class="content">
      <div v-if="showDashboard" class="dashboard">
        <div class="gridWrapper">
          <div class="row splitPane">
            <div class="smCol rightBorder">
              Dates
              <button @click="toggleTripDatesPopup">Suggest New Dates</button>
            </div>
          <dates></dates>
          </div>
          <newTripDatesPopup
            v-if="showTripDatesPopup"
            @close="toggleTripDatesPopup"
            :tid="thisTrip.id"
          ></newTripDatesPopup>

          <div :class="{row:true, splitPane:true, hide: !thisTrip.group}">
            <div class="smCol rightBorder">
              Campers
              <button @click="toggleAddCamper">Invite</button>
            </div>
            <div class="lgCol datesData">
              <div>Confirmed, can edit trip page</div>
              <div v-for="(yes, uid) in thisTripCampers" :key="uid">
                {{yes}}
                <button
                  @click="removeCamper(uid)"
                  :class="{buttonDisabled: thisTrip.uid === uid} "
                >remove</button>
              </div>
              <div>Pending, can view trip page</div>
              <div v-for="(rsvp, uid) in thisTripCampersPending" :key="uid">
                {{rsvp}}
                <button @click="removeCamper(uid)">remove</button>
              </div>
              <div>Declined, no access to the trip</div>
              <div v-for="(no, uid) in thisTripCampersNo" :key="uid">
                {{no}}
                <button @click="removeCamper(uid)">remove</button>
              </div>
            </div>
            <div>
              <div>Activity Log<span @click="toggleCamperActivityLog" 
              :class="{downArrowIcon: showCamperActivityLog, upArrowIcon: !showCamperActivityLog}"></span></div>
              <!-- empty time fields/missing field dealt with in vuex getter -->
              <div :class="{hide: showCamperActivityLog}" v-for="invite in thisTripInviteLogs" :key="invite.id">
                <span class="logEntry">
                  {{invite.time}}
                  -
                  {{invite.text}}
                </span>
              </div>
            </div>
          </div>
          <inviteCamperPopup
            @close="toggleAddCamper()"
            v-if="showInviteCamper"
            :tripid="thisTrip.id"
          >
            <template v-slot:body>
              <h3>{{thisTrip.name}}</h3>
            </template>
          </inviteCamperPopup>


 <div class="row splitPane">
            <div class="smCol rightBorder">
              Gear
            </div>
            <div class="lgCol datesData">
              <gear></gear>
            </div>
            </div>


            <div class="row splitPane">
            <div class="smCol rightBorder">
              Meals
            </div>
            <div class="lgCol datesData">
              <meals></meals>
            </div>
            </div>
        
          <div class="row splitPane">
            <div class="smCol rightBorder">
              Itinerary
              <button @click="toggleNewItinEntry">Add Entry</button>
            </div>
            <div class="lgCol datesData">
              <itinerary></itinerary>
            </div>
            </div>
             <newItinEntryPopup v-if='showNewItinEntry' @close="toggleNewItinEntry" :tid="thisTrip.id"></newItinEntryPopup>
          
          <div class="gridItem">
            <h4>Logistics</h4>
            <div class="itemBody"></div>
            <i class="plusIcon"></i>
          </div>
          <div class="gridItem">
            <h4>Expenses</h4>
            <div class="itemBody"></div>
            <i class="plusIcon"></i>
          </div>
        </div>
      </div>

      <div v-if="showMessages" id="messages">
        <hr />Messages Section and notifications?
        <i class="plusIcon"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import inviteCamperPopup from "../components/inviteCamperPopup";
import dates from "../components/dates/dates";
import newTripDatesPopup from "../components/dates/newTripDatesPopup";
import gear from '../components/gear'
import meals from "../components/meals";
import subnav from "../components/subnav";
import itinerary from "../components/itinerary/itinerary"
import newItinEntryPopup from '../components/itinerary/newItinEntryPopup';

export default {
  name: "trip",
  created() {
    // TODO: if trip object empty route to trips
    if (this.$store.state.thisTrip.id === undefined) {
      console.log("no trip, pushing to trips");
      this.$router.push({ path: "/trips" });
    }
  },
  components: {
    subnav,
    dates,
    newTripDatesPopup,
    inviteCamperPopup,
    gear,
    meals,
    itinerary,
    newItinEntryPopup
  },
  computed: {
    ...mapState([
      "thisTrip",
      "thisTripCampers",
      "thisTripCampersNo",
      "thisTripCampersPending",
    ]),
    ...mapGetters(["thisTripInviteLogs"]),
  },
  data: function () {
    return {
      showTripDatesPopup: false,
      showNewItinEntry: false,
      showDashboard: true,
      showMessages: true,
      showInviteCamper: false,
      showCamperActivityLog: false
    };
  },
  methods: {
     toggleTripDatesPopup() {
      this.showTripDatesPopup = !this.showTripDatesPopup;
    },
    // ITINERARY ENTRIES
    toggleNewItinEntry() {
      this.showNewItinEntry = !this.showNewItinEntry;
    },
    toggleAddCamper() {
      this.showInviteCamper = !this.showInviteCamper;
    },
    toggleCamperActivityLog() {
      console.log(this.showCamperActivityLog)
      this.showCamperActivityLog = !this.showCamperActivityLog;
    },
    removeCamper(camperID) {
      // TODO: don't have 'remove' button by the camp owner. disabled?
      console.log("Remove ", camperID);
      if (camperID !== this.thisTrip.uid) {
        let camperTable;
        let name;
        if (Object.keys(this.thisTripCampers).includes(camperID)) {
          camperTable = "campers";
          name = this.thisTripCampers[camperID];
        }
        if (Object.keys(this.thisTripCampersNo).includes(camperID)) {
          camperTable = "campersNo";
          name = this.thisTripCampersNo[camperID];
        }
        if (Object.keys(this.thisTripCampersPending).includes(camperID)) {
          camperTable = "campersPending";
          name = this.thisTripCampersPending[camperID];
        }

        this.$store
          .dispatch("removeCamperAction", {
            cid: camperID,
            name: name,
            camperTable: camperTable,
          })
          .then(() => {
            this.$toasted.show("Camper removed.");
          })
          .catch((e) => {
            this.$toasted.show(e.message);
          });
      } else {
        this.$toasted.show("Cannot delete trip owner.");
      }
    }
    
    
  },
};
</script>

<style scoped>
h4 {
  margin: 0;
  padding: 0;
  font-size: 1.2rem;
}
/* HERO CSS */
.hero {
  top: 100px;
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
  height: 200px;
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
  padding: 10px 5px 10px 5px;
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
  width: 30px;
  height: 30px;
  margin-bottom: 15px;
}
.hero-title {
  font-size: 1.2rem;
}
.heroSubTitle {
  font-size:1.1rem;
}
.main {
  position: relative;
  top: 116px;
}
/* Main Content */
.gridWrapper {
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.gridItem {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 1px 1px 3px 1px rgba(57, 57, 57, 0.2);
  padding: 10px;
  margin: 10px 0;
  background: #95c9d1bf;
}
.actionRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
  color: gray;
  font-size: 0.9rem;
  font-style: italic;
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
  color: gray;
}
.downArrowIcon {
  background: url("../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: black;
  transform: rotate(90deg); /*TODO in gimp*/
  display:inline-block;
  cursor: pointer;
  margin: 0 5px;
}
.upArrowIcon {
  background: url("../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: black;
  transform: rotate(270deg); /*TODO in gimp*/
  cursor: pointer;
  display:inline-block;
  margin: 0 5px;
}
.itemBody {
  padding: 10px;
}

.item {
  font-size: 1rem;
  line-height: 1.6rem;
  /* text-align: left; */
}

/* messages section */
#messages {
  margin-top: 15px;
}
.splitPane {
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid black;
}

.smCol {
  display: flex;
  flex-direction: column;
  padding: 0 5px;
}
.rightBorder {
  border-right: 1px solid black;
}

.lgCol {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1rem;
}
.display {
  display: inline-block;
}
.hide {
  display: none;
}
.datesData {
  padding-left: 20px;
}
.showVote {
  background: url("../assets/check_circle.svg") no-repeat center center;
  background-size: contain;
  width: 20px;
  height: 20px;
  display: inline-block;
}
.noVote {
  background: url("../assets/minus_x.svg") no-repeat center center;
  background-size: contain;
  width: 20px;
  height: 20px;
  display: inline-block;
}
.up {
  background: url("../assets/thumb_up.svg") no-repeat center center;
  background-size: contain;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: inline-block;
  margin: 0 5px 0 10px;
}
.down {
  background: url("../assets/thumb_down.svg") no-repeat center center;
  background-size: contain;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: inline-block;
}
.votesText {
  font-size: 0.8rem;
}
.votes {
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  align-items: center;
  margin-left: 15px;
}
.logEntry {
  font-size: 1rem;
  font-style: italic;
  padding: 5px;
  display: inline;
}
.buttonDisabled {
  display: none;
}
</style>