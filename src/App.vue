<template>
    <div id="app">
        <div class="py-4 money-page">
            <b-container>
                <!-- Title-->
                <h1 class="mb-4 money-title" v-if="show">
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

                <b-form id="birthday" @reset="onReset" v-if="show">
                    <!-- Choose birthday form -->
                    <BirthdayForm 
                        :data="getData"
                        :data-id="dataID"
                        :other-data-id="otherDataID"
                        :multiple-data="getMultipleData"
                        @search="searchMoney"
                    />

                    <!-- Messages -->
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

                    <!-- Result list -->
                    <ResultList
                        :results="results"
                        :serial-key="serialKey"
                        @select="selectMoney"
                    />

                    <!-- Order info -->
                    <OrderInfo
                        :info-message="infoMessage"
                        :data-missing="dataMissing"
                        :info-missing="infoMissing"
                        :selected="selected"
                        :payment="payment"
                        :bank="bank"
                        :ship="ship"
                        @post="postData"
                    />
                </b-form>
            </b-container>
        </div>

        <!-- Footer -->
        <Footer :info="info"/>
    </div>
</template>

<script>
import UpSell from './components/UpSell';
import BirthdayForm from './components/BirthdayForm';
import ResultList from './components/ResultList';
import OrderInfo from './components/OrderInfo';
import Footer from './components/Footer';
import axios from 'axios';
import {google} from 'googleapis';
import {auth} from 'google-auth-library';
import {dataList, parseData, parseOtherData} from './helper';

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

export default {
    name: "App",
    components: {
        UpSell, BirthdayForm, ResultList, OrderInfo, Footer
    },

    data() {
        return {
            show: true,
            info: null,
            selected: [],
            payment: 'cash',
            bank: 'bank',
            price: 99,
            ship: 30,
            dataID: '1uXf88Ga0zp10odt1ro2nNKep32rp1ZFEKHRfoopPRn4',
            dataAPI: 'https://spreadsheets.google.com/feeds/list/1uXf88Ga0zp10odt1ro2nNKep32rp1ZFEKHRfoopPRn4/1/public/values?alt=json',
            otherDataID: '14fPgycN0WGXYfCk_7kAA3MSFVyBUtdtmdUg9dY5N_g4',
            otherDataAPI: 'https://spreadsheets.google.com/feeds/list/14fPgycN0WGXYfCk_7kAA3MSFVyBUtdtmdUg9dY5N_g4/1/public/values?alt=json',
            data: dataList,
            results: [],
            serialKey: 0,
            alert: false,
            empty: false,
            dataMissing: false,
            infoMissing: false,
            infoMessage: false,
            successMessage: false
        };
    },

    methods: {
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

        searchMoney(day, month, year) {
            if (day == null || month == null || year == null) {
                // Show alert
                this.alert = true;
            }
            else {
                let selectedDay = parseInt(day) < 10 ? day.replace('0', '') : day,
                    selectedMonth = parseInt(month) < 10 ? month.replace('0', '') : month,
                    selectedDate = selectedDay.toString() + selectedMonth.toString(),
                    selectedYear = year;

                // Hide alert
                this.alert = false;

                // Change serial key
                this.serialKey +=1;

                // Find birthday in data
                let itemDay, itemMonth, itemDate, itemYear, itemPrice, result, resultList = [];

                // Reset result list
                resultList.length = 0;

                this.data.forEach((item) => {
                    if (parseInt(item.day) < 10 || parseInt(item.day) > 31) {
                        itemDay = item.day.replace('0', '');
                    }
                    else {
                        itemDay = item.day;
                    }

                    itemMonth = item.month;
                    itemDate = itemDay + itemMonth;

                    if (itemDate == selectedDate) {
                        item.year.forEach((value) => {
                            itemYear = parseInt(value);
                            if (itemYear == selectedYear) {
                                // Set price for each money
                                switch(item.money) {
                                    case '0.5':
                                        itemPrice = this.info.price.fivehundred;
                                        break;
                                    case '1':
                                        itemPrice = this.info.price.onethousand;
                                        break;
                                    case '2':
                                        itemPrice = this.info.price.twothousand;
                                        break;
                                    case '5':
                                        itemPrice = this.info.price.fivethousand;
                                        break;
                                    case '10':
                                        itemPrice = this.info.price.tenthousand;
                                        break;
                                    case '20':
                                        itemPrice = this.info.price.twentythousand;
                                        break;
                                    case '50':
                                        itemPrice = this.info.price.fiftythousand;
                                        break;
                                    default:
                                        itemPrice = this.price;
                                }

                                // Create result object
                                result = {
                                    'day': item.day,
                                    'month': item.month,
                                    'year': selectedYear,
                                    'money': item.money,
                                    'price': itemPrice,
                                    'seri': item.seri
                                }

                                // Push result into result list
                                resultList.push(result);
                            }
                        })
                    }
                })

                // Show or hide message when result is empty or not
                let timeoutFunction = null;
                clearTimeout(timeoutFunction);
                timeoutFunction = setTimeout(() => {
                    if (resultList.length == 0) {
                        this.empty = true;
                        this.infoMessage = false;
                    }
                    else {
                        this.empty = false;
                        this.infoMessage = true;
                    }
                }, 200);
                
                // Assign result list to results
                this.results = resultList;

                // Split money serial
                this.moneySerialSplit();

                // Add fly effect when select money
                this.moneyFlyEffect();
            }
        },

        selectMoney(selected, ship) {
            this.selected = selected;
            this.ship = ship;
        },

        postData(name, phone, address, total) {
            // Get current time
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
                    selectedMoney = selectedMoney + value.money + ' - ';
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
                name,
                phone,
                address,
                selectedMoney,
                total + '000',
                paymentMethod
            ]

            // Check if client is missing or not
            if (name != '' && phone != '' && address != '') {
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

            // Check data is not empty and post
            if (this.selected.length > 0 && this.payment != '' && this.bank != '' && name != '' && phone != '' && address != '') {
                this.dataMissing = false;
                // Show success message
                this.successMessage = true;
                // Hide form
                this.show = false;
                // Send request to Google sheets
                clientRequest();
                // Back to top
                this.backToTop();
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
            this.selected = [];
            this.payment = '';
            this.bank = '';
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
            // Back to top
            this.backToTop();
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
        },

        backToTop() {
            // Handle back to top of page
            window.scrollTo(0, 0);
        },

        moneySerialSplit() {
            let timeoutFunction = null;
            clearTimeout(timeoutFunction);
            timeoutFunction = setTimeout(() => {
                let moneySerialText = document.querySelectorAll('.money-serial-vertical .money-serial-text, .money-serial-horizontal .money-serial-text');
                moneySerialText.forEach((serialTextItem) => {
                    // Split money serial text into characters
                    serialTextItem.innerHTML = serialTextItem.textContent.replace(/\D/g, "<span class='character'>$&</span>");
                })

                let moneySerialNumber = document.querySelectorAll('.money-serial-vertical .money-serial-number, .money-serial-horizontal .money-serial-number');
                moneySerialNumber.forEach((serialNumberItem) => {
                    // Split money serial text into characters
                    serialNumberItem.innerHTML = serialNumberItem.textContent.replace(/\d/g, "<span class='character number'>$&</span>");
                })
            }, 200);
        },

        moneyFlyEffect() {
            let timeoutFunction = null;
            clearTimeout(timeoutFunction);
            timeoutFunction = setTimeout(() => {
                const   root = document.documentElement,
                        moneyOrder = document.querySelector('.money-order');
                let moneyOrderRect = moneyOrder ? moneyOrder.getBoundingClientRect() : null,
                    moneyCheckbox = document.querySelectorAll('.money-checkbox');
                let checkedItem, checkedImage, 
                    moneyOrderLeft, moneyOrderTop, 
                    checkedImageRect, checkedImageLeft, checkedImageTop;
                moneyCheckbox.forEach((checkboxItem) => {
                    checkboxItem.addEventListener('click', (event) => {
                        checkedItem = event.target.closest('.money-form-group');
                        checkedImage = checkedItem.querySelector('.money-image');
                        if (event.target.checked) {
                            // Get order position
                            moneyOrderLeft = Math.round(moneyOrderRect.x);
                            moneyOrderTop = Math.round(moneyOrderRect.y);
                            // Get checked image position
                            checkedImageRect = checkedImage ? checkedImage.getBoundingClientRect() : null;
                            checkedImageLeft = Math.round(checkedImageRect.x);
                            checkedImageTop = Math.round(checkedImageRect.y);
                            // Set order position to document styles
                            root.style.setProperty('--order-left', moneyOrderLeft - checkedImageLeft + 'px');
                            root.style.setProperty('--order-top', moneyOrderTop - checkedImageTop + 'px');
                            // Add flying class for money image
                            checkedImage.classList.add('money-image-flying');
                            // Remove flying class after 1s
                            setTimeout(() => {
                                checkedImage.classList.remove('money-image-flying');
                            }, 1500)
                        }
                    })
                })
            }, 200);
        }
    },

    watch: {
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
        // Get data
        this.getData(this.dataAPI, parseData);
        // Get other data
        this.getData(this.otherDataAPI, parseOtherData);
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

@font-face {
    font-family: 'Roboto';
    src: url('./fonts/Roboto-Regular.eot');
    src: url('./fonts/Roboto-Regular.eot?#iefix') format('embedded-opentype'),
        url('./fonts/Roboto-Regular.woff2') format('woff2'),
        url('./fonts/Roboto-Regular.woff') format('woff'),
        url('./fonts/Roboto-Regular.ttf') format('truetype'),
        url('./fonts/Roboto-Regular.svg#Roboto-Regular') format('svg');
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

    &-image {
        left: 0;
        position: absolute;
        top: 0;
        transition: left 1.5s ease-in-out, opacity 1.5s ease-in-out, top 1.5s ease-in-out, transform 1.5s ease-in-out;
        visibility: hidden;
        z-index: 9;

        &-flying {
            left: var(--order-left);
            opacity: 0;
            top: var(--order-top);
            visibility: visible;
            transform: scale(0);
        }
    }

    &-serial,
    &-serial-second {
        color: #C23927;
        font-size: 50%;
        letter-spacing: 2px;
        position: absolute;
        z-index: 10;

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

            .money-serial-vertical &,
            .money-serial-horizontal & {
                font-family: 'Roboto', sans-serif;
            }

            .money-serial-vertical & {
                display: block;
            }
        }

        &-number {
            font-family: 'Abel', sans-serif;
            font-weight: 700;
            margin-left: 5px;

            .money-serial-vertical &,
            .money-serial-horizontal & {
                font-family: 'Roboto', sans-serif;
                font-weight: 400;
            }

            .money-serial-vertical & {
                display: block;
                margin-left: 0;
            }

            .money-serial-horizontal & {
                @for $i from 1 through 8 {
                    span:nth-child(#{$i}) {
                        font-size: calc(#{$i} * 5% + 95%);
                    }
                }
            }

            @media (min-width: 1200px) {
                margin-left: 10px;

                .money-serial-vertical & {
                    margin-left: 0;
                }
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

    &-serial-second {
        .money-type-5000 & {
            left: 15%;
            top: 51%;

            @media (min-width: 1200px) {
                top: 53%;
            }
        }
    }

    &-serial-vertical {
        line-height: 1;

        @media (min-width: 400px) {
            font-size: 68%;
        }

        @media (min-width: 576px) {
            font-size: 80%;
        }
        
        @media (min-width: 768px) {
            font-size: 50%;
        }

        @media (min-width: 992px) {
            font-size: 74%;
        }

        @media (min-width: 1200px) {
            font-size: 88%;
        }

        .money-type-10000 & {
            left: 2%;
            top: 15%;
        }

        .money-type-20000 & {
            left: 4%;
            top: 20%;
        }

        .money-type-50000 & {
            left: 4%;
            top: 20%;
        }

        .character {
            display: block;
        }
    }

    &-serial-horizontal {
        color: #555555;
        letter-spacing: 1px;
        line-height: 1;

        @media (min-width: 400px) {
            letter-spacing: 2px;
        }

        @media (min-width: 576px) {
            font-size: 95%;
        }

        @media (min-width: 768px) {
            font-size: 55%;
        }

        @media (min-width: 992px) {
            font-size: 82%;
        }

        @media (min-width: 1200px) {
            font-size: 100%;
        }

        .money-type-10000 & {
            left: 75%;
            top: 72%;

            @media (min-width: 400px) {
                left: 70%;
                top: 73%;
            }

            @media (min-width: 576px) {
                top: 77%;
            }

            @media (min-width: 768px) {
                top: 71%;
            }

            @media (min-width: 992px) {
                top: 75%;
            }

            @media (min-width: 1200px) {
                top: 77%;
            }
        }

        .money-type-20000 & {
            left: 76%;
            top: 72%;

            @media (min-width: 400px) {
                left: 73%;
                top: 73%;
            }

            @media (min-width: 576px) {
                top: 75%;
            }

            @media (min-width: 768px) {
                top: 71%;
            }

            @media (min-width: 992px) {
                top: 73%;
            }

            @media (min-width: 1200px) {
                top: 75%;
            }
        }

        .money-type-50000 & {
            left: 75%;
            top: 73%;

            @media (min-width: 400px) {
                left: 72%;
            }

            @media (min-width: 576px) {
                top: 75%;
            }

            @media (min-width: 768px) {
                top: 72%;
            }

            @media (min-width: 992px) {
                top: 74%;
            }

            @media (min-width: 1200px) {
                top: 76%;
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

    &-order {
        .form-control {
            border: none;
            color: #000000;
            height: 1.5rem;
            padding: 0;

            &::-webkit-input-placeholder,
            &:-moz-placeholder,
            &::-moz-placeholder,
            &:-ms-input-placeholder {
                color: #000000;
            }

            &:focus {
                box-shadow: none;
            }
        }

        textarea {
            &.form-control {
                height: auto;
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
