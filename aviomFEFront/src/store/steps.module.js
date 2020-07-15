import { StepServices } from "@/common/api.service";
import {
    SET_STEPS
} from "./mutations.type";
import {
    FETCH_STEPS,
    SAVE_STEP,
    DESTROY_STEP
} from "./actions.type";

const state = {
    steps: []
};

const getters = {
    steps(state){
        return state.steps;
    }
};

const actions = {
    [FETCH_STEPS](context, current){
        StepServices.retrieveAll(current).then(
            ({ data }) => {
                if(current){
                    //context.commit(SET_ONLINE_OPERATORS, data);
                }else{
                    context.commit(SET_STEPS, data);
                }
            }
        ).catch((error) => {
            console.log(error);
        });
    },
    [SAVE_STEP](context, step){
        StepServices.create(step).then(
            ({ data }) =>{
                console.log(data)
            }
        )
    },
    [DESTROY_STEP](context, stepCode){
        StepServices.destroy(stepCode).then(
            ({data}) =>{
                console.log(data)
            }
        )
    }
};

const mutations = {
    [SET_STEPS](state, steps){
        state.steps = steps;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};