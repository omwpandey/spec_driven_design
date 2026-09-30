# Data_Map_Periodic_Maintenance(Activity_Master_Maintenance)_TMT (2) (2) (1) (2) 1 (1) (1).xlsx

## DB_Entity

| Entity_ID | Table_Name | Schema_Name | Description | API_IDs |
| --- | --- | --- | --- | --- |
| ENT_001 | tb_t_act_activity_setup | crm | Stores the activity setup configuration maintained by TMT. Contains activity type, setup status, created information, and overall configuration details used for periodic maintenance and other activity programs. | API-WCRM010301-002, API-WCRM010301-003, API-WCRM010301-004 |
| ENT_002 | tb_m_act_activity_type | crm | Maintains activity types available for configuration, such as Periodic Maintenance, Additional Rejected Job, DCM Vehicle, TCFR+, SSC/CSC, Body & Paint, BP Insurance Renewal, Upload, and PSFU. | API-WCRM010301-001 |
| ENT_003 | tb_m_act_repair_inspection | crm | Maintains the master list of Repair/Inspection Codes and service descriptions available for selection in the Service & Repair Inspection Item section. | API-WCRM010301-002 |
| ENT_004 | tb_t_act_activity_inspection_item | crm | Stores Repair/Inspection Codes configured for a specific activity type including mandatory indicators, status, and display sequence. | API-WCRM010301-002 |
| ENT_005 | tb_m_act_contact_process | crm | Maintains contact process master data such as Service Follow-up, Appointment Confirmation, and other communication processes. |  |
| ENT_006 | tb_m_act_channel | crm | Maintains communication channel master data including  Email, SMS, TMT LON, and future communication channels. | API-WCRM010301-004 |
| ENT_007 | tb_t_act_contact_channel_detail | crm | Stores contact channel configurations for each activity type, including contact process, channel, activity day, and status. | API-WCRM010301-001 |
| ENT_008 | tb_t_act_activity_contact_mapping | crm | Stores mapping between activity types, contact processes, communication channels, and scheduled activity days used for customer engagement workflows. | API-WCRM010301-002 |
| ENT_009 | tb_m_act_activity_day_rule | crm | Maintains activity day rules defining the number of days before or after an event when customer communications should be triggered. | API-WCRM010301-003 |

## DB_Columns

| Entity_ID | Column_Name | DB_Type | Length h | Precision | Scale | Nullable | Primary_Key | Auto_Generated | Unique | Indexed | Default_Value | FK_Reference | Description | Maps_To_Field |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ENT_001 | id | BIGSERIAL | - | - | - | No | Yes | Yes | Yes | Yes | Auto | - | Unique identifier for activity master record | Activity ID |
| ENT_001 | activity_type_name | VARCHAR | 200 | - | - | No | No | No | No | Yes | - | - | Activity type name displayed on screen | Activity Type |
| ENT_001 | is_active | BOOLEAN | - | - | - | No | No | No | No | Yes | true | - | Indicates whether activity type is active | Active |
| ENT_001 | created_by | VARCHAR | 100 | - | - | No | No | No | No | No | - | - | User who created the record | System |
| ENT_001 | created_dt | TIMESTAMP | - | - | - | No | No | No | No | No | NOW() | - | Record creation timestamp | System |
| ENT_001 | upd_by | VARCHAR | 100 | - | - | Yes | No | No | No | No | - | - | User who modified the record | System |
| ENT_001 | upd_dt | TIMESTAMP | - | - | - | Yes | No | No | No | No | - | - | Last modification timestamp | System |
| ENT_001 | version | INTEGER | - | - | - | No | No | No | No | No | 0 | - | Version number for optimistic locking | System |
| ENT_002 | id | BIGSERIAL | - | - | - | No | Yes | Yes | Yes | Yes | Auto | - | Unique identifier of the activity type | Activity Type |
| ENT_002 | activity_type_code | VARCHAR | 50 | - | - | No | No | No | Yes | Yes | - | - | Unique code representing the activity type | Activity Type |
| ENT_002 | activity_type_name | VARCHAR | 200 | - | - | No | No | No | Yes | Yes | - | - | Name of the activity type displayed on the screen | Activity Type |
| ENT_002 | activity_type_desc | VARCHAR | 1000 | - | - | Yes | No | No | No | No | - | - | Detailed description of the activity type and its business purpose | Activity Type |
| ENT_002 | is_active | BOOLEAN | - | - | - | No | No | No | No | Yes | true | - | Indicates whether the activity type is active | Active |
| ENT_002 | created_by | VARCHAR | 100 | - | - | No | No | No | No | No | - | - | User who created the record | System |
| ENT_002 | created_dt | TIMESTAMP | - | - | - | No | No | No | No | No | NOW() | - | Record creation date and time | System |
| ENT_002 | upd_by | VARCHAR | 100 | - | - | Yes | No | No | No | No | - | - | User who last modified the record | System |
| ENT_002 | upd_dt | TIMESTAMP | - | - | - | Yes | No | No | No | No | - | - | Record last update date and time | System |
| ENT_002 | version | INTEGER | - | - | - | No | No | No | No | No | 0 | - | Version number used for optimistic locking and audit control | System |
| ENT_003 | id | BIGSERIAL | - | - | - | No | Yes | Yes | Yes | Yes | Auto | - | Unique identifier for inspection item master record | Repair/Inspection Code |
| ENT_003 | inspection_code | VARCHAR | 50 | - | - | No | No | No | Yes | Yes | - | - | Unique repair or inspection code used for vehicle maintenance activities | Repair/Inspection Code |
| ENT_003 | inspection_description | VARCHAR | 500 | - | - | No | No | No | No | Yes | - | - | Description associated with the selected repair or inspection code | Description |
| ENT_003 | service_interval_km | INTEGER | - | - | - | Yes | No | No | No | Yes | - | - | Recommended service interval in kilometers | Repair/Inspection Code |
| ENT_003 | service_interval_month | INTEGER | - | - | - | Yes | No | No | No | No | - | - | Recommended service interval in months | Description |
| ENT_003 | is_active | BOOLEAN | - | - | - | No | No | No | No | Yes | true | - | Indicates whether the inspection item is active and available for selection | Active |
| ENT_003 | created_by | VARCHAR | 100 | - | - | No | No | No | No | No | - | - | User who created the inspection item record | System |
| ENT_003 | created_dt | TIMESTAMP | - | - | - | No | No | No | No | No | NOW() | - | Record creation timestamp | System |
| ENT_003 | upd_by | VARCHAR | 100 | - | - | Yes | No | No | No | No | - | - | User who last modified the inspection item record | System |
| ENT_003 | upd_dt | TIMESTAMP | - | - | - | Yes | No | No | No | No | - | - | Record last update timestamp | System |
| ENT_003 | version | INTEGER | - | - | - | No | No | No | No | No | 0 | - | Version number used for audit and concurrency control | System |
| ENT_004 | id | BIGSERIAL | - | - | - | No | Yes | Yes | Yes | Yes | Auto | - | Unique identifier for the Periodic Maintenance inspection configuration record | ID |
| ENT_004 | activity_type_id | BIGINT | - | - | - | No | No | No | No | Yes | - | tb_m_crm_activity_type(id) | Reference to the selected activity type | Activity Type |
| ENT_004 | inspection_item_id | BIGINT | - | - | - | No | No | No | No | Yes | - | tb_m_crm_inspection_item(id) | Reference to the selected repair/inspection item master record | Repair/Inspection Code |
| ENT_004 | inspection_code | VARCHAR | 50 | - | - | No | No | No | No | Yes | - | - | Selected repair or inspection code for Periodic Maintenance setup | Repair/Inspection Code |
| ENT_004 | inspection_description | VARCHAR | 500 | - | - | No | No | No | No | No | - | - | Description automatically populated based on the selected repair/inspection code | Description |
| ENT_004 | is_mandatory | BOOLEAN | - | - | - | No | No | No | No | No | false | - | Indicates whether the inspection item is mandatory during maintenance processing | Mandatory |
| ENT_004 | status_cd | VARCHAR | 20 | - | - | No | No | No | No | Yes | ACTIVE | - | Transaction status such as ADD, UPD, DEL, or ACTIVE | Status |
| ENT_004 | is_active | BOOLEAN | - | - | - | No | No | No | No | Yes | true | - | Indicates whether the inspection configuration is active | Active |
| ENT_004 | created_by | VARCHAR | 100 | - | - | No | No | No | No | No | - | - | User who created the record | System |
| ENT_004 | created_dt | TIMESTAMP | - | - | - | No | No | No | No | No | NOW() | - | Date and time when the record was created | System |
| ENT_004 | upd_by | VARCHAR | 100 | - | - | Yes | No | No | No | No | - | - | User who last updated the record | System |
| ENT_004 | upd_dt | TIMESTAMP | - | - | - | Yes | No | No | No | No | - | - | Date and time when the record was last updated | System |
| ENT_004 | version | INTEGER | - | - | - | No | No | No | No | No | 0 | - | Version number used for audit tracking and concurrency control | System |
| ENT_005 | id | BIGSERIAL | - | - | - | No | Yes | Yes | Yes | Yes | Auto | - | Unique identifier for contact process master record | Contact Process |
| ENT_005 | process_code | VARCHAR | 50 | - | - | No | No | No | Yes | Yes | - | - | Unique code representing the contact process | Contact Process |
| ENT_005 | process_name | VARCHAR | 200 | - | - | No | No | No | Yes | Yes | - | - | Name of the contact process available for activity configuration | Contact Process |
| ENT_005 | process_description | VARCHAR | 1000 | - | - | Yes | No | No | No | No | - | - | Detailed description of the contact process and its business purpose | Contact Process |
| ENT_005 | display_order | INTEGER | - | - | - | No | No | No | No | Yes | 1 | - | Sequence number used to display contact processes in dropdown lists | System |
| ENT_005 | is_active | BOOLEAN | - | - | - | No | No | No | No | Yes | true | - | Indicates whether the contact process is active and available for selection | Active |
| ENT_005 | created_by | VARCHAR | 100 | - | - | No | No | No | No | No | - | - | User who created the record | System |
| ENT_005 | created_dt | TIMESTAMP | - | - | - | No | No | No | No | No | NOW() | - | Date and time when the record was created | System |
| ENT_005 | upd_by | VARCHAR | 100 | - | - | Yes | No | No | No | No | - | - | User who last modified the record | System |
| ENT_005 | upd_dt | TIMESTAMP | - | - | - | Yes | No | No | No | No | - | - | Date and time when the record was last updated | System |
| ENT_005 | version | INTEGER | - | - | - | No | No | No | No | No | 0 | - | Version number used for audit tracking and concurrency control | System |
| ENT_006 | id | BIGSERIAL | - | - | - | No | Yes | Yes | Yes | Yes | Auto | - | Unique identifier for communication channel master record | Channel |
| ENT_006 | channel_code | VARCHAR | 50 | - | - | No | No | No | Yes | Yes | - | - | Unique code representing the communication channel | Channel |
| ENT_006 | channel_name | VARCHAR | 200 | - | - | No | No | No | Yes | Yes | - | - | Name of the communication channel available for customer communication activities | Channel |
| ENT_006 | channel_description | VARCHAR | 1000 | - | - | Yes | No | No | No | No | - | - | Detailed description of the communication channel and its intended business usage | Channel |
| ENT_006 | display_order | INTEGER | - | - | - | No | No | No | No | Yes | 1 | - | Sequence number used to display channels in dropdown lists | System |
| ENT_006 | is_default | BOOLEAN | - | - | - | No | No | No | No | No | false | - | Indicates whether the channel is selected as the default communication option | System |
| ENT_006 | is_active | BOOLEAN | - | - | - | No | No | No | No | Yes | true | - | Indicates whether the communication channel is active and available for use | Active |
| ENT_006 | created_by | VARCHAR | 100 | - | - | No | No | No | No | No | - | - | User who created the communication channel record | System |
| ENT_006 | created_dt | TIMESTAMP | - | - | - | No | No | No | No | No | NOW() | - | Date and time when the record was created | System |
| ENT_006 | upd_by | VARCHAR | 100 | - | - | Yes | No | No | No | No | - | - | User who last modified the record | System |
| ENT_006 | upd_dt | TIMESTAMP | - | - | - | Yes | No | No | No | No | - | - | Date and time when the record was last updated | System |
| ENT_006 | version | INTEGER | - | - | - | No | No | No | No | No | 0 | - | Version number used for audit tracking and concurrency control | System |
| ENT_007 | id | BIGSERIAL | - | - | - | No | Yes | Yes | Yes | Yes | Auto | - | Unique identifier for the contact channel configuration record | ID |
| ENT_007 | activity_type_id | BIGINT | - | - | - | No | No | No | No | Yes | - | tb_m_crm_activity_type(id) | Reference to the selected activity type for which contact communication is configured | Activity Type |
| ENT_007 | contact_process_id | BIGINT | - | - | - | No | No | No | No | Yes | tb_m_crm_contact_process(id) | Reference to the selected customer contact process | Contact Process |  |
| ENT_007 | channel_id | BIGINT | - | - | - | No | No | No | No | Yes | - | tb_m_crm_channel(id) | Reference to the selected communication channel | Channel |
| ENT_007 | activity_day | INTEGER | - | - | - | No | No | No | No | Yes | 0 | - | Number of days before or after the service event when communication should be triggered | Activity Day |
| ENT_007 | display_order | INTEGER | - | - | - | No | No | No | No | Yes | 1 | - | Sequence number used to display records in the Contact Channel Details grid | No. |
| ENT_007 | status_cd | VARCHAR | 20 | - | - | No | No | No | No | Yes | ACTIVE | - | Status of the configuration record such as Active, Inactive, Added, Updated, or Deleted | Status |
| ENT_007 | is_active | BOOLEAN | - | - | - | No | No | No | No | Yes | true | - | Indicates whether the contact channel configuration is active | Active |
| ENT_007 | created_by | VARCHAR | 100 | - | - | No | No | No | No | No | - | - | User who created the contact channel configuration record | System |
| ENT_007 | created_dt | TIMESTAMP | - | - | - | No | No | No | No | No | NOW() | - | Date and time when the record was created | System |
| ENT_007 | upd_by | VARCHAR | 100 | - | - | Yes | No | No | No | No | - | - | User who last modified the record | System |
| ENT_007 | upd_dt | TIMESTAMP | - | - | - | Yes | No | No | No | No | - | - | Date and time when the record was last updated | System |
| ENT_007 | version | INTEGER | - | - | - | No | No | No | No | No | 0 | - | Version number used for audit tracking and optimistic locking control | System |
| ENT_008 | id | BIGSERIAL | - | - | - | No | Yes | Yes | Yes | Yes | Auto | - | Unique identifier for activity-contact mapping record | System |
| ENT_008 | activity_type_id | BIGINT | - | - | - | No | No | No | No | Yes | - | tb_m_crm_activity_type(id) | Reference to the configured activity type | Activity Type |
| ENT_008 | contact_process_id | BIGINT | - | - | - | No | No | No | No | Yes | - | tb_m_crm_contact_process(id) | Reference to the contact process assigned to the activity | Contact Process |
| ENT_008 | channel_id | BIGINT | - | - | - | No | No | No | No | Yes | - | tb_m_crm_channel(id) | Reference to the communication channel assigned to the contact process | Channel |
| ENT_008 | activity_day | INTEGER | - | - | - | No | No | No | No | Yes | 0 | - | Number of days before or after the service event when communication should be triggered | Activity Day |
| ENT_008 | is_active | BOOLEAN | - | - | - | No | No | No | No | Yes | true | - | Indicates whether the mapping is active | Active |
| ENT_008 | created_by | VARCHAR | 100 | - | - | No | No | No | No | No | - | - | User who created the record | System |
| ENT_008 | created_dt | TIMESTAMP | - | - | - | No | No | No | No | No | NOW() | - | Record creation timestamp | System |
| ENT_008 | upd_by | VARCHAR | 100 | - | - | Yes | No | No | No | No | - | - | User who last modified the record | System |
| ENT_008 | upd_dt | TIMESTAMP | - | - | - | Yes | No | No | No | No | - | - | Record last update timestamp | System |
| ENT_008 | version | INTEGER | - | - | - | No | No | No | No | No | 0 | - | Version number used for audit and concurrency control | System |
| ENT_009 | id | BIGSERIAL | - | - | - | No | Yes | Yes | Yes | Yes | Auto | - | Unique identifier for activity day rule record | Activity Day |
| ENT_009 | day_rule_code | VARCHAR | 50 | - | - | No | No | No | Yes | Yes | - | - | Unique code representing the activity day rule | Activity Day |
| ENT_009 | activity_day | INTEGER | - | - | - | No | No | No | No | Yes | 0 | - | Number of days before or after the service event for communication triggering | Activity Day |
| ENT_009 | day_type | VARCHAR | 20 | - | - | No | No | No | No | Yes | BEFORE | - | Indicates whether the communication occurs BEFORE or AFTER the event | Activity Day |
| ENT_009 | rule_description | VARCHAR | 500 | - | - | Yes | No | No | No | No | - | - | Description of the activity day rule used for reminders and follow-ups | Activity Day |
| ENT_009 | is_active | BOOLEAN | - | - | - | No | No | No | No | Yes | true | - | Indicates whether the activity day rule is available for selection | Active |
| ENT_009 | created_by | VARCHAR | 100 | - | - | No | No | No | No | No | - | - | User who created the record | System |
| ENT_009 | created_dt | TIMESTAMP | - | - | - | No | No | No | No | No | NOW() | - | Date and time when the record was created | System |
| ENT_009 | upd_by | VARCHAR | 100 | - | - | Yes | No | No | No | No | - | - | User who last modified the record | System |
| ENT_009 | upd_dt | TIMESTAMP | - | - | - | Yes | No | No | No | No | - | - | Date and time when the record was last updated | System |
| ENT_009 | version | INTEGER | - | - | - | No | No | No | No | No | 0 | - | Version number used for audit and concurrency control | System |

## API_Field_DB_Mapping

| API_ID | Request_Field | Response_Field | Entity_ID | DB_Column | Transformation | Transformation_Expression | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| API-WCRM010301-002 | activityType | activityType | ENT_001 | activity_type_code | Direct Mapping | activity_type_code = activityType | Load selected activity type |
| API-WCRM010301-002 | activityType | serviceRepairInspectionItems.inspectionCode | ENT_004 | inspection_code | Direct Mapping | inspection_code | Load inspection code |
| API-WCRM010301-002 | activityType | serviceRepairInspectionItems.mandatoryFlag | ENT_004 | mandatory_flag | Boolean Conversion | Y→true, N→false | Load mandatory flag |
| API-WCRM010301-002 | activityType | contactChannelDetails.contactProcess | ENT_007 | contact_process_code | Direct Mapping | contact_process_code | Load contact process |
| API-WCRM010301-002 | activityType | contactChannelDetails.channel | ENT_007 | channel_code | Direct Mapping | channel_code | Load communication channel |
| API-WCRM010301-002 | activityType | contactChannelDetails.activityDay | ENT_007 | activity_day | Direct Mapping | activity_day | Load activity day |
| API-WCRM010301-003 | activityType | activityId | ENT_001 | activity_id | Auto Generated | Sequence/Identity Value | Generate activity ID |
| API-WCRM010301-003 | inspectionItems.inspectionCode | inspectionCode | ENT_004 | inspection_code | Direct Mapping | inspection_code | Save inspection code |
| API-WCRM010301-003 | inspectionItems.mandatoryFlag | mandatoryFlag | ENT_004 | mandatory_flag | Boolean Conversion | true→Y, false→N | Save mandatory flag |
| API-WCRM010301-003 | contactChannels.contactProcess | contactProcess | ENT_007 | contact_process_code | Direct Mapping | contact_process_code | Save contact process |
| API-WCRM010301-003 | contactChannels.channel | channel | ENT_007 | channel_code | Direct Mapping | channel_code | Save communication channel |
| API-WCRM010301-003 | contactChannels.activityDay | activityDay | ENT_007 | activity_day | Direct Mapping | activity_day | Save activity day |
| API-WCRM010301-004 | activityId | activityId | ENT_001 | activity_id | Record Identification | activity_id = {activityId} | Identify record for update |
| API-WCRM010301-004 | inspectionItems.inspectionCode | inspectionCode | ENT_004 | inspection_code | Direct Mapping | inspection_code | Update inspection code |
| API-WCRM010301-004 | inspectionItems.mandatoryFlag | mandatoryFlag | ENT_004 | mandatory_flag | Boolean Conversion | true→Y, false→N | Update mandatory flag |
| API-WCRM010301-004 | contactChannels.contactProcess | contactProcess | ENT_007 | contact_process_code | Direct Mapping | contact_process_code | Update contact process |
| API-WCRM010301-004 | contactChannels.channel | channel | ENT_007 | channel_code | Direct Mapping | channel_code | Update communication channel |
| API-WCRM010301-004 | contactChannels.activityDay | activityDay | ENT_007 | activity_day | Direct Mapping | activity_day | Update activity day |
| API-WCRM010301-005 | detailId | N/A | ENT_007 | detail_id | Record Identification | detail_id = {detailId} | Delete contact channel detail |
