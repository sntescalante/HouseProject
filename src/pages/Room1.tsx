import { useState } from "react";
import Card from "../components/Cards";
import ToggleSwitch from "../components/ToggleSwitch";
import ActionButton from "../components/ActionButton";
import { sendCommand } from "../services/arduinoService";

export default function Room1() {
  const [lightOn, setLightOn] = useState(false);
  const [fanOn, setFanOn] = useState(false);

  const toggleLight = () => {
    const newState = !lightOn;
    setLightOn(newState);
    sendCommand(newState ? "LIGHT_ON_R1" : "LIGHT_OFF_R1");
  };

  const toggleFan = () => {
    const newState = !fanOn;
    setFanOn(newState);
    sendCommand(newState ? "FAN_ON_R1" : "FAN_OFF_R1");
  };

  return (
    <div style={styles.container}>
      <h1>Cuarto 1</h1>
      <div style={styles.grid}>
        <Card cardTitle="Luz">
          <ToggleSwitch checked={lightOn} onChange={toggleLight} />
        </Card>
        <Card cardTitle="Ventilador">
          <ToggleSwitch checked={fanOn} onChange={toggleFan} />
        </Card>
        <Card cardTitle="Acción Especial">
          <ActionButton
            label="Ejecutar"
            onClick={() => sendCommand("SPECIAL_R1")}
          />
        </Card>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
  },
  grid: {
    display: "flex",
    gap: "25px",
    flexWrap: "wrap" as const,
  },
};
