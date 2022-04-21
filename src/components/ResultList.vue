<template>
    <b-row>
        <b-col cols="12" sm="12" md="6" v-for="(result, index) in results" :key="index">
            <b-alert show variant="success">
                Có 1 tờ {{ result.money * 1000 }} seri {{ result.seri + ' ' + result.day + result.month + result.year }}
            </b-alert>

            <b-form-group :class="['position-relative', 'money-form-group', 'money-type-' + result.money * 1000]">
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
                        :value="{ 'money': result.money * 1000 + ' ' + result.seri + ' ' + result.day + result.month + result.year, 'price': result.price }"
                    >
                        Chọn mua
                    </b-form-checkbox>
                </div>
            </b-form-group>
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