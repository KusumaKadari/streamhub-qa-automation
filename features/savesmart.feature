Feature: SaveSmart savings goal tracker

  Scenario: Dashboard loads correctly and displays summary cards
    Given the dashboard is open with a cleared goal list
    Then the dashboard heading and four summary cards are visible

  Scenario: User navigates to the Reports page
    Given the dashboard is open with a cleared goal list
    When the user opens Reports
    Then the Savings Report heading is visible

  Scenario: User adds a valid savings goal
    Given the dashboard is open with a cleared goal list
    When the user adds a goal named "Vacation Fund" with target 50000 saved 5000 and date "2030-06-30"
    Then the goal "Vacation Fund" appears on the dashboard
    And the goal total saved should be calculated as 5000

  Scenario Outline: Invalid goal data shows validation feedback
    Given the dashboard is open with a cleared goal list
    When the user submits invalid goal data name "<name>" target <target> saved <saved> and date "<date>"
    Then validation feedback contains "<message>"

    Examples:
      | name          | target | saved | date       | message                                         |
      |               | 10000  | 0     | 2030-06-30 | Please complete all required fields.            |
      | Negative Goal | -100   | 0     | 2030-06-30 | Target amount must be greater than zero.        |
      | Excess Goal   | 1000   | 1500  | 2030-06-30 | Current saved amount cannot exceed the target amount. |

  Scenario: User adds money and verifies calculated goal values
    Given the dashboard is open with a cleared goal list
    When the user adds a goal named "Laptop" with target 2000 saved 200 and date "2030-12-31"
    And the user adds 300 money to "Laptop"
    Then "Laptop" should show saved 500 remaining 1500 and progress 25 percent

  Scenario: User searches and filters goals by status
    Given the dashboard is open with a cleared goal list
    When the user adds a goal named "Beach Trip" with target 1000 saved 100 and date "2030-07-01"
    And the user adds a goal named "New Phone" with target 500 saved 500 and date "2030-08-01"
    And the user searches for "Beach"
    Then only "Beach Trip" is visible
    When the user clears the search
    And the user filters goals by status "Completed"
    Then only "New Phone" is visible

  Scenario: User deletes a goal
    Given the dashboard is open with a cleared goal list
    When the user adds a goal named "Delete Me" with target 10000 saved 1000 and date "2030-01-01"
    And the user deletes "Delete Me"
    Then the goal "Delete Me" is not visible

  Scenario: Chart is visible and contains valid data for existing goals
    Given the dashboard is open with a cleared goal list
    When the user adds a goal named "Chart Goal" with target 1200 saved 300 and date "2030-04-15"
    Then the chart is visible with valid saved and remaining data

  Scenario: Empty state is shown when no goals exist
    Given the dashboard is open with a cleared goal list
    Then the empty goals state is visible
