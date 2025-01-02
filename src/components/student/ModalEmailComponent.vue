<template>
  <!-- modal -->
  <div 
    v-if="show" 
    ref="modalEmail" 
    @click="hiddenModalEmailComponent" 
    class="fixed top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,.3)] z-40 flex justify-center items-center">
    <form 
      @submit.prevent="" 
      @click.stop 
      class="w-2/5 bg-white border border-neutral-500 rounded-md shadow-[rgb(80,80,80)] shadow-xl p-4">
      <h1 class="text-3xl font-medium text-center">Send Email</h1>

      <div class="input-container mt-3">
        <label for="to">To</label>
        <input 
          readonly 
          type="email" 
          id="to" 
          class="border w-full border-neutral-500 rounded outline-none py-1 px-1.5 shadow" 
          :value="to">
      </div>

      <div class="input-container mt-3">
        <label for="subject">Subject</label>
        <input 
          :readonly="disabled"
          type="text" 
          id="subject" 
          class="border w-full border-neutral-500 rounded outline-none py-1 px-1.5 shadow" 
          v-model="sendEmail.subject">
      </div>

      <div class="input-container mt-3">
        <label for="content">Content</label>
        <textarea 
          :readonly="disabled"
          id="content" 
          class="border w-full border-neutral-500 rounded outline-none py-1 px-1.5 shadow" 
          rows="9" 
          v-model="sendEmail.content"></textarea>
      </div>

      <button 
        id="buttonSendEmail"
        :class="{'disabled': disabled}"
        :disabled="disabled" 
        ref="buttonSendEmail" 
        class="w-full py-1 mt-4 bg-gray-200 border border-neutral-300 rounded shadow-sm hover:bg-gray-300" 
        @click="processSendEmail">
        Send Email
      </button>
    </form>
  </div>
  <!-- modal -->
</template>


<script>
import { ElNotification } from 'element-plus';
import Swal from 'sweetalert2';

export default {
  props: {
    to: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      isSendEmail: false,
      disabled: false,
      sendEmail: {
        subject: '',
        content: ''
      },
    }
  },

  methods: {
    processSendEmail() {
      this.isSendEmail = true;
      this.disabled = true;

      this.$refs.modalEmail.classList.add('model-email-process');
      $('#buttonSendEmail').html('Process...');

      this.$store.dispatch('processSendEmail', {
        idUser: this.$store.getters.user.id,
        to: this.to,
        subject: this.sendEmail.subject,
        content: this.sendEmail.content,
      })
      .then(response => {
        console.log(response);
        
        this.isSendEmail = false;
        this.disabled = false;

        this.$refs.modalEmail.classList.remove('model-email-process');
        $('#buttonSendEmail').html('Send Email');

        if(response.status === 200) {
          ElNotification({ type: 'success', title: 'Success', message: response.data.message });
          
          this.hiddenModalEmailComponent();
        }
      })
      .catch(error => {
        console.error(error);

        this.isSendEmail = false;
        this.disabled = false;

        this.$refs.modalEmail.classList.remove('model-email-process');
        $('#buttonSendEmail').html('Send Email');

        Swal.fire({
          icon: "error",
          title: error.message.includes('timeout of') ? error.message : '', // ada 2 kemungkinan error, error dari email dan error karena timeout
          text: error.message.includes('timeout of') ? 'Something Error Configuration Email' : error.response.data.error, // ada 2 kemungkinan error, error dari email dan error karena timeout
          width: '80%'
        });
        this.hiddenModalEmailComponent();
      });
    },

    hiddenModalEmailComponent() {
      if(!this.isSendEmail) {
        this.$emit('onAfterProcess');
        this.sendEmail = {
          subject: '',
          content: ''
        }
      }
    },
  }
}
</script>