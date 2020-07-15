<template>
 <div class="loginContent">
  <v-container >
   <v-row class="mx-2" justify="center">
     <v-col xs="10" sm="10" md="5" lg="5" xl="5">
       <v-card class="mx-auto"  max-width="500" elevation-24 style="border-radius:10px;">

        <v-img
          src="../img/logo.jpg"
          height="250px"
        ></v-img>
        <br>
        <v-avatar color="primary">
            <v-icon dark>home</v-icon>
        </v-avatar>

        <div style="padding: 20px;">
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
        prepend-icon="supervisor_account"
        v-model="select" 
        :items="roles" 
        label="Seleccione el rol" 
        chips
        >
        </v-combobox>
        <v-btn class="mt-5" block @click="submit" color="primary" style="border-radius:15px;">Iniciar sesión</v-btn>
        <v-btn class="mt-5" text block>¿Olvidaste tu contraseña?</v-btn>
        </div>
        </v-card>

     </v-col>

   </v-row>
  </v-container>
</div>
</template>

<script>
import Axios from "axios";
import { mapActions } from "vuex";
import NotificationManager from "@/common/notification.service.js";
import JwtService from "@/common/token.service";

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

          JwtService.saveToken(response.data.token);
          this.setToken(response.data.token);
          this.setCurrentRol(this.select);
          this.setPersonName(response.data.user.name);
          this.setAccountName(response.data.user.accountName); 

          let rol = "Omega";

          if (rol == "Controller") {
            NotificationManager.run("/queue/" + response.data.channel);
            this.$router.push("/controller");
          } else if (rol == "Omega") {
            NotificationManager.run("/topic/omegas");
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


<style scoped>

.loginContent{
  background-image: url("../img/fondo.jpg");
 background-color: rgba(243, 243, 243, 0.4);
  background-blend-mode: color;
  background-size: cover;
  min-height: 100vh;
  height:auto;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>