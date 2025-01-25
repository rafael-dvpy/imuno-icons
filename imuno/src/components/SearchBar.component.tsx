import React, { ChangeEvent, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search...",
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, 500); // 500ms debounce time

    return () => clearTimeout(timer); // Clear the timer on each change
  }, [inputValue, onSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="flex items-center pointer-events-auto bg-gray-200 rounded-full px-4 py-2 shadow-sm">
      <FontAwesomeIcon
        className="text-gray-500 text-lg mr-2"
        icon={faMagnifyingGlass}
      />
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-500"
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
