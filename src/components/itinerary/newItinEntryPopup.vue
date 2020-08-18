<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <form v-on:submit.prevent class="column columnStyle">
               <div class="row rowStyle">
               <span class="rowItem">Set time: </span>              
              <vue-timepicker format="hh:mm A" :minute-interval="10" v-model="newEntryTime" close-on-complete></vue-timepicker>
              </div>
              
              <div class="row rowStyle">
               <span class="rowItem">Set date: </span>
                <v-date-picker mode="single" v-model="newEntryDate" is-inline />               
              </div>
                
  <div class="row rowStyle">
<label for='itinAdd' class="rowItem" >Add Entry:</label>
 <input v-model="newEntryText" id="itinAdd" placeholder="e.g. Carpool meet-up" />
</div>
              <div class="row rowStyle">
                <input type="submit" class="rowItem" @click="addEntry" value="Save" />
                <button class='rowItem' @click="$emit('close')">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import VueTimepicker from 'vue2-timepicker';
export default {
  components: { VueTimepicker },
  data() {
    return {
        newEntryDate: new Date(),
        newEntryTime: {
        hh: "08",
        mm: "00",
        a: "AM",
      },
       newEntryText: ''
    }
  },
 
  props: ['tid'],
  methods: {
     newEntry(e) {
       e.preventDefault();
      if (!this.newEntryText) {
        this.$toasted.show("Please add a description.");
        return;
      }
      if (!this.newEntryDate) {
        this.$toasted.show("Please add a date.");
        return;
      }
      if (!this.newEntryTime) {
        this.$toasted.show("Please add a time.");
        return;
      }
      let h;
      if (this.newEntryTime.hh != 12 && this.newEntryTime.A === "PM") {     
        h = parseInt(this.newEntryTime.hh) + 12        
      } else if (this.newEntryTime.hh == 12 && this.newEntryTime.A == "AM") {
        h = 0;
      } else {
        h = this.newEntryTime.hh;
      }
      let data = {
        tid: this.thisTrip.id,
        date: new Date(
          this.newEntryDate.getFullYear(),
          this.newEntryDate.getMonth(),
          this.newEntryDate.getDate(),
          h,
          this.newEntryTime.mm
        ),
        // time: this.newEntryTime,
        items: this.newEntryText,
      };
      console.log(data);
      // Add new date to tripDates
      this.$store.dispatch('addItinEntry', data).then(() => {
        this.$emit("close");
        this.newEntryText=''
        this.newEntryDate=''
       this.$toasted.show('Entry added!')
      }).catch(e => {
        console.log(e)
        this.$toasted.show(e.message)
      })
    }
    
}}
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
  z-index: 9998;
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
  padding: 3px 10px;
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