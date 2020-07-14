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
          <span> <button @click="joinTrip(alert.tid)">Join</button> <button >Decline</button> <button>Delete</button></span>
        </div>
      </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
    export default {
        created() {
          this.$store.dispatch('bindUserNotifications').then(() => {
            console.log('User notifications reference bound.')
          })
  },
  computed: {
    ...mapGetters(['thisUserNotificationsGetter'])
  },
  methods: {
    joinTrip: (tripID) => {
      console.log("tid: ", tripID)
      // Trip notification
      // User notifications? It's a trip-level message so maybe not to an individual...
      // add to Campers for tid/ rm() from pending
      // change response to true?
      // disable buttons and add actual RSVP value in gray italics? Or...
      // is better UX to highlight the join button as the RSVP but leave everything active
      // because then could decline in the future if plans change, or re-join if declined.
      // TODO: in that case need a way for trip campers to remove/block user in the future if no longer invited...
      // retract invitation --> disable user notification join/decline w /disabled attribute, give a note like 'trip is full',
      // remove from pending 

    }
  }
    }
</script>

<style scoped>

</style>