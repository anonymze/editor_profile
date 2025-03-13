import Purchases, { CustomerInfo, PurchasesOfferings } from "react-native-purchases";
import { Text, View } from "react-native";
import React from "react";


export default function PurchaseList() {
	const [offerings, setOfferings] = React.useState<PurchasesOfferings | null>(null);
	const [customerInfo, setCustomerInfo] = React.useState<CustomerInfo | null>(null);

	React.useEffect(() => {
		const fetchOfferings = async () => {
			const offerings = await Purchases.getOfferings();
			const customerInfo = await Purchases.getCustomerInfo();
			setOfferings(offerings);
			setCustomerInfo(customerInfo);
		};
		fetchOfferings();
	}, []);

	return (
		<View>
			<View style={{ margin: 10 }}>
				<Text>CUSTOMER</Text>
				<Text>APP USER ID : {customerInfo?.originalAppUserId}</Text>
				<Text>ACTIVE SUBSCRIPTIONS : {customerInfo?.activeSubscriptions.toString()}</Text>
				<Text>
					PURCHASES ENTITLEMENTS :{" "}
					{customerInfo ? JSON.stringify(customerInfo.entitlements.active) : "NO CUSTOMER INFO"}
				</Text>
				<Text>MANAGEMENT URL : {customerInfo?.managementURL}</Text>
				<Text>APPLICATION VERSION : {customerInfo?.originalAppUserId}</Text>
				<Text>
					IS USER SUBSCRIBED TO THIS ENTLITED entl14442e31e1 ?{" "}
					{customerInfo?.entitlements?.active["entl14442e31e1"]?.isActive ? "YES" : "NO"}
				</Text>
			</View>
			<View style={{ margin: 10 }}>
				<Text>OFFERINGS</Text>
				<Text>MOTNHLY : {offerings?.current?.monthly?.identifier}</Text>
				<Text>PACKAGES CURRENT : </Text>
				{offerings?.current?.availablePackages.map((pack) => (
					<Text key={pack.identifier}>{pack.identifier}</Text>
				))}
				<Text>PACKAGES ALL : </Text>
				{offerings?.all
					? Object.keys(offerings?.all).map((key) => (
							<View key={key}>
								<Text>{key}</Text>
								<Text>{offerings?.all[key]?.identifier}</Text>
							</View>
					  ))
					: null}
			</View>
		</View>
	);
}
