const express = require('express');
const router = express.Router();
const sessionifno = require('./auth');

router.get('/', (req, res) => {
    res.send('Hello World!');
});

const { MedicineModel } = require('../config/database');

router.post('/addMedicine', function(req, res) {
    console.log('/addMedicine 호출됨');
    const { itemName, itemSeq } = req.body;
    console.log(itemName +",  "+ itemSeq);
    const userid = sessionifno.getSessionInfo();
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
            res.status(500).json({ success: false, error: error.message });
        });
});

module.exports = router;

