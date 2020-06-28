<template>
  <div style="width:100%;height:100%">
    <div class="text-center">
      <v-chip
        class="ma-2"
        color="red"
        :close="variablesIsShowed"
        text-color="white"
        @click="showVariables(!variablesIsShowed)"
      >Variables</v-chip>
      <v-chip
        class="ma-2"
        color="primary"
        :close="functionsIsShowed"
        text-color="white"
        @click="showFunctions(!functionsIsShowed)"
      >Funciones</v-chip>
    </div>

    <div style="width:100%;height:100%">
      <splitPane :min-percent="20" :default-percent="rightPaneIsShowed? 50: 100" split="vertical">
        <template slot="paneL">
          <div v-bind:style="{widht:'100%',height:$vuetify.breakpoint.height+'px'}">
            <Console
              :height="$vuetify.breakpoint.height"
              :evaluatedExpressions="evaluatedExpressions"
              :localVariables="localVariables"
              @createLocalVariable="createLocalVariable($event)"
              @evaluateExpression="evaluateExpression($event)"
              @clearExpressions="evaluatedExpressions=[]"
            ></Console>
          </div>
        </template>
        <template slot="paneR" v-if="rightPaneIsShowed">
          <div style="widht:100%; height:100%">
            <Variables
              class="mb-2"
              v-show="variablesIsShowed"
              :variablesInfo="variablesInfo"
              @updateVariable="updateVariable($event)"
              @addVariable="addVariable($event)"
              @showVariableEventInfo="showVariableEventInfo($event)"
              :height="variablesIsShowed && !functionsIsShowed?$vuetify.breakpoint.height+'px':($vuetify.breakpoint.height/2).toFixed(0)+'px'"
            ></Variables>

            <Functions
              v-show="functionsIsShowed"
              :height="functionsIsShowed&&!variablesIsShowed?$vuetify.breakpoint.height+'px':($vuetify.breakpoint.height/3).toFixed(0)+'px'"
            ></Functions>
          </div>
        </template>
      </splitPane>
    </div>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  FETCH_VARIABLES,
  UPDATE_VARIABLE,
  SET_EXPRESSIONS_REQUEST_STATE,
  FETCH_FUNCTIONS
} from "@/store/actions.type";
import { ERROR, INFO, SUCCESS } from "@/common/evaluator.request.states.js";
import splitPane from "vue-splitpane";
import Variables from "./views/Variables.vue";
import Functions from "./views/Functions.vue";
import Console from "./views/Console.vue";
import Axios from "axios";

const expressions_url = "evaluator/evaluateExpression";
const variables_url = "evaluator/variables";
const functions_url = "evaluator/functions";

export default {
  data: () => ({
    loading: false,
    snack: false,
    snackColor: "",
    snackText: "",
    rightPaneIsShowed: true,
    items: [
      { title: "Home", icon: "mdi-home-city" },
      { title: "My Account", icon: "mdi-account" },
      { title: "Users", icon: "mdi-account-group-outline" }
    ],
    drawer: null,
    functionsIsShowed: true,
    variablesIsShowed: true,
    functionsInfo: [],
    variablesInfo: [],
    evaluatedExpressions: [],
    localVariables: {}
  }),
  components: {
    Variables,
    Console,
    splitPane,
    Functions
  },
  beforeMount(){
    this.$store.dispatch(FETCH_FUNCTIONS);
  },
  methods: {
    showRightPane(value) {
      this.rightPaneIsShowed = value;
    },
    showVariables(value) {
      this.variablesIsShowed = value;
      if (!this.functionsIsShowed) {
        this.showRightPane(value);
      }
    },
    showFunctions(value) {
      this.functionsIsShowed = value;
      if (!this.variablesIsShowed) {
        this.showRightPane(value);
      }
    },
    getFunctionsInfo() {
      let url = this.$store.state.backend + functions_url;
      Axios.get(url, { headers: this.requestParams.headers })
        .then(response => {
          this.onGetFunctionsInfo(response);
        })
        .catch(err => {
          this.onError(err);
        });
    },
    onGetFunctionsInfo(axiosResponse) {
      this.functionsInfo = axiosResponse.data;
    },
    getVariablesInfo() {
      let url = this.$store.state.backend + variables_url;
      Axios.get(url, { headers: this.requestParams.headers })
        .then(response => {
          this.onGetVariablesInfo(response);
        })
        .catch(err => {
          this.onError(err);
        });
    },
    onGetVariablesInfo(axiosResponse) {
      let data = axiosResponse.data;
      this.variablesInfo = data;
    },
    onError(error) {
      let errorResponse = !error.response ? error : error.response;
      let errorData = !errorResponse.data
        ? { message: "" }
        : errorResponse.data;

      let message = errorData.message;
      let status = !errorResponse.status ? errorResponse : errorResponse.status;
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Error: HTTP" + status + " " + message;
    },
    updateVariable(variable) {
      let url = this.$store.state.backend + variables_url + "/" + variable.name;
      Axios.put(url, variable, { headers: this.requestParams.headers })
        .then(response => {
          this.onUpdateVariable(response);
        })
        .catch(err => {
          this.onError(err);
        });
    },
    onUpdateVariable(axiosResponse) {
      let variable = axiosResponse.data;
      let found = false;
      let index = -1;
      for (let i = 0; i < this.variablesInfo.length && !found; i++) {
        if (this.variablesInfo[i].name === variable.name) {
          index = i;
          found = true;
        }
      }

      this.$set(this.variablesInfo, index, variable);
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "variable actualizada";
    },
    addVariable(variable) {
      let url = this.$store.state.backend + variables_url;
      Axios.post(url, variable, { headers: this.requestParams.headers })
        .then(response => {
          this.onAddVariable(response);
        })
        .catch(err => {
          this.onError(err);
        });
    },
    showVariableEventInfo(event) {
      this.snack = true;
      this.snackColor = event.snackColor;
      this.snackText = event.message;
    },
    onAddVariable(axiosResponse) {
      this.variablesInfo.push(axiosResponse.data);
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "variable agregada";
    },
    evaluateExpression(expression) {
      this.fetchEvaluatedExpression(expression)
        .then(response => {
          this.onEvaluatedExpression(response);
        })
        .catch(err => {
          this.onExpressionError(err);
        });
    },
    fetchEvaluatedExpression(expression) {
      let url = this.$store.state.backend + expressions_url;
      return Axios.post(
        url,
        { expression: expression },
        {
          headers: this.requestParams.headers
        }
      );
    },
    onEvaluatedExpression(axiosResponse) {
      let expressionWrapper = axiosResponse.data;
      this.evaluatedExpressions.unshift(expressionWrapper);
    },
    onExpressionError(err) {
      if (err.response) {
        let response = err.response;
        //BAD REQUEST
        if (!response.status) {
          this.onError(error);
        } else if (response.status === 400) {
          this.onEvaluatedExpression(response);
        } else {
          this.onError(err);
        }
      } else {
        this.onError(err);
      }
    },
    createLocalVariable(event) {
      let expression = event.expression;
      this.fetchEvaluatedExpression(expression)
        .then(response => {
          this.onCreateLocalVariable(response, event);
        })
        .catch(err => {
          this.onExpressionError(err);
        });
    },
    onCreateLocalVariable(axiosResponse, event) {
      let data = axiosResponse.data;
      this.localVariables[event.name] = event.expression;
      let expressionWrapper = data;
      expressionWrapper.expression = event.name;
      this.evaluatedExpressions.unshift(expressionWrapper);
    }
  },
};
</script>

<style scoped>
</style>