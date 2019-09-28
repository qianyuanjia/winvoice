import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router';
import router from './router';
import 'iview/dist/styles/iview.css';
import './style/reset.css'
import axios from 'axios';
import { Modal ,Input,Message} from 'iview'


Vue.use(Router);

Vue.config.productionTip = false
Vue.prototype.$http=axios.create({
  baseURL:window.baseUrl+'/qsfx',
  timeout:3000
});
Vue.prototype.$Modal=Modal;
Vue.prototype.$Message=Message;
Vue.component('Input',Input);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
