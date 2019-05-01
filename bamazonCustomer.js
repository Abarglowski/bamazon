var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,
    
    user: "root",

    password: "sTr@ngepurple5473",
    database: "bamazon"
});

connection.connect(function(err){
    if(err) throw err;
    printTable();
    //promptUser();
})

function printTable() {
    connection.query("SELECT * FROM products",
    function(err,res){
        if(err) throw err;
        //console.log(res);
        for(var i = 0;i < res.length;i++){
            console.log("id: " + res[i].item_id + " | product: " + res[i].product_name + " | department: " + res[i].department_name + " | price: $" + res[i].price + " | stock: " + res[i].stock_quantity);
        }
        promptUser();
    });
    //promptUser();
}

function promptUser() {
    inquirer
    .prompt({
        name: "item",
        type: "input",
        message: "please enter the id of the item would you like to buy?"
    }).then(answers => { 
        var item = answers;
        inquirer
        .prompt({
            name: "action",
            type: "input",
            message: "please enter the amount of the item you would like to buy"
        }).then(answer => {
            var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { item_id : answers.item }, function(err, res) {
            if(res[0].stock_quantity < answer.action)
            console.log("Insufficient Quantity!");
            else{
                var updateQuery = "UPDATE products SET ? WHERE ?";
                var stock = res[0].stock_quantity - answer.action;
                connection.query(updateQuery, 
                    [
                        {
                            stock_quantity: stock
                        },
                        {
                            item_id: answers.item
                        }
                    ],
                );
            console.log("Total cost for " + answer.action + " " + res[0].product_name + " is: $" + (res[0].price * answer.action));
            }
            //console.log("Total cost for " + answer.action + " " + res[0].product_name + " is: $" + (res[0].price * answer.action));
            connection.end();
        });
        });
    });

}
