import paho.mqtt.client as mqtt
import pymysql
import json

# ----------- Config MQTT -----------
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = ["TEAM5/room1/actuator/OLED",
            "TEAM5/room1/sensor/BMP2080",
            "TEAM5/room1/sensor/Distance",
            "TEAM5/room1/actuator/Buzzer",
            "TEAM5/room2/sensor/RFID",
            "TEAM5/room2/sensor/Button",
            "TEAM5/room2/actuator/Servo",
            "TEAM5/room3/sensor/Rain",
            "TEAM5/room3/actuator/Servo",
            "TEAM5/room3/sensor/LDR",
            "TEAM5/room3/actuator/Buzzer"] 


# ----------- Config SQL -----------
connection = pymysql.connect(
    host="localhost",
    user="root",
    password="",
    database="",
    cursorclass=pymysql.cursors.DictCursor,
    autocommit=True
)

# ------------------ CALLBACKS MQTT ------------------
def on_connect(client, userdata, flags, rc):
    print("Attempting to connect to MQTT broker:", rc)
    for t in MQTT_TOPIC:
        client.subscribe(t)

def on_message(client, userdata, msg):
    try:
        topic = msg.topic
        value = msg.payload.decode().strip()

        save_to_db(topic, value)

    except Exception as e:
        print("Error procesando mensaje:", e)

# ------------------ FUNCTION TO STORE DATA IN SQL DATABASE ------------------
def save_to_db(topic, value):
    try:
        parts = topic.split('/')  
        location_str = parts[1]         # Room
        device_kind = parts[2]          # Sensor or actuator
        device_type = parts[3]          # Type

        #To remove the room part from the topic to obtain the ID only
        location_id = int(location_str.replace("room", "")) 

        with connection.cursor() as cursor:

            #--------------------- If device is a SENSOR -----------------------------
            if device_kind == "sensor":
                cursor.execute("""
                    SELECT SensorID FROM sensor
                    WHERE LocationID = %s AND Type = %s
                """, (location_id, device_type))
                
                result = cursor.fetchone()
                if result:
                    sensor_id = result["SensorID"]

                    cursor.execute("""
                        INSERT INTO sensorreadings (SensorID, Value)
                        VALUES (%s, %s)
                    """, (sensor_id, value))

                    return
                else:
                    print(f"SENSOR NOT FOUND!!!.")
                    return

            # --------------------- ACTUATORS ---------------------
            elif device_kind == "actuator":
                cursor.execute("""
                    SELECT ActuatorID FROM actuator
                    WHERE LocationID = %s AND Type = %s
                """, (location_id, device_type))
                
                result = cursor.fetchone()
                if result:
                    actuator_id = result["ActuatorID"]

                    cursor.execute("""
                        INSERT INTO actuatorvalues (ActuatorID, Value)
                        VALUES (%s, %s)
                    """, (actuator_id, value))

                    print(f"[SQL] ACTUATOR → {device_type} (ID {actuator_id}) = {value}")
                    return
                else:
                    print("[WARN] Actuador no encontrado en BD.")
                    return

            else:
                print("[WARN] Topic desconocido →", topic)

    except Exception as e:
        print("Error al guardar en MySQL:", e)

# ------------------ MQTT CLIENT ------------------

def main():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)

    print("Escuchando mensajes MQTT...")
    client.loop_forever()


if __name__ == '__main__':
    main()

