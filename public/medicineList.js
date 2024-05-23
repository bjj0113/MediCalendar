const medicineList = document.getElementById("myMedicineList_List");
export const modal = document.getElementById("addMedicine_Modal");

const dummyData = ["경동아스피린장용정", "루체에이치아이점안액"];   // 먹는 약 리스트 더미데이터 예시
export let selectedMedicineName = "";

function renderMedicineList(){
    // 먹는 약
    for(let i = 0; i < dummyData.length; i++){
        const medicineElement = document.createElement("div");  // div 요소 생성
        medicineElement.classList.add("medicineList");          // medicineList 클래스 추가

        const medicineName = document.createElement("span");    // 약 이름을 표기하는 span 요소 생성
        medicineName.classList.add("medicineName");             // medicine 클래스 추가
        medicineName.textContent = (i+1) + "." + dummyData[i];  // 약 이름 표시
        medicineElement.appendChild(medicineName);              // div 요소에 약 이름 추가
        
        const buttons = document.createElement("div");          // 버튼 관리하는 div 생성
        buttons.classList.add("medicineList-buttons");          // medicineList-buttons 클래스 추가

        const medicineCalendar = document.createElement("button");  // 캘린더에 추가하는 button 요소 생성
        medicineCalendar.textContent = "+";                         // 추가 버튼 표시
        medicineCalendar.classList.add("addCalendar");              // addCalendar 클래스 추가
        medicineCalendar.onclick = function(){
            modal.style.display = "flex";
            selectedMedicineName = medicineName.textContent;
        }
        buttons.appendChild(medicineCalendar);                      // div 요소에 캘린더 버튼 추가

        const medicineDelete = document.createElement("button");    // 약 리스트 삭제 button 요소 생성
        medicineDelete.textContent = "-";                           // 삭제 버튼 표시
        medicineDelete.classList.add("delete");                     // delete 클래스 추가
        medicineDelete.onclick = function(){                              
            let p = this.parentElement;                             // buttons div 요소
            while(p.hasChildNodes()){                               // buttons div 내부 요소 제거 
                p.removeChild(p.firstChild);
            }                                                       
            let gp = p.parentElement;                               // medicineElement div 요소
            while(gp.hasChildNodes()){                              // buttons div 요소 제거
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