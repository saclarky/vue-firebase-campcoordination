<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <form v-on:submit.prevent class="column columnStyle">
              
              
              <div class="row rowStyle">
               <span class="rowItem">Edit date and time: </span>
                 <date-time-picker inline v-model="editEntryDate" format="fff"></date-time-picker>
              </div>
                
  <div class="row rowStyle">
<label for='food' class="rowItem" >Edit Entry:</label>
<input v-model='items' id='food' :placeholder='items'>
</div>
              <div class="row rowStyle">
                <input type="submit" class="rowItem" @click="updateEntry" value="Save" />
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
import DateTimePicker from 'vue-vanilla-datetime-picker';

export default {
  components: {
    DateTimePicker
  },
  data() {
    return {
        editEntryDate: this.entry.dateJS,
       items: this.entry.entry
    }
  },
 
  props: ['entry','tid'],
  methods: {
     updateEntry(e) {
       e.preventDefault();
       if (this.editEntryDate == this.entry.dateJS && this.items == this.entry.entry) {
         this.$toasted.show("No changes made!")
         return
       }
      let data = {
        id: this.entry.id,
        tid: this.tid,
        newDate: this.editEntryDate,
        items: this.items
      };
     
      console.log(data)
      // Add new date to tripDates
      this.$store.dispatch('updateItinEntryAction', data).then(() => {
        this.$emit("close");
       this.$toasted.show('Entry updated!')
      }).catch(e => {
        console.log(e)
        this.$toasted.show(e.message)
      })
    }
   
  }
};
</script>

<style scoped>
@import "../../../node_modules/vue-vanilla-datetime-picker/dist/DateTimePicker.css";
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