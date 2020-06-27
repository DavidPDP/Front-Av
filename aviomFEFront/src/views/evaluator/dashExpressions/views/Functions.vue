<template>
  <div>
    <v-card width="100%" height>
      <v-card-title>
        Funciones del sistema
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
        :loading="functionsInfo.length==0"
        loading-text="Cargand información... Por favor espere"
        :height="height"
        :headers="headers"
        :items="functionsInfo"
        :search="search"
      >
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
              <v-list color="secondary" dark>
                <v-list-item>
                  <v-list-item-content>
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
        <!-- Template for parameters -->
        <template v-slot:item.parameters="props">
          <v-menu
            v-bind:key="i"
            v-for="(parameter,i) in props.item.parameters"
            bottom
            right
            class="mb-1"
            transition="scale-transition"
            origin="top left"
          >
            <template v-slot:activator="{ on }">
              <v-chip
                pill
                v-on="on"
                color="primary"
                class="mb-1"
                text-color="white"
              >{{formatType(parameter.type)}}</v-chip>
            </template>
            <v-card>
              <v-list color="primary">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="white--text">{{parameter.name}}</v-list-item-title>
                    <v-list-item-subtitle class="gray--text">{{parameter.type}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </template>

        <!-- Template for return -->
        <template v-slot:item.return_type="props">
          <v-menu bottom right class="mb-1" transition="scale-transition" origin="top left">
            <template v-slot:activator="{ on }">
              <v-chip
                color="red"
                class="mb-1"
                text-color="white"
                pill
                v-on="on"
              >{{formatType(props.item.return_type)}}</v-chip>
            </template>
            <v-card>
              <v-list color="red">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle class="white--text">{{props.item.return_type}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </template>

        <!-- Template for extras -->
        <template v-slot:item.extra="props">
          <v-menu
            :close-on-click="true"
            :close-on-content-click="false"
            v-bind:key="i"
            v-for="(extra,i) in props.item.extra"
            bottom
            right
            class="mb-1"
            transition="scale-transition"
            origin="top left"
          >
            <template v-slot:activator="{ on }">
              <v-chip color="blue-grey darken-1" pill v-on="on" text-color="white">{{extra.first}}</v-chip>
            </template>
            <div class="blue-grey darken1 white--text">
              <span >{{extra.second}}</span>
            </div>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "functions",
  props: {
    height: String,
    functionsInfo: Array
  },
  data() {
    return {
      dialog: false,
      search: "",
      headers: [
        {
          text: "Función",
          value: "name",
          align: "start"
        },
        { text: "Descripción", value: "description" },
        { text: "Parámetros", value: "parameters" },
        { text: "Retorno", value: "return_type" },
        { text: "Otros", value: "extra" }
      ]
    };
  },
  methods: {
    formatType(type) {
      let typePath = type.split(".");

      let formattedType = typePath[typePath.length - 1];

      return formattedType;
    }
  }
};
</script>

<style>
</style>