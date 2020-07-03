<template>
  <div class="userManagementContent">
    <v-data-table
      no-data-text="No hay usuarios por el momento"
      :headers="headers"
      :items="users"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:item.roles="{ item }">
        <v-chip
          :key="role.id"
          v-for="role in item.roles"
          :color="getColor()"
          dark
        >{{ role.name }}</v-chip>
      </template>

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Usuarios</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Usuario</v-btn>
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
                        v-model="editedItem.firstName"
                        :rules="nameRules"
                        label="Nombre"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.lastName"
                        :rules="lastnameRules"
                        label="Apellido"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.email"
                        :rules="emailRules"
                        label="Email"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="editedItem.accountName" label="Usuario" outlined required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-combobox
                        v-model="editedItem.roles"
                        :items="roles"
                        item-text="name"
                        label="Seleccionar roles"
                        multiple
                        outlined
                        dense
                        chips
                      ></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" v-show="editedIndex === -1">
                      <v-text-field
                        v-model="editedItem.password"
                        :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                        :rules="[rules.required, rules.min]"
                        :type="showPassword ? 'text' : 'password'"
                        name="input-10-2"
                        hint="Mínimo 8 caracteres"
                        value
                        class="input-group--focused"
                        label="Contraseña"
                        outlined
                        required
                        @click:append="showPassword = !showPassword"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" v-show="editedIndex === -1">
                      <v-text-field
                        v-model="editedItem.conPassword"
                        :append-icon="showConPassword ? 'visibility' : 'visibility_off'"
                        :rules="[rules.required, rules.samePassword]"
                        :type="showConPassword ? 'text' : 'password'"
                        name="input-10-2"
                        label="Confirmar contraseña"
                        hint="Mínimo 8 caracteres"
                        value
                        class="input-group--focused"
                        outlined
                        required
                        @click:append="showConPassword = !showConPassword"
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
import Axios from "axios";
import shajs from "sha.js";

export default {
  data() {
    return {
      dialog: false,
      headers: [
        { text: "Nombre", align: "left", sortable: false, value: "name" },
        { text: "Apellido", value: "lastName" },
        { text: "Email", value: "email" },
        { text: "Usuario", value: "accountName" },
        { text: "Roles", value: "roles" },
        { text: "Acciones", value: "action", sortable: false }
      ],
      users: [],
      roles: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        lastName: "",
        email: "",
        accountName: "",
        roles: [],
        password: "",
        conPassword: ""
      },
      defaultItem: {
        name: "",
        lastName: "",
        email: "",
        accountName: "",
        roles: []
      },
      showPassword: false,
      showConPassword: false,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        samePassword: value =>
          value === this.editedItem.password || "Las contraseñas no coinciden"
      },
      nameRules: [
        name => !!name || "El nombre es requerido",
        name =>
          name.length > 2 || "El nombre debe ser más largo a 3 caracteres"
      ],
      lastnameRules: [
        lastname => !!lastname || "El apellido es requerido",
        lastname =>
          lastname.length > 3 || "El apellido debe ser más largo a 3 caracteres"
      ],
      emailRules: [
        email => !!email || "El correo es requerido",
        email =>
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
          ) || "El correo no es valido"
      ]
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Usuario" : "Editar Usuario";
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
      this.getListOfUsers();
     // this.getRoles();
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.users.indexOf(item);
      confirm("¿Esta seguro que desea eliminar este usuario?") &&
        this.deleteUser(item) &&
        this.users.splice(index, 1);
      // location.reload();
    },
    getColor() {
      return "light-blue";
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
        Object.assign(this.users[this.editedIndex], this.editedItem);
        this.updateUser(this.editedIndex);
      } else {
        this.sendRegisterDataUser(this.editedItem);
        this.users.push(this.editedItem);
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
    async getListOfUsers() {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "/atc/operators";
      Axios.get(url, { headers: headers }).then(response => {
        console.log(response.data)
        this.users = response.data;
        
      });
    },

    async sendRegisterDataUser(user) {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "/atc/operators";
      Axios.post(
        url,
        {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          accountName: user.accountName,
          roles: user.roles,
          password: user.password
        },
        { headers: headers }
      ).then(response => {
        alert(response.data);
      });
    },

    deleteUser(user) {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "deleteUser" + "?id="+user.id;
      Axios.post(
        url,
        {},
        { headers: headers }
      ).then(response => {
        alert(response.data);
        location.reload();
      });
    },

    updateUser(index) {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "user";
      let updateUser = this.users[index];
      Axios.put(
        url,
        {
          name: updateUser.name,
          lastName: updateUser.lastName,
          email: updateUser.email,
          accountName: updateUser.accountName,
          roles: updateUser.roles,
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
.userManagementContent {
  width: 100%;
  /* margin: 2px 15px; */
  margin-top: 15px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>