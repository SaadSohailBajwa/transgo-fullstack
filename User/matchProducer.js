const { Kafka } = require("kafkajs");

const run = async (userId, driverId, destinationLat, destinationLng,startLat,startLng) => {
  try {
    const kafka = new Kafka({
      clientId: "transGO",
      brokers: ["192.168.100.59:9092"],
    });

    const matchObject = {
      userId: userId,
      driverId: driverId,
      destinationLat,
      destinationLng,
      startLat,
      startLng,
    };
    console.log("driver id :",driverId)
    const stringValue = JSON.stringify(matchObject);

    const producer = kafka.producer();

    await producer.connect();
    console.log("we are now connected to kafka");

    const result = await producer.send({
      topic: "match",
      messages: [
        {
          value: stringValue,
          partition: 0,
        },
      ],
    });

    await producer.disconnect();
  } catch (err) {
    console.log("failed to produce to match topic,err message is: ", err);
  }
};

module.exports = run;
