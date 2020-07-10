<template>
  <div>
    <div class="row actionRow" @click="returnToDashboard()">
      <div class="leftArrowIcon clickable"></div>
      <p class="clickable">Dashboard</p>
      <p>&#47;&#47;</p>
      <p>Camper Details</p>
      <div class="actionRowPlaceholder"></div>
    </div>

    <div class="row">
      <div class="wrapper col1">
           <div>Confirmed, can edit trip page</div>
        <div v-for="yes in thisTripCampers" :key="yes">{{yes}}</div>
        <div>Pending, can view trip page</div>
        <div v-for="rsvp in thisTripCampersPending" :key="rsvp">{{rsvp}}</div>
        <div>Declined, no access to the trip</div>
        <div v-for="no in thisTripCampersNo" :key="no">{{no}}</div>
       
      </div>
      <div class="wrapper col2">
        <div>Activity Log</div>

        <!-- TODO what if there are empty fields, e.g. no time throews Date() error -- validatedInvites computed? -->
        <div v-for="invite in invitesVerified" :key="invite.id">
          <span class="logEntry">
            {{invite.time}}
            -
            {{invite.text}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data: function() {
    return {};
  },
  computed: {
  
...mapGetters(['thisTripCampersNames', 'thisTripCampersNoNames','thisTripCampersPendingNames']),
...mapState({
    invitesVerified: state => {
      let modified = [];
      state.thisTripInvites.forEach(invite => {
        let modInvite = invite;
        if ("time" in invite) {
          let dd = new Date(invite.time);
          //am/pm
          let hours = dd.getHours();
          let flipper = " AM";
          if (hours >= 12) {
            hours = hours - 12;
            flipper = " PM";
          }
          if (hours == 0) {
            hours = 12;
          }
          let m = dd.getMinutes();
          m = m < 10 ? "0" + m : m;

          modInvite.time =
            dd.getDate() +
            " " +
            dd.toLocaleString("default", {
              month: "long"
            }) +
            " " +
            dd.getFullYear() +
            " " +
            hours +
            ":" +
            m +
            flipper;
        } else {
          modInvite.time = "TBD";
        }
        modified.push(modInvite);
      });
      return modified;
    }
  })
  },
  methods: {
    returnToDashboard() {
      this.$emit("closeCamperDetails");
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
</style>