const express = require('express');
const router = express.Router();
const sessioninfo = require('./auth');

router.get('/temp', (req, res) => {
    console.log('hi');
});

const { MedicineModel, CalendarModel } = require('../config/database');
const database = require('../config/database');

router.post('/addMedicine', function (req, res) {
    console.log('/addMedicine 호출됨');
    const { itemName, itemSeq } = req.body;
    console.log(itemName + ",  " + itemSeq);
    const userid = sessioninfo.getSessionInfo();
    //비로그인 상태 일때 로그인 하라고 경고 띄움
    if (userid == undefined) {
        //요청 url 변경
        //req.url = '/auth/naverlogin';
        console.log("로그인 상태 아님!");
        res.status(401).json({ redirect: true, message: '로그인이 필요합니다.' });
    }
    else {
        console.log(userid);
        // MedicineModel을 사용하여 데이터베이스에 약물 정보 저장
        const newMedicine = new MedicineModel({
            id: userid,
            medicine_num: itemSeq,
            medicine_name: itemName,

        });
        newMedicine.save()
            .then(savedMedicine => {
                console.log('Medicine saved successfully:', savedMedicine);
                res.json({ success: true });
            })
            .catch(error => {
                console.error('Error saving medicine:', error);
                res.status(500).json({ success: false, error: "이미 추가된 약입니다." });
            });
    }
});

// 약 리스트 출력 함수
router.route('/listMedicine').get(function (req, res) {
    console.log('/listMedicine 호출됨');

    if (database) {
        const userid = sessioninfo.getSessionInfo();
        console.log("현재 검색한 id : " + userid);

        MedicineModel.find({ id: userid }, function (err, result) {
            if (err) {
                return;
            }
            if (result.length > 0) {
                console.log('id가 가진 약 리스트 찾음.');
                console.log(result);
                res.json(result);
            }
        })
    } else {
        console.log("데이터베이스 객체 초기화 되지 않음. /index.js-58");
    }
})

// 내 계정 달력 이벤트 추가 함수
router.route('/addCalendarEvent').post(function (req, res) {
    console.log('/addCalendarEvent 호출됨');
    const userid = sessioninfo.getSessionInfo();
    console.log(userid + '에 event 추가');
    const { medicineName, medicineNum, startDate, endDate, periodValue, period, dailyDose, meal, mealPeriod, color } = req.body;

    // CalendarModel을 사용하여 데이터베이스에 약물 정보 저장
    const newCalendar = new CalendarModel({
        id: userid,
        medicine_num: medicineNum,
        medicine_name: medicineName,
        startDate: startDate,
        endDate: endDate,
        periodValue: periodValue,
        period: period,
        dailyDose: dailyDose,
        meal: meal,
        mealPeriod: mealPeriod,
        color: color
    });

    newCalendar.save()
        .then(savedMedicine => {
            console.log('Medicine saved successfully:', savedMedicine);
            res.json({ success: true });
        })
        .catch(error => {
            console.error('Error saving medicine:', error);
            res.status(500).json({ success: false, error: error.message });
        });
})

// 내 계정 달력 이벤트 삭제 함수
router.route('/deleteMedicineList').post(function (req, res) {
    console.log('/deleteMedicineList 호출됨');
    const userid = sessioninfo.getSessionInfo();
    const { medicineName } = req.body;
    console.log(medicineName + '의 medicineList 삭제');

    if (database) {
        MedicineModel.deleteOne({ id:userid, medicine_name:medicineName }, function(err, result){
            if (err) {
                return;
            }
            console.log(result);
        });
        CalendarModel.deleteOne({ id:userid, medicine_name:medicineName }, function(err, result){
            if (err) {
                return;
            }
            console.log(result);
        });
    } else {
        console.log("데이터베이스 객체 초기화 되지 않음. /index.js-deleteCalendarEvent");
    }
})

// 달력 이벤트 색깔 수정 함수
router.route('/changeColor').post(function (req, res) {
    console.log('/changeColor 호출됨');
    const userid = sessioninfo.getSessionInfo();
    const { medicineName, color } = req.body;
    console.log(medicineName + '의 color 변경 -> ' + color);

    if (database) {
        CalendarModel.where({id:userid, medicine_name:medicineName}).updateOne({ color:color }, function(err, result){
            if (err) {
                return;
            }
            console.log(result);
        });
    } else {
        console.log("데이터베이스 객체 초기화 되지 않음. /index.js-deleteCalendarEvent");
    }
})

// 달력 이벤트 출력 함수
router.route('/listEvent').get(function (req, res) {
    console.log('/listEvent 호출됨');
    const userid = sessioninfo.getSessionInfo();

    if (database) {
        CalendarModel.find({ id: userid }, function (err, result) {
            if (err) {
                return;
            }
            if (result.length > 0) {
                console.log('id가 가진 약 리스트 찾음.');
                console.log(result);
                res.json(result);
            }
        });
    } else {
        console.log("데이터베이스 객체 초기화 되지 않음. /index.js-listEvent");
    }
})

module.exports = router;