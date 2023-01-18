import { format } from "../support/functions";

context("Dev Finances", () => {
  beforeEach(() => {
    cy.visit("https://devfinance-agilizei.netlify.app/");
    cy.get("#data-table .description").should("have.length", 0);
    cy.get("#data-table .income").should("have.length", 0);
    cy.get("#data-table .date").should("have.length", 0);
  });
  it("Register income", () => {
    // Input
    cy.get("#transaction .button").click();
    cy.get("#description").type("Salário");
    cy.get("#amount").type(2000);
    cy.get("[type=date]").type("2022-01-10");
    cy.get("button").contains("Salvar").click();

    //Verification
    cy.get("#data-table .description").should("have.length", 1);
    cy.get("#data-table .income").should("have.length", 1);
    cy.get("#data-table .date").should("have.length", 1);
  });

  it("Register expense", () => {
    //Input
    cy.get("#transaction .button").click();
    cy.get("#description").type("Aluguel");
    cy.get("#amount").type(-800);
    cy.get("[type=date]").type("2022-01-17");
    cy.get("button").contains("Salvar").click();

    // Verification
    cy.get("#data-table .description").should("have.length", 1);
    cy.get("#data-table .expense").should("have.length", 1);
    cy.get("#data-table .date").should("have.length", 1);
  });
  it("Remove income and expense", () => {
    const income = "Salário";
    const expense = "Aluguel";

    // input income
    cy.get("#transaction .button").click();
    cy.get("#description").type(income);
    cy.get("#amount").type(2000);
    cy.get("[type=date]").type("2022-01-10");
    cy.get("button").contains("Salvar").click();

    // input expense
    cy.get("#transaction .button").click();
    cy.get("#description").type(expense);
    cy.get("#amount").type(-800);
    cy.get("[type=date]").type("2022-01-17");
    cy.get("button").contains("Salvar").click();

    // Input verification
    cy.get("#data-table .description").should("have.length", 2);
    cy.get("#data-table .income").should("have.length", 1);
    cy.get("#data-table .expense").should("have.length", 1);
    cy.get("#data-table .date").should("have.length", 2);

    // delete data

    cy.get("td.description")
      .contains(income)
      .parent()
      .find("img[onclick*=remove]")
      .click();
    cy.get("td.description")
      .contains(expense)
      .parent()
      .find("img[onclick*=remove]")
      .click();

    // Delete verification

    cy.get("#data-table .description").should("have.length", 0);
    cy.get("#data-table .income").should("have.length", 0);
    cy.get("#data-table .expense").should("have.length", 0);
    cy.get("#data-table .date").should("have.length", 0);
  });
  it("Validate balance", () => {
    const income = "Salário";
    const expense = "Aluguel";

    // input income
    cy.get("#transaction .button").click();
    cy.get("#description").type(income);
    cy.get("#amount").type(900);
    cy.get("[type=date]").type("2022-01-10");
    cy.get("button").contains("Salvar").click();

    // input expense
    cy.get("#transaction .button").click();
    cy.get("#description").type(expense);
    cy.get("#amount").type(-400);
    cy.get("[type=date]").type("2022-01-17");
    cy.get("button").contains("Salvar").click();

    let incomes = 0;
    let expenses = 0;

    cy.get("#data-table tbody tr").each((element) => {
      cy.get(element)
        .find("td.income, td.expense")
        .invoke("text")
        .then((text) => {
          if (text.includes("-")) {
            expenses = expenses + format(text);
          } else {
            incomes = incomes + format(text);
          }
          cy.log(incomes);
          cy.log(expenses);
        });
    });

    cy.get("#totalDisplay")
      .invoke("text")
      .then((text) => {
        let formattedTotalDisplay = format(text);
        let expectedTotal = incomes + expenses;

        expect(formattedTotalDisplay).to.eq(expectedTotal);
      });
  });
});
