interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

export default function ToggleSwitch({ checked, onChange }: ToggleProps) {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckDefault"
        checked={checked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
        {checked ? 'Encendido' : 'Apagado'}
      </label>
    </div>
  );
}
