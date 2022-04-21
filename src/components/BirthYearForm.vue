<template>
    <b-row>
        <b-col cols="12">
            <h1 class="my-4 money-title">
                Tìm năm sinh theo cặp đôi
            </h1>
        </b-col>

        <b-col cols="12" sm="12" md="4" lg="4">
            <b-form-group id="first-year-selection">
                <b-form-select
                    id="month"
                    v-model="firstYear"
                    :options="years"
                    required
                ></b-form-select>
            </b-form-group>
        </b-col>

        <b-col cols="12" sm="12" md="4" lg="4">
            <b-form-group id="second-year-selection">
                <b-form-select
                    id="month"
                    v-model="secondYear"
                    :options="years"
                    required
                ></b-form-select>
            </b-form-group>
        </b-col>

        <b-col cols="12" sm="12" md="4" lg="4">
            <b-form-group id="find">
                <b-button type="button" variant="success" @click="handleSearchMoney">Tìm tiền cặp đôi</b-button>
            </b-form-group>
        </b-col>
    </b-row>
</template>

<script>
import axios from 'axios';
import $ from 'jquery';

export default {
    name: "BirthYearForm",
    props: {
        dataApi: String
    },

    data() {
        return {
            day: null,
            month: null,
            year: null,
            type: 'couple',
            firstYear: null,
            secondYear: null,
            years: [{ text: "Năm sinh", value: null }],
            dataList: []
        }
    },

    methods: {
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
            var entry = {};
            entries.forEach((item, index) => {
                if (index != 0) {
                    let date = item[0].replace(/\D+/g, '');
                    let day, month = null;
                    let year = [];

                    day = date.substring(0, 2);
                    month = date.substring(date.length - 2);

                    item.forEach((value, index) => {
                        if (value != '' && index > 2) {
                            value = value.replace(/\D+/g, '');
                            // Define years are 2k or 19xx and push to array
                            if (parseInt(value) < 51) {
                                year.push(parseInt(value) + 2000);
                            }
                            else {
                                year.push(parseInt(value) + 1900);
                            }
                        }
                    })

                    entry = {
                        'day': day,
                        'month': month,
                        'year': year,
                        'money': item[1].replace(/[a-zA-Z]|\s+/g, ''),
                        'seri': item[2] != undefined ? item[2].replace(/\s+/g, '') : '',
                    }
                    
                    // Push entry into the data list
                    this.dataList.push(entry);
                }
            })
        },

        getData(dataAPI, handleData) {
            // Fetch data from Google sheet file
            if (dataAPI != '') {
                axios.get(dataAPI)
                .then(function(response) {
                    // handle success
                    handleData(response.data.values);
                })
                .catch(function(error) {
                    // handle error
                    console.log(error);
                })
            }
        },

        handleSearchMoney(event) {
            // Handle data
            this.$emit('data', this.dataList);
            // Handle search
            this.$emit('search', this.day, this.month, this.year, this.type);
            // Trigger search twice
            $(event.target).trigger('click');
        }
    },

    watch: {
        firstYear() {
            // Watch first year change and get parameters for searching
            if (this.firstYear != null) {
                this.day = this.firstYear.toString().substring(0, 2);
                this.month = this.firstYear.toString().substring(this.firstYear.toString().length - 2);
                // Change type for special couple birth year
                if (this.secondYear != null && this.firstYear == this.secondYear) {
                    this.type = 'special';
                }
                else {
                    this.type = 'couple';
                } 
            }
        },

        secondYear() {
            // Watch second year change and get parameters for searching
            if (this.secondYear != null) {
                this.year = this.secondYear;
                // Change type for special couple birth year
                if (this.firstYear != null && this.secondYear == this.firstYear) {
                    this.type = 'special';
                }
                else {
                    this.type = 'couple';
                }
            }
        }
    },

    mounted() {
        // Set range of year
        this.setYear();
        // Get data
        this.getData(this.dataApi, this.parseData);
    }
}
</script>