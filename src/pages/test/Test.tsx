import DatePicker, { DateObject } from 'react-multi-date-picker';
// import DatePicker, { DateObject } from 'react-multi-date-picker';

import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useState, useEffect } from 'react';

const Test = () => {
   const [value, setValue] = useState<Date>(new Date());

   useEffect(() => {
      console.log(value.toString());
   }, [value]);

   return (
      <div>
         <div className="container align-items-center">
            <DatePicker
               locale={persian_fa}
               calendar={persian}
               value={value}
               onChange={date => setValue((date as DateObject).toDate())}
               // onChange={(date: DateObject ) => setValue(date.toDate())}
            />
         </div>
      </div>
   );
};

export default Test;
