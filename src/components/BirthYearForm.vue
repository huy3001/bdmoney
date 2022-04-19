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
                    let year = [];

                    item.forEach((value, index) => {
                        if (value != '' && index > 3) {
                            year.push(value.replace(/\D+/g, ''));
                        }
                    })

                    entry = {
                        'day': item[0].replace(/\D+/g, ''),
                        'month': item[1].replace(/\D+/g, ''),
                        'year': year,
                        'money': item[2].replace(/[a-zA-Z]|\s+/g, ''),
                        'seri': item[3].replace(/\s+/g, ''),
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
            // this.$emit('search', this.day, this.month, this.year);
            // Trigger search twice
            $(event.target).trigger('click');
        }
    },

    watch: {
        month() {
            // Watch month change and get data base on selected month
            if (this.month != null) {
                this.getData(this.dataApi, this.parseData);
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