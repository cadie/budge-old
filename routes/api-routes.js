// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the members page.
    // Otherwise the user will be sent an error
    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        console.log("login")

        // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
        // So we're sending the user back the route to the members page because the redirect will happen on the front end
        // They won't get this or even be able to access this page if they aren't authenticaticated
        res.json("/dashboard");
    });

    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post("/api/sign-up", function(req, res) {
        console.log("made it here")
        console.log(req.body);
        db.User.create({
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password,

        }).then(function() {
            res.redirect(307, "/api/login");
        }).catch(function(err) {
            console.log(err);
            res.json(err);
            // res.status(422).json(err.errors[0].message);
        });

    });


    // Route for logging user out
    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });

    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", function(req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
            res.json({
                fullname: req.user.fullname,
                email: req.user.email,
                id: req.user.id
            });
        }






             // GET route for getting all of the expenses
             app.get("/api/members", function(req, res) {
                // findAll returns all entries for a table when used with no options
                db.Budget.findAll({where:req.body.email}).then(function(dbBudget) {
                  // We have access to the expenses as an argument inside of the callback function
                  res.json(dbBudget);
                });
              });

              // POST route for saving a new expense
              app.post("/api/members", function(req, res) {
                // create takes an argument of an object describing the item we want to
                // insert into our table. In this case we just we pass in an object with a text
                // and complete property
                db.Budget.create({
                  text: req.body.text,
                  amount: req.body.amount,
                  income:req.body.income,
                  total:req.body.total,
                  email:req.user.email,
                  fullname:req.user.fullname,
                }).then(function(dbBudget) {
                  // We have access to the new expenses as an argument inside of the callback function
                  res.json(dbBudget);
                });
              });










              
              // DELETE route for deleting expenses. We can get the id of the expenses to be deleted from
              // req.params.id
              app.delete("/api/members/:id", function(req, res) {
                db.Budget.destroy({
                  where: { id: req.params.id}
              })
            .then(function(dbBudget) {
                 res.json(dbBudget)
            })


                // Use the sequelize destroy method to delete a record from our table with the
                // id in req.params.id. res.json the result back to the user

              });

              // PUT route for updating expenses. We can get the updated expenses data from req.body
              app.put("/api/members", function(req, res) {
                db.Budget.update({
                 text: req.body.text,
                 amount: req.body.amount,
                 email:req.body.email,
                 fullname:req.body.fullname,
              })
            .then(function(dbBudget) {
                 res.json(dbBudget)
            })
                // Use the sequelize update method to update a expenses to be equal to the value of req.body
                // req.body will contain the id of the expenses we need to update
              });


    });
}
