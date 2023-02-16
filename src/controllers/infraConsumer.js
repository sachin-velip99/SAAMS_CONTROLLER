console.log("consumer")
const { Kafka } = require('kafkajs')
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

//local kafka  
const kafka = new Kafka({
    clientId: 'my-consumer',
    brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: process.env.GROUP_INFRA })

module.exports.infraDataConsumer = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: process.env.INFRA_DATA_TOPIC })

    await consumer.run({
        eachMessage: async ({ topic, partition, message, }) => {
            const reqBody = JSON.parse(message.value.toString())
            const key = message.key.toString()
            console.log({
                partition,
                offset: message.offset,
                key: key,
                value: reqBody,
            })
            console.log("KAFKA MESSAGE CONSUMED");
            /*const result = await processMessage({ topic, partition, message });
            console.log("result", result);
            const { success, error } = result || {}

            /*if (!success) {
                //console.error(`Error processing message: ${error}`)
                console.log("return to consuming messages")

                return;
            }*/

        },
    })
}