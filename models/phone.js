// 准备工作
var mongoose = require('mongoose');
//var Promise = require('bluebird');
var uri = 'mongodb://localhost:27017/Phone';
//var options = { promiseLibrary: Promise };

mongoose.Promise = global.Promise;
mongoose.connect(uri);

var Schema = mongoose.Schema;
var arrPhone = [];

// 开始定义 phone Schema
//Schema用来也只用来定义数据结构，具体对数据的增删改查操作都由Model来执行
var phoneSchema = new Schema({
    device                      : String,    //设备名称
    isSmart                     : Boolean,   //是否为智能手机
    releaseTime                 : Date,      //发布时间 
    price                       : Number,    //售价
    apps                        : [{ name: String }], //手机中安装的App名称,是数组
    manufacturer                : {         //手机厂商
                                        name: String,   //厂商名称
                                        country: String    //厂商国籍
                                    }
});

//添加model实例自定义方法, 只能被iPhoneSE的实例调用，不能被Phone直接调用
phoneSchema.methods.printBrief  = function () {
    console.log(this.device, ' $ ' + this.price);
    console.log('-------------------------------');
};

//添加新的静态方法。只能被Phone调用，不能被Phone实例iPhoneSE直接调用
phoneSchema.statics.printCount = function () {
    console.log(this.device, ' $ ' + this.price);
    this.count({}, (err, count) => {
        console.log('---printCount()-----------------------------')
        if (err) {
            console.log(err);
        } else {
            console.log('phone count=' + count);
        }
    });
};

//通过Api对Schema进行动态扩展
//phoneSchma.add({ color: 'string' });

//转换为Model
var Phone = mongoose.model('Phone', phoneSchema);

//Promisify
//Promise.promisifyAll(Phone);
//Promise.promisifyAll(Phone.prototype);

//实例化出一个数据对象
var raw = require('./raw.phone.json');

var iPhoneSE = new Phone(raw.iPhoneSE);
iPhoneSE.printBrief();
arrPhone.push(iPhoneSE);

var huaweiMate8 = new Phone(raw.huawei_Mate8);
huaweiMate8.printBrief();
arrPhone.push(huaweiMate8);

var miMax = new Phone(raw.mi_max);
miMax.printBrief();
arrPhone.push(miMax);

var s6Edge = new Phone(raw.samsung_S6Edge);
s6Edge.printBrief();
arrPhone.push(s6Edge);

var nokia1000 = new Phone(raw.nokia1000);
nokia1000.printBrief();
arrPhone.push(nokia1000);

console.log('------------------------------------------');




//db = mongoose.connection;

// connection的事件列表可查看:http://mongoosejs.com/docs/api.html#connection_Connection
// 或 ./node_modules/mongoose/lib/connection.js#Connection()
//db.on('error', console.error.bind(console, 'connection error:'));
/*
db.on('open', () => {
    console.log('db open');
    // 先删除所有的数据
    Phone.remove({}, (err) => {
        console.log('---clean db ----------------------------------');
        if (err) {
            console.log('Phone remove all occur a error:', err);
        } else {
            console.log('Phone remove all success.');
            //savePhoneArr(false);
            
        }
    });
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
*/


//单条数据存储 save()是个instance method
iPhoneSE.save().then(
    function (phone) {
        console.log('--- save-----');
        console.log('Phone[' + phone.device + '] saved.  !!!!');
});

//Model.insertMany()一次性批量存储多个
/*
Phone.insertMany(arrPhone).then(
    function (arrPhone) {
        console.log('---insertMany()---------------------------------------');
        console.log('All phone devices saved.insertMany() saved.');
    });

*/