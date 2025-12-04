import { useState } from "react";
import Card from "../components/Cards";
import ToggleSwitch from "../components/ToggleSwitch";
import { publishMqttMessage } from "../services/mqttService";
import SensorChartCard from "../components/SensorChartCard";
import { ROOM_TOPICS } from "../context/MqttContext";

export default function Room3() {
    const [servoOn, setServoOn] = useState(false);

    const toggleServo = () => {
        const newState = !servoOn;
        setServoOn(newState);
        // Invertido: Si el toggle está ON, mandamos OFF y viceversa
        publishMqttMessage("TEAM5/room3/actuator/Servo", newState ? "OFF" : "ON");
    };

    const graphTopics = ROOM_TOPICS.room3.filter(t => !t.includes("Servo"));

    return (
        <div>
            <h1 className="mb-4">Cuarto 3</h1>

            {/* Controles */}
            <div className="row mb-4">
                <div className="col-md-6 mb-4">
                    <Card cardTitle="Control Servo">
                        <ToggleSwitch checked={servoOn} onChange={toggleServo} />
                    </Card>
                </div>
            </div>

            {/* Sensores y Gráficas */}
            <h3 className="mb-3">Monitoreo</h3>
            <div className="row">
                {graphTopics.map((topic) => (
                    <div className="col-md-6 mb-4" key={topic}>
                        <SensorChartCard topic={topic} color="#dc3545" />
                    </div>
                ))}
            </div>
        </div>
    );
}