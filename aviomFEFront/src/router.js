import Router from 'vue-router'
import Login from './Login.vue'
import Controller from './views/controller/Controller.vue'
import EventManagement from './views/controller/views/EventManagement.vue'
import Omega from './views/omega/Omega.vue'
import EventsToAttend from './views/omega/EventsToAttend.vue'
import HoEvents from './views/omega/HoEvents.vue'
import HoControllers from './views/omega/HoControllers.vue'
import Controllers from './views/omega/Controllers.vue'
import CreateEvent from './views/omega/CreateEvent.vue'
import EventsToChecked from './views/omega/EventsToChecked.vue'
import UserManagement from './views/Admin/views/UserManagement.vue'
import RolesManagement from './views/Admin/views/RolesManagement.vue'
import ServiceManagement from './views/Admin/views/ServiceManagement.vue'
import SystemSettings from './views/Admin/views/SystemSettings.vue'
import Admin from './views/Admin/Admin'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import {OMEGA,CONTROLLER,ADMIN} from "./roles";

export default new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/controller',
      name: CONTROLLER.toString().toLowerCase(),
      redirect: '/controller/eventManagement',
      component: Controller,
      children:[
        {
          path: 'eventManagement',
          name: 'eventManagement',
          component: EventManagement
        },
      ],

    },
    {
      path: '/omega',
      name: OMEGA.toString().toLowerCase(),
      redirect: '/omega/eventstoattend',
      component: Omega,
      children: [
        {
          path: 'eventstoattend',
          name: 'eventstoattend',
          component: EventsToAttend
        },
        {
          path: 'eventstochecked/:id',
          name: 'eventstochecked',
          component: EventsToChecked
        },
        {
          path: 'controllers',
          name: 'controllers',
          component: Controllers
        },
        {
          path: 'hoevents/:id',
          name: 'hoevents',
          component: HoEvents
        },
        {
          path: 'hocontrollers/:id',
          name: 'hocontrollers',
          component: HoControllers
        },
        {
          path: 'createevent',
          name: 'createevent',
          component: CreateEvent
        },
      ]
    },

    
    {
      path:'/adminPane',
      name: ADMIN.toString().toLocaleLowerCase(),
      redirect: '/adminPane/userManagement',
      component: Admin,
      children:[
        {name:'userManagement',
         path:'userManagement',
         component:UserManagement
        },
        {
          name:'rolesManagement',
          path:'rolesManagement',
          component:RolesManagement
        },
        {
          name:'serviceManagement',
          path:'serviceManagement',
          component:ServiceManagement
        },
         {
           name:'systemSettings',
           path:'systemSettings',
           component:SystemSettings
         },
         
      ]
    }
  ]
})
