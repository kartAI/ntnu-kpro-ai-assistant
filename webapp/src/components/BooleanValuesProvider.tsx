import React, { createContext, useContext, useState, useEffect } from 'react';

type BooleanValuesContextType = {
  hasInputPickAddress: boolean;
  setHasInputPickAddress: (value: boolean) => void;
  hasInputCadaidWidget: boolean;
  setHasInputCadaidWidget: (value: boolean) => void;
  hasInputDigitalTiltaksdataWidget: boolean;
  setHasInputDigitalTiltaksdataWidget: (value: boolean) => void;
  hasInputThreeDVisningWidget: boolean;
  setHasInputThreeDVisningWidget: (value: boolean) => void;
};

const BooleanValuesContext = createContext<BooleanValuesContextType | undefined>(undefined);

export const BooleanValuesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasInputPickAddress, setHasInputPickAddress] = useState(false);
  const [hasInputCadaidWidget, setHasInputCadaidWidget] = useState(false);
  const [hasInputDigitalTiltaksdataWidget, setHasInputDigitalTiltaksdataWidget] = useState(false);
  const [hasInputThreeDVisningWidget, setHasInputThreeDVisningWidget] = useState(false);

  return (
    <BooleanValuesContext.Provider value={{
      hasInputPickAddress,
      setHasInputPickAddress,
      hasInputCadaidWidget,
      setHasInputCadaidWidget,
      hasInputDigitalTiltaksdataWidget,
      setHasInputDigitalTiltaksdataWidget,
      hasInputThreeDVisningWidget,
      setHasInputThreeDVisningWidget,
    }}>
      {children}
    </BooleanValuesContext.Provider>
  );
};

export const useBooleanValuesContext = () => {
  const context = useContext(BooleanValuesContext);
  if (!context) {
    throw new Error("useBooleanValuesContext must be used within BooleanValuesProvider");
  }
  return context;
};
