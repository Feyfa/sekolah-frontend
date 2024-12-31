<template>
  <form 
    class="w-full rounded overflow-hidden h-0 transition-all duration-300 ease-in-out" 
    :class="{'h-36 p-2 mb-5 shadow border border-neutral-200': isClickButtonTambah}" 
    @submit.prevent="">
    <div class="flex justify-between items-start gap-5 mb-2">
      <div class="input-container flex flex-col w-full">
        <label 
          for="nama" 
          :class="{'text-red-500': studentAddError.nama.length !== 0}">
          Nama
        </label>
        <input 
          placeholder="nama" 
          id="nama" 
          type="text" 
          class="border w-full border-neutral-500 rounded outline-none py-1 px-1.5 shadow" 
          v-model="studentAdd.nama" 
          :class="{'border-red-500': 
          studentAddError.nama.length !== 0}" 
          @blur="inputValidation('nama')" 
          @keyup="inputValidation('nama')">
        <small 
          class="text-red-500" 
          :class="{'hidden': studentAddError.nama.length === 0}">
          {{ studentAddError.nama }}
        </small>
      </div>
      <div class="input-container flex flex-col w-full">
        <label 
          for="email" 
          :class="{'text-red-500': studentAddError.email.length !== 0}">
          Email
        </label>
        <input 
          placeholder="email" 
          id="email" 
          type="email" 
          class="border w-full border-neutral-500 rounded outline-none py-1 px-1.5 shadow" 
          v-model="studentAdd.email" 
          :class="{'border-red-500': studentAddError.email.length !== 0}" 
          @blur="inputValidation('email')" 
          @keyup="inputValidation('email')">
        <small 
          class="text-red-500" 
          :class="{'hidden': studentAddError.email.length === 0}">
          {{ studentAddError.email }}
        </small>
      </div>
      <div class="input-container flex flex-col w-full">
        <label 
          for="tanggal_lahir" 
          :class="{'text-red-500': studentAddError.tanggal_lahir.length !== 0}">
          Tanggal Lahir
        </label>
        <input 
          id="tanggal_lahir" 
          type="date" 
          class="border w-full border-neutral-500 rounded outline-none py-1 px-1.5 shadow" 
          v-model="studentAdd.tanggal_lahir" 
          :class="{'border-red-500': studentAddError.tanggal_lahir.length !== 0}" 
          @blur="inputValidation('tanggal_lahir')" 
          @change="inputValidation('tanggal_lahir')">
        <small 
          class="text-red-500" 
          :class="{'hidden': studentAddError.tanggal_lahir.length === 0}">
          {{ studentAddError.tanggal_lahir }}
        </small>
      </div>
      <div class="input-container flex flex-col w-full">
        <label for="jenis_kelamin">Jenis Kelamin</label>
        <select 
          name="" 
          id="jenis_kelamin" 
          class="border w-full border-neutral-500 rounded outline-none py-[.48rem] px-1.5 shadow" 
          v-model="studentAdd.jenis_kelamin">
          <option value="Laki-Laki">Laki-Laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
      </div>  
      <div class="input-container flex flex-col w-full">
        <label for="kelas">Kelas</label>
        <select
          name="" 
          id="kelas" 
          class="border w-full border-neutral-500 rounded outline-none py-[.48rem] px-1.5 shadow" 
          v-model="studentAdd.kelas">
          <option value="Sepuluh (10)">Sepuluh (10)</option>
          <option value="Sebelas (11)">Sebelas (11)</option>
          <option value="Dua Belas (12)">Dua Belas (12)</option>
        </select>
      </div>
    </div>
    <div class="flex justify-end items-center gap-7">
      <button 
        type="button" 
        class="w-24 py-1 bg-gray-200 border border-neutral-300 rounded shadow-sm transition-all duration-100 ease-in-out hover:bg-gray-300 hover:scale-105 hover:shadow" 
        @click="cancelAddStudent">
        Cancel
      </button>
      <button 
        type="button" 
        id="button-save" 
        class="w-24 py-1 bg-gray-200 border border-neutral-300 rounded shadow-sm transition-all duration-100 ease-in-out hover:bg-gray-300 hover:scale-105 hover:shadow" 
        :class="{'disabled': disabled}" 
        @click="addStudent" 
        :disabled="disabled">
        Save
      </button>
    </div>
  </form>
</template>

<script>
import Swal from "sweetalert2";

export default {
  props: {
    isClickButtonTambah: {
      type: Boolean,
      required: true,
    }
  },

  watch: {
    isClickButtonTambah(newValue) {
      if(newValue) {
        this.clearInputForm();
      }
    }
  },

  data() {
    return {
      disabled: false,
      studentAdd: {
        nama: '',
        email: '',
        tanggal_lahir: '',
        jenis_kelamin: 'Laki-Laki',
        kelas: 'Sepuluh (10)',
      },
      studentAddError: {
        nama: '',
        email: '',
        tanggal_lahir: '',
      },
    }
  },

  methods: {
    inputValidation(type) {
      switch (type) {
        case 'nama' : 
          this.studentAddError.nama = this.studentAdd.nama.trim() === '' ? 'nama is required' : '';
          break;
        case 'email' :
          this.studentAddError.email = this.studentAdd.email.trim() === '' ? 'email is required' : '';
          break;
        case 'tanggal_lahir' :
          this.studentAddError.tanggal_lahir = this.studentAdd.tanggal_lahir.trim() === '' ? 'tanggal lahir is required' : '';
          break;
      }
    },

    cancelAddStudent() {
      this.studentAdd =  {
        nama: '',
        email: '',
        tanggal_lahir: '',
        jenis_kelamin: 'Laki-Laki',
        kelas: 'Sepuluh (10)',
      };

      this.studentAddError =  {
        nama: '',
        email: '',
        tanggal_lahir: '',
      };

      this.$emit('onCancelProcess');
    },

    clearInputForm(){
      this.studentAdd.nama = '';
      this.studentAdd.email = '';
      this.studentAdd.tanggal_lahir = '';
      this.studentAdd.jenis_kelamin = 'Laki-Laki';
      this.studentAdd.kelas = 'Sepuluh (10)';
    },

    addStudent() {
      if(this.studentAdd.nama === '' || this.studentAdd.email === '' || this.studentAdd.tanggal_lahir === '')
      {
        if(this.studentAdd.nama === '') this.studentAddError.nama = 'nama is required';
        if(this.studentAdd.email === '') this.studentAddError.email = 'email is required';
        if(this.studentAdd.tanggal_lahir === '') this.studentAddError.tanggal_lahir = 'tanggal lahir is required';
      }
      else
      {
        this.disabled = true;
        $('#button-save').html('Process...');
        this.$emit('onBeforeProcess');

        this.$store.dispatch('addStudent', {
          user_id: this.$store.getters.user.id,
          nama: this.studentAdd.nama,
          email: this.studentAdd.email,
          tanggal_lahir: this.studentAdd.tanggal_lahir,
          jenis_kelamin: this.studentAdd.jenis_kelamin,
          kelas: this.studentAdd.kelas,
        })
        .then(response => {
          console.log(response);
          if(response.data.status === 200 && response.data.message === 'Student Add Successfully') {
            this.disabled = false;
            $('#button-save').html('Save');

            /* UNTUK PAGINATION, SETELAH MENAMBAHKAN MURID, AKAN DI ARAH KAN KE PAGE TERBARU */
            // this.students.current_page = Math.ceil((this.students.total + 1) / this.students.per_page);
            // this.students.position_page_per_limit_page = Math.ceil(this.students.current_page / this.students.limit_page);
            /* UNTUK PAGINATION, SETELAH MENAMBAHKAN MURID, AKAN DI ARAH KAN KE PAGE TERBARU */
            
            this.clearInputForm();
            this.$alert({
              status: 'success',
              message: response.data.message
            });

            this.$emit('onAfterProcessSuccess');
          }
        })
        .catch(error => {
          console.error(error);
          // error karena belum terautentikasi
          if(error.response.status === 401) {
            Swal.fire({
              title: error.response.data.message,
              icon: "error",
              confirmButtonColor: '#3085d6'
            })
            .then(result => {
              this.$router.push('/login');
            });
          }
          // error ketika udah di autentikasi
          else {
            this.disabled = false;
            $('#button-save').html('Save');

            this.$alert({
              status: 'error',
              message: error.response.data.message.email[0]
            });

            this.$emit('onAfterProcessError');
          }
        });
      }
    },
  }
}
</script>