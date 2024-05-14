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
    const url = `https://date.nager.at/api/v3/publicholidays/${currYear}/BG`;
    const allParametersInfo = {
        startDate,
        endDate,
        hours,
    };
    
    
    fetch(url)
    .then(res => res.json())
    .then(data => {
        CalculateStuff(data,allParametersInfo)
    })
    .catch(res => {
        const result = document.querySelector('.result');
        result.style.display = 'block';
        result.textContent = 'Възникна грешка. Опитайте отново!'
    });
    
    
}

function CalculateStuff(allHolidays, allParametersInfo) {
    const startDate = new Date(allParametersInfo.startDate);
    const endDate = new Date(allParametersInfo.endDate);
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
    const formulas = CalculateFormula(workingDaysCount, allParametersInfo.hours);
    printData(workingDays,workingDaysCount,formulas)
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
                            const getString = `${i}.${k}+${l}.${m} = ${hours}`;
                            formulasArr.push(getString);
                        }
                    }
                    
                }
            }
        }
    }
    return formulasArr;
}

function printData(workingDays,workingDaysCount,formulas) {
    const messageResult = document.querySelector('.result');
    messageResult.innerHTML = '';
    messageResult.style.display = 'block';
    messageResult.innerHTML = `<p id="result-message">В дадения период има ${workingDaysCount} работни дни:<br> <br>Начините за разпределяне на тези дни са:</p>`;

    const formulaResult = document.querySelector('.formulas');
    formulaResult.innerHTML = '';
    const formulaList = document.createElement('ul');
    formulaList.classList.add('formulas-list')
    for (const formula of formulas) {
        const liElement = document.createElement('li');
        liElement.textContent = formula;
        formulaList.append(liElement);
    }
    formulaResult.append(formulaList);
    formulaResult.style.display = 'block';

    const workingDaysMessageResult = document.querySelector('.working-days-title');
    workingDaysMessageResult.style.display = 'block';

    const workingDaysListDiv = document.querySelector('.working-days-list');
    workingDaysListDiv.innerHTML = '';
    workingDaysListDiv.style.display = 'block';

    const workingDaysListUl = document.createElement('ul');

    for (const day of workingDays) {
        const liElement = document.createElement('li');
        liElement.textContent = day;
        workingDaysListUl.append(liElement);
    }
    workingDaysListDiv.append(workingDaysListUl);
}
