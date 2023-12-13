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

                await pool.query(
                  `
                    UPDATE shipment
                    SET status = $1
                    WHERE id = $2;`,
                  [event,shipmentId]
                );

                if(event == "completed"){
                    await pool.query(
                      `UPDATE drivers
                    SET driver_status = 'online' 
                    WHERE id = $1;`,
                      [driverId]
                    );
                }
            }
        })
    }catch(err){
        console.log("event consumer error is: ",err)
    }
}

module.exports = run