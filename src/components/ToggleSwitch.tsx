interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

export default function ToggleSwitch({ checked, onChange }: ToggleProps) {
  return (
    <label style={styles.switch}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ display: "none" }}
      />
      <span
        style={{
          ...styles.slider,
          backgroundColor: checked ? "#4CAF50" : "#ccc",
        }}
      ></span>
    </label>
  );
}

const styles = {
  switch: {
    position: "relative" as const,
    display: "inline-block",
    width: "50px",
    height: "28px",
  },
  slider: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "28px",
    cursor: "pointer",
    transition: "0.3s",
  },
};
