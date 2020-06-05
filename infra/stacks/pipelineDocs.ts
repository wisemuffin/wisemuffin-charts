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

export class PipelineDocs extends CDK.Stack {
  constructor(scope: CDK.App, id: string, props: PipelineProps) {
    super(scope, id, props);

    const domainNameDocs = "docs." + props.route53.domainName;

    // Amazon S3 bucket to store CRA website
    const bucketWebsite = new S3.Bucket(this, "Files", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      bucketName: domainNameDocs
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

    // AWS CodePipeline stage to build CRA website and CDK resources
    pipeline.addStage({
      stageName: "Build",
      actions: [
        // AWS CodePipeline action to run CodeBuild project
        new CodePipelineAction.CodeBuildAction({
          actionName: "Website",
          project: new CodeBuild.PipelineProject(this, "BuildWebsite", {
            buildSpec: CodeBuild.BuildSpec.fromSourceFilename(
              "./infra/buildspecDocs.yml"
            ),
            environment: { computeType: CodeBuild.ComputeType.SMALL }
          }),

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
