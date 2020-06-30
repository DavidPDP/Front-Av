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

    <v-snackbar v-model="expressions_info.active" :timeout="3000" :color="expressions_info.state">
      {{ expressions_info.text }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  FETCH_VARIABLES,
  UPDATE_VARIABLE,
  ADD_VARIABLE,
  SET_EXPRESSIONS_REQUEST_STATE,
  FETCH_FUNCTIONS
} from "@/store/actions.type";
import { MANAGE_EXPRESSIONS_REQUEST_ERROR } from "@/store/mutations.type";
import { ERROR, INFO, SUCCESS } from "@/common/evaluator.request.states.js";
import { ExpressionsService } from "@/common/api.service";
import splitPane from "vue-splitpane";
import Variables from "./views/Variables.vue";
import Functions from "./views/Functions.vue";
import Console from "./views/Console.vue";

const default_info = {
  active: false,
  text: "",
  state: ""
};
export default {
  data: () => ({
    rightPaneIsShowed: true,
    items: [
      { title: "Home", icon: "mdi-home-city" },
      { title: "My Account", icon: "mdi-account" },
      { title: "Users", icon: "mdi-account-group-outline" }
    ],
    functionsIsShowed: true,
    variablesIsShowed: true,
    evaluatedExpressions: [],
    localVariables: {}
  }),
  components: {
    Variables,
    Console,
    splitPane,
    Functions
  },
  computed: {
    ...mapGetters(["expressions_info"])
  },
  beforeCreate() {
    this.$store.dispatch(SET_EXPRESSIONS_REQUEST_STATE, default_info);
    this.$store.dispatch(FETCH_VARIABLES);
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

    updateVariable(variable) {
      this.$store.dispatch(UPDATE_VARIABLE, variable);
    },

    addVariable(variable) {
      this.$store.dispatch(ADD_VARIABLE, variable);
    },
    showVariableEventInfo(event) {
      let info = {
        active: true,
        state: event.state,
        text: event.text
      };
      this.$store.dispatch(SET_EXPRESSIONS_REQUEST_STATE, info);
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
      return ExpressionsService.evaluateExpression(expression);
    },
    onEvaluatedExpression(axiosResponse) {
      let expressionWrapper = axiosResponse.data;
      this.evaluatedExpressions.unshift(expressionWrapper);
    },
    onExpressionError(err) {
      if (err.response) {
        let response = err.response;
        //BAD REQUEST
        if (!response.status || response.status !== 400) {
          this.$store.commit(MANAGE_EXPRESSIONS_REQUEST_ERROR, err);
        } else if (response.status === 400) {
          this.onEvaluatedExpression(response);
        }
      } else {
        this.$store.commit(MANAGE_EXPRESSIONS_REQUEST_ERROR, err);
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
  }
};
</script>

<style scoped>
</style>