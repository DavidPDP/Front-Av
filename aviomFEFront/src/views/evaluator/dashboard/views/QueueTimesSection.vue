<template>
  <v-flex d-flex xs9 sm9 md9 wrap>
    <v-layout row wrap>
      <v-flex column xs12 sm12 md12 wrap>
        <v-layout column wrap>
          <v-flex xs12 sm12 md12 wrap class="d-flex">
            <v-layout row wrap>
              <v-flex xs4 sm4 md4>
                <KPICard :loading="KPI.maxWaitTime.loading" :data="KPI.maxWaitTime"></KPICard>
              </v-flex>
              <v-flex xs4 sm4 md4>
                <KPICard :loading="KPI.queueMaxSize.loading" :data="KPI.queueMaxSize"></KPICard>
              </v-flex>
              <v-flex xs4 sm4 md4>
                <KPICard
                  :loading="KPI.rateCareRequests.loading"
                  @showDetailsEvent="showRateCareDetails"
                  :data="KPI.rateCareRequests"
                ></KPICard>
                <v-dialog v-model="KPI.rateCareRequests.showDetails" max-width="1270px">
                  <v-card color="white" height="100%">
                    <v-card-title class="headline">{{KPI.rateCareRequests.details.title}}</v-card-title>
                    <div>
                      <BarChart
                        ref="rateDetails"
                        :stacked="false"
                        :legend="true"
                        :xLabel="KPI.rateCareRequests.details.xLabel"
                        :yLabel="KPI.rateCareRequests.details.yLabel"
                        :chart-data="KPI.rateCareRequests.details"
                        :height="400"
                      />
                    </div>
                    <v-overlay :absolute="true" :value="KPI.rateCareRequests.details.loading">
                      <v-progress-circular indeterminate size="64"></v-progress-circular>
                    </v-overlay>
                  </v-card>
                </v-dialog>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout column wrap>
          <v-flex xs12 sm12 md12 wrap>
            <v-card color="white">
              <v-card-title class="headline">{{KPI.serviceTime.title}}</v-card-title>
              <div style="overflow-x:scroll;width:100%;">
                <!-- TODO: Width has to change (it must increase) before some call some update method of some chart. The increase could be here or in the Chart file (LineChart.js, BarChart.js ...)-->
                <LineChart
                  :xLabel="KPI.serviceTime.xLabel"
                  :yLabel="KPI.serviceTime.yLabel"
                  ref="times"
                  :chart-data="KPI.serviceTime"
                  :width="1200"
                  :height="450"
                />
              </div>

              <v-card-actions v-if="KPI.serviceTime.hasDetails">
                <v-spacer></v-spacer>
                <v-btn
                  text
                  small
                  color="primary text-overline"
                  @click="showServiceTimeDetails"
                >Ver detalles ></v-btn>
              </v-card-actions>
              <v-overlay :absolute="true" :value="KPI.serviceTime.loading">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
              </v-overlay>
            </v-card>
            <v-dialog v-model="KPI.serviceTime.showDetails" max-width="1270px">
              <v-card color="white" height="100%" width="100%">
                <v-card-title class="headline">{{KPI.filteredServiceTime.title}}</v-card-title>
                <v-container fluid>
                  <v-row alogn="center">
                    <v-list-item>
                      <v-col class="d-flex" cols="12" sm="3">
                        <v-list-item-title class="pb-5">Filtrar por prioridad</v-list-item-title>
                      </v-col>
                      <v-col class="d-flex" cols="12" sm="2">
                        <v-select
                          @change="onSelectedPriority"
                          v-model="selectedPriority"
                          :loading="priorities.length==0"
                          :items="priorities"
                          label="Prioridad"
                          solo
                        ></v-select>
                      </v-col>
                    </v-list-item>
                  </v-row>
                </v-container>
                <!-- TODO: Set the same width of the original Linea chart -->
                <div style="overflow-x:scroll;width:100%;">
                  <LineChart
                    ref="filteredTimes"
                    :chart-data="KPI.filteredServiceTime"
                    :width="2000"
                    :height="500"
                    :xLabel="KPI.filteredServiceTime.xLabel"
                    :yLabel="KPI.filteredServiceTime.yLabel"
                  />
                </div>
                <v-overlay :absolute="true" :value="KPI.filteredServiceTime.loading">
                  <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay>
              </v-card>
            </v-dialog>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import { mapGetters } from "vuex";
import { MeasurementsService, EvalUtilsService } from "@/common/api.service";
import { SET_DASHBOARD_REQUEST_STATE } from "@/store/actions.type";
import { MANAGE_DASHBOARD_REQUEST_ERROR } from "@/store/mutations.type";
import { ERROR } from "@/common/evaluator.request.states.js";

import LineChart from "./components/LineChart.js";
import KPICard from "./components/KPICard";
import BarChart from "./components/BarChart.js";

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

export default {
  components: {
    KPICard,
    LineChart,
    BarChart
  },
  data: () => ({
    selectedPriority: "",
    priorities: [],
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
      filteredServiceTime: {
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
        loading: false
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
    }
  }),
  mounted(){
    this.setKPIMeasurements(this.measurements);
  },
  computed: {
    ...mapGetters({
      onlineControllers: "controllers",
      measurements: "measurements"
    })
  },
  methods: {
    fetchPriorities() {
      return EvalUtilsService.retrievePriorities();
    },
    setPrioritiesFromResponse(axiosResponse) {
      this.priorities = [];
      let data = axiosResponse.data;
      let repeatedFlags = {};
      data.forEach(subcategory => {
        let priority = subcategory.basePriority;
        if (priority && priority != null && !repeatedFlags[priority]) {
          repeatedFlags[priority] = true;
          this.priorities.push(priority + "");
        }
      });
    },
    showServiceTimeDetails() {
      this.KPI.serviceTime.showDetails = true;
      this.KPI.filteredServiceTime.loading = true;
      this.fetchPriorities()
        .then(response => {
          this.setPrioritiesFromResponse(response);
          this.KPI.filteredServiceTime.loading = false;
        })
        .catch(err => {
          this.KPI.filteredServiceTime.loading = false;
          this.$store.commit(MANAGE_DASHBOARD_REQUEST_ERROR, err);
        });
    },
    showRateCareDetails() {
      this.KPI.rateCareRequests.details.loading = true;
      let names = this.getKPINamesOfRateByControllers();

      if (names.length > 0) {
        MeasurementsService.retrieveKPIS(names, true)
          .then(response => {
            this.onGetRateByControllersMeasurements(response);
          })
          .catch(err => {
            this.KPI.rateCareRequests.details.loading = false;
            this.$store.commit(MANAGE_DASHBOARD_REQUEST_ERROR, err);
          });
      } else {
        let info = {
          active: true,
          state: ERROR,
          text: "No hay controladores en linea"
        };
        this.KPI.rateCareRequests.details.loading = false;
        this.$store.dispatch(SET_DASHBOARD_REQUEST_STATE, info);
      }
    },
    getKPINamesOfRateByControllers() {
      let names = [];
      for (let index = 0; index < this.onlineControllers.length; index++) {
        let controller = this.onlineControllers[index];
        let id = controller.id;
        names.push(this.KPI.rateCareRequests.details.kpiName + id);
      }
      return names;
    },
    onGetRateByControllersMeasurements(axiosResponse) {
      let data = axiosResponse.data;
      let labels = [];
      let dataset = [];
      this.onlineControllers.forEach(controller => {
        let controllerId = controller.id;
        let controllerName = controller.name;
        labels.push(controllerName);
        let measurements =
          data[this.KPI.rateCareRequests.details.kpiName + controllerId];
        if (measurements.length > 0) {
          dataset.push(measurements[0].value.toFixed(2));
        }
      });

      this.$set(this.KPI.rateCareRequests.details, "labels", labels);
      this.$set(this.KPI.rateCareRequests.details.datasets[0], "data", dataset);
      this.KPI.rateCareRequests.details.loading = false;
      this.$refs.rateDetails.update();
    },
    onSelectedPriority() {
      let names = [
        this.formatKPIByPriority(
          this.KPI.filteredServiceTime.datasets[0].kpiName,
          this.selectedPriority
        ),
        this.formatKPIByPriority(
          this.KPI.filteredServiceTime.datasets[1].kpiName,
          this.selectedPriority
        ),
        this.formatKPIByPriority(
          this.KPI.filteredServiceTime.datasets[2].kpiName,
          this.selectedPriority
        )
      ];
      this.KPI.filteredServiceTime.loading = true;

      MeasurementsService.retrieveKPIS(names)
        .then(response => {
          this.onGetFilteredServiceTime(response);
        })
        .catch(error => {
          this.KPI.filteredServiceTime.loading = false;
          this.$store.commit(MANAGE_DASHBOARD_REQUEST_ERROR, error);
        });
    },
    //kpiName is, for example: ws? and priority is a number.
    formatKPIByPriority(kpiName, priority) {
      return kpiName + priority;
    },
    onGetFilteredServiceTime(axiosResponse) {
      let data = axiosResponse.data;

      let labelWq = this.formatKPIByPriority(
        this.KPI.filteredServiceTime.datasets[0].kpiName,
        this.selectedPriority
      );
      let labelWs = this.formatKPIByPriority(
        this.KPI.filteredServiceTime.datasets[1].kpiName,
        this.selectedPriority
      );
      let labelW = this.formatKPIByPriority(
        this.KPI.filteredServiceTime.datasets[2].kpiName,
        this.selectedPriority
      );

      this.$set(this.KPI.filteredServiceTime.datasets[0], "label", labelWq);
      this.$set(this.KPI.filteredServiceTime.datasets[1], "label", labelWs);
      this.$set(this.KPI.filteredServiceTime.datasets[2], "label", labelW);

      let keyWq = labelWq;
      let keyWs = labelWs;
      let keyW = labelW;

      this.setValuesAtServiceTimes(
        this.KPI.filteredServiceTime,
        0,
        data[keyWq]
      );
      this.setValuesAtServiceTimes(
        this.KPI.filteredServiceTime,
        1,
        data[keyWs]
      );
      this.setValuesAtServiceTimes(this.KPI.filteredServiceTime, 2, data[keyW]);

      this.setLabelsToServiceTimes(this.KPI.filteredServiceTime, data[labelWq]);

      this.$refs.filteredTimes.update();
      this.KPI.filteredServiceTime.loading = false;
    },
    setKPIMeasurements(measurementsGroupByKPIName) {
      this.KPI.serviceTime.loading = true;
      this.KPI.maxWaitTime.loading = true;
      this.KPI.queueMaxSize.loading = true;
      this.KPI.rateCareRequests.loading = true;

      this.onGetServiceTimesMeasurements(measurementsGroupByKPIName);
      this.onGetKPICardMeasurements(measurementsGroupByKPIName);
    },
    onGetServiceTimesMeasurements(measurementsGroupByKPIName) {
      this.setValuesAtServiceTimes(
        this.KPI.serviceTime,
        0,
        measurementsGroupByKPIName[this.KPI.serviceTime.datasets[0].kpiName]
      );
      this.setValuesAtServiceTimes(
        this.KPI.serviceTime,
        1,
        measurementsGroupByKPIName[this.KPI.serviceTime.datasets[1].kpiName]
      );
      this.setValuesAtServiceTimes(
        this.KPI.serviceTime,
        2,
        measurementsGroupByKPIName[this.KPI.serviceTime.datasets[2].kpiName]
      );
      this.setLabelsToServiceTimes(
        this.KPI.serviceTime,
        measurementsGroupByKPIName[this.KPI.serviceTime.datasets[0].kpiName]
      );

      this.KPI.serviceTime.loading = false;

      this.$refs.times.update();
    },
    onGetKPICardMeasurements(measurementsGroupByKPIName) {
      this.setKPICardValues(this.KPI.maxWaitTime, measurementsGroupByKPIName);
      this.setKPICardValues(this.KPI.queueMaxSize, measurementsGroupByKPIName);
      this.setKPICardValues(this.KPI.rateCareRequests, measurementsGroupByKPIName);
    },
    setKPICardValues(kpiCard, data) {
      let value = 0;
      let lastValue = 0;
      let fixedValue = 0;
      let fixedLastValue = 0;
      let measurements = data[kpiCard.kpiName];
      if (measurements.length > 0) {
        value = measurements[0].value;
        fixedValue = parseInt(value.toFixed(0));
        if (measurements.length > 1) {
          lastValue = measurements[1].value;
          fixedLastValue = parseInt(lastValue.toFixed(0));
        }
      }
      this.$set(kpiCard, "value", fixedValue);
      this.$set(kpiCard, "lastValue", fixedLastValue);
      this.$set(kpiCard, "loading", false);
    },
    setValuesAtServiceTimes(serviceTimes, index, measurements) {
      let measurementsValues = [];
      if (!!measurements && measurements.length > 0) {
        measurements.forEach(measurement => {
          let fixedValue = measurement.value.toFixed(3);
          //NOTE: measuremens are ordered ascending from backend
          measurementsValues.push(fixedValue);
        });
        this.$set(serviceTimes.datasets[index], "data", measurementsValues);
      }
    },
    setLabelsToServiceTimes(serviceTimes, measurements) {
      let labels = [];
      if (!!measurements && measurements.length > 0) {
        measurements.forEach(measurement => {
          let fixedDate = new Date(measurement.end_date).toLocaleTimeString();
          //NOTE: measuremens are ordered ascending from backend
          labels.push(fixedDate);
        });
        this.$set(serviceTimes, "labels", labels);
      }
    }
  }
};
</script>

<style>
</style>