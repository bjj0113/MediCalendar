import { calendarEvent } from "./modal.js";

var calendar;

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {                      // 위쪽 툴바
            start : 'title',
            end : 'prev next',
        },
        dayHeaderFormat: { weekday: 'short' },// 요일 header format
        selectable: true,                     // 요일 선택 가능하도록
        dragScroll: false,
        dateClick: function() {               // 날짜 선택 시 발동함수
            
        },
        events: [{
            title:'장용정',
            start:'2024-05-18',
            end:'2024-05-24'
        }],
    });
    renderCalendar();
  }
);

export function renderCalendar(){
    calendar.render();
}


/* 이전 코드
const calendarDates = document.getElementById("myCalendar_Dates");
const calendarMonth = document.getElementById("currentMonth");
const todayDate = document.getElementById("todayDate");

const today = new Date();
let currentMonth = today.getMonth();        // 현재 몇 월인지 저장
let currentYear = today.getFullYear();      // 현재 년도를 저장
switch(today.getDay()){
    case 0: todayDate.textContent = today.getDate() + ".일"; break;
    case 1: todayDate.textContent = today.getDate() + ".월"; break;
    case 2: todayDate.textContent = today.getDate() + ".화"; break;
    case 3: todayDate.textContent = today.getDate() + ".수"; break;
    case 4: todayDate.textContent = today.getDate() + ".목"; break;
    case 5: todayDate.textContent = today.getDate() + ".금"; break;
    case 6: todayDate.textContent = today.getDate() + ".토"; break;
    default: todayDate.textContent = "날짜 오류"; break;
}

export function renderCalendar() {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);           // 현재 달의 첫 번째 날짜 객체를 저장
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0);           // 현재 달의 마지막 날짜 객체를 저장
    const leftDaysInMonth = new Date(currentYear, currentMonth, 0).getDate(); // 이전 달의 마지막 날짜를 저장
    const startDayOfWeek = firstDayOfMonth.getDay();                          // 현재 달의 첫 번째 날짜의 요일을 저장
    calendarMonth.textContent = `${currentYear}.${currentMonth + 1}`;     // 월을 나타내는 곳에 연과 월을 설정

    calendarDates.innerHTML = "";
    let dateOfNextMonth = 1;

    // 이전 달의 빈 날짜
    for (let i = 0; i < startDayOfWeek; i++) {
        const emptyDate = document.createElement("div");    // div 요소 생성
        emptyDate.classList.add("empty", "date");           // empty, date 클래스를 추가
        emptyDate.textContent = leftDaysInMonth - startDayOfWeek + i + 1; // 날짜 표시
        calendarDates.appendChild(emptyDate);               // 캘린더에 추가하기
    }

    // 현재 달의 날짜
    for (let i = 1; i <= daysInMonth.getDate(); i++) {
        const dateElement = document.createElement("div");  // div 요소 생성
        dateElement.classList.add("date");                  // date 클래스 추가
        dateElement.textContent = i;                        // 날짜 표시
        dateElement.onclick = function(){                   // 클릭된 날짜에 대한 처리

        };

        if(isScheduleExist(i, currentMonth, 1)){
            let firstBar = document.createElement("div");
            firstBar.classList.add("first","bar");
        }
        if(isScheduleExist(i, currentMonth, 2))
            dateElement.classList.add("second");
        if(isScheduleExist(i, currentMonth, 3))
            dateElement.classList.add("third");

        calendarDates.appendChild(dateElement);             // 캘린더에 추가하기
    }

    // 다음 달의 빈 날짜
    for (let i = daysInMonth.getDay(); i < 6; i++) {
        const emptyDate = document.createElement("div");    // div 요소 생성
        emptyDate.classList.add("empty", "date");           // empty, date 클래스를 추가
        emptyDate.textContent = dateOfNextMonth++;          // 날짜 표시
        calendarDates.appendChild(emptyDate);               // 캘린더에 추가하기
    }
}

function isScheduleExist(date, month, index){
    if(medicineInfo[month+"월"+date+"일,"+index] != null)
        return true;
    else 
        return false;
}

renderCalendar(); */