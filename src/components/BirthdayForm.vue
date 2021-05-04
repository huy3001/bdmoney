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
import {parseData, parseOtherData} from '../helper';

export default {
    name: "BirthdayForm",
    props: {
        data: Function,
        dataId: String,
        otherDataId: String,
        multipleData: Function
    },

    data() {
        return {
            day: null,
            month: null,
            year: null,
            days: [{ text: "Ngày", value: null }],
            months: [{ text: "Tháng", value: null }],
            years: [{ text: "Năm", value: null }],
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

        handleSearchMoney() {
            this.$emit('search', this.day, this.month, this.year);
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
                    this.multipleData(this.fisrtDataAPI, this.secondDataAPI, parseData);
                    // Update other data APIs
                    this.fisrtOtherDataAPI = 'https://spreadsheets.google.com/feeds/list/' + this.otherDataId + '/' + this.dataTab.fisrt + '/public/values?alt=json';
                    this.secondOtherDataAPI = 'https://spreadsheets.google.com/feeds/list/' + this.otherDataId + '/' + this.dataTab.second + '/public/values?alt=json';
                    // Get multiple data
                    this.multipleData(this.fisrtOtherDataAPI, this.secondOtherDataAPI, parseOtherData);
                }
                else {
                    // Update data tab
                    this.dataTab = parseInt(this.month) < 10 ? this.month.replace('0', '') : this.month;
                    // Update data API
                    this.dataAPI = 'https://spreadsheets.google.com/feeds/list/' + this.dataId + '/' + this.dataTab + '/public/values?alt=json';
                    // Get data
                    this.data(this.dataAPI, parseData);
                    // Update other data API
                    this.otherDataAPI = 'https://spreadsheets.google.com/feeds/list/' + this.otherDataId + '/' + this.dataTab + '/public/values?alt=json'
                    // Get other data
                    this.data(this.otherDataAPI, parseOtherData);
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