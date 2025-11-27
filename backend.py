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


# ----------- Config SQL (pymysql) -----------
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

        print(f"[MQTT] Topic: {topic} | Payload: {value}")

        # -------------------------------
        # LIMPIA EL MENSAJE RFID
        # Ej: "RFID UID: 62:a:ce:6d" → "62:a:ce:6d"
        # -------------------------------
        if value.startswith("RFID UID:"):
            uid = value.replace("RFID UID:", "").strip()
        else:
            uid = value

        # Guardar solo el UID limpio
        save_to_db(topic, uid)

    except Exception as e:
        print("Error procesando mensaje:", e)


# ------------------ FUNCIÓN PARA GUARDAR EN MySQL ------------------
def save_to_db(topic, uid):
    try:
        with connection.cursor() as cursor:
            sql = """
                INSERT INTO rfid_logs (topic, uid)
                VALUES (%s, %s)
            """
            cursor.execute(sql, (topic, uid))
            print(f"[SQL] Guardado en BD → {topic}: {uid}")

    except Exception as e:
        print("Error al guardar en MySQL:", e)


# ------------------ MQTT CLIENT ------------------
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)

print("Escuchando mensajes MQTT...")
client.loop_forever()
