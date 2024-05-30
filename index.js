const express = require('express');
const router = express.Router();
const sessionifno = require('./auth');

router.get('/', (req, res) => {
    res.send('Hello World!');
});
var cors = require('cors');


const { MedicineModel } = require('../config/database');
//const { isRedirect } = require('node-fetch');

router.post('/addMedicine', function (req, res) {
    console.log('/addMedicine 호출됨');
    const { itemName, itemSeq } = req.body;
    console.log(itemName + ",  " + itemSeq);
    const userid = sessionifno.getSessionInfo();
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

module.exports = router;

