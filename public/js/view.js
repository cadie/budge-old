
  $(document).ready(function() {
    // Getting a reference to the input field where user adds a new expenses
    var newItemInput = $("input.new-item");
    var newItemInput2 = $("input.new-item2");
    var newItemInput3 = $("input.new-item3");
    
    var expenseContainer = $(".expense-container");
    // Adding event listeners for deleting, editing, and adding expenses
    $(document).on("click", "button.delete", deleteBudget);
    $(document).on("click", "button.complete", toggleComplete);
    $(document).on("click", ".expense-item", editBudget);
    $(document).on("keyup", ".expense-item", finishEdit);
    $(document).on("blur", ".expense-item", cancelEdit);
    $(document).on("submit", "#expense-form", insertBudget);

    // Our initial expenses array
    var expenses;

    // Getting expenses from database when page loads
    getExpenses();

    // This function resets the expenses displayed with new expenses from the database
    function initializeRows() {
      expenseContainer.empty();
      var rowsToAdd = [];
      for (var i = 0; i < expenses.length; i++) {
        rowsToAdd.push(createNewRow(expenses[i]));
      }
      expenseContainer.prepend(rowsToAdd);
    }

    // This function grabs expenses from the database and updates the view
    function getExpenses() {
      $.get("/api/members", function(data) {
        console.log("Budget", data);
        expenses = data;
        initializeRows();
      });
    }

    // This function deletes a expenses when the user clicks the delete button
    function deleteBudget() {
      var id = $(this).data("id");
      $.ajax({
        method: "DELETE",
        url: "/api/members/" + id
      })
      .done(function() {
        getExpenses();
      });
    }

    // This function sets a expenses complete attribute to the opposite of what it is
    // and then runs the updateExpenses function
    function toggleComplete() {
      var expense = $(this)
        .parent()
        .data("expense");

      expense.complete = !expense.complete;
      updateExpense(expense);
    }

    // This function handles showing the input box for a user to edit a expenses
    function editBudget() {
      var currentExpense = $(this).data("expense");
      $(this)
        .children()
        .hide();
      $(this)
        .children("input.edit")
        .val(currentExpense.text)

      $(this)
        .children("input.edit")
        .show();
      $(this)
        .children("input.edit")
        .focus();
    }

    // This function starts updating a expenses in the database if a user hits the
    // "Enter Key" While in edit mode
    function finishEdit(event) {
      var updatedExpense;
      if (event.key === "Enter") {
        updatedExpense = {
          id: $(this)
            .data("expense")
            .id,
          text: $(this)
            .children("input")
            .val()
            .trim(),
          amount: $(this)
            .children("input")
            .val()
            .trim(),
            income: $(this)
            .children("input")
            .val()
            .trim(),
            total: $(this)
            .children("input")
            .val()
            .trim(),

        };
        $(this).blur();
        updateExpense(updatedExpense);
      }
    }

    // This function updates a expenses in our database
    function updateExpense(expense) {
      $.ajax({
        method: "PUT",
        url: "/api/members",
        data: expense
      })
      .done(function() {
        getExpenses();
      });
    }

    // This function is called whenever a expenses item is in edit mode and loses focus
    // This cancels any edits being made
    function cancelEdit() {
      var currentExpense = $(this).data("expense");
      $(this)
        .children()
        .hide();
      $(this)
        .children("input.edit")
        .val(currentExpense.text)

      $(this)
        .children("span")
        .show();
      $(this)
        .children("button")
        .show();
    }

    // This function constructs a expenses-item row
    function createNewRow(expense) {
      var newInputRow = $("<li>");
      newInputRow.addClass("list-group-item expense-item");
      var newExpenseSpan = $("<span>");
      newExpenseSpan.text(expense.text);

      newInputRow.append(newExpenseSpan);
      var newExpenseInput = $("<input>");
      newExpenseInput.attr("type", "text");
      newExpenseInput.addClass("edit");
      newExpenseInput.css("display", "none");
      newInputRow.append(newExpenseInput);
      var newDeleteBtn = $("<button>");
      newDeleteBtn.addClass("delete btn btn-default");
      newDeleteBtn.text("x");
      newDeleteBtn.data("id", expense.id);
      newInputRow.append(newDeleteBtn);
      newInputRow.data("expense", expense);
      if (expense.complete) {
        newExpenseSpan.css("text-decoration", "line-through");
      }
      return newInputRow;
    }

    // This function inserts a new expenses into our database and then updates the view
    function insertBudget(event) {
      event.preventDefault();
      // if (!newItemInput.val().trim()) {   return; }
      var expense = {
        text: newItemInput
          .val()
          .trim(),
        amount: newItemInput2
          .val()
          .trim(),
        income: newItemInput3
          .val()
          .trim(),


      };

      // Posting the new expenses, calling getExpenses when done
      $.post("/api/members", expense, function() {
        getExpenses();
      });
      newItemInput.val(""),
      newItemInput2.val("");


    }

  });
