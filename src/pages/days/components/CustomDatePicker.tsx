import { FC } from "react";
import { CustomComponentProps } from "react-multi-date-picker";

const CustomDatePicker: FC<CustomComponentProps> = ({
   value,
   openCalendar,
   onChange,
}) => {
   return (
      <button className="btn btn-primary btn-lg w-100" onClick={openCalendar}>
         Open Calendar
      </button>
   );
};

export default CustomDatePicker;
