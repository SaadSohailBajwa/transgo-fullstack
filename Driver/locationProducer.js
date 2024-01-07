const {Kafka} = require("kafkajs");

const run = async (location,id)=>{
    try{
        const kafka = new Kafka({
            clientId: "transGO",
            brokers: ["192.168.100.59:9092"],
        });



        const locationObject = {
          id: id,
          lat: location.lat,
          lng: location.lng,
        };

        const stringValue = JSON.stringify(locationObject);



        const producer = kafka.producer();

        await producer.connect()
        console.log("we are now connected to kafka");

        const result = await producer.send({
            "topic" : "location",
            "messages": [{
                "value": stringValue,
                "partition": 0
            }]
        })

        await producer.disconnect()
    }catch(err){
        console.log("err message is: ",err)
    }
}

module.exports = run