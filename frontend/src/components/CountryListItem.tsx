import { Country } from "../types";

type CountryListItemProps = {
  country: Country;
  actionLabel: "+" | "x" | "selected";
  onAction: (country: Country) => void;
  buttonVariant: "primary" | "secondary" | "danger";
  buttonTitle: string;
  onSelect?: (country: Country) => void;
  isActive?: boolean;
};

const CountryListItem = ({
  country,
  actionLabel,
  onAction,
  buttonVariant,
  buttonTitle,
  onSelect,
  isActive = false,
}: CountryListItemProps) => {
  return (
    <li
      className={`list-group-item d-flex justify-content-between align-items-center${
        onSelect ? " is-clickable" : ""
      }${isActive ? " is-active" : ""}`}
      onClick={() => onSelect?.(country)}
      onKeyDown={(event) => {
        if (!onSelect) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(country);
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="d-flex align-items-center">
        <img
          src={country.flagUrl}
          alt={`${country.name} flag`}
          className="mr-2"
          style={{ width: "28px", height: "20px", objectFit: "cover" }}
        />
        <span>{country.name}</span>
      </div>
      {actionLabel === "selected" ? (
        <span className="selected-label" aria-label={buttonTitle} title={buttonTitle}>
          selected
        </span>
      ) : (
        <button
          type="button"
          className={`btn btn-sm btn-${buttonVariant}`}
          onClick={(event) => {
            event.stopPropagation();
            onAction(country);
          }}
          aria-label={buttonTitle}
          title={buttonTitle}
        >
          {actionLabel}
        </button>
      )}
    </li>
  );
};

export default CountryListItem;
