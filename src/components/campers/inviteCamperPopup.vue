<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            Invite a Friend to Join
            <slot name="body"></slot>
          </div>
          <div class="sidenote">They must already have a Campers account,</div>
          <div class="sidenote">and the email you search must match their account</div>
          <!-- TODO invite them to create Campers account-->
          <div class="modal-body">
            <form v-on:submit.prevent>
              <!-- TODO   explain you already have to be friends and they have an account, pass tid prop               -->
              <label class="rowItem" for="newCamperEmail">Camper's Registered Email:</label>
              <input type="text" class="rowItem" id="newCamperEmail" placeholder="friend@email.com" />
              <div class="row rowStyle">
                <div class="loader" v-if="showSpinner"></div>
                <input
                  type="submit"
                  class="rowItem"
                  @click="sendNewInvite"
                  value="Invite"
                />
                <button class='rowItem'
                  @click="$emit('close')"
                  :disabled="disableClose"
                >Cancel</button>
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
  props: ["tripid"],
  data: function () {
    return {
      showSpinner: false,
      disableClose: false,
    };
  },
  methods: {
    toggleDisableClose() {
      this.disableClose = !this.disableClose;
    },
    sendNewInvite(e) {
      e.preventDefault();
      this.toggleDisableClose();
      this.showSpinner = true;
      console.log(document.getElementById("newCamperEmail").value);
      // TODO: grab friends UID, grab trip id prop, and dispatch
      this.$store
        .dispatch("inviteCamper", {
          email: document.getElementById("newCamperEmail").value,
          tid: this.tripid,
        })
        .then((res, rej) => {
          this.showSpinner = false;

          if (!res) {
            this.$toasted.show("No registered account.");
            console.log("no user found with that email");
          } else if (res === "duplicate") {
            this.$toasted.show("This user was already invited.");
            console.log("This user was already invited");
          } else if (res === "invited") {
            this.$toasted.show("Success! User invited.");
            this.$emit("close");
            console.log(res);
          } else {
            this.$toasted.show("Error: " + rej);
            console.log("error?", rej);
          }
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
  padding: 3px 10px;
}
button.rowItem {
  margin-left: 10px;
}
.sidenote {
  font-size: 0.9rem;
  font-style: italic;
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
</style>