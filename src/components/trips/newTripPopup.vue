<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <form v-on:submit.prevent class="column columnStyle">
              <div class="row header rowStyle teal">
                <label class="rowItem" for="newTripName">Trip Name:</label>
                <input
                  type="text"
                  class="rowItem"
                  id="newTripName"
                  placeholder="Desert Getaway 2020"
                  v-model="title"
                />
              </div>
               <div class="row rowStyle">
                 <input type="radio" name="dateFlex" value="true" id="flex" v-model="radioFlex" selected>
                 <label class="rowItem smText" for="flex">Finalized Dates</label>
                 <input type="radio" name="dateFlex" value="maybe" id="poss" v-model="radioFlex">
                 <label class="rowItem smText" for="poss">Possible Dates</label>
                 <input type="radio" name="dateFlex" value="false" id="hard" v-model="radioFlex">
                 <label class="rowItem smText" for="hard">No Dates</label>
              </div>
              <div v-if="radioFlex === 'true' || radioFlex === 'maybe'" class="row rowStyle">
                <!-- <div style="font-size:.8rem; color:red;"> Required: </div> -->
                <v-date-picker mode="range" v-model="range" is-inline />
              </div>

              
              <div class='column columnStyle'>
                <div class='teal'>Trip Type:</div>
                <div class="row rowStyle">
                 <input type="radio" name="tripType" value="true" id="group" v-model="group" selected>
                 <label class="rowItem smText" for="group">Group</label>
                 <input type="radio" name="tripType" value="false" id="ind" v-model="group">
                 <label class="rowItem smText" for="ind">Individual</label>
              </div></div>
              <div class='column leftColumn'>
              <div :class="{row:true, rowStyle:true, hidden:this.group=='false'}">
                <label class="rowItem smText" for="templateChoice">Group gear list:</label>
                <select class="rowItem" name="templateChoice" id="templateChoice" v-model="groupGearTemplate">
                  <option >None</option>
                  <option>My Group List</option>
                  <option>Generic List</option>
                </select>
              </div>
               <div class="row rowStyle">
                <label class="rowItem smText" for="templateChoiceI">Individual gear list:</label>
                <select class="rowItem" name="templateChoiceI" id="templateChoiceI" v-model="indGearTemplate">
                  <option >None</option>
                  <option>My List</option>
                  <option>Generic List</option>
                </select>
              </div>
              </div>

              <!-- TODO: choose list categories? -->
              <div class="row rowStyle">
                <input type="submit" class="rowItem" @click="saveNewTrip" value="Save" />
                <button @click="$emit('close')">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      range: {
        start: new Date(),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+2)
      },
      group: 'true',
      radioFlex: 'true',
      groupGearTemplate: 'None',
      indGearTemplate: 'None'
    }
  },
  
  methods: {
    saveNewTrip(e) {
      e.preventDefault();
      if (!this.title) {
        this.$toasted.show("Need a trip name!");
        return;
      }
      // DEFAULTS: flexible dates, today's dates, group trip, no gear list
      let booleanFlex
      let booleanGroup
      switch (this.radioFlex) {
        case true:
        case 'true':
          booleanFlex = true
          break
        default:
          booleanFlex = false
      }
      switch (this.group) {
        case true:
        case 'true':
          booleanGroup = true
          break
        default:
          booleanGroup = false
      }
      let data = {
        name: this.title,
        dateStart: this.range.start,
        dateEnd: this.range.end,
        finalDates: booleanFlex,
        group: booleanGroup,
        template: this.groupGearTemplate,
        indTemplate: this.indGearTemplate,
      };
      console.log(data)
      this.$store.dispatch("saveNewTripAction", data).then(() => {
        this.$emit("close");
          this.$toasted.show("Success! Trip Saved.");      
      }).catch(e => {
        console.log(e)
        this.$toasted.show(e.message)
      })
    },
  },
};
</script>

<style scoped>
.columnStyle {
  justify-content: center;
}
.leftColumn {
  align-items: flex-start;
}
.modal-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.modal-container {
  /* width: 300px; */
  max-height: 80%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow-y: scroll;
}

.modal-body {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.rowItem {
  padding: 0 5px;
}
button.rowItem {
  margin-left: 10px;
}

/* .modal-default-button {
  float: right;
} */

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.rowStyle {
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}
input,
button {
  margin: 5px;
}
.header {
  margin-bottom: 15px;
 
}
.teal {
   color: #42b983;
}
.smText {
  font-size: 1rem;
}
.hidden {
  display: none;
}
</style>