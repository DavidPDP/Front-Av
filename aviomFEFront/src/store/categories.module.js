import { categoriesServices } from "@/common/api.service";
import {
    SET_CATEGORIES
} from "./mutations.type";
import {
    FETCH_CATEGORIES,
    SAVE_CATEGORY,
    DESTROY_CATEGORY,
    UPDATE_CATEGORY
} from "./actions.type";

const state = {
    categories: [],
};

const getters = {
    categories(state){
        return state.categories;
    },

};

const actions = {
    [FETCH_CATEGORIES](context, current){
        categoriesServices.retrieveAll(current).then(
            ({ data }) => {
                if(current){
                    context.commit(SET_CATEGORIES, data);
                }else{
                    context.commit(SET_CATEGORIES, data);
                }
            }
        ).catch((error) => {
            console.log(error);
        });
    },
    [SAVE_CATEGORY](context, category){
        categoriesServices.create(category).then(
            ({ data }) => {
                console.log(data)
            }
        ).catch((error) => {
            console.log(error);
        });
    },
    [UPDATE_CATEGORY](context, category){
        categoriesServices.update(category).then(
            ({ data }) => {
                console.log(data)
            }
        ).catch((error) => {
            console.log(error);
        });
    },
    [DESTROY_CATEGORY](context, categoryName){
        categoriesServices.destroy(categoryName).then(
            ({ data }) => {
                console.log(data)
            }
        ).catch((error) => {
            console.log(error);
        });
    }
};

const mutations = {
    [SET_CATEGORIES](state, categories){
        state.categories = categories;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};