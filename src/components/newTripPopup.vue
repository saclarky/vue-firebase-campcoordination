<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <!-- default header -->
            </slot>
          </div>

          <div class="modal-body">
            <form v-on:submit.prevent>
              <label class="rowItem" for="newTripName">Trip Name:</label>
              <input type="text" class="rowItem" id="newTripName" placeholder="Desert Getaway 2020" />
              <label class="rowItem" for="templateChoice">Choose a pre-populated gear list:</label>
              <select class="rowItem" name="templateChoice" id="templateChoice">
                <option selected="None">None</option>
                <option>My List</option>
                <option>Generic List</option>
              </select>
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
  methods: {
    saveNewTrip(e) {
      e.preventDefault();
      if (!document.getElementById("newTripName").value) {
        this.$toasted.show("Need a trip name!");
        return;
      }
      let data = {
        name: document.getElementById("newTripName").value,
        template: document.getElementById("templateChoice").value,
      };
      console.log(document.getElementById("templateChoice").value);
      this.$store.dispatch("saveNewTripAction", data).then((res, rej) => {
        this.$emit("close");
        if (res) {
          this.$toasted.show("Success! Trip Saved.");
          console.log(res);
        } else {
          this.$toasted.show("Error: " + rej);
          console.log("error?", rej);
        }
      });
    },
  },
};
</script>

<style>
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
}

.modal-container {
  /* width: 300px; */
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  /* font-family: Helvetica, Arial, sans-serif; */
}

.modal-header {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
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
  margin: 5px 0;
}
</style>