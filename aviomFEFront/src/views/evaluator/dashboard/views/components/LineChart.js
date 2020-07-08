import { Line } from 'vue-chartjs'
import zoom from 'chartjs-plugin-zoom';

//const { reactiveProp } = mixins

export default {
  extends: Line,
  // mixins: [reactiveProp],
  props: {
    chartData: Object,
    xLabel: String,
    yLabel: String,
  },
  methods: {
    update() {
      this.$data._chart.update()
    },
    options() {
      return {
        zoom: {
          // Boolean to enable zooming
          enabled: true,
          // Zooming directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow zooming in the y direction
          mode: 'x',
        },
        responsive:true,
        maintainAspectRatio:true,
        pan: {
          // Boolean to enable panning
          enabled: true,

          // Panning directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow panning in the y direction
          mode: 'x'
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel:{
                display:true,
                labelString: this.xLabel
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel:{
                display:true,
                labelString:this.yLabel
              }
            }
          ]
        }
      }

    }
  },

  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.addPlugin(zoom);
    this.renderChart(this.chartData, this.options())
  }

}