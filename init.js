let game = {
    stats: {
        totalClicks: 0,
        totalShapes: 0,
        statsOpen: false,
        helpOpen: false,
    },
    resources: {
        shapes: 0,
        gildedShapes: 0,
    },
    variables: {
        shapesPerClick: 1,
        ticksPerClick: 1,
        efficiency: 0,
    },
    prestige: {
        prestigeMin: 10_000,
        prestigeIncrement: 100,
    },
    shop: {
        costs: [10, 100, 1_500, 100_000, 25_000_000, 1_000_000_000],
        isExpensiveCost: [false, true, false, undefined, undefined, undefined],
        costIncrease: 2,
        costIncreaseExpensive: 3,
    }
}
const gameReset = Object.assign({}, game);

function increaseShapes () {
    let increment = Math.round(game.variables.shapesPerClick * game.variables.ticksPerClick * (1 + game.variables.efficiency));
    increment += (game.resources.gildedShapes * game.variables.shapesPerClick);
    game.resources.shapes += increment
    game.stats.totalClicks++;
    game.stats.totalShapes += increment;
    updateShapeText();
}

function updateShapeText() {
    document.getElementById("shapes-text").innerHTML = `Shapes: ${game.resources.shapes}`;
}

function updateAllText() {
    updateShapeText();
    for (let i in game.shop.isExpensiveCost) {
        if (typeof i === "undefined") continue;
        document.getElementById(`shop-${i}-cost`).innerHTML = `Cost: ${game.shop.costs[i} shapes`;
    }
    document.getElementById("prestige-button").innerHTML = `Prestige (requires ${game.prestige.prestigeMin} shapes)`
}

function buyShopItem(item) {
    if (game.resources.shapes < game.shop.costs[item]) return;
    game.resources.shapes -= game.shop.costs[item];
    if (!(game.shop.isExpensiveCost[item] ?? false)) game.shop.costs[item] *= game.shop.costIncrease
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
    }
    updateShapeText();
}

function prestige() {
    if (game.resources.shapes < game.prestige.prestigeMin) {
        alert(`You need at least ${game.prestige.prestigeMin} shapes to prestige.`)
        return;
    }
    if (!(confirm("Are you sure you want to prestige?"))) return;
    game.resources.gildedShapes += +((Math.log10(game.resources.shapes) - 4).toFixed(2));
    game.resources.shapes = 0;
    game.variables.efficiency = 0;
    game.variables.shapesPerClick = 1;
    game.variables.ticksPerClick = 1;
    game.prestige.prestigeMin *= game.prestige.prestigeIncrement;
    game.shop.costs = [10, 100, 2_500, 100_000, 25_000_000, 1_000_000_000];
    document.getElementById("prestige-button").innerHTML = `Prestige (requires ${game.prestige.prestigeMin} shapes)`;
    updateShapeText();
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
        Efficiency: ${game.variables.efficiency}`
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
        Ticks increase your shape gain by increasing the amount of times that your shapes are calculated per click.
        `
    }
    game.stats.helpOpen = !game.stats.helpOpen;
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
