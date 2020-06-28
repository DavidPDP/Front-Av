<template>
  <div style="width:100%;height:100%;">
    <v-flex d-flex wrap xs12 sm12 md12>
      <v-card width="100%">
        <v-card-title>
          Configuraciones del evaluador
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="parameters"
          :search="search"
          :loading="parameters.length==0"
          loading-text="Cargando información... Por favor espere"
        >
          <template v-slot:item.name="props">{{formatParameterName(props.item)}}</template>
          <template v-slot:item.enable_start="props">
            <v-chip color="primary">{{formatDate(props.item.enable_start)}}</v-chip>
          </template>
          <template v-slot:item.enable_end="props">
            <v-chip
              v-if="isCurrentlyActive(props.item.enable_end)"
              color="success"
            >{{formatDate(props.item.enable_end)}}</v-chip>
            <v-chip v-else color="red" class="white--text">{{formatDate(props.item.enable_end)}}</v-chip>
          </template>
          <template v-slot:item.value="props">
            <v-edit-dialog
              @save="save(props.item)"
              @cancel="cancel"
              @open="open(props.item)"
              @close="close"
            >
              {{ props.item.value }}
              <template v-slot:input>
                <v-text-field
                  v-if="props.item.name !== periodicityName"
                  v-model.number="defaultParameterValue"
                  :rules="[minRules]"
                  label="Edit"
                  single-line
                  counter
                ></v-text-field>
                <v-text-field
                  v-else
                  v-model.number="defaultParameterValue"
                  label="Edit"
                  single-line
                  counter
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
        </v-data-table>
        <v-snackbar v-model="info.active" :timeout="3000" :color="info.state">
          {{ info.text }}
          <v-btn text @click="info.active = false">Close</v-btn>
        </v-snackbar>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
import Axios from "axios";
import { mapGetters, mapActions } from "vuex";
import {
  FETCH_PARAMETERS,
  UPDATE_PARAMETER,
  SET_PARAMETERS_REQUEST_STATE
} from "@/store/actions.type";
import { ERROR, INFO, SUCCESS } from "@/common/evaluator.request.states.js";

export default {
  name: "parametersView",
  computed: {
    ...mapGetters(["parameters", "info"])
  },
  beforeMount() {
    this.$store.dispatch(FETCH_PARAMETERS, true);
  },
  data() {
    return {
      periodicityName: "PERIODICIDAD",
      defaultParameterValue: 0,
      search: "",
      minRules: v =>
        (!!v && parseInt(v) > 0) || "Input too small!" + parseInt(v),
      headers: [
        {
          text: "Parámetro",
          align: "start",
          value: "name"
        },
        { text: "Valor", align: "center", value: "value" },
        { text: "Activo desde", align: "center", value: "enable_start" },
        { text: "Activo hasta", align: "center", value: "enable_end" }
      ]
    };
  },
  methods: {
    save(item) {
      let infoState = {
        active:false,
        state:"",
        text:"",
      };
      if (
        this.defaultParameterValue > 0 ||
        item.name === this.periodicityName
      ) {
        if (item.value !== this.defaultParameterValue) {
          this.updateParameter(item, this.defaultParameterValue);
        } else {
          infoState.state = SUCCESS;
          infoState.text = "El valor del parámetro no cambió";
        }
      } else {
        infoState.state = ERROR;
        infoState.text = "El valor del parámetro debe ser mayor a 0";
      }
      infoState.active = true;
      this.$store.dispatch(SET_PARAMETERS_REQUEST_STATE, infoState);
      this.defaultParameterValue = 0;
    },
    cancel() {
      this.defaultParameterValue = 0;
      let infoState = { active: true, state: ERROR, text: "Cancelado" };
      this.$store.dispatch(SET_PARAMETERS_REQUEST_STATE, infoState);
    },
    open(item) {
      this.defaultParameterValue = item.value;
      let infoState = { active: true, state: INFO, text: "Cambiando valor" };
      this.$store.dispatch(SET_PARAMETERS_REQUEST_STATE, infoState);
    },
    close() {
      this.defaultParameterValue = 0;
    },
    formatParameterName(item) {
      //if string contains digits
      let regx = item.name.match(/\d+/);
      let name = item.name;
      let formattedName = name;
      if (regx) {
        let digitIndex = item.name.indexOf(regx);
        formattedName =
          name.substring(0, digitIndex) +
          "-" +
          name.substring(digitIndex, item.name.length);
      }
      return formattedName;
    },
    isCurrentlyActive(dateStr) {
      return !dateStr;
    },
    formatDate(dateStr) {
      let formattedDate = "Actualmente activo";
      if (dateStr) {
        let date = new Date(dateStr);
        formattedDate = date.toLocaleString();
      }
      return formattedDate;
    },
    updateParameter(parameter, value) {
      let newParameter = {
        name: parameter.name,
        value: value
      };

      this.$store.dispatch(UPDATE_PARAMETER, newParameter);
    }
  }
};
</script>

<style>
</style>