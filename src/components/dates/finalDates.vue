<template>
  <div class="row">
    <div class="calCol">
      <button @click="unfinalizeTripDates">Undo These Dates</button>
      <v-calendar ref="finalCal" :attributes="attr" ></v-calendar>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  mounted() {
    // Get the calendar ref
    const calendar = this.$refs.finalCal;
    // Moves to today's date
    calendar.move(new Date(this.thisTrip.dateStart.seconds*1000), { transition: "slide-h" });
  },
  computed: {
    attr: function () {
      return [
        {
          key: "today",
          highlight: true,
          // color: 'teal',
          dates: { start: new Date(this.thisTrip.dateStart.seconds*1000), end: new Date(this.thisTrip.dateEnd.seconds*1000)},
        },
      ];
    },
    ...mapState(["thisTrip"]),
  },

  methods: {
    unfinalizeTripDates() {
      console.log("unfinal dates");
      let data = {
        tid: this.thisTrip.id,
      };
      console.log(data);
      this.$store
        .dispatch("unfinalizeTripDatesAction", data)
        .then(() => {
          this.$toasted.show("Done!");
        })
        .catch((e) => {
          console.log(e);
          this.$toasted.show(e.message);
        });
    },
  },
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
  flex-grow:1;
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
</style>