const mongoose = require('mongoose');

// 스키마 정의
const UserSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, default: '' },
    name: { type: String, default: '' },
});

const MedicineSchema = mongoose.Schema({
    id: { type: String, required: true },
    medicine_num: { type: Number, required: true, unique: true, default: ' ' }, //(약 품목번호)
    medicine_name: { type: String, required: true, default: ' ' } //(약 이름)
});

const CalendarSchema = mongoose.Schema({
    id: { type: String, required: true },                           //(외래키)(사용자 id) 
    medicine_num: { type: String, required: true, unique: true},           //(외래키)(약 품목번호)
    medicine_name: { type: String, required: true },     //(약 이름)
    startDate: { type: Date, default: Date.now },                //(시작 날짜)
    endDate: { type: Date, default: Date.now },                //(종료 날짜)
    periodValue: { type: Number, default: 1 },                //(복용 기간 - 수)
    period: { type: String, default: '일' },                        //(복용 기간 - 기간("일","주","개월"))
    dailyDose: { type: Number, default: 1 },                    //(일일 복용량)
    meal: { type: Array },                                //(먹는 시간 - ("아침","점심","저녁"))
    mealPeriod: { type: Array },                            //(먹는 시간 - ("식전","식중","식후"))
});

// 스키마에 static으로 findById 메소드 추가
UserSchema.statics.findById = function (id, callback) {
    return this.find({ id: id }, callback);
};

// 모델 정의
const UserModel = mongoose.model("users", UserSchema);
const MedicineModel = mongoose.model("medicine_list", MedicineSchema);
const CalendarModel = mongoose.model("calendar_event", CalendarSchema);

// 데이터베이스 연결 함수
function connectDB() {
    const databaseUrl = 'mongodb://localhost:27017/MediCalendar';

    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'mongoose connection error.'));
    db.once('open', function () {
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
    });

    db.on('disconnected', function () {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setTimeout(connectDB, 5000);
    });
}

module.exports = {
    connectDB: connectDB,
    UserModel: UserModel,
    MedicineModel: MedicineModel,
    CalendarModel: CalendarModel
};
