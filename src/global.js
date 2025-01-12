import { reactive } from 'vue';
import UserImage from "@/assets/imgs/user.jpg"

const global = reactive({
    userImage: UserImage,
    isCLickDropdown: {
        profile: false,
        navbar: false
    },
    isDownloadFailedLead: false,

    getDownloadProgressSetTimeout: null,
    getDownloadProgressSetInterval: null,
});

export default global;