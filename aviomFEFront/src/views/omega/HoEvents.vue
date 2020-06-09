<template>
  <v-col>
    <v-card>
       <v-card-actions>
        <v-btn class="mt-5" icon @click="back()">
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </v-card-actions>
      <v-card-title>{{ event.id + " " + event.title }}</v-card-title>
      <v-data-table :headers="headers" :items="event.logs" :items-per-page="10" :sort-by="['time']" class="elevation-1">
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
      eventid: this.$route.params.id,
      event : {
        title: "",
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
          text: "Usuario",
          value: "user" 
        }
      ],
    };
  },
  methods : {
    loadEventHistory() {
      var headers = { Authorization: this.$store.state.token };
      Axios.get(this.$store.state.backend + "events/" + this.eventid + "/history", {headers:headers}).then(response => {
        this.event = response.data;
      });
    },
    translateLog(log) {
      return this.$store.state.logs[log];
    },
     back(){
      this.$router.push("/omega/eventstoattend");
    }
  },
  beforeMount() {
    this.loadEventHistory();
  }
};
</script>