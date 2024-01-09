const { Kafka } = require("kafkajs");

const run = async (message, from, to) => {
  try {
    const kafka = new Kafka({
      clientId: "transGO",
      brokers: ["20.121.127.147:9092"],
    });

    const chatObject = {
      message,
      from,
      to,
    };

    console.log(
      "chat message produced by driver: ",
      message,
      "from: ",
      from,
      "to: ",
      to
    );

    const stringValue = JSON.stringify(chatObject);

    const producer = kafka.producer();

    await producer.connect();
    console.log("we are now connected to kafka");

    const result = await producer.send({
      topic: "chat",
      messages: [
        {
          value: stringValue,
          partition: 0,
        },
      ],
    });

    await producer.disconnect();
  } catch (err) {
    console.log("err message is: ", err);
  }
};

module.exports = run;
