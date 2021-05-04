<template>
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
                            data-small-header="false" 
                            data-adapt-container-width="true" 
                            data-hide-cover="false" 
                            data-show-facepile="true"
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
</template>

<script>
export default {
    name: "Footer",
    props: {
        info: Object
    },

    filters: {
        phoneFormat(value) {
            return value.replace(/\.+/g, '')
        }
    }
}
</script>