export const formatDay = (day) => {
  const parsedDay = stringToInteger(day);
  if (parsedDay < 10 || parsedDay > 31) {
    return day.replace('0', '');
  }
  return day;
}

export const formatMonth = (month, condition = undefined) => {
  const parsedMonth = stringToInteger(month);
  if (parsedMonth < 10) {
    return condition ? `0${month}` : month.replace('0', '');
  }
  return month;
}

export const getCurrentTime = () => {
  const date = new Date();
  const currentDay = date.getDate();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();
  const currentHour = date.getHours();
  const currentMinute = date.getMinutes();
  const currentSecond = date.getSeconds();
  return `${currentDay}-${currentMonth}-${currentYear} ${currentHour}:${currentMinute}:${currentSecond}`;
}

export const getFileUrl = (fileName) => {
  const sitePath = window.location.pathname;
  const siteUrl = window.location.href;
  const siteDomain = sitePath == '/' ? siteUrl : siteUrl.replace(sitePath, '/');
  return siteDomain + fileName;
}

export const getPriceBySearchType = (data, type) => {
  if (type == 'couple') {
    return data.coupleprice;
  }
  if (type == 'special') {
    return data.specialprice;
  }
  return data.price;
}

export const getPriceByMoneyType = (price, money) => {
  const defaultPrice = 99;
  switch (money) {
    case '0.5':
      return price.fivehundred;
    case '1':
      return price.onethousand;
    case '2':
      return price.twothousand;
    case '5':
      return price.fivethousand;
    case '10':
      return price.tenthousand;
    case '20':
      return price.twentythousand;
    case '50':
      return price.fiftythousand;
    case '100':
      return price.onehundredthousand;
    case '200':
      return price.twohundredthousand;
    case '500':
      return price.fivehundredthousand;
    default:
      return defaultPrice;
  }
}

export const getPaymentMethod = (paymentType, bank) => {
  if (paymentType == 'cash') {
    return 'Tiền mặt khi nhận hàng';
  }
  if (paymentType == 'bank' && bank != '') {
    return 'Chuyển khoản ' + bank;
  }
  return '';
}

export const getSelectedMoney = (selectedMoney) => {
  if (selectedMoney.length > 0) {
    selectedMoney.forEach((item) => {
      console.log(item.money + ' - ');
      return item.money + ' - ';
    });
  }
  return '';
}

export const setSearchResult = (result, resultList) => {
  resultList.push(result);
}

export const setSearchResultByYear = (years, selectedYear, result, resultList) => {
  years.forEach((item) => {
    if (stringToInteger(item) == stringToInteger(selectedYear)) {
      setSearchResult(result, resultList);
    }
  });
}

export const stringToInteger = (value) => {
  return typeof value === 'string' ? parseInt(value) : value;
}
