<template>
<div class="controllersContainer">
  <v-card  style="width:100%;">
    <v-card-title>
      Controladores
      <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Buscar"
        single-line
        hide-details
        >
      </v-text-field>
    </v-card-title>
  <v-data-table no-data-text="No hay controladores por el momento"
    :headers="headers"
    :items="controllers"
    :search="search"
  >
 
    <template v-slot:top> 
        <v-dialog v-model="detailDialog" max-width="520">
          <v-card>
            <v-card-title>
              <span class="headline">Detalles de {{selectedController.name}}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col >
                       <v-list subheader>

                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="title">Estado:</v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-content>
                            <v-list-item-title>{{ translateState(selectedController.lastUserTrack.state.name) }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item >
                          <v-list-item-content>
                            <v-list-item-title class="title">Ultima Actualización:</v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-content>
                            <v-list-item-title>{{ new Date(selectedController.lastUserTrack.startTime).toLocaleDateString("en-US") }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        
                      <v-divider ></v-divider>
                      <v-subheader >Eventos</v-subheader>

                        <v-list-item >
                          <v-list-item-content>
                            <v-list-item-title class="title">Eventos Asignados:</v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-content>
                            <v-list-item-title>{{ "assignedEvents.length" }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <v-list-item >
                          <v-list-item-content>
                            <v-list-item-title class="title">Eventos Activos:</v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-content>
                            <v-list-item-title>{{ "activeEvents.length" }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                         <v-list-item >
                          <v-list-item-content>
                            <v-list-item-title class="title"> Eventos Atendidos:</v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-content>
                            <v-list-item-title>{{ "solvedEvents.length" }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <v-divider ></v-divider>

                        <v-subheader >Estados</v-subheader>

                        <div v-if="detailDialog">
                        <v-list-item 
                          v-for="(track, key) in operatorTracks" :key="key"
                        >
                          <v-list-item-content>
                            <v-list-item-title class="title">
                               {{ track.state.name + ": "}}
                              </v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-content>
                            <v-list-item-title>
                               {{ new Date(track.startTime).toLocaleDateString("en-US") }}
                              </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        </div>

                      </v-list>
                  </v-col>
                  
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
               <v-btn
                    text
                    color="green darken-3 accent-4"
                    @click="closeDetails()"
                >
                    Aceptar
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </template>
    <template v-slot:item.action="{ item }">
      <v-btn text color="primary accent-4" @click="openDetails(item)">Ver Detalles</v-btn>
      <v-btn text color="primary accent-4" @click="viewHistory(item)">Ver Historial</v-btn>
    </template>
  </v-data-table>
  </v-card>
</div>
  
</template>

<script>
import { mapGetters } from "vuex";
import { FETCH_OPERATORS, FETCH_EVENT_HISTORY, FETCH_OPERATOR_HISTORY } from "@/store/actions.type";
import FormatsService from "@/common/formats.service";

export default {
  data() {
    return {
      search: '',
      headers: [
        { text: 'Nombre', value: 'name', align:'center'},
        { text: 'Último estado', value: 'lastUserTrack.state.name', align:'center'},
        { text: 'Último evento', value: 'lastEvent.code', align:'center'},
        { text: 'Carga de trabajo', value: 'workload', align:'center'},
        { text: 'Eventos asignados', value: 'assignedEvents', align:'center'},
        { text: 'Eventos activos', value: 'activeEvents', align:'center'},
        { text: 'Eventos resueltos', value: 'solvedEvents', align:'center'},
        { text: 'Acciones', value: 'action', sortable: false, align:'center'}
      ],
      detailDialog:false,
      selectedController: {"lastUserTrack":{"state":{"name":null,"startTime":null}}}
    };
  },
  computed: {
    ...mapGetters(["controllers", "activeEvents", 
      "assignedEvents", "solvedEvents", "operatorTracks"])
  },

  methods: {
    openDetails (item) {
      this.detailDialog = true;
      this.selectedController = Object.assign({}, item);
      this.$store.dispatch(FETCH_EVENT_HISTORY, this.selectedController.accountName);
      this.$store.dispatch(FETCH_OPERATOR_HISTORY, this.selectedController.accountName);
    },

    closeDetails () {
      this.detailDialog = false
    },

    translateState(state) {
      return this.$store.state.states[state];
    },

    viewHistory(item) {
      this.$router.push("/omega/hocontrollers/" + item.id);
    },

    formatDate(date){
      return FormatsService.formatDate(date);
    }

  },
  beforeMount() {
    this.$store.dispatch(FETCH_OPERATORS, true);
  }
};
</script>

<style>
.controllersContainer{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  /* align-items: center; */

  margin-top: 15px;
  margin-left: 10px;
  margin-right: 10px;
}
.v-list-item .v-list-item__title, .v-list-item .v-list-item__subtitle {
    line-height: 1.2;
    margin-top: 0px;
    margin-bottom: 0px;
}

</style>