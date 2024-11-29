import { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from "@nextui-org/react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";
import { API_URL } from "./Dashboard";

interface SensorData {
	id: number;
	temperature: string;
	humidity: string;
	createdAt: string;
}

interface FeedingHistory {
	id: number;
	fedAt: string;
}

interface LightHistory {
	id: number;
	state: boolean;
	changedAt: string;
}

interface HistoryProps {
	update: number;
}

export default function History({ update }: HistoryProps) {
	const [sensorData, setSensorData] = useState<SensorData[]>([]);
	const [feedingHistory, setFeedingHistory] = useState<FeedingHistory[]>([]);
	const [lightHistory, setLightHistory] = useState<LightHistory[]>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`${API_URL}/latestData`);
				const data = await response.json();

				if (data.latestSensorData) {
					setSensorData(data.latestSensorData);
				}
				if (data.latestFeedingHistory) {
					setFeedingHistory(data.latestFeedingHistory);
				}
				if (data.latestLightHistory) {
					setLightHistory(data.latestLightHistory);
				}
			} catch (error) {
				console.error("Error fetching latest data:", error);
			}
		};

		fetchData();
	}, [update]);

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		};
		return new Date(dateString).toLocaleString("es-ES", options);
	};

	const sensorChartData = sensorData.map((data) => ({
		createdAt: formatDate(data.createdAt),
		temperature: Number.parseFloat(data.temperature),
		humidity: Number.parseFloat(data.humidity),
	}));

	const feedingColumns = [{ key: "fedAt", label: "Hora de Alimentación" }];

	const lightColumns = [
		{ key: "state", label: "Estado" },
		{ key: "changedAt", label: "Hora de Cambio" },
	];

	return (
		<div className="grid grid-cols-1 gap-6">
			<Card>
				<CardHeader>Datos del Sensor</CardHeader>
				<CardBody>
					<LineChart
						width={500}
						height={300}
						data={sensorChartData}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="createdAt" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="temperature" stroke="#ff0000" />
						<Line type="monotone" dataKey="humidity" stroke="#0000ff" />
					</LineChart>
				</CardBody>
			</Card>

			<Card>
				<CardHeader>Historial de Alimentación</CardHeader>
				<CardBody>
					<Table aria-label="Tabla de Historial de Alimentación">
						<TableHeader>
							{feedingColumns.map((column) => (
								<TableColumn key={column.key}>{column.label}</TableColumn>
							))}
						</TableHeader>
						<TableBody>
							{feedingHistory.map((history) => (
								<TableRow key={history.id}>
									{(columnKey) => (
										<TableCell>
											{columnKey === "fedAt"
												? formatDate(history.fedAt)
												: history[columnKey as keyof FeedingHistory]}
										</TableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardBody>
			</Card>

			<Card>
				<CardHeader>Historial de Luz</CardHeader>
				<CardBody>
					<Table aria-label="Tabla de Historial de Luz">
						<TableHeader>
							{lightColumns.map((column) => (
								<TableColumn key={column.key}>{column.label}</TableColumn>
							))}
						</TableHeader>
						<TableBody>
							{lightHistory.map((history) => (
								<TableRow key={history.id}>
									{(columnKey) => (
										<TableCell>
											{columnKey === "state"
												? history.state
													? "Encendido"
													: "Apagado"
												: columnKey === "changedAt"
													? formatDate(history.changedAt)
													: history[columnKey as keyof LightHistory]}
										</TableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardBody>
			</Card>
		</div>
	);
}
