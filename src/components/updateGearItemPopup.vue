<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">Update {{itemtitle}} Entry</div>

          <div class="modal-body">
            <div class="row">
              <label class="rowItem" for="newItemTitle">Update Title:</label>
              <input
                class="rowItem"
                id="newItemTitle"
                v-model="addGroupGearTitle"
                :placeholder="itemtitle"
              />
            </div>
            <div class="row">
              <label class="rowItem" for="newItemCat">Update Category:</label>
              <input
                class="rowItem"
                id="newItemCat"
                v-model="addGroupGearCat"
                :placeholder="itemcat"
              />
            </div>

            <button class="rowItem" @click="updateGroupGearItem">Save</button>
          </div>

          <div class="modal-footer">
            <button @click="$emit('close')">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["itemid", "itemtitle", "itemcat"],
  data: function () {
    return {
      addGroupGearTitle: "",
      addGroupGearCat: "",
    };
  },
  methods: {
    updateGroupGearItem: function () {
      if (this.addGroupGearTitle === "" && this.addGroupGearCat === "") {
        this.$toasted.show("No changes made!");
        return;
      }
      if (this.addGroupGearTitle === "") {
        this.addGroupGearTitle = this.itemtitle;
      }
      if (this.addGroupGearCat === "") {
        this.addGroupGearCat = this.itemcat;
      }
      this.$store
        .dispatch("updateGroupGearAction", {
          gid: this.itemid,
          title: this.addGroupGearTitle,
          category: this.addGroupGearCat,
        })
        .then(() => {
          this.$toasted.show("Updated item!");
          this.$emit("close");
        })
        .catch((e) => {
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
.row {
  display: flex;
  flex-direction: row;
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
</style>