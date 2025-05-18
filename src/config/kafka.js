import kafkaNode from 'kafka-node';

const { KafkaClient, Producer, Consumer } = kafkaNode;

const client = new KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const producer = new Producer(client);
const consumer = new Consumer(
  client,
  [{ topic: 'notifications', partition: 0 }],
  { autoCommit: true }
);

producer.on('ready', () => {
  console.log('Kafka producer is ready');
});

producer.on('error', (err) => {
  console.error('Kafka producer error:', err);
});

consumer.on('error', (err) => {
  console.error('Kafka consumer error:', err);
});

export { producer, consumer };

