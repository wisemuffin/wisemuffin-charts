import * as CDK from "@aws-cdk/core";
import * as CodeBuild from "@aws-cdk/aws-codebuild";
import * as S3 from "@aws-cdk/aws-s3";
import * as CodePipeline from "@aws-cdk/aws-codepipeline";
import * as CodePipelineAction from "@aws-cdk/aws-codepipeline-actions";
import * as ssm from "@aws-cdk/aws-ssm";
import * as route53 from "@aws-cdk/aws-route53";
import * as route53targets from "@aws-cdk/aws-route53-targets";

export interface PipelineProps extends CDK.StackProps {
  github: {
    owner: string;
    repository: string;
  };
  route53: {
    recordName: string;
    domainName: string;
  };
}

export class Pipeline extends CDK.Stack {
  constructor(scope: CDK.App, id: string, props: PipelineProps) {
    super(scope, id, props);

    // Amazon S3 bucket to store CRA website
    const bucketWebsite = new S3.Bucket(this, "Files", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      bucketName: props.route53.domainName
    });

    // route53
    const zone = route53.HostedZone.fromLookup(this, "Zone", {
      domainName: props.route53.domainName
    });

    new route53.ARecord(this, "AliasRecord", {
      zone,
      recordName: props.route53.domainName,
      target: route53.RecordTarget.fromAlias(
        new route53targets.BucketWebsiteTarget(bucketWebsite)
      )
    });

    // AWS CodeBuild artifacts
    const outputSources = new CodePipeline.Artifact();
    const outputWebsite = new CodePipeline.Artifact();

    // AWS CodePipeline pipeline
    const pipeline = new CodePipeline.Pipeline(this, "Pipeline", {
      restartExecutionOnUpdate: true
    });

    // AWS CodePipeline stage to clone sources from GitHub repository
    pipeline.addStage({
      stageName: "Source",
      actions: [
        new CodePipelineAction.GitHubSourceAction({
          actionName: "Checkout",
          owner: props.github.owner,
          repo: props.github.repository,
          oauthToken: CDK.SecretValue.secretsManager("awsCDKGitHubToken"),
          output: outputSources,
          trigger: CodePipelineAction.GitHubTrigger.WEBHOOK
        })
      ]
    });

    // Retrieve the latest value of the non-secret parameter
    // with name "/My/String/Parameter".
    const WISE_REACT_APP_MAPBOX_TOKEN = ssm.StringParameter.fromStringParameterAttributes(
      this,
      "MyValue",
      {
        parameterName: "WISE_REACT_APP_MAPBOX_TOKEN"
        // 'version' can be specified but is optional.
      }
    ).stringValue;

    // AWS CodePipeline stage to build CRA website and CDK resources
    pipeline.addStage({
      stageName: "Build",
      actions: [
        // AWS CodePipeline action to run CodeBuild project
        new CodePipelineAction.CodeBuildAction({
          actionName: "Website",
          project: new CodeBuild.PipelineProject(
            this,
            "BuildWebsiteWisemuffinTemp",
            {
              buildSpec: CodeBuild.BuildSpec.fromSourceFilename(
                "./infra/buildspec.yml"
              ),
              environment: { computeType: CodeBuild.ComputeType.MEDIUM }
            }
          ),

          input: outputSources,
          outputs: [outputWebsite]
        })
      ]
    });

    // AWS CodePipeline stage to deployt CRA website and CDK resources
    pipeline.addStage({
      stageName: "Deploy",
      actions: [
        // AWS CodePipeline action to deploy CRA website to S3
        new CodePipelineAction.S3DeployAction({
          actionName: "Website",
          input: outputWebsite,
          bucket: bucketWebsite
        })
      ]
    });

    new CDK.CfnOutput(this, "WebsiteURL", {
      value: bucketWebsite.bucketWebsiteUrl,
      description: "Website URL"
    });
  }
}
