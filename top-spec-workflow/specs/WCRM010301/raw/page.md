# [WCRM010301] TMT Activity Maintenance - PM

| Field | Value |
| --- | --- |
| Function Name | TMT Activity Master Maintenance &ndash; PM |
| Document Status | PM1-1036d56a7c-fc65-3da0-a04c-09e5a083210eSystem Jira |
| Created By | Shivam Varshney |
| Created Date | 29/6/2026 |
| Legacy Function ID | NA |

## Revision History

| S. No. | Version No. | Revised For | Updated By | Updated Date | Reviewed By | Reviewed Date |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | v.10 | Initial DRD for client review | Shivam Varshney | 29/6/2026 | `Item_desc_Periodic_Maintenance(Activity_Master_Maintenance)_TMT_301 (3) (1).xlsx` Screen Specific Errors S. No. | Event | Cause | Type | Message Id | Log Message | Action |

# Operation Description

This section describes confirmed operations for the Setup Activity &ndash; Periodic Maintenance (TMT) screen based on the uploaded template details.

## On-Load Operation

### Default Data &ndash; Header and Detail Section

- System loads Setup Activity by TMT &ndash; Periodic Maintenance screen.
- Existing Service & Repair Inspection Items and Contact Channel Details are displayed.
- The valid TMT contact channels are Call, Email, and SMS. Other contact channels (LINE and T-Connect) will be managed in the CareCenter system to send out the notification
- Repair/Inspection Code will be populated from PM Operation Master Table.
- Inspection Code and Description will be disabled for existing Service and Repair Inspection Items record.
- Activity Type Periodic Maintenance is selected by default.
- Deleted records should not be displayed to the user as it is removed from table.

### Enable / Disable &ndash; All Controls

- Add, Delete, and Save actions are enabled based on user permissions.
- Inspection Code, Contact Process, Channel, and Activity Day fields are enabled.
- Description field is read-only.

### Common On-Load Details

- System loads Repair/ Inspection code, Contact Processes, and Channels from master data.
- Contact process dropdown should be populated as: Service Follow-up.
- Deleted records will not be visible in the Inspection and Contact Process sections; only active records will be displayed.

### Validations (Frontend Check)

- Activity name: The Activity Name must not be empty and must follow maximum length constraints.
- Inspection selection: At least one inspection item must be selected.
- Channel: Channel selection is mandatory for each row.
- Service Follow-up: Activity Day is an editable textbox on selection of &ldquo;Service Follow-up&rdquo; Contact Process that allows users to enter a value between -30 and 30. The field is blank by default.
- Activity day: Activity Day must be a mandatory and should have valid numeric value max digit 2 and Range -30

### Submit Validations (Business Validations)

- At least one Contact Process record must be configured.
- Contact Process is mandatory for each row.
- Channel is mandatory for each row.
- Activity Day is mandatory and cannot be blank.
- Duplicate Contact Process + Channel combinations are not allowed.
- Activity Day must contain numeric values only.
- Activity Day must be within the configured minimum and maximum range defined in the backend.
- System should display appropriate validation messages when any validation rule fails.
- Records with validation errors should not be saved until all errors are resolved.

### On Successful Operations (Screen behavior)

- Successful Save: On successful save, the system returns an HTTP 201 (Created) response containing the status, and success message.
- Success Message: System displays &ldquo; PM Activity Setup configured successfully&rdquo;

## Add Operation

Add operation is used to create the Periodic Maintenance activity setup in Add mode.
- Activity Type: Periodic Maintenance is selected for activity setup.
- The newly added row should be marked with Status = ADD .
- The Repair/Inspection Code field should be populated from Operation code master and selectable.
- Upon selection of a Repair/Inspection Code , the corresponding Description should be automatically populated by the system.
- Appropriate validation rules should be applied before the record is saved.

## Update Record

- Existing records can be modified by the user.
- When an existing Repair/Inspection Code Item is updated with Mandatory Flag as Checked, the Status should be changed to UPD .
- User can check and uncheck mandatory column.
- Description is auto populated based on the selected Inspection Code and disabled.

## Delete Operation

Delete operation is applicable for row-level deletion in Service & Repair Inspection and Contact Channel Details.
- Clicking the Delete icon marks the selected record with Status = DEL.
- Upon successful save, the record will be deleted in the database.

## Save Operation

- System should: Validate all mandatory fields and ensure that required information is entered before processing.
- Validate duplicate entries and prevent saving records with duplicate configurations.
- Process records based on the selected Status : ADD &rarr; Insert a new record into the system.
- UPD &rarr; Update the existing record with the latest information.
- DEL &rarr; Mark the status as DEL and on click of Save, Delete the selected record from the Backend table.
- Save all configured Service & Repair Item details along with their mandatory.
- Save all configured Contact Channel details and associated process information.
- Display appropriate validation messages if any errors occur during processing.
- Display a success message upon successful completion of the save operation.

## Set Template Operation

When the user clicks Save, the system validates whether communication templates are configured for all selected contact channels.
If a contact channel is selected but its corresponding template has not been configured, the activity cannot be saved.
SMS Template
Fields
- Message
Validation
- Message is mandatory if SMS channel is configured.
- Character counter shall be displayed.
- Maximum length: Thai: 70 characters
- English: 160 characters
- Thai : Maximum 70 characters per SMS(due to Unicode encoding).
- English: Maximum 160 characters per SMS.
- System shall prevent users from exceeding the configured limit.
Preview
- Clicking Preview shall display the SMS content in a popup window.
- System variables shall be replaced with sample values for preview purposes.
Email Template
Fields
- Subject
- Message
Validation
- Subject is mandatory.
- Message is mandatory.
- Email template is required when Email channel is selected.
Preview
- User can preview the email content before saving.
Line OA Template
TMT LON Template
Fields
- Message
Validation
- Message is mandatory if Line OA channel is selected.
Preview
- User can preview the message content before saving.
