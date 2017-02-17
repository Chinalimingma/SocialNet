// 获得db对象
db = mongoose.connection;

// 各种事件connection的事件列表可查看:
//http://mongoosejs.com/docs/api.html#connection_Connection

db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => {
    console.log('db open');
});
db.on('connecting', () => {
    console.log('db connecting...');
});
db.on('connected', () => {
    console.log('db connected');
});
db.on('disconnecting', () => {
    console.log('db disconnecting...');
});
db.on('disconnected', () => {
    console.log('db disconnected');
});
db.on('close', () => {
    console.log('db close');
});

mongoose.connect('mongodb://localhost:27017/Contact');


// 关闭的两种方式
// mongoose.connection.close(); 等同于 db.close();
mongoose.disconnect();