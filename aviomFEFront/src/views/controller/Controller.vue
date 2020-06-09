<template>
  <div class="controllerContent"> 
      <aviom-sidebar :items="items"></aviom-sidebar>
      <router-view></router-view>

  </div>
</template>

<script>
import aviomSidebar from  './../../components/Sidebar/Sidebar';

export default {
  name:'controller', 
  data: function(){
    return {
            items:[
                {title: "Gestión eventos", icon: "list_alt", link:'eventManagement'},
    
            ]
        }

  },
  components:{
     aviomSidebar
  }

}
</script>

<style>
.controllerContent {
  width: 100%;
  height: 100%;
  display: flex;
}

</style>