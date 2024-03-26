<template>
  <div id="app" class="pt-5">
    <!-- Navigation -->
    <Navigation @select="searchByType" />

    <!-- Money page -->
    <div class="py-4 money-page">
      <b-container>
        <!-- Success block -->
        <OrderSuccess @continue="onReset" v-if="successMessage" />

        <b-form id="birthday" @reset="onReset" v-if="show">
          <!-- Choose birthday form -->
          <BirthdayForm
            @data="handleData"
            @search="searchMoney"
            v-if="searchByDate"
          />

          <!-- Find couple birth year -->
          <BirthYearForm
            @data="handleData"
            @search="searchMoney"
            v-if="!searchByDate"
          />

          <!-- Messages -->
          <Message
            :type="messageType"
            :trigger="alert || empty || infoMessage"
          />

          <!-- Result list -->
          <ResultList
            :results="results"
            :serial-key="serialKey"
            @select="selectMoney"
          />

          <!-- Order info -->
          <OrderInfo
            :info-message="infoMessage"
            :data-missing="dataMissing"
            :info-missing="infoMissing"
            :selected="selected"
            :payment="payment"
            :bank="bank"
            :ship="ship"
            @post="postData"
          />
        </b-form>
      </b-container>
    </div>

    <!-- Footer -->
    <Footer :info="info" />
  </div>
</template>

<script>
import Navigation from './components/Navigation';
import OrderSuccess from './components/OrderSuccess';
import BirthdayForm from './components/BirthdayForm';
import BirthYearForm from './components/BirthYearForm';
import Message from './components/Message';
import ResultList from './components/ResultList';
import OrderInfo from './components/OrderInfo';
import Footer from './components/Footer';
import { getApi } from './api';
import {
  formatDay,
  formatMonth,
  getCurrentTime,
  getFileUrl,
  getPriceBySearchType,
  getPriceByMoneyType,
  getPaymentMethod,
  getSelectedMoney,
  setSearchResult,
  setSearchResultByYear,
  stringToInteger,
} from './utils';
import {
  backToTop,
  clientRequest,
  loadFacebookScript,
  moneyFlyEffect,
  moneySerialSplit,
} from './helpers';

// URL of info file
const infoUrl = getFileUrl('info.json');

export default {
  name: 'App',
  components: {
    Navigation,
    OrderSuccess,
    BirthdayForm,
    BirthYearForm,
    Message,
    ResultList,
    OrderInfo,
    Footer,
  },

  data() {
    return {
      show: true,
      info: null,
      selected: [],
      payment: 'cash',
      bank: 'bank',
      price: 99,
      ship: 30,
      data: [],
      results: [],
      serialKey: 0,
      alert: false,
      empty: false,
      dataMissing: false,
      infoMissing: false,
      infoMessage: false,
      successMessage: false,
      searchByDate: false,
      messageType: '',
    };
  },

  methods: {
    getInfo() {
      // Fetch info from json file
      const self = this;
      getApi(infoUrl)
        .then((response) => {
          self.info = response.data;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },

    handleData(dataList) {
      this.data = dataList;
    },

    searchMoney(day, month, year, type) {
      const self = this;

      // Get price info
      const priceInfo = getPriceBySearchType(this.info, type);

      // Handle search money
      const handleSearch = (selectedDate, selectedYear, resultList) => {
        // Find birthday in data
        let itemDay, itemMonth, itemDate, itemPrice;

        self.data.forEach((item) => {
          itemDay = formatDay(item.day);
          // Update month for polymer cash
          const itemMoney = stringToInteger(item.money);
          itemMonth = formatMonth(item.month, itemMoney >= 10);
          itemDate = itemDay + itemMonth;

          if (itemDate == selectedDate) {
            // Set price for each money
            itemPrice = getPriceByMoneyType(priceInfo, item.money);

            // Get result for item has many years
            if (item.year != null) {
              const result = {
                day: item.day,
                month: itemMonth,
                year: selectedYear,
                money: item.money,
                price: itemPrice,
                seri: item.seri,
              };
              if (typeof item.year == 'object') {
                setSearchResultByYear(
                  item.year,
                  selectedYear,
                  result,
                  resultList
                );
              } else {
                setSearchResult(result, resultList);
              }
            }
          }
        });
      };

      if (day == null || month == null || year == null) {
        // Show alert
        this.alert = true;
        this.messageType = 'Not Selected';
      } else {
        let selectedDay = formatDay(day),
          selectedMonth = formatMonth(month),
          selectedDate = selectedDay.toString() + selectedMonth.toString(),
          selectedYear = year;

        // Hide alert
        this.alert = false;

        // Change serial key
        this.serialKey += 1;

        // Create and reset result list
        let resultList = [];
        resultList.length = 0;

        // Handle search money base on type of searching
        if (type == 'couple') {
          handleSearch(selectedDate, selectedYear, resultList);
          // Handle search with reverse birthday
          let reverseSelectedDate = year.toString(),
            reverseSelectedYear = parseInt(day + month);
          handleSearch(reverseSelectedDate, reverseSelectedYear, resultList);
        } else {
          handleSearch(selectedDate, selectedYear, resultList);
        }

        // Show or hide message when result is empty or not
        let timeoutFunction = null;
        clearTimeout(timeoutFunction);
        timeoutFunction = setTimeout(() => {
          if (resultList.length == 0) {
            this.empty = true;
            this.infoMessage = false;
            this.messageType = 'Empty Result';
          } else {
            this.empty = false;
            this.infoMessage = true;
            this.messageType = 'Success Result';
          }
        }, 200);

        // Assign result list to results
        this.results = resultList;

        // Split money serial
        moneySerialSplit();

        // Add fly effect when select money
        moneyFlyEffect();
      }
    },

    selectMoney(selected, ship) {
      this.selected = selected;
      this.ship = ship;
    },

    postData(name, phone, address, total) {
      // Get order info
      const orderInfo = this.info.order;
      // Get current time
      const currentTime = getCurrentTime();

      // Get selected money
      const selectedMoney = getSelectedMoney(this.selected);

      // Get payment method
      const paymentMethod = getPaymentMethod(this.payment, this.bank);

      // Gather all form value into an array
      let formValue = [
        currentTime,
        name,
        phone,
        address,
        selectedMoney,
        total + '000',
        paymentMethod,
      ];

      // Check if client is missing or not
      if (name != '' && phone != '' && address != '') {
        this.infoMissing = false;
      } else {
        // Missing client
        this.infoMissing = true;
      }

      // Check data is not empty and post
      if (
        this.selected.length > 0 &&
        this.payment != '' &&
        this.bank != '' &&
        name != '' &&
        phone != '' &&
        address != ''
      ) {
        this.dataMissing = false;
        // Show success message
        this.successMessage = true;
        // Hide form
        this.show = false;
        // Send request to Google sheets
        clientRequest(orderInfo, formValue);
        // Back to top
        backToTop();
      } else {
        // Missing info
        this.dataMissing = true;
      }
    },

    onReset() {
      // Reset data
      this.selected = [];
      // this.payment = '';
      // this.bank = '';
      this.results = [];
      this.alert = false;
      this.empty = false;
      this.dataMissing = false;
      this.infoMissing = false;
      this.infoMessage = false;
      this.successMessage = false;
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
      // Back to top
      backToTop();
    },

    searchByType() {
      let urlPath = window.location.pathname.replace('/', '');
      if (urlPath != '' && urlPath == 'capdoi') {
        this.searchByDate = false;
      } else {
        this.searchByDate = true;
      }
      // Reset data
      this.onReset();
    },
  },

  watch: {
    selected() {
      // Watch selected change and update ship fee
      if (this.selected.length > 2) {
        this.ship = 0;
      } else {
        this.ship = 30;
      }
    },

    payment() {
      // Watch payment change and update ship fee
      if (this.payment == 'bank') {
        this.bank = '';
        this.ship = 0;
      } else {
        this.bank = this.payment;
        if (this.selected.length < 3) {
          this.ship = 30;
        }
      }
    },
  },

  mounted() {
    // Get info
    this.getInfo();
    // Search by type of parameter
    this.searchByType();
    // Load facebook script
    loadFacebookScript(this);
  },
};
</script>

<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
@import 'node_modules/bootstrap-vue/src/icons.scss';
@import './styles/font.scss';
@import './styles/style.scss';
</style>
