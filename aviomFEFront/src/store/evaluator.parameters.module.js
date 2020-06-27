import { ParametersService } from "@/common/api.service";
import {
    SET_PARAMETERS,
    SET_UPDATED_PARAMETER,
    MANAGE_EVALUATOR_REQUEST_ERROR
} from "./mutations.type";
import {
    FECTH_PARAMETERS,
    UPDATE_PARAMETER
} from "./actions.type";
import {
    ERROR, INFO, SUCCESS
} from "@/common/evaluator.transtaction.states";


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
    [MANAGE_EVALUATOR_REQUEST_ERROR](state, error) {
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
            state.info.infoType = SUCCESS;
            state.info.text = "parámetros obtenidos";
        }
    },
    [SET_UPDATED_PARAMETER](state, parameter) {
        let found = false;
        let index = -1;
        for (let i = 0; i < this.parameters.length && !found; i++) {
            if (state.parameters[i].name === parameter.name) {
                index = i;
                found = true;
                state.parameters[i] = parameter;
            }
        }
        if (found) {
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