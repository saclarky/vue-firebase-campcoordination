<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">Update {{itemtitle}}</div>

          <div class="modalBody">
            <form v-on:submit.prevent>
            <div class="row">
              <label class="rowItem" for="newItemTitle">Update Title:</label>
              <input
                class="rowItem"
                id="newItemTitle"
                v-model="addGearTitle"
                :placeholder="itemtitle"
              autofocus />
            </div>
            <div class="row">
              <label class="rowItem" for="newItemCat">Update Category:</label>
              <input
                class="rowItem"
                id="newItemCat"
                v-model="addGearCat"
                :placeholder="itemcat"
              />
            </div>
            <div class="row rowStyle">
              <div class="loader" v-if="showSpinner"></div>
            <input type="submit" class="rowItem" @click="updateGearItem" value="Save"/>
            </div>
            </form>
          </div>
          <div :class="campersDiv">
            <span
              :class="{
      plusShow: campers ? !campers.includes(username) : true,
      plusHide: campers ? campers.includes(username) : false
    }"
            >
              <i
                class="plusIcon"
                @click="updateGroupGearCampers({gid:itemid,camperAdd:username,camperRemove:''})"
              ></i>
              <span>Add Self</span>
            </span>
            <span
              :class="{
      plusShow: campers ? campers.includes(username) : false,
      plusHide: campers ? !campers.includes(username) : true
    }"
            >
              <i
                class="minusIcon"
                @click="updateGroupGearCampers({gid:itemid,camperRemove:username,camperAdd:''})"
              ></i>
              <span>Remove Self</span>
            </span>
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
  props: ["itemid", "itemtitle", "itemcat", "username", "campers", "page"],
  data: function () {
    return {
      showSpinner: false,
      addGearTitle: "",
      addGearCat: "",
    };
  },
  computed: {
    campersDiv() {
      return {
        modalBody:true,
        plusHide: this.page=='ind',
        plusShow: this.page === 'group'
      }
    }
  },
  methods: {
    updateGearItem: function (e) {
      e.preventDefault()
       this.showSpinner = true;
      if (this.addGearTitle === "" && this.addGearCat === "") {
        this.$toasted.show("No changes made!");
         this.showSpinner = false;
        return;
      }
      if (this.addGearTitle === "") {
        this.addGearTitle = this.itemtitle;
      }
      if (this.addGearCat === "") {
        this.addGearCat = this.itemcat;
      }
      this.$store
        .dispatch("updateGearAction", {
          page: this.page,
          gid: this.itemid,
          title: this.addGearTitle,
          category: this.addGearCat,
        })
        .then(() => {
          this.$toasted.show("Updated item!");
           this.showSpinner = false;
          this.$emit("close");
        })
        .catch((e) => {
          this.$toasted.show(e.message);
           this.showSpinner = false;
        });
    },
    updateGroupGearCampers: function (data) {
      this.$store
        .dispatch("updateGroupGearCampersAction", data)
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

.modalBody {
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