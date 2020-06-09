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
  <v-data-table 
    no-data-text="No hay controladores por el momento"
    :headers="headers"
    :items="people"
    sort-by="id"
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
                       <v-list  subheader>

                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="title">Estado:</v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-content>
                            <v-list-item-title>{{ translateState(selectedController.state) }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item >
                          <v-list-item-content>
                            <v-list-item-title class="title">Ultima Actualización:</v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-content>
                            <v-list-item-title>{{ selectedController.stateStart }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        
                      <v-divider ></v-divider>
                      <v-subheader >Eventos</v-subheader>

                        <v-list-item >
                          <v-list-item-content>
                            <v-list-item-title class="title">Eventos Asignados:</v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-content>
                            <v-list-item-title>{{selectedController.assignedEvents}}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <v-list-item >
                          <v-list-item-content>
                            <v-list-item-title class="title">Eventos Activos:</v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-content>
                            <v-list-item-title>{{selectedController.activeEvents}}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                         <v-list-item >
                          <v-list-item-content>
                            <v-list-item-title class="title"> Eventos Atendidos:</v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-content>
                            <v-list-item-title>{{selectedController.solvedEvents}}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <v-divider ></v-divider>

                         <v-subheader >Estados</v-subheader>

                        
                        <div v-if="detailDialog">
                        <v-list-item 
                          v-for="(state, key) in $store.state.userStates" :key="key"
                        >
                          <v-list-item-content>
                            <v-list-item-title class="title">
                               {{ key + ": "}}
                              </v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-content>
                            <v-list-item-title>
                               {{ (selectedController.stateTimes[state] == undefined? "00:00:00" : selectedController.stateTimes[state]) }}
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
      <v-btn
        text
        color="primary accent-4"
        @click="openDetails(item)"
      >
        Ver Detalles
      </v-btn>
      <v-btn
        text
        color="primary accent-4"
        @click="viewHistory(item)"
      >
        Ver Historial
      </v-btn>
    </template>
  </v-data-table>
  </v-card>
</div>
  
</template>

<script>
import Axios from 'axios';
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  data() {
    return {
      search: '',
       controllerDetails:[
            {text: 'Estado', icon:''},
            {text: 'Ultima Actualización', icon:''},
            {text: 'Eventos Asignados', icon:''},
            {text: 'Eventos Activos',icon:''},
            {text: 'Eventos Atendidos',icon:''},
            {text: 'Disponible',icon:''},
            {text: 'Evento Asignado',icon:''},
            {text: 'Ocupado',icon:''},
            {text: 'No Disponible',icon:''},
        ],
        headers: [
        { text: 'Identificador', align: 'left', sortable: false, value: 'id'},
        { text: 'Nombre', value: 'name'},
        { text: 'Estación de trabajo', value: 'station' },
        { text: 'Acciones', value: 'action', sortable: false ,align:'center'},
      ],
      people: [],
      detailDialog:false,
      selectedController:'',
    };
  },
  beforeMount() {
    this.loadControllers();
    this.connect();
  },
  methods: {

      openDetails (item) {
        this.selectedController = Object.assign({}, item)
        this.detailDialog = true
      },

      closeDetails () {
        this.detailDialog = false
      },

    loadControllers() {
      var headers = { Authorization: this.$store.state.token };
      Axios.get(this.$store.state.backend + "controller/online", {headers:headers}).then(
        response => {
          this.people = response.data;
        }
      );
    },
    translateState(state) {
      return this.$store.state.states[state];
    },
    connect() {
      this.socket = new SockJS(this.$store.state.backend + "ws");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
        {},
        (frame) => {
          window.console.log("Frame: " + frame);
          this.connected = true;
          this.stompClient.subscribe("/queue/omega", (tick) => {
            window.console.log("Tick: " + tick);
            this.loadControllers();
          });
        },
        (error) => {
          window.console.log(error)
          this.connected = false;
        }
      );
    },
    viewHistory(item) {
      this.$router.push("/omega/hocontrollers/" + item.id);
    }
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