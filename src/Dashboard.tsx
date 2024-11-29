import { Image } from "@nextui-org/react";
import { useState, useEffect } from "react";
import FeederProgress from "./FeederProgress";
import { SensorCard } from "./SensorCard";
import History from "./History";

export const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
	// const [luzEncendida, setLuzEncendida] = useState(false);
	const [tiempoAlimentacion, setTiempoAlimentacion] = useState(30);
	const [updateHistory, setUpdateHistory] = useState(0);

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

	/* 	const toggleLuz = async () => {
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
			setUpdateHistory((prev) => prev + 1); // Update history
		} catch (error) {
			console.error(error);
		}
	};
 */
	const alimentar = async () => {
		setTiempoAlimentacion(30);

		try {
			await fetch(`${API_URL}/feedingHistory`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fedAt: new Date(),
				}),
			});

			const esp32Url = "http://10.22.0.103/api/alimentar";

			const datos = {
				mensaje: "alimentar",
			};

			fetch(esp32Url, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams(datos).toString(),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log("Respuesta del ESP32:", data);
				})
				.catch((error) => {
					console.error("Error al hacer la solicitud:", error);
				});

			setUpdateHistory((prev) => prev + 1);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="max-w-md mx-auto h-screen bg-[#ffe6dd]">
			<div className="flex justify-between items-center p-4">
				<div className="flex items-center gap-2">
					<h1 className="text-4xl font-medium">Pulpicera</h1>
				</div>
			</div>

			<Image src="/image.gif" />

			<div className="px-4 mb-6 mt-10">
				<h2 className="text-2xl font-medium mb-3">Sensor</h2>
				<SensorCard />
			</div>

			<div className="px-4 mb-6 mt-10">
				<h2 className="text-2xl font-medium mb-3">Alimentador</h2>
				<FeederProgress progress={tiempoAlimentacion} feedNow={alimentar} />
			</div>

			{/* <div className="px-4 mb-6 mt-10">
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
			</div> */}
			<History update={updateHistory} />
		</div>
	);
}
