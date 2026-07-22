import { useEffect, useRef, useState } from "react";
import { autocompletePlace } from "../services/tripService";
import type { PlaceSuggestion } from "../types/Insight";

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  style,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  required?: boolean;
}) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await autocompletePlace(value);
        setSuggestions(res.data);
      } catch {
        setSuggestions([]);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const select = (s: PlaceSuggestion) => {
    onChange(s.label);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        style={style}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
      />
      {open && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 20,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            marginTop: 4,
            boxShadow: "0 12px 24px rgba(15,23,42,0.12)",
            overflow: "hidden",
          }}
        >
          {suggestions.map((s, i) => (
            <div
              key={i}
              // onMouseDown (not onClick) fires before the input's onBlur,
              // so the selection registers before the dropdown closes.
              onMouseDown={() => select(s)}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                fontSize: 14,
                color: "#0f172a",
                borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              {s.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
