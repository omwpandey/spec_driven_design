import { useCallback } from 'react';
import { useAppSelector } from '@store';
import { translate } from '@core/languages';

/**
 * Translation Hook
 * 
 * Usage:
 *   const { t, language } = useTranslation();
 *   <Button>{t('save_btn')}</Button>
 *   <Typography>{t('activity_name')}</Typography>
 *   t('validation_required', { field: t('activity_name') })
 */
export const useTranslation = () => {
  const language = useAppSelector((state) => state.config.language);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      return translate(language, key, params);
    },
    [language]
  );

  return { t, language };
};
