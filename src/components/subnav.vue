<template>
  <header>
    <section>
      <div><slot></slot></div>
      <div>Dates</div>
      <div>Campers</div>
      <div>Gear</div>
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
  methods: {}
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: row;
  align-items: center;
  /* justify-content: space-between; */
  padding: 10px 30px;
}
section > div {
  margin: 0 5px;
  border-right: 1px solid black;
}
header {
  top: 51px;
    left: 0;
    right: 0;
    position: fixed;
    background: #e2e2e2;
    z-index: 100;
}
a {
  color: #09709a;
}

a.router-link-exact-active {
  color: #42b983;
}
.hero-icon {
  background: url("../assets/Camping.png") no-repeat center center;
  background-size: contain;
  width: 25px;
  height: 25px;
  margin-bottom: 0;
}
</style>