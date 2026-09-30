/**
 * Icon wrapper component
 * Re-exports commonly used MUI icons so pages don't import from @mui/icons-material directly.
 * Add new icons here as needed.
 *
 * IMPORTANT: Import each icon from its own deep path (`@mui/icons-material/IconName`)
 * rather than from the package barrel (`@mui/icons-material`). The barrel statically
 * re-exports ~11k icon modules, which forces the bundler/test transformer to process
 * the entire set on every file that transitively imports this module. That made the
 * Vitest suite take ~30s of import time per test file and caused per-test timeouts.
 * Deep imports load only the icons we actually use.
 */

// ===== General Actions =====
export { default as TemplateIcon } from '@mui/icons-material/Description';
export { default as DeleteIcon } from '@mui/icons-material/Delete';
export { default as SaveIcon } from '@mui/icons-material/Save';
export { default as AddIcon } from '@mui/icons-material/Add';
export { default as EditIcon } from '@mui/icons-material/Edit';
export { default as CloseIcon } from '@mui/icons-material/Close';
export { default as BackIcon } from '@mui/icons-material/ArrowBack';
export { default as ForwardIcon } from '@mui/icons-material/ArrowForward';
export { default as DownloadIcon } from '@mui/icons-material/Download';
export { default as UploadIcon } from '@mui/icons-material/Upload';
export { default as RefreshIcon } from '@mui/icons-material/Refresh';
export { default as CancelIcon } from '@mui/icons-material/Cancel';
export { default as FilterIcon } from '@mui/icons-material/FilterList';
export { default as SwapVertIcon } from '@mui/icons-material/SwapVert';
export { default as SearchIcon } from '@mui/icons-material/Search';
export { default as ClearIcon } from '@mui/icons-material/Clear';
export { default as MenuIcon } from '@mui/icons-material/Menu';
export { default as MoreVertIcon } from '@mui/icons-material/MoreVert';
export { default as SettingsIcon } from '@mui/icons-material/Settings';
export { default as HomeIcon } from '@mui/icons-material/Home';
export { default as ExportIcon } from '@mui/icons-material/FileDownload';

// ===== Visibility =====
export { default as Visibility } from '@mui/icons-material/Visibility';
export { default as VisibilityOff } from '@mui/icons-material/VisibilityOff';

// ===== Status & Feedback =====
export { default as SuccessIcon } from '@mui/icons-material/CheckCircle';
export { default as ErrorIcon } from '@mui/icons-material/Error';
export { default as ErrorOutlinedIcon } from '@mui/icons-material/ErrorOutlined';
export { default as WarningIcon } from '@mui/icons-material/Warning';
export { default as InfoIcon } from '@mui/icons-material/Info';

// ===== People & Business =====
export { default as CarIcon } from '@mui/icons-material/DirectionsCar';
export { default as PeopleIcon } from '@mui/icons-material/People';
export { default as BusinessIcon } from '@mui/icons-material/Business';
export { default as PersonIcon } from '@mui/icons-material/Person';
export { default as GroupsIcon } from '@mui/icons-material/Groups';

// ===== Communication =====
export { default as EmailIcon } from '@mui/icons-material/Email';
export { default as LinkIcon } from '@mui/icons-material/Link';
export { default as ExternalLinkIcon } from '@mui/icons-material/CallMade';
export { default as PhoneCallbackIcon } from '@mui/icons-material/PhoneCallback';
export { default as PhoneForwardedIcon } from '@mui/icons-material/PhoneForwarded';
export { default as PhoneMissedIcon } from '@mui/icons-material/PhoneMissed';

// ===== Navigation & Layout =====
export { default as ChevronRightIcon } from '@mui/icons-material/ChevronRight';
export { default as ChevronLeftIcon } from '@mui/icons-material/ChevronLeft';
export { default as ExpandMoreIcon } from '@mui/icons-material/ExpandMore';
export { default as NextIcon } from '@mui/icons-material/NavigateNext';
export { default as KeyboardArrowDownIcon } from '@mui/icons-material/KeyboardArrowDown';

// ===== Security & Auth =====
export { default as LockIcon } from '@mui/icons-material/Lock';
export { default as BlockIcon } from '@mui/icons-material/Block';

// ===== Notifications & User =====
export { default as NotificationsIcon } from '@mui/icons-material/Notifications';
export { default as LogoutIcon } from '@mui/icons-material/Logout';

// ===== Activity & Calendar =====
export { default as ActivityIcon } from '@mui/icons-material/CalendarMonth';
export { default as AppointmentIcon } from '@mui/icons-material/EventNote';
export { default as PostServiceIcon } from '@mui/icons-material/Assignment';

// ===== Service & Tools =====
export { default as RepairIcon } from '@mui/icons-material/Build';
export { default as ServiceFollowIcon } from '@mui/icons-material/SupportAgent';
export { default as TargetIcon } from '@mui/icons-material/TrackChanges';
export { default as VerificationIcon } from '@mui/icons-material/FactCheck';

// ===== Status =====
export { default as PauseCircleIcon } from '@mui/icons-material/PauseCircle';
export { default as PauseIcon } from '@mui/icons-material/PauseCircleFilled';
export { default as InactiveIcon } from '@mui/icons-material/PersonOff';

// ===== Cloud & Network =====
export { default as UploadCloudIcon } from '@mui/icons-material/CloudUpload';
export { default as OfflineIcon } from '@mui/icons-material/CloudOff';
export { default as CloudDownloadIcon } from '@mui/icons-material/CloudDownload';
export { default as WifiOffIcon } from '@mui/icons-material/WifiOff';
export { default as SlowIcon } from '@mui/icons-material/SignalWifiStatusbar4Bar';

// ===== Files =====
export { default as FileIcon } from '@mui/icons-material/InsertDriveFile';
export { default as CameraIcon } from '@mui/icons-material/CameraAlt';
export { default as NewsIcon } from '@mui/icons-material/Newspaper';
export { default as EmptyIcon } from '@mui/icons-material/InboxOutlined';

// ===== Outlined variants (used by ToastNotification) =====
export { default as ToastSuccessIcon } from '@mui/icons-material/CheckCircleOutlined';
export { default as ToastErrorIcon } from '@mui/icons-material/HighlightOff';
export { default as ToastWarningIcon } from '@mui/icons-material/WarningAmber';
export { default as ToastInfoIcon } from '@mui/icons-material/InfoOutlined';

// ===== Data & Charts =====
export { default as TimeoutIcon } from '@mui/icons-material/Speed';
export { default as ServerIcon } from '@mui/icons-material/Storage';
export { default as BugIcon } from '@mui/icons-material/BugReport';
export { default as CartIcon } from '@mui/icons-material/ShoppingCart';
export { default as TrendIcon } from '@mui/icons-material/TrendingUp';
export { default as TimerIcon } from '@mui/icons-material/Timer';
export { default as AccessTimeIcon } from '@mui/icons-material/AccessTime';

// ===== Multiple-alias exports (same source icon, different semantic names) =====
import CheckCircle from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Aliases for CheckCircle
export const ServiceConfirmIcon = CheckCircle;
export const ApproveIcon = CheckCircle;

// Aliases for Visibility
export const ViewIcon = VisibilityIcon;
export const HideIcon = VisibilityOffIcon;
export const PreviewIcon = VisibilityIcon;

// Re-export ChevronRight directly for Sidebar usage
export { default as ChevronRight } from '@mui/icons-material/ChevronRight';
