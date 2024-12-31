<template>
  <div @click="resetDropdown">
    <NavbarComponent />
    <RouterView />
  </div>
</template>

<script>
import { RouterView } from 'vue-router';
import NavbarComponent from './components/app/NavbarComponent.vue';

export default {
  components: {
    NavbarComponent
  },

  methods: {
    resetDropdown() {
      if(this.$global.isCLickDropdown.profile) this.$global.isCLickDropdown.profile = false;
      if(this.$global.isCLickDropdown.navbar) this.$global.isCLickDropdown.navbar = false;
    }
  }
}
</script>

