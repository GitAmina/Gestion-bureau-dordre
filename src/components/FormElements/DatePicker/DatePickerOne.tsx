"use client";
import flatpickr from "flatpickr";
import { useEffect } from "react";

import React, { ChangeEvent } from "react";

interface DatePickerProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const DatePickerOne: React.FC<DatePickerProps> = ({
  name,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
        Date d'envoi
      </label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
      />
    </div>
  );
};

export default DatePickerOne;
