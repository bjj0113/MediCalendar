// 달력의 약 정보
const btnCloseModal = document.getElementById("modal_close");
const btnCalendarCloseModal = document.getElementById("modal_CalendarClose");
const btnCalendarAddModal = document.getElementById("modal_CalendarAdd");
const startDate = document.getElementsByName("startDate")[0];
const periodValue = document.getElementsByName("periodValue")[0];
const period = document.getElementsByName("period")[0];
const endDate = document.getElementsByName("endDate")[0];
const dailyDose = document.getElementsByName("dailyDose")[0];
const meals = document.getElementsByName("meal");
const meal_period = document.getElementsByName("meal-period");


btnCloseModal.addEventListener("click", () => {
    modal.style.display = "none";
    initialization();
})
btnCalendarCloseModal.addEventListener("click", () => {
    modal.style.display = "none";
    initialization();
})
btnCalendarAddModal.addEventListener("click", () => {
    let selectedMeals = new Array();
    let selectedMealPeriods = new Array();
    meals.forEach((check) => {
        if (check.checked)
            selectedMeals.push(check.value);
    })
    meal_period.forEach((check) => {
        if (check.checked)
            selectedMealPeriods.push(check.value);
    })
    let end = new Date(endDate.value);
    end = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 2);
    endDate.value = end.toISOString().slice(0, 10);

    let medicineInformation = {
        medicineName: selectedMedicineName,
        startDate: startDate.value,
        endDate: endDate.value,
        periodValue: periodValue.value,
        period: period.value,
        dailyDose: dailyDose.value,
        meal: selectedMeals,
        mealPeriod: selectedMealPeriods,
    };
    // 약 캘린더 추가에 대한 json화
    let json = JSON.stringify(medicineInformation);
    console.log(json);

    addCalendarInfo(medicineInformation);

    modal.style.display = "none";
    initialization();
})

function initialization() {
    let today_Date = new Date();

    startDate.value = today_Date.toISOString().slice(0, 10);
    endDate.value = today_Date.toISOString().slice(0, 10);
    periodValue.value = 1;
    period.value = "일";
    dailyDose.value = 1;
    meals.forEach((check) => {
        check.checked = false;
    })
    meal_period.forEach((check) => {
        check.checked = false;
    })
}

// medicineList.js
const medicineList = document.getElementById("myMedicineList_List");
const modal = document.getElementById("addMedicine_Modal");
const dummyData = ["경동아스피린장용정", "루체에이치아이점안액"];   // 먹는 약 리스트 더미데이터
let selectedMedicineName = "";

function renderMedicineList() {
    // 먹는 약
    for (let i = 0; i < dummyData.length; i++) {
        const medicineElement = document.createElement("div");  // div 요소 생성
        medicineElement.classList.add("medicineList");          // medicineList 클래스 추가

        const medicineName = document.createElement("span");    // 약 이름을 표기하는 span 요소 생성
        medicineName.classList.add("medicineName");             // medicine 클래스 추가
        medicineName.textContent = (i + 1) + "." + dummyData[i];  // 약 이름 표시
        medicineElement.appendChild(medicineName);              // div 요소에 약 이름 추가

        const buttons = document.createElement("div");          // 버튼 관리하는 div 생성
        buttons.classList.add("medicineList-buttons");          // medicineList-buttons 클래스 추가

        const medicineCalendar = document.createElement("button");  // 캘린더에 추가하는 button 요소 생성
        medicineCalendar.textContent = "+";                         // 추가 버튼 표시
        medicineCalendar.classList.add("addCalendar");              // addCalendar 클래스 추가
        medicineCalendar.onclick = function () {
            modal.style.display = "flex";
            initialization();
            selectedMedicineName = medicineName.textContent.substring(2);
        }
        buttons.appendChild(medicineCalendar);                      // div 요소에 캘린더 버튼 추가

        const medicineDelete = document.createElement("button");    // 약 리스트 삭제 button 요소 생성
        medicineDelete.textContent = "-";                           // 삭제 버튼 표시
        medicineDelete.classList.add("delete");                     // delete 클래스 추가
        medicineDelete.onclick = function () {
            deleteEvent(medicineName.textContent.substring(2));
            let p = this.parentElement;                             // buttons div 요소
            while (p.hasChildNodes()) {                               // buttons div 내부 요소 제거 
                p.removeChild(p.firstChild);
            }
            let gp = p.parentElement;                               // medicineElement div 요소
            while (gp.hasChildNodes()) {                              // buttons div 요소 제거
                gp.removeChild(gp.firstChild);
            }
            p = gp.parentElement;                                   // medicineElement parent 요소
            p.removeChild(gp);                                      // medicineElement div 요소 제거
        };
        buttons.appendChild(medicineDelete);                        // div 요소에 삭제 버튼 추가

        medicineElement.appendChild(buttons);           // 버튼 집합 div 요소에 추가
        medicineList.appendChild(medicineElement);      // 내 약 리스트에 div 추가 
    }
}

renderMedicineList();

// calendar.js
let dayList = ["목", "금", "토", "일", "월", "화", "수"];
let todayList = ["일", "월", "화", "수", "목", "금", "토"];

let calendar;
document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        fixedWeekCount: false,
        headerToolbar: {                      // 위쪽 툴바
            start: 'title',
            end: 'prev next',
        },
        dayHeaderFormat: { weekday: 'short' },// 요일 header format
        selectable: true,                     // 요일 선택 가능하도록
        dragScroll: false,
        dateClick: function (info) {               // 날짜 선택 시 발동함수
            let clickedDate = info.dateStr;
            let clickedDateDay = new Date(clickedDate.substr(0, 4), clickedDate.substr(5, 2), clickedDate.substr(8, 2)).getDay();
            clickedDateDay = dayList[clickedDateDay];
            console.log('선택된 날짜 : ' + clickedDate.substr(0, 4) + '-' + clickedDate.substr(5, 2) + '-' + clickedDate.substr(8, 2));

            let todayDate = document.getElementById('todayDate');
            let medicineList = document.getElementById('medicineList');

            todayDate.textContent = clickedDate.substr(8, 2) + "." + clickedDateDay;
            medicineList.innerHTML = "";
            calendar.getEvents().forEach(function (event) {
                if (event.startStr <= clickedDate && event.endStr > clickedDate) {
                    let medicineItem = document.createElement('tr');
                    // 약 이름
                    let medicineName = document.createElement('td');
                    medicineName.innerHTML = event.extendedProps.medicineName;
                    // 복용 횟수
                    let medicinePeriod = document.createElement('td');
                    medicinePeriod.innerHTML = event.extendedProps.periodValue + event.extendedProps.period + "간 " +
                        "일일" + event.extendedProps.dailyDose + "회 ";
                    // 먹는 기간
                    let medicineMeal = document.createElement('td');
                    console.log("a:" + event.extendedProps.meal + "b:" + event.extendedProps.mealPeriod);
                    if (event.extendedProps.meal[0] != null && event.extendedProps.mealPeriod[0] == null) {
                        medicineMeal.innerHTML = event.extendedProps.meal;
                    } else if (event.extendedProps.meal[0] == null && event.extendedProps.mealPeriod[0] != null) {
                        medicineMeal.innerHTML = event.extendedProps.mealPeriod;
                    } else if (event.extendedProps.meal[0] != null && event.extendedProps.mealPeriod[0] != null) {
                        medicineMeal.innerHTML = event.extendedProps.meal + "-" + event.extendedProps.mealPeriod;
                    } else {
                        medicineMeal.innerHTML = "";
                    }

                    // 색
                    let medicineColor = document.createElement('td');
                    let colorInput = document.createElement('input');
                    colorInput.type = 'color';
                    colorInput.value = '#87CEEB';           // 초기값 : skyblue
                    colorInput.onchange = function () {
                        event.setProp('color', this.value);
                    };

                    medicineItem.appendChild(medicineName);
                    medicineItem.appendChild(medicinePeriod);
                    medicineItem.appendChild(medicineMeal);
                    medicineColor.appendChild(colorInput);
                    medicineItem.appendChild(medicineColor);
                    medicineList.appendChild(medicineItem);
                }
            });
        },
    });
    calendar.render();

    function init() {
        let today_Date = new Date();
        const todayStr = today_Date.toISOString().split('T')[0];
        const todayInfo = { date: today_Date, dateStr: todayStr };
        calendar.trigger('dateClick', todayInfo);
    }

    init();

    function calculateEndDate() {
        let start = new Date(startDate.value);
        let duration = parseInt(periodValue.value);
        let durationUnit = period.value;
        let end;
        switch (durationUnit) {
            case "일": end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + duration); break;
            case "주": end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + duration * 7); break;
            case "개월": end = new Date(start.getFullYear(), start.getMonth() + duration, start.getDate()); break;
        }
        endDate.value = end.toISOString().slice(0, 10);
    }

    function calculatePeriod() {
        let start = new Date(startDate.value);
        let end = new Date(endDate.value);
        let duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        periodValue.value = duration + 1;
        period.value = "일";
    }

    startDate.addEventListener('change', calculateEndDate);
    periodValue.addEventListener('change', calculateEndDate);
    period.addEventListener('change', calculateEndDate);
    endDate.addEventListener('change', calculatePeriod);
});

function addCalendarInfo(medicineInformation) {
    /* let medicineInformation = {
        medicineName: selectedMedicineName,
        startDate: startDate.value,
        endDate: endDate.value,
        periodValue: periodValue.value,
        period: period.value,
        dailyDose: dailyDose.value,
        meal: selectedMeals,
        mealPeriod: selectedMealPeriods,
    }; */
    let medicineName = medicineInformation["medicineName"];
    let startDate = medicineInformation["startDate"];
    let endDate = medicineInformation["endDate"];
    let periodValue = medicineInformation["periodValue"];
    let period = medicineInformation["period"]
    let dailyDose = medicineInformation["dailyDose"];
    let meal = medicineInformation["meal"];
    let mealPeriod = medicineInformation["mealPeriod"];

    let newEvent = [{
        title: medicineName,
        start: startDate,
        end: endDate,
        extendedProps: {
            medicineName: medicineName,
            periodValue: periodValue,
            period: period,
            dailyDose: dailyDose,
            meal: meal,
            mealPeriod: mealPeriod,
        },
        color: "skyblue",
    }];
    calendar.addEventSource(newEvent);
    calendar.render();

    console.log(newEvent);
}

// event 제거하기
function deleteEvent(medicineName) {
    var events = calendar.getEvents();
    events.forEach(function (event) {
        if (event.title == medicineName) {
            event.remove();
        }
    });
}