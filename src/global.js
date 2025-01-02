import { reactive } from 'vue';
import UserImage from "@/assets/imgs/user.jpg"

const global = reactive({
    userImage: UserImage,
    isCLickDropdown: {
        profile: false,
        navbar: false
    },
    isExportingLargeCSV: false,
});

export default global;