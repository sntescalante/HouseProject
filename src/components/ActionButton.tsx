interface ActionButtonProps {
  label: string;
  onClick: () => void;
}

export default function ActionButton({ label, onClick }: ActionButtonProps) {
  return (
    <button style={styles.btn} onClick={onClick}>
      {label}
    </button>
  );
}

const styles = {
  btn: {
    padding: "10px 18px",
    background: "#007bff",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: 500,
    cursor: "pointer",
  },
};
