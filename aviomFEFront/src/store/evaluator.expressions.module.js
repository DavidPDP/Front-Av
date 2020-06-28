import { VariablesService, ExpressionsService } from "@/common/api.service";
import {
    SET_VARIABLES,
    SET_UPDATED_VARIABLE,
    SET_FUNCTIONS,
    MANAGE_EXPRESSIONS_REQUEST_ERROR,
    UPDATE_EXPRESSIONS_REQUEST_STATE
} from "./mutations.type";
import {
    FETCH_VARIABLES,
    UPDATE_VARIABLE,
    FETCH_FUNCTIONS,
    SET_EXPRESSIONS_REQUEST_STATE
} from "./actions.type";
import {
    ERROR, INFO, SUCCESS
} from "@/common/evaluator.request.states";

const getDefaultState = () => {
    return {
        variablesInfo: [],
        functionsInfo: [],
        expressions_info: {
            active: false,
            state: "",
            text: "",
        }
    }
}

const state = getDefaultState();

const getters = {
    variablesInfo(state) {
        return state.variablesInfo;
    },
    functionsInfo(state) {
        return state.functionsInfo;
    },
    expressions_info(state) {
        return state.expressions_info;
    }
};

const actions = {
    [SET_EXPRESSIONS_REQUEST_STATE](context, info) {
        context.commit(UPDATE_EXPRESSIONS_REQUEST_STATE, info);
    },
    [FETCH_VARIABLES](context) {
        VariablesService.retrieveVariables().then(
            ({ data }) => {
                context.commit(SET_VARIABLES, data);
            }
        ).catch((error) => {
            context.commit(MANAGE_EXPRESSIONS_REQUEST_ERROR, error)
        });
    },
    [UPDATE_VARIABLE](context, variable) {
        VariablesService.updateVariable(variable).then(
            ({ data }) => {
                context.commit(SET_UPDATED_VARIABLE, data);
            }
        ).catch((error) => {
            context.commit(MANAGE_EXPRESSIONS_REQUEST_ERROR, error)
        });
    },
    [FETCH_FUNCTIONS](context) {
        ExpressionsService.retrieveFunctions().then(({ data }) => {
            context.commit(SET_FUNCTIONS, data);
        }).catch((error) => {
            context.commit(MANAGE_EXPRESSIONS_REQUEST_ERROR, error)
        });

    },
};

const mutations = {
    [UPDATE_EXPRESSIONS_REQUEST_STATE](state, info) {
        state.expressions_info = info;
    },
    [MANAGE_EXPRESSIONS_REQUEST_ERROR](state, error) {
        state.expressions_info.active = true;
        state.expressions_info.state = ERROR;
        let text = "";
        if (!error.response) {
            text = "Error: " + error;
        } else if (!error.response.message) {
            text = "Error: " + error.response;
        } else {
            text = error.response.message;
        }
        state.expressions_info.text = text;
    },
    [SET_VARIABLES](state, variablesInfo) {
        if (variablesInfo != null) {
            state.variablesInfo = variablesInfo;
            state.expressions_info.active = true;
            state.expressions_info.state = INFO;
            state.expressions_info.text = "variables obtenidos";
        }
    },
    [SET_UPDATED_VARIABLE](state, variableInfo) {
        const index = state.variablesInfo.findIndex(item => item.name === variableInfo.name);
        if (index !== -1) {
            state.variablesInfo.splice(index, 1, variableInfo);
            state.expressions_info.active = true;
            state.expressions_info.state = SUCCESS;
            state.expressions_info.text = "variable actualizada";
        }
    },
    [SET_FUNCTIONS](state, functions) {
        if (functions != null) {
            state.functionsInfo = functions;
            state.expressions_info.active = true;
            state.expressions_info.state = INFO;
            state.expressions_info.text = "funciones obtenidas";
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};