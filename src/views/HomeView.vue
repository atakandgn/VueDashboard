<template>
  <main class="container mx-auto my-2">
    <h1 class="flex justify-center sm:text-2xl text-xl w-full">
      Welcome to Eva,&nbsp; <span class="font-[600]">{{ userInfo?.firstName }} {{ userInfo?.lastName }}</span>
    </h1>
    <div class="relative">
      <div class="absolute right-4 top-2 z-50">
        <el-select v-model="selectedDays" placeholder="Select" style="width: 120px">
          <el-option
              v-for="option in dayOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
          />
        </el-select>
      </div>
      <div id="barChart"></div>
    </div>
    <preloader v-if="showPreloader"/>
    <div v-show="showTable && !showPreloader" class="flex items-center justify-between w-full py-2">
      <el-tooltip
          class="box-item"
          effect="dark"
          content="Search for a product by SKU or Product Name"
          placement="top"
          :hide-after="100"
      >
        <div class="flex items-center relative">
          <input
              type="text"
              v-model="searchQuery"
              @input="debouncedFilterTable"
              class="transition duration-200 border focus:border-gray-600 p-2 pr-10 rounded-md focus:ring-transparent focus:ring-offset-transparent outline-none active:outline-none"
              placeholder="Search..."
          />
          <svg
              class="absolute right-2 top-0 cursor-pointer transform translate-y-1/2"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              fill-rule="evenodd"
              clip-rule="evenodd"
          >
            <path
                d="M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5z"
            />
          </svg>
        </div>

      </el-tooltip>
      <div>
        <el-button
            type="danger"
            plain
            class="flex flex-row items-center hover-effect group"
            @click="clearData"
        >
          <el-tooltip
              class="box-item"
              effect="dark"
              content="Clear all selected dates"
              placement="top"
              :hide-after="100"
          >
            <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fill-rule="evenodd"
                clip-rule="evenodd"
                class="transition-fill"
            >
              <path
                  d="M9 3h6v-1.75c0-.066-.026-.13-.073-.177-.047-.047-.111-.073-.177-.073h-5.5c-.066 0-.13.026-.177.073-.047.047-.073.111-.073.177v1.75zm11 1h-16v18c0 .552.448 1 1 1h14c.552 0 1-.448 1-1v-18zm-10 3.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12c0 .276.224.5.5.5s.5-.224.5-.5v-12zm5 0c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12c0 .276.224.5.5.5s.5-.224.5-.5v-12zm8-4.5v1h-2v18c0 1.105-.895 2-2 2h-14c-1.105 0-2-.895-2-2v-18h-2v-1h7v-2c0-.552.448-1 1-1h6c.552 0 1 .448 1 1v2h7z"
              />
            </svg>
          </el-tooltip>
        </el-button>
      </div>
    </div>

    <el-table v-show="showTable && !showPreloader" :data="currentPageData" stripe style="width: 100%">
      <el-table-column prop="SKU" label="SKU" style="width: 5%"/>
      <el-table-column prop="ProductName" label="Product Name" style="width: 56%">
        <template v-slot:default="{ row, column, $index }">
          <el-tooltip
              class="box-item w-[150px]"
              effect="dark"
              :content=row.ProductName
              placement="top"
              :hide-after="100"
          >
            <span class="truncate-2 font-[500]">
            {{ row.ProductName }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>

      <template v-if="clickedColumnDates.length > 0">
        <!-- First selected date -->
        <el-table-column :label="`Date (${clickedColumnDates[0]})`" :prop="`Date_0`" style="width: 13%">
          <template v-slot:header="{ column, $index }">
            <span class="text-center block">Date:</span>
            <div class="text-center block">{{ clickedColumnDates[0] }}</div>
            <span class="text-center block">Sales / Units</span>
            <span class="text-center block">Avg. Selling Price</span>
          </template>
          <template v-slot:default="{ row, column, $index }">
            <div class="text-green-600 font-[500] text-center block"
                 v-html="`${store.state.currency} ${row.Date_0}`"></div>

          </template>
        </el-table-column>
        <!-- Second selected date -->
        <el-table-column v-if="clickedColumnDates.length > 1" :label="`Date (${clickedColumnDates[1]})`"
                         :prop="`Date_1`" style="width: 13%">
          <template v-slot:header="{ column, $index }">
            <span class="text-center block">Date:</span>
            <div class="text-center block">{{ clickedColumnDates[1] }}</div>
            <span class="text-center block">Sales / Units</span>
            <span class="text-center block">Avg. Selling Price</span>
          </template>
          <template v-slot:default="{ row, column, $index }">
            <div class="text-cyan-500 font-[500] text-center block" v-if="row.Date_1 !== undefined"
                 v-html="`${store.state.currency} ${row.Date_1}`"></div>
            <div v-else>
              Loading...
            </div>
          </template>
        </el-table-column>
      </template>

      <el-table-column label="SKU Refund Rate" prop="SKURefundRate" style="width: 13%">
        <template v-slot:header="{ column, $index }">
          <span class="text-center block">SKU Refund Rate</span>
          <span class="text-center block">(Last 60 Days)</span>
        </template>
        <template v-slot:default="{ row, column, $index }">
          <div class="text-center block" v-if="skuRefundRateData[row.SKU] !== undefined">
            {{ skuRefundRateData[row.SKU].refundRate }}
          </div>
          <div v-else>
            Loading...
          </div>
        </template>
      </el-table-column>

    </el-table>
    <!-- Pagination Controls -->
    <div v-if="showTable" class="flex justify-center items-center gap-4 mt-4">
      <svg @click="paginate('prev')" class="cursor-pointer transform hover:scale-110 transition-transform" width="24"
           height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
        <path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z"/>
      </svg>
      <span class="text-black">
    Page {{ currentPage }} of {{ totalPages }}
  </span>
      <svg @click="paginate('next')" class="cursor-pointer transform hover:scale-110 transition-transform" width="24"
           height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
        <path d="M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z"/>
      </svg>
    </div>
  </main>
</template>
<style scoped>
.hover-effect:hover .transition-fill {
  fill: white;
  transition: ease-in-out 0.2s;
}
</style>
<script setup lang="ts">
import {computed, onMounted, ref, watch, watchEffect} from 'vue';
import axios from 'axios';
import Highcharts from 'highcharts';
import Preloader from '@/components/Preloader.vue';
import {debounce} from 'lodash';
import store from "@/store";

const accessToken = store.state.authToken;
const email = store.state.email;

const userInfo = ref(null);
const dailySalesOverview = ref(null);
const selectedDays = ref(29);
const clickedColumnDates = ref([]);
const skuRefundRateData = ref({});
const allSKUs = ref([]);
const showTable = ref(false);
const showPreloader = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const originalTableData = ref([]);


const dayOptions = [
  {value: 59, label: 'Last 60 days'},
  {value: 29, label: 'Last 30 days'},
  {value: 13, label: 'Last 14 days'},
  {value: 6, label: 'Last 7 days'},
];
const tableData = ref([
  {
    SKU: '',
    ProductName: '',
    Date: '',
  },
]);

const filterTable = () => {
  if (searchQuery.value.trim() === '') {
    // Reset the table data to the original state when search query is empty
    tableData.value = originalTableData.value;
  } else {
    // Update the table data with the filtered results
    tableData.value = originalTableData.value.filter(item => {
      return (
          item.SKU.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.ProductName.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
  }
  // Reset current page to 1 when filtering
  currentPage.value = 1;
};
const debouncedFilterTable = debounce(filterTable, 500);

const currentPageData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return tableData.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => Math.ceil(tableData.value.length / itemsPerPage));

const paginate = (direction) => {
  if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--;
  } else if (direction === 'next' && currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
const clearData = async (selectedDays) => {
  clickedColumnDates.value = [];
  showTable.value = false;
  dailySalesOverview.value = null;
  await fetchData(selectedDays);
};
const fetchData = async (selectedDays) => {
  try {
    const responseUserInfo = await axios.post(
        'https://iapitest.eva.guru/user/user-information',
        {email: email},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        }
    );
    if (responseUserInfo.data.ApiStatusCode !== 200) {
      console.error('Error Message', responseUserInfo.data.ApiStatusMessage);
      return;
    } else {
      userInfo.value = responseUserInfo.data.Data.user;
      const dailySalesData = {
        marketplace: userInfo.value.store[0].marketplaceName,
        sellerId: userInfo.value.store[0].storeId,
        requestStatus: 0,
        day: selectedDays || 29,
        excludeYoYData: true,
      };

      const responseDailySales = await axios.post(
          'https://iapitest.eva.guru/data/daily-sales-overview',
          dailySalesData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              accept: 'application/json',
            },
          }
      );

      dailySalesOverview.value = responseDailySales.data.Data;
      store.commit('setCurrency', dailySalesOverview.value.Currency);

      const dates = dailySalesOverview.value.item.map((item) => item.date);

      const seriesData = [
        {name: 'Profit', data: dailySalesOverview.value.item.map((item) => item.profit)},
        {name: 'FBA Sales', data: dailySalesOverview.value.item.map((item) => item.fbaAmount)},
        {name: 'FBM Sales', data: dailySalesOverview.value.item.map((item) => item.fbmAmount)},
      ];

      Highcharts.setOptions({
        colors: ['#67e6c8', '#7467e6', '#6e46ae', '#E667A4', '#A4E667'],
        chart: {
          style: {
            color: '#000000',
          },
        },
      });

      const chart = Highcharts.chart("barChart", {
        chart: {
          type: 'column',
          backgroundColor: 'rgba(101,0,254,0.02)',
          borderRadius: 10,
        },
        title: {
          text: 'Daily Sales',
          align: 'left',
          x: 10,
          style: {
            color: '#000000',
          },
        },
        xAxis: {
          tickWidth: 0,
          labels: {
            style: {
              color: '#000000',
            },
          },
          categories: dates,
        },
        yAxis: {
          gridLineWidth: 0.5,
          gridLineDashStyle: 'dash',
          gridLineColor: 'black',
          title: {
            text: '',
            style: {
              color: '#000000',
            },
          },
          labels: {
            formatter: function () {
              return Highcharts.numberFormat(this.value, 0, '', ',');
            },
            style: {
              color: '#000000',
            },
          },
        },
        legend: {
          enabled: true,
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          valuePrefix: '',
          pointFormatter: function () {
            return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${Highcharts.numberFormat(this.y, 0, '', ',')}</b><br/>`;
          },
        },
        plotOptions: {
          column: {
            borderRadius: 0,
            pointPadding: 0.02,
            groupPadding: 0.05,
            stacking: 'normal',
            events: {
              click: function (event) {
                if (clickedColumnDates.value.length < 2) {
                  clickedColumnDates.value.push(event.point.category);
                  fetchTableData();
                  event.point.update({
                    color: '#ffcc00',
                  });
                  showPreloader.value = true;
                  setTimeout(() => {
                    showTable.value = true;
                    showPreloader.value = false;
                  }, 1000);
                }
              },
            },
          },
        },
        series: seriesData,
      });
      watch(clickedColumnDates, () => {
        chart.xAxis[0].setCategories(clickedColumnDates.value);
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error.response?.data);
  }
};

const fetchTableData = async () => {
  try {
    if (!accessToken || !userInfo.value) {
      console.error('Access token or user information not found');
      return;
    }

    let responseData;
    if (clickedColumnDates.value.length === 1) {
      // Single column selected
      const tableDataResponse = await axios.post(
          'https://iapitest.eva.guru/data/daily-sales-sku-list',
          {
            marketplace: userInfo.value.store[0].marketplaceName,
            salesDate: clickedColumnDates.value[0],
            sellerId: userInfo.value.store[0].storeId,
            pageNumber: 1,
            pageSize: 30,
            isDaysCompare: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              accept: 'application/json',
            },
          }
      );

      responseData = tableDataResponse.data.Data.item;
    } else if (clickedColumnDates.value.length === 2) {
      // Two columns selected for comparison
      const tableDataResponse = await axios.post(
          'https://iapitest.eva.guru/data/daily-sales-sku-list',
          {
            marketplace: userInfo.value.store[0].marketplaceName,
            salesDate: clickedColumnDates.value[0],
            salesDate2: clickedColumnDates.value[1],
            sellerId: userInfo.value.store[0].storeId,
            pageNumber: 1,
            pageSize: 30,
            isDaysCompare: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              accept: 'application/json',
            },
          }
      );
      responseData = tableDataResponse.data.Data.item;
    }

    // Store the original data when it's first loaded
    if (originalTableData.value.length === 0) {
      originalTableData.value = responseData
          ? responseData.skuList.map((skuItem) => {
            const rowData = {
              SKU: skuItem.sku,
              ProductName: skuItem.productName,
              Date_0: skuItem.qty !== 0
                  ? `${skuItem.amount.toFixed(2)} / ${skuItem.qty}<br>${(skuItem.amount / skuItem.qty).toFixed(2)}`
                  : '<span style="font-weight: bold; font-size: 16px;">-</span>',
              Date_1: skuItem.qty2 !== 0
                  ? `${skuItem.amount.toFixed(2)} / ${skuItem.qty2}<br>${(skuItem.amount / skuItem.qty2).toFixed(2)}`
                  : `${skuItem.amount.toFixed(2)} / ${skuItem.qty2} <br> <span>-</span>`,
            };
            return rowData;
          })
          : [];
    }

    // Store all SKUs for fetching SKU Refund Rate data
    allSKUs.value = responseData.skuList.map((skuItem) => skuItem.sku).filter(Boolean);

    // Fetch SKU Refund Rate data for all SKUs
    await fetchSkuRefundRateData();

    // Update tableData with the new data
    tableData.value = responseData
        ? responseData.skuList.map((skuItem) => {
          const rowData = {
            SKU: skuItem.sku,
            ProductName: skuItem.productName,
            SKURefundRate: skuRefundRateData[skuItem.sku]?.refundRate || '<Preloader />',
          };

          // Populate data based on selected dates
          clickedColumnDates.value.forEach((date, index) => {
            if (index === 0) {
              rowData[`Date_${index}`] = skuItem.qty !== 0
                  ? `${skuItem.amount.toFixed(2)} / ${skuItem.qty}<br>${(skuItem.amount / skuItem.qty).toFixed(2)}`
                  : '<span style="font-weight: bold; font-size: 16px;">-</span>';
            } else if (index === 1) {
              rowData[`Date_${index}`] = skuItem.qty2 !== 0
                  ? `${skuItem.amount.toFixed(2)} / ${skuItem.qty2}<br>${(skuItem.amount / skuItem.qty2).toFixed(2)}`
                  : '<span style="font-weight: bold; font-size: 16px;">-</span>';
            }
          });

          return rowData;
        })
        : [];
  } catch (error) {
    console.error('Error fetching table data:', error.response?.data || error.message);
  }
};
const fetchSkuRefundRateData = async () => {
  try {
    const refundRateData = {
      marketplace: userInfo.value.store[0].marketplaceName,
      sellerId: userInfo.value.store[0].storeId,
      skuList: allSKUs.value,
      requestedDay: 60,
    };

    const responseRefundRate = await axios.post(
        'https://iapitest.eva.guru/data/get-sku-refund-rate',
        refundRateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        }
    );
    if (responseRefundRate.data.ApiStatusCode !== 200) {
      console.error('Error Message', responseRefundRate.data.ApiStatusMessage);
      return;
    } else {

      const refundRates = responseRefundRate.data.Data;

      refundRates.forEach((refundRate) => {
        skuRefundRateData.value[refundRate.sku] = refundRate;
      });

    }
  } catch (error) {
    console.error('Error fetching SKU Refund Rate data:', error.response?.data || error.message);
  }
};
onMounted(async () => {
  await fetchData(selectedDays.value);


  // Call fetchSkuRefundRateData when clickedColumnDates change
  watchEffect(() => {
    if (clickedColumnDates.value.length > 0) {
      fetchSkuRefundRateData();
    }
  });

  // Watch for changes in clickedColumnDates and fetch SKU Refund Rate data accordingly
  watchEffect(() => {
    if (clickedColumnDates.value.length > 0) {
      // Fetch SKU Refund Rate data for all SKUs
      fetchSkuRefundRateData();
    }
  });

  watch(selectedDays, async (newSelectedDays) => {
    // Call clearData to reset and send the selected days request
    await clearData(newSelectedDays);
  });
  // Watch for changes in clickedColumnDates and fetch table data accordingly
  watch(clickedColumnDates, fetchTableData);
});
</script>
