#!/bin/bash
# Serves WeekPlanner locally and exposes it via ngrok static domain.
# Reuses the static domain from spend-less-bot.

set -e
cd "$(dirname "$0")"

PORT=8080
DOMAIN="anastacia-inobservant-penicillately.ngrok-free.app"
PUBLIC_URL="https://${DOMAIN}"

echo "📦 Starting static file server on port $PORT..."
python3 -m http.server $PORT &
SERVER_PID=$!

sleep 1

echo "🌐 Starting ngrok tunnel → $PUBLIC_URL"
ngrok http $PORT --domain=$DOMAIN > /tmp/ngrok-planner.log 2>&1 &
NGROK_PID=$!

sleep 2

echo ""
echo "✅ WeekPlanner live at: $PUBLIC_URL"
echo "   Open: $PUBLIC_URL/index.html"
echo ""
echo "🔴 Press Ctrl+C to stop"

# Clean up both processes on exit
trap "kill $SERVER_PID $NGROK_PID 2>/dev/null" EXIT

wait $SERVER_PID
