import React from 'react';
import {
  Box,
  Paper,
  Tooltip,
  HomeIcon,
  ActivityIcon,
  PeopleIcon as CustomerIcon,
  RepairIcon,
  PhoneCallbackIcon as IncomingCallIcon,
  PhoneForwardedIcon as OutgoingCallIcon,
  VerificationIcon,
  AppointmentIcon,
  ServiceFollowIcon,
  ServiceConfirmIcon,
  PostServiceIcon,
  InactiveIcon,
  NewsIcon,
  SettingsIcon,
  LogoutIcon,
  ChevronRight,
} from '@components/common';
import { ListItemButton, ListItemIcon, ListItemText, List } from '@components/common';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store';
import { layoutSpacing } from '@core/theme/spacing';
import { useTranslation } from '@hooks';

interface MenuItem {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
  path?: string;
  children?: { id: string; labelKey: string; path: string }[];
}
const role = false;
const menuItems: MenuItem[] = [
  { id: 'dashboard', labelKey: 'nav_dashboard', icon: <HomeIcon />, path: '/' },
  {
    id: 'activity-setup',
    labelKey: 'nav_activity_setup',
    icon: <ActivityIcon />,
    children: role ?
    [
      { id: 'tmt-activity', labelKey: 'tmt_activity_maintenance', path: '/activity-setup/pm' },
      { id: 'tmt-activity', labelKey: 'nav_tmt_activity', path: '/activity-setup/pm' },
    ]
    :[
      { id: 'activity-list', labelKey: 'nav_activity_list', path: '/activity-setup/list' },
      { id: 'dlr-activity-maintenance', labelKey: 'nav_activity_maintenance', path: '/activity-setup/dlr-activity-maintenance' },
      { id: 'tmt-activity', labelKey: 'nav_tmt_activity', path: '/activity-setup/tmt' },
      { id: 'tmt-activity-maintenance', labelKey: 'nav_tmt_activity_maintenance', path: '/activity-setup/tmt-activity-maintenance' },
      { id: 'call-center-group-mang', labelKey: 'nav_call_center_group_mang', path: '/activity-setup/tmt' },
      { id: 'assign-call-center-staff-to-group', labelKey: 'nav_assign_call_center_staff_to_group', path: '/activity-setup/tmt' },
    ],
  },
  { id: 'customer-data-check', labelKey: 'nav_customer_data_check', icon: <CustomerIcon />, path: '/customer-data-check' },
  { id: 'call-center', labelKey: 'nav_call_center', icon: <IncomingCallIcon />, path: '/call-center' },
  { id: 'today-customer', labelKey: 'nav_today_customer', icon: <CustomerIcon />, path: '/today-customers' },
  { id: 'repair-bay', labelKey: 'nav_repair_bay', icon: <RepairIcon />, path: '/repair-bay' },
  { id: 'incoming-call', labelKey: 'nav_incoming_call', icon: <IncomingCallIcon />, path: '/incoming-calls' },
  { id: 'outgoing-call', labelKey: 'nav_outgoing_call', icon: <OutgoingCallIcon />, path: '/outgoing-calls' },
  { id: 'data-verification', labelKey: 'nav_data_verification', icon: <VerificationIcon />, path: '/data-verification' },
  { id: 'appointments', labelKey: 'nav_appointments', icon: <AppointmentIcon />, path: '/appointments' },
  {
    id: 'service-follow',
    labelKey: 'nav_service_follow',
    icon: <ServiceFollowIcon />,
    children: [
      { id: 'follow-list', labelKey: 'nav_follow_list', path: '/service-follow-up' },
      { id: 'follow-confirm', labelKey: 'nav_follow_confirm', path: '/service-follow-up/confirm' },
    ],
  },
  { id: 'service-confirm', labelKey: 'nav_service_confirm', icon: <ServiceConfirmIcon />, path: '/service-confirmation' },
  { id: 'post-service', labelKey: 'nav_post_service', icon: <PostServiceIcon />, path: '/post-service' },
  { id: 'inactive', labelKey: 'nav_inactive', icon: <InactiveIcon />, path: '/inactive-customers' },
  { id: 'news', labelKey: 'nav_news', icon: <NewsIcon />, path: '/news' },
  { id: 'settings', labelKey: 'nav_settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useAppSelector((state) => state.app);
  const { t } = useTranslation();
  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);
  const [activeSubMenuId, setActiveSubMenuId] = React.useState<string | null>(null);
  const [submenuTop, setSubmenuTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const sidebarWidth = sidebarCollapsed ? layoutSpacing.sidebarWidth : layoutSpacing.sidebarExpandedWidth;

  // Close sub-menu panel when sidebar state changes (collapse/expand)
  React.useEffect(() => {
    setExpandedMenu(null);
  }, [sidebarCollapsed]);

  const handleMenuClick = (item: MenuItem, event: React.MouseEvent<HTMLElement>) => {
    if (item.children) {
      // Toggle submenu open/closed (works in both collapsed and expanded states)
      if (expandedMenu === item.id) {
        setExpandedMenu(null);
        return;
      }
      // Align the submenu panel with the clicked item's vertical position
      const containerRect = containerRef.current?.getBoundingClientRect();
      const buttonRect = event.currentTarget.getBoundingClientRect();
      if (containerRect) {
        setSubmenuTop(buttonRect.top - containerRect.top);
      }
      setExpandedMenu(item.id);
    } else if (item.path) {
      navigate(item.path);
      setExpandedMenu(null);
      setActiveSubMenuId(null);
    }
  };

  const handleSubMenuClick = (child: { id: string; path: string }) => {
    navigate(child.path);
    setActiveSubMenuId(child.id);
    setExpandedMenu(null);
  };

  const isSubMenuActive = (child: { id: string; path: string }) => {
    // If we have a tracked active sub-menu id and we're on its path, use id match
    if (activeSubMenuId && location.pathname === child.path) {
      return activeSubMenuId === child.id;
    }
    // Fallback: exact path match only if no duplicates tracked
    return location.pathname === child.path;
  };

  const isMenuGroupActive = (item: MenuItem) => {
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path);
    }
    if (item.path === '/') return location.pathname === '/';
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  };

  const expandedItem = menuItems.find((m) => m.id === expandedMenu);

  return (
    <Box ref={containerRef} sx={{ display: 'flex', height: '100%', position: 'relative', transition: 'width 0.3s ease, min-width 0.3s ease', fontSize: '0.8125rem', fontFamily: 'Prompt', fontWeight: 500 }}>
      {/* Main Sidebar - White background */}
      <Box
        sx={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          height: '100%',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E0E0E0',
          transition: 'width 0.3s ease, min-width 0.3s ease',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <List sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 0.5 }}>
          {menuItems.map((item) => {
            const isExpanded = expandedMenu === item.id;
            const isGroupActive = isMenuGroupActive(item);

            return (
              <Tooltip key={item.id} title={sidebarCollapsed ? t(item.labelKey) : ''} placement="right" arrow>
                <ListItemButton
                  onClick={(e) => handleMenuClick(item, e)}
                  sx={{
                    minHeight: 60,
                    px: sidebarCollapsed ? 0 : 1,
                    py: 0.25,
                    mx: 0.25,
                    my: 0.25,
                    height: '2.5rem',
                    borderRadius: 1,
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    // Active with submenu open: RED bg, white text
                    // Active without submenu: light pink bg, red text
                    // Normal: transparent
                    backgroundColor: isExpanded
                      ? '#EB0A1E24'
                      : isGroupActive
                        ? '#EB0A1E24'
                        : 'transparent',
                    color: isExpanded
                      ? '#FFFFFF'
                      : isGroupActive
                        ? '#EB0A1E'
                        : '#333333',
                    '&:hover': {
                      backgroundColor: isExpanded
                        ? '#C00818'
                        : isGroupActive
                          ? '#EB0A1E24'
                          : '#F5F5F5',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: sidebarCollapsed ? 0 : 32,
                      width: sidebarCollapsed ? '100%' : 'auto',
                      display: 'flex',
                      justifyContent: 'center',
                      color: isExpanded ? '#FFFFFF' : isGroupActive ? '#EB0A1E' : '#58595B',
                      '& .MuiSvgIcon-root': { fontSize: 24 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!sidebarCollapsed && (
                    <>
                      <ListItemText
                        primary={t(item.labelKey)}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontSize: '0.8125rem',
                            fontWeight: isGroupActive || isExpanded ? 600 : 400,
                            whiteSpace: 'nowrap',
                            color: isExpanded ? '#FFFFFF' : isGroupActive ? '#EB0A1E' : '#333333',
                          },
                        }}
                      />
                      {item.children && (
                        <ChevronRight sx={{ fontSize: 16, color: isExpanded ? '#FFFFFF' : '#58595B' }} />
                      )}
                    </>
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>

        {/* Settings & Logout */}
        <Box sx={{ borderTop: '1px solid #E0E0E0', height: '50px', display: 'flex', alignItems: 'center' }}>
          <Tooltip title={sidebarCollapsed ? t('nav_logout') : ''} placement="right" arrow>
            <ListItemButton
              sx={{
                minHeight: 50,
                px: sidebarCollapsed ? 0 : 2,
                mx: 0.5,
                color: '#333333',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                '&:hover': { backgroundColor: '#F5F5F5' },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: sidebarCollapsed ? 0 : 32,
                  width: sidebarCollapsed ? '100%' : 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  color: '#58595B',
                }}
              >
                <LogoutIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              {!sidebarCollapsed && (
                <ListItemText
                  primary={t('nav_logout')}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.8125rem',
                    },
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Submenu Panel - opens to the right */}
      {expandedItem && expandedItem.children && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            left: sidebarWidth,
            top: submenuTop,
            maxHeight: `calc(100% - ${submenuTop}px)`,
            width: { xs: '16rem', sm: '18rem', md: '21rem' },
            backgroundColor: '#FFFFFF',
            borderLeft: '1px solid #E0E0E0',
            borderRadius: '0 4px 4px 0',
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <List sx={{ py: 1, overflowY: 'auto' }}>
            {expandedItem.children.map((child) => (
              <ListItemButton
                key={child.id}
                onClick={() => handleSubMenuClick(child)}
                sx={{
                  py: 1,
                  px: 2.5,
                  minHeight: 36,
                  backgroundColor: isSubMenuActive(child) ? '#EB0A1E24' : 'transparent',
                  borderLeft: isSubMenuActive(child) ? '3px solid #EB0A1E' : '3px solid transparent',
                  '&:hover': {
                    backgroundColor: isSubMenuActive(child) ? '#EB0A1E24' : '#F5F5F5',
                  },
                }}
              >
                <ListItemText
                  primary={t(child.labelKey)}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.8125rem',
                      fontWeight: isSubMenuActive(child) ? 600 : 400,
                      color: isSubMenuActive(child) ? '#EB0A1E' : '#333333',
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}

      {/* Backdrop to close submenu panel */}
      {expandedMenu && (
        <Box
          onClick={() => setExpandedMenu(null)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1099,
          }}
        />
      )}
    </Box>
  );
};

export default Sidebar;
