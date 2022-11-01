
<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-10">
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="headerTitle bg-red-50 text-xl">
            <tr>
              <th class="p-4 text-left">Event Name</th>
              <th class="p-4 text-left">Event Date</th>
              <th class="p-4 text-left">Number Of Attendees</th>
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

<canvas ref="myChart" width="900px" height="250px"></canvas>

  </main>
</template>
<script>
import { DateTime } from "luxon";
import Chart from 'chart.js';
import axios from "axios";

export default {
  name: 'Chart',
  props: {
    label: {
      type: Array
    }
  },
  data() {
    return {
      eventData: []
    };
  },
  mounted(){
    let apiURL = import.meta.env.VITE_ROOT_API + `/dashboard/getbydate`;
    axios.get(apiURL).then((resp) => {
      this.eventData = resp.data;
    });
  },
  await new Chart(this.$refs.myChart, {
      type: 'bar',
      data: {
        labels: this.label,
        datasets: [
        {
            label: 'CASES',
            backgroundColor: 'rgba(144,238,144 , 0.9 )',
            data: this.chartData,
        }
        ]
      },
      options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
    }
    }),
    methods: {
    formattedDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
    },
  },

  };

</script>