import Vue from 'vue';
import Router from 'vue-router';
import router from './router';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import store from './store';
import ApiService from "./common/api.service";
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Router)
ApiService.init();
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
