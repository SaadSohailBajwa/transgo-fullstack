const { Kafka} = require("kafkajs");
const pool = require("./db");


async function run(){
    try{
        const kafka = new Kafka({
            clientId: "transGO",
            brokers: ["192.168.100.59:9092"]
        });

        const consumer = kafka.consumer({groupId:"response1"})

        await consumer.connect();

        await consumer.subscribe({
            topic: "response",
            fromBeginning:false,
        });

        await consumer.run({
            eachMessage: async(result) =>{
                console.log(`consumed response is ${result.message.value.toString()}`)
                console.log("we got a response from driver")
                const {response,driverId,shipmentId} = JSON.parse(result.message.value)
                console.log("response: ",response)
                //todo: update status in database

                await pool.query("BEGIN");
                if (response == "reject") {
                  await pool.query(
                    `UPDATE drivers
                    SET driver_status = 'online' 
                    WHERE id = $1;`,
                    [driverId]
                  );

                  //shipment db logic here

                  await pool.query(
                    `
                    UPDATE shipment
                    SET status = 'cancelled'
                    WHERE id = $1;`,
                    [shipmentId]
                  );
                } else if (response == "accept") {
                  await pool.query(
                    `UPDATE drivers
                    SET driver_status = 'active' 
                    WHERE id = $1;`,
                    [driverId]
                  );

                  await pool.query(
                    `
                    UPDATE shipment
                    SET status = 'enroute'
                    WHERE id = $1;`,
                    [shipmentId]
                  );
                } else if (response == "busy"){
                    await pool.query(
                      `
                    UPDATE shipment
                    SET status = 'cancelled'
                    WHERE id = $1;`,
                      [shipmentId]
                    );
                }
                 await pool.query("COMMIT");

            }
        })
    }catch(err){
        console.log("response consumer try catch error iss: ",err)
    }
}

module.exports = run;