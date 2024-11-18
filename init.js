let game = {
    mainDiv: document.getElementById("main-game"),
    stats: {
        totalClicks: 0,
        totalShapes: 0,
        totalGildedShapes: 0,
        statsOpen: false,
        helpOpen: false,
        newgameOpen: false,
    },
    resources: {
        shapes: 0,
        gildedShapes: 0,
        astralShapes: 0,
    },
    variables: {
        shapesPerClick: 1,
        ticksPerClick: 1,
        efficiency: 0,
        booster: 0,
    },
    prestige: {
        prestigeMin: 10_000,
        prestigeIncrement: 10,
        gildedShapesBoostPercent: 100,
        gildedShapesGainPercent: 100,
    },
    shop: {
        costs: [10, 100, 1_500, 100_000, 25_000_000, 1_000_000_000, 7_500_000],
        isExpensiveCost: [false, true, false, true, undefined, undefined],
        costIncrease: 2,
        costIncreaseExpensive: 3,
        costIncreaseSuperExpensive: 8,
    },
    altar: {
        altarOpen: false,
        altarUnlocked: false,
        altarDiv: document.getElementById('altar'),
        astralShapesAvailable: 0,
        astralShapesAllocated: [0, 0],
        totalAstralAllocated: 0,
        spells: ["Golden Ritual", "Gifted Rebirth"],
    }
}
const gameReset = Object.assign({}, game);
const encoder = new TextEncoder();
const decoder = new TextDecoder();
game.altar.altarDiv.style.display = 'none';
game.mainDiv.style.display = 'block';

function increaseShapes() {
    let increment = Math.round(game.variables.shapesPerClick * game.variables.ticksPerClick * (1 + game.variables.efficiency) * Math.pow(2, game.variables.booster));
    increment += Math.round(game.resources.gildedShapes * (game.prestige.gildedShapesBoostPercent / 100) * (game.variables.shapesPerClick / 2));

    if (game.stats.statsOpen) {
        document.getElementById("stats-text").innerHTML = `
        Total Clicks: ${game.stats.totalClicks}<br>
        Total Shapes: ${game.stats.totalShapes}<br>
        Shapes per Click: ${game.variables.shapesPerClick}<br>
        Ticks per Click: ${game.variables.ticksPerClick}<br>
        Efficiency: ${game.variables.efficiency}<br>
        Booster Multi: ${Math.pow(2,game.variables.booster)}x`
    }

    game.resources.shapes += increment
    game.stats.totalClicks++;
    game.stats.totalShapes += increment;
    updateShapeText();
}

function updateShapeText() {
    document.getElementById("shapes-text").innerHTML = `Shapes: ${game.resources.shapes}`;
    document.getElementById("gilded-shapes-text").innerHTML = `Gilded Shapes: ${game.resources.gildedShapes}`;

    if (game.altar.altarOpen) {
        document.getElementById("astral-shapes-text").innerHTML = `Astral Shapes: ${game.resources.astralShapes}`;
        document.getElementById("astral-shapes-available-text").innerHTML = `Astral Shapes Available: ${game.altar.astralShapesAvailable}`;
    }
}

function updateAllText() {
    updateShapeText();
    document.getElementById("prestige-button").innerHTML = `Prestige (requires ${game.prestige.prestigeMin} shapes)`
}

function buyShopItem(item) {
    if (game.resources.shapes < game.shop.costs[item]) return;

    game.resources.shapes -= game.shop.costs[item];
    if (!(game.shop.isExpensiveCost[item] ?? false) && item != 3) game.shop.costs[item] *= game.shop.costIncrease
    else if (item == 3) game.shop.cost[item] *= game.shop.costIncreaseSuperExpensive
    else game.shop.costs[item] *= game.shop.costIncreaseExpensive

    document.getElementById(`shop-${item}-cost`).innerHTML = `Cost: ${game.shop.costs[item]} shapes`;

    switch (item) {
        case 0:
            game.variables.shapesPerClick++;
            break;
        case 1:
            game.variables.efficiency++;
            break;
        case 2:
            game.variables.ticksPerClick += 2;
            break;
        case 3:
            game.variables.booster++;
            break;
    }
    updateShapeText();
}

function prestige() {
    if (game.resources.shapes < game.prestige.prestigeMin) {
        alert(`You need at least ${game.prestige.prestigeMin} shapes to prestige.`)
        return;
    }
    if (!(confirm("Are you sure you want to prestige?"))) return;

    let increment = +((game.prestige.gildedShapesGainPercent / 100)*(Math.log10(game.resources.shapes.pow(1.1)) - 4).toFixed(2));
    game.resources.gildedShapes += increment;
    game.stats.totalGildedShapes += increment;
    game.resources.shapes = 0;
    game.variables.efficiency = 0;
    game.variables.shapesPerClick = 1;
    game.variables.ticksPerClick = 1;
    game.prestige.prestigeMin *= game.prestige.prestigeIncrement;
    game.shop.costs = [10, 100, 2_500, 100_000, 25_000_000, 1_000_000_000];

    document.getElementById("prestige-button").innerHTML = `Prestige (requires ${convertToAbbreviation(game.prestige.prestigeMin)} shapes)`;
    updateShapeText();
}

function toggleNew() {
    if (game.stats.newgameOpen) {
        document.getElementById("new-text").innerHTML = "";
    } else {
        document.getElementById("new-text").innerHTML = `
        This is NG+;
            Adding Booster which doubles shapes for each one you have<br>
            Improved prestige formula slightly<br>
            Changed Alter to 9 Guilded Shapes instead of 10
        `
    }
    game.stats.newgameOpen = !game.stats.newgameOpen;
}

function toggleStats() {
    if (game.stats.statsOpen) {
        document.getElementById("stats-text").innerHTML = "";
    } else {
        document.getElementById("stats-text").innerHTML = `
        Total Clicks: ${game.stats.totalClicks}<br>
        Total Shapes: ${game.stats.totalShapes}<br>
        Shapes per Click: ${game.variables.shapesPerClick}<br>
        Ticks per Click: ${game.variables.ticksPerClick}<br>
        Efficiency: ${game.variables.efficiency}<br>
        Booster Multi: ${Math.pow(2,game.variables.booster)}x`
    }
    game.stats.statsOpen = !game.stats.statsOpen;
}

function toggleHelp() {
    if (game.stats.helpOpen) {
        document.getElementById("help-text").innerHTML = "";
    } else {
        document.getElementById("help-text").innerHTML = `
        To get shapes, press the "generate shapes" button.<br>
        Once you have 10 shapes, you can increase the amount of shapes per click by 1.<br>
        This will remove 10 shapes, and the cost of buying it again will double.<br><br>
        
        Efficiency increases your shape gain by 1 for each point you have.<br>
        Ticks increase your shape gain by increasing the amount of times that your shapes are calculated per click.<br><br>
        
        Once you reach 10,000 shapes, you may gain prestige and gain Gilded Shapes based on the amount of shapes you have. (Formula: log(shapes^1.1) - 4)<br>
        Each Gilded Shape gives you 50% of your shapes per click.<br><br>
        
        After reaching 10 Gilded Shapes, the Altar is unlocked. There, you may convert Gilded Shapes into Astral Shapes, and allocate them to Spells.<br>
        Spells have various insanely positive effects based on the amount of Astral Shapes that are allocated to it.<br>
        `
    }
    game.stats.helpOpen = !game.stats.helpOpen;
}

function toggleAltar() {
    if (game.resources.gildedShapes >= 10) game.altar.altarUnlocked = true;
    if (!(game.altar.altarUnlocked)) {
        document.getElementById("altar-button").innerHTML = "Altar (requires 10 Gilded Shapes)";
        alert("You need 10 Gilded Shapes to access the Altar!");
        return;
    }

    document.getElementById("altar-button").innerHTML = "Altar"
    if (game.altar.altarOpen) {
        game.altar.altarDiv.style.display = 'none';
        game.mainDiv.style.display = 'block';
        document.body.style.backgroundColor = '#1b1e23';
    } else {
        game.altar.altarDiv.style.display = 'block';
        game.mainDiv.style.display = 'none';
        document.body.style.backgroundColor = '#25003a';
    }
    game.altar.altarOpen = !game.altar.altarOpen;
}

function convertShapes(type) {
    let amount = +prompt("How many shapes to convert?")
    if (!(typeof amount === "number")) return;

    if (type === "astral") {
        if (game.resources.astralShapes < amount) {
            alert("Not enough Astral Shapes!")
            return;
        } else {
            game.resources.astralShapes -= amount;
            game.altar.astralShapesAvailable -= amount;
            game.resources.gildedShapes += amount;
        }
    } else if (type === "gilded") {
        if (game.resources.gildedShapes < amount) {
            alert("Not enough Gilded Shapes!")
            return;
        } else {
            game.resources.gildedShapes -= amount;
            game.altar.astralShapesAvailable += amount;
            game.resources.astralShapes += amount;
        }
    } else return;
    updateShapeText();
}

function allocateAstralShapes(spell) {
    let spellName = game.altar.spells[spell];
    let amount = +prompt("How many Astral Shapes to allocate in the spell?")
    if (!(typeof amount === "number") || amount === 0) return;

    game.altar.totalAstralAllocated = 0;
    for (let i of game.altar.astralShapesAllocated) {
        game.altar.totalAstralAllocated += i;
    }
    game.altar.astralShapesAvailable = game.resources.astralShapes - game.altar.totalAstralAllocated;

    if (amount > game.altar.astralShapesAvailable) {
        alert("Not enough Astral Shapes available!")
        return;
    }
    game.altar.astralShapesAllocated[spell] += amount;
    game.altar.astralShapesAvailable -= amount;

    switch (spell) {
        case 0:
            game.prestige.gildedShapesBoostPercent = amount * 5 + 100;
            break;
        case 1:
            game.prestige.gildedShapesGainPercent = amount * 3 + 100;
            break;
    }
    alert(`Allocated ${amount} Astral Shapes to spell ${spellName}!`);
    updateShapeText();
}

function hardReset() {
    if (!(confirm("Are you sure you want to hard reset?"))) return;
    if (!(confirm("This will erase EVERYTHING! Are you really sure?"))) return;
    for (let i in game) {
        game.i = gameReset.i
    }
    updateShapeText();
    alert("Reset your game!");
}
