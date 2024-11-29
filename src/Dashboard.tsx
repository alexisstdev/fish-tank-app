import { Card, Image } from "@nextui-org/react";
import { Power } from "lucide-react";
import { useState, useEffect } from "react";
import FeederProgress from "./FeederProgress";
import { SensorCard } from "./SensorCard";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
	const [luzEncendida, setLuzEncendida] = useState(false);
	const [tiempoAlimentacion, setTiempoAlimentacion] = useState(30);
	const [sensorData, setSensorData] = useState({
		temperature: "0°C",
		humidity: "0%",
	});

	useEffect(() => {
		const interval = setInterval(() => {
			if (tiempoAlimentacion > 0) {
				setTiempoAlimentacion(tiempoAlimentacion - 1);
			} else {
				alimentar();
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [tiempoAlimentacion]);

	useEffect(() => {
		const fetchSensorData = async () => {
			const response = await fetch(`${API_URL}/sensorData`);
			const data = await response.json();
			setSensorData(data);
		};

		fetchSensorData();
	}, []);

	const toggleLuz = async () => {
		const newState = !luzEncendida;
		setLuzEncendida(newState);

		try {
			await fetch(`${API_URL}/lightHistory`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					state: newState,
				}),
			});
		} catch (error) {
			console.error(error);
		}
	};

	const alimentar = async () => {
		setTiempoAlimentacion(30);

		await fetch(`${API_URL}/feedingHistory`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				fedAt: new Date(),
			}),
		});
	};

	return (
		<div className="max-w-md mx-auto h-screen bg-[#ffe6dd]">
			<div className="flex justify-between items-center p-4">
				<div className="flex items-center gap-2">
					<h1 className="text-4xl font-medium">Pecera</h1>
				</div>
			</div>

			<Image src="/image.gif" />

			<div className="px-4 mb-6 mt-10">
				<h2 className="text-2xl font-medium mb-3">Sensores</h2>
				<SensorCard
					humidity={sensorData.humidity}
					temperature={sensorData.temperature}
				/>
			</div>

			<div className="px-4 mb-6 mt-10">
				<h2 className="text-2xl font-medium mb-3">Alimentador</h2>
				<FeederProgress progress={tiempoAlimentacion} feedNow={alimentar} />
			</div>

			<div className="px-4 mb-6 mt-10">
				<h2 className="text-2xl font-medium mb-3">Luz</h2>
				<Card
					className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-colors ${luzEncendida ? "bg-yellow-400" : "bg-gray-400"}`}
				>
					<div className="flex items-center justify-between px-4">
						<Power className="inline-block mr-2 h-6 w-6" />
						<button
							type="button"
							onClick={toggleLuz}
							className="flex-1 text-center"
						>
							{luzEncendida ? "Apagar Luz" : "Encender Luz"}
						</button>
					</div>
				</Card>
			</div>
		</div>
	);
}
