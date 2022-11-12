<!-- chart documentation: https://vue-chartjs.org/guide/#creating-your-first-chart -->
<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    </div>
    <div>
    <h1 class ="font-bold text-2xl text-red-700 text-center mt-8 tracking-wider">Attendee Count From the Last Two Months</h1>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-10">
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="headerTitle bg-red-50 text-xl">
            <tr>
              <th class="p-4 text-left text-red-700">Event Name</th>
              <th class="p-4 text-left text-red-700">Event Date</th>
              <th class="p-4 text-left text-red-700">Number Of Attendees</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr v-for="event in eventData" :key="event._id">
              <td class="p-2 text-left">{{ event.eventName }}</td>
              <td class="p-2 text-left">{{ formattedDate(event.date) }}</td>
              <td class="p-2 text-left">{{ event.attendees }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
  <br>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />

</template>

<script>
import { DateTime } from "luxon";
import axios from "axios";
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 150
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      eventData: [],
      chartData: {
        labels: [],
        datasets: [ { label: ['Number Of Attendees'], data: [], backgroundColor: '#ce2843' } ]
      },
      
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: { precision: 0},
            // https://www.chartjs.org/docs/latest/samples/scales/linear-min-max-suggested.html
            suggestedMax: 5
          }
        }
      }
    }
  },
  mounted(){
    let apiURL = import.meta.env.VITE_ROOT_API + `/dashboard/getbydate`;
    axios.get(apiURL).then((resp) => {
      this.eventData = resp.data;
      this.chartData.labels = this.eventData.map( e => e.eventName );
      this.chartData.datasets[0].data = (this.eventData.map( e => e.attendees ));
    });
  },
  methods: {
    formattedDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
    },
  },
}
</script>