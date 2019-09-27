import Router from 'vue-router';

export default new Router({
  routes:[
    {
      path:'/',
      component:()=>import('./views/User')
    },
    {
      path:'/read',
      component:()=>import('./views/Read')
    }
  ]
});