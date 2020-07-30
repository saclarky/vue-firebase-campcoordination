<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">Change Category's Name</div>
          <div class="modal-body">
            <form v-on:submit.prevent>
            <div>
              <input type="text" class="rowItem" id="newItemCat" v-model="addGearCat" :placeholder="itemcat" autofocu>
            </div>
            <div class="row rowStyle">
              <div class="loader" v-if="showSpinner"></div>
              <input type="submit" class="rowItem" @click="updateGearCategory" value="Save" />
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
export default {
  props: ["itemcat", "itempage"],
  data: function () {
    return {
      addGearCat: "",
      showSpinner: false,
    };
  },
  methods: {
    updateGearCategory: function (e) {
      e.preventDefault();
      if (this.addGearCat === "" || this.addGearCat === this.itemcat) {
        this.$toasted.show("No changes made!");
        return;
      }
      this.showSpinner = true;
      let data = {
        newCategory: this.addGearCat,
        page: this.itempage,
      };
      if (this.itemcat === "Miscellaneous") {
        data.category = "";
      } else {
        data.category = this.itemcat;
      }
      this.$store
        .dispatch("updateGearCategory", data)
        .then((res) => {
          this.showSpinner = false;
          this.$toasted.show(res);
          if (res === "Updated category!") {
            this.$emit("close");
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.rowStyle {
  justify-content: center;
  margin: 5px 0;
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
.plusHide {
  display: none;
}
.plusShow {
  display: inline-block;
}
.plusIcon {
  background: url("../assets/add-plus.svg") no-repeat center center;
  background-size: contain;
  width: 24px;
  height: 24px;
  cursor: pointer;
  vertical-align: middle;
  padding: 10px;
}
.minusIcon {
  background: url("../assets/add-minus.svg") no-repeat center center;
  background-size: contain;
  width: 24px;
  height: 24px;
  cursor: pointer;
  vertical-align: middle;
  padding: 10px;
}
</style>