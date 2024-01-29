import { DateObject } from 'react-multi-date-picker';
import * as Shamsi from 'shamsi';

const getToday = (todayDateObject: DateObject) => {
   let shamsiDate = Shamsi.gregorianToJalali(
      todayDateObject.year,
      todayDateObject.month.number as Shamsi.MonthType,
      todayDateObject.day as Shamsi.DayType,
   );
   let shamsiDBBarcode = `${shamsiDate[0]}-${shamsiDate[1]}-${shamsiDate[2]}`;
   return { shamsiDBBarcode, todayDateObject };
};

const getTodayJSDate = () => {
   const t = new Date();
   t.setTime(t.getTime() - 24 * 60 * 60 * 1000)
   return t;
};

const shamsiBarcodeToGregorianDate = (barcode: string) => {
   let barcodeArray = barcode.split('-');
   let yearShamsi = Number(barcodeArray[0]);
   let monthShamsi = Number(barcodeArray[1]);
   let dayShamsi = Number(barcodeArray[2]);
   let gregorianDate = Shamsi.jalaliToGregorian(
      yearShamsi,
      monthShamsi as Shamsi.MonthType,
      dayShamsi as Shamsi.DayType,
   );
   let date = new DateObject();
   date.setYear(gregorianDate[0]);
   date.setMonth(gregorianDate[1]);
   date.setDay(gregorianDate[2]);
   date.setHour(0);
   date.setMinute(0);
   date.setSecond(0);
   return date;
};

const shamsiBarcodeToJSDate = (barcode: string) => {
   let barcodeArray = barcode.split('-');
   let yearShamsi = Number(barcodeArray[0]);
   let monthShamsi = Number(barcodeArray[1]);
   let dayShamsi = Number(barcodeArray[2]);
   let gregorianDate = Shamsi.jalaliToGregorian(
      yearShamsi,
      monthShamsi as Shamsi.MonthType,
      dayShamsi as Shamsi.DayType,
   );
   let date = new Date();
   date.setFullYear(gregorianDate[0]);
   date.setMonth(gregorianDate[1]-1);
   date.setDate(gregorianDate[2]);
   date.setHours(1, 1, 0);
   return date;
};

const shamsiToGregorianN = (value: DateObject) => {
   let t = Shamsi.jalaliToGregorian(
      value.year,
      value.month.number as Shamsi.MonthType,
      value.day as Shamsi.DayType,
   );
   const year = t[0];
   let day: number | string = t[2];
   switch (day) {
      case 1:
         day = '01';
         break;
      case 2:
         day = '02';
         break;
      case 3:
         day = '03';
         break;
      case 4:
         day = '04';
         break;
      case 5:
         day = '05';
         break;
      case 6:
         day = '06';
         break;
      case 7:
         day = '07';
         break;
      case 8:
         day = '08';
         break;
      case 9:
         day = '09';
         break;
   }
   let month = '';
   switch (t[1]) {
      case 1:
         month = 'January';
         break;
      case 2:
         month = 'February';
         break;
      case 3:
         month = 'March';
         break;
      case 4:
         month = 'April';
         break;
      case 5:
         month = 'May';
         break;
      case 6:
         month = 'June';
         break;
      case 7:
         month = 'July';
         break;
      case 8:
         month = 'August';
         break;
      case 9:
         month = 'September';
         break;
      case 10:
         month = 'October';
         break;
      case 11:
         month = 'November';
         break;
      case 12:
         month = 'December';
         break;
   }
   let weekDay = '';
   switch (value.weekDay.name) {
      case 'Shanbeh':
         weekDay = 'Saturday';
         break;
      case 'YekShanbeh':
         weekDay = 'Sunday';
         break;
      case 'Doshanbeh':
         weekDay = 'Monday';
         break;
      case 'Seshanbeh':
         weekDay = 'Tuesday';
         break;
      case 'Chaharshanbeh':
         weekDay = 'Wednesday';
         break;
      case 'Panjshanbeh':
         weekDay = 'Thursday';
         break;
      case "Jom'eh":
         weekDay = 'Friday';
         break;
   }
   let gregorianBarcode = `${year}/${t[1]}/${day}`;
   let shamsiDBBarcode = `${value.year}-${value.month.number}-${value.day}`;

   return {
      year,
      month,
      day,
      weekDay,
      gregorianBarcode,
      shamsiDBBarcode,
   };
};
const shamsiDayToPersianN = (value: string) => {
   let weekDay = '';
   switch (value) {
      case 'Shanbeh':
         weekDay = 'شنبه';
         break;
      case 'YekShanbeh':
         weekDay = 'یکشنبه';
         break;
      case 'Doshanbeh':
         weekDay = 'دوشنبه';
         break;
      case 'Seshanbeh':
         weekDay = 'سه‌شنبه';
         break;
      case 'Chaharshanbeh':
         weekDay = 'چهارشنبه';
         break;
      case 'Panjshanbeh':
         weekDay = 'پنجشنبه';
         break;
      case "Jom'eh":
         weekDay = 'جمعه';
         break;
   }

   return weekDay;
};

const gregorianMonthToPersianN = (value: string) => {
   let weekDay = '';
   switch (value) {
      case 'Saturday':
         weekDay = 'شنبه';
         break;
      case 'Sunday':
         weekDay = 'یکشنبه';
         break;
      case 'Monday':
         weekDay = 'دوشنبه';
         break;
      case 'Tuesday':
         weekDay = 'سه‌شنبه';
         break;
      case 'Wednesday':
         weekDay = 'چهارشنبه';
         break;
      case 'Thursday':
         weekDay = 'پنجشنبه';
         break;
      case 'Friday':
         weekDay = 'جمعه';
         break;
   }
   return weekDay;
};
const gregorianDayToPersianN = (value: string) => {
   let weekDay = '';
   switch (value) {
      case 'Saturday':
         weekDay = 'شنبه';
         break;
      case 'Sunday':
         weekDay = 'یکشنبه';
         break;
      case 'Monday':
         weekDay = 'دوشنبه';
         break;
      case 'Tuesday':
         weekDay = 'سه‌شنبه';
         break;
      case 'Wednesday':
         weekDay = 'چهارشنبه';
         break;
      case 'Thursday':
         weekDay = 'پنجشنبه';
         break;
      case 'Friday':
         weekDay = 'جمعه';
         break;
   }
   return weekDay;
};

const gregorianToPersianString = (value: DateObject) => {
   const weekDay = gregorianDayToPersianN(value.weekDay.name)
   let shamsiDate = Shamsi.gregorianToJalali(
      value.year,
      value.month.number as Shamsi.MonthType,
      value.day as Shamsi.DayType,
   );
   let shamsiDBBarcode = `${shamsiDate[0]}/${shamsiDate[1]}/${shamsiDate[2]}`;
   return `${shamsiDBBarcode} ${weekDay} ${value.hour}:${value.minute}`

}

const shamsiMonthToPersianN = (value: string) => {
   let month = '';
   switch (value) {
      case 'Farvardin':
         month = 'فروردین';
         break;
      case 'Ordibehesht':
         month = 'اردبیهشت';
         break;
      case 'Khordad':
         month = 'خرداد';
         break;
      case 'Tir':
         month = 'تبر';
         break;
      case 'Mordad':
         month = 'مرداد';
         break;
      case 'Shahrivar':
         month = 'شهریور';
         break;
      case 'Mehr':
         month = 'مهر';
         break;
      case 'Aban':
         month = 'آبان';
         break;
      case 'Azar':
         month = 'آذر';
         break;
      case 'Dey':
         month = 'دی';
         break;
      case 'Bahman':
         month = 'بهمن';
         break;
      case 'Esfand':
         month = 'اسفند';
         break;
   }

   return month;
};

const jSDateToBarcode = (value: Date) => {};

export {
   getToday,
   getTodayJSDate,
   shamsiBarcodeToGregorianDate,
   shamsiDayToPersianN,
   shamsiMonthToPersianN,
   shamsiToGregorianN,
   gregorianDayToPersianN,
   shamsiBarcodeToJSDate,
   gregorianToPersianString,
};
