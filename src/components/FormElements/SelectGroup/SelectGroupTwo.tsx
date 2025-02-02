import React, { ChangeEvent } from "react";

interface SelectGroupProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectGroupTwo: React.FC<SelectGroupProps> = ({
  name,
  value,
  onChange,
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
    >
      <option value="">Sélectionnez un état</option>
      <option value="En attente">En attente</option>
      <option value="Traité">Traité</option>
      <option value="Clôturé">Clôturé</option>
    </select>
  );
};

export default SelectGroupTwo;
