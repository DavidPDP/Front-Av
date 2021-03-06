import { OperatorsService } from "@/common/api.service";
import {
    SET_ONLINE_OPERATORS,
    SET_OPERATORS,
    ADD_CONTROLLER,
    SET_OPERATOR_HISTORY,
    ADD_OPERATOR
} from "./mutations.type";
import {
    FETCH_OPERATORS,
    FETCH_OPERATOR_HISTORY,
    SAVE_OPERATOR,
    UPDATE_OPERATOR,
    DESTROY_OPERATOR
} from "./actions.type";

const state = {
    operators: [],
    onlineOperators: {"controllers":[],"omegas":[]},
    history: {}
};

const getters = {
    controllers(state){
        return state.onlineOperators.controllers;
    },
    omegas(state){
        return state.onlineOperators.omegas;
    },
    operatorTracks(state){
        return state.history;
    },
    operators(state){
        return state.operators;
    }
};

const actions = {
    [FETCH_OPERATORS](context, online){
        OperatorsService.retrieveAll(online).then(
            ({ data }) => {
                if(online){
                    context.commit(SET_ONLINE_OPERATORS, data);
                }else{
                    context.commit(SET_OPERATORS, data);
                }
            }
        ).catch((error) => {
            console.log(error);
        });
    },
    [FETCH_OPERATOR_HISTORY](context, accountName){
        OperatorsService.retrieveHistory(accountName).then(
            ({ data }) => {
                context.commit(SET_OPERATOR_HISTORY, data);
            }
        ).catch((error) => {
            console.log(error);
        });
    },
    [SAVE_OPERATOR](context, operator){
        OperatorsService.create(operator).then(
            ({ data }) => {
                //context.commit(ADD_OPERATOR, data);
                console.log(data);
            }
        ).catch((error) => {
            console.log(error);
        });
    },
    [UPDATE_OPERATOR](context, operator){
        console.log("AQUI")
        OperatorsService.update(operator).then(
            ({ data }) => {
                console.log(data);
            }
        ).catch((error) => {
            console.log(error);
        });
    },
    [DESTROY_OPERATOR](context, accountName){
        console.log("AQUI")
        OperatorsService.destroy(accountName).then(
            ({ data }) => {
                console.log(data);
            }
        ).catch((error) => {
            console.log(error);
        });
    }
};

const mutations = {
    [SET_ONLINE_OPERATORS](state, operators){
        state.onlineOperators = operators;
    },
    [SET_OPERATORS](state, operators){
        state.operators = operators;
    },
    [ADD_CONTROLLER](state, controller){
        state.onlineOperators.controllers.push(controller);
    },
    [SET_OPERATOR_HISTORY](state, history){
        state.history = history;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};