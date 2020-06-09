<template>
  <!-- <v-row no-gutters>
   <v-col class="withoutMargin" :style="leftCol" :cols="colsMenu" md="auto">
    
    <Menu :propMini="mini" @emitSignal="changeSizeParent()"></Menu>
    </v-col>
    <v-col class="withoutMargin" :style="rightCol" :cols="colsRouter" md="auto">
    
      <router-view></router-view>
    </v-col>
  </v-row> -->

  <div class="omegaContent"> 
      <aviom-sidebar :items="items"></aviom-sidebar>
      <router-view></router-view>

  </div>
</template>

<style lang="scss" scoped>
.withoutMargin {
  margin: 0%;
}
.omegaContent {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>

<script>
// import Menu from "./Menu";
import aviomSidebar from  './../../components/Sidebar/Sidebar';

export default {
  name: "omega",
  components: { 
    // Menu 
    aviomSidebar
    },
  data() {
    return {
      items: [
        { title: "Eventos", icon: "inbox", link:'eventstoattend' },
        { title: "Controladores", icon: "supervised_user_circle", link:'controllers' },
        { title: "Crear evento", icon: "add_circle", link:'createevent' },
      ],
    };
  },
  computed: {
  },
  methods: {
    }
};
</script>