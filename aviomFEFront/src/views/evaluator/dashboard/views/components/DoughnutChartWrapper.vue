<template>
  <v-card class="mx-auto" color="white" outlined>
    <v-card-title class="headline">{{kpi.title}}</v-card-title>
    <DoughnutChart ref="chart" :chart-data="kpi" :height="250" />
    <v-card-text class="mb-0 pb-0">
      <template>
        <v-container class="ml-0 mr-0 pb-0" fluid grid-list-xl>
          <v-layout row justify-center>
            <v-flex
              row
              class="d-flex flex-row text-center"
              justify-center
              v-bind:key="i"
              v-for="(label,i) in kpi.labels"
            >
              <v-list>
                <v-icon :color="kpi.datasets[0].backgroundColor[i]">{{kpi.icons[i]}}</v-icon>
                <v-list-item-title class="grey--text">{{label}}</v-list-item-title>
                <v-list-item-subtitle
                  v-if="kpi.hasSuffix"
                  :style="'color:'+kpi.datasets[0].backgroundColor[i]+';'"
                >{{kpi.datasets[0].data[i]+kpi.suffix}}</v-list-item-subtitle>
                <v-list-item-subtitle
                  v-else
                  :style="'color:'+kpi.datasets[0].backgroundColor[i]+';'"
                >{{kpi.datasets[0].data[i]}}</v-list-item-subtitle>
              </v-list>
            </v-flex>
          </v-layout>
        </v-container>
      </template>
    </v-card-text>
    <v-card-actions class="pt-0 pb-0 pr-0" v-if="kpi.hasDetails">
      <v-spacer></v-spacer>
      <v-btn text small color="primary text-overline" @click="showDetails">Ver detalles ></v-btn>
    </v-card-actions>
    <v-overlay :absolute="true" :value="kpi.loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
import DoughnutChart from "./DoughnutChart.js";
const showDetailsEvent = "onShowDetails";
export default {
  props: {
    kpi: Object
  },
  components: {
    DoughnutChart
  },
  methods: {
    showDetails() {
      this.$emit(showDetailsEvent, this.kpi);
    },
    update() {
      this.$refs.chart.update();
    }
  }
};
</script>

<style>
</style>