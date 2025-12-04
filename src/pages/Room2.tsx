import { useState, useEffect } from "react";
import Card from "../components/Cards";
import ToggleSwitch from "../components/ToggleSwitch";
import { publishMqttMessage } from "../services/mqttService";
import SensorChartCard from "../components/SensorChartCard";
import { ROOM_TOPICS, useMqtt } from "../context/MqttContext";

export default function Room2() {
    const { lastMessages } = useMqtt();

    const rfidTopic = "TEAM5/room2/sensor/RFID";
    const servoTopic = "TEAM5/room2/actuator/Servo";

    const [rfidDisplay, setRfidDisplay] = useState("Esperando tarjeta...");
    const latestRfidMsg = lastMessages[rfidTopic];
    const servoStatus = lastMessages[servoTopic] || "Cerrado";

    useEffect(() => {
        if (latestRfidMsg) {
            setRfidDisplay(latestRfidMsg);
            // Limpiar después de 10 segundos
            const timer = setTimeout(() => {
                setRfidDisplay("Esperando tarjeta...");
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [latestRfidMsg]);

    // Filter out topics that we handle manually or are text-based
    const graphTopics = ROOM_TOPICS.room2.filter(t => t !== rfidTopic && t !== servoTopic);

    return (
        <div>
            <h1 className="mb-4">Cuarto 2</h1>
            
            <div className="row mb-4">
                {/* RFID Display */}
                <div className="col-md-6 mb-4">
                    <Card cardTitle="Último Acceso RFID">
                        <div className="p-3 text-center">
                            <h3 className="text-primary">{rfidDisplay}</h3>
                        </div>
                    </Card>
                </div>

                {/* Servo Status */}
                <div className="col-md-6 mb-4">
                    <Card cardTitle="Estado Puerta (Servo)">
                        <div className="p-3 text-center">
                            <h3 className={servoStatus === "OPEN" ? "text-success" : "text-danger"}>
                                {servoStatus}
                            </h3>
                            <small className="text-muted">Automático por RFID</small>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Sensores y Gráficas */}
            {graphTopics.length > 0 && (
                <>
                    <h3 className="mb-3">Monitoreo</h3>
                    <div className="row">
                        {graphTopics.map((topic) => (
                            <div className="col-md-6 mb-4" key={topic}>
                                <SensorChartCard topic={topic} color="#28a745" />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}