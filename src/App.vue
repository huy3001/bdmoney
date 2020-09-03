<template>
    <div id="app">
        <b-container>
            <HelloWorld msg="Nhập sinh nhật của bạn" />
            <!-- Choose birthday form -->
            <b-form id="birthday" @submit="onSubmit" @reset="onReset" v-if="show">
                <b-row>
                    <b-col cols="12" sm="12" md="3">
                        <b-form-group id="day-selection">
                            <b-form-select
                                id="day"
                                v-model="form.day"
                                :options="days"
                                required
                            ></b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col cols="12" sm="12" md="3">
                        <b-form-group id="month-selection">
                            <b-form-select
                                id="month"
                                v-model="form.month"
                                :options="months"
                                required
                            ></b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col cols="12" sm="12" md="3">
                        <b-form-group id="year-selection">
                            <b-form-select
                                id="month"
                                v-model="form.year"
                                :options="years"
                                required
                            ></b-form-select>
                        </b-form-group>
                    </b-col>

                     <b-col cols="12" sm="12" md="3">
                        <b-form-group id="search">
                            <b-button type="button" variant="success" @click="searchMoney">Tìm tờ tiền</b-button>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12">
                        <b-alert show variant="danger" v-if="alert">
                            Vui lòng chọn ngày bạn muốn tìm
                        </b-alert>

                        <b-alert show variant="danger" v-if="empty">
                            Ngày bạn chọn hiện chưa có, bạn tìm ngày khác nhé
                        </b-alert>
                        
                        <b-alert show variant="info" v-if="infoMessage">
                            Những tờ tiền sinh nhật của bạn
                        </b-alert>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" sm="6" md="6" v-for="(result, index) in results" :key="index">
                        <b-alert show variant="success">
                            Có 1 tờ {{ result.money * 1000 }} seri {{ result.seri + result.day + result.month + result.year }}
                        </b-alert>

                        <b-form-group>
                            <b-form-checkbox
                                :id="'money-checkbox-' + index"
                                v-model="form.selected"
                                :name="'money-checkbox-' + index"
                                :value="result.money * 1000 + result.seri + result.day + result.month + result.year"
                                :class="'money-type-' + result.money * 1000"
                            >
                                <b-img src="./images/500d.jpg" fluid alt="500d" v-if="result.money == '0.5'"></b-img>
                                <b-img src="./images/1000d.jpg" fluid alt="1000d" v-if="result.money == '1'"></b-img>
                                <b-img src="./images/2000d.jpg" fluid alt="2000d" v-if="result.money == '2'"></b-img>
                                <b-img src="./images/5000d.jpg" fluid alt="5000d" v-if="result.money == '5'"></b-img>
                                <span class="money-serial">
                                    {{ result.seri + ' ' + result.day + result.month + result.year }}
                                </span>
                                <span class="money-serial-2" v-if="result.money == '5'">
                                    {{ result.seri + ' ' + result.day + result.month + result.year }}
                                </span>
                            </b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" sm="6" md="6">
                        <b-form-group id="name">
                            <b-form-input
                                v-model="form.name"
                                placeholder="Họ và tên"
                                required
                            ></b-form-input>
                        </b-form-group>
                    </b-col>

                    <b-col cols="12" sm="6" md="6">
                        <b-form-group id="phone">
                            <b-form-input
                                v-model="form.phone"
                                placeholder="Số diện thoại"
                                required
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" sm="6" md="6">
                        <b-form-group id="address">
                            <b-form-textarea
                                v-model="form.address"
                                placeholder="Địa chỉ cụ thể (số nhà, tên đường, thôn, xóm)"
                                rows="3"
                                no-resize
                                required
                            ></b-form-textarea>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" sm="6" md="6">
                        <b-form-group id="note">
                            <b-form-textarea
                                v-model="form.note"
                                placeholder="Nội dung in"
                                rows="3"
                                no-resize
                            ></b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12">
                        <b-form-group id="action">
                            <b-button type="submit" variant="primary">Gửi yêu cầu</b-button>
                            <b-button type="reset" variant="danger">Chọn lại</b-button>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-form>
        </b-container>
    </div>
</template>

<script>
import axios from 'axios';
import HelloWorld from "./components/HelloWorld.vue";

var dataList = [];

function parseData(entries) {
    entries.forEach((value) => {
        var entry = {
            'day': value.gsx$ngày.$t,
            'month': value.gsx$tháng.$t,
            'year': value.gsx$tấtcảnămsinh.$t.split('-'),
            'money': value.gsx$mệnhgiá.$t.replace(/[a-zA-Z]+/g, ''),
            'seri': value.gsx$kítự.$t,
        }

        // Push entry into the list of data
        dataList.push(entry);
    })
}

export default {
    name: "App",
    components: {
        HelloWorld,
    },

    data() {
        return {
            show: true,
            form: {
                day: null,
                month: null,
                year: null,
                selected: [],
                name: '',
                phone: '',
                address: '',
                note: ''
            },
            days: [{ text: "Ngày", value: null }],
            months: [{ text: "Tháng", value: null }],
            years: [{ text: "Năm", value: null }],
            dataAPI: 'https://spreadsheets.google.com/feeds/list/1uXf88Ga0zp10odt1ro2nNKep32rp1ZFEKHRfoopPRn4/2/public/values?alt=json',
            data: dataList,
            results: [],
            alert: false,
            empty: false,
            infoMessage: false
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
                startYear = 1950, 
                endYear = (new Date()).getFullYear();
            for (year = startYear; year <= endYear; year++) {
                this.years.push(year);
            }
        },

        getData() {
            // Fetch data from Google sheet file
            axios.get(this.dataAPI)
            .then(function(response) {
                // handle success
                parseData(response.data.feed.entry);
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
        },

        searchMoney() {
            let selectedDay = this.form.day.replace('0', ''),
                selectedMonth = this.form.month.replace('0', ''),
                selectedYear = this.form.year

            if (selectedDay == null || selectedMonth == null || selectedYear == null) {
                // Show alert
                this.alert = true;
            }
            else {
                // Hide alert
                this.alert = false;
                // Find birthday in data
                let itemDay, itemMonth, itemYear, result, resultList = [];
                this.data.forEach((item) => {
                    itemDay = item.day.replace('0', ''),
                    itemMonth = item.month;

                    if (itemDay == selectedDay && itemMonth == selectedMonth) {
                        item.year.forEach((value) => {
                            itemYear = parseInt(value);
                            if (itemYear == selectedYear) {
                                result = {
                                    'day': item.day,
                                    'month': item.month,
                                    'year': selectedYear,
                                    'money': item.money,
                                    'seri': item.seri
                                }

                                // Push result into result list
                                resultList.push(result);
                            }
                        })
                    }
                })

                // Show or hide message when result is empty or not
                if (resultList.length == 0) {
                    this.empty = true;
                    this.infoMessage = false;
                }
                else {
                    this.empty = false;
                    this.infoMessage = true;
                }
                
                // Assign result list to results
                this.results = [...resultList];
            }
        },

        onSubmit() {},
        onReset() {
            this.form.day = null;
            this.form.month = null;
            this.form.year = null;
            this.form.selected = [];
            this.form.name = '';
            this.form.phone = '';
            this.form.address = '';
            this.form.note = '';
            this.results = [];
            this.alert = false;
            this.empty = false;
            this.infoMessage = false;
            // Trick to reset/clear native browser form validation state
            this.show = false;
            this.$nextTick(() => {
                this.show = true
            });
        }
    },

    mounted() {
        // Set day in month
        this.setDay(); 
        // Set month in year
        this.setMonth(); 
        // Set range of year
        this.setYear();
        // Get data
        this.getData();
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/bootstrap";
@import "node_modules/bootstrap-vue/src/index.scss";

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.custom-checkbox {
    .custom-control-label {
        max-width: 500px;
    }
}

.money-serial,
.money-serial-2 {
    color: #cc1d1d;
    font-family: Consolas;
    letter-spacing: 1px;
}

#action {
    .btn {
        margin: 1rem;
    }
}
</style>
