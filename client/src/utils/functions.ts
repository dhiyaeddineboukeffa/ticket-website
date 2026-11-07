export function deepEqual(a: any, b: any): boolean {
    // Handle primitive types (including NaN)
    if (a === b) return true;
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
  
    // Check if both are objects and not null
    const aIsObject = a !== null && typeof a === 'object';
    const bIsObject = b !== null && typeof b === 'object';
    if (!aIsObject || !bIsObject) return false;
  
    // Handle Array comparison
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => deepEqual(item, b[index]));
    }
  
    // Handle Date comparison
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }
  
    // Handle RegExp comparison
    if (a instanceof RegExp && b instanceof RegExp) {
      return a.toString() === b.toString();
    }
  
    // Handle other object types
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    
    if (aKeys.length !== bKeys.length) return false;
    
    return aKeys.every(key => {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      return deepEqual(a[key], b[key]);
    });
  }
  
  