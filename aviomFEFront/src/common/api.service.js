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
    return Vue.axios.post(`${resource}`, params);
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
  retrieveAll(online) {
    ApiService.setHeader();
    return ApiService.query(operatorsResource + "?online=" + online);
  },
  retrieveHistory(accountName) {
    ApiService.setHeader();
    return ApiService.get(operatorsResource, "controllers/" + accountName + "/history");
  },
  create() {

  },

  update() {

  },

  destroy() {

  }
};

const eventsResource = "/events"
export const EventsService = {
  retrieveHistory(accountName) {
    ApiService.setHeader();
    return ApiService.get(eventsResource, "controllers/" + accountName + "/history");
  }
};


const evaluatorParametersResource = "/evaluator/parameters"
export const ParametersService = {
  retrieveParameters(active) {
    // ApiService.setHeader();
    if (active) {
      return ApiService.get(evaluatorParametersResource, "active");
    } else {
      return ApiService.query(evaluatorParametersResource);
    }

  },
  updateParameter(parameter) {
    // ApiService.setHeader();
    return ApiService.update(evaluatorParametersResource, parameter.name, parameter);
  }
}

const evaluatorVariablesResource = "/evaluator/variables"
export const VariablesService = {
  retrieveVariables() {
    // ApiService.setHeader();
    return ApiService.query(evaluatorVariablesResource);


  },
  addVariable(variable) {
    return ApiService.post(evaluatorVariablesResource, variable);
  },
  updateVariable(variable) {
    // ApiService.setHeader();
    return ApiService.update(evaluatorVariablesResource, variable.name, variable);
  }
}

const evaluatorExpressionsResource = "/evaluator/expressions"
export const ExpressionsService = {
  retrieveFunctions() {
    // ApiService.setHeader();
    return ApiService.get(evaluatorExpressionsResource, "functions");
  },

  evaluateExpression(expression) {
    // ApiService.setHeader();
    return ApiService.post(evaluatorExpressionsResource, { expression: expression });
  }

}

const evaluatorMeasurementsResource = "/evaluator/measurements";
const NAME_REQUEST_PARAM = "name";
const LASTS_REQUEST_PARAM = "lasts";
const START_DATE_REQUEST_PARAM = "s_date";
const END_DATE_REQUEST_PARAM = "e_date";
export const MeasurementsService = {
  retrieveKPIS(kpiNames, lasts, s_date, e_date) {
    // ApiService.setHeader();
    let promise = {};
    if (lasts) {
      promise = ApiService.query(evaluatorExpressionsResource + "?" + LASTS_REQUEST_PARAM + "=true");
    } else if (s_date && e_date) {
      promise = ApiService.query(evaluatorExpressionsResource + "?" + START_DATE_REQUEST_PARAM + "=" + s_date.toLocaleDateString(), e_date.toLocaleDateString());
    } else {
      promise = ApiService.query(evaluatorMeasurementsResource + this.toListRequestParam(NAME_REQUEST_PARAM, kpiNames));
    }

    return promise;
  },

  toListRequestParam(name, values) {
    return name + "=" + values.join(",");
  }

}