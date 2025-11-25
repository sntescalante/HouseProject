interface ActionButtonProps {
  label: string;
  onClick: () => void;
}

export default function ActionButton({ label, onClick }: ActionButtonProps) {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      {label}
    </button>
  );
}
