// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */ //DONE

async function getCategoryIds() {
    let cat = [];
    for(let i = 0; i < 6; i++) {
        let res = await axios.get('http://jservice.io/api/random');
    
        cat[i] = parseInt(res.data[0].category.id) ;
        //console.log(cat[i]);
    }
    return cat;
    
} //getCategoryIds();

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 *///DONE

async function getCategory(catId) {
    let getTitle = await axios.get(`http://jservice.io/api/category?id=${catId}`);
    //console.log(getTitle);
    let title = getTitle.data.title;
    console.log(title);
    let clues = []
    clues = getTitle.data.clues;
    let clueArr = [];
    for (let i = 0; i < clues.length; i++) {
        clueArr.push({'question': clues[i].question, 
                    'answer' : clues[i].answer, 
                    'showing': null});
    }
    return {
        'title': title,
        'clueArr': clueArr,
    }
}


/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */
 const main = document.querySelector('#main');
 let data = [];

async function fillTable() {
    
    var ids = Array.from(await getCategoryIds());   
    
    console.log(ids);

    for (let i = 0; i < 5; i++) {
        
        data.push(await getCategory(ids[i])) ;
        
    }
    console.log(data);
    

    var top = document.createElement("tr");
    top.setAttribute("id", "column-top1");
    top.setAttribute('class', 'cellHead');
    

    for (var x = 0; x < 5; x++) {
        var headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        headCell.classList.add('cellHead');
        headCell.textContent = `${data[x].title}`
        top.append(headCell);
    }
    main.append(top);

    for (var y = 0; y < 5; y++) {
        const row = document.createElement("tr");
        for (var x = 0; x < 5; x++) {
            var cell = document.createElement("td");
            cell.textContent = '?';
            cell.setAttribute("id", `${y}-${x}`);
            cell.setAttribute('class', 'cell')
            cell.addEventListener("click", handleClickQ);
            
            row.append(cell);
        }

        main.append(row);
    }
    
    hideLoadingView();
    let restart = document.createElement('button');
    restart.textContent = 'Restart';
    restart.classList.add('btn')
    main.append(restart);
}


/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */
let checkrand = 0;
let tempRand = [];
let randQ = 0;

function randomUniqueNum(range, outputCount) {

    let arr = []
    for (let i = 0; i <= range; i++) {
        arr.push(i)
    }

    let result = [];

    for (let i = 0; i <= outputCount; i++) {
        const random = Math.floor(Math.random() * (range - i));
        result.push(arr[random]);
        arr[random] = arr[range - i];
    }

    return result;
}

let random = [];
for(let k = 0; k < 5; k++) {
    console.log(randomUniqueNum(4,4));
    random[k] = randomUniqueNum(4,4);    
}

function handleClickQ(evt) {
    evt.preventDefault();
    
    let x = evt.target.id;
    console.log('x is: ', x);
    
    let clickedCell = document.getElementById(`${x}`);

    if(clickedCell.textContent === '?' )
    {
        //console.log(data[0]) 0-4
        clickedCell.textContent = data[x[2]].clueArr[random[x[2]][x[0]]].question;
    }
    else
    {
        clickedCell.textContent = data[x[2]].clueArr[random[x[2]][x[0]]].answer;
    }
    
}


/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

/** On click of start / restart button, set up game. */

// (DONE)TODO

/** On page load, add event handler for clicking clues */

// (DONE)TODO


 let start = document.createElement('button');
 start.textContent = 'Start';
 start.classList.add('btn');
 main.append(start);

 start.addEventListener('click', function(e) {
    e.preventDefault();
    main.innerHTML = '';
    showLoadingView()
    fillTable();
} );

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    let wait = document.createElement('img');
    wait.setAttribute('id', 'wait');
    main.append(wait)
    wait.src = 'https://cdn.dribbble.com/users/1186261/screenshots/3718681/media/27438516469ad4d494718cb2b9895ca5.gif'
}

// /** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    document.getElementById('wait').remove();
    // let wait = document.getElementById('wait')
    // wait.removeChild();
    
}
