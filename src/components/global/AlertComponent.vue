<template>
  <teleport to="body">
    <!-- alert custom -->
    <div v-if="alert.message && alert.status" class="mini-alert border border-neutral-500 rounded shadow-lg fixed top-16 right-8 flex justify-between items-center gap-8 z-50 min-w-80 p-2.5 alert" :class="{'bg-green-500': alert.status === 'success', 'bg-red-500': alert.status === 'error'}">
      <div class="flex justify-center items-center gap-2">
        <i class="bi bi-bell"></i>
        <h2 v-html="alert.message"></h2>
      </div>
      <button type="button" @click="closeAlert">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
    <!-- alert custom -->
  </teleport>
</template>

<script>
export default {
  data() {
    return {
      alert: {
        status: '',
        message: ''
      },
    }
  },

  methods: {
    setAlertMessage(status, message) {
      this.alert.status = status;
      this.alert.message = message;

      setTimeout(() => {
        this.alert = {
          status: '',
          message: '',
        }
      }, 3000);
    },

    closeAlert() {
      this.alert =  {
        status: '',
        message: ''
      };
    },
  }
}
</script>