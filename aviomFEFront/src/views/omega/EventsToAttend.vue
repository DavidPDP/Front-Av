<template>
  <v-col>
    <v-card>
      <v-card-title primary-title>
        <v-row class="mr-2 ml-2">
          <v-col>
            <v-select
              item-text="name"
              v-model="statesofevent"
              :items="statesofevents"
              multiple
              chips
              @change="onSelectFilter($event)"
              :prepend-icon="'filter_list'"
              item-value="id"
              placeholder="Estado del evento"
            ></v-select>
          </v-col>
          <!-- <v-spacer></v-spacer> -->
          <v-col class="mt-2">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        no-data-text="No hay eventos por el momento"
        :headers="headers"
        :items="filteredItems"
        :items-per-page="12"
        multi-sort
        :search="search"
        :single-expand="singleexpand"
        :expanded.sync="expanded"
        show-expand
        item-key="id"
        class="elevation-1"
      >
        <template v-slot:item.priority="{ item }">
          <v-chip :color="getColor(item.priority)" dark>{{ item.priority }}</v-chip>
        </template>
        <template v-slot:item.state="{ item }">{{ translateEventState(item.state) }}</template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-row>
              <!------------------------------------------------------------------------------------------->
              <!--Button: Assign Controller-->
              <div class="text-center">
                <v-dialog v-model="dialogassign" persistent width="500">
                  <template v-slot:activator="{ on }">
                    <v-btn class="mx-2 my-2" v-on="on">Asignar Controlador</v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>Asignar Controlador</v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col>
                            <v-select
                              no-data-text="No hay controladores disponibles"
                              item-text="name"
                              v-model="controller"
                              :items="controllers"
                              item-value="id"
                              placeholder="Selecciona uno"
                              label="Controlador"
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="assigncontroller(item)">Guardar</v-btn>
                      <v-btn color="primary" text @click="dialogassign = false">Cancelar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
              <!------------------------------------------------------------------------------------------->
              <!--Button: Change Priority-->
              <div class="text-center">
                <v-dialog v-model="dialogchange" persistent width="500">
                  <template v-slot:activator="{ on }">
                    <v-btn class="mx-2 my-2" v-on="on">Cambiar Prioridad</v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>Cambiar Prioridad</v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model="newPriority"
                              type="number"
                              label="Nueva prioridad del evento"
                              clearable
                              step="50"
                              min="0"
                              max="1000"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="changepriority(item)">Guardar</v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="dialogchange = false;newPriority=''"
                      >Cancelar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
              <!------------------------------------------------------------------------------------------->
              <!--Button: Change Priority-->
              <div class="text-center">
                <v-btn class="mx-2 my-2" @click="viewDetails(item)">Ver detalles</v-btn>
              </div>
              <div class="text-center">
                <v-btn class="mx-2 my-2" @click="viewHistory(item)">Ver historial</v-btn>
              </div>
              <!------------------------------------------------------------------------------------------->
            </v-row>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-col>
</template>

<script>
import Axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  data() {
    return {
      search: "",
      singleexpand: true,
      expanded: [],
      dialogedit: false,
      dialogassign: false,
      dialogchange: false,
      statesofevents: [
        "Sin asignar",
        "Asignado",
        "En proceso",
        "Por verificadar",
        "Archivado"
      ],
      statesofevent: "",
      newPriority: "",
      controllers: [],
      controller: "",
      headers: [
        {
          text: "Evento",
          align: "left",
          sortable: false,
          value: "id"
        },
        { text: "Prioridad", value: "priority" },
        { text: "Tipo", value: "title" },
        { text: "Estado del evento", value: "state" },
        { text: "Controlador", value: "controller" },
        { text: "Ruta", value: "route" },
        //{ text: "Tarea", value: "task" },
        { text: "Hora", value: "creation" }
      ],
      contents: []
    };
  },
  beforeMount() {
    this.loadEvents();
    this.loadControllers();
    this.connect();
  },
  methods: {
    viewDetails(item) {
      this.$router.push("/omega/eventstochecked/" + item.id);
    },
    getColor(priority) {
      if (priority > 800) return "red";
      else if (priority > 400) return "orange";
      else return "green";
    },
    loadEvents() {
      var headers = { Authorization: this.$store.state.token };
      Axios.get(this.$store.state.backend + "events", {
        headers: headers
      }).then(response => {
        this.contents = response.data;
      });
    },
    loadControllers() {
      var headers = { Authorization: this.$store.state.token };
      Axios.get(this.$store.state.backend + "controller/online", {
        headers: headers
      }).then(response => {
        this.controllers = response.data;
      });
    },
    translateEventState(state) {
      return this.$store.state.states[state];
    },
    editstate(item) {
      /* eslint-disable */
      console.log(item);
      this.dialogedit = false;
    },
    assigncontroller(item) {
      var headers = { Authorization: this.$store.state.token };
      window.console.log(this.controller);
      window.console.log(item.id);
      window.console.log(headers);
      Axios.post(this.$store.state.backend + "events/assing?"+"userId="+this.controller+"&eventId="+item.id,{},{headers: headers }
      ).then(response => {
        if (response.status == 200) {
          this.loadEvents();
        } else {
          alert(response.statusText);
        }
      });
      this.dialogassign = false;
    },
    changepriority(item) {
      var headers = { Authorization: this.$store.state.token };
      if (this.newPriority < 1 || this.newPriority > 1000) {
        alert("La prioridad de los eventos debe encontrarse entre 1 y 1000");
      } else {
        Axios.post(
          this.$store.state.backend + "events/event/priority",
          item,
          {
            params: {
              id: item.id,
              priority: this.newPriority
            },
           headers: headers 
          },
        ).then(response => {
          if (response.status == 200) {
            this.loadEvents();
          } else {
            alert(response.statusText);
          }
        });
        this.newPriority = "";
        this.dialogchange = false;
      }
    },
    connect() {
      /* eslint-disable */
      this.socket = new SockJS(this.$store.state.backend + "ws");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
        {},
        frame => {
          window.console.log("Frame: " + frame);
          this.connected = true;
          this.stompClient.subscribe("/queue/omega", tick => {
            window.console.log("Tick: " + tick);
            this.loadEvents();
            this.loadControllers();
          });
        },
        error => {
          window.console.log(error);
          this.connected = false;
        }
      );
    },
    viewHistory(item) {
      this.$router.push("/omega/hoevents/" + item.id);
    },
    onSelectFilter(event) {
      console.log(this.statesofevent);
    }
  },
  watch: {
    multiple(val) {
      if (val) this.statesofevent = [this.statesofevent];
      else this.statesofevent = this.statesofevent[0] || "Foo";
    }
  },
  computed: {
    filteredItems() {
      return this.contents.filter(i => {
        return (
          !this.statesofevent[0] ||
          this.translateEventState(i.state) == this.statesofevent[0]
        );
      });
    }
  }
};
</script>