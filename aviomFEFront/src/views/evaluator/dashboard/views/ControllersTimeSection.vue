<template>
  <v-flex d-flex xs3 sm3 md3 wrap>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 wrap class="mb-0 pb-0">
        <DoughnutChartWrapper
          ref="occupationTime"
          @onShowDetails="showOccupationTimeDetails"
          :kpi="KPI.controllersOccupationTime"
        ></DoughnutChartWrapper>
        <v-dialog v-model="KPI.controllersOccupationTime.showDetails" max-width="1270px">
          <v-card color="white" height="100%">
            <v-card-title class="headline">{{KPI.controllersOccupationTime.details.title}}</v-card-title>
            <div>
              <BarChart
                ref="occupationTimeDetails"
                :xLabel="KPI.controllersOccupationTime.details.xLabel"
                :yLabel="KPI.controllersOccupationTime.details.yLabel"
                :stacked="true"
                :legend="true"
                :chart-data="KPI.controllersOccupationTime.details"
                :height="500"
              />
            </div>
            <v-overlay :absolute="true" :value="KPI.controllersOccupationTime.details.loading">
              <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
          </v-card>
        </v-dialog>
      </v-flex>

      <v-flex xs12 sm12 md12>
        <v-layout row wrap>
          <v-flex xs12 sm12 md12>
            <KPICard
              :loading="KPI.requestsServedDeviation.loading"
              :data="KPI.requestsServedDeviation"
              :color="'#3F51B5'"
              :textColor="'white'"
            ></KPICard>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12>
            <KPICard
              :data="KPI.controllerOccupationTimeDeviation"
              :color="'#3F51B5'"
              :loading="KPI.controllerOccupationTimeDeviation.loading"
              :textColor="'white'"
            ></KPICard>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import Axios from "axios";

import BarChart from "./components/BarChart.js";
import DoughnutChartWrapper from "./components/DoughnutChartWrapper";
import KPICard from "./components/KPICard";

const errorRequestEvent = "errorRequestEvent";
const measurements_url = "evaluator/measurements";
const online_controllers_url = "controller/online";

const colors = {
  blue: "#1070CA",
  red: "#EC4C47",
  yellow: "#FDD835",
  green: "green"
};
const DoughnutChartConfigurations = {
  backgroundColor: [colors.blue, colors.red]
};

export default {
  components: {
    DoughnutChartWrapper,
    KPICard,
    BarChart
  },
  computed: {
    requestParams() {
      return {
        headers: {
          Authorization: this.$store.state.token
        }
      };
    }
  },
  data: () => ({
    onlineControllers: [],
    KPI: {
      controllersOccupationTime: {
        kpiName: "p",
        title: "Ocupación de los controladores",
        labels: ["Disponible", "Ocupado"],
        icons: ["mdi-laptop", "mdi-cancel"],
        suffix: "%",
        hasSuffix: true,
        datasets: [
          {
            backgroundColor: DoughnutChartConfigurations.backgroundColor,
            data: [0, 0]
          }
        ],
        hasDetails: true,
        showDetails: false,
        loading: true,
        details: {
          kpiName: "pc",
          title: "Ocupación de los controladores",
          labels: [],
          xLabel: "Controladores",
          yLabel: "Ocupación (%)",
          datasets: [
            {
              label: "Ocupado",
              backgroundColor: DoughnutChartConfigurations.backgroundColor[1],
              data: []
            },
            {
              label: "Disponible",
              data: [],
              backgroundColor: DoughnutChartConfigurations.backgroundColor[0]
            }
          ],
          loading: true
        }
      },
      requestsServedDeviation: {
        kpiName: "stdUc",
        title: "Desv - solicitudes atendidas",
        hasNotes: false,
        valueSuffix: "",
        icon: "mdi-chart-bell-curve",
        iconColor: colors.yellow,
        value: 0,
        loading: true
      },
      controllerOccupationTimeDeviation: {
        kpiName: "stdCR",
        title: "Desv - ocupación de controladores",
        hasNotes: false,
        valueSuffix: "%",
        icon: "mdi-chart-bell-curve",
        iconColor: colors.yellow,
        value: 0,
        loading: true
      }
    }
  }),
  methods: {
    fetchOnlineControllers() {
      return Axios.get(this.$store.state.backend + online_controllers_url, {
        headers: this.requestParams.headers
      });
    },
    showOccupationTimeDetails() {
      this.KPI.controllersOccupationTime.showDetails = true;
      this.KPI.controllersOccupationTime.details.loading = true;
      this.fetchOnlineControllers()
        .then(response => {
          this.onlineControllers = response.data;
          let names = this.getKPINamesOfOcuppationTimesByController();
          if (names !== "") {
            let params = {
              names: names,
              lasts: true
            };

            this.fetchKPIMeasurements(
              params,
              this.onGetKPIOccupationTimesMeasurementsByController,
              this.onRequestErrors,
              this.KPI.controllersOccupationTime.details
            );
          } else {
            this.onRequestErrors(
              {
                status: 500,
                message: "Error al traer controladores en linea"
              },
              this.KPI.controllersOccupationTime.details
            );
          }
        })
        .catch(err => {
          this.onRequestErrors(err, this.KPI.controllersOccupationTime.details);
        });
    },
    getKPINamesOfOcuppationTimesByController(onlineControllers) {
      let names = "";
      for (let index = 0; index < this.onlineControllers.length; index++) {
        let controller = this.onlineControllers[index];
        let id = controller.id;
        if (index === this.onlineControllers.length - 1) {
          names += this.KPI.controllersOccupationTime.details.kpiName + id;
        } else {
          names +=
            this.KPI.controllersOccupationTime.details.kpiName + id + ",";
        }
      }
      return names;
    },
    onGetKPIOccupationTimesMeasurementsByController(axiosResponse) {
      let data = axiosResponse.data;
      let labels = [];
      let occupationTimeDataset = [];
      let nonOcuppationTimeDataset = [];
      this.onlineControllers.forEach(controller => {
        let controllerId = controller.id;
        let controllerName = controller.name;
        labels.push(controllerName);
        let measurements =
          data[
            this.KPI.controllersOccupationTime.details.kpiName + controllerId
          ];
        if (measurements.length > 0) {
          let value = measurements[0].value;
          if (value <= 1) {
            value = value * 100;
          }
          let fixedValue = parseFloat(value.toFixed(2));
          occupationTimeDataset.push(fixedValue);
          nonOcuppationTimeDataset.push(
            parseFloat((100 - fixedValue).toFixed(2))
          );
        }
      });

      this.$set(this.KPI.controllersOccupationTime.details, "labels", labels);
      this.$set(
        this.KPI.controllersOccupationTime.details.datasets[0],
        "data",
        occupationTimeDataset
      );
      this.$set(
        this.KPI.controllersOccupationTime.details.datasets[1],
        "data",
        nonOcuppationTimeDataset
      );
      this.KPI.controllersOccupationTime.details.loading = false;

      this.$refs.occupationTimeDetails.update();
    },
    getKPIMeasurements() {
      this.getLastKPIMeasurements();
    },
    getLastKPIMeasurements() {
      let params = {
        names:
          this.KPI.controllersOccupationTime.kpiName +
          "," +
          this.KPI.controllerOccupationTimeDeviation.kpiName +
          "," +
          this.KPI.requestsServedDeviation.kpiName,
        lasts: true
      };
      let callbackElements = [
        this.KPI.controllersOccupationTime,
        this.KPI.controllerOccupationTimeDeviation,
        this.KPI.requestsServedDeviation
      ];
      callbackElements.forEach(element => {
        this.$set(element, "loading", true);
      });
      this.fetchKPIMeasurements(
        params,
        this.onGetLastKPIMeasurements,
        this.onRequestErrors,
        callbackElements
      );
    },
    fetchKPIMeasurements(params, callback, errorCallback, callbackElement) {
      Axios.get(this.$store.state.backend + measurements_url, {
        headers: this.requestParams.headers,
        params: params
      })
        .then(response => {
          callback(response);
        })
        .catch(err => {
          errorCallback(err, callbackElement);
        });
    },
    onGetLastKPIMeasurements(axiosResponse) {
      let data = axiosResponse.data;
      this.onGetControllersOccupationTimeMeasurements(
        data[this.KPI.controllersOccupationTime.kpiName]
      );
      this.onGetKPICardMeasurements(
        data[this.KPI.requestsServedDeviation.kpiName],
        this.KPI.requestsServedDeviation
      );
      this.onGetKPICardMeasurements(
        data[this.KPI.controllerOccupationTimeDeviation.kpiName],
        this.KPI.controllerOccupationTimeDeviation
      );

      this.KPI.controllersOccupationTime.loading = false;
      this.KPI.requestsServedDeviation.loading = false;
      this.KPI.controllerOccupationTimeDeviation.loading = false;
    },
    onGetControllersOccupationTimeMeasurements(measurements) {
      let measurementsValues = [];
      if (!!measurements && measurements.length > 0) {
        let value = measurements[0].value;
        if (value <= 1) {
          value = value * 100;
        }
        let fixedValue = parseFloat(value.toFixed(0));
        measurementsValues.push(100 - fixedValue);
        measurementsValues.push(fixedValue);
      } else {
        measurementsValues = [0, 0];
      }
      this.$set(
        this.KPI.controllersOccupationTime.datasets[0],
        "data",
        measurementsValues
      );
      this.$refs.occupationTime.update();
    },
    onGetKPICardMeasurements(measurements, kpiCard) {
      if (!!measurements && measurements.length > 0) {
        let value = measurements[0].value;
        let fixedValue = value.toFixed(0);
        this.$set(kpiCard, "value", fixedValue);
      }
    },
    onRequestErrors(err, callbackElement) {
      let callbackElements = [];
      if (!Array.isArray(callbackElement)) {
        callbackElements.push(callbackElement);
      } else {
        callbackElements = callbackElement;
      }
      callbackElements.forEach(element => {
        this.$set(element, "loading", false);
      });
      this.$emit(errorRequestEvent, err);
    }
  }
};
</script>

<style>
</style>