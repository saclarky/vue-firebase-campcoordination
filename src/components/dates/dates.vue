<template>
  <div class='row'>
    <div class='calCol'>
        <v-calendar ref="datesCal" :attributes="attrs"></v-calendar>
      </div>
  <div class='lgCol'>
   
      <div class="datesData" v-for="date in thisTripDatesGetter" :key="date.id">
        <div class='datesRow'>
           <span class="deleteIcon" @click="toggleDatesDelete(date.id)">
                  <svg width="22px" height="22px" viewbox="0 0 22 22">
                    <path
                      fill="#c0c0c0"
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
                    />
                  </svg>
                </span>
  
         <span :id="date.id" class='theDates' @click="moveCal(date.id,date.startDate)"> {{date.startDate}} - {{date.endDate}} </span>
          <span
            class="up"
            @click="vote(true, date.id)"
          ></span>
          <span class="down" @click="vote(false, date.id)"></span>
          <button class='choose' @click='finalDates(date.startDate, date.endDate)'>Finalize These Dates</button>
          </div>
          <span v-for="(vote, name) in date.votes" :key="name" class="votes">
            <span :class="{showVote:vote, noVote:!vote}"></span>
            <span class="votesText">{{name}}</span>
          </span>
        
      </div>
  </div>
      
    <deleteTripDatesPopup v-if="showDeleteTripDates" @close="toggleDatesDelete('')" :ddid="datesID" :tid="thisTrip.id"></deleteTripDatesPopup>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import deleteTripDatesPopup from './deleteTripDatesPopup'
export default {
 mounted() {
console.log(this.thisTripDatesGetter[0])
var startCalPage = this.thisTripDatesGetter[0].startDate
document.getElementById(this.thisTripDatesGetter[0].id).style.color='#43c3f7'
// Get the calendar ref
const calendar = this.$refs.datesCal

// Moves to today's date
if(startCalPage) {
 calendar.move(new Date(Date.parse(startCalPage)), {transition:'slide-h'})
}
 },
 components: {deleteTripDatesPopup},
 data() {
return {
  datesID: '',
  showDeleteTripDates: false
}
 },
  computed: {
    attrs: function() {
      let vcd = []
      console.log('empty? UNDFND', this.thisTripDates)
      if(this.thisTripDates) {
this.thisTripDates.forEach(element => {
        vcd.push({start: new Date(Date.parse(element.startDate)), end: new Date(Date.parse(element.endDate))})
      });
      } else {
        vcd = [{start: new Date(), end: new Date().getDate()+2}]
      }
      
      return [
        {
          key: 'today',
          highlight: true,
          // color: 'teal',
          dates: vcd
        }
      ]
    },
   
    ...mapState(["thisTrip",'thisTripDates']),
    ...mapGetters(["thisTripDatesGetter"])
  },
  methods: {
   toggleDatesDelete(did) {
     this.datesID = did;
     this.showDeleteTripDates = !this.showDeleteTripDates;
   },
   moveCal(idSearch,dd) {
     document.getElementsByClassName('theDates').forEach(item => {
       item.style.color="#3a3a3a"
     })
     document.getElementById(idSearch).style.color='#43c3f7'
    // Get the calendar ref
const calendar = this.$refs.datesCal

// Moves to today's date
 calendar.move(new Date(Date.parse(dd)), {transition:'slide-h'})

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
    finalDates(start, end) {
      // trip.finalDates==true
     console.log('final dates')
     let data = {
       final: true,
        tid: this.thisTrip.id,
        start: new Date(Date.parse(start)),
        end: new Date(Date.parse(end)),
         creator: this.$store.state.currentUser.displayName,
        name: this.thisTrip.name,
        uid: this.$store.state.currentUser.uid
      };
      this.$store
        .dispatch("finalizeTripDatesAction", data)
        .then(() => {
          this.$toasted.show("Finalized dates!");
        })
        .catch((e) => {
          console.log(e);
          this.$toasted.show(e.message);
        });
      //trip.dateStart/End = dates


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
.calCol {
  margin: 0 10px;
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
  margin-bottom: 20px;
}
.theDates:hover {
  color: #43c3f7;
}

.datesRow {
  display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
}
.showVote {
  background: url("../../assets/circle_tick_grey.svg") no-repeat center center;
  background-size: contain;
  width: 20px;
  height: 20px;
  display: inline-block;
  padding-right:10px;
}
.noVote {
  background: url("../../assets/circle_cancel_grey.svg") no-repeat center center;
  background-size: contain;
  width: 20px;
  height: 20px;
  display: inline-block;
  padding-right:10px;
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
  color: #637381;
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
.theDates {
    /* font-weight: bold; */
    color: #3a3a3a;
    cursor: pointer;
}
.deleteIcon {
  /* background: url("../assets/delete.svg") no-repeat center center; */
  /* background-size: contain; */
  width: 22px;
  height: 22px;
  cursor: pointer;
  /* vertical-align: middle; */
  /* padding: 12px; */
  display: inline-block;

  /* padding: 0 9px 9px 9px; */
}
.choose {
  margin: 0 15px;
}
</style>