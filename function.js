//This function is in charge of reading the JSON file
//and inserting the data into an array.
function initialize() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "data.json", true);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const players = JSON.parse(this.responseText);
      comparePlayers(players);
    }
  };
}
//This function is to inicializate arrays and important
//data
function comparePlayers(players) {
  //This value is the sum of the height in inches
  //that we want to find
  let initialValue = document.getElementById("name").value;
  //We organize the players array with the JavaScript sort function
  //in a O(n log (n) ) complexity
  players.sort(compare);
  //We add to every player in the array, a flag value, so we can avoid
  //duplicates
  players.forEach(function (element) {
    element.flag = "false";
  });
  main(players, initialValue);
}

//The main function is in charge of get the solutions and show them
//in one HTML table in the browser
function main(players, initialValue) {
  //Array of all the couple of players that meet the condition
  globalThis.solutions = [];
  players.forEach(function callback(comparingPlayer, index) {
    //Calling recursive function for every player
    divideAndConquer(comparingPlayer, initialValue, players);
    //eliminating the player from the array once compared to the rest.
    players.splice(index, 1);
  });
  //Adding the data in the HTML body
  let res = document.querySelector("#res");
  res.innerHTML = "";
  //If the solutions array is empty, just add a "Not Matches found" message.
  if (solutions.length == 0) {
    res.innerHTML += `
    <tr>
        <td>
        ${"No matches found"}
        </td>
    </tr>
    
    `;
  }
  for (let item of solutions) {
    res.innerHTML += `
    <tr>
        <td>
        ${item}
        </td>
    </tr>
    
    `;
  }
}

//To solve the problem, I used an algorithm based in the divide and conquer
//paradigm. The first step is calculate the player in the half of the array
//Then, compare the value of his height with the initialValue - comparingPlayer
//(That is the value that we are looking for),,(comparingPlayer is the player
//that we are comparing with all the other players)

function divideAndConquer(comparingPlayer, initialValue, players) {
  half = Math.ceil(players.length / 2);
  const arr_left = players.slice(0, half);
  const arr_right = players.slice(-half);

  if (players.length == 1) {
    return;
    //Then if the result of initiaValue - comparingPlayer is more than
    //the height of the player that we are comparing with, we just going
    //to evaluate the array of the right, because we just want a higher value
    //Is exactly the same for the other case but evaluating the left array.
  } else if (initialValue - comparingPlayer.h_in > players[half].h_in) {
    divideAndConquer(comparingPlayer, initialValue, arr_right);
    return;
  } else if (initialValue - comparingPlayer.h_in < players[half].h_in) {
    divideAndConquer(comparingPlayer, initialValue, arr_left);
    return;
    //If we found a valid value, we add it to the array of results.
  } else if (
    initialValue - comparingPlayer.h_in == players[half].h_in &&
    players[half].flag == "false" &&
    comparingPlayer != players[half]
  ) {
    solutions.push(
      comparingPlayer.first_name +
        " " +
        comparingPlayer.last_name +
        " - " +
        players[half].first_name +
        " " +
        players[half].last_name
    );
    players[half].flag = "true";

    divideAndConquer(comparingPlayer, initialValue, arr_right);
    divideAndConquer(comparingPlayer, initialValue, arr_left);
    return;
  }
}

//This function is used by the sort method to order the json array.
function compare(a, b) {
  if (a.h_in < b.h_in) {
    return -1;
  }
  if (a.h_in > b.h_in) {
    return 1;
  }
  return 0;
}
