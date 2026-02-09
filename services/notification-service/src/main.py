import asyncio
import json
import os
from typing import Dict

import uvicorn
from dapr.ext.fastapi import DaprApp
from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Notification Service", description="Handles task notifications")
dapr_app = DaprApp(app)


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "notification-service"}


@dapr_app.subscribe(pubsub='kafka-pubsub', topic='task-events')
def handle_task_event(event_data: dict) -> None:
    """Handle incoming task events from Kafka for notifications"""
    print(f"Notification Service received event: {event_data}")

    try:
        event_type = event_data.get('event_type', '')
        user_id = event_data.get('user_id', '')
        task_id = event_data.get('task_id', '')
        task_title = event_data.get('task_data', {}).get('title', '')

        # Send notification based on event type
        if event_type == 'completed':
            print(f"Sending notification: Task '{task_title}' (ID: {task_id}) completed by user {user_id}")
            # In a real implementation, this would send an email or push notification
        elif event_type == 'created':
            print(f"Sending notification: Task '{task_title}' (ID: {task_id}) created by user {user_id}")
        elif event_type == 'updated':
            print(f"Sending notification: Task '{task_title}' (ID: {task_id}) updated by user {user_id}")
        elif event_type == 'deleted':
            print(f"Sending notification: Task '{task_title}' (ID: {task_id}) deleted by user {user_id}")

    except Exception as e:
        print(f"Error processing notification event: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)