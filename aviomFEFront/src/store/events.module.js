import { EventsService } from "@/common/api.service";
import {
    SET_EVENT_HISTORY,
    ADD_EVENT
} from "./mutations.type";
import {
    FETCH_EVENT_HISTORY
} from "./actions.type";

const state = {
    events: [],
    track: {"activeEvents":[],"assignedEvents":[],"solvedEvents":[]}
};

const getters = {
    events(state){
        return state.events;
    },
    activeEvents(state){
        return state.track.activeEvents;
    },
    assignedEvents(state){
        return state.track.assignedEvents;
    },
    solvedEvents(state){
        return state.track.solvedEvents;
    }
};

const actions = {
    [FETCH_EVENT_HISTORY](context, accountName){
        EventsService.retrieveHistory(accountName).then(
            ({ data }) => {
                context.commit(SET_EVENT_HISTORY, data);
            }
        ).catch((error) => {
            console.log(error);
        });
    }
};

const mutations = {
    [SET_EVENT_HISTORY](state, history){
        if(history.activeEvents != null){
            state.track.activeEvents = history.activeEvents;
        }
        if(history.assignedEvents != null){
            state.track.assignedEvents = history.assignedEvents;
        }
        if(history.solvedEvents != null){
            state.track.solvedEvents = history.solvedEvents;
        }
    },
    [ADD_EVENT](state, event){
        state.events.push(event);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};