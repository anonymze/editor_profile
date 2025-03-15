import { createContext, useContext, useState } from "react";
import { CustomerInfo } from "react-native-purchases";


type CustomerContextType = {
	customer: CustomerInfo | null;
	setCustomer: (customer: CustomerInfo | null) => void;
};

const CustomerContext = createContext<CustomerContextType>({
	customer: null,
	setCustomer: (customer) => customer,
});

const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
	const [customer, setCustomer] = useState<CustomerInfo | null>(null);

	return (
		<CustomerContext.Provider
			value={{
				customer,
				setCustomer,
			}}
		>
			{children}
		</CustomerContext.Provider>
	);
};

const useCustomer = () => {
	const context = useContext(CustomerContext);
	
	if (!context) {
		throw new Error("useCustomer must be used within a CustomerProvider");
	}
	
	return context;
};

export { CustomerProvider, useCustomer };