let rows = 0;
let buttonid = 0;
let selected = -1;
let CURRENTMENU = "NONE"
let currentBill
let currentBillPrice

// Dialog
let cancelFunction = "hideOverlay()"

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

let COLD_REG = ["330ml Can", "500ml Bottle", "Energy Drink", "Fuze Iced Tea", "Ice Cream Spider"]
let COLD_PRICE = [220, 330, 240, 320, 410]

let COLD_SHAKE = ["Banana Shake", "Choc Shake", "Strawberry Shake", "Vanilla Shake", "Banana Frappé", "Choc Frappé", "Strawberry Frappé", "Vanilla Frappé"]
let COLD_SHAKE_PRICE = [380, 380, 380, 350, 650, 650, 650, 620]

let BF_YOUNG = ["Bacon Egg Toast", "Toasted S/W", "Pancakes", "Waffles Meal", "Hash Brown Meal"]
let BF_YOUNG_PRICE = [580, 450, 750, 800, 500]

let BF_BURGER = ["Cheese Burger", "Veggie Burger", "B.E.C. Floppy", "S.E.C. Floppy", "B.E.C. Muffin"]
let BF_BURGER_PRICE = [400, 430, 480, 480, 600]

let BF_DRINK = ["Brekkie Hot Choc", "Iced Coffee", "Fluffy Milk Shot"];
let BF_DRINK_PRICE = [200, 520, 150];

let LUNCH = ["Cheesy Bacon Burger", "Display Item", "Eggs Benedict", "Fries, Scoop of", "Wedges, Scoop of", "Nacho Meal"]
let LUNCH_PRICE = [600, -1, 1500, 280, 320, 1200]

let DESSERT_MODS = ["Strawberry Jam", "Apricot Jam", "Raspberry Jam", "&empty;"]
let LUNCH_MODS = ["Xtra Salt", "Tomato Slices", "Egg", "Custard", "Bacon Strip", "Cheese", "Mushrooms", "Maple Syrup", "Whipped Cream"]
let LUNCH_MODS_2 = ["Xtra", "Less", "Remove", "Only", "Lettuce, Shredded", "Lettuce Leaves"]
let LUNCH_MODS_PRICE = [5, 10, 25, 10, 40, 30, 50, 15, 20, 30]
let LUNCH_MODS_2_PRICE = [null, null, null, 25]

let DESSERT = ["Banana Split", "Choc Sundae", "Fruit Salad Custard", "Snow Freeze", "Tartlets"]
let DESSERT_PRICE = [1600, 900, 550, 150, 550]

let firstTick = true;

let CAFE = ["Cappuccino", "Flat White", "Hot Chocolate", "Latte", "Mocha", "Long Black"]
let CAFE_PRICE = [450, 480, 250, 450, 450, 420]

let LUNCH_BURGER = ["Cheeseburger", "BLT Burger", "BLT Supreme", "<i>Cor impetum</i> Burger", "Salad Burger"]
let LUNCH_BURGER_PRICE = [BF_BURGER_PRICE[0], 500, 600, 580, 710, 580]

let TEA = ["Black Tea", "Chai Latte", "Dilmah Tea"]
let TEA_PRICE = [390, 440, 410]

let SIZE = ["Medium Cup Upgrade", "Large Cup Upgrade", "Small Go‑Cup", "Medium Go‑Cup", "Large Go‑Cup"]
let SIZE_PRICE = [50, 100, 20, 80, 130]

let MODS = ["Choc Powder", "Cinn Powder", "Modify Above", "Caramel Syrup Shot", "Hazelnut Syrup Shot", "Xtra Cream", "Warm, Serve as", "Xtra Hot, Serve as"]
let MODS_PRICE = [10, 10, 0, 60, 60, 0, 0, 0]
let MODS_SUGAR = ["1 Sugar", "2 Sugars", "3 Sugars", "4 Sugars", "No Sugar"]
let MODS_MILK = ["Dairy Milk", "No Milk", "Almond Milk", "Coconut Milk", "Soy Milk", "Trim Milk"]

let DISCOUNT = ["10 Loyalty pts.", "50 Loyalty pts.", "100 Loyalty pts.", "250 Loyalty pts.", "Half-price Item", "Free Item"]
let DISCOUNT_PRICE = [-10, -50, -100, -250, null, null];

function plog(object) {
	console.log(object);
	document.getElementById("log").innerHTML = `${object}`;
}

function initialize() {

	document.getElementById("selectMenu").onchange = function () {
		eval(`${document.getElementById("selectMenu").value}`);
	}
	showColdDrinks();
	newRow();
	initialize = null;
}


document.addEventListener("dblclick", (event) => {
	event.preventDefault();
	plog(event);
	
	if (event.srcElement.nodeName == "TD") {
		event.srcElement.innerHTML = "&empty;"; // Set item to empty set symbol
		document.getElementById(`price${parseInt(event.srcElement.id)}`).innerHTML = "&mdash;"; // Set price to em dash
		updatePrice(); // Keep total relevant
	}
});

document.addEventListener("contextmenu", (event) => {
	event.preventDefault();
	plog(event);
	
	if (event.srcElement.nodeName == "TD") {
		event.srcElement.innerHTML = "&empty;"; // Set item to empty set symbol
		document.getElementById(`price${parseInt(event.srcElement.id)}`).innerHTML = "&mdash;"; // Set price to em dash
		updatePrice(); // Keep total relevant
	}
});

// Shows the lastest result from the console at the bottom of the screen
document.addEventListener("contextmenu", (event) => {
	event.preventDefault();
	plog(event);

 	if (event.srcElement.className == "CATBTN" && event.srcElement.innerHTML == "∅") {
		simplePrompt("Debug mode activated");
		document.getElementById("log").style.display = "block";
	}
})

// Get time
async function getTime() {
	let d = new Date().toLocaleString('en-US', {
		timeZone: 'Pacific/Auckland'
	});
	document.getElementById("time").innerHTML = d;
	
}
setInterval(getTime, 1000);


// Menu functions

// COLD DRINKS & SHAKES
function showColdDrinks() {
	CURRENTMENU = "COLD";

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
	CURRENTMENU = "HOT";

	clearItemLines();
	let line1 = document.getElementById("ITEMLINE1")
	let line2 = document.getElementById("ITEMLINE2")
	let line3 = document.getElementById("ITEMLINE3")

	// 1st line: Coffees
	// 2nd line: Teas
	// 3rd line Prices
	createLineButtons(CAFE, CAFE_PRICE, line1);
	createLineButtons(TEA, TEA_PRICE, line2);
	createLineButtons(SIZE, SIZE_PRICE, line3);
}

// BREAKFAST
function showBreakfast() {
	CURRENTMENU = "BREAKFAST";

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
	CURRENTMENU = "LUNCH";

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
	CURRENTMENU = "LMODS";

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
	CURRENTMENU = "MOD";

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
	CURRENTMENU = "PROMO";

	clearItemLines();
	let line1 = document.getElementById("ITEMLINE1");
	let line2 = document.getElementById("ITEMLINE2");
	let line3 = document.getElementById("ITEMLINE3");

	createLineButtons(DISCOUNT, DISCOUNT_PRICE, line1);
}

// SB buttons begin

// New Row
function newRow(that) {
	if (rows > 7) {
		newRow = function () { simplePrompt("Too many rows") };
		return;
	}

	tbody = document.getElementById("TBODY");
	tr = document.createElement("tr");
	tr.id = `ROW_${rows}`;
	tbody.appendChild(tr);

	tnewRow = document.getElementById(`ROW_${rows}`);

	a = document.createElement("td");
	b = document.createElement("td");
	c = document.createElement("td");
	d = document.createElement("td");

	let eles = [a, b, c, d];
	for (let i = 0; i < eles.length; i++) {
		eles[i].innerHTML = "&empty;"
		eles[i].onclick = function() { // Creates selection code four times
			// Disable selecting on tender screen
			if (document.getElementById("showOnTender").style.display == "block") return;

			// Reset the style of the other selected button
			document.getElementById(selected).removeAttribute("style");
			resetBorder(document.getElementById(selected));

			// Style the current button
			selected = parseInt(this.id);
			plog(`Selected ${selected}`)
			this.style.backgroundColor = "yellow";
			selectBorder(this);
		}
		eles[i].id = `${buttonid}`;
		eles[i].className = "slot";
		buttonid++;
		tnewRow.appendChild(eles[i]);
	}

	// Create prices
	itemPrice = document.createElement("td");
	modPrice = document.createElement("td");
	modPrice2 = document.createElement("td");
	modPrice3 = document.createElement("td");

	itemPrice.innerHTML = "—"
	modPrice.innerHTML = "—"
	modPrice2.innerHTML = "—"
	modPrice3.innerHTML = "—"

	// Limit height
	itemPrice.style = "height: 15px;"
	modPrice.style = "height: 15px;"
	modPrice2.style = "height: 15px;"
	modPrice3.style = "height: 15px;"

	tr = document.createElement("tr");
	tr.id = `PRICE_ROW_${rows}`;
	tbody.appendChild(tr);

	itemPrice.id = `price${buttonid-4}`;
	modPrice.id = `price${buttonid-3}`;
	modPrice2.id = `price${buttonid-2}`;
	modPrice3.id = `price${buttonid-1}`;

	// Add
	tr.append(itemPrice);
	tr.append(modPrice);
	tr.append(modPrice2);
	tr.append(modPrice3);


	rows = rows + 1;

	// Auto-select first block

	let sel = document.getElementById(selected);
	if (sel) {
		sel.style.backgroundColor = "white";
		resetBorder(sel);
	}
	selected = buttonid - 4;
	document.getElementById(selected).style.backgroundColor = "yellow";
	selectBorder(document.getElementById(selected));

}

// Clear selected item is not listed here

// Verify status
function checkStatus() {
	let table = document.getElementById("tn").innerHTML

	promptBox("Eat-In or Take Away?", ["Eat In", "Take Away"], 
					  ["tableNumber();", "document.getElementById('tn').innerHTML = 'Take Away'; hideOverlay(); showTender()"],
					  null, null, null, false);
}

// Finish order
function showTender() {
	updatePrice();

	document.getElementById(selected).style.backgroundColor = "white";
	resetBorder(document.getElementById(selected));

	document.getElementById("hideOnTender").style.display = "none"
	document.getElementById("showOnTender").style.display = "block"
	document.getElementById("ct").innerHTML = updatePrice();

	updateRemaining();
	plog("Displaying tender screen");
}

// Insert custom price
function customPrice() {
	btnSel = document.getElementById(selected); // Selected button
	btnPrc = document.getElementById(`price${selected}`); // Selected button's price

	let newPrice = parseInt(document.getElementById("numerical-input").innerHTML);
	if (!isNaN(newPrice) && newPrice) {
		if (newPrice >= 0) {
			newPrice = CURRENCY_FORMATTER.format(newPrice / 100)

			btnSel.innerHTML = `Premium, inserted`;
			btnPrc.innerHTML = `${newPrice}`;
		} else {
			newPrice = CURRENCY_FORMATTER.format(newPrice / 100)

			btnSel.innerHTML = `Discount, inserted`;
			btnPrc.innerHTML = `${newPrice}`;
		}

	}
	updatePrice();
}

// Reset order
function resetOrder() {
	promptBox("Are you sure you want to clear the bill?", ["Yes"], ["location.reload(); hideOverlay()"])
}

// Tender screen functions begin

// Table number
function tableNumber() {
	numericalPrompt("Input a number below", "document.getElementById('tn').innerHTML = \`Dine In &mdash; ${parseInt(document.getElementById('numerical-input').innerHTML)}\`; showTender()", "Table number locator");
}

// Single bill
function splitBillOnce() {
	// Select first bill
	selectBill(document.getElementById("bill1"));

	//Show bill and hide others
	document.getElementById("bill1").style.display = "table-cell"
	document.getElementById("bill2").style.display = "none"
	document.getElementById("bill3").style.display = "none"

	let total = Number(document.getElementById("ct").innerHTML.replace(/[^0-9\.-]+/g, ""));

	document.getElementById("bill1Price").innerHTML = CURRENCY_FORMATTER.format(total);
	document.getElementById("bill2Price").innerHTML = "0"
	document.getElementById("bill3Price").innerHTML = "0"

	updateRemaining();
}

// Two bills
function splitBillTwice() {
	// Select second bill
	selectBill(document.getElementById("bill2"));

	//Show bills and hide third
	document.getElementById("bill1").style.display = "table-cell"
	document.getElementById("bill2").style.display = "table-cell"
	document.getElementById("bill3").style.display = "none"

	let total = Number(document.getElementById("ct").innerHTML.replace(/[^0-9\.-]+/g, ""));

	document.getElementById("bill1Price").innerHTML = CURRENCY_FORMATTER.format(total / 2);
	document.getElementById("bill2Price").innerHTML = CURRENCY_FORMATTER.format(total / 2);

	updateRemaining();
}

// Split thrice
function splitBillThrice() {
	// Select second bill (even though there are three, it's better to go in the middle)
	selectBill(document.getElementById("bill2"));

	updateRemaining();
	//Show bills
	document.getElementById("bill1").style.display = "table-cell"
	document.getElementById("bill2").style.display = "table-cell"
	document.getElementById("bill3").style.display = "table-cell"

	// Total
	let total = Number(document.getElementById("ct").innerHTML.replace(/[^0-9\.-]+/g, ""));

	document.getElementById("bill1Price").innerHTML = CURRENCY_FORMATTER.format(total / 3);
	document.getElementById("bill2Price").innerHTML = CURRENCY_FORMATTER.format(total / 3);
	document.getElementById("bill3Price").innerHTML = CURRENCY_FORMATTER.format(total / 3);

	updateRemaining();
}

// Complete selected bill
function completeBill() {
	if (currentBill) {
		currentBill.style.backgroundColor = "chartreuse";
		currentBillPrice.innerHTML = "$0.00"
	}
	updateRemaining();
}

// Reset bills
function resetBills() {
	let bill1 = document.getElementById("bill1");
	let bill2 = document.getElementById("bill2");
	let bill3 = document.getElementById("bill3");

	bill1.style.backgroundColor = "white";
	bill2.style.backgroundColor = "white";
	bill3.style.backgroundColor = "white";

	currentBill = bill1;
	bill1.style.backgroundColor = "yellow";
	splitBillThrice();

	plog("Bills have been reset");
}

// Return to menu screen
function returnOrder() {
	document.getElementById(selected).style.backgroundColor = "yellow";
	selectBorder(document.getElementById(selected)); // Retrieve styling for selected button

	document.getElementById("hideOnTender").style.display = "block"
	document.getElementById("showOnTender").style.display = "none"
}

// Background functions begin

// Add selected items from the menu into the selected product slot
function addSelect(object, price, special) {

	if (object.includes("Energy Drink")) {
		if(!special) {
			promptBox("Please confirm consumer is over 16", ["Yes"], [`addSelect('Energy Drink', ${price}, true); hideOverlay();`]);
			return;
		}
	}

	if (price) {
		if (price >= 0) {
			let priceDatum = document.getElementById(`price${selected}`)
			priceDatum.innerHTML = `${CURRENCY_FORMATTER.format(price/100)}`;
		} else {
			let priceDatum = document.getElementById(`price${selected}`)
			priceDatum.innerHTML = `${CURRENCY_FORMATTER.format(price/100)}`;
		}
	} else { // No price listed or it's listed as 0
		let priceDatum = document.getElementById(`price${selected}`)
		if (priceDatum) priceDatum.innerHTML = `&mdash;`;
	}



	let currentButton = document.getElementById(selected);
	currentButton.innerHTML = object;

	// Next button
	let nextButton = document.getElementById(selected + 1);
	if (nextButton) {
		currentButton.style.backgroundColor = "white";
		resetBorder(currentButton);
		nextButton.style.backgroundColor = "yellow";
		selectBorder(nextButton);
		selected++;
	}
	
	// Add café suggestions
	if(CURRENTMENU == "HOT") simplePrompt("Prompt for milk and sugar where applicable", "Helpful tip");
	
	// Modifiers from coffee
	if (CURRENTMENU == "HOT") {
		document.getElementById("selectMenu").value="showModMenu()";
		showModMenu(document.getElementById("MODBTN"));
	}

	updatePrice();
}

// Resets item lines upon opening a new menu
function clearItemLines() {
	let line1 = document.getElementById("ITEMLINE1");
	let line2 = document.getElementById("ITEMLINE2");
	let line3 = document.getElementById("ITEMLINE3");

	line1.innerHTML = ""
	line2.innerHTML = ""
	line3.innerHTML = ""
	plog("Cleared item lines whilst changing to a menu")
}

// Runs pretty much every time something happens to keep the total relevant
function updatePrice() {
	let total = 0;
	let priceBlocks = document.getElementsByTagName("td");
	for (let i = 0; i < priceBlocks.length; i++) {
		if (priceBlocks[i].id.includes("price")) {
			let p = parseInt(100 * parseFloat(priceBlocks[i].innerHTML.replaceAll("$", "")));
			if (!isNaN(p)) { // Prevents priceless items from breaking total
				total += p;
				plog([i, p, total])
			}
		}
		
		// Remove the extra item charge for "Remove" and "Less/Fewer" mods
		if(priceBlocks[i].innerHTML == "Only"
			|| priceBlocks[i].innerHTML == "Less"
			|| priceBlocks[i].innerHTML == "Fewer"
			|| priceBlocks[i].innerHTML == "Remove") {
		
			let thisSlot = priceBlocks[i];
			let nextSlot = document.getElementById(`${parseInt(priceBlocks[i].id)+1}`);
				
			let thisPrice = document.getElementById(`price${parseInt(priceBlocks[i].id)}`);
			let nextPrice = document.getElementById(`price${parseInt(priceBlocks[i].id)+1}`);
			
			if(nextPrice) {
				
				let p = parseInt(-100 * parseFloat(nextPrice.innerHTML.replaceAll("$", "")));

				if (!isNaN(p)) {
					thisPrice.innerHTML = CURRENCY_FORMATTER.format(p / 100);
				}
			
				// Clear reduction if next item is removed or free	
				if(nextPrice.innerHTML == "—") { thisPrice.innerHTML="&mdash;"; return };
				
				// Time to nerd out
				if(thisSlot.innerHTML == "Less" || priceBlocks[i].innerHTML == "Fewer") {
					if(nextSlot.innerHTML.endsWith("s")) {
						thisSlot.innerHTML = "Fewer";
					} else thisSlot.innerHTML = "Less";
				}
			}
		}
		
		// Free item
		else if(priceBlocks[i].innerHTML == "Free Item") {
				
			let thisPrice = document.getElementById(`price${parseInt(priceBlocks[i].id)}`);
			let nextPrice = document.getElementById(`price${parseInt(priceBlocks[i].id)+1}`);
			
			if(nextPrice) {	
				let p = parseInt(-100 * parseFloat(nextPrice.innerHTML.replaceAll("$", "")));

				if (!isNaN(p)) {
					thisPrice.innerHTML = CURRENCY_FORMATTER.format(p / 100);
				}
			
				// Clear reduction if next item is removed or free	
				if(nextPrice.innerHTML == "—") { thisPrice.innerHTML="&mdash;"; return };
			}
		}
		
		// Half-priced item
		else if(priceBlocks[i].innerHTML == "Half-price Item") {
				
			let thisPrice = document.getElementById(`price${parseInt(priceBlocks[i].id)}`);
			let nextPrice = document.getElementById(`price${parseInt(priceBlocks[i].id)+1}`);
			
			if(nextPrice) {	
				let p = parseInt(-50 * parseFloat(nextPrice.innerHTML.replaceAll("$", "")));

				if (!isNaN(p)) {
					thisPrice.innerHTML = CURRENCY_FORMATTER.format(p / 100);
				}
			
				// Clear reduction if next item is removed or free	
				if(nextPrice.innerHTML == "—") { thisPrice.innerHTML="&mdash;"; return };
			}
		}
		
	}

	document.getElementById("totalSpan").innerHTML = CURRENCY_FORMATTER.format(total / 100)
	return CURRENCY_FORMATTER.format(total / 100)
}

// Executes open opening a menu, creates all the product buttons.
function createLineButtons(PRODUCT_ARRAY, PRICE_ARRAY, line) {
	for (let i = 0; i < PRODUCT_ARRAY.length; i++) {
		if (PRICE_ARRAY) {
			if (PRICE_ARRAY[i]) {
				line.innerHTML += `<button style=\"margin-left: -1px; margin-right: 5px\" onclick=\"addSelect(this.innerHTML, ${PRICE_ARRAY[i]})\" oncontextmenu=\"simplePrompt(\`<i>${PRODUCT_ARRAY[i]}</i><br>Cost: ${PRICE_ARRAY[i]}\`, \`Item information\`)\" class=\"CATBTN\">${PRODUCT_ARRAY[i]}</button>`;
			} else {
				line.innerHTML += `<button style=\"margin-left: -1px; margin-right: 5px\" onclick=\"addSelect(this.innerHTML)\" class=\"CATBTN\">${PRODUCT_ARRAY[i]}</button>`;
			}
		} else {
			line.innerHTML += `<button style=\"margin-left: -1px; margin-right: 5px\" onclick=\"addSelect(this.innerHTML)\" class=\"CATBTN\">${PRODUCT_ARRAY[i]}</button>`;
		}
	}
	line.innerHTML += `<hr style="margin:1px;padding:0px">`;
}

// Used in the final stages of ordering
function updateRemaining() {
	let remain = document.getElementById("tr");
	let updateTotal = 0;

	let bill1Price = document.getElementById("bill1");
	let bill2Price = document.getElementById("bill2");
	let bill3Price = document.getElementById("bill3");

	if (bill1.style.display == "table-cell") updateTotal += Number(document.getElementById("bill1Price").innerHTML.replace(/[^0-9\.-]+/g, ""));
	if (bill2.style.display == "table-cell") updateTotal += Number(document.getElementById("bill2Price").innerHTML.replace(/[^0-9\.-]+/g, ""));
	if (bill3.style.display == "table-cell") updateTotal += Number(document.getElementById("bill3Price").innerHTML.replace(/[^0-9\.-]+/g, ""));

	remain.innerHTML = CURRENCY_FORMATTER.format(updateTotal);
}

// Bill go clicky-clicky
function selectBill(that) {

	// Skip if complete
	if (that.style.backgroundColor == "chartreuse") return false;

	if (currentBill) {
		if (currentBill.style.backgroundColor == "yellow") {
			currentBill.style.backgroundColor = "white";
		}
	}
	currentBill = that;
	currentBill.style.backgroundColor = "yellow";
	currentBillPrice = document.getElementById(`${currentBill.id}Price`);
	plog(currentBillPrice);
}

// These are self-explanatory
function resetBorder(element) {
	element.style.border = ""; // Clear all
	element.style.borderRight = "1px solid gray";
	element.style.borderBottom = "1px solid gray";
	
	let price = document.getElementById(`price${element.id}`);
	if(price) {
		price.style.border = ""; // Clear all
		price.style.borderRight = "1px solid gray";
		price.style.borderBottom = "1px solid gray";
		price.style.backgroundColor = "white"
	}
}

function selectBorder(element) {
	element.style.border = "1px dotted gray";
	element.style.borderBottom = "1px dashed gray";
	let price = document.getElementById(`price${element.id}`);
	if(price) {
		price.style.border = "1px dotted gray";
		price.style.borderTop = "1px dashed gray";
		price.style.backgroundColor = "yellow"
	}
}

// Returns the relative cell on the bill. Slot 0 returns 1, Slot 3 returns 4; so do Slot 4 and Slot 7.
function getRelativeCell() {
	return((selected % 4) + 1);
}

// Simplified form of promptBox
function simplePrompt(dialogText, dialogTitle) {

	// Reset title, text and button
	let title = document.getElementById("dialog-title");
	let text = document.getElementById("dialog-text");
	let cancel = document.getElementById("dialog-cancel");
	let buttons = document.getElementById("dialog-buttons");

	document.getElementById("numerical-buttons").style.display="none";

	// Clear
	buttons.innerHTML = "";

	// Reset cancel button
	cancel.innerHTML = "Close";
	cancelFunction = `hideOverlay()` 
	
	// Grab variables
	title.innerHTML = dialogTitle ? dialogTitle : "prePOS dialog title";
	text.innerHTML = dialogText ? dialogText : "prePOS dialog description";
		
	// Show prompt box
	document.getElementById("overlay").removeAttribute("style");

}

function addNumerical(button) {
	document.getElementById("numerical-input").innerHTML += button.innerHTML;
}

// Numerical prompt

function numericalPrompt(dialogText, dialogFunc, dialogTitle) {

	// Reset title, text and button
	let title = document.getElementById("dialog-title");
	let text = document.getElementById("dialog-text");
	let cancel = document.getElementById("dialog-cancel");
	let buttons = document.getElementById("dialog-buttons");
	
	// Clear
	buttons.innerHTML = "";
	document.getElementById("numerical-input").innerHTML = "";
	
	// Reset cancel button
	cancel.innerHTML = "Done";
	cancelFunction = `hideOverlay()` 
	
	// Grab variables
	title.innerHTML = dialogTitle ? dialogTitle : "prePOS dialog title";
	text.innerHTML = dialogText ? dialogText : "prePOS dialog description";
	cancelFunction = dialogFunc ? `${dialogFunc}; hideOverlay()` : `hideOverlay()` 

	// Show prompt
	document.getElementById("numerical-buttons").removeAttribute("style");
	document.getElementById("overlay").removeAttribute("style");
}

// Information messages
function promptBox(dialogText, dialogBts, dialogFunc, cancelText, cancelFunc, dialogTitle, closeAfter) {

	// Reset title, text and button
	let title = document.getElementById("dialog-title");
	let text = document.getElementById("dialog-text");
	let cancel = document.getElementById("dialog-cancel");
	let buttons = document.getElementById("dialog-buttons");

	document.getElementById("numerical-buttons").style.display="none";

	// Grab basic variables, fallback if not provided
		title.innerHTML = dialogTitle ? dialogTitle : "prePOS dialog title";
		text.innerHTML = dialogText ? dialogText : "prePOS dialog description";
		cancel.innerHTML = cancelText ? cancelText : "Close";

			// Set cancel function
			cancelFunction = cancelFunc ? `${cancelFunc}; hideOverlay()` : `hideOverlay()` 

	// Add dialogBts
	if(dialogBts) {
		if(!dialogFunc) {
			simplePrompt(`dialogBts exists, but dialogFunc does not <br>--- Debug ---
										<br>Title: ${title.innerHTML}
										<br>Text: ${text.innerHTML}
										<br>Custom buttons: ${dialogBts}
										<br>Custom functions: ${dialogFunc}
										<br>Cancel button: ${cancel.innerHTML}
										<br>Cancel function: ${cancelFunction}`,"Error");
			return;
		} else {

			// Clear
			buttons.innerHTML = "";

			// Add buttons
			for(let i = 0; i < dialogBts.length; i++) {
			
				let currentBtn = document.createElement("button");
				currentBtn.id=`dialogBtn_${i}`;
				currentBtn.className = "sb";
				currentBtn.innerHTML = dialogBts[i];
				currentBtn.style.marginLeft = "4px";
				if(dialogFunc[i]) {
					// closeAfter controls the persistence of the menu.
					// It should be set to false if the intent is to open another dialog.
					if(closeAfter) {
						currentBtn.addEventListener("click", function () { eval(dialogFunc[i]); hideOverlay(); });
					} else {
						currentBtn.addEventListener("click", function () { eval(dialogFunc[i]); });
					}
					buttons.appendChild(currentBtn);
				} else {
					simplePrompt(`Null value found at position ${i} in dialogFunc`, "Error");
				}
			}

		}

	}
		
	console.log(title.innerHTML, text.innerHTML, cancel.innerHTML, cancelFunction);




	// Show prompt box
	document.getElementById("overlay").removeAttribute("style");
}

// Hides overlay for information messages
function hideOverlay() {
	document.getElementById("overlay").style.display = "none";
}

/*

Menu Function Template

function showExampleMenu(that) {
	CURRENTMENU = "MENU NAME"
	clearItemLines();
	
	let line1= document.getElementById("ITEMLINE1");
	let line2= document.getElementById("ITEMLINE2");
	let line3= document.getElementById("ITEMLINE3");

	try { LASTBUTTON.style.fontStyle="" } catch (e) {}
	LASTBUTTON = that;
	that.style.fontStyle="italic";
	
	for(let i =0;i<MENU BAR 1.length;i++) { createLineButton(MENU BAR 1[i], MENU BAR 1 PRICE[i], line1); }
	for(let i =0;i<MENU BAR 2.length;i++) { createLineButton(MENU BAR 2[i], MENU BAR 2 PRICE[i], line2); }
	for(let i =0;i<MENU BAR 3.length;i++) { createLineButton(MENU BAR 3[i], MENU BAR 3 PRICE[i], line3); }
}

Change "showExampleMenu" to be relevant, and apply it to the onclick of the button.
Change "MENU NAME" and "Sentence Case Menu Name" to their respective names.
Change MENU BAR 1, 2, 3 to the arrays containing those lines.
You do not need to use all three.

*/

// Deprecated -- replaced by completeBill().
//
// function markBillFree() {
//	if(currentBillPrice) {
//		currentBillPrice.innerHTML="NZ$0.00";
//	}
//	updateRemaining();
//}

// Deprecated.
// function help() {
//	promptBox("Use CATBTNs to change menu; click an item to put it in the selected slot (yellow).\nPress + to add a new item row.\nItems from HOT DRINKS menu open MODIFY menu if selected.\nOnce finished, open the tender screen, create the bills, and input each tender price into the terminal.\nPress Complete Selected Bill and repeat until the total remaining is $0.00, and the order has been fully paid.\nFinally, return to the order screen and reset the order.") 
//}
