import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PageContainer, PageHeader, PageFooter, SectionCard } from '@components/layout';
import { FormTextField, FormSelect, FormRadioGroup, FormNumberField } from '@components/form';
import {
  Box,
  Button,
  Grid,
  CircularProgress,
  Divider,
  SummaryCard,
  ConfirmDialog,
  ErrorBoundary,
  ErrorState,
  ToastNotification,
  SetTemplateDialog,
  TemplateIcon,
  DeleteIcon,
  SaveIcon,
  CarIcon,
  PeopleIcon,
  BusinessIcon,
} from '@components/common';
import ServiceRepairSection from './components/serviceRepairSection';
import ContactChannelSection, { ContactChannelSectionRef } from './components/contactChannelSection';
import { APP_DEFAULTS } from '@constants/appDefaults';
import { useTranslation, useApi, useFormErrorHandler } from '@hooks';
import apiService from '@services/apiService';
import { ENDPOINTS } from '@services/endpoints';
import { activitySetupStyles } from './activitySetup.styles';

const styles = activitySetupStyles.page;

// ===== Types for API response =====
interface ActivitySetupApiResponse {
  summary: {
    totalVehicles: number;
    totalIndividualCustomers: number;
    individualPercentage: string;
    totalCorporateCustomers: number;
    corporatePercentage: string;
  };
  activityTypes: { value: string; label: string }[];
  customerTypes: { value: string; label: string }[];
  formData: {
    activityType: string;
    activityId: string;
    activityName: string;
    activityDescription: string;
    customerType: string;
    suppressDays: number;
  };
  repairItems: {
    id: number;
    repairCode: string;
    description: string;
    selected: boolean;
    mandatory: string;
  }[];
  contactChannels: {
    id: number;
    status: string;
    contactProcess: string;
    channel: string;
    activityDay: number;
  }[];
  mileageRanges: { value: string; label: string }[];
  contactProcessOptions: { value: string; label: string }[];
  channelOptions: { value: string; label: string }[];
}

interface ActivitySavePayload {
  activityType: string;
  activityId?: string;
  activityName: string;
  activityDescription: string;
  customerType: string;
  suppressDays: number;
}

// ===== API URL (json-server endpoint) =====
const ACTIVITY_SETUP_URL = ENDPOINTS.ACTIVITY.SETUP;

const ActivitySetupPage: React.FC = () => {
  const { t } = useTranslation();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showSuccessToast, setShowSuccessToast] = React.useState(false);
  const [successToastMessage, setSuccessToastMessage] = React.useState('');
  const [showTemplateDialog, setShowTemplateDialog] = React.useState(false);
  const contactChannelRef = React.useRef<ContactChannelSectionRef>(null);

  // ===== API Hooks =====

  // Fetch all page data from http://localhost:3000/api/activity-setup
  const pageDataApi = useApi<ActivitySetupApiResponse>({
    context: 'ActivitySetupPage',
    showErrorToast: true,
  });

  // Save activity setup
  const saveApi = useApi<ActivitySavePayload>({
    successMessage: 'Activity saved successfully!',
    context: 'ActivitySetupPage-Save',
    showErrorToast: true,
  });

  // Delete activity
  const deleteApi = useApi<void>({
    successMessage: 'Activity deleted successfully!',
    context: 'ActivitySetupPage-Delete',
    showErrorToast: true,
  });

  // ===== Form Validation Schema =====
  const schema = yup.object().shape({
    activityType: yup.string().required(t('validation_required', { field: t('activity_type_section') })),
    activityId: yup.string(),
    activityName: yup.string().required(t('validation_required', { field: t('activity_name') })),
    activityDescription: yup.string().required(t('validation_required', { field: t('activity_description') })),
    customerType: yup.string().required(t('validation_required', { field: t('customer_type') })),
    suppressDays: yup.number().required(t('validation_required', { field: t('suppress_days') })),
  });

  type ActivityFormData = yup.InferType<typeof schema>;

  const methods = useForm<ActivityFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      activityType: 'periodic_maintenance',
      activityId: 'PM260001',
      activityName: 'Periodic Maintenance 20,000',
      activityDescription: '',
      customerType: '',
      suppressDays: 90,
    },
  });

  // Server-side validation error handling (maps 422 errors to form fields)
  const { handleSubmitError } = useFormErrorHandler<ActivityFormData>(methods.setError);

  // ===== Fetch page data on mount =====
  useEffect(() => {
    pageDataApi.execute(() => apiService.get<ActivitySetupApiResponse>(ACTIVITY_SETUP_URL));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== When data arrives, populate form =====
  useEffect(() => {
    if (pageDataApi.data) {
      const { formData } = pageDataApi.data;
      methods.reset({
        activityType: formData.activityType,
        activityId: formData.activityId,
        activityName: formData.activityName,
        activityDescription: formData.activityDescription,
        customerType: formData.customerType,
        suppressDays: formData.suppressDays,
      });
    }
  }, [pageDataApi.data, methods]);

  // ===== Derived data (from API or fallbacks) =====
  const summary = pageDataApi.data?.summary ?? APP_DEFAULTS.activitySummary;

  const activityTypeOptions = pageDataApi.data?.activityTypes ?? [
    { value: 'periodic_maintenance', label: t('periodic_maintenance') },
    { value: 'additional_rejected', label: t('additional_rejected') },
    { value: 'dcm_vehicle', label: t('dcm_vehicle') },
    { value: 'tcfr', label: t('tcfr') },
    { value: 'ssc_csc', label: t('ssc_csc') },
    { value: 'body_paint', label: t('body_paint') },
    { value: 'bp_insurance', label: t('bp_insurance') },
    { value: 'post_service', label: t('post_service_followup') },
  ];

  const customerTypeOptions = pageDataApi.data?.customerTypes ?? [
    { value: 'individual', label: t('customer_individual') },
    { value: 'corporate', label: t('customer_corporate') },
    { value: 'all', label: t('customer_all') },
  ];

  // ===== Save handler with full error handling =====
  const handleSave = () => {
    // Always validate table on Save click
    const tableValid = contactChannelRef.current?.validateAllRows() ?? true;

    // Trigger form validation
    methods.handleSubmit(
      async (data) => {
        if (!tableValid) return;

        console.log('[ActivitySetupPage] All validations passed. Calling Save API...', data);

        const result = await saveApi.execute(() =>
          apiService.post<ActivitySavePayload>(ENDPOINTS.ACTIVITY.BASE, {
            ...data,
            id: data.activityId || `PM${Date.now()}`,
            status: 'active',
          })
        );

        // Show success toast only when the Save API succeeded.
        if (result) {
          setSuccessToastMessage(t('activity_save_success'));
          setShowSuccessToast(true);
        }

        // If save failed with validation errors (422), map them to form fields
        if (!result && saveApi.error) {
          console.log('[ActivitySetupPage] Save API failed:', saveApi.error.userMessage);
          handleSubmitError(saveApi.error.originalError);
        }
      },
      (errors) => {
        // Form has validation errors — they'll show inline
        console.log('[ActivitySetupPage] Form validation failed:', errors);
      }
    )();
  };

  // ===== Delete handler with error handling =====
  const handleDeleteActivity = async () => {
    setShowDeleteDialog(false);
    const activityId = methods.getValues('activityId') || '';

    console.log('[ActivitySetupPage] Calling Delete API for:', activityId);

    await deleteApi.execute(() =>
      apiService.delete<void>(ENDPOINTS.ACTIVITY.BASE, activityId)
    );
  };

  // ===== Loading state =====
  if (pageDataApi.loading) {
    return (
      <PageContainer>
        <Box sx={styles.loadingWrap}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // ===== Error state with retry =====
  if (pageDataApi.error && !pageDataApi.data) {
    return (
      <PageContainer>
        <PageHeader
          title={t('activity_setup_title')}
          breadcrumbs={[
            { label: t('breadcrumb_activity_setup'), path: 'activity-setup/dlr-activity-maintenance' },
            { label: t('breadcrumb_setup_by_dealer') },
          ]}
          showBack
        />
        <ErrorState
          title={t('error_load_activity_setup')}
          description={pageDataApi.error.userMessage}
          onRetry={() => pageDataApi.execute(() => apiService.get<ActivitySetupApiResponse>(ACTIVITY_SETUP_URL))}
          retryLabel={t('error_retry_btn')}
        />
      </PageContainer>
    );
  }

  // ===== Main render =====
  return (
    <PageContainer>
      <PageHeader
        title={t('activity_setup_title')}
        breadcrumbs={[
          { label: t('breadcrumb_activity_setup'), path: '/activity-setup/dlr-activity-maintenance' },
          { label: t('breadcrumb_activity_list'), path: '/activity-setup/list' },
          { label: t('breadcrumb_setup_by_dealer') },
        ]}
        showBack
      />

      <FormProvider {...methods}>
        <Box component="form" sx={styles.form}>
          {/* Activity Type Section */}
          <SectionCard title={t('activity_type_section')}>
            <Box sx={styles.activityTypeRow}>
              <Box sx={styles.activityTypeRadioCol}>
                <FormRadioGroup
                  name="activityType"
                  options={activityTypeOptions}
                  row={false}
                  dense
                />
              </Box>
              {/* Vertical Divider */}
              <Divider orientation="vertical" flexItem sx={styles.verticalDivider} />


              {/* Summary cards: a compact horizontal row on sm+ (matches design),
                  but STACK vertically (one full-width card per row) on mobile —
                  same behavior as the dashboard status cards. */}
              <Box sx={styles.summaryCardsRow}>
                <SummaryCard
                  icon={<CarIcon sx={styles.summaryIconCar} />}
                  title={t('total_vehicles_db')}
                  value={summary.totalVehicles.toLocaleString()}
                  iconBgColor="#FFF3E0"
                />
                <SummaryCard
                  icon={<PeopleIcon sx={styles.summaryIconPeople} />}
                  title={t('total_individual_customers')}
                  value={summary.totalIndividualCustomers.toLocaleString()}
                  subtitle={`(${summary.individualPercentage})`}
                  iconBgColor="#E3F2FD"
                />
                <SummaryCard
                  icon={<BusinessIcon sx={styles.summaryIconBusiness} />}
                  title={t('total_corporate_customers')}
                  value={summary.totalCorporateCustomers.toLocaleString()}
                  subtitle={`(${summary.corporatePercentage})`}
                  iconBgColor="#EDE7F6"
                />
              </Box>
            </Box>
          </SectionCard>

          {/* Activity Setup Section */}
          <SectionCard title={t('activity_setup_section')}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormTextField name="activityId" label={t('activity_id')} disabled />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormTextField name="activityName" label={t('activity_name')} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormTextField name="activityDescription" label={t('activity_description')} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormSelect name="customerType" label={t('customer_type')} options={customerTypeOptions} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormNumberField name="suppressDays" label={t('suppress_days')} required />
              </Grid>
            </Grid>
          </SectionCard>

          {/* Service & Repair Section - Wrapped with Error Boundary */}
          <ErrorBoundary level="section">
            <ServiceRepairSection />
          </ErrorBoundary>

          {/* Contact Channel Section - Wrapped with Error Boundary */}
          <ErrorBoundary level="section">
            <ContactChannelSection ref={contactChannelRef} />
          </ErrorBoundary>
        </Box>
      </FormProvider>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title={t('delete_dialog_title')}
        message={t('delete_dialog_message')}
        confirmColor="error"
        onConfirm={handleDeleteActivity}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* Fixed Footer with Action Buttons & Copyright */}
      <PageFooter
        actions={
          <>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<DeleteIcon sx={styles.footerButtonIcon} />}
              onClick={() => setShowDeleteDialog(true)}
              disabled={deleteApi.loading}
              sx={styles.footerButton}
            >
              {deleteApi.loading ? t('deleting') : t('delete_activity')}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<TemplateIcon sx={styles.footerButtonIcon} />}
              onClick={() => setShowTemplateDialog(true)}
              sx={styles.footerButton}
            >
              {t('set_Template')}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<SaveIcon sx={styles.footerButtonIcon} />}
              onClick={handleSave}
              disabled={saveApi.loading}
              sx={styles.footerButton}
            >
              {saveApi.loading ? t('saving') : t('save_btn')}
            </Button>
          </>
        }
      />

      {/* Set Template Dialog */}
      <SetTemplateDialog
        open={showTemplateDialog}
        title={t('template_dialog_title')}
        activityId={methods.getValues('activityId') || 'PM260001'}
        activityName={methods.getValues('activityName') || ''}
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
          console.log('[ActivitySetupPage] Template saved:', data);
          setSuccessToastMessage(t('template_save_success'));
          setShowSuccessToast(true);
        }}
        onCancel={() => setShowTemplateDialog(false)}
      />

      {/* Success Toast */}
      <ToastNotification
        open={showSuccessToast}
        message={successToastMessage}
        severity="success"
        onClose={() => setShowSuccessToast(false)}
      />
    </PageContainer>
  );
};

export default ActivitySetupPage;
