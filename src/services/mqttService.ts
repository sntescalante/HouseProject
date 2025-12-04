// src/services/mqttService.ts
console.log("🟦 mqttService.ts CARGADO DESDE:", import.meta.url);
import mqtt from "mqtt";

const MQTT_URL = "wss://test.mosquitto.org:8081";
const MQTT_TOPIC = "TEAM5/test/log";

const client = mqtt.connect(MQTT_URL, {
  clean: true,
  connectTimeout: 5000,
  reconnectPeriod: 2000,
});

client.on("connect", () => {
  console.log("✅ React conectado por WSS (8084)");
});

client.on("error", (err) => {
  console.error("MQTT Error:", err);
});

export const publishMqttMessage = (topic: string, msg: string) => {
  console.log(`📤 Publicando en ${topic}:`, msg);
  client.publish(topic, msg);
};
