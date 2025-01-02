<template>
  <form 
    id="formUploadFile" 
    class="items-center flex justify-center w-full transition-all duration-300 ease-in-out bg-gray-100 hover:bg-gray-200 rounded-lg overflow-hidden h-0" 
    :class="{'h-36 border-2 border-gray-300 border-dashed mb-5': isClickButtonImport, 'disabled': disabled}"
    :disabled="disabled">
    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-full cursor-pointer">
      <div class="flex flex-col items-center justify-center">
        <svg class="w-8 h-8 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
        </svg>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-bold" id="message-file">Upload File xlsx</p>
      </div>
      <input id="dropzone-file" ref="dropzoneFile" type="file" name="file" class="hidden" :disabled="disabled" @change="importExcel"/>
    </label>
  </form>
</template>

<script>
import { ElNotification } from 'element-plus';

export default {
  props: {
    isClickButtonImport: {
      type: Boolean,
      required: true,
    }
  },

  data() {
    return {
      disabled: false
    }
  },

  methods: {
    importExcel() {
      const file = this.$refs.dropzoneFile.files[0];
      const fileExtension = file.name.split('.').pop();

      if(fileExtension === 'xlsx') {
        const data = new FormData();
        data.append('user_id', this.$store.getters.user.id);
        data.append('file', file);

        this.disabled = true;
        $('#message-file').html('process...');

        this.$emit('onBeforeProcess');

        this.$store.dispatch('importExcel', data)
                   .then(response => {
                    console.log(response);

                    /* UNTUK PAGINATION, SETELAH MENAMBAHKAN MURID, AKAN DI ARAH KAN KE PAGE TERBARU */
                    // this.students.current_page = Math.ceil((this.students.total + 1) / this.students.per_page);
                    // this.students.position_page_per_limit_page = Math.ceil(this.students.current_page / this.students.limit_page);
                    /* UNTUK PAGINATION, SETELAH MENAMBAHKAN MURID, AKAN DI ARAH KAN KE PAGE TERBARU */

                    this.disabled = false;
                    
                    $('#message-file').html('Upload File xlsx');
                    $('#dropzone-file').val('');

                    ElNotification({ type: 'success', title: 'Success', message: response.data.message });

                    this.$emit('onAfterProcessSuccess');
                   })
                   .catch(error => {
                    console.error(error);

                    this.disabled = false;
                    
                    $('#message-file').html('Upload File xlsx');
                    $('#dropzone-file').val('');

                    let errorMessage = Object.values(error.response.data.message);
                    errorMessage = errorMessage.join(',');

                    ElNotification({ type: 'error', title: 'Error', message: errorMessage });

                    this.$emit('onAfterProcessError');
                   });
      } 
      else {
        ElNotification({ type: 'error', title: 'Error', message: 'file not xlsx' });
      }
    },
  }
}
</script>