import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FileLogger } from "react-native-file-logger";

export class App extends React.Component<{}> {
	state = {
		status: "starting",
		message: "--",
	};
	componentDidMount() {
		FileLogger.configure();
	}
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>☆FileLogger example☆</Text>
				<Text style={styles.instructions}>STATUS: {this.state.status}</Text>
				<Text style={styles.welcome}>☆NATIVE CALLBACK MESSAGE☆</Text>
				<Text style={styles.instructions}>{this.state.message}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5FCFF",
	},
	welcome: {
		fontSize: 20,
		textAlign: "center",
		margin: 10,
	},
	instructions: {
		textAlign: "center",
		color: "#333333",
		marginBottom: 5,
	},
});
