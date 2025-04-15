import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Switch, Text, View } from "react-native";
import { FileLogger, LogLevel } from "react-native-file-logger";

export const App = () => {
	const [logLevel, setLogLevel] = useState(LogLevel.Debug);
	const [enabled, setEnabled] = useState(true);

	useEffect(() => {
		FileLogger.configure({ logLevel: LogLevel.Debug }).then(() => console.log("File-logger configured"));
	}, []);

	const showLogFilePaths = async () => {
		Alert.alert("File paths", (await FileLogger.getLogFilePaths()).join("\n"));
	};

	const changeEnabled = (value: boolean) => {
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

	const massiveLogging = () => {
		const logHugeAmountOfData = () => {
			for (let i = 0; i < 50000; i++) {
				FileLogger.debug(
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.\
      Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar. Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus sapien eros vitae ligula. Pellentesque rhoncus nunc et augue. Integer id felis. Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus, convallis id, congue eu, quam. Mauris ullamcorper felis vitae erat. Proin feugiat, augue non elementum posuere, metus purus iaculis lectus, et tristique ligula justo vitae magna.\
      Aliquam convallis sollicitudin purus. Praesent aliquam, enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus. Fusce vulputate sem at sapien. Vivamus leo. Aliquam euismod libero eu enim. Nulla nec felis sed leo placerat imperdiet. Aenean suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla tincidunt tincidunt mi. Curabitur iaculis, lorem vel rhoncus faucibus, felis magna fermentum augue, et ultricies lacus lorem varius purus. Curabitur eu amet."
				);
			}
		};
		Alert.alert(
			"Massive log",
			"This will log large amounts of data to test your maximum file size configuration. Your phone may freeze during the operation.",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Continue", onPress: logHugeAmountOfData, style: "destructive" },
			],
			{ cancelable: true }
		);
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
					<Button title="Log error" onPress={() => console.error("Log error", { nested: { data: 789 } })} />
				</View>
				<View style={styles.button}>
					<Button title="Log large data" onPress={() => massiveLogging()} />
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
