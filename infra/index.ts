import * as cdk from "@aws-cdk/core";

import { config } from "../config-cdk";
import { Pipeline } from "./stacks/pipeline";
// import { PipelineDocs } from "./stacks/pipelineDocs";

const app = new cdk.App();

new Pipeline(app, "Wisemuffin-Charts-Pipeline", config);
// new PipelineDocs(app, "Wisemuffin-Charts-Pipeline-Docs", config);

app.synth();
