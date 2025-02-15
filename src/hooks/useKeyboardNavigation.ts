import { useState } from "react";

import { LanguageType } from "@types";

interface UseKeyboardNavigationProps {
  items: LanguageType[];
  isOpen: boolean;
  onSelect: (item: LanguageType) => void;
  onClose: () => void;
  toggleDropdown: (openedLang: LanguageType) => void;
  openedLanguages: LanguageType[];
}

const keyboardEventKeys = {
  arrowDown: "ArrowDown",
  arrowUp: "ArrowUp",
  arrowRight: "ArrowRight",
  enter: "Enter",
  escape: "Escape",
} as const;

type KeyboardEventKeys =
  (typeof keyboardEventKeys)[keyof typeof keyboardEventKeys];

export const useKeyboardNavigation = ({
  items,
  isOpen,
  openedLanguages,
  onSelect,
  onClose,
  toggleDropdown,
}: UseKeyboardNavigationProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return;

    const key = event.key as KeyboardEventKeys;

    if (Object.values(keyboardEventKeys).includes(key)) {
      event.preventDefault();

      switch (key) {
        case "ArrowDown":
          setFocusedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
          break;
        case "ArrowRight":
          if (focusedIndex >= 0) {
            const selectedItem = items.filter(
              (item) =>
                !item.mainLanguage ||
                openedLanguages.includes(item.mainLanguage)
            )[focusedIndex];

            if (selectedItem.subLanguages.length > 0) {
              toggleDropdown(selectedItem);
            }
          }
          break;
        case "Enter":
          if (focusedIndex >= 0) {
            onSelect(
              items.filter(
                (item) =>
                  !item.mainLanguage ||
                  openedLanguages.includes(item.mainLanguage)
              )[focusedIndex]
            );
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    }
  };

  const resetFocus = () => setFocusedIndex(-1);
  const focusFirst = () => setFocusedIndex(0);

  return {
    focusedIndex,
    handleKeyDown,
    resetFocus,
    focusFirst,
  };
};
