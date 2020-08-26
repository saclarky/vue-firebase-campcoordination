<template>
  <div>
     <!-- empty time fields/missing field dealt with in vuex getter -->
        <div v-for="invite in thisTripInviteLogs" :key="invite.id">
          <span class="logEntry">
            {{invite.time}}
            -
            {{invite.text}}
          </span>
        </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: function() {
    return {
     
    };
  },
  computed: {
    ...mapGetters(["thisTripInviteLogs"])

    
  },
 
 
};
</script>

<style scoped>
.logEntry {
  font-size: 1rem;
  font-style: italic;
  padding: 5px;
  display: inline;
  text-align:left;
}

</style>