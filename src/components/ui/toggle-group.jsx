import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * ToggleGroup customizado sem dependência do Radix UI
 * Implementação nativa para Base44
 */
const ToggleGroupContext = React.createContext({
  value: "",
  onValueChange: () => {},
  type: "single",
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  type = "single",
  value,
  onValueChange,
  ...props 
}, ref) => {
  const [internalValue, setInternalValue] = React.useState(type === "multiple" ? [] : "");
  
  const currentValue = value !== undefined ? value : internalValue;
  
  const handleValueChange = React.useCallback((itemValue) => {
    if (type === "multiple") {
      const newValue = Array.isArray(currentValue) ? currentValue : [];
      const updatedValue = newValue.includes(itemValue)
        ? newValue.filter(v => v !== itemValue)
        : [...newValue, itemValue];
      
      if (value === undefined) setInternalValue(updatedValue);
      if (onValueChange) onValueChange(updatedValue);
    } else {
      const newValue = currentValue === itemValue ? "" : itemValue;
      if (value === undefined) setInternalValue(newValue);
      if (onValueChange) onValueChange(newValue);
    }
  }, [currentValue, type, value, onValueChange]);

  return (
    <ToggleGroupContext.Provider value={{ 
      value: currentValue, 
      onValueChange: handleValueChange,
      type,
      size, 
      variant 
    }}>
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md gap-1",
          className
        )}
        role="group"
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
})

ToggleGroup.displayName = "ToggleGroup"

const ToggleGroupItem = React.forwardRef(({ 
  className, 
  children, 
  variant, 
  size, 
  value: itemValue,
  disabled,
  ...props 
}, ref) => {
  const context = React.useContext(ToggleGroupContext)
  
  const isSelected = context.type === "multiple"
    ? Array.isArray(context.value) && context.value.includes(itemValue)
    : context.value === itemValue;

  const handleClick = () => {
    if (!disabled) {
      context.onValueChange(itemValue);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      role={context.type === "single" ? "radio" : "checkbox"}
      aria-checked={isSelected}
      data-state={isSelected ? "on" : "off"}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "hover:bg-muted hover:text-muted-foreground",
        {
          "h-10 px-3": (size || context.size) === "default",
          "h-9 px-2.5": (size || context.size) === "sm",
          "h-11 px-5": (size || context.size) === "lg",
        },
        isSelected && "bg-accent text-accent-foreground",
        !isSelected && "bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }