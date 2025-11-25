import { useState } from "react";
import Card from "../components/Cards";
import ToggleSwitch from "../components/ToggleSwitch";
import ActionButton from "../components/ActionButton";
import { sendCommand } from "../services/arduinoService";
import { publishMqttMessage } from "../services/mqttService";

export default function Room1() {
  const [lightOn, setLightOn] = useState(false);
  const [fanOn, setFanOn] = useState(false);

  const toggleLight = () => {
    const newState = !lightOn;
    setLightOn(newState);

    // 🟢 Mensaje que verá el broker
    publishMqttMessage(newState ? "ON" : "OFF");

    // Si quieres seguir usando tu backend/Arduino REST:
    sendCommand(newState ? "ON" : "OFF");
  };

  const toggleFan = () => {
    const newState = !fanOn;
    setFanOn(newState);
    sendCommand(newState ? "FAN_ON_R1" : "FAN_OFF_R1");

    // (Opcional) también podrías publicar algo por MQTT aquí
    // publishMqttMessage(newState ? "FAN_ON_R1" : "FAN_OFF_R1");
  };

  return (
    <div>
      <h1 className="mb-4">Cuarto 1</h1>
      <div className="row">
        <div className="col-md-4 mb-4">
          <Card cardTitle="Luz">
            <ToggleSwitch checked={lightOn} onChange={toggleLight} />
          </Card>
        </div>
        <div className="col-md-4 mb-4">
          <Card cardTitle="Ventilador">
            <ToggleSwitch checked={fanOn} onChange={toggleFan} />
          </Card>
        </div>
        <div className="col-md-4 mb-4">
          <Card cardTitle="Acción Especial">
            <ActionButton
              label="Ejecutar"
              onClick={() => sendCommand("SPECIAL_R1")}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
