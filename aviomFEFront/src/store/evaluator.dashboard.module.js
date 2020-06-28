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

const getDefaultState = () => {
    return {
        KPI: {

        },
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
        return state.KPI;
    },
    dashboard_info(state) {
        return state.dashboard_info;
    }
};

const actions = {
    [SET_DASHBOARD_REQUEST_STATE](context, info) {
        context.commit(UPDATE_DASHBOARD_REQUEST_STATE, info);
    },
    [FETCH_KPIS](context) {
        MeasurementsService.retrieveKPIS().then(
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
        state.info = info;
    },
    [MANAGE_DASHBOARD_REQUEST_ERROR](state, error) {
        state.info.active = true;
        state.info.state = ERROR;
        let text = "";
        if (!error.response) {
            text = "Error: " + error;
        } else if (!error.response.message) {
            text = "Error: " + error.response;
        } else {
            text = error.response.message;
        }
        state.info.text = text;
    },
    [SET_KPIS](state, kpis) {
        if (kpis != null) {
            state.KPI = kpis;
            state.info.active = true;
            state.info.state = INFO;
            state.info.text = "KPIS obtenidos";
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