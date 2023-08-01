let playerData = {
  tableOne: [
    {name: 'Adam A', number: '111-111-1111', method: 'call-in', time: '11:56', status: 'not-checked-in'},
    {name: 'Adam A', number: '111-111-1111', method: 'call-in', time: '11:56', status: 'not-checked-in'},
    {name: 'Adam A', number: '111-111-1111', method: 'call-in', time: '11:56', status: 'not-checked-in'},
    {name: 'Adam A', number: '111-111-1111', method: 'call-in', time: '11:56', status: 'not-checked-in'},
    {name: 'Adam A', number: '111-111-1111', method: 'call-in', time: '11:56', status: 'not-checked-in'},
    {name: 'Adam A', number: '111-111-1111', method: 'call-in', time: '11:56', status: 'not-checked-in'},
    {name: 'Adam A', number: '111-111-1111', method: 'call-in', time: '11:56', status: 'not-checked-in'},
    {name: 'Adam A', number: '111-111-1111', method: 'call-in', time: '11:56', status: 'not-checked-in'},
    {name: 'Adam A', number: '111-111-1111', method: 'call-in', time: '11:56', status: 'not-checked-in'}  
  ],
  tableTwo: [],
  tableThree: [],
  waitlist: []
};

document.querySelector('#reservation-method').addEventListener('change', function(e) {
  const timeInput = document.querySelector('#time');
  const statusInput = document.querySelector('#status');

  if (e.target.value === 'call-in') {
    timeInput.disabled = false;
    statusInput.value = 'not-checked-in';
  } else {
    timeInput.disabled = true;
    timeInput.value = '';
    statusInput.value = 'checked-in';
  }
});

document.querySelector('#queue-player').addEventListener('click', function() {
  const nameInput = document.querySelector('#player-name');
  const numberInput = document.querySelector('#phone-number');
  const methodInput = document.querySelector('#reservation-method');
  const timeInput = document.querySelector('#time');
  const statusInput = document.querySelector('#status');
  const button = document.querySelector('#queue-player');

  let newPlayerData = {
    name: nameInput.value, 
    number: numberInput.value,
    method: methodInput.value,
    time: timeInput.value,
    status: statusInput.value
  };

  if (button.attributes.mode.value === 'editing') {
    const playerID = button.attributes.playerid.value;

    playerData.tableOne[playerID] = newPlayerData;

  } else {
    if (playerData.tableOne.length < 9) {
      playerData.tableOne.push(newPlayerData);
    } else if (playerData.tableTwo.length < 9) {
      playerData.tableTwo.push(newPlayerData);
    } else if (playerData.tableThree.length < 9) {
      playerData.tableThree.push(newPlayerData);
    } else {
      playerData.waitlist.push(newPlayerData);
    }
  }

  render();
});

function clearInputs() {
  const nameInput = document.querySelector('#player-name');
  const numberInput = document.querySelector('#phone-number');
  const methodInput = document.querySelector('#reservation-method');
  const timeInput = document.querySelector('#time');
  const statusInput = document.querySelector('#status');
  const button = document.querySelector('#queue-player');

  button.attributes.mode.value = 'adding';
  button.removeAttribute('playerid');
  button.innerText = 'Add Player';

  nameInput.value = '';
  numberInput.value = '';
  methodInput.value = 'call-in';
  timeInput.value = '';
  statusInput.value = 'not-checked-in';
}

function render() {
  const tableOneList = document.querySelector('#table-one');
  const tableTwoList = document.querySelector('#table-two');
  const tableThreeList = document.querySelector('#table-three');

  document.querySelector('#table-one').innerHTML = '';

  playerData.tableOne.forEach(function (player, i) {
    const newPlayerRow = tableOneList.insertRow();
    const newPlayerSpot = newPlayerRow.insertCell();
    const newPlayerName = newPlayerRow.insertCell();
    const newPlayerNumber = newPlayerRow.insertCell();
    const newPlayerCallOrIP = newPlayerRow.insertCell();
    const newPlayerStatus = newPlayerRow.insertCell();
    const editPlayer = newPlayerRow.insertCell();
    const deletePlayer = newPlayerRow.insertCell();

    newPlayerSpot.innerText = i + 1;
    newPlayerName.innerText = player.name;
    newPlayerNumber.innerText = player.number;
    newPlayerStatus.innerText = player.status.replace(/-/g, ' ');
    newPlayerRow.classList.add('player-' + i);

    if (player.method === 'in-person') {
      newPlayerCallOrIP.innerText = 'IP';
    } else {
      newPlayerCallOrIP.innerText = player.time;
    }

    editPlayer.innerHTML = '<a href="#" playerid="' + i + '">Edit</a>';
    deletePlayer.innerHTML = '<a href="#" playerid="' + i + '">Delete</a>';

    editPlayer.addEventListener('click', updatePlayer);
    deletePlayer.addEventListener('click', removePlayer);
  });
  clearInputs();
}

function updatePlayer(e) {
 const playerID = e.target.attributes.playerid.value;
  const nameInput = document.querySelector('#player-name');
  const numberInput = document.querySelector('#phone-number');
  const methodInput = document.querySelector('#reservation-method');
  const timeInput = document.querySelector('#time');
  const statusInput = document.querySelector('#status');
  const button = document.querySelector('#queue-player');

  button.attributes.mode.value = 'editing';
  button.setAttribute('playerid', playerID);
  button.innerText = 'Save';

  let player = playerData.tableOne[playerID];

  nameInput.value = player.name;
  numberInput.value = player.number;
  methodInput.value = player.method;
  timeInput.value = player.time;
  statusInput.value = player.status;
}

function removePlayer(e) {
  const playerID = e.target.attributes.playerid.value;

  playerData.tableOne.splice(playerID, 1);

  render();
}

render();