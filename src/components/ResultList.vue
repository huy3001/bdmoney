<template>
    <b-row>
        <b-col cols="12" sm="12" md="6" v-for="(result, index) in results" :key="index">
            <b-card no-body class="text-center mb-3 p-2">
                <b-card-text>
                    Có 1 tờ <b class="text-success">{{ result.money * 1000 }}</b> seri <b class="text-success">{{ result.seri + ' ' + result.day + result.month + result.year }}</b>
                </b-card-text>

                <b-form-group class="mb-0 position-relative money-form-group" :class="['money-type-' + result.money * 1000]">
                    <b-img :id="result.money + index" width="700" height="337" src="./images/500d.jpg" fluid alt="500d" v-if="result.money == '0.5'"></b-img>
                    <b-img class="money-image" width="700" height="337" src="./images/500d.jpg" fluid alt="500d" v-if="result.money == '0.5'"></b-img>

                    <b-img :id="result.money + index" width="700" height="337" src="./images/1000d.jpg" fluid alt="1000d" v-if="result.money == '1'"></b-img>
                    <b-img class="money-image" width="700" height="337" src="./images/1000d.jpg" fluid alt="1000d" v-if="result.money == '1'"></b-img>
                    
                    <b-img :id="result.money + index" width="700" height="337" src="./images/2000d.jpg" fluid alt="2000d" v-if="result.money == '2'"></b-img>
                    <b-img class="money-image" width="700" height="337" src="./images/2000d.jpg" fluid alt="2000d" v-if="result.money == '2'"></b-img>
                    
                    <b-img :id="result.money + index" width="700" height="337" src="./images/5000d.jpg" fluid alt="5000d" v-if="result.money == '5'"></b-img>
                    <b-img class="money-image" width="700" height="337" src="./images/5000d.jpg" fluid alt="5000d" v-if="result.money == '5'"></b-img>
                    
                    <b-img :id="result.money + index" width="700" height="337" src="./images/10000d.jpg" fluid alt="10000d" v-if="result.money == '10'"></b-img>
                    <b-img class="money-image" width="700" height="337" src="./images/10000d.jpg" fluid alt="10000d" v-if="result.money == '10'"></b-img>
                    
                    <b-img :id="result.money + index" width="700" height="337" src="./images/20000d.jpg" fluid alt="20000d" v-if="result.money == '20'"></b-img>
                    <b-img class="money-image" width="700" height="337" src="./images/20000d.jpg" fluid alt="20000d" v-if="result.money == '20'"></b-img>
                    
                    <b-img :id="result.money + index" width="700" height="337" src="./images/50000d.jpg" fluid alt="50000d" v-if="result.money == '50'"></b-img>
                    <b-img class="money-image" width="700" height="337" src="./images/50000d.jpg" fluid alt="50000d" v-if="result.money == '50'"></b-img>

                    <b-img :id="result.money + index" width="700" height="337" src="./images/100000d.jpg" fluid alt="100000d" v-if="result.money == '100'"></b-img>
                    <b-img class="money-image" width="700" height="337" src="./images/100000d.jpg" fluid alt="100000d" v-if="result.money == '100'"></b-img>
                    
                    <b-img :id="result.money + index" width="700" height="337" src="./images/200000d.jpg" fluid alt="2000000d" v-if="result.money == '200'"></b-img>
                    <b-img class="money-image" width="700" height="337" src="./images/200000d.jpg" fluid alt="200000d" v-if="result.money == '200'"></b-img>

                    <b-img :id="result.money + index" width="700" height="337" src="./images/500000d.jpg" fluid alt="5000000d" v-if="result.money == '500'"></b-img>
                    <b-img class="money-image" width="700" height="337" src="./images/500000d.jpg" fluid alt="500000d" v-if="result.money == '500'"></b-img>

                    <span :class="['money-serial', {'money-serial-vertical': result.money == '10' || result.money == '20' || result.money == '50' || result.money == '100' || result.money == '200'  || result.money == '500'}]" :key="serialKey">
                        <span class="money-serial-text">{{ result.seri }}</span>
                        <span class="money-serial-number">{{ result.day + result.month + result.year }}</span>
                    </span>
                    
                    <span :class="['money-serial-second', {'money-serial-horizontal': result.money == '10' || result.money == '20' || result.money == '50' || result.money == '100' || result.money == '200'  || result.money == '500'}]" v-if="result.money == '5' || result.money == '10' || result.money == '20' || result.money == '50' || result.money == '100' || result.money == '200'  || result.money == '500'" :key="serialKey + 1">
                        <span class="money-serial-text">{{ result.seri }}</span>
                        <span class="money-serial-number">{{ result.day + result.month + result.year }}</span>
                    </span>

                    <div class="d-flex justify-content-between money-info">
                        <span class="mt-2 money-price">Giá bán: <b>{{ result.price | currencyFormat }}</b></span>

                        <b-form-checkbox
                            class="mt-2 money-checkbox"
                            v-model="selected"
                            :id="'money-checkbox-' + index"
                            :name="'money-checkbox-' + index"
                            :value="{ 
                                'money': result.money * 1000 + ' ' + result.seri + ' ' + result.day + result.month + result.year,
                                'type': result.money * 1000,
                                'seri': result.seri + ' ' + result.day + result.month + result.year,
                                'price': result.price 
                            }"
                        >
                            Chọn mua
                        </b-form-checkbox>
                    </div>
                </b-form-group>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
export default {
    name: "ResultList",
    props: {
        results: Array,
        serialKey: Number
    },

    data() {
        return {
            selected: [],
            ship: null
        }
    },

    filters: {
        currencyFormat(value) {
            return value + 'k'
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
            // Handle selected money and ship fee
            this.$emit('select', this.selected, this.ship);
        }
    }
}
</script>

<style lang="scss">
    .money {
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

            .character {
                display: block;
            }

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

            .money-type-100000 & {
                left: 2%;
                top: 20%;
            }

            .money-type-200000 & {
                left: 3%;
                top: 18%;
            }

            .money-type-500000 & {
                left: 3%;
                top: 16%;
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

            .money-type-100000 & {
                left: 71%;
                top: 70%;

                @media (min-width: 400px) {
                    left: 71%;
                    top: 71%;
                }

                @media (min-width: 768px) {
                    top: 68%;
                }

                @media (min-width: 992px) {
                    top: 72%;
                }

                @media (min-width: 1200px) {
                    top: 73%;
                }
            }

            .money-type-200000 & {
                left: 74%;
                top: 71%;

                @media (min-width: 400px) {
                    top: 70%;
                }

                @media (min-width: 576px) {
                    top: 73%;
                }

                @media (min-width: 768px) {
                    top: 69%;
                }

                @media (min-width: 992px) {
                    top: 72%;
                }

                @media (min-width: 1200px) {
                    top: 74%;
                }
            }

            .money-type-500000 & {
                left: 75%;
                top: 72%;

                @media (min-width: 400px) {
                    top: 71%;
                }

                @media (min-width: 576px) {
                    top: 74%;
                }

                @media (min-width: 768px) {
                    top: 69%;
                }

                @media (min-width: 992px) {
                    top: 72%;
                }

                @media (min-width: 1200px) {
                    top: 74%;
                }
            }
        }

        &-series {
            font-size: 80%;
        }
    }
</style>
