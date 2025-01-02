<template>
  <div class="w-[95%] mx-auto border-black h-screen flex justify-center items-center">

    <form class="border border-neutral-500 w-2/5 p-2 rounded shadow-md flex flex-col justify-center gap-3 items-center bg-zinc-50">
      <h1 class="text-2xl">Login</h1>
      
      <div class="input-container">
        <label 
          :class="{'text-red-500': loginError.email.length !== 0}"
          for="email">Email</label>
        <input 
          @blur="inputValidation('email')" 
          @keyup="inputValidation('email')"
          :class="{'border-red-500': loginError.email.length !== 0}" 
          v-model="login.email" 
          class="border border-neutral-500 rounded outline-none py-2 px-2 shadow w-full" 
          type="email" 
          id="email" 
          name="email" 
          placeholder="Email">
        <small 
          class="text-red-500" 
          :class="{'hidden': loginError.email.length === 0}">{{ loginError.email }}</small>
      </div>
      
      <div class="input-container">
        <label 
          :class="{'text-red-500': loginError.password.length !== 0}"
          for="password">Password</label>
        <input 
          @blur="inputValidation('password')" 
          @keyup="inputValidation('password')"
          :class="{'border-red-500': loginError.password.length !== 0}" 
          v-model="login.password" 
          class="border border-neutral-500 rounded outline-none py-2 px-2 shadow w-full" 
          type="password" 
          id="password" 
          name="password" 
          placeholder="Password">
        <small 
          class="text-red-500" 
          :class="{'hidden': loginError.password.length === 0}">{{ loginError.password }}</small>
      </div>
      
      <div class="w-full text-end">
        <RouterLink to="/register" class="underline font-sans text-blue-800">register</RouterLink>
      </div>
      
      <button 
        @click="loginSubmit" 
        type="button" 
        id="button-login"
        :disabled="buttonloginDisabled"
        class="button-login w-full border border-neutral-500 rounded bg-zinc-100 py-2"
        :class="{'opacity-70': buttonloginDisabled , 'hover:bg-zinc-200 shadow': !buttonloginDisabled}">
        login
      </button>
    </form>
  </div>

</template>

<script>
import { ElNotification } from 'element-plus';
import Swal from "sweetalert2";
import { RouterLink } from "vue-router";
import UserImage from "@/assets/imgs/user.jpg";

export default {
  data() {
    return {
      login: {
        name: '',
        email: '',
        password: ''
      },
      loginError: {
        name: '',
        email: '',
        password: ''
      },
      buttonloginDisabled: false
    }
  },

  methods: {
    inputValidation(type) {
      switch (type) {
        case 'name' : 
          this.loginError.name = this.login.name.trim() === '' ? 'name is required' : '';
          break;
        case 'email' :
          this.loginError.email = this.login.email.trim() === '' ? 'email is required' : '';
          break;
        case 'password' :
          this.loginError.password = this.login.password.trim() === '' ? 'password is required' : '';
          break;
      }
    },

    loginSubmit() {
      if(this.login.email === '' || this.login.password === '')
      {
        if(this.login.email === '') this.loginError.email = 'email is required';
        if(this.login.password === '') this.loginError.password = 'password is required';
      }
      else 
      {
        this.buttonloginDisabled = true;
        $('#button-login').html('process...');

        this.$store.dispatch('loginSubmit',{
          email: this.login.email,
          password: this.login.password,
        })
        .then(response => {
          console.log(response);

          if(response.status === 200) {
            this.buttonRegisterDisabled = false;
            $('#button-login').html('Login');

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('userImage', JSON.stringify(response.data.userImage));

            this.$global.userImage = JSON.parse(localStorage.getItem('userImage')) !== "" ? JSON.parse(localStorage.getItem('userImage')) : UserImage;

            this.$router.push('/');
          }
        })
        .catch(error => {
          console.error(error);
          if(error.response.status === 401 || error.response.status === 422) {
            this.buttonloginDisabled = false;
            $('#button-login').html('Login');

            ElNotification({ type: 'error', title: 'Error', message: error.response.data.message });
          }
        });
      }
    }
  },
}

</script>
