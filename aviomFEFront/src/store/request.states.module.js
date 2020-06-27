import {
    UPDATE_EVALUATOR_REQUEST_STATE
} from "./mutations.type";
import {
    SET_EVALUATOR_REQUEST_STATE
} from "./actions.type";


const state = {
    info: {
        active: false,
        infoType: "",
        text: "",
    }
};

const getters = {
    info(state) {
        return state.info;
    }
};

const actions = {
    [SET_EVALUATOR_REQUEST_STATE](context, info) {
        context.commit(UPDATE_EVALUATOR_REQUEST_STATE, info);
    },
};

const mutations = {
    [UPDATE_EVALUATOR_REQUEST_STATE](state, info) {
        state.info = info;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};