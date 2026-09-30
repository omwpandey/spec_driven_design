import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  EllipsisText,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Popover,
  Link,
  Radio,
  RadioGroup,
  Chip,
  Pagination,
  InputAdornment,
  Divider,
  SaveIcon,
  ApproveIcon,
  TemplateIcon,
  DeleteIcon,
  AddIcon,
  SearchIcon,
  ExportIcon,
  PauseIcon,
  BlockIcon,
  TargetIcon,
  ToastNotification, 
  ConfirmDialog, 
  SetTemplateDialog
} from '@components/common';
import { MuiTabs, Tab } from '@components/common/MuiTabs';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { PageContainer, PageHeader, PageFooter, SectionCard } from '@components/layout';
import { TopTable, useFormValidation, validators } from '@components/table';
import type { ICropColumn } from '@components/table';
import { useTranslation } from '@hooks';
import {
  tmtStyles,
  getTriggerTextStyle,
  getSpinnerOptionStyle,
  getToggleTrackStyle,
  getToggleKnobLeft,
  getContactStatusColor,
  getStatusChipStyle,
} from './tmtActivityCustom.styles';

// ===== Types =====
interface ContactChannelRow {
  id: number;
  status: 'ADD' | 'UPD' | 'DEL';
  contactProcess: string;
  channel: string;
  dayFrom: number | string;
  dayTo: number | string;
  assignGroup: string;
  [key: string]: unknown;
}

interface TmtActivityFormData {
  activityType: string;
  activityId: string;
  activityName: string;
  activityDescription: string;
  picDealer: string;
  excludeDealer: string[];
  validFrom: string;
  validTo: string;
  customerType: string;
  gender: string;
  maritalStatus: string;
  province: string;
  district: string;
  subDistrict: string;
  zipCode: string;
  dobSelectRange: string;
  fromDate: string;
  fromMonth: string;
  toDate: string;
  toMonth: string;
  minAge: string;
  maxAge: string;
  occupation: string;
  hobby: string;
  educationalQualification: string;
  incomeRange: string;
  carOwner: boolean;
  carUser: boolean;
  numberOfCarsFrom: string;
  numberOfCarsTo: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
  convenientDays: string[];
  allDay: boolean;
  morningShift: boolean;
  afternoonShift: boolean;
  lunchTime: boolean;
  afterWorkingHour: boolean;
  tConnectMember: boolean;
  aliveXMember: boolean;
}

// ===== Constants =====
const picDealerOptions = [
  { value: 'sales_dealer', labelKey: 'tmt_pic_sales_dealer' },
  { value: 'refer_upload_file', labelKey: 'tmt_pic_refer_upload_file' },
  { value: 'latest_service', labelKey: 'tmt_pic_latest_service' },
  { value: 'latest_gs', labelKey: 'tmt_pic_latest_gs' },
];

const excludeDealerOptions = [
  { value: '51011', label: '51011 - Dealer 1' },
  { value: '11106', label: '11106 - Dealer 2' },
  { value: '11107', label: '11107 - Dealer 3' },
  { value: '11108', label: '11108 - Dealer 4' },
  { value: '11109', label: '11109 - Dealer 5' },
];

const customerTypeOptions = [
  { value: 'all', labelKey: 'tmt_all' },
  { value: 'individual', labelKey: 'tmt_individual' },
  { value: 'corporate', labelKey: 'tmt_corporate' },
];

const genderOptions = [
  { value: 'all', labelKey: 'tmt_all' },
  { value: 'male', labelKey: 'tmt_male' },
  { value: 'female', labelKey: 'tmt_female' },
];

const maritalStatusOptions = [
  { value: 'all', labelKey: 'tmt_all' },
  { value: 'single', labelKey: 'tmt_single' },
  { value: 'married', labelKey: 'tmt_married' },
];

const provinceOptions = [
  { value: '', labelKey: 'tmt_select' },
  { value: 'bangkok', labelKey: 'tmt_bangkok' },
  { value: 'chiang_mai', labelKey: 'tmt_chiang_mai' },
  { value: 'phuket', labelKey: 'tmt_phuket' },
];

const occupationOptions = [
  { value: '', labelKey: 'tmt_occupation' },
  { value: 'employee', labelKey: 'tmt_employee' },
  { value: 'business_owner', labelKey: 'tmt_business_owner' },
  { value: 'government', labelKey: 'tmt_government' },
];

const educationOptions = [
  { value: 'bachelor', labelKey: 'tmt_bachelor_degree' },
  { value: 'master', labelKey: 'tmt_master_degree' },
  { value: 'doctorate', labelKey: 'tmt_doctorate' },
  { value: 'high_school', labelKey: 'tmt_high_school' },
];

const incomeRangeOptions = [
  { value: 'more_than_100000', labelKey: 'tmt_income_more_100k' },
  { value: '50000_100000', labelKey: 'tmt_income_50k_100k' },
  { value: '30000_50000', labelKey: 'tmt_income_30k_50k' },
  { value: 'less_than_30000', labelKey: 'tmt_income_less_30k' },
];

const contactProcessOptions = [
  { value: 'follow_up', labelKey: 'tmt_follow_up' },
  { value: 'service_followup', labelKey: 'tmt_service_followup' },
  { value: 'appointment_confirmation', labelKey: 'tmt_appointment_confirmation' },
];

const channelOptions = [
  { value: 'sms', labelKey: 'tmt_sms' },
  { value: 'email', labelKey: 'tmt_email' },
  { value: 'tmt_lon', labelKey: 'tmt_tmt_lon' },
  { value: 'call_out', labelKey: 'tmt_call_out' },
  { value: 'line_oa', labelKey: 'tmt_line_oa' },
];

const assignGroupOptions = [
  { value: 'go01_group', label: 'GO01 GROUP' },
  { value: 'go02_group', label: 'GO02 GROUP' },
  { value: 'go03_group', label: 'GO03 GROUP' },
];

const monthOptions = [
  { value: '1', labelKey: 'tmt_january' },
  { value: '2', labelKey: 'tmt_february' },
  { value: '3', labelKey: 'tmt_march' },
  { value: '4', labelKey: 'tmt_april' },
  { value: '5', labelKey: 'tmt_may' },
  { value: '6', labelKey: 'tmt_june' },
  { value: '7', labelKey: 'tmt_july' },
  { value: '8', labelKey: 'tmt_august' },
  { value: '9', labelKey: 'tmt_september' },
  { value: '10', labelKey: 'tmt_october' },
  { value: '11', labelKey: 'tmt_november' },
  { value: '12', labelKey: 'tmt_december' },
];

const initialContactChannels: ContactChannelRow[] = [
  { id: 1, status: 'ADD', contactProcess: 'follow_up', channel: 'sms', dayFrom: 1, dayTo: '', assignGroup: '' },
  { id: 2, status: 'UPD', contactProcess: 'follow_up', channel: 'email', dayFrom: 1, dayTo: '', assignGroup: '' },
  { id: 3, status: 'UPD', contactProcess: 'follow_up', channel: 'tmt_lon', dayFrom: 1, dayTo: '', assignGroup: '' },
];

// ===== Sub-components =====

/** Multi-select dropdown with checkboxes (like Exclude Dealer) */
const MultiSelectDropdown: React.FC<{
  value: string[];
  onChange: (val: string[]) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ value, onChange, options, placeholder }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const resolvedPlaceholder = placeholder || t('tmt_select_placeholder');

  const handleToggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const displayText = value.length > 0
    ? options.filter((o) => value.includes(o.value)).map((o) => o.label).join(', ')
    : resolvedPlaceholder;

  return (
    <>
      <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={tmtStyles.dropdown.triggerBox}>
        <EllipsisText sx={getTriggerTextStyle(value.length > 0)}>
          {displayText}
        </EllipsisText>
        <Typography sx={tmtStyles.dropdown.triggerCaret}>▾</Typography>
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: tmtStyles.dropdown.popoverPaperMulti,
          },
        }}
      >
        <Box sx={tmtStyles.dropdown.popoverBody1}>
          {options.map((opt) => (
            <FormControlLabel
              key={opt.value}
              control={
                <Checkbox
                  size="small"
                  checked={value.includes(opt.value)}
                  onChange={() => handleToggle(opt.value)}
                  sx={tmtStyles.dropdown.checkbox}
                />
              }
              label={<Typography sx={tmtStyles.dropdown.checkboxLabel}>{opt.label}</Typography>}
              sx={tmtStyles.dropdown.checkboxControl}
            />
          ))}
          <Box sx={tmtStyles.dropdown.footerRow}>
            <Link
              component="button"
              variant="caption"
              onClick={() => onChange(options.map((o) => o.value))}
              sx={tmtStyles.dropdown.selectAllLink}
            >
              {t('tmt_select_all')}
            </Link>
            <Link
              component="button"
              variant="caption"
              onClick={() => onChange([])}
              sx={tmtStyles.dropdown.noneLink}
            >
              {t('tmt_none')}
            </Link>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

/** Number spinner dropdown (like From Date picker in figma) */
const NumberSpinner: React.FC<{
  value: string;
  onChange: (val: string) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}> = ({ value, onChange, min = 1, max = 31, placeholder }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const resolvedPlaceholder = placeholder || t('tmt_select_date');

  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <>
      <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={tmtStyles.dropdown.triggerBoxNarrow}>
        <EllipsisText sx={getTriggerTextStyle(Boolean(value), true)}>
          {value || resolvedPlaceholder}
        </EllipsisText>
        <Typography sx={tmtStyles.dropdown.triggerCaretSm}>▾</Typography>
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: tmtStyles.dropdown.popoverPaperNumber,
          },
        }}
      >
        <Box sx={tmtStyles.dropdown.popoverBodyHalf}>
          {options.map((num) => (
            <Box
              key={num}
              onClick={() => { onChange(String(num)); setAnchorEl(null); }}
              sx={getSpinnerOptionStyle(String(num) === value)}
            >
              <span>{num}</span>
              {String(num) === value && <span style={tmtStyles.dropdown.optionCheckMark}>✓</span>}
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
};

/** Month selector dropdown */
const MonthSelector: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const resolvedPlaceholder = placeholder || t('tmt_select_month');

  const selectedMonth = monthOptions.find((m) => m.value === value);
  const selectedLabel = selectedMonth ? t(selectedMonth.labelKey) : '';

  return (
    <>
      <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={tmtStyles.dropdown.triggerBoxNarrow}>
        <EllipsisText sx={getTriggerTextStyle(Boolean(value), true)}>
          {selectedLabel || resolvedPlaceholder}
        </EllipsisText>
        <Typography sx={tmtStyles.dropdown.triggerCaretSm}>▾</Typography>
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: tmtStyles.dropdown.popoverPaperMonth,
          },
        }}
      >
        <Box sx={tmtStyles.dropdown.popoverBodyHalf}>
          {monthOptions.map((month) => (
            <Box
              key={month.value}
              onClick={() => { onChange(month.value); setAnchorEl(null); }}
              sx={getSpinnerOptionStyle(month.value === value)}
            >
              <span>{t(month.labelKey as any)}</span>
              {month.value === value && <span style={tmtStyles.dropdown.optionCheckMark}>✓</span>}
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
};

// ===== Toggle Switch with No/Yes labels (matches Figma - large red toggle with checkmark) =====
const ToggleWithLabels: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => {
  const { t } = useTranslation();
  return (
  <Box sx={tmtStyles.toggle.wrapper}>
    <Typography sx={tmtStyles.toggle.label}>{label}</Typography>
    <Typography sx={tmtStyles.toggle.label}>{t('tmt_no')}</Typography>
    <Box onClick={() => onChange(!checked)} sx={getToggleTrackStyle(checked)}>
      <Box sx={{ ...(tmtStyles.toggle.knobBase as object), ...(getToggleKnobLeft(checked) as object) }}>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="#EB0A1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </Box>
    </Box>
    <Typography sx={tmtStyles.toggle.noYesText}>{t('tmt_yes')}</Typography>
  </Box>
  );
};

// ===== Vehicle Conditions Tab =====
const VehicleConditionsTab: React.FC = () => {
  const { t } = useTranslation();
  const [brand, setBrand] = useState('toyota_lexus');
  const [series, setSeries] = useState('');
  const [model, setModel] = useState('camry_gr86_yaris');
  const [vehicleTypePC, setVehicleTypePC] = useState(false);
  const [vehicleTypeCV, setVehicleTypeCV] = useState(false);
  const [vehicleConditions, setVehicleConditions] = useState('kinto');
  const [fuelType, setFuelType] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [newCarDeliveryFrom, setNewCarDeliveryFrom] = useState('');
  const [newCarDeliveryTo, setNewCarDeliveryTo] = useState('');
  const [carAgeFrom, setCarAgeFrom] = useState('');
  const [carAgeTo, setCarAgeTo] = useState('');
  const [carAgeOver, setCarAgeOver] = useState('');
  const [usedCarDeliveryFrom, setUsedCarDeliveryFrom] = useState('');
  const [usedCarDeliveryTo, setUsedCarDeliveryTo] = useState('');
  const [usedCarWarrantyFrom, setUsedCarWarrantyFrom] = useState('');
  const [usedCarWarrantyTo, setUsedCarWarrantyTo] = useState('');
  const [mileageFrom, setMileageFrom] = useState('');
  const [mileageTo, setMileageTo] = useState('');
  const [avgDailyMileageFrom, setAvgDailyMileageFrom] = useState('');
  const [avgDailyMileageTo, setAvgDailyMileageTo] = useState('');
  const [tcfrStatus, setTcfrStatus] = useState('participate');
  const [tcfrJoinFrom, setTcfrJoinFrom] = useState('');
  const [tcfrJoinTo, setTcfrJoinTo] = useState('');
  const [tcfrTierLevel, setTcfrTierLevel] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('xxxxxxx');
  const [insuranceType, setInsuranceType] = useState('tcare_non');
  const [policyStartFrom, setPolicyStartFrom] = useState('');
  const [policyStartTo, setPolicyStartTo] = useState('');
  const [policyExpiryFrom, setPolicyExpiryFrom] = useState('');
  const [policyExpiryTo, setPolicyExpiryTo] = useState('');

  const subsectionTitle = (title: string) => (
    <Box sx={tmtStyles.subsection.wrapper}>
      <Box sx={tmtStyles.subsection.bar} />
      <Typography sx={tmtStyles.subsection.title}>{title}</Typography>
    </Box>
  );

  const fieldLabel = (label: string) => (
    <Typography sx={tmtStyles.shared.fieldLabel}>{label}</Typography>
  );

  return (
    <Box sx={tmtStyles.shared.columnGap3}>
      {/* Vehicle Information */}
      <Box>
        {subsectionTitle(t('tmt_vehicle_information'))}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_brand'))}
            <Select size="small" fullWidth value={brand} onChange={(e) => setBrand(e.target.value)} sx={tmtStyles.shared.select}>
              <MenuItem value="toyota_lexus">Toyota, Lexus</MenuItem>
              <MenuItem value="toyota">Toyota</MenuItem>
              <MenuItem value="lexus">Lexus</MenuItem>
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_series'))}
            <Select size="small" fullWidth value={series} onChange={(e) => setSeries(e.target.value)} displayEmpty sx={tmtStyles.shared.select}>
              <MenuItem value=""><em></em></MenuItem>
              <MenuItem value="sedan">Sedan</MenuItem>
              <MenuItem value="suv">SUV</MenuItem>
              <MenuItem value="truck">Truck</MenuItem>
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_model'))}
            <Select size="small" fullWidth value={model} onChange={(e) => setModel(e.target.value)} sx={tmtStyles.shared.select}>
              <MenuItem value="camry_gr86_yaris">Camry, GR86, Yaris</MenuItem>
              <MenuItem value="camry">Camry</MenuItem>
              <MenuItem value="corolla">Corolla</MenuItem>
              <MenuItem value="hilux">Hilux</MenuItem>
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_vehicle_type'))}
            <Box sx={tmtStyles.vehicleType.row}>
              <FormControlLabel
                control={<Checkbox size="small" checked={vehicleTypePC} onChange={(e) => setVehicleTypePC(e.target.checked)} sx={tmtStyles.shared.redControl999} />}
                label={<Typography sx={tmtStyles.shared.menuItemLabel}>PC</Typography>}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={vehicleTypeCV} onChange={(e) => setVehicleTypeCV(e.target.checked)} sx={tmtStyles.shared.redControl999} />}
                label={<Typography sx={tmtStyles.shared.menuItemLabel}>CV</Typography>}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={tmtStyles.shared.dividerMy} />

      {/* Vehicle Conditions */}
      <Box>
        {subsectionTitle(t('tmt_vehicle_conditions'))}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_vehicle_conditions'))}
            <TextField size="small" fullWidth value={vehicleConditions} onChange={(e) => setVehicleConditions(e.target.value)} sx={tmtStyles.shared.textField40} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_fuel_type'))}
            <Select size="small" fullWidth value={fuelType} onChange={(e) => setFuelType(e.target.value)} displayEmpty sx={tmtStyles.shared.select}>
              <MenuItem value=""><em></em></MenuItem>
              <MenuItem value="gasoline">Gasoline</MenuItem>
              <MenuItem value="diesel">Diesel</MenuItem>
              <MenuItem value="hybrid">Hybrid</MenuItem>
              <MenuItem value="ev">EV</MenuItem>
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_device_type'))}
            <TextField size="small" fullWidth value={deviceType} onChange={(e) => setDeviceType(e.target.value)} sx={tmtStyles.shared.textField40} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_new_car_delivery_date_from'))}
            <TextField size="small" fullWidth type="date" value={newCarDeliveryFrom} onChange={(e) => setNewCarDeliveryFrom(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_new_car_delivery_date_to'))}
            <TextField size="small" fullWidth type="date" value={newCarDeliveryTo} onChange={(e) => setNewCarDeliveryTo(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_car_age_from'))}
            <TextField size="small" fullWidth value={carAgeFrom} onChange={(e) => setCarAgeFrom(e.target.value)} placeholder={t('tmt_in_month')} sx={tmtStyles.shared.textField40} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_car_age_to'))}
            <TextField size="small" fullWidth value={carAgeTo} onChange={(e) => setCarAgeTo(e.target.value)} placeholder={t('tmt_in_month')} sx={tmtStyles.shared.textField40} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_car_age_over'))}
            <TextField size="small" fullWidth value={carAgeOver} onChange={(e) => setCarAgeOver(e.target.value)} sx={tmtStyles.shared.textField40} />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_used_car_delivery_date_from'))}
            <TextField size="small" fullWidth type="date" value={usedCarDeliveryFrom} onChange={(e) => setUsedCarDeliveryFrom(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_used_car_delivery_date_to'))}
            <TextField size="small" fullWidth type="date" value={usedCarDeliveryTo} onChange={(e) => setUsedCarDeliveryTo(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_used_car_warranty_expiry_from'))}
            <TextField size="small" fullWidth type="date" value={usedCarWarrantyFrom} onChange={(e) => setUsedCarWarrantyFrom(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_used_car_warranty_expiry_to'))}
            <TextField size="small" fullWidth type="date" value={usedCarWarrantyTo} onChange={(e) => setUsedCarWarrantyTo(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_mileage_from'))}
            <TextField size="small" fullWidth value={mileageFrom} onChange={(e) => setMileageFrom(e.target.value)} sx={tmtStyles.shared.textField40} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_mileage_to'))}
            <TextField size="small" fullWidth value={mileageTo} onChange={(e) => setMileageTo(e.target.value)} sx={tmtStyles.shared.textField40} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_avg_daily_mileage_from'))}
            <TextField size="small" fullWidth value={avgDailyMileageFrom} onChange={(e) => setAvgDailyMileageFrom(e.target.value)} sx={tmtStyles.shared.textField40} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_avg_daily_mileage_to'))}
            <TextField size="small" fullWidth value={avgDailyMileageTo} onChange={(e) => setAvgDailyMileageTo(e.target.value)} sx={tmtStyles.shared.textField40} />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={tmtStyles.shared.dividerMy} />

      {/* TCFR+ Info */}
      <Box>
        {subsectionTitle(t('tmt_tcfr_info'))}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_status'))}
            <Select size="small" fullWidth value={tcfrStatus} onChange={(e) => setTcfrStatus(e.target.value)} sx={tmtStyles.shared.select}>
              <MenuItem value="participate">{t('tmt_participate')}</MenuItem>
              <MenuItem value="not_participate">{t('tmt_not_participate')}</MenuItem>
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_join_date_from'))}
            <TextField size="small" fullWidth type="date" value={tcfrJoinFrom} onChange={(e) => setTcfrJoinFrom(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_join_date_to'))}
            <TextField size="small" fullWidth type="date" value={tcfrJoinTo} onChange={(e) => setTcfrJoinTo(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_tcfr_tier_level'))}
            <Select size="small" fullWidth value={tcfrTierLevel} onChange={(e) => setTcfrTierLevel(e.target.value)} displayEmpty sx={tmtStyles.shared.select}>
              <MenuItem value=""><em></em></MenuItem>
              <MenuItem value="gold">Gold</MenuItem>
              <MenuItem value="silver">Silver</MenuItem>
              <MenuItem value="bronze">Bronze</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={tmtStyles.shared.dividerMy} />

      {/* Insurance Info */}
      <Box>
        {subsectionTitle(t('tmt_insurance_info'))}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_insurance_company_name'))}
            <Select size="small" fullWidth value={insuranceCompany} onChange={(e) => setInsuranceCompany(e.target.value)} sx={tmtStyles.shared.select}>
              <MenuItem value="xxxxxxx">XXXXXXX</MenuItem>
              <MenuItem value="company_a">Company A</MenuItem>
              <MenuItem value="company_b">Company B</MenuItem>
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_insurance_type'))}
            <Select size="small" fullWidth value={insuranceType} onChange={(e) => setInsuranceType(e.target.value)} sx={tmtStyles.shared.select}>
              <MenuItem value="tcare_non">TCARE/Non</MenuItem>
              <MenuItem value="tcare">TCARE</MenuItem>
              <MenuItem value="non">Non</MenuItem>
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_policy_start_date_from'))}
            <TextField size="small" fullWidth type="date" value={policyStartFrom} onChange={(e) => setPolicyStartFrom(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_policy_start_date_to'))}
            <TextField size="small" fullWidth type="date" value={policyStartTo} onChange={(e) => setPolicyStartTo(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_policy_expiry_date_from'))}
            <TextField size="small" fullWidth type="date" value={policyExpiryFrom} onChange={(e) => setPolicyExpiryFrom(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            {fieldLabel(t('tmt_policy_expiry_date_to'))}
            <TextField size="small" fullWidth type="date" value={policyExpiryTo} onChange={(e) => setPolicyExpiryTo(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

// ===== Service-In Conditions Tab =====
const ServiceInConditionsTab: React.FC = () => {
  const { t } = useTranslation();
  const [vehicleStatus, setVehicleStatus] = useState('repair_date');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [workshopType, setWorkshopType] = useState('gs');

  // Periodic Maintenance
  const [pmChecks, setPmChecks] = useState<string[]>([]);
  const pmOptions = ['PM (1k-10k)', 'AFI Range (1K-50K)', 'COO (50K-200K)', '(110K-150K)', '(150K-200K)', '(>200K)'];

  // Oil Change Status
  const [oilChecks, setOilChecks] = useState<string[]>([]);
  const oilOptions = [
    { code: '29TF', details: 'Change the engine oil and filter.' },
    { code: '29TL', details: 'Change engine oil' },
    { code: 'OIL001', details: 'Change the engine oil and filter.' },
  ];

  // General Repair
  const [grChecked, setGrChecked] = useState(false);
  const [mobileServiceChecked, setMobileServiceChecked] = useState(false);

  // Body & Paint
  const [bpLight, setBpLight] = useState(false);
  const [bpMedium, setBpMedium] = useState(false);
  const [bpHeavy, setBpHeavy] = useState(false);

  // Operation Code, Package, PNC, Campaign
  const [operationCode, setOperationCode] = useState('');
  const [packageSearch, setPackageSearch] = useState('');
  const [pncType, setPncType] = useState('pnc');
  const [pncValue, setPncValue] = useState('08991, 09333, 09333, 09333...');
  const [campaignSearch, setCampaignSearch] = useState('');

  // Expense
  const [expenseLimit, setExpenseLimit] = useState('less_then');
  const [totalExpense, setTotalExpense] = useState('');

  // Vehicle Status (bottom)
  const [vehicleStatusBottom, setVehicleStatusBottom] = useState('all');
  const [lastActive, setLastActive] = useState('');
  const [frequency, setFrequency] = useState('gs');
  const [serviceFrequency, setServiceFrequency] = useState('');

  const togglePm = (opt: string) => {
    setPmChecks((prev) => prev.includes(opt) ? prev.filter((p) => p !== opt) : [...prev, opt]);
  };

  const toggleOil = (code: string) => {
    setOilChecks((prev) => prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]);
  };

  return (
    <Box sx={tmtStyles.shared.columnGap3}>
      {/* Service-In Conditions Header */}
      <Box>
        <Box sx={tmtStyles.subsection.wrapper}>
          <Box sx={tmtStyles.subsection.bar} />
          <Typography sx={tmtStyles.subsection.title}>{t('tmt_service_in_conditions')}</Typography>
        </Box>
        <Grid container spacing={3} sx={tmtStyles.serviceIn.gridAlignEnd}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_vehicle_status')}</Typography>
            <RadioGroup value={vehicleStatus} onChange={(e) => setVehicleStatus(e.target.value)} row>
              <FormControlLabel value="repair_date" control={<Radio size="small" sx={tmtStyles.shared.redControl999} />} label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_repair_date')}</Typography>} />
              <FormControlLabel value="invoice_date" control={<Radio size="small" sx={tmtStyles.shared.redControl999} />} label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_invoice_date')}</Typography>} />
            </RadioGroup>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_from')}</Typography>
            <TextField size="small" fullWidth type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_to')}</Typography>
            <TextField size="small" fullWidth type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="DD/MM/YYYY" sx={tmtStyles.shared.textField40} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_workshop_type')}</Typography>
            <Select size="small" fullWidth value={workshopType} onChange={(e) => setWorkshopType(e.target.value)} sx={tmtStyles.shared.select}>
              <MenuItem value="gs">GS</MenuItem>
              <MenuItem value="bp">BP</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={tmtStyles.shared.dividerMy} />

      {/* Job Details */}
      <Box>
        <Typography sx={tmtStyles.serviceIn.jobDetailsTitle}>{t('tmt_job_details')}</Typography>
        <Grid container spacing={2}>
          {/* Periodic Maintenance */}
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Box sx={tmtStyles.serviceIn.jobCard}>
              <Typography sx={tmtStyles.serviceIn.jobCardTitle}>{t('tmt_periodic_maintenance')}</Typography>
              {pmOptions.map((opt) => (
                <FormControlLabel
                  key={opt}
                  control={<Checkbox size="small" checked={pmChecks.includes(opt)} onChange={() => togglePm(opt)} sx={tmtStyles.shared.redControl999Tight} />}
                  label={<Typography sx={tmtStyles.shared.menuItemLabel}>{opt}</Typography>}
                  sx={tmtStyles.serviceIn.pmControl}
                />
              ))}
            </Box>
          </Grid>

          {/* Oil Change Status */}
          <Grid size={{ xs: 12, sm: 4, md: 5 }}>
            <Box sx={tmtStyles.serviceIn.jobCard}>
              <Typography sx={tmtStyles.serviceIn.jobCardTitle}>{t('tmt_oil_change_status')}</Typography>
              {oilOptions.map((opt) => (
                <Box key={opt.code} sx={tmtStyles.serviceIn.oilRow}>
                  <Checkbox size="small" checked={oilChecks.includes(opt.code)} onChange={() => toggleOil(opt.code)} sx={tmtStyles.shared.redControl999Tight} />
                  <Typography sx={tmtStyles.serviceIn.oilLabel}>{t('tmt_repair_code')}</Typography>
                  <Typography sx={tmtStyles.serviceIn.oilCode}>{opt.code}</Typography>
                  <Typography sx={tmtStyles.serviceIn.oilDetailsLabel}>{t('tmt_details')}</Typography>
                  <Typography sx={tmtStyles.serviceIn.oilDetailsText}>{opt.details}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* General Repair & Body & Paint */}
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <Box sx={tmtStyles.serviceIn.jobCardStack}>
              <Box sx={tmtStyles.serviceIn.jobCard}>
                <Typography sx={tmtStyles.serviceIn.jobCardTitle}>{t('tmt_general_repair')}</Typography>
                <Box sx={tmtStyles.serviceIn.grRow}>
                  <FormControlLabel
                    control={<Checkbox size="small" checked={grChecked} onChange={(e) => setGrChecked(e.target.checked)} sx={tmtStyles.shared.redControl999Tight} />}
                    label={<Typography sx={tmtStyles.shared.menuItemLabel}>GR</Typography>}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" checked={mobileServiceChecked} onChange={(e) => setMobileServiceChecked(e.target.checked)} sx={tmtStyles.shared.redControl999Tight} />}
                    label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_mobile_service')}</Typography>}
                  />
                </Box>
              </Box>
              <Box sx={tmtStyles.serviceIn.jobCard}>
                <Typography sx={tmtStyles.serviceIn.jobCardTitle}>{t('tmt_body_and_paint')}</Typography>
                <FormControlLabel
                  control={<Checkbox size="small" checked={bpLight} onChange={(e) => setBpLight(e.target.checked)} sx={tmtStyles.shared.redControl999Tight} />}
                  label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_light')}</Typography>}
                  sx={tmtStyles.serviceIn.pmControl}
                />
                <FormControlLabel
                  control={<Checkbox size="small" checked={bpMedium} onChange={(e) => setBpMedium(e.target.checked)} sx={tmtStyles.shared.redControl999Tight} />}
                  label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_medium')}</Typography>}
                  sx={tmtStyles.serviceIn.pmControl}
                />
                <FormControlLabel
                  control={<Checkbox size="small" checked={bpHeavy} onChange={(e) => setBpHeavy(e.target.checked)} sx={tmtStyles.shared.redControl999Tight} />}
                  label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_heavy')}</Typography>}
                  sx={tmtStyles.serviceIn.pmControlLast}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={tmtStyles.shared.dividerMy} />

      {/* Operation Code, Package, PNC, Campaign row */}
      <Grid container spacing={3} sx={tmtStyles.serviceIn.gridAlignEnd}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_operation_code')}</Typography>
          <TextField
            size="small"
            fullWidth
            value={operationCode}
            onChange={(e) => setOperationCode(e.target.value)}
            slotProps={{ input: { endAdornment: <InputAdornment position="end"><SearchIcon sx={tmtStyles.serviceIn.searchIcon} /></InputAdornment> } }}
            sx={tmtStyles.shared.textField40}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_package')}</Typography>
          <TextField
            size="small"
            fullWidth
            value={packageSearch}
            onChange={(e) => setPackageSearch(e.target.value)}
            placeholder={t('tmt_search_placeholder')}
            slotProps={{ input: { endAdornment: <InputAdornment position="end"><SearchIcon sx={tmtStyles.serviceIn.searchIcon} /></InputAdornment> } }}
            sx={tmtStyles.shared.textField40}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_pnc')}</Typography>
          <Box sx={tmtStyles.serviceIn.pncRadioRow}>
            <RadioGroup value={pncType} onChange={(e) => setPncType(e.target.value)} row sx={tmtStyles.serviceIn.pncRadioGroup}>
              <FormControlLabel value="part_no" control={<Radio size="small" sx={tmtStyles.shared.redControl999XTight} />} label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_part_no')}</Typography>} />
              <FormControlLabel value="pnc" control={<Radio size="small" sx={tmtStyles.shared.redControl999XTight} />} label={<Typography sx={tmtStyles.shared.menuItemLabel}>PNC</Typography>} />
            </RadioGroup>
          </Box>
          <TextField
            size="small"
            fullWidth
            value={pncValue}
            onChange={(e) => setPncValue(e.target.value)}
            slotProps={{ input: { endAdornment: <InputAdornment position="end"><SearchIcon sx={tmtStyles.serviceIn.searchIcon} /></InputAdornment> } }}
            sx={tmtStyles.shared.textField40}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_campaign')}</Typography>
          <TextField
            size="small"
            fullWidth
            value={campaignSearch}
            onChange={(e) => setCampaignSearch(e.target.value)}
            placeholder={t('tmt_search_placeholder')}
            slotProps={{ input: { endAdornment: <InputAdornment position="end"><SearchIcon sx={tmtStyles.serviceIn.searchIcon} /></InputAdornment> } }}
            sx={tmtStyles.shared.textField40}
          />
        </Grid>
      </Grid>

      <Divider sx={tmtStyles.shared.dividerMy} />

      {/* Expense Limit & Total Expense */}
      <Grid container spacing={3} sx={tmtStyles.serviceIn.gridAlignEnd}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_expense_limit')}</Typography>
          <RadioGroup value={expenseLimit} onChange={(e) => setExpenseLimit(e.target.value)} row>
            <FormControlLabel value="less_then" control={<Radio size="small" sx={tmtStyles.shared.redControl999} />} label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_less_than')}</Typography>} />
            <FormControlLabel value="equal_greater" control={<Radio size="small" sx={tmtStyles.shared.redControl999} />} label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_equal_greater_than')}</Typography>} />
          </RadioGroup>
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_total_expense')}</Typography>
          <TextField size="small" fullWidth value={totalExpense} onChange={(e) => setTotalExpense(e.target.value)} sx={tmtStyles.shared.textField40} />
        </Grid>
      </Grid>

      <Divider sx={tmtStyles.shared.dividerMy} />

      {/* Vehicle Status (bottom row) */}
      <Grid container spacing={3} sx={tmtStyles.serviceIn.gridAlignEnd}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_vehicle_status')}</Typography>
          <RadioGroup value={vehicleStatusBottom} onChange={(e) => setVehicleStatusBottom(e.target.value)} row>
            <FormControlLabel value="all" control={<Radio size="small" sx={tmtStyles.shared.redControl999} />} label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_all')}</Typography>} />
            <FormControlLabel value="active" control={<Radio size="small" sx={tmtStyles.shared.redControl999} />} label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_active')}</Typography>} />
            <FormControlLabel value="inactive" control={<Radio size="small" sx={tmtStyles.shared.redControl999} />} label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_inactive')}</Typography>} />
            <FormControlLabel value="no_service" control={<Radio size="small" sx={tmtStyles.shared.redControl999} />} label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_no_service_history')}</Typography>} />
          </RadioGroup>
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_last_active')}</Typography>
          <TextField size="small" fullWidth value={lastActive} onChange={(e) => setLastActive(e.target.value)} sx={tmtStyles.shared.textField40} />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_frequency')}</Typography>
          <Select size="small" fullWidth value={frequency} onChange={(e) => setFrequency(e.target.value)} sx={tmtStyles.shared.select}>
            <MenuItem value="gs">GS</MenuItem>
            <MenuItem value="bp">BP</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_service_frequency')}</Typography>
          <TextField size="small" fullWidth value={serviceFrequency} onChange={(e) => setServiceFrequency(e.target.value)} sx={tmtStyles.shared.textField40} />
        </Grid>
      </Grid>
    </Box>
  );
};

// ===== Dealer Approval Status Tab =====
interface DealerRow {
  no: number;
  dealer: string;
  totalVehicle: number;
  status: 'Pending Approve' | 'Approved' | 'Rejected' | 'Stopped';
}

const dealerData: DealerRow[] = [
  { no: 1, dealer: '123009  Toyota Buzz', totalVehicle: 1200, status: 'Pending Approve' },
  { no: 2, dealer: '123008  Toyota K. Motor', totalVehicle: 1000, status: 'Approved' },
  { no: 3, dealer: '123007  ABC Toyota', totalVehicle: 800, status: 'Rejected' },
  { no: 4, dealer: '123006  City Toyota', totalVehicle: 600, status: 'Stopped' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  'Pending Approve': { bg: '#FFF3E0', color: '#E65100' },
  'Approved': { bg: '#E8F5E9', color: '#2E7D32' },
  'Rejected': { bg: '#FFEBEE', color: '#C62828' },
  'Stopped': { bg: '#F5F5F5', color: '#616161' },
};

const DealerApprovalStatusTab: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const totalVehicleSortMarker = sortField === 'totalVehicle' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕';
  const statusSortMarker = sortField === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕';

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedData = [...dealerData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField as keyof DealerRow];
    const bVal = b[sortField as keyof DealerRow];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortOrder === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  return (
    <Box>
      <Box sx={tmtStyles.subsection.wrapper}>
        <Box sx={tmtStyles.subsection.bar} />
        <Typography sx={tmtStyles.subsection.title}>{t('tmt_dealer_approval_status')}</Typography>
      </Box>

      <Box sx={tmtStyles.dealer.tableWrap}>
        {/* Export button */}
        <Box sx={tmtStyles.dealer.exportBar}>
          <Button
            size="small"
            startIcon={<ExportIcon sx={tmtStyles.dealer.exportIcon} />}
            variant="text"
            sx={tmtStyles.dealer.exportButton}
          >
            {t('tmt_export')}
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Box} sx={tmtStyles.dealer.tableContainer}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...(tmtStyles.dealer.headerCellBase as object), ...tmtStyles.dealer.headerColNo }}>
                  {t('tmt_col_no')}
                </TableCell>
                <TableCell sx={tmtStyles.dealer.headerCellBase}>
                  {t('tmt_col_dealer')}
                </TableCell>
                <TableCell
                  sx={{ ...(tmtStyles.dealer.headerCellBase as object), ...tmtStyles.dealer.headerSortableRight }}
                  onClick={() => handleSort('totalVehicle')}
                >
                  {t('tmt_col_total_vehicle')} {totalVehicleSortMarker}
                </TableCell>
                <TableCell
                  sx={tmtStyles.dealer.headerStatusBase}
                  onClick={() => handleSort('status')}
                >
                  {t('tmt_col_status')} {statusSortMarker}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.no} sx={tmtStyles.dealer.bodyRow}>
                  <TableCell sx={tmtStyles.dealer.bodyCell}>
                    {row.no}
                  </TableCell>
                  <TableCell sx={tmtStyles.dealer.bodyCell}>
                    {row.dealer}
                  </TableCell>
                  <TableCell sx={tmtStyles.dealer.bodyCellRight}>
                    {row.totalVehicle.toLocaleString()}
                  </TableCell>
                  <TableCell sx={tmtStyles.dealer.bodyCellStatus}>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={getStatusChipStyle(statusColors[row.status].bg, statusColors[row.status].color)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={tmtStyles.dealer.paginationBar}>
          <Typography sx={tmtStyles.dealer.paginationInfo}>
            {t('tmt_showing')} 1 {t('tmt_to_lower')} {dealerData.length} {t('tmt_out_of')} {dealerData.length}
          </Typography>
          <Box sx={tmtStyles.dealer.paginationControls}>
            <Button size="small" variant="outlined" sx={tmtStyles.dealer.goToButton}>
              {t('tmt_go_to')}
            </Button>
            <Select size="small" value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} sx={tmtStyles.dealer.rowsPerPageSelect}>
              <MenuItem value={10}>10 {t('tmt_rows')}</MenuItem>
              <MenuItem value={25}>25 {t('tmt_rows')}</MenuItem>
              <MenuItem value={50}>50 {t('tmt_rows')}</MenuItem>
            </Select>
            <Pagination
              count={3}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              size="small"
              shape="rounded"
              sx={tmtStyles.dealer.pagination}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ===== Main Page Component =====
const TmtActivityCustomPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [contactChannels, setContactChannels] = useState<ContactChannelRow[]>(initialContactChannels);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  const methods = useForm<TmtActivityFormData>({
    defaultValues: {
      activityType: 'tmt_custom',
      activityId: 'AY260001',
      activityName: 'Other Service Activity 1',
      activityDescription: 'Other Service Activity Description',
      picDealer: 'sales_dealer',
      excludeDealer: ['51011', '11106'],
      validFrom: '2026-07-28',
      validTo: '2026-07-28',
      customerType: 'all',
      gender: 'all',
      maritalStatus: 'all',
      province: '',
      district: '',
      subDistrict: '',
      zipCode: '',
      dobSelectRange: 'date_month',
      fromDate: '',
      fromMonth: '',
      toDate: '',
      toMonth: '',
      minAge: '',
      maxAge: '',
      occupation: '',
      hobby: '',
      educationalQualification: 'bachelor',
      incomeRange: 'more_than_100000',
      carOwner: false,
      carUser: false,
      numberOfCarsFrom: '5',
      numberOfCarsTo: '10',
      smsEnabled: true,
      emailEnabled: false,
      convenientDays: ['saturday', 'sunday'],
      allDay: false,
      morningShift: false,
      afternoonShift: false,
      lunchTime: false,
      afterWorkingHour: false,
      tConnectMember: true,
      aliveXMember: true,
    },
  });

  const { watch, setValue } = methods;
  const watchedValues = watch();

  // Contact channel table handlers
  // Table validation for the contact-channel rows, powered by the iCROP table's
  // useFormValidation hook. Values are stored as a flat `${field}_${rowId}` map.
  const channelForm = useFormValidation<Record<string, any>>({}, t);

  // Every contact-channel row is always in inline-edit mode, so mark them all.
  const channelEditRowIndex = React.useMemo(
    () => Object.fromEntries(contactChannels.map((c) => [String(c.id), true])),
    [contactChannels]
  );

  // Seed the form value store from the current rows (fields the table edits).
  const seedChannelValues = React.useCallback(
    (rows: ContactChannelRow[]) => {
      channelForm.setValues((prev) => {
        const next = { ...prev };

        rows.forEach((row) => {
          const fieldsToSeed: Array<keyof ContactChannelRow> = ['contactProcess', 'channel', 'dayFrom'];

          fieldsToSeed.forEach((field) => {
            const key = `${field}_${row.id}`;
            if (!Object.hasOwn(next, key)) {
              next[key] = row[field] ?? '';
            }
          });
        });

        return next;
      });
    },
    [channelForm]
  );

  // Seed initial rows once on mount.
  React.useEffect(() => {
    seedChannelValues(initialContactChannels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddChannel = () => {
    const newId = contactChannels.length > 0 ? Math.max(...contactChannels.map((c) => c.id)) + 1 : 1;
    const newRow: ContactChannelRow = {
      id: newId,
      status: 'ADD',
      contactProcess: '',
      channel: '',
      dayFrom: '',
      dayTo: '',
      assignGroup: '',
    };
    setContactChannels((prev) => [...prev, newRow]);
    seedChannelValues([newRow]);
  };

  const handleDeleteChannel = (id: number) => {
    setContactChannels((prev) => prev.filter((c) => c.id !== id));
    // Drop this row's field values/errors from the validation store.
    channelForm.unRegisterByPartialName(`_${id}`);
  };

  const handleSave = () => {
    // Validate all contact-channel rows; scroll to the first error if any.
    const tableErrors = channelForm.validateForm(true, true);
    if (tableErrors) {
      console.log('[TmtActivityCustomPage] Contact channel validation failed:', tableErrors);
      return;
    }

    // Merge validated table values back into the row objects.
    const { result } = channelForm.getUpdatedCollection('id');
    const mergedChannels = contactChannels.map((c) => ({
      ...c,
      ...result[String(c.id)],
    }));
    setContactChannels(mergedChannels);

    console.log('[TmtActivityCustomPage] Save:', watchedValues, mergedChannels);
    setShowSuccessToast(true);
  };

  // Contact Channel Details table columns using the iCROP table component
  const contactChannelColumns: ICropColumn<ContactChannelRow>[] = [
    {
      id: 'no',
      label: t('tmt_col_no'),
      fieldtype: 'label',
      width: '5%',
      render: (_value, _row, index) => index + 1,
    },
    {
      id: 'status',
      label: t('tmt_col_status'),
      fieldtype: 'label',
      width: '8%',
      render: (value) => (
        <Typography sx={{ ...(tmtStyles.contactTable.statusText as object), color: getContactStatusColor(value === 'ADD') }}>
          {value as string}
        </Typography>
      ),
    },
    {
      id: 'contactProcess',
      label: t('tmt_col_contact_process'),
      // Rendered as an inline dropdown by the table and validated via `validations`.
      editTemplate: 'dropdown',
      width: '35%',
      isRequired: true,
      placeholder: t('tmt_select_placeholder'),
      preloadData: contactProcessOptions.map((opt) => ({
        value: opt.value,
        label: t(opt.labelKey as any),
      })),
      validations: [
        validators.required(
          t('validation_required', { field: t('tmt_col_contact_process') })
        ),
      ],
    },
    {
      id: 'channel',
      label: t('tmt_col_channel'),
      editTemplate: 'dropdown',
      width: '22%',
      isRequired: true,
      placeholder: t('tmt_select_placeholder'),
      preloadData: channelOptions.map((opt) => ({
        value: opt.value,
        label: t(opt.labelKey as any),
      })),
      validations: [
        validators.required(t('validation_required', { field: t('tmt_col_channel') })),
      ],
    },
    {
      id: 'dayFrom',
      label: t('tmt_col_activity_day'),
      editTemplate: 'number',
      cellType: 'Number',
      width: '18%',
      align: 'center',
      isRequired: true,
      validations: [
        validators.required(
          t('validation_required', { field: t('tmt_col_activity_day') })
        ),
        validators.number(t('validation_invalid_number')),
      ],
    },
    {
      id: 'action',
      label: t('tmt_col_action'),
      fieldtype: 'action',
      width: '8%',
      align: 'center',
      renderActions: (row) => (
        <IconButton size="small" onClick={() => handleDeleteChannel(row.id)} sx={tmtStyles.contactTable.deleteIconButton}>
          <DeleteIcon sx={tmtStyles.contactTable.deleteIcon} />
        </IconButton>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={t('tmt_page_title')}
        breadcrumbs={[
          { label: t('tmt_breadcrumb_activity_setup'), path: '/activity-setup' },
          { label: t('tmt_breadcrumb_tmt_activity_list'), path: '/activity-setup/tmt' },
          { label: t('tmt_page_title') },
        ]}
        showBack
      />

      <FormProvider {...methods}>
        <Box sx={tmtStyles.page.formStack}>

          {/* ===== Activity Type Section ===== */}
          <SectionCard title={t('tmt_activity_type_section')}>
            <Controller
              name="activityType"
              control={methods.control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel
                    value="tmt_upload"
                    control={<Radio size="small" sx={tmtStyles.shared.redControl999NoPad} />}
                    label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_tmt_upload')}</Typography>}
                  />
                  <FormControlLabel
                    value="tmt_custom"
                    control={<Radio size="small" sx={tmtStyles.shared.redControl999NoPad} />}
                    label={<Typography sx={tmtStyles.shared.menuItemLabel}>{t('tmt_tmt_custom')}</Typography>}
                  />
                </RadioGroup>
              )}
            />
          </SectionCard>

          {/* ===== Activity Setup Section ===== */}
          <SectionCard title={t('tmt_activity_setup_section')}>
            <Box sx={tmtStyles.page.fullWidth}>
              {/* ==================== ROW 1 ==================== */}
              <Box sx={tmtStyles.page.setupRow1}>
                {/* Activity ID */}
                <Box>
                  <Typography sx={tmtStyles.page.labelGrey}>
                    {t('tmt_activity_id')}
                  </Typography>

                  <TextField
                    size="small"
                    fullWidth
                    disabled
                    value={watchedValues.activityId}
                    sx={tmtStyles.shared.textField40Disabled}
                  />
                </Box>

                {/* Activity Name */}
                <Box>
                  <Typography sx={tmtStyles.page.labelRed}>
                    {t('tmt_activity_name')} *
                  </Typography>

                  <Controller
                    name="activityName"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField {...field} size="small" fullWidth sx={tmtStyles.shared.textField40} />
                    )}
                  />
                </Box>

                {/* Activity Description */}
                <Box sx={tmtStyles.page.descriptionCol}>
                  <Typography sx={tmtStyles.page.labelRed}>
                    {t('tmt_activity_description')} *
                  </Typography>

                  <Controller
                    name="activityDescription"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField {...field} size="small" fullWidth sx={tmtStyles.shared.textField40} />
                    )}
                  />
                </Box>
              </Box>
              {/* ==================== ROW 2 ==================== */}
              <Box sx={tmtStyles.page.setupRow2}>
                {/* PIC Dealer */}
                <Box>
                  <Typography sx={tmtStyles.page.labelGrey}>
                    {t('tmt_pic_dealer')}
                  </Typography>

                  <Controller
                    name="picDealer"
                    control={methods.control}
                    render={({ field }) => (
                      <Select {...field} size="small" fullWidth sx={tmtStyles.shared.selectSm}>
                        {picDealerOptions.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {t(opt.labelKey as any)}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Box>

                {/* Exclude Dealer */}
                <Box>
                  <Typography sx={tmtStyles.page.labelGrey}>
                    {t('tmt_exclude_dealer')}
                  </Typography>

                  <MultiSelectDropdown
                    value={watchedValues.excludeDealer}
                    onChange={(val) => setValue('excludeDealer', val)}
                    options={excludeDealerOptions}
                    placeholder={t('tmt_select_dealers')}
                  />
                </Box>

                {/* Valid From & Valid To */}
                <Box sx={tmtStyles.page.validRangeGrid}>
                  {/* Valid From */}
                  <Box>
                    <Typography sx={tmtStyles.page.labelRed}>
                      {t('tmt_valid_from')} *
                    </Typography>

                    <Controller
                      name="validFrom"
                      control={methods.control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          size="small"
                          fullWidth
                          slotProps={{ inputLabel: { shrink: true } }}
                          sx={tmtStyles.shared.textField40}
                        />
                      )}
                    />
                  </Box>

                  {/* Valid To */}
                  <Box>
                    <Typography sx={tmtStyles.page.labelRed}>
                      {t('tmt_valid_to')} *
                    </Typography>

                    <Controller
                      name="validTo"
                      control={methods.control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          size="small"
                          fullWidth
                          slotProps={{ inputLabel: { shrink: true } }}
                          sx={tmtStyles.shared.textField40}
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </SectionCard> 

          {/* ===== Customer & Vehicle Information Section ===== */}
          <SectionCard title={t('tmt_customer_vehicle_info')}>
            <Box>
              {/* Tabs */}
              <MuiTabs
                value={activeTab}
                onChange={(_, newVal) => setActiveTab(newVal)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={tmtStyles.page.tabs}
              >
                <Tab label={t('tmt_tab_customer_overview')} />
                <Tab label={t('tmt_tab_vehicle_conditions')} />
                <Tab label={t('tmt_tab_service_in_conditions')} />
                <Tab label={t('tmt_tab_dealer_approval_status')} />
              </MuiTabs>

              {/* Tab Panel: Customer Overview & Conditions */}
              {activeTab === 0 && (
                <Box sx={tmtStyles.page.customerTabStack}>

                  {/* Customer Information sub-section */}
                  <Box>
                    <Box sx={tmtStyles.subsection.wrapperLg}>
                      <Box sx={tmtStyles.subsection.barPill} />
                      <Typography sx={tmtStyles.subsection.titlePrompt}>{t('tmt_customer_information')}</Typography>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_customer_type')}</Typography>
                        <Controller
                          name="customerType"
                          control={methods.control}
                          render={({ field }) => (
                            <Select {...field} size="small" fullWidth sx={tmtStyles.shared.select}>
                              {customerTypeOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{t(opt.labelKey as any)}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_gender')}</Typography>
                        <Controller
                          name="gender"
                          control={methods.control}
                          render={({ field }) => (
                            <Select {...field} size="small" fullWidth sx={tmtStyles.shared.select}>
                              {genderOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{t(opt.labelKey as any)}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_marital_status')}</Typography>
                        <Controller
                          name="maritalStatus"
                          control={methods.control}
                          render={({ field }) => (
                            <Select {...field} size="small" fullWidth sx={tmtStyles.shared.select}>
                              {maritalStatusOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{t(opt.labelKey as any)}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Address sub-section */}
                  <Box>
                    <Box sx={tmtStyles.subsection.wrapperLg}>
                      <Box sx={tmtStyles.subsection.barPill} />
                      <Typography sx={tmtStyles.subsection.titlePrompt}>{t('tmt_address')}</Typography>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_province')}</Typography>
                        <Controller
                          name="province"
                          control={methods.control}
                          render={({ field }) => (
                            <Select {...field} size="small" fullWidth displayEmpty sx={tmtStyles.shared.select}>
                              {provinceOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{t(opt.labelKey as any)}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_district')}</Typography>
                        <Select
                          size="small"
                          fullWidth
                          displayEmpty
                          disabled
                          value=""
                          sx={tmtStyles.shared.selectDisabled}
                        >
                          <MenuItem value="">&nbsp;</MenuItem>
                        </Select>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_sub_district')}</Typography>
                        <Select
                          size="small"
                          fullWidth
                          displayEmpty
                          disabled
                          value=""
                          sx={tmtStyles.shared.selectDisabled}
                        >
                          <MenuItem value="">&nbsp;</MenuItem>
                        </Select>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography sx={tmtStyles.shared.fieldLabel}>{t('tmt_zip_code')}</Typography>
                        <Select
                          size="small"
                          fullWidth
                          displayEmpty
                          disabled
                          value=""
                          sx={tmtStyles.shared.selectDisabled}
                        >
                          <MenuItem value="">&nbsp;</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Date of Birth sub-section - multi-column layout with dividers */}
                  <Box>
                    <Box sx={tmtStyles.subsection.wrapperLg}>
                      <Box sx={tmtStyles.subsection.barPill} />
                      <Typography sx={tmtStyles.subsection.titlePrompt}>{t('tmt_date_of_birth')}</Typography>
                    </Box>

                    {/* Multi-Column structure with vertical dividers */}
                    <Box sx={tmtStyles.page.dobColumnsRow}>
                      {/* Column 1: Date of Birth - Select Range + From/To Date & Month */}
                      <Box sx={tmtStyles.page.dobColFirst}>
                        <Typography sx={tmtStyles.page.dobColLabelMb15}>{t('tmt_select_range')}</Typography>
                        <Controller
                          name="dobSelectRange"
                          control={methods.control}
                          render={({ field }) => (
                            <RadioGroup {...field} row sx={tmtStyles.page.dobRangeRadioGroup}>
                              <FormControlLabel
                                value="date_month"
                                control={<Radio size="small" sx={tmtStyles.page.dobRadioRedAlways} />}
                                label={<Typography sx={tmtStyles.page.dobRadioLabel}>{t('tmt_date_and_month')}</Typography>}
                                sx={tmtStyles.page.dobRangeFirstRadioNoMr}
                              />
                              <FormControlLabel
                                value="month"
                                control={<Radio size="small" sx={tmtStyles.page.dobRadioBlack} />}
                                label={<Typography sx={tmtStyles.page.dobRadioLabel}>{t('tmt_month')}</Typography>}
                              />
                            </RadioGroup>
                          )}
                        />
                        {/* From Date + From Month */}
                        <Grid container spacing={1.5} sx={tmtStyles.page.dobRangeGridMb}>
                          <Grid size={6}>
                            <Typography sx={tmtStyles.shared.fieldLabelTight}>{t('tmt_from_date')}</Typography>
                            <NumberSpinner
                              value={watchedValues.fromDate}
                              onChange={(val) => setValue('fromDate', val)}
                              placeholder={t('tmt_select_date')}
                            />
                          </Grid>
                          <Grid size={6}>
                            <Typography sx={tmtStyles.shared.fieldLabelTight}>{t('tmt_from_month')}</Typography>
                            <MonthSelector
                              value={watchedValues.fromMonth}
                              onChange={(val) => setValue('fromMonth', val)}
                            />
                          </Grid>
                        </Grid>
                        {/* To Date + To Month */}
                        <Grid container spacing={1.5}>
                          <Grid size={6}>
                            <Typography sx={tmtStyles.shared.fieldLabelTight}>{t('tmt_to_date')}</Typography>
                            <NumberSpinner
                              value={watchedValues.toDate}
                              onChange={(val) => setValue('toDate', val)}
                              placeholder={t('tmt_select_date')}
                            />
                          </Grid>
                          <Grid size={6}>
                            <Typography sx={tmtStyles.shared.fieldLabelTight}>{t('tmt_to_month')}</Typography>
                            <MonthSelector
                              value={watchedValues.toMonth}
                              onChange={(val) => setValue('toMonth', val)}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Vertical Divider 1 */}
                      <Box sx={tmtStyles.page.dobVerticalDividerWrap}>
                        <Divider orientation="vertical" sx={tmtStyles.page.dobVerticalDivider} />
                      </Box>

                      {/* Column 2: Age & Qualification */}
                      <Box sx={tmtStyles.page.dobColMiddle}>
                        <Typography sx={tmtStyles.page.dobColLabelMb3}>{t('tmt_age_qualification')}</Typography>
                        <Grid container spacing={1.5} sx={tmtStyles.page.dobRangeGridMb}>
                          <Grid size={6}>
                            <Typography sx={tmtStyles.shared.fieldLabelTight}>{t('tmt_min_age')}</Typography>
                            <Controller
                              name="minAge"
                              control={methods.control}
                              render={({ field }) => (
                                <TextField {...field} size="small" fullWidth placeholder={t('tmt_lower_limit')} sx={tmtStyles.shared.ageTextField} />
                              )}
                            />
                          </Grid>
                          <Grid size={6}>
                            <Typography sx={tmtStyles.shared.fieldLabelTight}>{t('tmt_max_age')}</Typography>
                            <Controller
                              name="maxAge"
                              control={methods.control}
                              render={({ field }) => (
                                <TextField {...field} size="small" fullWidth placeholder={t('tmt_upper_limit')} sx={tmtStyles.shared.ageTextField} />
                              )}
                            />
                          </Grid>
                        </Grid>
                        <Box>
                          <EllipsisText sx={tmtStyles.page.educationEllipsis}>{t('tmt_educational_qualification')}</EllipsisText>
                          <Controller
                            name="educationalQualification"
                            control={methods.control}
                            render={({ field }) => (
                              <Select {...field} size="small" fullWidth sx={tmtStyles.shared.select}>
                                {educationOptions.map((opt) => (
                                  <MenuItem key={opt.value} value={opt.value}>{t(opt.labelKey as any)}</MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </Box>
                      </Box>

                      {/* Vertical Divider 2 */}
                      <Box sx={tmtStyles.page.dobVerticalDividerWrap}>
                        <Divider orientation="vertical" sx={tmtStyles.page.dobVerticalDivider} />
                      </Box>

                      {/* Column 3: Occupation */}
                      <Box sx={tmtStyles.page.dobColMiddle}>
                        <Typography sx={tmtStyles.page.dobColLabelMb3}>{t('tmt_occupation_label')}</Typography>
                        <Box sx={tmtStyles.page.occupationBlockMb}>
                          <Typography sx={tmtStyles.shared.fieldLabelTight}>{t('tmt_occupation')}</Typography>
                          <Controller
                            name="occupation"
                            control={methods.control}
                            render={({ field }) => (
                              <Select {...field} size="small" fullWidth displayEmpty sx={tmtStyles.shared.select}>
                                {occupationOptions.map((opt) => (
                                  <MenuItem key={opt.value} value={opt.value}>{t(opt.labelKey as any)}</MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </Box>
                        <Box>
                          <Typography sx={tmtStyles.shared.fieldLabelTight}>{t('tmt_income_range')}</Typography>
                          <Controller
                            name="incomeRange"
                            control={methods.control}
                            render={({ field }) => (
                              <Select {...field} size="small" fullWidth sx={tmtStyles.shared.select}>
                                {incomeRangeOptions.map((opt) => (
                                  <MenuItem key={opt.value} value={opt.value}>{t(opt.labelKey as any)}</MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </Box>
                      </Box>

                      {/* Vertical Divider 3 */}
                      <Box sx={tmtStyles.page.dobVerticalDividerWrap}>
                        <Divider orientation="vertical" sx={tmtStyles.page.dobVerticalDivider} />
                      </Box>

                      {/* Column 4: Hobby */}
                      <Box sx={tmtStyles.page.dobColLast}>
                        <Box sx={tmtStyles.page.hobbySpacer} />
                        <Box sx={tmtStyles.page.occupationBlockMb}>
                          <Typography sx={tmtStyles.shared.fieldLabelTight}>{t('tmt_hobby')}</Typography>
                          <Controller
                            name="hobby"
                            control={methods.control}
                            render={({ field }) => (
                              <Select {...field} size="small" fullWidth displayEmpty sx={tmtStyles.shared.select}>
                                <MenuItem value=""><em></em></MenuItem>
                              </Select>
                            )}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Tab Panel: Vehicle Conditions */}
              {activeTab === 1 && (
                <VehicleConditionsTab />
              )}

              {/* Tab Panel: Service-In Conditions */}
              {activeTab === 2 && (
                <ServiceInConditionsTab />
              )}

              {/* Tab Panel: Dealer Approval Status */}
              {activeTab === 3 && (
                <DealerApprovalStatusTab />
              )}
            </Box>
          </SectionCard>

          {/* ===== Ownership Type Section ===== */}
          <SectionCard title={t('tmt_ownership_type')}>
            <Box sx={tmtStyles.page.inlineRow}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={watchedValues.carOwner}
                    onChange={(e) => setValue('carOwner', e.target.checked)}
                    sx={tmtStyles.shared.redControl49NoPad}
                  />
                }
                label={<Typography sx={tmtStyles.page.ownershipLabel}>{t('tmt_car_owner')}</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={watchedValues.carUser}
                    onChange={(e) => setValue('carUser', e.target.checked)}
                    sx={tmtStyles.shared.redControl49NoPad}
                  />
                }
                label={<Typography sx={tmtStyles.page.ownershipLabel}>{t('tmt_car_user')}</Typography>}
              />
              <Divider orientation="vertical" flexItem sx={tmtStyles.page.verticalDividerMx1} />
              <Box sx={tmtStyles.page.numberOfCarsRow}>
                <Typography sx={tmtStyles.page.ownershipLabel}>{t('tmt_number_of_cars')}</Typography>
                <Box>
                  <Typography sx={tmtStyles.shared.fieldLabelTight}>{t('tmt_from')}</Typography>
                  <Controller
                    name="numberOfCarsFrom"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField {...field} size="small" sx={tmtStyles.page.smallNumberField} />
                    )}
                  />
                </Box>
                <Box>
                  <Typography sx={tmtStyles.shared.fieldLabelTight}>{t('tmt_to')}</Typography>
                  <Controller
                    name="numberOfCarsTo"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField {...field} size="small" sx={tmtStyles.page.smallNumberField} />
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </SectionCard>

          {/* ===== Contact Channels Section ===== */}
          <SectionCard title={t('tmt_contact_channels')}>
            <Box sx={tmtStyles.page.inlineRowGap4}>
              <ToggleWithLabels
                label={t('tmt_sms')}
                checked={watchedValues.smsEnabled}
                onChange={(val) => setValue('smsEnabled', val)}
              />
              <Divider orientation="vertical" flexItem sx={tmtStyles.page.verticalDividerMx1} />
              <ToggleWithLabels
                label={t('tmt_email')}
                checked={watchedValues.emailEnabled}
                onChange={(val) => setValue('emailEnabled', val)}
              />
            </Box>
          </SectionCard>

          {/* ===== Preferred Contact Day & Time Section ===== */}
          <SectionCard title={t('tmt_preferred_contact_day_time')}>
            <Box sx={tmtStyles.page.contactDayTimeStack}>
              {/* Convenient Day */}
              <Box>
                <Typography sx={tmtStyles.page.convenientDayLabel}>{t('tmt_convenient_day')}</Typography>
                <Box sx={tmtStyles.page.convenientDayRow}>
                  <Box sx={tmtStyles.page.convenientDayChecks}>
                    {[
                      { key: 'monday', label: t('tmt_monday') },
                      { key: 'tuesday', label: t('tmt_tuesday') },
                      { key: 'wednesday', label: t('tmt_wednesday') },
                      { key: 'thursday', label: t('tmt_thursday') },
                      { key: 'friday', label: t('tmt_friday') },
                      { key: 'saturday', label: t('tmt_saturday') },
                      { key: 'sunday', label: t('tmt_sunday') },
                    ].map((day) => (
                      <FormControlLabel
                        key={day.key}
                        control={
                          <Checkbox
                            size="small"
                            checked={watchedValues.convenientDays.includes(day.key)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue('convenientDays', [...watchedValues.convenientDays, day.key]);
                              } else {
                                setValue('convenientDays', watchedValues.convenientDays.filter((d) => d !== day.key));
                              }
                            }}
                            sx={tmtStyles.shared.redControl49}
                          />
                        }
                        label={<Typography sx={tmtStyles.shared.optionLabel}>{day.label}</Typography>}
                        sx={tmtStyles.page.convenientDayControl}
                      />
                    ))}
                  </Box>
                  <Box sx={tmtStyles.page.quickSelectRow}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setValue('convenientDays', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])}
                      sx={tmtStyles.page.quickSelectButton}
                    >
                      {t('tmt_weekday')}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setValue('convenientDays', ['saturday', 'sunday'])}
                      sx={tmtStyles.page.quickSelectButton}
                    >
                      {t('tmt_saturday_sunday')}
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Available Time */}
              <Box>
                <Typography sx={tmtStyles.page.convenientDayLabel}>{t('tmt_available')}</Typography>
                <Box sx={tmtStyles.page.availableRow}>
                  {/* Column 1: All Day */}
                  <Box sx={tmtStyles.page.availableColAllDay}>
                    <Typography sx={tmtStyles.page.availableColTitle}>{t('tmt_all_day')}</Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={watchedValues.allDay}
                          onChange={(e) => setValue('allDay', e.target.checked)}
                          sx={tmtStyles.shared.redControl49}
                        />
                      }
                      label={<Typography sx={tmtStyles.shared.optionLabel}>08:00 - 18:00</Typography>}
                    />
                  </Box>

                  <Divider orientation="vertical" flexItem />

                  {/* Column 2: AM - PM */}
                  <Box sx={tmtStyles.page.availableColAmPm}>
                    <Typography sx={tmtStyles.page.availableColTitle}>{t('tmt_am_pm')}</Typography>
                    <Box sx={tmtStyles.page.availableCheckStack}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={watchedValues.morningShift}
                            onChange={(e) => setValue('morningShift', e.target.checked)}
                            sx={tmtStyles.shared.redControl49}
                          />
                        }
                        label={<Typography sx={tmtStyles.shared.optionLabel}>{t('tmt_morning')}</Typography>}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={watchedValues.afternoonShift}
                            onChange={(e) => setValue('afternoonShift', e.target.checked)}
                            sx={tmtStyles.shared.redControl49}
                          />
                        }
                        label={<Typography sx={tmtStyles.shared.optionLabel}>{t('tmt_afternoon')}</Typography>}
                      />
                    </Box>
                  </Box>

                  <Divider orientation="vertical" flexItem />

                  {/* Column 3: Off Hour */}
                  <Box sx={tmtStyles.page.availableColOffHour}>
                    <Typography sx={tmtStyles.page.availableColTitle}>{t('tmt_off_hour')}</Typography>
                    <Box sx={tmtStyles.page.availableCheckStack}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={watchedValues.lunchTime}
                            onChange={(e) => setValue('lunchTime', e.target.checked)}
                            sx={tmtStyles.shared.redControl49}
                          />
                        }
                        label={<Typography sx={tmtStyles.shared.optionLabel}>{t('tmt_lunch_time')}</Typography>}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={watchedValues.afterWorkingHour}
                            onChange={(e) => setValue('afterWorkingHour', e.target.checked)}
                            sx={tmtStyles.shared.redControl49}
                          />
                        }
                        label={<Typography sx={tmtStyles.shared.optionLabel}>{t('tmt_after_working_hour')}</Typography>}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </SectionCard>

          {/* ===== Membership Information Section ===== */}
          <SectionCard title={t('tmt_membership_information')}>
            <Box sx={tmtStyles.page.inlineRowGap4}>
              <ToggleWithLabels
                label={t('tmt_t_connect_member')}
                checked={watchedValues.tConnectMember}
                onChange={(val) => setValue('tConnectMember', val)}
              />
              <Divider orientation="vertical" flexItem sx={tmtStyles.page.verticalDividerMx1} />
              <ToggleWithLabels
                label={t('tmt_alive_x_member')}
                checked={watchedValues.aliveXMember}
                onChange={(val) => setValue('aliveXMember', val)}
              />
            </Box>
          </SectionCard>

          {/* ===== Contact Channel Details Table ===== */}
          <SectionCard title={t('tmt_contact_channel_details')}>
            <TopTable<ContactChannelRow>
              headerCell={contactChannelColumns}
              rows={contactChannels}
              primaryKey="id"
              orderBy=""
              orderDir=""
              page={0}
              rowsPerPage={contactChannels.length || 1}
              editRowIndex={channelEditRowIndex}
              formApi={channelForm}
              isServerPagination
              hidePagination
              bordered
              headerActions={
                <Button
                  size="small"
                  startIcon={<AddIcon sx={tmtStyles.page.addButtonIcon} />}
                  onClick={handleAddChannel}
                  variant="text"
                  sx={tmtStyles.page.addButton}
                >
                  {t('tmt_add')}
                </Button>
              }
              handleSort={() => {}}
              handleChangePage={() => {}}
              handleChangeRowsPerPage={() => {}}
              onFilterChange={() => {}}
            />
          </SectionCard>
        </Box>
      </FormProvider>

      {/* ===== Footer Actions ===== */}
      <PageFooter
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<PauseIcon sx={tmtStyles.page.footerButtonIcon} />}
              onClick={() => setShowStopDialog(true)}
              sx={tmtStyles.page.footerButton}
            >
              {t('tmt_stop')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<ApproveIcon sx={tmtStyles.page.footerButtonIcon} />}
              onClick={() => setShowApproveDialog(true)}
              sx={tmtStyles.page.footerButton}
            >
              {t('tmt_approve')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<BlockIcon sx={tmtStyles.page.footerButtonIcon} />}
              sx={tmtStyles.page.footerButton}
            >
              {t('tmt_cancel')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<TargetIcon sx={tmtStyles.page.footerButtonIcon} />}
              sx={tmtStyles.page.footerButton}
            >
              {t('tmt_create_target')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<TemplateIcon sx={tmtStyles.page.footerButtonIcon} />}
              onClick={() => setShowTemplateDialog(true)}
              sx={tmtStyles.page.footerButton}
            >
              {t('tmt_set_template')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveIcon sx={tmtStyles.page.footerButtonIcon} />}
              onClick={handleSave}
              sx={tmtStyles.page.footerButton}
            >
              {t('tmt_save')}
            </Button>
          </>
        }
      />

      {/* Success Toast */}
      <ToastNotification
        open={showSuccessToast}
        message={t('tmt_save_success')}
        severity="success"
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Approve Confirmation Dialog */}
      <ConfirmDialog
        open={showApproveDialog}
        title="CONFIRMATION"
        message={
          <span>
            Are you sure, you want to <strong>Approved</strong> the operation?
          </span>
        }
        confirmText="YES"
        cancelText="NO"
        onConfirm={() => {
          setShowApproveDialog(false);
          setShowSuccessToast(true);
        }}
        onCancel={() => setShowApproveDialog(false)}
      />

      {/* Stop Confirmation Dialog */}
      <ConfirmDialog
        open={showStopDialog}
        title="CONFIRMATION"
        message={
          <span>
            Are you sure, you want to <strong>Stop</strong> the operation?
          </span>
        }
        confirmText="YES"
        cancelText="NO"
        onConfirm={() => {
          setShowStopDialog(false);
          setShowSuccessToast(true);
        }}
        onCancel={() => setShowStopDialog(false)}
      />

      {/* Set Template Dialog */}
      <SetTemplateDialog
        open={showTemplateDialog}
        title="Reminder Message Setup"
        activityId="AY260001"
        activityName="PM 1K Service"
        contactProcessOptions={[
          { value: 'follow_up', label: 'Service Follow-up' },
          { value: 'appointment', label: 'Appointment Confirmation' },
          { value: 'reminder', label: 'Service Reminder' },
        ]}
        parameters={[
          { label: 'PM Operation (Short)', value: '90,000' },
          { label: 'P M Operation / Month (Full)', value: '90,000 km / 54 months' },
          { label: 'License Plate', value: 'GH45346' },
          { label: 'Car Series', value: 'Camry' },
        ]}
        onSave={(data) => {
          console.log('[TmtActivityCustomPage] Template saved:', data);
          setShowSuccessToast(true);
        }}
        onCancel={() => setShowTemplateDialog(false)}
      />
    </PageContainer>
  );
};

export default TmtActivityCustomPage;
