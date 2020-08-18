<template>
  <div>
  
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
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  computed: {
    ...mapState(["thisTrip"]),
    ...mapGetters(["thisTripDatesGetter"])
  },
  methods: {
   
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
    }
  }
};
</script>
<style scoped>
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
.datesData {
  padding-left: 20px;
}
.showVote {
  background: url("../../assets/check_circle.svg") no-repeat center center;
  background-size: contain;
  width: 20px;
  height: 20px;
  display: inline-block;
}
.noVote {
  background: url("../../assets/minus_x.svg") no-repeat center center;
  background-size: contain;
  width: 20px;
  height: 20px;
  display: inline-block;
}
.up {
  background: url("../../assets/thumb_up.svg") no-repeat center center;
  background-size: contain;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: inline-block;
  margin: 0 5px 0 10px;
}
.down {
  background: url("../../assets/thumb_down.svg") no-repeat center center;
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
.display {
  display: inline-block;
}
.hide {
  display: none;
}
</style>