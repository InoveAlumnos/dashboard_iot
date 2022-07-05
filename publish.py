import sys
import paho.mqtt.client as mqtt
import time

def on_connect(mqttc, obj, flags, rc):
    print("rc: "+str(rc))

def on_message(mqttc, obj, msg):
    print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload))

def on_publish(mqttc, obj, mid):
    print("mid: "+str(mid))

def on_subscribe(mqttc, obj, mid, granted_qos):
    print("Subscribed: "+str(mid)+" "+str(granted_qos))

def on_log(mqttc, obj, level, string):
    print(string)

mqttc = mqtt.Client(transport='websockets')   
mqttc.on_message = on_message
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish
mqttc.on_subscribe = on_subscribe

mqttc.tls_set("static/cert/ca.crt")
mqttc.tls_insecure_set(True)

mqttc.connect("23.92.69.190", 9001, 10)

mqttc.subscribe("#", 0)
#mqttc.subscribe("$SYS/#", 0)

mqttc.loop_start()

for i in range(5):
    mqttc.publish("hola", "1")
    time.sleep(1)


# keyfile /etc/mosquitto/certs/server.key
# certfile /etc/mosquitto/certs/server.crt
# tls_version tlsv1