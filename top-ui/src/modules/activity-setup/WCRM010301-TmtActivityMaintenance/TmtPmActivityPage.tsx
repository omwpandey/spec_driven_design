import React, { useRef, useState, type FC } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { PageContainer, PageHeader, PageFooter, SectionCard } from '@components/layout';
import { FormRadioGroup } from '@components/form';
import {
  Box,
  Button,
  ConfirmDialog,
  ErrorBoundary,
  ToastNotification,
  SetTemplateDialog,
  TemplateIcon,
  SaveIcon,
} from '@components/common';
import type {
  TmtPmActivityFormData,
  TmtPmServiceRepairTableRef,
} from './tmtActivityPm.type';
import tmtActivityMaintenanceService from './services/tmtActivityMaintenanceService';
import { TmtPmServiceRepairTable } from './index';

import { useTranslation } from '@hooks';
import { activityTypeOptions } from '@/constants/appDefaults';



const PERIODIC_MAINTENANCE_VALUE = 'periodic_maintenance';

const TmtPmActivityPage: FC = () => {
  const { t } = useTranslation();
  const { id: activityId } = useParams<{ id: string }>();
  const serviceRepairRef = useRef<TmtPmServiceRepairTableRef>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showNoChangesDialog, setShowNoChangesDialog] = useState(false);

  const methods = useForm<TmtPmActivityFormData>({
    defaultValues: { activityType: PERIODIC_MAINTENANCE_VALUE },
  });
  const selectedActivityType = methods.watch('activityType');

  const radioOptions = activityTypeOptions.map((opt) => ({
    value: opt.value,
    label: t(opt.labelKey),
  }));

  // WRN0003/WRN0001 only apply to the Service & Repair + Contact Channel
  // section, which is the only section with row-level validation today.
  const handleSaveClick = () => {
    if (selectedActivityType === PERIODIC_MAINTENANCE_VALUE) {
      const validationError = serviceRepairRef.current?.validateAll();
      if (validationError) {
        return;
      }

      if (!(serviceRepairRef.current?.hasChanges() ?? true)) {
        setShowNoChangesDialog(true);
        return;
      }
    }

    setShowSaveConfirm(true);
  };

  const confirmSave = async () => {
    setShowSaveConfirm(false);

    const payload = serviceRepairRef.current?.getPayload();
    if (!payload) {
      setErrorMessage(t('tmt_pm_wrn0001_no_changes'));
      return;
    }

    try {
      await tmtActivityMaintenanceService.saveActivitySetup(payload);
      serviceRepairRef.current?.reloadOnload();
      serviceRepairRef.current?.commitSaved();
      setShowSuccessToast(true);
    } catch {
      setErrorMessage(t('activity_save_error'));
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={t('tmt_activity_maintenance')}
        breadcrumbs={[
          { label: t('breadcrumb_activity_setup'), path: '/activity-setup' },
          { label: t('tmt_activity_maintenance') },
        ]}
      />

      <FormProvider {...methods}>
        <Box component="form">
          <SectionCard title={t('activity_type_section')}>
            <FormRadioGroup name="activityType" options={radioOptions} row dense />
          </SectionCard>

          <ErrorBoundary level="section">
            {selectedActivityType === PERIODIC_MAINTENANCE_VALUE ? (
              <TmtPmServiceRepairTable
                ref={serviceRepairRef}
                activityId={activityId}
              />
            ) : null}
          </ErrorBoundary>
        </Box>
      </FormProvider>

      <PageFooter
        actions={
          <>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<TemplateIcon />}
              onClick={() => setShowTemplateDialog(true)}
              sx={{ minWidth: 110, minHeight: 42, borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase' }}
            >
              {t('set_Template')}
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<SaveIcon sx={{ fontSize: '18px !important' }} />}
              onClick={handleSaveClick}
              sx={{ minWidth: 110, minHeight: 42, borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', boxShadow: 'none' }}
            >
              {t('save_btn')}
            </Button>
          </>
        }
      />

      <SetTemplateDialog
        open={showTemplateDialog}
        onCancel={() => setShowTemplateDialog(false)}
      />

      {/* WRN0003 — Save confirmation */}
      <ConfirmDialog
        open={showSaveConfirm}
        title={t('tmt_pm_save_dialog_title')}
        message={t('tmt_pm_wrn0003_save_confirm')}
        onConfirm={confirmSave}
        onCancel={() => setShowSaveConfirm(false)}
      />

      {/* WRN0001 — No changes to save */}
      <ConfirmDialog
        open={showNoChangesDialog}
        title={t('tmt_pm_save_dialog_title')}
        message={t('tmt_pm_wrn0001_no_changes')}
        confirmText={t('ok_btn')}
        cancelText={t('close_btn')}
        onConfirm={() => setShowNoChangesDialog(false)}
        onCancel={() => setShowNoChangesDialog(false)}
      />

      <ToastNotification
        open={showSuccessToast}
        message={t('activity_save_success')}
        severity="success"
        onClose={() => setShowSuccessToast(false)}
      />
      <ToastNotification
        open={!!errorMessage}
        message={errorMessage}
        severity="error"
        onClose={() => setErrorMessage('')}
      />
    </PageContainer>
  );
};

export default TmtPmActivityPage;
