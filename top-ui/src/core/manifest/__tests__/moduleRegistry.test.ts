// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { moduleRegistry, getSidebarItems, getRouteConfigs, validateRouteIntegrity } from '../moduleRegistry';

describe('moduleRegistry', () => {
  it('should contain all registered modules', () => {
    expect(moduleRegistry.length).toBeGreaterThan(0);
    // Verify essential modules exist
    const moduleIds = moduleRegistry.map((m) => m.id);
    expect(moduleIds).toContain('dashboard');
    expect(moduleIds).toContain('activity-setup');
  });

  it('every module should have required fields', () => {
    moduleRegistry.forEach((mod) => {
      expect(mod.id).toBeTruthy();
      expect(mod.path).toBeDefined();
      expect(mod.labelKey).toBeTruthy();
      expect(mod.icon).toBeTruthy();
    });
  });

  it('every child route should have a component path', () => {
    moduleRegistry.forEach((mod) => {
      if (mod.children) {
        mod.children.forEach((child) => {
          expect(child.component).toBeTruthy();
          expect(child.id).toBeTruthy();
          expect(child.labelKey).toBeTruthy();
        });
      }
    });
  });

  it('should not have duplicate module IDs', () => {
    const ids = moduleRegistry.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should not have duplicate child route IDs', () => {
    const allChildIds: string[] = [];
    moduleRegistry.forEach((mod) => {
      if (mod.children) {
        mod.children.forEach((child) => {
          allChildIds.push(child.id);
        });
      }
    });
    const uniqueIds = new Set(allChildIds);
    expect(uniqueIds.size).toBe(allChildIds.length);
  });
});

describe('getSidebarItems', () => {
  it('should return only modules with showInSidebar=true', () => {
    const items = getSidebarItems();
    expect(items.length).toBeGreaterThan(0);
    // Demo module has showInSidebar: false, should not appear
    const itemIds = items.map((i) => i.id);
    expect(itemIds).not.toContain('demo');
    // Dashboard should appear
    expect(itemIds).toContain('dashboard');
  });

  it('should include children only with showInSidebar=true', () => {
    const items = getSidebarItems();
    const activitySetup = items.find((i) => i.id === 'activity-setup');
    expect(activitySetup).toBeDefined();
    expect(activitySetup?.children).toBeDefined();
    // Only children with showInSidebar should be included
    activitySetup?.children?.forEach((child) => {
      // Verify all returned children are actually showInSidebar:true in registry
      const mod = moduleRegistry.find((m) => m.id === 'activity-setup');
      const sourceChild = mod?.children?.find((c) => c.id === child.id);
      expect(sourceChild?.showInSidebar).toBe(true);
    });
  });
});

describe('getRouteConfigs', () => {
  it('should return flat route list from all modules with children', () => {
    const routes = getRouteConfigs();
    expect(routes.length).toBeGreaterThan(0);
    // Each route should have path and component
    routes.forEach((route) => {
      expect(route.path).toBeDefined();
      expect(route.component).toBeTruthy();
    });
  });

  it('should include permissions from parent module', () => {
    const routes = getRouteConfigs();
    const customerRoute = routes.find((r) => r.path === 'customer-data-check');
    expect(customerRoute?.permission).toBe('CUSTOMER_VIEW');
  });
});

describe('validateRouteIntegrity', () => {
  it('should return empty array when all sidebar items have matching routes', () => {
    const missingRoutes = validateRouteIntegrity();
    // All sidebar-visible items should have corresponding route entries
    expect(missingRoutes).toEqual([]);
  });
});
