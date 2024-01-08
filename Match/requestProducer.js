const { Kafka } = require("kafkajs");

async function run(
  userId,
  driverId,
  destinationLat,
  destinationLng,
  startLat,
  startLng,
  shipmentId,
  startDescription,
  destinationDescription,
  distance,
  duration
) {
  try {
    const kafka = new Kafka({
      cliendId: "transGO",
      brokers: ["192.168.100.59:9092"],
    });

    const producer = kafka.producer();
    console.log("i am establishing connection ......");
    await producer.connect();
    console.log("we are now connected!!");
    const requestObject = {
      userId,
      driverId,
      destinationLat,
      destinationLng,
      startLat,
      startLng,
      shipmentId,
      startDescription,
      destinationDescription,
      distance,
      duration,
    };

    const stringValue = JSON.stringify(requestObject);
    console.log("umair", stringValue);
    //A-M, M-Z

    const result = await producer.send({
      topic: "request",
      messages: [
        {
          value: stringValue,
          partition: 0,
        },
      ],
    });

    console.log("message sent! to driver with id: ", driverId);
    console.log(JSON.stringify(result));
    await producer.disconnect();
  } catch (err) {
    console.log("something bad happened " + err);
  } finally {
    console.log("request produced to topic");
  }
}

module.exports = run;
