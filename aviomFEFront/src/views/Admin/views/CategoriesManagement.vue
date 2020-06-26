<template>
   <div class="categoriesManagementContent">
    <v-data-table
      no-data-text="No hay categorias por el momento"
      :headers="headers"
      :items="categories"
      sort-by="name"
      class="elevation-1"
    >
     <template v-slot:item.base_priority="{ item }">
      <v-chip :color="getColor(item.base_priority)" dark>{{ item.base_priority }}</v-chip>
    </template>

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Categorías</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          
          <v-dialog v-model="categoryDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Nueva Categoría</v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ categoryFormTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="save">Guardar</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>Detalles Categoría</v-subheader>
          <v-list-item>
            
            <v-container>
                  <v-row>
                    
                     <v-col cols="12" sm="6" md="6">
                      <v-combobox
                        v-model="editedItem.category"
                        :items="parentCategories"
                        label="Categoría Padre"
                        outlined
                        required
                      ></v-combobox>
                    </v-col>    

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.base_priority"
                        label="Prioridad"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>   

                     
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nombre"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>

                  </v-row>
                </v-container>

            
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
       
        <v-list three-line subheader>
          <v-subheader>Protocolos categoría</v-subheader>
         <div class="protocolsManagement">
          <v-card>
                    <v-row
                      class="pa-4"
                      justify="space-between"
                    >
                      <v-col cols="5">
                        <v-treeview
                          :active.sync="active"
                          :items="items"
                          :open.sync="open"
                          item-text="stepOrder"
                          activatable
                          color="warning"
                          open-on-click
                          transition
                        >
                          <template v-slot:prepend="{ item, active }">
                            <v-icon v-if="!item.children">mdi-account</v-icon>
                          </template>
                        </v-treeview>

                          <div class="text-center" >
                            <v-btn class="ma-2" outlined color="primary" @click="protocolDialog = true" >Añadir protocolo</v-btn>
                          </div>
                      </v-col>

                      <v-divider vertical></v-divider>

                      <v-col
                        class="d-flex text-center"
                      >
                        <v-scroll-y-transition mode="out-in">
                          <div
                            v-if="!selected"
                            class="title grey--text text--lighten-1 font-weight-light"
                            style="align-self: center;"
                          >
                            Seleccione un protocolo
                          </div>
                          
                          <v-card
                            v-else
                            :key="selected.id"
                            class="pt-6 mx-auto"
                            flat
                            max-width="400"
                          >
                            <v-card-text>
                              <div class = "protocolContent">
                              <h3 class="headline mb-2">
                                {{ selected.stepOrder }}
                              </h3>
                              <v-btn icon color="primary"  @click="protocolDialog = true" > <v-icon>create</v-icon> </v-btn>
                              <v-btn icon color="red"      @click="deleteProtocol"> <v-icon>delete</v-icon> </v-btn>
                              </div>

                            </v-card-text>
                            <v-divider></v-divider>
                            
                              <div class="text-right mr-4 mb-2" tag="strong">
                                Descripcion : {{selected.step.description}}
                              </div>

                              <div class="text-right mr-4 mb-2" tag="strong">
                                Tipo : {{selected.step.stepType.name}}
                              </div>
                          
                          
                          </v-card>
                      
                        </v-scroll-y-transition>
                      </v-col>
                    </v-row>
                 </v-card>
              </div>
        </v-list>
        

      </v-card>
    </v-dialog>

    <v-dialog 
      v-model="protocolDialog" 
      max-width="500px"
      >
            <v-card>
              <v-card-title>
                <span class="headline">{{ protocolFormTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="protocol.stepOrder"
                        label="Orden del paso"
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                 <v-divider></v-divider>
                  <h3>Paso</h3>
                 <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-combobox
                        v-model="protocol.step.stepType.name"
                        label="Tipo de paso"
                        outlined
                        required
                      ></v-combobox>
                      </v-col>

                      <v-col cols="12" sm="12" md="12">
                    
                      <v-textarea
                          v-model="protocol.step.description"
                        label="Descripción"
                          auto-grow
                          outlined
                          required
                          rows="1"
                        ></v-textarea>

                    </v-col>

                 </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="protocolDialog = false">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="saveProtocol">Guardar</v-btn>
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
            categoryDialog: false,
            protocolDialog: false,
            headers: [
              { text: "Nombre", align: "left", sortable: false, value: "name" },
              { text: "Prioridad", value: "base_priority" },
              { text: "Categoría", value: "category.name" },
              { text: "Protocolos", value: "protocols" },
              { text: "Acciones", value: "action", sortable: false }
            ],
            categories: [ {
        id: 1,
        name: "Pánico",
        category: {
            id: 2,
            name: "Emergencia",
            category: null,
            protocols: [],
            base_priority: null
        },
        protocols: [
            {
                id: 67,
                stepOrder: 1,
                step: {
                    id: 49,
                    description: "Informar vía IP y chat a UTR&T, SSFCI, personal en vía y COT.",
                    stepType: {
                        id: 2,
                        name: "Actions"
                    }
                }
            },
            {
                id: 68,
                stepOrder: 2,
                step: {
                    id: 50,
                    description: "Registrar en bitácora",
                    stepType: {
                        id: 2,
                        name: "Actions"
                    }
                }
            },
            {
                id: 69,
                stepOrder: 3,
                step: {
                    id: 51,
                    description: "Hacer seguimiento hasta establecer la continuidad del vehículo",
                    stepType: {
                        id: 2,
                        name: "Actions"
                    }
                }
            }
        ],
        base_priority: 1000
    },],
            editedIndex: -1,
              editedItem: {
                name: "",
                category: {},
                base_priority: "",
                protocols: [],
              },
              defaultItem: {
                name: "",
                category: {},
                base_priority: "",
                protocols: []
              },

              protocol:{
                id:'',
                stepOrder:"",
                step:{
                  description:"",
                  stepType:{
                    name:"",
                  },
                }
              },

           active: [],
           open: [],
        }
    },
    computed: {
    categoryFormTitle() {
      return this.editedIndex === -1 ? "Nueva Categoría" : "Editar Categoría";
    },

    protocolFormTitle() {
      return !this.active.length ? "Nuevo Protocolo" : "Editar Protocolo";
    },
    
    parentCategories(){
      let parentCategories = this.categories;
      parentCategories = parentCategories.filter(category => category.category === null)
      return parentCategories;
    },

     items () {
        return [
          {
            stepOrder: 'Protocolos',
            children: this.editedItem.protocols,
          },
        ]
      },
      selected () {
  
        if (!this.active.length) return undefined
        const id = this.active[0]
        this.protocol = this.editedItem.protocols.find(item => item.id == id);
        return this.protocol;
      },

  },
    watch: {
    dialog(val) {
      val || this.close();
    }
  },
   created() {
    //this.initialize();
  },
   methods:{

      initialize() {
      this.getCategories();
      
    },

     getColor(priority) {
      if (priority > 800) return "red";
      else if (priority > 400) return "orange";
      else return "green";
    },

    close() {
      this.categoryDialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },


   editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.categoryDialog = true;
    },

    deleteItem(item) {
      const index = this.categories.indexOf(item);
      confirm("¿Esta seguro que desea eliminar esta categoria?") &&
        this.deleteCategory(item) &&
        this.categories.splice(index, 1);
      // location.reload();
    },

      async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.categories[this.editedIndex], this.editedItem);
        this.updateCategory(this.editedIndex);
      } else {

       // this.sendDataCategory(this.editedItem);
        //this.categories.push(this.editedItem);
      }
      this.close();
      //location.reload();
    },

    async sendDataCategory(category) {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "atc/category";
      Axios.post(
        url,
        {
          name: category.firstName,
          category: category.category,
          base_priority: category.base_priority,
          protocols: category.protocols,
        },
        { headers: headers }
      ).then(response => {
        alert(response.data);
      });
    },

/// Preguntar a johan
      updateCategory(index) {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "act/category";
      let updateCategory = this.categories[index];
      Axios.put(
        url,
        {
          id: updateCategory.id,
          name: updateCategory.firstName,
          category: updateCategory.category,
          base_priority: updateCategory.base_priority,
          protocols: updateCategory.protocols,
        },
        { headers: headers }
      ).then(response => {
        alert(response.data);
        location.reload();
      });
    },


      deleteCategory(category) {
      var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "atc/category/"+category.name;
      Axios.delete(
        url,
        {},
        { headers: headers }
      ).then(response => {
        alert(response.data);
        location.reload();
      });
    },


     async getCategories() {
      //var headers = { Authorization: this.$store.state.token };
      let url = this.$store.state.backend + "atc/categories" ;
        Axios.get(url).then(response => {
        this.categories = response.data;
      });
    },

    saveProtocol(){

       if (!this.active.length) {
        this.editedItem.protocols.push(this.protocol)
    
       }else{
         const index = this.editedItem.protocols.indexOf(this.protocol);
         this.editedItem.protocols[index] = Object.assign({}, this.protocol);
     
       }
      this.protocolDialog = false
  
    },

    deleteProtocol(){
       const index = this.editedItem.protocols.indexOf(this.protocol);
       console.log(index)
       confirm("¿Esta seguro que desea eliminar el protocolo?") &&
        this.editedItem.protocols.splice(index, 1);
        console.log(this.editedItem)
    }

    

    },

}
</script>

<style>
.categoriesManagementContent {
  width: 100%;
  /* margin: 2px 15px; */
  margin-top: 15px;
  margin-left: 10px;
  margin-right: 10px;
}
.protocolsManagement{
  margin-left: 20px;
  margin-right: 20px;
}
.protocolContent{
  align-items: center;
  display: flex;
}
</style>