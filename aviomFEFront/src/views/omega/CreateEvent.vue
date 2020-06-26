<template>
<div class="createEventContent">
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex>
        <v-card class="px-5 py-5">
          <v-select
            outlined
            v-model="event.subcategory"
            :items="subcategories"
            item-text="name"
            item-value="id"
            label="Subcategoria"
          ></v-select>
          <v-text-field label="Descripción" type="text" outlined v-model="event.description"></v-text-field>
          <v-text-field label="Linea" type="number" outlined v-model="event.line"></v-text-field>
          <v-text-field label="bus" type="number" outlined v-model="event.bus"></v-text-field>
          <v-card-actions>
            <v-btn block @click="createEvent">Crear</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import Axios from "axios";

export default {
  data() {
    return {
      event: {
        subcategory: "",
        description: "",
        line: "",
        bus: ""
      },
      subcategories: []
    };
  },
  methods: {
    createEvent() {
      if (this.checkFieldNotEmpty() == true) {
        var headers = { Authorization: "Bearer " + this.$store.state.token };
        Axios.post(this.$store.state.backend + "/atc/events", this.event, {headers:headers})
          .then(response => {
            if (response.status != 200) {
              alert(response.statusText);
            } else {
              confirm("Evento creado satisfactoriamente");
              this.cleanFields();
            }
          })
          .catch(error => {
            window.console.log(error);
          });
      } else {
        confirm("Debes llenar todos los campos para crear un evento");
      }
    },
    checkFieldNotEmpty() {
      if (
        (this.event.subcategory != "") &
        (this.event.line != "" || this.event.bus != "")
      ) {
        return true;
      } else {
        return false;
      }
    },
    cleanFields() {
      this.event.subcategory = "";
      this.event.description = "";
      this.event.line = "";
      this.event.bus = "";
    },
    getSubcategories() {
      var headers = { Authorization: this.$store.state.token };
      Axios.get(this.$store.state.backend + "events/subcategories", {headers:headers}).then(
        response => {
          this.subcategories = response.data;
        }
      );
    }
  },
  beforeMount() {
    this.getSubcategories();
  }
};
</script>

<style >
.createEventContent{
    width: 80%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
     text-align: center;
}
</style>
