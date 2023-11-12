describe("Blog ", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "Antti Tikka",
      username: "antti",
      password: "salainen",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.visit("");
  });

  it("Login form is shown", function () {
    cy.contains("log in to application");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.getBySel("username").type("antti");
      cy.getBySel("password").type("salainen");
      cy.getBySel("login").click();

      cy.contains("Antti Tikka logged in");
    });

    it("fails with wrong credentials", function () {
      cy.getBySel("username").type("antti");
      cy.getBySel("password").type("wrong");
      cy.getBySel("login").click();

      cy.getBySel("notification").contains("wrong credentials");
    });

    describe("When logged in", function () {
      beforeEach(function () {
        cy.login({ username: "antti", password: "salainen" });
      });

      it("A blog can be created", function () {
        cy.contains("new blog").click();

        cy.get("#title").type("test blog");
        cy.get("#author").type("some blogger");
        cy.get("#url").type("someblog.com");
        cy.getBySel("create").contains("create").click();

        cy.getBySel("notification").contains(
          "a new blog test blog by some blogger added"
        );
        cy.getBySel("blog").contains("test blog");
      });

      describe("and several blogs exist", function () {
        beforeEach(function () {
          cy.createBlog({ title: "blog 1", author: "author 1", url: "url 1" });
          cy.createBlog({ title: "blog 2", author: "author 2", url: "url 2" });
          cy.createBlog({ title: "blog 3", author: "author 3", url: "url 3" });
        });

        it("A blog can be liked", function () {
          cy.contains("blog 2").closest('[data-cy="blog"]').as("blogToLike");
          cy.get("@blogToLike").find('[data-cy="toggle"]').click();
          cy.get("@blogToLike").find('[data-cy="like"]').click();

          cy.get("@blogToLike").find('[data-cy="likes"]').contains("1");
        });

        it("A blog can be deleted", function () {
          cy.contains("blog 2").closest('[data-cy="blog"]').as("blogToDelete");
          cy.get("@blogToDelete").find('[data-cy="toggle"]').click();
          cy.get("@blogToDelete").find('[data-cy="delete"]').click();

          cy.getBySel("notification").contains("Removed blog 2 by author 2");
          cy.get("@blogToDelete").should("not.exist");
        });

        it("A blog cannot be deleted by another user", function () {
          const user = {
            name: "Teppo Testi",
            username: "teppo",
            password: "salainen",
          };
          cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
          cy.login({ username: "teppo", password: "salainen" });

          cy.contains("blog 2")
            .closest('[data-cy="blog"]')
            .as("blogToNotDelete");
          cy.get("@blogToNotDelete").find('[data-cy="toggle"]').click();
          cy.get("@blogToNotDelete")
            .find('[data-cy="delete"]')
            .should("not.exist");
        });

        it("Blogs are sorted from most liked to least liked", function () {
          cy.intercept({
            method: "PUT",
            url: "api/blogs/*",
          }).as("updateBlog");

          cy.contains("blog 1").closest('[data-cy="blog"]').as("blog1");
          cy.get("@blog1").find('[data-cy="toggle"]').click();

          cy.get("@blog1").find('[data-cy="like"]').click();
          cy.wait("@updateBlog");

          cy.contains("blog 3").closest('[data-cy="blog"]').as("blog3");
          cy.get("@blog3").find('[data-cy="toggle"]').click();

          cy.get("@blog3").find('[data-cy="like"]').click();
          cy.wait("@updateBlog");

          cy.get("@blog3").find('[data-cy="like"]').click();
          cy.wait("@updateBlog");

          cy.contains("blog 2").closest('[data-cy="blog"]').as("blog2");
          cy.get("@blog2").find('[data-cy="toggle"]').click();

          cy.getBySel("blog").eq(0).as("most");
          cy.get("@most").contains("blog 3");
          cy.get("@most").find('[data-cy="likes"]').contains("2");

          cy.getBySel("blog").eq(1).as("between");
          cy.get("@between").contains("blog 1");
          cy.get("@between").find('[data-cy="likes"]').contains("1");

          cy.getBySel("blog").eq(2).as("least");
          cy.get("@least").contains("blog 2");
          cy.get("@least").find('[data-cy="likes"]').contains("0");
        });
      });
    });
  });
});
