<template>
    <div class="money-upsell" v-if="show">
        <h4 class="money-upsell-title mb-4">
            {{ upSellData.title }}
        </h4>

        <b-row>
            <b-col cols="12" sm="12" md="6" lg="4" v-for="(product, index) in upSellData.products" :key="index">
                <div class="mb-4 text-center money-upsell-product">
                    <b-img class="mb-2" width="500" height="500" :src="product.image" fluid :alt="product.name" v-if="product.image != ''"></b-img>
                    <p class="mb-2 money-upsell-name">{{ product.name }}</p>
                    <p class="font-weight-bold text-uppercase text-warning mb-2">{{ product.price | currencyFormat }}</p>
                    <b-link class="border border-primary d-inline-block rounded px-2 py-1 money-upsell-link" :href="product.link" target="_blank">
                        <span>Mua hàng</span>
                    </b-link>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from 'axios';

// URL of upsell file
const upSellUrl = window.location.href + 'upsell.json';

export default {
    name: "UpSell",
    props: {
        show: Boolean
    },

    data() {
        return {
            upSellData: null
        }
    },

    filters: {
        currencyFormat(value) {
            return value + ' VND'
        }
    },

    methods: {
        getUpSell() {
            // Fetch upsell data from json file
            let self = this;
            if (upSellUrl != '') {
                axios.get(upSellUrl)
                .then(function(response) {
                    // handle success
                    self.upSellData = response.data;
                })
                .catch(function(error) {
                    // handle error
                    console.log(error);
                })
            }
        }
    },

    mounted() {
        // Get upsell data
        this.getUpSell();
    }
}
</script>

<style lang="scss" scoped>
    .money {
        &-upsell {
            &-name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            &-link {
                text-decoration: none;
            }
        }
    }
</style>