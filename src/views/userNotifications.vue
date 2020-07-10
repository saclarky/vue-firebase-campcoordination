<template>
  <div>
    <div class="row actionRow" @click="function(){console.log('reutnr somewhere')}">
      <div class="leftArrowIcon clickable"></div>
      <p class="clickable">Dashboard</p>
      <p>&#47;&#47;</p>
      <p>Notifications</p>
      <div class="actionRowPlaceholder"></div>
    </div>

    <div class='tripInvites'>
        <div v-for='invite in userTripInvites' :key="invite.tid">
            <div class='time'>{{invite.receivedTimestamp}}</div>
            <div>{{invite.from}}</div>
            <div>{{invite.tid}}</div>
            <div><button>Join</button> <button>Decline</button></div>
        </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    computed: {
        ...mapState(['userTripInvites'])
    }
}
</script>

<style scoped>
.actionRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  padding: 10px;
}
.actionRow > p {
  margin-left: 10px;
  font-size: 1rem;
}

.actionRowPlaceholder {
  flex: 1;
}
.leftArrowIcon {
  background: url("../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: black;
  transform: rotate(180deg); /*TODO in gimp*/
}

.clickable {
  cursor: pointer;
}
</style>