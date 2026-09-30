# API_Data_Map_Details_Call_Plan_Allocation_By_Enquiry.xlsx

## API_Details

| API_ID | Module | API_Name | HTTP_Method | Path | Summary | Description | Tags | Auth_Required | Auth_Roles | Deprecated | Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| API-CPA-001 | Call Plan Allocation by Enquiry | Get Enquiry Call Plans | GET | /api/v1/call-plan-allocation/enquiry | List/search enquiry call plans | Returns manually created enquiry call plans filtered by optional Group Name, Staff Name, Branch, Follow-up Date and authorization scope with pagination and Follow-up Date ASC sort | CallPlan,Enquiry,Search | Y | TMT,DEALER,DEALER_USER | N | v1 |
| API-CPA-002 | Call Plan Allocation by Enquiry | Get Call Center Groups | GET | /api/v1/masters/call-center-groups | Group Name dropdown values | Returns Call Center Group master values available for search filtering | Master,Group,Dropdown | Y | TMT,DEALER,DEALER_USER | N | v1 |
| API-CPA-003 | Call Plan Allocation by Enquiry | Get Staff List For Search | GET | /api/v1/masters/staff | Staff Name dropdown values | Returns active staff (plus All) filtered by logged-in user authorization for search | Master,Staff,Dropdown | Y | TMT,DEALER,DEALER_USER | N | v1 |
| API-CPA-004 | Call Plan Allocation by Enquiry | Get Branches | GET | /api/v1/masters/branches | Branch dropdown values | Returns branches accessible to the logged-in user for search filtering | Master,Branch,Dropdown | Y | TMT,DEALER,DEALER_USER | N | v1 |
| API-CPA-005 | Call Plan Allocation by Enquiry | Get Assignable Staff | GET | /api/v1/call-plan-allocation/enquiry/assignable-staff | Assign Selected Customer To values | Returns active staff eligible for reassignment within authorization scope in Staff Name (Branch) format | Assignment,Staff,Dropdown | Y | TMT,DEALER | N | v1 |
| API-CPA-006 | Call Plan Allocation by Enquiry | Reassign Enquiry Call Plans | POST | /api/v1/call-plan-allocation/enquiry/reassign | Save PIC reassignment | Reassigns selected enquiry call plan records to destination staff; updates PIC only; rejects inactive staff or unauthorized users; transactional all-or-nothing | CallPlan,Save,Reassign | Y | TMT,DEALER | N | v1 |
