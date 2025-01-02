<template>
  <div class="mt-16 w-[95%] mx-auto">
    <ModalEmailComponent 
      :show="modalEmailComponent.show" 
      :to="modalEmailComponent.to" 
      @onAfterProcess="hiddenModalEmailComponent" />

    <div class="w-full flex justify-between items-start mb-2">
      <!-- pagination -->
      <div :style="{visibility: show.buttonPagination ? 'visible' : 'hidden' }">
        <div>
          <button
            :disabled="disabled.buttonPagination"
            v-if="students.current_page > 1" 
            class="border border-neutral-500 cursor-pointer hover:bg-neutral-200 w-10 py-1 text-center"
            @click="setCurrentPage('prev')">
            <<
          </button>
          <button 
            :disabled="disabled.buttonPagination"
            class="border border-neutral-500 cursor-pointer hover:bg-neutral-200 w-10 py-1 text-center" 
            :class="{
              'bg-neutral-200': getPage(1) === students.current_page,
              'hidden': getPage(1) > students.last_page
            }"
            @click="setCurrentPage('', getPage(1))">
            {{ getPage(1) }}
          </button>
          <button 
            :disabled="disabled.buttonPagination"
            class="border border-neutral-500 cursor-pointer hover:bg-neutral-200 w-10 py-1 text-center" 
            :class="{
              'bg-neutral-200': getPage(2) === students.current_page,
              'hidden': getPage(2) > students.last_page
            }"
            @click="setCurrentPage('', getPage(2))">
            {{ getPage(2) }}
          </button>
          <button 
            :disabled="disabled.buttonPagination"
            class="border border-neutral-500 cursor-pointer hover:bg-neutral-200 w-10 py-1 text-center" 
            :class="{
              'bg-neutral-200': getPage(3) === students.current_page,
              'hidden': getPage(3) > students.last_page
            }"
            @click="setCurrentPage('', getPage(3))">
            {{ getPage(3) }}
          </button>
          <button 
            :disabled="disabled.buttonPagination"
            v-if="students.current_page !== students.last_page" 
            class="border border-neutral-500 cursor-pointer hover:bg-neutral-200 w-10 py-1 text-center"
            @click="setCurrentPage('next')">
            >>
          </button>
        </div>
        <div>
          <small>Showing {{ students.current_page }} To {{ students.last_page }} Of {{ students.total }} Entries</small>
        </div>
      </div>
      <!-- pagination -->

      <!-- search -->
      <input 
        :style="{visibility: show.inputSearch ? 'visible' : 'hidden' }"
        placeholder="seacrh"
        type="text" 
        class="border border-neutral-500 rounded outline-none py-1 px-1.5 shadow"
        @keyup.enter="searchStudent">
      <!-- search -->

      <!-- buttons -->
      <div class="flex justify-between gap-4">
        <button 
          id="button-large-export"
          type="button"
          class="w-28 py-1 bg-gray-200 border border-neutral-300 rounded shadow-sm transition-all duration-100 ease-in-out"
          :class="{'disabled cursor-not-allowed': $global.isExportingLargeCSV, 'hover:bg-gray-300 hover:scale-105 hover:shadow': !$global.isExportingLargeCSV}"
          :disabled="$global.isExportingLargeCSV"
          @click="exportLargeCSV">
          Export Large
        </button>
        <button 
          id="button-export"
          type="button"
          class="w-24 py-1 bg-gray-200 border border-neutral-300 rounded shadow-sm transition-all duration-100 ease-in-out"
          :class="{'disabled cursor-not-allowed': disabled.buttonExport, 'hover:bg-gray-300 hover:scale-105 hover:shadow': !disabled.buttonExport}"
          :style="{visibility: students.data.length < 1 ? 'hidden' : 'visible' }"
          :disabled="disabled.buttonExport"
          @click="exportExcel">
          Export
        </button>
        <button 
          id="button-import"
          type="button" 
          class="w-24 py-1 bg-gray-200 border border-neutral-300 rounded shadow-sm transition-all duration-100 ease-in-out"
          :class="{'disabled cursor-not-allowed': disabled.buttonImport, 'hover:bg-gray-300 hover:scale-105 hover:shadow': !disabled.buttonImport}"
          :disabled="disabled.buttonImport"
          @click="showImportExcel">
          Import
        </button>
        <button 
          id="button-tambah"
          type="button" 
          class="w-24 py-1 bg-gray-200 border border-neutral-300 rounded shadow-sm transition-all duration-100 ease-in-out"
          :class="{'disabled cursor-not-allowed': disabled.buttonTambah, 'hover:bg-gray-300 hover:scale-105 hover:shadow': !disabled.buttonTambah}"
          :disabled="disabled.buttonTambah"
          @click="showViewAddStudent">
          Tambah
        </button>
      </div>
      <!-- buttons -->
    </div>

    <FormInputExcelComponent 
      :isClickButtonImport="isClickButtonImport" 
      @onBeforeProcess="FormInputExcel_BeforeProcess"
      @onAfterProcessSuccess="FormInputExcel_AfterProcessSuccess" 
      @onAfterProcessError="FormInputExcel_AfterProcessError" />

    <FormAddStudentComponent 
      :isClickButtonTambah="isClickButtonTambah"
      @onCancelProcess="FormAddStudent_CancelProcess"
      @onBeforeProcess="FormAddStudent_BeforeProcess"
      @onAfterProcessSuccess="FormAddStudent_AfterProcessSuccess"
      @onAfterProcessError="FormAddStudent_AfterProcessError" />

    <!-- table untuk menampilkan student -->
    <table class="w-full bg-[rgb(253,253,253)] shadow border border-neutral-400 mb-5">
      <thead>
        <tr class="bg-green-500">
          <th>Nama</th>
          <th>Email</th>
          <th>Tanggal Lahir</th>
          <th>Jenis Kelamin</th>
          <th>Kelas</th>
          <th>Created</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        
        <tr v-for="(student, index) in students.data">
          <td>
            <input 
              required 
              type="text" 
              v-model="students.data[index].nama"
              class="outline-none w-full"
              :readonly="!(rowEdit === index)" 
              :class="{'border border-neutral-500 bg-white shadow-md rounded py-1 px-1.5': rowEdit === index}">
          </td>
          <td>
            <input 
              required 
              type="email" 
              v-model="students.data[index].email"
              class="outline-none w-full"
              :readonly="!(rowEdit === index)" 
              :class="{'border border-neutral-500 bg-white shadow-md rounded py-1 px-1.5': rowEdit === index}">
          </td>
          <td>
            <input 
              required 
              type="date" 
              v-model="students.data[index].tanggal_lahir"
              class="outline-none w-full"
              :readonly="!(rowEdit === index)" 
              :class="{'border border-neutral-500 bg-white shadow-md rounded py-1 px-1.5': rowEdit === index}">
          </td>
          <td>
            <select 
              required 
              v-model="students.data[index].jenis_kelamin"
              class="outline-none w-full"
              :disabled="!(rowEdit === index)" 
              :class="{'border border-neutral-500 bg-white shadow-md rounded py-[.48rem] px-1.5': rowEdit === index}">
              <option value="Laki-Laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </td>
          <td>
            <select 
              required 
              v-model="students.data[index].kelas"
              class="outline-none w-full"
              :disabled="!(rowEdit === index)" 
              :class="{'border border-neutral-500 bg-white shadow-md rounded py-[.48rem] px-1.5': rowEdit === index}">
              <option value="Sepuluh (10)">Sepuluh (10)</option>
              <option value="Sebelas (11)">Sebelas (11)</option>
              <option value="Dua Belas (12)">Dua Belas (12)</option>
            </select>
          </td>
          <td>{{ student.created_at.replace("T", " ").replace(/\.\d+Z$/, "") }}</td>
          <td>
            <div class="flex items-center justify-center gap-4">
              <button 
                @click="rowEditActive(index, student.id)" 
                :class="{'hidden': rowEdit === index}">
                <i class="bi bi-pencil"></i>
              </button>

              <form 
                @submit.prevent="deleteStudent(student.id, index)" 
                class="cursor-pointer" 
                :class="{'hidden': rowEdit === index}">
                <button 
                  :disabled="isProcess.deleteStudent[index]"
                  type="submit">
                  <i :class="{'bi bi-trash3': !isProcess.deleteStudent[index], 'fa-solid fa-spinner fa-spin-pulse': isProcess.deleteStudent[index]}"></i>
                </button>
              </form>


              <button 
                @click="updateStudent(index)" 
                :class="{'hidden': rowEdit !== index}">
                <i class="bi bi-check-circle"></i>
              </button>

              <button 
                @click="cancelEdit(index)" 
                :class="{'hidden': rowEdit !== index}"
                :disabled="isProcess.updateStudent">
                <i :class="{'bi bi-x-circle': !isProcess.updateStudent, 'fa-solid fa-spinner fa-spin-pulse': isProcess.updateStudent}"></i>
              </button>
            </div>
            <div class="flex items-center justify-center" :class="{'hidden': rowEdit === index}">
              <button
                @click="showModalEmailComponent(student.email)">
                <i
                  class="bi bi-envelope"
                  :class="{'opacity-50 cursor-default': !this.$store.getters.user.emailActive}">
                </i>
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="students.data.length === 0">
          <td colspan="7">
            <h1 class="text-center mt-3" id="empty-students">
              <i class="fa-solid fa-spinner fa-spin-pulse fa-lg block mb-5"></i>
              Loading Data...
            </h1>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- table untuk menampilkan student -->

  </div>
</template>

<script>
import Swal from 'sweetalert2';
import ModalEmailComponent from '@/components/student/ModalEmailComponent.vue';
import FormInputExcelComponent from "@/components/student/FormInputExcelComponent.vue";
import FormAddStudentComponent from "@/components/student/FormAddStudentComponent.vue";
import { ElNotification } from 'element-plus';

export default {
  components: {
    ModalEmailComponent,
    FormInputExcelComponent,
    FormAddStudentComponent,
  },

  data() {
    return {
      isClickButtonTambah: false,
      isClickButtonImport: false,
      students: {
        data: [],
        // page saat ini
        current_page: 1,
        // akhir dari page
        last_page: 0,
        // ini adalah banyaknya row yang diambil dalam 1 page
        per_page: 0,
        // banyak page dalam 1 halaman, dalam hal ini ada 3
        // jadi bentuknya pagenya akan seperti ini
        // 1 2 3
        // 4 5 6
        // 7 8 9
        // dan seterusnya
        limit_page: 3,
        // ini adalah posisi page per limit pagenya, maksudnya gini
        // kan bentuk page itu akan seprti ini ya
        // 1 2 3 -> position_page_per_limit_page = 1
        // 4 5 6 -> position_page_per_limit_page = 2
        // 7 8 9 -> position_page_per_limit_page = 3
        position_page_per_limit_page: 1,
        total: 0
      },
      keyword: '',
      rowEdit: null,
      disabled: {
        buttonTambah: false,
        buttonExport: false,
        buttonImport: false,
        buttonPagination: false,
        buttonExportLargeCSV: false,
      }, 
      modalEmailComponent: {
        show: false,
        to: '',
      },
      show: {
        buttonPagination: false,
        inputSearch: false
      },
      isProcess: {
        updateStudent: false,
        deleteStudent: Array(10).fill(false)
      }
    }
  },

  mounted() {
    this.getStudents();
  },

  methods: {
    exportLargeCSV() {
      Swal.fire({
        icon: "question",
        title: "Do You Want To Export Data Large?",
        confirmButtonText: "Exports",  
      })
      .then(result => {
        if (result.isConfirmed) {
          this.$store
              .dispatch('exportLargeCSV')
              .then(response => {
                this.$global.isExportingLargeCSV = true;
                ElNotification({ type: 'success', title: 'Success', message: response.data.message });
              })
              .catch(error => {
                ElNotification({ type: 'error', title: 'Error', message: error.response.data.message });
              })
        }
      });
    },

    FormAddStudent_CancelProcess() {
      this.isClickButtonTambah = false;
    },

    FormAddStudent_BeforeProcess() {
      this.disabled.buttonTambah = true;
      $('#button-tambah').html('Process');
    },

    FormAddStudent_AfterProcessSuccess() {
      this.disabled.buttonTambah = false;
      this.isClickButtonTambah = false;
      $('#button-tambah').html('Tambah');

      this.getStudents();
    },

    FormAddStudent_AfterProcessError() {
      this.disabled.buttonTambah = false;
      $('#button-tambah').html('Tambah');
    },

    // sebelum form input excel mengimportkan data ke database
    FormInputExcel_BeforeProcess() {
      this.disabled.buttonImport = true;
      $('#button-import').html('process...');
    },

    // setelah form input excel melakukan process import data ke database, dan berhasil
    FormInputExcel_AfterProcessSuccess() {
      this.disabled.buttonImport = false;
      this.isClickButtonImport = false;  
      $('#button-import').html('Import');

      this.getStudents();
    },

    // setelah form input excel melakukan process import data ke database, dan error
    FormInputExcel_AfterProcessError() {
      this.disabled.buttonImport = false;
      $('#button-import').html('Import');
    },

    // menutup modal email component
    hiddenModalEmailComponent() {
      this.modalEmailComponent.show = false;
      this.modalEmailComponent.to = '';
    },

    // menampilkan mode email component
    showModalEmailComponent(email) {
      if(this.$store.getters.user.emailActive) {
        this.modalEmailComponent.show = true;
        this.modalEmailComponent.to = email;
      } else {
        ElNotification({ type: 'error', title: 'Error', message: 'Your email settings are not complete <a href="/profile#email-setting" class="underline">click here</a>' });
      }
    },

    // menampilkan form input excel
    showImportExcel() {
      this.isClickButtonImport = !this.isClickButtonImport;
      this.isClickButtonTambah = false;
    },

    showViewAddStudent() {
      this.isClickButtonTambah = !this.isClickButtonTambah;
      this.isClickButtonImport = false;
    },

    exportExcel() {
      Swal.fire({
        icon: "question",
        title: "Do You Want To Export Students?",
        confirmButtonText: "Exports",  
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.disabled.buttonExport = true;
          $('#button-export').html('process...');

          this.$store.dispatch('exportExcel', {
            user_id: this.$store.getters.user.id
          })
          .then(response => {
            // ambil url 
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Membuat elemen <a> secara dinamis
            const link = document.createElement('a');
            link.href = url;

            // Menentukan nama file yang akan diunduh
            link.setAttribute('download', 'students.xlsx');

            // Menambahkan elemen link ke dalam body dokumen
            document.body.appendChild(link);

            // Memicu klik pada link untuk memulai unduhan
            link.click();

            // Menghapus elemen link dari dokumen
            document.body.removeChild(link);

            // Membersihkan URL Blob untuk menghemat memori
            window.URL.revokeObjectURL(url);

            this.disabled.buttonExport = false;
            $('#button-export').html('Export');

            ElNotification({ type: 'success', title: 'Success', message: 'Export Students Successfully' });
          })
          .catch(error => {
            console.error(error);

            this.disabled.buttonExport = true;
            $('#button-export').html('process...');
          });
        }
      });
    },

    getPage(buttonPosition) { 
      return (this.students.limit_page * (this.students.position_page_per_limit_page - 1)) + buttonPosition;
    },

    setCurrentPage(action, page) {
      if(action === 'prev') {
        if(this.students.current_page > 1) {
          this.students.current_page--;
          this.students.position_page_per_limit_page = Math.ceil(this.students.current_page / this.students.limit_page);
          this.students.data = [];

          $('#empty-students').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-lg block mb-5"></i>Loading Data...');
          
          this.getStudents();
          this.rowEdit = null;
          this.isClickButtonTambah = false;
        }
      }
      else if(action === 'next') {
        if(this.students.current_page < this.students.last_page) {
          this.students.current_page++;
          this.students.position_page_per_limit_page = Math.ceil(this.students.current_page / this.students.limit_page);
          this.students.data = [];
          // console.log({
          //     position_page_per_limit_page: this.students.position_page_per_limit_page,
          //     limit_page: this.students.limit_page,
          //     current_page: this.students.current_page,
          // });

          $('#empty-students').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-lg block mb-5"></i>Loading Data...');
          
          this.getStudents();
          this.rowEdit = null;
          this.isClickButtonTambah = false;
        }
      }
      else {
        this.students.current_page = page;
        this.students.position_page_per_limit_page = Math.ceil(this.students.current_page / this.students.limit_page);
        this.students.data = [];
        
        $('#empty-students').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-lg block mb-5"></i>Loading Data...');
        
        this.getStudents();
        this.rowEdit = null;
        this.isClickButtonTambah = false;
      }
    },

    searchStudent(event) {
      this.keyword = event.target.value;
      
      this.students.current_page = 1;
      this.students.position_page_per_limit_page = 1;
      this.students.data = [];
      
      $('#empty-students').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-lg block mb-5"></i>Loading Data...');
      
      this.getStudents();
    },

    // untuk mendapatkan semua data students
    async getStudents() {
      this.disabled.buttonPagination = true;

      try {
        const response = await this.$store.dispatch('getStudents', {
          user_id: this.$store.getters.user.id,
          current_page: this.students.current_page,
          keyword: this.keyword
        });

        this.students.data = response.data.students.data;
        this.students.last_page = response.data.students.last_page;
        this.students.total = response.data.students.total;
        this.students.per_page = response.data.students.per_page;
  
        if(this.students.data.length === 0) {
          // this.$nextTick kode di dalam callback dieksekusi setelah Vue selesai memperbarui DOM
          this.$nextTick(() => {
            $('#empty-students').html('No Data');
            this.show.buttonPagination = false;
          });
        }
        else {          
          this.disabled.buttonPagination = false;
          this.show.buttonPagination = true;
          this.show.inputSearch = true;
        }
      } 
      catch (error) {
        console.error(error);
        // error ketika belum terautentikasi
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
      }
    },

    // ini operasi, jika icon pencil di klik
    rowEditActive(index, id) {
      this.rowEdit = index;
    }, 

    // ini operasi, jika icon close di klik
    cancelEdit(index) {
      this.rowEdit = null;
      this.getStudents();
    },

    // untuk update student
    updateStudent(index) {
      this.isProcess.updateStudent = true;

      this.$store.dispatch('updateStudent', {
        id: this.students.data[index].id,
        nama: this.students.data[index].nama,
        email: this.students.data[index].email,
        tanggal_lahir: this.students.data[index].tanggal_lahir,
        jenis_kelamin: this.students.data[index].jenis_kelamin,
        kelas: this.students.data[index].kelas,
      })
      .then(response => {
        this.isProcess.updateStudent = false;
        if(response.data.status === 200 && response.data.message === 'Student Update Successfully') {
          this.rowEdit = null;
          this.getStudents();
          ElNotification({ type: 'success', title: 'Success', message: response.data.message });
        }
      })
      .catch(error => {
        this.isProcess.updateStudent = false;
        console.error(error);
        // error ketika belum terautentikasi
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
        else {
          ElNotification({ type: 'error', title: 'Error', message: Object.values(error.response.data.message).flat().join(' ') });
        }
      });
    },  

    // untuk delete student
    deleteStudent(id, index) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.isProcess.deleteStudent[index] = true;
          this.$store.dispatch('deleteStudent', {
            id
          })
          .then(async (response) => {
            console.log(response);
            if(response.data.status === 200 && response.data.message === 'Student Delete Successfully') {
              /* UNTUK PAGINATION SETELAH HAPUS DATA, DAN KITA BERADA DI PAGE AKHIR, MAKA KITA DIARAH KAN KE PAGE SEBELUMNYA, DAN LAKUKAN INI JIKA CURRENT PAGE ITU TIDAK SAMA DENGAN 1*/
              if(this.students.current_page === this.students.last_page && this.students.current_page !== 1) {
                this.students.current_page = Math.ceil((this.students.total - 1) / this.students.per_page);
                this.students.position_page_per_limit_page = Math.ceil(this.students.current_page / this.students.limit_page);
              }
              /* UNTUK PAGINATION SETELAH HAPUS DATA, DAN KITA BERADA DI PAGE AKHIR, MAKA KITA DIARAH KAN KE PAGE SEBELUMNYA, DAN LAKUKAN INI JIKA CURRENT PAGE ITU TIDAK SAMA DENGAN 1*/

              await this.getStudents();
              
              this.isProcess.deleteStudent[index] = false;

              ElNotification({ type: 'success', title: 'Success', message: 'Delete Student Succesfully' });
            }
          })
          .catch(error => {
            console.error(error);

            this.isProcess.deleteStudent[index] = false;

            // error ketika belum terautentikasi
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
          });
        }
      });
      
    }
    
  },
}

</script>