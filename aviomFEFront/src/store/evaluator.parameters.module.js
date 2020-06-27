import { ParametersService } from "@/common/api.service";
import {
    SET_PARAMETERS,
    SET_UPDATED_PARAMETER,
    UPDATE_PARAMETERS_REQUEST_STATE,
    MANAGE_PARAMETERS_REQUEST_ERROR
} from "./mutations.type";
import {
    FECTH_PARAMETERS,
    UPDATE_PARAMETER,
    SET_PARAMETERS_REQUEST_STATE
} from "./actions.type";
import {
    ERROR, INFO, SUCCESS
} from "@/common/evaluator.request.states";


const state = {
    parameters: [],
    info: {
        active: false,
        infoType: "",
        text: "",
    }
};

const getters = {
    parameters(state) {
        return state.parameters;
    },
    info(state) {
        return state.info;
    }
};

const actions = {
    [SET_PARAMETERS_REQUEST_STATE](context, info) {
        context.commit(UPDATE_PARAMETERS_REQUEST_STATE, info);
    },
    [FECTH_PARAMETERS](context, active) {
        ParametersService.retrieveParameters(active).then(
            ({ data }) => {
                context.commit(SET_PARAMETERS, data);
            }
        ).catch((error) => {
            context.commit(MANAGE_EVALUATOR_REQUEST_ERROR, error)
        });
    },
    [UPDATE_PARAMETER](context, parameter) {
        ParametersService.updateParameter(parameter).then(
            ({ data }) => {
                context.commit(SET_UPDATED_PARAMETER, data);
            }
        ).catch((error) => {
            context.commit(MANAGE_EVALUATOR_REQUEST_ERROR, error)
        })
    }
};

const mutations = {
    [UPDATE_PARAMETERS_REQUEST_STATE](state, info) {
        state.info = info;
    },
    [MANAGE_PARAMETERS_REQUEST_ERROR](state, error) {
        state.info.active = true;
        state.info.infoType = ERROR;
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
    [SET_PARAMETERS](state, parameters) {
        if (parameters != null) {
            state.parameters = parameters;
            state.info.active = true;
            state.info.infoType = INFO;
            state.info.text = "parámetros obtenidos";
        }
    },
    [SET_UPDATED_PARAMETER](state, parameter) {
        const index = state.parameters.findIndex(item => item.name === parameter.name);
        if (index !== -1) {

            state.parameters.splice(index, 1, parameter);
            state.info.active = true;
            state.info.infoType = SUCCESS;
            state.info.text = "parámetro actualizado";
        }

    }
};

export default {
    state,
    getters,
    actions,
    mutations
};