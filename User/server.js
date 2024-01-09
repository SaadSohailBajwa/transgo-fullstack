const express = require("express");
const app = express();

const { Kafka } = require("kafkajs");
const pool = require("./db");

const http = require("http");
const { Server } = require("socket.io");

// getting port from dotenv
// if not PORT available then use 3001
require("dotenv").config();
const PORT = process.env.PORT || 3001;

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
const matchProducer = require("./matchProducer");
const cancelResponseProducer = require("./cancelResponseProducer");
const chatProducer = require("./chatProducer");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSockets = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId.toString(); //userId from frontend
  const destinationLat = socket.handshake.query.destinationLat;
  const destinationLng = socket.handshake.query.destinationLng;
  const startLat = socket.handshake.query.startLat;
  const startLng = socket.handshake.query.startLng;
  const driverId = socket.handshake.query.driverId;
  const startDescription = socket.handshake.query.startDescription;
  const destinationDescription = socket.handshake.query.destinationDescription;
  const distance = socket.handshake.query.distance;
  const duration = socket.handshake.query.duration;

  console.log(`User with id ${userId} connected to server`);
  // console.log(`User with id ${userId} connected to server with user startLat: ${startLat} and startLng: ${startLng} destination destinationLat: ${destinationLat} and destinationLng ${destinationLng} want to make request to driverrrrrrrrrrrrrrrrrr with id ${driverId} with start location name ${startDescription} and duration of ${duration}`)

  //produce lag destinationLng and userId to kafka topic logic here
  if (driverId) {
    matchProducer(
      userId,
      driverId,
      destinationLat,
      destinationLng,
      startLat,
      startLng,
      startDescription,
      destinationDescription,
      distance,
      duration
    );
    console.log("driverid exists therefor sent to topic");
  }

  //every time user connect we need to make sure its location is different from others
  userSockets[userId] = socket;

  socket.on("cancel", (response, driverId, shipmentId) => {
    console.log("cancel shipment id: ", shipmentId);
    console.log("cancel driver id: ", driverId);
    console.log("cancel response : ", response);
    const cancelData = { response, driverId, shipmentId };
    cancelResponseProducer(cancelData);
  });

  socket.on("message", (message, from, to) => {
    console.log(message, from, to);
    chatProducer(message, from, to);
  });

  socket.on("disconnect", () => {
    console.log(
      `user with id ${userId} disconnectedddddddddddddddd from server`
    );
    delete userSockets[userId];
  });
});

async function responseConsumer() {
  try {
    const kafka = new Kafka({
      clientId: "transGO",
      brokers: ["20.121.127.147:9092"],
    });

    const consumer = kafka.consumer({ groupId: "response" });

    await consumer.connect();

    await consumer.subscribe({
      topic: "response",
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async (result) => {
        const { response, userId, driverId, shipmentId } = JSON.parse(
          result.message.value
        );
        console.log(`consumed response is ${result.message.value}`);
        console.log("we got a response from driver");

        console.log("response is:", response);
        console.log("userid is:", userId);
        console.log("driverid is: ", driverId);

        if (userId.toString() in userSockets) {
          userSockets[userId].emit("response", response, shipmentId);
          console.log("response sent to client: ", response, shipmentId);
          if (response == "reject") {
            delete userSockets[userId];
          }
        }
        //since after accept user is connected with driverId
        //when response is consumed we now use the same driver's id
        if (driverId.toString() in userSockets) {
          userSockets[driverId].emit("response", response);
          console.log(
            "response sent to client who is connected as driverId: ",
            response,
            userId
          );
          if (response == "reject") {
            delete userSockets[driverId];
          }
        }
      },
    });
  } catch (err) {
    console.log("erros iss: ", err);
  }
}

responseConsumer();

async function locationConsumer() {
  try {
    const kafka = new Kafka({
      clientId: "transGO",
      brokers: ["20.121.127.147:9092"],
    });

    const consumer = kafka.consumer({ groupId: "user1" });

    await consumer.connect();
    console.log("connected to location topic");
    await consumer.subscribe({
      topic: "location",
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async (result) => {
        const { id, lat, lng } = JSON.parse(result.message.value);
        // console.log(`consumed location is ${result.message.value}`);

        const locationObject = { id, lat, lng };

        if (id.toString() in userSockets) {
          userSockets[id].emit("driverLocation", locationObject);
          console.log("location sent to client");
        }
      },
    });
  } catch (err) {
    console.log("erros iss: ", err);
  }
}

locationConsumer();

async function eventConsumer() {
  try {
    const kafka = new Kafka({
      clientId: "transGO",
      brokers: ["20.121.127.147:9092"],
    });

    const consumer = kafka.consumer({ groupId: "event1" });

    await consumer.connect();

    console.log("connected to event consumer");

    await consumer.subscribe({
      topic: "event",
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async (result) => {
        const { event, shipmentId, driverId } = JSON.parse(
          result.message.value
        );

        console.log("eeeeeeeeeeevent consumed: ", event, shipmentId, driverId);

        if (driverId in userSockets) {
          userSockets[driverId].emit("event", event);
        }

        if (event == "completed") {
          delete userSockets[driverId];
        }
      },
    });
  } catch (err) {
    console.log("event consumer error is: ", err);
  }
}

eventConsumer();

async function chatConsumer() {
  try {
    const kafka = new Kafka({
      clientId: "transGO",
      brokers: ["20.121.127.147:9092"],
    });

    const consumer = kafka.consumer({ groupId: "chat" });

    await consumer.connect();

    await consumer.subscribe({
      topic: "chat",
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async (result) => {
        const { message, from, to } = JSON.parse(result.message.value);

        console.log(
          "chat message consumed by user: ",
          message,
          "from: ",
          from,
          "to: ",
          to
        );

        if (from in userSockets) {
          userSockets[from].emit("message", message, from, to);
        }
      },
    });
  } catch (err) {
    console.log("user chat consumer error is: ", err);
  }
}

chatConsumer();

// parse options
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/////////
// routes
/////////
//update
//user/update/*function*
app.use("/user", require("./routes/update/index"));

//info
//user/info/*function*
app.use("/user", require("./routes/info/index"));

//
// server start:
server.listen(PORT, () => {
  console.log("user server started on port 3001");
});
