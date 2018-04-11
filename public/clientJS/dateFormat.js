//Reformat date elements to readable string form

const dates = document.getElementsByClassName('place-date');
for(let i=0; i<dates.length; i++) {
    let strDate = new Date(dates[i].textContent).toDateString();
    dates[i].textContent = strDate;
}