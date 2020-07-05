import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/common/token.service";
import { ATC_API_URL } from "@/common/settings.service";

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = ATC_API_URL;
  },

  setHeader() {
    Vue.axios.defaults.headers.common[ 
      "Authorization"
    ] = `Bearer ${JwtService.getToken()}`;
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  get(resource, slug = "", params) {
    console.log("URL:");
    console.log(`${resource}/${slug}`);
    return Vue.axios.get(`${resource}/${slug}`, params)
        .catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        }
    );
  },

  post(resource, params) {
    return Vue.axios.post(`${resource}`, params)
        .catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        }
    );
  },  

  update(resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  delete(resource) {
    return Vue.axios.delete(resource)
        .catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        }
    );
  }
};

export default ApiService;

const operatorsResource = "/operators"
export const OperatorsService = {
    retrieveAll(online){
      ApiService.setHeader();
      return ApiService.query(operatorsResource + "?online=" + online);
    },
    retrieveHistory(accountName){
      ApiService.setHeader();
      return ApiService.get(operatorsResource, "controllers/" + accountName + "/history");
    },
    create(operator){
      ApiService.setHeader();
      return ApiService.post(operatorsResource,operator);
    },
    
    update(operator){
      ApiService.setHeader();
      return ApiService.update(operatorsResource, operator)
    },

    destroy(accountName){
      ApiService.setHeader();
      return ApiService.delete(operatorsResource+"/"+accountName)
    }
};

const eventsResource = "/events"
export const EventsService = {
    retrieveHistory(accountName){
      ApiService.setHeader();
      return ApiService.get(eventsResource, "controllers/" + accountName + "/history");
    }
};


const rolesResource = "/roles"
export const RolesServices = {
    retrieveAll(current){
      ApiService.setHeader();
      console.log(ApiService.query(rolesResource+ "?current="+ current));
      return ApiService.query(rolesResource+ "?current="+ current);
    },
    create(roleName){
      ApiService.setHeader();
      return ApiService.post(rolesResource,roleName);
    },
    
    update(roleName){
      ApiService.setHeader();
      return ApiService.update(rolesResource, roleName);
    },

    destroy(roleName){
      ApiService.setHeader();
      return ApiService.delete(rolesResource+"/"+roleName);
    }
  
};