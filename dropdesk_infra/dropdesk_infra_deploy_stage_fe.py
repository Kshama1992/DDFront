from constructs import Construct
from aws_cdk import(
    Stage,
    Environment,
)
from .dropdesk_infra_stack_fe import DropdeskInfraStackFE

class DropdeskPipelineStageFE(Stage):
    def __init__(self, scope: Construct, id: str, env: Environment, **kwargs):
        super().__init__(scope, id, env=env, **kwargs)
        service = DropdeskInfraStackFE(self, 'DropDeskFeInfra', env, **kwargs)
