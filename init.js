let game = {
    stats: {
        totalClicks: 0,
        totalShapes: 0,
        statsOpen: false,
        helpOpen: false,
    },
    resources: {
        shapes: 0,
    },
    variables: {
        shapesPerClick: 1,
        ticksPerClick: 1,
        efficiency: 0,
    },
    shop: {
        costs: [10, 100, 2_500, 100_000, 25_000_000, 1_000_000_000],
        costIncrease: 2,
    }
}

function increaseShapes () {
    const increment = Math.round(game.variables.shapesPerClick * game.variables.ticksPerClick * (1 + game.variables.efficiency / 10));
    game.resources.shapes += increment
    game.stats.totalClicks++;
    game.stats.totalShapes += increment;
    updateShapeText();
    return increment;
}

function updateShapeText() {
    document.getElementById("shapes-text").innerHTML = `Shapes: ${game.resources.shapes}`;
}

function buyShopItem(item) {
    if (game.resources.shapes < game.shop.costs[item]) return;
    game.resources.shapes -= game.shop.costs[item];
    game.shop.costs[item] *= game.shop.costIncrease;
    document.getElementById(`shop-${item}-cost`).innerHTML = `Cost: ${game.shop.costs[item]} shapes`;
    switch (item) {
        case 0:
            game.variables.shapesPerClick++;
            break;
        case 1:
            game.variables.efficiency++;
            break;
    }
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
        
        Efficiency increases your shape gain by 0.1 for each point of efficiency you have.<br>
        Ticks increase your shape gain by increasing the amount of times that your shapes are calculated per click.
        `
    }
    game.stats.helpOpen = !game.stats.helpOpen;
}
