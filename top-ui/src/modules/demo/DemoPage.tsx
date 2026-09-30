import React, { useState } from 'react';
import { Box, Grid, Typography, Button, Alert } from '@components/common';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PageContainer, PageHeader, SectionCard } from '@components/layout';
import ErrorHandlingDemo from './ErrorHandlingDemo';
import {
  FormTextField,
  FormPasswordField,
  FormTextArea,
  FormSearchField,
  FormEmailField,
  FormUrlField,
  FormPhoneField,
  FormOtpInput,
  FormNumberField,
  FormCurrencyField,
  FormSlider,
  FormRating,
  FormDatePicker,
  FormDateRangePicker,
  FormTimePicker,
  FormSelect,
  FormMultiSelect,
  FormAutoComplete,
  FormRadioGroup,
  FormCheckbox,
  FormCheckboxGroup,
  FormSwitch,
  FormFileUpload,
  FormImageUpload,
  FormColorPicker,
} from '@components/form';
import {
  ConfirmDialog,
  AlertDialog,
  ToastNotification,
  LoadingOverlay,
  EmptyState,
  ErrorState,
  SkeletonLoader,
  SummaryCard,
  InfoCard,
  Badge,
  StatusIndicator,
  ProgressBar,
  Avatar,
  Tooltip,
  Tabs,
  Stepper,
  Breadcrumb,
  Divider,
  PrimaryButton,
  SecondaryButton,
  DeleteButton,
  SaveButton,
  BackButton,
  AddButton,
  ActionIconButton,
  ButtonGroup,
} from '@components/common';
import { TopTable } from '@components/table';
import type { ICropColumn } from '@components/table';
import { PeopleIcon, CartIcon, TrendIcon } from '@components/common';
import { SchedulerCalendar } from '@components/common';
import type { Branch, CallCenterStaff, WorkingDay } from '../../types/holiday.types';

const selectOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const radioOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const checkboxOptions = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
  { value: 'delete', label: 'Delete' },
  { value: 'admin', label: 'Admin' },
];

const autoCompleteOptions = [
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'svelte', label: 'Svelte' },
];

const schedulerBranches: Branch[] = [
  { code: 'BKK01', name: 'Toyota Metropolitan Bangkok' },
  { code: 'CNX01', name: 'Chiang Mai' },
  { code: 'KKN01', name: 'Khon Kaen' },
  { code: 'PKT01', name: 'Phuket' },
];

const schedulerStaff: CallCenterStaff[] = [
  { id: 1, code: 'CC001', name: 'Chalicia Kittikul', nickName: 'Fah', position: 'Senior Call Center Agent' },
  { id: 2, code: 'CC002', name: 'Ekkachai Prasert', nickName: 'Bank', position: 'Call Center Agent' },
  { id: 3, code: 'CC003', name: 'Suda Wong', nickName: 'Nok', position: 'Call Center Agent' },
];

/**
 * Seed calendar data for the demo (no backend). Tags the working weekdays of
 * the current month with "Not Effect Call Plan" so the flag is visible, mirroring
 * the Figma. Saving a holiday/availability in the UI adds/keeps these tags.
 */
const buildSchedulerSeed = (): Record<string, WorkingDay> => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const seed: Record<string, WorkingDay> = {};
  for (let d = 1; d <= daysInMonth; d += 1) {
    const date = new Date(year, month, d);
    const weekday = date.getDay(); // 0 Sun .. 6 Sat
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isWeekend = weekday === 0 || weekday === 6;
    seed[iso] = {
      date: iso,
      type: isWeekend ? 'weekend' : 'working',
      editable: true,
      callPlanTag: weekday === 1 ? 'Not Effect Call Plan' : null, // Mondays, like the Figma row
    };
  }
  return seed;
};

const schedulerSeed = buildSchedulerSeed();

const tableData = [
  { id: 1, name: 'Somchai Michai', email: 'somchai@example.com', status: 'Active', role: 'Admin' },
  { id: 2, name: 'Napat Siriwat', email: 'napat@example.com', status: 'Active', role: 'User' },
  { id: 3, name: 'Kanya Pramoj', email: 'kanya@example.com', status: 'Inactive', role: 'Manager' },
  { id: 4, name: 'Chai Wongsa', email: 'chai@example.com', status: 'Pending', role: 'User' },
  { id: 5, name: 'Priya Tanaka', email: 'priya@example.com', status: 'Active', role: 'Admin' },
];

type DemoTableRow = (typeof tableData)[number];

const tableColumns: ICropColumn<DemoTableRow>[] = [
  { id: 'id', label: 'ID', fieldtype: 'label', width: 60, cellType: 'Number' },
  { id: 'name', label: 'Name', fieldtype: 'label' },
  { id: 'email', label: 'Email', fieldtype: 'label' },
  { id: 'status', label: 'Status', fieldtype: 'label' },
  { id: 'role', label: 'Role', fieldtype: 'label' },
];

const DemoPage: React.FC = () => {
  const methods = useForm({
    defaultValues: {
      textField: 'Hello World',
      password: '',
      textarea: 'Lorem ipsum dolor sit amet',
      search: '',
      email: 'test@example.com',
      url: '',
      phone: '0812345678',
      phoneCode: '+66',
      otp: '',
      numberField: 42,
      currency: 1500.5,
      slider: 60,
      rating: 4,
      datePicker: '2026-01-15',
      dateFrom: '2026-01-01',
      dateTo: '2026-12-31',
      timePicker: '09:30',
      select: 'option1',
      multiSelect: ['option1', 'option2'],
      autoComplete: 'react',
      radioGroup: 'male',
      checkbox: true,
      checkboxGroup: ['read', 'write'],
      switch: true,
      fileUpload: [],
      imageUpload: null,
      colorPicker: '#CC0000',
    },
  });

  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showValidateData, setShowValidateData] = useState(false);
  const [showCrmUpdates, setShowCrmUpdates] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [stepperActive, setStepperActive] = useState(1);

  // ===== iCROP table (client-side sort + pagination) state =====
  const [demoRows, setDemoRows] = useState<DemoTableRow[]>(tableData);
  const [demoOrderBy, setDemoOrderBy] = useState('');
  const [demoOrderDir, setDemoOrderDir] = useState<'asc' | 'desc' | ''>('');
  const [demoPage, setDemoPage] = useState(0);
  const [demoRowsPerPage, setDemoRowsPerPage] = useState(10);

  const onSubmit = (data: Record<string, unknown>) => {
    console.log('Form data:', data);
    setShowToast(true);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Component Showcase"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Component Showcase' },
        ]}
      />

      {/* ====== APPOINTMENT SCHEDULER / BRANCH HOLIDAY MASTER ====== */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="Appointment Scheduler (Branch Holiday Master)">
          <SchedulerCalendar
            branches={schedulerBranches}
            staff={schedulerStaff}
            defaultBranchCode="BKK01"
            initialDays={schedulerSeed}
            useBackend={false}
            onChange={() => console.log('Scheduler data changed')}
          />
        </SectionCard>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>

          {/* ====== TEXT INPUT COMPONENTS ====== */}
          <Box sx={{ mt: 2 }}>
            <SectionCard title="Text Input Components">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormTextField name="textField" label="Text Field" required placeholder="Enter text" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormPasswordField name="password" label="Password" required placeholder="Enter password" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormEmailField name="email" label="Email" required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormUrlField name="url" label="URL" placeholder="https://example.com" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormPhoneField name="phone" label="Phone" required countryCodeName="phoneCode" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormSearchField name="search" label="Search Field" onSearch={(v) => console.log('Search:', v)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormOtpInput name="otp" label="OTP Verification" length={6} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                  <FormTextArea name="textarea" label="Text Area" rows={3} showCharCount maxLength={500} />
                </Grid>
              </Grid>
            </SectionCard>
          </Box>

          {/* ====== NUMBER INPUT COMPONENTS ====== */}
          <Box sx={{ mt: 2 }}>
            <SectionCard title="Number Input Components">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormNumberField name="numberField" label="Number" min={0} max={1000} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormCurrencyField name="currency" label="Currency (THB)" currencySymbol="฿" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormSlider name="slider" label="Slider" min={0} max={100} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormRating name="rating" label="Rating" />
                </Grid>
              </Grid>
            </SectionCard>
          </Box>

          {/* ====== DATE & TIME COMPONENTS ====== */}
          <Box sx={{ mt: 2 }}>
            <SectionCard title="Date & Time Components">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormDatePicker name="datePicker" label="Date Picker" required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormTimePicker name="timePicker" label="Time Picker" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormDateRangePicker nameFrom="dateFrom" nameTo="dateTo" label="Date Range" />
                </Grid>
              </Grid>
            </SectionCard>
          </Box>

          {/* ====== SELECTION COMPONENTS ====== */}
          <Box sx={{ mt: 2 }}>
            <SectionCard title="Selection Components">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormSelect name="select" label="Dropdown Select" options={selectOptions} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormMultiSelect name="multiSelect" label="Multi Select" options={selectOptions} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormAutoComplete name="autoComplete" label="Auto Complete" options={autoCompleteOptions} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormRadioGroup name="radioGroup" label="Radio Group" options={radioOptions} row />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormCheckbox name="checkbox" label="Single Checkbox" />
                  <FormSwitch name="switch" label="Toggle Switch" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormCheckboxGroup name="checkboxGroup" label="Checkbox Group" options={checkboxOptions} columns={2} />
                </Grid>
              </Grid>
            </SectionCard>
          </Box>

          {/* ====== FILE & MISC COMPONENTS ====== */}
          <Box sx={{ mt: 2 }}>
            <SectionCard title="File Upload & Misc">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormImageUpload name="imageUpload" label="Profile Image" shape="circle" previewSize={80} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormColorPicker name="colorPicker" label="Color Picker" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormFileUpload name="fileUpload" label="File Upload" multiple accept=".pdf,.doc,.xlsx" maxFiles={3} />
                </Grid>
              </Grid>
            </SectionCard>
          </Box>

          {/* Submit */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#CC0000' }}>
              Submit All Form Data
            </Button>
          </Box>
        </form>
      </FormProvider>

      {/* ====== COMMON UI COMPONENTS ====== */}
      <Divider label="Common UI Components" spacing={3} />

      {/* Buttons */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="Action Buttons">
          <ButtonGroup align="left" spacing={1.5}>
            <PrimaryButton label="Primary" />
            <SecondaryButton label="Secondary" />
            <AddButton label="Add New" />
            <SaveButton />
            <DeleteButton />
            <BackButton />
            <ActionIconButton icon="edit" />
            <ActionIconButton icon="delete" color="#F44336" />
            <ActionIconButton icon="refresh" />
            <ActionIconButton icon="download" />
          </ButtonGroup>
        </SectionCard>
      </Box>

      {/* Badges & Status */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="Badges, Status & Avatars">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
            <Badge label="Active" variant="success" />
            <Badge label="Pending" variant="warning" />
            <Badge label="Error" variant="error" />
            <Badge label="Info" variant="info" />
            <Badge label="Default" variant="default" />
            <Badge label="Primary" variant="primary" />
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
            <StatusIndicator status="active" />
            <StatusIndicator status="inactive" />
            <StatusIndicator status="pending" />
            <StatusIndicator status="error" />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar name="Somchai Michai" size="small" />
            <Avatar name="Napat Siriwat" size="medium" showName />
            <Avatar name="Kanya Pramoj" size="large" showName subtitle="Manager" />
          </Box>
        </SectionCard>
      </Box>

      {/* Info Cards */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="Info Cards & Summary Cards">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoCard title="Total Users" value={12450} trend={{ value: 12.5, label: 'vs last month' }} icon={<PeopleIcon />} variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoCard title="Revenue" value="฿1.2M" trend={{ value: -3.2, label: 'vs last month' }} icon={<CartIcon />} variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoCard title="Growth" value="24%" subtitle="Year over year" icon={<TrendIcon />} variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <SummaryCard icon={<PeopleIcon sx={{ color: '#CC0000', fontSize: 20 }} />} title="Customers" value={5231} subtitle="(15%)" iconBgColor="#FFEBEE" />
            </Grid>
          </Grid>
        </SectionCard>
      </Box>

      {/* Progress & Tooltip */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="Progress Bars & Tooltips">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <ProgressBar value={75} label="Upload Progress" color="primary" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <ProgressBar value={45} label="Task Completion" color="warning" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <ProgressBar value={90} label="Storage Used" color="success" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Tooltip title="This is a tooltip!">
                  <Button variant="outlined" size="small">Hover me (Top)</Button>
                </Tooltip>
                <Tooltip title="Bottom tooltip" placement="bottom">
                  <Button variant="outlined" size="small">Hover me (Bottom)</Button>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </SectionCard>
      </Box>

      {/* Tabs */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="Tabs Component">
          <Tabs
            tabs={[
              { id: 'tab1', label: 'General', content: <Typography>General tab content here.</Typography> },
              { id: 'tab2', label: 'Settings', content: <Typography>Settings tab content here.</Typography> },
              { id: 'tab3', label: 'Advanced', content: <Typography>Advanced tab content here.</Typography> },
            ]}
          />
        </SectionCard>
      </Box>

      {/* Stepper */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="Stepper Component">
          <Stepper
            steps={[
              { label: 'Account Details' },
              { label: 'Personal Info', optional: true },
              { label: 'Review & Submit' },
            ]}
            activeStep={stepperActive}
            onNext={() => setStepperActive((s) => Math.min(s + 1, 2))}
            onBack={() => setStepperActive((s) => Math.max(s - 1, 0))}
            onComplete={() => alert('Completed!')}
          />
        </SectionCard>
      </Box>

      {/* Breadcrumb */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="Breadcrumb">
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'Activity Setup', path: '/activity-setup' },
              { label: 'Setup Activity By Dealer' },
            ]}
            onNavigate={(path) => console.log('Navigate:', path)}
          />
        </SectionCard>
      </Box>

      {/* Skeleton Loaders */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="Skeleton Loaders">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block' }}>Table Skeleton</Typography>
              <SkeletonLoader variant="table" rows={3} columns={3} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block' }}>Form Skeleton</Typography>
              <SkeletonLoader variant="form" rows={3} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block' }}>List Skeleton</Typography>
              <SkeletonLoader variant="list" rows={3} />
            </Grid>
          </Grid>
        </SectionCard>
      </Box>

      {/* Empty & Error States */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="State Displays">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 1 }}>
                <EmptyState title="No Records" description="No records found matching your criteria." actionLabel="Add New" onAction={() => {}} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 1 }}>
                <ErrorState onRetry={() => console.log('Retry')} />
              </Box>
            </Grid>
          </Grid>
        </SectionCard>
      </Box>

      {/* iCROP Table */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="Data Table Component">
          <TopTable<DemoTableRow>
            headerCell={tableColumns}
            rows={demoRows}
            primaryKey="id"
            orderBy={demoOrderBy}
            orderDir={demoOrderDir}
            page={demoPage}
            rowsPerPage={demoRowsPerPage}
            editRowIndex={{}}
            rowSelection
            multiSelection
            bordered
            handleSort={(_event, property, sorted) => {
              const isAsc = demoOrderBy === property && demoOrderDir === 'asc';
              setDemoOrderDir(isAsc ? 'desc' : 'asc');
              setDemoOrderBy(property);
              if (sorted) setDemoRows(sorted as DemoTableRow[]);
            }}
            handleChangePage={(_event, newPage) => setDemoPage(newPage)}
            handleChangeRowsPerPage={(data) => {
              setDemoRowsPerPage(Number.parseInt(data.target.value, 10));
              setDemoPage(0);
            }}
            onFilterChange={() => {}}
          />
        </SectionCard>
      </Box>

      {/* Dialogs & Notifications */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="Dialogs & Notifications">
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button variant="outlined" size="small" onClick={() => setShowConfirmSave(true)}>
              Confirm Save
            </Button>
            <Button variant="outlined" size="small" onClick={() => setShowConfirmCancel(true)}>
              Confirm Cancel
            </Button>
            <Button variant="outlined" size="small" color="error" onClick={() => setShowConfirmDelete(true)}>
              Delete Record
            </Button>
            <Button variant="outlined" size="small" color="error" onClick={() => setShowErrorAlert(true)}>
              Error Alert (ERR 3001)
            </Button>
            <Button variant="outlined" size="small" color="warning" onClick={() => setShowValidateData(true)}>
              Validate Data
            </Button>
            <Button variant="outlined" size="small" color="info" onClick={() => setShowCrmUpdates(true)}>
              New CRM Updates
            </Button>
            <Button variant="outlined" size="small" color="success" onClick={() => setShowToast(true)}>
              Toast Notification
            </Button>
            <Button variant="outlined" size="small" onClick={() => { setShowLoading(true); setTimeout(() => setShowLoading(false), 2000); }}>
              Loading Overlay (2s)
            </Button>
          </Box>
        </SectionCard>
      </Box>

      {/* Confirm Save Dialog */}
      <ConfirmDialog
        open={showConfirmSave}
        title="CONFIRMATION"
        message="Are you sure, you want to save the operation?"
        confirmText="YES"
        cancelText="NO"
        onConfirm={() => { setShowConfirmSave(false); setShowToast(true); }}
        onCancel={() => setShowConfirmSave(false)}
      />

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        open={showConfirmCancel}
        title="CONFIRMATION"
        message="Are you sure, you want to cancel the operation?"
        confirmText="YES"
        cancelText="NO"
        onConfirm={() => setShowConfirmCancel(false)}
        onCancel={() => setShowConfirmCancel(false)}
      />

      {/* Delete Record Dialog */}
      <ConfirmDialog
        open={showConfirmDelete}
        title="DELETE RECORD"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="DELETE"
        cancelText="NO"
        variant="danger"
        confirmColor="error"
        onConfirm={() => { setShowConfirmDelete(false); setShowToast(true); }}
        onCancel={() => setShowConfirmDelete(false)}
      />

      {/* Error Alert (ERR 3001) */}
      <AlertDialog
        open={showErrorAlert}
        type="error"
        title="ERR 3001"
        message="ERR 3001 Data for 'Retail Sales Unit' Downloaded. Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
        onClose={() => setShowErrorAlert(false)}
      />

      {/* Validate Data Dialog */}
      <AlertDialog
        open={showValidateData}
        type="error"
        title="VALIDATE DATA"
        message={
          <Box>
            <Typography sx={{ fontSize: '0.875rem', color: '#333333', mb: 0.5 }}>
              Error on <strong>Row 1</strong>
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#333333' }}>Customer ID cannot be blank.</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#333333' }}>Customer Surname cannot be blank.</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#333333' }}>Telephone Number cannot be blank.</Typography>
          </Box>
        }
        onClose={() => setShowValidateData(false)}
      />

      {/* New CRM Updates Dialog */}
      <AlertDialog
        open={showCrmUpdates}
        type="info"
        title="New CRM Updates"
        message={
          <Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#333333', mb: 0.5 }}>
                <Box component="span" sx={{ color: '#EB0A1E', mr: 0.5 }}>1</Box> Follow-Up Activity Update
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: '#555555', lineHeight: 1.6 }}>
                New follow-up activity rules have been implemented. Please review the updated guidelines before creating customer appointments.
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#EB0A1E', cursor: 'pointer', mt: 0.5, textDecoration: 'underline' }}>
                View More →
              </Typography>
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#333333', mb: 0.5 }}>
                <Box component="span" sx={{ color: '#EB0A1E', mr: 0.5 }}>2</Box> Scheduled System Maintenance
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: '#555555', lineHeight: 1.6 }}>
                New CRM system will be down for maintenance on March 30, 2026, from 7:00 PM to 9:00 PM.
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#EB0A1E', cursor: 'pointer', mt: 0.5, textDecoration: 'underline' }}>
                View More →
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#333333', mb: 0.5 }}>
                <Box component="span" sx={{ color: '#EB0A1E', mr: 0.5 }}>3</Box> CRM User Training Session
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: '#555555', lineHeight: 1.6 }}>
                A CRM refresher training session is scheduled for all Service Advisors.
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: '#555555' }}>
                Link: <Box component="span" sx={{ color: '#1976D2', textDecoration: 'underline', cursor: 'pointer' }}>CRM User Training Session</Box>
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#EB0A1E', cursor: 'pointer', mt: 0.5, textDecoration: 'underline' }}>
                View More →
              </Typography>
            </Box>
          </Box>
        }
        onClose={() => setShowCrmUpdates(false)}
      />

      {/* Toast */}
      <ToastNotification
        open={showToast}
        message="Operation completed successfully!"
        severity="success"
        onClose={() => setShowToast(false)}
      />

      {/* Loading */}
      <LoadingOverlay open={showLoading} message="Processing..." />

      {/* ====== VALIDATION FORM TEST ====== */}
      <Divider label="Form Validation Test" spacing={3} />
      <ValidationFormSection />

      {/* ====== ERROR HANDLING DEMO ====== */}
      <Divider label="Error Handling Framework Demo" spacing={3} />
      <ErrorHandlingDemo />

    </PageContainer>
  );
};

// ===========================
// VALIDATION FORM SECTION
// ===========================

const validationSchema = yup.object().shape({
  val_firstName: yup.string().required('First name is required').min(2, 'Minimum 2 characters'),
  val_lastName: yup.string().required('Last name is required').min(2, 'Minimum 2 characters'),
  val_email: yup.string().required('Email is required').email('Invalid email format'),
  val_password: yup.string().required('Password is required').min(8, 'Minimum 8 characters').matches(/[A-Z]/, 'Must contain at least one uppercase letter').matches(/[0-9]/, 'Must contain at least one number'),
  val_confirmPassword: yup.string().required('Confirm password is required').oneOf([yup.ref('val_password')], 'Passwords must match'),
  val_phone: yup.string().required('Phone number is required').matches(/^[0-9]{9,10}$/, 'Phone must be 9-10 digits'),
  val_age: yup.number().required('Age is required').min(18, 'Must be at least 18').max(100, 'Must be 100 or less').typeError('Age must be a number'),
  val_salary: yup.number().required('Salary is required').min(1, 'Salary must be greater than 0').typeError('Salary must be a number'),
  val_birthDate: yup.string().required('Birth date is required'),
  val_startTime: yup.string().required('Start time is required'),
  val_department: yup.string().required('Department is required'),
  val_skills: yup.array().min(1, 'Select at least one skill').required('Skills are required'),
  val_gender: yup.string().required('Gender is required'),
  val_bio: yup.string().required('Bio is required').min(20, 'Bio must be at least 20 characters').max(300, 'Bio must be less than 300 characters'),
  val_website: yup.string().required('Website is required').url('Must be a valid URL (include https://)'),
  val_termsAccepted: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  val_rating: yup.number().required('Rating is required').min(1, 'Please provide a rating'),
  val_color: yup.string().required('Color is required'),
});

type ValidationFormData = yup.InferType<typeof validationSchema>;

const departmentOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
];

const skillOptions = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'sql', label: 'SQL' },
];

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const ValidationFormSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ValidationFormData | null>(null);

  const methods = useForm<ValidationFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      val_firstName: '',
      val_lastName: '',
      val_email: '',
      val_password: '',
      val_confirmPassword: '',
      val_phone: '',
      val_age: undefined,
      val_salary: undefined,
      val_birthDate: '',
      val_startTime: '',
      val_department: '',
      val_skills: [],
      val_gender: '',
      val_bio: '',
      val_website: '',
      val_termsAccepted: false,
      val_rating: 0,
      val_color: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = (data: ValidationFormData) => {
    setSubmitted(true);
    setFormData(data);
    console.log('Validation Form Submitted:', data);
  };

  const onError = (errors: Record<string, unknown>) => {
    setSubmitted(false);
    setFormData(null);
    console.log('Validation Errors:', errors);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <SectionCard title="Form Validation Test (Click Submit to see all validation errors)">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit, onError)}>

            {/* Success Message */}
            {submitted && formData && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Form submitted successfully! Check the console for form data.
              </Alert>
            )}

            {/* Error Count */}
            {Object.keys(methods.formState.errors).length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {Object.keys(methods.formState.errors).length} validation error(s) found. Please fix the highlighted fields.
              </Alert>
            )}

            {/* Text Fields */}
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, mt: 1, color: '#CC0000' }}>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormTextField name="val_firstName" label="First Name" required placeholder="Enter first name" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormTextField name="val_lastName" label="Last Name" required placeholder="Enter last name" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormEmailField name="val_email" label="Email Address" required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormPasswordField name="val_password" label="Password" required placeholder="Min 8 chars, 1 uppercase, 1 number" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormPasswordField name="val_confirmPassword" label="Confirm Password" required placeholder="Re-enter password" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormPhoneField name="val_phone" label="Phone Number" required />
              </Grid>
            </Grid>

            {/* Number & Date Fields */}
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, mt: 3, color: '#CC0000' }}>
              Employment Details
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormNumberField name="val_age" label="Age" required min={18} max={100} placeholder="18-100" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormCurrencyField name="val_salary" label="Monthly Salary" required currencySymbol="฿" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormDatePicker name="val_birthDate" label="Birth Date" required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormTimePicker name="val_startTime" label="Start Time" required />
              </Grid>
            </Grid>

            {/* Selection Fields */}
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, mt: 3, color: '#CC0000' }}>
              Selections & Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormSelect name="val_department" label="Department" options={departmentOptions} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormMultiSelect name="val_skills" label="Skills (select at least 1)" options={skillOptions} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormRadioGroup name="val_gender" label="Gender" options={genderOptions} required row />
              </Grid>
            </Grid>

            {/* Other Fields */}
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, mt: 3, color: '#CC0000' }}>
              Additional Info
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <FormTextArea name="val_bio" label="Bio (20-300 chars)" required rows={3} showCharCount maxLength={300} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormUrlField name="val_website" label="Website" required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormColorPicker name="val_color" label="Favorite Color" required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormRating name="val_rating" label="Your Rating" required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormCheckbox name="val_termsAccepted" label="I accept the Terms & Conditions *" />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{ mt: 3, display: 'flex', gap: 1.5, justifyContent: 'flex-end', borderTop: '1px solid #E0E0E0', pt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  methods.reset();
                  setSubmitted(false);
                  setFormData(null);
                }}
                sx={{ fontSize: '0.8125rem' }}
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: '#CC0000', '&:hover': { backgroundColor: '#990000' }, fontSize: '0.8125rem' }}
              >
                Submit & Validate All Fields
              </Button>
            </Box>
          </form>
        </FormProvider>
      </SectionCard>
    </Box>
  );
};

export default DemoPage;
