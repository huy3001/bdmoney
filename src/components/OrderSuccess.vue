<template>
  <b-row>
    <b-col cols="12">
      <b-alert show variant="success">
        Cảm ơn bạn đã đặt hàng, chúng tôi sẽ liên hệ và gửi hàng đến bạn sớm
        nhất có thể
      </b-alert>
      <b-button class="mb-5" type="button" variant="info" @click="handleClick"
        >Tiếp tục chọn tiền</b-button
      >
      <UpSell />
    </b-col>
  </b-row>
</template>

<script>
import UpSell from './UpSell';

export default {
  name: 'OrderSuccess',
  components: {
    UpSell,
  },
  methods: {
    handleClick() {
      this.$emit('continue');
    },
  },
};
</script>
