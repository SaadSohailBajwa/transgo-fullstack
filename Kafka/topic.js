const { Kafka } = require("kafkajs");

const makeTopic = async () => {
  try {
    const kafka = new Kafka({
      clientId: "transGO",
      brokers: ["192.168.100.59:9092"], //can have multiple in this array, so when one goes down etc
    });

    const admin = kafka.admin();
    await admin.connect();

    await admin.createTopics({
      topics: [
        {
          topic: "location",
          numPartitions: 1,
        },
        {
          topic: "response",
          numPartitions: 1,
        },
        {
          topic: "request",
          numPartitions: 1,
        },
        {
          topic: "match",
          numPartitions: 1,
        },
        {
          topic:"event",
          numPartitions: 1,
        },
        {
          topic:"chat",
          numPartitions:1,
        }
      ],
    });

    console.log("topics created success");
    await admin.disconnect();
  } catch (err) {
    console.log("kafka error is:", err);
  } finally {
    process.exit(0);
  }
};

makeTopic();
