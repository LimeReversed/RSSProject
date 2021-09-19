<template>
  <div @click="handleClick" class="container">
    <div class="content">
      <h3>{{ item.title }}</h3>
      <p>{{ item.pubDate.toLocaleString() }}</p>
    </div>
    <!-- <p>{{item.imageURL}}</p> -->
  </div>
</template>

<script>
export default {
  name: "RSSFeed",
  props: {
    item: Object,
  },
  methods: {
    handleClick() {
      window.open(this.item.link);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  width: "100%";
  text-align: left;
}

.content {
  border-bottom: lightgrey solid 1px;
}

.content:hover{
  height: 100%;
  border-bottom: plum solid 1px;
  cursor: pointer;
}

.content:hover h3{
  color: plum;
}

p {
  color: lightgray;
  margin-top: 0px;
}

p:hover{
  color: lightgray;
}

h3 {
  margin-bottom: 0px;
  color: white;
}

</style>
