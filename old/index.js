const kyrpticTeam = ['Charizard X', 'Raichu', 'Gyarados', 'Vensaur', 'Gala Rapidash', 'Alakazam']
const krypticUberTeam = ['Zapdos', 'Mega Rayquasa', 'Suicune', 'Mew', 'Entei', 'Dialga']
const voxTeam = ['Gengar', '', 'Jolteon', 'Swampert', 'Metagross']
const voxUberTeam = ['Regieleci', 'Mewtwo', 'Arceus', 'Darkrai', 'Xerneas', 'Groudon'];

function roll(n) {
    return Math.floor(Math.random()*n)
}
for (let i; i < 20; i++) {
    console.log(roll(100))
}

class Player {
    constructor (name, isPlayer) {
        this.name = name;
        this.party = [];
        this.currency = 0;
        this.inventory = [];
        this.isPlayer = isPlayer;
        this.prefix = 'Pokemon Trainer ';

    }

    addToParty = function (pokemon) {
        if (typeof pokemon === 'object') {
            this.party.push(pokemon);
        } else {
            console.log("Not a pokemon object");
        }
    }


    switchMon = function () {
        console.log('switchMon() called')
        let availableMon = this.party.filter(mon => mon.status !== 'Faint');
        console.log(availableMon);
        if (availableMon === []) {
            return null;
        }

        let partyIndex;
        if (this.isPlayer) {
            // Try use Array.prototype.reduce here
            let selectionString = '';
            for (let monIndex in availableMon) {
                if (this.party[monIndex].currentHP) {
                    selectionString += `${monIndex}: ${this.party[monIndex].name}\n`;
                }

            }
            partyIndex = prompt(selectionString + 'Please make your selection (number): ');

        } else {
            partyIndex = Math.floor(Math.random()*availableMon.length);
        }

        console.log(`switching to ${availableMon[partyIndex].name}`);
        return availableMon[partyIndex];
    }
}

class Pokemon {
    constructor(name, level, type, baseStats, moves, isPlayer) {
        this.name = name;
        this.level = level;
        this.type = type;
        this.baseStats = baseStats;
        this.moves = moves;
        this.isPlayer = isPlayer;

        this.stats = {};
        this.status = 'OK';
        this.prefix = '';

        if (!this.isPlayer) {
            this.prefix = 'The Enemy ';
        }

        for (let stat in baseStats) {
            this.stats[stat] = baseStats[stat] * 0.5 * this.level;
        }

        this.currentHP = this.stats.hp;

        

    }

    changeStat (stat, changeFactor) {
        if (stat === 'hp') {
            const missingHP = this.stats.hp - this.currentHP;
            if (changeFactor > missingHP){
                this.currentHP = this.stats.hp;
                console.log(`${this.name} healed for ${missingHP}!`); 
            } else {
                this.currentHP += changeFactor;
                console.log(`${this.name} healed for ${changeFactor}`);
            }

        } else {
            this.battleStats[stat] *= changeFactor;        

            let suffix;
            if (changeFactor < 1) {
                suffix = ' fell!'
            } else {
                suffix = ' rose!'
            }
            console.log(`${this.prefix + this.name}'s ${stat.toUpperCase() + suffix}`);
        }
    }

    changeStatus (newStatus) {
        if (this.status === 'OK' && newStatus === 'OK' || this.status === 'Faint') {
            return;
        }

        let suffix;
        switch (newStatus.toUpperCase()) {
            case 'PSN':
                suffix = 'poisoned!';
                break;
            case 'TOX':
                suffix = 'badly poisoned!';
                break;
            case 'BRN':
                suffix = 'burned!'
                break;
            case 'PAR':
                suffix = 'paralyzd!'
                break;

        };

        this.status = newStatus;
        console.log(`${this.prefix + this.name} was ${suffix}`);
    } 

    setStat = function(stat) {
        if (stat === 'hp') {
            this.stats[stat] = (2 * this.baseStats[stat] )
        }
        this.stats[stat]
    }

    battleInit = function() {
        this.battleStats = Object.create(this.stats);
        delete this.battleStats.hp;
        this.subStatus = null;
    }

    removeBattleProps = function() {
        delete this.battleStats;
        delete this.subStatus;
    }

    statusReport = function () {
        console.log(`\nName: ${this.prefix + this.name}`);
        console.log(`HP: ${this.currentHP} / ${this.stats.hp}`);
        console.log(`Status: ${this.status}`);
        console.log("Current Stats:");
        for (let stat in this.battleStats) {
            console.log(`${stat}: ${this.battleStats[stat]} / ${this.stats[stat]}`);
        }
    }

    attack = function(enemy, move) {
        console.log(`${this.prefix + this.name} used ${move.name}!`)
        // Calculate damage
        const damage = damageCalc(this, enemy, move);

        if (damage >= enemy.currentHP) {
            enemy.currentHP = 0;
            enemy.status = 'Faint';
            console.log(`${enemy.prefix + enemy.name} fainted!`);
        } else {
            
            enemy.currentHP -= damage;
            if (damage) {
                console.log(`${enemy.prefix + enemy.name} took ${damage} damage.`);
            }

            if (move.effect) {
                if (roll(100) < move.effect.probability) {
                    let target;
                    if (move.effect.target === 'enemy') {
                        target = enemy;
                    } else if (move.effect.target === 'self') {
                        target = this;
                    }
                    console.log('about to appl effect');
                    move.effect.apply(target);
                }
            }

        }
    }
}

class Item {
    constructor (name, statMod, changeFactor) {
        this.name = name;
        this.statMod = statMod;
        this.changeFactor = changeFactor;
    }

    use (target) {
        if (this.statMod) {
            target.changeStat(this.statChange, this.changeFactor);
        }
    }
}

class Move {
    constructor (name, elementalType, attackType, power, accuracy, totalPP, priority) {
        this.name = name;
        this.elementalType = elementalType;
        this.attackType = attackType;
        this.power = power;
        this.accuracy = accuracy;
        this.effect = [];
        this.totalPP = totalPP;
        this.currentPP = totalPP;
        this.priority = priority;
    }    
}

function effectiveCheck(atkType, defMon) {
    // Placeholder
    return 1;
}

function damageCalc(attackingMon, defendingMon, move) {
    
    let crit = 1;
    if (roll(100) < 10) {
        crit = 2;
    }

    // Determine effective attacking and defending stat
    let A; // effective attack stat
    let D; // effective defense stat
    if (move.attackType === 'Physical') {
        A = attackingMon.battleStats.atk;
        D = defendingMon.battleStats.def;
    } else {
        A = attackingMon.battleStats.spatk;
        D = defendingMon.battleStats.spdef;
    }

    const random = 1; // Placeholder
    const level = attackingMon.level;
    const power = move.power;

    if (!power) {
        return 0;
    }

    let stab = 1; // Placeholder
    if (attackingMon.type[0] === move.type || attackingMon.type[1] === move.type) {
        stab = 1.5;
    } 

    effectiveness = effectiveCheck(move.type, defendingMon)

    const damage = ((( (2*level/5) + 2 ) * power * (A/D) / 50) + 2) * random * crit * stab * effectiveness;
    return damage;
}



function battle(player, enemy) {
    console.log(`Pokemon Trainer ${enemy.prefix + enemy.name} wants to battle!`);

    player.activeMon = player.party[0];
    enemy.activeMon = enemy.party[0];

    let turnNumber = 1;
    let winner;

    // Set battle
    player.activeMon.battleInit();
    enemy.activeMon.battleInit();

    while (!winner) {
        console.log('------------------------------------------------------------------------------------------------------------------------');

        // Initialize battle properties
        player.action = {};
        player.skipTurn = false;
        enemy.action = {};
        enemy.skipTurn = false;



        player.activeMon.statusReport();
        enemy.activeMon.statusReport();

        // First choice
        const promptText1 = '0: Fight\n1: Use Item\n2: Switch\nWhat do you want to do?: ';
        player.action.choice1 = +prompt(promptText1);
        
        // Second Choice
        let promptText2 = '';
        let choice1CountCheck = 0;


        switch (player.action.choice1) {
            case 0:
                for (let moveIndex in player.activeMon.moves) {
                    promptText2 += `${moveIndex}: ${player.activeMon.moves[moveIndex].name} (PP: ${player.activeMon.moves[moveIndex].currentPP} / ${player.activeMon.moves[moveIndex].totalPP})\n`
                }
                player.action.move = player.activeMon.moves[+prompt(promptText2)];
                player.action.priority += player.action.move.priority;
                break;

            case 1:

                for (let itemIndex in player.inventory) {
                    promptText2 += `${itemIndex}: ${player.inventory[itemIndex][0].name} * ${player.inventory[itemIndex][1]}\n`;
                }
                player.action.item = player.inventory[+prompt(promptText2)];
                player.action.priority = 100;
                break;

            case 2:
                for (let monIndex in player.party) {
                    promptText2 += `${monIndex}: ${player.party[monIndex].name}`;
                }
                player.action.switch = true;
                player.action.priority = 100;
                break;
        }

        // Enemy will always attack (for now)
        // Random enemy moves (for now)
        enemy.action.move = enemy.activeMon.moves[Math.floor(Math.random()*enemy.activeMon.moves.length)];
        enemy.action.priority += enemy.action.move.priority;

        if (player.action.priority === enemy.action.priority) {

            if (player.action.monSpd === enemy.action.monSpd) {

                let zeroOrOne = Math.floor(Math.random() * 2);
                player.action.priority += zeroOrOne;
                enemy.action.priority += 1 - zeroOrOne;
            
            } else if (player.action.monSpd > enemy.action.monSpd) {
                player.action.priority += 1;
            } else {
                enemy.action.priority += 1;
            }

        }

        let players = [player, enemy].sort((a, b) => {
            a.action.priotity > b.action.priority ? 1 : -1;
        });


        function hasLost(player) {
            let availableMon = player.party.filter(mon => mon.status !== 'Faint');
            console.log(availableMon);
            console.log(!availableMon.length);
            if (!availableMon.length) {
                console.log(`${player.prefix + player.name} has no more useable Pokemon!`)
                return true;
            } else {
                return false;
            }
        }

        function execute (p1, p2) {
            // Executes one half of the turn, ie p1's move against p2
            // Who is p1 first is determined by action.priority;

            let monA = p1.activeMon;
            let monB = p2.activeMon;
            let action = p1.action;

            if (p1.skipTurn) {
                console.log('turn Skipped');
                p1.skipTurn = false;
                return;
            };

            if (action.item) {
                action.item.use(monA);
            } else if (action.switch) {
                player.activeMon = p1.switchMon();
                player.activeMon.battleInit()
                monA = player.activeMon;
            } else {
                // Status check and rolls
                switch (monA.status) {
                    case 'PAR':
                        if (roll(100) < 25) {
                            console.log(`${monA.prefix + monA.name} is fully paralyzed!`);
                            return;
                        };
                        break;

                    
                    case 'SLP':
                        if (!monA.sleepCounter) {
                            monA.sleepCounter = 0;
                        };
    
                        if ((monA.sleepCounter/3)*100 < roll(100)) {
                            console.log(`${monA.prefix + monA.name} is fast asleep.`);
                            monA.sleepCounter += 1
                            return;
                        } else {
                            console.log(`${monA.prefix + monA.name} woke up!`);
                            monA.status = 'OK';
                            delete monA.sleepCounter;
                        }
                }
                monA.attack(monB, p1.action.move);
            }

            if (monB.status === 'Faint') {
                monB.removeBattleProps();
                // console.log()
                if (hasLost(p2)) {
                    winner = p1;
                    console.log(`${winner.prefix + winner.name} has `);
                    return;
                }
                enemy.activeMon = p2.switchMon();
                enemy.activeMon.battleInit();
                monB = enemy.activeMon;
                p2.skipTurn = true;   
            }
        }

        // Executes each players moves in order of priority
        for (let playerIndex in players) {
            const p1 = players[playerIndex];
            const p2 = players[Math.abs((playerIndex - 1))];
            console.log('\n\n')
            execute(p1, p2);
            if (winner) {
                return;
            }

        }

        turnNumber += 1;
        if (turnNumber > 50) {
            console.log(`ERROR: TURN NUMBER\n`);
            break;
        }
    }
}


// ------------------------------------------------------------------------------------------------------------------------------------------------
// Define moves
const tackle = new Move ('Tackle', 'Normal', 'Physical', 10, 100, 15, 1);

const growl = new Move('Growl', 'Normal', 'Physical', 0, 100, 15, 1);
growl.effect = {
    target: 'enemy',
    probability: 100,
    apply: function (target) {
        target.changeStat('atk', 0.9);
    }
}

const vineWhip = new Move ('Vine Whip', 'Grass', 'Physical', 10, 100, 15, 1);

const megaBeam = new Move ('Mega Beam', 'Dragon', 'Special', 500, 100, 15, 3);

const hypnosis = new Move ('Hypnosis', 'Normal', 'Physical', 0, 100, 15, 1);
hypnosis.effect = {
    target: 'enemy',
    probability: 100,
    apply: function (target) {
        console.log('hypnosis effect applied');
        target.changeStatus('SLP');
    } 
}

const stunSpore = new Move ('Stun Spore', 'Normal', 'Physical', 0, 100, 15, 1);
stunSpore.effect = {
    target: 'enemy',
    probability: 100,
    apply: function (target) {
        target.changeStatus('PAR');
    }
}

// --------------------------------------------------------------------------------------------------------------------------------------------------
// Define Items

let potion = new Item ('Potion', 'hp', 20);


// -------------------------------------------------------------------------------------------------------------------------------------------------
// Define Pokemon

function BaseStats(hp, atk, def, spatk, spdef, spd) {
    this.hp = hp;
    this.atk = atk;
    this.def = def;
    this.spatk = spatk;
    this.spdef = spdef;
    this.spd = spd;
}
const exampleStats = new BaseStats (10, 10, 10, 10, 10, 10, 10);
const charmanderBaseStats = new BaseStats (39, 52, 43, 60, 50, 65);
const bulbasaurBaseStats = new BaseStats (45, 49, 49, 65, 65, 45);
const squirtleBaseStats = new BaseStats (44, 48, 65, 50, 64, 43);
const mewBaseStats = new BaseStats (100, 100, 100, 100, 100, 100);

const charmander1 = new Pokemon ('Charmander', 5, ['Fire'], charmanderBaseStats, [tackle, growl, megaBeam, hypnosis], true);
const bulbasaur1 = new Pokemon ('Bulbasaur', 5, ['Grass', 'Poison'], bulbasaurBaseStats, [tackle, vineWhip, megaBeam, stunSpore], true);
bulbasaur1.status = 'PAR';

//--------------------------------------------------------------------------------------------------------------------------------------------------
// Define players

const p1 = new Player('Bob', true);


p1.addToParty(charmander1);
p1.addToParty(bulbasaur1);
p1.inventory.push([potion, 5]);


const bulbasaur2 = new Pokemon ('Bulbasaur', 5, ['Grass', 'Poison'], exampleStats, [tackle, vineWhip], false);
const charmander2 = new Pokemon ('Charmander', 5, ['Fire'], exampleStats, [tackle, growl], false);

const p2 = new Player('Mary', false);
p2.addToParty(charmander2);
p2.addToParty(bulbasaur2);

// battle(p1, p2)