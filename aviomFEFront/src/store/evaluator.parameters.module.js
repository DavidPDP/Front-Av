import { ParametersService } from "@/common/api.service";
import {
    SET_PARAMETERS,
    UPDATE_PARAMETER
} from "./mutations.type";
import {
    FECTH_PARAMETERS,
    UPDATE_PARAMETER
} from "./actions.type";

const state = {
    parameters: [],
};

const getters = {
    parameters(state) {
        return state.parameters;
    },
};

const actions = {
    [FECTH_PARAMETERS](context) {
        ParametersService.retrieveParameters().then(
            ({ data }) => {
                context.commit(SET_PARAMETERS, data);
            }
        ).catch((error) => {
            console.log(error);
        });
    },
    [UPDATE_PARAMETER](context, parameterName, parameter) {
        ParametersService.updateParameter(parameterName, parameter).then(
            ({ data }) => {
                context.commit(UPDATE_PARAMETER, data);
            }
        ).catch((error)=>{
            console.log(error);
        })
    }
};

const mutations = {
    [SET_PARAMETERS](state, parameters) {
        if (parameters != null) {
            state.parameters = parameters;
        }
    },
    [UPDATE_PARAMETER](state, parameter) {
        let found = false;
        let index = -1;
        for (let i = 0; i < this.parameters.length && !found; i++) {
            if (state.parameters[i].name === parameter.name) {
                index = i;
                found = true;
                state.parameters[i] = parameter;
            }
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};