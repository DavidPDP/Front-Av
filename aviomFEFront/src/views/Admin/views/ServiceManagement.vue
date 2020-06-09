<template>
  <div class="serviceManagementContent">
    <v-data-table
      no-data-text="No hay servicios por el momento"
      :headers="headers"
      :items="services"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:item.uri="{ item }">
        <v-chip :color="getColor()" dark>{{ item.uri }}</v-chip>
      </template>

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Servicios</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Crear servicio</v-btn>
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
                        v-model="editedItem.name"
                        :rules="nameRules"
                        label="Nombre"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.protocol"
                        label="Protocolo"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      Interno
                      <v-chip-group mandatory active-class="primary--text">
                        <v-chip v-for="tag in isInternal" :key="tag">{{ tag }}</v-chip>
                      </v-chip-group>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="editedItem.uri" label="Uri" outlined required></v-text-field>
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
      </template> -->
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
        <v-icon small @click="deleteItem(item)">delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  data() {
    return {
      services: [
        {
          id: 1,
          name: "service1",
          protocol: "https",
          isInternar: true,
          uri: "/service1/"
        },
        {
          id: 2,
          name: "service2",
          protocol: "https",
          isInternar: true,
          uri: "/service1/"
        },
        {
          id: 3,
          name: "service3",
          protocol: "https",
          isInternar: true,
          uri: "/service1/"
        },
        {
          id: 4,
          name: "service4",
          protocol: "https",
          isInternar: true,
          uri: "/service1/"
        },
        {
          id: 5,
          name: "service5",
          protocol: "https",
          isInternar: true,
          uri: "/service1/"
        },
        {
          id: 6,
          name: "service6",
          protocol: "https",
          isInternar: true,
          uri: "/service1/"
        }
      ],
      headers: [
        { text: "Nombre", value: "name", align: "left", sortable: true },
        { text: "Protocolo", value: "protocol" },
        { text: "Interno", value: "isInternal" },
        { text: "Uri", value: "uri" },
        { text: "Acciones", value: "action", sortable: false }
      ],
      isInternal: [true, false],
      dialog: false,
      editedIndex: -1,
      editedItem: {
        name: "",
        protocol: "",
        isInternal: null,
        uri: ""
      },
      defaultItem: {
        name: "",
        protocol: "",
        isInternal: null,
        uri: ""
      },
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 caracteres"
      },
      nameRules: [
        name => !!name || "El nombre es requerido",
        name => name.length > 2 || "El nombre debe ser más largo a 3 caracteres"
      ]
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Parametro" : "Editar Parametro";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    getColor() {
      return "red";
    },
    initialize() {
      this.getListOfServices();
    },

    editItem(item) {
      this.editedIndex = this.services.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.services.indexOf(item);
      confirm("¿Esta seguro que desea eliminar este servicio?") &&
        this.deleteService(item) &&
        this.services.splice(index, 1);
      // location.reload();
    },

    close() {
      this.dialog = false;
      this.showPassword = false;
      this.showPassword = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.services[this.editedIndex], this.editedItem);
        this.updateService(this.editedIndex);
      } else {
        this.sendRegisterDataService(this.editedItem);
        this.services.push(this.editedItem);
      }
      this.close();
      location.reload();
    },
    async getListOfServices() {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "services";
      Axios.get(url, { headers: headers }).then(response => {
        this.services = response.data;
      });
    },

    async sendRegisterDataService(service) {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "service";
      Axios.post(
        url,
        {
          name: service.name,
          protocol: service.protocol,
          isInternal: service.isInternal,
          uri: service.uri
        },
        { headers: headers }
      ).then(response => {
        alert(response.data);
      });
    },

    deleteService(service) {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "service" + "?id=" + service.id;
      Axios.post(url, {}, { headers: headers }).then(response => {
        alert(response.data);
        location.reload();
      });
    },

    updateService(index) {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "service";
      let updateUser = this.services[index];
      Axios.put(
        url,
        {
          name: service.name,
          protocol: service.protocol,
          isInternal: service.isInternal,
          uri: service.uri
        },
        { headers: headers }
      ).then(response => {
        alert(response.data);
        location.reload();
      });
    }
  }
};
</script>
<style>
.serviceManagementContent {
  width: 100%;
  margin-top: 15px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
};
