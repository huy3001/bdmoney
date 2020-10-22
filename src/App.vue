<template>
    <div id="app">
        <div class="py-4 money-page">
            <b-container>
                <!-- Title-->
                <h1 class="mb-4 money-title">
                    Nhập sinh nhật của bạn hoặc người thương
                </h1>

                <!-- Success block -->
                <b-row>
                    <b-col cols="12">
                        <b-alert show variant="success" v-if="successMessage">
                            Cảm ơn bạn đã đặt hàng, chúng tôi sẽ liên hệ và gửi hàng đến bạn sớm nhất có thể 
                        </b-alert>
                        <b-button class="mb-5" type="button" variant="info" @click="backToForm" v-if="successMessage">Tiếp tục chọn tiền</b-button>
                        <UpSell :show="successMessage"/>
                    </b-col>
                </b-row>

                <!-- Choose birthday form -->
                <b-form id="birthday" @reset="onReset" v-if="show">
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
                                <b-button type="button" variant="success" @click="searchMoney">Tìm tiền sinh nhật</b-button>
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
                        <b-col cols="12" sm="12" md="6" v-for="(result, index) in results" :key="index">
                            <b-alert show variant="success">
                                Có 1 tờ {{ result.money * 1000 }} seri {{ result.seri + ' ' + result.day + result.month + result.year }}
                            </b-alert>

                            <b-form-group :class="['position-relative', 'money-form-group', 'money-type-' + result.money * 1000]">
                                <b-img :id="result.money + index" width="700" height="350" src="./images/500d.jpg" fluid alt="500d" v-if="result.money == '0.5'"></b-img>
                                <b-img :id="result.money + index" width="700" height="338" src="./images/1000d.jpg" fluid alt="1000d" v-if="result.money == '1'"></b-img>
                                <b-img :id="result.money + index" width="700" height="341" src="./images/2000d.jpg" fluid alt="2000d" v-if="result.money == '2'"></b-img>
                                <b-img :id="result.money + index" width="700" height="337" src="./images/5000d.jpg" fluid alt="5000d" v-if="result.money == '5'"></b-img>

                                <span class="money-serial">
                                    <span class="money-serial-text">{{ result.seri }}</span>
                                    <span class="money-serial-number">{{ result.day + result.month + result.year }}</span>
                                </span>
                                
                                <span class="money-serial-2" v-if="result.money == '5'">
                                    <span class="money-serial-text">{{ result.seri }}</span>
                                    <span class="money-serial-number">{{ result.day + result.month + result.year }}</span>
                                </span>

                                <b-form-checkbox
                                    class="mt-2"
                                    v-model="selected"
                                    :id="'money-checkbox-' + index"
                                    :name="'money-checkbox-' + index"
                                    :value="result.money * 1000 + ' ' + result.seri + ' ' + result.day + result.month + result.year"
                                >
                                    Chọn mua
                                </b-form-checkbox>
                            </b-form-group>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col cols="12">
                            <b-alert show variant="info" v-if="infoMessage">
                                Thông tin đơn hàng
                            </b-alert>

                            <b-alert show variant="danger" v-if="dataMissing">
                                <p class="mb-0" v-if="selected.length == 0">Bạn phải chọn ít nhất 1 tờ tiền</p>
                                <p class="mb-0" v-if="payment == ''">Vui lòng chọn hình thức thanh toán</p>
                                <p class="mb-0" v-if="payment != '' && bank == ''">Bạn cần chọn ngân hàng để chuyển khoản</p>
                                <p class="mb-0" v-if="infoMissing">Vui lòng điền họ tên, số điện thoại và địa chỉ nhận hàng</p>
                            </b-alert>
                        </b-col>

                        <b-col cols="12" sm="12" md="8" offset-md="2" lg="6" offset-lg="3" v-if="infoMessage">
                            <b-list-group class="text-left mb-3">
                                <b-list-group-item>
                                    <span class="mr-1">Bạn đã chọn:</span>
                                    <span 
                                        class="d-inline-block m-1 p-1 bg-dark text-white rounded money-series"
                                        v-for="(item, index) in selected" 
                                        :key="index"
                                    >
                                        {{ item }}
                                    </span>    
                                </b-list-group-item>

                                <b-list-group-item>
                                    Giá tiền: {{ price | currencyFormat }} / tờ
                                </b-list-group-item>

                                <b-list-group-item>
                                    <span class="money-ship">Phí ship: {{ ship | currencyFormat }}</span>
                                    <span class="text-secondary money-ship-note ml-2" v-if="selected.length < 2">( Mua từ 2 tờ trở lên free ship )</span>
                                    <span class="text-secondary money-ship-note ml-2" v-if="selected.length > 1">( Bạn đã được free ship )</span>
                                </b-list-group-item>

                                <b-list-group-item>
                                    <strong class="money-total">Tổng tiền: {{ total | currencyFormat }}</strong>
                                </b-list-group-item>

                                <b-list-group-item>
                                    <span>Hình thức thanh toán:</span>

                                    <b-form-radio class="mt-3 money-payment" v-model="payment" name="payment-method" value="cash">
                                        <span class="money-payment-text">Thanh toán khi nhận hàng</span>
                                    </b-form-radio>

                                    <b-form-radio class="mt-3 money-payment" v-model="payment" name="payment-method" value="bank">
                                        <span class="money-payment-text">Chuyển khoản trước (Miễn phí ship)</span>
                                        <p class="my-2 text-secondary money-payment-note" v-if="payment == 'bank'">Nội dung chuyển khoản: Tên + SDT đặt hàng</p>
                                    </b-form-radio>

                                    <b-card no-body class="d-flex my-2 money-payment-bank" v-if="payment == 'bank'">
                                        <b-form-radio 
                                            v-for="(item, index) in info.bank"
                                            :key="index"
                                            class="p-4 pl-0 money-bank" 
                                            v-model="bank" 
                                            name="bank-transfer" 
                                            :value="item.name"
                                        >
                                            <b-img :class="['border', {'border-success': bank == item.name}, 'money-bank-logo']" width="200" height="200" :src="item.logo" fluid :alt="item.name"></b-img>

                                            <p class="mb-0 mt-2 money-bank-info" v-if="bank == item.name">
                                                {{ item.account }}
                                                <br>
                                                {{ item.name }}
                                                <br>
                                                {{ item.number }}
                                            </p>
                                        </b-form-radio>
                                    </b-card>
                                </b-list-group-item>
                            </b-list-group>
                        </b-col>

                        <b-col cols="12" sm="12" md="8" offset-md="2" lg="6" offset-lg="3" v-if="infoMessage">
                            <b-form-group id="name">
                                <b-form-input
                                    v-model="name"
                                    placeholder="Họ và tên"
                                    required
                                    :state="infoMissing ? false : null"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>

                        <b-col cols="12" sm="12" md="8" offset-md="2" lg="6" offset-lg="3" v-if="infoMessage">
                            <b-form-group id="phone">
                                <b-form-input
                                    v-model="phone"
                                    placeholder="Số điện thoại"
                                    required
                                    :state="infoMissing ? false : null"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>

                        <b-col cols="12" sm="12" md="8" offset-md="2" lg="6" offset-lg="3" v-if="infoMessage">
                            <b-form-group id="address">
                                <b-form-textarea
                                    v-model="address"
                                    placeholder="Địa chỉ cụ thể (số nhà, tên đường, thôn, xóm)"
                                    rows="3"
                                    no-resize
                                    required
                                    :state="infoMissing ? false : null"
                                ></b-form-textarea>
                            </b-form-group>
                        </b-col>

                        <b-col cols="12" v-if="infoMessage">
                            <b-form-group id="action">
                                <b-button type="reset" variant="danger" class="m-3">Chọn lại</b-button>
                                <b-button type="button" variant="primary" class="m-3" @click="postData">Đặt hàng</b-button>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-form>
            </b-container>
        </div>

        <div class="bg-dark text-white py-4 money-footer" v-if="info">
            <b-container>
                <b-row>
                    <b-col cols="12" sm="12" md="6">
                        <b-card no-body class="bg-dark border-0 text-white money-store">
                            <p class="font-italic font-weight-bold text-warning money-slogan">
                                {{ info.shop.slogan }}
                            </p>
                            <p>
                                <b-icon icon="globe2" class="mr-2"></b-icon>
                                <b-link class="text-white money-website" :href="info.shop.website">{{ info.shop.name }}</b-link>
                            </p>
                            <p>
                                <b-icon icon="telephone" class="mr-2"></b-icon>
                                <span>{{ info.shop.seller }} - <b-link class="text-white money-contact" :href="'tel:' + info.shop.phone | phoneFormat">{{ info.shop.phone }}</b-link></span>
                            </p>
                            <p>
                                <b-icon icon="geo-alt" class="mr-2"></b-icon>
                                <span>{{ info.shop.address }}</span>
                            </p>
                        </b-card>
                    </b-col>

                    <b-col cols="12" sm="12" md="6">
                        <div class="money-facebook">
                            <div 
                                class="fb-page" 
                                :data-href="info.facebook.link" 
                                data-tabs="" 
                                data-width="" 
                                data-height="" 
                                data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"
                            >
                                <blockquote :cite="info.facebook.link" class="fb-xfbml-parse-ignore">
                                    <a :href="info.facebook.link">
                                        {{ info.facebook.name }}
                                    </a>
                                </blockquote>
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
import UpSell from './components/UpSell';
import axios from 'axios';
import {google} from 'googleapis';
import {auth} from 'google-auth-library';

var dataList = [];
// URL of info file
const infoUrl = window.location.href + 'info.json';
// Google sheets instance
const sheets = google.sheets('v4');
// Credentials
const keys = {
    "type": "service_account",
    "project_id": "birthday-money-288815",
    "private_key_id": "09a281b2120fe2f42ee74b9b3e85ab6c1c39d33a",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDdLw4Q6qtLmQvc\nXF/YIjGb64YI7OmAGxnk59MPoTcHOZLaNiNy/WOklybyJUVjlLrTMOcFBjJ2dekz\nfmSMIdnK/BoSIjsAvSZ2b/HYKO6eXhG3MS0exJxtLwiHxfscH7BXBayVdBzyWav9\nUM8s9VAAn8avbmlhU6BCwDGryn6Zmgccy0zSUR8CcXPGv9ppAuI554Q2Hr4Kwocy\n41QPDnInOVfBACVxmfw9GPeV8BhugS/wvIBqVJ1eZ1ZFL3OR7fcjql6xrkBtWPwd\n19egsPgKMaQh5IwlS5pKilcklx0ZAxdGRVYrVVhMWZVl54mbM5X8HcRYzoAPRgfs\nAFMzYFuFAgMBAAECggEACQeYP+mMp6/uU4cz5Ht04gQp+yhM2g2BL56lN7ChsfpQ\nO/dU2CdvD3OaQ+1wmUGjpOaMr+BSZBKpPBBvY2coYIiNOetK1FtkfBZS3bvCDhYS\nDBQGXwiwyCZQ51YWS84hYVQaeRl96wjtJBDN/GxhYT0km9nalH4Y/1CgVn6UT4nu\nTZBfEejKmK/ItGow05wxdU+ta9O6HnICDrhQuUw2tdEYmU8zijwqRDb3blFZTwiP\nMtnGP/Keu0V2ildLmev18g6aoeUrL5TZqACyCDTM9cLHT6fq7+hbpOSCZ4ALccAG\nWukZK7mLcmMBPigDO3R2TANDulhOB+/Hag+QCI3BQQKBgQDuGdFU8kLSGHsgnDRF\nQGn4/lSMMPgOCeWU23qz0NHXMbEMlryXZaCRM6GGs106XeWDi6z9vFFR+GYIHEtC\nYVOHHDNoLA95M0IVT/igtQXcfMpOb1DQau/OShXI1vWEHMsiY19ZCOeXi7oQThiX\nxqR5fJ/9oB9i7VyFmFkjVcZPYQKBgQDtz6xzwgZPc50cXl4cL7lLEXXoIuT1W2o4\n7wfZEWpLD5Oj31C5x69PuyCwue3yEurH9cilxi9vYru2wpL2d7CZ10iWHxEo2Pe7\n54d4SBD+gbUeQWj0PtnzNTW2J4GlD5jr2befYcxRuAQqg3mnZFogbGWLoGzdeupi\nborO1PZypQKBgQC/jcvIkILLreBZEvJGiJT5OfvhMYBPIw0t3glwYt5/Rz4OR7MA\nBkXQq34W9XRagbIlS5joJboyvSmw+rpddBmUCE8fTttAAcn3hXgcKqbFhSvpQEr+\n8hltmFLAWpf5KoUObG4IHk7bsBEIDxxf9vLZvjalAE5f82BNJo0IDXjW4QKBgQDD\nWjHD9cLRSZvqTerpJJsF+5Xr155Vn36mvlSoEBJNDsKtfykFM+/jg0jbZCD/FmMf\nV9w3sZIN4gFppHStWq0L8zmBeIvUDkeTaCJ0wF6Vc1+hNwJMgcTwcOlqdRGe0i1A\nsVyR5Pi+uHdTpSUuSNVwhRr1lBdZ6TrZGQ2V0oOQsQKBgDyiT7avU895gR+tWxm0\n90WRX/C70tcc4Y00l1VDC7/OzRJ1yP+vq+WX/1roSEVFmQbXxoNzXX6rNGNVERZF\nhPTGgP6l4HkWxa9nfWlDY9O+Wha1emY+NULQY1+gTVkiFo71b8VCNU4p9EXECErc\n958WCHYLvjBnh76mEBCi+haa\n-----END PRIVATE KEY-----\n",
    "client_email": "service-account-1@birthday-money-288815.iam.gserviceaccount.com",
    "client_id": "115924957823016828623",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/service-account-1%40birthday-money-288815.iam.gserviceaccount.com"
}

// Parse data from API
function parseData(entries) {
    // Reset data list
    dataList.length = 0;

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
        dataList.push(entry);
    })
}

export default {
    name: "App",
    components: {
        UpSell
    },

    data() {
        return {
            show: true,
            day: null,
            month: null,
            year: null,
            info: null,
            selected: [],
            payment: '',
            bank: '',
            name: '',
            phone: '',
            address: '',
            days: [{ text: "Ngày", value: null }],
            months: [{ text: "Tháng", value: null }],
            years: [{ text: "Năm", value: null }],
            price: 99,
            ship: 30,
            dataTab: '1',
            dataID: '1uXf88Ga0zp10odt1ro2nNKep32rp1ZFEKHRfoopPRn4',
            dataAPI: 'https://spreadsheets.google.com/feeds/list/1uXf88Ga0zp10odt1ro2nNKep32rp1ZFEKHRfoopPRn4/1/public/values?alt=json',
            data: dataList,
            results: [],
            alert: false,
            empty: false,
            dataMissing: false,
            infoMissing: false,
            infoMessage: false,
            successMessage: false
        };
    },

    filters: {
        currencyFormat(value) {
            return value + 'k'
        },

        phoneFormat(value) {
            return value.replace(/\.+/g, '')
        }
    },

    computed: {
        total() {
            let total = 0;
            // Calculate total price
            if (this.selected.length > 0) {
                total = this.price * this.selected.length + this.ship
            }
            return total;
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
        
        getInfo() {
            // Fetch info from json file
            let self = this;
            if (infoUrl != '') {
                axios.get(infoUrl)
                .then(function(response) {
                    // handle success
                    self.info = response.data;
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
                currentYear = date.getFullYear(),
                currentHour = date.getHours(),
                currentMinute = date.getMinutes(),
                currentSecond = date.getSeconds(),
                currentTime = currentDay + '-' + currentMonth + '-' + currentYear + ' ' + currentHour + ':' + currentMinute + ':' + currentSecond;

            // List selected value into selected money
            let selectedMoney = '';
            if (this.selected.length > 0) {
                this.selected.forEach((value) => {
                    selectedMoney = selectedMoney + value + ' - ';
                });
            }

            // Get payment method
            let paymentMethod = '';
            if (this.payment == 'cash') {
                paymentMethod = 'Tiền mặt khi nhận hàng';
            }
            else {
                if (this.bank != '') {
                    paymentMethod = 'Chuyển khoản ' + this.bank;
                }
            }

            // Gather all form value into an array
            let formValue = [
                currentTime,
                this.name,
                this.phone,
                this.address,
                selectedMoney,
                this.total + 'k',
                paymentMethod
            ]
            
            // Check if client is missing or not
            if (this.name != '' && this.phone != '' && this.address != '') {
                this.infoMissing = false;
            }
            else {
                // Missing client
                this.infoMissing = true;
            }

            // Get order info
            let orderInfo = this.info.order;

            // Handle client request
            async function clientRequest() {
                const authClient = await clientAuthorize();
                const request = {
                    // The ID of the spreadsheet to update.
                    spreadsheetId: orderInfo.id, // TODO: Update placeholder value.

                    // The A1 notation of a range to search for a logical table of data.
                    // Values are appended after the last row of the table.
                    range: orderInfo.range, // TODO: Update placeholder value.

                    // How the input data should be interpreted.
                    valueInputOption: 'RAW', // TODO: Update placeholder value.

                    // How the input data should be inserted.
                    insertDataOption: 'INSERT_ROWS', // TODO: Update placeholder value.

                    // TODO: Add desired properties to the request body.
                    resource: {
                        'majorDimension': 'ROWS', // log each entry as a new row (vs column)
                        'values': [formValue] // convert the object's values to an array
                    },

                    auth: authClient,
                };

                try {
                    const response = (await sheets.spreadsheets.values.append(request)).data;
                    // TODO: Change code below to process the `response` object:
                    if (response) {
                        console.log('Success');
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            // Handle authorize client
            async function clientAuthorize() {
                // TODO: Change placeholder below to generate authentication credentials. See
                // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
                //
                // Authorize using one of the following scopes:
                //   'https://www.googleapis.com/auth/drive'
                //   'https://www.googleapis.com/auth/drive.file'
                //   'https://www.googleapis.com/auth/spreadsheets'

                let authClient = auth.fromJSON(keys);
                authClient.scopes = ['https://www.googleapis.com/auth/spreadsheets'];

                if (authClient == null) {
                    throw Error('authentication failed');
                }

                return authClient;
            }

            // Handle back to top of page
            function backToTop() {
                window.scrollTo(0, 0);
            }

            // Check data is not empty and post
            if (this.selected.length > 0 && this.payment != '' && this.bank != '' && this.name != '' && this.phone != '' && this.address != '') {
                this.dataMissing = false;
                // Show success message
                this.successMessage = true;
                // Hide form
                this.show = false;
                // Send request to Google sheets
                clientRequest();
                // Back to top
                backToTop();
            }
            else {
                // Missing info
                this.dataMissing = true;
            }
        },

        backToForm() {
            // Reset data
            this.onReset();
        },

        onReset() {
            // Reset data
            this.day = null;
            this.month = null;
            this.year = null;
            this.selected = [];
            this.payment = '';
            this.bank = '';
            this.name = '';
            this.phone = '';
            this.address = '';
            this.results = [];
            this.alert = false;
            this.empty = false;
            this.dataMissing = false;
            this.infoMissing = false;
            this.infoMessage = false;
            this.successMessage = false;
            // Trick to reset/clear native browser form validation state
            this.show = false;
            this.$nextTick(() => {
                this.show = true
            });
        },

        loadFacebookScript() {
            this.$loadScript("https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v8.0")
            .then(() => {
                // Script is loaded, do something
                this.$nextTick(() => {
                    window.FB.XFBML.parse();
                });
            })
            .catch(() => {
                // Failed to fetch script
                console.log('Script loading error');
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
        },

        selected() {
            // Watch selected change and update ship fee
            if (this.selected.length > 1) {
                this.ship = 0
            }
            else {
                this.ship = 30
            }
        },

        payment() {
            // Watch payment change and update ship fee
            if (this.payment == 'bank') {
                this.bank = '';
                this.ship = 0;
            }
            else {
                this.bank = this.payment;
                if (this.selected.length < 2) {
                    this.ship = 30
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
        // Get data
        this.getData();
        // Get info
        this.getInfo();
        // Load facebook script
        this.loadFacebookScript();
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/bootstrap";
@import "node_modules/bootstrap-vue/src/index.scss";
@import "node_modules/bootstrap-vue/src/icons.scss";

@font-face {
    font-family: 'Abel';
    src: url('./fonts/Abel-Regular.eot');
    src: url('./fonts/Abel-Regular.eot?#iefix') format('embedded-opentype'),
        url('./fonts/Abel-Regular.woff2') format('woff2'),
        url('./fonts/Abel-Regular.woff') format('woff'),
        url('./fonts/Abel-Regular.ttf') format('truetype'),
        url('./fonts/Abel-Regular.svg#Abel-Regular') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'NHL Washington';
    src: url('./fonts/NHLWashington.eot');
    src: url('./fonts/NHLWashington.eot?#iefix') format('embedded-opentype'),
        url('./fonts/NHLWashington.woff2') format('woff2'),
        url('./fonts/NHLWashington.woff') format('woff'),
        url('./fonts/NHLWashington.ttf') format('truetype'),
        url('./fonts/NHLWashington.svg#NHLWashington') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}

#app {
    color: #000000;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
    text-align: center;
}

.list-group-item {
    padding: 0.375rem 0.75rem;
}

.money {
    &-page {
        min-height: 50vh;

        @media (min-width: 768px) {
            min-height: 100vh;
        }
    }

    &-title {
        font-size: 1.5rem;

        @media (min-width: 768px) {
            font-size: 2rem;
        }

        @media (min-width: 1200px) {
            font-size: 2.5rem;
        }
    }
    
    &-form-group {
        .img-fluid {
            pointer-events: none;
        }
    }

    &-serial,
    &-serial-2 {
        color: #C23927;
        font-size: 50%;
        letter-spacing: 2px;
        position: absolute;

        @media (min-width: 400px) {
            font-size: 70%;
        }

        @media (min-width: 576px) {
            font-size: 100%;
        }

        @media (min-width: 768px) {
            font-size: 60%;
        }

        @media (min-width: 992px) {
            font-size: 90%;
        }

        @media (min-width: 1200px) {
            font-size: 100%;
        }
    }

    &-serial {
        &-text {
            font-family: 'NHL Washington', sans-serif;
        }

        &-number {
            font-family: 'Abel', sans-serif;
            font-weight: 700;
            margin-left: 5px;

            @media (min-width: 1200px) {
                margin-left: 10px;
            }
        }

        .money-type-500 & {
            color: #C54247;
            left: 8%;
            top: 48%;

            @media (min-width: 400px) {
                top: 50%;
            }

            @media (min-width: 576px) {
                top: 51%;
            }

            @media (min-width: 768px) {
                top: 49%;
            }

            @media (min-width: 992px) {
                top: 50%;
            }

            @media (min-width: 1200px) {
                top: 51%;
            }
        }

        .money-type-1000 & {
            left: 7%;
            top: 26%;

            @media (min-width: 400px) {
                top: 28%;
            }
        }
        
        .money-type-2000 & {
            left: 39%;
            top: 23%;
        }

        .money-type-5000 & {
            left: 39%;
            top: 20%;

            @media (min-width: 400px) {
                top: 21%;
            }
        }
    }

    &-serial-2 {
        .money-type-5000 & {
            left: 15%;
            top: 51%;

            @media (min-width: 1200px) {
                top: 53%;
            }
        }
    }

    &-series {
        font-size: 80%;
    }

    &-ship-note {
        font-size: 70%;

        @media (min-width: 768px) {
            font-size: 80%;
        }
    }

    &-payment {
        &-text {
            font-size: 90%;

            @media (min-width: 768px) {
                font-size: 100%;
            }
        }

        &-note {
            font-size: 70%;

            @media (min-width: 768px) {
                font-size: 80%;
            }
        }

        &-bank {
            flex-flow: row nowrap;
        }
    }

    &-bank {
        &-logo {
            @media (min-width: 768px) {
                max-width: 125px;
            }
        }

        &-info {
            font-size: 90%;

            @media (min-width: 768px) {
                font-size: 100%;
            }
        }

        .custom-control-label {
            &::before,
            &::after {
                left: .5rem;
                top: .5rem;
            }
        }
    }

    &-slogan {
        font-family: 'Times New Roman', sans-serif;

        @media (min-width: 768px) {
            margin-top: 1rem;
        }
    }

    &-store {
        font-size: 80%;
        margin-bottom: .5rem;
        text-align: left;

        @media (min-width: 768px) {
            font-size: 100%;
            margin-bottom: 0;
        }

        p {
            margin-bottom: .5rem;

            @media (min-width: 768px) {
                margin-bottom: 1rem;
            }
        }
    }

    &-facebook {
        width: 100%;
        text-align: center;

        @media (min-width: 768px) {
            text-align: right;
        }
    }
}
</style>
