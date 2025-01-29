describe('Next.js Form Testing', () => {
  beforeEach(() => {
    cy.visit('/contact'); // Open the contact form page
  });

  it('Should not submit form with empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Please fill out all fields').should('be.visible');
  });

  it('Should submit the form successfully', () => {
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('textarea[name="message"]').type('This is a test message.');
    cy.get('button[type="submit"]').click();

    cy.contains('Thank you for your message!').should('be.visible');
  });
});