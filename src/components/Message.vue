<template>
  <b-row>
    <b-col cols="12">
      <b-alert show :variant="messages[type].variant" v-if="trigger">
        {{ messages[type].message }}
      </b-alert>
    </b-col>
  </b-row>
</template>

<script>
import { MESSAGE_OPTIONS } from '../constant';

export default {
  name: 'Message',
  props: {
    type: String,
    trigger: Boolean,
  },
  data() {
    return {
      messages: MESSAGE_OPTIONS,
    };
  },
};
</script>
