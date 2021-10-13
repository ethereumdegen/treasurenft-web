import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home.vue'
  
import Collection from './views/Collection.vue'
   
 
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({  
  mode: 'history',
  base: process.env.PUBLIC_URL,
  routes: [

    {
      path: '/',
      name: 'home',
      component: Home
    } ,

     
 

    {
      path: '/collection',
      name: 'collection',
      component: Collection
    } ,
   
    {
      path: '/*',
      component: NotFound
    },
  ]
})
