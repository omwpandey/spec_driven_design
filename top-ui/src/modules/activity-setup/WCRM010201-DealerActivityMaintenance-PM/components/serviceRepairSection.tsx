import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  Popover,
} from '@components/common';
import { SectionCard } from '@components/layout';
import { TopTable } from '@components/table';
import type { ICropColumn } from '@components/table';
import { useTranslation } from '@hooks';
import { activitySetupStyles } from '../activitySetup.styles';

const styles = activitySetupStyles.serviceRepair;

interface RepairItem {
  [key: string]: unknown;
  id: number;
  repairCode: string;
  description: string;
  selected: boolean;
  mandatory: string;
}

const initialRepairItems: RepairItem[] = [
  { id: 1, repairCode: '1,000', description: '1000 km Service/ 1 Month', selected: false, mandatory: 'Yes' },
  { id: 2, repairCode: '10,000', description: '10,000 km Service/ 6 Month', selected: false, mandatory: 'No' },
  { id: 3, repairCode: '20,000', description: '20,000 km Service/ 12 Month', selected: false, mandatory: 'Yes' },
  { id: 4, repairCode: '30,000', description: '30,000 km Service/ 18 Month', selected: false, mandatory: 'Yes' },
  { id: 5, repairCode: '40,000', description: '40,000 km Service/ 24 Month', selected: false, mandatory: 'Yes' },
];

const mileageRangeOptions = [
  { value: '1k-200k', label: 'Select 1K-200K' },
  { value: '210k-250k', label: 'Select 210K-250K' },
  { value: '260k-300k', label: 'Select 260K-300K' },
  { value: '310k-350k', label: 'Select 310K-350K' },
  { value: '360k-400k', label: 'Select 360K-400K' },
];

const ServiceRepairSection: React.FC = () => {
  const [items, setItems] = useState<RepairItem[]>(initialRepairItems);
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedRanges, setSelectedRanges] = useState<string[]>(['1k-200k']);

  const handleSelectItem = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)));
  };

  const handleDropdownClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleRangeToggle = (range: string) => {
    setSelectedRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const popoverOpen = Boolean(anchorEl);

  // Define columns for the iCROP table
  const columns: ICropColumn<RepairItem>[] = [
    {
      id: 'no',
      label: t('col_no'),
      fieldtype: 'label',
      align: 'left',
      width: '5%',
      render: (_value, _row, index) => index + 1,
    },
    {
      id: 'repairCode',
      label: t('col_repair_code'),
      fieldtype: 'label',
      align: 'right',
      width: '20%',
      isRequired: true,
      headerRender: () => (
        <>
          {t('col_repair_code')}<span style={styles.mandatoryAsterisk}>*</span>
        </>
      ),
    },
    {
      id: 'description',
      label: t('col_description'),
      fieldtype: 'label',
      align: 'left',
      isRequired: true,
      headerRender: () => (
        <>
          {t('col_description')}<span style={styles.mandatoryAsterisk}>*</span>
        </>
      ),
    },
    {
      id: 'mandatory',
      label: t('col_mandatory'),
      fieldtype: 'label',
      align: 'left',
      isRequired: false,
      width: '10%',
    },
  ];

  // Select Range dropdown header action
  const selectRangeAction = (
    <>
      <Box onClick={handleDropdownClick} sx={styles.selectRangeTrigger}>
        <Typography sx={styles.selectRangeLabel}>
          {t('select_range')}
        </Typography>
        <Typography sx={styles.selectRangeCaret}>
          ▾
        </Typography>
      </Box>

      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: styles.popoverPaper,
          },
        }}
      >
        <Box sx={styles.popoverBody}>
          {mileageRangeOptions.map((range) => (
            <FormControlLabel
              key={range.value}
              control={
                <Checkbox
                  size="small"
                  checked={selectedRanges.includes(range.value)}
                  onChange={() => handleRangeToggle(range.value)}
                  sx={styles.rangeCheckbox}
                />
              }
              label={<Typography sx={styles.rangeCheckboxLabelText}>{range.label}</Typography>}
              sx={styles.rangeCheckboxControl}
            />
          ))}
          <Box sx={styles.popoverFooter}>
            <Link
              component="button"
              variant="caption"
              onClick={() => setSelectedRanges(mileageRangeOptions.map((o) => o.value))}
              sx={styles.selectAllLink}
            >
              {t('select_all')}
            </Link>
            <Link
              component="button"
              variant="caption"
              onClick={() => setSelectedRanges([])}
              sx={styles.noneLink}
            >
              {t('none')}
            </Link>
          </Box>
        </Box>
      </Popover>
    </>
  );

  return (
    <SectionCard title={t('service_repair_section')}>
      <Box>
        <TopTable<RepairItem>
          headerCell={columns}
          rows={items}
          primaryKey="id"
          orderBy=""
          orderDir=""
          page={0}
          rowsPerPage={items.length || 1}
          editRowIndex={{}}
          isServerPagination
          hidePagination
          bordered
          rowSelection
          multiSelection
          selectedRowKeys={items.filter((i) => i.selected).map((i) => String(i.id))}
          headerActions={selectRangeAction}
          onSelectionChange={(selectedItems) => {
            const selectedIds = selectedItems.map((item) => item.id);
            setItems(items.map((item) => ({
              ...item,
              selected: selectedIds.includes(item.id),
            })));
          }}
          handleSort={() => {}}
          handleChangePage={() => {}}
          handleChangeRowsPerPage={() => {}}
          onFilterChange={() => {}}
        />
      </Box>
    </SectionCard>
  );
};

export default ServiceRepairSection;
