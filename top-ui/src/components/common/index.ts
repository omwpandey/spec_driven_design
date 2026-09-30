// ===== Primitives (wrappers around MUI) =====
export { default as Box } from './Box';
export type { BoxProps } from './Box';
export { default as Button } from './Button';
export type { ButtonProps } from './Button';
export { default as Grid } from './Grid';
export type { GridProps } from './Grid';
export { default as Typography } from './Typography';
export type { TypographyProps } from './Typography';
export { default as EllipsisText } from './EllipsisText';
export type { EllipsisTextProps } from './EllipsisText';
export { default as Paper } from './Paper';
export type { PaperProps } from './Paper';
export { default as Stack } from './Stack';
export type { StackProps } from './Stack';
export { default as IconButton } from './IconButton';
export type { IconButtonProps } from './IconButton';
export { default as CircularProgress } from './CircularProgress';
export type { CircularProgressProps } from './CircularProgress';
export { default as LinearProgress } from './LinearProgress';
export type { LinearProgressProps } from './LinearProgress';

// ===== Form Primitives =====
export { default as TextField } from './TextField';
export type { TextFieldProps } from './TextField';
export { default as InputBase } from './InputBase';
export type { InputBaseProps } from './InputBase';
export { default as InputAdornment } from './InputAdornment';
export type { InputAdornmentProps } from './InputAdornment';
export { default as Select } from './Select/Select';
export type { SelectProps } from './Select/Select';
export { default as MenuItem } from './MenuItem';
export type { MenuItemProps } from './MenuItem';
export { default as FormControl } from './FormControl';
export type { FormControlProps } from './FormControl';
export { default as OutlinedInput } from './OutlinedInput';
export type { OutlinedInputProps } from './OutlinedInput';
export { default as Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';
export { default as FormControlLabel } from './FormControlLabel';
export type { FormControlLabelProps } from './FormControlLabel';
export { default as FormHelperText } from './FormHelperText';
export type { FormHelperTextProps } from './FormHelperText';
export { default as FormGroup } from './FormGroup';
export type { FormGroupProps } from './FormGroup';
export { default as Radio } from './Radio';
export type { RadioProps } from './Radio';
export { default as RadioGroup } from './RadioGroup';
export type { RadioGroupProps } from './RadioGroup';

// ===== Feedback & Overlay =====
export { default as Alert } from './Alert';
export type { AlertProps } from './Alert';
export { default as Chip } from './Chip';
export type { ChipProps } from './Chip';
export { default as Snackbar } from './Snackbar';
export type { SnackbarProps } from './Snackbar';
export { default as Backdrop } from './Backdrop';
export type { BackdropProps } from './Backdrop';
export { default as Slide } from './Slide';
export type { SlideProps } from './Slide';
export { default as Skeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

// ===== Navigation & Surfaces =====
export { default as Link } from './Link';
export type { LinkProps } from './Link';
export { default as Popover } from './Popover';
export type { PopoverProps } from './Popover';
export { default as Menu } from './Menu';
export type { MenuProps } from './Menu';
export { default as Pagination } from './Pagination/Pagination';
export type { PaginationProps } from './Pagination/Pagination';
export { default as Drawer } from './Drawer';
export type { DrawerProps } from './Drawer';
export { default as Divider } from './Divider';

// ===== Table =====
export {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
} from './Table';

// ===== Dialog =====
export {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from './Dialog';

// ===== List =====
export {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from './List';

// ===== Accordion =====
export {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from './Accordion';

// ===== Theme & Hooks =====
export { ThemeProvider, CssBaseline, useTheme, useMediaQuery } from './ThemeProvider';

// ===== Icons =====
export {
  TemplateIcon,
  DeleteIcon,
  SaveIcon,
  AddIcon,
  EditIcon,
  CloseIcon,
  BackIcon,
  ForwardIcon,
  DownloadIcon,
  UploadIcon,
  RefreshIcon,
  CancelIcon,
  FilterIcon,
  SwapVertIcon,
  SearchIcon,
  ClearIcon,
  MenuIcon,
  MoreVertIcon,
  SettingsIcon,
  HomeIcon,
  ExportIcon,
  Visibility,
  VisibilityOff,
  ViewIcon,
  HideIcon,
  PreviewIcon,
  ToastSuccessIcon,
  ToastErrorIcon,
  ToastWarningIcon,
  ToastInfoIcon,
  SuccessIcon,
  ErrorIcon,
  ErrorOutlinedIcon,
  WarningIcon,
  InfoIcon,
  CarIcon,
  PeopleIcon,
  BusinessIcon,
  PersonIcon,
  GroupsIcon,
  EmailIcon,
  LinkIcon,
  ExternalLinkIcon,
  PhoneCallbackIcon,
  PhoneForwardedIcon,
  PhoneMissedIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ExpandMoreIcon,
  NextIcon,
  KeyboardArrowDownIcon,
  LockIcon,
  BlockIcon,
  NotificationsIcon,
  LogoutIcon,
  ActivityIcon,
  AppointmentIcon,
  PostServiceIcon,
  RepairIcon,
  ServiceFollowIcon,
  TargetIcon,
  VerificationIcon,
  PauseCircleIcon,
  PauseIcon,
  InactiveIcon,
  UploadCloudIcon,
  OfflineIcon,
  CloudDownloadIcon,
  WifiOffIcon,
  SlowIcon,
  FileIcon,
  CameraIcon,
  NewsIcon,
  EmptyIcon,
  TimeoutIcon,
  ServerIcon,
  BugIcon,
  CartIcon,
  TrendIcon,
  TimerIcon,
  AccessTimeIcon,
  ServiceConfirmIcon,
  ApproveIcon,
  ChevronRight,
} from './Icon';

// ===== Dialogs & Feedback (project-specific) =====
export { default as ConfirmDialog } from './ConfirmDialog';
export { default as AlertDialog } from './AlertDialog';
export { default as SetTemplateDialog } from './SetTemplateDialog';
export { default as MessagePreviewDialog } from './MessagePreviewDialog';
export { default as ToastNotification } from './ToastNotification';
export { default as LoadingOverlay } from './LoadingOverlay';

// ===== Search / Suggestions =====
export { default as SearchAutocomplete } from './SearchAutocomplete';
export type { SearchAutocompleteProps } from './SearchAutocomplete';

// ===== State displays =====
export { default as EmptyState } from './EmptyState';
export { default as ErrorState } from './ErrorState';
export { default as SkeletonLoader } from './SkeletonLoader';

// ===== Cards & Data Display =====
export { default as SummaryCard } from './SummaryCard';
export { default as InfoCard } from './InfoCard';
export { default as Badge } from './Badge';
export { default as StatusIndicator } from './StatusIndicator';
export { default as ProgressBar } from './ProgressBar';
export { default as Avatar } from './Avatar';
export { default as Tooltip } from './Tooltip';

// ===== Navigation & Layout =====
export { default as Tabs } from './Tabs';
export { default as Stepper } from './Stepper';
export { default as Breadcrumb } from './Breadcrumb';

// ===== Buttons =====
export {
  PrimaryButton,
  SecondaryButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  BackButton,
  AddButton,
  DownloadButton,
  ResetButton,
  SearchButton,
  ActionIconButton,
  ButtonGroup,
  ScreenActionBar,
} from './ActionButtons';

// ===== Appointment Scheduler / Branch Holiday Master =====
export { default as SchedulerCalendar } from './appointmentScheduler/SchedulerCalendar';
export { default as WorkingDayCalendar } from './appointmentScheduler/WorkingDayCalendar';
export { default as SchedulerDialogShell } from './appointmentScheduler/SchedulerDialogShell';
export { default as SetBranchHolidayDialog } from './appointmentScheduler/SetBranchHolidayDialog';
export { default as CopyBranchHolidaysDialog } from './appointmentScheduler/CopyBranchHolidaysDialog';
export { default as DailyCallAvailabilityDialog } from './appointmentScheduler/DailyCallAvailabilityDialog';
export { default as MonthlyCallAvailabilityDialog } from './appointmentScheduler/MonthlyCallAvailabilityDialog';

// ===== Security =====
export { default as PermissionWrapper } from './PermissionWrapper';

// ===== Language =====
export { default as LanguageSwitcher } from './LanguageSwitcher';

// ===== Error Handling =====
export { default as ErrorBoundary } from './ErrorBoundary';
