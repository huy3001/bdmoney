<template>
    <div id="app">
        <b-container>
            <HelloWorld msg="Nhập sinh nhật của bạn hoặc người thương" />

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
                            Có 1 tờ {{ result.money * 1000 }} seri {{ result.seri + result.day + result.month + result.year }}
                        </b-alert>

                        <b-form-group :class="['money-form-group', 'money-type-' + result.money * 1000]">
                            <b-img :id="result.money + index" width="700" height="349" src="./images/500d.jpg" fluid alt="500d" v-if="result.money === '0.5'"></b-img>
                            <b-img :id="result.money + index" width="700" height="338" src="./images/1000d.jpg" fluid alt="1000d" v-if="result.money === '1'"></b-img>
                            <b-img :id="result.money + index" width="700" height="341" src="./images/2000d.jpg" fluid alt="2000d" v-if="result.money === '2'"></b-img>
                            <b-img :id="result.money + index" width="700" height="337" src="./images/5000d.jpg" fluid alt="5000d" v-if="result.money === '5'"></b-img>

                            <span class="money-serial">
                                <span class="money-serial-text">{{ result.seri }}</span>
                                <span class="money-serial-number">{{ result.day + result.month + result.year }}</span>
                            </span>
                            
                            <span class="money-serial-2" v-if="result.money === '5'">
                                <span class="money-serial-text">{{ result.seri }}</span>
                                <span class="money-serial-number">{{ result.day + result.month + result.year }}</span>
                            </span>

                            <b-form-checkbox
                                v-model="selected"
                                :id="'money-checkbox-' + index"
                                :name="'money-checkbox-' + index"
                                :value="result.money * 1000 + result.seri + result.day + result.month + result.year"
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
                    </b-col>

                    <b-col cols="12" sm="12" md="8" offset-md="2" lg="6" offset-lg="3" v-if="infoMessage">
                        <div class="money-selected">
                            <p>
                                <span>Bạn đã chọn:</span>
                            </p>
                            <p class="money-series">
                                <span v-for="(item, index) in selected" :key="index">
                                    {{ item }}
                                </span>
                            </p>
                        </div>

                        <div class="money-payment">
                            <p class="money-price">
                                <span>Giá tiền: {{ price | currencyFormat }} / tờ</span>
                                <span>Phí ship: {{ ship | currencyFormat }}</span>
                            </p>
                            <p class="money-total">
                                Tổng tiền: {{ total | currencyFormat }}
                            </p>
                        </div>

                        <div class="money-promotion">
                            <p v-if="selected.length < 2">( Chọn mua từ 2 tờ trở lên để được free ship )</p>
                            <p v-if="selected.length > 1">( Bạn đã được free ship )</p>
                        </div>
                    </b-col>

                    <b-col cols="12" sm="12" md="8" offset-md="2" lg="6" offset-lg="3" v-if="infoMessage">
                        <b-form-group id="name">
                            <b-form-input
                                v-model="name"
                                placeholder="Họ và tên"
                                required
                            ></b-form-input>
                        </b-form-group>
                    </b-col>

                    <b-col cols="12" sm="12" md="8" offset-md="2" lg="6" offset-lg="3" v-if="infoMessage">
                        <b-form-group id="phone">
                            <b-form-input
                                v-model="phone"
                                placeholder="Số diện thoại"
                                required
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
                            ></b-form-textarea>
                        </b-form-group>
                    </b-col>

                    <!-- <b-col cols="12" sm="12" md="8" offset-md="2" lg="6" offset-lg="3" v-if="infoMessage">
                        <b-form-group id="note">
                            <b-form-textarea
                                v-model="note"
                                placeholder="Nội dung in chữ miễn phí"
                                rows="3"
                                no-resize
                            ></b-form-textarea>
                        </b-form-group>
                    </b-col> -->
                    
                    <b-col cols="12" v-if="infoMessage">
                        <b-form-group id="action">
                            <b-button type="button" variant="primary" @click="postData">Đặt hàng</b-button>
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
const spreadSheetID = '1uCn1fcifyUBmhz8loC9sD2TZbpRuPiUWtCeCK6Lrqkw';

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

// Draw money image based on data
// function drawImageByCanvas(imageId, imageUrl, serialColor, serial, number, leftPosition, topPosition) {
//     var image = document.getElementById(imageId),
//         imageWidth = image.offsetWidth,
//         imageHeight = image.offsetHeight,
//         wmCanvas = document.createElement('canvas'),
//         wmCtx = wmCanvas.getContext('2d');

//     // Create temporary image
//     var newImage  = new Image();
//     newImage.src = imageUrl;

//     // Load image and draw watermark
//     if (image) {
//         image.addEventListener('load', drawWatermark);
//     }

//     // Draw watermark
//     function drawWatermark() {
//         // Set size of temporary image and watermark canvas
//         wmCanvas.width = newImage.width = imageWidth;
//         wmCanvas.height = newImage.height = imageHeight;
//         // Render watermark canvas with size above 
//         wmCtx.drawImage(newImage, 0, 0, imageWidth, imageHeight);
//         // Fill text, color and font
//         wmCtx.fillStyle = serialColor;
//         wmCtx.font = '16px NHL Washington';
//         wmCtx.fillText(serial, leftPosition, topPosition);
//         wmCtx.font = '700 17px Abel';
//         wmCtx.fillText(number, leftPosition + 30, topPosition);
//         // Fill more text if image is 5000d
//         if (imageUrl.includes('5000d')) {
//             wmCtx.font = '16px NHL Washington';
//             wmCtx.fillText(serial, leftPosition - 130, topPosition + 90);
//             wmCtx.font = '700 17px Abel';
//             wmCtx.fillText(number, leftPosition - 100, topPosition + 90);
//         }
//         // Replace image src by watermark canvas data url
//         image.src = wmCanvas.toDataURL('image/jpeg', 1);
//     }
// }

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
            // note: '',
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
            infoMessage: false,
            successMessage: false
        };
    },

    filters: {
        currencyFormat(value) {
            return value + 'k'
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
            if (this.dataAPI !== '') {
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
            if (this.day === null || this.month === null || this.year === null) {
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

                    if (itemDay === selectedDay && itemMonth === selectedMonth) {
                        item.year.forEach((value) => {
                            itemYear = parseInt(value);
                            if (itemYear === selectedYear) {
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
                if (resultList.length === 0) {
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

        // drawMoney() {
        //     if (this.results.length > 0) {
        //         // Set data to draw money
        //         let imageId, imageUrl, serialColor, serial, number, leftPosition, topPosition;
        //         this.results.forEach((result, index) => {
        //             switch(result.money) {
        //                 case '0.5':
        //                     imageId = result.money + index;
        //                     imageUrl = './images/500d.jpg';
        //                     serialColor = '#C54247';
        //                     leftPosition = 50;
        //                     topPosition = 170;
        //                     break;
        //                 case '1':
        //                     imageId = result.money + index;
        //                     imageUrl = './images/1000d.jpg';
        //                     serialColor = '#C23927';
        //                     leftPosition = 40;
        //                     topPosition = 100;
        //                     break;
        //                 case '2':
        //                     imageId = result.money + index;
        //                     imageUrl = './images/2000d.jpg';
        //                     serialColor = '#C23927';
        //                     leftPosition = 210;
        //                     topPosition = 85;
        //                     break;
        //                 case '5':
        //                     imageId = result.money + index;
        //                     imageUrl = './images/5000d.jpg';
        //                     serialColor = '#C23927';
        //                     leftPosition = 210;
        //                     topPosition = 80;
        //                     break;
        //                 default:
        //                     // Nothing
        //             }

        //             serial = result.seri;
        //             number = result.day + result.month + result.year;
                    
        //             // Call draw image by canvas
        //             drawImageByCanvas(imageId, imageUrl, serialColor, serial, number, leftPosition, topPosition);
        //         })
        //     }
        // },

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
                    this.total + 'k',
                    // this.note
                ]
            
            // Params for accessing Google sheet
            const params = {
                // The ID of the spreadsheet to update.
                spreadsheetId: spreadSheetID, 
                // The A1 notation of a range to search for a logical table of data.Values will be appended after the last row of the table.
                range: 'Tháng ' + this.dataTab, // this is the default spreadsheet name, so unless you've changed it, or are submitting to multiple sheets, you can leave this
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
            else {
                // Show success message
                this.successMessage = true;

                // Hide form
                this.show = false;
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
            this.name = '';
            this.phone = '';
            this.address = '';
            // this.note = '';
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
            if (this.month !== null) {
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
    },

    // updated() {
    //     // Draw moeny
    //     this.drawMoney();
    // }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/bootstrap";
@import "node_modules/bootstrap-vue/src/index.scss";

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
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.money {
    &-form-group {
        position: relative;
        
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
            left: 9%;
            top: 50%;

            @media (min-width: 400px) {
                top: 52%;
            }

            @media (min-width: 768px) {
                top: 50%;
            }

            @media (min-width: 992px) {
                top: 52%;
            }

            @media (min-width: 1200px) {
                top: 53%;
            }
        }

        .money-type-1000 & {
            left: 7%;
            top: 28%;

            @media (min-width: 400px) {
                top: 29%;
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

            @media (min-width: 400px) {
                top: 53%;
            }

            @media (min-width: 1200px) {
                top: 55%;
            }
        }
    }

    &-price {
        display: flex;
        justify-content: space-between;
    }
}

#action {
    .btn {
        margin: 1rem;
    }
}
</style>
