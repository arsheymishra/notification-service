// ES Module compatibility with CommonJS modules
import kafkaNode from 'kafka-node';

// In ES modules, we need to access the default export for CommonJS modules
const { KafkaClient, Producer, Consumer } = kafkaNode;

// Create Kafka client
const client = new KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });

// Create producer and consumer
const producer = new Producer(client);
const consumer = new Consumer(
  client,
  [{ topic: 'notifications', partition: 0 }],
  { autoCommit: true }
);

// Handle connection events
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

