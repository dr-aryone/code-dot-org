@single_session
Feature: Using the SectionActionDropdown

  @no_ie
  # * Check that we get redirected to the right page
  Scenario: Viewing progress from SectionActionDropdown
    Given I create a teacher-associated student named "Sally"
    And I complete the level on "http://studio.code.org/s/allthethings/stage/2/puzzle/1"
    And I complete the free response on "http://studio.code.org/s/allthethings/stage/27/puzzle/1"
    And I submit the assessment on "http://studio.code.org/s/allthethings/stage/33/puzzle/1"
    And I sign out

    When I sign in as "Teacher_Sally" and go home
    And I open the section action dropdown
    And I press the child number 0 of class ".pop-up-menu-item"
    And I wait until current URL contains "/progress"

  # * Check that we get redirected to the right page
  Scenario: Managing students from SectionActionDropdown
    Given I am a teacher
    And I create a new section and go home
    And I open the section action dropdown
    And I press the child number 1 of class ".pop-up-menu-item"
    And I wait until current URL contains "/manage"

  # * Check that we get redirected to the right page
  Scenario: Printing Login Cards from SectionActionDropdown
    Given I am a teacher
    And I create a new section and go home
    And I open the section action dropdown
    And I press the child number 2 of class ".pop-up-menu-item"
    And I wait until current URL contains "/login_info"

  # * Add a section and then opens the edit dialog.
  #     * If the save button can be pressed, we are in the right dialog.
  #     * If the save button cannot be pressed, we do not have focus in the right dialog.
  Scenario: Editing Section Information from SectionActionDropdown
    Given I am a teacher
    And I create a new section and go home
    And I open the section action dropdown
    And I press the child number 3 of class ".pop-up-menu-item"
    And I press the first ".uitest-saveButton" element

  # * Checks that section can be hidden and shown
  #   * The menu of a new section should have a 'Hide Section' option -> select it to hide the section
  #   * Button to show hidden sections appears -> select it to show the now-hidden section
  #   * The menu of the now-hidden section should have a 'Show Section' option -> select it to show the section
  #   * Table of hidden sections and "Hide/Show" button automatically disappears when empty
  #   * Check that the option to hide the section is available again
  Scenario: Hiding/Showing Section from SectionActionDropdown
    Given I am a teacher
    And I create a new section and go home
    And I open the section action dropdown
    And I press the child number 4 of class ".pop-up-menu-item"
    And I wait until I don't see selector ".ui-test-section-dropdown"
    And I click selector ".ui-test-show-hide" once I see it
    And I open the section action dropdown
    And I press the child number 4 of class ".pop-up-menu-item"
    And I wait until I don't see selector ".ui-test-show-hide"
    And I open the section action dropdown
    And I press the child number 4 of class ".pop-up-menu-item"
