import Router from 'vue-router';
import User from './views/User';
import Read from './views/Read';
import Noid from './views/Noid';

export default new Router({
  routes:[
    {
      path:'/',
      component:User
    },
    {
      path:'/read',
      component:Read
    },
    {
      path:'/noid',
      component:Noid
    },
  ]
});