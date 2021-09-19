<template>
  <div id="app">
    <div v-if="!removeForm" class="RSSContainer">
      <div class="title">
        <h1 :style="{ color: 'plum' }">RSS Feed</h1>
        <ion-icon
          name="add-circle-outline"
          class="icon"
          @click="() => rssList.add()"
        ></ion-icon>
        <ion-icon
          name="close-circle-outline"
          class="icon"
          @click="() => (removeForm = true)"
        ></ion-icon>
      </div>
      <div :style="{ display: 'flex', flexDirection: 'row' }">
        <p :style="{ margin: '0px' }" @click="() => rssList.sortByTitle()">
          Sortera efter titel
        </p>
        <p
          :style="{ margin: '0px', marginLeft: '20px' }"
          @click="() => rssList.sortByDate()"
        >
          Sortera efter tid
        </p>
      </div>
      <RSSItem
        v-for="el in rssList.rssObjects"
        :key="el.articleId"
        :item="el"
      />
    </div>
    <div v-if="removeForm" class="RSSContainer">
      <div class="title">
        <ion-icon
          name="chevron-back-outline"
          class="icon"
          :style="{ margin: '0px' }"
          @click="() => (removeForm = false)"
        ></ion-icon>
        <h1 :style="{ color: 'plum', marginLeft: '20px' }">Remove Urls</h1>
      </div>
      <p
        v-for="(el, i) in rssList.getAddedUrls()"
        :key="el"
        @click="() => rssList.remove(i)"
      >
        {{ el }}
      </p>
    </div>
  </div>
</template>

<script>
import { RssList } from "./services/rssService";
import { getCookie } from "./services/cookieService";
import RSSItem from "./components/RSSItem.vue";

export default {
  name: "App",
  components: {
    RSSItem,
  },
  data() {
    return {
      removeForm: false,
      rssList: Object,
    };
  },
  methods: {
    add() {
      var url = prompt("Enter Rss URL");
      if (url != null) {
        this.rssList.add(url);
      }
    },
  },
  async mounted() {
    let cookie = getCookie("rssSources");
    let rssSources = [];
    rssSources.push(
      "https://getrss.zurs.se/?url=aHR0cHM6Ly9yc3MuYWZ0b25ibGFkZXQuc2UvcnNzMi9zbWFsbC9wYWdlcy9zZWN0aW9ucy9zZW5hc3Rlbnl0dC8="
    );

    if (cookie != "") {
      rssSources = JSON.parse(cookie);
    }

    this.rssList = new RssList(rssSources);
  },
};
</script>

<style>
html,
body,
#app {
  margin: 0px;
  height: 100vh;
  width: 100%;
}

#app {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  display: flex;
  justify-content: center;
  background-image: url("./assets/street_lights.jpg");
  background-size: cover;
}

.RSSContainer {
  background-color: rgba(0, 0, 0, 1);
  padding: 30px 60px 0px 60px;
  overflow: auto;
}

.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0px;
}

.icon {
  color: white;
  width: 30px;
  height: 30px;
  margin-left: 10px;
}

.icon:hover {
  cursor: pointer;
}

p {
  color: lightgrey;
}

p:hover {
  color: plum;
  cursor: pointer;
}
</style>
