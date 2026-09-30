# [WCRM010203] Dealer Activity Maintenance - DCM Vehicle

| Field | Value |
| --- | --- |
| Function Name | Dealer Activity Maintenance - DCM Vehicle |
| Document Status | PM1-4436d56a7c-fc65-3da0-a04c-09e5a083210eSystem Jira |
| Created By | Saurabh Kumar |
| Created Date |  |
| Legacy Function ID | NA |

# Revision History

| S. No. | Version | Revised For | Updated By | Updated Date | Reviewed By | Reviewed Date |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | v1.0 | DCM Vehicle - Dealer screen | `Item_Desc_DCM_VehicleDealer.xlsx` Screen Specific Errors S. No. | Event | Cause | Type | Message Id | Log Message | Action |
| NA | NA | NA | NA | NA | NA | NA |  |  |  |

# Operation Description

This section describes the confirmed operations for the Dealer Activity Maintenance screen, including on-load behavior, control states, validations, add, edit, delete, save, template configuration, and exit handling.

# On-Load Operation

## Default Data

- System loads Dealer Activity Maintenance screen.
- Activity Type Periodic Maintenance is selected by default on Click of Add Button from Activity List.
- Activity Type DCM Vehicle will be selected on click of Hyperlink of Activity Name.
- System loads existing DCM Vehicle Activity Configuration.
- System loads DCM Vehicle Items maintained by TMT.
- System loads Contact Channel Details associated with the selected activity.
- System loads Total Vehicles in Database, Total Individual Customers, and Total Corporate Customers summary information.
- Suppress Days fields are enabled. The default value for Suppress Days is 90 days .
- Dealer-specific configuration is loaded based on logged-in Dealer Code.

## Enable / Disable &ndash; All Controls

- Activity ID is displayed as read-only.
- Activity Name is not editable to open in Edit Mode but will be editable in ADD Mode.
- Activity Description is editable.
- Suppress Days are editable.
- Customer Type is editable.
- DCM Vehicle Item selection checkbox is enabled.
- Contact Process, Channel, and Activity Day fields are enabled according to business rules.
- Assign Group dropdown fields are enabled and available for selection only for call out channel.
- Add Contact Channel, Delete Activity, and Save buttons are enabled according to user permissions.

| Suppress Days | It acts as a checkpoint period before customer contact is executed. During this period, the system verifies whether the follow-up activity is still required. Example: A customer is selected for an Additional Rejected Job follow-up activity. Suppress Days = 90 Before the customer is contacted, the system reviews the customer's history during the last 90 days and checks whether any event has occurred that makes the follow-up unnecessary. Examples include: Customer returned and completed the previously rejected service. Customer revisited the dealership and the concern was resolved. Customer cancelled the service request or appointment. Vehicle is no longer active. Customer no longer meets the activity criteria. Any other business-defined suppression condition. |
| --- | --- |

## Common On-Load Details

- System loads Customer Type values from Customer Type Master.
- System loads Contact Process values: Service Follow-Up
- Appointment Confirmation
- System loads Channel values: Call Out
- Email
- SMS
- Line OA
- Existing Contact Channel Details and DCM Vehicle Item selections are displayed.

### Dealer Vehicle Summary Section

The system displays read-only Dealer Vehicle Summary:

| Dealer Vehicle Summary | Description |
| --- | --- |
| Total Vehicles in Database | Displays the total number of vehicles records available for the logged-in dealer and used for activity targeting. |
| Total Individual Customers | Displays the total number of Individual Customer records. Percentage is calculated as (Total Individual Customers &divide; Total Customers) &times; 100 and displayed for reference. |
| Total Corporate Customers | Displays the total number of Corporate Customer records. Percentage is calculated as (Total Corporate Customers &divide; Total Customers) &times; 100 and displayed for reference. |
These values are loaded based on dealer, branch, customer type, and activity type context.

# Validations (Frontend Check)

### Activity Setup

- Activity Type is mandatory.
- Customer Type is mandatory.
- Activity Name and Description is mandatory.
- Activity Name and Description must not exceed 250 and 1000 characters respectively.
- Suppress Days are enabled and their ranges are 0 to 90 days.

### DCM Vehicle Item

- At least one DCM Vehicle Item must be selected before saving.

### Contact Channel Details

- Contact Process is mandatory.
- Channel is mandatory.
- Activity Day is mandatory.
- Duplicate Contact Process + Channel combinations are not allowed.
- Activity Day must contain numeric values only.
- Assign Group dropdown fields are enabled and available for selection only for call out channel.

### Service Follow-Up

- Activity Day is editable.
- Activity Day must be between -30 and -1 .

### Appointment Confirmation

- Activity Day is non editable.
- Activity Day must be -1 as configured at TMT Level.

### Save Behavior

- If any validation fails, Save operation is blocked.
- Validation message is displayed beside the related field.
- User must correct validation errors before proceeding.

# Submit Validations (Business Validations)

- At least one DCM Vehicle Item must be selected.
- At least one Contact Channel Detail record must exist.
- Contact Process is mandatory for each Contact Channel row.
- Channel is mandatory for each Contact Channel row.
- Activity Day cannot be blank.
- Suppress Days are enabled and their range is 0 to 90 days.
- Duplicate Contact Process + Channel combinations are not permitted.
- Activity Day must contain valid numeric values only.
- Activity Day must be within configured business limits.
- Assign Group dropdown fields must be selected for call out channel.
- Dealer Code must be valid and authorized for the activity configuration.
- Activity configuration must exist before update or deletion.
- Concurrent update validation must be performed before saving.
- Records containing validation errors must not be saved.

### On Successful Operations (Screen behavior)

- Successful Save: On successful save, the system returns an HTTP 200 (OK) response containing the status, and success message.

### Successful Delete Activity

- Activity status is changed to INACTIVE .
- Activity is removed from Activity Listing screen.
- Future call plans are no longer generated.
- Existing generated call plans remain unchanged.

# Add Operation

Add operation applies to Contact Channel Details only.
- User clicks Add Contact Channel .
- System creates a new editable Contact Channel row.
- System automatically assigns the next available sequence number.
- Newly added records are marked with Status = ADD .
- User can select Contact Process and Channel and enter Activity Day according to business rules.
- For Appointment Confirmation , Activity Day is automatically set to -1 as configured at TMT Level and becomes read-only.
- Assign Group is used to select the Call Center Team/Group that will be responsible for contacting customers generated by the activity. The field is applicable only when the selected Channel is Call Out , as customer follow-up will be performed by call center agents. For communication channels such as Email, SMS, or Line OA , no call center team assignment is required. Therefore, the Assign Group field remains disabled and cannot be edited.
- Newly added records remain in screen memory and are not saved to the database until Save is executed successfully.

# Edit Operation

Edit operation applies to Activity Setup, DCM Vehicle Item Selection, Contact Channel Details, and Follow-up Staff Assignments.
- User can modify Activity Description and Customer Type.
- User can select or deselect DCM Vehicle Items.
- User can modify Contact Process, Channel, and Activity Day according to business rules.
- User can add or remove Follow-up Staff assignments.
- Activity Name remains read-only and is automatically populated based on the selected Activity Type record from Activity List Screen.
- Summary information (Total Vehicles, Total Individual Customers, and Total Corporate Customers) is display-only and cannot be modified.
- Existing Contact Channel records modified by the user are marked with Status = UPD .
- All changes remain in screen memory until Save is executed successfully.

# Delete Operation

Delete operation applies to Contact Channel Details and Activity Configuration.

#### Contact Channel Delete

- User clicks the Delete icon for a Contact Channel record.
- Existing records are marked with Status = DEL .
- Newly added unsaved rows are removed from the grid immediately.
- Records marked as DEL are processed during Save operation.
- After successful Save, records are logically deleted and no longer displayed to users.

#### Delete Activity

- User clicks Delete Activity .
- System displays confirmation message: After deletion of activity, system will stop generating the call plan. Do you want to delete this activity?
- Upon confirmation, Activity Status is updated to INACTIVE .
- Existing generated call plans remain unchanged.
- Future call plans are not generated.
- Activity is removed from the Activity Listing screen.

# Save Operation

Save operation validates and persists the entire DCM Vehicle activity configuration using API_003.
System performs the following validations before processing:
- Activity Type is selected.
- Customer Type is selected.
- Activity ID will be generated for New Activity record
- The format of Activity Id generation is ++ e.g. AV260001
- At least one DCM Vehicle Item is selected.
- At least one Contact Channel record exists.
- Contact Process is provided for all active Contact Channel records.
- Channel is provided for all active Contact Channel records.
- Activity Day is provided for all active Contact Channel records.
- Duplicate Contact Process + Channel combinations are not allowed.
- Activity Day conforms to configured business rules.
- Dealer Code is valid.
- Record version validation is successful.
System processes records based on Status:
- ADD &rarr; Insert new records.
- UPD &rarr; Update existing records.
- DEL &rarr; Logically delete records and mark them inactive.

# Set Template Operation

When the user clicks Save, the system validates whether communication templates are configured for all selected contact channels.
If a contact channel is selected but its corresponding template has not been configured, the activity cannot be saved.

### Validation Logic

- If SMS channel is selected, an SMS template must exist.
- If Email channel is selected, an Email template must exist.
- If Line OA channel is selected, a Line OA template must exist.

### System Behavior

- User selects one or more contact channels.
- User clicks Save .
- System checks whether templates are available for all selected channels.
- If any required template is missing: Save operation is stopped.
- Activity is not saved.
- Validation message is displayed.
- User must configure the missing templates through the Set Template function before saving the activity.

### Set Template Button - Functionality

The Set Template button is used to define the communication content for the selected contact channels such as SMS, Email, and Line OA.
When the user clicks Set Template, a template configuration screen/popup is opened where the user can create or update the message template for each selected channel.
The user can enter:
- SMS Message
- Email Subject
- Email Body
- Line OA Message
Preview functionality is available to allow users to review the configured template before saving.

# Exit Operation

When user navigates away with unsaved changes, the system displays a confirmation warning. If user confirms, navigation proceeds and unsaved changes are discarded. If user cancels, user remains on screen.
