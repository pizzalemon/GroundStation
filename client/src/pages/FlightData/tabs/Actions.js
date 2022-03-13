import React, { useState, useEffect, useRef } from "react"
import { Button, Box, Label, Slider, Dropdown } from "components/UIElements"
import { Row, Column } from "components/Containers"
import regexParse from "regex-parser"
import { red } from "../../../theme/Colors"
import { httpget, httppost } from "../../../backend"

const actions = {
	waypoint: [0, 1, 2, 3, 4]
}

const Actions = () => {
	const [Aarmed, setAarmed] = useState("")

	const updateData = () => {
		httpget("/uav/stats")
			.then(data => {
				console.log(data)
				setAarmed(data.data.result.armed)
			})
	}

	useEffect(() => {
		const tick = setInterval(() => {
			updateData()
		}, 250)
		return () => clearInterval(tick)
	})

	const inputBox = useRef(null)

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "calc(100vh - 9.5rem)",
			}}
		>
			<Column>
				<Row id="labels1" height="2rem" gap="0.5rem">
					<Label columns={1}>Flight Modes</Label>
				</Row>
			</Column>

			<Column style={{ marginBottom: "1rem" }}>
				<Row>
					<Button onClick={() => httppost("/uav/mode/set", {"mode": "MANUAL"})}>MANUAL</Button>
					<Button onClick={() => httppost("/uav/mode/set", {"mode": "AUTO"})}>AUTO</Button>
					<Button onClick={() => httppost("/uav/mode/set", {"mode": "TAKEOFF"})}>TAKEOFF</Button>
					<Button onClick={() => httppost("/uav/commands/insert", {"command": "LAND", "lat": 38.14469, "lon": -76.42799, alt: 6.6})}>LAND</Button>
				</Row>
				<Row>
					<Button onClick={() => httppost("/uav/mode/set", {"mode": "LOITER"})}>LOITER</Button>
					<Button onClick={() => httppost("/uav/mode/set", {"mode": "CIRCLE"})}>CIRCLE</Button>
					<Button onClick={() => httppost("/uav/mode/set", {"mode": "STABILIZE"})}>STABILIZE</Button>
					<Button onClick={() => httppost("/uav/mode/set", {"mode": "RTL"})}>RTL</Button>
				</Row>
			</Column>

			<Column>
				<Row id="labels2" height="2rem" gap="0.5rem">
					<Label columns={1}>Waypoints</Label>
				</Row>
			</Column>
			<Column style={{ marginBottom: "1rem" }}>
				<Row>
					<Row>
						<Box
							ref={inputBox}
							content=""
							onChange={v => {
								let value = v
								let newvalue = ""
								if (value.length > 3) {
									value = v.substring(0, 3)
								}
								console.log(value)
								if (value.length >= 1) {
									for (let i = 0; i < value.length; i++) {
										let ascii = value.charCodeAt(i)
										if (ascii >= 48 && ascii <= 57) {
											newvalue += value[i]
										}
									}
								}
								return newvalue
							}}
							onKeyDown={e => {
								if (e.nativeEvent.key === "Enter") e.preventDefault()
								e.stopPropagation()
							}}
							placeholder="#"
							style={{ textAlign: "center" }}
							line="430%"
							editable
						/>
						<Button onClick={() => httppost("/uav/commands/jump", {"command": inputBox})}>GO!</Button>
					</Row>
					<Button onClick={() => httppost("/uav/commands/jump", {"command": 1})}>WAYPOINTS (#1)</Button>
					<Button onClick={() => httppost("/uav/commands/jump", {"command": 20})}>ODLC (#20)</Button>
					<Button onClick={() => httppost("/uav/commands/jump", {"command": 50})}>MAP (#50)</Button>
				</Row>
			</Column>

			<Column>
				<Row id="labels3" height="2rem" gap="0.5rem">
					<Label columns={1}>Mission</Label>
				</Row>
			</Column>
			<Column style={{ marginBottom: "1rem" }}>
				<Row>
					<Button>START</Button>
					<Button>RESTART</Button>
					<Button color={red}>ABORT LANDING</Button>
				</Row>
			</Column>

			<Column>
				<Row id="labels4" height="2rem" gap="0.5rem">
					<Label columns={1}>Configuration</Label>
				</Row>
			</Column>
			<Column style={{ marginBottom: "1rem" }}>
				<Row>
					<Button color={red}>SET HOME ALT</Button>
					<Button color={red}>CALIBRATION</Button>
					<Button color={red} onClick={() => httppost((Aarmed ? "/uav/disarm" : "/uav/arm"), {"command": inputBox.value})}>{Aarmed ? "DISARM" : "ARM"}</Button>
					<Button color={red}>RESTART</Button>
				</Row>
			</Column>
			<Box label="" content="LEVEL" />
		</div>
	)
}

export default Actions
