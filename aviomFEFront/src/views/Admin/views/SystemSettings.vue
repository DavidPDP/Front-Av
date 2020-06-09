<template>
  <div class="systemSettingsContent">

      <v-data-table
      no-data-text="No hay parametros por el momento"
      :headers="headers"
      :items="settings"
      sort-by="key"
      class="elevation-1"
    >
    <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Parametrización de variables del sistema</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Crear parametro</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.key"
                        :rules="rules"
                        label="Nombre"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.value"
                        label="Valor"
                        :rules="rules"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.type"
                        label="Tipo"
                        :rules="rules"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="close">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
        <v-icon small @click="deleteItem(item)">delete</v-icon>
      </template>
    </v-data-table>
     
  </div>
</template>

<script>
export default {
  data(){
    return {
      settings: [
        {key: "Threshold matriz de impacto", value: "30",units:"Minutos", type: "Entero"},
        {key: "Maxima Prioridad", value: 1000, units:"N/A",type: "Entero"},
        {key: "Threshold modelos de Analítica", value: "6", units:"Días", type: "Entero"},
        {key: "Almacenar estado de la operación", value: "5",units:"Minutos", type: "Entero"},
      ],
      headers: [
        { text: "Nombre", value: "key", align: "left", sortable: true },
        { text: "Valor", value: "value", align: "left"},
        { text: "Unidades", value: "units", align: "left"},
        { text: "Tipo", value: "type", align: "left"},
        { text: "Acciones", value: "action", sortable: false },
      ],
      editedItem: {
        key: "", 
        value: "", 
        type: "",
      },
      editedIndex: -1,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 caracteres"
      },
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo servicio" : "Editar servicio";
    }
  },
  methods: {
    save(){
      this.dialog = false;
    },
    close(){
      this.dialog = false;
       setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    editItem(item){
      this.editedIndex = this.settings.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    }
  }

}
</script>

<style scoped>
.systemSettingsContent{
  width: 100%;
  margin-top: 15px;
  margin-left: 10px;
  margin-right: 10px;
}


</style>