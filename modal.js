import { modal, selectedMedicineName } from './medicineList.js';
import { renderCalendar } from './calendar.js';

// 달력의 약 정보
export let medicineInfo = {};

const btnCloseModal = document.getElementById("modal_close");
const btnCalendarCloseModal = document.getElementById("modal_CalendarClose");
const btnCalendarAddModal = document.getElementById("modal_CalendarAdd");
const startDate = document.getElementsByName("startDate")[0];
const periodValue = document.getElementsByName("periodValue")[0];
const period = document.getElementsByName("period")[0];
const days = document.getElementsByName("days");
const dailyDose = document.getElementsByName("dailyDose")[0];
const meals = document.getElementsByName("meal");
const meal_period = document.getElementsByName("meal-period");

let today_Date = new Date();
today_Date = today_Date.toISOString().slice(0, 10);
startDate.value = today_Date;

btnCloseModal.addEventListener("click", () => {
    modal.style.display = "none";
    initialization();
})
btnCalendarCloseModal.addEventListener("click", () => {
    modal.style.display = "none";
    initialization();
})
btnCalendarAddModal.addEventListener("click", () => {
    let selectedDays = new Array();
    let selectedMeals = new Array();
    let selectedMealPeriods = new Array();
    days.forEach((check) => {
        if (check.checked)
            if (check.value != "selectall")
                selectedDays.push(check.value);
    })
    meals.forEach((check) => {
        if (check.checked)
            selectedMeals.push(check.value);
    })
    meal_period.forEach((check) => {
        if (check.checked)
            selectedMealPeriods.push(check.value);
    })

    let medicineInformation = {
        medicineName: selectedMedicineName,
        startDate: startDate.value,
        periodValue: periodValue.value,
        period: period.value,
        days: selectedDays,
        dailyDose: dailyDose.value,
        meal: selectedMeals,
        mealPeriod: selectedMealPeriods,
    };
    // 약 캘린더 추가에 대한 json화
    let json = JSON.stringify(medicineInformation);
    console.log(json);

    addCalendarInfo(medicineInformation);
    renderCalendar();
    /*
    modal.style.display = "none";
    initialization(); */
})

function initialization() {
    startDate.value = today_Date;
    periodValue.value = 1;
    period.value = "day";
    days.forEach((check) => {
        check.checked = false;
    })
    dailyDose.value = 1;
    meals.forEach((check) => {
        check.checked = false;
    })
    meal_period.forEach((check) => {
        check.checked = false;
    })
}

function addCalendarInfo(medicineInformation) {
    /* let medicineInformation = {
        medicineName: selectedMedicineName,
        startDate: startDate.value,
        periodValue: periodValue.value,
        period: period.value,
        days: selectedDays,
        dailyDose: dailyDose.value,
        meal: selectedMeals,
        mealPeriod: selectedMealPeriods,
    }; */
    let medicineName = medicineInformation["medicineName"];
    let startDates = medicineInformation["startDate"];
    let startYear = startDates.substr(0, 4);
    let startMonth = startDates.substr(5, 2);
    let startDate = startDates.substr(8, 2);
    let periodValue = medicineInformation["periodValue"];
    let period = medicineInformation["period"];
    let days = medicineInformation["days"];
    let meal = medicineInformation["meal"];
    let mealPeriod = medicineInformation["mealPeriod"];

    if (period == "day") {          // 복용 주기가 일인 경우
        periodValue = periodValue;
    }
    else if (period == "week") {    // 복용 주기가 주인 경우
        periodValue = periodValue * 7;
    }
    else {                          // 복용 주기가 월인 경우
        periodValue = periodValue * 28;
    }

    let checkcount = 1;
    for (let check = 1; check <= 3; check++) {
        for (let i = 0; i < periodValue; i++) {
            let selectDate = new Date(startYear, startMonth - 1, parseInt(startDate) + i);
            if (days.includes(String(selectDate.getDay()))) {
                let dateContext = selectDate.getMonth() + 1 + "월" + selectDate.getDate() + "일";
                if (medicineInfo.hasOwnProperty(dateContext + "," + check)) {
                    checkcount++; break;
                }
            }
        }
        if (check == checkcount)
            break;
    }
    if (checkcount != 4) {
        for (let i = 0; i < periodValue; i++) {
            let selectDate = new Date(startYear, startMonth - 1, parseInt(startDate) + i);
            if (days.includes(String(selectDate.getDay()))) {
                let dateContext = selectDate.getMonth() + 1 + "월" + selectDate.getDate() + "일";
                medicineInfo[dateContext + "," + checkcount] = { medicineName: medicineName, meal: meal, mealPeriod: mealPeriod };
            }
        }
    }
    
    console.log(medicineInfo);
}