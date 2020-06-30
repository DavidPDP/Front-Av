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
      <v-snackbar v-model="info.active" :timeout="3000" :color="info.state">
        {{ info.text }}
        <v-btn text @click="info.active = false">Close</v-btn>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { FETCH_KPIS } from "@/store/actions.type";
import QueueTimeSection from "./views/QueueTimesSection";
import ControllersTimeSection from "./views/ControllersTimeSection";
import UmbralSection from "./views/UmbralSection";
import Axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

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
  computed: {
    ...mapGetters({
      info: "dashboard_info";
    })
  },
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