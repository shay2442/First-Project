const BASE_URL = 'http://localhost:3000/todos';
const city = 'Austin';
const WEATHER_URL = `https://goweather.herokuapp.com/weather/${city}`;
const weatherButton = document.querySelector('#get-weather')
const comment_forms = [...document.querySelectorAll('.comment-form')]


let myDate = new Date();
let hrs = myDate.getHours();

let greet;

if (hrs < 12)
    greet = 'Good Morning';
else if (hrs >= 12 && hrs <= 17)
    greet = 'Good Afternoon';
else if (hrs >= 17 && hrs <= 24)
    greet = 'Good Evening';

document.getElementById('lblGreetings').innerHTML =
    '<b>' + greet + '</b> the weather today is...insert data from weather API';


comment_forms.map(comment_form => {
    comment_form.addEventListener('submit', handleSubmit)
})

weatherButton.addEventListener('click',() => getWeather())

function getWeather() {
    fetch(WEATHER_URL)
    .then(r => r.json())
    .then(weatherData => {
        console.log(weatherData)
        displayWeather(weatherData)
    })
}

function displayWeather(weatherData) { 
    const today = new Date().toLocaleDateString(locale, { weekday: 'long' });
    console.log(today);  
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = `<h2>Today</h2><p>${weatherData.temperature}</p>`;
}

function handleSubmit(event) {
    event.preventDefault()
    const day = event.target.dataset.day;
    const comment = event.target.querySelector('input').value

    const commentObj = {
        day: day,
        comment: comment
    }

    addToDo(commentObj)
    event.target.reset()
}

function addToDo (commentObj) {
    fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body:JSON.stringify(commentObj)
    })
    .then(r => r.json())
    .then(newTodo => renderComment(newTodo))
    .catch(error => console.log(error))

}

function getAllComments () {
    fetch('http://localhost:3000/todos')
    .then(r => r.json())
    .then(comments => {
        comments.map(comment => {
            renderComment(comment)
        })
    })
}



function renderComment(commentObj) {
    const list = document.querySelector(`#${commentObj.day}-list`)
    const li = document.createElement('li')

    li.innerHTML = `<span>${commentObj.comment}</span>`;

     // deleteBttn.addEventListener("click", () => deleteComment(commentObj.comment));
     const deleteBttn = document.createElement('button');
     deleteBttn.className = "delete-bttn";
     deleteBttn.textContent = "Delete";
     deleteBttn.addEventListener("click", () => deleteItem(li, commentObj.id));

     li.append(deleteBttn);

    list.append(li)
}


function deleteItem(li, itemId){
    li.classList.add('strikethrough')
    fetch(BASE_URL + `/${itemId}`, {
      method: 'DELETE'
    })
  }

getAllComments();