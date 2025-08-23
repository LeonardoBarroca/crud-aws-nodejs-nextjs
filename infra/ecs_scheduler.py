import os

import boto3


def lambda_handler(event, context):
    ecs = boto3.client('ecs', region_name=os.environ['AWS_REGION'])
    cluster = os.environ['CLUSTER_NAME']
    service = os.environ['SERVICE_NAME']
    desired_count = event.get('desired_count', int(os.environ['DESIRED_COUNT']))
    ecs.update_service(
        cluster=cluster,
        service=service,
        desiredCount=int(desired_count)
    )
    return {"status": "updated", "desired_count": desired_count}

