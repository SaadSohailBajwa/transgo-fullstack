const { Kafka } = require("kafkajs");
const pool = require("./db");
const requestProducer = require("./requestProducer");
const responseProducer = require("./responseProducer");

async function run() {
  try {
    const kafka = new Kafka({
      clientId: "transGO",
      brokers: ["20.121.127.147:9092"],
    });

    const consumer = kafka.consumer({ groupId: "match" });

    await consumer.connect();

    await consumer.subscribe({
      topic: "match",
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async (result) => {
        const {
          userId,
          driverId,
          destinationLat,
          destinationLng,
          startLat,
          startLng,
          startDescription,
          destinationDescription,
          distance,
          duration,
        } = JSON.parse(result.message.value);
        console.log(`consumed match on partition ${result.partition}`);
        // console.log(userId, driverId, destinationLat, destinationLng,startLat,startLng);

        try {
          const check = await pool.query(
            "select driver_status from drivers where id=$1",
            [driverId]
          );

          const shipment = await pool.query(
            "INSERT INTO shipment (start_location, destination_location, user_id, driver_id, status)VALUES (ST_MakePoint($3, $4), ST_MakePoint($5,$6), $1,$2,'pending' )RETURNING *;",
            [
              userId,
              driverId,
              startLng,
              startLat,
              destinationLng,
              destinationLat,
            ]
          );

          const shipmentId = shipment.rows[0].id;
          console.log(
            "shipment row made with status: pending",
            shipment.rows[0].id
          );
          if (check.rows[0].driver_status === "online") {
            console.log("driver status:", check.rows[0].driver_status);

            await pool.query(
              `UPDATE drivers
                  SET driver_status = 'pending'
                  WHERE id = $1`,
              [driverId]
            );
            //if driver online? then send him request
            requestProducer(
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
            );
          } else if (
            check.rows[0].driver_status === "pending" ||
            check.rows[0].driver_status === "active"
          ) {
            const responseObject = {
              response: "busy",
              userId,
              driverId: "empty",
              shipmentId,
            };
            responseProducer(responseObject);
          }
        } catch (err) {
          console.log("errrr", err);
        }
      },
    });
  } catch (err) {
    console.log("consumer err: ", err);
  }
}

module.exports = run;
