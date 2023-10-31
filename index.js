// October 31
var CURRENTVERSION = 1.10311;

// Only used on the terminal out screen

var OVERLAY_CAN_BE_HIDDEN = true;
var rows = 0;		// Rows on card
var buttonid = 0;	// Table datum ID
var selected = -1;	// Selected table datum
var CURRENTMENU = "NONE";
var MAXLENGTH = 0;	// Length of numerical input
var currentBill;	// Selected bill table datum
var currentBillPrice;	// And its pricei

// Dialog
let cancelFunction;

window.onerror = function (event) {
	simplePrompt(event);
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

function plog(object) {
	console.log(object);
	document.getElementById("log").innerHTML = `${object}`;
}

// Get time
let getTime = () => {
	let d = new Date().toLocaleString('en-US', {
		timeZone: 'Pacific/Auckland'
	});
	document.getElementById("time").innerHTML = d;
};

let initialize = () => {
	// VERSION
	document.title = `prePOS ${CURRENTVERSION} &ndash; `
	document.getElementById("version").innerHTML = `${CURRENTVERSION} &ndash; `;
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker && navigator.serviceWorker.register("./sw.js").catch( function () {
			simplePrompt("PREpos is lffoine")

			// offline
			document.title = `prePOS ${CURRENTVERSION} (offline) &ndash; Provision Package: ${PKG}`
			document.getElementById("version").innerHTML = `${CURRENTVERSION} (offline)`;
			document.getElementById("time").remove();
		});
	}
    
    showLunchMenu();
    
    // Hide overlay if click occurs outside of box
    document.getElementById("overlay").onclick = function (event) {
        if(event.target.id == "overlay") {
            if(OVERLAY_CAN_BE_HIDDEN) {
				hideOverlay();
			}
        }
    };

	newRow(true);
	initialize = null;
};

let selectMenu = () => {
	promptBox(null, ["Cold Drinks", "Café Drinks", "Breakfast Menu", "Lunch Menu", "Café Modifiers", "Lunch Modifiers"],
	["showColdDrinks()", "showHotDrinks()", "showBreakfast()", "showLunchMenu()", "showModMenu()", "showLunchMods()"],
      	"Promotions", "showMisc()", "Select menu", true);
}

document.onkeydown = function (e) {
	simplePrompt("Keyboard input is not supported")
	e.preventDefault();
}

// Selection of things
document.addEventListener("click", (event) => {
	let btn = event.target;

	// Isolate
	if(btn.id.includes("bill") || btn.id.includes("price")) return;

	if(btn.nodeName == "TD") {
		// Disable selecting on tender screen
		if (document.getElementById("showOnTender").style.display == "block") return;
	
		// Reset the style of the other selected button
		document.getElementById(selected).removeAttribute("style");
		resetBorder(document.getElementById(selected));

		// Style the current button
		selected = parseInt(btn.id);
		btn.style.backgroundColor = "yellow";
		selectBorder(btn);
	}
});

// Shows the latest result from the console at the bottom of the screen
document.addEventListener("contextmenu", (event) => {
	event.preventDefault();

 	if (event.target.className == "CATBTN" && event.target.innerHTML == "∅") {
		simplePrompt("Debug mode activated");
		document.getElementById("log").style.display = "block";
	}

	// Shorthand reference
	let btn = event.target;

	// Isolate
	if(btn.id.includes("bill") || btn.id.includes("price")) return;


	if(btn.nodeName == "TD") {
		// Disable selecting on tender screen
		if (document.getElementById("showOnTender").style.display == "block") return;
	
		// Reset the style of the other selected button
		document.getElementById(selected).removeAttribute("style");
		resetBorder(document.getElementById(selected));

		// Style the current button
		selected = parseInt(btn.id);
		btn.style.backgroundColor = "yellow";
		selectBorder(btn);
		
		// Clearance
		promptBox("Select clearance type", ["Hide price", "Insert promo marker"],
				[`document.getElementById("price${event.target.id}").innerHTML="&mdash;"; updateTotal();`, `document.getElementById("price${event.target.id}").innerHTML="PROMO"; updateTotal();`],
				"Remove item", `addSelect("&empty;")`,null,true)
	}
});

// SB buttons begin

// New Row
function newRow(bypass) {
	if(bypass != true) {
		if (rows > 7 && document.getElementById("TBODY").clientHeight+149 > document.getElementById("itemtable").clientHeight) {
			promptBox("An additional row may exceed the screen boundary. Would you like to still add it?<br><b>Note: Rows cannot be removed</b>", ["Yes"], ["document.getElementById('TBODY').scrollTop = scroll.scrollHeight; newRow(true)"], null, null, null, true);
			return;
		}
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
	let table = document.getElementById("tn").innerHTML;

	promptBox("Press Eat-In", null, null, "Eat In", 
					  "tableNumber();",
					  null, false);
}

// Finish order
function showTender() {
	updateTotal();

	document.getElementById(selected).style.backgroundColor = "white";
	resetBorder(document.getElementById(selected));

	document.getElementById("hideOnTender").style.display = "none"
	document.getElementById("showOnTender").style.display = "block"
	document.getElementById("ct").innerHTML = updateTotal();

	updateRemaining();
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
	updateTotal();
}

// Reset order
function resetOrder() {
	promptBox("Are you sure you want to clear the bill?", ["Yes"], ["location.reload(); hideOverlay()"])
}

// Tender screen functions begin

// Table number
async function tableNumber() {
	await delay(1); // This is also needed to display issuesf
	numericalPrompt("Input table locator", "document.getElementById('tn').innerHTML = \`Dine In &mdash; ${parseInt(document.getElementById('numerical-input').innerHTML)}\`; showTender()", 2);
}

// Single bill
function splitBillOnce() {
	// Select first bill
	selectBill(document.getElementById("bill1"));

	// Hide
	document.getElementById("splitBTN").style.display = "none";
	document.getElementById("tender-btn").removeAttribute("style");

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

	// Hide
	document.getElementById("splitBTN").style.display = "none";
	document.getElementById("tender-btn").removeAttribute("style");
	
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

	// Hide
	document.getElementById("splitBTN").style.display = "none";
	document.getElementById("tender-btn").removeAttribute("style");

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

// Thanks, Stack Overflow!
const delay = (delayInms) => {
	return new Promise(resolve => setTimeout(resolve, delayInms));
  };


async function terminalOut(accepted) {
	if(currentBill) {
		document.getElementById("modify-order").style.display = "none";
		document.getElementById("cancel-div").style.display = "none";
		OVERLAY_CAN_BE_HIDDEN = false;
	
		simplePrompt("Please Insert, Tap, or Swipe card");
		await delay(5000);

		simplePrompt("Awaiting connection");
		await delay(800);

		simplePrompt("Talking to bank");
		await delay(2000);

		simplePrompt("Talking to card issuer");
		await delay(1300);

		simplePrompt("Contacting sales");
		await delay(2000);


		simplePrompt("Requesting authorisation from Server");
		await delay(2000);

		let ISSUER = ["Visa", "Mastercard", "ANZ Visa", "AMEX", "Maestro"][Math.floor(Math.random()*5)];

		if (accepted) {
			simplePrompt(`The card issuer (${ISSUER}) has successfully processed the transaction.`)

			// Replace tender buttons with new order button
			document.getElementById("tender-btn").remove();

			document.getElementById("new-order").removeAttribute("style");

			OVERLAY_CAN_BE_HIDDEN = true;
			completeBill();
			document.getElementById("cancel-div").removeAttribute("style");
		} else {
			simplePrompt(`The card issuer (${ISSUER}) refused to process the transaction.`);
			currentBill.style.backgroundColor = "red";
			OVERLAY_CAN_BE_HIDDEN = true;

			// Reveal modify order and cancel button
			document.getElementById("modify-order").removeAttribute("style");
			document.getElementById("cancel-div").removeAttribute("style");
		}
	} else {
		simplePrompt("Transaction could not be completed because no bill has been selected")
	}
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
}

// Return to menu screen
function returnOrder() {
	// Show split bill buttons
	document.getElementById("splitBTN").removeAttribute("style");

	document.getElementById(selected).style.backgroundColor = "yellow";
	selectBorder(document.getElementById(selected)); // Retrieve styling for selected button

	document.getElementById("hideOnTender").style.display = "block"
	document.getElementById("showOnTender").style.display = "none"
}

// Background functions begin

// Add selected items from the menu into the selected product slot
function addSelect(object, price, special) {
	try {
		if (object.includes("Energy Drink")) {
			if(!special) {
				promptBox("Please confirm consumer is over 16", ["Yes"], [`addSelect('Energy Drink', ${price}, true);`], "No", null, null, true);
				return;
			}
		}
	} catch (e) {}

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
	if(CURRENTMENU == "HOT") simplePrompt("Prompt for milk and sugar where applicable<br><ul><b>Exceptions</b><li>Long Black</li><li>Espresso Shot</li></ul>", "Helpful tip");
	
	// Modifiers from coffee
	if (CURRENTMENU == "HOT") {
		showModMenu();
		showModMenu(document.getElementById("MODBTN")); // why is this here?
	}

	updateTotal();
}

// Resets item lines upon opening a new menu
function clearItemLines() {
	let line1 = document.getElementById("ITEMLINE1");
	let line2 = document.getElementById("ITEMLINE2");
	let line3 = document.getElementById("ITEMLINE3");

	line1.innerHTML = "";
	line2.innerHTML = "";
	line3.innerHTML = "";
}

// Runs pretty much every time something happens to keep the total relevant
function updateTotal() {
	let total = 0;
	let priceBlocks = document.getElementsByTagName("td");
	for (let i = 0; i < priceBlocks.length; i++) {
		
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

		// Combos
		else if (priceBlocks[i].innerHTML.includes("PROMO:")) {

			if( ((i % 4) + 1) != 1) {
				simplePrompt("Promo found in wrong place.<br>Do not put Combos outside ITEM columm")
				return;
			}
			let comboFirst = document.getElementById(`price${parseInt(priceBlocks[i].id)+1}`);
			let comboSecond = document.getElementById(`price${parseInt(priceBlocks[i].id)+2}`);

			// Check for item
			if (document.getElementById(parseInt(priceBlocks[i].id)+1).innerHTML != "∅") {
				comboFirst.innerHTML = "PROMO"; // PROMO if item is set
			} else { comboFirst.innerHTML = "&mdash;"; } // Otherwise empty the price

			if (document.getElementById(parseInt(priceBlocks[i].id)+2).innerHTML != "∅") {
				comboSecond.innerHTML = "PROMO"; // PROMO if item is set
			} else { comboSecond.innerHTML = "&mdash;"; } // Otherwise empty the price
		}

		// Update price now that all that is over
		if (priceBlocks[i].id.includes("price")) {
			// Floating point fix: step 1
			let p = parseInt(1000*priceBlocks[i].innerHTML.replaceAll("$", ""));
						
			if (!isNaN(p)) { // Prevents priceless items from breaking total
				// Step 2
				total += p / 10;
				plog([i, p / 10, total]);
			}
		}
		
	}

	document.getElementById("totalSpan").innerHTML = `${CURRENCY_FORMATTER.format(total / 100)} (${CURRENCY_FORMATTER.format((total/100) - (total / 115))} GST)`
	return CURRENCY_FORMATTER.format(total / 100);
}

// Executes open opening a menu, creates all the product buttons.
function createLineButtons(PRODUCT_ARRAY, PRICE_ARRAY, line) {
	for (let i = 0; i < PRODUCT_ARRAY.length; i++) {
		if (PRICE_ARRAY) {
			// Show image if in menu
			if(CURRENTMENU == "BREAKFAST" || CURRENTMENU == "LUNCH") {
				line.innerHTML += `<button onclick="addSelect(this.innerHTML, ${PRICE_ARRAY[i]})" oncontextmenu="simplePrompt(\`<i>${PRODUCT_ARRAY[i]}</i><br>Cost: ${PRICE_ARRAY[i]}<br> <img src='images/${CURRENTMENU}/${PRODUCT_ARRAY[i]}.jpg'</img>\`, 'Item information')" class="CATBTN">${PRODUCT_ARRAY[i]}</button>`;
			} else {
				line.innerHTML += `<button onclick="addSelect(this.innerHTML, ${PRICE_ARRAY[i]})" oncontextmenu="simplePrompt(\`<i>${PRODUCT_ARRAY[i]}</i><br>Cost: ${PRICE_ARRAY[i]}\`, 'Item information')" class="CATBTN">${PRODUCT_ARRAY[i]}</button>`;
			}
		} else {
			line.innerHTML += `<button onclick=\"addSelect(this.innerHTML)\" class=\"CATBTN\">${PRODUCT_ARRAY[i]}</button>`;
		}
	}
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
}

// These are self-explanatory
function resetBorder(element) {
	element.style.border = ""; // Clear all
	element.style.borderRight = "1px solid lightgray";
	element.style.borderBottom = "1px solid lightgray";
	
	let price = document.getElementById(`price${element.id}`);
	if(price) {
		price.style.border = ""; // Clear all
		price.style.borderRight = "1px solid lightgray";
		price.style.borderBottom = "1px solid lightgray";
		price.style.backgroundColor = "white"
	}
}

function selectBorder(element) {
	element.style.border = "1px dotted lightgray";
	element.style.borderBottom = "1px dashed lightgray";
	let price = document.getElementById(`price${element.id}`);
	if(price) {
		price.style.border = "1px dotted lightgray";
		price.style.borderTop = "1px dashed lightgray";
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
	title.innerHTML = dialogTitle ? dialogTitle : `prePOS dialog title`;
	text.innerHTML = dialogText ? dialogText : "prePOS dialog description";

	document.getElementById("overlay").removeAttribute("style");

}

function addNumerical(button) {

	let input = document.getElementById("numerical-input");

	if(MAXLENGTH && input.innerHTML.length < MAXLENGTH) {
		input.innerHTML += button.innerHTML;
	}
}

// Numerical prompt

function numericalPrompt(dialogText, dialogFunc, maxLength) {

	MAXLENGTH = maxLength;

	// Reset title, text and button
	let title = document.getElementById("dialog-title");
	let text = document.getElementById("dialog-text");
	let cancel = document.getElementById("dialog-cancel");
	let buttons = document.getElementById("dialog-buttons");
	
	// Clear
	buttons.innerHTML = "";
	document.getElementById("numerical-input").innerHTML = "";
	
	// Reset cancel button
	cancel.innerHTML = "Submit";
	cancelFunction = `hideOverlay()` 
	
	// Grab variables
	title.innerHTML = `prePOS numerical prompt (length: ${MAXLENGTH})`;
	text.innerHTML = dialogText ? dialogText : "prePOS dialog description";
	cancelFunction = dialogFunc ? `${dialogFunc}; hideOverlay()` : `hideOverlay()` 

	// Show prompt and reset position
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

	// Clear
	buttons.innerHTML = "";
	document.getElementById("numerical-input").innerHTML = "";

	document.getElementById("numerical-buttons").style.display="none";

	// Grab basic variables, fallback if not provided
		title.innerHTML = dialogTitle ? dialogTitle : `prePOS dialog title`;
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
					if(i==3) {
						// Line break that actually works
						let lineBrk = document.createElement("br");
						buttons.appendChild(lineBrk);
					}
				} else {
					simplePrompt(`Null value found at position ${i} in dialogFunc`, "Error");
				}
			}

		}
	}
	// Show prompt box and reset position
	document.getElementById("overlay").removeAttribute("style");

}

function getNumericalInput() {
	return parseInt(document.getElementById("numerical-input").innerHTML);
}

// Hides overlay for information messages
function hideOverlay() {
	document.getElementById("overlay").style.display = "none";
}

// Charity donation
function CHARITY_request() {

	// Get charity
	promptBox("Select a charity", ["Red Cross", "InsideOUT LGBT", "KidsCan Trust", "LifeEdu Trust",
									"Cancer Soc.", "Bowel Cancer", "Fred Hollows", "Stroke Found.",
									"Autism NZ", "Hospice Waik.", "Epilepsy NZ"],
	["CHARITY_select(this)","CHARITY_select(this)","CHARITY_select(this)","CHARITY_select(this)","CHARITY_select(this)","CHARITY_select(this)","CHARITY_select(this)","CHARITY_select(this)","CHARITY_select(this)","CHARITY_select(this)","CHARITY_select(this)"],
																					"Youthline",
																	"CHARITY_select(this)", null, false);
}
function CHARITY_select(charity) {
	document.getElementById(selected).innerHTML = `Charity<br>(${charity.innerHTML})`;
	CHARITY_requestAmount();
}

async function CHARITY_requestAmount(charity) {
	
	await delay(1); // 
	numericalPrompt("Insert a price to donate", "document.getElementById(`price${selected}`).innerHTML=CURRENCY_FORMATTER.format(getNumericalInput()/100); updateTotal()", 3);
}

// When the user scrolls the page, execute myFunction
window.onscroll = function() {
	// Get the header
let header = document.getElementById("header");
// Get the offset position of the navbar
let sticky = header.offsetTop;
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
};

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

// Make the DIV element draggable:
dragElement(document.getElementById("dialog"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  async function elementDrag(e) {
	// prevents visual artifacts
	document.getElementById("dialog").style.display = "none";
	await delay(0.1);
	document.getElementById("dialog").style.display= "block";
	// ends above

    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
