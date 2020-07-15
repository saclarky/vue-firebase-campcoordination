<template>
  <div>
    <div>
      <div>Notifications</div>
      <!-- TODO filter responded, time frame etc -->
      <div v-for="alert in thisUserNotificationsGetter.tripInvites" :key="alert.id">
        <!-- from | time | category | message | actions/responded -->
        <span>
          {{alert.time}}
          -
          {{alert.text}}
        </span>
        <span>
          <button @click="joinTrip(alert.tid, alert.id, alert.isDeclined)" :class="{joined: alert.isJoined}" :disabled="alert.isJoined">Join</button>
          <button @click="declineTrip(alert.tid, alert.id, alert.isJoined)" :class="{declined: alert.isDeclined}" :disabled="alert.isDeclined">Decline</button>
          <!-- <button>Delete</button> -->
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  created() {
    this.$store.dispatch("bindUserNotifications").then(() => {
      console.log("User notifications reference bound.");
    });
  },
  computed: {
    ...mapGetters(["thisUserNotificationsGetter"])
  },
  methods: {
    joinTrip: function(tripID, notiID, isD) {
      console.log("tid: ", tripID, 'nid ', notiID);
      // change response to true?
      // disable buttons and add actual RSVP value in gray italics? Or...
      // is better UX to highlight the join button as the RSVP but leave everything active
      // because then could decline in the future if plans change, or re-join if declined.
      // TODO: in that case need a way for trip campers to remove/block user in the future if no longer invited...
      // retract invitation --> disable user notification join/decline w /disabled attribute, give a note like 'trip is full',
      // remove from pending
      this.$store
        .dispatch("joinTripAction", { tid: tripID, nid: notiID, isDeclined: isD })
        .then((res, rej) => {
          if (res) {
            this.$toasted.show("Done! Joined trip.");
            // TODO how indicate to vue that response is joined, getter action? and then assign highlight class to join button
            // and disable the join button...
          } else {
            this.$toasted.show(rej);
          }
        });
    },
    declineTrip: function(tripID, notiID, isJ) {
      this.$store
        .dispatch("declineTripAction", { tid: tripID, nid: notiID, isJoined: isJ })
        .then((res, rej) => {
          if (res) {
            this.$toasted.show("Done! Declined trip.");
            // TODO how indicate to vue that response is declined, getter action? and then assign highlight class to button
            // and disable the button...
          } else {
            this.$toasted.show(rej);
          }
        });
    }
  }
};
</script>

<style scoped>
.joined {
  border: 2px green solid;
}
.declined {
  border: 2px red solid;
}
</style>