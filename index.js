class Player {
    constructor (name) {
        this.name = name;
        this.party = [];
        this.currency = 0;

    }

    addToParty = function (pokemon) {
        if (typeof pokemon === 'object') {
            this.party.push(pokemon);
        } else {
            console.log("Not a pokemon object");
        }
    }
    
}

class Pokemon {
    constructor(name, level, type, baseStats, moves) {
        this.name = name;
        this.level = level;
        this.type = type;
        this.moves = moves;
        this.baseStats = baseStats;
        this.stats = {};
        this.status = 'OK';

        for (let stat in baseStats) {
            this.stats[stat] = baseStats[stat] * 0.5 * this.level;
        }

        this.currentHP = this.stats.hp;
    }

    takeDamage = function (damage) {
        if (this.currentHP <= damage) {
            this.currentHP = 0;
            this.status = 'faint';
        } else {
            this.currentHP -= damage;
        }

    }

    heal = function(healValue) {
        let healedFor;
        if (healValue > this.stats.hp - this.currentHP || healValue === 'full') {
            this.currentHP = this.stats.hp;
            healedFor = healValue - this.stats.hp - this.currentHP; 
        } else {
            this.currentHP += healValue;
            healedFor = healValue;
        }
        console.log(this.name + ' healed for ' + healedFor);
    }

    statusReport = function () {
        console.log(`Name: ${this.name}`);
        console.log(`HP: ${this.currentHP} / ${this.stats.hp}`);
        console.log(`Stats: ${this.status}`);
        console.log("Current Stats:");
        console.table(this.stats);
    }
    
}

exampleStats = {
    hp: 10,
    atk: 10,
    def: 10,
    spatk: 10,
    spdef: 10,
    spd: 10
}

class Move {
    constructor (name, elementalType, attackType, power, accuracy) {
        this.name = name;
        this.elementalType = elementalType;
        this.attackType = attackType;
        this.power = power;
        this.accuracy = accuracy;
    }
}

const tackle = new Move ('Tackle', 'Normal', 'Physical', 10, 100)
tackle.effect = null;

const growl = new Move('Growl', 'Normal', 'Physical', 0, 100)
growl.effect = [
    {
        target: 'enemy',
        statChange: 'atk',
        changeFactor: 0.9,
        probability: 0.1
    }
]

const vineWhip = new Move ('Vine Whip', 'Grass', 'Physical', 10, 100);
vineWhip.effect = [
    {
        target: 'enemy',
        statusChange: 'BRN',
        probability: 0.1
    }
]


const charmander = new Pokemon ('Charmander', 5, ['Fire'], exampleStats, [tackle, growl]);
const bulbasaur = new Pokemon ('Bulbasaur', 5, ['Grass', 'Poison'], exampleStats, [tackle, vineWhip]);

const player1 = new Player('Jack');


player1.addToParty(charmander);
player1.addToParty(bulbasaur);

function effectiveCheck(atkType, defType) {
    // Placeholder
    return 1;
}

function damageCalc(attackingMon, defendingMon, move) {
    let crit = 1;
    if (Math.random() <= 0.1) {
        crit = 2;
    }

    // Determine effective attacking and defending stat
    let A; // effective attack stat
    let D; // effective defense stat
    if (move.attackType === 'Physical') {
        A = attackingMon.stat.atk;
        D = defendingMon.stat.def;
    } else {
        A = attackingMon.stat.spatk;
        D = defendingMon.stat.spdef;
    }

    


}

function battle(player, opponent) {
    let playerPokemon = player.party[0];
    let enemyPokemon = opponent.party[0];

    let turn = 1;
    let winner;

    while (!winner) {
        console.log(playerPokemon.moves)
        let currentPlayerMove = prompt('Select a move: ');
        let currentOpponentMove = enemyPokemon.moves;
    }
}
