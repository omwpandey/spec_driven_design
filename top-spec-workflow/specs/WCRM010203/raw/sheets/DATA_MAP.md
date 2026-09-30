# DATA_MAP_DCM_Vehicle_Dealer_WCRM010203.xlsx

## DB_Entity

| Entity_ID | Table_Name | Schema_Name | Description | API_IDs |
| --- | --- | --- | --- | --- |
| ENT-DCM-001 | tb_m_crm_activity (Activity Master) | crm | Stores activity master configuration for DCM Vehicle activities including Activity ID, Dealer ID, Activity Type, Activity Name, Activity Description, Customer Type, Suppress Days, activity status, and audit information. This table represents the primary activity configuration maintained through Setup Activity by Dealer. | API_001, API_003, API_004 |
| ENT-DCM-002 | tb_m_crm_activity_item_detail  (Activity Item Detail Master) | crm | Stores DCM Vehicle Item details configured for an activity including selected item values, mandatory indicators, display sequence, status, remarks, dealer information, and audit information. These records define the DCM Vehicle Items associated with the activity configuration. | API_001, API_002, API_003 |
| ENT-DCM-003 | tb_m_crm_contact_process_channel (Contact Process Channel Master) | crm | Stores Contact Process and Communication Channel configurations associated with an activity, including Contact Process, Contact Channel, Activity Day, Assign Group, display sequence, status, dealer information, and audit details. These configurations define how and when customer communications are executed for DCM Vehicle activities. | API_001, API_003 |
| ENT-DCM-004 | tb_m_crm_activity_type (Activity Type Master) | crm | Stores master data for Activity Types available in Activity Setup, including Activity Type Code, Activity Type Name, Activity Type Description, dealer applicability, and audit information. Used to populate the Activity Type selection section. | API_001 |
| ENT-DCM-005 | tb_m_crm_code_master (CRM Code Master) | crm | Stores configurable CRM master codes used throughout Activity Setup, including Customer Type, Contact Process, Contact Channel, Status values, and other configurable dropdown values. Provides centralized code management for screen configurations and business rules. | API_005, API_006, API_007 |
| ENT-DCM-006 | tb_m_crm_dcm_vehicle_item (DCM Vehicle Item Master) | crm | Stores DCM Vehicle Item master records maintained by TMT, including item name, mileage, duration/period, mandatory flag, display sequence, status, and audit information. These items are displayed in the DCM Vehicle Item section and can be selected by dealers during activity configuration. | API_001, API_002 |
| ENT-DCM-007 | tb_t_hist_crm_activity | crm | stores historical records of activity configurations for audit and version tracking purposes. History records are created whenever an activity configuration is updated or deleted, capturing activity details, version number, change type, change reason, user information, and change timestamp. This table enables traceability of activity modifications and supports audit requirements. | API_003, API_004 |

## DB_Columns

| Entity_ID | Column_Name | DB_Type | Length | Precision | Scale | Nullable | Primary_Key | Auto_Generated | Unique | Indexed | Default_Value | FK_Reference | Description | Maps_To_Field |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ENT-DCM-001 | id | BIGSERIAL | - | - | - | N | Y | Y | Y | Y | - | - | Technical primary key. | System |
| ENT-DCM-001 | activity_id | BIGSERIAL | 10 | - | - | N | N | Y | Y | Y | - | - | System-generated business Activity ID displayed on screen and used to identify the activity configuration. | activityId |
| ENT-DCM-001 | dealer_id | VARCHAR | 50 | - | - | N | N | N | N | Y | - | - | Dealer identifier owning the activity configuration. | dealerId |
| ENT-DCM-001 | activity_type_id | BIGSERIAL | - | - | - | N | N | N | N | Y | - | ENT-DCM-004.activity_type_id | Reference to Activity Type Master. | activityTypeId |
| ENT-DCM-001 | activity_name | VARCHAR | 250 | - | - | N | N | N | N | Y | - | - | Name of the DCM Vehicle activity. | activityName |
| ENT-DCM-001 | activity_description | VARCHAR | 1000 | - | - | Y | N | N | N | N | - | - | Description of the DCM Vehicle activity. | activityDescription |
| ENT-DCM-001 | status | VARCHAR | 20 | - | - | N | N | N | N | Y | ACTIVE | - | Current activity status. | status |
| ENT-DCM-001 | customer_type | VARCHAR | 50 | - | - | N | N | N | N | Y | ALL | ENT-DCM-005.code_val | Customer category applicable for the activity. | customerType |
| ENT-DCM-001 | suppress_days | INTEGER | - | - | - | N | N | N | N | N | 90 | - | Number of days during which customer contact is suppressed before communication is initiated. | suppressDays |
| ENT-DCM-001 | created_by | VARCHAR | 100 | - | - | N | N | N | N | N | - | - | User who created the record. | System |
| ENT-DCM-001 | created_dt | TIMESTAMP | - | - | - | N | N | N | N | N | NOW() | - | Record creation timestamp. | System |
| ENT-DCM-001 | upd_by | VARCHAR | 100 | - | - | Y | N | N | N | N | - | - | User who last modified the record. | System |
| ENT-DCM-001 | update_dt | TIMESTAMP | - | - | - | Y | N | N | N | N | - | - | Record last update timestamp. | System |
| ENT-DCM-001 | version | BIGSERIAL | - | - | - | N | N | N | N | N | 0 | - | Optimistic locking version. | System |
| ENT-DCM-002 | id | BIGSERIAL | - | - | - | N | Y | Y | Y | Y | - | - | Technical primary key. | System |
| ENT-DCM-002 | activity_id | VARCHAR | 50 | - | - | N | N | N | N | Y | - | ENT-DCM-001.activity_id | Reference to Activity Master record. | activityId |
| ENT-DCM-002 | dealer_id | VARCHAR | 50 | - | - | N | N | N | N | Y | - | - | Dealer identifier associated with the activity item configuration. | dealerId |
| ENT-DCM-002 | item_value | VARCHAR | 255 | - | - | N | N | N | N | Y | - | ENT-DCM-006.id | DCM Vehicle Item selected for the activity configuration. | itemValue |
| ENT-DCM-002 | mandatory_flg | VARCHAR | 1 | - | - | N | N | N | N | N | N | - | Indicates whether the item is mandatory. (Y/N) | mandatoryFlg |
| ENT-DCM-002 | seq_no | INTEGER | - | - | - | N | N | N | N | Y | 1 | - | Display sequence of the DCM Vehicle Item. | sequenceNo |
| ENT-DCM-002 | status | VARCHAR | 20 | - | - | N | N | N | N | Y | ACTIVE | - | Record status. (ADD, UPD, DEL, ACTIVE, INACTIVE) | status |
| ENT-DCM-002 | remarks | VARCHAR | 500 | - | - | Y | N | N | N | N | - | - | Additional remarks related to the activity item configuration. | remarks |
| ENT-DCM-002 | created_by | VARCHAR | 100 | - | - | N | N | N | N | N | - | - | User who created the record. | System |
| ENT-DCM-002 | created_date | TIMESTAMP | - | - | - | N | N | N | N | N | NOW() | - | Record creation timestamp. | System |
| ENT-DCM-002 | upd_by | VARCHAR | 100 | - | - | Y | N | N | N | N | - | - | User who last modified the record. | System |
| ENT-DCM-002 | update_dt | TIMESTAMP | - | - | - | Y | N | N | N | N | - | - | Last modified timestamp. | System |
| ENT-DCM-002 | version | BIGSERIAL | - | - | - | N | N | N | N | N | 0 | - | Optimistic locking version number. | System |
| ENT-DCM-003 | id | BIGSERIAL | - | - | - | N | Y | Y | Y | Y | - | - | Technical primary key. | System |
| ENT-DCM-003 | activity_id | VARCHAR | 50 | - | - | N | N | N | N | Y | - | ENT-DCM-001.activity_id | Reference to Activity Master record. | activityId |
| ENT-DCM-003 | dealer_id | VARCHAR | 50 | - | - | N | N | N | N | Y | - | - | Dealer identifier associated with the contact process channel configuration. | dealerId |
| ENT-DCM-003 | contact_process | VARCHAR | 100 | - | - | N | N | N | N | Y | - | ENT-DCM-005.code_val | Contact Process configured for customer communication. | contactProcess |
| ENT-DCM-003 | channel | VARCHAR | 50 | - | - | N | N | N | N | Y | - | ENT-DCM-005.code_val | Communication Channel used for customer contact. | channel |
| ENT-DCM-003 | activity_day | INTEGER | - | - | - | N | N | N | N | N | -1 | - | Number of days before the target activity date when communication should occur. | activityDay |
| ENT-DCM-003 | seq_no | INTEGER | - | - | - | N | N | N | N | Y | 1 | - | Display sequence of Contact Process and Channel record. | sequenceNo |
| ENT-DCM-003 | status | VARCHAR | 20 | - | - | N | N | N | N | Y | ACTIVE | - | Record status (ADD, UPD, DEL, ACTIVE, INACTIVE). | status |
| ENT-DCM-003 | assign_group | VARCHAR | 100 | - | - | N | N | N | N | Y | - | ENT-DCM-005.code_val | Assign Group responsible for executing the communication activity. | assignGroup |
| ENT-DCM-003 | remarks | VARCHAR | 500 | - | - | Y | N | N | N | N | - | - | Additional remarks related to Contact Process and Channel configuration. | remarks |
| ENT-DCM-003 | created_by | VARCHAR | 100 | - | - | N | N | N | N | N | - | - | User who created the record. | System |
| ENT-DCM-003 | created_dt | TIMESTAMP | - | - | - | N | N | N | N | N | NOW() | - | Record creation timestamp. | System |
| ENT-DCM-003 | upd_by | VARCHAR | 100 | - | - | Y | N | N | N | N | - | - | User who last modified the record. | System |
| ENT-DCM-003 | update_dt | TIMESTAMP | - | - | - | Y | N | N | N | N | - | - | Last modified timestamp. | System |
| ENT-DCM-003 | version | BIGSERIAL | - | - | - | N | N | N | N | N | 0 | - | Optimistic locking version number. | System |
| ENT-DCM-004 | activity_type_id | BIGSERIAL | - | - | - | N | Y | Y | Y | Y | - | - | Unique identifier of the Activity Type. | activityTypeId |
| ENT-DCM-004 | activity_type_code | VARCHAR | 50 | - | - | N | N | N | Y | Y | - | - | System code representing the Activity Type. | activityTypeCode |
| ENT-DCM-004 | activity_type_name | VARCHAR | 100 | - | - | N | N | N | N | Y | - | - | Display name of the Activity Type. | activityTypeName |
| ENT-DCM-004 | activity_type_desc | VARCHAR | 500 | - | - | Y | N | N | N | N | - | - | Detailed description of the Activity Type and its business purpose. | activityTypeDescription |
| ENT-DCM-004 | dealer_id | VARCHAR | 50 | - | - | Y | N | N | N | Y | - | - | Dealer identifier for dealer-specific activity type configuration, if applicable. | dealerId |
| ENT-DCM-004 | created_by | VARCHAR | 100 | - | - | N | N | N | N | N | - | - | User who created the record. | System |
| ENT-DCM-004 | created_dt | TIMESTAMP | - | - | - | N | N | N | N | N | NOW() | - | Record creation timestamp. | System |
| ENT-DCM-004 | upd_by | VARCHAR | 100 | - | - | Y | N | N | N | N | - | - | User who last modified the record. | System |
| ENT-DCM-004 | update_dt | TIMESTAMP | - | - | - | Y | N | N | N | N | - | - | Record last update timestamp. | System |
| ENT-DCM-004 | version | BIGSERIAL | - | - | - | N | N | N | N | N | 0 | - | Optimistic locking version number. | System |
| ENT-DCM-005 | id | BIGSERIAL | - | - | - | N | Y | Y | Y | Y | - | - | Technical primary key. | System |
| ENT-DCM-005 | mst_typ | VARCHAR | 50 | - | - | N | N | N | N | Y | - | - | Master type category used to group CRM master codes. | masterType |
| ENT-DCM-005 | code_val | VARCHAR | 100 | - | - | N | N | N | Y | Y | - | - | Internal code value used by the application. | codeValue |
| ENT-DCM-005 | code_desc | VARCHAR | 255 | - | - | N | N | N | N | Y | - | - | Description displayed to users. | codeDescription |
| ENT-DCM-005 | disp_flg | VARCHAR | 1 | - | - | N | N | N | N | N | Y | - | Indicates whether the value is displayed on screen (Y/N). | displayFlag |
| ENT-DCM-005 | code_len | NUMERIC | 5 | - | - | Y | N | N | N | N | - | - | Maximum allowed length of code value. | codeLength |
| ENT-DCM-005 | desc_len | NUMERIC | 5 | - | - | Y | N | N | N | N | - | - | Maximum allowed length of description. | descriptionLength |
| ENT-DCM-005 | del_flg | VARCHAR | 1 | - | - | N | N | N | N | Y | N | - | Logical deletion indicator (Y/N). | deleteFlag |
| ENT-DCM-005 | seq | VARCHAR | 10 | - | - | Y | N | N | N | Y | - | - | Display sequence order of the code value. | sequence |
| ENT-DCM-005 | code_desc_th | VARCHAR | 255 | - | - | Y | N | N | N | N | - | - | Thai description displayed for localized users. | codeDescriptionTh |
| ENT-DCM-005 | dm_con_dt | TIMESTAMP | - | - | - | Y | N | N | N | N | - | - | Data migration or conversion date. | conversionDate |
| ENT-DCM-005 | created_by | VARCHAR | 100 | - | - | N | N | N | N | N | - | - | User who created the record. | System |
| ENT-DCM-005 | created_dt | TIMESTAMP | - | - | - | N | N | N | N | N | NOW() | - | Record creation timestamp. | System |
| ENT-DCM-005 | upd_by | VARCHAR | 100 | - | - | Y | N | N | N | N | - | - | User who last modified the record. | System |
| ENT-DCM-005 | update_date | TIMESTAMP | - | - | - | Y | N | N | N | N | - | - | Last modified timestamp. | System |
| ENT-DCM-005 | version | INTEGER | - | - | - | N | N | N | N | N | 0 | - | Optimistic locking version number. | System |
| ENT-DCM-006 | id | BIGSERIAL | - | - | - | N | Y | Y | Y | Y | - | - | Technical primary key. | System |
| ENT-DCM-006 | item_code | VARCHAR | 50 | - | - | N | N | N | Y | Y | - | - | Unique code identifying the DCM Vehicle Item. | itemCode |
| ENT-DCM-006 | item_name | VARCHAR | 255 | - | - | N | N | N | N | Y | - | - | Name of the DCM Vehicle Item displayed to users. | itemName |
| ENT-DCM-006 | mileage | VARCHAR | 50 | - | - | Y | N | N | N | N | - | - | Mileage criteria configured for the DCM Vehicle Item. | mileage |
| ENT-DCM-006 | duration_period | VARCHAR | 50 | - | - | Y | N | N | N | N | - | - | Duration or service period configured for the DCM Vehicle Item. | durationPeriod |
| ENT-DCM-006 | item_desc | VARCHAR | 500 | - | - | Y | N | N | N | N | - | - | Detailed description of the DCM Vehicle Item. | itemDescription |
| ENT-DCM-006 | mandatory_flg | VARCHAR | 1 | - | - | N | N | N | N | Y | N | - | Indicates whether the item is mandatory. (Y/N) | mandatoryFlg |
| ENT-DCM-006 | seq_no | INTEGER | - | - | - | N | N | N | N | Y | 1 | - | Display sequence of the DCM Vehicle Item. | sequenceNo |
| ENT-DCM-006 | status | VARCHAR | 20 | - | - | N | N | N | N | Y | ACTIVE | - | Item status. (ACTIVE/INACTIVE) | status |
| ENT-DCM-006 | remarks | VARCHAR | 500 | - | - | Y | N | N | N | N | - | - | Additional remarks related to the DCM Vehicle Item. | remarks |
| ENT-DCM-006 | created_by | VARCHAR | 100 | - | - | N | N | N | N | N | - | - | User who created the record. | System |
| ENT-DCM-006 | created_dt | TIMESTAMP | - | - | - | N | N | N | N | N | NOW() | - | Record creation timestamp. | System |
| ENT-DCM-006 | upd_by | VARCHAR | 100 | - | - | Y | N | N | N | N | - | - | User who last modified the record. | System |
| ENT-DCM-006 | update_dt | TIMESTAMP | - | - | - | Y | N | N | N | N | - | - | Last modified timestamp. | System |
| ENT-DCM-006 | version | INTEGER | - | - | - | N | N | N | N | N | 0 | - | Optimistic locking version number. | System |
| ENT-DCM-007 | id | BIGSERIAL | - | - | - | N | Y | Y | Y | Y | - | - | Technical primary key. | System |
| ENT-DCM-007 | source_activity_id | BIGINT | - | - | - | N | N | N | N | Y | - | ENT-DCM-001.id | Reference to source Activity Master record. | sourceActivityId |
| ENT-DCM-007 | activity_id | VARCHAR | 10 | - | - | N | N | N | N | Y | - | ENT-DCM-001.activity_id | Activity business identifier. | activityId |
| ENT-DCM-007 | dealer_id | VARCHAR | 5 | - | - | N | N | N | N | Y | - | - | Dealer code associated with the activity. | dealerId |
| ENT-DCM-007 | activity_type_id | VARCHAR | 10 | - | - | N | N | N | N | Y | ENT-DCM-004.activity_type_id | Reference to Activity Type Master. | activityTypeId |  |
| ENT-DCM-007 | activity_name | VARCHAR | 250 | - | - | N | N | N | N | Y | - | - | Activity name at the time of update/delete operation. | activityName |
| ENT-DCM-007 | activity_description | VARCHAR | 1000 | - | - | Y | N | N | N | N | - | - | Activity description. | activityDescription |
| ENT-DCM-007 | status | VARCHAR | 20 | - | - | N | N | N | N | Y | - | - | Activity status (ACTIVE/INACTIVE). | status |
| ENT-DCM-007 | customer_type | VARCHAR | 200 | - | - | Y | N | N | N | N | - | ENT-DCM-005.code_val | Applicable customer type. | customerType |
| ENT-DCM-007 | suppress_days | INTEGER | - | - | - | Y | N | N | N | N | - | - | Suppress Days value captured in activity history. | suppressDays |
| ENT-DCM-007 | version_no | INTEGER | - | - | - | N | N | N | N | N | 1 | - | Activity version number captured in history. | versionNo |
| ENT-DCM-007 | change_type | VARCHAR | 20 | - | - | N | N | N | N | Y | - | - | Type of change performed (UPDATE, DELETE). | changeType |
| ENT-DCM-007 | change_reason | VARCHAR | 500 | - | - | Y | N | N | N | N | - | - | Reason for change, if provided. | changeReason |
| ENT-DCM-007 | change_by | VARCHAR | 100 | - | - | N | N | N | N | Y | - | - | User who performed the update or delete operation. | changeBy |
| ENT-DCM-007 | change_date | TIMESTAMP | - | - | - | N | N | N | N | N | NOW() | - | Date and time when the change was recorded. | changeDate |
| ENT-DCM-007 | created_by | VARCHAR | 100 | - | - | N | N | N | N | N | - | - | User who created the history record. | System |
| ENT-DCM-007 | created_date | TIMESTAMP | - | - | - | N | N | N | N | N | NOW() | - | History record creation timestamp. | System |
| ENT-DCM-007 | upd_by | VARCHAR | 100 | - | - | Y | N | N | N | N | - | - | User who last modified the history record. | System |
| ENT-DCM-007 | update_dt | TIMESTAMP | - | - | - | Y | N | N | N | N | - | - | Last modified timestamp. | System |
| ENT-DCM-007 | version | INTEGER | - | - | - | N | N | N | N | N | 0 | - | Optimistic locking version number. | System |

## API_Field_DB_Mapping

| API_ID | Request_Field | Response_Field | Entity_ID | DB_Column | Transformation | Transformation_Expression | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| API_001 | dealerId | - | ENT-DCM-001 | dealer_id | Direct Mapping | dealerId → dealer_id | Dealer context used to retrieve activity configuration. |
| API_001 | - | activityId | ENT-DCM-001 | activity_id | Direct Mapping | activity_id → activityId | Activity ID displayed in Activity Setup section. |
| API_001 | - | dealerId | ENT-DCM-001 | dealer_id | Direct Mapping | dealer_id → dealerId | Dealer identifier returned with activity configuration. |
| API_001 | - | activityTypeId | ENT-DCM-001 | activity_type_id | Direct Mapping | activity_type_id → activityTypeId | Activity Type identifier returned to UI. |
| API_001 | - | activityName | ENT-DCM-001 | activity_name | Direct Mapping | activity_name → activityName | Activity Name displayed in Activity Setup section. |
| API_001 | - | activityDescription | ENT-DCM-001 | activity_description | Direct Mapping | activity_description → activityDescription | Activity Description displayed in Activity Setup section. |
| API_001 | - | customerType | ENT-DCM-001 | customer_type | Direct Mapping | customer_type → customerType | Customer Type configuration. |
| API_001 | - | contactChannelId | ENT-DCM-003 | id | Direct Mapping | id → contactChannelId | Contact Process Channel record identifier. |
| API_001 | - | sequenceNo | ENT-DCM-003 | seq_no | Direct Mapping | seq_no → sequenceNo | Contact Process Channel sequence number. |
| API_001 | - | status | ENT-DCM-003 | status | Direct Mapping | status → status | Record status. |
| API_001 | - | contactProcess | ENT-DCM-003 | contact_process | Direct Mapping | contact_process → contactProcess | Contact Process value. |
| API_001 | - | channel | ENT-DCM-003 | channel | Direct Mapping | channel → channel | Communication Channel value. |
| API_001 | - | activityDay | ENT-DCM-003 | activity_day | Direct Mapping | activity_day → activityDay | Activity Day value. |
| API_001 | - | assignGroup | ENT-DCM-003 | assign_group | Direct Mapping | assign_group → assignGroup | Assign Group value. |
| API_001 | - | suppressDays | ENT-DCM-001 | suppress_days | Direct Mapping | suppress_days → suppressDays | Suppress Days configured for the activity. |
| API_001 | - | mileage | ENT-DCM-006 | mileage | Direct Mapping | mileage → mileage | Mileage configured for DCM Vehicle Item. |
| API_001 | - | durationPeriod | ENT-DCM-006 | duration_period | Direct Mapping | duration_period → durationPeriod | Duration/Period configured for DCM Vehicle Item. |
| API_002 | - | itemId | ENT-DCM-006 | id | Direct Mapping | id → itemId | DCM Vehicle Item identifier. |
| API_002 | - | itemCode | ENT-DCM-006 | item_code | Direct Mapping | item_code → itemCode | DCM Vehicle Item code. |
| API_002 | - | itemName | ENT-DCM-006 | item_name | Direct Mapping | item_name → itemName | DCM Vehicle Item name. |
| API_002 | - | sequenceNo | ENT-DCM-006 | seq_no | Direct Mapping | seq_no → sequenceNo | DCM Vehicle Item sequence. |
| API_002 | - | mandatoryFlg | ENT-DCM-006 | mandatory_flg | Direct Mapping | mandatory_flg → mandatoryFlg | Mandatory indicator maintained by TMT. |
| API_002 | - | status | ENT-DCM-006 | status | Direct Mapping | status → status | Item status. |
| API_002 | - | mileage | ENT-DCM-006 | mileage | Direct Mapping | mileage → mileage | Mileage configured for DCM Vehicle Item. |
| API_002 | - | durationPeriod | ENT-DCM-006 | duration_period | Direct Mapping | duration_period → durationPeriod | Duration/Period configured for DCM Vehicle Item. |
| API_003 | dealerId | - | ENT-DCM-001 | dealer_id | Direct Mapping | dealerId → dealer_id | Save dealer-specific activity configuration. |
| API_003 | activityId | - | ENT-DCM-001 | activity_id | Direct Mapping | activityId → activity_id | Activity ID used for update. |
| API_003 | activityTypeId | - | ENT-DCM-001 | activity_type_id | Direct Mapping | activityTypeId → activity_type_id | Save Activity Type. |
| API_003 | activityName | - | ENT-DCM-001 | activity_name | Direct Mapping | activityName → activity_name | Save Activity Name. |
| API_003 | activityDescription | - | ENT-DCM-001 | activity_description | Direct Mapping | activityDescription → activity_description | Save Activity Description. |
| API_003 | customerType | - | ENT-DCM-001 | customer_type | Direct Mapping | customerType → customer_type | Save Customer Type. |
| API_003 | dcmVehicleItemId | - | ENT-DCM-002 | dcm_vehicle_item_id | Direct Mapping | dcmVehicleItemId → dcm_vehicle_item_id | Save selected DCM Vehicle Item. |
| API_003 | isMandatory | - | ENT-DCM-002 | is_mandatory | Direct Mapping | isMandatory → is_mandatory | Save mandatory indicator. |
| API_003 | sequenceNo | - | ENT-DCM-002 | sequence_no | Direct Mapping | sequenceNo → sequence_no | Save display sequence. |
| API_003 | status | - | ENT-DCM-002 | status | Direct Mapping | status → status | Save item status. |
| API_003 | remarks | - | ENT-DCM-002 | remarks | Direct Mapping | remarks → remarks | Save item remarks. |
| API_003 | contactProcess | - | ENT-DCM-003 | contact_process | Direct Mapping | contactProcess → contact_process | Save Contact Process. |
| API_003 | channel | - | ENT-DCM-003 | channel | Direct Mapping | channel → channel | Save communication channel. |
| API_003 | activityDay | - | ENT-DCM-003 | activity_day | Direct Mapping | activityDay → activity_day | Save Activity Day. |
| API_003 | assignGroup | - | ENT-DCM-003 | assign_group | Direct Mapping | assignGroup → assign_group | Save Assign Group. |
| API_003 | sequenceNo | - | ENT-DCM-003 | seq_no | Direct Mapping | sequenceNo → seq_no | Save display sequence. |
| API_003 | remarks | - | ENT-DCM-003 | remarks | Direct Mapping | remarks → remarks | Save Contact Channel remarks. |
| API_003 | status | - | ENT-DCM-003 | status | Direct Mapping | status → status | Save ADD/UPD/DEL status. |
| API_003 | - | dealerId | ENT-DCM-001 | dealer_id | Direct Mapping | dealer_id → dealerId | Dealer returned after save. |
| API_003 | - | activityId | ENT-DCM-001 | activity_id | Direct Mapping | activity_id → activityId | Saved Activity ID returned. |
| API_003 | suppressDays | - | ENT-DCM-001 | suppress_days | Direct Mapping | suppressDays → suppress_days | Save Suppress Days configuration. |
| API_004 | activityId | - | ENT-DCM-001 | activity_id | Direct Mapping | activityId → activity_id | Activity selected for inactivation. |
| API_004 | - | activityId | ENT-DCM-001 | activity_id | Direct Mapping | activity_id → activityId | Activity identifier returned. |
| API_004 | - | activityStatus | ENT-DCM-001 | status | Constant Update | status='INACTIVE' | Activity is marked INACTIVE instead of physical deletion. |
| API_005 | - | customerTypeCode | ENT-DCM-005 | code_val | Direct Mapping | code_val → customerTypeCode | Customer Type code. |
| API_005 | - | customerTypeName | ENT-DCM-005 | code_desc | Direct Mapping | code_desc → customerTypeName | Customer Type description. |
| API_006 | - | processCode | ENT-DCM-005 | code_val | Direct Mapping | code_val → processCode | Contact Process code. |
| API_006 | - | processName | ENT-DCM-005 | code_desc | Direct Mapping | code_desc → processName | Contact Process description. |
| API_007 | - | channelCode | ENT-DCM-005 | code_val | Direct Mapping | code_val → channelCode | Communication Channel code. |
| API_007 | - | channelName | ENT-DCM-005 | code_desc | Direct Mapping | code_desc → channelName | Communication Channel description. |
