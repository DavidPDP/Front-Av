import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import operators from "@/store/operators.module";
import events from "@/store/events.module";
import roles from "@/store/roles.module";

Vue.use(Vuex);

const getDefaultState=()=>{
  return {
      person:{
          accountName:'',
          name:'',
          roles:[],
          currentRole:''
      }
  }
}

export default new Vuex.Store({
  modules: {
    operators,
    events,
    roles
  },
  plugins:[createPersistedState()],
  state: {
    backend: 'http://localhost:8085',
    token:'',
    person: {
      id: '',
      name: "",
      currentRole:"",
      roles:[],
      
    },
    states: {
      'Pending': 'Sin asignar',
      'Assigned': 'Asignado',
      'In proccess':	'En proceso',
      'On hold': 'En espera',
      'Verification': 'Por verificar',
      'Archived': 'Archivado',
      'Available': 'Disponible',
      'Event assigned': 'Evento asignado',
      'Busy': 'Ocupado',
      'Unavailable': 'No disponible'
    },
    userStates: {
      'Disponible': 'Available',
      'Evento asignado': 'Event assigned',
      'Ocupado' : 'Busy',
      'No disponible': 'Unavailable'
    },
    eventStates: {
      'Sin asignar': 'Pending',
      'Asignado': 'Assigned',
      'En proceso': 'In proccess',
      'En espera': 'On hold',
      'Por verificar': 'Verification',
    },
    logs: {
      'Created': 'Creado',
      'Assigned': 'Asignado',
      'Accepted': 'Aceptado',
      'Rejected': 'Rechazado',
      'Solved': 'Resuelto',
      'Validated': 'Verificado',
      'Unvalidated': 'No verificado'      
    }
  },
  mutations: {
    updateAccountName(state, accountName) {
      state.person.accountName = accountName
    },
    updateName(state, name) {
      state.person.name = name
    },
    saveToken(state, token){
      state.token = token
    },
    updateCurrentRol(state,currentRole){
      state.person.currentRole = currentRole
    },
    updateRoles(state, newroles){
      state.person.roles=newroles;
    },
    resetState(state){
      Object.assign(state,getDefaultState())
    },
    clearToken(state){
      state.token='';
    }
  },
  actions: {
    setAccountName({ commit }, accountName) {
      commit('updateAccountName', accountName)
    },
    setPersonName({ commit }, name) {
      commit('updateName', name)
    },
    setToken({ commit }, token) {
      commit('saveToken', token)
    },
    setCurrentRol({commit}, currentRole){
      commit('updateCurrentRol',currentRole)
    },
    resetPersonState({commit}){
      commit('resetState')
    },
    removeToken({ commit }){
      commit('clearToken');
    },
    updateRole({commit},role){
      commit('changeCurrentRole', role)
    },
    setPersonRoles({commit}, roles){
      commit('updateRoles', roles)
    },
  },
})