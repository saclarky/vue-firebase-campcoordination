<template>
  <div>
     <!-- empty time fields/missing field dealt with in vuex getter -->
        <div class='logLine' v-for="invite in thisTripInviteLogs" :key="invite.id">
          <span class='categoryLine'>  {{invite.category}} </span>
          <span class='logEntry'>{{invite.text}} -</span>
          <span class="timeLine">
                          {{invite.time}}        
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
  
  padding: 5px;
  display: inline;
  text-align:left;
}
.timeLine {
font-style: italic;
font-size: .9rem;
}
.logLine {
  padding: 3px 0;
}
.categoryLine {
  font-size: 0.8rem;
  padding-right: 10px;
  color: gray;
}
</style>