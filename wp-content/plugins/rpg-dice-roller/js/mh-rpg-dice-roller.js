(function() {
	var rollButton = document.getElementById('mh-rpg-roll-button'),
		widgetRollButton = document.getElementById('mh-rpg-roll-button-widget');

	if (rollButton !== null)
		rollButton.addEventListener('click', rollDice);
	if (widgetRollButton !== null)
		widgetRollButton.addEventListener('click', widgetRollDice);

	function rollDice() {
		clearRolls('mh-rpg-dice-roll', 'mh-rpg-all-rolls');
		var numberOfDice = document.getElementById('mh-rpg-number-of-dice').value;
		
		if (numberOfDice < 1)
			return;
		
		var dieType = document.getElementById('mh-rpg-die-type').value,
			rolls = getRolls(numberOfDice, dieType),
			modifier = parseInt(document.getElementById('mh-rpg-modifier').value);

		displayTotal('mh-rpg-dice-roll', parseInt(rolls.reduce(addValues)) + modifier);

		if (document.getElementById('mh-rpg-display-all-cb').checked)
			displayAllRolls('mh-rpg-all-rolls', rolls);
	}

	function widgetRollDice() {
		clearRolls('mh-rpg-dice-roll-widget', 'mh-rpg-all-rolls-widget');
		var numberOfDice = document.getElementById('mh-rpg-number-of-dice-widget').value;
		
		if (numberOfDice < 1)
			return;
		
		var dieType = document.getElementById('mh-rpg-die-type-widget').value,
			rolls = getRolls(numberOfDice, dieType),
			modifier = parseInt(document.getElementById('mh-rpg-modifier-widget').value);

		displayTotal('mh-rpg-dice-roll-widget', parseInt(rolls.reduce(addValues)) + modifier);

		if (document.getElementById('mh-rpg-display-all-cb-widget').checked)
			displayAllRolls('mh-rpg-all-rolls-widget', rolls);
	}

	function getRolls(numberOfDice, dieType) {
		var rolls = [];
		for (var i = 0; i < numberOfDice; i++) {
			rolls.push(randomNumber(1, dieType));
		}
		return rolls;
	}

	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function addValues(a, b) {
		return a + b;
	}

	function displayTotal(containerId, value) {
		document.getElementById(containerId).innerHTML = value;
	}

	function displayAllRolls(containerId, values) {
		document.getElementById(containerId).innerHTML = '(' + values.join(', ') + ')';
	}

	function clearRolls(rollContainerId, allRollsContainerId) {
		document.getElementById(rollContainerId).innerHTML = '';
		document.getElementById(allRollsContainerId).innerHTML = '';
	}
})();
