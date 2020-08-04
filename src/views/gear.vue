<template>
  <div class="main">
    <div class="header2">
      <div class="subNavMenuLeft"></div>
      <div class="subNavMenu">
        <div class="menu-item">
          <router-link to="/trips">Trips</router-link>
        </div>
      </div>
    </div>
    <div class="hero">
      <div class="hero-top" id="nav-bar">
        <h1 class="hero-title">{{thisTrip.name}}</h1>
        <h2>Started by {{thisTrip.owner}}</h2>
        <div class="hero-icon"></div>
      </div>
      <div class="hero-bottom">
        <div class="hero-content"></div>
      </div>
    </div>
    <div class="actionRow">
      <div class="leftArrowIcon clickable"></div>
      <router-link to="/trip">Trip</router-link>
      <p>&#47;&#47;</p>
      <p>Gear</p>
      <div class="actionRowPlaceholder"></div>
    </div>

    <div class="content">
      <div class="gridWrapper">
        <div id="groupGearButton" :class="groupGear" @click="toggleGearPage($event)">Group Gear</div>
        <div :class="groupGearArrow"></div>
        <div :class="myGearArrow"></div>
        <div id="myGearButton" :class="myGear" @click="toggleGearPage($event)">My Gear</div>
      </div>

      <!-- GROUP GEAR VIEW -->
      <div id="groupGearView" :class="groupGearPage">
        <div class="addSection">
          <form v-on:submit.prevent>
            <label for="itemTitle">Title:</label>
            <input type="text" id="itemTitle" v-model="addGroupGearTitle" />
            <!-- TODO: domain? -->
            <label for="itemCat">Category:</label>
            <input type="text" id="itemCat" v-model="addGroupGearCat" />
            <input type="submit" @click="addGroupGearItem" value="Add" />
          </form>
        </div>
        <!-- GROUP -->
        <div class="paper">
          <div class="categoryMenu">
            <a
              v-for="(category, name) in thisTripGroupGearCategorized"
              :key="name+'-anchor'"
              :href="'#'+name"
            >{{name}}</a>
          </div>
          <div class="categoryButtons">
            <button @click="collapseAllCategories">Collapse All</button>
            <button @click="expandAllCategories">Expand All</button>
          </div>
          <div class="categoryGrid">
            <div
              class="categoryBlock"
              v-for="(category, name) in thisTripGroupGearCategorized"
              :key="name"
            >
              <div class="categoryHeader">
                <div :class="icons" @click="toggleCategory"></div>
                <div class="categoryTitle" :id="name">{{name}}</div>
                <!-- Ability to edit/delete categorie text -->
                <div class="editIcon" @click="toggleEditCategory(name, 'group')">
                  <svg>
                    <path
                      fill="#c0c0c0"
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                    />
                  </svg>
                </div>
                <!-- TODO: Warn will delete all gear in this category/section -->
                <div class="deleteIcon" @click="toggleDeleteCategory(name, 'group')">
                  <svg>
                    <path
                      fill="#c0c0c0"
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
                    />
                  </svg>
                </div>
              </div>
              <!-- Display all gear items in this category -->
              <!-- <div> wrapper is just for show/hide -->
              <div :class="{collapse: collapseClass, collapseWrapper: true}">
                <div class="item" v-for="gear in thisTripGroupGearCategorized[name]" :key="gear.id">
                  <input
                    type="checkbox"
                    :id="gear.id"
                    :value="gear.id"
                    :checked="gear.checked"
                    @change="updateGroupGearItemStatus"
                  />
                  <label class="strikethrough itemTitle" :for="gear.id">{{gear.title}}</label>
                  <div
                    class="camperCell"
                  >( {{Array.isArray(gear.campers) ? gear.campers.join(', ') : gear.campers}} )</div>
                  <!-- TODO: sort checked items to bottom of list? -->
                  <div
                    class="editIcon"
                    @click="toggleUpdateItem(gear.id, gear.title, gear.category, gear.campers)"
                  >
                    <svg>
                      <path
                        fill="#c0c0c0"
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    </svg>
                  </div>
                  <div class="deleteIcon" @click="deleteGroupGearItem(gear.id)">
                    <svg>
                      <path
                        fill="#c0c0c0"
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- INDIVIDUAL -->
      <div id="myGearView" :class="myGearPage">
        <div class="addSection">
          <form v-on:submit.prevent>
            <label for="myItemTitle">Title:</label>
            <input type="text" id="myItemTitle" v-model="addIndGearTitle" />
            <!-- TODO: domain? -->
            <label for="myItemCat">Category:</label>
            <input type="text" id="myItemCat" v-model="addIndGearCat" />
            <input type="submit" @click="addIndGearItem" value="Add" />
          </form>
        </div>

        <div class="paper">
          <div class="categoryMenu">
            <a
              v-for="(category, name) in thisTripIndGearCategorized"
              :key="name+'-anchor'"
              :href="'#'+name"
            >{{name}}</a>
          </div>
           <div class="categoryButtons">
            <button @click="collapseAllCategories">Collapse All</button>
            <button @click="expandAllCategories">Expand All</button>
          </div>
          <div class="categoryGrid">
            <div
              class="categoryBlock"
              v-for="(category, name) in thisTripIndGearCategorized"
              :key="name"
            >
              <div class="categoryHeader">
                <div :class="icons" @click="toggleCategory"></div>
                <div class="categoryTitle">{{name}}</div>
                <!-- Ability to edit/delete categorie text -->
                <div class="editIcon" @click="toggleEditCategory(name, 'ind')">
                  <svg>
                    <path
                      fill="#c0c0c0"
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                    />
                  </svg>
                </div>
                <!-- TODO: Warn will delete all gear in this category/section -->
                <div class="deleteIcon" @click="toggleDeleteCategory(name, 'ind')">
                  <svg>
                    <path
                      fill="#c0c0c0"
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
                    />
                  </svg>
                </div>
              </div>
              <!-- Display all gear items in this category -->
              <div :class="{collapse: collapseClass, collapseWrapper: true}">
                <div class="item" v-for="gear in thisTripIndGearCategorized[name]" :key="gear.id">
                  <input
                    type="checkbox"
                    :id="gear.id"
                    :value="gear.id"
                    :checked="gear.checked"
                    @change="updateIndGearItemStatus"
                  />
                  <label class="strikethrough itemTitle" :for="gear.id">{{gear.title}}</label>
                  <!-- TODO: sort checked items to bottom of list? -->
                  <div
                    class="editIcon"
                    @click="toggleUpdateIndItem(gear.id, gear.title, gear.category)"
                  >
                    <svg>
                      <path
                        fill="#c0c0c0"
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    </svg>
                  </div>
                  <div class="deleteIcon" @click="deleteIndGearItem(gear.id)">
                    <svg>
                      <path
                        fill="#c0c0c0"
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <updateGearItemPopup
      v-if="showUpdateItem"
      @close="toggleUpdateItem()"
      :itemid="thisItemID"
      :itemtitle="thisItemTitle"
      :itemcat="thisItemCat"
      :campers="thisCampers"
      :username="userProfile.name"
    >
      <!-- TODO: add a class on items being updated so other users can see? -->
    </updateGearItemPopup>
    <updateIndGearItemPopup
      v-if="showUpdateIndItem"
      @close="toggleUpdateIndItem()"
      :itemid="thisIndItemID"
      :itemtitle="thisIndItemTitle"
      :itemcat="thisIndItemCat"
      :username="userProfile.name"
    >
      <!-- TODO: add a class on items being updated so other users can see? -->
    </updateIndGearItemPopup>
    <editGearCategory
      v-if="showEditCat"
      @close="toggleEditCategory('','')"
      :itemcat="thisCategory"
      :itempage="whichPage"
    ></editGearCategory>
    <deleteGearCategory
      v-if="showDeleteCat"
      @close="toggleDeleteCategory('','')"
      :itemcat="thisCategory"
      :itempage="whichPage"
    ></deleteGearCategory>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import updateGearItemPopup from "../components/updateGearItemPopup";
import updateIndGearItemPopup from "../components/updateIndGearItemPopup";
import editGearCategory from "../components/editGearCategory";
import deleteGearCategory from "../components/deleteGearCategory";
export default {
  name: "gear",
  created() {
    console.log("gear page created: ", this.$store.state.thisTrip);
    // TODO: if trip object empty route to trips
    if (this.$store.state.thisTrip.id === undefined) {
      console.log("no trip, pushing to trips");
      this.$router.push({ path: "/trips" });
    } else {
      //TODO: If not logged in yet does it work?
      // TODO: getter for sorting??
      this.$store.dispatch("bindTripGroupGear").then((docs) => {
        console.log("got gear list", docs);
        this.$store.dispatch("bindTripIndGear");
      });
    }
  },
  components: {
    updateGearItemPopup,
    updateIndGearItemPopup,
    editGearCategory,
    deleteGearCategory,
  },
  computed: {
    groupGearPage() {
      return {
        displayGear: this.showGroupGear,
        hideGear: !this.showGroupGear,
      };
    },
    myGearPage() {
      return {
        displayGear: !this.showGroupGear,
        hideGear: this.showGroupGear,
      };
    },
    groupGear() {
      return {
        highlightGear: this.showGroupGear,
        gearPages: true,
      };
    },
    myGear() {
      return {
        highlightGear: !this.showGroupGear,
        gearPages: true,
      };
    },
    groupGearArrow() {
      return {
        rightArrowIcon: this.showGroupGear,
      };
    },
    myGearArrow() {
      return {
        leftArrowIcon: !this.showGroupGear,
      };
    },
    ...mapState(["thisTrip", "thisTripGroupGear", "userProfile"]),
    ...mapGetters([
      "thisTripGroupGearCategorized",
      "thisTripIndGearCategorized",
    ]),
  },
  data: function () {
    return {
      whichPage: "",
      icons: {
        upArrowIcon: true,
        downArrowIcon: false,
      },
      collapseClass: false,
      showUpdateItem: false,
      showUpdateIndItem: false,
      showGroupGear: true,
      showEditCat: false,
      showDeleteCat: false,
      thisItemID: "", // Pass ID prop into the updateItem popup for DB action
      thisItemTitle: "",
      thisItemCat: "",
      thisCategory: "",
      thisCampers: [],
      thisIndItemID: "", // Pass ID prop into the updateItem popup for DB action
      thisIndItemTitle: "",
      thisIndItemCat: "",
      // groupGearExists: false,
      addGroupGearTitle: "",
      addGroupGearCat: "",
      addIndGearTitle: "",
      addIndGearCat: "",
    };
  },
  methods: {
    toggleGearPage(event) {
      if (
        (event.target.id === "groupGearButton" &&
          this.showGroupGear === true) ||
        (event.target.id === "myGearButton" && this.showGroupGear === false)
      ) {
        return;
      } else {
        this.showGroupGear = !this.showGroupGear;
      }
    },
    toggleCategory(e) {
      var content = e.target.parentNode.nextElementSibling;
      if (content.classList.contains("collapse")) {
        content.classList.remove("collapse");
      } else {
        content.classList.add("collapse");
      }
      // TODO this messes up expand all buttton, no class?
      e.target.classList.toggle("downArrowIcon");
      e.target.classList.toggle("upArrowIcon");
    },
    expandAllCategories() {
      // for every wrapper, add the class if it's missing from previous function :/ this could be much better
      let els = document.getElementsByClassName("collapseWrapper");
      for (let i = 0; i < els.length; i++) {
        if (els[i].classList) {
          if (els[i].classList.contains("collapse")) {
            console.log("collapse get out");
            els[i].classList.remove("collapse");
            els[i].previousElementSibling.children[0].classList.replace('downArrowIcon','upArrowIcon')
          }
        }
      }
      this.collapseClass = false;
      this.icons = { upArrowIcon: true, downArrowIcon: false };
    },
    collapseAllCategories() {
      this.collapseClass = true;
      this.icons = { upArrowIcon: false, downArrowIcon: true };
    },
    // GROUP GEAR
    toggleUpdateItem(id, title, cat, campers) {
      this.showUpdateItem = !this.showUpdateItem;
      this.thisItemID = id;
      this.thisItemTitle = title;
      this.thisItemCat = cat;
      this.thisCampers = campers;
    },
    addGroupGearItem: function () {
      if (this.addGroupGearTitle !== "") {
        // TODO: injection threat check
        this.$store
          .dispatch("addGroupGearItemAction", {
            title: this.addGroupGearTitle,
            category: this.addGroupGearCat,
          })
          .then(() => {
            this.$toasted.show("Added item!");
          })
          .catch((e) => {
            this.$toasted.show(e.message);
          });
      } else {
        this.$toasted.show("Please enter a title for the item.");
      }
    },
    deleteGroupGearItem: function (itemID) {
      //TODO: confirm want to delete
      // change from button to top-level delete button that deletes checked boxes?
      // or... edit a template mode? where you can delete rows/add rows etc?
      this.$store
        .dispatch("deleteGroupGearItemAction", { id: itemID })
        .then(() => {
          this.$toasted.show("Deleted item!");
        })
        .catch((e) => {
          this.$toasted.show(e.message);
        });
    },
    updateGroupGearItemStatus: function (item) {
      // console.log(item.target.value, item.target.checked);
      this.$store.dispatch("updateStatusAction", {
        id: item.target.value,
        status: item.target.checked,
      });
      //TODO: return message (success/fail)
    },
    // INDIVIDUAL ITEMS
    toggleUpdateIndItem(id, title, cat) {
      this.showUpdateIndItem = !this.showUpdateIndItem;
      this.thisIndItemID = id;
      this.thisIndItemTitle = title;
      this.thisIndItemCat = cat;
    },
    addIndGearItem: function () {
      if (this.addIndGearTitle !== "") {
        // TODO: injection threat check
        this.$store
          .dispatch("addIndGearItemAction", {
            title: this.addIndGearTitle,
            category: this.addIndGearCat,
          })
          .then(() => {
            this.$toasted.show("Added item!");
          })
          .catch((e) => {
            this.$toasted.show(e.message);
          });
      } else {
        this.$toasted.show("Please enter a title for the item.");
      }
    },
    deleteIndGearItem: function (itemID) {
      //TODO: confirm want to delete
      // change from button to top-level delete button that deletes checked boxes?
      // or... edit a template mode? where you can delete rows/add rows etc?
      this.$store
        .dispatch("deleteIndGearItemAction", { id: itemID })
        .then(() => {
          this.$toasted.show("Deleted item!");
        })
        .catch((e) => {
          this.$toasted.show(e.message);
        });
    },
    updateIndGearItemStatus: function (item) {
      // console.log(item.target.value, item.target.checked);
      this.$store.dispatch("updateIndStatusAction", {
        id: item.target.value,
        status: item.target.checked,
      });
      //TODO: return message (success/fail)
    },
    // CATEGORIES
    toggleEditCategory: function (type, page) {
      this.whichPage = page;
      this.thisCategory = type;
      this.showEditCat = !this.showEditCat;
    },
    toggleDeleteCategory: function (type, page) {
      this.whichPage = page;
      this.thisCategory = type;
      this.showDeleteCat = !this.showDeleteCat;
    },
  },
};
</script>

<style scoped>
input[type="checkbox"]:checked + label.strikethrough {
  text-decoration: line-through;
}
h4 {
  margin: 0;
  padding: 0;
  font-size: 1.2rem;
}
/* HERO CSS */
.hero {
  display: flex;
  flex-flow: column nowrap;
  background: linear-gradient(
      rgba(45, 45, 45, 0.6),
      rgba(0, 0, 0, 0.37),
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5)
    ),
    url(../assets/ryan-bahm-fMMpsyHCeK0-unsplash.jpg) no-repeat 0 -135px;
  background-size: cover;
  height: 200px;
  width: 100%;
  /*margin-bottom: 15px;*/
}
.hero-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-between; */
  /* padding: 15px 0; */
  color: #f7ffff;
  padding: 10px 5px 30px 5px;
}

.hero-bottom {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  flex: 1;
  padding: 0 15px;
}
.hero-icon {
  background: url("../assets/CampingW.png") no-repeat center center;
  background-size: contain;
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
}

/* Main Content */
.gridWrapper {
  /* padding: 15px; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.gridColumn {
  /* width: 150px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 1px 1px 3px 1px rgba(57, 57, 57, 0.2);
  padding: 10px;
  background: #95c9d1bf;
}
.actionRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  padding: 10px 0 0 10px;
}
.actionRow > p {
  margin-left: 10px;
  font-size: 1rem;
}

.actionRowPlaceholder {
  flex: 1;
}

.deleteIcon {
  /* background: url("../assets/delete.svg") no-repeat center center; */
  /* background-size: contain; */
  width: 12px;
  height: 12px;
  cursor: pointer;
  /* vertical-align: middle; */
  /* padding: 12px; */
  display: inline-block;

  padding: 0 9px 9px 9px;
}
.editIcon {
  /* background: url("../assets/edit.svg") no-repeat center center; */
  /* background-size: contain; */
  width: 12px;
  height: 12px;
  cursor: pointer;
  /* vertical-align: middle; */
  /* margin-left: 20px; */

  padding: 0 9px 9px 9px;
  display: inline-block;
}
.plusHide {
  display: none;
}
.plusShow {
  display: inline-block;
}
.collapse {
  display: none;
}
.downArrowIcon {
  background: url("../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: black;
  transform: rotate(90deg); /*TODO in gimp*/
  cursor: pointer;
}
.upArrowIcon {
  background: url("../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: black;
  transform: rotate(270deg); /*TODO in gimp*/
  cursor: pointer;
}
.leftArrowIcon {
  background: url("../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: black;
  transform: rotate(180deg); /*TODO in gimp*/
  cursor: pointer;
}
.rightArrowIcon {
  background: url("../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: gray;
}

/* messages section */
#messages {
  margin-top: 15px;
}

.cell {
  padding: 0 10px;
}
.camperCell {
  padding-left: 10px;
  font-size: 0.8rem;
  color: rgb(65, 65, 65);
  font-style: italic;
  display: inline-block;
}
.text {
  text-decoration: underline;
}
.categoryMenu {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}
.categoryMenu > a {
  padding: 5px;
  color: #7591db;
  font-size: 0.8rem;
}
.categoryButtons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}
.category {
  font-size: 0.8rem;
  color: gray;
}
.addSection {
  margin: 20px 0;
}
.highlightGear {
  box-shadow: 0px 0px 15px 4px #23df7f;
}
.gearPages {
  border-radius: 2px;
  padding: 10px;
  margin: 10px;
  cursor: pointer;
  border: 1px solid #bcbcbc;
}
.displayGear {
  display: block;
}
.hideGear {
  display: none;
}
.categoryGrid {
  /* display: flex;
  flex-direction: row;
  flex-wrap: wrap; */

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* justify-content: center; */
  justify-content: space-around;
}
.categoryBlock {
  /* width: 50%; */
  padding: 0 10px;
}
.categoryHeader {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.categoryHeader > .editIcon {
  margin: 0;
}
.categoryTitle {
  font-size: 1.3rem;
  padding: 15px 5px;
}
.itemTitle {
  font-size: 1.2rem;
}
.item {
  /* line-height: 1.6rem; */
  /* margin: 5px 0; */
  font-family: "Kalam", cursive;
  text-align: left;
  display: flex;
  align-items: center;
}
.paper {
  color: #282625;
  margin: 0 auto;
  width: 850px;
  padding: 7px 55px 27px;
  position: relative;
  border: 1px solid #b5b5b5;
  background: white;
  background: -webkit-linear-gradient(0deg, #dfe8ec 0%, white 8%) 0 57px;
  background: -moz-linear-gradient(0deg, #dfe8ec 0%, white 8%) 0 57px;
  background: linear-gradient(0deg, #dfe8ec 0%, white 8%) 0 57px;
  -webkit-background-size: 100% 30px;
  -moz-background-size: 100% 30px;
  -ms-background-size: 100% 30px;
  background-size: 100% 30px;
}
.paper::before {
  content: "";
  z-index: -1;
  margin: 0 1px;
  width: 706px;
  height: 10px;
  position: absolute;
  bottom: -3px;
  left: 0;
  background: white;
  border: 1px solid #b5b5b5;
}
.paper::after {
  content: "";
  position: absolute;
  width: 0px;
  top: 0;
  left: 39px;
  bottom: 0;
  border-left: 1px solid #f8d3d3;
}
</style>