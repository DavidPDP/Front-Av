<template>
  <v-col>
    <v-container>
      <v-layout row wrap>
        <v-flex>
          <v-card outlined class="px-5 pb-3">
            <v-card-actions>
              <v-btn class="mt-5" icon @click="backtoevents()">
                <v-icon>arrow_back</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
               <div class="text-center">
                  <v-dialog
                    v-model= "dialog"
                    width="500"
                  >
                    <v-card>
                      <v-card-title
                        class="headline grey lighten-2"
                        primary-title
                      >
                      Motivo del rechazo
                      </v-card-title>

                      <v-card-text>
                          <v-container>
                        <v-textarea
                        solo
                        auto-grow
                        filled
                        color="black"
                        name="input-7-4"
                        label="Justificación del rechazo"
                        :rules="justificationRules"
                        v-model="justification"
                        required
                      ></v-textarea>
                      </v-container>
                      </v-card-text>
                      
                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <div class="flex-grow-1" >
                              <v-row justify="center">
                                <v-btn class="mr-10" icon color="red" dark text @click="dialog = false">
                                    Cancelar
                                </v-btn>
                                <v-btn class="mr-2" icon color="green" dark text @click="dialog = !isJustificated">
                                    Aceptar
                                </v-btn>
                              </v-row>
                          </div>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              <v-btn class="mt-5 mr-10 " color="red" icon @click.stop="dialog = true">
                <v-icon>cancel</v-icon>
                Rechazar
              </v-btn>
              <v-btn class="mt-5 mr-12 ml-12" color="green" icon @click="checkevent()">
                <v-icon>check_circle_outline</v-icon>
                Verificar
              </v-btn>
            </v-card-actions>
            <div class="ml-5">
              <v-card-title class="eventsTitle">Evento: {{eventid}}</v-card-title>
              <v-divider></v-divider>
              <v-card-text class="eventsTitle">{{content.title}} - {{content.route}}</v-card-text>
              <v-col>
                <v-list class="px-12">
                  <p>
                    <b>Resumen</b>
                  </p>
                  <v-list-item style="user-select:text" v-for="(item, index) in content.info" :key="index">{{item}}</v-list-item>
                </v-list>
                <v-list class="px-12">
                  <p>
                    <b>Análisis</b>
                  </p>
                  <v-list-item v-for="(item, index) in content.analysisElements" :key="index">
                    <v-list-item-action>
                      <v-checkbox :disabled="true" v-model="item.done"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{item.description}}</v-list-item-title>
                      <v-list-item-subtitle v-if="item.done">{{item.time}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-list class="px-12">
                  <p>
                    <b>Acciones</b>
                  </p>
                  <v-list-item v-for="(item, index) in content.actions" :key="index">
                    <v-list-item-action>
                      <v-checkbox :disabled="true" v-model="item.done"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{item.description}}</v-list-item-title>
                      <v-list-item-subtitle v-if="item.done">{{item.time}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-list class="px-12" :dense="true">
                  <p>
                    <b>Estados</b>
                  </p>
                  <v-list-item>Estado: {{ translateState(content.state) }}</v-list-item>
                  <v-list-item>Actualización: {{ content.stateStart }}</v-list-item>
                  <v-list-item v-for="(state, key) in $store.state.eventStates" :key="key">
                    {{ key + ": " +  (content.stateTimes[state] == undefined? "00:00:00" : content.stateTimes[state]) }}
                  </v-list-item>
                </v-list>
              </v-col>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-col>
</template>

<script>
import Axios from "axios";

export default {
  data() {
    return {
      eventid: this.$route.params.id,
      content: {
        stateTimes: []
      },
      dialog: false,
      justification:'',

      justificationRules:[
        justification => !!justification || "La justificación es requerida",
      ],
    };
  },
  
  methods: {
    loadEvent() {
      var headers = { Authorization: this.$store.state.token };
      Axios.get(this.$store.state.backend + "events/" + this.eventid, {headers:headers}).then(response => {
        this.content = response.data;
      });
    },
    backtoevents(){
      this.$router.push("/omega/eventstoattend");
    },
    checkevent(){
      var headers = { Authorization: this.$store.state.token };
      Axios.post(
        this.$store.state.backend + "events/verify",
        {},
        {
          params: {
            userId: this.$store.state.person.id,
            eventId: this.eventid
          },
        headers:headers
        },
      ).then(response => {
        if (response.status == 200) {
          this.$router.push("/omega/eventstoattend");
        } else {
          alert(response.statusText);
        }
      });
    },

    rejectEvent(){
      
    },

    translateState(state) {
      return this.$store.state.states[state];
    }
  },
  beforeMount(){
    this.loadEvent();
  },
  computed: {
    isJustificated: function(){
      return this.justification.length!=0;
    }
  }
  
};
</script>