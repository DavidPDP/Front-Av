import { Bar } from 'vue-chartjs'
import zoom from 'chartjs-plugin-zoom';


export default {
  extends: Bar,
  props: {
    chartData: Object,
    stacked: Boolean,
    legend: Boolean,
    xLabel: String,
    yLabel: String
  },
  methods: {
    update() {
      this.$data._chart.update()
    },
    options() {
      return {
        zoom: {
          // Boolean to enable zooming
          enabled: false,

          // Zooming directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow zooming in the y direction
          mode: 'xy',
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: false
        },
        cutoutPercentage: 80,
        legend: { position: 'top', display: this.legend },
        scales: {
          xAxes: [
            {
              stacked: this.stacked,
              scaleLabel: {
                display: true,
                labelString: this.xLabel
              }
            }
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              },
              scaleLabel: {
                display: true,
                labelString: this.yLabel
              }
            }
          ],
        }
      }

    }
  },

  mounted() {
    this.addPlugin(zoom);
    this.renderChart(this.chartData, this.options())
  }
}