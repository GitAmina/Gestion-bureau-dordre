import React, { ChangeEvent } from "react";

interface SelectGroupProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

const SelectGroupOne: React.FC<SelectGroupProps> = ({
  name,
  value,
  onChange,
  required,
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
    >
      <option value="">Sélectionnez un type</option>
      <option value="Entrant">Entrant</option>
      <option value="Sortant">Sortant</option>
    </select>
  );
};

export default SelectGroupOne;
