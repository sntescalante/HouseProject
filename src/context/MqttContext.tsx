import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import mqtt from 'mqtt';

// Configuración del Broker
const MQTT_BROKER_URL = 'wss://test.mosquitto.org:8081';

// Definición de Topics por Cuarto
// Puedes agregar o modificar los topics aquí
export const ROOM_TOPICS = {
  room1: [
    'TEAM5/room1/actuator/OLED',
    'TEAM5/room1/sensor/BMP280',
    'TEAM5/room1/sensor/Distance',
    'TEAM5/room1/actuator/Buzzer'
  ],
  room2: [
    'TEAM5/room2/sensor/RFID',
    'TEAM5/room2/actuator/Servo'
  ],
  room3: [
    'TEAM5/room3/sensor/Rain',
    'TEAM5/room3/sensor/LDR',
    'TEAM5/room3/actuator/Servo'
  ]
};

// Aplanar topics para suscripción
const ALL_TOPICS = Object.values(ROOM_TOPICS).flat();

interface MqttContextType {
  client: mqtt.MqttClient | null;
  topicData: Record<string, { time: string; value: number }[]>;
  lastMessages: Record<string, string>;
  isConnected: boolean;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [topicData, setTopicData] = useState<Record<string, { time: string; value: number }[]>>({});
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    console.log("Conectando a MQTT...", MQTT_BROKER_URL);
    const mqttClient = mqtt.connect(MQTT_BROKER_URL);

    mqttClient.on('connect', () => {
      if (!isMounted) return;
      console.log('✅ Conectado al Broker MQTT');
      setIsConnected(true);
      
      // Suscribirse a todos los topics definidos
      mqttClient.subscribe(ALL_TOPICS, (err) => {
        if (!isMounted) return;
        if (err) {
          console.error('❌ Error al suscribirse:', err);
        } else {
          console.log('📡 Suscrito a:', ALL_TOPICS);
        }
      });
    });

    mqttClient.on('message', (topic, message) => {
      if (!isMounted) return;
      const payload = message.toString();
      const value = parseFloat(payload);
      const time = new Date().toLocaleTimeString();

      // Guardar el último mensaje crudo (útil para estados ON/OFF)
      setLastMessages((prev) => ({ ...prev, [topic]: payload }));

      if (!isNaN(value)) {
        setTopicData((prevData) => {
          const currentHistory = prevData[topic] || [];
          // Mantener solo los últimos 20 datos para la gráfica
          const newHistory = [...currentHistory, { time, value }].slice(-20);
          return { ...prevData, [topic]: newHistory };
        });
      }
    });

    mqttClient.on('error', (err) => {
      if (isMounted) {
        console.error('MQTT Error:', err);
        setIsConnected(false);
      }
    });

    setClient(mqttClient);

    return () => {
      isMounted = false;
      mqttClient.end();
    };
  }, []);

  return (
    <MqttContext.Provider value={{ client, topicData, lastMessages, isConnected }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error('useMqtt debe ser usado dentro de un MqttProvider');
  }
  return context;
};
