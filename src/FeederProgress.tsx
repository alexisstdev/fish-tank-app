import { Button, Card, CardBody, CircularProgress } from "@nextui-org/react";

export default function FeederProgress({
	progress,
	feedNow,
}: { progress: number; feedNow: () => void }) {
	return (
		<Card className="border-none bg-white text-blue-600 shadow-lg">
			<CardBody className="flex flex-col items-center justify-center p-6">
				<CircularProgress
					classNames={{
						svg: "w-44 h-44 drop-shadow-md",
						indicator: "stroke-blue-600",
						track: "stroke-blue-600/10",
						value: "text-3xl font-semibold text-white text-blue-600",
					}}
					value={progress}
					strokeWidth={2}
					formatOptions={{ style: "unit", unit: "second" }}
					showValueLabel={true}
				/>
				<Button
					color="primary"
					variant="solid"
					size="lg"
					className="mt-6"
					onClick={feedNow}
				>
					Alimentar ahora
				</Button>
			</CardBody>
		</Card>
	);
}
