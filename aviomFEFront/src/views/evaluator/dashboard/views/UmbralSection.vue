<template>
  <v-flex d-flex xs12 sm12 md12>
    <v-layout row wrap>
      <v-flex xs4 sm4 md4>
        <DoughnutChartWrapper
          ref="aboveUmbral"
          @onShowDetails="showAboveUmbralDetails"
          :kpi="KPI.requestsAboveUmbral"
        ></DoughnutChartWrapper>
        <v-dialog v-model="KPI.requestsAboveUmbral.showDetails" max-width="1270px">
          <v-card color="white" height="100%">
            <v-card-title class="headline">{{KPI.requestsAboveUmbral.details.title}}</v-card-title>
            <div>
              <BarChart
                :xLabel="KPI.requestsAboveUmbral.details.xLabel"
                :yLabel="KPI.requestsAboveUmbral.details.yLabel"
                ref="aboveUmbralDetails"
                :stacked="true"
                :legend="true"
                :chart-data="KPI.requestsAboveUmbral.details"
                :height="400"
              />
            </div>
            <v-overlay :absolute="true" :value="KPI.requestsAboveUmbral.details.loading">
              <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-flex xs8 sm8 md8 fill-height>
        <v-card color="white" height="100%">
          <v-card-title class="headline">{{KPI.queueMeanSize.title}}</v-card-title>
          <div style="overflow-x:scroll;width:100%;">
            <!-- TODO: Width has to change (it must increase) before some call some update method of some chart. The increase could be here or in the Chart file (LineChart.js, BarChart.js ...)-->
            <LineChart
              ref="queueMeanSize"
              :chart-data="KPI.queueMeanSize"
              :width="1200"
              :height="400"
              :xLabel="KPI.queueMeanSize.xLabel"
              :yLabel="KPI.queueMeanSize.yLabel"
            />
          </div>
          <v-overlay :absolute="true" :value="KPI.queueMeanSize.loading">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
        </v-card>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import DoughnutChartWrapper from "./components/DoughnutChartWrapper";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart.js";


const DoughnutChartConfigurations = {
  backgroundColor: ["#1070CA", "#EC4C47"]
};
const lineChartConfiguration = {
  backgroundColor: "#1070CA",
  borderColor: "#1070CA",
  lineTension: 0,
  pointBackgroundColor: "#1070CA",
  fill: false
};

export default {
  components: {
    DoughnutChartWrapper,
    LineChart,
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
    priorities: [],
    KPI: {
      queueMeanSize: {
        kpiName: "lq",
        title: "Longitud promedio de la cola",
        xLabel: "Hora del día (24hrs)",
        yLabel: "Tiempo de estancia (min)",
        labels: [],
        loading: true,
        datasets: [
          {
            label: "Longitud",
            data: [],
            backgroundColor: lineChartConfiguration.backgroundColor,
            borderColor: lineChartConfiguration.borderColor,
            lineTension: lineChartConfiguration.lineTension,
            pointBackgroundColor: lineChartConfiguration.pointBackgroundColor,
            fill: lineChartConfiguration.fill
          }
        ]
      },
      requestsAboveUmbral: {
        kpiName: "pat",
        title: "Solicitudes que superan el umbral",
        labels: ["Superan Umbral", "No Superan Umbral"],
        icons: ["mdi-check-circle-outline", "mdi-close-circle-outline"],
        loading: true,
        hasSuffix: false,
        datasets: [
          {
            backgroundColor: DoughnutChartConfigurations.backgroundColor,
            data: [5, 10]
          }
        ],
        hasDetails: true,
        showDetails: false,
        details: {
          kpiName: "pat",
          title: "Solicitudes que superan el umbral por prioridad",
          labels: [],
          loading: true,
          xLabel: "Prioridades",
          yLabel: "Sobre el umbral",
          datasets: [
            {
              label: "Supera el umbral",
              backgroundColor: DoughnutChartConfigurations.backgroundColor[0],
              data: []
            },
            {
              label: "No supera el umbral",
              data: [],
              backgroundColor: DoughnutChartConfigurations.backgroundColor[1]
            }
          ]
        }
      }
    }
  }),
  methods: {
    fetchPriorities() {
      return Axios.get(this.$store.state.backend + priorities_url, {
        headers: this.requestParams.headers
      });
    },
    setPrioritiesFromResponse(axiosResponse) {
      this.priorities=[];
      let data = axiosResponse.data;
      let repeatedFlags = {};
      data.forEach(subcategory => {
        let priority = subcategory.priority;
        if (!repeatedFlags[priority]) {
          repeatedFlags[priority] = true;
          this.priorities.push(subcategory.priority + "");
        }
      });
    },
    showAboveUmbralDetails() {
      this.KPI.requestsAboveUmbral.showDetails = true;
      this.fetchPriorities()
        .then(response => {
          this.setPrioritiesFromResponse(response);
          let names = this.getKPINamesOfUmbralsByPriority();
          if (names !== "") {
            let params = {
              names: names,
              lasts: true
            };
            this.KPI.requestsAboveUmbral.details.loading = true;
            this.fetchKPIMeasurements(
              params,
              this.onGetUmbralsByPriority,
              this.onRequestErrors,
              this.KPI.requestsAboveUmbral.details
            );
          } else {
            this.onRequestErrors(
              {
                status: 500,
                message: "Error al traer controladores en linea"
              },
              this.KPI.requestsAboveUmbral.details
            );
          }
        })
        .catch(err => {});
    },
    getKPINamesOfUmbralsByPriority() {
      let names = "";
      for (let index = 0; index < this.priorities.length; index++) {
        let priority = this.priorities[index];
        if (index === this.priorities.length - 1) {
          names += this.KPI.requestsAboveUmbral.details.kpiName + priority;
        } else {
          names +=
            this.KPI.requestsAboveUmbral.details.kpiName + priority + ",";
        }
      }
      return names;
    },
    onGetUmbralsByPriority(axiosResponse) {
      let data = axiosResponse.data;
      let labels = [];
      let aboveUmbralDataset = [];
      let nonAboveUmbralDataset = [];

      this.priorities.forEach(priority => {
        labels.push(priority);
        let measurements =
          data[this.KPI.requestsAboveUmbral.details.kpiName + priority];

        if (measurements.length > 0) {
          let value = measurements[0].value;
          if (value <= 1) {
            value = value * 100;
          }
          let fixedValue = parseFloat(value.toFixed(2));
          aboveUmbralDataset.push(fixedValue);
          nonAboveUmbralDataset.push(parseFloat((100 - fixedValue).toFixed(2)));
        }
      });

      this.$set(this.KPI.requestsAboveUmbral.details, "labels", labels);
      this.$set(
        this.KPI.requestsAboveUmbral.details.datasets[0],
        "data",
        aboveUmbralDataset
      );
      this.$set(
        this.KPI.requestsAboveUmbral.details.datasets[1],
        "data",
        nonAboveUmbralDataset
      );
      this.KPI.requestsAboveUmbral.details.loading = false;
      this.$refs.aboveUmbralDetails.update();
    },
    getKPIMeasurements() {
      let params = {
        names: this.KPI.queueMeanSize.kpiName
      };
      this.KPI.queueMeanSize.loading = true;
      this.fetchKPIMeasurements(
        params,
        this.onGetQueueMeanSizeMeasurements,
        this.onRequestErrors,
        this.KPI.queueMeanSize
      );
      params = {
        names: this.KPI.requestsAboveUmbral.kpiName
      };

      this.KPI.requestsAboveUmbral.loading = true;
      this.fetchKPIMeasurements(
        params,
        this.onGetAboveUmbralKPIMeasurements,
        this.onRequestErrors,
        this.KPI.requestsAboveUmbral
      );
    },
    onGetQueueMeanSizeMeasurements(axiosResponse) {
      let data = axiosResponse.data;
      this.setMeasurementsToQueueGraph(data[this.KPI.queueMeanSize.kpiName]);
      this.setLabelsToQueueGraph(data[this.KPI.queueMeanSize.kpiName]);
      this.KPI.queueMeanSize.loading = false;
      this.$refs.queueMeanSize.update();
    },
    onGetAboveUmbralKPIMeasurements(axiosResponse) {
      let data = axiosResponse.data;
      this.onGetRequestsAboveUmbralMeasurements(
        data[this.KPI.requestsAboveUmbral.kpiName]
      );
      this.KPI.requestsAboveUmbral.loading = false;
    },
    getLastKPIMeasurements() {
      let params = {
        names:
          this.KPI.queueMeanSize.kpiName +
          "," +
          this.KPI.requestsAboveUmbral.kpiName,
        lasts: true
      };
      let callbackElements = [
        this.KPI.queueMeanSize,
        this.KPI.requestsAboveUmbral
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
      this.onGetRequestsAboveUmbralMeasurements(
        data[this.KPI.requestsAboveUmbral.kpiName]
      );

      this.addLastMeasurementToQueueGraph(data[this.KPI.queueMeanSize.kpiName]);
      this.addLastLabelToQueueGraph(data[this.KPI.queueMeanSize.kpiName]);

      this.KPI.requestsAboveUmbral.loading = false;
      this.KPI.queueMeanSize.loading = false;
      this.$refs.queueMeanSize.update();
    },
    addLastMeasurementToQueueGraph(measurements) {
      if (!!measurements && measurements.length > 0) {
        let value = measurements[0].value;
        let fixedValue = parseFloat(value.toFixed(2));
        let fixedDate = new Date(measurements[0].endDate).toLocaleTimeString();
        if (!this.KPI.queueMeanSize.labels.includes(fixedDate)) {
          this.KPI.queueMeanSize.datasets[0].data.push(fixedValue);
        }
      }
    },
    addLastLabelToQueueGraph(measurements) {
      if (!!measurements && measurements.length > 0) {
        let measurement = measurements[0];
        let fixedDate = new Date(measurement.endDate).toLocaleTimeString();
        if (!this.KPI.queueMeanSize.labels.includes(fixedDate)) {
          this.KPI.queueMeanSize.labels.push(fixedDate);
        }
      }
    },
    setMeasurementsToQueueGraph(measurements) {
      let measurementsValues = [];
      if (!!measurements && measurements.length > 0) {
        measurements.forEach(element => {
          let value = element.value;
          let fixedValue = parseFloat(value.toFixed(2));
          //NOTE: measuremens are ordered ascending from backend
          measurementsValues.unshift(fixedValue);
        });
      }
      this.$set(this.KPI.queueMeanSize.datasets[0], "data", measurementsValues);
    },
    setLabelsToQueueGraph(measurements) {
      let labels = [];
      if (!!measurements && measurements.length > 0) {
        measurements.forEach(measurement => {
          let fixedDate = new Date(measurement.endDate).toLocaleTimeString();
          //NOTE: measuremens are ordered ascending from backend
          labels.unshift(fixedDate);
        });
        this.$set(this.KPI.queueMeanSize, "labels", labels);
      }
    },
    onGetRequestsAboveUmbralMeasurements(measurements) {
      let measurementsValues = [];
      if (!!measurements && measurements.length > 0) {
        let value = measurements[0].value;
        if (value <= 1) {
          value = value * 100;
        }
        let fixedValue = parseFloat(value.toFixed(0));

        measurementsValues.push(fixedValue);
        measurementsValues.push(100 - fixedValue);
      } else {
        measurementsValues = [0, 0];
      }
      this.$set(
        this.KPI.requestsAboveUmbral.datasets[0],
        "data",
        measurementsValues
      );
      this.KPI.requestsAboveUmbral.loading = false;
      this.$refs.aboveUmbral.update();
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