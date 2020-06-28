<template>
  <div>
    <v-card width="100%" height>
      <v-fab-transition>
        <v-btn
          color="pink"
          fab
          dark
          small
          absolute
          bottom
          right
          v-if="variablesInfo.length>0"
          @click="variableDialog = !variableDialog"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
      <v-card-title>
        Variables del sistema
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
        :loading="variablesInfo.length==0"
        loading-text="Cargand información... Por favor espere"
        :height="height"
        :headers="headers"
        :items="variablesInfo"
        :search="search"
      >
        <!-- Description template -->
        <!-- Template for description -->
        <template v-slot:item.description="props">
          <v-menu
            :close-on-click="true"
            :close-on-content-click="false"
            bottom
            right
            class="mb-1"
            transition="scale-transition"
            origin="top left"
          >
            <template v-slot:activator="{ on }">
              <v-chip color="secondary" class="mb-1" text-color="white" pill v-on="on">Descripción</v-chip>
            </template>
            <v-card width="350px">
              <v-list color="secondary">
                <v-list-item>
                  <v-list-item-content class="white--text">
                    <v-textarea
                      dark
                      rounded
                      no-resize
                      readonly
                      full-width
                      row-height="25"
                      :value="props.item.description"
                    ></v-textarea>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </template>

        <!-- Formula expression template -->
        <template v-slot:item.formula_expression="props">
          <v-menu
            :close-on-click="true"
            :close-on-content-click="false"
            bottom
            right
            class="mb-1"
            transition="scale-transition"
            origin="top left"
          >
            <template v-slot:activator="{ on }">
              <v-chip color="primary" class="mb-1" text-color="white" pill v-on="on">Expresión</v-chip>
            </template>
            <v-card width="350px">
              <v-list color="primary" dark class="overflow-y-auto">
                <v-list-item>
                  <v-textarea
                    dark
                    rounded
                    no-resize
                    rows="1"
                    readonly
                    full-width
                    row-height="25"
                    :value="props.item.formula_expression"
                  ></v-textarea>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </template>
        <!-- Type template -->
        <template v-slot:item.is_kpi="props">
          <v-checkbox
            v-model="props.item.is_kpi"
            readonly
            label="KPI"
            color="success"
          ></v-checkbox>
        </template>
        <!-- Actions template -->
        <template v-slot:item.actions="{item}">
          <div v-if="item.classification!==system_var_classification">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          </div>
        </template>
      </v-data-table>
      <v-dialog v-model="variableDialog" persistent max-width="500px">
        <v-card>
          <v-card-title v-if="!editMode">Creación de variable</v-card-title>
          <v-card-title v-else>Editar variable</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="validVariable">
              <v-text-field
                label="Nombre de la variable"
                v-model="toAddVariable.name"
                :rules="noEmptyRules"
                :clearable="!editMode"
                :readonly="editMode"
                clear-icon="cancel"
                required
              ></v-text-field>
              <v-text-field
                label="Clasificación"
                v-model="toAddVariable.classification"
                :rules="noEmptyRules"
                clearable
                clear-icon="cancel"
                required
              ></v-text-field>
              <v-textarea
                append-icon="comment"
                class="mx-2"
                placeholder="descripción"
                v-model="toAddVariable.description"
                :rules="noEmptyRules"
                clearable
                clear-icon="cancel"
                required
              ></v-textarea>
              <v-textarea
                append-icon="mdi-variable"
                class="mx-2"
                placeholder="expresión"
                v-model="toAddVariable.formula_expression"
                :rules="noEmptyRules"
                clearable
                clear-icon="cancel"
                required
                :value="transformExpression(toAddVariable.formula_expression)"
              ></v-textarea>

              <v-checkbox
                v-model="toAddVariable.is_kpi"
                color="success"
                label="Agregar al cálculo programado (es KPI)."
              ></v-checkbox>
            </v-form>
            <small class="grey--text">* Este dialogo es usado cuando se va a crear una variable.</small>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="red" @click="cancel">Cancelar</v-btn>
            <v-btn text color="primary" @click="addOrUpdateVariable">Agregar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const SYSTEM_VAR_CLASSIFICATION="Variable del sistema";
const addVariableEvent = "addVariable";
const variableEventInfo = "showVariableEventInfo";
const updateVariableEvent = "updateVariable";
const replaceDoubleQuotes = /"/g;
const replaceWhiteSpaces = /\s/g;
export default {
  name: "variables",
  props: {
    height: String,
  },
  computed:{
    ...mapGetters(["variablesInfo"]),
  },
  data() {
    return {
      system_var_classification:SYSTEM_VAR_CLASSIFICATION,
      variableDialog: false,
      variableDialogEvent: addVariableEvent,
      search: "",
      validVariable: false,
      editMode: false,
      noEmptyRules: [v => (!!v && v.length > 0) || "Value is required"],
      toAddVariable: {
        name: "",
        description: "",
        classification: "",
        formula_expression: "",
        is_kpi: false
      },
      headers: [
        {
          text: "Variable",
          align: "start",
          value: "name",
          filterable: true
        },
        { text: "Clasificación", value: "classification", filterable: false },
        { text: "Descripción", value: "description", filterable: false },
        { text: "Expresión", value: "formula_expression", filterable: false },
        { text: "Tipo", value: "is_kpi", filterable: false },
        { text: "Actions", value: "actions", sortable: false }
      ]
    };
  },
  methods: {
    addOrUpdateVariable() {
      this.$refs.form.validate();
      if (this.validVariable) {
        this.variableDialog = false;
        this.$emit(this.variableDialogEvent, this.toAddVariable);
        this.cancel();
      } else {
        this.$emit(variableEventInfo, {
          snackColor: "error",
          message: "Algunos campos son necesarios"
        });
      }
    },
    transformExpression(expression) {
      let transformed = expression
        .toString()
        .replace(replaceDoubleQuotes, "'")
        .replace(replaceWhiteSpaces, "");
      this.toAddVariable.formulaExpression = transformed;
      return transformed;
    },
    editItem(item) {
      this.toAddVariable = Object.assign({}, item);
      this.variableDialogEvent = updateVariableEvent;
      this.editMode = true;
      this.variableDialog = true;
    },
    cancel() {
      this.variableDialogEvent = addVariableEvent;
      this.editMode = false;
      this.toAddVariable = {
        name: "",
        description: "",
        classification: "",
        formula_expression: "",
        is_kpi: false
      };
      this.variableDialog = false;
    }
  }
};
</script>

<style>
</style>