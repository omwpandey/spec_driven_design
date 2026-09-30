const en = {
  // Common Buttons
  save_btn: 'Save',
  cancel_btn: 'Cancel',
  delete_btn: 'Delete',
  add_btn: 'Add',
  edit_btn: 'Edit',
  search_btn: 'Search',
  reset_btn: 'Reset',
  back_btn: 'Back',
  download_btn: 'Download',
  upload_btn: 'Upload',
  confirm_btn: 'Confirm',
  yes_btn: 'Yes',
  no_btn: 'No',
  close_btn: 'Close',
  ok_btn: 'OK',
  submit_btn: 'Submit',

  // Header
  header_search_plate: 'Plate',
  header_search_mobile: 'Mobile',
  header_search_phone: 'Phone',
  header_search_name: 'Name',
  header_search_vin: 'VIN',

  // TopBar
  topbar_dealer: 'Dealer',
  topbar_branch: 'Branch',

  // Sidebar
  nav_dashboard: 'Dashboard',
  nav_activity_setup: 'Activity Setup',
  nav_customer_data_check: 'Customer Data Check',
  nav_call_center: 'Call Center Allocation',
  nav_today_customer: "Today's Customer List",
  nav_repair_bay: 'Repair Bay Schedule (SMB)',
  nav_incoming_call: 'Incoming Call List',
  nav_outgoing_call: 'Outgoing Call List',
  nav_data_verification: 'Customer Data Verification',
  nav_appointments: 'Appointments',
  nav_service_follow: 'Service Follow-up',
  nav_service_confirm: 'Service Confirmation',
  nav_post_service: 'Post Service Followup',
  nav_inactive: 'Inactive Customers',
  nav_news: 'Information/News',
  nav_settings: 'Settings',
  nav_logout: 'Logout',
  nav_activity_list: 'Activity List',
  nav_activity_custom: 'Activity List (Custom)',
  nav_activity_maintenance: 'Dealer Activity Maintenance',
  nav_tmt_activity: 'TMT Activity List',
  nav_tmt_activity_maintenance: 'TMT Activity Maintenance',
  nav_follow_list: 'Follow-up List',
  nav_follow_confirm: 'Confirmation',
  nav_call_center_group_mang: "Call Center Group Management",
  nav_assign_call_center_staff_to_group:"Assign Call Center Staff to Group",

  // Profile
  profile_my_profile: 'My Profile',
  profile_change_password: 'Change Password',
  profile_notifications: 'Notifications',
  profile_settings: 'Settings',
  profile_logout: 'Logout',
  profile_role: 'Role',

  // TMT PM Activity Maintenance Page
  tmt_activity_maintenance: 'TMT Activity Maintenance',

  // Activity Setup Page
  activity_setup_title: 'Dealer Activity Maintenance',
  activity_type_section: 'Activity Type',
  activity_setup_section: 'Activity Setup',
  activity_id: 'Activity ID',
  activity_name: 'Activity Name',
  activity_description: 'Activity Description',
  customer_type: 'Customer Type',
  heijunka_days: 'Heijunka Days',
  suppress_days: 'Suppress Days',
  delete_activity: 'Delete Activity',
  assign_followup_staff: 'Assign Follow-up Staff',
  set_Template: 'Set Template',
  col_assign_group: 'ASSIGN GROUP',

  // Activity Types
  periodic_maintenance: 'Periodic Maintenance',
  additional_rejected: 'Additional Rejected Job',
  dcm_vehicle: 'DCM Vehicle',
  tcfr: 'TCFR+',
  ssc_csc: 'SSC/CSC',
  body_paint: 'Body & Paint',
  bp_insurance: 'BP Insurance Renewal',
  post_service_followup: 'Post Service Follow Up (PSFU)',

  // Customer Types
  customer_individual: 'Individual',
  customer_corporate: 'Corporate',
  customer_all: 'All',

  // Summary Cards
  total_vehicles_db: 'Total Vehicles in Database',
  total_individual_customers: 'Total Individual Customers',
  total_corporate_customers: 'Total Corporate Customers',

  // Service Repair Section
  service_repair_section: 'Service & Repair Inspection Item',
  select_range: 'Select Range',
  select_all: 'Select All',
  none: 'None',
  col_no: 'No.',
  col_repair_code: 'REPAIR/INSPECTION CODE',
  col_description: 'DESCRIPTION',
  col_mandatory: 'MANDATORY',

  // Contact Channel Section
  contact_channel_section: 'Contact Channel Details',
  col_status: 'STATUS',
  col_contact_process: 'CONTACT PROCESS',
  col_channel: 'CHANNEL',
  col_activity_day: 'ACTIVITY DAY',
  col_action: 'ACTION',

  // TMT PM Activity Maintenance — Validation Messages (DR)
  tmt_pm_save_dialog_title: 'Save',
  tmt_pm_confirm_dialog_title: 'Confirm',
  tmt_pm_wrn0001_no_changes: 'No changes to save.',
  tmt_pm_wrn0003_save_confirm: 'Do you wish to save changes?',
  tmt_pm_err0002_max_length: '{field} must not exceed {max} characters.',
  tmt_pm_err0020_range: '{field} must be between {min} and {max}.',

  // Contact Process Options
  opt_service_followup: 'Service Follow-up',
  opt_appointment_confirmation: 'Appointment Confirmation',
  opt_reminder: 'Reminder',

  // Channel Options
  opt_call_out: 'Call Out',
  opt_email: 'Email',
  opt_sms: 'SMS',
  opt_line_oa: 'Line OA',

  // Delete Dialog
  delete_dialog_title: 'Delete Activity',
  delete_dialog_message: 'Deletion of this record would delete and no plan would be generated. Do you want to continue for deletion?',

  // Validation
  validation_required: '{field} is required',
  validation_invalid_number: '{field} must be a whole number',
  validation_range: 'Must be between {min} and {max}',
  validation_errors_title: 'Validation Errors',
  validation_errors_message: 'Please correct the following errors before saving:',
  validation_row_errors: '{count} row(s) have validation errors. Fix highlighted cells before saving.',

  // Error Handling
  error_generic_title: 'Something went wrong',
  error_generic_description: 'An unexpected error occurred. Please try again.',
  error_network_offline: 'You are currently offline. Please check your internet connection.',
  error_network_slow: 'Your connection appears to be slow. Some features may take longer to load.',
  error_network_timeout: 'The connection timed out. Please check your internet and try again.',
  error_session_expired: 'Your session has expired. Please log in again.',
  auth_entra_not_configured: 'Microsoft Entra is not configured. Set TOPS_AUTH_ID in your environment.',
  error_permission_denied: 'You do not have permission to perform this action.',
  error_not_found: 'The requested resource was not found.',
  error_server: 'An unexpected server error occurred. Please try again later.',
  error_validation: 'Please correct the highlighted errors before submitting.',
  error_rate_limit: 'Too many requests. Please wait a moment before trying again.',
  error_conflict: 'This record has been modified by another user. Please refresh and try again.',
  error_service_unavailable: 'The service is currently unavailable. Please try again later.',
  error_retry_btn: 'Try Again',
  error_reload_btn: 'Refresh Page',
  error_go_home_btn: 'Go to Home',
  error_reference: 'Error Reference: {id}',

  // Breadcrumbs
  breadcrumb_activity_setup: 'Activity Setup',
  breadcrumb_activity_list: 'Activity List',
  breadcrumb_setup_by_dealer: 'Dealer Activity Maintenance',

  // Form Common
  date_from: 'From',
  date_to: 'To',

  // CRUD
  crud_add: 'Add',
  crud_edit: 'Edit',
  crud_view: 'View',
  crud_details: 'Details',
  crud_access_denied: 'Access Denied',
  crud_no_permission: 'You do not have permission to access this page.',

  // Loading States
  saving: 'Saving...',
  deleting: 'Deleting...',
  loading: 'Loading...',

  // Activity Setup Toasts & Dialogs
  activity_save_success: 'Activity saved successfully!',
  activity_save_error: 'Unable to save activity. Please try again.',
  template_save_success: 'Template saved successfully!',
  template_dialog_title: 'Reminder Message Setup',

  // Activity Setup Error
  error_load_activity_setup: 'Failed to load Activity Setup',

  // TMT Activity Custom Page
  tmt_page_title: 'TMT Activity (Custom)',
  tmt_breadcrumb_activity_setup: 'Activity Setup',
  tmt_breadcrumb_tmt_activity_list: 'TMT Activity List',

  // TMT Section Titles
  tmt_activity_type_section: 'Activity Type',
  tmt_activity_setup_section: 'Activity Setup',
  tmt_customer_vehicle_info: 'Customer & Vehicle Information',
  tmt_ownership_type: 'Ownership Type',
  tmt_contact_channels: 'Contact Channels',
  tmt_preferred_contact_day_time: 'Preferred Contact Day & Time',
  tmt_membership_information: 'Membership Information',
  tmt_contact_channel_details: 'Contact Channel Details',

  // TMT Tab Labels
  tmt_tab_customer_overview: 'Customer Overview & Conditions',
  tmt_tab_vehicle_conditions: 'Vehicle Conditions',
  tmt_tab_service_in_conditions: 'Service-In Conditions',
  tmt_tab_dealer_approval_status: 'Dealer Approval Status',

  // TMT Sub-section Titles
  tmt_customer_information: 'Customer Information',
  tmt_address: 'Address',
  tmt_date_of_birth: 'Date of Birth',
  tmt_age_qualification: 'Age & Qualification',
  tmt_vehicle_information: 'Vehicle Information',
  tmt_vehicle_conditions: 'Vehicle Conditions',
  tmt_tcfr_info: 'TCFR+ Info',
  tmt_insurance_info: 'Insurance Info',
  tmt_service_in_conditions: 'Service-In Conditions',
  tmt_job_details: 'Job Details',
  tmt_dealer_approval_status: 'Dealer Approval Status',

  // TMT Activity Setup Fields
  tmt_activity_id: 'Activity ID',
  tmt_activity_name: 'Activity Name',
  tmt_activity_description: 'Activity Description',
  tmt_pic_dealer: 'PIC Dealer',
  tmt_exclude_dealer: 'Exclude Dealer',
  tmt_valid_from: 'Valid From',
  tmt_valid_to: 'Valid To',
  tmt_customer_type: 'Customer Type',
  tmt_gender: 'Gender',
  tmt_marital_status: 'Marital Status',
  tmt_province: 'Province',
  tmt_district: 'District',
  tmt_sub_district: 'Sub District',
  tmt_zip_code: 'Zip Code',
  tmt_select_range: 'Select Range',
  tmt_from_date: 'From Date',
  tmt_from_month: 'From Month',
  tmt_to_date: 'To Date',
  tmt_to_month: 'To Month',
  tmt_min_age: 'Min Age',
  tmt_max_age: 'Max Age',
  tmt_occupation: 'Occupation',
  tmt_occupation_label: 'Occupation',
  tmt_hobby: 'Hobby',
  tmt_educational_qualification: 'Educational Qualification',
  tmt_income_range: 'Income Range (Baht)',
  tmt_law: 'Law',
  tmt_number_of_cars: 'Number of Cars',
  tmt_from: 'From',
  tmt_to: 'To',

  // TMT Radio/Checkbox Labels
  tmt_tmt_upload: 'TMT Upload',
  tmt_tmt_custom: 'TMT Custom',
  tmt_date_and_month: 'Date & Month',
  tmt_month: 'Month',
  tmt_car_owner: 'Car Owner',
  tmt_car_user: 'Car User',

  // TMT Toggle Labels
  tmt_no: 'No',
  tmt_yes: 'Yes',

  // TMT Days
  tmt_monday: 'Monday',
  tmt_tuesday: 'Tuesday',
  tmt_wednesday: 'Wednesday',
  tmt_thursday: 'Thursday',
  tmt_friday: 'Friday',
  tmt_saturday: 'Saturday',
  tmt_sunday: 'Sunday',
  tmt_weekday: 'Weekday',
  tmt_saturday_sunday: 'Saturday - Sunday',

  // TMT Available Time
  tmt_convenient_day: 'Convenient Day',
  tmt_available: 'Available',
  tmt_all_day: 'All Day',
  tmt_am_pm: 'AM - PM',
  tmt_morning: 'Morning 08:00 - 12:00',
  tmt_afternoon: 'Afternoon 13:00 - 17:00',
  tmt_off_hour: 'Off Hour',
  tmt_lunch_time: 'Lunch Time 12:00 - 13:00',
  tmt_after_working_hour: 'After Working Hour 17:00 - 19:00',

  // TMT Button Labels
  tmt_stop: 'Stop',
  tmt_approve: 'Approve',
  tmt_cancel: 'Cancel',
  tmt_create_target: 'Create Target',
  tmt_set_template: 'Set Template',
  tmt_save: 'Save',
  tmt_add: 'Add',
  tmt_export: 'Export',

  // TMT Table Headers
  tmt_col_no: 'No.',
  tmt_col_status: 'STATUS',
  tmt_col_dealer: 'DEALER',
  tmt_col_total_vehicle: 'TOTAL VEHICLE',
  tmt_col_contact_process: 'CONTACT PROCESS',
  tmt_col_channel: 'CHANNEL',
  tmt_col_activity_day: 'ACTIVITY DAY',
  tmt_col_action: 'ACTION',

  // TMT Pagination
  tmt_showing: 'Showing',
  tmt_to_lower: 'to',
  tmt_out_of: 'out of',
  tmt_go_to: 'Go To',

  // TMT Placeholders
  tmt_select_date: 'Select Date',
  tmt_select_month: 'Select Month',
  tmt_lower_limit: 'Lower Limit',
  tmt_upper_limit: 'Upper Limit',
  tmt_select_placeholder: 'Select...',
  tmt_search_placeholder: 'Search ...',
  tmt_select_dealers: 'Select dealers...',
  tmt_in_month: '(in month)',

  // TMT Toast
  tmt_save_success: 'Activity saved successfully!',

  // TMT Select All / None
  tmt_select_all: 'Select All',
  tmt_none: 'None',

  // TMT PIC Dealer Options
  tmt_pic_sales_dealer: 'Sales Dealer',
  tmt_pic_refer_upload_file: 'Refer Upload File',
  tmt_pic_latest_service: 'Latest Service',
  tmt_pic_latest_gs: 'Latest GS',

  // TMT Customer Type Options
  tmt_all: 'All',
  tmt_individual: 'Individual',
  tmt_corporate: 'Corporate',

  // TMT Gender Options
  tmt_male: 'Male',
  tmt_female: 'Female',

  // TMT Marital Status Options
  tmt_single: 'Single',
  tmt_married: 'Married',

  // TMT Province Options
  tmt_select: 'Select',
  tmt_bangkok: 'Bangkok',
  tmt_chiang_mai: 'Chiang Mai',
  tmt_phuket: 'Phuket',

  // TMT Occupation Options
  tmt_employee: 'Employee',
  tmt_business_owner: 'Business Owner',
  tmt_government: 'Government',

  // TMT Education Options
  tmt_bachelor_degree: "Bachelor's Degree",
  tmt_master_degree: "Master's Degree",
  tmt_doctorate: 'Doctorate',
  tmt_high_school: 'High School',

  // TMT Income Range Options
  tmt_income_more_100k: 'More than 100,000',
  tmt_income_50k_100k: '50,000 - 100,000',
  tmt_income_30k_50k: '30,000 - 50,000',
  tmt_income_less_30k: 'Less than 30,000',

  // TMT Contact Process Options
  tmt_follow_up: 'Follow-up',
  tmt_service_followup: 'Service Follow-up',
  tmt_appointment_confirmation: 'Appointment Confirmation',

  // TMT Channel Options
  tmt_sms: 'SMS',
  tmt_email: 'Email',
  tmt_tmt_lon: 'TMT LON',
  tmt_call_out: 'Call Out',
  tmt_line_oa: 'Line OA',

  // TMT Month Options
  tmt_january: 'January',
  tmt_february: 'February',
  tmt_march: 'March',
  tmt_april: 'April',
  tmt_may: 'May',
  tmt_june: 'June',
  tmt_july: 'July',
  tmt_august: 'August',
  tmt_september: 'September',
  tmt_october: 'October',
  tmt_november: 'November',
  tmt_december: 'December',

  // TMT Vehicle Conditions Fields
  tmt_brand: 'Brand',
  tmt_series: 'Series',
  tmt_model: 'Model',
  tmt_vehicle_type: 'Vehicle Type',
  tmt_fuel_type: 'Fuel Type',
  tmt_device_type: 'Device Type',
  tmt_new_car_delivery_date_from: 'New Car Delivery Date From',
  tmt_new_car_delivery_date_to: 'New Car Delivery Date To',
  tmt_car_age_from: 'Car Age From (in Month)',
  tmt_car_age_to: 'Car Age To (in Month)',
  tmt_car_age_over: 'Car Age Over (Years)',
  tmt_used_car_delivery_date_from: 'Used Car Delivery Date From',
  tmt_used_car_delivery_date_to: 'Used Car Delivery Date To',
  tmt_used_car_warranty_expiry_from: 'Used Car Warranty Expiry Date From',
  tmt_used_car_warranty_expiry_to: 'Used Car Warranty Expiry Date To',
  tmt_mileage_from: 'Mileage From',
  tmt_mileage_to: 'Mileage To',
  tmt_avg_daily_mileage_from: 'Average Daily Mileage From',
  tmt_avg_daily_mileage_to: 'Average Daily Mileage To',

  // TMT TCFR+ Fields
  tmt_status: 'Status',
  tmt_participate: 'Participate',
  tmt_not_participate: 'Not Participate',
  tmt_join_date_from: 'Join Date From',
  tmt_join_date_to: 'Join Date To',
  tmt_tcfr_tier_level: 'TCFR+ Tier/Level',

  // TMT Insurance Fields
  tmt_insurance_company_name: 'Insurance Company Name',
  tmt_insurance_type: 'Insurance Type',
  tmt_policy_start_date_from: 'Policy Start Date From',
  tmt_policy_start_date_to: 'Policy Start Date To',
  tmt_policy_expiry_date_from: 'Policy Expiry Date From',
  tmt_policy_expiry_date_to: 'Policy Expiry Date To',

  // TMT Service-In Conditions Fields
  tmt_vehicle_status: 'Vehicle Status',
  tmt_repair_date: 'Repair Date',
  tmt_invoice_date: 'Invoice Date',
  tmt_workshop_type: 'WorkShop Type',
  tmt_periodic_maintenance: 'Periodic Maintenance',
  tmt_oil_change_status: 'Oil Change Status',
  tmt_repair_code: 'Repair Code',
  tmt_details: 'Details',
  tmt_general_repair: 'General Repair',
  tmt_mobile_service: 'Mobile Service',
  tmt_body_and_paint: 'Body & Paint',
  tmt_light: 'Light',
  tmt_medium: 'Medium',
  tmt_heavy: 'Heavy',
  tmt_operation_code: 'Operation Code',
  tmt_package: 'Package',
  tmt_pnc: 'PNC',
  tmt_part_no: 'Part No.',
  tmt_campaign: 'Campaign',
  tmt_expense_limit: 'Expense Limit',
  tmt_less_than: 'Less Than',
  tmt_equal_greater_than: 'Equal/Greater Than',
  tmt_total_expense: 'Total Expense',
  tmt_active: 'Active',
  tmt_inactive: 'Inactive',
  tmt_no_service_history: 'No Service History',
  tmt_last_active: 'Last Active (in month)',
  tmt_frequency: 'Frequency',
  tmt_service_frequency: 'Service Frequency (in 12 months)',

  // TMT Membership
  tmt_t_connect_member: 'T-Connect Member',
  tmt_alive_x_member: 'Alive-X Member',

  // TMT Rows
  tmt_rows: 'Rows',

  // ===== TopTable shared keys (dotted keys used by the table component) =====
  'common.all': 'All',
  'common.select': 'Select',
  'common.search': 'Search',
  'common.checked': 'Checked',
  'common.unchecked': 'Unchecked',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.reset': 'Reset',
  'common.edit': 'Edit',
  'common.copy': 'Copy',
  'common.delete': 'Delete',
  'pagination.showing': 'Showing',
  'pagination.to': 'to',
  'pagination.out_of': 'out of',
  'pagination.goto': 'Go To',
  'pagination.invalid_page': 'Invalid page',
  'pagination.rows': 'Rows',
  'errorMessage.no_data_found': 'No Data Found',
  'errorMessage.required': 'This field is required',

  // ===== [WCRM010200] Dealer Activity List =====
  dal_page_title: 'Activity List',
  dal_breadcrumb_activity_setup: 'Activity Setup',
  dal_breadcrumb_activity_list: 'Activity List',
  dal_search_section: 'Activity Search',
  dal_list_section: 'Activity List',
  dal_field_activity_id: 'Activity ID',
  dal_field_activity_type: 'Activity Type',
  dal_field_activity_name: 'Activity Name',
  dal_activity_type_all: 'All',
  dal_btn_reset: 'Reset',
  dal_btn_search: 'Search',
  dal_btn_add: 'Add',
  dal_col_no: 'NO',
  dal_col_activity_id: 'ACTIVITY ID',
  dal_col_activity_type: 'ACTIVITY TYPE',
  dal_col_activity_name: 'ACTIVITY NAME',
  dal_col_created_by: 'CREATED BY',
  dal_col_created_date: 'CREATED DATE',
  dal_col_modified_by: 'MODIFIED BY',
  dal_col_modified_date: 'MODIFIED DATE',
  dal_no_data_found: 'No Data Found',
  dal_warn_min_chars: 'Please enter at least 3 characters in Activity Name to perform the search operation.',
  dal_warn_no_record: 'No Record exists',
  dal_suggest_loading: 'Loading...',
  dal_suggest_no_match: 'No matching activities',

  // ===== [WCRM010309] TMT Activity Maintenance - Post Service Follow Up (PSFU) =====
  psfu_page_title: 'TMT Activity Maintenance',
  psfu_breadcrumb_activity_setup: 'Activity Setup',
  psfu_breadcrumb_tmt_activity_maintenance: 'TMT Activity Maintenance',

  // Sections
  psfu_activity_type_section: 'Activity Type',
  psfu_item_section: 'Post Service Follow Up (PSFU) Item',

  // Activity Type options
  psfu_activity_periodic_maintenance: 'Periodic Maintenance',
  psfu_activity_additional_rejected: 'Additional Rejected Job',
  psfu_activity_dcm_vehicle: 'DCM Vehicle',
  psfu_activity_tcfr: 'TCFR+',
  psfu_activity_ssc_csc: 'SSC/CSC',
  psfu_activity_body_paint: 'Body & Paint',
  psfu_activity_bp_insurance: 'BP Insurance Renewal',
  psfu_activity_post_service: 'Post Service Follow Up (PSFU)',

  // Grid columns
  psfu_col_no: 'No.',
  psfu_col_status: 'STATUS',
  psfu_col_items: 'ITEMS',
  psfu_col_mandatory: 'MANDATORY',
  psfu_col_action: 'ACTION',

  // PSFU Item dropdown options
  psfu_item_1: 'Post Service Follow Up (PSFU) -1',
  psfu_item_2: 'Post Service Follow Up (PSFU) -2',
  psfu_item_3: 'Post Service Follow Up (PSFU) -3',
  psfu_item_4: 'Post Service Follow Up (PSFU) -4',
  psfu_item_5: 'Post Service Follow Up (PSFU) -5',
  psfu_item_placeholder: 'Select...',

  // Buttons
  psfu_add_btn: 'Add',
  psfu_save_btn: 'Save',

  // Validation dialog
  psfu_validation_errors_title: 'Validation Errors',
  psfu_validation_errors_message: 'Please correct the following errors before saving:',

  // Common message IDs from DR
  psfu_wrn0001_no_changes: 'No Changes to Save.',
  psfu_wrn0002_delete_confirm: 'Are you sure to delete data?',
  psfu_wrn0003_save_confirm: 'Do you wish to save changes?',
  psfu_wrn0004_unsaved_changes: 'Changes have been made. Do you wish to proceed?',
  psfu_inf0001_saved: 'Record saved successfully.',
  psfu_err0001_field_required: '{field} is required.',
  psfu_err0001_field_required_inline: '{field} is required',
  psfu_err0005_duplicate: 'Duplicate record exists.',
  psfu_err0035_load_failed: 'Unable to retrieve data during page load.',
  psfu_err0036_unexpected: 'An unexpected error occurred, please contact administrator.',

  // Dialog titles
  psfu_delete_dialog_title: 'Delete',
  psfu_save_dialog_title: 'Save',
  psfu_confirm_dialog_title: 'Confirm',

  // Dialog 
  common_delete_dialog_title: 'Delete',
  common_delete_confirm: 'Are you sure to delete data?',
};

export default en;
export type TranslationKeys = keyof typeof en;
