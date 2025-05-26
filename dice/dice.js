function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollDice(numDice, sides) {
  let total = 0;
  let rolls = []
  for (let i = 0; i < numDice; i++) {
    let newRoll = rollDie(sides)
    total += newRoll;
    rolls.push(newRoll)
  }
  return {total: total, rolls: rolls};
}

function updateDiceDisplay() {
  let numDice = Number(document.getElementById("diceCount").value);
  let numSides = Number(document.getElementById("diceType").value.substring(1));
  let modifer = Number(document.getElementById("modifier").value);
  let display = document.getElementById("showAllRolls").checked;

  let result = rollDice(numDice, numSides)
  let output = result.total + modifer;
  if (!display) {
    document.getElementById("result").innerHTML = '<b>' + output + '</b>';
  } else {
    document.getElementById("result").innerHTML = '<b>' + output + '</b>' + " (" + result.rolls.join(", ") + ")";
  }
}

document.getElementById("rollButton").addEventListener("click", updateDiceDisplay);