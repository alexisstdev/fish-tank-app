import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { Thermometer, Droplet } from "lucide-react";

interface SensorCardProps {
	temperature: string;
	humidity: string;
}

export function SensorCard({ temperature, humidity }: SensorCardProps) {
	return (
		<div className="grid grid-cols-2 gap-6">
			<Card className="pb-4">
				<CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
					<h4 className="text-large font-medium">Temperatura</h4>
				</CardHeader>
				<CardBody className="overflow-visible py-2 flex items-center justify-center gap-4">
					<Thermometer className="h-10 w-10 text-red-500" />
					<span className="text-3xl ml-2 font-medium">{temperature}</span>
				</CardBody>
			</Card>
			<Card className="pb-4">
				<CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
					<h4 className="text-large font-medium">Humedad</h4>
				</CardHeader>
				<CardBody className="overflow-visible py-2 flex items-center justify-center gap-4">
					<Droplet className="h-10 w-10 text-blue-500" />
					<span className="text-3xl ml-2 font-medium">{humidity}</span>
				</CardBody>
			</Card>
		</div>
	);
}
