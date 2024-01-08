const express = require("express");
const app = express();

const { Kafka } = require("kafkajs");
const pool = require("./db");



const http = require("http");
const {Server} = require("socket.io")

// getting port from dotenv
// if not PORT available then use 3002
require("dotenv").config();
const PORT = process.env.PORT || 3002;

// cors config

const cors = require("cors");
const whitelist = [
  "http://localhost:5173",
  "http://10.0.2.2:5173",
  "http://192.168.100.1:5173",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
//allows only select
//app.use(cors(corsOptions));

//allows all
app.use(cors());




////////////////////////////////////
//socket io part
////////////////////////////////////
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const locationProducer = require("./locationProducer")
const responseProducer = require("./responseProducer")
const eventProducer = require("./eventProducer")
const chatProducer = require("./chatProducer")
const driverSockets = {}

io.on("connection",async (socket)=>{
  try{
    const driverId = socket.handshake.query.driverId.toString() // driverId sent from frontend
  console.log(`Driver with id ${driverId} is now online`);
  console.log(socket.handshake.query)
  driverSockets[driverId] = socket;  //every time driver connects 'socket obj' added to driverSockets with key driverId

  console.log(`uuid before db ${driverId}`)
  setOnline = await pool.query(`UPDATE drivers SET driver_status = 'online' WHERE id = $1`,[driverId]) 
  console.log(`uuid after db ${driverId}`);


  socket.on('join_room',(data)=>{
    socket.join(data)
    console.log(`driver with id: ${socket.id} joined room: ${data}`)
  })


  socket.on("current_location",(data,id)=>{
    // console.log(`current_location event: latitude is: ${data.location.lat} and longitude is: ${data.location.lng} meanwhile driver's uuid is: ${id}`)
    locationProducer(data.location,id)  

  })

  socket.on("response", (rideResponse, rideData) => {
    console.log("driver's response is:", rideResponse, rideData);
    const data = { rideResponse, rideData };
    responseProducer(data);
  });

  socket.on("event", (rideState,rideShipmentId,driverId) => {
    console.log("data received on test event: ",rideState);
    console.log("ride shipmentId: ",rideShipmentId)
    console.log("driver id: ",driverId)

    eventProducer(rideState,rideShipmentId,driverId)
    
  });

  socket.on("message",(message,from,to)=>{
    console.log(message,from,to)
    chatProducer(message, from, to);
  })

  socket.on("disconnect",()=>{
    console.log(`Driver with id ${driverId} went offline`)
    setOffline = pool.query(
      `UPDATE drivers SET driver_status = 'offline' WHERE id = $1`,
      [driverId]
    );
    delete driverSockets[driverId]  //on disconnect that specific driver is deleted
  })

  socket.on("reconnect_error", (error) => {
    console.error("Reconnection attempt failed:", error.message);
  });
  }catch(err){
    console.log("error is: ",err)
  }
  
})














// parse options
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/////////
// routes
/////////
//update
//driver/update/*function*
app.use("/driver", require("./routes/update/index"));

//match
//driver/match/*function*
// app.use('/driver',require('./routes/match/index'))

//info
//driver/update/*function*
app.use("/driver",require("./routes/info/index"));

//
// server start:
server.listen(PORT, () => {
  console.log("server started on port 3002");
});









const query = `UPDATE drivers
SET location = ST_SetSRID(ST_MakePoint($3, $2), 4326)
WHERE id = $1;
`;

async function requestConsumer() {
  try {
    const kafka = new Kafka({
      clientId: "transGO",
      brokers: ["192.168.100.59:9092"],
    });

    const consumer = kafka.consumer({ groupId: "driver" });

    await consumer.connect();

    console.log("consumer connected requestConsumer")

    await consumer.subscribe({
      topic: "request",
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async (result) => {

        const {
          userId,
          driverId,
          shipmentId,
          startDescription,
          destinationDescription,
          distance,
          duration,
        } = JSON.parse(result.message.value);
        console.log(
          "shipmentid:",
          userId,
          driverId,
          shipmentId,
          startDescription,
          destinationDescription,
          distance,
          duration
          
        );

        console.log(
          "consumerd driverid is:",
          driverId,
          JSON.parse(result.message.value)
        );
        if(driverId.toString() in driverSockets){
          
          
           // driverSockets[driverId] has a socket
          driverSockets[driverId].emit(
            "request",
            JSON.parse(result.message.value)
          );  //now we are telling to emit request to that specific socket only
          console.log("message sent");
          
        }
        
        
      },
    });
  } catch (err) {
    console.log("consumer err: ", err);
  }
}

requestConsumer();




async function cancelResponseConsumer(){
  try{
    const kafka = new Kafka({
      clientId: "transGO",
      brokers: ["192.168.100.59:9092"],
    })

    const consumer = kafka.consumer({groupId: "response2"})

    await consumer.connect();

    console.log("connected to driver api cancel consumer")

    await consumer.subscribe({
      topic: "response",
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async (result) =>{
        const {response,driverId,shipmentId} = JSON.parse(result.message.value);
        console.log("cancelResponseConsumer: ",response,driverId,shipmentId)

        if(driverId.toString() in driverSockets && response != 'accept'){

          driverSockets[driverId].emit(
            "cancel",
            JSON.parse(result.message.value)
          );

          console.log("cancel message sent to driver APP")
        }
      }
    })

  }catch(err){
    console.log("cancel response consumer error is: ",err)
  }
}

cancelResponseConsumer();









async function chatConsumer() {
  try {
    const kafka = new Kafka({
      clientId: "transGO",
      brokers: ["192.168.100.59:9092"],
    });

    const consumer = kafka.consumer({ groupId: "chat1" });

    await consumer.connect();

    console.log("chat consumer are now connected")

    await consumer.subscribe({
      topic: "chat",
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async (result) => {
        const { message, from, to } = JSON.parse(result.message.value);

        console.log(
          "chat message consumed by driver: ",
          message,
          "from: ",
          from,
          "to: ",
          to
        );

        if(to in driverSockets){
            driverSockets[to].emit("message",message,from,to)
        }
      },
    });
  } catch (err) {
    console.log("user chat consumer error is: ", err);
  }
}

chatConsumer()