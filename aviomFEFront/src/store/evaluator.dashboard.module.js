import { MeasurementsService } from "@/common/api.service";
import {
    SET_KPIS,
    ADD_LASTS_KPIS,
    UPDATE_DASHBOARD_REQUEST_STATE,
    MANAGE_DASHBOARD_REQUEST_ERROR
} from "./mutations.type";
import {
    FETCH_KPIS,
    SET_DASHBOARD_REQUEST_STATE
} from "./actions.type";
import {
    ERROR, INFO, SUCCESS
} from "@/common/evaluator.request.states";

const colors = {
    blue: "#1070CA",
    red: "#EC4C47",
    yellow: "#FDD835",
    green: "green"
};
const lineChartConfiguration = {
    wq: {
        backgroundColor: colors.blue,
        borderColor: colors.blue,
        lineTension: 0,
        pointBackgroundColor: colors.blue,
        fill: false
    },
    ws: {
        backgroundColor: colors.red,
        borderColor: colors.red,
        lineTension: 0,
        pointBackgroundColor: colors.red,
        fill: false
    },
    w: {
        backgroundColor: colors.yellow,
        borderColor: colors.yellow,
        lineTension: 0,
        pointBackgroundColor: colors.yellow,
        fill: false
    }
};

const getDefaultState = () => {
    return {
        KPI: {
            serviceTime: {
                title: "Tiempo de estancia de eventos",
                labels: [],
                xLabel: "Hora del día (24hrs)",
                yLabel: "Tiempo de estancia (min)",
                datasets: [
                    {
                        kpiName: "wq",
                        label: "Wq",
                        data: [],
                        backgroundColor: lineChartConfiguration["wq"].backgroundColor,
                        borderColor: lineChartConfiguration["wq"].borderColor,
                        lineTension: lineChartConfiguration["wq"].lineTension,
                        pointBackgroundColor:
                            lineChartConfiguration["wq"].pointBackgroundColor,
                        fill: lineChartConfiguration["wq"].fill
                    },
                    {
                        kpiName: "ws",
                        label: "Ws",
                        data: [],
                        backgroundColor: lineChartConfiguration["ws"].backgroundColor,
                        borderColor: lineChartConfiguration["ws"].borderColor,
                        lineTension: lineChartConfiguration["ws"].lineTension,
                        pointBackgroundColor:
                            lineChartConfiguration["ws"].pointBackgroundColor,
                        fill: lineChartConfiguration["ws"].fill
                    },
                    {
                        kpiName: "w",
                        label: "W",
                        data: [],
                        backgroundColor: lineChartConfiguration["w"].backgroundColor,
                        borderColor: lineChartConfiguration["w"].borderColor,
                        lineTension: lineChartConfiguration["w"].lineTension,
                        pointBackgroundColor:
                            lineChartConfiguration["w"].pointBackgroundColor,
                        fill: lineChartConfiguration["w"].fill
                    }
                ],
                hasDetails: true,
                showDetails: false,
                loading: true
            },
            maxWaitTime: {
                kpiName: "wqMax",
                title: "Tiempo de espera máximo",
                hasNotes: true,
                notes: {
                    label: "último observado"
                },
                valueSuffix: "",
                icon: "mdi-timelapse",
                iconColor: colors.red,
                value: 0,
                lastValue: 0,
                loading: true
            },
            queueMaxSize: {
                kpiName: "lqMax",
                title: "Longitud máxima de la cola",
                hasNotes: true,
                notes: {
                    label: "último observado"
                },
                valueSuffix: "",
                icon: "mdi-tray-full",
                iconColor: colors.blue,
                value: 0,
                lastValue: 0,
                loading: true
            },
            rateCareRequests: {
                kpiName: "u",
                title: "Tasa de atención a solicitudes",
                hasNotes: true,
                notes: {
                    label: "último observado"
                },
                valueSuffix: "%",
                icon: "mdi-alert-circle-check-outline",
                iconColor: colors.green,
                hasDetails: true,
                showDetails: false,
                value: 0,
                lastValue: 0,
                loading: true,
                details: {
                    kpiName: "uc",
                    title: "Tasa de atención a solicitudes por controlador",
                    xLabel: "Controladores",
                    yLabel: "Tasa de atención (%)",
                    labels: [],
                    datasets: [
                        {
                            label: "Atendido",
                            backgroundColor: colors.blue,
                            data: []
                        }
                    ],
                    loading: true
                }
            }
        },
        dashboard_info: {
            active: false,
            state: "",
            text: "",
        }
    }
}

const state = getDefaultState();

const getters = {
    KPI(state) {
        return state.KPI;
    },
    dashboard_info(state) {
        return state.dashboard_info;
    }
};

const actions = {
    [SET_DASHBOARD_REQUEST_STATE](context, info) {
        context.commit(UPDATE_DASHBOARD_REQUEST_STATE, info);
    },
    [FETCH_KPIS](context) {
        MeasurementsService.retrieveKPIS().then(
            ({ data }) => {
                context.commit(SET_KPIS, data);
            }
        ).catch((error) => {
            context.commit(MANAGE_DASHBOARD_REQUEST_ERROR, error)
        });
    },
};

const mutations = {
    [UPDATE_DASHBOARD_REQUEST_STATE](state, info) {
        state.info = info;
    },
    [MANAGE_DASHBOARD_REQUEST_ERROR](state, error) {
        state.info.active = true;
        state.info.state = ERROR;
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
    [SET_KPIS](state, kpis) {
        if (kpis != null) {
            state.KPI = kpis;
            state.info.active = true;
            state.info.state = INFO;
            state.info.text = "KPIS obtenidos";
        }
    },
    [ADD_LASTS_KPIS](state, kpis) {
        //TODO:

    }
};

export default {
    state,
    getters,
    actions,
    mutations
};