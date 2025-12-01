# =======================================================
# === TU CODIGO ORIGINAL (NO CAMBIADO, NO EDITADO) ======
# =======================================================

import paho.mqtt.client as mqtt
import pymysql
import json

# ----------- Config MQTT -----------
MQTT_BROKER = "test.mosquitto.org"
MQTT_PORT = 1883
MQTT_TOPIC = ["TEAM5/room1/actuator/OLED",
            "TEAM5/room1/sensor/BMP280",
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
    database="houseproject",
    cursorclass=pymysql.cursors.DictCursor,
    autocommit=True
)

# ------------------ CALLBACKS MQTT ------------------
def on_connect(client, userdata, flags, rc):
    print("Attempting to connect to MQTT broker:", rc)
    for t in MQTT_TOPIC:
        client.subscribe(t)

# ----------- Obtain TOPIC AND VALUE --------------
def on_message(client, userdata, msg):
    try:
        topic = msg.topic
        value = msg.payload.decode().strip()

        save_to_db(topic, value)

        # === NUEVO: reenviar a WebSocket en tiempo real ===
        import asyncio
        asyncio.get_event_loop().create_task(
            forward_mqtt(topic, value)
        )

    except Exception as e:
        print("Error procesando mensaje:", e)

# ------------------ FUNCTION TO STORE DATA IN SQL DATABASE ------------------
def save_to_db(topic, value):
    try:
        parts = topic.split('/')  
        location_str = parts[1]         
        device_kind = parts[2]          
        device_type = parts[3]          

        location_id = int(location_str.replace("room", "")) 

        with connection.cursor() as cursor:

            # --------------------- If device is a SENSOR -----------------------------
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

                    return
                else:
                    print("ACTUATOR NOT FOUND!!!")
                    return

            else:
                print("UNKOKN TOPIC: ", topic)

    except Exception as e:
        print("COULDN'T BE SAVED TO DB: ", e)


# =======================================================
# ========= AQUI EMPIEZA LO AÑADIDO ======================
# =======================================================

import asyncio
import websockets
from websockets.exceptions import ConnectionClosed

# ---------------------- SALAS ----------------------
rooms = {
    "room1": set(),
    "room2": set(),
    "room3": set(),
    "general": set()
}

# ---------------------- PUENTE MQTT → WS ----------------------
ws_broadcaster = None

def register_broadcaster(func):
    global ws_broadcaster
    ws_broadcaster = func

async def forward_mqtt(topic, value):
    if ws_broadcaster is None:
        return

    try:
        parts = topic.split("/")
        room = parts[1]     # room1, room2, room3
    except:
        room = "general"

    await ws_broadcaster({
        "type": "mqtt_update",
        "topic": topic,
        "value": value,
        "room": room
    })


# ---------------------- BROADCAST POR SALA ----------------------
async def broadcast(message):
    room = message.get("room", "general")

    if room not in rooms:
        room = "general"

    if rooms[room]:
        await asyncio.wait([
            ws.send(json.dumps(message))
            for ws in rooms[room]
        ])

register_broadcaster(broadcast)


# ---------------------- HANDLER WS ----------------------
async def ws_handler(websocket, path):

    # Espera selección de sala
    join_msg = await websocket.recv()
    join_msg = json.loads(join_msg)
    room = join_msg.get("room", "general")

    if room not in rooms:
        room = "general"

    rooms[room].add(websocket)
    print(f"Cliente conectado a {room}")

    try:
        async for message in websocket:
            data = json.loads(message)
            action = data.get("action")

            # === React pide sensores ===
            if action == "get_sensors":
                with connection.cursor() as cursor:
                    cursor.execute("SELECT * FROM sensorreadings ORDER BY Timestamp DESC LIMIT 50")
                    result = cursor.fetchall()
                    await websocket.send(json.dumps({
                        "type": "sensor_data",
                        "data": result
                    }))

            # === React pide actuadores ===
            elif action == "get_actuators":
                with connection.cursor() as cursor:
                    cursor.execute("SELECT * FROM actuatorvalues ORDER BY Timestamp DESC LIMIT 50")
                    result = cursor.fetchall()
                    await websocket.send(json.dumps({
                        "type": "actuator_data",
                        "data": result
                    }))

            # === React envía comando al Arduino ===
            elif action == "set_actuator":
                import paho.mqtt.publish as publish
                topic = data["topic"]
                value = data["value"]

                publish.single(topic, value, hostname="test.mosquitto.org")

                await websocket.send(json.dumps({
                    "type": "ack",
                    "message": f"MQTT enviado: {topic} → {value}"
                }))

            # ======================================================
            # === NUEVO: React pide graficas por tipo de sensor ===
            # ======================================================
            elif action == "get_graph":
                sensor_type = data.get("sensor_type")  # ej. "BMP280", "LDR"

                with connection.cursor() as cursor:
                    cursor.execute("""
                        SELECT sr.Value, sr.Timestamp 
                        FROM sensorreadings sr
                        JOIN sensor s ON sr.SensorID = s.SensorID
                        WHERE s.Type = %s
                        ORDER BY sr.Timestamp DESC
                        LIMIT 100
                    """, (sensor_type,))
                    
                    result = cursor.fetchall()

                # regresamos datos listos para gráficas
                await websocket.send(json.dumps({
                    "type": "graph_data",
                    "sensor_type": sensor_type,
                    "labels": [str(r["Timestamp"]) for r in result][::-1],
                    "values": [float(r["Value"]) for r in result][::-1]
                }))

    except ConnectionClosed:
        print(f"Cliente desconectado de {room}")

    finally:
        rooms[room].remove(websocket)


# ---------------------- INICIAR SERVIDORES ----------------------
def start_websocket_server():
    return websockets.serve(ws_handler, "localhost", 8765)


# ---------------------- MQTT CLIENT ----------------------
def start_mqtt():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    return client


# ---------------------- MAIN GLOBAL ----------------------
def main():
    mqtt_client = start_mqtt()

    loop = asyncio.get_event_loop()

    loop.run_until_complete(start_websocket_server())
    print("WebSocket server running at ws://localhost:8765")

    loop.run_in_executor(None, mqtt_client.loop_forever)

    loop.run_forever()


if __name__ == '__main__':
    main()
