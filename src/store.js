import { createStore } from "vuex";
import axios from "@/axios";
import { ElNotification } from "element-plus";

export default createStore({
  state: {
    user: '',
    userImage: ''
  },

  getters: {
    user: state => state.user,
    userImage: state => state.userImage
  },

  actions: {
    fetchUserFromLocalStorage() {
      this.state.user = JSON.parse(localStorage.getItem('user'));
    },

    fetchimgFileFromLocalStorage() {
      this.state.userImage = JSON.parse(localStorage.getItem('userImage'));
    },

    fetchUserImageFromGoogleDrive(context, data) {
      return new Promise((resolve, reject) => {
        axios.get(`/users/image/${data.path}`)
             .then(response => {
              resolve(response);
             })
             .catch(error => {
              reject(error);
             })
      })
    },

    async showNotifications(context, data) {
      const notifications = data.notifications;
      for (const item of notifications) {
        if (item.name === 'download') {
          const downloadLink = item.data.link; 
          const linkEl = document.createElement('a');
          
          linkEl.href = downloadLink;
          linkEl.download = downloadLink.split('/').pop(); 
          linkEl.style.display = 'none';
          document.body.appendChild(linkEl);
          linkEl.click();
          document.body.removeChild(linkEl);
    
          ElNotification({
            type: item.status,
            title: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            message: item.message,
          });
    
          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          ElNotification({
            type: item.status,
            title: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            message: item.message
          });
        }
      }
    },

    exportLargeCSV(context, data) {
      return new Promise((resolve, reject) => {
        axios.get('/large/export/csv')
             .then(response => {
              resolve(response);
             })
             .catch(error => {
              reject(error);
             })
      });
    },  

    uploadImage(context, data) {
      return new Promise((resolve, reject) => {
        axios.post('/users/image', data)
             .then(response => {
              resolve(response);
             })
             .catch(error => {
              reject(error);
             })
      });
    },

    deleteImage(context, data) {
      return new Promise((resolve, reject) => {
        axios.delete(`/users/image/${data.id}`)
             .then(response => {
              resolve(response);
             })
             .catch(error => {
              reject(error);
             })
      });
    },

    processSendEmail(context, data) {
      return new Promise((resolve, reject) => {
        axios.post('/sendemail', {
          idUser: data.idUser,
          to: data.to,
          subject: data.subject,
          content: data.content,
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
      });
    },

    updateUser(context, data) {
      return new Promise((resolve, reject) => {
        // axios.post ini di override menjadi put
        axios.put(`/users/${data.id}`, {
          file: data.file,
          name: data.name,
          jenis_kelamin: data.jenis_kelamin,
          jabatan: data.jabatan,
          tanggal_lahir: data.tanggal_lahir,
          alamat: data.alamat,
          pendidikan: data.pendidikan,
        })
        .then(response => {
          resolve(response);
        }) 
        .catch(error => {
          reject(error);
        });
      });
    },

    updateEmail(context, data) {
      return new Promise((resolve, reject) => {
        axios.put(`/users/email/${data.id}`, {
          email: data.email,
          mail_mailer: data.mail_mailer,
          mail_host: data.mail_host,
          mail_port: data.mail_port,
          mail_password: data.mail_password,
          mail_encryption: data.mail_encryption,
        })
        .then(response => {
          resolve(response);
        }) 
        .catch(error => {
          reject(error);
        });
      });
    },

    importExcel(context, data) {
      return new Promise((resolve, reject) => {
        axios.post('/students/import/excel', data)
             .then(response => {
               resolve(response);
             })
             .catch(error => {
              reject(error);
             })
      })
    },

    exportExcel(context, data) {
      return new Promise((resolve, reject) => {
        axios.get(`/students/export/excel?user_id=${data.user_id}`, {
          responseType: 'blob'
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
      });
    },

    getStudents(context, data) {
      return new Promise((resolve, reject) => {
        axios.get(`/students?user_id=${data.user_id}&page=${data.current_page}&keyword=${data.keyword}`)
             .then(response => {
              resolve(response);
             })
             .catch(error => {
              reject(error);
             })
      });
    },

    addStudent(context, data) {
      return new Promise((resolve, reject) => {
        axios.post('/students', {
          user_id: data.user_id,
          nama: data.nama,
          email: data.email,
          tanggal_lahir: data.tanggal_lahir,
          jenis_kelamin: data.jenis_kelamin,
          kelas: data.kelas,
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
      });
    },

    updateStudent(context, data) {
      return new Promise((resolve, reject) => {
        axios.put(`/students/${data.id}`, {
          nama: data.nama,
          email: data.email,
          tanggal_lahir: data.tanggal_lahir,
          jenis_kelamin: data.jenis_kelamin,
          kelas: data.kelas,
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
      });
    },

    deleteStudent(context, data) {
      return new Promise((resolve, reject) => {
        axios.delete(`/students/${data.id}`)
             .then(response => {
               resolve(response);
             })
             .catch(error => {
               reject(error);
             });
      });
    },

    registerSubmit(context, data) {
      return new Promise((resolve, reject) => {
        axios.post('/register', {
          name: data.name,
          email: data.email,
          password: data.password,
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
      });
    },

    loginSubmit(context, data) {
      return new Promise((resolve, reject) => {
        axios.post('/login', {
          email: data.email,
          password: data.password,
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
      });
    },

    logout(context, data) {
      return new Promise((resolve, reject) => {
        axios.post('/logout')
             .then(response => {
              resolve(response);
             })
             .catch(error => {
              reject(error);
             })
      });
    }
  }
});