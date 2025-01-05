import { createRouter, createWebHistory } from 'vue-router'
import axios from '@/axios';
import store from '@/store';
import global from '@/global';
import { ElNotification } from 'element-plus';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
  },
  
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {public: true}
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: {public: true}
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {public: false}
    },
    {
      path: '/students',
      name: 'students',
      component: () => import('../views/StudentView.vue'),
      meta: {public: false}
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {public: false}
    },
  ]
});

function showNotifications(notifications) {
  for (const item of notifications) {
    if (item.name === 'download') {
      try {
        const response = axios.get(item.data.link, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const linkEl = document.createElement('a');
        
        linkEl.href = url;
        linkEl.download = item.data.link.split('/').pop();
        document.body.appendChild(linkEl);
        linkEl.click();
        document.body.removeChild(linkEl);
        window.URL.revokeObjectURL(url);

        ElNotification({
          type: item.status,
          title: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          message: item.message,
          showClose: false,
        });
      } catch (error) {
        global.isExportingLargeCSV = false;

        ElNotification({
          type: 'error',
          title: 'Error',
          message: 'export csv failed',
          showClose: false,
        });
      }
    } else {
      ElNotification({
        type: item.status,
        title: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        message: item.message,
        showClose: false,
      });
    }
  }
}

router.beforeEach((to, from, next) => {
  store.dispatch('fetchUserFromLocalStorage');
  store.dispatch('fetchimgFileFromLocalStorage');

  // ambil token
  const token = localStorage.getItem('token');

  // kondisi ketika belum login token masih belum ada
  if(!to.meta.public && !token) {
    next({name: 'login'});
  }
  // jika path di url mengarahkan ke /register dan /login
  // kondisi ketika mau ke url register dan login
  else if (to.path === '/register' || to.path === '/login') {
    // kondisi sudah ada token, mau ke url register dan login, 
    if(token) {
      // cek validasi tokennya
      axios.get('/tokenvalidation')
           // jika token valid, maka paksa di ke wilayah yang udah di autentikasi
           .then(response => {
            // console.log(response)
            if(response.status === 200 && response.data.message === 'token valid') {
              global.isExportingLargeCSV = response.data.isExporting.largeCSV;

              // notification
              showNotifications(response.data.notifications);
              // notification

              next({name: 'home'});
            }
           })
           // jika token tidak valid, maka yaudah biarkan saja ke halaman register atau login 
           .catch(error => {
            // console.error(error);
            if(error.response.status === 401 && error.response.data.message === 'Unauthenticated.') 
             next();
           }); 
    }
    // kondisi ketika belum ada token, mau ke url register atau login
    else {
      next();
    }
  }
  // kondisi masuk ke url selain /register dan /login dan memliki token
  else {
    // cek validasi tokennya
    axios.get('/tokenvalidation')
         // jika token valid, maka yaudah biarkan saja ke halaman yang dia ingin tuju
         .then(response => {
          // console.log(response)
          if(response.status === 200 && response.data.message === 'token valid') {
            global.isExportingLargeCSV = response.data.isExporting.largeCSV;

            // notification
            showNotifications(response.data.notifications);
            // notification
            
            next();
          }
         })
         // jika token tidak valid, maka paksa di ke wilayah yang belm di autentikasi
         .catch(error => {
          console.error(error);
          if(error.response.status === 401 && error.response.data.message === 'Unauthenticated.') 
            next({name: 'login'});
         });  
  }
});

export default router
