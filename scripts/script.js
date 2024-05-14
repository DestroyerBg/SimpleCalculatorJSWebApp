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
    }
}