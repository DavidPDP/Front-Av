import { MeasurementsService } from "@/common/api.service";
import {
    SET_KPIS,
    ADD_LASTS_KPIS,
    UPDATE_DASHBOARD_REQUEST_STATE,
    MANAGE_DASHBOARD_REQUEST_ERROR
} from "./mutations.type";
import {
    FETCH_KPIS,
    SET_DASHBOARD_REQUEST_STATE
} from "./actions.type";
import {
    ERROR, INFO, SUCCESS
} from "@/common/evaluator.request.states";

const historical_kpi_names = ["wq", "ws", "w", "lq"];
const simple_kpi_names = ["wqMax", "lqMax", "u", "p", "stdUc", "stdCR", "pat"];

const getDefaultState = () => {
    return {
        kpi_measurements: {},
        dashboard_info: {
            active: false,
            state: "",
            text: "",
        }
    }
}

const state = getDefaultState();

const getters = {
    kpis(state) {
        return state.kpi_measurements;
    },
    dashboard_info(state) {
        return state.dashboard_info;
    },
    measurements(state){
        return state.kpi_measurements;
    }
};

const actions = {
    [SET_DASHBOARD_REQUEST_STATE](context, info) {
        context.commit(UPDATE_DASHBOARD_REQUEST_STATE, info);
    },
    [FETCH_KPIS](context) {

        MeasurementsService.retrieveKPIS(simple_kpi_names).then(
            ({ data }) => {

                context.commit(SET_KPIS, data);
            }
        ).catch((error) => {
            context.commit(MANAGE_DASHBOARD_REQUEST_ERROR, error)
        });

        MeasurementsService.retrieveKPIS(historical_kpi_names).then(
            ({ data }) => {

                context.commit(SET_KPIS, data);
            }
        ).catch((error) => {
            context.commit(MANAGE_DASHBOARD_REQUEST_ERROR, error)
        });
    },
};

const mutations = {
    [UPDATE_DASHBOARD_REQUEST_STATE](state, info) {
        state.dashboard_info = info;
    },
    [MANAGE_DASHBOARD_REQUEST_ERROR](state, error) {
        state.dashboard_info.active = true;
        state.dashboard_info.state = ERROR;
        let text = "";
        if (!error.response) {
            text = "Error: " + error;
        } else if (!error.response.message) {
            text = "Error: " + error.response;
        } else {
            text = error.response.message;
        }
        state.dashboard_info.text = text;
    },
    [SET_KPIS](state, kpis) {
        if (kpis) {
            let kpisCopy = state.kpi_measurements;
            
            for(let kpi in kpis){
                let measurements = kpis[kpi];
                kpisCopy[kpi] = measurements;
            }
            state.kpi_measurements = kpisCopy;
        }
    },
    [ADD_LASTS_KPIS](state, kpis) {
        //TODO:

    }
};

export default {
    state,
    getters,
    actions,
    mutations
};