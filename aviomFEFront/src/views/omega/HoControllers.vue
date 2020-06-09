<template>
  <v-col>
    <v-card>
      <v-card-actions>
        <v-btn class="mt-5" icon @click="back()">
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </v-card-actions>
      <v-card-title>{{ controller.id + " " + controller.name }}</v-card-title>
      <v-data-table :headers="headers" :items="controller.logs" :items-per-page="10"  :sort-by="['time']" class="elevation-1">
        <template v-slot:item.action="{ item }">
          {{ translateLog(item.action) }}
        </template>
      </v-data-table>
    </v-card>
  </v-col>
</template>

<script>
import Axios from 'axios';

export default {
  data() {
    return {
      userid: this.$route.params.id,
      controller: {
        name: "",
        id: "Cargando...",
        logs: []
      },
      headers: [
        {
          text: "Hora",
          value: "time"
        },
        { 
          text: "Acción",
          value: "action"
        },
        { 
          text: "Id del evento",
          value: "event" 
        }
      ]
    };
  },
  methods: {
    loadUserHistory() {
      var headers = { Authorization: this.$store.state.token };
      Axios.get(this.$store.state.backend + "users/" + this.userid + "/history", {headers:headers}).then(response => {
        this.controller = response.data;
      });
    },
    translateLog(log) {
      return this.$store.state.logs[log];
    },
    back(){
      this.$router.push("/omega/Controllers");
    }
  },
  beforeMount() {
    this.loadUserHistory();
  }
};
</script>