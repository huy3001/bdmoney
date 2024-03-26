<template>
  <b-navbar toggleable="lg" type="dark" variant="dark" fixed="top">
    <b-navbar-brand href="/">Tiền sinh nhật</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/" @click="handleClick">Năm sinh</b-nav-item>
        <b-nav-item to="/capdoi" @click="handleClick">Cặp đôi</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navigation',
  methods: {
    handleClick() {
      this.$emit('select');
    },
  },
};
</script>
