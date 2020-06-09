<template>
  <div class="rolesManagementContent">
    <v-data-table
      no-data-text="No hay roles por el momento"
      :headers="headers"
      :items="roles"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:item.services="{ item }">
        <v-chip
          :key="service.id"
          v-for="service in item.services"
          :color="getColor()"
          dark
        >{{ service.name }}</v-chip>
      </template>

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Roles</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Rol</v-btn>
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
                      <v-combobox
                        v-model="editedItem.services"
                        :items="services"
                        item-text="name"
                        label="Seleccionar servicios"
                        multiple
                        outlined
                        dense
                        chips
                      ></v-combobox>
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
import Axios from "axios";

export default {
    data(){
        return{
             dialog: false,
            headers: [
                { text: "Nombre", align: "left", sortable: false, value: "name" },
                { text: "Servicios", value: "services" },
                { text: "Acciones", value: "action", sortable: false }
            ],
            roles: [],
            services: [],
            editedIndex: -1,
            editedItem: {
                name: "",
                services: [],
            },
            defaultItem: {
                name: "",
                services: [],
         },
         rules: {
            required: value => !!value || "Required.",
            min: v => v.length >= 8 || "Min 8 characters",
        
            },
        nameRules: [
            name => !!name || "El nombre es requerido",
            name => name.length > 2 || "El nombre debe ser más largo a 3 caracteres"
        ],
        }
    },

    computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Rol" : "Editar Rol";
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
    initialize() {
      this.getServices();
      this.getRoles();
    },

    editItem(item) {
      this.editedIndex = this.roles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.roles.indexOf(item);
      confirm("¿Esta seguro que desea eliminar este rol?") &&
        this.deleteRole(item) &&
        this.roles.splice(index, 1);
      // location.reload();
    },
    getColor() {
      return "light-blue";
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem);
        this.updateRole(this.editedIndex);
      } else {
        this.sendRole(this.editedItem);
        this.roles.push(this.editedItem);
      }
      this.close();
      location.reload();
    },
    async getRoles() {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "roles";
      Axios.get(url, { headers: headers }).then(response => {
        this.roles = response.data;
      });
    },
    async getServices() {
      var headers = { Authorization: this.$store.state.token };
      
    },

    async sendRole(role) {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "";
      Axios.post(
        url,
        {
          name: role.name,
          lastName: user.lastName,
          roles: role.services,
        },
        { headers: headers }
      ).then(response => {
        alert(response.data);
      });
    },

    deleteRole(role) {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "" + "?id="+role.id;
      Axios.post(
        url,
        {},
        { headers: headers }
      ).then(response => {
        alert(response.data);
        location.reload();
      });
    },

    updateRole(index) {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "";
      let updateRole = this.roles[index];
      Axios.put(
        url,
        {
          id: updateRole.id,
          name: updateRole.name,
          services: updateRole.services
        },
        { headers: headers }
      ).then(response => {
        alert(response.data);
        location.reload();
      });
    }
  }

}
</script>

<style>
.rolesManagementContent {
  width: 100%;
  /* margin: 2px 15px; */
  margin-top: 15px;
  margin-left: 10px;
  margin-right: 10px;
}

</style>