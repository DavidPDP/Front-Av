<template>
  <v-col>
    <v-container grid-list-md>
      <!-----------------------------------Top View------------------------------------------>
      <v-layout row wrap>
        <v-flex>
          <v-dialog v-model="justificationDialog" width="500">
            <v-card>
              <v-card-title class="headline grey lighten-2" primary-title>Motivo de la ausencia</v-card-title>

              <v-card-text>
                <v-container>
                  <v-select
                    v-model="justificationSelected"
                    :items="justifications"
                    menu-props="auto"
                    hide-details
                    label="Seleccionar"
                    single-line
                  ></v-select>
                </v-container>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <div class="flex-grow-1">
                  <v-row justify="center">
                    <v-btn class="mr-2" icon color="green" dark text @click="justificationDialog = !isJustified">Aceptar</v-btn>
                  </v-row>
                </div>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-card outlined>
            <v-row justify="space-around">
              <!-------------------------------Controller----------------------------------->

              <!-------------------------------State----------------------------------->
              <v-col>
                <v-menu :close-on-click="true" :close-on-content-click="true">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="menuCandS"
                      text
                      block
                      v-on="on"
                      v-bind:style="{ color: statecolor }"
                    >Estado: {{statecontroller}}</v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item,index) in states"
                      :key="index"
                      @click="changeState(item.title)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-card>
        </v-flex>
      </v-layout>
      <!-------------------------------------------------------------------------------------------->
      <!-----------------------------------Assigned Events------------------------------------------>
      <v-layout row wrap>
        <v-flex>
          <v-card outlined class="px-5">
            <v-card-title class="eventsTitle">Eventos Asignados</v-card-title>
            <div v-for="(item,index) in assignedevents" :key="index">
              <v-row>
                <v-col cols="10">
                  <v-btn
                    class="eventsTitle"
                    text
                    block
                    @click="item.visible = changeinfovisibility(item)"
                  >{{item.title}} - {{item.route}}</v-btn>
                </v-col>
                <v-col cols="1">
                  <v-btn text block @click="checkadd(item)">
                    <v-icon>check_circle_outline</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="1">
                  <div class="text-center">
                  <v-dialog
                    v-model= "eventRejectDialog"
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
                        v-model="eventRejectJustification"
                        required
                      ></v-textarea>
                      </v-container>
                      </v-card-text>
                      
                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <div class="flex-grow-1" >
                              <v-row justify="center">
                                <v-btn class="mr-10" icon color="red" dark text @click="eventRejectDialog = false">
                                    Cancelar
                                </v-btn>
                                <v-btn class="mr-2" icon color="green" dark text @click="verifyUnavailable();forDelete = item">
                                    Aceptar
                                </v-btn>
                              </v-row>
                          </div>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
                  <v-btn text block  @click="eventRejectDialog = true">
                    <v-icon>cancel</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-list v-show="item.visible" class="px-12" dense="true">
                <v-list-item v-for="(second, index) in item.info" :key="index">{{second}}</v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
      <!-------------------------------------------------------------------------------------------->
      <!-----------------------------------Accepted Events------------------------------------------>
      <v-layout row wrap>
        <v-flex>
          <v-card outlined class="px-5 pb-3">
            <v-card-title class="eventsTitle">Eventos Aceptados</v-card-title>
            <div v-for="(item,index) in acceptedevents" :key="index">
              <v-row>
                <v-col cols="11">
                  <v-btn
                    class="eventsBody"
                    text
                    block
                    @click="item.visible = changeinfovisibility(item)"
                  >{{item.title}} - {{item.route}}</v-btn>
                </v-col>
                <v-col cols="1">
                  <!-- <v-btn text block @click="eventfinished(item)">
                    <v-icon>check_circle_outline</v-icon>
                  </v-btn>-->

                  <template>
                    <v-row justify="center">
                      <v-dialog v-model="eventFinishedDialog" persistent max-width="290">
                        <template v-slot:activator="{ on }">
                          <v-btn color="blue-grey lighten-3" v-on="on">
                            <v-icon>check_circle_outline</v-icon>
                          </v-btn>
                        </template>
                        <v-card>
                          <v-card-title class="headline">Atención</v-card-title>
                          <v-card-text>No se han completado todas las acciones sobre el evento</v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red" text @click="eventFinishedDialog = false">Cancelar</v-btn>
                            <v-btn color="green" text @click="eventfinished(item)">Aceptar</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-row>
                  </template>
                </v-col>
              </v-row>
              <v-col>
                <v-list v-show="item.visible" class="px-12" :dense="true">
                  <p>
                    <b>Resumen</b>
                  </p>
                  <v-list-item
                    style="user-select:text"
                    v-for="(second, index) in item.info"
                    :key="index"
                  >{{second}}</v-list-item>
                </v-list>
                <v-list v-show="item.visible" class="px-12" :dense="true">
                  <p>
                    <b>Análisis</b>
                  </p>
                  <v-list-item v-for="(second, index) in item.analysisElements" :key="index">
                    <v-list-item-action>
                      <v-checkbox v-model="second.done" @change="sendAnalysis(second)"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>{{second.description}}</v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-list v-show="item.visible" class="px-12" :dense="true">
                  <p>
                    <b>Acciones</b>
                  </p>
                  <v-list-item v-for="(second, index) in item.actions" :key="index">
                    <v-list-item-action>
                      <v-checkbox v-model="second.done" @change="sendAction(second)"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>{{second.description}}</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
      <!-------------------------------------------------------------------------------------------->
      <!-----------------------------------Buttons------------------------------------------>
    </v-container>
    <v-dialog v-model="isOpenMessage" persistent width="350">
      <template v-slot:activator="{ on }"></template>
      <v-card>
        <v-card-title class="headline">Atención</v-card-title>
        <v-card-text>{{msg}}</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            color="primary darken-1"
            text
            @click="isOpenMessage = false;changeState('No disponible')"
          >Sí</v-btn>
          <v-btn
            color="primary darken-1"
            text
            @click="isOpenMessage = false; checkdelete(forDelete)"
          >No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<style lang="scss" scoped>
@import "../../../scss/controller.scss";
.menuCandS {
  text-transform: $text-transform-title;
  font-family: $font-family;
  font-size: $font-size-title;
  font-weight: bold;
}
.eventsTitle {
  text-transform: $text-transform-title;
  font-family: $font-family;
  font-size: $font-size-title;
  font-weight: bold;
}
.eventsBody {
  text-transform: $text-transform-body;
  font-family: $font-family;
  font-size: $font-size-body;
}
</style>

<script>
import Axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      name: "eventManagement",
      statecontroller: "",
      statecolor: "",
      eventRejectDialog: false,
      eventRejectJustification:"",
      eventFinishedDialog: false,
      justificationDialog: false,
      justificationSelected: "",
      justifications: ["COMER", "DORMIR", "HACER DEL 2", "HACER DEL 1"],
      items: [
        {
          title: "Cerrar sesión"
        }
      ],
      states: [
        {
          title: "Disponible"
        },
        {
          title: "No disponible"
        }
      ],
      assignedevents: [],
      acceptedevents: [],
      isOpenMessage: false,
      msg: "",
      lastEvent: 0,
      forDelete: null
    };
  },
  methods: {
    ...mapActions(["resetPersonState", "removeToken"]),
    menucontroller(item) {
      if (item.title == "Cerrar sesión") {
        this.resetPersonState();
        this.removeToken();
        window.console.log(
          "--------------------------------------------------------------------------" +
            this.$store.state.token
        );
        this.$router.push("/login");
      }
    },
    verifyUnavailable() {
      this.isOpenMessage = true;
      this.msg = "Desea pasar al estado no disponible?";
      this.eventRejectDialog = false
    },
    checkdelete(item) {
      var headers = { Authorization: this.$store.state.token };
      Axios.post(
        this.$store.state.backend + "events/reject",
        {},
        {
          params: {
            userId: this.$store.state.person.id,
            eventId: item.id
          },
          headers: headers
        }
      ).then(response => {
        if (response.status == 200) {
          this.refresh();
        } else {
          alert(response.statusText);
        }
      });
    },
    changeinfovisibility(item) {
      return (item.visible = !item.visible);
    },
    checkadd(item) {
      var headers = { Authorization: this.$store.state.token };
      Axios.post(
        this.$store.state.backend + "events/accept",
        {},
        {
          params: {
            userId: this.$store.state.person.id,
            eventId: item.id
          },
          headers: headers
        }
      ).then(response => {
        if (response.status == 200) {
          this.refresh();
        } else {
          alert(response.statusText);
        }
      });
    },
    changeState(item) {
      var headers = { Authorization: this.$store.state.token };
      if (item != this.statecontroller) {
        let state = "";
        if (item == "No disponible") {
          state = "Unavailable";
          this.justificationDialog = true;
          this.justificationSelected = "";
        } else if (item == "Disponible") {
          state = "Available";
        }
        if (state != "") {
          Axios.post(
            this.$store.state.backend + "controller/state",
            {},
            {
              params: {
                id: this.$store.state.person.id,
                state: state
              },
              headers: headers
            }
          ).then(response => {
            if (response.data != "OK") {
              alert(response.data);
            }
            this.refresh();
          });
        }
      }
    },
    showState(item) {
      if (
        item == "Disponible" ||
        item == "Available" ||
        item == "Event assigned"
      ) {
        this.statecontroller = "Disponible";
        this.statecolor = "green";
      }
      if (item == "Ocupado" || item == "Busy") {
        this.statecontroller = "Ocupado";
        this.statecolor = "blue";
      }
      if (item == "No disponible" || item == "Unavailable") {
        this.statecontroller = "No disponible";
        this.statecolor = "red";
      }
    },
    loadAssignedEvents() {
      var headers = { Authorization: this.$store.state.token };
      Axios.get(this.$store.state.backend + "controller/asignedEvents", {
        params: {
          id: this.$store.state.person.id
        },
        headers: headers
      }).then(response => {
        this.assignedevents = response.data;
      });
    },
    loadActiveEvents() {
      var headers = { Authorization: this.$store.state.token };
      Axios.get(this.$store.state.backend + "controller/activeEvents", {
        params: {
          id: this.$store.state.person.id
        },
        headers: headers
      }).then(response => {
        this.acceptedevents = response.data;
      });
    },
    getControllerState() {
      var headers = { Authorization: this.$store.state.token };
      Axios.get(this.$store.state.backend + "controller/state", {
        params: {
          id: this.$store.state.person.id
        },
        headers: headers
      }).then(response => {
        this.showState(response.data);
      });
    },
    refresh() {
      this.loadAssignedEvents();
      this.loadActiveEvents();
      this.getControllerState();
    },
    eventfinished(item) {
      var headers = { Authorization: this.$store.state.token };
      let pending = 0;
      item.analysisElements.forEach(element => {
        if (!element.done) {
          pending++;
        }
      });
      item.actions.forEach(element => {
        if (!element.done) {
          pending++;
        }
      });

      // if (pending != 0) {
      //   alert("No se han completado todas las acciones sobre el evento");
      // }

      Axios.post(this.$store.state.backend + "events/complete", item, {
        params: {
          userId: this.$store.state.person.id
        },
        headers: headers
      }).then(response => {
        if (response.status == 200) {
          this.refresh();
        } else {
          alert(response.statusText);
        }
      });
      this.eventFinishedDialog = false;
    },
    sendAnalysis(item) {
      var headers = { Authorization: this.$store.state.token };
      item.timemark = new Date();
      Axios.post(this.$store.state.backend + "events/analyses", item, {
        headers: headers
      }).then(response => {
        if (response.status != 200) {
          alert(response.statusText);
        }
      });
    },
    sendAction(item) {
      var headers = { Authorization: this.$store.state.token };
      item.timemark = new Date();
      Axios.post(this.$store.state.backend + "events/actions", item, {
        headers: headers
      }).then(response => {
        if (response.status != 200) {
          alert(response.statusText);
        }
      });
    },
    connect() {
      this.socket = new SockJS(this.$store.state.backend + "ws");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
        {},
        frame => {
          window.console.log("Frame: " + frame);
          this.connected = true;
          this.stompClient.subscribe(
            "/queue/controller/" + this.$store.state.person.id,
            tick => {
              window.console.log(tick);
              if (tick.body == "refresh") {
                this.refresh();
              } else {
                this.refresh();
                if (tick.body != this.lastEvent) {
                  this.lastEvent = tick.body;
                  new Notification("AVIOM", { body: "Nuevo evento asignado" });
                }
              }
            }
          );
        },
        error => {
          window.console.log(error);
          this.connected = false;
        }
      );
    }
  },
  beforeMount() {
    this.name = this.$store.state.person.name;
    if (this.name == "") {
      this.$router.push("/");
    } else {
      this.refresh();
      this.connect();
    }
  },
  computed: {
    isJustified : function (){
      return this.justificationSelected!="";
    },
    isJustifiedEventReject: function(){
      return this.eventRejectJustification!="";
    }
  }
};
</script>