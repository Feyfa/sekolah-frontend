import { createApp } from 'vue';
import AlertComponent from '@/components/global/AlertComponent.vue'

const AlertPlugin = {
  install(app) {
    // Buat instance dari komponen alert
    const alertApp = createApp(AlertComponent);
    const instance = alertApp.mount(document.createElement('div'));
    document.body.appendChild(instance.$el);

    // Tambahkan metode $alert ke aplikasi Vue
    app.config.globalProperties.$alert = (options) => {
      instance.setAlertMessage(options.status, options.message);
    };
  }
};

export default AlertPlugin;
