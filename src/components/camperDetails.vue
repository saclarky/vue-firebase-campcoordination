<template>
  <div>
    <div class="row actionRow" @click="returnToDashboard()">
      <div class="leftArrowIcon clickable"></div>
      <p class="clickable">Trip</p>
      <p>&#47;&#47;</p>
      <p>Camper Details</p>
      <div class="actionRowPlaceholder"></div>
    </div>

    <div class="row">
      <i @click="toggleAddUser" class="plusIcon"></i>
      <div class="wrapper col1">
        <div>Confirmed, can edit trip page</div>
        <div v-for="(yes, uid) in thisTripCampers" :key="uid">
          {{yes}}
          <button @click="removeCamper(uid)" :class="{buttonDisabled: thisTrip.uid === uid} ">remove</button>
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
      <div class="wrapper col2">
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
    <!-- use the modal component, pass in the prop -->
    <inviteCamperPopup @closeInvite="toggleAddUser()" v-if="showInviteUser" :tripid="thisTripID">
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
import { mapGetters, mapState } from "vuex";
import inviteCamperPopup from "../components/inviteCamperPopup";
export default {
  data: function() {
    return {
      showInviteUser: false
    };
  },
  computed: {
    ...mapGetters(["thisTripInviteLogs"]),

    ...mapState([
      "thisTripCampers",
      "thisTripCampersNo",
      "thisTripCampersPending",
      "thisTrip",
      "thisTripID"
    ])
  },
  components: {
    inviteCamperPopup
  },
  methods: {
    toggleAddUser() {
      this.showInviteUser = !this.showInviteUser;
    },
    returnToDashboard() {
      this.$emit("closeCamperDetails");
    },
    removeCamper(camperID) {
      // TODO: don't have 'remove' button by the camp owner. disabled?
      console.log("Remove ",camperID);
      if (camperID !== this.thisTrip.uid) {
         let camperTable
          let name
            if(Object.keys(this.thisTripCampers).includes(camperID)) {
              camperTable = 'campers'
              name= this.thisTripCampers[camperID]
            }
            if(Object.keys(this.thisTripCampersNo).includes(camperID)) {
              camperTable = 'campersNo'
              name= this.thisTripCampersNo[camperID]
            }if(Object.keys(this.thisTripCampersPending).includes(camperID)) {
              camperTable = 'campersPending'              
              name= this.thisTripCampersPending[camperID]
            }
            
        this.$store
          .dispatch("removeCamperAction", { 'cid': camperID, 'name': name, 'camperTable':camperTable })
          .then(() => {
            this.$toasted.show("Camper removed.");
          })
          .catch(e => {
            this.$toasted.show(e.message);
          });
      } else {
        this.$toasted.show("Cannot delete trip owner.");
      }
    }
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.actionRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  padding: 10px;
}
.actionRow > p {
  margin-left: 10px;
  font-size: 1rem;
}

.actionRowPlaceholder {
  flex: 1;
}
.leftArrowIcon {
  background: url("../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: black;
  transform: rotate(180deg); /*TODO in gimp*/
}

.clickable {
  cursor: pointer;
}
.logEntry {
  font-size: 1rem;
  font-style: italic;
  padding: 5px;
  display: inline;
}
.plusIcon {
  background: url("../assets/add-plus.svg") no-repeat center center;
  background-size: contain;
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
  cursor: pointer;
}
.buttonDisabled {
  display: none;
}
</style>