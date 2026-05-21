import { SearchSvg } from "@/assets/SearchSvg";
import clsx from "clsx";
import React from "react";
import styles from "./Select.module.scss";

import { type SelectProps } from "./Select.types";
import { DropdownPortal } from "./DropdownPortal";

interface CustomSelectWithSearchProps extends SelectProps {
  withSearch?: boolean;
  isOverDialog?: boolean;
}

export function Select(props: CustomSelectWithSearchProps) {
  const { options = [], withSearch = false, onChoose, value, isOverDialog = false } = props;

  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [_, setFocused] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const filteredOptions =
    withSearch && search
      ? options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))
      : options;

  React.useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={styles.select} ref={selectRef}>
      <button
        ref={buttonRef}
        type="button"
        className={clsx(styles.select_control, { [styles.select_open]: open })}
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={clsx(styles.select_value, !selectedOption && styles.select_placeholder)}>
          {selectedOption ? selectedOption.label : "Select ..."}
        </span>
        <span className={styles.select_arrow} />
      </button>
      {open &&
        (isOverDialog ? (
          <DropdownPortal open={open} anchorRef={buttonRef}>
            <div className={styles.select_dropdown}>
              {withSearch && (
                <div className={styles.select_searchWrapper}>
                  <span className={styles.select_searchIcon}>
                    <SearchSvg width={16} height={16} />
                  </span>
                  <input
                    className={styles.select_search}
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search..."
                    autoFocus
                  />
                </div>
              )}
              <ul className={styles.select_list} role="listbox">
                {filteredOptions.length === 0 && (
                  <li className={styles.select_option}>No results</li>
                )}
                {filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={clsx(styles.select_option, {
                      [styles.select_optionSelected]: value === option.value,
                    })}
                    role="option"
                    aria-selected={value === option.value}
                    tabIndex={0}
                    onClick={() => {
                      onChoose?.(option);
                      setOpen(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        onChoose?.(option);
                        setOpen(false);
                      }
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          </DropdownPortal>
        ) : (
          <div className={styles.select_dropdown}>
            {withSearch && (
              <div className={styles.select_searchWrapper}>
                <span className={styles.select_searchIcon}>
                  <SearchSvg width={16} height={16} />
                </span>
                <input
                  className={styles.select_search}
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search..."
                  autoFocus
                />
              </div>
            )}
            <ul className={styles.select_list} role="listbox">
              {filteredOptions.length === 0 && <li className={styles.select_option}>No results</li>}
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={clsx(styles.select_option, {
                    [styles.select_optionSelected]: value === option.value,
                  })}
                  role="option"
                  aria-selected={value === option.value}
                  tabIndex={0}
                  onClick={() => {
                    onChoose?.(option);
                    setOpen(false);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      onChoose?.(option);
                      setOpen(false);
                    }
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
