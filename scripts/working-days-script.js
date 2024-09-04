function CheckData() {
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const hours = document.getElementById('hours');
    let isMissing = false;
    
    if (startDate.value == '') {
        startDate.classList.add('missing-value');
        isMissing = true;
    }else{
        startDate.classList.remove('missing-value');
    }
    
    if (endDate.value == '') {
        endDate.classList.add('missing-value');
        isMissing = true;
    }else{
        endDate.classList.remove('missing-value');
    }
    
    if (hours.value == '') {
        hours.classList.add('missing-value');
        isMissing = true;
    }else{
        hours.classList.remove('missing-value');
    }
    
    if (isMissing == true) {
        alert('Трябва да попълните и 3-те стойности!');
        isMissing = false;
        return;
    }
    
    SendData(startDate.value, endDate.value, hours.value)
    
}

function SendData(startDate, endDate, hours) {
    const currYear = new Date().getFullYear();
    const url = `https://date.nager.at/api/v3/publicholidays/${currYear}/BG`; // this should be fixed
    const allParametersInfo = {
        startDate,
        endDate,
        hours,
    };
    
    
    fetch(url)
    .then(res => res.json())
    .then(data => {
        CalculateStuff(data,allParametersInfo)
    });
    // .catch(res => {
    //     const result = document.querySelector('.result');
    //     result.style.display = 'block';
    //     result.textContent = 'Възникна грешка. Опитайте отново!'
    // });
    
    
}

function CalculateStuff(allHolidays, allParametersInfo) {
    const startDate = CreateDateObject(allParametersInfo.startDate);
    const endDate = CreateDateObject(allParametersInfo.endDate);
    const allDaysInCurrentMonth = GetAllDaysInCalculatedMonth(new Date(startDate));
    const workingDays = [];
    for (let currDate = startDate; currDate <= endDate; currDate.setDate(currDate.getDate() + 1)) {
        if (currDate.getDay() != 6 && currDate.getDay() != 0) {
            const year = currDate.getFullYear();
            let date = currDate.getDate();
            let month = currDate.getMonth() + 1;
            
            date = Number(date) < 10 ? '0'+ date : date;
            month = Number(month) < 10 ? '0'+ month : month;
            
            let isHoliday = CheckDayIsHoliday(year,date,month,allHolidays);
            if (isHoliday == true) {
                const formattedString = `${date}.${month}.${year}`;
                workingDays.push(formattedString);
            }
        }
    }
    
    const workingDaysCount = workingDays.length;
    const formula = CalculateFormula(workingDaysCount, allParametersInfo.hours);
    PrintData(workingDays,workingDaysCount,formula, allDaysInCurrentMonth)
}

function CreateDateObject(dateString){
    const dateStringArr = dateString.split('-');
    
    const year = Number.parseInt(dateStringArr[0]);
    const month = Number.parseInt(dateStringArr[1] - 1);
    const day = Number.parseInt(dateStringArr[2]);
    
    const date = new Date(year, month , day);
    return date;
}

function GetAllDaysInCalculatedMonth(startDate){
    const month = startDate.getMonth();
    const allDaysArr = [];
    while(startDate.getMonth() == month){
        const year = startDate.getFullYear();
        let date = startDate.getDate();
        let month = startDate.getMonth() + 1;
        
        date = Number(date) < 10 ? '0'+ date : date;
        month = Number(month) < 10 ? '0'+ month : month;
        
        const dateString = `${date}.${month}.${year}`;
        allDaysArr.push(dateString);
        startDate.setDate(startDate.getDate() + 1);
    }
    
    return allDaysArr;
}


function CheckDayIsHoliday(year, date, month, allHolidays) {
    const stringToSearch = `${year}-${month}-${date}`;
    const searchForDay = allHolidays.find(day => day.date == stringToSearch);
    if (searchForDay == undefined) {
        return true;
    }
    return false;
    
}

function CalculateFormula(workingDaysCount, hours) {
    const formulasArr = [];
    for (let i = 5; i <= workingDaysCount; i++)
        {
        for (let k = 5; k <= 7; k++)
            {
            for (let l = 5; l <= workingDaysCount; l++)
                {
                for (let m = 5; m <= 6; m++)
                    {
                    if (i + l == workingDaysCount)
                        {
                        if ((i * k) + (l * m) == hours)
                            {
                            const getString = `${i}.${k}+${l}.${m}`;
                            formulasArr.push(getString);
                        }
                    }
                    
                }
            }
        }
    }
    return formulasArr[0];
}

function PrintData(workingDays,workingDaysCount,formula, allDaysArr) {
    // print working days count message
    const messageResult = document.querySelector('.result');
    messageResult.innerHTML = '';
    messageResult.style.display = 'block';
    messageResult.innerHTML = `<p id="result-message">В дадения период има ${workingDaysCount} работни дни`;
    
    const workingDaysAndHoursDict = [];
    const formulaParts = formula.split('+');
    for (const part of formulaParts) {
        const numbersArr = part.split('.');
        const workingDaysWithExactHours = Number(numbersArr[0]);
        const workingExactHours = Number(numbersArr[1]);
        const newInfoObject = {
            workingDaysWithExactHours: workingDaysWithExactHours,
            workingExactHours: workingExactHours,
        };
        workingDaysAndHoursDict.push(newInfoObject);
    }
    const mainTable = document.querySelector('.days-table');
    mainTable.style.display = 'table';
    const table = document.querySelector('.days-table tbody');
    CreateTable(allDaysArr, workingDays, workingDaysAndHoursDict, table);
}

function CreateTable(allDaysArr, workingDays, workingDaysAndHoursDict, table){
    //ResetTable();
    const firstRowFromTable = table.querySelector('tr');

    let kvpIndex = 0;
    let stateCounter = 0;
    let isFinished = false;
    for (let i = 0; i < allDaysArr.length; i++) {
        let day = allDaysArr[i];
        let currKey = Number(workingDaysAndHoursDict[kvpIndex].workingDaysWithExactHours);
         let newRow = firstRowFromTable.cloneNode(true);
         newRow.children[0].textContent = day;
         if (!workingDays.includes(day)) {
             newRow.children[1].textContent = 'почивен/неработен ден';
             table.append(newRow);
             continue;
         }
        
        newRow.children[1].textContent = `${workingDaysAndHoursDict[kvpIndex].workingExactHours} работни часа`;
        stateCounter++;
        if (stateCounter == currKey) {
            kvpIndex++;
            stateCounter = 0;
        }

        table.append(newRow);

        if (kvpIndex == workingDaysAndHoursDict.length) {
            isFinished = true;
        }

        if (isFinished == true && i < allDaysArr.length) {
            for (let k = i + 1; k < allDaysArr.length; k++) {
                day = allDaysArr[k];
                newRow = firstRowFromTable.cloneNode(true);

                newRow.children[0].textContent = day;
                newRow.children[1].textContent = 'почивен/неработен ден';

                table.append(newRow);
                continue;
            }
            break;
        }
        
    }
}

function ResetTable(){
    const table = document.querySelector('.days-table');
    table.innerHTML = ' <table class="days-table"> <tbody> <tr> <td>Ден от месеца</td> <td>Работни часове</td> </tr> </tbody>';

}

