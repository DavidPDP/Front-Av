<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex class="px-12">
        <v-btn text block disabled>
          <v-icon>home</v-icon>
        </v-btn>
        <v-text-field
          prepend-icon="person"
          label="Usuario"
          type="text"
          :rules="[rules.required]"
          required
          v-model="name"
        ></v-text-field>
        <v-text-field
          prepend-icon="lock"
          label="Contraseña"
          :append-icon="show1 ? 'visibility' : 'visibility_off'"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          @click:append="show1 = !show1"
          required
          v-model="password"
        ></v-text-field>
        <v-combobox 
        v-model="select" 
        :items="roles" 
        label="Seleccione el rol" 
        multiple 
        chips
        >
        </v-combobox>
        <v-btn class="mt-5" block @click="submit">Iniciar sesión</v-btn>
        <v-btn class="mt-5" text block>¿Olvidaste tu contraseña?</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Axios from "axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      name: "",
      password: "",
      select: "",
      roles: ["Controller", "Omega"],
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 2 || "Min 8 characters",
        emailMatch: () => "The email and password you entered don't match"
      },
      show1: false
    };
  },
  methods: {
    ...mapActions([
      "setAccountName",
      "setPersonName",
      "setToken",
      "setCurrentRol"
    ]),
    submit() {
      if (
        (this.name != "") &
        (this.password != "") &
        (this.name != null) &
        (this.password != null)
      ) {
        Axios.post(this.$store.state.backend+"/atc/sign_in/" + this.select, {
          accountName: this.name,
          password: this.password
        }
        ).then(response => {
          console.log(response.data)

          this.setToken(response.data.token);
          this.setCurrentRol(this.select);
          this.setPersonName(response.data.user.name);
          this.setAccountName(response.data.user.accountName); 

          let rol = this.select;

          if (rol == "Controller") {
            this.$router.push("/controller");
          } else if (rol == "Omega") {
            this.$router.push("/omega");
          } else {
            this.$router.push("adminPane");
          }
        });
      }
    }
  }
};
</script>
