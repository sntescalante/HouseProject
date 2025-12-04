import paho.mqtt.client as mqtt
import pymysql
import json

# ----------- Config MQTT -----------
MQTT_BROKER = "test.mosquitto.org"
MQTT_PORT = 1883

MQTT_TOPIC = [
    "TEAM5/room1/actuator/OLED",
    "TEAM5/room1/sensor/BMP280",
    "TEAM5/room1/sensor/Distance",
    "TEAM5/room1/actuator/Buzzer",
    "TEAM5/room2/sensor/RFID",
    "TEAM5/room2/sensor/Button",
    "TEAM5/room2/actuator/Servo",
    "TEAM5/room3/sensor/Rain",
    "TEAM5/room3/actuator/Servo",
    "TEAM5/room3/sensor/LDR",
    "TEAM5/room3/actuator/Buzzer"
]

# ----------- Config SQL -----------
connection = pymysql.connect(
    host="127.0.0.1",
    user="root",
    password="",
    database="houseproject",
    cursorclass=pymysql.cursors.DictCursor,
    autocommit=True
)

# --------------------------------------------------------------------
# ------------------------ MQTT CALLBACKS ----------------------------
# --------------------------------------------------------------------

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker:", rc)

    for t in MQTT_TOPIC:
        client.subscribe(t)
        print("Subscribed to:", t)

def on_message(client, userdata, msg):
    try:
        topic = msg.topic
        value = msg.payload.decode().strip()

        print(f"[MQTT] {topic}: {value}")
        save_to_db(topic, value)

    except Exception as e:
        print("Error:", e)

# --------------------------------------------------------------------
# ------------------------ SAVE TO DATABASE ---------------------------
# --------------------------------------------------------------------

def save_to_db(topic, value):
    try:
        parts = topic.split('/')
        location_str = parts[1]
        device_kind = parts[2]
        device_type = parts[3]

        location_id = int(location_str.replace("room", ""))

        with connection.cursor() as cursor:

            # --------------------- SENSORS ---------------------
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

                    print(f"SENSOR SAVED: {device_type}: {value}")
                    return
                else:
                    print("SENSOR NOT FOUND:", topic)
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

                    print(f"ACTUATOR SAVED: {device_type}: {value}")
                    return
                else:
                    print("ACTUATOR NOT FOUND:", topic)
                    return

            else:
                print("UNKNOWN TOPIC:", topic)

    except Exception as e:
        print("ERROR SAVING TO DB:", e)

# --------------------------------------------------------------------
# ---------------------------- MAIN ---------------------------------
# --------------------------------------------------------------------

def start_mqtt():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    return client

def main():
    mqtt_client = start_mqtt()
    mqtt_client.loop_forever()

if __name__ == '__main__':
    main()
