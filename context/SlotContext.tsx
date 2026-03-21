import React, { createContext, useState } from "react";

export const SlotContext = createContext<any>(null);

export default function SlotProvider({ children }: any) {
  const [slot, setSlot] = useState(null);

  return (
    <SlotContext.Provider value={{ slot, setSlot }}>
      {children}
    </SlotContext.Provider>
  );
}