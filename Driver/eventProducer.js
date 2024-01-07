const {Kafka} = require("kafkajs");

const run = async (event,shipmentId,driverId) => {
    try{
        const kafka = new Kafka({
            clientId: "transGO",
            brokers: ["192.168.100.59:9092"],
        });

        eventObject = {
            event,
            shipmentId,
            driverId,
        };

        const stringValue = JSON.stringify(eventObject);

        const producer = kafka.producer();

        await producer.connect()
        console.log("we are now connected to kafka");

        const result = await producer.send({
            topic: "event",
            messages: [{
                value: stringValue,
                partition: 0
            }]
        })

        await producer.disconnect()

    }catch(err){
        console.log("event producer err is :",err)
    }
}

module.exports = run