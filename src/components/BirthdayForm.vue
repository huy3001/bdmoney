<template>
    <b-row>
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
                <b-button type="button" variant="success" @click="handleSearchMoney">Tìm tiền sinh nhật</b-button>
            </b-form-group>
        </b-col>
    </b-row>
</template>

<script>
import axios from 'axios';
import $ from 'jquery';

export default {
    name: "BirthdayForm",
    props: {
        dataId: String,
        otherDataId: String
    },

    data() {
        return {
            day: null,
            month: null,
            year: null,
            days: [{ text: "Ngày", value: null }],
            months: [{ text: "Tháng", value: null }],
            years: [{ text: "Năm", value: null }],
            dataList: [],
            dataTab: null,
            dataAPI: null,
            otherDataAPI: null,
            fisrtDataAPI: null,
            secondDataAPI: null,
            fisrtOtherDataAPI: null,
            secondOtherDataAPI: null
        }
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
                endYear = (new Date()).getFullYear();
            for (year = endYear; year >= startYear; year--) {
                this.years.push(year);
            }
        },

        // Parse data from API
        parseData(entries) {
            // Reset data list
            this.dataList.length = 0;

            // Get entry from entries
            entries.forEach((value) => {
                var entry = {
                    'day': value.gsx$ngày.$t.replace(/\s+/g, ''),
                    'month': value.gsx$tháng.$t.replace(/\s+/g, ''),
                    'year': value.gsx$tấtcảnămsinh.$t.split('-'),
                    'money': value.gsx$mệnhgiá.$t.replace(/[a-zA-Z]|\s+/g, ''),
                    'seri': value.gsx$kítự.$t.replace(/\s+/g, ''),
                }
                // Push entry into the data list
                this.dataList.push(entry);
            })
        },

        // Parse other data from API
        parseOtherData(entries) {
            // Get other entry from entries
            entries.forEach((value) => {
                let day = value.gsx$ngày.$t.replace(/\s+/g, '');
                let year = [];

                for (const property in value) {
                    // Get value of years
                    if (property.includes('gsx$_')) {
                        // Define years are 2k or 19xx and push to array
                        if (parseInt(value[property].$t) < 51) {
                            year.push(parseInt(value[property].$t) + 2000);
                        }
                        else {
                            year.push(parseInt(value[property].$t) + 1900);
                        }
                    }
                }

                var otherEntry = {
                    'day': day.substring(0, 2),
                    'month': day.charAt(day.length - 1),
                    'year': year,
                    'money': value.gsx$mg.$t.replace(/[a-zA-Z]|\s+/g, ''),
                    'seri': value.gsx$kýtự.$t.replace(/\s+/g, ''),
                }
                
                // Push entry into the data list
                this.dataList.push(otherEntry);
            })
        },

        getData(dataAPI, parseData) {
            // Fetch data from Google sheet file
            if (dataAPI != '') {
                axios.get(dataAPI)
                .then(function(response) {
                    // handle success
                    parseData(response.data.feed.entry);
                })
                .catch(function(error) {
                    // handle error
                    console.log(error);
                })
            }
        },

        getMultipleData(firstDataAPI, secondDataAPI, parseData) {
            // Fetch multiple data from Google sheet file
            let firstData, secondData, mergedData;
            const getFirstData = axios.get(firstDataAPI);
            const getSecondData = axios.get(secondDataAPI);
            Promise.all([getFirstData, getSecondData])
            .then(function(results) {
                firstData = results[0].data.feed.entry;
                secondData = results[1].data.feed.entry;
                mergedData = firstData.concat(secondData);
                parseData(mergedData);
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            });
        },

        handleSearchMoney(event) {
            // Handle data
            this.$emit('data', this.dataList);
            // Handle search
            this.$emit('search', this.day, this.month, this.year);
            // Trigger search twice
            $(event.target).trigger('click');
        }
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
                        second: this.month
                    }
                    // Update data APIs
                    this.fisrtDataAPI = 'https://spreadsheets.google.com/feeds/list/' + this.dataId + '/' + this.dataTab.fisrt + '/public/values?alt=json';
                    this.secondDataAPI = 'https://spreadsheets.google.com/feeds/list/' + this.dataId + '/' + this.dataTab.second + '/public/values?alt=json';
                    // Get multiple data
                    this.getMultipleData(this.fisrtDataAPI, this.secondDataAPI, this.parseData);
                    // Update other data APIs
                    this.fisrtOtherDataAPI = 'https://spreadsheets.google.com/feeds/list/' + this.otherDataId + '/' + this.dataTab.fisrt + '/public/values?alt=json';
                    this.secondOtherDataAPI = 'https://spreadsheets.google.com/feeds/list/' + this.otherDataId + '/' + this.dataTab.second + '/public/values?alt=json';
                    // Get multiple data
                    this.getMultipleData(this.fisrtOtherDataAPI, this.secondOtherDataAPI, this.parseOtherData);
                }
                else {
                    // Update data tab
                    this.dataTab = parseInt(this.month) < 10 ? this.month.replace('0', '') : this.month;
                    // Update data API
                    this.dataAPI = 'https://spreadsheets.google.com/feeds/list/' + this.dataId + '/' + this.dataTab + '/public/values?alt=json';
                    // Get data
                    this.getData(this.dataAPI, this.parseData);
                    // Update other data API
                    this.otherDataAPI = 'https://spreadsheets.google.com/feeds/list/' + this.otherDataId + '/' + this.dataTab + '/public/values?alt=json'
                    // Get other data
                    this.getData(this.otherDataAPI, this.parseOtherData);
                }
            }
        }
    },

    mounted() {
        // Set day in month
        this.setDay(); 
        // Set month in year
        this.setMonth(); 
        // Set range of year
        this.setYear();
    }
}
</script>