import React, { useState, useEffect } from "react";
import { Alert, Button, StyleSheet, Switch, Text, View } from "react-native";
import { FileLogger, LogLevel } from "react-native-file-logger";

export const App = () => {
	const [logLevel, setLogLevel] = useState(LogLevel.Debug);
	const [enabled, setEnabled] = useState(true);

	useEffect(() => {
		FileLogger.configure({ logLevel }).then(() => console.log("File-logger configured"));
	}, []);

	const showLogFilePaths = async () => {
		Alert.alert("File paths", (await FileLogger.getLogFilePaths()).join("\n"));
	};

	const changeEnabled = value => {
		if (value) {
			FileLogger.enableConsoleCapture();
		} else {
			FileLogger.disableConsoleCapture();
		}
		setEnabled(value);
	};

	const changeLogLevel = () => {
		const nextLogLevel = (logLevel + 1) % 4;
		FileLogger.setLogLevel(nextLogLevel);
		setLogLevel(nextLogLevel);
	};

	const sendLogFilesByEmail = () => {
		FileLogger.sendLogFilesByEmail({
			to: "john@doe.com",
			subject: "Log files",
			body: "Please find attached the log files from your app",
		});
	};

	const deleteLogFiles = async () => {
		FileLogger.deleteLogFiles();
		Alert.alert("Log files deleted");
	};

	return (
		<View style={styles.container}>
			<View style={styles.buttonContainer}>
				<View style={styles.button}>
					<Button title="Log info" onPress={() => console.log("Log info", { nested: { data: 123 } })} />
				</View>
				<View style={styles.button}>
					<Button title="Log warning" onPress={() => console.warn("Log warning", { nested: { data: 456 } })} />
				</View>
				<View style={styles.button}>
					<Button title="Change log level" onPress={changeLogLevel} />
				</View>
				<View style={styles.button}>
					<Button title="Show file paths" onPress={showLogFilePaths} />
				</View>
				<View style={styles.button}>
					<Button title="Send files by email" onPress={sendLogFilesByEmail} />
				</View>
				<View style={styles.button}>
					<Button title="Delete files" onPress={deleteLogFiles} />
				</View>
			</View>
			<View style={styles.settingsRow}>
				<Text style={styles.settingsLabel}>Enabled</Text>
				<Switch value={enabled} onValueChange={changeEnabled} />
			</View>
			<View style={styles.settingsRow}>
				<Text style={styles.settingsLabel}>Log Level</Text>
				<Text style={styles.settingsValue}>{LogLevel[logLevel]}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 25,
		backgroundColor: "#f5fcff",
	},
	buttonContainer: {
		flex: 1,
		justifyContent: "center",
	},
	button: {
		marginVertical: 6,
	},
	settingsRow: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		marginBottom: 20,
		minHeight: 50,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#dff4ff",
		borderRadius: 6,
	},
	settingsLabel: {
		flex: 1,
		fontWeight: "500",
		color: "black",
	},
	settingsValue: {
		color: "black",
	},
});
