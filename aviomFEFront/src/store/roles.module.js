import { RolesServices } from "@/common/api.service";
import {
    SET_ROLES
} from "./mutations.type";
import {
    FETCH_ROLES,
    SAVE_ROLE,
    UPDATE_ROLE,
    DESTROY_ROLE
} from "./actions.type";

const state = {
    roles: [],
    currentRole:{},
};

const getters = {
    roles(state){
        return state.roles;
    },
    currentRole(state){
        return state.currentRole;
    }
};

const actions = {
    [FETCH_ROLES](context, current){
        RolesServices.retrieveAll(current).then(
            ({ data }) => {
                if(current){
                    //context.commit(SET_ONLINE_OPERATORS, data);
                }else{
                    context.commit(SET_ROLES, data);
                }
            }
        ).catch((error) => {
            console.log(error);
        });
    },
    [SAVE_ROLE](context, role){
        RolesServices.create(role).then(
            ({ data }) =>{
                console.log(data)
            }
        )
    },
    [UPDATE_ROLE](context, roleName){
        RolesServices.update(roleName).then(
            ({ data }) =>{
                console.log(data)
            }
        )
    },
    [DESTROY_ROLE](context, roleName){
        RolesServices.destroy(roleName).then(
            ({ data }) =>{
                console.log(data)
            }
        )
    },
};

const mutations = {
    [SET_ROLES](state, roles){
        state.roles = roles;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};