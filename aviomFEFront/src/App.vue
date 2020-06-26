<template>
  <v-app>
    
    <router-view></router-view>
  </v-app>
</template>

<style lang="scss">
html {
  scroll-behavior: smooth;
}
*{
 font-family:'Open Sans', sans-serif;
 font-weight: 400;
 margin:0;
 padding:0;
}

h1, h2, h3, .title{
  font-family: 'Raleway', sans-serif;
  font-weight:800;
  margin: 20px;
}
h1{
    font-size: 30px;
}
h2{
  font-size:25px;
}
h3{
  font-size:18px;
}
hr{
  margin:0px;
}
.primary-color{
    background-color: #08799C ;
}
.secondary-color{
    background-color: #89d2e8;
}
</style>

<script>
export default {
  name:'app',
  components:{
    
  },
  data: () => ({
    
  }),
};
</script>
