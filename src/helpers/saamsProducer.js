console.log("producer")
const { Kafka } = require('kafkajs');
//const { Partitioners } = require('kafkajs')
const { BadRequestError } = require('../errors')
require('dotenv').config();

/*const kafka = new Kafka({
    brokers: [
        process.env.BROKER1,
        process.env.BROKER2,
        process.env.BROKER3,
    ],
    sasl: {
        mechanism: "scram-sha-512", // scram-sha-256 or scram-sha-512,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
    },
    ssl: true,
});*/

//localhost kafka
const kafka = new Kafka({
    clientId: process.env.SAAMS_CLIENT_ID,
    brokers: [process.env.BROKER]
})

const producer = kafka.producer()
//kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })

module.exports.sendDataToSaamsServices = async (reqBody) => {
    console.log("reqbody+++++++++",reqBody)

    const produceMessage = async () => {

        try {
            const sendMessage = await producer.send({
                topic: process.env.SAAMS_DATA_TOPIC,
                messages: [
                    { value: JSON.stringify(reqBody) },
                ],
            })
            if(sendMessage){
                console.log("MESSAGE SENT TO SAAMS SERVICES");
                console.log("Message : ",sendMessage)
            }

        } catch (error) {
            console.log("SEND MESSAGE TO SAAMS SERVICES::", error);
        }

    }

    await producer.connect()
    if (!producer.connect()) {
        BadRequestError("Producer not connected");
    }

    await produceMessage()
    await producer.disconnect()

}