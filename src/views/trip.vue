<template>
  <div id="topScroll" class="main">
    <div class="hero">
      <div class="hero-top" id="nav-bar">
        <h1 class="hero-title hero-items">{{thisTrip.name}}</h1>
        <div class="hero-icon hero-items"></div>
        <h2 class="heroSubTitle hero-items">Started by {{thisTrip.owner}}</h2>
      </div>
      <div class="hero-bottom">
        <div class="hero-content">
          <!-- TODO: new trip action, hidden form? -->
          <div class="typeColor">
            <span v-if="thisTrip.group===true">Group Trip</span>
            <span v-if="thisTrip.group===false">Individual Trip</span>
          </div>
          <!-- <a v-if="!thisTrip.group" @click="toggleTripType" class="hero-cta-button button grow">Make Group Trip</a> -->
        </div>
      </div>
    </div>

    <div class="content">
      <div v-if="showDashboard" class="dashboard">
        <div class="gridWrapper">
          <div id="datesSection" class="row splitPane scroller">
            <div class="smCol rightBorder">
              Dates
              <button
                v-if="!thisTrip.finalDates"
                @click="toggleTripDatesPopup"
              >Suggest New Dates</button>
            </div>
            <dates v-if="!thisTrip.finalDates"></dates>
            <finalDates
              :thisTripDateStart="thisTrip.dateStart"
              :thisTripDateEnd="thisTrip.dateEnd"
              v-if="thisTrip.finalDates"
            ></finalDates>
          </div>
          <newTripDatesPopup
            v-if="showTripDatesPopup"
            @close="toggleTripDatesPopup"
            :tid="thisTrip.id"
            :tidName="thisTrip.name"
          ></newTripDatesPopup>

          <div id="campersSection" :class="{row:true, splitPane:true, hide: !thisTrip.group, scroller:true}" >
            <div class="smCol rightBorder">
              Campers
              <button @click="toggleAddCamper">Invite</button>
            </div>
            <div class="lgCol datesData">
              <campers></campers>
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

          <div id="gearSection" class="row splitPane scroller">
            <div class="smCol rightBorder">Gear</div>
            <div class="lgCol datesData">
              <gear></gear>
            </div>
          </div>

          <div id="mealsSection" class="row splitPane scroller">
            <div class="smCol rightBorder">Meals</div>
            <div class="lgCol datesData">
              <meals></meals>
            </div>
          </div>

          <div id="itinerarySection" class="row splitPane scroller">
            <div class="smCol rightBorder">
              Itinerary
              <button @click="toggleNewItinEntry">Add Entry</button>
            </div>
            <div class="lgCol datesData">
              <itinerary></itinerary>
            </div>
          </div>
          <newItinEntryPopup v-if="showNewItinEntry" @close="toggleNewItinEntry" :tid="thisTrip.id"></newItinEntryPopup>

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
      <hr />
      <div id="activityLogSection" class="row splitPane scroller">
        <div class="smCol rightBorder">Activity Log</div>
        <div class="lgCol datesData">
          <activityLog></activityLog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import inviteCamperPopup from "../components/campers/inviteCamperPopup";
import campers from "../components/campers/campers";
import dates from "../components/dates/dates";
import finalDates from "../components/dates/finalDates";
import newTripDatesPopup from "../components/dates/newTripDatesPopup";
import gear from "../components/gear";
import meals from "../components/meals";
// import subnav from "../components/subnav";
import itinerary from "../components/itinerary/itinerary";
import newItinEntryPopup from "../components/itinerary/newItinEntryPopup";
import activityLog from "../components/activityLog";

export default {
  name: "trip",
  created() {
    // TODO: if trip object empty route to trips
    if (this.$store.state.thisTrip.id === undefined) {
      console.log("no trip, pushing to trips");
      this.$router.push({ path: "/trips" });
    }
  },
  mounted() {
    console.log("mounted");
    // Cache selectors
    var topMenu = document.getElementById("subnavSection"),
      // topMenuHeight = topMenu.outerHeight()+15,
      // topMenuHeight = '116px',
      // All list items
      menuItems = topMenu.children,
      // Divs corresponding to menu items
      scrollItems = [];
    for (let i = 0; i < menuItems.length; i++) {
      var itemA = menuItems[i].getAttribute("href").split("#")[1];
      var item = document.getElementById(itemA);
      // console.log(item)
      if (item) {
        scrollItems.push(item);
      }
    }

    // Bind to scroll
    window.addEventListener("scroll", function () {
      // Get container scroll position
      var fromTop = window.pageYOffset + 100;

      //  console.log('window',window.pageYOffset,window.pageYOffset+116)
      // Get id of current scroll item
      var cur = [];
      scrollItems.forEach(function (t) {
        //  console.log(t.id,fromTop, t.offsetTop, t.getBoundingClientRect())
        if (t.offsetTop < fromTop) cur.push(t);
      });
      //  console.log(cur)
      // Get the id of the current element
      if (cur.length === 0) {
        //empty, no matches
        cur = [scrollItems[0]];
        //  console.log(cur)
      }
      var id = cur[cur.length - 1].id;
      //  var id = cur[0].id
      //  console.log(id)
      menuItems.forEach((t) => {
        t.classList.remove("active");
      });
      menuItems.forEach((t) => {
        //  console.log(t.getAttribute("href"))
        if (t.getAttribute("href") == "#" + id) {
          //  console.log("MATCH")
          t.classList.add("active");
          return;
        }
      });
      //  // Set/remove active class
    });
  },
  components: {
    // subnav,
    dates,
    finalDates,
    newTripDatesPopup,
    inviteCamperPopup,
    campers,
    gear,
    meals,
    itinerary,
    newItinEntryPopup,
    activityLog,
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
      showCamperActivityLog: false,
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
      console.log(this.showCamperActivityLog);
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
  display: flex;
  flex-flow: column nowrap;
  background: linear-gradient(
      rgba(45, 45, 45, 0.6),
      rgba(0, 0, 0, 0.37),
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5)
    ),
    url(../assets/ryan-bahm-fMMpsyHCeK0-unsplash.jpg) no-repeat 0 -230px;
  background-size: cover;
  height: 150px;
  width: 100%;
  justify-content: center;
  /*margin-bottom: 15px;*/
}
.hero-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* padding: 15px 0; */
  color: #f7ffff;
  padding: 5px 0;
}
.hero-items {
  margin: 0 5px;
}
.hero-bottom {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  /* flex: 1; */
  padding: 0 15px;
}
.hero-icon {
  background: url("../assets/CampingW.png") no-repeat center center;
  background-size: contain;
  width: 30px;
  height: 30px;
  margin-bottom: 8px;
}
.hero-title {
  font-size: 1.5rem;
  /* font-family: 'Heebo', sans-serif; */
  font-weight: normal;
}
.heroSubTitle {
  font-size: 1.1rem;
  /* font-family: 'Heebo', sans-serif; */
  font-weight: normal;
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
  display: inline-block;
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
  display: inline-block;
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
.typeColor {
  color: white;
  font-size: 1.3rem;
  font-family: "Kalam", cursive;
}
</style>