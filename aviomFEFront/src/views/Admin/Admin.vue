<template>
  <div class="adminContent"> 
      <aviom-sidebar :items="items"></aviom-sidebar>
      <router-view></router-view>

  </div>
</template>

<script>
import aviomSidebar from  './../../components/Sidebar/Sidebar';

export default {
  name:'Admin', 
  data: function(){
    return {
            items:[
                {title: "Gestión usuarios", icon: "supervised_user_circle", link:'userManagement'},
                {title:"Gestión roles", icon:"people", link:'rolesManagement'},
                {title:"Gestión de servicios", icon:"people", link:'serviceManagement'},
                {title:"Parámetros del sistema", icon:"settings_system_daydream",link:'systemSettings'},
                
            ]
        }

  },
  components:{
     aviomSidebar
  }

}
</script>

<style>
.adminContent {
  width: 100%;
  height: 100%;
  display: flex;
}

</style>