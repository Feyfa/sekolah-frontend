import { reactive } from "vue";
import UserImage from "@/assets/imgs/user.jpg"

const GlobalPlugin = {
  install(app) {
    // membuat attribute nya menjadi reactive, jadi saat berbeda file maka attribute nya juga berubah juga
    const globalData = reactive({
      userImage: UserImage,
      isCLickDropdown: {
        profile: false,
        navbar: false
      }
    });

    app.config.globalProperties.$global = globalData;
  }
};

export default GlobalPlugin;