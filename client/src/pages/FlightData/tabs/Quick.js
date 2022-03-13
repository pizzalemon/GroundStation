import React, { useState, useEffect } from "react"
import { Box, Label } from "components/UIElements"
import { Row, Column } from "components/Containers"

import styled from "styled-components"
import { ReactComponent as RawUGV } from "icons/ugv.svg"
import { ReactComponent as RawUAV } from "icons/plane.svg"

const Quick = () => {
	const [Aaltitude, setAaltitude] = useState(0)
	const [Athrottle, setAthrottle] = useState(0)
	const [Aorientation, setAorientation] = useState({ "yaw": 0, "pitch": 0, "roll": 0 })
	const [AlatLong, setAlatLong] = useState({ "lat": 0, "lon": 0 })
	const [Amode, setAmode] = useState("")
	const [Aarmed, setAarmed] = useState("")
	const [Astatus, setAstatus] = useState("")
	const [AgroundSpeed, setAgroundSpeed] = useState(0)
	const [Aairspeed, setAairspeed] = useState(0)
	const [Abattery, setAbattery] = useState(16)
	// const [Atemperature, setAtemperature] = useState([25, 25, 25, 25])
	const [Awaypoint, setAwaypoint] = useState([1, 0])
	const [Aconnection, setAconnection] = useState([95, 0, 95])

	const [Gcurrent, setGcurrent] = useState("")
	const [Gnext, setGnext] = useState("")
	const [Gwaypoint, setGwaypoint] = useState(0)
	const [Gyaw, setGyaw] = useState(0)
	const [GlatLong, setGlatLong] = useState({ "lat": 0, "lon": 0 })
	const [GgroundSpeed, setGgroundSpeed] = useState(0)
	const [Gconnection, setGconnection] = useState([95, 0, 95])

	const updateData = () => {
		fetch("http://localhost:5000/uav/stats")
			.then(response => response.json())
			.then(data => {
				setAaltitude(data.result.quick.altitude)
				setAthrottle(data.result.quick.throttle)
				setAorientation({"yaw": data.result.quick.orientation.yaw, "roll": data.result.quick.orientation.roll, "pitch": data.result.quick.orientation.pitch })
				setAlatLong({"lat": data.result.quick.lat, "lon": data.result.quick.lon})
				setAmode(data.result.mode)
				setAarmed(data.result.armed)
				setAstatus(data.result.status)
				setAgroundSpeed(data.result.quick.ground_speed)
				setAairspeed(data.result.quick.air_speed)
				setAbattery(data.result.quick.battery)
				// setAtemperature(data.result.quick.temperature)
				setAwaypoint(data.result.quick.waypoint)
				setAconnection(data.result.quick.connection)
			})
		fetch("http://localhost:5000/ugv/stats")
			.then(response => response.json())
			.then(data => {
				setGcurrent(data.result.quick.states[0])
				setGnext(data.result.quick.states[1])
				setGwaypoint(data.result.quick.states[2])
				setGyaw(data.result.quick.yaw)
				setGlatLong({"lat": data.result.quick.lat, "lon": data.result.quick.lon})
				setGgroundSpeed(data.result.quick.ground_speed)
				setGconnection(data.result.quick.connection)
			})
	}

	useEffect(() => {
		const tick = setInterval(() => {
			updateData()
		}, 250)
		return () => clearInterval(tick)
	})

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "calc(100vh - 9.5rem)",
			}}
		>
			<StyledDiv>
				<Label className="paragraph" style={{ "font-size": "2em", color: "black" }}>Plane {Aarmed ? "(ARMED)" : ""}</Label>
				<UAV />
			</StyledDiv>
			<Column style={{ marginBottom: "1rem", gap: "0.5rem" }}>
				<Row style={{ gap: "1rem" }}>
					<Row>
						<Box label="Altitude" content={Aaltitude.toFixed(2) + " ft"} />
						<Box label="Throttle" content={Athrottle ? Athrottle.toFixed(2) + " %" : 0} />
						<Box label="Roll" content={(Aorientation.roll.toFixed(2)) + "\u00B0"} />
						<Box label="Pitch" content={(Aorientation.pitch.toFixed(2)) + "\u00B0"} />
						<Box label="Yaw" content={(Aorientation.yaw.toFixed(2))  + "\u00B0"} />
					</Row>
				</Row>
				<Row style={{ gap: "1rem" }}>
					<Row>
						<Box label="Latitude" content={Math.abs(AlatLong.lat).toFixed(8) + "\u00B0 N"} />
						<Box label="Longitude" content={Math.abs(AlatLong.lon).toFixed(8) + "\u00B0 W"} />
						<Box label="Battery (6S)" content={Abattery.toFixed(2) + "V"} />
					</Row>
				</Row>
				<Row style={{ gap: "1rem" }}>
					<Row>
						<Box label="Ground Speed" content={AgroundSpeed.toFixed(2) + " mph"} />
						<Box label="Airspeed" content={Aairspeed.toFixed(2) + " mph"} />
						<Box label="Status" content={Astatus} />
						<Box label="Mode" content={Amode} />
					</Row>
				</Row>
				<Row style={{ gap: "1rem" }}>
					<Row>
						<Row>
							<Box label="Waypoint #" content={"#" + (Awaypoint[0] + 1).toFixed(0)} />
							<Box label="Distance" content={Awaypoint[1].toFixed(2) + " ft"} />
						</Row>
						<Row>
							<Box label="GPS HDOP" content={Aconnection[0].toFixed(2)} />
							<Box label="GPS VDOP" content={Aconnection[1].toFixed(2)} />
							<Box label="Satellites" content={Aconnection[2].toFixed(0)} />
						</Row>
					</Row>
				</Row>
			</Column>
			<StyledDiv style={{marginTop: "1rem"}}>
				<Label className="paragraph" style={{"font-size": "2em", "color": "black"}}>UGV</Label>
				<UGV />
			</StyledDiv>
			<Column style={{ marginBottom: "1rem", gap: "0.5rem" }}>
				<Row style={{ gap: "1rem" }}>
					<Row>
						<Box label="Current State" content={Gcurrent} />
						<Box label="Next Objective" content={Gnext} />
						<Box label="To Destination" content={Gwaypoint.toFixed(2) + " ft"} />
					</Row>
				</Row>
				<Row style={{ gap: "1rem" }}>
					<Box label="Latitude" content={Math.abs(GlatLong.lat).toFixed(8) + "\u00B0 N"} />
					<Box label="Longitude" content={Math.abs(GlatLong.lon).toFixed(8) + "\u00B0 W"} />
				</Row>
				<Row style={{ gap: "1rem" }}>
					<Row>
						<Box label="Ground Speed" content={GgroundSpeed.toFixed(2) + " mph"} />
						<Box label="Yaw" content={Gyaw + "\u00B0"} />
					</Row>
					<Row>
						<Box label="GPS HDOP" content={Gconnection[0].toFixed(2)} />
						<Box label="GPS VDOP" content={Gconnection[1].toFixed(2)} />
						<Box label="Satellites" content={Gconnection[2].toFixed(0)} />
					</Row>
				</Row>
			</Column>
		</div>
	)
}

const UAV = styled(RawUAV)`
	height: 3em;
	width: 7em;
	margin-right: 0;
	margin-left: auto;
`

const UGV = styled(RawUGV)`
	height: 3em;
	width: 5em;
	margin-right: 0;
	margin-left: auto;
`

const StyledDiv = styled.div`
	display: flex;
	margin-bottom: 1em;
`

export default Quick