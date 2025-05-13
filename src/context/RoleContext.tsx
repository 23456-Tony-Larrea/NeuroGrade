import React, { createContext, useContext, useState } from 'react';
import { Role, Permission, defaultPermissions } from '../types/roles';

interface RoleContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  permissions: Permission[];
  updatePermission: (permissionId: string, enabled: boolean) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>('student');
  const [rolePermissions, setRolePermissions] = useState(defaultPermissions);

  const permissions = rolePermissions[currentRole];

  const updatePermission = (permissionId: string, enabled: boolean) => {
    setRolePermissions(prev => ({
      ...prev,
      [currentRole]: prev[currentRole].map(permission =>
        permission.id === permissionId ? { ...permission, enabled } : permission
      )
    }));
  };

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, permissions, updatePermission }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}