const BASE_URL = 'http://localhost:3000/todos';
const city = 'Austin';
const WEATHER_URL = `https://goweather.herokuapp.com/weather/${city}`;
const weatherButton = document.querySelector('#get-weather')

const comment_forms = [...document.querySelectorAll('.comment-form')]
const allLists = [...document.querySelectorAll('ul')]
// console.log(allLists)
const clearButton = document.getElementById('clear-btn');
clearButton.addEventListener('click', () => clearAll(allLists));


comment_forms.map(comment_form => {
    comment_form.addEventListener('submit', handleSubmit)
})

weatherButton.addEventListener('click',() => getWeather())

function getWeather() {
    fetch(WEATHER_URL)
    .then(r => r.json())
    .then(weatherData => {
        displayWeather(weatherData)
    })
}

function displayWeather(weatherData) {  
    const weatherContainer = document.getElementById('weather-container');
    const celsiusToFahrenheit = (celsius) => parseInt(celsius) * 9/5 + 32;
    const temperature = celsiusToFahrenheit(weatherData.temperature);
    weatherContainer.innerHTML = `<h2>Today it is</h2><p id='temp'>${temperature + '°F   ' + 'and' + '      ' + weatherData.description}</p>`;
}

function handleSubmit(event) {
    event.preventDefault()
    const day = event.target.dataset.day;
    const comment = event.target.querySelector('input').value

    const commentObj = {
        day: day,
        comment: comment,
        complete: false
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
        // todos = comments;
        comments.map(comment => {
            renderComment(comment)
        })
    })
}



function renderComment(commentObj) {
    const list = document.querySelector(`#${commentObj.day}-list`)
    const li = document.createElement('li')

    li.innerHTML = `<span>${commentObj.comment}</span>`;

    if (commentObj.complete === true) {

        li.classList.add('strikethrough')
    }
    

     const doneButton = document.createElement('button');
     doneButton.className = "done-bttn";
     doneButton.textContent = "Done";
     doneButton.addEventListener("click", () => markDone(li, commentObj.id));

    const deleteButton= document.createElement('button')
    deleteButton.className = 'delete-bttn'
    deleteButton.textContent = 'X'
    deleteButton.addEventListener('click', () => deleteItem(li, commentObj.id))

     li.append(doneButton, deleteButton);

    list.append(li)
}

    function deleteItem(li, itemId) {
        li.remove()
      
        fetch (BASE_URL + `/${itemId}`, {
          method: "DELETE"
      
        })
      }



function markDone(li, itemId){
    li.classList.add('strikethrough')
    fetch(BASE_URL + `/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({complete: true})
    })
  }




function clearAll(allLists){
    allLists.map(list => list.remove());
    todos.forEach(todo => {
        fetch(BASE_URL + `/${todo.id}`, {
            method: 'DELETE'
        })
    })
}

getAllComments();
