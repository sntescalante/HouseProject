import { useState, useEffect } from "react";
import Card from "../components/Cards";
import ToggleSwitch from "../components/ToggleSwitch";
import ActionButton from "../components/ActionButton";
import { publishMqttMessage } from "../services/mqttService";
import SensorChartCard from "../components/SensorChartCard";
import { ROOM_TOPICS, useMqtt } from "../context/MqttContext";

export default function Room1() {
  const { lastMessages } = useMqtt();
  
  const oledTopic = "TEAM5/room1/actuator/OLED";
  const bmpTopic = "TEAM5/room1/sensor/BMP280";
  const buzzerTopic = "TEAM5/room1/actuator/Buzzer";
  
  const oledStatus = lastMessages[oledTopic] || "ON"; 
  const bmpData = lastMessages[bmpTopic] || "Esperando datos...";
  
  const [buzzerDisplay, setBuzzerDisplay] = useState("Silencio");
  const latestBuzzerMsg = lastMessages[buzzerTopic];

  useEffect(() => {
    if (latestBuzzerMsg) {
      setBuzzerDisplay(latestBuzzerMsg);
      // Si el mensaje es de intruso, limpiarlo después de 5 segundos
      if (latestBuzzerMsg.includes("INTRUDER")) {
        const timer = setTimeout(() => {
          setBuzzerDisplay("Silencio");
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [latestBuzzerMsg]);

  // Filter out topics that we handle manually
  const graphTopics = ROOM_TOPICS.room1.filter(t => t !== oledTopic && t !== bmpTopic && t !== buzzerTopic);

  return (
    <div>
      <h1 className="mb-4">Cuarto 1</h1>
      
      <div className="row mb-4">
        {/* Estado OLED */}
        <div className="col-md-4 mb-4">
          <Card cardTitle="Estado OLED">
             <div className="d-flex align-items-center justify-content-center p-3">
                <h2 className={oledStatus === "ON" ? "text-success" : "text-danger"}>
                  {oledStatus}
                </h2>
             </div>
          </Card>
        </div>

        {/* Alarma Buzzer */}
        <div className="col-md-4 mb-4">
          <Card cardTitle="Alarma (Buzzer)">
             <div className="d-flex align-items-center justify-content-center p-3 text-center">
                <h4 className={buzzerDisplay.includes("INTRUDER") ? "text-danger fw-bold" : "text-muted"}>
                  {buzzerDisplay}
                </h4>
             </div>
          </Card>
        </div>

        {/* Datos BMP280 */}
        <div className="col-md-4 mb-4">
          <Card cardTitle="Ambiente (BMP280)">
             <div className="p-3">
                <p className="mb-0">{bmpData}</p>
             </div>
          </Card>
        </div>
      </div>

      {/* Sensores y Gráficas */}
      <h3 className="mb-3">Monitoreo</h3>
      <div className="row">
        {graphTopics.map((topic) => (
          <div className="col-md-6 mb-4" key={topic}>
            <SensorChartCard topic={topic} color="#007bff" />
          </div>
        ))}
      </div>
    </div>
  );
}
