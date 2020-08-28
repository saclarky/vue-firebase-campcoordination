<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <form v-on:submit.prevent class="column columnStyle">
              <div class="row rowStyle">
                <label for="editItinEntryPop" class="rowItem">Edit Entry:</label>
                <input v-model="items" id="editItinEntryPop" :placeholder="items" />
              </div>
              <div class="row rowStyle">
                <span class="rowItem">Edit Time:</span>
                <vue-timepicker
                  format="hh:mm A"
                  :minute-interval="10"
                  v-model="editEntryTime"
                  close-on-complete
                ></vue-timepicker>
              </div>
              <div class="row rowStyle">
                <span class="rowItem">Edit Date:</span>
                <v-date-picker mode="single" v-model="editEntryDate" is-inline />
              </div>

              <div class="row rowStyle2">
                <div class="loader" v-if="showSpinner"></div>
                <input type="submit" class="rowItem" @click="updateEntry" value="Save" />
                <button class="rowItem" @click="$emit('close')">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import VueTimepicker from "vue2-timepicker";
export default {
 created() {
this.editEntryTime = this.objTime
 },
  components: { VueTimepicker },
  data() {
    return {
      showSpinner: false,
      editEntryDate: this.entry.dateJS,
      editEntryTime: {
        hh: '',
        mm: '',
        A: "",
      },
      items: this.entry.entry,
    };
  },
  computed: {
    objTime: function() {
      let h, aa, m;
      //12pm - 11pm
      if (this.entry.dateJS.getHours() >= 12) {
        aa = "PM";
        if (this.entry.dateJS.getHours() > 12) {
          h = this.entry.dateJS.getHours() - 12;
        } else {
          h = this.entry.dateJS.getHours();
        }
      }
      // midnight
      else if (this.entry.dateJS.getHours() == 0) {
        h = 12;
        aa = "AM";
      } else {
        aa = "AM";
        h = this.entry.dateJS.getHours();
      }
      if (String(this.entry.dateJS.getMinutes()).length < 2) {
        m = "0" + String(this.entry.dateJS.getMinutes())
      } else {
        m =String(this.entry.dateJS.getMinutes())
      }
      return {hh: String(h), mm:m, A:aa}
    }    
  },
  props: ["entry", "tid"],
  methods: {
    updateEntry(e) {
      e.preventDefault();
      this.showSpinner = true;
      if (
        this.editEntryDate == this.entry.dateJS &&
        this.items == this.entry.entry &&
        this.editEntryTime.hh == this.objTime.hh &&
        this.editEntryTime.mm == this.objTime.mm &&
        this.editEntryTime.A == this.objTime.A
      ) {
        this.showSpinner = false;
        this.$toasted.show("No changes made!");
        return;
      }
      // If no changes made to just time
      if (this.editEntryTime.hh=="" && this.editEntryTime.mm=="" && this.editEntryTime.A=='') {
        this.editEntryTime = this.objTime
      } else if (this.editEntryTime.hh=="") {
        this.showSpinner = false;
        this.$toasted.show("Please choose an hour.")
        return
      }else if (this.editEntryTime.mm=="") {
        this.showSpinner = false;
        this.$toasted.show("Please choose minutes.")
        return
      }else if (this.editEntryTime.A=="") {
        this.showSpinner = false;
        this.$toasted.show("Please choose AM or PM.")
        return
      }

      let h;
      if (this.editEntryTime.hh != 12 && this.editEntryTime.A === "PM") {
        h = parseInt(this.editEntryTime.hh) + 12;
      } else if (this.editEntryTime.hh == 12 && this.editEntryTime.A == "AM") {
        h = 0;
      } else {
        h = this.editEntryTime.hh;
      }
      let data = {
        id: this.entry.id,
        tid: this.tid,
        newDate: new Date(
          this.editEntryDate.getFullYear(),
          this.editEntryDate.getMonth(),
          this.editEntryDate.getDate(),
          h,
          this.editEntryTime.mm
        ),
        items: this.items,
      };

      console.log(data);
      // Add new date to tripDates
      this.$store
        .dispatch("updateItinEntryAction", data)
        .then(() => {
          this.showSpinner = false;
          this.$emit("close");
          this.$toasted.show("Updated!");
        })
        .catch((e) => {
          this.showSpinner = false;
          console.log(e);
          this.$toasted.show(e.message);
        });
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
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}
.rowStyle2 {
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