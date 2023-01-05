from aws_cdk import (
    # Duration,
    Stack,
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_ecs_patterns as ecs_patterns,
    Duration,
    aws_ssm as ssm,
    aws_elasticloadbalancingv2 as ec2_lb,
    aws_route53 as route53,
    Environment,
    # aws_sqs as sqs,
)

from aws_cdk.aws_elasticloadbalancingv2 import (
    Protocol
)

from constructs import Construct

class DropdeskInfraStackFE(Stack):

    def __init__(self, scope: Construct, construct_id: str, env: Environment, **kwargs) -> None:
        super().__init__(scope, construct_id, env = env, **kwargs)

        infra_name = 'dd-infra'
        environment_name = 'dev'
        component_name = 'fe'

        nomenclature = f'{infra_name}-{environment_name}-{component_name}'

        # create the backend VPC
        frontend_vpc = ec2.Vpc(self, f'{nomenclature}-vpc', max_azs=2)  # use all availability zones

        # create the backend cluster
        frontend_cluster = ecs.Cluster(self, f'{nomenclature}-cluster', vpc=frontend_vpc)

        # # setup environment
        # environment = {
        #     "NODE_OPTIONS":ssm.StringParameter.from_string_parameter_name(self, 'dev_node_options', "/api/dev/node_options").string_value,
        #     "NODE_ENV": ssm.StringParameter.from_string_parameter_name(self, 'dev_node_env', "/api/dev/node_env").string_value,
        #     #NODE_ENV=production
        #     "APP_PORT": ssm.StringParameter.from_string_parameter_name(self, 'dev_app_port', '/api/dev/app_port').string_value,
        #     "APP_MAX_UPLOAD_SIZE": ssm.StringParameter.from_string_parameter_name(self, 'dev_app_max_upload_size', '/api/dev/app_max_upload_size').string_value,
        #     "APP_API_URL_PREFIX": "",
        #     "APP_CACHE_TIME": ssm.StringParameter.from_string_parameter_name(self, 'dev_app_cache_time', '/api/dev/app_cache_time').string_value,

        #     "REDIS_PORT": ssm.StringParameter.from_string_parameter_name(self, 'dev_redis_port', '/api/dev/redis_port').string_value,
        #     "REDIS_HOST": ssm.StringParameter.from_string_parameter_name(self, 'dev_redis_host', '/api/dev/redis_host').string_value,

        #     "POSTGRES_HOST": ssm.StringParameter.from_string_parameter_name(self, 'dev_postgres_host', "/api/dev/postgres_host").string_value,
        #     "POSTGRES_PORT": ssm.StringParameter.from_string_parameter_name(self, 'dev_postgres_port', '/api/dev/postgres_port').string_value,
        #     "POSTGRES_DB": ssm.StringParameter.from_string_parameter_name(self, 'dev_postgres_db', '/api/dev/postgres_db').string_value,
        #     "POSTGRES_USER": ssm.StringParameter.from_string_parameter_name(self, 'dev_postgres_user', '/api/dev/postgres_user').string_value,
        #     "POSTGRES_PASSWORD": ssm.StringParameter.from_string_parameter_name(self, 'dev_postgres_pass', "/api/dev/postgres_pass").string_value,
        #     "POSTGRES_ENCODING": ssm.StringParameter.from_string_parameter_name(self, 'dev_postgres_encoding', '/api/dev/postgres_encoding').string_value,
        #     "POSTGRES_MULTIPLE_DATABASES": ssm.StringParameter.from_string_parameter_name(self, 'dev_postgres_multiple_databases', '/api/dev/postgres_multiple_databases').string_value,
        #     "PGADMIN_DEFAULT_PASSWORD": ssm.StringParameter.from_string_parameter_name(self, 'dev_pgadmin_default_password', '/api/dev/pgadmin_default_password').string_value,
        #     "PGADMIN_DEFAULT_EMAIL": ssm.StringParameter.from_string_parameter_name(self, 'dev_pgadmin_default_email', '/api/dev/pgadmin_default_email').string_value,

        #     "STRIPE_WEBHOOK_SECRET": ssm.StringParameter.from_string_parameter_name(self, 'dev_stripe_webhook_secret', '/api/dev/stripe_webhook_secret').string_value,
        #     "STRIPE_PUBLISH_KEY": ssm.StringParameter.from_string_parameter_name(self, 'dev_stripe_publish_key', '/api/dev/stripe_publish_key').string_value,
        #     "STRIPE_SECRET_KEY": ssm.StringParameter.from_string_parameter_name(self, 'dev_stripe_secret_key', '/api/dev/stripe_secret_key').string_value,
        #     "STRIPE_API_VERSION": ssm.StringParameter.from_string_parameter_name(self, 'dev_stripe_api_version', '/api/dev/stripe_api_version').string_value,

        #     "TWILIO_SID": ssm.StringParameter.from_string_parameter_name(self, 'dev_twilio_sid', '/api/dev/twilio_sid').string_value,
        #     "TWILIO_SECRET": ssm.StringParameter.from_string_parameter_name(self, 'dev_twilio_secret', '/api/dev/twilio_secret').string_value,
        #     "TWILIO_FROM": ssm.StringParameter.from_string_parameter_name(self, 'dev_twilio_from', '/api/dev/twilio_from').string_value,
        #     "TWILIO_DEVELOPERS_PHONES": ssm.StringParameter.from_string_parameter_name(self, 'dev_twilio_developers_phones', '/api/dev/twilio_developers_phones').string_value,

        #     "MAILGUN_API_KEY": ssm.StringParameter.from_string_parameter_name(self, 'dev_mailgun_api_key', '/api/dev/mailgun_api_key').string_value,
        #     "MAILGUN_DOMAIN": ssm.StringParameter.from_string_parameter_name(self, 'dev_mailgun_domain', '/api/dev/mailgun_domain').string_value,

        #     "PRIVATE_KEY_PASSPHRASE": ssm.StringParameter.from_string_parameter_name(self, 'dev_private_key_passphrase', '/api/dev/private_key_passphrase').string_value,
        #     "REFRESH_TOKEN_PASSPHRASE": ssm.StringParameter.from_string_parameter_name(self, 'dev_refresh_token_passphrase', '/api/dev/refresh_token_passphrase').string_value,
        #     "TOKEN_EXPIRE": ssm.StringParameter.from_string_parameter_name(self, 'dev_token_expire', '/api/dev/token_expire').string_value,
        #     "COOKIE_TOKEN_PREFIX": ssm.StringParameter.from_string_parameter_name(self, 'dev_cookie_token_prefix', '/api/dev/cookie_token_prefix').string_value,

        #     "S3_BUCKET_NAME": ssm.StringParameter.from_string_parameter_name(self, 'dev_s3_bucket_name', '/api/dev/s3_bucket_name').string_value,
        #     "DOMAIN": ssm.StringParameter.from_string_parameter_name(self, 'dev_domain', '/api/dev/domain').string_value,
        #     "API_DOMAIN": ssm.StringParameter.from_string_parameter_name(self, 'dev_api_domain', '/api/dev/api_domain').string_value,
        #     "DEFAULT_BRAND_NAME": ssm.StringParameter.from_string_parameter_name(self, 'dev_default_brand_name', '/api/dev/default_brand_name').string_value,
        #     "DEFAULT_ROLE_NAME": ssm.StringParameter.from_string_parameter_name(self, 'dev_default_role_name', '/api/dev/default_role_name').string_value,

        #     "MEDIA_URL": ssm.StringParameter.from_string_parameter_name(self, 'dev_media_url', '/api/dev/media_url').string_value,
        # }
        # create the service
        service = ecs_patterns.ApplicationLoadBalancedFargateService(self, f'{nomenclature}-fargate-service', cluster=frontend_cluster,
                                                                     cpu=1024, desired_count=2,
                                                                     protocol=ec2_lb.ApplicationProtocol.HTTPS,
                                                                     domain_name="dev-2.dropdesk.net",
                                                                     domain_zone=route53.HostedZone.from_hosted_zone_attributes(self, f'{nomenclature}-hosted-zone', hosted_zone_id='Z09726532UVYNL7SSKLJ5', zone_name='dropdesk.net'),
                                                                     redirect_http=True,
                                                                     task_image_options=ecs_patterns.ApplicationLoadBalancedTaskImageOptions(image=ecs.ContainerImage.from_asset('.', file='Dockerfile', exclude=["cdk.out", ".vscode", ".venv", "node_modules", "app.py", "cdk.json", "requirements-dev.txt", "requirements.txt", "source.bat", "dropdesk_infra", "tests"]), container_port=3000),
                                                                     memory_limit_mib=4096, public_load_balancer=True,health_check_grace_period=Duration.seconds(120))
        # configure health checks
        service.target_group.configure_health_check(path='/', port='3000', healthy_http_codes='200', interval=Duration.seconds(120), timeout=Duration.seconds(10), protocol=Protocol.HTTP)

        # configure autoscale task count
        scalable_task_count = service.service.auto_scale_task_count(min_capacity=2, max_capacity=4)

        # autoscale on cpu utilization
        scalable_task_count.scale_on_cpu_utilization(f'{nomenclature}-cpu-autoscale', target_utilization_percent=70, scale_in_cooldown=Duration.seconds(60), scale_out_cooldown=Duration.seconds(60))

        # autoscale on mem utilization
        scalable_task_count.scale_on_memory_utilization(f'{nomenclature}-mem-autoscale', target_utilization_percent=80, scale_in_cooldown=Duration.seconds(60), scale_out_cooldown=Duration.seconds(60))

