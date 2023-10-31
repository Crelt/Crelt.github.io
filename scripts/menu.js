// Provision package
var PKG = 26204548;

let COLD_REG = ["330ml Can", "500ml Bottle", "Energy Drink", "Fuze Iced Tea", "Ice Cream Spider"];
let COLD_PRICE = [220, 330, 240, 320, 410];

let COLD_SHAKE = ["Banana Shake", "Choc Shake", "Strawberry Shake", "Vanilla Shake", "Banana Frappé", "Choc Frappé", "Strawberry Frappé", "Vanilla Frappé"];
let COLD_SHAKE_PRICE = [380, 380, 380, 350, 650, 650, 650, 620];

let BF_YOUNG = ["Kids Meal: Fish & Chips", "Toasted Sandwich", "Pancakes", "Waffles Meal", "Hash Brown Meal"];
let BF_YOUNG_PRICE = [300, 450, 750, 800, 500];

let BF_BURGER = ["Cheese Burger", "Salad Burger", "Bacon-Egg Floppy",  "Bacon-Egg Muffin", "Sausage-Egg Floppy", "Sausage-Egg Muffin"];
let BF_BURGER_PRICE = [480, 460, 480, 490, 480, 490];

let BF_DRINK = ["Brekkie Hot Choc", "Iced Coffee", "Bacon-Egg Floppy, Cheese", "Bacon and Egg Muffin with Cheese", "Sausage-Egg Floppy, Cheese", "Sausage-Egg Muffin, Cheese", "Fluffy Milk Shot"];
let BF_DRINK_PRICE = [200, 550, 500, 510, 500, 510, 150];

let LUNCH = ["Cheesy Bacon Burger", "Eggs Benedict", "Fries, Scoop of", "Wedges, Scoop of", "Nacho Meal", "Chicken Burger"];
let LUNCH_PRICE = [600, 1500, 280, 320, 1200, 580];

let DESSERT_MODS = ["Strawberry Jam", "Apricot Jam", "Raspberry Jam", "Modify Above", "&empty;", "Plain", "Special Request"];
let LUNCH_MODS = ["Seasoning", "Tomato Slices", "Egg", "Custard", "Bacon Strip", "Cheese", "Mushrooms", "Maple Syrup", "Whipped Cream"];
let LUNCH_MODS_2 = ["Xtra", "Less", "Remove", "Only", "Lettuce, Shredded", "Lettuce Leaves", "Pancake"];
let LUNCH_MODS_PRICE = [null, 10, 25, 10, 40, 30, 50, 15, 20, 30];
let LUNCH_MODS_2_PRICE = [null, null, null, null, 25, 25, 250];

let DESSERT = ["Banana Split", "Chocolate Sundae", "Fruit Salad Custard", "Snow Freeze", "Tartlets"];
let DESSERT_PRICE = [1600, 900, 550, 150, 550];

let firstTick = true;

let CAFE = ["Cappuccino", "Flat White", "Hot Chocolate", "Caffè Latte", "Mochaccino", "Long Black", "Espresso Shot"];
let CAFE_PRICE = [450, 480, 250, 450, 450, 420, 220];

let LUNCH_BURGER = ["Cheese Burger", "BLT Cheese Burger", "Supreme BLT", "Grand Cheese Burger", "Salad Burger", "Chicken Burger, Cheese"];
let LUNCH_BURGER_PRICE = [BF_BURGER_PRICE[0], 500, 680, 710, BF_BURGER_PRICE[1], 610];

let TEA = ["Black Tea", "Chai Latte", "Dilmah Tea"];
let TEA_PRICE = [390, 440, 410];

let SIZE = ["Medium Cup Upgrade", "Large Cup Upgrade", "Small Go‑Cup", "Medium Go‑Cup", "Large Go‑Cup"];
let SIZE_PRICE = [50, 100, 20, 80, 130];

let MODS = ["Choc Powder", "Cinn Powder", "Modify Above", "Caramel Syrup Shot", "Hazelnut Syrup Shot", "Espresso Shot"];
let MODS_PRICE = [10, 10, 0, 35, 35, 80];
let MODS_SUGAR = ["1 Sugar", "2 Sugars", "3 Sugars", "4 Sugars", "No Sugar", "Serve Xtra Hot"];
let MODS_MILK = ["Dairy Milk", "Almond Milk", "Coconut Milk", "Soy Milk", "Trim Milk", "Serve Warm"];

let DISCOUNT = ["Loyalty Points -50", "Loyalty Points -100", "Loyalty Points -250", "Loyalty Points -500", "Half-price Item", "Free Item"];
let DISCOUNT_PRICE = [-50, -100, -250, -500, null ,null];

let COMBO = ["PROMO:<br>2 Burgers, $9.00", "PROMO:<br>2 Floppies / Muffin, $8.50", "PROMO:<br>2 Hot Drinks, $8.00"];
let COMBO_PRICE = [900, 850, 800];

let CLASSICS = ["Classics: Bacon-Eggs on Toast", "Classics: Fish & Chips", "Classics: Whitebait Fritters", "Classics: Mince Pie", "Classics: Mince Pie, Cheese", "Classics: Steak Pie", "Classics: Steak Pie, Cheese"];
let CLASSICS_PRICE = [500, 800, 700, 500, 500, 500, 500]