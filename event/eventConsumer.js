const { Kafka } = require("kafkajs");
const pool = require("./db")

async function run(){
    try{
        const kafka = new Kafka({
            clientId:"transGO",
            brokers: ["192.168.100.59:9092"]
        });

        const consumer = kafka.consumer({groupId: "event"})

        await consumer.connect();

        await consumer.subscribe({
            topic: "event",
            fromBeginning: false,
        });

        await consumer.run({
            eachMessage: async(result) =>{
                
                const { event, shipmentId, driverId } = JSON.parse(
                  result.message.value
                );

                console.log(event,shipmentId,driverId)
                if(event == "started"){
                  const currentTime = new Date();
                  console.log(
                    "Current Time:",
                    currentTime.toUTCString()
                  );

                  await pool.query(
                    `
                    UPDATE shipment
                    SET status = $1, start_time= $2
                    WHERE id = $3;`,
                    [event, currentTime.toUTCString(), shipmentId]
                  );

                }else if(event == "completed"){
                    await pool.query(
                      `UPDATE drivers
                    SET driver_status = 'online' 
                    WHERE id = $1;`,
                      [driverId]
                    );

                    const currentTime = new Date();
                    console.log(
                      "Current Time:",
                      currentTime.toLocaleTimeString()
                    );

                    await pool.query(
                      `
                    UPDATE shipment
                    SET status = $1, end_time= $2
                    WHERE id = $3;`,
                      [event, currentTime.toUTCString(), shipmentId]
                    );

                }else{
                  await pool.query(
                  `
                    UPDATE shipment
                    SET status = $1
                    WHERE id = $2;`,
                  [event,shipmentId]
                );
                }
                
            }
        })
    }catch(err){
        console.log("event consumer error is: ",err)
    }
}

module.exports = run