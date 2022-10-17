class Player {
    constructor (name, isPlayer) {
        this.name = name;
        this.party = [];
        this.currency = 0;
        this.isAI = !isPlayer;
        this.inventory = [];

    }

    addToParty = function (pokemon) {
        if (typeof pokemon === 'object') {
            this.party.push(pokemon);
        } else {
            console.log("Not a pokemon object");
        }
    }



    switchMon = function () {
        let availableMon = this.party.filter(mon => mon.status !== 'Faint');

        if (availableMon === []) {
            return null;
        }

        let partyIndex;
        if (this.isPlayer) {
            // Try use Array.prototype.reduce here
            const selectionString = '';
            for (let monIndex in availableMon) {
                if (this.party[monIndex].battleStats.hp) {
                    selectionString += `${monIndex}: ${this.party[monIndex]}\n`;
                }

            }
            partyIndex = prompt(selectionString + 'Please make your selection (number): ');

        } else {
            partyIndex = Math.floor(Math.random()*availableMon.length);
        }

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

        for (let stat in baseStats) {
            this.stats[stat] = baseStats[stat] * 0.5 * this.level;
        }

        this.battleStats = Object.create(this.stats);
    }

    statChange (stat, changeFactor) {
        if (stat === 'hp') {
            const missingHP = this.stats.hp - this.battleStats.hp;
            if (changeFactor > missingHP){
                this.battleStats.hp = this.stats.hp;
                console.log(`${this.name} healed for ${missingHP}!`); 
            } else {
                this.battleStats.hp += changeFactor;
                console.log(`${this.name} healed for ${changeFactor}`);
            }

        } else {
            this.battlesStats[stat] *= changeFactor;

            if (changeFactor < 1) {
                console.log(`${this.name}'s ${stat.toUpperCase()} fell!`);
            } else {
                console.log(`${this.name}'s ${stat.toUpperCase()} rose!`)
            }
        }
    }


    statusReport = function () {
        console.log(`Name: ${this.name}`);
        console.log(`HP: ${this.battleStats.hp} / ${this.stats.hp}`);
        console.log(`Status: ${this.status}`);
        console.log("Current Stats:");
        for (let stat in this.battleStats) {
            console.log(`${stat}: ${this.battleStats[stat]} / ${this.stats[stat]}`);
        }
    }
    
    attack = function(enemy, move) {
        if (this.isPlayer) {
            console.log(`${this.name} used ${move.name}!`);
        } else {
            console.log(`The enemy ${this.name} used ${move.name}!`);
        }

        
        // Calculate damage
        const damage = damageCalc(this, enemy, move);


        if (damage >= enemy.battleStats.hp) {
            enemy.battleStats.hp = 0;
            enemy.status = 'Faint';
        } else {
            enemy.battleStats.hp -= damage;

            if (move.effect) {
                console.log('Has an effect');
                for (let effect of move.effect) {
                    let target;
                    if (effect.target === 'enemy') {
                        target = enemy;
                    } else if (effect.target === 'self') {
                        target = this;
                    }
                    move.applyEffect(target);
                }
            }
        }
    }
}

class Item {
    constructor (name, statChange, changeFactor) {
        this.name = name;
        this.statChange = statChange;
        this.changeFactor = changeFactor;
    }

    use (target) {
        target.statChange(this.statChange, this.changeFactor);
    }
}


let potion = new Item ('Potion', 'hp', 20);

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

    applyEffect (target) {
        // Rolls for each effect and applies the successfull ones in order
        for (let effect of this.effect) {
            if (Math.ceil(Math.random()) > this.probability) {
                // Accounts for all effect types
                if (this.statChange) {
                    target.battleStats[statChange] *= this.changeFactor;
                    
                    console.log(`${target.name}'s ${statChange} changed!`);

                }
                

                if (this.statusChange) {
                    target.status = effect.statusChange;
                    console.log(`${target.name} was inflicted with ${this.statusChange.toUpperCase()}!`);
                }

            }
        }
    }
    
}


function effectiveCheck(atkType, defMon) {
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
        A = attackingMon.stats.atk;
        D = defendingMon.stats.def;
    } else {
        A = attackingMon.stats.spatk;
        D = defendingMon.stats.spdef;
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
    player.activeMon = player.party[0];
    enemy.activeMon = enemy.party[0];

    let turnNumber = 1;
    let winner;


    while (!winner) {
        console.log('\n\n');
        player.activeMon.statusReport();
        console.log('\n\n');
        enemy.activeMon.statusReport();
        // console.log(`Player:\nName: ${player.activeMon.name}\nHP: ${player.activeMon.battleStats.hp} / ${player.activeMon.stats.hp}`);
        // console.log(`Enemy:\nName: ${enemy.activeMon.name}\nHP: ${enemy.activeMon.battleStats.hp} / ${enemy.activeMon.stats.hp}`);


        player.action = {
            monSpd: player.activeMon.battleStats.spd,
        };

        enemy.action = {
            monSpd: enemy.activeMon.battleStats.spd,
        };

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
                player.action.priority = 0;
                break;

            case 1:

                for (let itemIndex in player.inventory) {
                    promptText2 += `${itemIndex}: ${player.inventory[itemIndex][0].name} * ${player.inventory[itemIndex][1]}\n`;
                }
                player.action.item = player.inventory[+prompt(promptText2)];
                player.action.priority = infinity;
                break;

            case 2:
                for (let monIndex in player.party) {
                    promptText2 += `${monIndex}: ${player.party[monIndex].name}`;
                }
                player.action.switch = true;
                player.action.priority = infinity;
                break;

        }

        // Enemy will always attack (for now)
        // Random enemy moves 
        enemy.action.move = enemy.activeMon.moves[Math.floor(Math.random()*enemy.activeMon.moves.length)];

        player.action.priority += player.action.move.priority;
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

        function execute (activePlayer, passivePlayer) {
            if (activePlayer.action.item) {
                activePlayer.action.item.use(activePlayer.activeMon);
            } else if (activePlayer.action.switch) {
                activePlayer.activeMon = activePlayer.switchMon();
            } else {
                activePlayer.activeMon.attack(passivePlayer.activeMon, activePlayer.action.move);
            }

            if (passivePlayer.activeMon.status === 'Faint') {
                passivePlayer.activeMon = passivePlayer.switchMon()
            }

            if (!passivePlayer.activeMon) {
                winner = activePlayer;
            }
        }

        for (let playerIndex in players) {
            execute (players[playerIndex], players[ Math.abs((playerIndex - 1)) ]);
        }

        turnNumber += 1;
        if (turnNumber > 50) {
            console.log(`ERROR: TURN NUMBER\n`);
            break;
        }
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------

const tackle = new Move ('Tackle', 'Normal', 'Physical', 10, 100, 15, 1)
tackle.effect = null;

const growl = new Move('Growl', 'Normal', 'Physical', 0, 100, 15, 1)
growl.effect = [
    {
        target: 'enemy',
        statChange: 'atk',
        changeFactor: 0.9,
        probability: 1,
    }
]

const vineWhip = new Move ('Vine Whip', 'Grass', 'Physical', 10, 100, 15, 1);
vineWhip.effect = [
    {
        target: 'enemy',
        statusChange: 'BRN',
        probability: 0.1
    }
]

exampleStats = {
    hp: 10,
    atk: 10,
    def: 10,
    spatk: 10,
    spdef: 10,
    spd: 10
}

const charmander1 = new Pokemon ('Charmander', 5, ['Fire'], exampleStats, [tackle, growl], true);
const bulbasaur1 = new Pokemon ('Bulbasaur', 5, ['Grass', 'Poison'], exampleStats, [tackle, vineWhip], true);

const p1 = new Player('Jack', true);


p1.addToParty(charmander1);
p1.addToParty(bulbasaur1);
p1.inventory.push([potion, 5]);


const bulbasaur2 = new Pokemon ('Bulbasaur', 5, ['Grass', 'Poison'], exampleStats, [tackle, vineWhip], false);
const charmander2 = new Pokemon ('Charmander', 5, ['Fire'], exampleStats, [tackle, growl], false);

const p2 = new Player('Jill', false);
p2.addToParty(charmander2);
p2.addToParty(bulbasaur2);

// battle(player1, player2)