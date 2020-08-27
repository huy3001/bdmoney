<template>
  <div id="app">
    <div class="container">
      <img alt="Vue logo" src="./assets/logo.png">
      <HelloWorld msg="Nhập sinh nhật của bạn"/>
      <!-- Choose birthday form -->
      <b-form
        id="birthday"
        @submit="onSubmit"
        @reset="onReset"
      >
        <div class="row">
          <div class="col-12 col-sm-12 col-md-4">
            <b-form-select
              id="day"
              v-model="form.day"
              :options="days"
              required
            ></b-form-select>
          </div>

          <div class="col-12 col-sm-12 col-md-4">
            <b-form-select
              id="month"
              v-model="form.month"
              :options="months"
              required
            ></b-form-select>
          </div>

          <div class="col-12 col-sm-12 col-md-4">
            <b-form-select
              id="month"
              v-model="form.year"
              :options="years"
              required
            ></b-form-select>
          </div>
        </div>

        <div class="row">
          
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      form: {
        day: null,
        month: null,
        year: null
      },
      days: [{ text: 'Ngày', value: null }, '01', '02', '03'],
      months: [{ text: 'Tháng', value: null }, '01', '02', '03'],
      years: [{ text: 'Năm', value: null }, '1900', '1901', '1902']
    }
  },
  methods: {
    onSubmit() {

    },
    onReset() {
      this.form.day = null
    }
  }
}
</script>

<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  col-12or: #2c3e50;
  margin-top: 60px;
}
</style>
