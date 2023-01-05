from constructs import Construct
from aws_cdk import (
    Stack,
    Environment,
    aws_codecommit as codecommit,
    pipelines as pipelines,
    aws_secretsmanager as secretsmanager,
)
from .dropdesk_infra_deploy_stage_fe import DropdeskPipelineStageFE

class DropdeskPipelineStackFE(Stack):
    def __init__(self, scope: Construct, id: str, env: Environment, **kwargs) -> None:
        super().__init__(scope, id, env=env, **kwargs)

        docker_secrets = secretsmanager.Secret.from_secret_name_v2(self, 'Docker-Secret', "dev/cred/docker")

        repo = codecommit.Repository.from_repository_name(self, id='frontend-repo', repository_name='frontend')

        pipeline = pipelines.CodePipeline(
            self,
            "Pipeline",
            docker_credentials=[pipelines.DockerCredential.docker_hub(docker_secrets, secret_username_field="dockeruser", secret_password_field="dockerpass")],
            synth=pipelines.ShellStep(
                "Synth",
                input=pipelines.CodePipelineSource.code_commit(repo, "cdk-main"),
                commands=[
                    "npm install -g aws-cdk",  # Installs the cdk cli on Codebuild
                    "pip install -r requirements.txt",  # Instructs Codebuild to install required packages
                    "cdk synth",
                ]
            ),
        )

        deploy = DropdeskPipelineStageFE(self, "Deploy", env=env)
        deploy_stage = pipeline.add_stage(deploy)
        #t
