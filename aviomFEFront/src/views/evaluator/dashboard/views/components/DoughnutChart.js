import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props:['chartData'],
  
  methods: {
    update() {
      this.$data._chart.update()
    },
    options(){
      return {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: false
        },
        
        legend:{position:'top', display:true}}
    }

  },
  mounted () {
    this.renderChart(this.chartData,this.options())
  }
};
