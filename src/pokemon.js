import {roll} from './useful-functions.js'
import pokeData from './pokemonData.json' assert {type: 'json'}

const testNature = {
    atk: 0.9,
    def: 1,
    spdef: 1,
    spatk: 1.1,
    spd: 1
}
export class Pokemon {
    constructor({id, level, moves, isPlayer}) {
        this.id = id;
        this.level = level;

        
        this.name = pokeData[this.id].name;
        this.type = pokeData[this.id].types;
        this.baseStats = pokeData[this.id].baseStats;
        this.moves = moves;
        this.isPlayer = isPlayer;

        this.nature = testNature;
        this.stats = {};
        this.status = 'OK';
        this.prefix = '';
        this.ivs = {};
        this.evs = {};

        if (!this.isPlayer) {
            this.prefix = 'The Enemy ';
        }

        for (let stat in this.baseStats) {
            this.ivs[stat] = roll(30) + 1;
            this.evs[stat] = 0;
        }

        this.stats = this.getStats();

        this.currentHP = this.stats.hp;

        this.sprites = {};
        const spriteTypes = ['front', 'back']
        spriteTypes.forEach ((type) => {
            this.sprites[type] = new Image();
            this.sprites[type].src = `./img/sprites/pokemon/${this.id}-${type}.png`;
        })
        

    }



    scaleStat (stat, changeFactor) {
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

    getStats = function() {
        const statObj = {};
        statObj.hp = (( 2 * this.baseStats.hp + this.ivs.hp + this.evs.hp/4)*this.level)/100 + this.level + 10;
        
        for (let stat in this.baseStats) {
            if (stat === 'hp') continue;

            statObj[stat] = ((( 2 * this.baseStats[stat] + this.ivs[stat] + this.evs[stat]/4)*this.level)/100 + 5)*this.nature[stat];

        }

        return statObj;
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