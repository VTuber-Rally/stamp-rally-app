// express app on 8081

import express from "express";
import bodyParser from "body-parser";

import { InfluxDB, Point } from "@influxdata/influxdb-client";

const token = process.env.INFLUXDB_TOKEN;
const url = "http://t3.luc.ovh:8086";
const client = new InfluxDB({ url, token });

let org = `rally`;
let bucket = `rally`;

let writeClient = client.getWriteApi(org, bucket, "ns");

const app = express();

app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  console.log(req.body);

  let point = new Point("stamps")
    .tag("artist", req.body.artist)
    .intField("stamp", 1);

  writeClient.writePoint(point);

  writeClient.flush();

  res.send("OK");
});

console.log("Listening on 8081");
app.listen(8081);
