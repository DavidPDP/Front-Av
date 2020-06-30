<template>
  <div style="width:100%;height:100%">
    <v-container fluid grid-list-md>
      <v-flex d-flex wrap xs12 sm12 md12 id="dash">
        <v-layout row wrap fill-height>
          <v-flex class="d-inline-flex" xs12 sm12 md12 wrap id="subcontainer1">
            <v-layout row wrap>
              <QueueTimeSection ref="QueueTimeSection"></QueueTimeSection>
              <ControllersTimeSection ref="ControllersTimeSection"></ControllersTimeSection>
            </v-layout>
          </v-flex>
          <UmbralSection ref="UmbralSection"></UmbralSection>
        </v-layout>
      </v-flex>
      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{ snackText }}
        <v-btn text @click="snack = false">Close</v-btn>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import QueueTimeSection from "./views/QueueTimesSection";
import ControllersTimeSection from "./views/ControllersTimeSection";
import UmbralSection from "./views/UmbralSection";
import Axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { FETCH_KPIS } from "@/store/actions.type";
import { ERROR, INFO, SUCCESS } from "@/common/evaluator.request.states.js";

const dashboardChannel = "dashboard";

export default {
  components: {
    QueueTimeSection,
    ControllersTimeSection,
    UmbralSection
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
  beforeMount() {
    this.$store.dispatch(FETCH_KPIS);
    this.suscribeToEvaluator();
  },
  mounted() {
    // this.$refs.QueueTimeSection.getKPIMeasurements();
    // this.$refs.ControllersTimeSection.getKPIMeasurements();
    // this.$refs.UmbralSection.getKPIMeasurements();
  },
  methods: {
    onRequestError(error) {
      let errorResponse = !error.response ? error : error.response;
      let errorData = !errorResponse.data
        ? { message: "" }
        : errorResponse.data;
      let message = errorData.message;
      let status = !errorResponse.status ? errorResponse : errorResponse.status;
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "HTTP " + status + " Error " + message;
    },
    suscribeToEvaluator() {
      this.socket = new SockJS(this.$store.state.backend + "ws");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
        {},
        frame => {
          window.console.log("WEBSOCKET FRAME:");
          window.console.log(frame);
          this.stompClient.subscribe(
            this.$store.state.evaluatorChannel + "/" + dashboardChannel,
            tick => {
              this.notify(tick);
            }
          );
        },
        error => {
          this.onSubscriptionError(error);
        }
      );
    },

    notify(tick) {
      window.console.log("WEBSOCKET TICK:");
      window.console.log(tick);
      this.$refs.QueueTimeSection.getLastKPIMeasurements();
      this.$refs.ControllersTimeSection.getLastKPIMeasurements();
      this.$refs.UmbralSection.getLastKPIMeasurements();
    },
    onSubscriptionError(error) {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Error al suscribirse al sistema: " + error.reason;
    }
  }
};
</script>

<style>
.container {
  margin: 0 0;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  min-height: 100%;
}

.bar {
  min-width: 100%;
  width: 100%;
}
.scroll {
  overflow-x: scroll;
}
</style>