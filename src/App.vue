<template>
    <div id="app">
        <b-container>
            <HelloWorld msg="Nhập sinh nhật của bạn" />

            <!-- Success block -->
            <b-row>
                <b-col cols="12">
                    <b-alert show variant="success" v-if="successMessage">
                        Cảm ơn bạn đã đặt hàng, chúng tôi sẽ liên hệ và gửi hàng đến bạn sớm nhất có thể 
                    </b-alert>
                    <b-button type="button" variant="info" @click="backToForm" v-if="successMessage">Tiếp tục chọn tiền</b-button>
                </b-col>
            </b-row>

            <!-- Choose birthday form -->
            <b-form id="birthday" @reset="onReset" v-if="show">
                <b-row>
                    <b-col cols="12" sm="12" md="3">
                        <b-form-group id="day-selection">
                            <b-form-select
                                id="day"
                                v-model="day"
                                :options="days"
                                required
                            ></b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col cols="12" sm="12" md="3">
                        <b-form-group id="month-selection">
                            <b-form-select
                                id="month"
                                v-model="month"
                                :options="months"
                                required
                            ></b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col cols="12" sm="12" md="3">
                        <b-form-group id="year-selection">
                            <b-form-select
                                id="month"
                                v-model="year"
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

                        <b-alert show variant="warning" v-if="empty">
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
                                v-model="selected"
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
                    <b-col cols="12">
                        <b-alert show variant="info" v-if="infoMessage">
                            Vui lòng để lại thông tin của bạn
                        </b-alert>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" sm="6" md="6">
                        <b-form-group id="name">
                            <b-form-input
                                v-model="name"
                                placeholder="Họ và tên"
                                required
                            ></b-form-input>
                        </b-form-group>
                    </b-col>

                    <b-col cols="12" sm="6" md="6">
                        <b-form-group id="phone">
                            <b-form-input
                                v-model="phone"
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
                                v-model="address"
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
                                v-model="note"
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
                            <b-button type="button" variant="primary" @click="postData">Gửi yêu cầu</b-button>
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
// URL of your blank Google sheet used to store data
const spreadSheetID = '1dtMmTotiEk-QFGb8h0wU_NPGH23VprTeXtPuG48ta04';

function parseData(entries) {
    // Reset data list
    dataList.length = 0;

    // Get entry from entries
    entries.forEach((value) => {
        var entry = {
            'day': value.gsx$ngày.$t,
            'month': value.gsx$tháng.$t,
            'year': value.gsx$tấtcảnămsinh.$t.split('-'),
            'money': value.gsx$mệnhgiá.$t.replace(/[a-zA-Z]+/g, ''),
            'seri': value.gsx$kítự.$t,
        }
        // Push entry into the data list
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
            day: null,
            month: null,
            year: null,
            selected: [],
            name: '',
            phone: '',
            address: '',
            note: '',
            days: [{ text: "Ngày", value: null }],
            months: [{ text: "Tháng", value: null }],
            years: [{ text: "Năm", value: null }],
            dataTab: '1',
            dataID: '1uXf88Ga0zp10odt1ro2nNKep32rp1ZFEKHRfoopPRn4',
            dataAPI: 'https://spreadsheets.google.com/feeds/list/1uXf88Ga0zp10odt1ro2nNKep32rp1ZFEKHRfoopPRn4/1/public/values?alt=json',
            data: dataList,
            results: [],
            alert: false,
            empty: false,
            infoMessage: false,
            successMessage: false
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
            if (this.dataAPI != '') {
                axios.get(this.dataAPI)
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

        searchMoney() {
            if (this.day == null || this.month == null || this.year == null) {
                // Show alert
                this.alert = true;
            }
            else {
                let selectedDay = parseInt(this.day) < 10 ? this.day.replace('0', '') : this.day,
                    selectedMonth = parseInt(this.month) < 10 ? this.month.replace('0', '') : this.month,
                    selectedYear = this.year;

                // Hide alert
                this.alert = false;

                // Find birthday in data
                let itemDay, itemMonth, itemYear, result, resultList = [];

                this.data.forEach((item) => {
                    if (parseInt(item.day) < 10 || parseInt(item.day) > 31) {
                        itemDay = item.day.replace('0', '');
                    }
                    else {
                        itemDay = item.day;
                    }

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

        postData() {
            let date = new Date(),
                currentDay = date.getDate(),
                currentMonth = date.getMonth() + 1,
                currentYear = date.getFullYear();

            // List selected value into selected money
            let selectedMoney = '';
            this.selected.forEach((value) => {
                selectedMoney = selectedMoney + value + '-';
            });

            // Gather all form value into an array
            let formValue = [
                    currentDay + '/' + currentMonth + '/' + currentYear,
                    this.name,
                    this.phone,
                    this.address,
                    selectedMoney,
                    this.note
                ]
            
            // Params for accessing Google sheet
            const params = {
                // The ID of the spreadsheet to update.
                spreadsheetId: spreadSheetID, 
                // The A1 notation of a range to search for a logical table of data.Values will be appended after the last row of the table.
                range: 'Sheet1', //this is the default spreadsheet name, so unless you've changed it, or are submitting to multiple sheets, you can leave this
                // How the input data should be interpreted.
                valueInputOption: 'RAW', //RAW = if no conversion or formatting of submitted data is needed. Otherwise USER_ENTERED
                // How the input data should be inserted.
                insertDataOption: 'INSERT_ROWS', //Choose OVERWRITE OR INSERT_ROWS
            };

            // Config value range body
            const valueRangeBody = {
                'majorDimension': 'ROWS', // log each entry as a new row (vs column)
                'values': [formValue] // convert the object's values to an array
            };

            // Check if your user is authenticated then login
            if (this.$gapi.isAuthenticated() !== true) {
                this.$gapi.login()
            }

            // Push data to Google sheet file
            this.$gapi.getGapiClient().then((gapi) => {
                let request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
                request.then(function(response) {
                    // TODO: Change code below to process the `response` object
                    console.log(response.result);
                }, function(reason) {
                    console.error('error: ' + reason.result.error.message);
                });
            })

            // Show success message
            this.successMessage = true;

            // Hide form
            this.show = false;
        },

        backToForm() {
            // Show form
            this.show = true;

            // Reset data
            this.onReset();
        },

        onReset() {
            // Reset data
            this.day = null;
            this.month = null;
            this.year = null;
            this.selected = [];
            this.name = '';
            this.phone = '';
            this.address = '';
            this.note = '';
            this.results = [];
            this.alert = false;
            this.empty = false;
            this.infoMessage = false;
            this.successMessage = false;
            // Trick to reset/clear native browser form validation state
            this.show = false;
            this.$nextTick(() => {
                this.show = true
            });
        }
    },

    watch: {
        month() {
            // Watch month change and get data base on selected month
            if (this.month != null) {
                // Set data tab equal selected month
                this.dataTab = parseInt(this.month) < 10 ? this.month.replace('0', '') : this.month;
                // Update data API
                this.dataAPI = 'https://spreadsheets.google.com/feeds/list/' + this.dataID + '/' + this.dataTab + '/public/values?alt=json';
                // Get data
                this.getData();
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
    position: absolute;
}

.money-serial {
    .money-type-500 & {
        left: 30px;
        top: 145px;
    }

    .money-type-1000 & {
        left: 45px;
        top: 78px;
    }
    
    .money-type-2000 & {
        left: 185px;
        top: 62px;
    }

    .money-type-5000 & {
        left: 210px;
        top: 64px;
    }
}

.money-serial-2 {
    .money-type-5000 & {
        left: 75px;
        top: 150px;
    }
}

#action {
    .btn {
        margin: 1rem;
    }
}
</style>
