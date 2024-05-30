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
    let medicineNum = medicineListData.find(function (item) {
        return item.medicineName === selectedMedicineName
    }).medicineNum;

    var medicineInformation = {
        medicineName: selectedMedicineName,
        medicineNum: medicineNum,
        startDate: startDate.value,
        endDate: endDate.value,
        periodValue: periodValue.value,
        period: period.value,
        dailyDose: dailyDose.value,
        meal: selectedMeals,
        mealPeriod: selectedMealPeriods,
        color: '#87CEEB',
    };
    // 약 캘린더 추가에 대한 json화
    let json = JSON.stringify(medicineInformation);
    console.log(json);

    // 서버에 내 약 리스트 저장하기
    fetch('/addCalendarEvent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: json
    })
        .then(response => response.json())
        .then(data => {
            console.log('Calendar Event added successfully:', data);
            location.reload(true);
        })
        .catch(error => {
            console.error('Error adding medicine:', error);
            // 에러 처리
        });

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
var medicineListData = new Array();  // 먹는 약 리스트 데이터
var eventListData = new Array();     // event 리스트 데이터
let selectedMedicineName = "";

function renderMedicineList() {
    // 먹는 약
    for (let i = 0; i < medicineListData.length; i++) {
        const medicineElement = document.createElement("div");  // div 요소 생성
        medicineElement.classList.add("medicineList");          // medicineList 클래스 추가

        const medicineName = document.createElement("span");    // 약 이름을 표기하는 span 요소 생성
        medicineName.classList.add("medicineName");             // medicine 클래스 추가
        medicineName.textContent = medicineListData[i].medicineName;  // 약 이름 표시
        medicineElement.appendChild(medicineName);              // div 요소에 약 이름 추가

        const buttons = document.createElement("div");          // 버튼 관리하는 div 생성
        buttons.classList.add("medicineList-buttons");          // medicineList-buttons 클래스 추가

        const medicineCalendar = document.createElement("button");  // 캘린더에 추가하는 button 요소 생성
        const addButton = document.createElement('span');           // add 버튼 생성
        addButton.classList.add("material-symbols-outlined");
        addButton.textContent = 'event_note';
        medicineCalendar.appendChild(addButton);
        medicineCalendar.classList.add("addCalendar");              // addCalendar 클래스 추가
        medicineCalendar.onclick = function () {
            modal.style.display = "flex";
            initialization();
            selectedMedicineName = medicineName.textContent;
        }
        buttons.appendChild(medicineCalendar);                      // div 요소에 캘린더 버튼 추가

        const medicineDelete = document.createElement("button");    // 약 리스트 삭제 button 요소 생성
        const deleteButton = document.createElement('span');        // delete 버튼 생성
        deleteButton.classList.add("material-symbols-outlined");
        deleteButton.textContent = 'delete';
        medicineDelete.appendChild(deleteButton);
        medicineDelete.classList.add("delete");                     // delete 클래스 추가
        medicineDelete.onclick = function () {
            deleteEvent(medicineName.textContent);
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
        dateClick: function (info) {
            getCalendarList(info);
        },
    });
    calendar.render();

    // 초기 내 약 리스트 및 달력 이벤트 받아오기
    getMedicineList();
    getCalendarEvent();

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

// 날짜 선택 시 발동함수
function getCalendarList(info) {
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
            if (event.extendedProps.meal != null && event.extendedProps.mealPeriod == null) {
                medicineMeal.innerHTML = event.extendedProps.meal;
            } else if (event.extendedProps.meal == null && event.extendedProps.mealPeriod != null) {
                medicineMeal.innerHTML = event.extendedProps.mealPeriod;
            } else if (event.extendedProps.meal != null && event.extendedProps.mealPeriod != null) {
                medicineMeal.innerHTML = event.extendedProps.meal + "-" + event.extendedProps.mealPeriod;
            } else {
                medicineMeal.innerHTML = "";
            }

            // 색
            let medicineColor = document.createElement('td');
            let colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = event.extendedProps.color;           // 초기값 : skyblue
            colorInput.onchange = function () {
                event.setProp('color', this.value);
            };
            let colorSaveBtn = document.createElement('button');
            colorSaveBtn.innerHTML = '<span class="material-symbols-outlined">save</span>'
            colorSaveBtn.onclick = function () {
                alert('바뀐 색이 저장되었습니다.');
                // 서버에 내 달력 이벤트 삭제하기
                fetch('/changeColor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ medicineName: event.extendedProps.medicineName, color: colorInput.value })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Event color changed successfully:', data);
                    })
                    .catch(error => {
                        console.error('Error adding medicine:', error);
                        // 에러 처리
                    });
            }

            medicineItem.appendChild(medicineName);
            medicineItem.appendChild(medicinePeriod);
            medicineItem.appendChild(medicineMeal);
            medicineColor.appendChild(colorInput);
            medicineColor.appendChild(colorSaveBtn);
            medicineItem.appendChild(medicineColor);
            medicineList.appendChild(medicineItem);
        }
    });
}

// 내 약 리스트 불러오기
function getMedicineList() {
    fetch('/listMedicine', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            medicineListData = [];

            console.log('Medicine list successfully:', data);

            data.forEach((list) => {
                medicineListData.push({ medicineName: list.medicine_name, medicineNum: list.medicine_num });
            });

            renderMedicineList();
        })
        .catch(error => {
            console.error('Error adding medicine:', error);
            // 에러 처리
        });
}

// 내 달력 이벤트 리스트 불러오기
function getCalendarEvent() {
    fetch('/listEvent', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            eventListData = [];

            console.log('Calendar Event list successfully:', data);

            data.forEach((list) => {
                var startDate = list.startDate.substr(0, 10);
                var endDate = list.endDate.substr(0, 10);
                eventListData.push({
                    medicineName: list.medicine_name, medicineNum: list.medicine_num,
                    startDate: startDate, endDate: endDate, periodValue: list.periodValue,
                    period: list.period, dailyDose: list.dailyDose, meal: list.meal,
                    mealPeriod: list.mealPeriod, color: list.color
                });
            });

            console.log(eventListData);
            calendar.getEventSources().forEach((event) => {
                event.remove();
            });

            eventListData.forEach((data) => {
                let newEvent = [{
                    title: data.medicineName,
                    start: data.startDate,
                    end: data.endDate,
                    extendedProps: {
                        medicineName: data.medicineName,
                        periodValue: data.periodValue,
                        period: data.period,
                        dailyDose: data.dailyDose,
                        meal: data.meal,
                        mealPeriod: data.mealPeriod,
                        color: data.color
                    },
                    color: data.color,
                }];
                calendar.addEventSource(newEvent);

            });

            let today_Date = new Date();
            const todayStr = today_Date.toISOString().split('T')[0];
            const todayInfo = { date: today_Date, dateStr: todayStr };
            getCalendarList(todayInfo);

            calendar.render();
        })
        .catch(error => {
            console.error('Error adding medicine:', error);
            // 에러 처리
        });
}

// event 제거하기
function deleteEvent(medicineName) {
    var events = calendar.getEvents();
    events.forEach(function (event) {
        if (event.title == medicineName) {
            event.remove();
        }
    });

    // 서버에 내 달력 이벤트 삭제하기
    fetch('/deleteMedicineList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ medicineName: medicineName })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Medicine List deleted successfully:', data);
            getMedicineList();
            getCalendarEvent();
        })
        .catch(error => {
            console.error('Error adding medicine:', error);
            // 에러 처리
        });

    location.reload(true);
}