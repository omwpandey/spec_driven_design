import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { PageContainer, PageHeader, PageFooter, SectionCard } from '@components/layout';
import { FormRadioGroup } from '@components/form';
import {
  Box,
  Button,
  ConfirmDialog,
  ErrorBoundary,
  ToastNotification,
  SaveIcon,
} from '@components/common';
import { useTranslation, useApi } from '@hooks';
import apiService from '@services/apiService';
import { ENDPOINTS } from '@services/endpoints';
import PsfuItemSection, {
  PsfuItemSectionRef,
  type PsfuItemOption,
  type PsfuItemRow,
} from './components/psfuItemSection';
import { psfuActivityStyles } from './psfuActivity.styles';

const styles = psfuActivityStyles.page;

// The Activity Type value that reveals the PSFU Item section.
const POST_SERVICE_VALUE = 'post_service';

interface PsfuMaintenanceForm {
  activityType: string;
}

/** Shape of the PSFU maintenance page data returned by the API. */
interface PsfuActivityApiResponse {
  activityTypes: { value: string; label: string }[];
  itemOptions: PsfuItemOption[];
  items: PsfuItemRow[];
}

const TmtActivityMaintenancePage: React.FC = () => {
  const { t } = useTranslation();
  const psfuSectionRef = React.useRef<PsfuItemSectionRef>(null);

  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [showNoChangesDialog, setShowNoChangesDialog] = React.useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = React.useState(false);
  const [pendingActivityType, setPendingActivityType] = React.useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = React.useState(false);

  // ===== Load PSFU page data from the API =====
  const pageDataApi = useApi<PsfuActivityApiResponse>({
    context: 'TmtActivityMaintenancePage',
    showErrorToast: true,
  });

  React.useEffect(() => {
    pageDataApi.execute(() => apiService.get<PsfuActivityApiResponse>(ENDPOINTS.ACTIVITY.PSFU));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // DR: Post Service Follow Up (PSFU) is selected by default on load.
  const methods = useForm<PsfuMaintenanceForm>({
    defaultValues: { activityType: POST_SERVICE_VALUE },
  });

  const activityType = methods.watch('activityType');
  const isPsfuSelected = activityType === POST_SERVICE_VALUE;

  // Tracks the Activity Type currently "committed" on screen. Used to detect a
  // radio change and roll it back when PSFU has unsaved edits (WRN0004).
  const committedActivityType = React.useRef(POST_SERVICE_VALUE);

  React.useEffect(() => {
    if (activityType === committedActivityType.current) return;
    const leavingPsfu = committedActivityType.current === POST_SERVICE_VALUE;
    if (leavingPsfu && psfuSectionRef.current?.hasChanges()) {
      // Roll back the selection and ask the user to confirm.
      setPendingActivityType(activityType);
      const prev = committedActivityType.current;
      methods.setValue('activityType', prev);
      setShowUnsavedDialog(true);
      return;
    }
    committedActivityType.current = activityType;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityType]);

  // Activity Type options — displayed in the configured master sequence.
  // Sourced from the API when available, falling back to the translated list.
  const activityTypeOptions =
    pageDataApi.data?.activityTypes && pageDataApi.data.activityTypes.length > 0
      ? pageDataApi.data.activityTypes
      : [
        { value: 'periodic_maintenance', label: t('psfu_activity_periodic_maintenance') },
        { value: 'additional_rejected', label: t('psfu_activity_additional_rejected') },
        { value: 'dcm_vehicle', label: t('psfu_activity_dcm_vehicle') },
        { value: 'tcfr', label: t('psfu_activity_tcfr') },
        { value: 'ssc_csc', label: t('psfu_activity_ssc_csc') },
        { value: 'body_paint', label: t('psfu_activity_body_paint') },
        { value: 'bp_insurance', label: t('psfu_activity_bp_insurance') },
        { value: POST_SERVICE_VALUE, label: t('psfu_activity_post_service') },
      ];

  // ----- Unsaved-changes dialog (WRN0004) confirm / cancel -----
  const confirmActivityTypeChange = () => {
    if (pendingActivityType !== null) {
      committedActivityType.current = pendingActivityType;
      methods.setValue('activityType', pendingActivityType);
    }
    setPendingActivityType(null);
    setShowUnsavedDialog(false);
  };

  // ----- Save flow -----
  const handleSaveClick = () => {
    // Frontend validation must pass first (required / duplicate).
    const valid = psfuSectionRef.current?.validateAllRows() ?? true;
    if (!valid) return;

    // WRN0001 — nothing changed since the last save.
    if (!psfuSectionRef.current?.hasChanges()) {
      setShowNoChangesDialog(true);
      return;
    }

    // WRN0003 — confirm before saving.
    setShowSaveDialog(true);
  };

  const confirmSave = () => {
    setShowSaveDialog(false);
    // In production this would call the Save API. On success we reload the
    // latest configuration (DR: DEL rows dropped, ADD/UPD reflected) and toast.
    psfuSectionRef.current?.commitSaved();
    setShowSuccessToast(true);
  };

  return (
    <PageContainer>
      <PageHeader
        title={t('psfu_page_title')}
        breadcrumbs={[
          { label: t('psfu_breadcrumb_activity_setup'), path: '/activity-setup' },
          { label: t('psfu_breadcrumb_tmt_activity_maintenance') },
        ]}
        showBack
      />

      <FormProvider {...methods}>
        <Box component="form" sx={styles.form}>
          {/* Activity Type Section */}
          <SectionCard title={t('psfu_activity_type_section')}>
            <Box sx={styles.activityTypeRadioCol}>
              <FormRadioGroup
                name="activityType"
                options={activityTypeOptions}
                row
                dense
              />
            </Box>
          </SectionCard>

          {/* PSFU Item Section — only visible when PSFU is selected */}
          {isPsfuSelected && (
            <ErrorBoundary level="section">
              <PsfuItemSection
                ref={psfuSectionRef}
                itemOptions={pageDataApi.data?.itemOptions}
                initialRows={pageDataApi.data?.items}
              />
            </ErrorBoundary>
          )}
        </Box>
      </FormProvider>

      {/* WRN0003 — Save confirmation */}
      <ConfirmDialog
        open={showSaveDialog}
        title={t('psfu_save_dialog_title')}
        message={t('psfu_wrn0003_save_confirm')}
        onConfirm={confirmSave}
        onCancel={() => setShowSaveDialog(false)}
      />

      {/* WRN0001 — No changes to save (Click OK to remain on the screen) */}
      <ConfirmDialog
        open={showNoChangesDialog}
        title={t('psfu_save_dialog_title')}
        message={t('psfu_wrn0001_no_changes')}
        confirmText={t('ok_btn')}
        cancelText={t('close_btn')}
        onConfirm={() => setShowNoChangesDialog(false)}
        onCancel={() => setShowNoChangesDialog(false)}
      />

      {/* WRN0004 — Unsaved changes when switching Activity Type */}
      <ConfirmDialog
        open={showUnsavedDialog}
        title={t('psfu_confirm_dialog_title')}
        message={t('psfu_wrn0004_unsaved_changes')}
        onConfirm={confirmActivityTypeChange}
        onCancel={() => {
          setPendingActivityType(null);
          setShowUnsavedDialog(false);
        }}
      />

      {/* Fixed footer with Save action */}
      <PageFooter
        actions={
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<SaveIcon sx={styles.footerButtonIcon} />}
            onClick={handleSaveClick}
            sx={styles.footerButton}
          >
            {t('psfu_save_btn')}
          </Button>
        }
      />

      {/* INF0001 — Record saved successfully */}
      <ToastNotification
        open={showSuccessToast}
        message={t('psfu_inf0001_saved')}
        severity="success"
        onClose={() => setShowSuccessToast(false)}
      />
    </PageContainer>
  );
};

export default TmtActivityMaintenancePage;
