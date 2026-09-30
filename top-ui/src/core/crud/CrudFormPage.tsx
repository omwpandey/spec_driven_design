import React, { useEffect, useState, Suspense } from 'react';
import { Box, Button, Grid, CircularProgress, SaveIcon, BackIcon } from '@components/common';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PageContainer, PageHeader, SectionCard } from '@components/layout';
import { apiService } from '@services';
import { usePermission } from '@hooks/usePermission';
import { useTranslation } from '@hooks';
import { CrudConfig, FieldConfig } from './types';
import { getFieldRenderer } from '@core/manifest/fieldRendererRegistry';
import type { FieldRendererType, ScreenField } from '@core/manifest/types';

interface CrudFormPageProps {
  config: CrudConfig;
  mode?: 'create' | 'edit' | 'view';
}

/**
 * Build validation schema from field configs using the renderer registry
 */
const buildValidationSchema = (fields: FieldConfig[]) => {
  const shape: Record<string, yup.Schema> = {};
  fields.forEach((field) => {
    if (field.visibleInForm === false) return;

    // Convert FieldConfig to ScreenField format for the registry
    const screenField: ScreenField = {
      name: field.name,
      labelKey: field.label,
      type: field.type as FieldRendererType,
      required: field.required,
      validation: {
        ...(field.validation?.required && { required: field.validation.required }),
        ...(field.validation?.min && { min: field.validation.min }),
        ...(field.validation?.max && { max: field.validation.max }),
        ...(field.validation?.pattern && { pattern: { value: field.validation.pattern.value.source, message: field.validation.pattern.message } }),
        ...(field.maxLength && { maxLength: { value: field.maxLength, message: `Maximum ${field.maxLength} characters` } }),
      },
    };

    const renderer = getFieldRenderer(field.type as FieldRendererType);
    shape[field.name] = renderer.buildSchema(screenField);
  });
  return yup.object().shape(shape);
};

/**
 * Render a form field using the renderer registry
 */
const renderFormField = (field: FieldConfig, isView: boolean) => {
  const gridSize = field.gridSize || { xs: 12, sm: 6, md: 4 };
  const disabled = isView || field.disabled;
  const renderer = getFieldRenderer(field.type as FieldRendererType);
  const Component = renderer.component;

  // Build props based on field config
  const componentProps: Record<string, unknown> = {
    name: field.name,
    label: field.label,
    required: field.required,
    disabled,
    readOnly: field.readOnly,
    placeholder: field.placeholder,
    ...renderer.defaultProps,
  };

  // Add type-specific props
  if (field.options) componentProps.options = field.options;
  if (field.min !== undefined) componentProps.min = field.min;
  if (field.max !== undefined) componentProps.max = field.max;
  if (field.maxLength !== undefined) componentProps.maxLength = field.maxLength;
  if (field.type === 'multiSelect') componentProps.multiple = true;
  if (field.type === 'textarea') componentProps.rows = 3;

  return (
    <Grid key={field.name} size={gridSize}>
      <Suspense fallback={<CircularProgress size={20} />}>
        <Component {...componentProps} />
      </Suspense>
    </Grid>
  );
};

const CrudFormPage: React.FC<CrudFormPageProps> = ({ config, mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const { hasPermission } = usePermission();
  const { t } = useTranslation();
  const isView = mode === 'view';

  // Permission check
  const requiredPermission = mode === 'create'
    ? config.permissions?.create
    : mode === 'edit'
    ? config.permissions?.update
    : config.permissions?.read;

  const formFields = config.fields.filter((f) => f.visibleInForm !== false);
  const schema = buildValidationSchema(formFields);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: formFields.reduce(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as Record<string, unknown>
    ),
  });

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && id) {
      loadData(id);
    }
  }, [id, mode]);

  const loadData = async (recordId: string) => {
    setLoading(true);
    try {
      const response = await apiService.getById<Record<string, unknown>>(config.endpoint, recordId);
      methods.reset(response.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      if (mode === 'edit' && id) {
        await apiService.put(config.endpoint, id, data);
      } else {
        await apiService.post(config.endpoint, data);
      }
      navigate(`/${config.resource}`);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setLoading(false);
    }
  };

  let pageTitle: string;
  if (mode === 'create') {
    pageTitle = `${t('crud_add')} ${config.title}`;
  } else if (mode === 'edit') {
    pageTitle = `${t('crud_edit')} ${config.title}`;
  } else {
    pageTitle = `${t('crud_view')} ${config.title}`;
  }

  // Block access if permission not granted
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <PageContainer>
        <PageHeader title={t('crud_access_denied')} breadcrumbs={[{ label: t('crud_access_denied') }]} />
        <PageHeader title={t('crud_access_denied')} breadcrumbs={[{ label: t('crud_access_denied') }]} />
        <Box sx={{ mt: 2, textAlign: 'center', color: '#999' }}>
          {t('crud_no_permission')}
          {t('crud_no_permission')}
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={pageTitle}
        breadcrumbs={[
          { label: config.title, path: `/${config.resource}` },
          { label: pageTitle },
        ]}
        showBack
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box sx={{ mt: 2 }}>
            <SectionCard title={t('crud_details')} collapsible={false}>
              <Grid container spacing={2}>
                {formFields.map((field) => renderFormField(field, isView))}
              </Grid>
            </SectionCard>
          </Box>

          {!isView && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button variant="outlined" startIcon={<BackIcon />} onClick={() => navigate(-1)}>
                {t('cancel_btn')}
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />} type="submit" disabled={loading}>
                {t('save_btn')}
              </Button>
            </Box>
          )}
        </form>
      </FormProvider>
    </PageContainer>
  );
};

export default CrudFormPage;
