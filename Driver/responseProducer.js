const {Kafka} = require("kafkajs");

const run = async (data)=>{
    try{
        const kafka = new Kafka({
          clientId: "transGO",
          brokers: ["192.168.100.59:9092"],
        });
        // console.log("data isss",data)
        const responseObject = {
            response:data.rideResponse,
            userId:data.rideData.userId,
            driverId:data.rideData.driverId,
            shipmentId:data.rideData.shipmentId,
        }

        const stringValue = JSON.stringify(responseObject);

        const producer = kafka.producer();

        await producer.connect();
        console.log("responseProducerrrrrrrrrrrrrrrr now connected to kafka")

        const result = await producer.send({
            topic: "response",
            messages: [{
                value:stringValue,
                partition:0
            }]
        })
        console.log("response produced to response topic: ",stringValue)
        await producer.disconnect()

    }catch(err){
        console.log("error iss: ",err)
    }
}

module.exports = run;