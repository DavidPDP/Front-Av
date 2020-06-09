<template>
    <v-navigation-drawer 
      v-model="drawer"
      :mini-variant.sync="mini"
      width="20%"
    >
    <v-list
          dense
          nav
          class="py-0"
        >
      <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-icon x-large>account_circle</v-icon>
      </v-list-item-avatar>

        <v-list-item-content>
              <v-list-item-title>
                {{this.$store.state.person.name}}
                </v-list-item-title>
              <v-list-item-subtitle>
                {{this.$store.state.person.currentRole}}
                
                </v-list-item-subtitle>
        </v-list-item-content>

        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="{name:item.link}"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
      </v-list>

      <v-list dense>
      <v-list-item class="px-2" link>
         <v-menu offset-y>
      <template v-slot:activator="{ on }">
         <v-list-item-icon>
            <v-icon 
             v-on="on"
            >
            loop
            </v-icon>
          </v-list-item-icon>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in itemsTest"
          :key="index"
          @click="chooseRole(item.title)"
          :class="{'selected': changeColor(item)}"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
       

        <v-list-item-content>
               <v-list-item-title > Cambiar Rol</v-list-item-title>
          
        </v-list-item-content>

              
      </v-list-item>

      <v-list-item 
      class="px-2" 
      link
      @click ="logout()"
      >
         <v-list-item-icon>
            
            <v-icon color="red darken-1">exit_to_app</v-icon>
          </v-list-item-icon>

        <v-list-item-content>
               
              <v-list-item-title > Cerrar Sesión</v-list-item-title>
          
        </v-list-item-content>

      </v-list-item>

        
      </v-list>
       
    </v-list>
    
    </v-navigation-drawer>
</template>

<script>
import {mapActions} from 'vuex';
import {OMEGA,CONTROLLER,ADMIN} from "./../../roles";

  export default {
    data () {
      return {
        drawer: true,
        mini: true,
        close: false,
        itemsTest: [
        { title: 'Administrador' },
        { title: 'Omega' },
        { title: 'Controlador' },
        
      ],
      }
    },
    props:[
      'items'
    ],
    methods: {
      ...mapActions(['removeToken','resetPersonState','updateRole']),

    changeRol(rol) {
      this.$router.push({ name: rol.toString().toLowerCase() });
    },
    logout() {
      this.removeToken()
      this.resetPersonState()
      this.$router.push("/login")
      },
    chooseRole(rol){
     this.updateRole(rol);
     this.$router.push({name:rol.toString().toLowerCase()});
    },
     changeColor(rol){
      return rol.toString().toLowerCase()==this.$store.state.person.currentRole.toString().toLowerCase();
    }
    }
  }
</script>

<style lang="scss" scoped>
.v-navigation-drawer {
  padding: 0;
  border: 0;
  margin: 0;
}

.sideBarContent{
  width: 20%;
}


</style>