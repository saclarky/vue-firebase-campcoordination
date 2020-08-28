<template>
  <header>
    <section id="subnavSection">
      <a href="#topScroll" @click="scrollingTrip" class='active'><slot></slot></a>
      <a href="#datesSection" @click="scrollingTrip">Dates</a>
      <a href="#campersSection" @click="scrollingTrip">Campers</a>
      <a href="#gearSection" @click="scrollingTrip">Gear</a>
      <a href="#mealsSection" @click="scrollingTrip">Meals</a>
      <a href="#itinerarySection" @click="scrollingTrip">Itinerary</a>
      <a href="#activityLogSection" @click="scrollingTrip">Activity Log</a>
    </section>
  </header>
</template>

<script>

export default {
  data: function() {
    return {
    };
  },
  computed: {
  },
  methods: {
    scrollingTrip: function(e) {
      e.preventDefault()
      console.log(e.target.hash)
      var d = e.target.hash.split("#")[1]
     var ss = d=='topScroll' ? 0 : document.getElementById(d).offsetTop 
     console.log(ss)
      window.scroll({top:ss, left:0, behavior:'smooth'})
//       document.getElementById('subnavSection').children.forEach(t => {
// t.classList.remove('active')
//    })
  //  document.getElementById(e.target.hash.split("#")[1]).classList.add('active')
    }
  }
};
</script>

<style scoped>
.active {
  color: #43c3f7;
}
section {
  display: flex;
  flex-direction: row;
  align-items: center;
  /* justify-content: space-between; */
  padding: 10px 30px;
  font-size: .8rem;
}
section > a {
  margin: 0 10px;
  /* border-right: 1px solid black; */
}
header {
  top: 81px;
    left: 0;
    right: 0;
    position: fixed;
    background: #054d6b;
    z-index: 100;
    color: white;
}
a {
  color: #8cb6c7;
}

a:hover {
  color: #43c3f7;
}

</style>