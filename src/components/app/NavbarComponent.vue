<template>
  <header v-if="showNavbar()" class="shadow fixed top-0 left-0 right-0 pl-10 pr-5 z-10 flex justify-between items-center bg-[#5AB2FF] h-12">
    <div class="flex items-center gap-4">
      <img :src="TamanSiswaImage" alt="logo taman siswa" width="35">
      <nav class="flex items-center">
        <RouterLink 
          class="underline flex items-center h-12 px-2 hover:text-[#F8F4E1]" 
          to="/"
          :class="{'text-[#F8F4E1]': (this.$route.path === '/')}">
          Home
        </RouterLink>
        <RouterLink 
          class="underline flex items-center h-12 px-2 hover:text-[#F8F4E1]" 
          to="/students"
          :class="{'text-[#F8F4E1]': (this.$route.path === '/students')}">
          Students
        </RouterLink>
      </nav>
    </div>
    <!-- dropdown menu user -->
    <div class="relative">
        <div class="flex gap-1 items-center cursor-pointer" @click.stop="showDropdown">
          <img :src="$global.userImage" alt="user" class="w-8 h-8 rounded-full bg-white">
          <svg  
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            fill="currentColor" 
            class="bi bi-caret-down-fill transition-all duration-75 ease-in-out" 
            :class="{'transform rotate-180': $global.isCLickDropdown.navbar}" 
            viewBox="0 0 16 16">
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
          </svg>
        </div>
        <ul class="absolute bg-white z-50 mt-2 right-0 rounded transition-all duration-75 ease-in-out overflow-hidden h-0" :class="{'border border-neutral-500 h-[4.5rem] p-2 shadow-lg': $global.isCLickDropdown.navbar}">
          <li>
            <a class="inline-block px-1 rounded w-36 h-7 leading-7 hover:bg-[#5AB2FF]" href="/profile" @click.stop>Profile</a>
          </li>
          <li>
            <span class="inline-block px-1 rounded w-36 h-7 leading-7 hover:bg-[#5AB2FF] cursor-pointer" @click="logout" @click.stop>Logout</span>
          </li>
        </ul>
      </div>
      <!-- dropdown menu user -->
  </header>
</template>

<script>
import { RouterLink } from 'vue-router';
import TamanSiswaImage from "@/assets/imgs/tamansiswa.png";
import UserImage from "@/assets/imgs/user.jpg";

export default {
  data() {
    return {
      TamanSiswaImage: TamanSiswaImage,
    }
  },

  mounted() {
    this.$global.userImage = JSON.parse(localStorage.getItem('userImage')) !== "" ? JSON.parse(localStorage.getItem('userImage')) : UserImage;
  },

  methods: {
    showDropdown() {
      this.$global.isCLickDropdown.navbar = !this.$global.isCLickDropdown.navbar;
      if(this.$global.isCLickDropdown.profile) this.$global.isCLickDropdown.profile = false
    },

    showNavbar() {
      return !['/register', '/login'].includes(this.$route.path);
    },

    logout() {
      this.$store.dispatch('logout')
                 .then(response => {
                  console.log(response);
                  if(response.status === 200 && response.data.message === 'logout success') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('userImage');
                    this.isCLickDropdown = false;
                    this.$router.push('/login');
                  }
                 })
                 .catch(error => {
                  console.error(error);
                 })
    }
  }
}
</script>