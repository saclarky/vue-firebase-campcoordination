<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">Update {{itemtitle}}</div>

          <div class="modal-body">
            <form v-on:submit.prevent>
            <div class="row">
              <label class="rowItem" for="newItemTitle">Update Title:</label>
              <input type="text"
                class="rowItem"
                id="newItemTitle"
                v-model="addGroupGearTitle"
                :placeholder="itemtitle"
              />
            </div>
            <div class="row">
              <label class="rowItem" for="newItemCat">Update Category:</label>
              <input type="text"
                class="rowItem"
                id="newItemCat"
                v-model="addGroupGearCat"
                :placeholder="itemcat"
              />
            </div>
            <div class="row rowStyle">
              <div class="loader" v-if="showSpinner"></div>
              <input type="submit" class="rowItem" @click="updateIndGearItem" value="Save" />
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
  props: ["itemid", "itemtitle", "itemcat", "username"],
  data: function () {
    return {
      showSpinner: false,
      addGroupGearTitle: "",
      addGroupGearCat: "",
    };
  },
  methods: {
    updateIndGearItem: function (e) {
      e.preventDefault();
      this.showSpinner = true;
      if (this.addGroupGearTitle === "" && this.addGroupGearCat === "") {
        this.$toasted.show("No changes made!");
        this.showSpinner = false;
        return;
      }
      if (this.addGroupGearTitle === "") {
        this.addGroupGearTitle = this.itemtitle;
      }
      if (this.addGroupGearCat === "") {
        this.addGroupGearCat = this.itemcat;
      }
      this.$store
        .dispatch("updateIndGearAction", {
          gid: this.itemid,
          title: this.addGroupGearTitle,
          category: this.addGroupGearCat,
        })
        .then(() => {
          this.$toasted.show("Updated item!");
          this.showSpinner = false;
          this.$emit("close");
        })
        .catch((e) => {
          console.log(e);
          this.showSpinner = false;
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