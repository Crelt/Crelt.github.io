// Menu functions

// COLD DRINKS & SHAKES
function showColdDrinks() {
	setMenuName("COLD");

	clearItemLines();
	let line1 = document.getElementById("ITEMLINE1");
	let line2 = document.getElementById("ITEMLINE2");
	let line3 = document.getElementById("ITEMLINE3");

	createLineButtons(COLD_REG, COLD_PRICE, line1);
	createLineButtons(COLD_SHAKE, COLD_SHAKE_PRICE, line2);
	createLineButtons(SIZE, SIZE_PRICE, line3);
}

// CAFÉ DRINKS
function showHotDrinks() {
	setMenuName("HOT");

	clearItemLines();
	let line1 = document.getElementById("ITEMLINE1");
	let line2 = document.getElementById("ITEMLINE2");
	let line3 = document.getElementById("ITEMLINE3");

	// 1st line: Coffees
	// 2nd line: Teas
	// 3rd line Prices
	createLineButtons(CAFE, CAFE_PRICE, line1);
	createLineButtons(TEA, TEA_PRICE, line2);
	createLineButtons(SIZE, SIZE_PRICE, line3);
}

// BREAKFAST
function showBreakfast() {
	setMenuName("BREAKFAST");

	clearItemLines();
	let line1 = document.getElementById("ITEMLINE1");
	let line2 = document.getElementById("ITEMLINE2");
	let line3 = document.getElementById("ITEMLINE3");

	createLineButtons(BF_YOUNG, BF_YOUNG_PRICE, line1);
	createLineButtons(BF_BURGER, BF_BURGER_PRICE, line2);
	createLineButtons(BF_DRINK, BF_DRINK_PRICE, line3);
}

// LUNCH & DESSERTS
function showLunchMenu() {
	setMenuName("LUNCH");

	clearItemLines();
	let line1 = document.getElementById("ITEMLINE1");
	let line2 = document.getElementById("ITEMLINE2");
	let line3 = document.getElementById("ITEMLINE3");

	createLineButtons(LUNCH, LUNCH_PRICE, line1);
	createLineButtons(LUNCH_BURGER, LUNCH_BURGER_PRICE, line2);
	createLineButtons(DESSERT, DESSERT_PRICE, line3);	
}

// LUNCH MODIFY
function showLunchMods() {
	setMenuName("LMODS");

	clearItemLines();
	let line1 = document.getElementById("ITEMLINE1");
	let line2 = document.getElementById("ITEMLINE2");
	let line3 = document.getElementById("ITEMLINE3");

	createLineButtons(DESSERT_MODS, null, line1);
	createLineButtons(LUNCH_MODS_2, LUNCH_MODS_2_PRICE, line2);
	createLineButtons(LUNCH_MODS, LUNCH_MODS_PRICE, line3);
}

// CAFÉ MODIFY
function showModMenu() {
	setMenuName("MOD");

	clearItemLines();
	let line1 = document.getElementById("ITEMLINE1");
	let line2 = document.getElementById("ITEMLINE2");
	let line3 = document.getElementById("ITEMLINE3");

	createLineButtons(MODS_MILK, null, line1);
	createLineButtons(MODS_SUGAR, null, line2);
	createLineButtons(MODS, MODS_PRICE, line3);
}

// PROMO MENU
function showMisc() {
	setMenuName("PROMO");

	clearItemLines();
	let line1 = document.getElementById("ITEMLINE1");
	let line2 = document.getElementById("ITEMLINE2");
	let line3 = document.getElementById("ITEMLINE3");

	createLineButtons(DISCOUNT, DISCOUNT_PRICE, line1);
	createLineButtons(COMBO, COMBO_PRICE, line2);
	createLineButtons(CLASSICS, CLASSICS_PRICE, line3);
}

function setMenuName(name) {
	CURRENTMENU = name;
	document.getElementById("CURRENTMENU").innerHTML = "Current Menu: " + CURRENTMENU;
}