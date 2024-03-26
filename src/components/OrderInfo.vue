<template>
  <b-row>
    <b-col cols="12">
      <b-alert show variant="info" v-if="infoMessage">
        Thông tin đơn hàng
      </b-alert>

      <b-alert show variant="danger" v-if="dataMissing">
        <p class="mb-0" v-if="selected.length == 0">
          Bạn phải chọn ít nhất 1 tờ tiền
        </p>
        <p class="mb-0" v-if="payment == ''">
          Vui lòng chọn hình thức thanh toán
        </p>
        <p class="mb-0" v-if="payment != '' && bank == ''">
          Bạn cần chọn ngân hàng để chuyển khoản
        </p>
        <p class="mb-0" v-if="infoMissing">
          Vui lòng điền họ tên, số điện thoại và địa chỉ nhận hàng
        </p>
      </b-alert>
    </b-col>

    <b-col
      cols="12"
      sm="12"
      md="8"
      offset-md="2"
      lg="6"
      offset-lg="3"
      class="money-order"
      v-if="infoMessage"
    >
      <b-card no-body class="text-left mb-3 p-2" v-if="selected.length > 0">
        <b-card-text class="font-weight-bold text-center"
          >Bạn đã chọn</b-card-text
        >
        <b-table striped :fields="columns" :items="items"></b-table>
      </b-card>

      <b-list-group class="text-left">
        <b-list-group-item>
          <span class="money-ship">Phí ship: {{ ship | currencyFormat }}</span>
          <span
            class="text-secondary money-ship-note ml-2"
            v-if="selected.length < 3"
            >( Mua từ 3 tờ trở lên free ship )</span
          >
          <span
            class="text-secondary money-ship-note ml-2"
            v-if="selected.length > 2"
            >( Bạn đã được free ship )</span
          >
        </b-list-group-item>

        <b-list-group-item>
          <strong class="money-total"
            >Tổng tiền: {{ total | currencyFormat }}</strong
          >
        </b-list-group-item>

        <b-list-group-item>
          <span class="mr-1">Thanh toán:</span>

          <!-- <b-form-radio class="mt-3 money-payment" v-model="payment" name="payment-method" value="cash"> -->
          <span class="money-payment-text">Khi nhận hàng</span>
          <!-- </b-form-radio> -->

          <!-- <b-form-radio class="mt-3 money-payment" v-model="payment" name="payment-method" value="bank">
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
                    </b-card> -->
        </b-list-group-item>

        <b-list-group-item>
          <b-form-input
            v-model="name"
            placeholder="Họ và tên"
            required
            :state="infoMissing ? false : null"
          ></b-form-input>
        </b-list-group-item>

        <b-list-group-item>
          <b-form-input
            type="number"
            v-model="phone"
            placeholder="Số điện thoại"
            required
            :state="infoMissing ? false : null"
          ></b-form-input>
        </b-list-group-item>

        <b-list-group-item>
          <b-form-textarea
            v-model="address"
            placeholder="Địa chỉ cụ thể (số nhà, tên đường, thôn, xóm)"
            rows="3"
            no-resize
            required
            :state="infoMissing ? false : null"
          ></b-form-textarea>
        </b-list-group-item>
      </b-list-group>
    </b-col>

    <b-col cols="12" v-if="infoMessage">
      <b-form-group id="action">
        <b-button type="reset" variant="danger" class="m-3">Chọn lại</b-button>
        <b-button
          type="button"
          variant="primary"
          class="m-3"
          @click="handlePostData"
          >Đặt hàng</b-button
        >
      </b-form-group>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'OrderInfo',
  props: {
    infoMessage: Boolean,
    dataMissing: Boolean,
    infoMissing: Boolean,
    selected: Array,
    payment: String,
    bank: String,
    ship: Number,
  },

  data() {
    return {
      name: '',
      phone: '',
      address: '',
      columns: [
        {
          key: 'seri',
        },
        {
          key: 'type',
          label: 'Tờ tiền',
        },
        {
          key: 'price',
          label: 'Giá',
        },
      ],
    };
  },

  filters: {
    currencyFormat(value) {
      return value + 'k';
    },
  },

  computed: {
    items() {
      let items = [];
      if (this.selected.length > 0) {
        this.selected.forEach((value) => {
          items.push({
            seri: value.seri,
            type: value.type,
            price: value.price + 'k',
          });
        });
      }
      return items;
    },

    total() {
      let total = 0,
        selectedPrice = 0;
      // Calculate total price
      if (this.selected.length > 0) {
        this.selected.forEach((value) => {
          selectedPrice = selectedPrice + value.price;
        });
        total = selectedPrice + this.ship;
      }
      return total;
    },
  },

  methods: {
    handlePostData() {
      this.$emit('post', this.name, this.phone, this.address, this.total);
    },
  },
};
</script>

<style lang="scss">
@import '../styles/order.scss';
</style>
