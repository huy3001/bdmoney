<template>
  <b-row>
    <b-col cols="12">
      <h1 class="my-4 money-title">
        Nhập sinh nhật của bạn hoặc người thương
      </h1>
    </b-col>

    <b-col cols="12" sm="12" md="4" lg="3">
      <b-form-group id="day-selection">
        <b-form-select
          id="day"
          v-model="day"
          :options="days"
          required
        ></b-form-select>
      </b-form-group>
    </b-col>

    <b-col cols="12" sm="12" md="4" lg="3">
      <b-form-group id="month-selection">
        <b-form-select
          id="month"
          v-model="month"
          :options="months"
          required
        ></b-form-select>
      </b-form-group>
    </b-col>

    <b-col cols="12" sm="12" md="4" lg="3">
      <b-form-group id="year-selection">
        <b-form-select
          id="month"
          v-model="year"
          :options="years"
          required
        ></b-form-select>
      </b-form-group>
    </b-col>

    <b-col cols="12" sm="12" md="12" lg="3">
      <b-form-group id="search">
        <b-button type="button" variant="success" @click="handleSearchMoney"
          >Tìm tiền sinh nhật</b-button
        >
      </b-form-group>
    </b-col>
  </b-row>
</template>

<script>
import $ from 'jquery';
import { APIS } from '../constant';
import { getApi } from '../api';

// API instances
const { url, id, apiKey } = APIS;

export default {
  name: 'BirthdayForm',
  data() {
    return {
      day: null,
      month: null,
      year: null,
      type: 'normal',
      days: [{ text: 'Ngày', value: null }],
      months: [{ text: 'Tháng', value: null }],
      years: [{ text: 'Năm', value: null }],
      dataList: [],
      dataTab: null,
      dataAPI: null,
      otherDataAPI: null,
      fisrtDataAPI: null,
      secondDataAPI: null,
      fisrtOtherDataAPI: null,
      secondOtherDataAPI: null,
    };
  },

  methods: {
    setDay() {
      let day,
        dayInMonth = 31;
      for (day = 1; day <= dayInMonth; day++) {
        if (day < 10) day = '0' + day;
        this.days.push(day);
      }
    },

    setMonth() {
      let month,
        monthInYear = 12;
      for (month = 1; month <= monthInYear; month++) {
        if (month < 10) month = '0' + month;
        this.months.push(month);
      }
    },

    setYear() {
      let year,
        startYear = 1951,
        endYear = new Date().getFullYear();
      for (year = endYear; year >= startYear; year--) {
        this.years.push(year);
      }
    },

    // Parse data from API
    parseData(entries) {
      // Reset data list
      this.dataList.length = 0;

      // Get entry from entries
      var entry = {};
      entries.forEach((item, index) => {
        if (index != 0) {
          let year = [];

          item.forEach((value, index) => {
            if (value != '' && index > 3) {
              year.push(value.replace(/\D+/g, ''));
            }
          });

          entry = {
            day: item[0].replace(/\D+/g, ''),
            month: item[1].replace(/\D+/g, ''),
            year: year,
            money: item[2].replace(/[a-zA-Z]|\s+/g, ''),
            seri: item[3].replace(/\s+/g, ''),
          };

          // Push entry into the data list
          this.dataList.push(entry);
        }
      });
    },

    // Parse other data from API
    // parseOtherData(entries) {
    //     var self = this;
    //     // Get other entry from entries
    //     var otherEntry = {};
    //     entries.forEach((item, index) => {
    //         if (index != 0) {
    //             let date = item[0].replace(/\D+/g, '');
    //             let day, month = null;
    //             let year = [];

    //             if (parseInt(self.month) < 10) {
    //                 day = date.substring(0, 2);
    //                 month = date.substring(date.length - 1);
    //             }
    //             else {
    //                 if (date.length < 4) {
    //                     day = date.substring(0, 1);
    //                 }
    //                 else {
    //                     day = date.substring(0, 2);
    //                 }
    //                 month = date.substring(date.length - 2);
    //             }

    //             item.forEach((value, index) => {
    //                 if (value != '' && index > 2) {
    //                     value = value.replace(/\D+/g, '');
    //                     // Define years are 2k or 19xx and push to array
    //                     if (parseInt(value) < 51) {
    //                         year.push(parseInt(value) + 2000);
    //                     }
    //                     else {
    //                         year.push(parseInt(value) + 1900);
    //                     }
    //                 }
    //             })

    //             otherEntry = {
    //                 'day': day,
    //                 'month': month,
    //                 'year': year,
    //                 'money': item[1].replace(/[a-zA-Z]|\s+/g, ''),
    //                 'seri': item[2] != undefined ? item[2].replace(/\s+/g, '') : '',
    //             }

    //             // Push entry into the data list
    //             this.dataList.push(otherEntry);
    //         }
    //     })
    // },

    getAPI(apiID, apiTab) {
      return url + apiID + '/values/' + apiTab + '?alt=json&key=' + apiKey;
    },

    getData(dataAPI, handleData) {
      // Fetch data from Google sheet file
      getApi(dataAPI)
        .then((response) => {
          // handle success
          handleData(response.data.values);
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },

    getMultipleData(firstDataAPI, secondDataAPI, handleData) {
      // Fetch multiple data from Google sheet file
      let firstData, secondData, mergedData;
      const getFirstData = getApi(firstDataAPI);
      const getSecondData = getApi(secondDataAPI);
      Promise.all([getFirstData, getSecondData])
        .then((results) => {
          firstData = results[0].data.values;
          secondData = results[1].data.values;
          mergedData = [...firstData, ...secondData];
          handleData(mergedData);
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },

    getDataFromApi() {
      var self = this;
      // Get data entry from API
      var dataEntry = {};
      if (this.day != null && this.month != null && this.year != null) {
        const apiUrl =
          'https://api.khotiennamsinh.com/api/money?query=' +
          this.day +
          '/' +
          this.month +
          '/' +
          this.year +
          '&saleStatus=available';
        // Fetch data from API
        getApi(apiUrl)
          .then((response) => {
            response.data.data.list.forEach((item) => {
              let date = item.dateAndMonth;
              let day,
                month = null;
              let year = item.year;

              if (parseInt(self.month) < 10) {
                day = date.substring(0, 2);
                month = date.substring(date.length - 1);
              } else {
                if (date.length < 4) {
                  day = date.substring(0, 1);
                } else {
                  day = date.substring(0, 2);
                }
                month = date.substring(date.length - 2);
              }

              dataEntry = {
                day: day,
                month: month,
                year: year,
                money: item.short,
                seri: item.code,
              };

              // Push entry into the data list
              self.dataList.push(dataEntry);
            });
          })
          .catch((error) => {
            // handle error
            console.log(error);
          });
      }
    },

    handleSearchMoney(event) {
      // Handle data
      this.$emit('data', this.dataList);
      // Handle search
      this.$emit('search', this.day, this.month, this.year, this.type);
      // Trigger search twice
      $(event.target).trigger('click');
    },
  },

  watch: {
    month() {
      // Watch month change and get data base on selected month
      if (this.month != null) {
        // Set data tab equal selected month
        if (this.month == 11 || this.month == 12) {
          // Update data tabs
          this.dataTab = {
            fisrt: this.month - 10,
            second: this.month,
          };
          // Update data APIs
          this.fisrtDataAPI = this.getAPI(id, this.dataTab.fisrt);
          this.secondDataAPI = this.getAPI(id, this.dataTab.second);
          // Get multiple data
          this.getMultipleData(
            this.fisrtDataAPI,
            this.secondDataAPI,
            this.parseData
          );
          // Update other data APIs
          // this.fisrtOtherDataAPI = this.getAPI(otherId, this.dataTab.fisrt);
          // this.secondOtherDataAPI = this.getAPI(otherId, this.dataTab.second);
          // Get multiple data
          // this.getMultipleData(this.fisrtOtherDataAPI, this.secondOtherDataAPI, this.parseOtherData);
        } else {
          // Update data tab
          this.dataTab =
            parseInt(this.month) < 10
              ? this.month.replace('0', '')
              : this.month;
          // Update data API
          this.dataAPI = this.getAPI(id, this.dataTab);
          // Get data
          this.getData(this.dataAPI, this.parseData);
          // Update other data API
          // this.otherDataAPI = this.getAPI(otherId, this.dataTab);
          // Get other data
          // this.getData(this.otherDataAPI, this.parseOtherData);
        }
        // Get data from API
        this.getDataFromApi();
      }
    },
  },

  mounted() {
    // Set day in month
    this.setDay();
    // Set month in year
    this.setMonth();
    // Set range of year
    this.setYear();
    // Watch for change of day, month and year
    this.$watch(
      () => {
        return this.day + this.month + this.year;
      },
      () => {
        // Get data from API
        this.getDataFromApi();
      },
      {
        immediate: true,
      }
    );
  },
};
</script>
