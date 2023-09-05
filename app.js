let playerData = {
  tables: [
    {
      name: "P1",
      players: [],
    },
    {
      name: "P2",
      players: [],
    },
    {
      name: "P3",
      players: [],
    },
  ],
  waitlist: [],
};

document
  .querySelector("#reservation-method")
  .addEventListener("change", function (e) {
    const timeInput = document.querySelector("#time");
    const statusInput = document.querySelector("#status");

    if (e.target.value === "call-in") {
      timeInput.disabled = false;
      statusInput.value = "not-checked-in";
    } else {
      timeInput.disabled = true;
      timeInput.value = "";
      statusInput.value = "checked-in";
    }
  });

document.querySelector("#queue-player").addEventListener("click", function () {
  const nameInput = document.querySelector("#player-name");
  const numberInput = document.querySelector("#phone-number");
  const methodInput = document.querySelector("#reservation-method");
  const timeInput = document.querySelector("#time");
  const statusInput = document.querySelector("#status");
  const notesInput = document.querySelector("#notes");
  const button = document.querySelector("#queue-player");

  let newPlayerData = {
    name: nameInput.value,
    number: numberInput.value,
    method: methodInput.value,
    time: timeInput.value,
    status: statusInput.value,
    notes: notesInput.value,
  };

  if (button.attributes.mode.value === "editing") {
    const playerIndex = button.attributes.playerid.value;
    const tableIndex = button.attributes.tableid.value;

    if (tableIndex === 'waitlist') {
      playerData.waitlist[playerIndex] = newPlayerData;
    } else {
      playerData.tables[tableIndex].players[playerIndex] = newPlayerData;
    }

  } else {
    let fullTables = 0;

    for (table of playerData.tables) {
      if (table.players.length < 9) {
        table.players.push(newPlayerData);
        break;
      } else {
        fullTables++;
      }
    }

    if (fullTables === playerData.tables.length) {
      playerData.waitlist.push(newPlayerData);
    }
  }

  render();
});

function clearInputs() {
  const nameInput = document.querySelector("#player-name");
  const numberInput = document.querySelector("#phone-number");
  const methodInput = document.querySelector("#reservation-method");
  const timeInput = document.querySelector("#time");
  const statusInput = document.querySelector("#status");
  const notesInput = document.querySelector("#notes");
  const button = document.querySelector("#queue-player");
  const deleteButton = document.querySelector(".delete-button");

  button.attributes.mode.value = "adding";
  button.removeAttribute("playerid");
  button.innerText = "Add Player";

  if (deleteButton) {
    deleteButton.parentNode.removeChild(deleteButton);
  }

  nameInput.value = "";
  numberInput.value = "";
  methodInput.value = "call-in";
  timeInput.value = "";
  timeInput.disabled = false;
  statusInput.value = "not-checked-in";
  notesInput.value = "";
  nameInput.focus();
}

function render() {
  const allTableObjects = document.querySelectorAll(".pokertablebody");
  document.querySelector(".waitlisttablebody").innerHTML = "";
  allTableObjects.forEach(function (table) {
    table.innerHTML = "";
  });

  playerData.tables.forEach(function (table, tableIndex) {
    const currentTable = document.querySelectorAll(".pokertablebody")[tableIndex];

    table.players.forEach(function (player, playerIndex) {
      const newPlayerRow = currentTable.insertRow();
      const newPlayerSpot = newPlayerRow.insertCell();
      const newPlayerName = newPlayerRow.insertCell();
      const newPlayerNumber = newPlayerRow.insertCell();
      const newPlayerCallOrIP = newPlayerRow.insertCell();
      const newPlayerStatus = newPlayerRow.insertCell();
      const newPlayerNotes = newPlayerRow.insertCell();

      newPlayerSpot.innerHTML = playerIndex + 1;
      newPlayerSpot.setAttribute("tableIndex", tableIndex);
      newPlayerSpot.setAttribute("playerIndex", playerIndex);
      newPlayerName.innerText = player.name;
      newPlayerNumber.innerText = player.number;
      newPlayerStatus.innerText = player.status.replace(/-/g, " ");
      newPlayerNotes.innerText = player.notes;
      newPlayerRow.classList.add(table.name + "-" + playerIndex);

      if (player.method === "in-person") {
        newPlayerCallOrIP.innerText = "IP";
      } else {
        newPlayerCallOrIP.innerText = player.time;
      }

      newPlayerSpot.addEventListener("click", updatePlayer);
    });
  });

  playerData.waitlist.forEach(function (player, playerIndex) {
    const currentTable = document.querySelector('.waitlisttablebody');
    const newPlayerRow = currentTable.insertRow();
    const newPlayerSpot = newPlayerRow.insertCell();
    const newPlayerName = newPlayerRow.insertCell();
    const newPlayerNumber = newPlayerRow.insertCell();
    const newPlayerCallOrIP = newPlayerRow.insertCell();
    const newPlayerStatus = newPlayerRow.insertCell();
    const newPlayerNotes = newPlayerRow.insertCell();

    newPlayerSpot.innerHTML = playerIndex + 1;
    newPlayerSpot.setAttribute("tableIndex", 'waitlist');
    newPlayerSpot.setAttribute("playerIndex", playerIndex);
    newPlayerName.innerText = player.name;
    newPlayerNumber.innerText = player.number;
    newPlayerStatus.innerText = player.status.replace(/-/g, " ");
    newPlayerNotes.innerText = player.notes;
    newPlayerRow.classList.add('wait' + "-" + playerIndex);

    if (player.method === "in-person") {
      newPlayerCallOrIP.innerText = "IP";
    } else {
      newPlayerCallOrIP.innerText = player.time;
    }

    newPlayerSpot.addEventListener("click", updatePlayer);
  });

  clearInputs();
}

function updatePlayer(e) {
  const tableIndex = e.target.attributes.tableindex.value;
  const playerIndex = e.target.attributes.playerindex.value;
  const nameInput = document.querySelector("#player-name");
  const numberInput = document.querySelector("#phone-number");
  const methodInput = document.querySelector("#reservation-method");
  const timeInput = document.querySelector("#time");
  const statusInput = document.querySelector("#status");
  const button = document.querySelector("#queue-player");
  const inputs = document.querySelector("#addplayer");

  button.attributes.mode.value = "editing";
  button.setAttribute("tableid", tableIndex);
  button.setAttribute("playerid", playerIndex);
  button.innerText = "Save";

  if (tableIndex === 'waitlist') {
    var player = playerData.waitlist[playerIndex];
  } else {
    var player = playerData.tables[tableIndex].players[playerIndex];
  }

  nameInput.value = player.name;
  numberInput.value = player.number;
  methodInput.value = player.method;
  timeInput.value = player.time;
  statusInput.value = player.status;

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.setAttribute("tableid", tableIndex);
  deleteButton.setAttribute("playerid", playerIndex);
  deleteButton.addEventListener("click", removePlayer);
  inputs.appendChild(deleteButton);
}

function removePlayer(e) {
  const playerIndex = e.target.attributes.playerid.value;
  const tableIndex = e.target.attributes.tableid.value;

  if (tableIndex === 'waitlist') {
    playerData.waitlist.splice(playerIndex, 1);
  } else {
    playerData.tables[tableIndex].players.splice(playerIndex, 1);
  }

  render();
}
