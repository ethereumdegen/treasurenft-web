import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home.vue'
 
import Contribute from './views/Contribute.vue'
import Mint from './views/Mint.vue'

import Collection from './views/Collection.vue'
  
import Members from './views/Members.vue'
 
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
      path: '/members',
      name: 'members',
      component: Members
    } ,
    {
      path: '/contribute',
      name: 'contribute',
      component: Contribute
    } ,
    {
      path: '/mint',
      name: 'mint',
      component: Mint
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
