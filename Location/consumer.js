const { Kafka } = require("kafkajs");
const pool = require("./db");

const query = `UPDATE drivers
SET location = ST_SetSRID(ST_MakePoint($3, $2), 4326)
WHERE id = $1;
`;

async function run() {
  try {
    const kafka = new Kafka({
      clientId: "transGO",
      brokers: ["192.168.100.59:9092"],
    });

    const consumer = kafka.consumer({ groupId: "location" });

    await consumer.connect();

    await consumer.subscribe({
      topic: "location",
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async (result) => {
        const {id,lat,lng} = JSON.parse(result.message.value);
        console.log(
          `consumed message ${result.message.value} on partition ${result.partition}`
        );
        console.log(id,lat,lng);
        const updateLocation = await pool.query(query,[id,lat,lng])
        console.log("location update in db success")


      },
    });
  } catch (err) {
    console.log("consumer err: ", err);
  }
}

run();
