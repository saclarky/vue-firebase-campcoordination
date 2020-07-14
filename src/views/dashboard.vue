<template>
    <div>
        <div>
        <div>Notifications</div>
        <!-- TODO filter responded, time frame etc -->
        <div v-for="alert in thisUserNotificationsGetter" :key="alert.id">
            <!-- from | time | category | message | actions/responded -->
          <span>
            {{alert.time}}
            -
            {{alert.text}}
          </span>
          <span> <button @click="joinTrip(alert.tid)">Join</button> <button>Decline</button> <button>Delete</button></span>
        </div>
      </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
    export default {
        created() {
          this.$store.dispatch('bindUserNotifications').then(col => {
            console.log(col)
          })
  },
  computed: {
    ...mapGetters(['thisUserNotificationsGetter'])
  },
  methods: {
    joinTrip: (tripID) => {
      console.log("tid: ", tripID)
    }
  }
    }
</script>

<style scoped>

</style>