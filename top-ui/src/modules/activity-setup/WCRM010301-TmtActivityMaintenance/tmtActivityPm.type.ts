export interface ContactChannelRow {
  id: number;
  status: 'ADD' | 'UPD' | 'DEL' | null;
  contactProcess: string;
  channel: string;
  activityDay: number | string;
}

export interface ComboSelectOption {
  value: string;
  label: string;
}


export type RowStatus = 'ADD' | 'UPD' | 'DEL' | null;

export interface ContactChannelRow {
  id: number;
  status: RowStatus;
  contactProcess: string;
  channel: string;
  activityDay: number | string;
}

export interface TmtPmContactChannelTableRef {
  validateContactChannelRows: () => string | null;
  hasChanges: () => boolean;
  commitSaved: () => void;
  getPayload: () => TmtPmActivitySaveDetail[];
}

export interface TmtPmServiceRepairTableProps {
  activityId?: string;
}

export interface RepairRow {
  branchId: string;
  dealerId: string;
  id: number;
  status: RowStatus;
  repairCode: string;
  description: string;
  mandatory: boolean;
}

export interface RepairCodeOption {
  value: string;
  description: string;
}

export interface TmtPmServiceRepairTableRef {
  validateAll: () => string | null;
  hasChanges: () => boolean;
  commitSaved: () => void;
  reloadOnload: () => void;
  getPayload: () => TmtPmActivitySavePayload | null;
}

export interface TmtPmActivitySaveDetail {
  activityId: string;
  dealerId: string;
  branchId: string;
  processType: string;
  channelType: string;
  activityDay: number;
  groupId: number;
  activityMasterId: string;
  version: number;
  deleted: boolean;
  id: number;
  rowStatus: RowStatus;
}

export interface TmtPmActivitySaveRepairItem {
  activityId: string;
  branchId: string;
  dealerId: string;
  mandatoryFlg: 'Y' | 'N';
  repairInspectionCode: string;
  rowStatus: RowStatus;
  version: number;
}

export interface TmtPmActivitySavePayload {
  activityId: string;
  dealerId: string;
  branchId: string;
  activityTypeId: number;
  activityTypeCode: string;
  activityTypeName: string;
  version: number;
  contactChannelDetails: TmtPmActivitySaveDetail[];
  repairInspectionItems: TmtPmActivitySaveRepairItem[];
  rowStatus: RowStatus;
}

export interface TmtPmActivityFormData {
  activityType: string;
}


export interface ComboOption {
  comboType: string;
  code: string;
  name: string;
  id: number;
}

/** A repair / inspection catalogue entry. */
export interface RepairInspectionItem {
  id: string;
  repairInspectionCode: string;
  description: string;
}

/**
 * Shape of the JSON mock files and the API list responses for this module.
 * The row array lives under `tableData` (matches json-server / API contract).
 */
export interface TmtListResponse<T> {
  data: unknown;
  page: number;
  size: number;
  tableData: T[];
  totalCount: number;
}

export interface TmtPmContactChannelTableProps {
  activityId?: string;
  onloadData?: import('./services/tmtActivityMaintenanceService').TmtPmOnloadData | null;
}