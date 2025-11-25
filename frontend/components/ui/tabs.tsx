"use client";

import { cn } from "@/lib/utils";
import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

interface TabContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTabs must be used within a Tabs component");
  }
  return context;
};

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

export const Tabs = ({ defaultValue, children, className }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export const TabsList = ({ children, className }: TabsListProps) => {
  return (
    <div
      className={cn(
        "flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg gap-1",
        className
      )}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TabsTrigger = ({
  value,
  children,
  className,
  disabled,
}: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useTabs();

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        "px-4 py-2 rounded-md transition-all text-sm font-medium",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        activeTab === value
          ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300",
        className
      )}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsContent = ({
  value,
  children,
  className,
}: TabsContentProps) => {
  const { activeTab } = useTabs();

  if (activeTab !== value) return null;

  return <div className={cn("mt-4", className)}>{children}</div>;
};
