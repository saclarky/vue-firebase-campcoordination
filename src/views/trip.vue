<template>
  <div class="main">
    <subnav>{{thisTrip.name}} ({{thisTrip.owner}})</subnav>
    <!-- <div class="hero">
      <div class="hero-top" id="nav-bar">
        <h1 class="hero-title">{{thisTrip.name}}</h1>
        <h2>Started by {{thisTrip.owner}}</h2>
      </div>
      <div class="hero-bottom">
    <div class="hero-content">-->
    <!-- TODO: new trip action, hidden form? -->
    <!-- <a @click="toggleAddTrip" class="hero-cta-button button grow">New Trip</a> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- </div>  -->

    <div class="content">
      <div v-if="showDashboard" class="dashboard">
        <div class="gridWrapper">
          <div class="row splitPane">
            <div class="smCol rightBorder">
              Dates
              <button @click="toggleTripDatesPopup">Suggest New Dates</button>
            </div>
            <div class="lgCol datesData" v-for="date in thisTripDatesGetter" :key="date.id">
              <p>
                {{date.user}}
                <span :class="{display:date.flexible, hide:!date.flexible}">(flexible)</span>
                <span :class="{display:!date.flexible, hide:date.flexible}">(hard)</span>
                : {{date.startDate}} - {{date.endDate}}
                <span
                  class="up"
                  @click="vote(true, date.id)"
                ></span>
                <span class="down" @click="vote(false, date.id)"></span>
                <span v-for="(vote, name) in date.votes" :key="name" class="votes">
                  <span :class="{showVote:vote, noVote:!vote}"></span>
                  <span class="votesText">{{name}}</span>
                </span>
              </p>
            </div>
          </div>
          <newTripDatesPopup
            v-if="showTripDatesPopup"
            @close="toggleTripDatesPopup"
            :tid="thisTrip.id"
          ></newTripDatesPopup>

          <div class="row splitPane">
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
              <div>Activity Log</div>
              <!-- empty time fields/missing field dealt with in vuex getter -->
              <div v-for="invite in thisTripInviteLogs" :key="invite.id">
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
        
          <div class="gridItem">
            <h4>Meals</h4>
            <div class="itemBody"></div>
            <i class="plusIcon"></i>
          </div>

          <div class="gridItem">
            <h4>Itinerary</h4>
            <div class="itemBody"></div>
            <i class="plusIcon"></i>
          </div>
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
import newTripDatesPopup from "../components/newTripDatesPopup";
import gear from './gear'
import subnav from "../components/subnav";

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
    newTripDatesPopup,
    inviteCamperPopup,
    gear
  },
  computed: {
    ...mapState([
      "thisTrip",
      "thisTripCampers",
      "thisTripCampersNo",
      "thisTripCampersPending",
    ]),
    ...mapGetters(["thisTripDatesGetter", "thisTripInviteLogs"]),
  },
  data: function () {
    return {
      showDashboard: true,
      showMessages: true,
      showInviteCamper: false,
      showTripDatesPopup: false,
    };
  },
  methods: {
    toggleAddCamper() {
      this.showInviteCamper = !this.showInviteCamper;
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
    },
    toggleTripDatesPopup() {
      this.showTripDatesPopup = !this.showTripDatesPopup;
    },
    toGear() {
      this.$router.push("/gear");
    },
    vote(v, i) {
      let data = {
        tid: this.thisTrip.id,
        vote: v,
        dateID: i,
      };
      console.log("vote ", data);
      // save to the trip dates document "votes" object
      this.$store
        .dispatch("tripDatesVote", data)
        .then(() => {
          this.$toasted.show("Voted!");
        })
        .catch((e) => {
          console.log(e);
          this.$toasted.show(e.message);
        });
      // disable whichever vote chosen, but allow to change vote
    },
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
.main {
  position: relative;
  top: 100px;
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